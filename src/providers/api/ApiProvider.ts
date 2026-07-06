import { useProvider } from '../ProviderRegistryContext';
import type { ProviderConfigurable } from '../ProviderConfiguration';
import { proxyFetch } from '../proxy';

/**
 * "api" — a real provider category (docs/24-tenant-platform.md, Service Gateway), same
 * registry/lifecycle as data/storage/etc. Registers a third-party REST integration (Brevo,
 * a payments API, a non-streaming AI provider, ...) once — base URL, fixed header/query/body
 * fields (where a secret usually lives) — and exposes one generic call:
 *
 *   setProvider('api', 'payments', new DirectApiProviderAdapter({
 *       baseUrl: 'https://payments.acme.com/api',
 *       header: { Authorization: 'Bearer <secret>' },
 *   }));
 *
 *   useApiProvider('payments').fetch({ path: '/charges', method: 'post', body: { amount: 1000 } });
 *
 * Registered/fixed fields always win over a matching key the caller passes — same
 * authoritative-merge rule as the tenant-session handshake.
 *
 * Other category adapters (an EmailProviderAdapter for Brevo, an AIProviderAdapter for a
 * REST-only model) call an ApiProviderAdapter internally instead of fetch()/proxyFetch()
 * directly — see the BrevoEmailProvider example below. There's no generic "createEmailApiProvider"
 * bridge: once ApiProviderAdapter exists, a vendor adapter is just a few lines of normal code.
 *
 * Adapters (same interface, different execution context — mirrors DataProviderAdapter's
 * Firebase/Supabase/Mock split):
 * - DirectApiProviderAdapter — client-resident, calls the target directly via proxyFetch
 *   (CORS-safe). The secret IS visible to the browser here — a dev/personal key, or a
 *   no-backend deploy, never a real shared tenant secret.
 * - FirebaseApiProviderAdapter — routes through a Firebase Callable Function; the secret
 *   lives server-side, resolved there from the real tenant/user registration.
 * - SupabaseApiProviderAdapter — same idea via a Supabase Edge Function.
 * - MockApiProviderAdapter — resolves via a local function, no network. Dev/tests.
 */

export type ApiProviderRequest = {
    path: string;
    /** Default: 'POST'. */
    method?: string;
    query?: Record<string, string>;
    body?: unknown;
};

export interface ApiProviderAdapter extends ProviderConfigurable {
    fetch(request: ApiProviderRequest): Promise<unknown>;
}

async function parseResponse(res: Response): Promise<unknown> {
    if (!res.ok) throw new Error(`ApiProvider request failed: ${res.status} ${res.statusText}`);
    const text = await res.text();
    return text ? JSON.parse(text) : undefined;
}

// ── Direct (client-resident) ────────────────────────────────────────────────

export type DirectApiProviderConfig = {
    baseUrl: string;
    /** Fixed fields merged into every call — this is where a secret normally lives. Always wins over a matching key in the request. */
    header?: Record<string, string>;
    query?: Record<string, string>;
    body?: Record<string, unknown>;
};

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

// ── Mock (dev/tests, no network) ────────────────────────────────────────────

export class MockApiProviderAdapter implements ApiProviderAdapter {
    constructor(private resolver: (request: ApiProviderRequest) => unknown | Promise<unknown>) {}

    async fetch(request: ApiProviderRequest): Promise<unknown> {
        return this.resolver(request);
    }
}

// ── Firebase Callable Function (secret lives server-side) ──────────────────

export type FirebaseApiProviderConfig = {
    /** Name of the Callable Function that receives { provider, request } and does the real, secret-bearing call server-side. */
    functionName: string;
    /** The registered provider's own name — sent alongside the request so the function knows which registration to resolve. */
    providerName: string;
    region?: string;
};

export class FirebaseApiProviderAdapter implements ApiProviderAdapter {
    constructor(private config: FirebaseApiProviderConfig) {}

    async fetch(request: ApiProviderRequest): Promise<unknown> {
        const { getApp } = await import('firebase/app');
        const { getFunctions, httpsCallable } = await import('firebase/functions');
        const functions = getFunctions(getApp(), this.config.region);
        const call = httpsCallable(functions, this.config.functionName);
        const result = await call({ provider: this.config.providerName, request });
        return result.data;
    }
}

// ── Supabase Edge Function (secret lives server-side) ───────────────────────

export type SupabaseApiProviderConfig = {
    url: string;
    anonKey: string;
    /** Name of the Edge Function that receives { provider, request } and does the real, secret-bearing call server-side. */
    functionName: string;
    providerName: string;
};

export class SupabaseApiProviderAdapter implements ApiProviderAdapter {
    constructor(private config: SupabaseApiProviderConfig) {}

    async fetch(request: ApiProviderRequest): Promise<unknown> {
        const { getSupabaseClient } = await import('../supabase-init');
        const client = getSupabaseClient(this.config.url, this.config.anonKey);
        const { data, error } = await client.functions.invoke(this.config.functionName, {
            body: { provider: this.config.providerName, request },
        });
        if (error) throw error;
        return data;
    }
}

/** Convenience wrapper over useProvider('api', name) — same registry, just the ergonomic one-arg form. */
export const useApiProvider = (name: string): ApiProviderAdapter => useProvider<ApiProviderAdapter>('api', name);
