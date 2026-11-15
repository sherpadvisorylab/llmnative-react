import { fetchJson } from '../../libs/fetch';
import { Prompt } from '../../conf/Prompt';
import { proxyFetch } from '../proxy/core';
import { PromptUtils } from '../../libs/promptUtils';
import { LLM_LOG_ID_HEADER } from '../proxy/logHeader';
import type { JsonSchema } from '../../libs/jsonSchema';
import type { AIDefinitionCompleteRequest, AIProviderDefinition } from './shared';
import type { AIConversationTurn, AICompleteResult, AIToolDefinition, AIUsage } from './AIProvider';

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

const GEMINI_SCHEMA_KEYWORDS = ['description', 'minItems', 'maxItems', 'minimum', 'maximum', 'format'] as const;

/**
 * A JSON Schema as Gemini's `responseSchema` takes it (CR-132), the OpenAPI subset: types in capitals,
 * `nullable` for a `null` type, enums of strings only, no `additionalProperties`. What it cannot say is
 * still checked by the framework on the answer.
 */
export function toGeminiSchema(schema: JsonSchema): Record<string, unknown> {
    const types = schema.type === undefined ? [] : Array.isArray(schema.type) ? schema.type : [schema.type];
    const nonNull = types.filter((type) => type !== 'null');
    const out: Record<string, unknown> = {};
    if (nonNull[0]) out.type = nonNull[0].toUpperCase();
    if (schema.nullable || nonNull.length < types.length) out.nullable = true;
    for (const keyword of GEMINI_SCHEMA_KEYWORDS) if (schema[keyword] !== undefined) out[keyword] = schema[keyword];
    if (schema.enum && schema.enum.every((option) => typeof option === 'string')) out.enum = schema.enum;
    if (schema.properties) {
        out.properties = Object.fromEntries(Object.entries(schema.properties).map(([key, child]) => [key, toGeminiSchema(child)]));
        if (schema.required?.length) out.required = schema.required;
    }
    if (schema.items) out.items = toGeminiSchema(schema.items);
    return out;
}

/** The tokens of a Gemini answer: the thinking counts as output, as it is billed. */
export function geminiUsage(response: { usageMetadata?: Record<string, unknown> } | null): AIUsage | undefined {
    const usage = response?.usageMetadata;
    if (!usage) return undefined;
    return {
        inputTokens: Number(usage.promptTokenCount) || 0,
        outputTokens: (Number(usage.candidatesTokenCount) || 0) + (Number(usage.thoughtsTokenCount) || 0),
    };
}

export function parseGeminiResponse(response: { candidates?: Array<{ content?: { parts?: unknown[] } }>; usageMetadata?: Record<string, unknown> } | null): AICompleteResult | null {
    const parts = response?.candidates?.[0]?.content?.parts;
    if (!Array.isArray(parts)) return null;
    const usage = geminiUsage(response);

    const textParts = parts
        .filter((p) => typeof (p as Record<string, unknown>)?.text === 'string' && !(p as Record<string, unknown>).thought)
        .map((p) => (p as { text: string }).text);
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
            ...(usage ? { usage } : {}),
        };
    }

    const text = textParts.join('\n').trim();
    return text ? { type: 'text', text, ...(usage ? { usage } : {}) } : null;
}

/** The body of a `generateContent` request: the Gemini API and Vertex AI take the same one. */
export function geminiRequestBody(request: AIDefinitionCompleteRequest): Record<string, unknown> {
    const attachments = request.attachments ?? [];
    // I mimetype testuali (CSV/TXT/JSON/...) vengono decodificati e inseriti come parte
    // `text` invece di `inline_data` — stesso trattamento di anthropic.ts/
    // openaiCompatible.ts (vedi PromptUtils.isTextAttachment), non un'assunzione che
    // l'API Gemini interpreti bene testo semplice passato come dato binario inline.
    const parts = [
        ...attachments.map((a) => PromptUtils.isTextAttachment(a.mimeType)
            ? { text: `[File: ${a.name}]\n${PromptUtils.decodeBase64Text(a.base64)}` }
            : { inline_data: { mime_type: a.mimeType, data: a.base64 } }),
        { text: request.prompt },
    ];
    const generationConfig: Record<string, unknown> = {
        ...(typeof request.temperature === 'number' ? { temperature: request.temperature } : {}),
        ...(request.maxOutputTokens ? { maxOutputTokens: request.maxOutputTokens } : {}),
        // The structured answer with Gemini's own mode (CR-132).
        ...(request.output ? { responseMimeType: 'application/json', responseSchema: toGeminiSchema(request.output.schema as JsonSchema) } : {}),
    };
    return {
        contents: [
            ...(request.history ?? []).map(toGeminiContent),
            // Prompt vuoto = nessun testo nuovo dell'utente (si continua solo perché il turno
            // precedente era un tool_result, già presente in history come turno `role: 'function'`)
            // — niente turno "user" vuoto in coda.
            ...(request.prompt ? [{ role: 'user', parts }] : []),
        ],
        ...(request.role ? { systemInstruction: { parts: [{ text: Prompt.parseRole(request.role, request as unknown as import('../../conf/Prompt').PromptVariables) }] } } : {}),
        ...(request.tools?.length ? { tools: toGeminiTools(request.tools) } : {}),
        ...(Object.keys(generationConfig).length ? { generationConfig } : {}),
    };
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
    structuredOutput: 'native',
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
        const response = await fetchJson(`${GEMINI_CONTENT_URL}/${request.model}:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: request.logId ? { [LLM_LOG_ID_HEADER]: request.logId } : undefined,
            body: geminiRequestBody(request),
            signal: request.signal,
        }, proxyFetch);
        return parseGeminiResponse(response);
    },
};
