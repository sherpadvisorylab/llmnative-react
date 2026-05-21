import { useCallback, useEffect, useMemo, useState } from "react";
import { type RecordProps } from "../../../providers/data/DataProvider";
import { type GridSelectionState } from "./types";

type UseGridSelectionArgs<TRecord extends RecordProps> = {
    selectedKeys?: string[];
    defaultSelectedKeys?: string[];
    onSelectionChange?: (selection: GridSelectionState<TRecord>) => void;
};

function useGridSelection<TRecord extends RecordProps>({
    selectedKeys,
    defaultSelectedKeys,
    onSelectionChange,
}: UseGridSelectionArgs<TRecord>) {
    const [internalSelectedKeys, setInternalSelectedKeys] = useState<string[]>(defaultSelectedKeys || []);
    const [internalSelectedRecords, setInternalSelectedRecords] = useState<TRecord[]>([]);

    useEffect(() => {
        if (selectedKeys !== undefined) setInternalSelectedKeys(selectedKeys);
    }, [selectedKeys]);

    const activeSelectionKeys = selectedKeys ?? internalSelectedKeys;

    const clearSelection = useCallback(() => {
        if (selectedKeys === undefined) {
            setInternalSelectedKeys([]);
        }
        setInternalSelectedRecords([]);
        onSelectionChange?.({ keys: [], records: [], hasSelection: false, clear: () => undefined });
    }, [onSelectionChange, selectedKeys]);

    const selectionState = useMemo<GridSelectionState<TRecord>>(() => ({
        keys: activeSelectionKeys,
        records: internalSelectedRecords,
        hasSelection: activeSelectionKeys.length > 0,
        clear: clearSelection,
    }), [activeSelectionKeys, clearSelection, internalSelectedRecords]);

    const handleSelectionChange = useCallback((nextSelection: GridSelectionState<TRecord>) => {
        if (selectedKeys === undefined) {
            setInternalSelectedKeys(nextSelection.keys);
        }
        setInternalSelectedRecords(nextSelection.records);
        onSelectionChange?.(nextSelection);
    }, [onSelectionChange, selectedKeys]);

    return {
        activeSelectionKeys,
        selectionState,
        handleSelectionChange,
    };
}

export default useGridSelection;
