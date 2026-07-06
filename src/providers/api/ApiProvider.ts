import { useProvider } from '../ProviderRegistryContext';
import type { ProviderConfigurable } from '../ProviderConfiguration';

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
 * directly — a vendor adapter is just a few lines of normal code, no framework-provided bridge.
 *
 * Adapters (same interface, different execution context — mirrors DataProviderAdapter's
 * Firebase/Supabase/Mock split), one file each like data/storage:
 * - direct.ts   — DirectApiProviderAdapter, client-resident, via proxyFetch (CORS-safe). The
 *   secret IS visible to the browser here — a dev/personal key, or a no-backend deploy, never
 *   a real shared tenant secret.
 * - firebase.ts — FirebaseApiProviderAdapter, routes through a Firebase Callable Function;
 *   the secret lives server-side, resolved there from the real tenant/user registration.
 * - supabase.ts — SupabaseApiProviderAdapter, same idea via a Supabase Edge Function.
 * - mock.ts     — MockApiProviderAdapter, resolves via a local function, no network. Dev/tests.
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

/** Convenience wrapper over useProvider('api', name) — same registry, just the ergonomic one-arg form. */
export const useApiProvider = (name: string): ApiProviderAdapter => useProvider<ApiProviderAdapter>('api', name);
