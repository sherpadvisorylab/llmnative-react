// Shared types — provider-agnostic, used by Form, Grid, and all components
import type { ProviderConfigurable } from '../ProviderConfiguration';

type FieldMap = Record<string, any>;
type RecordObject = Record<string, FieldMap>;
export type RecordProps = FieldMap & { _key?: string; _index?: number };
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

export interface DataProviderAdapter extends ProviderConfigurable {
    read(path: string, options?: ReadOptions): Promise<any>;
    set(path: string, data: object, exception?: boolean): Promise<void>;
    update(path: string, data: object, exception?: boolean): Promise<void>;
    remove(path: string, exception?: boolean): Promise<void>;
    useListener(
        path: string | undefined,
        setRecords: (records: RecordArray) => void,
        options?: DatabaseOptions
    ): void;
    // Optional extended methods — not all providers need to implement these
    count?(path: string): Promise<number>;
    readShallow?(path: string, exception?: boolean): Promise<string[]>;
    setChunks?(path: string, data: object, options?: SetChunksOptions): Promise<void>;
}
