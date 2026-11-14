// CR-129 — what every data provider shares to read the same way: the matching of a `where` in the browser
// (for what a database cannot filter itself), the `limit`, and the normalization of its errors.
import {
    DataProviderError,
    type Condition,
    type DataProviderErrorCode,
    type DatabaseOptions,
    type OperatorValue,
} from './DataProvider';

/** A `where` value as a `Condition`: a list is `in`, a scalar is `eq`. */
export function toCondition(raw: Condition | OperatorValue): Condition {
    if (raw !== null && typeof raw === 'object' && !Array.isArray(raw)) return raw as Condition;
    return Array.isArray(raw) ? { in: raw } : { eq: raw };
}

/** Whether `value` (the field of a record) satisfies a condition of `where`. Unknown operators never match. */
export function matchCondition(value: unknown, raw: Condition | OperatorValue): boolean {
    const condition = raw !== null && typeof raw === 'object' && !Array.isArray(raw) ? raw as Condition : { eq: raw };
    for (const [op, target] of Object.entries(condition as Record<string, unknown>)) {
        switch (op) {
            case 'eq': if (value !== target) return false; break;
            case 'gt': if (!((value as string | number) > (target as string | number))) return false; break;
            case 'gte': if (!((value as string | number) >= (target as string | number))) return false; break;
            case 'lt': if (!((value as string | number) < (target as string | number))) return false; break;
            case 'lte': if (!((value as string | number) <= (target as string | number))) return false; break;
            case 'in': if (!Array.isArray(target) || !(target as unknown[]).includes(value)) return false; break;
            case 'nin': if (Array.isArray(target) && (target as unknown[]).includes(value)) return false; break;
            case 'contains': if (!Array.isArray(value) || !value.includes(target)) return false; break;
            case 'containsAny':
                if (!Array.isArray(value) || !Array.isArray(target) || !(target as unknown[]).some((item) => value.includes(item))) return false;
                break;
            default: return false;
        }
    }
    return true;
}

/** The first `limit` items (all of them without a valid limit). */
export function applyLimit<T>(items: T[], limit?: number): T[] {
    return typeof limit === 'number' && Number.isFinite(limit) && limit >= 0 ? items.slice(0, Math.floor(limit)) : items;
}

const FIRESTORE_CODES: Record<string, DataProviderErrorCode> = {
    'permission-denied': 'permission-denied',
    unauthenticated: 'unauthenticated',
    'failed-precondition': 'invalid-query',
    'invalid-argument': 'invalid-query',
    unavailable: 'unavailable',
    'deadline-exceeded': 'unavailable',
    'resource-exhausted': 'unavailable',
};

const POSTGRES_CODES: Record<string, DataProviderErrorCode> = {
    '42501': 'permission-denied',
    PGRST301: 'unauthenticated',
    PGRST302: 'unauthenticated',
    '42P01': 'invalid-query',
    '42703': 'invalid-query',
    '22P02': 'invalid-query',
    PGRST100: 'invalid-query',
};

/** The code of an error of Firestore, the Realtime Database or Supabase, in the words of the contract. */
function codeOf(error: unknown): DataProviderErrorCode {
    const raw = String((error as { code?: unknown })?.code ?? '').replace(/^(firestore|database)\//, '');
    if (FIRESTORE_CODES[raw]) return FIRESTORE_CODES[raw];
    if (POSTGRES_CODES[raw]) return POSTGRES_CODES[raw];
    const text = `${raw} ${String((error as { message?: unknown })?.message ?? error ?? '')}`.toLowerCase();
    if (/permission[_ -]denied|insufficient permissions|row-level security|not authorized/.test(text)) return 'permission-denied';
    if (/unauthenticated|jwt|not signed in/.test(text)) return 'unauthenticated';
    if (/index|invalid query|invalid-argument/.test(text)) return 'invalid-query';
    if (/network|unavailable|offline|timeout|failed to fetch/.test(text)) return 'unavailable';
    return 'unknown';
}

/** Any error of a database as a `DataProviderError` (an existing one is returned as it is). */
export function toDataProviderError(error: unknown, path?: string): DataProviderError {
    if (error instanceof DataProviderError) return error;
    const message = String((error as { message?: unknown })?.message ?? error ?? 'Read failed');
    return new DataProviderError(codeOf(error), message, { path, cause: error });
}

/**
 * Tells the page that a subscription failed: `options.onError` when it is given, else the console as the
 * providers did before CR-129. Returns the normalized error.
 */
export function reportSubscribeError(options: Pick<DatabaseOptions, 'onError'> | undefined, error: unknown, path?: string): DataProviderError {
    const normalized = toDataProviderError(error, path);
    if (options?.onError) options.onError(normalized);
    else console.error(`Data subscription error at ${path ?? '?'}:`, error);
    return normalized;
}
