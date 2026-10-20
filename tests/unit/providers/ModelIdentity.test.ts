import { describe, expect, it, vi } from 'vitest';

import { buildModelIdentityIndex, canonicalModelName, loadModelIdentityIndex, resolveModel } from '../../../src/providers/ai/modelIdentity';

// A slice of the models.dev catalog as it lists DeepSeek V4.1 Flash on four providers.
const catalog = {
    deepseek: { name: 'DeepSeek', models: {
        'deepseek-flash': { name: 'DeepSeek V4.1 Flash 1017', family: 'deepseek-flash' },
        'deepseek-v4-pro': { name: 'DeepSeek V4 Pro' },
    } },
    openrouter: { name: 'OpenRouter', models: {
        '~deepseek/deepseek-flash-latest': { name: 'DeepSeek V4.1 Flash Latest' },
        'deepseek/deepseek-v4.1-flash-1017': { name: 'DeepSeek V4.1 Flash 1017' },
        'deepseek/deepseek-v4.1-flash': { name: 'DeepSeek V4.1 Flash' },
    } },
    opencode: { name: 'OpenCode Zen', models: {
        'deepseek-v4.1-flash-free': { name: 'DeepSeek V4.1 Flash Free' },
        'deepseek-v4.1-flash': { name: 'DeepSeek V4.1 Flash' },
    } },
    'cloudflare-workers-ai': { name: 'Cloudflare Workers AI', models: {
        '@cf/deepseek-ai/deepseek-v4.1-flash-1017': { name: 'Deepseek V4.1 Flash 1017' },
    } },
};

describe('model identity', () => {
    it('names a model the same way whatever its release date, case or variant', () => {
        expect(canonicalModelName('DeepSeek V4.1 Flash 1017')).toBe('deepseek v4.1 flash');
        expect(canonicalModelName('Deepseek V4.1 Flash Free')).toBe('deepseek v4.1 flash');
        expect(canonicalModelName('GPT-4o mini 2024-07-18')).toBe('gpt-4o mini');
        expect(canonicalModelName('DeepSeek V4 Pro')).toBe('deepseek v4 pro');
        // A host or region in parentheses is dropped; a mode stays.
        expect(canonicalModelName('DeepSeek V4.1 Flash (Alibaba Cloud)')).toBe('deepseek v4.1 flash');
        expect(canonicalModelName('Claude Sonnet 4.5 (Amazon Bedrock, US) (Latest)')).toBe('claude sonnet 4.5');
        expect(canonicalModelName('DeepSeek V4 Pro (Thinking)')).toBe('deepseek v4 pro thinking');
        // A name made only of a variant word stays as it is.
        expect(canonicalModelName('Latest')).toBe('latest');
    });

    it('gathers the ids of a model on every provider, the stable one first, under a clean name', () => {
        const index = buildModelIdentityIndex(catalog);
        const flash = index.models['deepseek v4.1 flash'];

        expect(flash.name).toBe('DeepSeek V4.1 Flash');
        expect(flash.family).toBe('deepseek-flash');
        expect(flash.providers.openrouter.map((entry) => entry.id)).toEqual([
            'deepseek/deepseek-v4.1-flash', 'deepseek/deepseek-v4.1-flash-1017', '~deepseek/deepseek-flash-latest',
        ]);
        expect(index.providers.opencode).toBe('OpenCode Zen');
    });

    it('resolves a model on the first provider that serves it', () => {
        const index = buildModelIdentityIndex(catalog);

        expect(resolveModel(index, 'DeepSeek V4.1 Flash', ['openrouter'])).toEqual({ provider: 'openrouter', model: 'deepseek/deepseek-v4.1-flash', ref: 'openrouter/deepseek/deepseek-v4.1-flash' });
        expect(resolveModel(index, 'deepseek v4.1 flash', ['groq', 'deepseek'])?.ref).toBe('deepseek/deepseek-flash');
        expect(resolveModel(index, 'DeepSeek V4.1 Flash', ['opencode'])?.model).toBe('deepseek-v4.1-flash');
        expect(resolveModel(index, 'DeepSeek V4.1 Flash', ['cloudflare-workers-ai'])?.model).toBe('@cf/deepseek-ai/deepseek-v4.1-flash-1017');
        expect(resolveModel(index, 'DeepSeek V4.1 Flash', ['anthropic'])).toBeUndefined();
        expect(resolveModel(index, 'No Such Model', ['openrouter'])).toBeUndefined();
    });

    it('fetches the catalog once per session', async () => {
        const fetchFn = vi.fn(async () => new Response(JSON.stringify(catalog), { status: 200 }));
        const [first, second] = await Promise.all([loadModelIdentityIndex(fetchFn as typeof fetch), loadModelIdentityIndex(fetchFn as typeof fetch)]);
        const third = await loadModelIdentityIndex(fetchFn as typeof fetch);

        expect(fetchFn).toHaveBeenCalledTimes(1);
        expect(first).toBe(second);
        expect(third).toBe(first);
    });
});
