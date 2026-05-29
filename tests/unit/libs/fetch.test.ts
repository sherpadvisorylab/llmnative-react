import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { proxyFetch, configureProxy } from '../../../src/providers/proxy';

describe('proxyFetch', () => {
    const originalFetch = global.fetch;

    beforeEach(() => {
        configureProxy();
        global.fetch = vi.fn(async () => new Response('ok', { status: 200 })) as typeof fetch;
    });

    afterEach(() => {
        global.fetch = originalFetch;
        configureProxy();
    });

    it('falls back to direct fetch when no proxy config is set', async () => {
        await proxyFetch('https://api.example.com/models');

        expect(global.fetch).toHaveBeenCalledTimes(1);
        expect(global.fetch).toHaveBeenCalledWith('https://api.example.com/models', undefined);
    });

    it('falls back to direct fetch when proxy is disabled', async () => {
        configureProxy({ enabled: false, route: '/api/proxy' });

        await proxyFetch('https://api.example.com/models');

        expect(global.fetch).toHaveBeenCalledTimes(1);
        expect(global.fetch).toHaveBeenCalledWith('https://api.example.com/models', undefined);
    });

    it('keeps relative requests direct even when proxy is enabled', async () => {
        configureProxy({ enabled: true, route: '/api/proxy' });

        await proxyFetch('/local/data');

        expect(global.fetch).toHaveBeenCalledTimes(1);
        expect(global.fetch).toHaveBeenCalledWith('/local/data', undefined);
    });

    it('rewrites external requests through the proxy route while preserving fetch semantics', async () => {
        configureProxy({ enabled: true, route: '/api/proxy' });

        await proxyFetch('https://api.example.com/completions', {
            method: 'POST',
            headers: {
                Authorization: 'Bearer token',
                'Content-Type': 'application/json',
            },
            body: '{"prompt":"Hello"}',
        });

        expect(global.fetch).toHaveBeenCalledTimes(1);
        const [url, init] = vi.mocked(global.fetch).mock.calls[0];

        expect(url).toBe('/api/proxy?url=https%3A%2F%2Fapi.example.com%2Fcompletions');
        expect(init?.method).toBe('POST');

        const headers = new Headers(init?.headers);
        expect(headers.get('authorization')).toBe('Bearer token');
        expect(headers.get('content-type')).toBe('application/json');
        expect(headers.get('x-llmnative-proxy')).toBe('1');

        const proxiedRequest = new Request(url as RequestInfo | URL, init);
        await expect(proxiedRequest.text()).resolves.toBe('{"prompt":"Hello"}');
    });
});
