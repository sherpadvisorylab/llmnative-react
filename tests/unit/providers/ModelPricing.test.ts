/**
 * Model pricing: native provider prices (OpenRouter) and the models.dev fallback.
 * Catalog/listing shapes mirror the live responses (verified 2026-09-24): models.dev costs are
 * USD per 1M tokens, OpenRouter `/models` prices are USD per token as strings (`-1` = variable).
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
    buildPricingIndex,
    lookupModelsDevPricing,
    withModelsDevPricing,
    resetModelsDevPricingForTests,
    MODELS_DEV_URL,
} from '../../../src/providers/ai/modelsDevPricing';
import { parseOpenRouterPricing } from '../../../src/providers/ai/openrouter';
import { isFreeAIModel, type AIModelDescriptor } from '../../../src/providers/ai/AIProvider';

const CATALOG = {
    anthropic: { models: { 'claude-sonnet-4-5': { cost: { input: 3, output: 15 } } } },
    openai: { models: { 'gpt-4o-mini': { cost: { input: 0.15, output: 0.6 } }, 'chatgpt-image-latest': {} } },
    opencode: { models: { 'big-pickle': { cost: { input: 0, output: 0, cache_read: 0 } } } },
    zai: { models: { 'glm-4.6': { cost: { input: 0.6, output: 2.2 } } } },
    groq: { models: { 'llama-3.3-70b': { cost: { input: 0.59, output: 0.79 } } } },
};

const descriptor = (provider: string, model: string, extra: Partial<AIModelDescriptor> = {}): AIModelDescriptor => ({
    id: `${provider}/${model}`, provider, model, label: `${provider} / ${model}`, ...extra,
});

describe('models.dev pricing index', () => {
    const index = buildPricingIndex(CATALOG);

    it('keeps only the mapped providers and models that carry both prices', () => {
        expect(index.groq).toEqual({ 'llama-3.3-70b': [0.59, 0.79] });
        expect(index.openai).toEqual({ 'gpt-4o-mini': [0.15, 0.6] });
    });

    it('matches exact ids, then the undated alias', () => {
        expect(lookupModelsDevPricing(index, 'anthropic', 'claude-sonnet-4-5')).toMatchObject({ input: 3, output: 15, source: 'models.dev' });
        expect(lookupModelsDevPricing(index, 'openai', 'gpt-4o-mini-2024-07-18')).toMatchObject({ input: 0.15, output: 0.6 });
        expect(lookupModelsDevPricing(index, 'anthropic', 'claude-sonnet-4-5-20250929')).toMatchObject({ input: 3 });
    });

    it('walks every models.dev key of a provider (glm: zhipuai, then zai)', () => {
        expect(lookupModelsDevPricing(index, 'glm', 'glm-4.6')).toMatchObject({ input: 0.6, output: 2.2 });
    });

    it('prices groq models from the groq catalog', () => {
        expect(lookupModelsDevPricing(index, 'groq', 'llama-3.3-70b')).toMatchObject({ input: 0.59, output: 0.79, source: 'models.dev' });
    });

    it('returns undefined for unknown models and for openai-compatible', () => {
        expect(lookupModelsDevPricing(index, 'openai', 'gpt-unknown')).toBeUndefined();
        expect(lookupModelsDevPricing(index, 'openai-compatible', 'gpt-4o-mini')).toBeUndefined();
    });
});

describe('withModelsDevPricing()', () => {
    beforeEach(() => {
        localStorage.clear();
        resetModelsDevPricingForTests();
    });
    afterEach(() => {
        vi.unstubAllGlobals();
        vi.restoreAllMocks();
    });

    it('fills missing prices, keeps native ones and never drops a model', async () => {
        const fetchMock = vi.fn().mockResolvedValue({ ok: true, json: async () => CATALOG });
        vi.stubGlobal('fetch', fetchMock);
        const native = { input: 9, output: 9, currency: 'USD' as const, source: 'provider' as const };

        const result = await withModelsDevPricing('openai', [
            descriptor('openai', 'gpt-4o-mini'),
            descriptor('openai', 'gpt-4.1', { pricing: native }),
            descriptor('openai', 'gpt-unknown'),
        ]);

        expect(fetchMock).toHaveBeenCalledWith(MODELS_DEV_URL);
        expect(result.map((m) => m.pricing)).toEqual([
            { input: 0.15, output: 0.6, currency: 'USD', source: 'models.dev' },
            native,
            undefined,
        ]);
    });

    it('fetches the catalog once, then serves the localStorage copy', async () => {
        const fetchMock = vi.fn().mockResolvedValue({ ok: true, json: async () => CATALOG });
        vi.stubGlobal('fetch', fetchMock);

        await Promise.all([
            withModelsDevPricing('openai', [descriptor('openai', 'gpt-4o-mini')]),
            withModelsDevPricing('anthropic', [descriptor('anthropic', 'claude-sonnet-4-5')]),
        ]);
        await withModelsDevPricing('opencode', [descriptor('opencode', 'big-pickle')]);

        expect(fetchMock).toHaveBeenCalledTimes(1);
    });

    it('leaves models unpriced when models.dev is unreachable, without caching the failure', async () => {
        vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('Failed to fetch')));
        vi.spyOn(console, 'warn').mockImplementation(() => {});

        const result = await withModelsDevPricing('openai', [descriptor('openai', 'gpt-4o-mini')]);

        expect(result[0].pricing).toBeUndefined();
        expect(localStorage.getItem('ai.pricing.modelsdev')).toBeNull();
    });

    it('does not fetch for openai-compatible', async () => {
        const fetchMock = vi.fn();
        vi.stubGlobal('fetch', fetchMock);

        await withModelsDevPricing('openai-compatible', [descriptor('openai-compatible', 'x')]);

        expect(fetchMock).not.toHaveBeenCalled();
    });
});

describe('parseOpenRouterPricing()', () => {
    it('converts per-token string prices to USD per 1M tokens', () => {
        expect(parseOpenRouterPricing({ prompt: '0.000003', completion: '0.000015' }))
            .toEqual({ input: 3, output: 15, currency: 'USD', source: 'provider' });
    });

    it('recognises free models', () => {
        expect(isFreeAIModel({ pricing: parseOpenRouterPricing({ prompt: '0', completion: '0' }) })).toBe(true);
    });

    it('treats variable-price routers (-1) and missing fields as not found', () => {
        expect(parseOpenRouterPricing({ prompt: '-1', completion: '-1' })).toBeUndefined();
        expect(parseOpenRouterPricing({ prompt: '0.000001' })).toBeUndefined();
        expect(parseOpenRouterPricing(undefined)).toBeUndefined();
    });
});
