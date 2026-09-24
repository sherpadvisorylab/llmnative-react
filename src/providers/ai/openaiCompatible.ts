import { Prompt } from '../../conf/Prompt';
import { fetchJson } from '../../libs/fetch';
import { proxyFetch } from '../proxy';
import { PromptUtils } from '../../libs/promptUtils';
import { LLM_LOG_ID_HEADER } from '../proxy/logHeader';
import type { AIProviderDefinition, BuiltInAIProviderId, DiscoveredAIModel } from './shared';
import { parseTextResponse, createBrowserTransportError, extractProviderError } from './shared';
import type { AIModelPricing, AIConversationTurn, AICompleteResult, AIToolDefinition } from './AIProvider';

type OpenAICompatibleDefinitionOptions = {
    id: BuiltInAIProviderId;
    label: string;
    description: string;
    configKey: string;
    requiredConfigKeys?: string[];
    defaultModel: string;
    fallbackModels: string[];
    baseUrl: string;
    modelsUrl?: string;
    chatCompletionsUrl?: string;
    dashboardUrl?: string;
    credentialsHint?: string;
    /** Override the default validateApiKey when the models endpoint is public or uses a non-standard error format. */
    validateApiKey?: AIProviderDefinition['validateApiKey'];
    /** Mappa una entry del listing `/models` in una `DiscoveredAIModel`. Default:
     * `mapOpenAICompatibleModelEntry` (solo `id`, nessun prezzo). */
    mapModelEntry?: (entry: unknown) => DiscoveredAIModel | null;
};

const trimTrailingSlash = (value: string) => value.replace(/\/+$/, '');

const PRICE_PER_TOKEN_TO_MILLION = 1_000_000;

const pricePerMillion = (value: unknown): number | undefined => {
    const parsed = typeof value === 'string' ? Number(value) : typeof value === 'number' ? value : Number.NaN;
    if (!Number.isFinite(parsed) || parsed < 0) return undefined;
    return parsed * PRICE_PER_TOKEN_TO_MILLION;
};

/** Entry del listing di un endpoint OpenAI-compatible "puro": solo l'id, nessun prezzo
 * affidabile (la forma del costo cambia da vendor a vendor). */
export const mapOpenAICompatibleModelEntry = (entry: unknown): DiscoveredAIModel | null => {
    if (!entry || typeof entry !== 'object') return null;
    const id = (entry as Record<string, unknown>).id;
    return typeof id === 'string' && id ? id : null;
};

/** Entry del listing OpenRouter (`/models`): `pricing.prompt`/`pricing.completion` sono USD
 * per token, convertiti in USD per 1M token. I router a prezzo variabile riportano `-1`: quel
 * lato viene omesso, mai interpretato come prezzo (né come gratis). */
export const mapOpenRouterModelEntry = (entry: unknown): DiscoveredAIModel | null => {
    if (!entry || typeof entry !== 'object') return null;
    const record = entry as Record<string, unknown>;
    const id = typeof record.id === 'string' ? record.id : undefined;
    if (!id) return null;

    const raw = record.pricing && typeof record.pricing === 'object'
        ? record.pricing as { prompt?: unknown; completion?: unknown }
        : {};

    const input = pricePerMillion(raw.prompt);
    const output = pricePerMillion(raw.completion);
    const pricing: AIModelPricing | undefined = input === undefined && output === undefined
        ? undefined
        : { ...(input !== undefined ? { input } : {}), ...(output !== undefined ? { output } : {}) };

    return pricing ? { model: id, pricing } : { model: id };
};

/** Esportate per riuso da provider "chat completions"-simili ma non costruiti tramite
 * createOpenAICompatibleProviderDefinition (vedi opencode.ts) — stesso wire format OpenAI,
 * niente da reinventare. */
export function toOpenAITool(tool: AIToolDefinition) {
    return { type: 'function' as const, function: { name: tool.name, description: tool.description, parameters: tool.inputSchema } };
}

function safeParseJsonArgs(raw: unknown): Record<string, unknown> {
    if (typeof raw !== 'string') return {};
    try { return JSON.parse(raw) as Record<string, unknown>; } catch { return {}; }
}

/** Un turno assistant con tool_calls diventa `tool_calls` sul messaggio assistant; un turno
 * tool_result diventa un messaggio `role: 'tool'` per ciascun risultato — stessa forma
 * richiesta dall'API Chat Completions (OpenAI e compatibili) per continuare la conversazione
 * dopo una tool call. */
export function toOpenAIMessages(turn: AIConversationTurn): Array<Record<string, unknown>> {
    if (turn.role === 'user') return [{ role: 'user', content: turn.content }];

    if (turn.role === 'assistant') {
        return [{
            role: 'assistant',
            content: turn.content ?? null,
            ...(turn.toolCalls?.length ? {
                tool_calls: turn.toolCalls.map((c) => ({
                    id: c.id,
                    type: 'function',
                    function: { name: c.name, arguments: JSON.stringify(c.input) },
                })),
            } : {}),
        }];
    }

    return turn.results.map((r) => ({
        role: 'tool',
        tool_call_id: r.toolCallId,
        content: typeof r.output === 'string' ? r.output : JSON.stringify(r.output),
    }));
}

export function parseOpenAIResponse(response: { choices?: Array<{ message?: Record<string, unknown> }> } | null): AICompleteResult | null {
    const message = response?.choices?.[0]?.message;
    if (!message) return null;

    const toolCalls = Array.isArray(message.tool_calls) ? message.tool_calls as Array<Record<string, unknown>> : [];
    if (toolCalls.length > 0) {
        const content = typeof message.content === 'string' ? message.content : undefined;
        return {
            type: 'tool_calls',
            toolCalls: toolCalls.map((c) => {
                const fn = (c.function ?? {}) as Record<string, unknown>;
                return { id: String(c.id), name: String(fn.name ?? ''), input: safeParseJsonArgs(fn.arguments) };
            }),
            text: content || undefined,
        };
    }

    const text = parseTextResponse(message.content);
    return text ? { type: 'text', text } : null;
}

export const createOpenAICompatibleProviderDefinition = ({
    id,
    label,
    description,
    configKey,
    requiredConfigKeys,
    defaultModel,
    fallbackModels,
    baseUrl,
    modelsUrl,
    chatCompletionsUrl,
    dashboardUrl,
    credentialsHint,
    validateApiKey: validateApiKeyOverride,
    mapModelEntry = mapOpenAICompatibleModelEntry,
}: OpenAICompatibleDefinitionOptions): AIProviderDefinition => {
    const normalizedBaseUrl = trimTrailingSlash(baseUrl);
    const resolvedModelsUrl = modelsUrl || `${normalizedBaseUrl}/models`;
    const resolvedChatUrl = chatCompletionsUrl || `${normalizedBaseUrl}/chat/completions`;

    const defaultValidateApiKey: AIProviderDefinition['validateApiKey'] = async (apiKey) => {
        try {
            const response = await fetchJson(resolvedModelsUrl, {
                headers: { Authorization: `Bearer ${apiKey}` },
            }, proxyFetch);
            if (response === null) return { valid: false, error: 'Nessuna risposta dal server (CORS o proxy non attivo)' };
            // Some providers (e.g. Mistral) return { message: "Unauthorized" } instead of { error: { message } }
            if (typeof response?.message === 'string' && !Array.isArray(response?.data)) {
                return { valid: false, error: response.message };
            }
            return { valid: true };
        } catch (err) {
            return { valid: false, error: extractProviderError(err) };
        }
    };

    return {
        id,
        label,
        description,
        configKey,
        requiredConfigKeys,
        defaultModel,
        fallbackModels,
        dashboardUrl,
        credentialsHint,
        credentialFields: id === 'openai-compatible'
            ? [
                { key: 'apiKey',  label: 'API Key',  type: 'password' },
                { key: 'baseUrl', label: 'Base URL', type: 'text', placeholder: 'https://api.example.com/v1' },
              ]
            : [{ key: 'apiKey', label: 'API Key', type: 'password' }],
        capabilities: { supportsTemperature: true, supportsVision: true, supportsDocuments: true },
        validateApiKey: validateApiKeyOverride ?? defaultValidateApiKey,
        discoverModels: async (apiKey) => {
            const response = await fetchJson(resolvedModelsUrl, {
                headers: {
                    Authorization: `Bearer ${apiKey}`,
                },
            }, proxyFetch);
            const data: unknown[] = Array.isArray(response?.data) ? response.data : [];
            return data
                .map((entry) => mapModelEntry(entry))
                .filter((entry): entry is DiscoveredAIModel => entry !== null);
        },
        complete: async (apiKey, request) => {
            const attachments = request.attachments ?? [];
            const userContent = attachments.length > 0
                ? attachments.map((a) => {
                    if (a.mimeType.startsWith('image/')) {
                      return { type: 'image_url' as const, image_url: { url: `data:${a.mimeType};base64,${a.base64}` } };
                    }
                    if (PromptUtils.isTextAttachment(a.mimeType)) {
                      return { type: 'text' as const, text: `[File: ${a.name}]\n${PromptUtils.decodeBase64Text(a.base64)}` };
                    }
                    return { type: 'text' as const, text: `[File attached: ${a.name} (${a.mimeType})]` };
                  }).concat({ type: 'text' as const, text: request.prompt })
                : request.prompt;

            const response = await fetchJson(resolvedChatUrl, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${apiKey}`,
                    ...(request.logId ? { [LLM_LOG_ID_HEADER]: request.logId } : {}),
                },
                body: {
                    model: request.model,
                    messages: [
                        ...(request.role ? [{ role: 'system', content: Prompt.parseRole(request.role, request as unknown as import("../../conf/Prompt").PromptVariables) }] : []),
                        ...(request.history ?? []).flatMap(toOpenAIMessages),
                        // Prompt vuoto = nessun testo nuovo dell'utente in questo turno (si
                        // continua solo perché il turno precedente era un tool_result, già
                        // presente in history come messaggi `role: 'tool'`).
                        ...(request.prompt ? [{ role: 'user', content: userContent }] : []),
                    ],
                    ...(request.tools?.length ? { tools: request.tools.map(toOpenAITool) } : {}),
                    ...(typeof request.temperature === 'number' ? { temperature: request.temperature } : {}),
                },
                signal: request.signal,
            }, proxyFetch);

            if (!response) {
                throw createBrowserTransportError(label);
            }

            return parseOpenAIResponse(response);
        },
    };
};
