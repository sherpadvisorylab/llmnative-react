import {
    getFirestore,
    collection,
    doc,
    getDocs,
    getDoc,
    setDoc,
    updateDoc,
    deleteDoc,
    addDoc,
    writeBatch,
    onSnapshot,
    query,
    where as fbWhere,
    orderBy,
    getCountFromServer,
    type Firestore as FirestoreDb,
    type QueryConstraint,
    type DocumentData,
    type WhereFilterOp,
    type QuerySnapshot,
} from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { consoleLog } from '../../constant';
import { Config, onConfigChange } from '../../Config';
import init, { getFirestoreConfigurationState, getSafeAuth } from '../firebase-init';
import {
    DataProviderAdapter,
    DatabaseOptions,
    ReadOptions,
    SetChunksOptions,
    RecordProps,
    RecordArray,
    WhereClause,
    OrderClause,
    Condition,
    OperatorValue,
    RECORD_KEY,
} from './DataProvider';
import type { ProviderConfigurationState } from '../ProviderConfiguration';
import { converter } from '../../libs/converter';

// ── Path helpers ─────────────────────────────────────────────────────────────

const normalizePath = (path: string) => path.replace(/^\/+|\/+$/g, '');
const getSegments   = (path: string) => normalizePath(path).split('/').filter(Boolean);

/** Even segment count = document path (/users/uid). Odd = collection (/users). */
const isDocPath = (path: string) => getSegments(path).length % 2 === 0;

const getDb = (): FirestoreDb => getFirestore();

// ── Error helper ─────────────────────────────────────────────────────────────

const handleError = (action: string, error: any, exception: boolean) => {
    const message = `Error during ${action}: ${error}`;
    if (exception) throw new Error(message);
    console.error(message);
};

// ── Operator mapping ─────────────────────────────────────────────────────────

const OP_MAP: Partial<Record<string, WhereFilterOp>> = {
    eq:  '==',
    lt:  '<',
    lte: '<=',
    gt:  '>',
    gte: '>=',
    in:  'in',
    nin: 'not-in',
};

// ── Query builder ─────────────────────────────────────────────────────────────

/**
 * Converts a DataProvider WhereClause + OrderClause into Firestore QueryConstraints.
 *
 * Firestore limitations to be aware of:
 * - Inequality filters on a field require the first orderBy() to be on that same field.
 * - `in` allows up to 30 values; `not-in` up to 10.
 * - Only one `not-in` / `!=` per query.
 * Violating these throws a runtime error from the Firestore SDK.
 */
const buildConstraints = (where?: WhereClause, order?: OrderClause): QueryConstraint[] => {
    const constraints: QueryConstraint[] = [];

    if (where) {
        for (const [field, raw] of Object.entries(where)) {
            const condition: Condition =
                raw !== null && typeof raw === 'object' && !Array.isArray(raw)
                    ? (raw as Condition)
                    : Array.isArray(raw)
                        ? { in: raw as OperatorValue & any[] }
                        : { eq: raw as any };

            for (const [op, value] of Object.entries(condition)) {
                const fsOp = OP_MAP[op];
                if (fsOp) constraints.push(fbWhere(field, fsOp, value));
            }
        }
    }

    if (order) {
        for (const [field, dir] of Object.entries(order as OrderClause)) {
            constraints.push(orderBy(field, dir));
        }
    }

    return constraints;
};

// ── Snapshot → RecordArray ────────────────────────────────────────────────────

type RecordObject = Record<string, Record<string, any>>;

const SYSTEM_KEY = '@key';

const snapshotToRecordArray = (
    snap: QuerySnapshot<DocumentData>,
    fieldMap?: Record<string, string>
): RecordArray => {
    if (!fieldMap) {
        return snap.docs.map((d, i) => ({
            [RECORD_KEY]: d.id,
            _index: i,
            ...d.data(),
        }));
    }

    const mapKeys = Object.keys(fieldMap);
    return snap.docs.map((d, i) => {
        const source: Record<string, any> = { [SYSTEM_KEY]: d.id, ...d.data() };
        const mapped: Record<string, any> = {};
        for (const prop of mapKeys) {
            const field = fieldMap[prop];
            mapped[prop] = field.includes('{')
                ? converter.parse(source, field)
                : field === SYSTEM_KEY
                    ? d.id
                    : source[field];
        }
        return { [RECORD_KEY]: d.id, _index: i, ...mapped };
    });
};

const recordArrayToObject = (records: RecordArray): RecordObject =>
    Object.fromEntries(records.map(r => [r[RECORD_KEY]!, r]));

// ── Provider class ────────────────────────────────────────────────────────────

export class FirestoreDataProvider implements DataProviderAdapter {
    private static listenerRegistered = false;

    constructor() {
        if (!FirestoreDataProvider.listenerRegistered && typeof onConfigChange === 'function') {
            FirestoreDataProvider.listenerRegistered = true;
            onConfigChange((newConfig: Config) => {
                if (newConfig.firebase) init(newConfig.firebase);
            });
        }
    }

    getConfigurationState(): ProviderConfigurationState {
        return getFirestoreConfigurationState();
    }

    isConfigured(): boolean {
        return this.getConfigurationState().configured;
    }

    // ── read ────────────────────────────────────────────────────────────────

    read = async (
        path: string,
        { where, order, toArray = false, exception = false }: ReadOptions = {}
    ): Promise<any> => {
        const db = getDb();
        const np = normalizePath(path);
        try {
            if (isDocPath(path)) {
                const snap = await getDoc(doc(db, np));
                if (!snap.exists()) {
                    if (exception) throw new Error(`Document not found: ${path}`);
                    return undefined;
                }
                consoleLog(`Info: Document found in Firestore at ${path}`);
                return { [RECORD_KEY]: snap.id, ...snap.data() };
            }

            const constraints = buildConstraints(where, order);
            const q = constraints.length
                ? query(collection(db, np), ...constraints)
                : collection(db, np);
            const snap = await getDocs(q);
            consoleLog(`Info: ${snap.size} docs found in Firestore at ${path}`);
            const records = snapshotToRecordArray(snap);
            return toArray ? records : recordArrayToObject(records);
        } catch (error) {
            handleError(`reading data in Firestore for ${path}`, error, exception);
        }
    };

    // ── set ─────────────────────────────────────────────────────────────────

    set = async (path: string, data: object, exception = false): Promise<void> => {
        const db = getDb();
        const np = normalizePath(path);
        try {
            if (isDocPath(path)) {
                await setDoc(doc(db, np), data);
            } else {
                // Collection path: add new document with auto-generated ID
                await addDoc(collection(db, np), data);
            }
            consoleLog(`Data successfully set in Firestore at ${path}`);
        } catch (error) {
            handleError(`setting data in Firestore for ${path}`, error, exception);
        }
    };

    // ── update ──────────────────────────────────────────────────────────────

    update = async (path: string, data: object, exception = false): Promise<void> => {
        const db = getDb();
        const np = normalizePath(path);
        try {
            if (isDocPath(path)) {
                await updateDoc(doc(db, np), data as DocumentData);
            } else {
                await addDoc(collection(db, np), data);
            }
            consoleLog(`Data successfully updated in Firestore at ${path}`);
        } catch (error) {
            handleError(`updating data in Firestore for ${path}`, error, exception);
        }
    };

    // ── remove ──────────────────────────────────────────────────────────────

    remove = async (path: string, exception = false): Promise<void> => {
        const db = getDb();
        const np = normalizePath(path);
        try {
            if (isDocPath(path)) {
                await deleteDoc(doc(db, np));
            } else {
                throw new Error('Deleting an entire collection is not supported. Remove individual documents.');
            }
            consoleLog(`Data successfully removed from Firestore at ${path}`);
        } catch (error) {
            handleError(`removing data in Firestore for ${path}`, error, exception);
        }
    };

    // ── count ───────────────────────────────────────────────────────────────

    count = async (path: string): Promise<number> => {
        if (isDocPath(path)) return 1;
        const db = getDb();
        try {
            const snap = await getCountFromServer(collection(db, normalizePath(path)));
            return snap.data().count;
        } catch {
            // Fallback for environments where getCountFromServer is unavailable
            const snap = await getDocs(collection(db, normalizePath(path)));
            return snap.size;
        }
    };

    // ── subscribe ───────────────────────────────────────────────────────────

    /**
     * Real-time listener via Firestore onSnapshot.
     *
     * - Collection path (/users): subscribes to all matching documents.
     * - Document path (/users/uid): subscribes to a single document.
     *
     * Returns an unsubscribe function — always call it on component unmount.
     *
     * Firestore inequality filters on a field require the first orderBy() to be
     * on that same field. Pass `order` accordingly to avoid SDK errors.
     */
    subscribe = <T extends RecordProps = RecordProps>(
        path: string | undefined,
        setRecords: (records: T[]) => void,
        { where, order, fieldMap, onLoad }: DatabaseOptions = {}
    ): (() => void) => {
        const auth = getSafeAuth();
        if (!auth || !path) return () => undefined;

        const attachListener = (): (() => void) => {
            const db = getDb();
            const np = normalizePath(path);

            if (isDocPath(path)) {
                // Single-document listener
                return onSnapshot(doc(db, np), (snap) => {
                    if (!snap.exists()) { setRecords([]); return; }
                    setRecords([{ [RECORD_KEY]: snap.id, _index: 0, ...snap.data() } as T]);
                }, (err) => console.error('Firestore onSnapshot error:', err));
            }

            // Collection listener
            const constraints = buildConstraints(where, order);
            const q = constraints.length
                ? query(collection(db, np), ...constraints)
                : collection(db, np);

            return onSnapshot(q as any, (snap: QuerySnapshot<DocumentData>) => {
                const records = snapshotToRecordArray(snap, fieldMap);

                if (onLoad) {
                    const asObject = recordArrayToObject(records);
                    const transformed = onLoad(asObject);
                    const out = Object.entries(transformed).map(([key, val], i) => ({
                        [RECORD_KEY]: key,
                        _index: i,
                        ...(typeof val === 'object' && val !== null ? val : {}),
                    })) as T[];
                    setRecords(out);
                } else {
                    setRecords(records as T[]);
                }
            }, (err) => console.error('Firestore onSnapshot error:', err));
        };

        let unsubscribeData: (() => void) | undefined;
        const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
            unsubscribeData?.();
            unsubscribeData = undefined;
            if (!user) {
                setRecords([]);
            } else {
                unsubscribeData = attachListener();
            }
        });

        return () => {
            unsubscribeData?.();
            unsubscribeAuth();
        };
    };

    // ── readShallow ─────────────────────────────────────────────────────────

    /**
     * Returns the list of document IDs in a collection without loading document
     * data — the Firestore equivalent of RTDB's ?shallow=true REST endpoint.
     * On a document path, returns the document's field names.
     */
    readShallow = async (path: string, exception = false): Promise<string[]> => {
        const db = getDb();
        const np = normalizePath(path);
        try {
            if (isDocPath(path)) {
                const snap = await getDoc(doc(db, np));
                return snap.exists() ? Object.keys(snap.data() ?? {}) : [];
            }
            const snap = await getDocs(collection(db, np));
            return snap.docs.map(d => d.id);
        } catch (error) {
            handleError(`reading shallow data in Firestore for ${path}`, error, exception ?? false);
            return [];
        }
    };

    // ── setChunks ───────────────────────────────────────────────────────────

    /**
     * Bulk-writes `data` to a collection using Firestore writeBatch.
     * Each batch holds at most min(chunkSize, 500) documents (Firestore limit).
     * If `purge` is true, all existing documents in the collection are deleted
     * first (also in batches of 500).
     */
    setChunks = async (
        path: string,
        data: object,
        { chunkSize = 500, purge = false, onProgress }: SetChunksOptions = {}
    ): Promise<void> => {
        const db = getDb();
        const np = normalizePath(path);
        // Firestore writeBatch cap — never exceed 500 ops per commit
        const batchSize = Math.min(chunkSize, 500);

        const commitBatch = async (ops: Array<() => void>) => {
            const batch = writeBatch(db);
            ops.forEach(op => op());
            // ops add to batch via closure; re-do with batch reference
            return batch.commit();
        };

        try {
            // ── Purge ────────────────────────────────────────────────────
            if (purge) {
                onProgress?.(0, 0, `Purging existing data at ${path}`);
                const existing = await getDocs(collection(db, np));
                const ids = existing.docs.map(d => d.id);
                for (let i = 0; i < ids.length; i += batchSize) {
                    const batch = writeBatch(db);
                    ids.slice(i, i + batchSize).forEach(id =>
                        batch.delete(doc(db, np, id))
                    );
                    await batch.commit();
                }
            }

            // ── Write ─────────────────────────────────────────────────────
            const entries = Object.entries(data as Record<string, any>);
            const totalBatches = Math.ceil(entries.length / batchSize);

            for (let i = 0; i < entries.length; i += batchSize) {
                const batch = writeBatch(db);
                entries.slice(i, i + batchSize).forEach(([id, value]) => {
                    batch.set(doc(db, np, id), value);
                });
                await batch.commit();
                const done = Math.floor(i / batchSize) + 1;
                onProgress?.(done, totalBatches, `Saving batch ${done}/${totalBatches}`);
            }

            consoleLog(`setChunks completed for Firestore at ${path} (${entries.length} docs)`);
        } catch (error) {
            handleError(`setting data in chunks in Firestore for ${path}`, error, false);
        }
    };
}
