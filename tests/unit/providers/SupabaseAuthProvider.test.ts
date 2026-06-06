/**
 * SupabaseAuthProvider test suite.
 * Mocks the Supabase client to avoid any network calls.
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { SupabaseAuthProvider } from '../../../src/providers/auth/supabase/SupabaseAuthProvider';
import * as supabaseInit from '../../../src/providers/supabase-init';

// ── Mock Supabase client ──────────────────────────────────────────────────────

type AuthListener = (event: string, session: any) => void;

function buildMockAuthClient(initialUser: any = null) {
    let _user = initialUser;
    let _session = initialUser ? { user: initialUser, access_token: 'mock-token-123' } : null;
    const _listeners: AuthListener[] = [];

    const fire = (event: string, session: any) => _listeners.forEach((l) => l(event, session));

    const auth = {
        getUser: vi.fn(async () => ({ data: { user: _user }, error: null })),
        getSession: vi.fn(async () => ({ data: { session: _session }, error: null })),

        signInWithPassword: vi.fn(async ({ email, password }: any) => {
            if (password === 'wrong') return { data: { user: null }, error: { message: 'Invalid credentials' } };
            _user = { id: 'uid-1', email, user_metadata: { full_name: 'Test User' } };
            _session = { user: _user, access_token: 'token-abc' };
            fire('SIGNED_IN', _session);
            return { data: { user: _user, session: _session }, error: null };
        }),

        signInWithOtp: vi.fn(async ({ email }: any) => {
            return { error: email ? null : { message: 'email required' } };
        }),

        signInWithOAuth: vi.fn(async ({ provider }: any) => {
            return { error: provider ? null : { message: 'provider required' } };
        }),

        signInAnonymously: vi.fn(async () => {
            _user = { id: 'anon-1', email: null, user_metadata: {} };
            _session = { user: _user, access_token: 'anon-token' };
            fire('SIGNED_IN', _session);
            return { data: { user: _user, session: _session }, error: null };
        }),

        signOut: vi.fn(async () => {
            _user = null;
            _session = null;
            fire('SIGNED_OUT', null);
            return { error: null };
        }),

        onAuthStateChange: vi.fn((cb: AuthListener) => {
            _listeners.push(cb);
            return { data: { subscription: { unsubscribe: () => _listeners.splice(_listeners.indexOf(cb), 1) } } };
        }),
    };

    const client = { auth, _session } as any;
    // Expose mutable internal session for getUser() sync path
    Object.defineProperty(client, 'auth', {
        get: () => ({ ...auth, _session }),
    });

    return { client, auth, setSession: (s: any) => { _session = s; _user = s?.user ?? null; } };
}

function createProvider(initialUser: any = null) {
    const { client, auth, setSession } = buildMockAuthClient(initialUser);
    vi.spyOn(supabaseInit, 'getSupabaseClient').mockReturnValue(client as any);
    return {
        provider: new SupabaseAuthProvider({ url: 'https://test.supabase.co', anonKey: 'key' }),
        auth,
        setSession,
    };
}

beforeEach(() => {
    vi.restoreAllMocks();
    supabaseInit._resetSupabaseClients();
});

// ── getConfigurationState ────────────────────────────────────────────────────

describe('getConfigurationState()', () => {
    it('reports configured when url + anonKey are set', () => {
        const { provider } = createProvider();
        expect(provider.getConfigurationState().configured).toBe(true);
    });

    it('reports not configured when url is empty', () => {
        const p = new SupabaseAuthProvider({ url: '', anonKey: 'key' });
        expect(p.getConfigurationState().configured).toBe(false);
    });
});

// ── signIn — password ────────────────────────────────────────────────────────

describe('signIn() — password', () => {
    it('returns a UserProfile on successful sign-in', async () => {
        const { provider } = createProvider();
        const user = await provider.signIn({ method: 'password', email: 'a@b.com', password: 'secret' });
        expect(user).toMatchObject({ email: 'a@b.com', uid: 'uid-1' });
    });

    it('throws when password is wrong', async () => {
        const { provider } = createProvider();
        await expect(
            provider.signIn({ method: 'password', email: 'a@b.com', password: 'wrong' })
        ).rejects.toThrow();
    });

    it('throws when email is missing', async () => {
        const { provider } = createProvider();
        await expect(
            provider.signIn({ method: 'password', email: '', password: 'p' })
        ).rejects.toThrow();
    });
});

// ── signIn — magic link ───────────────────────────────────────────────────────

describe('signIn() — magic_link', () => {
    it('returns null (email dispatched)', async () => {
        const { provider } = createProvider();
        const result = await provider.signIn({ method: 'magic_link', email: 'a@b.com' });
        expect(result).toBeNull();
    });

    it('throws when email is missing', async () => {
        const { provider } = createProvider();
        await expect(provider.signIn({ method: 'magic_link', email: '' })).rejects.toThrow();
    });
});

// ── signIn — oauth ────────────────────────────────────────────────────────────

describe('signIn() — oauth', () => {
    it('returns null (redirect initiated)', async () => {
        const { provider } = createProvider();
        const result = await provider.signIn({ method: 'oauth', provider: 'github' });
        expect(result).toBeNull();
    });

    it('throws when provider name is missing', async () => {
        const { provider } = createProvider();
        await expect(provider.signIn({ method: 'oauth', provider: '' })).rejects.toThrow();
    });
});

// ── signIn — anonymous ────────────────────────────────────────────────────────

describe('signIn() — anonymous', () => {
    it('returns an anonymous UserProfile', async () => {
        const { provider } = createProvider();
        const user = await provider.signIn({ method: 'anonymous' });
        expect(user).toMatchObject({ uid: 'anon-1' });
        expect(user?.email).toBeUndefined();
    });
});

// ── signOut ───────────────────────────────────────────────────────────────────

describe('signOut()', () => {
    it('clears the session', async () => {
        const user = { id: 'uid-1', email: 'a@b.com', user_metadata: {} };
        const { provider } = createProvider(user);
        await provider.signOut();
        // Subsequent getAccessToken should fail
        await expect(provider.getAccessToken()).rejects.toThrow();
    });
});

// ── onAuthChange ──────────────────────────────────────────────────────────────

describe('onAuthChange()', () => {
    it('calls callback with null when no session', async () => {
        const { provider } = createProvider();
        const cb = vi.fn();
        provider.onAuthChange(cb);
        await new Promise((r) => setTimeout(r, 0));
        // First call is the getSession() async resolution
        const callArgs = cb.mock.calls.map((c) => c[0]);
        expect(callArgs.some((u) => u === null)).toBe(true);
    });

    it('returns an unsubscribe function', () => {
        const { provider } = createProvider();
        const unsub = provider.onAuthChange(vi.fn());
        expect(unsub).toBeTypeOf('function');
        expect(() => unsub()).not.toThrow();
    });
});

// ── getAccessToken ────────────────────────────────────────────────────────────

describe('getAccessToken()', () => {
    it('returns the JWT access token from the active session', async () => {
        const { provider, auth } = createProvider();
        // Simulate an active session
        auth.getSession.mockResolvedValue({
            data: { session: { user: { id: 'u1' }, access_token: 'jwt-xyz' } },
            error: null,
        });
        const token = await provider.getAccessToken();
        expect(token).toBe('jwt-xyz');
    });

    it('throws when no active session exists', async () => {
        const { provider } = createProvider();
        await expect(provider.getAccessToken()).rejects.toThrow();
    });
});
