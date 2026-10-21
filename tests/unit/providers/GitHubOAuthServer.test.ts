// @vitest-environment node
import { createHash } from 'node:crypto';
import { afterEach, describe, expect, it, vi } from 'vitest';
import {
    createGitHubOAuth,
    createGitHubPkce,
    GitHubOAuthError,
} from '../../../src/providers/auth/github/server';

const jsonResponse = (body: unknown, status = 200) =>
    new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });

const oauth = () => createGitHubOAuth({ clientId: 'client-id', clientSecret: 'client-secret' });

describe('createGitHubOAuth', () => {
    afterEach(() => vi.unstubAllGlobals());

    it('requires both clientId and clientSecret', () => {
        expect(() => createGitHubOAuth({ clientId: '', clientSecret: 'secret' })).toThrow(/clientId/);
        expect(() => createGitHubOAuth({ clientId: 'id', clientSecret: '' })).toThrow(/clientSecret/);
    });

    it('builds an authorize URL with state, scopes and PKCE', () => {
        const { authorizeUrl } = oauth();
        const url = new URL(authorizeUrl({
            state: 'state-1',
            redirectUri: 'https://app.example.com/auth/callback',
            codeChallenge: 'challenge-1',
        }));

        expect(url.origin + url.pathname).toBe('https://github.com/login/oauth/authorize');
        expect(url.searchParams.get('client_id')).toBe('client-id');
        expect(url.searchParams.get('redirect_uri')).toBe('https://app.example.com/auth/callback');
        expect(url.searchParams.get('state')).toBe('state-1');
        expect(url.searchParams.get('scope')).toBe('read:user user:email read:org');
        expect(url.searchParams.get('code_challenge')).toBe('challenge-1');
        expect(url.searchParams.get('code_challenge_method')).toBe('S256');
    });

    it('createGitHubPkce returns a verifier whose S256 digest is the challenge', async () => {
        const { codeVerifier, codeChallenge } = await createGitHubPkce();

        expect(codeVerifier).not.toBe(codeChallenge);
        expect(createHash('sha256').update(codeVerifier).digest('base64url')).toBe(codeChallenge);
    });

    it('beginAuthorization carries its state and PKCE into the URL', async () => {
        const { beginAuthorization } = oauth();
        const started = await beginAuthorization({ redirectUri: 'https://app.example.com/cb' });
        const url = new URL(started.url);

        expect(started.state).toBe(url.searchParams.get('state'));
        expect(url.searchParams.get('code_challenge')).toBe(createHash('sha256').update(started.codeVerifier).digest('base64url'));
    });

    it('exchanges the code for a token with the client secret', async () => {
        const fetchMock = vi.fn(async (_url: string, _init?: RequestInit) =>
            jsonResponse({ access_token: 'gho_token', token_type: 'bearer', scope: 'read:user' }));
        vi.stubGlobal('fetch', fetchMock);
        const { exchangeCode } = oauth();

        const token = await exchangeCode({ code: 'code-1', redirectUri: 'https://app.example.com/cb', codeVerifier: 'verifier-1' });

        expect(token).toEqual({ accessToken: 'gho_token', tokenType: 'bearer', scope: 'read:user' });
        const [url, init] = fetchMock.mock.calls[0];
        expect(url).toBe('https://github.com/login/oauth/access_token');
        expect(JSON.parse(String(init?.body))).toMatchObject({
            client_id: 'client-id',
            client_secret: 'client-secret',
            code: 'code-1',
            redirect_uri: 'https://app.example.com/cb',
            code_verifier: 'verifier-1',
        });
    });

    it('surfaces a GitHub token error as GitHubOAuthError with its message', async () => {
        vi.stubGlobal('fetch', vi.fn(async () =>
            jsonResponse({ error: 'bad_verification_code', error_description: 'The code passed is incorrect or expired.' })));
        const { exchangeCode } = oauth();

        const error = await exchangeCode({ code: 'bad', redirectUri: 'https://app.example.com/cb' }).catch((e) => e);

        expect(error).toBeInstanceOf(GitHubOAuthError);
        expect(error).toMatchObject({ providerMessage: 'The code passed is incorrect or expired.' });
    });

    it('returns the user profile and only the organizations where the user is admin', async () => {
        const fetchMock = vi.fn(async (url: string) => {
            if (url.endsWith('/user')) return jsonResponse({ id: 1, login: 'octocat', name: 'The Octocat' });
            if (url.includes('/user/memberships/orgs')) {
                return jsonResponse([
                    { role: 'admin', state: 'active', organization: { id: 10, login: 'acme' } },
                    { role: 'member', state: 'active', organization: { id: 11, login: 'other' } },
                ]);
            }
            return new Response(null, { status: 404 });
        });
        vi.stubGlobal('fetch', fetchMock);
        const { getUser, getAdminOrganizations } = oauth();

        await expect(getUser('token')).resolves.toMatchObject({ login: 'octocat' });
        await expect(getAdminOrganizations('token')).resolves.toEqual([{ id: 10, login: 'acme', role: 'admin' }]);
    });

    it('surfaces a GitHub API error with its status and message', async () => {
        vi.stubGlobal('fetch', vi.fn(async () => jsonResponse({ message: 'Bad credentials' }, 401)));
        const { getUser } = oauth();

        const error = await getUser('token').catch((e) => e);

        expect(error).toBeInstanceOf(GitHubOAuthError);
        expect(error).toMatchObject({ status: 401, providerMessage: 'Bad credentials' });
    });
});
