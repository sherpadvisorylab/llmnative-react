import type { ApiProviderAdapter, ApiProviderRequest } from './ApiProvider';
import { proxyFetch } from '../proxy';

export type DirectApiProviderConfig = {
    baseUrl: string;
    /** Fixed fields merged into every call — this is where a secret normally lives. Always wins over a matching key in the request. */
    header?: Record<string, string>;
    query?: Record<string, string>;
    body?: Record<string, unknown>;
};

async function parseResponse(res: Response): Promise<unknown> {
    if (!res.ok) throw new Error(`ApiProvider request failed: ${res.status} ${res.statusText}`);
    const text = await res.text();
    return text ? JSON.parse(text) : undefined;
}

/** Client-resident: calls the target directly via proxyFetch (CORS-safe). Secret visible to the browser — dev/personal key or no-backend deploy only. */
export class DirectApiProviderAdapter implements ApiProviderAdapter {
    constructor(private config: DirectApiProviderConfig) {}

    async fetch(request: ApiProviderRequest): Promise<unknown> {
        const method = (request.method ?? 'POST').toUpperCase();

        const url = new URL(this.config.baseUrl.replace(/\/+$/, '') + '/' + request.path.replace(/^\/+/, ''));
        Object.entries({ ...request.query, ...this.config.query }).forEach(([key, value]) => url.searchParams.set(key, value));

        const mergedBody = { ...(request.body as Record<string, unknown> | undefined), ...this.config.body };

        const res = await proxyFetch(url.toString(), {
            method,
            headers: { 'Content-Type': 'application/json', ...this.config.header },
            body: method === 'GET' || method === 'HEAD' ? undefined : JSON.stringify(mergedBody),
        });
        return parseResponse(res);
    }
}
