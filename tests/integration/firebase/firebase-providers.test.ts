import { describe, it, expect, beforeAll } from 'vitest';
import init from '../../../src/providers/firebase-init';
import { FirestoreDataProvider } from '../../../src/providers/data/firestore';
import { FirebaseDataProvider } from '../../../src/providers/data/firebase';
import { FirebaseStorageProvider } from '../../../src/providers/storage/firebase';
import { firebaseAuthSdk, firebaseDatabaseSdk, firebaseStorageSdk, firestoreSdk } from '../../../src/providers/firebase-sdk';

// CR-154 — the providers themselves against the emulators: the SDK loaded on demand by `init()` and by the first call.

const PROJECT_ID = 'demo-test';
// `firebase emulators:exec` gives the hosts of the emulators it started; the defaults are those of firebase.json.
const hostPort = (value: string | undefined, fallback: number): [string, number] => {
    const [host, port] = (value ?? `127.0.0.1:${fallback}`).split(':');
    return [host, Number(port)];
};
const [AUTH_HOST, AUTH_PORT] = hostPort(process.env.FIREBASE_AUTH_EMULATOR_HOST, 9099);
const [FS_HOST, FS_PORT] = hostPort(process.env.FIRESTORE_EMULATOR_HOST, 8080);
const [DB_HOST, DB_PORT] = hostPort(process.env.FIREBASE_DATABASE_EMULATOR_HOST, 9000);
const [ST_HOST, ST_PORT] = hostPort(process.env.FIREBASE_STORAGE_EMULATOR_HOST, 9199);

beforeAll(async () => {
    await init({
        apiKey: 'demo-key',
        authDomain: `${PROJECT_ID}.firebaseapp.com`,
        databaseURL: `https://${PROJECT_ID}-default-rtdb.firebaseio.com`,
        projectId: PROJECT_ID,
        storageBucket: `${PROJECT_ID}.appspot.com`,
        messagingSenderId: '1',
        appId: '1:1:web:1',
    });
    const auth = firebaseAuthSdk.get();
    auth.connectAuthEmulator(auth.getAuth(), `http://${AUTH_HOST}:${AUTH_PORT}`, { disableWarnings: true });
    const fs = await firestoreSdk.load();
    fs.connectFirestoreEmulator(fs.getFirestore(), FS_HOST, FS_PORT);
    const rtdb = await firebaseDatabaseSdk.load();
    rtdb.connectDatabaseEmulator(rtdb.getDatabase(), DB_HOST, DB_PORT);
    const storage = await firebaseStorageSdk.load();
    storage.connectStorageEmulator(storage.getStorage(), ST_HOST, ST_PORT);
    await auth.signInAnonymously(auth.getAuth());
});

describe('FirestoreDataProvider (lazy SDK) on the emulator', () => {
    const db = new FirestoreDataProvider();

    it('writes, reads, updates, counts and removes', async () => {
        await db.set('/cr154-users/u1', { name: 'Ada', role: 'admin' }, true);
        await db.set('/cr154-users/u2', { name: 'Bob', role: 'user' }, true);
        expect(await db.read('/cr154-users/u1')).toMatchObject({ name: 'Ada' });
        await db.update('/cr154-users/u1', { role: 'owner' }, true);
        expect(await db.read('/cr154-users', { where: { role: 'owner' }, toArray: true })).toHaveLength(1);
        expect(await db.count('/cr154-users')).toBe(2);
        await db.remove('/cr154-users/u2', true);
        expect(await db.read('/cr154-users/u2')).toBeUndefined();
    });

    it('subscribe delivers the records and follows a change', async () => {
        const seen: unknown[][] = [];
        const stop = db.subscribe('/cr154-live', (records) => { seen.push(records); });
        await db.set('/cr154-live/a', { n: 1 }, true);
        await expect.poll(() => seen.at(-1)?.length, { timeout: 10_000 }).toBe(1);
        stop();
    });
});

describe('FirebaseDataProvider (Realtime Database, lazy SDK) on the emulator', () => {
    const db = new FirebaseDataProvider();

    it('writes, reads, updates and removes', async () => {
        await db.set('/cr154/items/i1', { label: 'one', n: 1 }, true);
        await db.update('/cr154/items/i1', { n: 2 }, true);
        expect(await db.read('/cr154/items/i1')).toMatchObject({ label: 'one', n: 2 });
        await db.remove('/cr154/items/i1', true);
        expect(await db.read('/cr154/items/i1')).toBeUndefined();
    });
});

describe('FirebaseStorageProvider (lazy SDK) on the emulator', () => {
    const storage = new FirebaseStorageProvider();

    it('uploads, gives the URL and deletes', async () => {
        const url = await storage.upload(new Blob(['hello'], { type: 'text/plain' }), 'cr154/hello.txt');
        expect(url).toContain('cr154');
        expect(await storage.getURL('cr154/hello.txt')).toBeTruthy();
        expect(await storage.delete('cr154/hello.txt')).toBe(1);
    });
});
