import type {
    AuthEmailCodeOptions,
    AuthProviderAdapter,
    AuthSignInOptions,
    AuthSignUpInput,
    AuthSignUpResult,
    UserProfile,
} from '../AuthProvider';
import { AuthFlowError } from '../AuthProvider';
import type { ProviderConfigurationState } from '../../ProviderConfiguration';

/** An account of the mock: its password, and whether its email is confirmed. */
export interface MockAuthAccount {
    email: string;
    password: string;
    displayName?: string;
    emailVerified?: boolean;
}

export interface MockAuthProviderOptions {
    /**
     * The accounts that exist. Omitted: any email and any password sign in (a demo); given: only these,
     * and a wrong password fails as a real service would.
     */
    accounts?: MockAuthAccount[];
    /** The code every email "receives" (default `123456`); any other code fails. */
    code?: string;
    /** Where the session is kept between reloads (default `sessionStorage`); `null` keeps it in memory only. */
    storage?: Storage | null;
    /** A pause before each answer, in ms, to see the loading states (default `400`). */
    latency?: number;
}

const SESSION_KEY = 'llmnative_mock_auth';

/**
 * An auth provider for demos and tests, with no service behind it (CR-127): every flow of the access
 * screens works in memory. Never use it in production: it trusts any credential it is configured to.
 */
export class MockAuthProvider implements AuthProviderAdapter {
    private user: UserProfile | null = null;
    private readonly listeners = new Set<(user: UserProfile | null) => void>();
    private readonly accounts: Map<string, MockAuthAccount>;
    private readonly open: boolean;
    private readonly code: string;
    private readonly storage: Storage | null;
    private readonly latency: number;

    constructor(options: MockAuthProviderOptions = {}) {
        this.open = !options.accounts;
        this.accounts = new Map((options.accounts ?? []).map((account) => [account.email.toLowerCase(), account]));
        this.code = options.code ?? '123456';
        this.latency = options.latency ?? 400;
        this.storage = options.storage !== undefined
            ? options.storage
            : (typeof window !== 'undefined' ? window.sessionStorage : null);
        this.user = this.restore();
    }

    getConfigurationState(): ProviderConfigurationState {
        return { configured: true, missingKeys: [] };
    }

    isConfigured(): boolean {
        return true;
    }

    getUser(): UserProfile | null {
        return this.user;
    }

    isAuthenticated(): boolean {
        return !!this.user;
    }

    async whenReady(): Promise<void> {}

    onAuthChange(callback: (user: UserProfile | null) => void): () => void {
        this.listeners.add(callback);
        callback(this.user);
        return () => { this.listeners.delete(callback); };
    }

    async signIn(options: AuthSignInOptions = {}): Promise<UserProfile | null> {
        await this.pause();
        const method = (options.method as string | undefined) ?? 'password';
        if (method === 'oauth') {
            const provider = String(options.provider ?? 'oauth');
            return this.setUser({ uid: `mock-${provider}`, email: `demo@${provider}.example`, displayName: 'Demo User', provider });
        }
        const email = String(options.email ?? '').trim().toLowerCase();
        const password = String(options.password ?? '');
        if (!email || !password) throw new AuthFlowError('credentials');
        const account = this.accounts.get(email);
        if (!this.open && (!account || account.password !== password)) throw new AuthFlowError('credentials');
        return this.setUser(this.profile(account ?? { email, password }));
    }

    async signOut(): Promise<void> {
        this.setUser(null);
    }

    async signUp({ email, password, name }: AuthSignUpInput): Promise<AuthSignUpResult> {
        await this.pause();
        const key = email.trim().toLowerCase();
        if (this.accounts.has(key)) throw new AuthFlowError('emailInUse');
        if (password.length < 8) throw new AuthFlowError('weakPassword');
        this.accounts.set(key, { email: key, password, displayName: name, emailVerified: false });
        return { user: null, needsEmailVerification: true };
    }

    async sendPasswordReset(): Promise<void> {
        await this.pause();
    }

    async confirmPasswordReset(code: string, newPassword: string): Promise<void> {
        await this.pause();
        if (code !== this.code) throw new AuthFlowError('expiredLink');
        if (newPassword.length < 8) throw new AuthFlowError('weakPassword');
    }

    async sendEmailVerification(): Promise<void> {
        await this.pause();
    }

    async verifyEmail(code: string): Promise<void> {
        await this.pause();
        if (code !== this.code) throw new AuthFlowError('expiredLink');
        this.accounts.forEach((account) => { account.emailVerified = true; });
    }

    async requestEmailCode(email: string, options: AuthEmailCodeOptions = {}): Promise<void> {
        await this.pause();
        // Same answer whether the account exists or not: the screen never tells.
        void email;
        void options;
    }

    async verifyEmailCode(email: string, code: string): Promise<UserProfile | null> {
        await this.pause();
        if (code !== this.code) throw new AuthFlowError('invalidCode');
        const key = email.trim().toLowerCase();
        const account = this.accounts.get(key);
        if (!this.open && !account) throw new AuthFlowError('invalidCode');
        return this.setUser(this.profile(account ?? { email: key, password: '' }));
    }

    private profile(account: MockAuthAccount): UserProfile {
        return {
            uid: `mock-${account.email}`,
            email: account.email,
            displayName: account.displayName ?? account.email.split('@')[0],
        };
    }

    private setUser(user: UserProfile | null): UserProfile | null {
        this.user = user;
        try {
            if (user) this.storage?.setItem(SESSION_KEY, JSON.stringify(user));
            else this.storage?.removeItem(SESSION_KEY);
        } catch {
            // A storage that refuses (private mode): the session lives in memory only.
        }
        this.listeners.forEach((listener) => listener(user));
        return user;
    }

    private restore(): UserProfile | null {
        try {
            const raw = this.storage?.getItem(SESSION_KEY);
            return raw ? JSON.parse(raw) as UserProfile : null;
        } catch {
            return null;
        }
    }

    private pause(): Promise<void> {
        return this.latency > 0 ? new Promise((resolve) => setTimeout(resolve, this.latency)) : Promise.resolve();
    }
}
