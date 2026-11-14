import { useEffect, useMemo, useState } from 'react';
import type { DataProviderError, DatabaseOptions, RecordArray } from './DataProvider';
import { useDataProvider } from './DataProviderContext';

export type DataSubscriptionOptions = Pick<DatabaseOptions, 'where' | 'order' | 'limit' | 'fieldMap'> & {
    /** Read nothing (a page still waiting for an id): `loading` false, no records. */
    skip?: boolean;
    /** The name of a provider registered in `providers` (the default one without it). */
    provider?: string;
};

export type DataSubscriptionState = {
    records: RecordArray;
    loading: boolean;
    /** Why the data did not arrive (rules, session, query, network), the same on every provider. */
    error: DataProviderError | null;
};

/**
 * CR-129 — the records at `path`, live, from the data provider: `{ records, loading, error }`. `loading` is
 * true until the first answer; a subscription the database refuses gives `error` instead of a list that never
 * arrives. `where`, `order` and `limit` are compared by value, so a new object with the same content does not
 * subscribe again.
 */
export function useDataSubscription(path: string | null | undefined, options: DataSubscriptionOptions = {}): DataSubscriptionState {
    const { skip = false, provider, ...query } = options;
    const db = useDataProvider(provider);
    const key = JSON.stringify(query);
    const stableQuery = useMemo(() => JSON.parse(key) as Pick<DatabaseOptions, 'where' | 'order' | 'limit' | 'fieldMap'>, [key]);
    const active = Boolean(path) && !skip;
    const [state, setState] = useState<DataSubscriptionState>({ records: [], loading: active, error: null });

    useEffect(() => {
        if (!active || !path) {
            setState({ records: [], loading: false, error: null });
            return undefined;
        }
        let open = true;
        setState((previous) => ({ ...previous, loading: true, error: null }));
        const unsubscribe = db.subscribe(
            path,
            (records) => { if (open) setState({ records, loading: false, error: null }); },
            { ...stableQuery, onError: (error) => { if (open) setState({ records: [], loading: false, error }); } },
        );
        return () => {
            open = false;
            unsubscribe();
        };
    }, [db, path, stableQuery, active]);

    return state;
}
