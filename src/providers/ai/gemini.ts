import { fetchJson } from '../../libs/fetch';
import { Prompt } from '../../conf/Prompt';
import { proxyFetch } from '../proxy';
import type { AIProviderDefinition } from './shared';
import type { AIConversationTurn, AICompleteResult, AIToolDefinition } from './AIProvider';

const GEMINI_MODELS_URL = 'https://generativelanguage.googleapis.com/v1beta/models';
const GEMINI_CONTENT_URL = 'https://generativelanguage.googleapis.com/v1beta/models';

function toGeminiTools(tools: AIToolDefinition[]) {
    return [{ function_declarations: tools.map((t) => ({ name: t.name, description: t.description, parameters: t.inputSchema })) }];
}

/** Un turno assistant con tool_calls diventa parti `functionCall`; un turno tool_result
 * diventa un turno `role: 'function'` con parti `functionResponse` — stessa forma richiesta
 * dall'API generateContent di Gemini per continuare la conversazione dopo una tool call. */
function toGeminiContent(turn: AIConversationTurn): Record<string, unknown> {
    if (turn.role === 'user') return { role: 'user', parts: [{ text: turn.content }] };

    if (turn.role === 'assistant') {
        const parts: unknown[] = [];
        if (turn.content) parts.push({ text: turn.content });
        for (const call of turn.toolCalls ?? []) parts.push({ functionCall: { name: call.name, args: call.input } });
        return { role: 'model', parts };
    }

    return {
        role: 'function',
        parts: turn.results.map((r) => ({ functionResponse: { name: r.name, response: { result: r.output } } })),
    };
}

function parseGeminiResponse(response: { candidates?: Array<{ content?: { parts?: unknown[] } }> } | null): AICompleteResult | null {
    const parts = response?.candidates?.[0]?.content?.parts;
    if (!Array.isArray(parts)) return null;

    const textParts = parts
        .filter((p): p is { text: string } => typeof (p as Record<string, unknown>)?.text === 'string')
        .map((p) => p.text);
    const functionCalls = parts.filter((p) => (p as Record<string, unknown>)?.functionCall) as Array<{ functionCall: { name: string; args?: Record<string, unknown> } }>;

    if (functionCalls.length > 0) {
        return {
            type: 'tool_calls',
            // Gemini's functionCall has no provider-issued call id (unlike Anthropic's
            // tool_use.id or OpenAI's tool_calls[].id) — `name-index` collides across
            // rounds/turns when the same tool is called again (e.g. a "re-extract from this
            // other URL" tool used twice in one conversation), corrupting the id → activity
            // entry mapping in useAgent.ts. A random id is unique regardless of how many times
            // the same tool is called in the same session.
            toolCalls: functionCalls.map((p) => ({
                id: `${p.functionCall.name}-${crypto.randomUUID()}`,
                name: p.functionCall.name,
                input: p.functionCall.args ?? {},
            })),
            text: textParts.length ? textParts.join('\n').trim() : undefined,
        };
    }

    const text = textParts.join('\n').trim();
    return text ? { type: 'text', text } : null;
}

export const GEMINI_PROVIDER_DEFINITION: AIProviderDefinition = {
    id: 'gemini',
    label: 'Gemini',
    description: 'Google\'s multimodal Gemini model family.',
    configKey: 'geminiApiKey',
    defaultModel: 'gemini-2.5-pro',
    fallbackModels: ['gemini-2.5-pro', 'gemini-2.5-flash', 'gemini-2.5-flash-lite'],
    dashboardUrl: 'https://aistudio.google.com/app/apikey',
    credentialsHint: 'Google AI Studio → Get API key → Create API key.',
    credentialFields: [{ key: 'apiKey', label: 'API Key', type: 'password' }],
    capabilities: { supportsTemperature: true, supportsVision: true, supportsDocuments: true },
    discoverModels: async (apiKey) => {
        const response = await fetchJson(`${GEMINI_MODELS_URL}?key=${apiKey}`, null, proxyFetch);
        return Array.isArray(response?.models)
            ? response.models
                .map((entry: { name?: string }) => entry.name?.replace(/^models\//, ''))
                .filter(Boolean)
            : [];
    },
    validateApiKey: async (apiKey) => {
        try {
            const response = await fetchJson(`${GEMINI_MODELS_URL}?key=${apiKey}`, null, proxyFetch);
            if (response === null) return { valid: false, error: 'Nessuna risposta dal server (CORS o rete)' };
            if (response?.error) {
                const msg = typeof response.error === 'object' && 'message' in response.error
                    ? String(response.error.message)
                    : String(response.error);
                return { valid: false, error: msg };
            }
            return { valid: true };
        } catch (err) {
            const e = err as Record<string, unknown> | null;
            const msg = e?.error && typeof e.error === 'object'
                ? String((e.error as Record<string, unknown>).message ?? err)
                : String(err);
            return { valid: false, error: msg };
        }
    },
    complete: async (apiKey, request) => {
        const attachments = request.attachments ?? [];
        const parts = [
            ...attachments.map((a) => ({ inline_data: { mime_type: a.mimeType, data: a.base64 } })),
            { text: request.prompt },
        ];

        const response = await fetchJson(`${GEMINI_CONTENT_URL}/${request.model}:generateContent?key=${apiKey}`, {
            method: 'POST',
            body: {
                contents: [
                    ...(request.history ?? []).map(toGeminiContent),
                    // Prompt vuoto = nessun testo nuovo dell'utente (si continua solo perché
                    // il turno precedente era un tool_result, già presente in history come
                    // turno `role: 'function'`) — niente turno "user" vuoto in coda.
                    ...(request.prompt ? [{ role: 'user', parts }] : []),
                ],
                ...(request.role ? { systemInstruction: { parts: [{ text: Prompt.parseRole(request.role, request as unknown as import("../../conf/Prompt").PromptVariables) }] } } : {}),
                ...(request.tools?.length ? { tools: toGeminiTools(request.tools) } : {}),
                generationConfig: typeof request.temperature === 'number'
                    ? { temperature: request.temperature }
                    : undefined,
            },
            signal: request.signal,
        }, proxyFetch);
        return parseGeminiResponse(response);
    },
};
