import React, { useMemo } from "react";
import Gallery from "../../ui/Gallery";
import { RECORD_KEY, type RecordProps } from "../../../providers/data/DataProvider";
import { type GridGalleryViewProps, type GridSelectionState } from "./types";
import { getRecordKeyResolver } from "./utils";

function GridGalleryView<TRecord extends RecordProps>({
    records,
    recordId,
    sortable,
    pagination,
    selection = false,
    selectedKeys,
    onSelectionChange,
    onRowClick,
    groupBy,
    wrapperClassName,
    before,
    after,
    columns,
    overlays,
}: GridGalleryViewProps<TRecord>) {
    const getRecordKey = useMemo(() => getRecordKeyResolver(recordId), [recordId]);
    const sourceByKey = useMemo(() => {
        return records.reduce<Map<string, TRecord>>((acc, record) => {
            acc.set(getRecordKey(record), record);
            return acc;
        }, new Map());
    }, [getRecordKey, records]);

    // `Gallery` resolves its own item key from `record._key` only — it has no concept of
    // an arbitrary `recordId` field/function like the rest of Grid. Without this, a
    // consumer using e.g. `recordId="id"` (any field other than `_key`) gets a synthetic
    // fallback key from Gallery that's disconnected from the real record id, breaking
    // `onRowClick`/selection/overlay handlers that read `item._key` expecting it to match.
    const keyedRecords = useMemo(
        () => records.map((record) => ({ ...record, [RECORD_KEY]: getRecordKey(record) })),
        [records, getRecordKey]
    );

    return (
        <Gallery
            records={keyedRecords}
            overlays={overlays}
            sortable={sortable}
            pagination={pagination}
            selectedKeys={selection ? selectedKeys : undefined}
            onSelectionChange={selection ? (nextSelection) => {
                let normalizedKeys = nextSelection.keys;
                let normalizedRecords = nextSelection.records as TRecord[];

                if (selection === "single" && nextSelection.keys.length > 1) {
                    const lastKey = nextSelection.keys[nextSelection.keys.length - 1];
                    normalizedKeys = lastKey ? [lastKey] : [];
                    normalizedRecords = lastKey ? (sourceByKey.get(lastKey) ? [sourceByKey.get(lastKey)!] : []) : [];
                }

                const payload: GridSelectionState<TRecord> = {
                    keys: normalizedKeys,
                    records: normalizedRecords,
                    hasSelection: normalizedKeys.length > 0,
                    clear: () => onSelectionChange?.({
                        keys: [],
                        records: [],
                        hasSelection: false,
                        clear: () => undefined,
                    }),
                };
                onSelectionChange?.(payload);
            } : undefined}
            onRowClick={onRowClick ? (record) => onRowClick(record as TRecord) : undefined}
            groupBy={groupBy as string | string[] | undefined}
            wrapperClassName={wrapperClassName}
            before={before}
            after={after}
            columns={columns}
        />
    );
}

export default GridGalleryView;

