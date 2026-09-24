/**
 * `AIModelDescriptor.providerLabel` — the readable provider name the model picker groups by.
 * Discovery normalizes it from the definition's `label`; a cached list written without it is
 * backfilled so a catalog served from cache stays groupable.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { RuntimeAIProvider, type AIProviderDefinition } from '../../../src/providers/ai/shared';

const definition = (discoverModels: AIProviderDefinition['discoverModels']): AIProviderDefinition => ({
    id: 'openai',
    label: 'OpenAI',
    defaultModel: 'gpt-4o',
    fallbackModels: ['gpt-4o'],
    discoverModels,
    complete: async () => null,
});

describe('AIModelDescriptor.providerLabel', () => {
    beforeEach(() => {
        localStorage.clear();
        // Discovery would otherwise reach models.dev for prices; keep the test hermetic.
        vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('offline')));
        vi.spyOn(console, 'warn').mockImplementation(() => {});
    });

    afterEach(() => {
        vi.unstubAllGlobals();
        vi.restoreAllMocks();
    });

    it('sets providerLabel from the definition label on discovered models', async () => {
        const provider = new RuntimeAIProvider(definition(async () => ['gpt-4o', 'gpt-4.1']), 'key');

        const capabilities = await provider.getCapabilities(true);

        expect(capabilities.models.map((model) => model.providerLabel)).toEqual(['OpenAI', 'OpenAI']);
    });

    it('backfills providerLabel on a cached list written before the field existed', async () => {
        localStorage.setItem('ai.models.v4.openai', JSON.stringify({
            fetchedAt: Date.now(),
            items: [{ id: 'openai/gpt-4o', provider: 'openai', model: 'gpt-4o', label: 'OpenAI / gpt-4o' }],
        }));

        const provider = new RuntimeAIProvider(
            definition(async () => { throw new Error('discovery must not run on a cache hit'); }),
            'key'
        );

        const capabilities = await provider.getCapabilities();

        expect(capabilities.models).toHaveLength(1);
        expect(capabilities.models[0].providerLabel).toBe('OpenAI');
        expect(capabilities.models[0].label).toBe('OpenAI / gpt-4o');
    });
});
