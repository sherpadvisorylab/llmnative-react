/**
 * SupabaseDataProvider test suite.
 *
 * Uses a lightweight in-memory Supabase client mock so no network or
 * real Supabase project is required.
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { SupabaseDataProvider } from '../../../src/providers/data/supabase';
import { RECORD_KEY } from '../../../src/providers/data/DataProvider';
import * as supabaseInit from '../../../src/providers/supabase-init';

// ── In-memory Supabase mock ───────────────────────────────────────────────────

type Row = Record<string, any>;
type Store = Map<string, Map<string, Row>>; // table → id → row

function buildMockClient(store: Store) {
    function getTable(table: string): Map<string, Row> {
        if (!store.has(table)) store.set(table, new Map());
        return store.get(table)!;
    }

    function makeQuery(table: string) {
        let filters: Array<(rows: Row[]) => Row[]> = [];
        let orders:  Array<(rows: Row[]) => Row[]> = [];
        let _head  = false;
        let _count = false;
        let _single = false;
        let _limit: number | undefined;

        const q: any = {
            select(cols: string, opts: any = {}) {
                _head  = opts.head  ?? false;
                _count = opts.count === 'exact';
                return q;
            },
            eq(col: string, val: any)  { filters.push((rows) => rows.filter((r) => String(r[col]) === String(val))); return q; },
            neq(col: string, val: any) { filters.push((rows) => rows.filter((r) => String(r[col]) !== String(val))); return q; },
            lt(col: string, val: any)  { filters.push((rows) => rows.filter((r) => r[col] < val));  return q; },
            lte(col: string, val: any) { filters.push((rows) => rows.filter((r) => r[col] <= val)); return q; },
            gt(col: string, val: any)  { filters.push((rows) => rows.filter((r) => r[col] > val));  return q; },
            gte(col: string, val: any) { filters.push((rows) => rows.filter((r) => r[col] >= val)); return q; },
            in(col: string, vals: any[]) { filters.push((rows) => rows.filter((r) => vals.includes(r[col]))); return q; },
            not(col: string, op: string, vals: any) {
                if (op === 'in') filters.push((rows) => rows.filter((r) => !vals.includes(r[col])));
                return q;
            },
            is(col: string, val: any) { filters.push((rows) => rows.filter((r) => r[col] === val)); return q; },
            contains(col: string, vals: any[]) { filters.push((rows) => rows.filter((r) => Array.isArray(r[col]) && vals.every((v) => r[col].includes(v)))); return q; },
            overlaps(col: string, vals: any[]) { filters.push((rows) => rows.filter((r) => Array.isArray(r[col]) && vals.some((v) => r[col].includes(v)))); return q; },
            limit(n: number) { _limit = n; return q; },
            order(col: string, opts: any = {}) {
                orders.push((rows) => [...rows].sort((a, b) => {
                    const d = opts.ascending === false ? -1 : 1;
                    return a[col] < b[col] ? -d : a[col] > b[col] ? d : 0;
                }));
                return q;
            },
            maybeSingle() { _single = true; return q; },

            then(resolve: any) {
                const t = getTable(table);
                let rows = [...t.values()];
                for (const f of filters) rows = f(rows);
                for (const o of orders)  rows = o(rows);
                if (_limit !== undefined) rows = rows.slice(0, _limit);
                const failure = (store as any).failure;
                if (failure) return resolve({ data: null, error: failure });

                if (_head && _count) return resolve({ count: rows.length, error: null });
                if (_single) return resolve({ data: rows[0] ?? null, error: null });
                return resolve({ data: rows, error: null });
            },
        };
        return q;
    }

    const client: any = {
        from(table: string) {
            return {
                select: (cols: string, opts?: any) => {
                    const q = makeQuery(table);
                    return q.select(cols, opts);
                },
                upsert(rows: Row | Row[], opts: any = {}) {
                    const t = getTable(table);
                    const pk = opts.onConflict ?? 'id';
                    const items = Array.isArray(rows) ? rows : [rows];
                    for (const row of items) t.set(String(row[pk]), { ...row });
                    return { then: (r: any) => r({ error: null }) };
                },
                insert(rows: Row | Row[]) {
                    const t = getTable(table);
                    const items = Array.isArray(rows) ? rows : [rows];
                    for (const row of items) t.set(String(row.id ?? t.size), { ...row });
                    return { then: (r: any) => r({ error: null }) };
                },
                delete() {
                    const q = makeQuery(table);
                    const orig = q.then;
                    q.then = (resolve: any) => {
                        // Execute filters to find rows to delete
                        const t = getTable(table);
                        let rows = [...t.values()];
                        // filters were built on the query chain — re-apply
                        for (const [key, row] of t.entries()) {
                            t.delete(key);
                        }
                        return resolve({ error: null });
                    };
                    // Override eq/neq etc. to collect filter keys
                    const keys: string[] = [];
                    q.eq = (col: string, val: any) => {
                        const t = getTable(table);
                        for (const [k, r] of t.entries()) {
                            if (String(r[col]) === String(val)) keys.push(k);
                        }
                        q.then = (resolve: any) => {
                            for (const k of keys) getTable(table).delete(k);
                            return resolve({ error: null });
                        };
                        return q;
                    };
                    q.neq = (_col: string, _val: any) => {
                        // used by setChunks purge — delete everything
                        q.then = (resolve: any) => {
                            getTable(table).clear();
                            return resolve({ error: null });
                        };
                        return q;
                    };
                    return q;
                },
                update(patch: Row) {
                    const q = makeQuery(table);
                    q.eq = (col: string, val: any) => {
                        q.then = (resolve: any) => {
                            const t = getTable(table);
                            for (const [k, r] of t.entries()) {
                                if (String(r[col]) === String(val)) {
                                    t.set(k, { ...r, ...patch });
                                }
                            }
                            return resolve({ error: null });
                        };
                        return q;
                    };
                    return q;
                },
            };
        },
        channel: () => ({ on: () => ({ subscribe: () => null }) }),
        removeChannel: () => Promise.resolve(),
    };

    return client;
}

// ── Test setup ────────────────────────────────────────────────────────────────

function createProvider(store: Store = new Map()): SupabaseDataProvider {
    const mockClient = buildMockClient(store);
    vi.spyOn(supabaseInit, 'getSupabaseClient').mockReturnValue(mockClient as any);
    return new SupabaseDataProvider({ url: 'https://test.supabase.co', anonKey: 'test-key' });
}

beforeEach(() => {
    vi.restoreAllMocks();
    supabaseInit._resetSupabaseClients();
});

// ── getConfigurationState ────────────────────────────────────────────────────

describe('getConfigurationState()', () => {
    it('reports configured when url and anonKey are present', () => {
        const provider = new SupabaseDataProvider({ url: 'https://x.supabase.co', anonKey: 'key' });
        expect(provider.getConfigurationState().configured).toBe(true);
    });

    it('reports not configured when url is missing', () => {
        const provider = new SupabaseDataProvider({ url: '', anonKey: 'key' });
        expect(provider.getConfigurationState().configured).toBe(false);
    });

    it('reports not configured when anonKey is missing', () => {
        const provider = new SupabaseDataProvider({ url: 'https://x.supabase.co', anonKey: '' });
        expect(provider.getConfigurationState().configured).toBe(false);
    });
});

// ── read ─────────────────────────────────────────────────────────────────────

describe('read()', () => {
    it('returns undefined for a non-existent single record', async () => {
        const provider = createProvider();
        const result = await provider.read('/users/missing');
        expect(result).toBeUndefined();
    });

    it('returns empty object for a non-existent collection', async () => {
        const provider = createProvider();
        const result = await provider.read('/users');
        expect(result).toEqual({});
    });

    it('returns a single record with _key injected', async () => {
        const store: Store = new Map([['users', new Map([['u1', { id: 'u1', name: 'Alice' }]])]]);
        const provider = createProvider(store);
        const result = await provider.read('/users/u1');
        expect(result).toMatchObject({ name: 'Alice', [RECORD_KEY]: 'u1' });
    });

    it('returns collection as object keyed by id', async () => {
        const store: Store = new Map([['users', new Map([
            ['u1', { id: 'u1', name: 'Alice' }],
            ['u2', { id: 'u2', name: 'Bob' }],
        ])]]);
        const provider = createProvider(store);
        const result = await provider.read('/users');
        expect(result).toMatchObject({
            u1: { name: 'Alice' },
            u2: { name: 'Bob' },
        });
    });

    it('returns array when toArray: true', async () => {
        const store: Store = new Map([['items', new Map([
            ['a', { id: 'a', n: 1 }],
            ['b', { id: 'b', n: 2 }],
        ])]]);
        const provider = createProvider(store);
        const result = await provider.read('/items', { toArray: true });
        expect(Array.isArray(result)).toBe(true);
        expect(result).toHaveLength(2);
    });

    it('applies where filter', async () => {
        const store: Store = new Map([['items', new Map([
            ['a', { id: 'a', status: 'active' }],
            ['b', { id: 'b', status: 'inactive' }],
            ['c', { id: 'c', status: 'active' }],
        ])]]);
        const provider = createProvider(store);
        const result = await provider.read('/items', { where: { status: 'active' }, toArray: true });
        expect(result).toHaveLength(2);
    });
});

// ── set ──────────────────────────────────────────────────────────────────────

describe('set()', () => {
    it('persists a new record', async () => {
        const store: Store = new Map();
        const provider = createProvider(store);
        await provider.set('/users/u1', { name: 'Alice' });
        expect(store.get('users')?.get('u1')).toMatchObject({ name: 'Alice', id: 'u1' });
    });

    it('overwrites an existing record', async () => {
        const store: Store = new Map([['users', new Map([['u1', { id: 'u1', name: 'Bob', role: 'admin' }]])]]);
        const provider = createProvider(store);
        await provider.set('/users/u1', { name: 'Bob' });
        expect(store.get('users')?.get('u1')?.role).toBeUndefined();
    });

    it('strips _key and _index before writing', async () => {
        const store: Store = new Map();
        const provider = createProvider(store);
        await provider.set('/users/u1', { name: 'Alice', [RECORD_KEY]: 'u1', _index: 0 });
        const saved = store.get('users')?.get('u1');
        expect(saved?.[RECORD_KEY]).toBeUndefined();
        expect(saved?._index).toBeUndefined();
    });
});

// ── update ───────────────────────────────────────────────────────────────────

describe('update()', () => {
    it('merges fields without removing others', async () => {
        const store: Store = new Map([['users', new Map([['u1', { id: 'u1', name: 'Carol', role: 'viewer' }]])]]);
        const provider = createProvider(store);
        await provider.update('/users/u1', { role: 'editor' });
        const result = await provider.read('/users/u1');
        expect(result).toMatchObject({ name: 'Carol', role: 'editor' });
    });
});

// ── remove ───────────────────────────────────────────────────────────────────

describe('remove()', () => {
    it('deletes an existing record', async () => {
        const store: Store = new Map([['users', new Map([['u1', { id: 'u1', name: 'Eve' }]])]]);
        const provider = createProvider(store);
        await provider.remove('/users/u1');
        expect(store.get('users')?.get('u1')).toBeUndefined();
    });

    it('does not throw when removing a non-existent record', async () => {
        const provider = createProvider();
        await expect(provider.remove('/users/phantom')).resolves.not.toThrow();
    });
});

// ── count ─────────────────────────────────────────────────────────────────────

describe('count()', () => {
    it('returns the number of rows in a collection', async () => {
        const store: Store = new Map([['users', new Map([
            ['u1', { id: 'u1' }],
            ['u2', { id: 'u2' }],
            ['u3', { id: 'u3' }],
        ])]]);
        const provider = createProvider(store);
        const n = await provider.count('/users');
        expect(n).toBe(3);
    });

    it('returns 0 for a non-existent collection', async () => {
        const provider = createProvider();
        const n = await provider.count('/nonexistent');
        expect(n).toBe(0);
    });
});

// ── subscribe ─────────────────────────────────────────────────────────────────

describe('subscribe()', () => {
    it('returns a cleanup function immediately', () => {
        const provider = createProvider();
        const cleanup = provider.subscribe('/users', vi.fn());
        expect(cleanup).toBeTypeOf('function');
    });

    it('calls setRecords asynchronously with current rows', async () => {
        const store: Store = new Map([['users', new Map([
            ['u1', { id: 'u1', name: 'Alice' }],
        ])]]);
        const provider = createProvider(store);
        const setRecords = vi.fn();
        provider.subscribe('/users', setRecords);

        // Wait for the async load
        await new Promise((r) => setTimeout(r, 0));
        expect(setRecords).toHaveBeenCalledOnce();
        const rows = setRecords.mock.calls[0][0];
        expect(rows[0]).toMatchObject({ name: 'Alice', [RECORD_KEY]: 'u1' });
    });

    it('does not call setRecords when path is undefined', () => {
        const provider = createProvider();
        const setRecords = vi.fn();
        provider.subscribe(undefined, setRecords);
        expect(setRecords).not.toHaveBeenCalled();
    });
});

// ── setChunks ─────────────────────────────────────────────────────────────────

describe('setChunks()', () => {
    it('writes all records in batches', async () => {
        const store: Store = new Map();
        const provider = createProvider(store);
        const data = Object.fromEntries(
            Array.from({ length: 10 }, (_, i) => [`item_${i}`, { value: i }])
        );
        await provider.setChunks('/products', data, { chunkSize: 3 });
        expect(store.get('products')?.size).toBe(10);
    });

    it('calls onProgress during write', async () => {
        const store: Store = new Map();
        const provider = createProvider(store);
        const onProgress = vi.fn();
        const data = { a: { v: 1 }, b: { v: 2 }, c: { v: 3 } };
        await provider.setChunks('/products', data, { chunkSize: 2, onProgress });
        expect(onProgress).toHaveBeenCalled();
    });

    it('purges existing rows when purge: true', async () => {
        const store: Store = new Map([['products', new Map([['old', { id: 'old', v: 0 }]])]]);
        const provider = createProvider(store);
        await provider.setChunks('/products', { new1: { v: 1 } }, { purge: true });
        expect(store.get('products')?.has('old')).toBe(false);
    });
});

// ── custom primaryKey ─────────────────────────────────────────────────────────

describe('custom primaryKey config', () => {
    it('uses the configured pk column for reads and writes', async () => {
        const store: Store = new Map([['orders', new Map([['ord-1', { uuid: 'ord-1', total: 99 }]])]]);
        const mockClient = buildMockClient(store);
        vi.spyOn(supabaseInit, 'getSupabaseClient').mockReturnValue(mockClient as any);

        const provider = new SupabaseDataProvider({
            url: 'https://test.supabase.co',
            anonKey: 'key',
            primaryKey: 'uuid',
        });

        await provider.set('/orders/ord-1', { total: 99 });
        const result = await provider.read('/orders/ord-1');
        expect(result).toMatchObject({ total: 99, [RECORD_KEY]: 'ord-1' });
    });
});

describe('CR-129 — contains, limit, record path and errors', () => {
    const tagged = (): Store => new Map([['posts', new Map([
        ['a', { id: 'a', n: 1, tags: ['x'] }],
        ['b', { id: 'b', n: 2, tags: ['y'] }],
        ['c', { id: 'c', n: 3, tags: ['x', 'y'] }],
    ])]]);

    it('translates contains, containsAny and limit', async () => {
        const provider = createProvider(tagged());
        expect((await provider.read('/posts', { where: { tags: { contains: 'x' } }, toArray: true })).map((r: any) => r.n)).toEqual([1, 3]);
        expect((await provider.read('/posts', { where: { tags: { containsAny: ['y'] } }, toArray: true })).map((r: any) => r.n)).toEqual([2, 3]);
        expect((await provider.read('/posts', { order: { n: 'desc' }, limit: 1, toArray: true })).map((r: any) => r.n)).toEqual([3]);
    });

    it('subscribe on a record path follows that record only', async () => {
        const provider = createProvider(tagged());
        const setRecords = vi.fn();
        provider.subscribe('/posts/b', setRecords);
        await new Promise((r) => setTimeout(r, 0));
        expect(setRecords.mock.calls[0][0].map((r: any) => r.n)).toEqual([2]);
    });

    it('a refused query reaches onError; without it the list is empty as before', async () => {
        const store = tagged();
        (store as any).failure = { code: '42501', message: 'permission denied for table posts' };
        const provider = createProvider(store);
        const onError = vi.fn();
        const setRecords = vi.fn();
        provider.subscribe('/posts', setRecords, { onError });
        await new Promise((r) => setTimeout(r, 0));
        expect(setRecords).not.toHaveBeenCalled();
        expect(onError.mock.calls[0][0]).toMatchObject({ code: 'permission-denied', path: '/posts' });

        const quiet = vi.fn();
        provider.subscribe('/posts', quiet);
        await new Promise((r) => setTimeout(r, 0));
        expect(quiet).toHaveBeenCalledWith([]);
    });
});
