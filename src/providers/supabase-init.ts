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
 */
export function getSupabaseClient(url: string, anonKey: string): SupabaseClient {
    if (!_clients.has(url)) {
        _clients.set(url, createClient(url, anonKey));
    }
    return _clients.get(url)!;
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
