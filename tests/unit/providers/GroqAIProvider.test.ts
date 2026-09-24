/**
 * Groq AI provider test suite.
 * Groq speaks the OpenAI chat-completions wire format through
 * https://api.groq.com/openai/v1; discovery via /models must drop non-chat models
 * (whisper, TTS/Orpheus, guard/safeguard classifiers) and inactive entries.
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

vi.mock('../../../src/providers/proxy', () => ({
    proxyFetch: undefined,
    isProxyEnabled: vi.fn(() => false),
}));

vi.mock('../../../src/libs/fetch', () => ({
    fetchJson: vi.fn(),
}));

vi.mock('../../../src/conf/Prompt', () => ({
    Prompt: {
        parseRole: vi.fn(() => 'You are a helpful assistant.'),
        parsePrompt: vi.fn((prompt: string) => prompt),
    },
}));

import { GROQ_PROVIDER_DEFINITION, isGroqChatModel } from '../../../src/providers/ai/groq';
import { AI_PROVIDER_DEFINITIONS, createAIProviderRegistry } from '../../../src/providers/ai';
import { RuntimeAIProvider } from '../../../src/providers/ai/shared';
import { AI_MANIFEST } from '../../../src/providers/manifest';
import * as fetchLib from '../../../src/libs/fetch';

const fetchJson = () => vi.mocked(fetchLib.fetchJson);

beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
});

afterEach(() => {
    vi.unstubAllGlobals();
});

describe('GROQ_PROVIDER_DEFINITION', () => {
    it('exposes id, label, config key and the OpenAI-compatible base URL', () => {
        expect(GROQ_PROVIDER_DEFINITION.id).toBe('groq');
        expect(GROQ_PROVIDER_DEFINITION.label).toBe('Groq');
        expect(GROQ_PROVIDER_DEFINITION.configKey).toBe('groqApiKey');
        expect(GROQ_PROVIDER_DEFINITION.defaultModel).toBe('llama-3.3-70b-versatile');
        expect(GROQ_PROVIDER_DEFINITION.dashboardUrl).toBe('https://console.groq.com/keys');
        expect(GROQ_PROVIDER_DEFINITION.credentialFields?.map((f) => f.key)).toEqual(['apiKey']);
    });

    it('is part of the built-in provider definitions', () => {
        expect(AI_PROVIDER_DEFINITIONS).toContain(GROQ_PROVIDER_DEFINITION);
    });

    describe('isGroqChatModel()', () => {
        it('keeps chat models and drops every non-chat family', () => {
            expect(isGroqChatModel('llama-3.3-70b-versatile')).toBe(true);
            expect(isGroqChatModel('openai/gpt-oss-120b')).toBe(true);
            expect(isGroqChatModel('whisper-large-v3')).toBe(false);
            expect(isGroqChatModel('playai-tts')).toBe(false);
            expect(isGroqChatModel('canopylabs/orpheus-v1-english')).toBe(false);
            expect(isGroqChatModel('meta-llama/llama-guard-4-12b')).toBe(false);
            expect(isGroqChatModel('openai/gpt-oss-safeguard-20b')).toBe(false);
            expect(isGroqChatModel('meta-llama/llama-prompt-guard-2-86m')).toBe(false);
        });
    });

    describe('discoverModels()', () => {
        it('calls /models with the Bearer token and keeps only active chat models', async () => {
            fetchJson().mockResolvedValueOnce({
                data: [
                    { id: 'llama-3.3-70b-versatile', active: true },
                    { id: 'openai/gpt-oss-120b' },
                    { id: 'whisper-large-v3-turbo' },
                    { id: 'playai-tts-arabic' },
                    { id: 'canopylabs/orpheus-v1-english' },
                    { id: 'openai/gpt-oss-safeguard-20b' },
                    { id: 'legacy-model', active: false },
                    {},
                ],
            });

            const models = await GROQ_PROVIDER_DEFINITION.discoverModels('gsk-key');

            expect(fetchJson()).toHaveBeenCalledWith(
                'https://api.groq.com/openai/v1/models',
                expect.objectContaining({ headers: { Authorization: 'Bearer gsk-key' } }),
                undefined,
            );
            expect(models).toEqual(['llama-3.3-70b-versatile', 'openai/gpt-oss-120b']);
        });

        it('returns an empty array when the response has no data array', async () => {
            fetchJson().mockResolvedValueOnce({});
            expect(await GROQ_PROVIDER_DEFINITION.discoverModels('key')).toEqual([]);
        });
    });

    describe('complete()', () => {
        const req = { prompt: 'Say hi', model: 'llama-3.3-70b-versatile' };

        it('returns text from choices[0].message.content', async () => {
            fetchJson().mockResolvedValueOnce({ choices: [{ message: { content: 'Hi!' } }] });
            expect(await GROQ_PROVIDER_DEFINITION.complete('gsk-key', req)).toEqual({ type: 'text', text: 'Hi!' });
        });

        it('parses tool_calls in the standard OpenAI shape', async () => {
            fetchJson().mockResolvedValueOnce({
                choices: [{ message: { content: null, tool_calls: [{ id: 'call_1', type: 'function', function: { name: 'get_weather', arguments: '{"city":"Milan"}' } }] } }],
            });

            const result = await GROQ_PROVIDER_DEFINITION.complete('gsk-key', {
                ...req,
                tools: [{ name: 'get_weather', description: 'Weather', inputSchema: { type: 'object' } }],
            });

            expect(result).toEqual({ type: 'tool_calls', toolCalls: [{ id: 'call_1', name: 'get_weather', input: { city: 'Milan' } }], text: undefined });
        });

        it('includes image attachments as image_url content blocks', async () => {
            fetchJson().mockResolvedValueOnce({ choices: [{ message: { content: 'ok' } }] });

            await GROQ_PROVIDER_DEFINITION.complete('gsk-key', {
                ...req,
                attachments: [{ mimeType: 'image/png', base64: 'iVBORw0KGgo=', name: 'photo.png' }],
            });

            const body = fetchJson().mock.calls[0][1].body as { messages: { content: { type: string }[] }[] };
            const content = body.messages.find((m) => m.role === 'user')?.content;
            expect(content?.[0]).toMatchObject({ type: 'image_url', image_url: { url: 'data:image/png;base64,iVBORw0KGgo=' } });
        });

        it('decodes text attachments into text blocks', async () => {
            fetchJson().mockResolvedValueOnce({ choices: [{ message: { content: 'ok' } }] });

            await GROQ_PROVIDER_DEFINITION.complete('gsk-key', {
                ...req,
                attachments: [{ mimeType: 'text/plain', base64: 'SGVsbG8gV29ybGQ=', name: 'hello.txt' }],
            });

            const body = fetchJson().mock.calls[0][1].body as { messages: { content: { text: string }[] }[] };
            const content = body.messages.find((m) => m.role === 'user')?.content;
            expect(content?.[0].text).toContain('Hello World');
        });

        it('sends non-text, non-image attachments as file reference placeholders', async () => {
            fetchJson().mockResolvedValueOnce({ choices: [{ message: { content: 'ok' } }] });

            await GROQ_PROVIDER_DEFINITION.complete('gsk-key', {
                ...req,
                attachments: [{ mimeType: 'application/pdf', base64: 'JVBERi0=', name: 'doc.pdf' }],
            });

            const body = fetchJson().mock.calls[0][1].body as { messages: { content: { text: string }[] }[] };
            const content = body.messages.find((m) => m.role === 'user')?.content;
            expect(content?.[0].text).toContain('[File attached: doc.pdf (application/pdf)]');
        });

        it('forwards the AbortSignal to the transport', async () => {
            fetchJson().mockResolvedValueOnce({ choices: [{ message: { content: 'ok' } }] });
            const controller = new AbortController();

            await GROQ_PROVIDER_DEFINITION.complete('gsk-key', { ...req, signal: controller.signal });

            expect(fetchJson().mock.calls[0][1].signal).toBe(controller.signal);
        });
    });
});

describe('Groq registration', () => {
    it('registers only when groqApiKey is configured', () => {
        const registry = createAIProviderRegistry({ groqApiKey: 'gsk-key' });
        expect(registry.groq?.id).toBe('groq');
        expect(registry.groq?.defaultModel).toBe('llama-3.3-70b-versatile');

        expect(createAIProviderRegistry({}).groq).toBeUndefined();
    });

    it('manifest driver is gated on the groqApiKey', () => {
        const driver = AI_MANIFEST.groq;
        expect(driver.when?.({ groqApiKey: 'gsk-key' })).toBe(true);
        expect(driver.when?.({})).toBe(false);
        expect(driver.create({ groqApiKey: 'gsk-key' })).toMatchObject({ id: 'groq' });
    });

    it('falls back to fallbackModels when discovery fails', async () => {
        fetchJson().mockRejectedValueOnce(new Error('network down'));
        vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 500 }));
        vi.spyOn(console, 'warn').mockImplementation(() => {});

        const provider = new RuntimeAIProvider(GROQ_PROVIDER_DEFINITION, 'gsk-key');
        const capabilities = await provider.getCapabilities(true);

        expect(capabilities.models.map((m) => m.model)).toEqual(GROQ_PROVIDER_DEFINITION.fallbackModels);
    });
});
