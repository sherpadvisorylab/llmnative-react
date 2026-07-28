import { appendFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import type { IncomingMessage, ServerResponse } from 'node:http';
import type { Plugin } from 'vite';
import { LLM_LOG_ID_HEADER } from './logHeader';

const PROXY_CALLER_HEADER = 'x-llmnative-proxy';
export const PROXY_PATH = '/api/proxy';

/** Logging file di richiesta/risposta LLM — SOLO dev, mai attivo di default. Un file per
 * conversazione: il client (useAgent, CMS) genera un `logId` stabile per l'intera sessione e
 * lo manda su ogni chiamata come header `x-llmnative-log-id`; il proxy accoda ogni turno allo
 * stesso file, non lo sovrascrive. Vedi AICompleteRequest.logId per il lato client. */
export interface ProxyLogOptions {
    enabled: boolean;
    /** Cartella di destinazione, relativa alla cwd del dev server (il progetto consumer, es.
     * il CMS) o assoluta. Creata se assente. */
    dir: string;
}

const readRequestBody = async (req: IncomingMessage): Promise<Buffer | undefined> => {
    const chunks: Buffer[] = [];
    for await (const chunk of req) {
        chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
    }
    return chunks.length === 0 ? undefined : Buffer.concat(chunks);
};

/** Solo caratteri sicuri per un nome file — l'id è generato da noi (crypto.randomUUID() lato
 * client), ma niente path traversal per costruzione anche se un client si comportasse male. */
function sanitizeLogId(logId: string): string {
    return logId.replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 128) || 'unknown';
}

function prettyJsonOrRaw(text: string): string {
    if (!text.trim()) return '(empty body)';
    try {
        return JSON.stringify(JSON.parse(text), null, 2);
    } catch {
        return text;
    }
}

async function appendLogBlock(logOptions: ProxyLogOptions, logId: string, target: string, requestBody: string, status: number, responseBody: string) {
    try {
        await mkdir(logOptions.dir, { recursive: true });
        const block = [
            '',
            '='.repeat(80),
            `Turn @ ${new Date().toISOString()}`,
            `Target: ${target}`,
            '--- REQUEST BODY ---',
            prettyJsonOrRaw(requestBody),
            `--- RESPONSE BODY (status ${status}) ---`,
            prettyJsonOrRaw(responseBody),
            '='.repeat(80),
            '',
        ].join('\n');
        await appendFile(path.join(logOptions.dir, `${sanitizeLogId(logId)}.txt`), block, 'utf-8');
    } catch (error) {
        // Un log fallito non deve mai far fallire la vera richiesta — solo un avviso in console.
        console.warn('[llmnative-dev-proxy] Failed to write LLM log:', error);
    }
}

const writeProxyResponse = async (req: IncomingMessage, res: ServerResponse, route: string, logOptions?: ProxyLogOptions) => {
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
        const logId = req.headers[LLM_LOG_ID_HEADER];
        const headers = new Headers();
        // L'header di log è consumato QUI, mai inoltrato al provider upstream (stesso
        // trattamento del PROXY_CALLER_HEADER) — è un dettaglio nostro, non dell'API esterna.
        const skipHeaders = new Set([PROXY_CALLER_HEADER, LLM_LOG_ID_HEADER, 'host', 'origin', 'referer', 'content-length', 'transfer-encoding', 'connection']);

        Object.entries(req.headers).forEach(([key, value]) => {
            if (!value || skipHeaders.has(key.toLowerCase())) return;
            headers.set(key, Array.isArray(value) ? value.join(', ') : value);
        });

        const upstream = await fetch(target, {
            method: req.method || 'GET',
            headers,
            body: body && !['GET', 'HEAD'].includes((req.method || 'GET').toUpperCase())
                ? Uint8Array.from(body)
                : undefined,
            redirect: 'follow',
        });

        const responseBuffer = Buffer.from(await upstream.arrayBuffer());

        if (logOptions?.enabled && typeof logId === 'string' && logId) {
            void appendLogBlock(logOptions, logId, target, body?.toString('utf-8') ?? '', upstream.status, responseBuffer.toString('utf-8'));
        }

        res.statusCode = upstream.status;
        upstream.headers.forEach((value, key) => {
            if (key.toLowerCase() === 'content-encoding') return;
            res.setHeader(key, value);
        });
        res.end(responseBuffer);
    } catch (error) {
        res.statusCode = 502;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ error: error instanceof Error ? error.message : 'Proxy request failed.' }));
    }
};

export const createProxyPlugin = (route = PROXY_PATH, logOptions?: ProxyLogOptions): Plugin => ({
    name: 'llmnative-dev-proxy',
    configureServer(server) {
        server.middlewares.use(route, (req, res) => { void writeProxyResponse(req, res, route, logOptions); });
    },
    configurePreviewServer(server) {
        server.middlewares.use(route, (req, res) => { void writeProxyResponse(req, res, route, logOptions); });
    },
});
