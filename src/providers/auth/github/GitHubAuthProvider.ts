import type { GitHubConfig } from '../../../Config';
import {
    createConfigurationState,
    getMissingKeys,
    type ProviderConfigurationState,
} from '../../ProviderConfiguration';
import type { AuthProviderAdapter, AuthSignInOptions, UserProfile } from '../AuthProvider';

const joinUrl = (base: string, path: string): string => `${base.replace(/\/+$/, '')}${path}`;

/**
 * GitHub sign-in through the app's own server (CR-104).
 *
 * The browser never holds a GitHub token: `signIn()` redirects to `<sessionUrl>/login`,
 * the session lives on the server, and the profile is read from `<sessionUrl>/me`
 * (401 = signed out). `signOut()` posts `<sessionUrl>/logout`.
 */
export class GitHubAuthProvider implements AuthProviderAdapter {
    private user: UserProfile | null = null;
    private readonly listeners = new Set<(user: UserProfile | null) => void>();

    constructor(private readonly config: GitHubConfig) {}

    getConfigurationState(): ProviderConfigurationState {
        return createConfigurationState(
            'GitHubAuthProvider',
            getMissingKeys(this.config as unknown as Record<string, unknown>, ['sessionUrl'], 'github.')
        );
    }

    isConfigured(): boolean {
        return this.getConfigurationState().configured;
    }

    private endpoint(path: string): string {
        return joinUrl(this.config.sessionUrl, path);
    }

    private async fetchProfile(): Promise<UserProfile | null> {
        if (!this.isConfigured()) return null;
        try {
            const response = await fetch(this.endpoint('/me'), {
                credentials: 'include',
                headers: { Accept: 'application/json' },
            });
            // 401 (and any other failure) means "not signed in": never throws.
            if (!response.ok) return null;
            const profile = (await response.json()) as UserProfile | null;
            return profile ?? null;
        } catch {
            return null;
        }
    }

    private setUser(user: UserProfile | null): void {
        this.user = user;
        for (const listener of this.listeners) listener(user);
    }

    getUser(): UserProfile | null {
        return this.user;
    }

    async signIn(_options: AuthSignInOptions = {}): Promise<UserProfile | null> {
        if (!this.isConfigured()) {
            throw new Error('GitHubAuthProvider: missing github.sessionUrl configuration.');
        }
        const location = globalThis.location;
        if (location) location.assign(this.endpoint('/login'));
        return null;
    }

    async signOut(): Promise<void> {
        if (this.isConfigured()) {
            try {
                await fetch(this.endpoint('/logout'), {
                    method: 'POST',
                    credentials: 'include',
                    headers: { Accept: 'application/json' },
                });
            } catch {
                // Clearing the local state is what matters; the server session may already be gone.
            }
        }
        this.setUser(null);
    }

    onAuthChange(callback: (user: UserProfile | null) => void): () => void {
        this.listeners.add(callback);
        void this.fetchProfile().then((user) => {
            if (!this.listeners.has(callback)) return;
            this.user = user;
            callback(user);
        });
        return () => {
            this.listeners.delete(callback);
        };
    }

    isAuthenticated(): boolean {
        return this.user != null;
    }
}
