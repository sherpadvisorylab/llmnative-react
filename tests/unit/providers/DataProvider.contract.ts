/**
 * DataProvider contract test suite.
 *
 * Every DataProvider implementation (MockDataProvider, FirebaseDataProvider,
 * SupabaseDataProvider, ...) MUST pass all these tests unchanged.
 *
 * Usage:
 *   import { runDataProviderContract } from './DataProvider.contract';
 *   runDataProviderContract(() => new MyProvider(), async () => {});
 */
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { DataProviderAdapter } from '../../../src/providers/data/DataProvider';

export function runDataProviderContract(
    createProvider: () => DataProviderAdapter,
    cleanup: () => Promise<void> = async () => {}
) {
    let provider: DataProviderAdapter;

    beforeEach(() => {
        provider = createProvider();
    });

    afterEach(async () => {
        await cleanup();
    });

    // ── read ─────────────────────────────────────────────────────────────────

    describe('read()', () => {
        it('returns undefined for a non-existent record path', async () => {
            const result = await provider.read('/nonexistent/rec_999');
            expect(result).toBeUndefined();
        });

        it('returns an empty-ish result for a non-existent collection path', async () => {
            const result = await provider.read('/nonexistent');
            // Acceptable: undefined, null, or empty object {}
            const isEmpty = result == null || Object.keys(result).length === 0;
            expect(isEmpty).toBe(true);
        });

        it('returns the full collection as an object keyed by id', async () => {
            await provider.set('/items/a', { value: 1 });
            await provider.set('/items/b', { value: 2 });
            const result = await provider.read('/items');
            expect(result).toMatchObject({ a: { value: 1 }, b: { value: 2 } });
        });

        it('returns a single record by path', async () => {
            await provider.set('/items/x', { name: 'test' });
            const result = await provider.read('/items/x');
            expect(result).toMatchObject({ name: 'test' });
        });

        it('returns array of values when toArray: true', async () => {
            await provider.set('/things/t1', { n: 1 });
            await provider.set('/things/t2', { n: 2 });
            const result = await provider.read('/things', { toArray: true });
            expect(Array.isArray(result)).toBe(true);
            expect(result).toHaveLength(2);
        });
    });

    // ── set ──────────────────────────────────────────────────────────────────

    describe('set()', () => {
        it('persists a new record', async () => {
            await provider.set('/users/u1', { name: 'Alice' });
            const result = await provider.read('/users/u1');
            expect(result).toMatchObject({ name: 'Alice' });
        });

        it('overwrites an existing record completely', async () => {
            await provider.set('/users/u2', { name: 'Bob', role: 'admin' });
            await provider.set('/users/u2', { name: 'Bob' });
            const result = await provider.read('/users/u2');
            expect(result).toMatchObject({ name: 'Bob' });
            expect(result?.role).toBeUndefined();
        });
    });

    // ── update ───────────────────────────────────────────────────────────────

    describe('update()', () => {
        it('merges fields without removing others', async () => {
            await provider.set('/users/u3', { name: 'Carol', role: 'viewer' });
            await provider.update('/users/u3', { role: 'editor' });
            const result = await provider.read('/users/u3');
            expect(result).toMatchObject({ name: 'Carol', role: 'editor' });
        });

        it('creates the record if it does not exist', async () => {
            await provider.update('/users/u4', { name: 'Dave' });
            const result = await provider.read('/users/u4');
            expect(result).toMatchObject({ name: 'Dave' });
        });
    });

    // ── remove ───────────────────────────────────────────────────────────────

    describe('remove()', () => {
        it('deletes an existing record', async () => {
            await provider.set('/users/u5', { name: 'Eve' });
            await provider.remove('/users/u5');
            const result = await provider.read('/users/u5');
            expect(result).toBeUndefined();
        });

        it('does not throw when removing a non-existent record', async () => {
            await expect(provider.remove('/users/phantom')).resolves.not.toThrow();
        });
    });

    // ── CR-129: the same reads on every provider ─────────────────────────────

    describe('contains, containsAny and limit (CR-129)', () => {
        beforeEach(async () => {
            await provider.set('/tagged/a', { n: 1, tags: ['red', 'blue'] });
            await provider.set('/tagged/b', { n: 2, tags: ['green'] });
            await provider.set('/tagged/c', { n: 3, tags: ['blue'] });
        });

        it('contains keeps the records whose list holds the value', async () => {
            const result = await provider.read('/tagged', { where: { tags: { contains: 'blue' } }, toArray: true });
            expect(result.map((r: any) => r.n).sort()).toEqual([1, 3]);
        });

        it('containsAny keeps the records whose list holds one of the values', async () => {
            const result = await provider.read('/tagged', { where: { tags: { containsAny: ['green', 'red'] } }, toArray: true });
            expect(result.map((r: any) => r.n).sort()).toEqual([1, 2]);
        });

        it('limit keeps the first records after where and order', async () => {
            const result = await provider.read('/tagged', { order: { n: 'desc' }, limit: 2, toArray: true });
            expect(result.map((r: any) => r.n)).toEqual([3, 2]);
        });

        it('subscribe applies contains and limit too', async () => {
            const seen: any[][] = [];
            const stop = provider.subscribe('/tagged', (records) => seen.push(records), { where: { tags: { contains: 'blue' } }, order: { n: 'asc' }, limit: 1 });
            await new Promise((r) => setTimeout(r, 0));
            stop();
            expect(seen.at(-1)?.map((r: any) => r.n)).toEqual([1]);
        });

        it('subscribe on a record path follows that record', async () => {
            const seen: any[][] = [];
            const stop = provider.subscribe('/tagged/b', (records) => seen.push(records));
            await new Promise((r) => setTimeout(r, 0));
            await provider.update('/tagged/b', { n: 20 });
            await new Promise((r) => setTimeout(r, 0));
            stop();
            expect(seen.at(-1)).toEqual([expect.objectContaining({ _key: 'b', n: 20 })]);
        });
    });

    // ── isolation ────────────────────────────────────────────────────────────

    describe('collection isolation', () => {
        it('records in different collections are independent', async () => {
            await provider.set('/alpha/1', { x: 1 });
            await provider.set('/beta/1', { x: 2 });
            expect((await provider.read('/alpha/1'))?.x).toBe(1);
            expect((await provider.read('/beta/1'))?.x).toBe(2);
        });

        it('removing one record does not affect siblings', async () => {
            await provider.set('/coll/a', { v: 1 });
            await provider.set('/coll/b', { v: 2 });
            await provider.remove('/coll/a');
            expect(await provider.read('/coll/a')).toBeUndefined();
            expect((await provider.read('/coll/b'))?.v).toBe(2);
        });
    });
}
