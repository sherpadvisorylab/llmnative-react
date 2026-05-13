import type { DropboxConfig } from '../../../Config';
import {
    createConfigurationState,
    getMissingKeys,
    type ProviderConfigurationState,
} from '../../ProviderConfiguration';
import {
    clearAccessToken,
    getAccessToken,
    getAuthSession,
    redirectToAuthPage,
} from '../../../auth';
import type { AuthProviderAdapter, AuthSignInOptions, UserProfile } from '../AuthProvider';

export const DROPBOX_AUTH_SERVER = 'www.dropbox.com/oauth2';

export class DropboxAuthProvider implements AuthProviderAdapter {
    constructor(private readonly config: DropboxConfig) {}

    getConfigurationState(): ProviderConfigurationState {
        return createConfigurationState(
            'DropboxAuthProvider',
            getMissingKeys(this.config as unknown as Record<string, unknown>, ['clientId'], 'dropbox.')
        );
    }

    isConfigured(): boolean {
        return this.getConfigurationState().configured;
    }

    getUser(): UserProfile | null {
        if (!this.isConfigured()) return null;
        const session = getAuthSession(this.config.clientId);
        if (!session?.access_token) return null;
        return {
            uid: session.account_id ?? this.config.clientId,
            displayName: 'Dropbox',
            provider: 'dropbox',
            accountId: session.account_id,
        };
    }

    async signIn(options: AuthSignInOptions = {}): Promise<UserProfile | null> {
        if (!this.isConfigured()) {
            throw new Error('DropboxAuthProvider: missing dropbox.clientId configuration.');
        }

        redirectToAuthPage({
            authServer: DROPBOX_AUTH_SERVER,
            clientID: this.config.clientId,
            scopes: options.scopes,
            refreshParamName: 'token_access_type',
        });
        return this.getUser();
    }

    async signOut(): Promise<void> {
        clearAccessToken(this.config.clientId);
    }

    onAuthChange(callback: (user: UserProfile | null) => void): () => void {
        callback(this.getUser());
        return () => {};
    }

    async getAccessToken(): Promise<string> {
        if (!this.isConfigured()) {
            throw new Error('DropboxAuthProvider: missing dropbox.clientId configuration.');
        }

        const token = await getAccessToken(this.config.clientId);
        if (!token) {
            throw new Error('DropboxAuthProvider: access token not found.');
        }
        return token;
    }

    isAuthenticated(): boolean {
        if (!this.isConfigured()) return false;
        return !!getAuthSession(this.config.clientId)?.access_token;
    }
}
