/**
 * CR-133: Vertex AI as an AI provider like the others — Gemini and Claude on Google Cloud, the location's host
 * and data region, the models of its catalog, the token from the proxy or from Google credentials on a server.
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const proxyFetch = vi.fn();
vi.mock('../../../src/providers/proxy/core', () => ({
    proxyFetch: (...args: unknown[]) => proxyFetch(...args),
    isProxyEnabled: () => false,
}));

import { createVertexProviderDefinition, vertexDataRegion, vertexHost, VertexAIError } from '../../../src/providers/ai/vertex';
import { createAIProvider, createAIProviderRegistry, createServerCredentialAIRegistry, AI_PROVIDER_DESCRIPTORS } from '../../../src/providers/ai';
import { isAIProviderTarget } from '../../../src/providers/ai/serverCredentials';
import { resolveServerCredentials } from '../../../src/providers/ai/server';
import { googleAccessToken } from '../../../src/providers/ai/vertexAuth';

const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json; charset=UTF-8' } });
const call = (index = 0) => ({ url: proxyFetch.mock.calls[index][0] as string, init: proxyFetch.mock.calls[index][1] as RequestInit & { headers: Record<string, string> } });
const SCHEMA = { type: 'object', required: ['ok'], properties: { ok: { type: 'boolean' } } };

beforeEach(() => {
    proxyFetch.mockReset();
    localStorage.clear();
});

describe('the location', () => {
    it('has its host: multi-regions on rep, regions with a prefix, global plain', () => {
        expect(vertexHost('eu')).toBe('aiplatform.eu.rep.googleapis.com');
        expect(vertexHost('us')).toBe('aiplatform.us.rep.googleapis.com');
        expect(vertexHost('europe-west4')).toBe('europe-west4-aiplatform.googleapis.com');
        expect(vertexHost('global')).toBe('aiplatform.googleapis.com');
    });

    it('says where the data stays', () => {
        expect(vertexDataRegion('eu')).toBe('eu');
        expect(vertexDataRegion('europe-west8')).toBe('eu');
        expect(vertexDataRegion('us-central1')).toBe('us');
        expect(vertexDataRegion('global')).toBe('global');
        expect(vertexDataRegion('asia-northeast1')).toBe('asia-northeast1');
    });

    it('refuses a project or a location that is not one', () => {
        expect(() => createVertexProviderDefinition({ projectId: 'Bad Project', location: 'eu' })).toThrow(/project id/);
        expect(() => createVertexProviderDefinition({ projectId: 'my-project', location: 'eu/../x' })).toThrow(/not a location/);
    });
});

describe('the adapter', () => {
    const definition = () => createVertexProviderDefinition({ projectId: 'my-project', location: 'eu' });

    it('lists the text models of the catalog of its location, Gemini and Claude, each with its data region', async () => {
        proxyFetch.mockImplementation(async (url: string) => (
            url.includes('/anthropic/') ? json({ publisherModels: [{ name: 'publishers/anthropic/models/claude-haiku-5-5' }] })
                : url.includes('pageToken=p2') ? json({ publisherModels: [{ name: 'publishers/google/models/gemini-4-argon' }] })
                : json({ publisherModels: [{ name: 'publishers/google/models/gemini-3.5-flash' }, { name: 'publishers/google/models/gemini-3.1-flash-image' }, { name: 'publishers/google/models/gemini-embedding-2' }], nextPageToken: 'p2' })
        ));
        const capabilities = await createAIProvider(definition(), 'tok').getCapabilities(true);
        expect(capabilities.models.map((model) => [model.model, model.dataRegion, model.structuredOutput])).toEqual([
            ['claude-haiku-5-5', 'eu', 'native'],
            ['gemini-3.5-flash', 'eu', 'native'],
            ['gemini-4-argon', 'eu', 'native'],
        ]);
        expect(call(0).url).toBe('https://aiplatform.eu.rep.googleapis.com/v1beta1/publishers/google/models?pageSize=200');
        expect(call(0).init.headers.Authorization).toBe('Bearer tok');
        expect(call(0).init.headers).not.toHaveProperty('x-goog-user-project');
        expect(proxyFetch.mock.calls.some(([url]) => String(url).includes('pageToken=p2'))).toBe(true);
    });

    it('sends the quota project when asked (the credentials of a person)', async () => {
        proxyFetch.mockResolvedValue(json({ publisherModels: [] }));
        await createVertexProviderDefinition({ projectId: 'my-project', location: 'eu', quotaProject: true }).discoverModels('tok');
        expect(call(0).init.headers['x-goog-user-project']).toBe('my-project');
    });

    it('answers with Gemini through generateContent, structured natively', async () => {
        proxyFetch.mockResolvedValue(json({ candidates: [{ content: { parts: [{ text: '{"ok":true}' }] } }], usageMetadata: { promptTokenCount: 5, candidatesTokenCount: 2 } }));
        const result = await createAIProvider(definition(), async () => 'fresh').complete({ model: 'gemini-3.5-flash', prompt: 'p', output: { schema: SCHEMA } });
        expect(call().url).toBe('https://aiplatform.eu.rep.googleapis.com/v1/projects/my-project/locations/eu/publishers/google/models/gemini-3.5-flash:generateContent');
        expect(call().init.headers.Authorization).toBe('Bearer fresh');
        expect(JSON.parse(String(call().init.body)).generationConfig).toMatchObject({ responseMimeType: 'application/json', responseSchema: { type: 'OBJECT' } });
        expect(result).toMatchObject({ data: { ok: true }, usage: { inputTokens: 5, outputTokens: 2 } });
    });

    it('answers with Claude through rawPredict, in the Messages format, the model in the URL', async () => {
        proxyFetch.mockResolvedValue(json({ content: [{ type: 'tool_use', id: 't', name: 'answer', input: { ok: false } }], usage: { input_tokens: 9, output_tokens: 4 } }));
        const result = await createAIProvider(definition(), 'tok').complete({ model: 'claude-haiku-5-5', prompt: 'p', output: { schema: SCHEMA } });
        expect(call().url).toBe('https://aiplatform.eu.rep.googleapis.com/v1/projects/my-project/locations/eu/publishers/anthropic/models/claude-haiku-5-5:rawPredict');
        const body = JSON.parse(String(call().init.body));
        expect(body).toMatchObject({ anthropic_version: 'vertex-2023-10-16', tool_choice: { type: 'tool', name: 'answer' } });
        expect(body).not.toHaveProperty('model');
        expect(result).toMatchObject({ data: { ok: false }, usage: { inputTokens: 9, outputTokens: 4 } });
    });

    it('tells a missing model, the quota and a refusal apart, without the request in the message', async () => {
        for (const [status, code] of [[404, 'not-found'], [429, 'quota'], [403, 'forbidden'], [401, 'unauthorized'], [400, 'invalid'], [503, 'unavailable']] as const) {
            proxyFetch.mockResolvedValueOnce(json({ error: { status: 'X', message: 'detail' } }, status));
            const error = await definition().complete('secret-token', { model: 'gemini-x', prompt: 'private prompt' }).catch((e) => e);
            expect(error).toBeInstanceOf(VertexAIError);
            expect(error.code).toBe(code);
            expect(error.status).toBe(status);
            expect(error.message).not.toMatch(/secret-token|private prompt/);
        }
        proxyFetch.mockRejectedValueOnce(new TypeError('fetch failed'));
        await expect(definition().complete('t', { model: 'gemini-x', prompt: 'p' })).rejects.toMatchObject({ code: 'unavailable' });
    });
});

describe('in the browser: config, registry, proxy', () => {
    it('is registered from the config with project, location and a token, and offered to connect UIs', () => {
        expect(createAIProviderRegistry({ vertex: { projectId: 'my-project', location: 'eu', accessToken: 't' } })).toHaveProperty('vertex');
        expect(createAIProviderRegistry({ vertex: { projectId: 'my-project', location: 'eu' } })).not.toHaveProperty('vertex');
        expect(AI_PROVIDER_DESCRIPTORS.find((descriptor) => descriptor.id === 'vertex')?.credentialFields.map((field) => field.key)).toEqual(['projectId', 'location', 'serviceAccount']);
    });

    it('takes its token from the server: the placeholder goes only to its project, swapped for the token the server gives', async () => {
        const registry = createServerCredentialAIRegistry([{ id: 'vertex', projectId: 'my-project', location: 'eu' }], { scope: 'acme' });
        expect(registry).toHaveProperty('vertex');
        const connection = { id: 'vertex', projectId: 'my-project' };
        expect(isAIProviderTarget(connection, new URL('https://aiplatform.eu.rep.googleapis.com/v1/projects/my-project/locations/eu/publishers/google/models/g:generateContent'))).toBe(true);
        expect(isAIProviderTarget(connection, new URL('https://europe-west4-aiplatform.googleapis.com/v1/projects/my-project/locations/europe-west4/x'))).toBe(true);
        expect(isAIProviderTarget(connection, new URL('https://aiplatform.eu.rep.googleapis.com/v1beta1/publishers/google/models'))).toBe(true);
        expect(isAIProviderTarget(connection, new URL('https://aiplatform.eu.rep.googleapis.com/v1/projects/other-project/locations/eu/x'))).toBe(false);
        expect(isAIProviderTarget(connection, new URL('https://evil.example.com/v1/projects/my-project/x'))).toBe(false);
        const resolved = await resolveServerCredentials(
            { url: 'https://aiplatform.eu.rep.googleapis.com/v1/projects/my-project/locations/eu/publishers/google/models/g:generateContent', headers: { authorization: 'Bearer llmnative-server-credential:acme:vertex' } },
            async () => ({ id: 'vertex', projectId: 'my-project', apiKey: 'minted-token' }),
        );
        expect(resolved).toMatchObject({ ok: true, headers: { authorization: 'Bearer minted-token' } });
    });
});

describe('Google credentials on a server', () => {
    it('refreshes the token of a person (gcloud ADC), keeps it until it expires, and knows its quota project', async () => {
        const dir = mkdtempSync(join(tmpdir(), 'adc-'));
        const file = join(dir, 'adc.json');
        writeFileSync(file, JSON.stringify({ type: 'authorized_user', client_id: 'c', client_secret: 's', refresh_token: 'r', quota_project_id: 'qp' }));
        const http = vi.fn(async () => json({ access_token: 'user-token', expires_in: 3600 }));
        const credentials = await googleAccessToken({ env: { GOOGLE_APPLICATION_CREDENTIALS: file }, fetch: http as unknown as typeof fetch });
        expect(credentials).toMatchObject({ kind: 'authorized-user', projectId: 'qp' });
        expect(await credentials.token()).toBe('user-token');
        expect(await credentials.token()).toBe('user-token');
        expect(http).toHaveBeenCalledTimes(1);
        expect(String((http.mock.calls[0] as unknown[])[0])).toBe('https://oauth2.googleapis.com/token');
    });

    it('falls back to the metadata server, and says so without secrets when there is none', async () => {
        const dir = mkdtempSync(join(tmpdir(), 'noadc-'));
        const http = vi.fn(async () => json({ access_token: 'server-token', expires_in: 3600 }));
        const credentials = await googleAccessToken({ env: { HOME: dir }, fetch: http as unknown as typeof fetch });
        expect(credentials.kind).toBe('metadata');
        expect(await credentials.token()).toBe('server-token');
        expect(String((http.mock.calls[0] as unknown[])[0])).toMatch(/^http:\/\/metadata\.google\.internal\//);
        const offline = await googleAccessToken({ env: { HOME: dir }, fetch: (async () => { throw new TypeError('ENOTFOUND'); }) as unknown as typeof fetch });
        await expect(offline.token()).rejects.toThrow(/none found/);
    });

    it('refuses a service account without its key', async () => {
        await expect(googleAccessToken({ serviceAccount: '{"client_email":"x"}' })).rejects.toThrow(/no client_email or private_key/);
    });
});
