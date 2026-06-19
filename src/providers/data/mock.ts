import { converter } from '../../libs/converter';
import {
    DataProviderAdapter,
    DatabaseOptions,
    ReadOptions,
    Condition,
    OperatorValue,
    RecordProps,
    RecordArray,
    WhereClause,
    OrderClause,
    RECORD_KEY,
} from './DataProvider';

type CollectionStore = Record<string, Record<string, any>>; // CR-042: in-memory store holds arbitrary JSON record shapes
type ListenerSet = Set<() => void>;
type RecordObject = Record<string, Record<string, any>>; // CR-042: same as above
type WhereEntry = [string, Condition | OperatorValue];
type OrderEntry = [string, 'asc' | 'desc'];
const SYSTEM_FIELDS = {
    key: '@key',
    value: '@value',
};

function toRecordArray(col: Record<string, any>): RecordArray { // CR-042: col is CollectionStore entry
    return Object.entries(col).map(([key, value], index) => ({
        [RECORD_KEY]: key,
        _index: index,
        ...(typeof value === 'object' && value !== null ? value : {}),
    }));
}

function getEntryValue(value: unknown, field: string): unknown {
    if (!field) return value;
    const parts = field.split('.');
    let current: unknown = value;
    for (const part of parts) {
        if (current == null) return undefined;
        current = (current as Record<string, unknown>)[part];
    }
    return current;
}

function compareValues(left: unknown, right: unknown): number {
    if (left === right) return 0;
    if (left == null) return -1;
    if (right == null) return 1;
    if (typeof left === 'number' && typeof right === 'number') return left - right;
    if (typeof left === 'boolean' && typeof right === 'boolean') return Number(left) - Number(right);
    return globalThis.String(left).localeCompare(globalThis.String(right), undefined, { numeric: true, sensitivity: 'base' });
}

function matchWhere(value: unknown, raw: Condition | OperatorValue): boolean {
    const condition = typeof raw === 'object' && raw !== null && !Array.isArray(raw) ? raw as Condition : { eq: raw };
    for (const [op, target] of Object.entries(condition as Record<string, OperatorValue>)) {
        switch (op) {
            case 'eq': if (value !== target) return false; break;
            case 'gt': if (!((value as string | number) > (target as string | number))) return false; break;
            case 'gte': if (!((value as string | number) >= (target as string | number))) return false; break;
            case 'lt': if (!((value as string | number) < (target as string | number))) return false; break;
            case 'lte': if (!((value as string | number) <= (target as string | number))) return false; break;
            case 'in': if (!Array.isArray(target) || !(target as unknown[]).includes(value)) return false; break;
            case 'nin': if (Array.isArray(target) && (target as unknown[]).includes(value)) return false; break;
            default: return false;
        }
    }
    return true;
}

function processRecordObject(val: RecordObject, where?: WhereClause, order?: OrderClause): RecordObject {
    const orderEntries = Object.entries(order || {}) as OrderEntry[];
    const whereEntries = Object.entries(where || {}) as WhereEntry[];
    let filtered = Object.entries(val);

    if (whereEntries.length) {
        filtered = filtered.filter(([, value]) =>
            whereEntries.every(([field, raw]) => matchWhere(getEntryValue(value, field), raw))
        );
    }

    if (orderEntries.length) {
        filtered.sort((left, right) => {
            for (const [field, dir] of orderEntries) {
                const result = compareValues(getEntryValue(left[1], field), getEntryValue(right[1], field));
                if (result) return dir === 'desc' ? -result : result;
            }
            return 0;
        });
    }

    return Object.fromEntries(filtered);
}

function mapRecordObjectToArray(
    data: RecordObject,
    fieldMap?: DatabaseOptions['fieldMap']
): RecordArray {
    const entries = Object.entries(data);

    if (!fieldMap) {
        return entries.map(([key, value], index) => (
            typeof value === 'object' && value !== null
                ? { _index: index, [RECORD_KEY]: key, ...value }
                : { _index: index, [RECORD_KEY]: key, [SYSTEM_FIELDS.value]: value }
        ));
    }

    const mapKeys = Object.keys(fieldMap);
    return entries.map(([key, value], index) => {
        const source = typeof value === 'object' && value !== null
            ? { [SYSTEM_FIELDS.key]: key, ...value }
            : { [SYSTEM_FIELDS.key]: key, [SYSTEM_FIELDS.value]: value };
        const mapped: Record<string, any> = {}; // CR-042: intermediate map of in-memory store values
        for (const prop of mapKeys) {
            const field = fieldMap[prop];
            mapped[prop] = field.includes('{')
                ? converter.parse(source, field)
                : field === SYSTEM_FIELDS.key ? key
                : field === SYSTEM_FIELDS.value ? value
                : source[field];
        }
        return { [RECORD_KEY]: key, _index: index, ...mapped };
    });
}

export type MockDataProviderOptions = {
    persist?: boolean;
    storageKey?: string;
};

export class MockDataProvider implements DataProviderAdapter {
    private store: CollectionStore = {};
    private listeners: Map<string, ListenerSet> = new Map();
    private persistKey: string | null;

    constructor(initialData?: CollectionStore, options?: MockDataProviderOptions) {
        this.persistKey = options?.persist ? (options.storageKey ?? 'llmnative:mock') : null;

        const seed = this.persistKey ? (this.loadStore() ?? initialData) : initialData;
        if (seed) {
            for (const [rawPath, records] of Object.entries(seed)) {
                const key = rawPath.startsWith('/') ? rawPath : `/${rawPath}`;
                this.store[key] = { ...records };
            }
        }
    }

    private loadStore(): CollectionStore | null {
        if (!this.persistKey || typeof window === 'undefined') return null;
        try {
            const raw = window.localStorage.getItem(this.persistKey);
            if (!raw) return null;
            const parsed = JSON.parse(raw) as CollectionStore;
            return typeof parsed === 'object' && parsed !== null && !Array.isArray(parsed) ? parsed : null;
        } catch {
            return null;
        }
    }

    private saveStore(): void {
        if (!this.persistKey || typeof window === 'undefined') return;
        try {
            window.localStorage.setItem(this.persistKey, JSON.stringify(this.store));
        } catch {
            // quota exceeded or private mode — ignore
        }
    }

    isConfigured(): boolean {
        return true;
    }

    getConfigurationState() {
        return { configured: true };
    }

    private getCollection(collPath: string): Record<string, any> { // CR-042: returns CollectionStore entry
        if (!this.store[collPath]) this.store[collPath] = {};
        return this.store[collPath];
    }

    private resolvePath(path: string): { collection: string; id?: string } {
        const normalized = path.startsWith('/') ? path : `/${path}`;
        if (this.store[normalized]) return { collection: normalized };

        const collectionKeys = Object.keys(this.store)
            .filter((key) => normalized.startsWith(`${key}/`))
            .sort((left, right) => right.length - left.length);

        const matchedCollection = collectionKeys[0];
        if (matchedCollection) {
            return {
                collection: matchedCollection,
                id: normalized.slice(matchedCollection.length + 1),
            };
        }

        const parts = normalized.replace(/^\/+/, '').split('/').filter(Boolean);
        if (parts.length <= 1) return { collection: normalized };

        return {
            collection: `/${parts.slice(0, -1).join('/')}`,
            id: parts[parts.length - 1],
        };
    }

    private notify(collPath: string): void {
        this.listeners.get(collPath)?.forEach(cb => cb());
    }

    read = async (path: string, options: ReadOptions = {}): Promise<any> => {
        const { collection, id } = this.resolvePath(path);
        const col = this.getCollection(collection);
        if (id) {
            return col[id] ? { ...col[id] } : undefined;
        }
        const processed = processRecordObject(col, options.where, options.order);
        if (options.toArray) return Object.values(processed).map(v => ({ ...v }));
        return Object.fromEntries(Object.entries(processed).map(([k, v]) => [k, { ...v }]));
    };

    set = async (path: string, data: object): Promise<void> => {
        const { collection, id } = this.resolvePath(path);
        const col = this.getCollection(collection);
        if (id) {
            col[id] = { ...data };
        } else {
            this.store[collection] = { ...(data as Record<string, any>) }; // CR-042: data is RecordProps; cast needed for spread into CollectionStore
        }
        this.saveStore();
        this.notify(collection);
    };

    update = async (path: string, data: object): Promise<void> => {
        const { collection, id } = this.resolvePath(path);
        const col = this.getCollection(collection);
        if (id) {
            col[id] = { ...(col[id] || {}), ...data };
        } else {
            this.store[collection] = { ...col, ...(data as Record<string, any>) };
        }
        this.saveStore();
        this.notify(collection);
    };

    remove = async (path: string): Promise<void> => {
        const { collection, id } = this.resolvePath(path);
        if (id) {
            delete this.getCollection(collection)[id];
        } else {
            delete this.store[collection];
        }
        this.saveStore();
        this.notify(collection);
    };

    subscribe = (
        path: string | undefined,
        setRecords: (records: RecordArray) => void,
        options?: DatabaseOptions
    ): (() => void) => {
        if (!path) return () => undefined;

        const col = path.startsWith('/') ? path : `/${path}`;
        const dispatch = () => {
            const processed = processRecordObject(this.getCollection(col), options?.where, options?.order);
            const loaded = options?.onLoad ? options.onLoad(processed) : processed;
            setRecords(mapRecordObjectToArray(loaded, options?.fieldMap));
        };

        dispatch();

        if (!this.listeners.has(col)) this.listeners.set(col, new Set());
        this.listeners.get(col)!.add(dispatch);

        return () => {
            this.listeners.get(col)?.delete(dispatch);
        };
    };
}
