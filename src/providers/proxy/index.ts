import { onConfigChange } from '../../Config';
import type { ProxyConfig } from '../../Config';
import { containsServerCredential } from '../ai/serverCredentials';

export const PROXY_CALLER_HEADER = 'x-llmnative-proxy';
export const DEFAULT_PROXY_ROUTE = '/api/proxy';

const shouldProxyRequest = (url: string): boolean => {
    if (!url || url.startsWith('/')) return false;
    try {
        const target = new URL(url);
        if (typeof window !== 'undefined') {
            const current = new URL(window.location.href);
            if (target.origin === current.origin) return false;
            if (['localhost', '127.0.0.1'].includes(target.hostname) &&
                ['localhost', '127.0.0.1'].includes(current.hostname)) return false;
        }
        return true;
    } catch {
        return false;
    }
};

let _config: ProxyConfig | null = null;

export const configureProxy = (config?: ProxyConfig) => {
    _config = config ?? null;
};

onConfigChange((config) => {
    configureProxy(config.proxy);
});

/** A request that goes out without the proxy: never with a server-credential placeholder (CR-102),
 * which only the app's proxy can turn into a key. */
const carriesServerCredential = (url: string, input: Parameters<typeof fetch>[0], init?: RequestInit) =>
    containsServerCredential(url) || [...new Headers(input instanceof Request ? input.headers : init?.headers).values()].some(containsServerCredential);

const directFetch = (url: string, input: Parameters<typeof fetch>[0], init?: RequestInit) => {
    if (carriesServerCredential(url, input, init)) {
        return Promise.reject(new Error('This AI provider uses credentials held by the server: enable the proxy (providers.proxy.enabled) so that the server adds the key.'));
    }
    return globalThis.fetch(input, init);
};

export const proxyFetch: typeof fetch = (input, init) => {
    const url = typeof input === 'string' ? input
        : input instanceof URL ? input.toString()
        : (input as Request).url;
    if (!_config?.enabled) return directFetch(url, input, init);
    // A request with a server-held credential always goes through the proxy, even to a local
    // endpoint (e.g. an openai-compatible server on localhost): only the proxy holds the key.
    if (!shouldProxyRequest(url) && !carriesServerCredential(url, input, init)) return globalThis.fetch(input, init);
    const route = _config.route?.trim() || DEFAULT_PROXY_ROUTE;
    const separator = route.includes('?') ? '&' : '?';
    const proxiedUrl = `${route}${separator}url=${encodeURIComponent(url)}`;
    const sourceHeaders = input instanceof Request ? input.headers : init?.headers;
    const headers = new Headers(sourceHeaders);
    headers.set(PROXY_CALLER_HEADER, '1');
    const method = (input instanceof Request ? input.method : init?.method ?? 'GET').toUpperCase();
    const hasBody = !['GET', 'HEAD'].includes(method);
    const body = hasBody
        ? (init?.body ?? (input instanceof Request ? input.body : undefined))
        : undefined;
    return globalThis.fetch(proxiedUrl, {
        method,
        headers,
        body,
        ...(body instanceof ReadableStream ? { duplex: 'half' as const } : {}),
        signal: init?.signal ?? (input instanceof Request ? input.signal : undefined),
    });
};

export const useProxy = () => proxyFetch;

export const isProxyEnabled = () => Boolean(_config?.enabled);
