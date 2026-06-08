import type { CredentialsAdapter } from '../CredentialsProvider';
import type { GoogleServiceAccount } from '../../../Config';

const GOOGLE_TOKEN_URL = 'https://oauth2.googleapis.com/token';

// ── PEM → DER ─────────────────────────────────────────────────────────────────

function pemToDer(pem: string): ArrayBuffer {
    const base64 = pem
        .replace(/-----BEGIN PRIVATE KEY-----/, '')
        .replace(/-----END PRIVATE KEY-----/, '')
        .replace(/\s+/g, '');
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
    return bytes.buffer;
}

// ── Base64url encoding ────────────────────────────────────────────────────────

function base64url(input: string | ArrayBuffer): string {
    const str = typeof input === 'string'
        ? btoa(input)
        : btoa(String.fromCharCode(...new Uint8Array(input)));
    return str.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

// ── JWT signing via Web Crypto ────────────────────────────────────────────────

async function signJWT(payload: object, privateKeyPem: string): Promise<string> {
    const header = { alg: 'RS256', typ: 'JWT' };
    const encodedHeader  = base64url(JSON.stringify(header));
    const encodedPayload = base64url(JSON.stringify(payload));
    const signingInput   = `${encodedHeader}.${encodedPayload}`;

    const key = await crypto.subtle.importKey(
        'pkcs8',
        pemToDer(privateKeyPem),
        { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
        false,
        ['sign'],
    );

    const signature = await crypto.subtle.sign(
        'RSASSA-PKCS1-v1_5',
        key,
        new TextEncoder().encode(signingInput),
    );

    return `${signingInput}.${base64url(signature)}`;
}

// ── Token cache ───────────────────────────────────────────────────────────────

interface CachedToken {
    token: string;
    expiresAt: number;
}

// ── Provider ──────────────────────────────────────────────────────────────────

export class GoogleServiceAccountProvider implements CredentialsAdapter {
    private config: GoogleServiceAccount;
    private cache = new Map<string, CachedToken>();

    constructor(config: GoogleServiceAccount) {
        this.config = config;
    }

    async getToken(scope = 'https://www.googleapis.com/auth/cloud-platform'): Promise<string> {
        const cached = this.cache.get(scope);
        if (cached && cached.expiresAt > Date.now() + 60_000) return cached.token;

        const now = Math.floor(Date.now() / 1000);
        const payload = {
            iss: this.config.client_email,
            scope,
            aud: GOOGLE_TOKEN_URL,
            iat: now,
            exp: now + 3600,
        };

        const jwt = await signJWT(payload, this.config.private_key);

        const response = await fetch(GOOGLE_TOKEN_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
                grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
                assertion: jwt,
            }),
        });

        if (!response.ok) {
            const error = await response.text();
            throw new Error(`GoogleServiceAccountProvider: token request failed - ${error}`);
        }

        const data = await response.json();
        this.cache.set(scope, {
            token: data.access_token,
            expiresAt: Date.now() + (data.expires_in ?? 3600) * 1000,
        });

        return data.access_token;
    }
}
