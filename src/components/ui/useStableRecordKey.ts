import { useCallback, useRef } from 'react';
import { RECORD_KEY } from '../../providers/data/DataProvider';

type RecordWithOptionalKey = {
    _key?: string;
};

export function useStableRecordKey<TRecord extends RecordWithOptionalKey>(prefix: string) {
    const generatedKeys = useRef(new WeakMap<object, string>());
    const keyCounter = useRef(0);

    return useCallback((record: TRecord, _index?: number) => {
        if (record[RECORD_KEY]) return record[RECORD_KEY];

        const cacheKey = record as object;
        const existingKey = generatedKeys.current.get(cacheKey);
        if (existingKey) return existingKey;

        const nextKey = `${prefix}-${keyCounter.current++}`;
        generatedKeys.current.set(cacheKey, nextKey);
        return nextKey;
    }, [prefix]);
}
