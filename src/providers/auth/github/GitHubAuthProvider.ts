import type { GitHubAuthConfig } from '../../../Config';
import {
    createConfigurationState,
    getMissingKeys,
    type ProviderConfigurationState,
} from '../../ProviderConfiguration';
import type { AuthProviderAdapter, AuthSignInOptions, UserProfile } from '../AuthProvider';

/** The profile the session endpoint of the app answers with (`<sessionUrl>/me`). */
export type GitHubSessionProfile = {
    login: string;
    name?: string | null;
    avatarUrl?: string | null;
    email?: string | null;
};

const toUserProfile = (profile: GitHubSessionProfile): UserProfile => ({
    uid: profile.login,
    displayName: profile.name || profile.login,
    ...(profile.email ? { email: profile.email } : {}),
    ...(profile.avatarUrl ? { photoURL: profile.avatarUrl } : {}),
    provider: 'github',
    login: profile.login,
});

/**
 * Sign-in with GitHub through a session held by the app's server (CR-104). GitHub needs the client
 * secret to turn the authorization code into a token, so the exchange, the token and the session
 * stay on the server (`createGitHubOAuth` from `@llmnative/react/server` does the GitHub part); the
 * browser only ever sees the profile. Endpoints of the app, under `sessionUrl`:
 *   GET  /login?returnTo=<path>  → redirects to GitHub and back, sets the session cookie
 *   GET  /me                     → the profile, 401 without a session
 *   POST /logout                 → ends the session
 */
export class GitHubAuthProvider implements AuthProviderAdapter {
    private user: UserProfile | null = null;
    private readonly listeners = new Set<(user: UserProfile | null) => void>();
    private loading: Promise<UserProfile | null> | null = null;

    constructor(private readonly config: GitHubAuthConfig) {
        if (this.isConfigured() && typeof window !== 'undefined') void this.refresh();
    }

    getConfigurationState(): ProviderConfigurationState {
        return createConfigurationState(
            'GitHubAuthProvider',
            getMissingKeys(this.config as unknown as Record<string, unknown>, ['sessionUrl'], 'github.'),
        );
    }

    isConfigured(): boolean {
        return this.getConfigurationState().configured;
    }

    private get base(): string {
        return (this.config.sessionUrl ?? '').replace(/\/+$/, '');
    }

    getUser(): UserProfile | null {
        return this.user;
    }

    isAuthenticated(): boolean {
        return !!this.user;
    }

    /** Asks the server who is signed in; the listeners hear of it when it changed. */
    refresh(): Promise<UserProfile | null> {
        this.loading ??= fetch(`${this.base}/me`, { credentials: 'include', headers: { Accept: 'application/json' } })
            .then(async (response) => (response.ok ? toUserProfile(await response.json() as GitHubSessionProfile) : null))
            .catch(() => null)
            .then((user) => {
                this.setUser(user);
                return user;
            })
            .finally(() => { this.loading = null; });
        return this.loading;
    }

    /** Leaves for GitHub through the server, and comes back to the page it left from. */
    async signIn(options: AuthSignInOptions = {}): Promise<UserProfile | null> {
        if (!this.isConfigured()) throw new Error('GitHubAuthProvider: missing github.sessionUrl configuration.');
        const params = new URLSearchParams({ returnTo: `${window.location.pathname}${window.location.search}` });
        if (options.scopes?.length) params.set('scope', options.scopes.join(' '));
        window.location.assign(`${this.base}/login?${params.toString()}`);
        return this.user;
    }

    async signOut(): Promise<void> {
        if (this.isConfigured()) {
            await fetch(`${this.base}/logout`, { method: 'POST', credentials: 'include' }).catch(() => undefined);
        }
        this.setUser(null);
    }

    onAuthChange(callback: (user: UserProfile | null) => void): () => void {
        this.listeners.add(callback);
        return () => { this.listeners.delete(callback); };
    }

    private setUser(user: UserProfile | null) {
        const changed = (user?.uid ?? null) !== (this.user?.uid ?? null);
        this.user = user;
        if (changed) this.listeners.forEach((listener) => listener(user));
    }
}
