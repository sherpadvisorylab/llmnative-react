import type { ProviderConfigurable } from '../ProviderConfiguration';

export interface UserProfile {
    uid?: string;
    email?: string;
    displayName?: string;
    photoURL?: string;
    [key: string]: any;
}

export type AuthIntent = 'signIn' | 'connect' | 'signOut' | 'disconnect' | 'reauthorize';

export interface AuthSignInOptions {
    scopes?: string[];
    intent?: AuthIntent;
    [key: string]: any;
}

export interface AuthProviderAdapter extends ProviderConfigurable {
    getUser(): UserProfile | null;
    signIn?(options?: AuthSignInOptions): Promise<UserProfile | null>;
    signOut(): Promise<void>;
    onAuthChange(callback: (user: UserProfile | null) => void): () => void;
    getAccessToken?(scopes?: string[]): Promise<string>;
    isAuthenticated?(): boolean;
}
