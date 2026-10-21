import { afterEach, describe, expect, it, vi } from 'vitest';
import { GitHubAuthProvider } from '../../../src/providers/auth/github/GitHubAuthProvider';

const jsonResponse = (body: unknown, status = 200) =>
    new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });

describe('GitHubAuthProvider', () => {
    afterEach(() => {
        vi.unstubAllGlobals();
        vi.restoreAllMocks();
    });

    it('stays inactive when sessionUrl is missing', async () => {
        const provider = new GitHubAuthProvider({ sessionUrl: '' });

        expect(provider.isConfigured()).toBe(false);
        expect(provider.getConfigurationState()).toMatchObject({
            configured: false,
            missingKeys: ['github.sessionUrl'],
        });
        expect(provider.isAuthenticated()).toBe(false);
        expect(provider.getUser()).toBeNull();
        await expect(provider.signIn()).rejects.toThrow('missing github.sessionUrl');
    });

    it('redirects signIn to <sessionUrl>/login', async () => {
        const assign = vi.fn();
        vi.stubGlobal('location', { assign });
        const provider = new GitHubAuthProvider({ sessionUrl: 'https://session.example.com/' });

        await provider.signIn();

        expect(assign).toHaveBeenCalledWith('https://session.example.com/login');
    });

    it('resolves the profile from <sessionUrl>/me on auth change', async () => {
        const fetchMock = vi.fn(async () => jsonResponse({
            uid: '42',
            displayName: 'Octocat',
            email: 'octo@example.com',
            photoURL: 'https://avatars.example.com/octo.png',
        }));
        vi.stubGlobal('fetch', fetchMock);
        const provider = new GitHubAuthProvider({ sessionUrl: 'https://session.example.com' });

        const user = await new Promise<unknown>((resolve) => provider.onAuthChange(resolve));

        expect(fetchMock).toHaveBeenCalledWith('https://session.example.com/me', expect.objectContaining({ credentials: 'include' }));
        expect(user).toMatchObject({ uid: '42', displayName: 'Octocat' });
        expect(provider.getUser()).toMatchObject({ uid: '42' });
        expect(provider.isAuthenticated()).toBe(true);
    });

    it('treats a 401 as signed out, without throwing', async () => {
        vi.stubGlobal('fetch', vi.fn(async () => new Response(null, { status: 401 })));
        const provider = new GitHubAuthProvider({ sessionUrl: 'https://session.example.com' });

        const user = await new Promise<unknown>((resolve) => provider.onAuthChange(resolve));

        expect(user).toBeNull();
        expect(provider.getUser()).toBeNull();
        expect(provider.isAuthenticated()).toBe(false);
    });

    it('posts <sessionUrl>/logout and clears the local state', async () => {
        const fetchMock = vi.fn(async (input: string) => {
            if (String(input).endsWith('/me')) return jsonResponse({ uid: '42', displayName: 'Octocat' });
            return new Response(null, { status: 204 });
        });
        vi.stubGlobal('fetch', fetchMock);
        const provider = new GitHubAuthProvider({ sessionUrl: 'https://session.example.com' });

        await new Promise((resolve) => provider.onAuthChange(resolve));
        expect(provider.isAuthenticated()).toBe(true);

        await provider.signOut();

        expect(fetchMock).toHaveBeenCalledWith('https://session.example.com/logout', expect.objectContaining({ method: 'POST' }));
        expect(provider.getUser()).toBeNull();
        expect(provider.isAuthenticated()).toBe(false);
    });
});
