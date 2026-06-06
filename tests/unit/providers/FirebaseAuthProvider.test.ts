/**
 * FirebaseAuthProvider test suite.
 * Mocks firebase/auth and firebase-init to avoid real network calls.
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';

// ── Mock firebase-init ────────────────────────────────────────────────────────

const mockGetIdToken = vi.fn(async () => 'firebase-id-token');

function buildMockAuth(initialUser: any = null) {
    let _currentUser = initialUser;
    const _listeners: ((user: any) => void)[] = [];

    const fire = (user: any) => { _listeners.forEach((l) => l(user)); };

    return {
        get currentUser() { return _currentUser; },
        _setUser(user: any) {
            _currentUser = user;
            fire(user);
        },
        _listeners,
        fire,
    };
}

let mockAuth = buildMockAuth();

vi.mock('../../../src/providers/firebase-init', () => ({
    getSafeAuth: vi.fn(() => mockAuth),
    getFirebaseConfigurationState: vi.fn(() => ({ configured: true, missingKeys: [] })),
    default: vi.fn(),
}));

// ── Mock firebase/auth ────────────────────────────────────────────────────────

vi.mock('firebase/auth', () => ({
    signInWithEmailAndPassword: vi.fn(async (_auth: any, email: string, password: string) => {
        if (password === 'wrong') throw new Error('auth/wrong-password');
        if (!email) throw new Error('auth/invalid-email');
        const user = {
            uid: 'uid-email-1',
            email,
            displayName: null,
            photoURL: null,
            isAnonymous: false,
            getIdToken: mockGetIdToken,
        };
        mockAuth._setUser(user);
        return { user };
    }),

    signInAnonymously: vi.fn(async (_auth: any) => {
        const user = {
            uid: 'uid-anon-1',
            email: null,
            displayName: null,
            photoURL: null,
            isAnonymous: true,
            getIdToken: mockGetIdToken,
        };
        mockAuth._setUser(user);
        return { user };
    }),

    signInWithPopup: vi.fn(async (_auth: any, oauthProvider: any) => {
        const providerId = oauthProvider?.providerId ?? 'unknown';
        const user = {
            uid: `uid-oauth-${providerId}`,
            email: `oauth@${providerId}`,
            displayName: 'OAuth User',
            photoURL: null,
            isAnonymous: false,
            getIdToken: mockGetIdToken,
        };
        mockAuth._setUser(user);
        return { user };
    }),

    OAuthProvider: vi.fn((providerId: string) => ({ providerId })),

    signOut: vi.fn(async (_auth: any) => {
        mockAuth._setUser(null);
    }),

    onAuthStateChanged: vi.fn((_auth: any, callback: (user: any) => void) => {
        mockAuth._listeners.push(callback);
        callback(mockAuth.currentUser);
        return () => {
            const idx = mockAuth._listeners.indexOf(callback);
            if (idx >= 0) mockAuth._listeners.splice(idx, 1);
        };
    }),
}));

// ── Import after mocks ────────────────────────────────────────────────────────

import { FirebaseAuthProvider } from '../../../src/providers/auth/firebase/FirebaseAuthProvider';
import * as firebaseAuth from 'firebase/auth';

function provider() {
    return new FirebaseAuthProvider();
}

beforeEach(() => {
    mockAuth = buildMockAuth();
    vi.mocked(firebaseAuth.onAuthStateChanged).mockImplementation((_auth: any, callback: any) => {
        mockAuth._listeners.push(callback);
        callback(mockAuth.currentUser);
        return () => {
            const idx = mockAuth._listeners.indexOf(callback);
            if (idx >= 0) mockAuth._listeners.splice(idx, 1);
        };
    });
});

// ── getConfigurationState ─────────────────────────────────────────────────────

describe('getConfigurationState()', () => {
    it('reports configured when Firebase is initialised', () => {
        expect(provider().getConfigurationState().configured).toBe(true);
    });
});

// ── getUser ───────────────────────────────────────────────────────────────────

describe('getUser()', () => {
    it('returns null when no user is signed in', () => {
        expect(provider().getUser()).toBeNull();
    });

    it('returns a UserProfile when a user is signed in', () => {
        mockAuth._setUser({ uid: 'u1', email: 'a@b.com', displayName: 'Alice', photoURL: null, isAnonymous: false, getIdToken: mockGetIdToken });
        expect(provider().getUser()).toMatchObject({ uid: 'u1', email: 'a@b.com', displayName: 'Alice' });
    });
});

// ── signIn — password ─────────────────────────────────────────────────────────

describe('signIn() — password', () => {
    it('returns a UserProfile on successful sign-in', async () => {
        const user = await provider().signIn({ method: 'password', email: 'a@b.com', password: 'secret' });
        expect(user).toMatchObject({ uid: 'uid-email-1', email: 'a@b.com', isAnonymous: false });
    });

    it('throws when password is wrong', async () => {
        await expect(
            provider().signIn({ method: 'password', email: 'a@b.com', password: 'wrong' })
        ).rejects.toThrow();
    });

    it('throws when email is missing', async () => {
        await expect(
            provider().signIn({ method: 'password', email: '', password: 'secret' })
        ).rejects.toThrow('email and password are required');
    });

    it('throws when password is missing', async () => {
        await expect(
            provider().signIn({ method: 'password', email: 'a@b.com', password: '' })
        ).rejects.toThrow('email and password are required');
    });

    it('defaults to password method when method is omitted', async () => {
        const user = await provider().signIn({ email: 'a@b.com', password: 'secret' });
        expect(user?.isAnonymous).toBe(false);
    });
});

// ── signIn — anonymous ────────────────────────────────────────────────────────

describe('signIn() — anonymous', () => {
    it('returns an anonymous UserProfile', async () => {
        const user = await provider().signIn({ method: 'anonymous' });
        expect(user).toMatchObject({ uid: 'uid-anon-1', isAnonymous: true });
        expect(user?.email).toBeUndefined();
    });

    it('calls signInAnonymously on the Firebase auth instance', async () => {
        await provider().signIn({ method: 'anonymous' });
        expect(firebaseAuth.signInAnonymously).toHaveBeenCalled();
    });
});

// ── signIn — oauth ────────────────────────────────────────────────────────────

describe('signIn() — oauth', () => {
    it('returns a UserProfile on successful OAuth sign-in', async () => {
        const user = await provider().signIn({ method: 'oauth', provider: 'github' });
        expect(user).toMatchObject({ uid: 'uid-oauth-github.com', isAnonymous: false });
    });

    it('calls signInWithPopup with the correct provider', async () => {
        await provider().signIn({ method: 'oauth', provider: 'github' });
        expect(firebaseAuth.signInWithPopup).toHaveBeenCalled();
    });

    it('resolves provider short name to Firebase provider ID', async () => {
        await provider().signIn({ method: 'oauth', provider: 'apple' });
        expect(firebaseAuth.OAuthProvider).toHaveBeenCalledWith('apple.com');
    });

    it('passes through unknown provider IDs as-is', async () => {
        await provider().signIn({ method: 'oauth', provider: 'saml.my-provider' });
        expect(firebaseAuth.OAuthProvider).toHaveBeenCalledWith('saml.my-provider');
    });

    it('throws when provider is missing', async () => {
        await expect(
            provider().signIn({ method: 'oauth', provider: '' })
        ).rejects.toThrow('provider is required');
    });
});

// ── signOut ───────────────────────────────────────────────────────────────────

describe('signOut()', () => {
    it('clears the current user', async () => {
        mockAuth._setUser({ uid: 'u1', email: 'a@b.com', isAnonymous: false, getIdToken: mockGetIdToken });
        await provider().signOut();
        expect(provider().getUser()).toBeNull();
    });

    it('calls firebase signOut', async () => {
        await provider().signOut();
        expect(firebaseAuth.signOut).toHaveBeenCalled();
    });
});

// ── onAuthChange ──────────────────────────────────────────────────────────────

describe('onAuthChange()', () => {
    it('calls callback immediately with null when no user', () => {
        const cb = vi.fn();
        provider().onAuthChange(cb);
        expect(cb).toHaveBeenCalledWith(null);
    });

    it('calls callback with UserProfile when user is present', () => {
        mockAuth._setUser({ uid: 'u2', email: 'b@c.com', displayName: null, photoURL: null, isAnonymous: false, getIdToken: mockGetIdToken });
        const cb = vi.fn();
        provider().onAuthChange(cb);
        expect(cb).toHaveBeenCalledWith(expect.objectContaining({ uid: 'u2' }));
    });

    it('returns an unsubscribe function', () => {
        const unsub = provider().onAuthChange(vi.fn());
        expect(unsub).toBeTypeOf('function');
        expect(() => unsub()).not.toThrow();
    });
});

// ── getAccessToken ────────────────────────────────────────────────────────────

describe('getAccessToken()', () => {
    it('returns the Firebase ID token', async () => {
        mockAuth._setUser({ uid: 'u1', email: 'a@b.com', isAnonymous: false, getIdToken: mockGetIdToken });
        const token = await provider().getAccessToken();
        expect(token).toBe('firebase-id-token');
    });

    it('throws when no user is signed in', async () => {
        await expect(provider().getAccessToken()).rejects.toThrow('no active session');
    });
});
