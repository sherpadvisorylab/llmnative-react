import { describe, expect, it, vi } from 'vitest';

// Prevent side-effect in proxy/index.ts (onConfigChange called at module level)
vi.mock('../../../src/Config', () => ({
    getConfig: vi.fn(() => ({})),
    onConfigChange: vi.fn(),
    default: {},
}));

import { PROVIDER_MANIFESTS } from '../../../src/providers/manifest';

describe('provider manifest auth drivers', () => {
    it('registers Firebase as an auth driver', () => {
        const descriptor = PROVIDER_MANIFESTS.firebase.firebaseAuth;

        expect(descriptor.service).toBe('auth');
        const provider = descriptor.create({});
        expect(provider).toMatchObject({
            getUser:      expect.any(Function),
            signIn:       expect.any(Function),
            signOut:      expect.any(Function),
            onAuthChange: expect.any(Function),
            getAccessToken: expect.any(Function),
        });
    });

    it('registers Dropbox as an auth driver', () => {
        const descriptor = PROVIDER_MANIFESTS.dropbox.dropboxAuth;

        expect(descriptor.service).toBe('auth');
        expect(descriptor.create({ clientId: 'dropbox-client', rootPath: '' })).toMatchObject({
            getUser: expect.any(Function),
            signIn: expect.any(Function),
            signOut: expect.any(Function),
            getAccessToken: expect.any(Function),
        });
    });

    it('registers Supabase as an auth driver', () => {
        const descriptor = PROVIDER_MANIFESTS.supabase.supabaseAuth;

        expect(descriptor.service).toBe('auth');
        const provider = descriptor.create({ url: 'https://x.supabase.co', anonKey: 'key' });
        expect(provider).toMatchObject({
            getUser:        expect.any(Function),
            signIn:         expect.any(Function),
            signOut:        expect.any(Function),
            getAccessToken: expect.any(Function),
            onAuthChange:   expect.any(Function),
        });
    });

    it('registers Supabase data driver', () => {
        const descriptor = PROVIDER_MANIFESTS.supabase.supabaseDb;
        expect(descriptor.service).toBe('data');
        const provider = descriptor.create({ url: 'https://x.supabase.co', anonKey: 'key' });
        expect(provider).toMatchObject({ read: expect.any(Function), set: expect.any(Function) });
    });

    it('registers Supabase storage driver', () => {
        const descriptor = PROVIDER_MANIFESTS.supabase.supabaseStorage;
        expect(descriptor.service).toBe('storage');
        const provider = descriptor.create({ url: 'https://x.supabase.co', anonKey: 'key' });
        expect(provider).toMatchObject({ upload: expect.any(Function), getURL: expect.any(Function) });
    });
});
