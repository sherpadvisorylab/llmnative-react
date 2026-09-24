/**
 * Groq provider: OpenAI-compatible endpoint at api.groq.com/openai/v1. `/models` also lists
 * speech, TTS and safety-classifier models (and `active: false` entries), which are not chat
 * models and must stay out of the picker.
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../../../src/providers/proxy', () => ({
    proxyFetch: undefined,
    isProxyEnabled: vi.fn(() => false),
}));

vi.mock('../../../src/libs/fetch', () => ({
    fetchJson: vi.fn(),
}));

import { GROQ_PROVIDER_DEFINITION } from '../../../src/providers/ai/groq';
import { AI_PROVIDER_DESCRIPTORS, createAIProviderRegistry } from '../../../src/providers/ai';
import { AI_MANIFEST } from '../../../src/providers/manifest';
import * as fetchLib from '../../../src/libs/fetch';

const fetchJson = () => vi.mocked(fetchLib.fetchJson);

beforeEach(() => vi.clearAllMocks());

describe('GROQ_PROVIDER_DEFINITION', () => {
    it('targets the OpenAI-compatible Groq endpoint with a single API key', () => {
        expect(GROQ_PROVIDER_DEFINITION.id).toBe('groq');
        expect(GROQ_PROVIDER_DEFINITION.configKey).toBe('groqApiKey');
        expect(GROQ_PROVIDER_DEFINITION.credentialFields?.map((f) => f.key)).toEqual(['apiKey']);
    });

    it('discovers only active chat models', async () => {
        fetchJson().mockResolvedValue({ data: [
            { id: 'openai/gpt-oss-120b', active: true },
            { id: 'qwen/qwen3.8-27b' },
            { id: 'whisper-large-v3', active: true },
            { id: 'canopylabs/orpheus-v1-english', active: true },
            { id: 'meta-llama/llama-prompt-guard-2-86m', active: true },
            { id: 'openai/gpt-oss-safeguard-20b', active: true },
            { id: 'retired-model', active: false },
        ] });

        expect(await GROQ_PROVIDER_DEFINITION.discoverModels('gsk-test')).toEqual(['openai/gpt-oss-120b', 'qwen/qwen3.8-27b']);
        const [url, options] = fetchJson().mock.calls[0];
        expect(url).toBe('https://api.groq.com/openai/v1/models');
        expect(options?.headers?.Authorization).toBe('Bearer gsk-test');
    });

    it('sends chat completions to the Groq endpoint', async () => {
        fetchJson().mockResolvedValue({ choices: [{ message: { content: 'Ciao' } }] });

        const result = await GROQ_PROVIDER_DEFINITION.complete('gsk-test', { prompt: 'hi', model: 'openai/gpt-oss-20b' });

        expect(result).toEqual({ type: 'text', text: 'Ciao' });
        expect(fetchJson().mock.calls[0][0]).toBe('https://api.groq.com/openai/v1/chat/completions');
    });

    it('is registered from aiConfig.groqApiKey and listed for connect UIs', () => {
        expect(Object.keys(createAIProviderRegistry({ groqApiKey: 'gsk-test' }))).toEqual(['groq']);
        expect(AI_PROVIDER_DESCRIPTORS.some((d) => d.id === 'groq')).toBe(true);
        expect(AI_MANIFEST.groq.when({ groqApiKey: 'gsk-test' })).toBe(true);
        expect(AI_MANIFEST.groq.when({})).toBe(false);
    });
});
