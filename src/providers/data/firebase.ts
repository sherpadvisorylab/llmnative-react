import type {
    Database,
    Query,
    DatabaseReference,
    DataSnapshot,
} from 'firebase/database';
import { firebaseAuthSdk, firebaseDatabaseSdk, isFirebaseLoaded, loadFirebase } from '../firebase-sdk';
import { converter } from "../../libs/converter";
import { consoleLog } from "../../constant";
import { Config, onConfigChange } from "../../Config";
import init, { getFirebaseConfigurationState, getSafeAuth } from "../firebase-init";
import { cleanRecord } from "../../libs/utils";
import { SetMessagePayload } from "../../components/ui/Buttons";
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
} from "./DataProvider";
import type { ProviderConfigurationState } from "../ProviderConfiguration";
import { applyLimit, matchCondition, reportSubscribeError } from "./query";

type RecordObject = Record<string, Record<string, any>>; // CR-042: Firebase RTDB val() returns any-typed JSON
type WhereEntry = [string, Condition | OperatorValue];
type OrderEntry = [string, "asc" | "desc"];
type QueryPlan = {
    dbRef: Query;
    clientWhere?: WhereClause;
};

export const SYSTEM_FIELDS = {
    key: "@key",
    value: "@value",
};

// CR-154 — the Realtime Database SDK is loaded with the first call (`loadSdk()`), never at import.
const getFirebaseDatabase = firebaseDatabaseSdk.fn('getDatabase');
const ref = firebaseDatabaseSdk.fn('ref');
const get = firebaseDatabaseSdk.fn('get');
const fbSet = firebaseDatabaseSdk.fn('set');
const fbUpdate = firebaseDatabaseSdk.fn('update');
const fbRemove = firebaseDatabaseSdk.fn('remove');
const onValue = firebaseDatabaseSdk.fn('onValue');
const query = firebaseDatabaseSdk.fn('query');
const orderByKey = firebaseDatabaseSdk.fn('orderByKey');
const orderByValue = firebaseDatabaseSdk.fn('orderByValue');
const orderByChild = firebaseDatabaseSdk.fn('orderByChild');
const equalTo = firebaseDatabaseSdk.fn('equalTo');
const startAt = firebaseDatabaseSdk.fn('startAt');
const endAt = firebaseDatabaseSdk.fn('endAt');
const limitToFirst = firebaseDatabaseSdk.fn('limitToFirst');
const limitToLast = firebaseDatabaseSdk.fn('limitToLast');
const onAuthStateChanged = firebaseAuthSdk.fn('onAuthStateChanged');
const loadSdk = () => loadFirebase(firebaseDatabaseSdk);

const getDb = (): Database => getFirebaseDatabase();

const handleError = (action: string, error: unknown, exception: boolean) => {
    const message = `Error during ${action}: ${String(error)}`;
    if (exception) throw new Error(message);
    console.error(message);
};

const omitWhereEntry = (where: WhereClause | undefined, field: string): WhereClause | undefined => {
    if (!where || !(field in where)) return where;
    const { [field]: _omitted, ...rest } = where;
    return Object.keys(rest).length ? rest : undefined;
};

const normalizeCondition = (raw: Condition | OperatorValue): { condition: Condition; clientCondition?: Condition } => {
    const condition = typeof raw === "object" && raw !== null && !Array.isArray(raw)
        ? raw as Condition
        : Array.isArray(raw)
            ? { in: raw }
            : { eq: raw };

    let clientCondition: Condition | undefined;
    if (condition.gt !== undefined) clientCondition = { ...clientCondition, gt: condition.gt };
    if (condition.lt !== undefined) clientCondition = { ...clientCondition, lt: condition.lt };
    if (condition.in !== undefined) clientCondition = { ...clientCondition, in: condition.in };
    if (condition.nin !== undefined) clientCondition = { ...clientCondition, nin: condition.nin };
    // CR-129 — the Realtime Database has no filter on lists: `contains` / `containsAny` run in the browser.
    if (condition.contains !== undefined) clientCondition = { ...clientCondition, contains: condition.contains };
    if (condition.containsAny !== undefined) clientCondition = { ...clientCondition, containsAny: condition.containsAny };

    return { condition, clientCondition };
};

const getOrderedRef = (dbRef: DatabaseReference, field: string): Query => {
    switch (field) {
        case SYSTEM_FIELDS.key:   return query(dbRef, orderByKey());
        case SYSTEM_FIELDS.value: return query(dbRef, orderByValue());
        default:                   return query(dbRef, orderByChild(field));
    }
};

/**
 * CR-129 — the plan with its `limit`: on the server (`limitToFirst`, or `limitToLast` for a descending order)
 * only when no condition is left for the browser, else the browser applies it after filtering.
 */
const buildLimitedQueryPlan = (dbRef: DatabaseReference, order?: OrderClause, where?: WhereClause, limit?: number): QueryPlan => {
    const plan = buildQueryPlan(dbRef, order, where);
    if (typeof limit !== "number" || !Number.isFinite(limit) || limit < 0) return plan;
    if (plan.clientWhere && Object.keys(plan.clientWhere).length) return plan;
    const [firstOrder] = Object.entries(order || {}) as OrderEntry[];
    const ordered = firstOrder ? plan.dbRef : query(plan.dbRef, orderByKey());
    const limited = firstOrder?.[1] === "desc" ? limitToLast(Math.floor(limit)) : limitToFirst(Math.floor(limit));
    return { ...plan, dbRef: query(ordered, limited) };
};

const buildQueryPlan = (dbRef: DatabaseReference, order?: OrderClause, where?: WhereClause): QueryPlan => {
    const [firstOrder] = Object.entries(order || {}) as OrderEntry[];
    if (!firstOrder) return { dbRef, clientWhere: where };

    const [field] = firstOrder;
    let qRef: Query = getOrderedRef(dbRef, field);
    const raw = where?.[field];
    if (raw == null) return { dbRef: qRef, clientWhere: where };

    const { condition, clientCondition } = normalizeCondition(raw);

    switch (true) {
        case condition.eq !== undefined:
            return { dbRef: query(qRef, equalTo(condition.eq as any)), clientWhere: omitWhereEntry(where, field) };
        case condition.gte !== undefined && condition.lte !== undefined:
            qRef = query(qRef, startAt(condition.gte as any), endAt(condition.lte as any)); break;
        case condition.gte !== undefined && condition.lt !== undefined:
            qRef = query(qRef, startAt(condition.gte as any), endAt(condition.lt as any)); break;
        case condition.gt !== undefined && condition.lte !== undefined:
            qRef = query(qRef, startAt(condition.gt as any), endAt(condition.lte as any)); break;
        case condition.gt !== undefined && condition.lt !== undefined:
            qRef = query(qRef, startAt(condition.gt as any), endAt(condition.lt as any)); break;
        case condition.gte !== undefined:
            qRef = query(qRef, startAt(condition.gte as any)); break;
        case condition.gt !== undefined:
            qRef = query(qRef, startAt(condition.gt as any)); break;
        case condition.lte !== undefined:
            qRef = query(qRef, endAt(condition.lte as any)); break;
        case condition.lt !== undefined:
            qRef = query(qRef, endAt(condition.lt as any)); break;
    }

    return {
        dbRef: qRef,
        clientWhere: clientCondition
            ? { ...(omitWhereEntry(where, field) || {}), [field]: clientCondition }
            : omitWhereEntry(where, field)
    };
};

const getEntryValue = (value: unknown, field: string): unknown => {
    if (!field) return value;
    const parts = field.split(".");
    let current: unknown = value;
    for (const part of parts) {
        if (current == null) return undefined;
        current = (current as Record<string, unknown>)[part];
    }
    return current;
};

const compareValues = (left: unknown, right: unknown): number => {
    if (left === right) return 0;
    if (left == null) return -1;
    if (right == null) return 1;
    if (typeof left === "number" && typeof right === "number") return left - right;
    if (typeof left === "boolean" && typeof right === "boolean") return Number(left) - Number(right);
    return globalThis.String(left).localeCompare(globalThis.String(right), undefined, { numeric: true, sensitivity: "base" });
};

const processRecordObject = (val: RecordObject, where?: WhereClause, order?: OrderClause, limit?: number): RecordObject => {
    const [firstOrder, ...restOrder] = Object.entries(order || {}) as OrderEntry[];
    const whereEntries = Object.entries(where || {}) as WhereEntry[];
    let filtered = Object.entries(val);

    if (whereEntries.length) {
        filtered = filtered.filter(([, value]) =>
            whereEntries.every(([field, raw]) => matchCondition(getEntryValue(value, field), raw))
        );
    }

    if (firstOrder) {
        const orderEntries = [firstOrder, ...restOrder];
        filtered.sort((left, right) => {
            for (const [field, dir] of orderEntries) {
                const result = compareValues(getEntryValue(left[1], field), getEntryValue(right[1], field));
                if (result) return dir === "desc" ? -result : result;
            }
            return 0;
        });
    }

    return Object.fromEntries(applyLimit(filtered, limit));
};

const buildShallowURL = async (path: string): Promise<string> => {
    if (!isFirebaseLoaded(firebaseDatabaseSdk)) await loadSdk();
    const auth = getSafeAuth();
    const token = await auth?.currentUser?.getIdToken().catch(() => undefined);
    const u = new URL(`${path}.json`, ref(getDb()).toString());
    u.searchParams.set("shallow", "true");
    if (token) u.searchParams.set("auth", token);
    return u.toString();
};

export class FirebaseDataProvider implements DataProviderAdapter {
    private static listenerRegistered = false;

    constructor() {
        if (!FirebaseDataProvider.listenerRegistered && typeof onConfigChange === 'function') {
            FirebaseDataProvider.listenerRegistered = true;
            onConfigChange((newConfig: Config) => {
                if (newConfig.firebase) init(newConfig.firebase);
            });
        }
    }

    getConfigurationState(): ProviderConfigurationState {
        return getFirebaseConfigurationState();
    }

    isConfigured(): boolean {
        return this.getConfigurationState().configured;
    }

    readShallow = async (path: string, exception = false): Promise<string[]> => {
        try {
            const url = await buildShallowURL(path);
            const res = await fetch(url);
            if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
            const json = await res.json();
            return json ? Object.keys(json) : [];
        } catch (error) {
            handleError(`reading SHALLOW data in Firebase for ${path}`, error, exception);
            return [];
        }
    };

    read = async (path: string, { where, order, limit, toArray = false, exception = false }: ReadOptions = {}): Promise<any> => {
        try {
            if (!isFirebaseLoaded(firebaseDatabaseSdk)) await loadSdk();
            const { dbRef, clientWhere } = buildLimitedQueryPlan(ref(getDb(), path), order, where, limit);
            const snapshot = await get(dbRef);
            if (snapshot.exists()) {
                consoleLog(`Info: Data found in Firebase for path ${path}`);
                const processed = processRecordObject(snapshot.val(), clientWhere, order, limit);
                return toArray ? Object.values(processed) : processed;
            } else if (exception) {
                handleError(`Data not found in Firebase for path ${path}`, null, exception);
            }
        } catch (error) {
            handleError(`reading data in Firebase for ${path}`, error, exception);
        }
    };

    update = async (path: string, data: object, exception = false): Promise<void> => {
        try {
            if (!isFirebaseLoaded(firebaseDatabaseSdk)) await loadSdk();
            await fbUpdate(ref(getDb(), path), data);
            consoleLog(`Data successfully merged in Firebase for ${path}`);
        } catch (error) {
            handleError(`updating data in Firebase for ${path}`, error, exception);
        }
    };

    set = async (path: string, data: object, exception = false): Promise<void> => {
        try {
            if (!isFirebaseLoaded(firebaseDatabaseSdk)) await loadSdk();
            await fbSet(ref(getDb(), path), data);
            consoleLog(`Data successfully updated in Firebase for ${path}`);
        } catch (error) {
            handleError(`updating data in Firebase for ${path}`, error, exception);
        }
    };

    setChunks = async (
        path: string,
        data: object,
        { chunkSize = 1000, purge = false, onProgress }: SetChunksOptions = {}
    ): Promise<void> => {
        try {
            if (!isFirebaseLoaded(firebaseDatabaseSdk)) await loadSdk();
            const dbRef = ref(getDb(), path);
            if (purge) {
                await fbRemove(dbRef);
                onProgress?.(0, 0, `Purging existing data at ${path}`);
            }
            const entries = Object.entries(cleanRecord(data as RecordProps));
            const totalChunks = Math.ceil(entries.length / chunkSize);
            for (let i = 0; i < entries.length; i += chunkSize) {
                const chunk = Object.fromEntries(entries.slice(i, i + chunkSize));
                await fbUpdate(dbRef, chunk);
                const done = Math.floor(i / chunkSize) + 1;
                onProgress?.(done, totalChunks, `Saving chunk ${done}/${totalChunks}`);
            }
        } catch (error) {
            handleError(`setting data in chunks in Firebase for ${path}`, error, false);
        }
    };

    remove = async (path: string, exception = false): Promise<void> => {
        try {
            if (!isFirebaseLoaded(firebaseDatabaseSdk)) await loadSdk();
            await fbRemove(ref(getDb(), path));
            consoleLog(`Data successfully removed from Firebase for ${path}`);
        } catch (error) {
            handleError(`removing data from Firebase for ${path}`, error, exception);
        }
    };

    count = async (path: string): Promise<number> => {
        const keys = await this.readShallow(path);
        return keys.length;
    };

    subscribe = <T extends RecordProps = RecordProps>(
        path: string | undefined,
        setRecords: (records: T[]) => void,
        options: DatabaseOptions = {}
    ): (() => void) => {
        const { where, order, limit, fieldMap, onLoad } = options;
        if (!path) return () => undefined;
        const onFailure = (err: unknown) => { reportSubscribeError(options, err, path); };

        const fetchData = (): (() => void) => {
            const { dbRef, clientWhere } = buildLimitedQueryPlan(ref(getDb(), path), order, where, limit);

            const onValueChange = (snapshot: DataSnapshot) => {
                const val: RecordObject = snapshot.val();
                if (!val) { setRecords([]); return; }

                const data = onLoad
                    ? onLoad(processRecordObject(val, clientWhere, order, limit))
                    : processRecordObject(val, clientWhere, order, limit);

                const entries = Object.entries(data);

                if (!fieldMap) {
                    const records = entries.map(([key, value], index) => (
                        typeof value === "object" && value !== null
                            ? { _index: index, [RECORD_KEY]: key, ...value }
                            : { _index: index, [RECORD_KEY]: key, [SYSTEM_FIELDS.value]: value }
                    )) as T[];
                    setRecords(records);
                    return;
                }

                const mapKeys = Object.keys(fieldMap);
                const records = entries.map(([key, value], index) => {
                    const source = typeof value === "object" && value !== null
                        ? { [SYSTEM_FIELDS.key]: key, ...value }
                        : { [SYSTEM_FIELDS.key]: key, [SYSTEM_FIELDS.value]: value };
                    const mapped: Record<string, any> = {}; // CR-042: accumulates Firebase-typed values, returned as RecordProps via cast
                    for (const prop of mapKeys) {
                        const field = fieldMap[prop];
                        mapped[prop] = field.includes("{")
                            ? converter.parse(source, field)
                            : field === SYSTEM_FIELDS.key ? key
                            : field === SYSTEM_FIELDS.value ? value
                            : source[field];
                    }
                    return { [RECORD_KEY]: key, _index: index, ...mapped } as T;
                });
                setRecords(records);
            };

            return onValue(dbRef, onValueChange, onFailure);
        };

        let active = true;
        let unsubscribeData: (() => void) | undefined;
        let unsubscribeAuth: (() => void) | undefined;
        const start = () => {
            const auth = getSafeAuth();
            if (!auth) return;
            unsubscribeAuth = onAuthStateChanged(auth, (user) => {
                unsubscribeData?.();
                unsubscribeData = undefined;
                if (!user) {
                    setRecords([]);
                } else {
                    try { unsubscribeData = fetchData(); } catch (err) { onFailure(err); }
                }
            });
        };
        // CR-154 — synchronous as before once the SDK is loaded; the first use waits for it.
        if (isFirebaseLoaded(firebaseDatabaseSdk)) start();
        else loadSdk().then(() => { if (active) start(); }, onFailure);

        return () => {
            active = false;
            unsubscribeData?.();
            unsubscribeAuth?.();
        };
    };
}

// Legacy default export - kept for backward compatibility with direct imports.
// Prefer using the manifest registry via <App providers={{ services: { data: 'dbRealtime' } }} />.
export default new FirebaseDataProvider();
