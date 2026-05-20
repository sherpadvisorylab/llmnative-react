import { useCallback, useEffect, useMemo, useState } from 'react';

export type RecordSelectionState<TRecord> = {
    keys: string[];
    records: TRecord[];
    clear: () => void;
    hasSelection: boolean;
};

type RecordSelectionPayload<TRecord> = Omit<RecordSelectionState<TRecord>, 'clear'>;

type UseRecordSelectionArgs<TRecord> = {
    records: TRecord[];
    selectedKeys?: string[];
    legacySelectedKeys?: string[];
    onSelectionChange?: (selection: RecordSelectionState<TRecord>) => void;
    getRecordKey: (record: TRecord, index: number) => string;
};

export function useRecordSelection<TRecord>({
    records,
    selectedKeys,
    legacySelectedKeys,
    onSelectionChange,
    getRecordKey,
}: UseRecordSelectionArgs<TRecord>) {
    const incomingSelectedKeys = selectedKeys ?? legacySelectedKeys;
    const isSelectionControlled = incomingSelectedKeys !== undefined && !!onSelectionChange;
    const [internalSelectedKeys, setInternalSelectedKeys] = useState<string[]>(incomingSelectedKeys ?? []);

    useEffect(() => {
        if (incomingSelectedKeys !== undefined && !isSelectionControlled) {
            setInternalSelectedKeys(incomingSelectedKeys);
        }
    }, [incomingSelectedKeys, isSelectionControlled]);

    const activeSelectedKeys = isSelectionControlled ? (incomingSelectedKeys || []) : internalSelectedKeys;
    const showSelection = !!onSelectionChange || incomingSelectedKeys !== undefined;

    const buildSelectionPayload = useCallback((keys: string[]): RecordSelectionPayload<TRecord> => {
        const keySet = new Set(keys);
        const selectedRecords = records.filter((record, index) => keySet.has(getRecordKey(record, index)));
        return {
            keys,
            records: selectedRecords,
            hasSelection: keys.length > 0,
        };
    }, [getRecordKey, records]);

    const updateSelection = useCallback((nextKeys: string[]) => {
        if (!isSelectionControlled) {
            setInternalSelectedKeys(nextKeys);
        }

        const nextSelection = buildSelectionPayload(nextKeys);
        onSelectionChange?.({
            ...nextSelection,
            clear: () => updateSelection([]),
        });
    }, [buildSelectionPayload, isSelectionControlled, onSelectionChange]);

    const clearSelection = useCallback(() => {
        updateSelection([]);
    }, [updateSelection]);

    const selectionState = useMemo<RecordSelectionState<TRecord>>(() => {
        const nextSelection = buildSelectionPayload(activeSelectedKeys);
        return {
            ...nextSelection,
            clear: clearSelection,
        };
    }, [activeSelectedKeys, buildSelectionPayload, clearSelection]);

    return {
        activeSelectedKeys,
        selectionState,
        showSelection,
        updateSelection,
    };
}
