import { onConfigChange } from '../../Config';
import type { ProxyConfig } from '../../Config';
import { containsServerCredential } from '../ai/AIProvider';

export const PROXY_CALLER_HEADER = 'x-llmnative-proxy';
export const DEFAULT_PROXY_ROUTE = '/api/proxy';

/** A server-credential placeholder must be resolved server-side by the relay; sending it to a
 * provider directly would leak a useless opaque string and never authenticate. */
const requestHasServerCredential = (url: string, input: RequestInfo | URL, init?: RequestInit): boolean => {
    if (containsServerCredential(url)) return true;

    const sourceHeaders = input instanceof Request ? input.headers : init?.headers;
    if (sourceHeaders) {
        for (const [, value] of new Headers(sourceHeaders)) {
            if (containsServerCredential(value)) return true;
        }
    }

    const body = init?.body;
    if (typeof body === 'string' && containsServerCredential(body)) return true;
    if (body instanceof URLSearchParams && containsServerCredential(body.toString())) return true;

    return false;
};

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

export const proxyFetch: typeof fetch = (input, init) => {
    const url = typeof input === 'string' ? input
        : input instanceof URL ? input.toString()
        : (input as Request).url;

    if (requestHasServerCredential(url, input, init)) {
        const willRelay = Boolean(_config?.enabled) && shouldProxyRequest(url);
        if (!willRelay) {
            return Promise.reject(new Error(
                'proxyFetch: refusing to send a server-credential placeholder directly to a provider. ' +
                'Enable the proxy service (providers.proxy.enabled) or resolve the placeholder server-side.',
            ));
        }
    }

    if (!_config?.enabled) return globalThis.fetch(input, init);
    if (!shouldProxyRequest(url)) return globalThis.fetch(input, init);
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
