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
}
