import type { AIModelDescriptor, AIModelPricing } from './AIProvider';

/** Public, CORS-open catalog (`access-control-allow-origin: *`) of models with their token
 * prices, in USD per 1M tokens — the same unit AIModelPricing uses. */
export const MODELS_DEV_URL = 'https://models.dev/api.json';

const CACHE_KEY = 'ai.pricing.modelsdev';
const CACHE_TTL_MS = 1000 * 60 * 60 * 24;

/** Built-in provider id → models.dev provider keys, in lookup order. `openai-compatible` has
 * no entry: its endpoint is arbitrary, so no catalog can know its prices. */
const MODELS_DEV_PROVIDER_KEYS: Record<string, string[]> = {
    openai: ['openai'],
    openrouter: ['openrouter'],
    opencode: ['opencode'],
    deepseek: ['deepseek'],
    gemini: ['google'],
    anthropic: ['anthropic'],
    mistral: ['mistral'],
    // The GLM adapter targets open.bigmodel.cn (zhipuai); `zai` is the international twin.
    glm: ['zhipuai', 'zai'],
    cloudflare: ['cloudflare-workers-ai'],
};

/** Compact cache shape: providerKey → modelId → [input, output]. The raw catalog is ~5 MB,
 * this keeps only the providers above (~700 entries). */
type PricingIndex = Record<string, Record<string, [number, number]>>;

type ModelsDevCatalog = Record<string, { models?: Record<string, { cost?: { input?: unknown; output?: unknown } }> }>;

let pending: Promise<PricingIndex> | null = null;

const readCache = (): PricingIndex | null => {
    if (typeof localStorage === 'undefined') return null;
    try {
        const raw = localStorage.getItem(CACHE_KEY);
        if (!raw) return null;
        const cached = JSON.parse(raw) as { fetchedAt?: number; index?: PricingIndex };
        if (!cached.fetchedAt || !cached.index || Date.now() - cached.fetchedAt > CACHE_TTL_MS) return null;
        return cached.index;
    } catch {
        return null;
    }
};

const writeCache = (index: PricingIndex) => {
    if (typeof localStorage === 'undefined') return;
    try {
        localStorage.setItem(CACHE_KEY, JSON.stringify({ fetchedAt: Date.now(), index }));
    } catch {
        // Ignore quota/storage failures: pricing still works in-memory for this session.
    }
};

export const buildPricingIndex = (catalog: ModelsDevCatalog): PricingIndex => {
    const wanted = new Set(Object.values(MODELS_DEV_PROVIDER_KEYS).flat());
    const index: PricingIndex = {};
    for (const key of wanted) {
        const models = catalog[key]?.models ?? {};
        const prices: Record<string, [number, number]> = {};
        for (const [modelId, entry] of Object.entries(models)) {
            const input = entry?.cost?.input;
            const output = entry?.cost?.output;
            if (typeof input === 'number' && typeof output === 'number') prices[modelId] = [input, output];
        }
        index[key] = prices;
    }
    return index;
};

/** One fetch per session at most (in-flight promise shared by every provider), then the
 * localStorage copy for 24h. A failed fetch resolves to an empty index — every model then
 * shows "price not found" — and is not cached, so the next catalog load retries. */
const loadPricingIndex = (): Promise<PricingIndex> => {
    const cached = readCache();
    if (cached) return Promise.resolve(cached);
    if (!pending) {
        pending = fetch(MODELS_DEV_URL)
            .then((response) => (response.ok ? response.json() : Promise.reject(new Error(`HTTP ${response.status}`))))
            .then((catalog: ModelsDevCatalog) => {
                const index = buildPricingIndex(catalog);
                writeCache(index);
                return index;
            })
            .catch((error) => {
                console.warn('models.dev pricing unavailable', error);
                return {};
            })
            .finally(() => { pending = null; });
    }
    return pending;
};

/** Provider ids often carry a release date models.dev lists only under the undated alias
 * (e.g. `gpt-4o-mini-2024-07-18`); exact match wins, the stripped id is the fallback. */
const candidateIds = (model: string): string[] => {
    const lower = model.toLowerCase();
    const undated = lower.replace(/-(\d{8}|\d{4}-\d{2}-\d{2})$/, '');
    return [...new Set([model, lower, undated])];
};

export const lookupModelsDevPricing = (index: PricingIndex, providerId: string, model: string): AIModelPricing | undefined => {
    for (const key of MODELS_DEV_PROVIDER_KEYS[providerId] ?? []) {
        const prices = index[key];
        if (!prices) continue;
        for (const id of candidateIds(model)) {
            const hit = prices[id];
            if (hit) return { input: hit[0], output: hit[1], currency: 'USD', source: 'models.dev' };
        }
    }
    return undefined;
};

/** Fills `pricing` from models.dev on the models the provider listing left without one.
 * Models are never dropped: a model with no match simply keeps `pricing` undefined. */
export const withModelsDevPricing = async (providerId: string, models: AIModelDescriptor[]): Promise<AIModelDescriptor[]> => {
    if (!MODELS_DEV_PROVIDER_KEYS[providerId] || models.every((m) => m.pricing)) return models;
    const index = await loadPricingIndex();
    return models.map((m) => {
        if (m.pricing) return m;
        const pricing = lookupModelsDevPricing(index, providerId, m.model);
        return pricing ? { ...m, pricing } : m;
    });
};

/** Test-only: drops the in-flight promise between cases. */
export const resetModelsDevPricingForTests = () => { pending = null; };
