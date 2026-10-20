import { MODELS_DEV_PROVIDER_KEYS, loadModelsDevCatalog, type ModelsDevCatalog } from './modelsDevPricing';

const CACHE_KEY = 'ai.identity.modelsdev';
const CACHE_TTL_MS = 1000 * 60 * 60 * 24;

/** One canonical model: its human display name and the id every models.dev provider uses. */
export type ModelIdentity = {
    /** Human-readable display name, without release date nor Free/Latest variant. */
    name: string;
    /** models.dev provider key → model ids for this canonical model, most stable first. */
    providers: Record<string, string[]>;
};

/** Canonical model name → its provider-independent identity. */
export type ModelIdentityIndex = Record<string, ModelIdentity>;

/** Release dates as they appear in model names/ids: `2026-10-17`, `2026/10/17` or `20261017`. */
const RELEASE_DATE = /\b\d{4}[-/]\d{2}[-/]\d{2}\b|\b\d{8}\b/g;

/** Variants that do not change the model identity: `Free` and `Latest`. */
const VARIANT = /\b(free|latest)\b/g;

/** Provider-agnostic key of a model name: lowercased, without release dates, Free/Latest
 * variants or punctuation, so the same model gets one key whichever provider lists it. */
export const canonicalModelName = (name: string): string =>
    name
        .toLowerCase()
        .replace(/~/g, ' ')
        .replace(RELEASE_DATE, ' ')
        .replace(VARIANT, ' ')
        .replace(/[^\p{L}\p{N}]+/gu, ' ')
        .trim()
        .replace(/\s+/g, ' ');

const hasReleaseDate = (value: string) => /\b\d{4}[-/]\d{2}[-/]\d{2}\b|\b\d{8}\b/.test(value);
const hasVariant = (value: string) => /\b(free|latest)\b/.test(value);

/** Lower is more preferred. A stable id carries no release date, no `~` alias and no free tier. */
const idPenalty = (id: string): number => {
    const lower = id.toLowerCase();
    let penalty = 0;
    if (hasReleaseDate(lower) || /-\d{4}$/.test(lower)) penalty += 8;
    if (lower.includes('~')) penalty += 4;
    if (/(^|[-/:.])free\b/.test(lower)) penalty += 2;
    if (/(^|[-/:.])latest\b/.test(lower)) penalty += 1;
    return penalty;
};

const compareIds = (a: string, b: string): number =>
    idPenalty(a) - idPenalty(b) || a.length - b.length || a.localeCompare(b);

/** From the whole models.dev catalog, one entry per canonical model: its display name and,
 * for every provider present, the ids that point to it (most stable id first). */
export const buildModelIdentityIndex = (catalog: ModelsDevCatalog): ModelIdentityIndex => {
    const index: ModelIdentityIndex = {};
    const cleanName: Record<string, boolean> = {};

    for (const [providerKey, provider] of Object.entries(catalog)) {
        const models = provider?.models ?? {};
        for (const [modelId, entry] of Object.entries(models)) {
            const rawName = typeof entry?.name === 'string' && entry.name.trim() ? entry.name : modelId;
            const key = canonicalModelName(rawName);
            if (!key) continue;

            const identity = (index[key] ??= { name: rawName, providers: {} });
            const ids = (identity.providers[providerKey] ??= []);
            if (!ids.includes(modelId)) ids.push(modelId);

            const rawIsClean = !hasReleaseDate(rawName.toLowerCase()) && !hasVariant(rawName.toLowerCase());
            if (rawIsClean && (!cleanName[key] || rawName.length < identity.name.length)) {
                identity.name = rawName;
                cleanName[key] = true;
            }
        }
    }

    for (const identity of Object.values(index)) {
        for (const [providerKey, ids] of Object.entries(identity.providers)) {
            identity.providers[providerKey] = [...new Set(ids)].sort(compareIds);
        }
    }

    return index;
};

/** The id of `model` (a human name or a model id) on the first of `providers` that serves it.
 * `providers` are framework provider ids (`deepseek`, `cloudflare`, …), expanded through
 * `MODELS_DEV_PROVIDER_KEYS`; a raw models.dev key is used as-is. Unknown model or provider →
 * `undefined`. */
export const resolveModel = (
    index: ModelIdentityIndex,
    model: string,
    providers: string[],
): string | undefined => {
    const identity = index[canonicalModelName(model)];
    if (!identity) return undefined;

    for (const provider of providers) {
        for (const key of MODELS_DEV_PROVIDER_KEYS[provider] ?? [provider]) {
            const ids = identity.providers[key];
            if (ids && ids.length > 0) return ids[0];
        }
    }
    return undefined;
};

const readCache = (): ModelIdentityIndex | null => {
    if (typeof localStorage === 'undefined') return null;
    try {
        const raw = localStorage.getItem(CACHE_KEY);
        if (!raw) return null;
        const cached = JSON.parse(raw) as { fetchedAt?: number; index?: ModelIdentityIndex };
        if (!cached.fetchedAt || !cached.index || Date.now() - cached.fetchedAt > CACHE_TTL_MS) return null;
        return cached.index;
    } catch {
        return null;
    }
};

const writeCache = (index: ModelIdentityIndex) => {
    if (typeof localStorage === 'undefined') return;
    try {
        localStorage.setItem(CACHE_KEY, JSON.stringify({ fetchedAt: Date.now(), index }));
    } catch {
        // Ignore quota/storage failures: the index still works in-memory for this session.
    }
};

let pendingIdentity: Promise<ModelIdentityIndex> | null = null;

/** One fetch per session at most (shared with the pricing catalog) and a compact localStorage
 * copy for 24h. When models.dev is unreachable it resolves to an empty index, without caching
 * the failure, so the next load retries. */
export const loadModelIdentityIndex = (): Promise<ModelIdentityIndex> => {
    const cached = readCache();
    if (cached) return Promise.resolve(cached);
    if (!pendingIdentity) {
        pendingIdentity = loadModelsDevCatalog()
            .then((catalog) => {
                const index = buildModelIdentityIndex(catalog);
                writeCache(index);
                return index;
            })
            .catch((error) => {
                console.warn('models.dev model identity unavailable', error);
                return {};
            })
            .finally(() => { pendingIdentity = null; });
    }
    return pendingIdentity;
};

/** Test-only: drops the in-flight promise between cases. */
export const resetModelIdentityForTests = () => { pendingIdentity = null; };
