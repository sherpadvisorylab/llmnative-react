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
 * Given an endpoint that returns which backend project to connect to and a scoped
 * credential for it, resolves the right adapters and swaps them in via setProvider().
 *
 * A vertical app (e.g. a CMS with tenants) wraps this in its own thin, named provider
 * (e.g. TenantProvider, mounted via <App contextProviders>) that knows what a "session"
 * means for that app — this hook only knows how to connect to a backend and get out
 * of the way.
 */

export type ProviderSessionCredential =
    | { type: 'firebaseCustomToken'; token: string }
    | { type: 'supabaseAccessToken'; token: string };

export type ProviderSessionAssignment = {
    /**
     * 'mock' has no real backend project — publicConfig.seed is fed straight into
     * MockDataProvider. Used to exercise this exact switch mechanism (fetch/resolve →
     * build adapter → setProvider → dispose previous) against demo data before a real
     * control-plane endpoint exists, so swapping 'mock' for 'firebase'/'supabase' later
     * is a config change, not new code.
     */
    type: 'firebase' | 'supabase' | 'mock';
    /** Client-safe config for this provider's project — never a secret. */
    publicConfig: Record<string, unknown>;
    /** Scoped, short-lived credential resolved server-side. Absent = anonymous/public access. */
    credential?: ProviderSessionCredential;
};

export type ProviderSessionResponse = {
    // Assumes data + storage share one project (silo isolation model) — see docs.
    providers: Partial<Record<'data' | 'storage', ProviderSessionAssignment>>;
};

const accessTokenOf = (assignment: ProviderSessionAssignment): string | undefined =>
    assignment.credential?.type === 'supabaseAccessToken' ? assignment.credential.token : undefined;

const buildDataAdapter = (assignment: ProviderSessionAssignment) => {
    if (assignment.type === 'mock') {
        // persist: false — a mock session is scoped to one switch, never leaks into
        // the next one via a shared localStorage key (mirrors "no cached secrets" for real backends).
        return new MockDataProvider(assignment.publicConfig.seed as ConstructorParameters<typeof MockDataProvider>[0], { persist: false });
    }
    return assignment.type === 'firebase'
        ? new FirebaseDataProvider()
        : new SupabaseDataProvider({
            url: assignment.publicConfig.url as string,
            anonKey: assignment.publicConfig.anonKey as string,
            accessToken: accessTokenOf(assignment),
        });
};

const buildStorageAdapter = (assignment: ProviderSessionAssignment) => {
    if (assignment.type === 'mock') {
        throw new Error('ProviderSession: no mock storage adapter exists yet — omit `storage` from a mock session response.');
    }
    return assignment.type === 'firebase'
        ? new FirebaseStorageProvider()
        : new SupabaseStorageProvider({
            url: assignment.publicConfig.url as string,
            anonKey: assignment.publicConfig.anonKey as string,
            accessToken: accessTokenOf(assignment),
        });
};

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

        // Firebase: connecting is a side effect (init() deletes the previous global app and
        // signs into the new one) that must happen once, before either adapter is built —
        // unlike Supabase, where each adapter carries its own client and no shared connect step exists.
        const firebaseAssignment = body.providers.data?.type === 'firebase'
            ? body.providers.data
            : body.providers.storage?.type === 'firebase' ? body.providers.storage : undefined;
        if (firebaseAssignment) {
            await initFirebase(firebaseAssignment.publicConfig as FirebaseConfig);
            if (firebaseAssignment.credential?.type === 'firebaseCustomToken') {
                await signInWithFirebaseCustomToken(firebaseAssignment.credential.token);
            }
        }

        if (body.providers.data) {
            await setProvider('data', 'custom', buildDataAdapter(body.providers.data));
        }
        if (body.providers.storage) {
            await setProvider('storage', 'custom', buildStorageAdapter(body.providers.storage));
        }
    }, [setProvider]);

    return { switchSession };
};
