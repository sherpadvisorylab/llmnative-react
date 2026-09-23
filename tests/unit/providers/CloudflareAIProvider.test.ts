/**
 * Cloudflare Workers AI provider test suite.
 * Payload/response shapes mirror the real API (verified live 2026-09-23): the model catalog
 * comes from /ai/models/search (no OpenAI-style /models), errors use the { errors: [...] }
 * envelope, and an assistant tool_calls turn must carry content '' instead of null.
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';

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

import { createCloudflareProviderDefinition, CLOUDFLARE_PROVIDER_DESCRIPTOR } from '../../../src/providers/ai/cloudflare';
import { AI_PROVIDER_DESCRIPTORS, createAIProviderRegistry } from '../../../src/providers/ai';
import { extractProviderError } from '../../../src/providers/ai/shared';
import { AI_MANIFEST } from '../../../src/providers/manifest';
import * as fetchLib from '../../../src/libs/fetch';

const fetchJson = () => vi.mocked(fetchLib.fetchJson);
const ACCOUNT = '9c0d7192a5d74c5fcdf05eeb54f61e97';
const ACCOUNT_URL = `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT}`;

const model = (name: string, props: Record<string, string> = {}) => ({
    name,
    task: { name: 'Text Generation' },
    properties: Object.entries(props).map(([property_id, value]) => ({ property_id, value })),
});

beforeEach(() => vi.clearAllMocks());

describe('createCloudflareProviderDefinition()', () => {
    const definition = createCloudflareProviderDefinition({ accountId: ACCOUNT });

    it('exposes id, default model and the two credential fields', () => {
        expect(definition.id).toBe('cloudflare');
        expect(definition.defaultModel).toBe('@cf/meta/llama-3.3-70b-instruct-fp8-fast');
        expect(definition.credentialFields?.map((f) => f.key)).toEqual(['apiKey', 'accountId']);
        expect(definition.requiredConfigKeys).toEqual(['ai.cloudflare.apiToken', 'ai.cloudflare.accountId']);
        expect(definition.capabilities).toMatchObject({ supportsTemperature: true, supportsVision: true });
    });

    it('sends chat completions to the account-scoped OpenAI-compatible endpoint', async () => {
        fetchJson().mockResolvedValue({ choices: [{ message: { content: 'Ciao' } }] });

        const result = await definition.complete('cf-token', { prompt: 'hi', model: '@cf/openai/gpt-oss-20b', temperature: 0.2 });

        expect(result).toEqual({ type: 'text', text: 'Ciao' });
        const [url, options] = fetchJson().mock.calls[0];
        expect(url).toBe(`${ACCOUNT_URL}/ai/v1/chat/completions`);
        expect(options?.headers?.Authorization).toBe('Bearer cf-token');
        expect(options?.body).toMatchObject({ model: '@cf/openai/gpt-oss-20b', temperature: 0.2 });
    });

    it('parses tool_calls in the standard OpenAI shape', async () => {
        fetchJson().mockResolvedValue({
            choices: [{ message: { content: null, tool_calls: [{ id: 'call_1', type: 'function', function: { name: 'get_weather', arguments: '{"city":"Milan"}' } }] } }],
        });

        const result = await definition.complete('cf-token', {
            prompt: 'weather?',
            model: '@cf/meta/llama-3.3-70b-instruct-fp8-fast',
            tools: [{ name: 'get_weather', description: 'Weather', inputSchema: { type: 'object' } }],
        });

        expect(result).toEqual({ type: 'tool_calls', toolCalls: [{ id: 'call_1', name: 'get_weather', input: { city: 'Milan' } }], text: undefined });
    });

    it("sends '' instead of null as content of an assistant tool_calls turn", async () => {
        fetchJson().mockResolvedValue({ choices: [{ message: { content: 'Sunny, 21°C' } }] });

        await definition.complete('cf-token', {
            prompt: '',
            model: '@cf/meta/llama-3.3-70b-instruct-fp8-fast',
            history: [
                { role: 'user', content: 'weather?' },
                { role: 'assistant', toolCalls: [{ id: 'call_1', name: 'get_weather', input: { city: 'Milan' } }] },
                { role: 'tool_result', results: [{ toolCallId: 'call_1', name: 'get_weather', output: { tempC: 21 } }] },
            ],
        });

        const messages = (fetchJson().mock.calls[0][1]?.body as { messages: Array<Record<string, unknown>> }).messages;
        const assistant = messages.find((m) => m.role === 'assistant');
        expect(assistant?.content).toBe('');
        expect(assistant?.tool_calls).toHaveLength(1);
        expect(messages.at(-1)).toMatchObject({ role: 'tool', tool_call_id: 'call_1' });
    });

    it('discovers text-generation models via ai/models/search, skipping Workers Paid models and classifiers', async () => {
        fetchJson().mockResolvedValue({
            success: true,
            result: [
                model('@cf/openai/gpt-oss-120b', { function_calling: 'true' }),
                model('@cf/moonshotai/kimi-k2.6', { require_workers_paid: 'true' }),
                model('@cf/meta/llama-guard-3-8b'),
                model('@cf/qwen/qwen3-30b-a3b-fp8'),
            ],
        });

        const models = await definition.discoverModels('cf-token');

        expect(models).toEqual(['@cf/openai/gpt-oss-120b', '@cf/qwen/qwen3-30b-a3b-fp8']);
        const url = new URL(fetchJson().mock.calls[0][0]);
        expect(url.origin + url.pathname).toBe(`${ACCOUNT_URL}/ai/models/search`);
        expect(url.searchParams.get('task')).toBe('Text Generation');
        expect(url.searchParams.get('hide_experimental')).toBe('true');
        expect(fetchJson()).toHaveBeenCalledTimes(1);
    });

    it('keeps Workers Paid models when includePaidModels is set', async () => {
        fetchJson().mockResolvedValue({ success: true, result: [model('@cf/moonshotai/kimi-k2.6', { require_workers_paid: 'true' })] });

        const paid = createCloudflareProviderDefinition({ accountId: ACCOUNT, includePaidModels: true });

        expect(await paid.discoverModels('cf-token')).toEqual(['@cf/moonshotai/kimi-k2.6']);
    });

    it('follows catalog pagination while pages are full', async () => {
        const fullPage = Array.from({ length: 100 }, (_, i) => model(`@cf/test/m${i}`));
        fetchJson()
            .mockResolvedValueOnce({ success: true, result: fullPage })
            .mockResolvedValueOnce({ success: true, result: [model('@cf/test/last')] });

        const models = await definition.discoverModels('cf-token');

        expect(models).toHaveLength(101);
        expect(new URL(fetchJson().mock.calls[1][0]).searchParams.get('page')).toBe('2');
    });

    it('validateApiKey: valid when the catalog call succeeds', async () => {
        fetchJson().mockResolvedValue({ success: true, result: [] });

        expect(await definition.validateApiKey?.('cf-token')).toEqual({ valid: true });
        expect(new URL(fetchJson().mock.calls[0][0]).searchParams.get('per_page')).toBe('1');
    });

    it('validateApiKey: surfaces the Cloudflare error message (wrong account/token)', async () => {
        fetchJson().mockRejectedValue({ success: false, errors: [{ code: 10000, message: 'Authentication error' }] });

        expect(await definition.validateApiKey?.('bad')).toEqual({ valid: false, error: 'Authentication error' });
    });
});

describe('extractProviderError() — Cloudflare envelope', () => {
    it('returns the first errors[].message', () => {
        expect(extractProviderError({ errors: [{ code: 5035, message: 'not available on the Workers Free plan' }] }))
            .toBe('not available on the Workers Free plan');
    });
});

describe('Cloudflare registration', () => {
    it('registers only when both apiToken and accountId are configured', () => {
        const registry = createAIProviderRegistry({ cloudflare: { apiToken: 'cf-token', accountId: ACCOUNT, defaultModel: '@cf/openai/gpt-oss-20b' } });
        expect(registry.cloudflare?.id).toBe('cloudflare');
        expect(registry.cloudflare?.defaultModel).toBe('@cf/openai/gpt-oss-20b');

        expect(createAIProviderRegistry({ cloudflare: { apiToken: 'cf-token' } }).cloudflare).toBeUndefined();
        expect(createAIProviderRegistry({ cloudflare: { accountId: ACCOUNT } }).cloudflare).toBeUndefined();
    });

    it('manifest driver is gated on both credentials', () => {
        const driver = AI_MANIFEST.cloudflare;
        expect(driver.when?.({ cloudflare: { apiToken: 't', accountId: ACCOUNT } })).toBe(true);
        expect(driver.when?.({ cloudflare: { apiToken: 't' } })).toBe(false);
        expect(driver.create({ cloudflare: { apiToken: 't', accountId: ACCOUNT } })).toMatchObject({ id: 'cloudflare' });
    });

    it('is listed among the connectable AI provider descriptors', () => {
        expect(AI_PROVIDER_DESCRIPTORS).toContainEqual(CLOUDFLARE_PROVIDER_DESCRIPTOR);
        expect(CLOUDFLARE_PROVIDER_DESCRIPTOR.credentialFields.map((f) => f.key)).toEqual(['apiKey', 'accountId']);
    });
});
