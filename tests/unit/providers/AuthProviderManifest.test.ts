import { describe, expect, it } from 'vitest';
import { PROVIDER_MANIFESTS } from '../../../src/providers/manifest';

describe('provider manifest auth drivers', () => {
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
});
