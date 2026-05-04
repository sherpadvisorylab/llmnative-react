import { useEffect, useMemo } from "react";
import firebase from "firebase/compat/app";
import 'firebase/compat/database';
import { onAuthStateChanged } from "firebase/auth";
import { converter } from "../../libs/converter";
import { consoleLog } from "../../constant";
import { Config, onConfigChange } from "../../Config";
import init, { getSafeAuth } from "../../integrations/google/firebase";
import { cleanRecord } from "../../libs/utils";
import { SetMessagePayload } from "../../components/ui/Buttons";
import {
    DataProvider,
    DatabaseOptions,
    ReadOptions,
    SetChunksOptions,
    RecordProps,
    RecordArray,
    WhereClause,
    OrderClause,
    Condition,
    OperatorValue,
} from "./DataProvider";

type RecordObject = Record<string, Record<string, any>>;
type WhereEntry = [string, Condition | OperatorValue];
type OrderEntry = [string, "asc" | "desc"];
type QueryPlan = {
    dbRef: firebase.database.Query;
    clientWhere?: WhereClause;
};

export const SYSTEM_FIELDS = {
    key: "@key",
    value: "@value",
};

let databaseInstance: firebase.database.Database;
onConfigChange((newConfig: Config) => {
    init(newConfig.firebase);
});

const getDatabase = (): firebase.database.Database => {
    if (!databaseInstance && firebase.apps.length) {
        databaseInstance = firebase.app().database();
    }
    return databaseInstance;
};

const handleError = (action: string, error: any, exception: boolean) => {
    const message = `Error during ${action}: ${error}`;
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

    return { condition, clientCondition };
};

const getOrderedRef = (ref: firebase.database.Reference, field: string): firebase.database.Query => {
    switch (field) {
        case SYSTEM_FIELDS.key: return ref.orderByKey();
        case SYSTEM_FIELDS.value: return ref.orderByValue();
        default: return ref.orderByChild(field);
    }
};

const buildQueryPlan = (ref: firebase.database.Reference, order?: OrderClause, where?: WhereClause): QueryPlan => {
    const [firstOrder] = Object.entries(order || {}) as OrderEntry[];
    if (!firstOrder) return { dbRef: ref, clientWhere: where };

    const [field] = firstOrder;
    let dbRef = getOrderedRef(ref, field);
    const raw = where?.[field];
    if (raw == null) return { dbRef, clientWhere: where };

    const { condition, clientCondition } = normalizeCondition(raw);

    switch (true) {
        case condition.eq !== undefined:
            return { dbRef: dbRef.equalTo(condition.eq as any), clientWhere: omitWhereEntry(where, field) };
        case condition.gte !== undefined && condition.lte !== undefined:
            dbRef = dbRef.startAt(condition.gte as any).endAt(condition.lte as any); break;
        case condition.gte !== undefined && condition.lt !== undefined:
            dbRef = dbRef.startAt(condition.gte as any).endAt(condition.lt as any); break;
        case condition.gt !== undefined && condition.lte !== undefined:
            dbRef = dbRef.startAt(condition.gt as any).endAt(condition.lte as any); break;
        case condition.gt !== undefined && condition.lt !== undefined:
            dbRef = dbRef.startAt(condition.gt as any).endAt(condition.lt as any); break;
        case condition.gte !== undefined:
            dbRef = dbRef.startAt(condition.gte as any); break;
        case condition.gt !== undefined:
            dbRef = dbRef.startAt(condition.gt as any); break;
        case condition.lte !== undefined:
            dbRef = dbRef.endAt(condition.lte as any); break;
        case condition.lt !== undefined:
            dbRef = dbRef.endAt(condition.lt as any); break;
    }

    return {
        dbRef,
        clientWhere: clientCondition
            ? { ...(omitWhereEntry(where, field) || {}), [field]: clientCondition }
            : omitWhereEntry(where, field)
    };
};

const getEntryValue = (value: any, field: string) => {
    if (!field) return value;
    const parts = field.split(".");
    let current = value;
    for (const part of parts) {
        if (current == null) return undefined;
        current = current[part];
    }
    return current;
};

const compareValues = (left: any, right: any): number => {
    if (left === right) return 0;
    if (left == null) return -1;
    if (right == null) return 1;
    if (typeof left === "number" && typeof right === "number") return left - right;
    if (typeof left === "boolean" && typeof right === "boolean") return Number(left) - Number(right);
    return globalThis.String(left).localeCompare(globalThis.String(right), undefined, { numeric: true, sensitivity: "base" });
};

const matchWhere = (value: any, raw: Condition | OperatorValue): boolean => {
    const condition = typeof raw === "object" && raw !== null && !Array.isArray(raw) ? raw as Condition : { eq: raw };
    for (const [op, target] of Object.entries(condition as Record<string, OperatorValue>)) {
        switch (op) {
            case "eq": if (value !== target) return false; break;
            case "gt": if (!(value > (target as any))) return false; break;
            case "gte": if (!(value >= (target as any))) return false; break;
            case "lt": if (!(value < (target as any))) return false; break;
            case "lte": if (!(value <= (target as any))) return false; break;
            case "in": if (!Array.isArray(target) || !(target as any[]).includes(value)) return false; break;
            case "nin": if (Array.isArray(target) && (target as any[]).includes(value)) return false; break;
            default: return false;
        }
    }
    return true;
};

const processRecordObject = (val: RecordObject, where?: WhereClause, order?: OrderClause): RecordObject => {
    const [firstOrder, ...restOrder] = Object.entries(order || {}) as OrderEntry[];
    const whereEntries = Object.entries(where || {}) as WhereEntry[];
    let filtered = Object.entries(val);

    if (whereEntries.length) {
        filtered = filtered.filter(([, value]) =>
            whereEntries.every(([field, raw]) => matchWhere(getEntryValue(value, field), raw))
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

    return Object.fromEntries(filtered);
};

const buildShallowURL = (path: string, auth?: string): string => {
    const u = new URL(`${path}.json`, getDatabase().ref().toString());
    u.searchParams.set("shallow", "true");
    if (auth) u.searchParams.set("auth", auth);
    return u.toString();
};

export class FirebaseDataProvider implements DataProvider {
    readShallow = async (path: string, exception = false): Promise<string[]> => {
        try {
            const auth = getSafeAuth();
            if (!auth) return [];
            const token = await auth.currentUser?.getIdToken().catch(() => undefined);
            const url = buildShallowURL(path, token);
            const res = await fetch(url);
            if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
            const json = await res.json();
            return json ? Object.keys(json) : [];
        } catch (error) {
            handleError(`reading SHALLOW data in Firebase for ${path}`, error, exception);
            return [];
        }
    };

    read = async (path: string, { where, order, toArray = false, exception = false }: ReadOptions = {}): Promise<any> => {
        const { dbRef, clientWhere } = buildQueryPlan(getDatabase().ref(path), order, where);
        try {
            const snapshot = await dbRef.get();
            if (snapshot.exists()) {
                consoleLog(`Info: Data found in Firebase for path ${path}`);
                const processed = processRecordObject(snapshot.val(), clientWhere, order);
                return toArray ? Object.values(processed) : processed;
            } else if (exception) {
                handleError(`Data not found in Firebase for path ${path}`, null, exception);
            }
        } catch (error) {
            handleError(`reading data in Firebase for ${path}`, error, exception);
        }
    };

    update = async (path: string, data: any, exception = false): Promise<void> => {
        try {
            await getDatabase().ref(path).update(data);
            consoleLog(`Data successfully merged in Firebase for ${path}`);
        } catch (error) {
            handleError(`updating data in Firebase for ${path}`, error, exception);
        }
    };

    set = async (path: string, data: any, exception = false): Promise<void> => {
        try {
            await getDatabase().ref(path).set(data);
            consoleLog(`Data successfully updated in Firebase for ${path}`);
        } catch (error) {
            handleError(`updating data in Firebase for ${path}`, error, exception);
        }
    };

    setChunks = async (
        path: string,
        data: any,
        { chunkSize = 1000, purge = false, onProgress }: SetChunksOptions = {}
    ): Promise<void> => {
        const dbRef = getDatabase().ref(path);
        try {
            if (purge) {
                await dbRef.remove();
                onProgress?.(0, 0, `Purging existing data at ${path}`);
            }
            const entries = Object.entries(cleanRecord(data));
            const totalChunks = Math.ceil(entries.length / chunkSize);
            for (let i = 0; i < entries.length; i += chunkSize) {
                const chunk = Object.fromEntries(entries.slice(i, i + chunkSize));
                await dbRef.update(chunk);
                const done = Math.floor(i / chunkSize) + 1;
                onProgress?.(done, totalChunks, `Saving chunk ${done}/${totalChunks}`);
            }
        } catch (error) {
            handleError(`setting data in chunks in Firebase for ${path}`, error, false);
        }
    };

    remove = async (path: string, exception = false): Promise<void> => {
        try {
            await getDatabase().ref(path).remove();
            consoleLog(`Data successfully removed from Firebase for ${path}`);
        } catch (error) {
            handleError(`removing data from Firebase for ${path}`, error, exception);
        }
    };

    count = async (path: string): Promise<number> => {
        const keys = await this.readShallow(path);
        return keys.length;
    };

    useListener = <T extends RecordProps = RecordProps>(
        path: string | undefined,
        setRecords: (records: T[]) => void,
        { where, order, fieldMap, onLoad }: DatabaseOptions = {}
    ): void => {
        const auth = useMemo(() => getSafeAuth(), []);
        if (!auth) return;

        useEffect(() => {
            if (!path) return;

            const fetchData = () => {
                const { dbRef, clientWhere } = buildQueryPlan(getDatabase().ref(path), order, where);

                const onValueChange = (snapshot: firebase.database.DataSnapshot) => {
                    const val: RecordObject = snapshot.val();
                    if (!val) { setRecords([]); return; }

                    const data = onLoad
                        ? onLoad(processRecordObject(val, clientWhere, order))
                        : processRecordObject(val, clientWhere, order);

                    const entries = Object.entries(data);

                    if (!fieldMap) {
                        const records = entries.map(([key, value], index) => (
                            typeof value === "object" && value !== null
                                ? { _index: index, _key: key, ...value }
                                : { _index: index, _key: key, [SYSTEM_FIELDS.value]: value }
                        )) as T[];
                        setRecords(records);
                        return;
                    }

                    const mapKeys = Object.keys(fieldMap);
                    const records = entries.map(([key, value], index) => {
                        const source = typeof value === "object" && value !== null
                            ? { [SYSTEM_FIELDS.key]: key, ...value }
                            : { [SYSTEM_FIELDS.key]: key, [SYSTEM_FIELDS.value]: value };
                        const mapped: Record<string, any> = {};
                        for (const prop of mapKeys) {
                            const field = fieldMap[prop];
                            mapped[prop] = field.includes("{")
                                ? converter.parse(source, field)
                                : field === SYSTEM_FIELDS.key ? key
                                : field === SYSTEM_FIELDS.value ? value
                                : source[field];
                        }
                        return { _key: key, _index: index, ...mapped } as T;
                    });
                    setRecords(records);
                };

                dbRef.on("value", onValueChange);
                return () => { dbRef.off("value", onValueChange); };
            };

            let unsubscribeData: (() => void) | undefined;
            const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
                unsubscribeData?.();
                unsubscribeData = undefined;
                if (!user) {
                    setRecords([]);
                } else {
                    unsubscribeData = fetchData();
                }
            });

            return () => {
                unsubscribeData?.();
                unsubscribeAuth();
            };
        }, [path, setRecords, fieldMap, onLoad, order, where]);
    };
}

export default new FirebaseDataProvider();
