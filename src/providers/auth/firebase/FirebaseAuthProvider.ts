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
import { getFirebaseConfigurationState, getSafeAuth } from '../../firebase-init';

// ── Sign-in options ────────────────────────────────────────────────────────────

/**
 * Firebase-specific sign-in options.
 *
 * method: 'password' (default) | 'anonymous' | 'oauth'
 * email + password: required when method = 'password'
 * provider: required when method = 'oauth' — e.g. 'github', 'apple', 'microsoft'
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

export class FirebaseAuthProvider implements AuthProviderAdapter {

    getConfigurationState(): ProviderConfigurationState {
        return getFirebaseConfigurationState();
    }

    isConfigured(): boolean {
        return this.getConfigurationState().configured;
    }

    // ── getUser ────────────────────────────────────────────────────────────────

    getUser(): UserProfile | null {
        const auth = getSafeAuth();
        return mapUser(auth?.currentUser ?? null);
    }

    isAuthenticated(): boolean {
        return !!this.getUser();
    }

    // ── signIn ─────────────────────────────────────────────────────────────────

    async signIn(options: FirebaseSignInOptions = {}): Promise<UserProfile | null> {
        const auth = getSafeAuth();
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
        const auth = getSafeAuth();
        if (!auth) throw new Error('FirebaseAuthProvider: Firebase auth is not initialized');
        await firebaseSignOut(auth);
    }

    // ── onAuthChange ───────────────────────────────────────────────────────────

    onAuthChange(callback: (user: UserProfile | null) => void): () => void {
        const auth = getSafeAuth();
        if (!auth) {
            callback(null);
            return () => {};
        }
        return onAuthStateChanged(auth, (user) => callback(mapUser(user)));
    }

    // ── getAccessToken ─────────────────────────────────────────────────────────

    async getAccessToken(): Promise<string> {
        const auth = getSafeAuth();
        if (!auth?.currentUser) throw new Error('FirebaseAuthProvider: no active session');
        return auth.currentUser.getIdToken();
    }
}
