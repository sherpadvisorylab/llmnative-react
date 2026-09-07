import { describe, expect, it } from 'vitest';

import { createAIProviderRegistry, getAIModelCatalog } from '../../../src/providers/ai';
import type { AIProviderAdapter } from '../../../src/providers/ai';

describe('AI provider registry', () => {
    it('registers dedicated built-in providers when their API keys are configured', () => {
        const registry = createAIProviderRegistry({
            openRouterApiKey: 'or-key',
            openCodeApiKey: 'oc-key',
        });

        expect(Object.keys(registry)).toEqual(['openrouter', 'opencode']);
        expect(registry.openrouter?.id).toBe('openrouter');
        expect(registry.opencode?.id).toBe('opencode');
    });

    it('registers the generic openai-compatible provider only when apiKey and baseUrl are both present', () => {
        const configured = createAIProviderRegistry({
            openAICompatible: {
                apiKey: 'gateway-key',
                baseUrl: 'https://gateway.example.com/v1',
                defaultModel: 'gateway/default',
                fallbackModels: ['gateway/default'],
                label: 'Gateway',
            },
        });

        expect(configured['openai-compatible']?.id).toBe('openai-compatible');
        expect(configured['openai-compatible']?.label).toBe('Gateway');
        expect(configured['openai-compatible']?.defaultModel).toBe('gateway/default');

        const missingBaseUrl = createAIProviderRegistry({
            openAICompatible: {
                apiKey: 'gateway-key',
            },
        });

        expect(missingBaseUrl['openai-compatible']).toBeUndefined();
    });

    it('returns a unified public model catalog across multiple providers while preserving provider grouping', async () => {
        const alpha: AIProviderAdapter = {
            id: 'alpha',
            label: 'Alpha',
            defaultModel: 'a1',
            getCapabilities: async () => ({
                supportsTemperature: true,
                models: [
                    { id: 'alpha/a1', provider: 'alpha', model: 'a1', label: 'Alpha / a1' },
                    { id: 'alpha/a2', provider: 'alpha', model: 'a2', label: 'Alpha / a2' },
                ],
            }),
            complete: async () => null,
        };

        const beta: AIProviderAdapter = {
            id: 'beta',
            label: 'Beta',
            defaultModel: 'b1',
            getCapabilities: async () => ({
                supportsTemperature: false,
                models: [
                    { id: 'beta/b1', provider: 'beta', model: 'b1', label: 'Beta / b1' },
                ],
            }),
            complete: async () => null,
        };

        const catalog = await getAIModelCatalog({ alpha, beta });

        expect(catalog.models.map((model) => model.id)).toEqual(['alpha/a1', 'alpha/a2', 'beta/b1']);
        expect(catalog.modelsByProvider.alpha.map((model) => model.id)).toEqual(['alpha/a1', 'alpha/a2']);
        expect(catalog.modelsByProvider.beta.map((model) => model.id)).toEqual(['beta/b1']);
        expect(catalog.capabilitiesByProvider.alpha.supportsTemperature).toBe(true);
        expect(catalog.capabilitiesByProvider.beta.supportsTemperature).toBe(false);
    });

    // BUG FISSATO: getAIModelCatalog usava un Promise.all senza isolamento per-provider — se
    // UN SOLO provider rigettava, l'intera funzione rigettava, azzerando silenziosamente il
    // catalogo anche dei provider sani nel chiamante. Questo test blocca esplicitamente la
    // garanzia opposta: un provider rotto non deve mai nascondere gli altri.
    it('isolates a provider whose getCapabilities() rejects, keeping the other providers\' models intact', async () => {
        const healthy: AIProviderAdapter = {
            id: 'healthy',
            label: 'Healthy',
            defaultModel: 'h1',
            getCapabilities: async () => ({
                models: [{ id: 'healthy/h1', provider: 'healthy', model: 'h1', label: 'Healthy / h1' }],
            }),
            complete: async () => null,
        };

        const broken: AIProviderAdapter = {
            id: 'broken',
            label: 'Broken',
            defaultModel: 'b1',
            getCapabilities: async () => { throw new Error('boom'); },
            complete: async () => null,
        };

        const catalog = await getAIModelCatalog({ healthy, broken });

        expect(catalog.modelsByProvider.healthy.map((model) => model.id)).toEqual(['healthy/h1']);
        expect(catalog.modelsByProvider.broken).toEqual([]);
        expect(catalog.models.map((model) => model.id)).toEqual(['healthy/h1']);
    });
});
