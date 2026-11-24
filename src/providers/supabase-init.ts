import type { SupabaseClient } from '@supabase/supabase-js';
import {
    createConfigurationState,
    getMissingKeys,
    type ProviderConfigurationState,
} from './ProviderConfiguration';

type SupabaseModule = typeof import('@supabase/supabase-js');
type CreateClient = SupabaseModule['createClient'];

const MISSING = 'Install @supabase/supabase-js to use the Supabase providers.';

// `@supabase/supabase-js` is an optional peer (CR-153): loaded when a Supabase provider first needs a client, never when
// the package is imported. An app without it (on Firebase or mock data) builds and runs, in the browser and in Node
// (Vitest, SSR, scripts). Vite turns a missing optional peer into an empty module, so `createClient` is read at call time.
let sdk: Promise<CreateClient> | undefined;

function loadCreateClient(): Promise<CreateClient> {
    sdk ??= import('@supabase/supabase-js').then(
        (mod) => {
            const create = Reflect.get(mod, 'createClient') as CreateClient | undefined;
            if (typeof create !== 'function') throw new Error(MISSING);
            return create;
        },
        (cause: unknown) => { throw new Error(MISSING, { cause }); },
    ).catch((err: unknown) => {
        sdk = undefined; // installed later (a dev server): the next call tries again
        throw err;
    });
    return sdk;
}

// ── Singleton registry keyed by project URL ─────────────────────────────────

const _clients = new Map<string, Promise<SupabaseClient>>();
const _ready = new Map<string, SupabaseClient>();

/**
 * Returns a shared SupabaseClient for the given project, loading the SDK the first time.
 * One client per URL - subsequent calls with the same URL return the same instance.
 * For single-project apps only. Multi-tenant session switching must use
 * createSupabaseClient() instead — see below.
 */
export function getSupabaseClient(url: string, anonKey: string): Promise<SupabaseClient> {
    let client = _clients.get(url);
    if (!client) {
        client = loadCreateClient().then((create) => {
            const created = create(url, anonKey);
            _ready.set(url, created);
            return created;
        });
        client.catch(() => _clients.delete(url));
        _clients.set(url, client);
    }
    return client;
}

/** The shared client of the project when already created, else undefined: for synchronous reads (the cached session). */
export function peekSupabaseClient(url: string): SupabaseClient | undefined {
    return _ready.get(url);
}

// ── Scoped, disposable client (multi-tenant session switch) ───────────────────

/**
 * Creates a fresh, uncached SupabaseClient scoped to one tenant session.
 *
 * Unlike getSupabaseClient(), this never persists a session (Supabase's default
 * client persists to localStorage) and is never reused across calls — each tenant
 * switch must produce a brand new instance with the freshly-resolved credential,
 * never a stale one left over from a previous project.
 *
 * Supabase has no "sign in with custom token" step equivalent to Firebase: the
 * control-plane mints a JWT signed with the tenant project's own JWT secret, and
 * that JWT is simply attached as the Authorization header on every request —
 * PostgREST/Realtime verify it directly, no separate session exchange call.
 */
export async function createSupabaseClient(url: string, anonKey: string, accessToken?: string): Promise<SupabaseClient> {
    const create = await loadCreateClient();
    return create(url, anonKey, {
        auth: {
            persistSession: false,
            autoRefreshToken: false,
            detectSessionInUrl: false,
        },
        global: accessToken ? { headers: { Authorization: `Bearer ${accessToken}` } } : undefined,
    });
}

/**
 * Tears down a scoped client before it's discarded: force-closes any realtime
 * channels a caller may have failed to unsubscribe from. Safety net, not a
 * replacement for callers unsubscribing their own subscribe() calls.
 */
export async function disposeSupabaseClient(client: SupabaseClient): Promise<void> {
    await client.removeAllChannels();
}

export function getSupabaseConfigurationState(
    config: { url?: string; anonKey?: string } | undefined
): ProviderConfigurationState {
    return createConfigurationState(
        'Supabase',
        getMissingKeys(config as Record<string, unknown> | undefined, ['url', 'anonKey'], 'supabase.')
    );
}

/** Clears all cached clients - useful for tests. */
export function _resetSupabaseClients(): void {
    _clients.clear();
    _ready.clear();
}
