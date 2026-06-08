import { initializeApp, getApp, getApps, deleteApp, type FirebaseApp } from 'firebase/app';
import { getAuth, getAdditionalUserInfo, signInWithCredential, onAuthStateChanged, type Auth, type User } from "firebase/auth";
import { getGoogleCredential } from "./auth/google/auth";
import { FirebaseConfig } from "../Config";
import {
    createConfigurationState,
    getMissingKeys,
    type ProviderConfigurationState,
} from "./ProviderConfiguration";

interface TokenInfo {
    accessToken?: string;
    refreshToken?: string;
    expirationTime?: number;
    isExpired: boolean;
}

let currentFirebaseConfig: FirebaseConfig | undefined;

export const setFirebaseConfigState = (config: FirebaseConfig | undefined): void => {
    currentFirebaseConfig = config;
};

export const getFirebaseConfigurationState = (): ProviderConfigurationState => createConfigurationState(
    'FirebaseProvider',
    getMissingKeys(currentFirebaseConfig as unknown as Record<string, unknown> | undefined, [
        'apiKey',
        'authDomain',
        'databaseURL',
        'projectId',
        'storageBucket',
        'messagingSenderId',
        'appId',
    ], 'firebase.')
);

// Firestore does not require databaseURL - only core Firebase keys are needed.
export const getFirestoreConfigurationState = (): ProviderConfigurationState => createConfigurationState(
    'FirestoreProvider',
    getMissingKeys(currentFirebaseConfig as unknown as Record<string, unknown> | undefined, [
        'apiKey',
        'authDomain',
        'projectId',
        'appId',
    ], 'firebase.')
);

export const getSafeAuth = (): Auth | null => {
    try {
        return getAuth();
    } catch (error: unknown) {
        console.error('FirebaseAuthorization', error instanceof Error ? error.message : 'Error: check Configuration');
        return null;
    }
};

const getUser = (auth: Auth): Promise<User | null> => {
    return new Promise((resolve, reject) => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            unsubscribe();
            resolve(user);
        }, reject);
    });
};

const requestLogin = async (): Promise<boolean> => {
    const googleCredential = getGoogleCredential();
    if (!googleCredential) {
        console.error("Firebase: Google credential not found.");
        return false;
    }
    try {
        const userCredential = await signInWithCredential(getAuth(), googleCredential);
        const additionalUserInfo = getAdditionalUserInfo(userCredential);
        if (additionalUserInfo?.isNewUser) {
            // handle new user if needed
        }
        return true;
    } catch (error) {
        console.error("Firebase getAuthorization: ", error);
        return false;
    }
};

function getTokenInfo(user: User): TokenInfo {
    const { stsTokenManager } = user.toJSON() as {
        stsTokenManager?: {
            accessToken?: string;
            refreshToken?: string;
            expirationTime?: number;
        };
    };
    const expirationTime = stsTokenManager?.expirationTime ?? 0;
    return {
        accessToken: stsTokenManager?.accessToken,
        refreshToken: stsTokenManager?.refreshToken,
        expirationTime: stsTokenManager?.expirationTime,
        isExpired: expirationTime < Date.now(),
    };
}

export const getFirebaseAuthorization = async (): Promise<boolean> => {
    const auth = getSafeAuth();
    if (!auth) return false;

    const user = await getUser(auth);
    if (!user) return requestLogin();

    const tokenInfo = getTokenInfo(user);
    if (!tokenInfo.accessToken) {
        console.error("Firebase access token not found");
        return requestLogin();
    }

    if (tokenInfo.isExpired) {
        try {
            await user.getIdToken(true);
            return true;
        } catch (error) {
            console.error("Firebase token refresh error: ", error);
            return requestLogin();
        }
    }

    return true;
};

const init = async (config: FirebaseConfig): Promise<FirebaseApp> => {
    setFirebaseConfigState(config);
    const apps = getApps();
    const firebaseApp = apps.length ? getApp() : undefined;

    if (firebaseApp) {
        if ((firebaseApp.options as Partial<FirebaseConfig>)?.appId === config.appId) {
            console.log("[firebase] Already initialized with same appId, skipping re-init");
            return firebaseApp;
        }
        await deleteApp(firebaseApp);
    }

    return initializeApp(config);
};

export default init;
