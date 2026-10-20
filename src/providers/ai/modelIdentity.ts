// Provider-agnostic identity of AI models (CR-103). models.dev names a model the same way on every
// provider once release dates and variants are removed: "DeepSeek V4.1 Flash" is
// `deepseek/deepseek-v4.1-flash` on OpenRouter, `deepseek-flash` on DeepSeek and
// `@cf/deepseek-ai/deepseek-v4.1-flash-1017` on Cloudflare. Pure module: no React, no browser API.

import { MODELS_DEV_URL } from './modelsDevPricing';

/** Words that name a variant of a model, not another model. */
const VARIANT_WORDS = new Set(['free', 'latest']);
/** A trailing release date: MMDD, YYYYMMDD or YYYY-MM-DD. */
const DATE_WORD = /^(\d{4}|\d{8}|\d{4}-\d{2}-\d{2})$/;
/** A trailing group in parentheses: who hosts it, a region or a variant ("(Alibaba Cloud)", "(EU)", "(Latest)"). */
const TRAILING_GROUP = /\s*\(([^()]*)\)\s*$/;
/** Groups that name another way of running the model, not another host: they stay in the name. */
const MODE_GROUP = /^(thinking|reasoning|non-reasoning|fast)$/i;

/**
 * The key of a model name on any provider: lower case, without the host, region, release date, Free
 * or Latest that some providers add; a mode ("(Thinking)") stays.
 */
export const canonicalModelName = (name: string): string => {
    let rest = name.trim();
    const modes: string[] = [];
    for (let group = TRAILING_GROUP.exec(rest); group; group = TRAILING_GROUP.exec(rest)) {
        if (MODE_GROUP.test(group[1].trim())) modes.unshift(group[1].trim());
        rest = rest.slice(0, group.index);
    }
    const words = rest.toLowerCase().replace(/[()[\]]/g, ' ').split(/\s+/).filter(Boolean);
    while (words.length > 1 && (VARIANT_WORDS.has(words[words.length - 1]) || DATE_WORD.test(words[words.length - 1]))) words.pop();
    return [...words, ...modes.map((mode) => mode.toLowerCase())].join(' ');
};

/** One model of a provider, as models.dev lists it. */
export type ModelIdentityEntry = { id: string; name: string };

export type ModelIdentity = {
    /** canonicalModelName() of its name. */
    key: string;
    /** The name to show: the one of a stable id, without date or variant when there is one. */
    name: string;
    family?: string;
    /** models.dev provider key (the ids opencode uses) → the ids of the model there. */
    providers: Record<string, ModelIdentityEntry[]>;
};

export type ModelIdentityIndex = {
    models: Record<string, ModelIdentity>;
    /** models.dev provider key → its name. */
    providers: Record<string, string>;
};

type ModelsDevCatalog = Record<string, { name?: string; models?: Record<string, { name?: string; family?: string }> }>;

/** How far an id is from the stable one: `~` aliases, free tiers, Latest and dated ids come last. */
const instability = ({ id, name }: ModelIdentityEntry): number => {
    const words = name.toLowerCase().split(/\s+/);
    return (id.startsWith('~') ? 8 : 0)
        + (words.includes('free') ? 4 : 0)
        + (words.includes('latest') ? 2 : 0)
        + (DATE_WORD.test(words[words.length - 1] ?? '') ? 1 : 0)
        // A host or region in parentheses: the plain name of the same provider goes first.
        + (TRAILING_GROUP.test(name) ? 1 : 0);
};

const byStability = (left: ModelIdentityEntry, right: ModelIdentityEntry) =>
    instability(left) - instability(right) || left.id.length - right.id.length || left.id.localeCompare(right.id);

/** One entry per canonical model, with its ids on every provider of the models.dev catalog. */
export function buildModelIdentityIndex(catalog: ModelsDevCatalog): ModelIdentityIndex {
    const models: Record<string, ModelIdentity> = {};
    const providers: Record<string, string> = {};
    for (const [provider, { name: providerName, models: entries = {} }] of Object.entries(catalog)) {
        providers[provider] = providerName || provider;
        for (const [id, entry] of Object.entries(entries)) {
            const name = entry?.name?.trim() || id;
            const key = canonicalModelName(name);
            const identity = models[key] ??= { key, name, providers: {} };
            if (!identity.family && entry?.family) identity.family = entry.family;
            (identity.providers[provider] ??= []).push({ id, name });
            // The name to show is the one of the most stable id seen so far.
            if (instability({ id, name }) < instability({ id: '', name: identity.name })) identity.name = name;
        }
    }
    for (const identity of Object.values(models)) {
        for (const entries of Object.values(identity.providers)) entries.sort(byStability);
    }
    return { models, providers };
}

export type ResolvedModel = {
    /** models.dev provider key. */
    provider: string;
    /** The id of the model on that provider. */
    model: string;
    /** `provider/model`: the form opencode reads. */
    ref: string;
};

/**
 * The id of `model` (a name or a canonical key) on the first of `providers` that serves it, the most
 * stable id of that provider; nothing when none of them does.
 */
export function resolveModel(index: ModelIdentityIndex, model: string, providers: readonly string[]): ResolvedModel | undefined {
    const identity = index.models[canonicalModelName(model)];
    if (!identity) return undefined;
    for (const provider of providers) {
        const best = identity.providers[provider]?.[0];
        if (best) return { provider, model: best.id, ref: `${provider}/${best.id}` };
    }
    return undefined;
}

let pending: Promise<ModelIdentityIndex> | null = null;
let loaded: ModelIdentityIndex | null = null;

/** The models.dev index, fetched once per session (the catalog is several MB: not cached on disk). */
export function loadModelIdentityIndex(fetchFn: typeof fetch = globalThis.fetch): Promise<ModelIdentityIndex> {
    if (loaded) return Promise.resolve(loaded);
    pending ??= fetchFn(MODELS_DEV_URL)
        .then((response) => (response.ok ? response.json() : Promise.reject(new Error(`models.dev: HTTP ${response.status}`))))
        .then((catalog: ModelsDevCatalog) => (loaded = buildModelIdentityIndex(catalog)))
        .finally(() => { pending = null; });
    return pending;
}
