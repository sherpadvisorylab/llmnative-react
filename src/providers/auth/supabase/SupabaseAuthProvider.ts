import type { SupabaseClient, User } from '@supabase/supabase-js';
import { getSupabaseClient, getSupabaseConfigurationState } from '../../supabase-init';
import type { AuthProviderAdapter, AuthSignInOptions, UserProfile } from '../AuthProvider';
import type { ProviderConfigurationState } from '../../ProviderConfiguration';

// ── Config ────────────────────────────────────────────────────────────────────

export interface SupabaseAuthConfig {
    url: string;
    anonKey: string;
}

/**
 * Supabase-specific sign-in options.
 * Passed as part of `AuthSignInOptions` (open `[key: string]: any` index signature).
 *
 * method:   'password' (default) | 'magic_link' | 'oauth' | 'anonymous'
 * email:    required for 'password' and 'magic_link'
 * password: required for 'password'
 * provider: required for 'oauth' - e.g. 'github', 'google', 'apple', 'twitter'
 * redirectTo: optional - overrides the redirect URL after OAuth / magic link
 */
export interface SupabaseSignInOptions extends AuthSignInOptions {
    method?: 'password' | 'magic_link' | 'oauth' | 'anonymous';
    email?: string;
    password?: string;
    provider?: string;
    redirectTo?: string;
}

// ── User mapping ──────────────────────────────────────────────────────────────

function mapUser(user: User | null): UserProfile | null {
    if (!user) return null;
    return {
        uid:         user.id,
        email:       user.email ?? undefined,
        displayName: user.user_metadata?.full_name
            ?? user.user_metadata?.name
            ?? user.email
            ?? undefined,
        photoURL:    user.user_metadata?.avatar_url ?? undefined,
        // Carry through all raw metadata for consumers that need it
        raw: user,
    };
}

// ── Provider ──────────────────────────────────────────────────────────────────

export class SupabaseAuthProvider implements AuthProviderAdapter {
    private config: SupabaseAuthConfig;
    private get client(): SupabaseClient { return getSupabaseClient(this.config.url, this.config.anonKey); }

    constructor(config: SupabaseAuthConfig) {
        this.config = config;
    }

    getConfigurationState(): ProviderConfigurationState {
        return getSupabaseConfigurationState(this.config);
    }

    isConfigured(): boolean {
        return this.getConfigurationState().configured;
    }

    // ── getUser ───────────────────────────────────────────────────────────────

    /**
     * Returns the currently cached session user (synchronous, no network call).
     * Returns null if no active session.
     */
    getUser(): UserProfile | null {
        // `getSession()` is async - use the cached session from the client internals.
        // This is synchronous and safe to call from render-path code.
        const session = (this.client as any).auth?._session ?? null;
        return mapUser(session?.user ?? null);
    }

    isAuthenticated(): boolean {
        return !!this.getUser();
    }

    // ── signIn ────────────────────────────────────────────────────────────────

    /**
     * Authenticate with Supabase.
     *
     * options.method = 'password'   (default): email + password sign-in
     * options.method = 'magic_link': OTP email - returns null (email sent, no user yet)
     * options.method = 'oauth':      redirect flow - returns null (user arrives after redirect)
     * options.method = 'anonymous':  anonymous session
     */
    async signIn(options: SupabaseSignInOptions = {}): Promise<UserProfile | null> {
        const method = options.method ?? 'password';

        if (method === 'anonymous') {
            const { data, error } = await this.client.auth.signInAnonymously();
            if (error) throw error;
            return mapUser(data.user);
        }

        if (method === 'magic_link') {
            const email = options.email;
            if (!email) throw new Error('SupabaseAuthProvider.signIn: email is required for magic_link');

            const { error } = await this.client.auth.signInWithOtp({
                email,
                options: { emailRedirectTo: options.redirectTo },
            });
            if (error) throw error;
            return null; // email dispatched - user arrives after clicking the link
        }

        if (method === 'oauth') {
            const provider = options.provider as any;
            if (!provider) throw new Error('SupabaseAuthProvider.signIn: provider is required for oauth');

            const { error } = await this.client.auth.signInWithOAuth({
                provider,
                options: { redirectTo: options.redirectTo },
            });
            if (error) throw error;
            return null; // redirect initiated - user arrives after OAuth callback
        }

        // Default: email + password
        const { email, password } = options;
        if (!email || !password) {
            throw new Error('SupabaseAuthProvider.signIn: email and password are required');
        }

        const { data, error } = await this.client.auth.signInWithPassword({ email, password });
        if (error) throw error;
        return mapUser(data.user);
    }

    // ── signOut ───────────────────────────────────────────────────────────────

    async signOut(): Promise<void> {
        const { error } = await this.client.auth.signOut();
        if (error) throw error;
    }

    // ── onAuthChange ──────────────────────────────────────────────────────────

    onAuthChange(callback: (user: UserProfile | null) => void): () => void {
        // Fire immediately with the current session state
        this.client.auth.getSession().then(({ data }) => {
            callback(mapUser(data.session?.user ?? null));
        });

        const { data: { subscription } } = this.client.auth.onAuthStateChange((_event, session) => {
            callback(mapUser(session?.user ?? null));
        });

        return () => subscription.unsubscribe();
    }

    // ── getAccessToken ────────────────────────────────────────────────────────

    async getAccessToken(): Promise<string> {
        const { data, error } = await this.client.auth.getSession();
        if (error) throw error;
        const token = data.session?.access_token;
        if (!token) throw new Error('SupabaseAuthProvider: no active session');
        return token;
    }
}
