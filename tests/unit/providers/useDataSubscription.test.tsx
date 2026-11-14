import { describe, it, expect } from 'vitest';
import React from 'react';
import { act, renderHook, waitFor } from '@testing-library/react';

import { DataProvider } from '../../../src/providers/data/DataProviderContext';
import { MockDataProvider } from '../../../src/providers/data/mock';
import { DataProviderError, type DataProviderAdapter } from '../../../src/providers/data/DataProvider';
import { useDataSubscription } from '../../../src/providers/data/useDataSubscription';
import { toDataProviderError } from '../../../src/providers/data/query';

const wrapperOf = (provider: DataProviderAdapter) => ({ children }: { children: React.ReactNode }) => (
    <DataProvider registry={{ default: provider }} defaultKey="default">{children}</DataProvider>
);

/** A provider whose subscriptions the database refuses. */
function refusing(): DataProviderAdapter {
    const mock = new MockDataProvider();
    return {
        ...mock,
        isConfigured: () => true,
        getConfigurationState: () => ({ configured: true }),
        subscribe: (path, _set, options) => {
            setTimeout(() => options?.onError?.(toDataProviderError(Object.assign(new Error('denied'), { code: 'permission-denied' }), path)), 0);
            return () => undefined;
        },
    } as DataProviderAdapter;
}

describe('useDataSubscription (CR-129)', () => {
    it('gives the records live, with where, order and limit', async () => {
        const provider = new MockDataProvider({ posts: { a: { n: 1, tags: ['x'] }, b: { n: 2, tags: ['x'] }, c: { n: 3, tags: ['y'] } } });
        const { result } = renderHook(
            () => useDataSubscription('/posts', { where: { tags: { contains: 'x' } }, order: { n: 'desc' }, limit: 1 }),
            { wrapper: wrapperOf(provider) },
        );
        await waitFor(() => expect(result.current.loading).toBe(false));
        expect(result.current.records.map((r) => r.n)).toEqual([2]);
        expect(result.current.error).toBeNull();
        await act(async () => { await provider.set('/posts/d', { n: 9, tags: ['x'] }); });
        expect(result.current.records.map((r) => r.n)).toEqual([9]);
    });

    it('gives the error of a refused subscription instead of an endless loading', async () => {
        const { result } = renderHook(() => useDataSubscription('/secret'), { wrapper: wrapperOf(refusing()) });
        expect(result.current.loading).toBe(true);
        await waitFor(() => expect(result.current.error).toBeInstanceOf(DataProviderError));
        expect(result.current).toMatchObject({ loading: false, records: [], error: { code: 'permission-denied', path: '/secret' } });
    });

    it('reads nothing with skip or without a path', () => {
        const provider = new MockDataProvider({ posts: { a: { n: 1 } } });
        const skipped = renderHook(() => useDataSubscription('/posts', { skip: true }), { wrapper: wrapperOf(provider) });
        expect(skipped.result.current).toEqual({ records: [], loading: false, error: null });
        const none = renderHook(() => useDataSubscription(null), { wrapper: wrapperOf(provider) });
        expect(none.result.current.loading).toBe(false);
    });
});
