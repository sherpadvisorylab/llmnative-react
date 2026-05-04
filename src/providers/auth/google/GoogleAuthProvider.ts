import { onAuthStateChanged, signOut as firebaseSignOut } from 'firebase/auth';
import { AuthProvider, UserProfile } from '../AuthProvider';
import { getGlobalVars, removeGlobalVars } from '../../../Global';
import { getSafeAuth } from '../../firebase-init';
import { googleGetAccessToken } from './GoogleAuth';

export class GoogleAuthProvider implements AuthProvider {
    getUser(): UserProfile | null {
        const stored = getGlobalVars("user");
        if (!stored) return null;
        return {
            uid: stored.uid,
            email: stored.email,
            displayName: stored.displayName ?? stored.profile?.name,
            photoURL: stored.photoURL ?? stored.profile?.picture,
            ...stored.profile,
        };
    }

    async signOut(): Promise<void> {
        const stored = getGlobalVars("user");
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
            callback(null);
            return () => {};
        }
        return onAuthStateChanged(auth, (firebaseUser) => {
            if (!firebaseUser) {
                callback(null);
                return;
            }
            const stored = getGlobalVars("user");
            callback({
                uid: firebaseUser.uid,
                email: firebaseUser.email ?? undefined,
                displayName: firebaseUser.displayName ?? stored?.profile?.name,
                photoURL: firebaseUser.photoURL ?? stored?.profile?.picture,
                ...stored?.profile,
            });
        });
    }

    getAccessToken(scopes: string[] = []): Promise<string> {
        return googleGetAccessToken(scopes);
    }
}
