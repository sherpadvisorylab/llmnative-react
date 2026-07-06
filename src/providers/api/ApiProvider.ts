import { useProvider } from '../ProviderRegistryContext';
import { proxyFetch } from '../proxy';

/**
 * Generic "api" provider engine — Service Gateway (docs/24-tenant-platform.md).
 *
 * Registers a third-party REST integration (Brevo, Resend, a non-streaming AI provider, ...)
 * as DATA, not hand-written adapter code: a name, fixed header/query/body fields (where a
 * secret usually lives), and a list of named endpoints. Consumers call it by endpoint name
 * — `provider.send(params)` — never touching the registration or the secret directly.
 *
 * Registered under category 'api' in the same open provider registry as everything else:
 *   setProvider('api', 'brevo', createApiProvider({...}))
 *   useApiProvider('brevo').send({ to, subject, html })
 *
 * Two execution modes, same interface either way:
 * - Client-resident (no `gatewayUrl`): merges the registration's header/query/body straight
 *   into a direct fetch. The secret IS visible to the browser in this mode — acceptable only
 *   for a dev/personal key, never a real shared tenant secret. This is also the fallback for
 *   deploys with no backend at all, so the mechanism works identically with or without one.
 * - Gateway-resident (`gatewayUrl` set): forwards only the *intent* — provider name, endpoint
 *   name, caller params — to that URL. The secret-bearing registration lives in the gateway
 *   process instead, built from the exact same createApiProvider() there; the browser never
 *   sees the header/query/body fields at all, not even for an instant.
 *
 * Composes with the existing CORS proxy (../proxy), doesn't replace it — they solve different
 * problems. The proxy answers "can this browser reach that URL at all" (most third-party REST
 * APIs don't allow direct cross-origin calls); this engine answers "who controls what's in the
 * request and where the secret lives". Both calls below go through proxyFetch(), which no-ops
 * back to a plain fetch() when the proxy isn't configured or the target is same-origin.
 */

export type ApiProviderEndpoint = {
    name: string;
    /** Default: 'POST'. */
    method?: string;
    url: string;
};

export type ApiProviderRegistration = {
    name: string;
    /**
     * Fixed fields merged into every call to any endpoint below — this is where a secret
     * normally lives (e.g. `header: { Authorization: 'Bearer <key>' }`). Always wins over
     * a matching key the caller passes in `params`; the caller only controls what's left.
     */
    header?: Record<string, string>;
    query?: Record<string, string>;
    body?: Record<string, unknown>;
    endpoints: ApiProviderEndpoint[];
    /**
     * When set, every call is forwarded to this URL as `{ provider, endpoint, params }`
     * instead of calling `endpoint.url` directly — header/query/body above are never sent
     * to the browser's fetch layer at all; they belong to the gateway-side registration.
     */
    gatewayUrl?: string;
};

export type ApiProviderCall = (params?: Record<string, unknown>) => Promise<unknown>;

/** Callable per registered endpoint name — `provider.send(params)`, `provider.discoverModels(params)`, ... */
export type ApiProvider = Record<string, ApiProviderCall>;

async function parseResponse(res: Response): Promise<unknown> {
    if (!res.ok) throw new Error(`ApiProvider request failed: ${res.status} ${res.statusText}`);
    const text = await res.text();
    return text ? JSON.parse(text) : undefined;
}

function buildGatewayCall(registration: ApiProviderRegistration, endpoint: ApiProviderEndpoint): ApiProviderCall {
    return async (params = {}) => {
        const res = await proxyFetch(registration.gatewayUrl as string, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ provider: registration.name, endpoint: endpoint.name, params }),
        });
        return parseResponse(res);
    };
}

function buildDirectCall(registration: ApiProviderRegistration, endpoint: ApiProviderEndpoint): ApiProviderCall {
    return async (params = {}) => {
        const method = (endpoint.method ?? 'POST').toUpperCase();

        const url = new URL(endpoint.url);
        const callerQuery = (params.query as Record<string, string> | undefined) ?? {};
        // Registered query wins on conflicting keys — same authoritative rule as body/header.
        Object.entries({ ...callerQuery, ...registration.query }).forEach(([key, value]) => url.searchParams.set(key, value));

        const { query: _callerQuery, ...bodyParams } = params;
        const mergedBody = { ...bodyParams, ...registration.body };

        const res = await proxyFetch(url.toString(), {
            method,
            headers: { 'Content-Type': 'application/json', ...registration.header },
            body: method === 'GET' || method === 'HEAD' ? undefined : JSON.stringify(mergedBody),
        });
        return parseResponse(res);
    };
}

export function createApiProvider(registration: ApiProviderRegistration): ApiProvider {
    const provider: ApiProvider = {};
    for (const endpoint of registration.endpoints) {
        provider[endpoint.name] = registration.gatewayUrl
            ? buildGatewayCall(registration, endpoint)
            : buildDirectCall(registration, endpoint);
    }
    return provider;
}

/** Convenience wrapper over useProvider('api', name) — same registry, just the ergonomic one-arg form. */
export const useApiProvider = (name: string): ApiProvider => useProvider<ApiProvider>('api', name);
