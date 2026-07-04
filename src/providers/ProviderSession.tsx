import { useCallback } from 'react';
import { useSetProvider } from './ProviderRegistryContext';
import type { FirebaseConfig } from '../Config';
import initFirebase, { signInWithFirebaseCustomToken } from './firebase-init';
import { FirebaseDataProvider } from './data/firebase';
import { SupabaseDataProvider } from './data/supabase';
import { MockDataProvider } from './data/mock';
import { FirebaseStorageProvider } from './storage/firebase';
import { SupabaseStorageProvider } from './storage/supabase';

/**
 * Generic multi-backend session switch — no domain vocabulary (tenant, workspace, ...).
 * Given an endpoint that returns which backend project to connect to (per category —
 * data, storage, or any custom category a vertical registered) and a scoped credential
 * for it, resolves the right adapter and swaps it in via setProvider().
 *
 * A vertical app (e.g. a CMS with tenants) wraps this in its own thin, named provider
 * (e.g. TenantProvider, mounted via <App contextProviders>) that knows what a "session"
 * means for that app — this hook only knows how to connect to a backend and get out
 * of the way.
 */

export type ProviderSessionCredential = { type: string } & Record<string, unknown>;

export type ProviderSessionAssignment = {
    /**
     * Matched against the factory registry below — 'firebase'/'supabase'/'mock' are
     * built in, a vertical can register more with registerProviderSessionFactory().
     * An assignment whose (category, type) has no registered factory is discarded,
     * not an error — a session response can describe categories/types this particular
     * app build doesn't know about without breaking the switch for the ones it does.
     */
    type: string;
    /** Client-safe config for this provider's project — never a secret. */
    publicConfig: Record<string, unknown>;
    /** Scoped, short-lived credential resolved server-side. Absent = anonymous/public access. */
    credential?: ProviderSessionCredential;
};

/** category (data, storage, or any custom one) → assignment. Open-ended on purpose. */
export type ProviderSessionResponse = {
    providers: Record<string, ProviderSessionAssignment>;
};

export type ProviderSessionFactory = (assignment: ProviderSessionAssignment) => unknown | Promise<unknown>;

const factories: Record<string, Record<string, ProviderSessionFactory>> = {};

/**
 * Registers how to turn a ProviderSessionAssignment into a live adapter for a given
 * (category, type) pair. Callable anytime — at module load, or later once a feature
 * that needs it is loaded — not only at <App> bootstrap.
 */
export const registerProviderSessionFactory = (category: string, type: string, factory: ProviderSessionFactory): void => {
    (factories[category] ??= {})[type] = factory;
};

const accessTokenOf = (assignment: ProviderSessionAssignment): string | undefined =>
    typeof assignment.credential?.token === 'string' ? assignment.credential.token : undefined;

// Firebase's app is a single global namespace (see firebase-init.ts) — connecting is a
// side effect that must run before the adapter is used, but init() is idempotent when
// the appId hasn't changed, so calling this once per data + once per storage assignment
// (same project, same config) is safe — the second call is a same-config no-op, and
// re-signing with the same unexpired custom token is harmless.
const connectFirebase = async (assignment: ProviderSessionAssignment): Promise<void> => {
    await initFirebase(assignment.publicConfig as FirebaseConfig);
    if (assignment.credential?.type === 'firebaseCustomToken') {
        await signInWithFirebaseCustomToken(assignment.credential.token as string);
    }
};

// ── Built-in factories ──────────────────────────────────────────────────────

registerProviderSessionFactory('data', 'mock', (assignment) =>
    // persist: false — a mock session is scoped to one switch, never leaks into the next
    // one via a shared localStorage key (mirrors "no cached secrets" for real backends).
    new MockDataProvider(assignment.publicConfig.seed as ConstructorParameters<typeof MockDataProvider>[0], { persist: false }),
);
registerProviderSessionFactory('data', 'firebase', async (assignment) => {
    await connectFirebase(assignment);
    return new FirebaseDataProvider();
});
registerProviderSessionFactory('data', 'supabase', (assignment) => new SupabaseDataProvider({
    url: assignment.publicConfig.url as string,
    anonKey: assignment.publicConfig.anonKey as string,
    accessToken: accessTokenOf(assignment),
}));

registerProviderSessionFactory('storage', 'firebase', async (assignment) => {
    await connectFirebase(assignment);
    return new FirebaseStorageProvider();
});
registerProviderSessionFactory('storage', 'supabase', (assignment) => new SupabaseStorageProvider({
    url: assignment.publicConfig.url as string,
    anonKey: assignment.publicConfig.anonKey as string,
    accessToken: accessTokenOf(assignment),
}));
// No 'storage'/'mock' factory — omit `storage` from a mock session response until one exists.

/**
 * Either a URL to fetch (real backend) or a resolver function that produces the same
 * response shape directly (e.g. a mock backend, or any non-HTTP source). Everything
 * downstream of "here's the response body" is identical either way — only the transport
 * differs, so swapping a mock resolver for a real endpoint later touches no other code.
 */
export type SwitchProviderSessionFn = (
    source: string | (() => Promise<ProviderSessionResponse>),
    fetchOptions?: RequestInit,
) => Promise<void>;

export const useProviderSession = (): { switchSession: SwitchProviderSessionFn } => {
    const setProvider = useSetProvider();

    const switchSession = useCallback<SwitchProviderSessionFn>(async (source, fetchOptions) => {
        let body: ProviderSessionResponse;
        if (typeof source === 'function') {
            body = await source();
        } else {
            const res = await fetch(source, fetchOptions);
            if (!res.ok) throw new Error(`Provider session request failed: ${res.status} ${res.statusText}`);
            body = await res.json() as ProviderSessionResponse;
        }

        for (const [category, assignment] of Object.entries(body.providers)) {
            const factory = factories[category]?.[assignment.type];
            if (!factory) {
                console.warn(`ProviderSession: no factory registered for category "${category}" type "${assignment.type}" — discarding. Register one with registerProviderSessionFactory().`);
                continue;
            }
            const adapter = await factory(assignment);
            await setProvider(category, 'custom', adapter);
        }
    }, [setProvider]);

    return { switchSession };
};
