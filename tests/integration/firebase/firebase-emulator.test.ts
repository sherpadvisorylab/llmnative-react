import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { initializeTestEnvironment, type RulesTestEnvironment } from '@firebase/rules-unit-testing';
import { ref, get, set, remove, child, update } from 'firebase/database';
import { collection, doc, getDoc, setDoc, deleteDoc, query, where, getDocs, orderBy } from 'firebase/firestore';
import { ref as storageRef, uploadBytes, getDownloadURL, deleteObject, listAll } from 'firebase/storage';

const PROJECT_ID = 'demo-test';
const DB_HOST = '127.0.0.1';
const DB_PORT = 9000;
const FIRESTORE_PORT = 8080;
const STORAGE_PORT = 9199;

let testEnv: RulesTestEnvironment;

beforeAll(async () => {
    testEnv = await initializeTestEnvironment({
        projectId: PROJECT_ID,
        database: { host: DB_HOST, port: DB_PORT },
        firestore: { host: DB_HOST, port: FIRESTORE_PORT },
        storage: { host: DB_HOST, port: STORAGE_PORT },
    });
});

afterAll(async () => {
    await testEnv?.cleanup();
});

describe('Firebase RTDB integration', () => {
    it('writes and reads a record', async () => {
        const db = testEnv.unauthenticatedContext().database();
        const testRef = ref(db, '/integration-test/users/user1');
        await set(testRef, { name: 'Test User', email: 'test@example.com' });
        const snap = await get(testRef);
        expect(snap.val()).toEqual({ name: 'Test User', email: 'test@example.com' });
    });

    it('updates a record', async () => {
        const db = testEnv.unauthenticatedContext().database();
        const testRef = ref(db, '/integration-test/users/user2');
        await set(testRef, { name: 'Original', count: 1 });
        await update(testRef, { count: 2 });
        const snap = await get(testRef);
        expect(snap.val()?.count).toBe(2);
    });

    it('deletes a record', async () => {
        const db = testEnv.unauthenticatedContext().database();
        const testRef = ref(db, '/integration-test/temp/to-delete');
        await set(testRef, { data: 'will be removed' });
        await remove(testRef);
        const snap = await get(testRef);
        expect(snap.val()).toBeNull();
    });

    it('lists children under a path', async () => {
        const db = testEnv.unauthenticatedContext().database();
        const parentRef = ref(db, '/integration-test/list-test');
        await set(child(parentRef, 'a'), { value: 1 });
        await set(child(parentRef, 'b'), { value: 2 });
        await set(child(parentRef, 'c'), { value: 3 });
        const snap = await get(parentRef);
        const keys = Object.keys(snap.val() ?? {});
        expect(keys).toEqual(expect.arrayContaining(['a', 'b', 'c']));
        expect(keys).toHaveLength(3);
    });
});

describe('Firestore integration', () => {
    it('writes and reads a document', async () => {
        const fs = testEnv.unauthenticatedContext().firestore();
        const testDoc = doc(collection(fs, 'integration-test'), 'doc1');
        await setDoc(testDoc, { title: 'Test Doc', status: 'active' });
        const snap = await getDoc(testDoc);
        expect(snap.data()).toEqual({ title: 'Test Doc', status: 'active' });
    });

    it('queries with where clause', async () => {
        const fs = testEnv.unauthenticatedContext().firestore();
        const col = collection(fs, 'integration-test-where');
        await setDoc(doc(col, 'a'), { category: 'x', value: 1 });
        await setDoc(doc(col, 'b'), { category: 'x', value: 2 });
        await setDoc(doc(col, 'c'), { category: 'y', value: 3 });
        const q = query(col, where('category', '==', 'x'));
        const snap = await getDocs(q);
        expect(snap.docs).toHaveLength(2);
    });

    it('orders results', async () => {
        const fs = testEnv.unauthenticatedContext().firestore();
        const col = collection(fs, 'integration-test-order');
        await setDoc(doc(col, 'a'), { name: 'Alpha', order: 3 });
        await setDoc(doc(col, 'b'), { name: 'Beta', order: 1 });
        await setDoc(doc(col, 'c'), { name: 'Gamma', order: 2 });
        const q = query(col, orderBy('order', 'asc'));
        const snap = await getDocs(q);
        expect(snap.docs.map(d => d.data().name)).toEqual(['Beta', 'Gamma', 'Alpha']);
    });

    it('deletes a document', async () => {
        const fs = testEnv.unauthenticatedContext().firestore();
        const testDoc = doc(collection(fs, 'integration-test-delete'), 'to-delete');
        await setDoc(testDoc, { data: 'temporary' });
        await deleteDoc(testDoc);
        const snap = await getDoc(testDoc);
        expect(snap.exists()).toBe(false);
    });
});

describe('Firebase Storage integration', () => {
    it('uploads and reads a file', async () => {
        const storage = testEnv.unauthenticatedContext().storage();
        const bucket = storageRef(storage);
        const fileRef = storageRef(bucket, 'integration-test/hello.txt');
        await uploadBytes(fileRef, new TextEncoder().encode('Hello Storage!'));
        const url = await getDownloadURL(fileRef);
        expect(url).toBeTruthy();
    });

    it('deletes a file', async () => {
        const storage = testEnv.unauthenticatedContext().storage();
        const bucket = storageRef(storage);
        const fileRef = storageRef(bucket, 'integration-test/to-delete.txt');
        await uploadBytes(fileRef, new TextEncoder().encode('delete me'));
        await deleteObject(fileRef);
        await expect(getDownloadURL(fileRef)).rejects.toThrow();
    });
});
