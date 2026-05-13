import { beforeEach, describe, expect, it } from 'vitest';
import { setGlobalVars } from '../../../src/Global';
import { DropboxAuthProvider } from '../../../src/providers/auth/dropbox/DropboxAuthProvider';

describe('DropboxAuthProvider', () => {
    beforeEach(() => {
        localStorage.clear();
    });

    it('reports authentication from the stored OAuth session', async () => {
        setGlobalVars({
            dropboxClient: {
                access_token: 'token-1',
                expires_in: 3600,
                iat: Math.floor(Date.now() / 1000),
                account_id: 'account-1',
                server: 'www.dropbox.com/oauth2',
                client_id: 'dropboxClient',
            },
        }, 'auths');

        const provider = new DropboxAuthProvider({ clientId: 'dropboxClient', rootPath: '' });

        expect(provider.isAuthenticated()).toBe(true);
        expect(provider.getUser()).toMatchObject({
            uid: 'account-1',
            displayName: 'Dropbox',
            provider: 'dropbox',
        });
        await expect(provider.getAccessToken()).resolves.toBe('token-1');
    });

    it('clears the stored OAuth session on signOut', async () => {
        setGlobalVars({
            dropboxClient: {
                access_token: 'token-1',
                expires_in: 3600,
                iat: Math.floor(Date.now() / 1000),
                server: 'www.dropbox.com/oauth2',
                client_id: 'dropboxClient',
            },
        }, 'auths');

        const provider = new DropboxAuthProvider({ clientId: 'dropboxClient', rootPath: '' });

        await provider.signOut();

        expect(provider.isAuthenticated()).toBe(false);
        expect(provider.getUser()).toBeNull();
    });

    it('stays inactive when clientId is missing', async () => {
        const provider = new DropboxAuthProvider({ clientId: '', rootPath: '' });

        expect(provider.isConfigured()).toBe(false);
        expect(provider.getConfigurationState()).toMatchObject({
            configured: false,
            missingKeys: ['dropbox.clientId'],
        });
        expect(provider.isAuthenticated()).toBe(false);
        expect(provider.getUser()).toBeNull();
        await expect(provider.getAccessToken()).rejects.toThrow('missing dropbox.clientId');
    });
});
