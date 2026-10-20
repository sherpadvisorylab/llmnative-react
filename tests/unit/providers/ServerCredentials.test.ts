import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { AI_PROVIDER_DEFINITIONS, createServerCredentialAIRegistry } from '../../../src/providers/ai';
import { createCloudflareProviderDefinition } from '../../../src/providers/ai/cloudflare';
import { createOpenAICompatibleProviderDefinition } from '../../../src/providers/ai/openaiCompatible';
import { isAIProviderTarget, resolveServerCredentials, serverCredential, type ServerAISecret } from '../../../src/providers/ai/server';
import { configureProxy } from '../../../src/providers/proxy';

type Sent = { url: string; headers: Record<string, string> };

/** Every request that leaves the browser, as the app's proxy receives it. */
function captureFetch(): Sent[] {
    const sent: Sent[] = [];
    vi.stubGlobal('fetch', vi.fn(async (input: string, init?: RequestInit) => {
        // Header names in lower case: the test environment keeps the case the adapter wrote.
        sent.push({ url: String(input), headers: Object.fromEntries([...new Headers(init?.headers)].map(([name, value]) => [name.toLowerCase(), value])) });
        return new Response(JSON.stringify({ data: [], models: [], content: [{ type: 'text', text: 'ok' }], choices: [{ message: { content: 'ok' } }] }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    }));
    return sent;
}

/** The provider URL a proxied request asks for. */
const targetOf = (sent: Sent) => new URL(sent.url, 'http://localhost').searchParams.get('url')!;

describe('server-held AI credentials', () => {
    beforeEach(() => configureProxy({ enabled: true }));
    afterEach(() => {
        configureProxy(undefined);
        vi.unstubAllGlobals();
    });

    it('builds the adapters of the connected providers with a placeholder for the key', () => {
        const registry = createServerCredentialAIRegistry([
            { id: 'anthropic' },
            { id: 'gemini' },
            { id: 'cloudflare', accountId: 'acc-1' },
            { id: 'openai-compatible', baseUrl: 'https://gateway.example.com/v1', label: 'Gateway' },
            // Without what their URLs are built from, these two cannot be built.
            { id: 'cloudflare' },
        ], { scope: 'acme' });

        expect(Object.keys(registry).sort()).toEqual(['anthropic', 'cloudflare', 'gemini', 'openai-compatible']);
        expect(registry['openai-compatible']?.label).toBe('Gateway');
        expect(() => createServerCredentialAIRegistry([{ id: 'openai' }], { scope: 'a b' })).toThrow(/scope/);
    });

    it('sends the placeholder where each adapter writes its key, through the proxy only', async () => {
        const sent = captureFetch();
        const registry = createServerCredentialAIRegistry([{ id: 'anthropic' }, { id: 'gemini' }, { id: 'openai' }], { scope: 'acme' });

        await registry.anthropic!.complete({ prompt: 'Hi', model: 'claude' });
        await registry.gemini!.complete({ prompt: 'Hi', model: 'gemini-pro' });
        await registry.openai!.complete({ prompt: 'Hi', model: 'gpt' });

        const to = (host: string) => sent.find((request) => new URL(targetOf(request)).host === host)!;
        expect(sent.every((request) => request.url.startsWith('/api/proxy?url='))).toBe(true);
        expect(to('api.anthropic.com').headers['x-api-key']).toBe('llmnative-server-credential:acme:anthropic');
        expect(targetOf(to('generativelanguage.googleapis.com'))).toContain('key=llmnative-server-credential:acme:gemini');
        expect(to('api.openai.com').headers.authorization).toBe('Bearer llmnative-server-credential:acme:openai');
    });

    it('never sends a placeholder straight to a provider', async () => {
        captureFetch();
        configureProxy({ enabled: false });
        const registry = createServerCredentialAIRegistry([{ id: 'openai' }], { scope: 'acme' });

        await expect(registry.openai!.complete({ prompt: 'Hi', model: 'gpt' })).rejects.toThrow(/proxy/);
        expect(fetch).not.toHaveBeenCalled();
    });

    it('covers with its hosts every URL the built-in adapters call', async () => {
        const sent = captureFetch();
        const definitions = [
            ...AI_PROVIDER_DEFINITIONS,
            createCloudflareProviderDefinition({ accountId: 'acc-1' }),
            createOpenAICompatibleProviderDefinition({
                id: 'openai-compatible', label: 'Gateway', description: '', configKey: 'openAICompatible',
                defaultModel: 'm', fallbackModels: ['m'], baseUrl: 'https://gateway.example.com/v1',
            }),
        ];
        for (const definition of definitions) {
            const before = sent.length;
            await definition.discoverModels('key').catch(() => undefined);
            await definition.complete('key', { prompt: 'Hi', model: 'm' }).catch(() => undefined);
            await definition.validateApiKey?.('key');
            const connection = { id: definition.id, accountId: 'acc-1', baseUrl: 'https://gateway.example.com/v1' };
            for (const request of sent.slice(before)) {
                expect(isAIProviderTarget(connection, new URL(targetOf(request))), `${definition.id}: ${targetOf(request)}`).toBe(true);
            }
        }
        expect(sent.length).toBeGreaterThan(definitions.length);
    });
});

describe('resolveServerCredentials', () => {
    const keys: Record<string, ServerAISecret> = {
        'acme:anthropic': { id: 'anthropic', apiKey: 'sk-ant' },
        'acme:gemini': { id: 'gemini', apiKey: 'g/key' },
        'acme:cloudflare': { id: 'cloudflare', apiKey: 'cf-token', accountId: 'acc-1' },
        'acme:openai-compatible': { id: 'openai-compatible', apiKey: 'gw-key', baseUrl: 'https://gateway.example.com/v1' },
    };
    const lookup = (scope: string, provider: string) => keys[`${scope}:${provider}`];

    it('puts the key where the placeholder is: a header, or the query of the URL', async () => {
        const header = await resolveServerCredentials({
            url: 'https://api.anthropic.com/v1/messages',
            headers: { 'x-api-key': serverCredential('acme', 'anthropic'), 'content-type': 'application/json' },
        }, lookup);
        const query = await resolveServerCredentials({
            url: `https://generativelanguage.googleapis.com/v1beta/models?key=${serverCredential('acme', 'gemini')}`,
            headers: {},
        }, lookup);

        expect(header).toEqual({ ok: true, url: 'https://api.anthropic.com/v1/messages', headers: { 'x-api-key': 'sk-ant', 'content-type': 'application/json' } });
        expect(query).toMatchObject({ ok: true, url: 'https://generativelanguage.googleapis.com/v1beta/models?key=g%2Fkey' });
    });

    it('never gives a key to a host that is not its provider', async () => {
        const elsewhere = await resolveServerCredentials({ url: 'https://evil.example.com/steal', headers: { 'x-api-key': serverCredential('acme', 'anthropic') } }, lookup);
        const otherAccount = await resolveServerCredentials({ url: 'https://api.cloudflare.com/client/v4/accounts/acc-2/ai/v1/models', headers: { authorization: `Bearer ${serverCredential('acme', 'cloudflare')}` } }, lookup);
        const otherPath = await resolveServerCredentials({ url: 'https://gateway.example.com/admin', headers: { authorization: `Bearer ${serverCredential('acme', 'openai-compatible')}` } }, lookup);
        const ownAccount = await resolveServerCredentials({ url: 'https://api.cloudflare.com/client/v4/accounts/acc-1/ai/v1/chat/completions', headers: { authorization: `Bearer ${serverCredential('acme', 'cloudflare')}` } }, lookup);

        expect(elsewhere).toEqual({ ok: false, status: 403, error: 'forbidden-target', provider: 'anthropic' });
        expect(otherAccount).toMatchObject({ ok: false, status: 403 });
        expect(otherPath).toMatchObject({ ok: false, status: 403 });
        expect(ownAccount).toMatchObject({ ok: true, headers: { authorization: 'Bearer cf-token' } });
    });

    it('refuses a provider not connected for the scope, and lets a request without placeholders through', async () => {
        const unknown = await resolveServerCredentials({ url: 'https://api.openai.com/v1/models', headers: { authorization: `Bearer ${serverCredential('other', 'openai')}` } }, lookup);
        const plain = await resolveServerCredentials({ url: 'https://example.com/page', headers: { accept: 'text/html' } }, lookup);

        expect(unknown).toEqual({ ok: false, status: 404, error: 'unknown-credential', provider: 'openai' });
        expect(plain).toEqual({ ok: true, url: 'https://example.com/page', headers: { accept: 'text/html' } });
    });
});
