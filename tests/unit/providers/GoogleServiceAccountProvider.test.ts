/**
 * GoogleServiceAccountProvider test suite.
 * Mocks fetch and crypto.subtle to avoid real network/crypto calls.
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GoogleServiceAccountProvider } from '../../../src/providers/credentials/google/GoogleServiceAccountProvider';
import type { GoogleServiceAccount } from '../../../src/Config';

// ── Mock config ───────────────────────────────────────────────────────────────

const MOCK_CONFIG: GoogleServiceAccount = {
    type: 'service_account',
    project_id: 'test-project',
    private_key_id: 'key-id-1',
    private_key: '-----BEGIN PRIVATE KEY-----\nMOCK\n-----END PRIVATE KEY-----\n',
    client_email: 'test@test-project.iam.gserviceaccount.com',
    client_id: '123456',
    auth_uri: 'https://accounts.google.com/o/oauth2/auth',
    token_uri: 'https://oauth2.googleapis.com/token',
    auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
    client_x509_cert_url: 'https://www.googleapis.com/robot/v1/metadata/x509/test',
};

// ── Mock crypto.subtle ────────────────────────────────────────────────────────

const mockSignature = new Uint8Array([1, 2, 3, 4]).buffer;

const mockSubtle = {
    importKey: vi.fn(async () => ({ type: 'private' })),
    sign:      vi.fn(async () => mockSignature),
};

Object.defineProperty(global, 'crypto', {
    value: { subtle: mockSubtle },
    writable: true,
});

// ── Mock fetch ────────────────────────────────────────────────────────────────

function mockTokenResponse(token: string, expiresIn = 3600) {
    return vi.spyOn(global, 'fetch').mockResolvedValue({
        ok:   true,
        json: async () => ({ access_token: token, expires_in: expiresIn }),
        text: async () => '',
    } as any);
}

beforeEach(() => {
    vi.restoreAllMocks();
    mockSubtle.importKey.mockResolvedValue({ type: 'private' });
    mockSubtle.sign.mockResolvedValue(mockSignature);
});

// ── getToken ──────────────────────────────────────────────────────────────────

describe('getToken()', () => {
    it('returns the access token from Google token endpoint', async () => {
        mockTokenResponse('my-access-token');
        const provider = new GoogleServiceAccountProvider(MOCK_CONFIG);
        const token = await provider.getToken('https://www.googleapis.com/auth/solar');
        expect(token).toBe('my-access-token');
    });

    it('sends a POST to the Google token URL', async () => {
        const spy = mockTokenResponse('tok');
        const provider = new GoogleServiceAccountProvider(MOCK_CONFIG);
        await provider.getToken('https://www.googleapis.com/auth/solar');
        expect(spy).toHaveBeenCalledWith(
            'https://oauth2.googleapis.com/token',
            expect.objectContaining({ method: 'POST' })
        );
    });

    it('uses the default cloud-platform scope when no scope is given', async () => {
        mockTokenResponse('tok');
        const provider = new GoogleServiceAccountProvider(MOCK_CONFIG);
        await provider.getToken();
        expect(mockSubtle.importKey).toHaveBeenCalled();
    });

    it('caches the token and avoids a second network call', async () => {
        const spy = mockTokenResponse('cached-token');
        const provider = new GoogleServiceAccountProvider(MOCK_CONFIG);
        await provider.getToken('https://www.googleapis.com/auth/sheets');
        await provider.getToken('https://www.googleapis.com/auth/sheets');
        expect(spy).toHaveBeenCalledTimes(1);
    });

    it('uses separate cache entries per scope', async () => {
        const spy = mockTokenResponse('tok');
        const provider = new GoogleServiceAccountProvider(MOCK_CONFIG);
        await provider.getToken('https://www.googleapis.com/auth/sheets');
        await provider.getToken('https://www.googleapis.com/auth/drive');
        expect(spy).toHaveBeenCalledTimes(2);
    });

    it('throws when the token endpoint returns an error', async () => {
        vi.spyOn(global, 'fetch').mockResolvedValue({
            ok:   false,
            text: async () => 'invalid_grant',
        } as any);
        const provider = new GoogleServiceAccountProvider(MOCK_CONFIG);
        await expect(provider.getToken()).rejects.toThrow('token request failed');
    });

    it('signs the JWT using the private key from config', async () => {
        mockTokenResponse('tok');
        const provider = new GoogleServiceAccountProvider(MOCK_CONFIG);
        await provider.getToken('https://www.googleapis.com/auth/solar');
        expect(mockSubtle.sign).toHaveBeenCalled();
    });
});

// ── manifest integration ──────────────────────────────────────────────────────

describe('CredentialsAdapter contract', () => {
    it('exposes getToken as a function', () => {
        const provider = new GoogleServiceAccountProvider(MOCK_CONFIG);
        expect(provider.getToken).toBeTypeOf('function');
    });
});
