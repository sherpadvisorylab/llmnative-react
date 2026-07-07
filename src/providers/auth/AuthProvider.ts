import type { ProviderConfigurable } from '../ProviderConfiguration';

export interface UserProfile {
    uid?: string;
    email?: string;
    displayName?: string;
    photoURL?: string;
    [key: string]: unknown;
}

export type AuthIntent = 'signIn' | 'connect' | 'signOut' | 'disconnect' | 'reauthorize';

export interface AuthSignInOptions {
    scopes?: string[];
    intent?: AuthIntent;
    [key: string]: unknown;
}

export interface AuthProviderAdapter extends ProviderConfigurable {
    getUser(): UserProfile | null;
    signIn?(options?: AuthSignInOptions): Promise<UserProfile | null>;
    signOut(): Promise<void>;
    onAuthChange(callback: (user: UserProfile | null) => void): () => void;
    getAccessToken?(scopes?: string[]): Promise<string>;
    isAuthenticated?(): boolean;
    /**
     * Custom claims embedded in the current session's token (e.g. a JWT's payload),
     * for providers backed by one — Firebase custom claims, a Supabase JWT, etc.
     * Optional: providers with no token-claims concept (e.g. plain OAuth) omit it.
     * Read-only/UI convenience — never a security boundary, the server always
     * re-verifies the raw token itself rather than trusting client-read claims.
     */
    getIdTokenClaims?(): Promise<Record<string, unknown> | null>;
}
