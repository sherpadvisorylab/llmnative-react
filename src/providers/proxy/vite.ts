// @ts-nocheck — scaffold template, copied to user project by CLI
import type { IncomingMessage, ServerResponse } from 'node:http';
import type { Plugin } from 'vite';

const PROXY_CALLER_HEADER = 'x-llmnative-proxy';
export const PROXY_PATH = '/api/proxy';

const readRequestBody = async (req: IncomingMessage): Promise<Buffer | undefined> => {
    const chunks: Buffer[] = [];
    for await (const chunk of req) {
        chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
    }
    return chunks.length === 0 ? undefined : Buffer.concat(chunks);
};

const writeProxyResponse = async (req: IncomingMessage, res: ServerResponse, route: string) => {
    const requestUrl = new URL(req.url || '/', 'http://localhost');
    const target = requestUrl.searchParams.get('url');

    if (req.headers[PROXY_CALLER_HEADER] !== '1') {
        res.statusCode = 403;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ error: 'Proxy access denied.' }));
        return;
    }

    if (!target) {
        res.statusCode = 400;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ error: 'Missing "url" query parameter.' }));
        return;
    }

    try {
        const targetUrl = new URL(target);
        if (targetUrl.pathname.startsWith(route) && ['localhost', '127.0.0.1'].includes(targetUrl.hostname)) {
            res.statusCode = 508;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: 'Recursive proxy target detected.', target }));
            return;
        }

        const body = await readRequestBody(req);
        const headers = new Headers();
        const skipHeaders = new Set([PROXY_CALLER_HEADER, 'host', 'origin', 'referer', 'content-length', 'transfer-encoding', 'connection']);

        Object.entries(req.headers).forEach(([key, value]) => {
            if (!value || skipHeaders.has(key.toLowerCase())) return;
            headers.set(key, Array.isArray(value) ? value.join(', ') : value);
        });

        const upstream = await fetch(target, {
            method: req.method || 'GET',
            headers,
            body: body && !['GET', 'HEAD'].includes((req.method || 'GET').toUpperCase()) ? body : undefined,
            redirect: 'follow',
        });

        res.statusCode = upstream.status;
        upstream.headers.forEach((value, key) => {
            if (key.toLowerCase() === 'content-encoding') return;
            res.setHeader(key, value);
        });
        res.end(Buffer.from(await upstream.arrayBuffer()));
    } catch (error) {
        res.statusCode = 502;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ error: error instanceof Error ? error.message : 'Proxy request failed.' }));
    }
};

export const createProxyPlugin = (route = PROXY_PATH): Plugin => ({
    name: 'llmnative-dev-proxy',
    configureServer(server) {
        server.middlewares.use(route, (req, res) => { void writeProxyResponse(req, res, route); });
    },
    configurePreviewServer(server) {
        server.middlewares.use(route, (req, res) => { void writeProxyResponse(req, res, route); });
    },
});
