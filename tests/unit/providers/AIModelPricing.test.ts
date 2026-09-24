/**
 * AI model pricing test suite (CR-085).
 * Covers: the public `isFreeAIModel` helper, native OpenRouter pricing mapping, the shared
 * `models.dev` fallback index (build/lookup/cache/single-fetch/non-blocking) and the pricing
 * propagation through `RuntimeAIProvider.getCapabilities`.
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../../../src/providers/proxy', () => ({
    proxyFetch: undefined,
    isProxyEnabled: vi.fn(() => false),
}));

vi.mock('../../../src/libs/fetch', () => ({
    fetchJson: vi.fn(),
}));

import { isFreeAIModel } from '../../../src/providers/ai/AIProvider';
import { mapOpenRouterModelEntry } from '../../../src/providers/ai/openaiCompatible';
import {
    MODELS_DEV_URL,
    buildModelsDevIndex,
    getModelsDevIndex,
    lookupModelsDevPricing,
    resetModelsDevIndex,
} from '../../../src/providers/ai/modelsDev';
import { RuntimeAIProvider, type AIProviderDefinition } from '../../../src/providers/ai/shared';
import * as fetchLib from '../../../src/libs/fetch';

const fetchJson = () => vi.mocked(fetchLib.fetchJson);

const MODELS_DEV_PAYLOAD = {
    openai: {
        models: {
            'gpt-4o': { cost: { input: 2.5, output: 10 } },
            'gpt-4o-2024-08-06': { cost: { input: 2.5, output: 10 } },
        },
    },
    google: { models: { 'gemini-2.0-flash': { cost: { input: 0.1, output: 0.4 } } } },
    'cloudflare-workers-ai': { models: { '@cf/meta/llama-3.3-70b-instruct-fp8-fast': { cost: { input: 0.29, output: 2.25 } } } },
};

beforeEach(() => {
    vi.clearAllMocks();
    resetModelsDevIndex();
    if (typeof localStorage !== 'undefined') localStorage.clear();
});

describe('isFreeAIModel()', () => {
    it('is true only when a known price is exactly zero on both sides', () => {
        expect(isFreeAIModel({})).toBe(false);
        expect(isFreeAIModel({ pricing: { input: 0, output: 0 } })).toBe(true);
        expect(isFreeAIModel({ pricing: { input: 0 } })).toBe(false);
        expect(isFreeAIModel({ pricing: { output: 0 } })).toBe(false);
        expect(isFreeAIModel({ pricing: { input: 0, output: 0.1 } })).toBe(false);
    });
});

describe('mapOpenRouterModelEntry()', () => {
    it('converts per-token USD prices to per-1M-token values', () => {
        expect(mapOpenRouterModelEntry({
            id: 'openai/gpt-4o',
            pricing: { prompt: '0.0000025', completion: '0.00001' },
        })).toEqual({ model: 'openai/gpt-4o', pricing: { input: 2.5, output: 10 } });
    });

    it('omits variable-priced sides (-1) instead of falsifying them', () => {
        expect(mapOpenRouterModelEntry({
            id: 'openrouter/auto',
            pricing: { prompt: '-1', completion: '-1' },
        })).toEqual({ model: 'openrouter/auto' });

        expect(mapOpenRouterModelEntry({
            id: 'mixed/router',
            pricing: { prompt: '-1', completion: '0.000002' },
        })).toEqual({ model: 'mixed/router', pricing: { output: 2 } });
    });

    it('returns null for entries without a usable id', () => {
        expect(mapOpenRouterModelEntry(null)).toBeNull();
        expect(mapOpenRouterModelEntry({ pricing: {} })).toBeNull();
        expect(mapOpenRouterModelEntry('openai/gpt-4o')).toBeNull();
    });
});

describe('models.dev fallback index', () => {
    it('builds a compact index only for mapped built-in providers', () => {
        const index = buildModelsDevIndex(MODELS_DEV_PAYLOAD);

        expect(index['openai/gpt-4o']).toEqual({ input: 2.5, output: 10 });
        expect(index['gemini/gemini-2.0-flash']).toEqual({ input: 0.1, output: 0.4 });
        expect(index['cloudflare/@cf/meta/llama-3.3-70b-instruct-fp8-fast']).toEqual({ input: 0.29, output: 2.25 });
        expect(Object.keys(index)).toHaveLength(4);
    });

    it('tolerates malformed payloads without throwing', () => {
        expect(buildModelsDevIndex(null)).toEqual({});
        expect(buildModelsDevIndex('nope')).toEqual({});
        expect(buildModelsDevIndex({ openai: { models: { 'x': { cost: { input: -1, output: 'nan' } } } } })).toEqual({});
    });

    it('matches exact model ids first, then falls back to the id without the date suffix', () => {
        const index = buildModelsDevIndex(MODELS_DEV_PAYLOAD);

        expect(lookupModelsDevPricing(index, 'openai', 'gpt-4o')).toEqual({ input: 2.5, output: 10 });
        expect(lookupModelsDevPricing(index, 'openai', 'gpt-4o-2025-01-01')).toEqual({ input: 2.5, output: 10 });
        expect(lookupModelsDevPricing(index, 'openai', 'nope')).toBeUndefined();
    });

    it('fetches models.dev once and shares the in-flight promise', async () => {
        fetchJson().mockResolvedValue(MODELS_DEV_PAYLOAD);

        const [a, b] = await Promise.all([getModelsDevIndex(), getModelsDevIndex()]);
        await getModelsDevIndex();

        expect(fetchJson()).toHaveBeenCalledTimes(1);
        expect(fetchJson().mock.calls[0][0]).toBe(MODELS_DEV_URL);
        expect(a['openai/gpt-4o']).toEqual({ input: 2.5, output: 10 });
        expect(b).toBe(a);
    });

    it('serves a fresh localStorage index without fetching', async () => {
        localStorage.setItem('ai.models.dev.v1', JSON.stringify({
            fetchedAt: Date.now(),
            index: { 'openai/gpt-4o': { input: 9, output: 9 } },
        }));

        const index = await getModelsDevIndex();

        expect(fetchJson()).not.toHaveBeenCalled();
        expect(index['openai/gpt-4o']).toEqual({ input: 9, output: 9 });
    });

    it('resolves an empty index when the fetch fails (models are never discarded)', async () => {
        fetchJson().mockRejectedValue(new Error('network down'));

        await expect(getModelsDevIndex()).resolves.toEqual({});
    });
});

describe('RuntimeAIProvider pricing propagation', () => {
    const definition = (overrides: Partial<AIProviderDefinition> = {}): AIProviderDefinition => ({
        id: 'openai',
        label: 'OpenAI',
        defaultModel: 'gpt-4o',
        fallbackModels: ['gpt-4o-mini'],
        discoverModels: async () => ['gpt-4o', 'unknown-model'],
        complete: async () => null,
        ...overrides,
    });

    it('enriches discovered models with models.dev pricing, keeping unknown models', async () => {
        fetchJson().mockResolvedValue(MODELS_DEV_PAYLOAD);

        const provider = new RuntimeAIProvider(definition(), 'sk-test');
        const capabilities = await provider.getCapabilities();

        expect(capabilities.models).toEqual([
            { id: 'openai/gpt-4o', provider: 'openai', model: 'gpt-4o', label: 'OpenAI / gpt-4o', pricing: { input: 2.5, output: 10 } },
            { id: 'openai/unknown-model', provider: 'openai', model: 'unknown-model', label: 'OpenAI / unknown-model' },
        ]);
    });

    it('does not hit models.dev for providers without a mapping (openai-compatible)', async () => {
        const provider = new RuntimeAIProvider(definition({ id: 'openai-compatible', label: 'Gateway' }), 'sk-test');
        const capabilities = await provider.getCapabilities();

        expect(fetchJson()).not.toHaveBeenCalled();
        expect(capabilities.models[0].pricing).toBeUndefined();
    });
});
