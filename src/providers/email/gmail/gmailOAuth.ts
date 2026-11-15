import { callEmailApi, EmailProviderError } from '../EmailError';
import { GMAIL_API, GOOGLE_TOKEN_URL, PROVIDER } from './gmailApi';

export type GmailOAuthConfig = {
    clientId: string;
    clientSecret: string;
    /** Where Google comes back with the code: a route of the app's server. */
    redirectUri: string;
    fetch?: typeof fetch;
};

export type GmailOAuth = {
    /** The consent page of Google, with a refresh token (offline, consent asked again). */
    authorizationUrl(options: { state: string; scopes: string[]; loginHint?: string }): string;
    /** The code Google came back with → the address of the mailbox and its refresh token. */
    exchangeCode(code: string): Promise<{ email: string; refreshToken: string }>;
};

/**
 * Connecting a Gmail mailbox from a server (CR-130): the consent page, then the refresh token the Gmail
 * adapters take as `auth`. The client secret and the refresh token stay on the server.
 */
export function createGmailOAuth(config: GmailOAuthConfig): GmailOAuth {
    const http = config.fetch ?? globalThis.fetch;
    return {
        authorizationUrl({ state, scopes, loginHint }) {
            const params = new URLSearchParams({
                client_id: config.clientId,
                redirect_uri: config.redirectUri,
                response_type: 'code',
                scope: scopes.join(' '),
                access_type: 'offline',
                prompt: 'consent',
                include_granted_scopes: 'true',
                state,
            });
            if (loginHint) params.set('login_hint', loginHint);
            return `https://accounts.google.com/o/oauth2/v2/auth?${params}`;
        },

        async exchangeCode(code) {
            const grant = await callEmailApi<{ access_token?: string; refresh_token?: string }>(PROVIDER, http, GOOGLE_TOKEN_URL, {
                method: 'POST',
                headers: { 'content-type': 'application/x-www-form-urlencoded' },
                body: new URLSearchParams({
                    code,
                    client_id: config.clientId,
                    client_secret: config.clientSecret,
                    redirect_uri: config.redirectUri,
                    grant_type: 'authorization_code',
                }),
            });
            if (!grant.access_token || !grant.refresh_token) throw new EmailProviderError('unauthorized', PROVIDER, 'Google returned no refresh token');
            const profile = await callEmailApi<{ emailAddress?: string }>(PROVIDER, http, `${GMAIL_API}/profile`, {
                headers: { authorization: `Bearer ${grant.access_token}` },
            });
            return { email: String(profile.emailAddress ?? '').toLowerCase(), refreshToken: grant.refresh_token };
        },
    };
}
