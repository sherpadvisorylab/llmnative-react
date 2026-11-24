import { lazyModule, type LazyModule } from '../libs/lazyModule';

/**
 * CR-154 — the Firebase SDK (`firebase`, an optional peer), loaded with the first use of a Firebase provider and never
 * when the package is imported. Each part is its own chunk: an app on Firestore never loads the Realtime Database.
 * The providers take the SDK functions from here (`sdk.fn('name')`, same signatures) and load what they need first.
 */
const MISSING = 'Install firebase to use the Firebase providers.';

export const firebaseAppSdk = lazyModule(() => import('firebase/app'), MISSING);
export const firebaseAuthSdk = lazyModule(() => import('firebase/auth'), MISSING);
export const firestoreSdk = lazyModule(() => import('firebase/firestore'), MISSING);
export const firebaseDatabaseSdk = lazyModule(() => import('firebase/database'), MISSING);
export const firebaseStorageSdk = lazyModule(() => import('firebase/storage'), MISSING);

/** Loads the given parts of the SDK (the app and the auth always, every provider needs them). */
export async function loadFirebase(...parts: LazyModule<object>[]): Promise<void> {
    await Promise.all([firebaseAppSdk.load(), firebaseAuthSdk.load(), ...parts.map((part) => part.load())]);
}

/** True when the app, the auth and the given parts are loaded: the synchronous paths can run now. */
export function isFirebaseLoaded(...parts: LazyModule<object>[]): boolean {
    return [firebaseAppSdk, firebaseAuthSdk, ...parts].every((part) => part.peek() !== undefined);
}
