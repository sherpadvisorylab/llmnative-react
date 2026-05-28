import { Prompt, type PromptVariables } from '../../conf/Prompt';
import { fetchJson } from '../../libs/fetch';
import type { AIConfig } from '../../Config';
import {
    createConfigurationState,
    getMissingKeys,
    type ProviderConfigurationState,
} from '../ProviderConfiguration';
import type {
    AICompleteRequest,
    AIModelDescriptor,
    AIProviderAdapter,
    AIProviderCapabilities,
    AIRequestOptions,
} from './AIProvider';
import { formatAIModelRef } from './AIProvider';

export type { AIProviderAdapter, AIModelDescriptor, AIProviderCapabilities, AIRequestOptions } from './AIProvider';
export { formatAIModelRef, parseAIModelRef } from './AIProvider';

type AIProviderId = 'openai' | 'gemini' | 'anthropic' | 'mistral';

type AIProviderDefinition = {
    id: AIProviderId;
    label: string;
    configKey: keyof AIConfig;
    defaultModel: string;
    fallbackModels: string[];
    capabilities?: Omit<AIProviderCapabilities, 'models'>;
    discoverModels: (apiKey: string) => Promise<string[]>;
    complete: (apiKey: string, request: Required<Pick<AICompleteRequest, 'prompt' | 'model'>> & AIRequestOptions) => Promise<string | null>;
};

const MODEL_CACHE_PREFIX = 'ai.models.';
const MODEL_CACHE_TTL_MS = 1000 * 60 * 60 * 24;

const OPENAI_MODELS_URL = 'https://api.openai.com/v1/models';
const OPENAI_CHAT_URL = 'https://api.openai.com/v1/chat/completions';
const GEMINI_MODELS_URL = 'https://generativelanguage.googleapis.com/v1beta/models';
const GEMINI_CONTENT_URL = 'https://generativelanguage.googleapis.com/v1beta/models';
const ANTHROPIC_MODELS_URL = 'https://api.anthropic.com/v1/models';
const ANTHROPIC_MESSAGES_URL = 'https://api.anthropic.com/v1/messages';
const MISTRAL_MODELS_URL = 'https://api.mistral.ai/v1/models';
const MISTRAL_CHAT_URL = 'https://api.mistral.ai/v1/chat/completions';

const parseTextResponse = (value: unknown): string | null => {
    if (typeof value === 'string') return value;
    if (Array.isArray(value)) {
        const joined = value
            .map((entry) => {
                if (typeof entry === 'string') return entry;
                if (entry && typeof entry === 'object' && 'text' in entry && typeof entry.text === 'string') {
                    return entry.text;
                }
                return '';
            })
            .filter(Boolean)
            .join('\n');
        return joined || null;
    }
    return null;
};

const getCachedModels = (provider: string): AIModelDescriptor[] | null => {
    if (typeof localStorage === 'undefined') return null;

    try {
        const raw = localStorage.getItem(`${MODEL_CACHE_PREFIX}${provider}`);
        if (!raw) return null;
        const cached = JSON.parse(raw) as { fetchedAt?: number; items?: AIModelDescriptor[] };
        if (!cached.fetchedAt || !Array.isArray(cached.items)) return null;
        if (Date.now() - cached.fetchedAt > MODEL_CACHE_TTL_MS) return null;
        return cached.items;
    } catch {
        return null;
    }
};

const setCachedModels = (provider: string, items: AIModelDescriptor[]) => {
    if (typeof localStorage === 'undefined') return;

    try {
        localStorage.setItem(`${MODEL_CACHE_PREFIX}${provider}`, JSON.stringify({
            fetchedAt: Date.now(),
            items,
        }));
    } catch {
        // Ignore quota/storage failures: discovery should still work in-memory.
    }
};

const normalizeModels = (provider: AIProviderId, label: string, models: string[]): AIModelDescriptor[] => (
    models.map((model) => ({
        id: formatAIModelRef(provider, model),
        provider,
        model,
        label: `${label} / ${model}`,
    }))
);

class RuntimeAIProvider implements AIProviderAdapter {
    id: AIProviderId;
    label: string;
    defaultModel: string;
    private readonly definition: AIProviderDefinition;
    private readonly apiKey: string;

    constructor(definition: AIProviderDefinition, apiKey: string) {
        this.definition = definition;
        this.id = definition.id;
        this.label = definition.label;
        this.defaultModel = definition.defaultModel;
        this.apiKey = apiKey;
    }

    isConfigured() {
        return Boolean(this.apiKey);
    }

    getConfigurationState(): ProviderConfigurationState {
        return createConfigurationState(
            `AIProvider:${this.id}`,
            getMissingKeys({} as Record<string, unknown>, [this.definition.configKey], 'ai.')
        );
    }

    async getCapabilities(forceRefresh = false): Promise<AIProviderCapabilities> {
        const cached = !forceRefresh ? getCachedModels(this.id) : null;
        if (cached) {
            return {
                ...this.definition.capabilities,
                models: cached,
            };
        }

        let items = normalizeModels(this.id, this.label, this.definition.fallbackModels);

        try {
            const discovered = await this.definition.discoverModels(this.apiKey);
            if (discovered.length > 0) {
                items = normalizeModels(this.id, this.label, discovered);
            }
        } catch (error) {
            console.warn(`AIProvider:${this.id} model discovery failed`, error);
        }

        setCachedModels(this.id, items);

        return {
            ...this.definition.capabilities,
            models: items,
        };
    }

    complete(request: AICompleteRequest): Promise<string | null> {
        return this.definition.complete(this.apiKey, {
            ...request,
            model: request.model || this.defaultModel,
            prompt: Prompt.parsePrompt(request.prompt, { ...request.data, ...request }),
        });
    }
}

const PROVIDER_DEFINITIONS: Record<AIProviderId, AIProviderDefinition> = {
    openai: {
        id: 'openai',
        label: 'OpenAI',
        configKey: 'openaiApiKey',
        defaultModel: 'gpt-5.2',
        fallbackModels: ['gpt-5.2', 'gpt-5', 'gpt-5-mini', 'gpt-5-nano', 'gpt-4.1', 'gpt-4.1-mini', 'gpt-4.1-nano'],
        capabilities: { supportsTemperature: true },
        discoverModels: async (apiKey) => {
            const response = await fetchJson(OPENAI_MODELS_URL, {
                headers: {
                    Authorization: `Bearer ${apiKey}`,
                },
            });
            return Array.isArray(response?.data)
                ? response.data.map((entry: { id?: string }) => entry.id).filter(Boolean)
                : [];
        },
        complete: async (apiKey, request) => {
            const response = await fetchJson(OPENAI_CHAT_URL, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${apiKey}`,
                },
                body: {
                    model: request.model,
                    messages: [
                        ...(request.role ? [{ role: 'system', content: Prompt.parseRole(request.role, request) }] : []),
                        { role: 'user', content: request.prompt },
                    ],
                    ...(typeof request.temperature === 'number' ? { temperature: request.temperature } : {}),
                },
            });
            return parseTextResponse(response?.choices?.[0]?.message?.content);
        },
    },
    gemini: {
        id: 'gemini',
        label: 'Gemini',
        configKey: 'geminiApiKey',
        defaultModel: 'gemini-2.5-pro',
        fallbackModels: ['gemini-2.5-pro', 'gemini-2.5-flash', 'gemini-2.5-flash-lite'],
        capabilities: { supportsTemperature: true },
        discoverModels: async (apiKey) => {
            const response = await fetchJson(`${GEMINI_MODELS_URL}?key=${apiKey}`);
            return Array.isArray(response?.models)
                ? response.models
                    .map((entry: { name?: string }) => entry.name?.replace(/^models\//, ''))
                    .filter(Boolean)
                : [];
        },
        complete: async (apiKey, request) => {
            const response = await fetchJson(`${GEMINI_CONTENT_URL}/${request.model}:generateContent?key=${apiKey}`, {
                method: 'POST',
                body: {
                    contents: [{ parts: [{ text: request.prompt }] }],
                    ...(request.role ? { systemInstruction: { parts: [{ text: Prompt.parseRole(request.role, request) }] } } : {}),
                    generationConfig: typeof request.temperature === 'number'
                        ? { temperature: request.temperature }
                        : undefined,
                },
            });
            const parts = response?.candidates?.[0]?.content?.parts;
            return Array.isArray(parts)
                ? parts.map((part: { text?: string }) => part.text || '').join('\n').trim() || null
                : null;
        },
    },
    anthropic: {
        id: 'anthropic',
        label: 'Anthropic',
        configKey: 'anthropicApiKey',
        defaultModel: 'claude-sonnet-4-0',
        fallbackModels: ['claude-sonnet-4-0', 'claude-opus-4-1', 'claude-3-7-sonnet-latest'],
        capabilities: { supportsTemperature: true },
        discoverModels: async (apiKey) => {
            const response = await fetchJson(ANTHROPIC_MODELS_URL, {
                headers: {
                    'x-api-key': apiKey,
                    'anthropic-version': '2023-06-01',
                },
            });
            return Array.isArray(response?.data)
                ? response.data.map((entry: { id?: string }) => entry.id).filter(Boolean)
                : [];
        },
        complete: async (apiKey, request) => {
            const response = await fetchJson(ANTHROPIC_MESSAGES_URL, {
                method: 'POST',
                headers: {
                    'x-api-key': apiKey,
                    'anthropic-version': '2023-06-01',
                },
                body: {
                    model: request.model,
                    max_tokens: 4096,
                    ...(request.role ? { system: Prompt.parseRole(request.role, request) } : {}),
                    messages: [{ role: 'user', content: request.prompt }],
                    ...(typeof request.temperature === 'number' ? { temperature: request.temperature } : {}),
                },
            });
            return parseTextResponse(response?.content);
        },
    },
    mistral: {
        id: 'mistral',
        label: 'Mistral',
        configKey: 'mistralApiKey',
        defaultModel: 'mistral-medium-3',
        fallbackModels: ['mistral-medium-3', 'mistral-small-3.1', 'ministral-8b-latest'],
        capabilities: { supportsTemperature: true },
        discoverModels: async (apiKey) => {
            const response = await fetchJson(MISTRAL_MODELS_URL, {
                headers: {
                    Authorization: `Bearer ${apiKey}`,
                },
            });
            return Array.isArray(response?.data)
                ? response.data.map((entry: { id?: string }) => entry.id).filter(Boolean)
                : [];
        },
        complete: async (apiKey, request) => {
            const response = await fetchJson(MISTRAL_CHAT_URL, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${apiKey}`,
                },
                body: {
                    model: request.model,
                    messages: [
                        ...(request.role ? [{ role: 'system', content: Prompt.parseRole(request.role, request) }] : []),
                        { role: 'user', content: request.prompt },
                    ],
                    ...(typeof request.temperature === 'number' ? { temperature: request.temperature } : {}),
                },
            });
            return parseTextResponse(response?.choices?.[0]?.message?.content);
        },
    },
};

export const createBuiltInAIRegistry = (aiConfig?: AIConfig): Record<string, AIProviderAdapter> => {
    if (!aiConfig) return {};
    return (Object.values(PROVIDER_DEFINITIONS) as AIProviderDefinition[]).reduce<Record<string, AIProviderAdapter>>((registry, definition) => {
        const apiKey = typeof aiConfig[definition.configKey] === 'string' ? aiConfig[definition.configKey] as string : '';
        if (apiKey) {
            registry[definition.id] = new RuntimeAIProvider(definition, apiKey);
        }
        return registry;
    }, {});
};
