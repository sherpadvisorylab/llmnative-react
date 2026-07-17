import { Prompt } from '../../conf/Prompt';
import { fetchJson } from '../../libs/fetch';
import { proxyFetch } from '../proxy';
import type { AIProviderDefinition, BuiltInAIProviderId } from './shared';
import { parseTextResponse, createBrowserTransportError, extractProviderError } from './shared';
import type { AIConversationTurn, AICompleteResult, AIToolDefinition } from './AIProvider';

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
};

const trimTrailingSlash = (value: string) => value.replace(/\/+$/, '');

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
            return Array.isArray(response?.data)
                ? response.data.map((entry: { id?: string }) => entry.id).filter(Boolean)
                : [];
        },
        complete: async (apiKey, request) => {
            const attachments = request.attachments ?? [];
            const textMime = /^text\/|^application\/(json|csv|xml|javascript|typescript)/;
            const userContent = attachments.length > 0
                ? attachments.map((a) => {
                    if (a.mimeType.startsWith('image/')) {
                      return { type: 'image_url' as const, image_url: { url: `data:${a.mimeType};base64,${a.base64}` } };
                    }
                    if (textMime.test(a.mimeType)) {
                      const decoded = globalThis.atob(a.base64);
                      return { type: 'text' as const, text: `[File: ${a.name}]\n${decoded}` };
                    }
                    return { type: 'text' as const, text: `[File attached: ${a.name} (${a.mimeType})]` };
                  }).concat({ type: 'text' as const, text: request.prompt })
                : request.prompt;

            const response = await fetchJson(resolvedChatUrl, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${apiKey}`,
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
