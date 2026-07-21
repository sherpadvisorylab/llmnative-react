// Shared types - provider-agnostic, used by Form, Grid, and all components
import type { ProviderConfigurable } from '../ProviderConfiguration';

/** Canonical primary-key field name used by all data providers and the Form widget. */
export const RECORD_KEY = '_key' as const;

/** A single field value in a record - scalar, nested object, or array of scalars. */
export type FieldValue = string | number | boolean | null | undefined | Record<string, unknown> | unknown[];
type FieldMap = Record<string, FieldValue>;
type RecordObject = Record<string, FieldMap>;
/**
 * A data record as used by Form, Grid, and all data providers.
 * `_key` is the primary key injected by the provider (matches `RECORD_KEY`).
 * `_index` is the 0-based position in the parent collection (read-only, injected by providers).
 */
export type RecordProps = FieldMap & { _key?: string; _index?: number };
/** Ordered list of records returned by a provider `subscribe` or `read` call. */
export type RecordArray = Array<RecordProps>;

type Operator = "eq" | "lt" | "lte" | "gt" | "gte" | "nin" | "in";
type ScalarValue = string | number | boolean | null;
type RangeValue = string | number | boolean;
type ListValue = string[] | number[];
export type OperatorValue = ScalarValue | ListValue;
export type Condition = {
    eq?: ScalarValue;
    lt?: RangeValue;
    lte?: RangeValue;
    gt?: RangeValue;
    gte?: RangeValue;
    nin?: ListValue;
    in?: ListValue;
};
export type WhereClause = {
    [field: string]: Condition | OperatorValue;
};
export type OrderClause = {
    [field: string]: "asc" | "desc";
};

export interface DatabaseOptions {
    where?: WhereClause;
    order?: OrderClause;
    fieldMap?: Record<string, string>;
    onLoad?: (data: RecordObject) => RecordObject;
}

export interface DBConfig extends DatabaseOptions {
    path?: string;
}

export interface ReadOptions {
    where?: WhereClause;
    order?: OrderClause;
    toArray?: boolean;
    exception?: boolean;
}

export interface SetChunksOptions {
    chunkSize?: number;
    purge?: boolean;
    onProgress?: (done: number, total: number, message: string) => void;
}

/**
 * Port contract for all data back-ends (Firebase RTDB, Firestore, Supabase, Mock, …).
 * Implement this interface to register a custom provider via `<App providers={...}>`.
 */
export interface DataProviderAdapter extends ProviderConfigurable {
    /** Read a single record or collection at `path`. Returns `null` when not found. */
    read(path: string, options?: ReadOptions): Promise<any>; // CR-042: public contract, breaking to change
    /** Write (overwrite) the node at `path` with `data`. */
    set(path: string, data: object, exception?: boolean): Promise<void>;
    /** Merge `data` into the existing node at `path` (partial update). */
    update(path: string, data: object, exception?: boolean): Promise<void>;
    /** Delete the node at `path`. */
    remove(path: string, exception?: boolean): Promise<void>;
    /**
     * Subscribe to real-time updates at `path`.
     * `setRecords` is called immediately with the current data, then on every change.
     * Returns a cleanup function that cancels the subscription.
     */
    subscribe(
        path: string | undefined,
        setRecords: (records: RecordArray) => void,
        options?: DatabaseOptions
    ): () => void;
    // Optional extended methods - not all providers need to implement these
    /** Return the number of records in the collection at `path`. */
    count?(path: string): Promise<number>;
    /** Return only the direct child keys of `path` without fetching full records. */
    readShallow?(path: string, exception?: boolean): Promise<string[]>;
    /** Write `data` to `path` in batches (useful for large imports). */
    setChunks?(path: string, data: object, options?: SetChunksOptions): Promise<void>;
    /**
     * Releases this adapter's underlying connection/resources. Not all providers need one
     * (e.g. a stateless REST-backed adapter has nothing to release) — implement it when the
     * provider holds a long-lived client/channel that should stop retrying once a caller has
     * given up on it (see FirestoreDataProvider, where a nonexistent named database otherwise
     * keeps reconnecting with backoff forever at the SDK level).
     */
    dispose?(): Promise<void>;
}
