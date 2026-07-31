import { useCallback, useRef } from 'react';
import { RECORD_KEY } from '../../providers/data/DataProvider';

type RecordWithOptionalKey = {
    _key?: string;
};

/** A field name (read via bracket access) or a function computing the key directly. */
export type RecordKeyResolver<TRecord> = string | ((record: TRecord) => string);

export function useStableRecordKey<TRecord extends RecordWithOptionalKey>(
    prefix: string,
    /** Explicit resolver, checked BEFORE the RECORD_KEY/WeakMap fallback below — trusted even
     * across the new object identities a caller's own state management may produce on every
     * edit (e.g. Form.tsx's `cloneContainer`, which clones the touched record on each keystroke
     * but preserves this field's VALUE unchanged). Without an explicit resolver, a record with no
     * `RECORD_KEY` gets a key from a WeakMap keyed by object identity — a fresh clone is a cache
     * miss and gets a brand-new key, which remounts that row (and any interactive element inside
     * it, e.g. a Form-bound `<Input>`, losing focus) on every single keystroke. Passing a
     * resolver for a stable id field already present on the record (e.g. `"id"`) sidesteps this
     * entirely, since the resolved value never changes across a clone. Absent = unchanged
     * behavior (RECORD_KEY/WeakMap fallback only). */
    recordId?: RecordKeyResolver<TRecord>,
) {
    const generatedKeys = useRef(new WeakMap<object, string>());
    const keyCounter = useRef(0);

    return useCallback((record: TRecord, _index?: number) => {
        if (recordId != null) {
            const value = typeof recordId === 'function' ? recordId(record) : (record as Record<string, unknown>)[recordId];
            if (value != null && value !== '') return String(value);
        }

        if (record[RECORD_KEY]) return record[RECORD_KEY];

        const cacheKey = record as object;
        const existingKey = generatedKeys.current.get(cacheKey);
        if (existingKey) return existingKey;

        const nextKey = `${prefix}-${keyCounter.current++}`;
        generatedKeys.current.set(cacheKey, nextKey);
        return nextKey;
    }, [prefix, recordId]);
}
