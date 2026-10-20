/**
 * Provider-agnostic model identity (CR-103): the same human model name maps to one canonical
 * key and resolves to the right id on each provider of the models.dev catalog.
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
    canonicalModelName,
    buildModelIdentityIndex,
    resolveModel,
    loadModelIdentityIndex,
    resetModelIdentityForTests,
} from '../../../src/providers/ai/modelIdentity';
import { resetModelsDevPricingForTests, MODELS_DEV_URL } from '../../../src/providers/ai/modelsDevPricing';

const CATALOG = {
    deepseek: { models: { 'deepseek-v4.1-flash': { name: 'DeepSeek V4.1 Flash' } } },
    openrouter: {
        models: {
            'deepseek/deepseek-v4.1-flash:free': { name: 'DeepSeek V4.1 Flash (free)' },
            'deepseek/deepseek-v4.1-flash': { name: 'DeepSeek V4.1 Flash' },
            '~deepseek/deepseek-v4.1-flash': { name: 'DeepSeek V4.1 Flash' },
        },
    },
    opencode: { models: { 'deepseek-v4.1-flash': { name: 'DeepSeek V4.1 Flash' } } },
    'cloudflare-workers-ai': {
        models: { '@cf/deepseek-ai/deepseek-v4.1-flash-1017': { name: 'DeepSeek V4.1 Flash (2026-10-17)' } },
    },
};

describe('canonicalModelName()', () => {
    it('maps equivalent human names to one provider-agnostic key', () => {
        const key = canonicalModelName('DeepSeek V4.1 Flash');
        expect(canonicalModelName('deepseek v4.1 flash')).toBe(key);
        expect(canonicalModelName('DeepSeek V4.1 Flash (free)')).toBe(key);
        expect(canonicalModelName('DeepSeek V4.1 Flash (Latest)')).toBe(key);
        expect(canonicalModelName('DeepSeek V4.1 Flash 2026-10-17')).toBe(key);
    });

    it('keeps different models apart', () => {
        expect(canonicalModelName('DeepSeek V4.1 Flash')).not.toBe(canonicalModelName('DeepSeek V4.1 Pro'));
    });
});

describe('buildModelIdentityIndex()', () => {
    const index = buildModelIdentityIndex(CATALOG);
    const identity = index[canonicalModelName('DeepSeek V4.1 Flash')];

    it('builds one entry per canonical model with its display name', () => {
        expect(identity.name).toBe('DeepSeek V4.1 Flash');
    });

    it('lists the ids of every provider that serves the model', () => {
        expect(identity.providers.deepseek).toEqual(['deepseek-v4.1-flash']);
        expect(identity.providers.opencode).toEqual(['deepseek-v4.1-flash']);
        expect(identity.providers['cloudflare-workers-ai']).toEqual(['@cf/deepseek-ai/deepseek-v4.1-flash-1017']);
    });

    it('orders a provider ids by stability: stable, then free, then alias', () => {
        expect(identity.providers.openrouter).toEqual([
            'deepseek/deepseek-v4.1-flash',
            'deepseek/deepseek-v4.1-flash:free',
            '~deepseek/deepseek-v4.1-flash',
        ]);
    });
});

describe('resolveModel()', () => {
    const index = buildModelIdentityIndex(CATALOG);

    it('returns the id on the first provider of the list that serves the model', () => {
        expect(resolveModel(index, 'DeepSeek V4.1 Flash', ['deepseek', 'openrouter'])).toBe('deepseek-v4.1-flash');
        expect(resolveModel(index, 'DeepSeek V4.1 Flash', ['cloudflare', 'openrouter']))
            .toBe('@cf/deepseek-ai/deepseek-v4.1-flash-1017');
    });

    it('resolves framework provider ids and raw models.dev keys alike', () => {
        expect(resolveModel(index, 'DeepSeek V4.1 Flash', ['cloudflare']))
            .toBe('@cf/deepseek-ai/deepseek-v4.1-flash-1017');
        expect(resolveModel(index, 'DeepSeek V4.1 Flash', ['cloudflare-workers-ai']))
            .toBe('@cf/deepseek-ai/deepseek-v4.1-flash-1017');
        expect(resolveModel(index, 'DeepSeek V4.1 Flash', ['opencode'])).toBe('deepseek-v4.1-flash');
    });

    it('prefers the stable id over Free/Latest/dated variants', () => {
        expect(resolveModel(index, 'DeepSeek V4.1 Flash', ['openrouter'])).toBe('deepseek/deepseek-v4.1-flash');
    });

    it('accepts a model id as well as a human name', () => {
        expect(resolveModel(index, 'deepseek-v4.1-flash', ['opencode'])).toBe('deepseek-v4.1-flash');
    });

    it('returns undefined for an unknown model or provider', () => {
        expect(resolveModel(index, 'Unknown Model', ['deepseek'])).toBeUndefined();
        expect(resolveModel(index, 'DeepSeek V4.1 Flash', ['openai'])).toBeUndefined();
        expect(resolveModel(index, 'DeepSeek V4.1 Flash', [])).toBeUndefined();
    });
});

describe('loadModelIdentityIndex()', () => {
    beforeEach(() => {
        localStorage.clear();
        resetModelIdentityForTests();
        resetModelsDevPricingForTests();
    });
    afterEach(() => {
        vi.unstubAllGlobals();
        vi.restoreAllMocks();
    });

    it('fetches the catalog once per session and serves the localStorage copy after', async () => {
        const fetchMock = vi.fn().mockResolvedValue({ ok: true, json: async () => CATALOG });
        vi.stubGlobal('fetch', fetchMock);

        const [first, second] = await Promise.all([loadModelIdentityIndex(), loadModelIdentityIndex()]);
        expect(fetchMock).toHaveBeenCalledTimes(1);
        expect(fetchMock).toHaveBeenCalledWith(MODELS_DEV_URL);
        expect(first[canonicalModelName('DeepSeek V4.1 Flash')].providers.deepseek).toEqual(['deepseek-v4.1-flash']);
        expect(second).toEqual(first);
        expect(localStorage.getItem('ai.identity.modelsdev')).not.toBeNull();

        resetModelIdentityForTests();
        resetModelsDevPricingForTests();
        await loadModelIdentityIndex();
        expect(fetchMock).toHaveBeenCalledTimes(1);
    });

    it('degrades to an empty index when models.dev is unreachable, without caching the failure', async () => {
        vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('Failed to fetch')));
        vi.spyOn(console, 'warn').mockImplementation(() => {});

        const index = await loadModelIdentityIndex();

        expect(index).toEqual({});
        expect(localStorage.getItem('ai.identity.modelsdev')).toBeNull();
    });
});
