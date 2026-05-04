export interface UserProfile {
    uid?: string;
    email?: string;
    displayName?: string;
    photoURL?: string;
    [key: string]: any;
}

export interface AuthProvider {
    getUser(): UserProfile | null;
    signOut(): Promise<void>;
    onAuthChange(callback: (user: UserProfile | null) => void): () => void;
    getAccessToken?(scopes?: string[]): Promise<string>;
}
