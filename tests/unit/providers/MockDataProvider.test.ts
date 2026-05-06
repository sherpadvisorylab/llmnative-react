import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { MockDataProvider } from '../../../src/providers/data/mock';
import { runDataProviderContract } from './DataProvider.contract';

// ── Contract ─────────────────────────────────────────────────────────────────

describe('MockDataProvider — DataProvider contract', () => {
    runDataProviderContract(() => new MockDataProvider());
});

// ── Constructor seed ─────────────────────────────────────────────────────────

describe('MockDataProvider — constructor seed', () => {
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
            'products': { p1: { title: 'Widget' } },
        });
        const result = await provider.read('/products/p1');
        expect(result).toMatchObject({ title: 'Widget' });
    });
});

// ── useListener ──────────────────────────────────────────────────────────────

describe('MockDataProvider — useListener()', () => {
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
        renderHook(() => provider.useListener('/items', setRecords));

        expect(setRecords).toHaveBeenCalledOnce();
        const records = setRecords.mock.calls[0][0];
        expect(records).toHaveLength(2);
        expect(records[0]).toMatchObject({ _key: 'i1', label: 'A' });
        expect(records[1]).toMatchObject({ _key: 'i2', label: 'B' });
    });

    it('includes _key and _index on every record', () => {
        const setRecords = vi.fn();
        renderHook(() => provider.useListener('/items', setRecords));

        const records = setRecords.mock.calls[0][0];
        records.forEach((r: any, idx: number) => {
            expect(r._key).toBeDefined();
            expect(r._index).toBe(idx);
        });
    });

    it('re-fires setRecords after set()', async () => {
        const setRecords = vi.fn();
        renderHook(() => provider.useListener('/items', setRecords));

        await act(async () => {
            await provider.set('/items/i3', { label: 'C' });
        });

        // First call on mount, second after set
        expect(setRecords).toHaveBeenCalledTimes(2);
        const records = setRecords.mock.calls[1][0];
        expect(records.find((r: any) => r._key === 'i3')).toMatchObject({ label: 'C' });
    });

    it('re-fires setRecords after remove()', async () => {
        const setRecords = vi.fn();
        renderHook(() => provider.useListener('/items', setRecords));

        await act(async () => {
            await provider.remove('/items/i1');
        });

        const records = setRecords.mock.calls[1][0];
        expect(records.find((r: any) => r._key === 'i1')).toBeUndefined();
        expect(records).toHaveLength(1);
    });

    it('does not fire after unmount', async () => {
        const setRecords = vi.fn();
        const { unmount } = renderHook(() => provider.useListener('/items', setRecords));

        unmount();
        const callsBefore = setRecords.mock.calls.length;

        await act(async () => {
            await provider.set('/items/i99', { label: 'Z' });
        });

        expect(setRecords.mock.calls.length).toBe(callsBefore);
    });

    it('returns empty array for non-existent collection', () => {
        const setRecords = vi.fn();
        renderHook(() => provider.useListener('/empty-coll', setRecords));

        expect(setRecords).toHaveBeenCalledWith([]);
    });

    it('skips subscription when path is undefined', () => {
        const setRecords = vi.fn();
        renderHook(() => provider.useListener(undefined, setRecords));
        expect(setRecords).not.toHaveBeenCalled();
    });
});
