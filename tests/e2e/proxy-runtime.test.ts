// @vitest-environment node

import http from 'node:http';

import { afterAll, describe, expect, it } from 'vitest';

import { proxyFetch, configureProxy } from '../../src/providers/proxy';

const PROXY_CALLER_HEADER = 'x-llmnative-proxy';

function startServer(handler: http.RequestListener) {
    const server = http.createServer(handler);
    return new Promise<http.Server>((resolve) => {
        server.listen(0, '127.0.0.1', () => resolve(server));
    });
}

function getBaseUrl(server: http.Server) {
    const address = server.address();
    if (!address || typeof address === 'string') {
        throw new Error('Unable to resolve server address.');
    }
    return `http://127.0.0.1:${address.port}`;
}

async function readBody(req: http.IncomingMessage) {
    const chunks: Buffer[] = [];

    for await (const chunk of req) {
        chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
    }

    return Buffer.concat(chunks).toString('utf8');
}

describe('proxy forwarding', () => {
    const upstreamRequests: Array<{ method?: string; body: string; header: string | string[] | null }> = [];
    let upstreamServer: http.Server;
    let relayServer: http.Server;

    afterAll(async () => {
        await Promise.all([
            new Promise<void>((resolve) => {
                if (!relayServer) return resolve();
                relayServer.close(() => resolve());
            }),
            new Promise<void>((resolve) => {
                if (!upstreamServer) return resolve();
                upstreamServer.close(() => resolve());
            }),
        ]);
    });

    it('forwards requests through the proxy relay while preserving the Response contract', async () => {
        upstreamServer = await startServer(async (req, res) => {
            const body = await readBody(req);
            upstreamRequests.push({
                method: req.method,
                body,
                header: req.headers[PROXY_CALLER_HEADER] ?? null,
            });
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({
                ok: true,
                method: req.method,
                body,
            }));
        });

        relayServer = await startServer(async (req, res) => {
            const requestUrl = new URL(req.url || '/', 'http://127.0.0.1');
            const target = requestUrl.searchParams.get('url');

            if (req.headers[PROXY_CALLER_HEADER] !== '1') {
                res.statusCode = 403;
                res.end(JSON.stringify({ error: 'Proxy access denied.' }));
                return;
            }

            if (!target) {
                res.statusCode = 400;
                res.end(JSON.stringify({ error: 'Missing url.' }));
                return;
            }

            const body = await readBody(req);
            const headers = new Headers();

            Object.entries(req.headers).forEach(([key, value]) => {
                if (!value) return;
                if ([PROXY_CALLER_HEADER, 'host', 'origin', 'referer', 'content-length', 'transfer-encoding', 'connection'].includes(key.toLowerCase())) return;
                headers.set(key, Array.isArray(value) ? value.join(', ') : value);
            });

            const upstream = await fetch(target, {
                method: req.method || 'GET',
                headers,
                body: body && !['GET', 'HEAD'].includes((req.method || 'GET').toUpperCase()) ? body : undefined,
            });

            res.statusCode = upstream.status;
            upstream.headers.forEach((value, key) => res.setHeader(key, value));
            res.end(Buffer.from(await upstream.arrayBuffer()));
        });

        const upstreamUrl = `${getBaseUrl(upstreamServer)}/upstream`;
        const relayRoute = `${getBaseUrl(relayServer)}/api/proxy`;

        configureProxy({ enabled: true, route: relayRoute });

        const response = await proxyFetch(upstreamUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ via: 'proxyFetch' }),
        });

        expect(response.status).toBe(200);
        await expect(response.json()).resolves.toEqual({
            ok: true,
            method: 'POST',
            body: JSON.stringify({ via: 'proxyFetch' }),
        });

        expect(upstreamRequests).toHaveLength(1);
        expect(upstreamRequests[0].header).toBeNull();
    }, 15000);
});
