import { describe, expect, it } from 'vitest';
import {
    createConfigurationState,
    getMissingKeys,
    getProviderConfigurationState,
} from '../../../src/providers/ProviderConfiguration';
import { DropboxAuthProvider } from '../../../src/providers/auth/dropbox/DropboxAuthProvider';
import { SupabaseDataProvider } from '../../../src/providers/data/supabase';
import { SupabaseStorageProvider } from '../../../src/providers/storage/supabase';

describe('ProviderConfiguration', () => {
    it('builds missing key diagnostics', () => {
        expect(getMissingKeys({ apiKey: '', projectId: 'p1' }, ['apiKey', 'projectId'], 'firebase.'))
            .toEqual(['firebase.apiKey']);

        expect(createConfigurationState('FirebaseProvider', ['firebase.apiKey'])).toEqual({
            configured: false,
            missingKeys: ['firebase.apiKey'],
            reason: 'FirebaseProvider is not configured. Missing: firebase.apiKey.',
        });
    });

    it('reads configuration state from configurable providers', () => {
        const provider = new DropboxAuthProvider({ clientId: '', rootPath: '' });

        expect(getProviderConfigurationState(provider, 'dropboxAuth')).toMatchObject({
            configured: false,
            missingKeys: ['dropbox.clientId'],
        });
    });

    it('defaults legacy providers to configured', () => {
        expect(getProviderConfigurationState({}, 'legacy')).toEqual({ configured: true });
    });

    it('reports Supabase data and storage missing keys', () => {
        expect(new SupabaseDataProvider({ url: '', anonKey: '' }).getConfigurationState()).toMatchObject({
            configured: false,
            missingKeys: ['supabase.url', 'supabase.anonKey'],
        });

        expect(new SupabaseStorageProvider({ url: 'https://example.test', anonKey: '' }).getConfigurationState()).toMatchObject({
            configured: false,
            missingKeys: ['supabase.anonKey'],
        });
    });
});
