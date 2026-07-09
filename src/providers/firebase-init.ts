import { initializeApp, getApp, getApps, deleteApp, type FirebaseApp } from 'firebase/app';
import { getAuth, getAdditionalUserInfo, signInWithCredential, signInWithCustomToken, setPersistence, inMemoryPersistence, onAuthStateChanged, type Auth, type User } from "firebase/auth";
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

// Firebase apps are keyed by name — the SDK's own unnamed/default app is internally
// called '[DEFAULT]'. Config state is tracked per app name so a dedicated named app
// (e.g. a control-plane auth session, see FirebaseAuthProvider) can coexist with the
// default app used by the tenant-switching session factories in ProviderSession.tsx
// without the two overwriting each other's "is this configured" state.
const DEFAULT_APP_NAME = '[DEFAULT]';

const configByApp = new Map<string, FirebaseConfig | undefined>();

export const setFirebaseConfigState = (config: FirebaseConfig | undefined, appName: string = DEFAULT_APP_NAME): void => {
    configByApp.set(appName, config);
};

export const getFirebaseConfigurationState = (appName: string = DEFAULT_APP_NAME): ProviderConfigurationState => createConfigurationState(
    'FirebaseProvider',
    getMissingKeys(configByApp.get(appName) as unknown as Record<string, unknown> | undefined, [
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
export const getFirestoreConfigurationState = (appName: string = DEFAULT_APP_NAME): ProviderConfigurationState => createConfigurationState(
    'FirestoreProvider',
    getMissingKeys(configByApp.get(appName) as unknown as Record<string, unknown> | undefined, [
        'apiKey',
        'authDomain',
        'projectId',
        'appId',
    ], 'firebase.')
);

export const getSafeAuth = (appName: string = DEFAULT_APP_NAME): Auth | null => {
    try {
        return appName === DEFAULT_APP_NAME ? getAuth() : getAuth(getApp(appName));
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

/**
 * Signs into the currently-initialized Firebase app using a custom token minted
 * server-side (Admin SDK createCustomToken()) and scoped to a specific project —
 * the multi-tenant session-switch path, distinct from the Google-login flow above.
 *
 * Forces in-memory persistence: this session must never survive a reload or be
 * written to IndexedDB/localStorage by the SDK's default persistence behavior.
 * Call init(config) to point the app at the right project *before* calling this.
 */
export const signInWithFirebaseCustomToken = async (token: string): Promise<boolean> => {
    const auth = getSafeAuth();
    if (!auth) return false;

    try {
        await setPersistence(auth, inMemoryPersistence);
        await signInWithCustomToken(auth, token);
        return true;
    } catch (error) {
        const apiKey = (auth.app.options as Partial<FirebaseConfig>)?.apiKey;
        console.error(
            "Firebase custom token sign-in error: ", error,
            `— app "${auth.app.name}" options.apiKey: ${apiKey ? `${apiKey.slice(0, 6)}… (len ${apiKey.length})` : String(apiKey)}`,
        );
        return false;
    }
};

const init = async (config: FirebaseConfig, appName: string = DEFAULT_APP_NAME): Promise<FirebaseApp> => {
    setFirebaseConfigState(config, appName);
    const existingApp = getApps().find((app) => app.name === appName);

    if (existingApp) {
        if ((existingApp.options as Partial<FirebaseConfig>)?.appId === config.appId) {
            console.log(`[firebase] App "${appName}" already initialized with same appId, skipping re-init`);
            return existingApp;
        }
        await deleteApp(existingApp);
    }

    return appName === DEFAULT_APP_NAME ? initializeApp(config) : initializeApp(config, appName);
};

/**
 * Invokes a Firebase Callable Function against a given app (the SDK auto-attaches
 * that app's current auth session's ID token — no manual header wiring). Lazily
 * imports 'firebase/functions' so it's not bundled for apps that never call one.
 */
export async function callFirebaseFunction<T = unknown>(
    functionName: string,
    data: unknown,
    appName: string = DEFAULT_APP_NAME,
    region?: string,
): Promise<T> {
    const { getFunctions, httpsCallable } = await import('firebase/functions');
    const app = appName === DEFAULT_APP_NAME ? getApp() : getApp(appName);
    const call = httpsCallable<unknown, T>(getFunctions(app, region), functionName);
    const { data: result } = await call(data);
    return result;
}

export default init;
