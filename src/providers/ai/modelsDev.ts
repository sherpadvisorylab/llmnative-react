import { fetchJson } from '../../libs/fetch';
import type { AIModelPricing } from './AIProvider';
import type { BuiltInAIProviderId } from './shared';

/**
 * Fallback prezzi dal catalogo pubblico `https://models.dev/api.json` (CORS `*`).
 * Usato solo per i provider built-in che NON riportano il prezzo nel proprio listing
 * (OpenAI, Anthropic, Gemini, DeepSeek, Mistral, GLM, OpenCode). `cost.input`/`cost.output`
 * sono in USD per 1M token, la stessa unità di `AIModelPricing`.
 */
export const MODELS_DEV_URL = 'https://models.dev/api.json';
const CACHE_KEY = 'ai.models.dev.v1';
const CACHE_TTL_MS = 1000 * 60 * 60 * 24;

/** provider framework → id provider nel catalogo models.dev. `openai-compatible` non è
 * mappabile (endpoint arbitrario) e viene saltato. */
const PROVIDER_IDS: Partial<Record<BuiltInAIProviderId, string[]>> = {
    openai: ['openai'],
    anthropic: ['anthropic'],
    gemini: ['google'],
    deepseek: ['deepseek'],
    mistral: ['mistral'],
    glm: ['zhipuai', 'zai'],
    cloudflare: ['cloudflare-workers-ai'],
    openrouter: ['openrouter'],
    opencode: ['opencode'],
};

/** Indice compatto: chiave `providerFramework/modelId` (minuscolo) → prezzo. */
export type ModelsDevIndex = Record<string, AIModelPricing>;

type ModelsDevCache = { fetchedAt?: number; index?: ModelsDevIndex };

export const isModelsDevProvider = (provider: BuiltInAIProviderId): boolean =>
    Object.prototype.hasOwnProperty.call(PROVIDER_IDS, provider);

const toFinitePrice = (value: unknown): number | undefined =>
    typeof value === 'number' && Number.isFinite(value) && value >= 0 ? value : undefined;

const readCachedIndex = (): ModelsDevIndex | null => {
    if (typeof localStorage === 'undefined') return null;

    try {
        const raw = localStorage.getItem(CACHE_KEY);
        if (!raw) return null;
        const cached = JSON.parse(raw) as ModelsDevCache;
        if (!cached.fetchedAt || !cached.index || typeof cached.index !== 'object') return null;
        if (Date.now() - cached.fetchedAt > CACHE_TTL_MS) return null;
        return cached.index;
    } catch {
        return null;
    }
};

const writeCachedIndex = (index: ModelsDevIndex) => {
    if (typeof localStorage === 'undefined') return;

    try {
        localStorage.setItem(CACHE_KEY, JSON.stringify({ fetchedAt: Date.now(), index }));
    } catch {
        // Quota/storage: il fallback resta valido in-memory per questa sessione.
    }
};

/** Estrae l'indice compatto dal payload grezzo di `models.dev`, senza mai lanciare:
 * una entry malformata viene semplicemente ignorata. */
export const buildModelsDevIndex = (payload: unknown): ModelsDevIndex => {
    const index: ModelsDevIndex = {};
    if (!payload || typeof payload !== 'object' || Array.isArray(payload)) return index;
    const root = payload as Record<string, unknown>;

    for (const [frameworkId, devIds] of Object.entries(PROVIDER_IDS) as Array<[BuiltInAIProviderId, string[]]>) {
        for (const devId of devIds) {
            const provider = root[devId];
            if (!provider || typeof provider !== 'object') continue;
            const models = (provider as { models?: unknown }).models;
            if (!models || typeof models !== 'object') continue;

            for (const [modelId, model] of Object.entries(models as Record<string, unknown>)) {
                if (!model || typeof model !== 'object') continue;
                const cost = (model as { cost?: unknown }).cost;
                if (!cost || typeof cost !== 'object') continue;

                const input = toFinitePrice((cost as Record<string, unknown>).input);
                const output = toFinitePrice((cost as Record<string, unknown>).output);
                if (input === undefined && output === undefined) continue;

                index[`${frameworkId}/${modelId.toLowerCase()}`] = {
                    ...(input !== undefined ? { input } : {}),
                    ...(output !== undefined ? { output } : {}),
                };
            }
        }
    }

    return index;
};

const DATE_SUFFIX = /-\d{4}-\d{2}-\d{2}$/;

/** Match esatto `provider/model`, poi ripiego sul modello senza suffisso data
 * (`gpt-4o-2024-08-06` → `gpt-4o`). */
export const lookupModelsDevPricing = (
    index: ModelsDevIndex,
    provider: BuiltInAIProviderId,
    model: string
): AIModelPricing | undefined => {
    const key = `${provider}/${model.toLowerCase()}`;
    return index[key] ?? index[key.replace(DATE_SUFFIX, '')];
};

let indexPromise: Promise<ModelsDevIndex> | null = null;

const loadIndex = async (): Promise<ModelsDevIndex> => {
    const cached = readCachedIndex();
    if (cached) return cached;

    try {
        const payload = await fetchJson(MODELS_DEV_URL);
        const index = buildModelsDevIndex(payload);
        writeCachedIndex(index);
        return index;
    } catch {
        // Non bloccante: senza prezzi i modelli restano comunque nel catalogo.
        return {};
    }
};

/** Una sola fetch condivisa per tutta la sessione (promise memoizzata), con cache 24h in
 * localStorage. In caso di errore risolve `{}` — mai un throw, mai modelli scartati. */
export const getModelsDevIndex = (): Promise<ModelsDevIndex> => {
    if (!indexPromise) indexPromise = loadIndex();
    return indexPromise;
};

/** Solo per test: azzera la promise condivisa e la cache locale. */
export const resetModelsDevIndex = (): void => {
    indexPromise = null;
    if (typeof localStorage !== 'undefined') {
        try { localStorage.removeItem(CACHE_KEY); } catch { /* ignore */ }
    }
};
