import { afterEach, describe, expect, it, vi } from 'vitest';

import { GitHubAuthProvider } from '../../../src/providers/auth/github/GitHubAuthProvider';
import { createGitHubOAuth, GitHubOAuthError } from '../../../src/providers/auth/github/githubOAuth';
import { GITHUB_MANIFEST, PROVIDER_MANIFESTS } from '../../../src/providers/manifest';

const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });

describe('GitHubAuthProvider', () => {
    afterEach(() => vi.unstubAllGlobals());

    it('takes the profile from the session of the server, and nobody without one', async () => {
        vi.stubGlobal('fetch', vi.fn(async () => json({ login: 'octo', name: 'Octo Cat', avatarUrl: 'https://a/octo.png' })));
        const auth = new GitHubAuthProvider({ sessionUrl: '/api/auth/github/' });
        const user = await auth.refresh();

        expect(fetch).toHaveBeenCalledWith('/api/auth/github/me', expect.objectContaining({ credentials: 'include' }));
        expect(user).toEqual({ uid: 'octo', displayName: 'Octo Cat', photoURL: 'https://a/octo.png', provider: 'github', login: 'octo' });
        expect(auth.isAuthenticated()).toBe(true);

        vi.stubGlobal('fetch', vi.fn(async () => json({ error: 'signed-out' }, 401)));
        expect(await auth.refresh()).toBeNull();
        expect(auth.getUser()).toBeNull();
    });

    it('signs in through the server, back to the page it left from, and out with a POST', async () => {
        vi.stubGlobal('fetch', vi.fn(async () => json({}, 401)));
        const assign = vi.fn();
        vi.stubGlobal('location', { ...window.location, pathname: '/companies/acme', search: '?tab=1', assign });
        const auth = new GitHubAuthProvider({ sessionUrl: '/api/auth/github' });
        // The first look at the session, started when it is created.
        await auth.refresh();
        const changes: unknown[] = [];
        auth.onAuthChange((user) => changes.push(user?.uid ?? null));

        await auth.signIn({ scopes: ['read:org'] });
        expect(assign).toHaveBeenCalledWith('/api/auth/github/login?returnTo=%2Fcompanies%2Facme%3Ftab%3D1&scope=read%3Aorg');

        vi.stubGlobal('fetch', vi.fn(async () => json({ login: 'octo' })));
        await auth.refresh();
        vi.stubGlobal('fetch', vi.fn(async () => new Response(null, { status: 204 })));
        await auth.signOut();
        expect(fetch).toHaveBeenCalledWith('/api/auth/github/logout', expect.objectContaining({ method: 'POST', credentials: 'include' }));
        expect(changes).toEqual(['octo', null]);
    });

    it('is a driver of the manifest, only with a session URL', () => {
        expect(PROVIDER_MANIFESTS.github).toBe(GITHUB_MANIFEST);
        expect(GITHUB_MANIFEST.githubAuth.when?.({ sessionUrl: '/api/auth/github' })).toBe(true);
        expect(GITHUB_MANIFEST.githubAuth.when?.({ sessionUrl: ' ' })).toBe(false);
        expect(new GitHubAuthProvider({ sessionUrl: '' }).isConfigured()).toBe(false);
    });
});

describe('createGitHubOAuth', () => {
    const config = { clientId: 'cid', clientSecret: 'secret', scopes: ['read:org'] };

    it('builds the authorize URL with state, scopes and PKCE', () => {
        const url = new URL(createGitHubOAuth(config).authorizeUrl({ state: 's1', redirectUri: 'http://localhost/cb', codeChallenge: 'ch' }));

        expect(url.origin + url.pathname).toBe('https://github.com/login/oauth/authorize');
        expect(Object.fromEntries(url.searchParams)).toEqual({ client_id: 'cid', redirect_uri: 'http://localhost/cb', state: 's1', scope: 'read:org', code_challenge: 'ch', code_challenge_method: 'S256' });
    });

    it('exchanges the code with the secret, and says why when GitHub refuses', async () => {
        const fetchFn = vi.fn(async () => json({ access_token: 'gho_1', scope: 'read:org' }));
        const oauth = createGitHubOAuth(config, fetchFn as typeof fetch);

        expect(await oauth.exchangeCode({ code: 'c', redirectUri: 'http://localhost/cb', codeVerifier: 'v' })).toEqual({ accessToken: 'gho_1', scope: 'read:org' });
        expect(JSON.parse(String((fetchFn.mock.calls[0] as unknown as [string, RequestInit])[1].body))).toEqual({ client_id: 'cid', client_secret: 'secret', code: 'c', redirect_uri: 'http://localhost/cb', code_verifier: 'v' });

        const refusing = createGitHubOAuth(config, (async () => json({ error: 'bad_verification_code', error_description: 'The code is incorrect.' })) as typeof fetch);
        await expect(refusing.exchangeCode({ code: 'x', redirectUri: 'http://localhost/cb' })).rejects.toThrow('The code is incorrect.');
    });

    it('reads the profile and the organizations with their role', async () => {
        const fetchFn = vi.fn(async (url: string) => (url.endsWith('/user')
            ? json({ login: 'octo', name: null, avatar_url: 'https://a/o.png' })
            : json([{ role: 'admin', organization: { login: 'sherpalab', avatar_url: 'https://a/s.png' } }, { role: 'member', organization: { login: 'other' } }])));
        const oauth = createGitHubOAuth(config, fetchFn as unknown as typeof fetch);

        expect(await oauth.getUser('t')).toEqual({ login: 'octo', name: null, avatarUrl: 'https://a/o.png', email: null });
        expect(await oauth.getOrganizations('t')).toEqual([
            { login: 'sherpalab', avatarUrl: 'https://a/s.png', role: 'admin' },
            { login: 'other', avatarUrl: null, role: 'member' },
        ]);
        const failing = createGitHubOAuth(config, (async () => json({}, 401)) as typeof fetch);
        await expect(failing.getUser('t')).rejects.toBeInstanceOf(GitHubOAuthError);
    });
});
