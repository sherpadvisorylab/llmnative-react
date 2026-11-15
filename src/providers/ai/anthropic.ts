import { fetchJson } from '../../libs/fetch';
import { Prompt } from '../../conf/Prompt';
import { proxyFetch } from '../proxy/core';
import { PromptUtils } from '../../libs/promptUtils';
import { LLM_LOG_ID_HEADER } from '../proxy/logHeader';
import { anthropicReasoning, withOutputInstructions, type AIDefinitionCompleteRequest, type AIProviderDefinition } from './shared';
import type { AIConversationTurn, AICompleteResult, AIToolDefinition, AIUsage } from './AIProvider';

const ANTHROPIC_MODELS_URL = 'https://api.anthropic.com/v1/models';
const ANTHROPIC_MESSAGES_URL = 'https://api.anthropic.com/v1/messages';

/** The tool a structured answer is asked through (CR-132): the model is made to call it, its input is the answer. */
const ANSWER_TOOL = 'answer';

function toAnthropicTool(tool: AIToolDefinition) {
    return { name: tool.name, description: tool.description, input_schema: tool.inputSchema };
}

/** Un turno assistant con tool_calls diventa content blocks misti testo+tool_use; un turno
 * tool_result diventa un turno "user" con blocchi tool_result — stessa forma richiesta
 * dall'API Messages di Anthropic per continuare una conversazione dopo una tool call. */
function toAnthropicMessage(turn: AIConversationTurn): { role: 'user' | 'assistant'; content: unknown } {
    if (turn.role === 'user') return { role: 'user', content: turn.content };

    if (turn.role === 'assistant') {
        const blocks: unknown[] = [];
        if (turn.content) blocks.push({ type: 'text', text: turn.content });
        for (const call of turn.toolCalls ?? []) {
            blocks.push({ type: 'tool_use', id: call.id, name: call.name, input: call.input });
        }
        return { role: 'assistant', content: blocks };
    }

    return {
        role: 'user',
        content: turn.results.map((r) => ({
            type: 'tool_result',
            tool_use_id: r.toolCallId,
            content: typeof r.output === 'string' ? r.output : JSON.stringify(r.output),
            ...(r.isError ? { is_error: true } : {}),
        })),
    };
}

function anthropicUsage(response: { usage?: Record<string, unknown> } | null): AIUsage | undefined {
    const usage = response?.usage;
    if (!usage) return undefined;
    return { inputTokens: Number(usage.input_tokens) || 0, outputTokens: Number(usage.output_tokens) || 0 };
}

/**
 * The answer of a Messages request (the Anthropic API and Vertex AI give the same one). With `structured`,
 * the input of the answer tool is the answer, as JSON text (CR-132).
 */
export function parseAnthropicResponse(response: { content?: unknown; usage?: Record<string, unknown> } | null, structured = false): AICompleteResult | null {
    const content = response?.content;
    if (!Array.isArray(content)) return null;
    const usage = anthropicUsage(response);

    const textParts = content
        .filter((b: Record<string, unknown>) => b?.type === 'text')
        .map((b: Record<string, unknown>) => String(b.text ?? ''));
    const toolUseBlocks = content.filter((b: Record<string, unknown>) => b?.type === 'tool_use');

    if (structured) {
        const answer = toolUseBlocks.find((b: Record<string, unknown>) => b.name === ANSWER_TOOL);
        if (answer) return { type: 'text', text: JSON.stringify(answer.input ?? null), ...(usage ? { usage } : {}) };
    }

    if (toolUseBlocks.length > 0) {
        return {
            type: 'tool_calls',
            toolCalls: toolUseBlocks.map((b: Record<string, unknown>) => ({
                id: String(b.id),
                name: String(b.name),
                input: (b.input as Record<string, unknown>) ?? {},
            })),
            text: textParts.length ? textParts.join('\n') : undefined,
            ...(usage ? { usage } : {}),
        };
    }

    const text = textParts.join('\n');
    return text ? { type: 'text', text, ...(usage ? { usage } : {}) } : null;
}

/**
 * The body of a Messages request, without the model (Vertex AI puts it in the URL). A structured answer
 * (CR-132) is a forced call of the answer tool; a model that reasons cannot be forced to call a tool, so
 * there the schema goes in the prompt instead. `structured` says which way the answer comes back.
 */
export function anthropicMessagesBody(request: AIDefinitionCompleteRequest): { body: Record<string, unknown>; structured: boolean } {
    const reasoning = anthropicReasoning(request.model, request.reasoning);
    const forced = Boolean(request.output) && !('thinking' in reasoning) && !request.tools?.length;
    const prompt = request.output && !forced ? withOutputInstructions(request.prompt, request.output) : request.prompt;
    const attachments = request.attachments ?? [];
    // Il blocco `document` dell'API Anthropic è documentato per PDF — un CSV/testo
    // mandato lì come base64 non è supportato: i mimetype testuali vengono invece
    // decodificati e inseriti come blocco `text` (stesso trattamento di
    // openaiCompatible.ts/gemini.ts, vedi PromptUtils.isTextAttachment).
    const userContent = attachments.length > 0
        ? [
            ...attachments.map((a) => {
                if (a.mimeType.startsWith('image/')) {
                    return { type: 'image', source: { type: 'base64', media_type: a.mimeType, data: a.base64 } };
                }
                if (PromptUtils.isTextAttachment(a.mimeType)) {
                    return { type: 'text', text: `[File: ${a.name}]\n${PromptUtils.decodeBase64Text(a.base64)}` };
                }
                return { type: 'document', source: { type: 'base64', media_type: a.mimeType, data: a.base64 } };
            }),
            { type: 'text', text: prompt },
          ]
        : prompt;

    const tools = forced && request.output
        ? [{ name: ANSWER_TOOL, description: request.output.description ?? 'The answer, in the required shape.', input_schema: request.output.schema }]
        : request.tools?.length ? request.tools.map(toAnthropicTool) : undefined;

    return {
        structured: forced,
        body: {
            max_tokens: request.maxOutputTokens ?? 4096,
            ...(request.role ? { system: Prompt.parseRole(request.role, request as unknown as import('../../conf/Prompt').PromptVariables) } : {}),
            messages: [
                ...(request.history ?? []).map(toAnthropicMessage),
                // Un prompt vuoto significa "nessun testo nuovo dell'utente in questo
                // turno" (es. si continua solo perché il turno precedente era un
                // tool_result) — il turno finale va omesso, non inviato vuoto: Anthropic
                // richiede ruoli alternati e un tool_result è già un turno "user".
                ...(request.prompt ? [{ role: 'user', content: userContent }] : []),
            ],
            ...(tools ? { tools } : {}),
            ...(forced ? { tool_choice: { type: 'tool', name: ANSWER_TOOL } } : {}),
            ...(typeof request.temperature === 'number' ? { temperature: request.temperature } : {}),
            // How much it reasons (CR-122), on the models that take it.
            ...reasoning,
        },
    };
}

export const ANTHROPIC_PROVIDER_DEFINITION: AIProviderDefinition = {
    id: 'anthropic',
    label: 'Anthropic',
    description: 'Claude models via the Anthropic API.',
    configKey: 'anthropicApiKey',
    defaultModel: 'claude-sonnet-4-0',
    fallbackModels: ['claude-sonnet-4-0', 'claude-opus-4-1', 'claude-3-7-sonnet-latest'],
    dashboardUrl: 'https://console.anthropic.com/settings/keys',
    credentialsHint: 'Anthropic Console → Settings → API Keys → Create Key.',
    credentialFields: [{ key: 'apiKey', label: 'API Key', type: 'password' }],
    capabilities: { supportsTemperature: true, supportsVision: true, supportsDocuments: true },
    structuredOutput: 'native',
    discoverModels: async (apiKey) => {
        const response = await fetchJson(ANTHROPIC_MODELS_URL, {
            headers: {
                'x-api-key': apiKey,
                'anthropic-version': '2023-06-01',
            },
        }, proxyFetch);
        return Array.isArray(response?.data)
            ? response.data.map((entry: { id?: string }) => entry.id).filter(Boolean)
            : [];
    },
    complete: async (apiKey, request) => {
        const { body, structured } = anthropicMessagesBody(request);
        const response = await fetchJson(ANTHROPIC_MESSAGES_URL, {
            method: 'POST',
            headers: {
                'x-api-key': apiKey,
                'anthropic-version': '2023-06-01',
                ...(request.logId ? { [LLM_LOG_ID_HEADER]: request.logId } : {}),
            },
            body: { model: request.model, ...body },
            signal: request.signal,
        }, proxyFetch);

        return parseAnthropicResponse(response, structured);
    },
};
