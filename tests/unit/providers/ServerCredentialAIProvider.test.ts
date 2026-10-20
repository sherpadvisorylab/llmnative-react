import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('../../../src/providers/proxy', () => ({
    proxyFetch: undefined,
    isProxyEnabled: vi.fn(() => false),
}));

vi.mock('../../../src/libs/fetch', () => ({
    fetchJson: vi.fn(async () => ({ data: [] })),
}));

vi.mock('../../../src/conf/Prompt', () => ({
    Prompt: {
        parsePrompt: (prompt: string) => prompt,
        parseRole: (role: string) => role,
    },
}));

import { createAIProviderRegistry, createServerCredentialAIRegistry, buildServerCredentialPlaceholder } from '../../../src/providers/ai';
import * as fetchLib from '../../../src/libs/fetch';

const authHeaderOfLastCall = (): string | undefined => {
    const init = vi.mocked(fetchLib.fetchJson).mock.calls.at(-1)?.[1];
    const headers = init?.headers as Record<string, string> | undefined;
    return headers?.Authorization;
};

beforeEach(() => vi.clearAllMocks());

describe('createServerCredentialAIRegistry', () => {
    it('registers the same adapters as createAIProviderRegistry', () => {
        const config = { openaiApiKey: 'sk', openRouterApiKey: 'or', openCodeApiKey: 'oc' };

        const plain = createAIProviderRegistry(config);
        const server = createServerCredentialAIRegistry(config, { scope: 'tenant-1' });

        expect(Object.keys(server).sort()).toEqual(Object.keys(plain).sort());
    });

    it('sends the placeholder instead of the configured key', async () => {
        const registry = createServerCredentialAIRegistry({ openaiApiKey: 'sk-real' }, { scope: 'tenant-1' });

        await registry.openai.complete({ prompt: 'hi', model: 'gpt-4o' });

        expect(authHeaderOfLastCall()).toBe(`Bearer ${buildServerCredentialPlaceholder('tenant-1', 'openai')}`);
        expect(authHeaderOfLastCall()).not.toContain('sk-real');
    });

    it('builds the dynamic openai-compatible and cloudflare adapters with placeholders', async () => {
        const config = {
            cloudflare: { apiToken: 'cf-token', accountId: 'acc-id' },
            openAICompatible: { apiKey: 'gw-key', baseUrl: 'https://gateway.example.com/v1' },
        };

        const server = createServerCredentialAIRegistry(config, { scope: 'tenant-1' });

        expect(Object.keys(server).sort()).toEqual(Object.keys(createAIProviderRegistry(config)).sort());

        await server['openai-compatible'].complete({ prompt: 'hi', model: 'default' });
        expect(authHeaderOfLastCall()).toBe(`Bearer ${buildServerCredentialPlaceholder('tenant-1', 'openai-compatible')}`);
    });

    it('requires a non-empty scope', () => {
        expect(() => createServerCredentialAIRegistry({ openaiApiKey: 'x' }, { scope: '  ' })).toThrow(/scope/);
    });

    it('does not register anything when no connections are provided', () => {
        expect(createServerCredentialAIRegistry(undefined, { scope: 'tenant-1' })).toEqual({});
    });

    it('leaves createAIProviderRegistry unchanged (real keys still registered)', async () => {
        const registry = createAIProviderRegistry({ openaiApiKey: 'real-key' });

        await registry.openai.complete({ prompt: 'hi', model: 'gpt-4o' });

        expect(authHeaderOfLastCall()).toBe('Bearer real-key');
    });
});
