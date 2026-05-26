import React, { useMemo } from "react";
import Gallery from "../../ui/Gallery";
import { type RecordProps } from "../../../providers/data/DataProvider";
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
    onClickRow,
    groupBy,
    wrapClass,
    pre,
    post,
}: GridGalleryViewProps<TRecord>) {
    const getRecordKey = useMemo(() => getRecordKeyResolver(recordId), [recordId]);
    const sourceByKey = useMemo(() => {
        return records.reduce<Map<string, TRecord>>((acc, record) => {
            acc.set(getRecordKey(record), record);
            return acc;
        }, new Map());
    }, [getRecordKey, records]);

    return (
        <Gallery
            body={records}
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
            onClick={onClickRow ? (record) => onClickRow(record as TRecord) : undefined}
            groupBy={groupBy as string | string[] | undefined}
            wrapClass={wrapClass}
            pre={pre}
            post={post}
        />
    );
}

export default GridGalleryView;
