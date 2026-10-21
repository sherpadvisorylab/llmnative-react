// The GitHub side of the sign-in of an app whose server holds the session (CR-104): the authorize
// URL, the code exchange (it needs the client secret: server only), the profile and the
// organizations of the person. Pure: no React, no browser API; `fetchFn` is replaceable in tests.

export type GitHubOAuthConfig = {
    clientId: string;
    clientSecret: string;
    /** Default scopes, e.g. `['read:org']` to list the organizations of the person. */
    scopes?: string[];
};

export type GitHubOAuthUser = { login: string; name: string | null; avatarUrl: string | null; email: string | null };

export type GitHubOAuthOrganization = { login: string; avatarUrl: string | null; role: 'admin' | 'member' };

export class GitHubOAuthError extends Error {
    constructor(message: string, readonly status?: number) {
        super(message);
    }
}

const GITHUB = 'https://github.com';
const API = 'https://api.github.com';

export function createGitHubOAuth(config: GitHubOAuthConfig, fetchFn: typeof fetch = globalThis.fetch) {
    const api = async <T>(path: string, token: string): Promise<T> => {
        const response = await fetchFn(`${API}${path}`, {
            headers: { Accept: 'application/vnd.github+json', Authorization: `Bearer ${token}`, 'X-GitHub-Api-Version': '2022-11-28' },
        });
        if (!response.ok) throw new GitHubOAuthError(`GitHub ${path}: HTTP ${response.status}`, response.status);
        return response.json() as Promise<T>;
    };

    return {
        /** Where the person authorizes the app. `state` ties the callback to this request; `codeChallenge` (S256) adds PKCE. */
        authorizeUrl({ state, redirectUri, scopes = config.scopes, codeChallenge }: { state: string; redirectUri: string; scopes?: string[]; codeChallenge?: string }): string {
            const params = new URLSearchParams({ client_id: config.clientId, redirect_uri: redirectUri, state });
            if (scopes?.length) params.set('scope', scopes.join(' '));
            if (codeChallenge) {
                params.set('code_challenge', codeChallenge);
                params.set('code_challenge_method', 'S256');
            }
            return `${GITHUB}/login/oauth/authorize?${params.toString()}`;
        },

        /** The access token for the code GitHub sent back. */
        async exchangeCode({ code, redirectUri, codeVerifier }: { code: string; redirectUri: string; codeVerifier?: string }): Promise<{ accessToken: string; scope: string }> {
            const response = await fetchFn(`${GITHUB}/login/oauth/access_token`, {
                method: 'POST',
                headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    client_id: config.clientId,
                    client_secret: config.clientSecret,
                    code,
                    redirect_uri: redirectUri,
                    ...(codeVerifier ? { code_verifier: codeVerifier } : {}),
                }),
            });
            const body = await response.json().catch(() => ({})) as Record<string, unknown>;
            if (!response.ok || typeof body.access_token !== 'string') {
                throw new GitHubOAuthError(String(body.error_description ?? body.error ?? `HTTP ${response.status}`), response.status);
            }
            return { accessToken: body.access_token, scope: String(body.scope ?? '') };
        },

        async getUser(token: string): Promise<GitHubOAuthUser> {
            const user = await api<{ login: string; name?: string | null; avatar_url?: string | null; email?: string | null }>('/user', token);
            return { login: user.login, name: user.name ?? null, avatarUrl: user.avatar_url ?? null, email: user.email ?? null };
        },

        /** The organizations the person belongs to, with their role (needs `read:org`). */
        async getOrganizations(token: string): Promise<GitHubOAuthOrganization[]> {
            const memberships = await api<Array<{ role: string; organization: { login: string; avatar_url?: string | null } }>>('/user/memberships/orgs?state=active&per_page=100', token);
            return memberships.map(({ role, organization }) => ({
                login: organization.login,
                avatarUrl: organization.avatar_url ?? null,
                role: role === 'admin' ? 'admin' : 'member',
            }));
        },
    };
}

export type GitHubOAuth = ReturnType<typeof createGitHubOAuth>;
