import { Prompt, type PromptVariables } from '../../conf/Prompt';
import { fetchJson } from '../../libs/fetch';
import {
    createConfigurationState,
    type ProviderConfigurationState,
} from '../ProviderConfiguration';
import { isProxyEnabled } from '../proxy/core';
import type { ProviderCredentialField } from '../ProviderDescriptor';
import { extractJson, validateJsonSchema, type JsonSchema } from '../../libs/jsonSchema';
import type {
    AIDataRegion,
    AIStructuredOutput,
    AIStructuredOutputMode,
    AIUsage,
    AICompleteRequest,
    AICompleteResult,
    AIKeyValidationResult,
    AIModelDescriptor,
    AIModelPricing,
    AIProviderAdapter,
    AIProviderCapabilities,
    AIReasoningLevel,
    AIRequestOptions,
} from './AIProvider';
import { AIOutputError, formatAIModelRef } from './AIProvider';
import { withModelsDevPricing } from './modelsDevPricing';

export type BuiltInAIProviderId = 'openai' | 'openrouter' | 'opencode' | 'opencode-go' | 'openai-compatible' | 'deepseek' | 'gemini' | 'anthropic' | 'mistral' | 'glm' | 'cloudflare' | 'groq' | 'vertex';

/** The key of a provider, or what gives it fresh (a token that expires, e.g. Vertex AI): read before each call. */
export type AICredential = string | (() => string | Promise<string>);

/** A discovered model carrying the price its provider listing already reports (OpenRouter,
 * Cloudflare). Models discovered as a bare id get their price from models.dev instead. */
export type DiscoveredAIModel = { model: string; pricing?: AIModelPricing };

export type AIProviderDefinition = {
    id: BuiltInAIProviderId;
    label: string;
    /** One-line description shown in a "connect this provider" UI. */
    description?: string;
    configKey?: string;
    requiredConfigKeys?: string[];
    defaultModel: string;
    fallbackModels: string[];
    /** URL to the provider's API key management page (shown in UI on validation error, and
     * surfaced as ProviderDescriptor.credentialsUrl via toProviderDescriptor()). */
    dashboardUrl?: string;
    /** Credential fields a "connect" UI should collect (defaults to a single apiKey field
     * when omitted — see toProviderDescriptor() in ./index.ts). */
    credentialFields?: ProviderCredentialField[];
    /** Short guidance on where in the dashboard to find the credential. */
    credentialsHint?: string;
    capabilities?: Omit<AIProviderCapabilities, 'models'>;
    /**
     * `native`: `complete` honours `request.output` with the provider's own mode and answers the JSON as text.
     * Absent: the framework instructs the model with the schema in the prompt (CR-132).
     */
    structuredOutput?: AIStructuredOutputMode;
    /** Where the provider processes the data, as its endpoint guarantees (CR-132); absent: `unknown`. */
    dataRegion?: AIDataRegion;
    discoverModels: (apiKey: string) => Promise<Array<string | DiscoveredAIModel>>;
    complete: (
        apiKey: string,
        request: AIDefinitionCompleteRequest,
    ) => Promise<AICompleteResult | null>;
    /**
     * Per-provider auth check. When omitted, the default implementation in
     * RuntimeAIProvider calls discoverModels() live (no cache) and treats any
     * thrown error as invalid. Providers whose error format is non-standard or
     * whose models endpoint is public MUST provide their own implementation.
     */
    validateApiKey?: (apiKey: string) => Promise<Omit<AIKeyValidationResult, 'dashboardUrl'>>;
    /** Where the discovered models are cached; absent: the id. For a provider whose models depend on its connection (Vertex: project and location). */
    cacheKey?: string;
    /** The provider whose prices models.dev lists for these models; absent: the id. */
    pricingProvider?: string;
};

/** What a definition's `complete` receives: the prompt already filled in, the model always set. */
export type AIDefinitionCompleteRequest = Required<Pick<AICompleteRequest, 'prompt' | 'model'>> & AIRequestOptions
    & Pick<AICompleteRequest, 'history' | 'tools' | 'signal' | 'logId' | 'output' | 'maxOutputTokens'>;

/** The prompt that asks the model for an answer that follows `output` (CR-132): the instructed way. */
export function withOutputInstructions(prompt: string, output: AIStructuredOutput): string {
    return [
        prompt,
        '',
        `Answer only with one JSON value that follows this JSON Schema${output.description ? ` (${output.description})` : ''}, with no other text and no code fence:`,
        JSON.stringify(output.schema),
    ].join('\n');
}

/** The text of an answer, for reading a structured answer out of it. */
const answerText = (result: AICompleteResult | null): string => (result?.text ?? '').trim();

const sumUsage = (a?: AIUsage, b?: AIUsage): AIUsage | undefined => (
    a || b ? { inputTokens: (a?.inputTokens ?? 0) + (b?.inputTokens ?? 0), outputTokens: (a?.outputTokens ?? 0) + (b?.outputTokens ?? 0) } : undefined
);

/** The structured answer in a result, or the errors that make it not one. */
function readStructured(result: AICompleteResult | null, schema: JsonSchema): { ok: true; data: unknown } | { ok: false; errors: string[] } {
    const text = answerText(result);
    if (!text) return { ok: false, errors: ['no answer'] };
    const data = extractJson(text);
    if (data === undefined) return { ok: false, errors: ['the answer is not JSON'] };
    const errors = validateJsonSchema(schema, data);
    return errors.length ? { ok: false, errors } : { ok: true, data };
}

export type AIModelCatalog = {
    models: AIModelDescriptor[];
    modelsByProvider: Record<string, AIModelDescriptor[]>;
    capabilitiesByProvider: Record<string, AIProviderCapabilities>;
};

// Bumped whenever discovery output changes shape or content, so stale lists are not served for
// up to a day: v2 added `pricing`, v3 drops OpenCode's free-tier models (unusable via API).
const MODEL_CACHE_PREFIX = 'ai.models.v3.';
const MODEL_CACHE_TTL_MS = 1000 * 60 * 60 * 24;

/** The Claude models that take `output_config.effort`: 4.6 and later (older ones reject it). */
const CLAUDE_EFFORT_MODEL = /claude-(?:fable|mythos|opus|sonnet|haiku)-(?:[5-9]|4-[6-9])(?![0-9])/;
/** Those of them that think only when asked (`thinking: { type: 'adaptive' }`); the later ones by default. */
const CLAUDE_ADAPTIVE_ON_REQUEST = /claude-(?:opus-4-[6-8]|sonnet-4-6)(?![0-9])/;

/** What an Anthropic Messages request carries for a reasoning level (CR-122); nothing for a model that does not take it. */
export function anthropicReasoning(model: string | undefined, level: AIReasoningLevel | undefined): Record<string, unknown> {
    if (!level || !model || !CLAUDE_EFFORT_MODEL.test(model)) return {};
    return {
        output_config: { effort: level },
        ...(CLAUDE_ADAPTIVE_ON_REQUEST.test(model) ? { thinking: { type: 'adaptive' } } : {}),
    };
}

/** The reasoning models of OpenAI (o-series, GPT-5), also behind a router (`openai/gpt-5`). */
const OPENAI_REASONING_MODEL = /(?:^|\/)(?:o[1-9]|gpt-5)/i;

/**
 * What an OpenAI Chat Completions request carries for a reasoning level (CR-122): `reasoning_effort` on the
 * reasoning models of OpenAI (`max` as `high`, their top); OpenRouter `reasoning.effort` on any model, which
 * it maps itself. Nothing otherwise.
 */
export function openAIReasoning(model: string | undefined, level: AIReasoningLevel | undefined, style: 'openai' | 'openrouter' = 'openai'): Record<string, unknown> {
    if (!level || !model) return {};
    const effort = level === 'max' ? 'high' : level;
    if (style === 'openrouter') return { reasoning: { effort } };
    return OPENAI_REASONING_MODEL.test(model) ? { reasoning_effort: effort } : {};
}

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
        // Cloudflare API envelope: { success: false, errors: [{ code, message }] }
        if (Array.isArray(e.errors) && e.errors.length > 0) {
            const first = e.errors[0] as Record<string, unknown> | null;
            if (first && typeof first.message === 'string') return first.message;
        }
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

const normalizeModels = (definition: AIProviderDefinition, models: Array<string | DiscoveredAIModel>): AIModelDescriptor[] => (
    models.map((entry) => {
        const { model, pricing } = typeof entry === 'string' ? { model: entry, pricing: undefined } : entry;
        return {
            id: formatAIModelRef(definition.id, model),
            provider: definition.id,
            model,
            label: `${definition.label} / ${model}`,
            providerLabel: definition.label,
            ...(pricing ? { pricing } : {}),
            dataRegion: definition.dataRegion ?? 'unknown',
            structuredOutput: definition.structuredOutput ?? 'prompted',
        };
    })
);

export const getAIModelCatalog = async (
    registry: Record<string, AIProviderAdapter>,
    forceRefresh = false
): Promise<AIModelCatalog> => {
    // BUG FISSATO: un `Promise.all` senza isolamento per-provider faceva sì che il fallimento
    // di UN SOLO provider (`getCapabilities()` rigettato per un errore imprevisto e non protetto
    // — RuntimeAIProvider.getCapabilities() è già ben schermato per il discovery, ma non copre
    // ogni possibile eccezione sincrona a monte) facesse rigettare l'INTERA funzione — azzerando
    // silenziosamente il catalogo di TUTTI i provider registrati, anche quelli sani, nel
    // chiamante (`useAIModelCatalog.ts` nel consumer CMS, il cui `.catch` non logga nulla).
    // Isolare ogni provider nel proprio try/catch garantisce che un adapter rotto non nasconda
    // mai gli altri, indipendentemente da quanto sia difensiva la SUA implementazione.
    const entries = await Promise.all(
        Object.entries(registry).map(async ([providerId, provider]) => {
            try {
                return [providerId, await provider.getCapabilities(forceRefresh)] as [string, AIProviderCapabilities];
            } catch (error) {
                console.warn(`getAIModelCatalog: provider "${providerId}" getCapabilities() failed`, error);
                return [providerId, { models: [] }] as [string, AIProviderCapabilities];
            }
        })
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
    private readonly apiKey: AICredential;

    constructor(definition: AIProviderDefinition, apiKey: AICredential) {
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

    /** The key to send now: a fixed one, or a fresh one from its source. */
    private key(): Promise<string> {
        return Promise.resolve(typeof this.apiKey === 'function' ? this.apiKey() : this.apiKey);
    }

    private get providerCapabilities(): Omit<AIProviderCapabilities, 'models'> {
        return {
            ...this.definition.capabilities,
            structuredOutput: this.definition.structuredOutput ?? 'prompted',
            dataRegion: this.definition.dataRegion ?? 'unknown',
        };
    }

    async getCapabilities(forceRefresh = false): Promise<AIProviderCapabilities> {
        const cacheKey = this.definition.cacheKey ?? this.id;
        const cached = !forceRefresh ? getCachedModels(cacheKey) : null;
        if (cached) {
            return {
                ...this.providerCapabilities,
                // Lists cached before providerLabel (or the data region, CR-132) existed still read right.
                models: cached.map((model) => ({
                    ...model,
                    providerLabel: model.providerLabel ?? this.label,
                    dataRegion: model.dataRegion ?? this.definition.dataRegion ?? 'unknown',
                    structuredOutput: model.structuredOutput ?? this.definition.structuredOutput ?? 'prompted',
                })),
            };
        }

        let items = normalizeModels(this.definition, this.definition.fallbackModels);

        try {
            const discovered = await this.definition.discoverModels(await this.key());
            if (discovered.length > 0) {
                items = normalizeModels(this.definition, discovered);
            }
        } catch (error) {
            console.warn(`AIProvider:${this.id} model discovery failed`, error);
        }

        items = await withModelsDevPricing(this.definition.pricingProvider ?? this.id, items);
        setCachedModels(cacheKey, items);

        return {
            ...this.providerCapabilities,
            models: items,
        };
    }

    async complete(request: AICompleteRequest): Promise<AICompleteResult | null> {
        const filled: AIDefinitionCompleteRequest = {
            ...request,
            model: request.model || this.defaultModel,
            prompt: Prompt.parsePrompt(request.prompt, { ...request.data, ...request } as PromptVariables & AICompleteRequest),
        };
        if (!request.output) return this.definition.complete(await this.key(), filled);
        return this.completeStructured(filled, request.output);
    }

    /**
     * A structured answer (CR-132): the provider's own mode when it has one, otherwise the schema in the
     * prompt; the JSON read out of the answer and validated; one correction with the errors; then
     * `AIOutputError`, never data that does not follow the schema.
     */
    private async completeStructured(request: AIDefinitionCompleteRequest, output: AIStructuredOutput): Promise<AICompleteResult> {
        if (request.tools?.length) throw new Error(`AIProvider:${this.id}: a structured answer (output) cannot be asked together with tools`);
        const native = this.definition.structuredOutput === 'native';
        const schema = output.schema as JsonSchema;
        const ask = async (prompt: string) => this.definition.complete(await this.key(), {
            ...request,
            prompt: native ? prompt : withOutputInstructions(prompt, output),
            output: native ? output : undefined,
        });

        const first = await ask(request.prompt);
        const read = readStructured(first, schema);
        if (read.ok) return { type: 'text', text: answerText(first), data: read.data, ...(first?.usage ? { usage: first.usage } : {}) };

        const correction = [
            request.prompt,
            '',
            `Your previous answer did not follow the JSON Schema: ${read.errors.slice(0, 10).join('; ')}.`,
            `Previous answer: ${answerText(first).slice(0, 4000) || '(none)'}`,
            'Answer again, correctly.',
        ].join('\n');
        const second = await ask(correction);
        const reread = readStructured(second, schema);
        const usage = sumUsage(first?.usage, second?.usage);
        if (reread.ok) return { type: 'text', text: answerText(second), data: reread.data, ...(usage ? { usage } : {}) };
        throw new AIOutputError(this.id, reread.errors);
    }

    async validateApiKey(): Promise<AIKeyValidationResult> {
        const dashboardUrl = this.definition.dashboardUrl;
        let apiKey: string;
        try {
            apiKey = await this.key();
        } catch (err) {
            return { valid: false, error: extractProviderError(err), dashboardUrl };
        }
        if (this.definition.validateApiKey) {
            const result = await this.definition.validateApiKey(apiKey);
            return { ...result, dashboardUrl };
        }
        // Default: call discoverModels live (bypasses cache); any thrown error = invalid key.
        try {
            await this.definition.discoverModels(apiKey);
            return { valid: true, dashboardUrl };
        } catch (err) {
            return { valid: false, error: extractProviderError(err), dashboardUrl };
        }
    }
}
