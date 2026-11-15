// Google access tokens on a server (CR-133), for Vertex AI: a service account, the application default
// credentials (the file of GOOGLE_APPLICATION_CREDENTIALS or of `gcloud auth application-default login`), or the
// identity of the server on Google Cloud (metadata server). Node only: exported by `@llmnative/react/server`.

import type { GoogleServiceAccount } from '../../Config';
import { GoogleServiceAccountProvider } from '../credentials/google/GoogleServiceAccountProvider';
import { createAIProvider } from './index';
import type { AIProviderAdapter } from './AIProvider';
import { createVertexProviderDefinition, type VertexProviderOptions } from './vertex';

export const CLOUD_PLATFORM_SCOPE = 'https://www.googleapis.com/auth/cloud-platform';
const TOKEN_URL = 'https://oauth2.googleapis.com/token';
const METADATA_TOKEN_URL = 'http://metadata.google.internal/computeMetadata/v1/instance/service-accounts/default/token';

/** Where the token comes from. */
export type GoogleCredentialKind = 'service-account' | 'authorized-user' | 'metadata';

export type GoogleAccessToken = {
    /** A valid token, renewed a minute before it expires. */
    token: () => Promise<string>;
    kind: GoogleCredentialKind;
    /** The project of the credentials (the service account's, or the quota project of a person's ADC file). */
    projectId?: string;
};

export type GoogleAccessTokenOptions = {
    /** A service account key (the JSON, as an object or text). Absent: the application default credentials. */
    serviceAccount?: GoogleServiceAccount | string;
    fetch?: typeof fetch;
    env?: Record<string, string | undefined>;
};

type AdcFile =
    | ({ type: 'service_account' } & GoogleServiceAccount & { project_id?: string })
    | { type: 'authorized_user'; client_id: string; client_secret: string; refresh_token: string; quota_project_id?: string };

/** A token that is fetched once and kept until a minute before it expires. */
function cached(fetchToken: () => Promise<{ token: string; expiresIn: number }>): () => Promise<string> {
    let current: { token: string; expiresAt: number } | undefined;
    let pending: Promise<string> | undefined;
    return () => {
        if (current && current.expiresAt > Date.now() + 60_000) return Promise.resolve(current.token);
        pending ??= fetchToken()
            .then(({ token, expiresIn }) => {
                current = { token, expiresAt: Date.now() + expiresIn * 1000 };
                return token;
            })
            .finally(() => { pending = undefined; });
        return pending;
    };
}

const parseServiceAccount = (value: GoogleServiceAccount | string): GoogleServiceAccount & { project_id?: string } => {
    const parsed = typeof value === 'string' ? JSON.parse(value) as GoogleServiceAccount & { project_id?: string } : value;
    if (!parsed?.client_email || !parsed?.private_key) throw new Error('Google credentials: the service account has no client_email or private_key');
    return parsed;
};

async function readAdcFile(env: Record<string, string | undefined>): Promise<AdcFile | undefined> {
    const { readFile } = await import('node:fs/promises');
    const { join } = await import('node:path');
    const { homedir } = await import('node:os');
    const explicit = env.GOOGLE_APPLICATION_CREDENTIALS;
    const wellKnown = env.APPDATA
        ? join(env.APPDATA, 'gcloud', 'application_default_credentials.json')
        : join(env.HOME ?? homedir(), '.config', 'gcloud', 'application_default_credentials.json');
    for (const file of explicit ? [explicit] : [wellKnown]) {
        try {
            return JSON.parse(await readFile(file, 'utf8')) as AdcFile;
        } catch (error) {
            if (explicit) throw new Error('Google credentials: GOOGLE_APPLICATION_CREDENTIALS does not point to a readable JSON file');
            if ((error as NodeJS.ErrnoException)?.code !== 'ENOENT') throw new Error('Google credentials: the application default credentials file is not readable');
        }
    }
    return undefined;
}

/**
 * Google access tokens for the Cloud Platform scope, renewed before they expire. With `serviceAccount` that
 * key; otherwise the application default credentials: the file of `GOOGLE_APPLICATION_CREDENTIALS`, gcloud's
 * file, or the metadata server (Cloud Functions, Cloud Run, Compute Engine). Errors never carry a secret.
 */
export async function googleAccessToken({ serviceAccount, fetch: http = globalThis.fetch, env = process.env }: GoogleAccessTokenOptions = {}): Promise<GoogleAccessToken> {
    if (serviceAccount) {
        const account = parseServiceAccount(serviceAccount);
        const provider = new GoogleServiceAccountProvider(account);
        return { kind: 'service-account', token: () => provider.getToken(CLOUD_PLATFORM_SCOPE), projectId: account.project_id };
    }
    const file = await readAdcFile(env);
    if (file?.type === 'service_account') return googleAccessToken({ serviceAccount: file, fetch: http, env });
    if (file?.type === 'authorized_user') {
        return {
            kind: 'authorized-user',
            projectId: file.quota_project_id,
            token: cached(async () => {
                const response = await http(TOKEN_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    body: new URLSearchParams({ grant_type: 'refresh_token', client_id: file.client_id, client_secret: file.client_secret, refresh_token: file.refresh_token }),
                });
                if (!response.ok) throw new Error(`Google credentials: the refresh of the user credentials failed (HTTP ${response.status})`);
                const data = await response.json() as { access_token: string; expires_in?: number };
                return { token: data.access_token, expiresIn: data.expires_in ?? 3600 };
            }),
        };
    }
    return {
        kind: 'metadata',
        token: cached(async () => {
            let response: Response;
            try {
                response = await http(`${METADATA_TOKEN_URL}?scopes=${encodeURIComponent(CLOUD_PLATFORM_SCOPE)}`, { headers: { 'Metadata-Flavor': 'Google' } });
            } catch {
                throw new Error('Google credentials: none found (no service account, no application default credentials, no metadata server)');
            }
            if (!response.ok) throw new Error(`Google credentials: the metadata server refused the token (HTTP ${response.status})`);
            const data = await response.json() as { access_token: string; expires_in?: number };
            return { token: data.access_token, expiresIn: data.expires_in ?? 3600 };
        }),
    };
}

export type VertexAIProviderOptions = Omit<VertexProviderOptions, 'quotaProject'> & GoogleAccessTokenOptions & {
    /** Absent: the project of the credentials of a person, when it uses them (needed to list the models). */
    quotaProject?: VertexProviderOptions['quotaProject'];
};

/**
 * The Vertex AI adapter on a server (CR-133), with its tokens: a service account, or the application default
 * credentials (on Google Cloud the identity of the server, no file). The same API as every AI provider.
 */
export async function createVertexAIProvider({ serviceAccount, fetch, env, quotaProject, ...options }: VertexAIProviderOptions): Promise<AIProviderAdapter> {
    const credentials = await googleAccessToken({ serviceAccount, fetch, env });
    const definition = createVertexProviderDefinition({
        ...options,
        quotaProject: quotaProject ?? (credentials.kind === 'authorized-user' ? true : undefined),
    });
    return createAIProvider(definition, credentials.token);
}
