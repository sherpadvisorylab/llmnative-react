import { useEffect } from 'react';
import {
    DataProviderAdapter,
    DatabaseOptions,
    ReadOptions,
    RecordProps,
    RecordArray,
} from './DataProvider';

type CollectionStore = Record<string, Record<string, any>>;
type ListenerSet = Set<() => void>;

function parsePath(path: string): { collection: string; id?: string } {
    const parts = path.replace(/^\/+/, '').split('/').filter(Boolean);
    return parts.length >= 2
        ? { collection: `/${parts[0]}`, id: parts.slice(1).join('/') }
        : { collection: `/${parts[0]}` };
}

function toRecordArray(col: Record<string, any>): RecordArray {
    return Object.entries(col).map(([key, value], index) => ({
        _key: key,
        _index: index,
        ...(typeof value === 'object' && value !== null ? value : {}),
    }));
}

export class MockDataProvider implements DataProviderAdapter {
    private store: CollectionStore = {};
    private listeners: Map<string, ListenerSet> = new Map();

    constructor(initialData?: CollectionStore) {
        if (initialData) {
            for (const [rawPath, records] of Object.entries(initialData)) {
                const key = rawPath.startsWith('/') ? rawPath : `/${rawPath}`;
                this.store[key] = { ...records };
            }
        }
    }

    isConfigured(): boolean {
        return true;
    }

    getConfigurationState() {
        return { configured: true };
    }

    private getCollection(collPath: string): Record<string, any> {
        if (!this.store[collPath]) this.store[collPath] = {};
        return this.store[collPath];
    }

    private notify(collPath: string): void {
        this.listeners.get(collPath)?.forEach(cb => cb());
    }

    read = async (path: string, options: ReadOptions = {}): Promise<any> => {
        const { collection, id } = parsePath(path);
        const col = this.getCollection(collection);
        if (id) {
            return col[id] ? { ...col[id] } : undefined;
        }
        if (options.toArray) return Object.values(col).map(v => ({ ...v }));
        return Object.fromEntries(Object.entries(col).map(([k, v]) => [k, { ...v }]));
    };

    set = async (path: string, data: object): Promise<void> => {
        const { collection, id } = parsePath(path);
        const col = this.getCollection(collection);
        if (id) {
            col[id] = { ...data };
        } else {
            this.store[collection] = { ...(data as Record<string, any>) };
        }
        this.notify(collection);
    };

    update = async (path: string, data: object): Promise<void> => {
        const { collection, id } = parsePath(path);
        const col = this.getCollection(collection);
        if (id) {
            col[id] = { ...(col[id] || {}), ...data };
        } else {
            this.store[collection] = { ...col, ...(data as Record<string, any>) };
        }
        this.notify(collection);
    };

    remove = async (path: string): Promise<void> => {
        const { collection, id } = parsePath(path);
        if (id) {
            delete this.getCollection(collection)[id];
        } else {
            delete this.store[collection];
        }
        this.notify(collection);
    };

    useListener = (
        path: string | undefined,
        setRecords: (records: RecordArray) => void,
        _options?: DatabaseOptions
    ): void => {
        const self = this;
        // eslint-disable-next-line react-hooks/rules-of-hooks
        useEffect(() => {
            if (!path) return;
            const col = path.startsWith('/') ? path : `/${path}`;

            const dispatch = () => {
                setRecords(toRecordArray(self.getCollection(col)));
            };

            dispatch();

            if (!self.listeners.has(col)) self.listeners.set(col, new Set());
            self.listeners.get(col)!.add(dispatch);

            return () => {
                self.listeners.get(col)?.delete(dispatch);
            };
        }, [path]);
    };
}
