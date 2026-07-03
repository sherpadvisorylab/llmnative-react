import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import {
    createConfigurationState,
    getMissingKeys,
    type ProviderConfigurationState,
} from './ProviderConfiguration';

// ── Singleton registry keyed by project URL ────────────────────────────────────

const _clients = new Map<string, SupabaseClient>();

/**
 * Returns a shared SupabaseClient for the given project.
 * One client per URL - subsequent calls with the same URL return the same instance.
 * For single-project apps only. Multi-tenant session switching must use
 * createSupabaseClient() instead — see below.
 */
export function getSupabaseClient(url: string, anonKey: string): SupabaseClient {
    if (!_clients.has(url)) {
        _clients.set(url, createClient(url, anonKey));
    }
    return _clients.get(url)!;
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
export function createSupabaseClient(url: string, anonKey: string, accessToken?: string): SupabaseClient {
    return createClient(url, anonKey, {
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
}
