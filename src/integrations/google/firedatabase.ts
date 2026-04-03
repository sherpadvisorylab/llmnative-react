import {useEffect, useMemo} from "react";
import firebase from "firebase/compat/app";
import 'firebase/compat/database';
import {onAuthStateChanged } from "firebase/auth";
import { converter } from "../../libs/converter";
import {consoleLog} from "../../constant";
import {Config, onConfigChange} from "../../Config";
import init from "./firebase";
import { getSafeAuth } from "./firebase";
import { cleanRecord } from "../../libs/utils";
import { SetMessagePayload } from "../../components/ui/Buttons";

type FirebasePrimitive = string | number | boolean | null;
type FirebaseAny = FirebasePrimitive | object | any[];
type FirebaseValue<T> =
    | T                     // when toArray = false
    | T[]                   // homogeneous array of T
    | (FirebaseAny | T)[]   // heterogeneous array
    | string[]              // when shallow = true
    | undefined;            // no value

type Operator = "eq" | "lt" | "lte" | "gt" | "gte" | "nin" | "in";
type ScalarValue = string | number | boolean | null;
type RangeValue = string | number | boolean;
type ListValue = string[] | number[];
type OperatorValue = ScalarValue | ListValue;
type Condition = {
    eq?: ScalarValue;
    lt?: RangeValue;
    lte?: RangeValue;
    gt?: RangeValue;
    gte?: RangeValue;
    nin?: ListValue;
    in?: ListValue;
};
type WhereClause = {
    [field: string]: Condition | OperatorValue;
};
type OrderDir = "asc" | "desc";
type OrderClause = {
    [field: string]: OrderDir;
};
type WhereEntry = [string, Condition | OperatorValue];
type OrderEntry = [string, OrderDir];
type QueryPlan = {
    dbRef: firebase.database.Query;
    clientWhere?: WhereClause;
};

type FieldMap = Record<string, any>;
type RecordObject = Record<string, FieldMap>;
export type RecordProps = FieldMap & { _key?: string, _index?: number };
export type RecordArray = Array<RecordProps>;

type RecordFN<T extends RecordProps = RecordProps> = (records: T[]) => void;
export interface DatabaseOptions {
    where?: WhereClause;
    order?: OrderClause;
    fieldMap?: Record<string, string>;
    onLoad?: (data: RecordObject) =>RecordObject;
}

type SetDatabaseMessage = SetMessagePayload & { chunkDone?: number; totalChunks?: number };

let databaseInstance: firebase.database.Database;
onConfigChange((newConfig: Config) => {
    init(newConfig.firebase);
});

export const SYSTEM_FIELDS = {
    key: "@key",
    value: "@value",
  };    

const handleError = (action: string, error: any, exception: boolean) => {
    const message = `Error during ${action}: ${error}`;
    if (exception) {
        throw new Error(message);
    }
    console.error(message);
};

const getDatabase = (): firebase.database.Database => {
    if (!databaseInstance && firebase.apps.length) {
        databaseInstance = firebase.app().database();
    }
    return databaseInstance;
};

const omitWhereEntry = (where: WhereClause | undefined, field: string): WhereClause | undefined => {
    if (!where || !(field in where)) return where;
    const { [field]: _omitted, ...rest } = where;
    return Object.keys(rest).length ? rest : undefined;
};

const normalizeCondition = (raw: Condition | OperatorValue): { condition: Condition; clientCondition?: Condition } => {
    const condition = typeof raw === "object" && raw !== null && !Array.isArray(raw)
        ? raw
        : Array.isArray(raw)
            ? { in: raw }
            : { eq: raw };

    let clientCondition: Condition | undefined;
    if (condition.gt !== undefined) clientCondition = { ...clientCondition, gt: condition.gt };
    if (condition.lt !== undefined) clientCondition = { ...clientCondition, lt: condition.lt };
    if (condition.in !== undefined) clientCondition = { ...clientCondition, in: condition.in };
    if (condition.nin !== undefined) clientCondition = { ...clientCondition, nin: condition.nin };

    return {
        condition,
        clientCondition
    };
};

const getOrderedRef = (
    ref: firebase.database.Reference,
    field: string
): firebase.database.Query => {
    switch (field) {
        case SYSTEM_FIELDS.key:
            return ref.orderByKey();
        case SYSTEM_FIELDS.value:
            return ref.orderByValue();
        default:
            return ref.orderByChild(field);
    }
};

const buildQueryPlan = (
    ref: firebase.database.Reference,
    order?: OrderClause,
    where?: WhereClause
): QueryPlan => {
    const [firstOrder] = Object.entries(order || {}) as OrderEntry[];
    if (!firstOrder) return { dbRef: ref, clientWhere: where };

    const [field] = firstOrder;
    let dbRef = getOrderedRef(ref, field);
    const raw = where?.[field];
    if (raw == null) {
        return {
            dbRef,
            clientWhere: where
        };
    }

    const { condition, clientCondition } = normalizeCondition(raw);

    switch (true) {
        case condition.eq !== undefined:
            return {
                dbRef: dbRef.equalTo(condition.eq),
                clientWhere: omitWhereEntry(where, field)
            };
        case condition.gte !== undefined && condition.lte !== undefined:
            dbRef = dbRef.startAt(condition.gte).endAt(condition.lte);
            break;
        case condition.gte !== undefined && condition.lt !== undefined:
            dbRef = dbRef.startAt(condition.gte).endAt(condition.lt);
            break;
        case condition.gt !== undefined && condition.lte !== undefined:
            dbRef = dbRef.startAt(condition.gt).endAt(condition.lte);
            break;
        case condition.gt !== undefined && condition.lt !== undefined:
            dbRef = dbRef.startAt(condition.gt).endAt(condition.lt);
            break;
        case condition.gte !== undefined:
            dbRef = dbRef.startAt(condition.gte);
            break;
        case condition.gt !== undefined:
            dbRef = dbRef.startAt(condition.gt);
            break;
        case condition.lte !== undefined:
            dbRef = dbRef.endAt(condition.lte);
            break;
        case condition.lt !== undefined:
            dbRef = dbRef.endAt(condition.lt);
            break;
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

    for (let i = 0; i < parts.length; i++) {
        if (current == null) return undefined;
        current = current[parts[i]];
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
    const condition = typeof raw === "object" && raw !== null && !Array.isArray(raw) ? raw : { eq: raw };

    for (const [op, target] of Object.entries(condition as Record<string, OperatorValue>)) {
        switch (op as Operator) {
            case "eq":
                if (value !== target) return false;
                break;
            case "gt":
                if (!(value > (target as RangeValue))) return false;
                break;
            case "gte":
                if (!(value >= (target as RangeValue))) return false;
                break;
            case "lt":
                if (!(value < (target as RangeValue))) return false;
                break;
            case "lte":
                if (!(value <= (target as RangeValue))) return false;
                break;
            case "in":
                if (!Array.isArray(target) || !(target as Array<string | number>).includes(value)) return false;
                break;
            case "nin":
                if (Array.isArray(target) && (target as Array<string | number>).includes(value)) return false;
                break;
            default:
                return false;
        }
    }

    return true;
};

const processRecordObject = (
    val: RecordObject,
    where?: WhereClause,
    order?: OrderClause
): RecordObject => {
    const [firstOrder, ...restOrder] = Object.entries(order || {}) as OrderEntry[];
    const whereEntries = Object.entries(where || {}) as WhereEntry[];
    const entries = Object.entries(val);
    let filtered = entries;

    if (whereEntries.length) {
        filtered = filtered.filter(([, value]) => {
            for (let i = 0; i < whereEntries.length; i++) {
                const [field, raw] = whereEntries[i];
                if (!matchWhere(getEntryValue(value, field), raw)) return false;
            }
            return true;
        });
    }

    if (firstOrder) {
        const orderEntries = [firstOrder, ...restOrder];
        filtered.sort((left, right) => {
            for (let i = 0; i < orderEntries.length; i++) {
                const [field, dir] = orderEntries[i];
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

const db = {
    readShallow: async (path: string, exception: boolean = false): Promise<string[]> => {
        try {
            const auth = getSafeAuth();
            if (!auth) return [];
            const token = await auth.currentUser?.getIdToken().catch(() => undefined);
            const url = buildShallowURL(path, token);

            const res = await fetch(url);
            if (!res.ok) {
                throw new Error(`${res.status} ${res.statusText}`);
            }
            const json = await res.json();
            return json ? Object.keys(json) : [];
        } catch (error) {
            handleError(`reading SHALLOW data in Firebase for ${path}`, error, exception);
            return [];
        }
    },
    read: async <T = any>(
        path: string,
        {
            where       = undefined,
            order       = undefined,
            toArray     = false,
            exception   = false
        }: {
            where?: WhereClause;
            order?: OrderClause;
            toArray?: boolean;
            exception?: boolean;
        } = {}
    ): Promise<FirebaseValue<T>> => {
        const { dbRef, clientWhere } = buildQueryPlan(getDatabase().ref(path), order, where);
        try {
            const snapshot = await dbRef.get();
            if (snapshot.exists()) {
                consoleLog(`Info: Data found in Firebase for path ${path}`);
                const processed = processRecordObject(snapshot.val(), clientWhere, order);

                return (toArray
                        ? Object.values(processed)
                        : processed
                ) as FirebaseValue<T>;
            } else if (exception) {
                handleError(`Data not found in Firebase for path ${path}`, null, exception);
            }
        } catch (error) {
            handleError(`reading data in Firebase for ${path}`, error, exception);
        }
    },
    update: async (path: string, data: any, exception: boolean = false): Promise<void> => {
        const dbRef = getDatabase().ref(path);
        try {
            await dbRef.update(data);
            consoleLog(`Data successfully merged in Firebase for ${path}`);
        } catch (error) {
            handleError(`updating data in Firebase for ${path}`, error, exception);
        }
    },
    set: async (path: string, data: any, exception: boolean = false): Promise<void> => {
        const dbRef = getDatabase().ref(path);
        try {
            await dbRef.set(data);
            consoleLog(`Data successfully updated in Firebase for ${path}`);
        } catch (error) {
            handleError(`updating data in Firebase for ${path}`, error, exception);
        }
    },
    setChunks: async (
        path: string,
        data: any,
        chunkSize: number = 1000,
        purge: boolean = false,
        setMessage?: (p: SetDatabaseMessage) => void,
        exception: boolean = false
      ): Promise<void> => {
        const dbRef = getDatabase().ref(path);
        try {
            if (purge) {
                await dbRef.remove();
                setMessage?.({message: `Purging existing data at ${path}`});
                consoleLog(`Purged existing data at ${path}`);
            }
            
            const entries = Object.entries(cleanRecord(data));
            const totalChunks = Math.ceil(entries.length / chunkSize); 
            for (let i = 0; i < entries.length; i += chunkSize) {
                const chunk = entries.slice(i, i + chunkSize);
                const chunkData = Object.fromEntries(chunk);
                const chunkNumber = Math.floor(i / chunkSize);
        
                await dbRef.update(chunkData);

                const chunkDone = chunkNumber + 1;
                setMessage?.({message: `Saving chunk ${chunkDone}/${totalChunks}`, chunkDone: chunkDone, totalChunks: totalChunks});
                consoleLog(`${path}: Chunk ${chunkDone}/${totalChunks} saved (${chunkSize} items)`);
            }
            consoleLog(`Data successfully set in chunks in Firebase for ${path}`);
        } catch (error) {
            handleError(`setting data in chunks in Firebase for ${path}`, error, exception);
        }
    },
    remove: async (path: string, exception: boolean = false): Promise<void> => {
        const dbRef = getDatabase().ref(path);
        try {
            await dbRef.remove();
            consoleLog(`Data successfully removed from Firebase for ${path}`);
        } catch (error) {
            handleError(`removing data from Firebase for ${path}`, error, exception);
        }
    },
    useListener: <T extends RecordProps = RecordProps>(
        path: string | undefined,
        setRecords: RecordFN<T>,
        {
            where       = undefined,
            order       = undefined,
            fieldMap    = undefined,
            onLoad      = undefined
        }: DatabaseOptions = {}
    ) => {
        const auth = useMemo(() => getSafeAuth(), []);
        if (!auth) return;

        useEffect(() => {
            if (!path) return;

            const fetchData = () => {
                const { dbRef, clientWhere } = buildQueryPlan(getDatabase().ref(path), order, where);

                const onValueChange = (snapshot: firebase.database.DataSnapshot) => {
                    const val: RecordObject = snapshot.val();
                    console.log("firedatabase: loaded data");
                    if (!val) {
                        setRecords([]);
                        return;
                    }
                    const data = onLoad ? onLoad(processRecordObject(val, clientWhere, order)) : processRecordObject(val, clientWhere, order);

                    if (!fieldMap) {
                        const entries = Object.entries(data);
                        const records = new Array(entries.length) as T[];
                    
                        for (let index = 0; index < entries.length; index++) {
                            const [key, value] = entries[index];
                    
                            records[index] = (
                                typeof value === "object" && value !== null
                                    ? { _index: index, _key: key, ...value }
                                    : { _index: index, _key: key, [SYSTEM_FIELDS.value]: value }
                            ) as T
                        }
                    
                        console.log("firedatabase: set records simple");
                        setRecords(records);
                        return;
                    }
                    

                    const entries = Object.entries(data);
                    const mapKeys = Object.keys(fieldMap);
                    const records = new Array(entries.length) as T[];

                    for (let index = 0; index < entries.length; index++) {
                        const [key, value] = entries[index];
                        const mapped: FieldMap = {};
                        const source = typeof value === "object" && value !== null
                            ? { [SYSTEM_FIELDS.key]: key, ...value }
                            : { [SYSTEM_FIELDS.key]: key, [SYSTEM_FIELDS.value]: value };

                        for (let i = 0; i < mapKeys.length; i++) {
                            const prop = mapKeys[i];
                            const field = fieldMap[prop];

                            mapped[prop] = field.includes("{")
                                ? converter.parse(source, field)
                                : field === SYSTEM_FIELDS.key
                                    ? key
                                    : field === SYSTEM_FIELDS.value
                                        ? value
                                        : source[field];
                        }

                        records[index] = {
                            _key: key,
                            _index: index,
                            ...mapped
                        } as T;
                    }

                    console.log("firedatabase: set records mapped");
                    setRecords(records);
                };

                dbRef.on("value", onValueChange);

                return () => {
                    dbRef.off("value", onValueChange);
                };
            };

            let unsubscribeData: (() => void) | undefined;
            // Listener for authentication state changes
            const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
                unsubscribeData?.();
                unsubscribeData = undefined;
                if (!user) {
                    // If user is not authenticated, clear records
                    setRecords([]);
                } else {
                    // User is authenticated, fetch data (if needed)
                    unsubscribeData = fetchData();
                }
            });

            // Cleanup function to remove listeners
            return () => {
                unsubscribeData?.();
                unsubscribeAuth(); // Clean up authentication listener
            };
        }, [path, setRecords, fieldMap, onLoad, order, where]);
    }
};

export default db;
