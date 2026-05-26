import { useCallback, useEffect, useMemo, useState } from "react";
import { type RecordProps } from "../../../providers/data/DataProvider";
import { type GridSelectionConfig, type GridSelectionState } from "./types";

type UseGridSelectionArgs<TRecord extends RecordProps> = {
    selection?: false | "single" | "multiple" | GridSelectionConfig<TRecord>;
};

function useGridSelection<TRecord extends RecordProps>({
    selection,
}: UseGridSelectionArgs<TRecord>) {
    const isConfig = selection !== null && selection !== false && typeof selection === "object";
    const mode = !selection
        ? false as const
        : typeof selection === "string"
            ? selection
            : selection.mode;
    const defaultKeys = isConfig ? (selection as GridSelectionConfig<TRecord>).defaultKeys : undefined;
    const onChange = isConfig ? (selection as GridSelectionConfig<TRecord>).onChange : undefined;

    const [internalKeys, setInternalKeys] = useState<string[]>(defaultKeys ?? []);
    const [internalRecords, setInternalRecords] = useState<TRecord[]>([]);

    const defaultKeysKey = defaultKeys?.join("\0") ?? "";
    useEffect(() => {
        setInternalKeys(defaultKeys ?? []);
        setInternalRecords([]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [defaultKeysKey]);

    const clearSelection = useCallback(() => {
        setInternalKeys([]);
        setInternalRecords([]);
        onChange?.({ keys: [], records: [], hasSelection: false, clear: () => undefined });
    }, [onChange]);

    const selectionState = useMemo<GridSelectionState<TRecord>>(() => ({
        keys: internalKeys,
        records: internalRecords,
        hasSelection: internalKeys.length > 0,
        clear: clearSelection,
    }), [clearSelection, internalKeys, internalRecords]);

    const handleSelectionChange = useCallback((nextSelection: GridSelectionState<TRecord>) => {
        setInternalKeys(nextSelection.keys);
        setInternalRecords(nextSelection.records);
        onChange?.(nextSelection);
    }, [onChange]);

    return {
        mode,
        activeSelectionKeys: internalKeys,
        selectionState,
        handleSelectionChange,
    };
}

export default useGridSelection;
