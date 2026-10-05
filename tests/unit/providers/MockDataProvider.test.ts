import { describe, it, expect, vi, beforeEach } from 'vitest';
import { act } from '@testing-library/react';
import { MockDataProvider } from '../../../src/providers/data/mock';
import { runDataProviderContract } from './DataProvider.contract';

describe('MockDataProvider - DataProvider contract', () => {
    runDataProviderContract(() => new MockDataProvider());
});

describe('MockDataProvider - constructor seed', () => {
    it('initialises store from constructor data', async () => {
        const provider = new MockDataProvider({
            '/users': {
                u1: { name: 'Alice' },
                u2: { name: 'Bob' },
            },
        });
        const col = await provider.read('/users');
        expect(col).toMatchObject({ u1: { name: 'Alice' }, u2: { name: 'Bob' } });
    });

    it('accepts paths without leading slash in seed', async () => {
        const provider = new MockDataProvider({
            products: { p1: { title: 'Widget' } },
        });
        const result = await provider.read('/products/p1');
        expect(result).toMatchObject({ title: 'Widget' });
    });
});

describe('MockDataProvider - subscribe()', () => {
    let provider: MockDataProvider;

    beforeEach(() => {
        provider = new MockDataProvider({
            '/items': {
                i1: { label: 'A' },
                i2: { label: 'B' },
            },
        });
    });

    it('calls setRecords immediately with current data', () => {
        const setRecords = vi.fn();
        provider.subscribe('/items', setRecords);

        expect(setRecords).toHaveBeenCalledOnce();
        const records = setRecords.mock.calls[0][0];
        expect(records).toHaveLength(2);
        expect(records[0]).toMatchObject({ _key: 'i1', label: 'A' });
        expect(records[1]).toMatchObject({ _key: 'i2', label: 'B' });
    });

    it('includes _key and _index on every record', () => {
        const setRecords = vi.fn();
        provider.subscribe('/items', setRecords);

        const records = setRecords.mock.calls[0][0];
        records.forEach((record: any, index: number) => {
            expect(record._key).toBeDefined();
            expect(record._index).toBe(index);
        });
    });

    it('re-fires setRecords after set()', async () => {
        const setRecords = vi.fn();
        provider.subscribe('/items', setRecords);

        await act(async () => {
            await provider.set('/items/i3', { label: 'C' });
        });

        expect(setRecords).toHaveBeenCalledTimes(2);
        const records = setRecords.mock.calls[1][0];
        expect(records.find((record: any) => record._key === 'i3')).toMatchObject({ label: 'C' });
    });

    it('re-fires setRecords after remove()', async () => {
        const setRecords = vi.fn();
        provider.subscribe('/items', setRecords);

        await act(async () => {
            await provider.remove('/items/i1');
        });

        const records = setRecords.mock.calls[1][0];
        expect(records.find((record: any) => record._key === 'i1')).toBeUndefined();
        expect(records).toHaveLength(1);
    });

    it('does not fire after unsubscribe', async () => {
        const setRecords = vi.fn();
        const unsubscribe = provider.subscribe('/items', setRecords);

        unsubscribe();
        const callsBefore = setRecords.mock.calls.length;

        await act(async () => {
            await provider.set('/items/i99', { label: 'Z' });
        });

        expect(setRecords.mock.calls.length).toBe(callsBefore);
    });

    it('returns empty array for non-existent collection', () => {
        const setRecords = vi.fn();
        provider.subscribe('/empty-coll', setRecords);

        expect(setRecords).toHaveBeenCalledWith([]);
    });

    it('skips subscription when path is undefined', () => {
        const setRecords = vi.fn();
        const unsubscribe = provider.subscribe(undefined, setRecords);
        expect(setRecords).not.toHaveBeenCalled();
        expect(unsubscribe).toBeTypeOf('function');
    });

    it('applies where filtering when subscription options include where', () => {
        provider = new MockDataProvider({
            '/items': {
                i1: { label: 'A', status: 'active' },
                i2: { label: 'B', status: 'inactive' },
                i3: { label: 'C', status: 'active' },
            },
        });
        const setRecords = vi.fn();
        provider.subscribe('/items', setRecords, { where: { status: 'active' } });

        const records = setRecords.mock.calls[0][0];
        expect(records).toHaveLength(2);
        expect(records.map((record: any) => record._key)).toEqual(['i1', 'i3']);
    });

    it('applies multi-field ordering when subscription options include order', () => {
        provider = new MockDataProvider({
            '/items': {
                i1: { label: 'B', team: 'Platform' },
                i2: { label: 'A', team: 'Platform' },
                i3: { label: 'A', team: 'Marketing' },
            },
        });
        const setRecords = vi.fn();
        provider.subscribe('/items', setRecords, { order: { team: 'asc', label: 'asc' } });

        const records = setRecords.mock.calls[0][0];
        expect(records.map((record: any) => record._key)).toEqual(['i3', 'i2', 'i1']);
    });

    it('updates nested collection paths using the full collection prefix', async () => {
        provider = new MockDataProvider({
            '/showcase/grid/users': {
                u1: { name: 'Alice' },
            },
        });
        const setRecords = vi.fn();
        provider.subscribe('/showcase/grid/users', setRecords);

        await act(async () => {
            await provider.set('/showcase/grid/users/u2', { name: 'Bob' });
        });

        let records = setRecords.mock.calls.at(-1)?.[0];
        expect(records.map((record: any) => record._key)).toEqual(['u1', 'u2']);

        await act(async () => {
            await provider.update('/showcase/grid/users/u1', { city: 'Milan' });
        });

        records = setRecords.mock.calls.at(-1)?.[0];
        expect(records.find((record: any) => record._key === 'u1')).toMatchObject({ name: 'Alice', city: 'Milan' });

        await act(async () => {
            await provider.remove('/showcase/grid/users/u2');
        });

        records = setRecords.mock.calls.at(-1)?.[0];
        expect(records.map((record: any) => record._key)).toEqual(['u1']);
    });
});

describe('MockDataProvider - sub-collections', () => {
    it('stores a nested record in its sub-collection, not in the parent collection', async () => {
        const provider = new MockDataProvider({ '/companies': { acme: { name: 'Acme' } } });

        await provider.set('/companies/acme/playbooks/p1', { name: 'Delivery' });

        expect(await provider.read('/companies')).toEqual({ acme: { name: 'Acme' } });
        expect(await provider.read('/companies/acme/playbooks')).toEqual({ p1: { name: 'Delivery' } });
        expect(await provider.read('/companies/acme/playbooks/p1')).toEqual({ name: 'Delivery' });
    });

    it('keeps sibling sub-collections independent, also for parents created at runtime', async () => {
        const provider = new MockDataProvider({ '/companies': { acme: { name: 'Acme' } } });

        await provider.set('/companies/beta', { name: 'Beta' });
        await provider.set('/companies/acme/playbooks/p1', { name: 'Delivery' });
        await provider.set('/companies/beta/playbooks/p2', { name: 'Marketing' });
        await provider.update('/companies/beta/playbooks/p2', { status: 'draft' });

        expect(Object.keys(await provider.read('/companies'))).toEqual(['acme', 'beta']);
        expect(await provider.read('/companies/acme/playbooks')).toEqual({ p1: { name: 'Delivery' } });
        expect(await provider.read('/companies/beta/playbooks')).toEqual({ p2: { name: 'Marketing', status: 'draft' } });

        await provider.remove('/companies/acme/playbooks/p1');
        expect(await provider.read('/companies/acme/playbooks')).toEqual({});
        expect(await provider.read('/companies/beta/playbooks/p2')).toMatchObject({ name: 'Marketing' });
    });

    it('reads a sub-collection that was never written as an empty collection', async () => {
        const provider = new MockDataProvider({ '/companies': { acme: { name: 'Acme' } } });

        expect(await provider.read('/companies/acme/playbooks')).toEqual({});
    });

    it('notifies sub-collection subscribers on nested writes', async () => {
        const provider = new MockDataProvider({ '/companies': { acme: { name: 'Acme' } } });
        const parent = vi.fn();
        const child = vi.fn();
        provider.subscribe('/companies', parent);
        provider.subscribe('/companies/acme/playbooks', child);

        await act(async () => {
            await provider.set('/companies/acme/playbooks/p1', { name: 'Delivery' });
        });

        expect(child.mock.calls.at(-1)?.[0].map((record: { _key: string }) => record._key)).toEqual(['p1']);
        expect(parent.mock.calls.at(-1)?.[0].map((record: { _key: string }) => record._key)).toEqual(['acme']);
    });
});
