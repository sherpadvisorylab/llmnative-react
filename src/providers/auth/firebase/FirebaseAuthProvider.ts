import {
    signInWithEmailAndPassword,
    signInAnonymously,
    signInWithPopup,
    signOut as firebaseSignOut,
    onAuthStateChanged,
    OAuthProvider,
    type User,
} from 'firebase/auth';
import type { AuthProviderAdapter, AuthSignInOptions, UserProfile } from '../AuthProvider';
import type { ProviderConfigurationState } from '../../ProviderConfiguration';
import type { FirebaseConfig } from '../../../Config';
import init, { getFirebaseConfigurationState, getSafeAuth } from '../../firebase-init';

// ── Sign-in options ────────────────────────────────────────────────────────────

/**
 * Firebase-specific sign-in options.
 *
 * method: 'password' (default) | 'anonymous' | 'oauth'
 * email + password: required when method = 'password'
 * provider: required when method = 'oauth' - e.g. 'github', 'apple', 'microsoft'
 *           Note: for Google OAuth use GoogleAuthProvider, not FirebaseAuthProvider.
 */
export interface FirebaseSignInOptions extends AuthSignInOptions {
    method?: 'password' | 'anonymous' | 'oauth';
    email?: string;
    password?: string;
    provider?: string;
}

// ── OAuth provider factory ─────────────────────────────────────────────────────

// Maps short names to Firebase provider IDs.
// Unlisted providers are passed through as-is (e.g. 'saml.my-provider').
const PROVIDER_IDS: Record<string, string> = {
    github:    'github.com',
    apple:     'apple.com',
    microsoft: 'microsoft.com',
    yahoo:     'yahoo.com',
    twitter:   'twitter.com',
    facebook:  'facebook.com',
};

function buildOAuthProvider(provider: string): OAuthProvider {
    const id = PROVIDER_IDS[provider] ?? provider;
    return new OAuthProvider(id);
}

// ── User mapping ───────────────────────────────────────────────────────────────

function mapUser(user: User | null): UserProfile | null {
    if (!user) return null;
    return {
        uid:         user.uid,
        email:       user.email ?? undefined,
        displayName: user.displayName ?? undefined,
        photoURL:    user.photoURL ?? undefined,
        isAnonymous: user.isAnonymous,
    };
}

// ── Provider ───────────────────────────────────────────────────────────────────

export interface FirebaseAuthProviderOptions {
    /**
     * Static config for this provider's own Firebase app. Omit when relying on
     * another consumer (e.g. providers.firebase + FirebaseDataProvider, or the
     * tenant-switching session factories in ProviderSession.tsx) to have already
     * initialized the target app — matches the provider's original zero-arg behavior.
     */
    config?: FirebaseConfig;
    /**
     * Firebase app name this provider's session lives under. Defaults to the SDK's
     * unnamed default app. Give this a dedicated name (e.g. 'control-plane') when a
     * long-lived login session must coexist with the default app used by tenant
     * switching — ProviderSession's 'data'/'storage' firebase factories reinitialize
     * the default app on every switch, which would otherwise tear down this session.
     */
    appName?: string;
}

export class FirebaseAuthProvider implements AuthProviderAdapter {
    private readonly appName?: string;
    private readonly initPromise: Promise<void>;

    constructor(private readonly options: FirebaseAuthProviderOptions = {}) {
        this.appName = options.appName;
        this.initPromise = options.config
            ? init(options.config, this.appName).then(() => undefined)
            : Promise.resolve();
    }

    getConfigurationState(): ProviderConfigurationState {
        return getFirebaseConfigurationState(this.appName);
    }

    isConfigured(): boolean {
        return this.getConfigurationState().configured;
    }

    // ── getUser ────────────────────────────────────────────────────────────────

    getUser(): UserProfile | null {
        const auth = getSafeAuth(this.appName);
        return mapUser(auth?.currentUser ?? null);
    }

    isAuthenticated(): boolean {
        return !!this.getUser();
    }

    // ── signIn ─────────────────────────────────────────────────────────────────

    async signIn(options: FirebaseSignInOptions = {}): Promise<UserProfile | null> {
        await this.initPromise;
        const auth = getSafeAuth(this.appName);
        if (!auth) throw new Error('FirebaseAuthProvider: Firebase auth is not initialized');

        const method = options.method ?? 'password';

        if (method === 'anonymous') {
            const { user } = await signInAnonymously(auth);
            return mapUser(user);
        }

        if (method === 'oauth') {
            const { provider } = options;
            if (!provider) throw new Error('FirebaseAuthProvider.signIn: provider is required for oauth');
            const { user } = await signInWithPopup(auth, buildOAuthProvider(provider));
            return mapUser(user);
        }

        // Default: email + password
        const { email, password } = options;
        if (!email || !password) {
            throw new Error('FirebaseAuthProvider.signIn: email and password are required');
        }

        const { user } = await signInWithEmailAndPassword(auth, email, password);
        return mapUser(user);
    }

    // ── signOut ────────────────────────────────────────────────────────────────

    async signOut(): Promise<void> {
        await this.initPromise;
        const auth = getSafeAuth(this.appName);
        if (!auth) throw new Error('FirebaseAuthProvider: Firebase auth is not initialized');
        await firebaseSignOut(auth);
    }

    // ── onAuthChange ───────────────────────────────────────────────────────────

    onAuthChange(callback: (user: UserProfile | null) => void): () => void {
        let unsubscribe = () => {};
        let cancelled = false;

        this.initPromise.then(() => {
            if (cancelled) return;
            const auth = getSafeAuth(this.appName);
            if (!auth) {
                callback(null);
                return;
            }
            unsubscribe = onAuthStateChanged(auth, (user) => callback(mapUser(user)));
        });

        return () => {
            cancelled = true;
            unsubscribe();
        };
    }

    // ── getAccessToken ─────────────────────────────────────────────────────────

    async getAccessToken(): Promise<string> {
        await this.initPromise;
        const auth = getSafeAuth(this.appName);
        if (!auth?.currentUser) throw new Error('FirebaseAuthProvider: no active session');
        return auth.currentUser.getIdToken();
    }

    // ── getIdTokenClaims ───────────────────────────────────────────────────────

    async getIdTokenClaims(): Promise<Record<string, unknown> | null> {
        await this.initPromise;
        const auth = getSafeAuth(this.appName);
        if (!auth?.currentUser) return null;
        const { claims } = await auth.currentUser.getIdTokenResult();
        return claims;
    }
}
