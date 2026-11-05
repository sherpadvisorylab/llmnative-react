import { fetchJson } from '../../libs/fetch';
import { proxyFetch } from '../proxy';
import type { AIProviderDefinition } from './shared';
import { completeOpenCode, isOpenCodeFreeTierModel } from './opencode';

// OpenCode Go (CR-118): a subscription at a fixed price (from $10 a month, limits in dollars per model on
// 5 hours, a week and a month) to about thirty models, used from any client with its API key. The same
// OpenAI Chat Completions endpoint as Zen under /zen/go, plus a stable session id per conversation
// (`x-opencode-session`: without it Go answers 400 MissingSessionID).

const OPENCODE_GO_MODELS_URL = 'https://opencode.ai/zen/go/v1/models';
const OPENCODE_GO_CHAT_URL = 'https://opencode.ai/zen/go/v1/chat/completions';
export const OPENCODE_GO_SESSION_HEADER = 'x-opencode-session';

const OPENCODE_GO_DEFAULT_MODEL = 'kimi-k3';

/** Ids of the live `/zen/go/v1/models` listing on 2026-11-05, the free ones (OpenCode only) left out. */
const OPENCODE_GO_FALLBACK_MODELS = [
    OPENCODE_GO_DEFAULT_MODEL,
    'kimi-k3.1-pro',
    'glm-5.3',
    'glm-5.3-flash',
    'deepseek-v4.1-flash',
    'deepseek-v4-pro',
    'qwen3.8-max',
    'qwen3.8-flash',
    'minimax-m3',
    'claude-haiku-5-5',
    'gemini-4-argon',
];

const newSessionId = () => (typeof crypto !== 'undefined' && 'randomUUID' in crypto ? crypto.randomUUID() : `s-${Date.now()}-${Math.random().toString(36).slice(2)}`);

export const OPENCODE_GO_PROVIDER_DEFINITION: AIProviderDefinition = {
    id: 'opencode-go',
    label: 'OpenCode Go',
    description: 'OpenCode Go — a monthly subscription to open and frontier coding models, with an API key.',
    configKey: 'openCodeGoApiKey',
    defaultModel: OPENCODE_GO_DEFAULT_MODEL,
    fallbackModels: OPENCODE_GO_FALLBACK_MODELS,
    dashboardUrl: 'https://opencode.ai/go',
    credentialsHint: 'OpenCode Console → subscribe to Go → API key.',
    credentialFields: [{ key: 'apiKey', label: 'API Key', type: 'password' }],
    capabilities: { supportsTemperature: true, supportsVision: true, supportsDocuments: true },
    discoverModels: async (apiKey) => {
        const response = await fetchJson(OPENCODE_GO_MODELS_URL, { headers: { Authorization: `Bearer ${apiKey}` } }, proxyFetch);
        const items: Array<{ id?: string }> = Array.isArray(response?.data) ? response.data : [];
        return items
            .map((entry) => entry.id)
            .filter((value): value is string => typeof value === 'string' && value.length > 0)
            .filter((id) => !isOpenCodeFreeTierModel(id));
    },
    // The conversation keeps its session (logId, the same on every turn); a single request gets one of its own.
    complete: (apiKey, request) => completeOpenCode(OPENCODE_GO_CHAT_URL, 'OpenCode Go', apiKey, request, { [OPENCODE_GO_SESSION_HEADER]: request.logId || newSessionId() }),
};
