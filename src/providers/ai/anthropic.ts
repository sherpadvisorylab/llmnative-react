import { fetchJson } from '../../libs/fetch';
import { Prompt } from '../../conf/Prompt';
import { proxyFetch } from '../proxy';
import type { AIProviderDefinition } from './shared';
import type { AIConversationTurn, AICompleteResult, AIToolDefinition } from './AIProvider';

const ANTHROPIC_MODELS_URL = 'https://api.anthropic.com/v1/models';
const ANTHROPIC_MESSAGES_URL = 'https://api.anthropic.com/v1/messages';

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

function parseAnthropicResponse(response: { content?: unknown } | null): AICompleteResult | null {
    const content = response?.content;
    if (!Array.isArray(content)) return null;

    const textParts = content
        .filter((b: Record<string, unknown>) => b?.type === 'text')
        .map((b: Record<string, unknown>) => String(b.text ?? ''));
    const toolUseBlocks = content.filter((b: Record<string, unknown>) => b?.type === 'tool_use');

    if (toolUseBlocks.length > 0) {
        return {
            type: 'tool_calls',
            toolCalls: toolUseBlocks.map((b: Record<string, unknown>) => ({
                id: String(b.id),
                name: String(b.name),
                input: (b.input as Record<string, unknown>) ?? {},
            })),
            text: textParts.length ? textParts.join('\n') : undefined,
        };
    }

    const text = textParts.join('\n');
    return text ? { type: 'text', text } : null;
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
        const attachments = request.attachments ?? [];
        const userContent = attachments.length > 0
            ? [
                ...attachments.map((a) => a.mimeType.startsWith('image/')
                    ? { type: 'image', source: { type: 'base64', media_type: a.mimeType, data: a.base64 } }
                    : { type: 'document', source: { type: 'base64', media_type: a.mimeType, data: a.base64 } }
                ),
                { type: 'text', text: request.prompt },
              ]
            : request.prompt;

        const response = await fetchJson(ANTHROPIC_MESSAGES_URL, {
            method: 'POST',
            headers: {
                'x-api-key': apiKey,
                'anthropic-version': '2023-06-01',
            },
            body: {
                model: request.model,
                max_tokens: 4096,
                ...(request.role ? { system: Prompt.parseRole(request.role, request as unknown as import("../../conf/Prompt").PromptVariables) } : {}),
                messages: [
                    ...(request.history ?? []).map(toAnthropicMessage),
                    // Un prompt vuoto significa "nessun testo nuovo dell'utente in questo
                    // turno" (es. si continua solo perché il turno precedente era un
                    // tool_result) — il turno finale va omesso, non inviato vuoto: Anthropic
                    // richiede ruoli alternati e un tool_result è già un turno "user".
                    ...(request.prompt ? [{ role: 'user', content: userContent }] : []),
                ],
                ...(request.tools?.length ? { tools: request.tools.map(toAnthropicTool) } : {}),
                ...(typeof request.temperature === 'number' ? { temperature: request.temperature } : {}),
            },
            signal: request.signal,
        }, proxyFetch);

        return parseAnthropicResponse(response);
    },
};
