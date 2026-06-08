import {
    getAdditionalUserInfo,
    GoogleAuthProvider as FirebaseGoogleAuthProvider,
    onAuthStateChanged,
    signInWithCredential,
    signOut as firebaseSignOut,
} from 'firebase/auth';
import { AuthProviderAdapter, AuthSignInOptions, UserProfile } from '../AuthProvider';
import { getGlobalVars, removeGlobalVars, setGlobalVars } from '../../../Global';
import { getSafeAuth } from '../../firebase-init';
import { authConfig } from './auth';
import { decodeJWT, loadScripts } from '../../../libs/utils';
import {
    createConfigurationState,
    getMissingKeys,
    type ProviderConfigurationState,
} from '../../ProviderConfiguration';

type GoogleUserProfile = { email?: string; name?: string; picture?: string; sub?: string };
type UserStore = { uid?: string; email?: string; displayName?: string; photoURL?: string; profile?: GoogleUserProfile };

const loadGoogleIdentityScript = async (): Promise<void> => {
    if ((window as any).google?.accounts?.id) return;
    loadScripts([
        { src: 'https://accounts.google.com/gsi/client', async: true, clean: true },
    ]);
    await new Promise((resolve) => setTimeout(resolve, 0));
};

export class GoogleAuthProvider implements AuthProviderAdapter {
    getConfigurationState(): ProviderConfigurationState {
        return createConfigurationState(
            'GoogleAuthProvider',
            getMissingKeys(authConfig('oAuth2') as Record<string, unknown> | undefined, ['clientId'], 'google.oAuth2.')
        );
    }

    isConfigured(): boolean {
        return this.getConfigurationState().configured;
    }

    getUser(): UserProfile | null {
        if (!this.isConfigured()) return null;
        const stored = getGlobalVars("user") as UserStore | null;
        if (!stored) return null;
        const profile = stored.profile ?? {};
        return {
            ...profile,
            uid: stored.uid,
            email: stored.email ?? profile.email,
            displayName: stored.displayName ?? profile.name,
            photoURL: stored.photoURL ?? profile.picture,
        };
    }

    async signIn(options: AuthSignInOptions = {}): Promise<UserProfile | null> {
        const config = authConfig('oAuth2');
        if (!this.isConfigured() || !config?.clientId) {
            throw new Error('GoogleAuthProvider: missing google.oAuth2.clientId configuration.');
        }

        await loadGoogleIdentityScript();

        return new Promise((resolve, reject) => {
            if (!(window as any).google?.accounts?.id) {
                reject(new Error('GoogleAuthProvider: Google Identity Services script is not available.'));
                return;
            }

            (window as any).handleGoogleSignIn = async ({ credential }: { credential: string }): Promise<void> => {
                try {
                    const credentialDecoded = decodeJWT(credential);
                    localStorage.setItem('googleCredentialToken', credential);

                    const firebaseAuth = getSafeAuth();
                    if (!firebaseAuth) {
                        reject(new Error('GoogleAuthProvider: Firebase auth is not initialized.'));
                        return;
                    }

                    const firebaseCredential = FirebaseGoogleAuthProvider.credential(credential);
                    const userCredential = await signInWithCredential(firebaseAuth, firebaseCredential);
                    const additionalUserInfo = getAdditionalUserInfo(userCredential);

                    setGlobalVars({
                        ...userCredential.user,
                        profile: additionalUserInfo?.profile ?? credentialDecoded,
                    }, 'user');

                    if (options.scopes?.length) {
                        await this.getAccessToken(options.scopes);
                    }

                    resolve(this.getUser());
                } catch (error) {
                    reject(error);
                }
            };

            (window as any).google.accounts.id.initialize({
                client_id: config.clientId,
                callback: (window as any).handleGoogleSignIn,
                auto_select: false,
                cancel_on_tap_outside: true,
            });
            (window as any).google.accounts.id.prompt();
        });
    }

    async signOut(): Promise<void> {
        const stored = getGlobalVars("user") as UserStore | null;
        if (stored?.profile?.sub) {
            (window as any).google?.accounts?.id?.revoke(stored.profile.sub);
        }
        localStorage.removeItem("googleCredentialToken");
        removeGlobalVars("user");
        const auth = getSafeAuth();
        if (auth) {
            await firebaseSignOut(auth);
        }
    }

    onAuthChange(callback: (user: UserProfile | null) => void): () => void {
        const auth = getSafeAuth();
        if (!auth) {
            callback(this.getUser());
            return () => {};
        }
        return onAuthStateChanged(auth, (firebaseUser) => {
            const storedUser = this.getUser();
            if (!firebaseUser) {
                callback(storedUser);
                return;
            }
            const stored = getGlobalVars("user") as UserStore | null;
            const profile = stored?.profile ?? {};
            callback({
                ...profile,
                uid: firebaseUser.uid,
                email: firebaseUser.email ?? profile.email,
                displayName: firebaseUser.displayName ?? profile.name,
                photoURL: firebaseUser.photoURL ?? profile.picture,
            });
        });
    }

    getAccessToken(scopes: string[] = []): Promise<string> {
        const config = authConfig('oAuth2');
        if (!this.isConfigured() || !config?.clientId) {
            return Promise.reject('Google client ID not found');
        }

        const scope = scopes.join(' ');
        const tokenKey = `googleAccessToken::${scope}`;
        const expiresKey = `googleExpiresAt::${scope}`;

        return new Promise((resolve, reject) => {
            const accessToken = localStorage.getItem(tokenKey);
            const expiresAt = localStorage.getItem(expiresKey);
            const isExpired = !expiresAt || new Date(expiresAt).getTime() < Date.now();

            if (accessToken && !isExpired) {
                resolve(accessToken);
                return;
            }

            const gclient = (window as any).google?.accounts?.oauth2?.initTokenClient({
                client_id: config.clientId,
                scope,
                callback: (tokenResponse: { access_token?: string; expires_in: number }) => {
                    if (tokenResponse.access_token) {
                        localStorage.setItem(tokenKey, tokenResponse.access_token);
                        localStorage.setItem(expiresKey, new Date(Date.now() + tokenResponse.expires_in * 1000).toISOString());
                        resolve(tokenResponse.access_token);
                    } else {
                        reject('Failed to obtain access token');
                    }
                },
            });

            if (!gclient) {
                reject('Google token client is not available');
                return;
            }

            gclient.requestAccessToken();
        });
    }

    isAuthenticated(): boolean {
        return !!this.getUser();
    }
}
