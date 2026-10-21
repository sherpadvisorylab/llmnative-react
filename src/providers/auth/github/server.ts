// `@llmnative/react/server` (auth/github): what an app's own server needs to run a GitHub
// OAuth session (CR-104). No React and no browser API: it exchanges the code with the client
// secret and never sends a token to the browser, so it can run in a Node server or an edge
// function. The app's server exposes `/login`, `/me` and `/logout` on top of these helpers.

const GITHUB_AUTHORIZE_URL = 'https://github.com/login/oauth/authorize';
const GITHUB_TOKEN_URL = 'https://github.com/login/oauth/access_token';
const GITHUB_API_URL = 'https://api.github.com';
const GITHUB_API_VERSION = '2022-11-28';

/** Scopes the authorize URL asks for by default: profile, verified email, organizations. */
export const GITHUB_DEFAULT_SCOPES: readonly string[] = ['read:user', 'user:email', 'read:org'];

export type GitHubOAuthConfig = {
    clientId: string;
    clientSecret: string;
    /** Scopes requested when an authorize URL does not specify its own. */
    scopes?: string[];
};

export type GitHubAuthorizeOptions = {
    /** Opaque anti-CSRF value, echoed back by GitHub. The server must verify it on the callback. */
    state: string;
    /** The app's callback URL, registered on the GitHub OAuth app. */
    redirectUri: string;
    scopes?: string[];
    /** PKCE challenge from `createGitHubPkce()`. */
    codeChallenge?: string;
    /** Whether GitHub may offer account creation. */
    allowSignup?: boolean;
};

export type GitHubTokenExchangeOptions = {
    code: string;
    redirectUri: string;
    /** PKCE verifier from `createGitHubPkce()`, when the authorize URL used its challenge. */
    codeVerifier?: string;
};

export type GitHubToken = {
    accessToken: string;
    tokenType: string;
    scope: string;
};

export type GitHubUser = {
    id: number;
    login: string;
    name?: string | null;
    email?: string | null;
    avatar_url?: string | null;
    [key: string]: unknown;
};

export type GitHubOrganization = {
    id: number;
    login: string;
    description?: string | null;
    avatar_url?: string | null;
    [key: string]: unknown;
};

/** An organization the user belongs to, with the role of that membership. */
export type GitHubAdminOrganization = GitHubOrganization & { role: string };

export type GitHubOrganizationMembership = {
    role: string;
    state: string;
    organization: GitHubOrganization;
    [key: string]: unknown;
};

export type GitHubPkce = {
    codeVerifier: string;
    codeChallenge: string;
};

/** A GitHub OAuth/API failure: the HTTP status and, when the provider sent one, its message. */
export class GitHubOAuthError extends Error {
    readonly status: number;
    readonly providerMessage?: string;

    constructor(message: string, status: number, providerMessage?: string) {
        super(message);
        this.name = 'GitHubOAuthError';
        this.status = status;
        this.providerMessage = providerMessage;
    }
}

const webCrypto = (): Crypto => {
    const crypto = globalThis.crypto;
    if (!crypto?.subtle) {
        throw new Error('createGitHubOAuth: Web Crypto is not available in this runtime.');
    }
    return crypto;
};

const bytesToBase64Url = (bytes: Uint8Array): string => {
    let binary = '';
    for (const byte of bytes) binary += String.fromCharCode(byte);
    return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
};

const randomBase64Url = (byteLength: number): string => {
    const bytes = new Uint8Array(byteLength);
    webCrypto().getRandomValues(bytes);
    return bytesToBase64Url(bytes);
};

const sha256Base64Url = async (value: string): Promise<string> => {
    const digest = await webCrypto().subtle.digest('SHA-256', new TextEncoder().encode(value));
    return bytesToBase64Url(new Uint8Array(digest));
};

/** A fresh PKCE pair (S256): hand `codeChallenge` to the authorize URL, keep `codeVerifier` for the exchange. */
export const createGitHubPkce = async (): Promise<GitHubPkce> => {
    const codeVerifier = randomBase64Url(32);
    return { codeVerifier, codeChallenge: await sha256Base64Url(codeVerifier) };
};

const readJson = async (response: Response): Promise<Record<string, unknown>> => {
    try {
        const body = await response.json();
        return body && typeof body === 'object' ? (body as Record<string, unknown>) : {};
    } catch {
        return {};
    }
};

const providerMessage = (body: Record<string, unknown>): string | undefined => {
    const message = body.error_description ?? body.message ?? body.error;
    return typeof message === 'string' ? message : undefined;
};

export type GitHubOAuth = {
    /** The GitHub authorize URL, with `state` and (optionally) the PKCE challenge. */
    authorizeUrl(options: GitHubAuthorizeOptions): string;
    /** Generates `state` and PKCE, and returns the authorize URL plus what to keep for the callback. */
    beginAuthorization(options: { redirectUri: string; scopes?: string[] }): Promise<{ url: string; state: string; codeVerifier: string }>;
    /** Exchanges the callback `code` for an access token, using the client secret. */
    exchangeCode(options: GitHubTokenExchangeOptions): Promise<GitHubToken>;
    /** The authenticated user's profile. */
    getUser(accessToken: string): Promise<GitHubUser>;
    /** The organizations in which the authenticated user is an admin. */
    getAdminOrganizations(accessToken: string): Promise<GitHubAdminOrganization[]>;
};

/**
 * Builds the server-side GitHub OAuth helper. Keep `clientSecret` on the server only: never
 * pass this object, or the secret, into the browser bundle.
 */
export const createGitHubOAuth = (config: GitHubOAuthConfig): GitHubOAuth => {
    if (!config.clientId || !config.clientSecret) {
        throw new Error('createGitHubOAuth: clientId and clientSecret are required.');
    }
    const defaultScopes = config.scopes ?? [...GITHUB_DEFAULT_SCOPES];

    const authorizeUrl = (options: GitHubAuthorizeOptions): string => {
        const params = new URLSearchParams({
            client_id: config.clientId,
            redirect_uri: options.redirectUri,
            scope: (options.scopes ?? defaultScopes).join(' '),
            state: options.state,
        });
        if (options.codeChallenge) {
            params.set('code_challenge', options.codeChallenge);
            params.set('code_challenge_method', 'S256');
        }
        if (options.allowSignup) params.set('allow_signup', 'true');
        return `${GITHUB_AUTHORIZE_URL}?${params.toString()}`;
    };

    const beginAuthorization = async ({ redirectUri, scopes }: { redirectUri: string; scopes?: string[] }): Promise<{ url: string; state: string; codeVerifier: string }> => {
        const { codeVerifier, codeChallenge } = await createGitHubPkce();
        const state = randomBase64Url(16);
        return { url: authorizeUrl({ state, redirectUri, scopes, codeChallenge }), state, codeVerifier };
    };

    const exchangeCode = async (options: GitHubTokenExchangeOptions): Promise<GitHubToken> => {
        const response = await fetch(GITHUB_TOKEN_URL, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                client_id: config.clientId,
                client_secret: config.clientSecret,
                code: options.code,
                redirect_uri: options.redirectUri,
                ...(options.codeVerifier ? { code_verifier: options.codeVerifier } : {}),
            }),
        });
        const body = await readJson(response);
        // GitHub answers 200 with an `error` in the body for a bad code.
        if (!response.ok || body.error) {
            throw new GitHubOAuthError(
                `GitHub token exchange failed (${response.status}).`,
                response.status,
                providerMessage(body)
            );
        }
        const accessToken = typeof body.access_token === 'string' ? body.access_token : '';
        if (!accessToken) {
            throw new GitHubOAuthError('GitHub token exchange returned no access_token.', response.status);
        }
        return {
            accessToken,
            tokenType: typeof body.token_type === 'string' ? body.token_type : 'bearer',
            scope: typeof body.scope === 'string' ? body.scope : '',
        };
    };

    const githubRequest = async <T>(path: string, accessToken: string): Promise<T> => {
        const response = await fetch(`${GITHUB_API_URL}${path}`, {
            headers: {
                Accept: 'application/vnd.github+json',
                Authorization: `Bearer ${accessToken}`,
                'X-GitHub-Api-Version': GITHUB_API_VERSION,
            },
        });
        const body = await readJson(response);
        if (!response.ok) {
            throw new GitHubOAuthError(
                `GitHub API ${path} failed (${response.status}).`,
                response.status,
                providerMessage(body)
            );
        }
        return body as T;
    };

    const getUser = (accessToken: string): Promise<GitHubUser> =>
        githubRequest<GitHubUser>('/user', accessToken);

    const getAdminOrganizations = async (accessToken: string): Promise<GitHubAdminOrganization[]> => {
        const memberships = await githubRequest<GitHubOrganizationMembership[]>('/user/memberships/orgs?state=active', accessToken);
        return memberships
            .filter((membership) => membership.role === 'admin')
            .map((membership) => ({ ...membership.organization, role: membership.role }));
    };

    return { authorizeUrl, beginAuthorization, exchangeCode, getUser, getAdminOrganizations };
};
