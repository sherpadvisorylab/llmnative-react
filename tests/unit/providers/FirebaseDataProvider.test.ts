/**
 * FirebaseDataProvider test suite.
 * Mocks firebase/database and firebase-init to avoid real network calls.
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';

// ── Helpers ───────────────────────────────────────────────────────────────────

function mockSnapshot(data: any) {
    return { exists: () => !!data, val: () => data };
}

// ── Mock firebase-init ────────────────────────────────────────────────────────

vi.mock('../../../src/providers/firebase-init', () => ({
    getFirebaseConfigurationState: vi.fn(() => ({ configured: true, missingKeys: [] })),
    getSafeAuth: vi.fn(() => ({ currentUser: { getIdToken: vi.fn(async () => 'token') } })),
    default: vi.fn(),
}));

// ── Mock firebase/auth ────────────────────────────────────────────────────────

vi.mock('firebase/auth', () => ({
    onAuthStateChanged: vi.fn((_auth: any, cb: any) => { cb({ uid: 'u1' }); return () => {}; }),
}));

// ── Mock firebase/database ────────────────────────────────────────────────────
// NOTE: all vi.fn() calls must be inside the factory (not referencing outer vars)
// because vi.mock is hoisted before variable declarations.

vi.mock('firebase/database', () => ({
    getDatabase:  vi.fn(() => ({})),
    ref:          vi.fn((_db?: any, path?: string) => ({
        path: path ?? '',
        toString: () => `https://mock-db.firebaseio.com${path ? '/' + path.replace(/^\//, '') : ''}`,
    })),
    get:          vi.fn(async () => ({ exists: () => true, val: () => ({ key1: { name: 'Alice' }, key2: { name: 'Bob' } }) })),
    set:          vi.fn(async () => undefined),
    update:       vi.fn(async () => undefined),
    remove:       vi.fn(async () => undefined),
    onValue:      vi.fn((_ref: any, cb: any) => { cb({ exists: () => true, val: () => ({ key1: { name: 'Alice' }, key2: { name: 'Bob' } }) }); return () => {}; }),
    query:        vi.fn((_ref: any, ..._constraints: any[]) => _ref),
    orderByKey:   vi.fn(() => 'orderByKey'),
    orderByValue: vi.fn(() => 'orderByValue'),
    orderByChild: vi.fn(() => 'orderByChild'),
    equalTo:      vi.fn(() => 'equalTo'),
    startAt:      vi.fn(() => 'startAt'),
    endAt:        vi.fn(() => 'endAt'),
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

// ── Mock ../../libs/utils ─────────────────────────────────────────────────────

vi.mock('../../../src/libs/utils', () => ({
    cleanRecord: vi.fn((x: any) => x),
}));

// ── Mock ../../libs/converter ─────────────────────────────────────────────────

vi.mock('../../../src/libs/converter', () => ({
    converter: { parse: vi.fn((src: any, _tpl: any) => src) },
}));

// ── Mock components/ui/Buttons ────────────────────────────────────────────────

vi.mock('../../../src/components/ui/Buttons', () => ({}));

// ── Import after mocks ────────────────────────────────────────────────────────

import { FirebaseDataProvider } from '../../../src/providers/data/firebase';
import * as fbDb from 'firebase/database';
import * as fbAuth from 'firebase/auth';

function provider() {
    return new FirebaseDataProvider();
}

beforeEach(() => vi.clearAllMocks());

// ── getConfigurationState ─────────────────────────────────────────────────────

describe('getConfigurationState()', () => {
    it('reports configured when Firebase is initialised', () => {
        expect(provider().getConfigurationState().configured).toBe(true);
    });
});

// ── read ──────────────────────────────────────────────────────────────────────

describe('read()', () => {
    it('returns data when snapshot exists', async () => {
        vi.mocked(fbDb.get).mockResolvedValueOnce(mockSnapshot({ key1: { name: 'Alice' }, key2: { name: 'Bob' } }) as any);
        const result = await provider().read('/users');
        expect(result).toMatchObject({ key1: { name: 'Alice' }, key2: { name: 'Bob' } });
    });

    it('returns undefined when snapshot is empty', async () => {
        vi.mocked(fbDb.get).mockResolvedValueOnce(mockSnapshot(null) as any);
        const result = await provider().read('/empty');
        expect(result).toBeUndefined();
    });

    it('returns an array of values when toArray: true', async () => {
        vi.mocked(fbDb.get).mockResolvedValueOnce(mockSnapshot({ a: { name: 'Alice' }, b: { name: 'Bob' } }) as any);
        const result = await provider().read('/users', { toArray: true });
        expect(Array.isArray(result)).toBe(true);
        expect(result).toHaveLength(2);
        expect(result[0]).toMatchObject({ name: 'Alice' });
    });
});

// ── set ───────────────────────────────────────────────────────────────────────

describe('set()', () => {
    it('calls fbSet with the correct ref and data', async () => {
        const data = { name: 'Alice' };
        await provider().set('/users/u1', data);
        expect(vi.mocked(fbDb.set)).toHaveBeenCalledWith(expect.anything(), data);
    });
});

// ── update ────────────────────────────────────────────────────────────────────

describe('update()', () => {
    it('calls fbUpdate with the correct ref and data', async () => {
        const data = { name: 'Bob' };
        await provider().update('/users/u1', data);
        expect(vi.mocked(fbDb.update)).toHaveBeenCalledWith(expect.anything(), data);
    });
});

// ── remove ────────────────────────────────────────────────────────────────────

describe('remove()', () => {
    it('calls fbRemove with the correct ref', async () => {
        await provider().remove('/users/u1');
        expect(vi.mocked(fbDb.remove)).toHaveBeenCalled();
    });
});

// ── count ─────────────────────────────────────────────────────────────────────

describe('count()', () => {
    it('returns the number of top-level keys from readShallow', async () => {
        vi.spyOn(global, 'fetch').mockResolvedValueOnce({
            ok: true,
            json: async () => ({ a: true, b: true }),
        } as any);
        const result = await provider().count('/users');
        expect(result).toBe(2);
    });
});

// ── subscribe ─────────────────────────────────────────────────────────────────

describe('subscribe()', () => {
    it('calls onValue and invokes setRecords with records that include _key', () => {
        const setRecords = vi.fn();
        vi.mocked(fbDb.onValue).mockImplementationOnce((_ref: any, cb: any) => {
            cb(mockSnapshot({ key1: { name: 'Alice' }, key2: { name: 'Bob' } }));
            return () => {};
        });
        vi.mocked(fbAuth.onAuthStateChanged).mockImplementationOnce((_auth: any, cb: any) => {
            cb({ uid: 'u1' });
            return () => {};
        });

        provider().subscribe('/users', setRecords);

        expect(setRecords).toHaveBeenCalled();
        const records = setRecords.mock.calls[0][0];
        expect(records).toHaveLength(2);
        expect(records[0]).toHaveProperty('_key');
        expect(records[0]._key).toBe('key1');
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

    it('calls setRecords with empty array when user is null', () => {
        const setRecords = vi.fn();
        vi.mocked(fbAuth.onAuthStateChanged).mockImplementationOnce((_auth: any, cb: any) => {
            cb(null);
            return () => {};
        });
        provider().subscribe('/users', setRecords);
        expect(setRecords).toHaveBeenCalledWith([]);
    });
});
