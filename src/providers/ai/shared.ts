import { Prompt, type PromptVariables } from '../../conf/Prompt';
import { fetchJson } from '../../libs/fetch';
import {
    createConfigurationState,
    type ProviderConfigurationState,
} from '../ProviderConfiguration';
import { isProxyEnabled } from '../proxy';
import type {
    AICompleteRequest,
    AIKeyValidationResult,
    AIModelDescriptor,
    AIProviderAdapter,
    AIProviderCapabilities,
    AIRequestOptions,
} from './AIProvider';
import { formatAIModelRef } from './AIProvider';

export type BuiltInAIProviderId = 'openai' | 'openrouter' | 'opencode' | 'openai-compatible' | 'deepseek' | 'gemini' | 'anthropic' | 'mistral' | 'glm';

export type AIProviderDefinition = {
    id: BuiltInAIProviderId;
    label: string;
    configKey?: string;
    requiredConfigKeys?: string[];
    defaultModel: string;
    fallbackModels: string[];
    /** URL to the provider's API key management page (shown in UI on validation error). */
    dashboardUrl?: string;
    capabilities?: Omit<AIProviderCapabilities, 'models'>;
    discoverModels: (apiKey: string) => Promise<string[]>;
    complete: (apiKey: string, request: Required<Pick<AICompleteRequest, 'prompt' | 'model'>> & AIRequestOptions) => Promise<string | null>;
    /**
     * Per-provider auth check. When omitted, the default implementation in
     * RuntimeAIProvider calls discoverModels() live (no cache) and treats any
     * thrown error as invalid. Providers whose error format is non-standard or
     * whose models endpoint is public MUST provide their own implementation.
     */
    validateApiKey?: (apiKey: string) => Promise<Omit<AIKeyValidationResult, 'dashboardUrl'>>;
};

export type AIModelCatalog = {
    models: AIModelDescriptor[];
    modelsByProvider: Record<string, AIModelDescriptor[]>;
    capabilitiesByProvider: Record<string, AIProviderCapabilities>;
};

const MODEL_CACHE_PREFIX = 'ai.models.';
const MODEL_CACHE_TTL_MS = 1000 * 60 * 60 * 24;

export const extractProviderError = (err: unknown): string => {
    if (err instanceof Error) return err.message;
    if (err !== null && typeof err === 'object') {
        const e = err as Record<string, unknown>;
        if (e.error && typeof e.error === 'object') {
            const inner = e.error as Record<string, unknown>;
            if (typeof inner.message === 'string') return inner.message;
            if (typeof inner.type === 'string') return inner.type;
        }
        if (typeof e.error === 'string') return e.error;
        if (typeof e.message === 'string') return e.message;
        if (typeof e.detail === 'string') return e.detail;
        if (typeof e.status === 'number') return `HTTP ${e.status}`;
        try { return JSON.stringify(e); } catch { /* fallthrough */ }
    }
    return String(err);
};

export const createBrowserTransportError = (label: string) => {
    const proxyHint = isProxyEnabled()
        ? 'The proxy is enabled but the request still failed - check that the proxy route is reachable.'
        : 'No proxy is enabled. Cross-origin AI requests are blocked by CORS in the browser. Set VITE_PROXY_ENABLED=true and VITE_PROXY_PROVIDER=viteDevProxy to route requests server-side.';
    return new Error(`${label} request failed (CORS). ${proxyHint}`);
};

export const parseTextResponse = (value: unknown): string | null => {
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

const normalizeModels = (provider: BuiltInAIProviderId, label: string, models: string[]): AIModelDescriptor[] => (
    models.map((model) => ({
        id: formatAIModelRef(provider, model),
        provider,
        model,
        label: `${label} / ${model}`,
    }))
);

export const getAIModelCatalog = async (
    registry: Record<string, AIProviderAdapter>,
    forceRefresh = false
): Promise<AIModelCatalog> => {
    const entries = await Promise.all(
        Object.entries(registry).map(async ([providerId, provider]) => [
            providerId,
            await provider.getCapabilities(forceRefresh),
        ] as const)
    );

    const capabilitiesByProvider = entries.reduce<Record<string, AIProviderCapabilities>>((acc, [providerId, capabilities]) => {
        acc[providerId] = capabilities;
        return acc;
    }, {});

    const modelsByProvider = entries.reduce<Record<string, AIModelDescriptor[]>>((acc, [providerId, capabilities]) => {
        acc[providerId] = capabilities.models;
        return acc;
    }, {});

    const seen = new Set<string>();
    const models = entries
        .flatMap(([, capabilities]) => capabilities.models)
        .filter((model) => {
            if (seen.has(model.id)) return false;
            seen.add(model.id);
            return true;
        });

    return {
        models,
        modelsByProvider,
        capabilitiesByProvider,
    };
};

export class RuntimeAIProvider implements AIProviderAdapter {
    id: BuiltInAIProviderId;
    label: string;
    defaultModel: string;
    dashboardUrl?: string;
    private readonly definition: AIProviderDefinition;
    private readonly apiKey: string;

    constructor(definition: AIProviderDefinition, apiKey: string) {
        this.definition = definition;
        this.id = definition.id;
        this.label = definition.label;
        this.defaultModel = definition.defaultModel;
        this.dashboardUrl = definition.dashboardUrl;
        this.apiKey = apiKey;
    }

    isConfigured() {
        return Boolean(this.apiKey);
    }

    getConfigurationState(): ProviderConfigurationState {
        const missingKeys = this.definition.requiredConfigKeys
            ?? (this.definition.configKey ? [`ai.${this.definition.configKey}`] : []);

        return createConfigurationState(
            `AIProvider:${this.id}`,
            this.isConfigured() ? [] : missingKeys
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
            prompt: Prompt.parsePrompt(request.prompt, { ...request.data, ...request } as PromptVariables & AICompleteRequest),
        });
    }

    async validateApiKey(): Promise<AIKeyValidationResult> {
        const dashboardUrl = this.definition.dashboardUrl;
        if (this.definition.validateApiKey) {
            const result = await this.definition.validateApiKey(this.apiKey);
            return { ...result, dashboardUrl };
        }
        // Default: call discoverModels live (bypasses cache); any thrown error = invalid key.
        try {
            await this.definition.discoverModels(this.apiKey);
            return { valid: true, dashboardUrl };
        } catch (err) {
            return { valid: false, error: extractProviderError(err), dashboardUrl };
        }
    }
}
