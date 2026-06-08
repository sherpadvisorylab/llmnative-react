/**
 * FirestoreDataProvider test suite.
 * Mocks firebase/firestore and firebase-init to avoid real network calls.
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';

// ── Helpers ───────────────────────────────────────────────────────────────────

function mockDocSnap(id: string, data: Record<string, any> | null) {
    return { id, exists: () => !!data, data: () => data };
}

function mockQuerySnap(docs: ReturnType<typeof mockDocSnap>[]) {
    return { docs, size: docs.length, forEach: (fn: (d: any) => void) => docs.forEach(fn) };
}

// ── Mock firebase-init ────────────────────────────────────────────────────────

vi.mock('../../../src/providers/firebase-init', () => ({
    getFirestoreConfigurationState: vi.fn(() => ({ configured: true, missingKeys: [] })),
    getSafeAuth: vi.fn(() => ({ currentUser: null })),
    default: vi.fn(),
}));

// ── Mock firebase/auth ────────────────────────────────────────────────────────

vi.mock('firebase/auth', () => ({
    onAuthStateChanged: vi.fn((_auth: any, cb: any) => { cb({ uid: 'u1' }); return () => {}; }),
}));

// ── Mock firebase/firestore ───────────────────────────────────────────────────
// NOTE: all vi.fn() must be inline in the factory — hoisting prevents outer var access.

vi.mock('firebase/firestore', () => ({
    getFirestore:           vi.fn(() => ({})),
    collection:             vi.fn((_db: any, path: string) => ({ type: 'collection', path })),
    doc:                    vi.fn((_db: any, ...parts: string[]) => ({ type: 'doc', path: parts.join('/') })),
    getDocs:                vi.fn(async () => ({ docs: [], size: 0, forEach: () => {} })),
    getDoc:                 vi.fn(async () => ({ id: 'uid1', exists: () => false, data: () => null })),
    setDoc:                 vi.fn(async () => undefined),
    updateDoc:              vi.fn(async () => undefined),
    deleteDoc:              vi.fn(async () => undefined),
    addDoc:                 vi.fn(async () => ({ id: 'new-id' })),
    writeBatch:             vi.fn(() => ({ set: vi.fn(), delete: vi.fn(), commit: vi.fn(async () => undefined) })),
    onSnapshot:             vi.fn((_ref: any, cb: any) => { cb({ docs: [], size: 0, forEach: () => {} }); return () => {}; }),
    where:                  vi.fn(() => 'whereConstraint'),
    orderBy:                vi.fn(() => 'orderByConstraint'),
    query:                  vi.fn((_ref: any, ..._constraints: any[]) => _ref),
    getCountFromServer:     vi.fn(async () => ({ data: () => ({ count: 5 }) })),
}));

// ── Mock firebase/app ─────────────────────────────────────────────────────────

vi.mock('firebase/app', () => ({
    getApp: vi.fn(),
}));

// ── Mock ../../constant ───────────────────────────────────────────────────────

vi.mock('../../../src/constant', () => ({
    consoleLog: vi.fn(),
}));

// ── Mock ../../Config ─────────────────────────────────────────────────────────

vi.mock('../../../src/Config', () => ({
    onConfigChange: vi.fn(),
}));

// ── Mock ../../libs/converter ─────────────────────────────────────────────────

vi.mock('../../../src/libs/converter', () => ({
    converter: { parse: vi.fn((src: any, _tpl: any) => src) },
}));

// ── Import after mocks ────────────────────────────────────────────────────────

import { FirestoreDataProvider } from '../../../src/providers/data/firestore';
import * as fsStore from 'firebase/firestore';
import * as fbAuth from 'firebase/auth';

function provider() {
    return new FirestoreDataProvider();
}

beforeEach(() => vi.clearAllMocks());

// ── getConfigurationState ─────────────────────────────────────────────────────

describe('getConfigurationState()', () => {
    it('reports configured when Firestore is initialised', () => {
        expect(provider().getConfigurationState().configured).toBe(true);
    });
});

// ── read — collection path ────────────────────────────────────────────────────

describe('read() — collection path', () => {
    it('calls getDocs and returns object with _key on each record', async () => {
        const docs = [
            mockDocSnap('uid1', { name: 'Alice' }),
            mockDocSnap('uid2', { name: 'Bob' }),
        ];
        vi.mocked(fsStore.getDocs).mockResolvedValueOnce(mockQuerySnap(docs) as any);

        const result = await provider().read('/users');
        expect(fsStore.getDocs).toHaveBeenCalled();
        expect(result).toMatchObject({
            uid1: expect.objectContaining({ _key: 'uid1', name: 'Alice' }),
            uid2: expect.objectContaining({ _key: 'uid2', name: 'Bob' }),
        });
    });

    it('returns an array when toArray: true', async () => {
        const docs = [mockDocSnap('uid1', { name: 'Alice' })];
        vi.mocked(fsStore.getDocs).mockResolvedValueOnce(mockQuerySnap(docs) as any);

        const result = await provider().read('/users', { toArray: true });
        expect(Array.isArray(result)).toBe(true);
        expect(result[0]).toMatchObject({ _key: 'uid1', name: 'Alice' });
    });
});

// ── read — document path ──────────────────────────────────────────────────────

describe('read() — document path', () => {
    it('calls getDoc and returns single record with _key', async () => {
        vi.mocked(fsStore.getDoc).mockResolvedValueOnce(mockDocSnap('uid1', { name: 'Alice' }) as any);

        const result = await provider().read('/users/uid1');
        expect(fsStore.getDoc).toHaveBeenCalled();
        expect(result).toMatchObject({ _key: 'uid1', name: 'Alice' });
    });

    it('returns undefined when document does not exist', async () => {
        vi.mocked(fsStore.getDoc).mockResolvedValueOnce(mockDocSnap('missing', null) as any);

        const result = await provider().read('/users/missing');
        expect(result).toBeUndefined();
    });
});

// ── set ───────────────────────────────────────────────────────────────────────

describe('set()', () => {
    it('calls addDoc for collection path (odd segments)', async () => {
        await provider().set('/users', { name: 'Alice' });
        expect(fsStore.addDoc).toHaveBeenCalled();
        expect(fsStore.setDoc).not.toHaveBeenCalled();
    });

    it('calls setDoc for document path (even segments)', async () => {
        await provider().set('/users/uid1', { name: 'Alice' });
        expect(fsStore.setDoc).toHaveBeenCalled();
        expect(fsStore.addDoc).not.toHaveBeenCalled();
    });
});

// ── update ────────────────────────────────────────────────────────────────────

describe('update()', () => {
    it('calls updateDoc for a document path', async () => {
        await provider().update('/users/uid1', { name: 'Bob' });
        expect(fsStore.updateDoc).toHaveBeenCalled();
    });

    it('calls addDoc for a collection path', async () => {
        await provider().update('/users', { name: 'Charlie' });
        expect(fsStore.addDoc).toHaveBeenCalled();
    });
});

// ── remove ────────────────────────────────────────────────────────────────────

describe('remove()', () => {
    it('calls deleteDoc for a document path', async () => {
        await provider().remove('/users/uid1');
        expect(fsStore.deleteDoc).toHaveBeenCalled();
    });

    it('resolves without throwing for a valid document path', async () => {
        await expect(provider().remove('/users/uid1')).resolves.not.toThrow();
    });
});

// ── count ─────────────────────────────────────────────────────────────────────

describe('count()', () => {
    it('calls getCountFromServer and returns the count for a collection path', async () => {
        vi.mocked(fsStore.getCountFromServer).mockResolvedValueOnce({ data: () => ({ count: 7 }) } as any);
        const result = await provider().count('/users');
        expect(fsStore.getCountFromServer).toHaveBeenCalled();
        expect(result).toBe(7);
    });

    it('returns 1 for a document path without calling getCountFromServer', async () => {
        const result = await provider().count('/users/uid1');
        expect(result).toBe(1);
        expect(fsStore.getCountFromServer).not.toHaveBeenCalled();
    });
});

// ── subscribe ─────────────────────────────────────────────────────────────────

describe('subscribe()', () => {
    it('calls onSnapshot and invokes setRecords with records', () => {
        const setRecords = vi.fn();
        const docs = [mockDocSnap('uid1', { name: 'Alice' })];
        vi.mocked(fsStore.onSnapshot).mockImplementationOnce((_ref: any, cb: any) => {
            cb(mockQuerySnap(docs));
            return () => {};
        });
        vi.mocked(fbAuth.onAuthStateChanged).mockImplementationOnce((_auth: any, cb: any) => {
            cb({ uid: 'u1' });
            return () => {};
        });

        provider().subscribe('/users', setRecords);

        expect(setRecords).toHaveBeenCalled();
        const records = setRecords.mock.calls[0][0];
        expect(records).toHaveLength(1);
        expect(records[0]).toMatchObject({ _key: 'uid1', name: 'Alice' });
    });

    it('calls setRecords with empty array when user is null', () => {
        const setRecords = vi.fn();
        vi.mocked(fbAuth.onAuthStateChanged).mockImplementationOnce((_auth: any, cb: any) => {
            cb(null);
            return () => {};
        });
        provider().subscribe('/users', setRecords);
        expect(setRecords).toHaveBeenCalledWith([]);
    });

    it('returns an unsubscribe function', () => {
        vi.mocked(fbAuth.onAuthStateChanged).mockImplementationOnce((_auth: any, cb: any) => {
            cb({ uid: 'u1' });
            return () => {};
        });
        const unsub = provider().subscribe('/users', vi.fn());
        expect(unsub).toBeTypeOf('function');
        expect(() => unsub()).not.toThrow();
    });
});
