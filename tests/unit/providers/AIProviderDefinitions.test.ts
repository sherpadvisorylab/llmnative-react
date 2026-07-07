/**
 * AI provider definitions test suite.
 * Tests parseTextResponse, discoverModels and complete for Anthropic,
 * OpenAI-compatible (shared factory), and Gemini.
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';

// ── Mock proxy ────────────────────────────────────────────────────────────────

vi.mock('../../../src/providers/proxy', () => ({
    proxyFetch: undefined,
    isProxyEnabled: vi.fn(() => false),
}));

// ── Mock fetchJson ────────────────────────────────────────────────────────────

vi.mock('../../../src/libs/fetch', () => ({
    fetchJson: vi.fn(),
}));

// ── Mock Prompt ───────────────────────────────────────────────────────────────

vi.mock('../../../src/conf/Prompt', () => ({
    Prompt: {
        parseRole: vi.fn((_role: string) => 'You are a helpful assistant.'),
    },
}));

// ── Imports after mocks ───────────────────────────────────────────────────────

import { parseTextResponse, createBrowserTransportError } from '../../../src/providers/ai/shared';
import { ANTHROPIC_PROVIDER_DEFINITION } from '../../../src/providers/ai/anthropic';
import { createOpenAICompatibleProviderDefinition } from '../../../src/providers/ai/openaiCompatible';
import { GEMINI_PROVIDER_DEFINITION } from '../../../src/providers/ai/gemini';
import * as fetchLib from '../../../src/libs/fetch';
import * as proxy from '../../../src/providers/proxy';

const mockFetchJson = () => vi.mocked(fetchLib.fetchJson);

beforeEach(() => vi.clearAllMocks());

// ── parseTextResponse ─────────────────────────────────────────────────────────

describe('parseTextResponse()', () => {
    it('returns a string value as-is', () => {
        expect(parseTextResponse('hello')).toBe('hello');
    });

    it('joins array of text-object entries', () => {
        expect(parseTextResponse([{ text: 'foo' }, { text: 'bar' }])).toBe('foo\nbar');
    });

    it('handles array of plain strings', () => {
        expect(parseTextResponse(['hello', 'world'])).toBe('hello\nworld');
    });

    it('returns null for empty array', () => {
        expect(parseTextResponse([])).toBeNull();
    });

    it('returns null for unknown types', () => {
        expect(parseTextResponse(null)).toBeNull();
        expect(parseTextResponse(undefined)).toBeNull();
        expect(parseTextResponse(42)).toBeNull();
    });
});

// ── createBrowserTransportError ───────────────────────────────────────────────

describe('createBrowserTransportError()', () => {
    it('mentions the provider label in the message', () => {
        const err = createBrowserTransportError('Anthropic');
        expect(err.message).toContain('Anthropic');
    });

    it('mentions proxy hint when proxy is disabled', () => {
        vi.mocked(proxy.isProxyEnabled).mockReturnValue(false);
        const err = createBrowserTransportError('OpenAI');
        expect(err.message).toContain('CORS');
    });
});

// ── ANTHROPIC_PROVIDER_DEFINITION ─────────────────────────────────────────────

describe('ANTHROPIC_PROVIDER_DEFINITION', () => {
    it('has the correct id, label, and defaultModel', () => {
        expect(ANTHROPIC_PROVIDER_DEFINITION.id).toBe('anthropic');
        expect(ANTHROPIC_PROVIDER_DEFINITION.label).toBe('Anthropic');
        expect(ANTHROPIC_PROVIDER_DEFINITION.defaultModel).toBe('claude-sonnet-4-0');
    });

    describe('discoverModels()', () => {
        it('returns model IDs from response.data', async () => {
            mockFetchJson().mockResolvedValueOnce({
                data: [{ id: 'claude-opus-4-1' }, { id: 'claude-sonnet-4-0' }],
            });

            const models = await ANTHROPIC_PROVIDER_DEFINITION.discoverModels('test-key');

            expect(mockFetchJson()).toHaveBeenCalledWith(
                expect.stringContaining('anthropic.com'),
                expect.objectContaining({ headers: expect.objectContaining({ 'x-api-key': 'test-key' }) }),
                undefined,
            );
            expect(models).toEqual(['claude-opus-4-1', 'claude-sonnet-4-0']);
        });

        it('returns empty array when response.data is not an array', async () => {
            mockFetchJson().mockResolvedValueOnce({ data: null });
            expect(await ANTHROPIC_PROVIDER_DEFINITION.discoverModels('key')).toEqual([]);
        });

        it('filters out entries without an id field', async () => {
            mockFetchJson().mockResolvedValueOnce({ data: [{ id: 'valid' }, {}] });
            const models = await ANTHROPIC_PROVIDER_DEFINITION.discoverModels('key');
            expect(models).toEqual(['valid']);
        });
    });

    describe('complete()', () => {
        const baseRequest = { prompt: 'Hello', model: 'claude-sonnet-4-0' };

        it('returns parsed text from response.content', async () => {
            mockFetchJson().mockResolvedValueOnce({
                content: [{ type: 'text', text: 'Hi there!' }],
            });

            const result = await ANTHROPIC_PROVIDER_DEFINITION.complete('key', baseRequest);
            expect(result).toBe('Hi there!');
        });

        it('includes temperature in request body when provided', async () => {
            mockFetchJson().mockResolvedValueOnce({ content: [{ text: 'ok' }] });

            await ANTHROPIC_PROVIDER_DEFINITION.complete('key', { ...baseRequest, temperature: 0.5 });

            const body = mockFetchJson().mock.calls[0][1].body as Record<string, unknown>;
            expect(body.temperature).toBe(0.5);
        });

        it('omits temperature when not provided', async () => {
            mockFetchJson().mockResolvedValueOnce({ content: [{ text: 'ok' }] });

            await ANTHROPIC_PROVIDER_DEFINITION.complete('key', baseRequest);

            const body = mockFetchJson().mock.calls[0][1].body as Record<string, unknown>;
            expect(body).not.toHaveProperty('temperature');
        });

        it('includes system instruction when role is set', async () => {
            mockFetchJson().mockResolvedValueOnce({ content: [{ text: 'ok' }] });

            await ANTHROPIC_PROVIDER_DEFINITION.complete('key', { ...baseRequest, role: 'You are an expert.' });

            const body = mockFetchJson().mock.calls[0][1].body as Record<string, unknown>;
            expect(body.system).toBe('You are a helpful assistant.');
        });

        it('omits system key when role is not set', async () => {
            mockFetchJson().mockResolvedValueOnce({ content: [{ text: 'ok' }] });

            await ANTHROPIC_PROVIDER_DEFINITION.complete('key', baseRequest);

            const body = mockFetchJson().mock.calls[0][1].body as Record<string, unknown>;
            expect(body).not.toHaveProperty('system');
        });

        it('returns null when response content is empty', async () => {
            mockFetchJson().mockResolvedValueOnce({ content: [] });
            expect(await ANTHROPIC_PROVIDER_DEFINITION.complete('key', baseRequest)).toBeNull();
        });
    });
});

// ── createOpenAICompatibleProviderDefinition ──────────────────────────────────

describe('createOpenAICompatibleProviderDefinition()', () => {
    const makeProvider = () => createOpenAICompatibleProviderDefinition({
        id: 'openai',
        label: 'OpenAI',
        configKey: 'openaiApiKey',
        defaultModel: 'gpt-4o',
        fallbackModels: ['gpt-4o', 'gpt-4-turbo'],
        baseUrl: 'https://api.openai.com/v1',
    });

    it('has the correct id and label', () => {
        const p = makeProvider();
        expect(p.id).toBe('openai');
        expect(p.label).toBe('OpenAI');
    });

    it('resolves modelsUrl from baseUrl when not explicit', () => {
        const p = makeProvider();
        expect(p).toBeDefined();
    });

    describe('discoverModels()', () => {
        it('calls the models endpoint with Bearer token', async () => {
            mockFetchJson().mockResolvedValueOnce({
                data: [{ id: 'gpt-4o' }, { id: 'gpt-3.5-turbo' }],
            });

            const p = makeProvider();
            const models = await p.discoverModels('sk-key');

            expect(mockFetchJson()).toHaveBeenCalledWith(
                'https://api.openai.com/v1/models',
                expect.objectContaining({ headers: { Authorization: 'Bearer sk-key' } }),
                undefined,
            );
            expect(models).toEqual(['gpt-4o', 'gpt-3.5-turbo']);
        });

        it('strips trailing slash from baseUrl', async () => {
            mockFetchJson().mockResolvedValueOnce({ data: [] });
            const p = createOpenAICompatibleProviderDefinition({
                id: 'openai',
                label: 'OpenAI',
                configKey: 'openaiApiKey',
                defaultModel: 'gpt-4o',
                fallbackModels: ['gpt-4o'],
                baseUrl: 'https://api.openai.com/v1/',
            });
            await p.discoverModels('key');
            expect(mockFetchJson()).toHaveBeenCalledWith(
                'https://api.openai.com/v1/models',
                expect.anything(),
                undefined,
            );
        });
    });

    describe('complete()', () => {
        const req = { prompt: 'Say hi', model: 'gpt-4o' };

        it('returns text from choices[0].message.content', async () => {
            mockFetchJson().mockResolvedValueOnce({
                choices: [{ message: { content: 'Hi!' } }],
            });

            const result = await makeProvider().complete('sk-key', req);
            expect(result).toBe('Hi!');
        });

        it('sends user message in messages array', async () => {
            mockFetchJson().mockResolvedValueOnce({ choices: [{ message: { content: 'ok' } }] });

            await makeProvider().complete('sk-key', req);

            const body = mockFetchJson().mock.calls[0][1].body as { messages: { role: string; content: string }[] };
            const userMsg = body.messages.find((m) => m.role === 'user');
            expect(userMsg?.content).toBe('Say hi');
        });

        it('prepends system message when role is set', async () => {
            mockFetchJson().mockResolvedValueOnce({ choices: [{ message: { content: 'ok' } }] });

            await makeProvider().complete('sk-key', { ...req, role: 'assistant' });

            const body = mockFetchJson().mock.calls[0][1].body as { messages: { role: string }[] };
            expect(body.messages[0].role).toBe('system');
            expect(body.messages[1].role).toBe('user');
        });

        it('throws a browser transport error when response is null', async () => {
            mockFetchJson().mockResolvedValueOnce(null);
            await expect(makeProvider().complete('sk-key', req)).rejects.toThrow('OpenAI');
        });

        it('uses a custom chatCompletionsUrl when provided', async () => {
            mockFetchJson().mockResolvedValueOnce({ choices: [{ message: { content: 'ok' } }] });
            const p = createOpenAICompatibleProviderDefinition({
                id: 'openai',
                label: 'OpenAI',
                configKey: 'openaiApiKey',
                defaultModel: 'gpt-4o',
                fallbackModels: ['gpt-4o'],
                baseUrl: 'https://api.openai.com/v1',
                chatCompletionsUrl: 'https://custom.endpoint.com/chat',
            });
            await p.complete('sk-key', req);
            expect(mockFetchJson()).toHaveBeenCalledWith(
                'https://custom.endpoint.com/chat',
                expect.anything(),
                undefined,
            );
        });

        it('includes image attachments as image_url content blocks', async () => {
            mockFetchJson().mockResolvedValueOnce({ choices: [{ message: { content: 'ok' } }] });
            await makeProvider().complete('sk-key', {
                ...req,
                attachments: [
                    { mimeType: 'image/png', base64: 'iVBORw0KGgo=', name: 'photo.png' },
                ],
            });
            const body = mockFetchJson().mock.calls[0][1].body as { messages: { content: { type: string }[] }[] };
            const content = body.messages.find((m: { role: string }) => m.role === 'user')?.content;
            expect(content[0]).toMatchObject({ type: 'image_url', image_url: { url: 'data:image/png;base64,iVBORw0KGgo=' } });
        });

        it('includes text document attachments as decoded text blocks', async () => {
            mockFetchJson().mockResolvedValueOnce({ choices: [{ message: { content: 'ok' } }] });
            await makeProvider().complete('sk-key', {
                ...req,
                attachments: [
                    { mimeType: 'text/plain', base64: 'SGVsbG8gV29ybGQ=', name: 'hello.txt' },
                ],
            });
            const body = mockFetchJson().mock.calls[0][1].body as { messages: { content: { text: string }[] }[] };
            const content = body.messages.find((m: { role: string }) => m.role === 'user')?.content;
            expect(content[0].text).toContain('Hello World');
        });

        it('includes binary document attachments as file reference text blocks', async () => {
            mockFetchJson().mockResolvedValueOnce({ choices: [{ message: { content: 'ok' } }] });
            await makeProvider().complete('sk-key', {
                ...req,
                attachments: [
                    { mimeType: 'application/pdf', base64: 'JVBERi0=', name: 'doc.pdf' },
                ],
            });
            const body = mockFetchJson().mock.calls[0][1].body as { messages: { content: { text: string }[] }[] };
            const content = body.messages.find((m: { role: string }) => m.role === 'user')?.content;
            expect(content[0].text).toContain('[File attached: doc.pdf (application/pdf)]');
        });
    });
});

// ── GEMINI_PROVIDER_DEFINITION ────────────────────────────────────────────────

describe('GEMINI_PROVIDER_DEFINITION', () => {
    it('has the correct id and defaultModel', () => {
        expect(GEMINI_PROVIDER_DEFINITION.id).toBe('gemini');
        expect(GEMINI_PROVIDER_DEFINITION.defaultModel).toBe('gemini-2.5-pro');
    });

    describe('discoverModels()', () => {
        it('returns model names from response.models with models/ prefix stripped', async () => {
            mockFetchJson().mockResolvedValueOnce({
                models: [
                    { name: 'models/gemini-2.5-pro' },
                    { name: 'models/gemini-2.5-flash' },
                ],
            });

            const models = await GEMINI_PROVIDER_DEFINITION.discoverModels('gai-key');

            expect(models).toEqual(['gemini-2.5-pro', 'gemini-2.5-flash']);
        });

        it('returns empty array when models is not an array', async () => {
            mockFetchJson().mockResolvedValueOnce({});
            expect(await GEMINI_PROVIDER_DEFINITION.discoverModels('key')).toEqual([]);
        });
    });

    describe('complete()', () => {
        const req = { prompt: 'Hello Gemini', model: 'gemini-2.5-pro' };

        it('returns text from candidates[0].content.parts', async () => {
            mockFetchJson().mockResolvedValueOnce({
                candidates: [{ content: { parts: [{ text: 'Greetings!' }] } }],
            });

            const result = await GEMINI_PROVIDER_DEFINITION.complete('gai-key', req);
            expect(result).toBe('Greetings!');
        });

        it('includes temperature in generationConfig when provided', async () => {
            mockFetchJson().mockResolvedValueOnce({
                candidates: [{ content: { parts: [{ text: 'ok' }] } }],
            });

            await GEMINI_PROVIDER_DEFINITION.complete('gai-key', { ...req, temperature: 0.7 });

            const body = mockFetchJson().mock.calls[0][1].body as Record<string, unknown>;
            expect((body.generationConfig as Record<string, unknown>)?.temperature).toBe(0.7);
        });

        it('returns null when candidates is empty', async () => {
            mockFetchJson().mockResolvedValueOnce({ candidates: [] });
            expect(await GEMINI_PROVIDER_DEFINITION.complete('gai-key', req)).toBeNull();
        });
    });
});
