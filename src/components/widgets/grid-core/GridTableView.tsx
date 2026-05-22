import React, { useMemo } from "react";
import Table from "../../ui/Table";
import { type RecordProps } from "../../../providers/data/DataProvider";
import { type GridSelectionState, type GridTableViewProps } from "./types";
import { buildDisplayRecords, getRecordKeyResolver } from "./utils";

function GridTableView<TRecord extends RecordProps>({
    records,
    recordId,
    columns,
    runAction,
    sortable,
    pagination,
    selection = false,
    selectedKeys,
    onSelectionChange,
    onClickRow,
    reorderable = false,
    onReorder,
    activeKey,
    wrapClass,
}: GridTableViewProps<TRecord>) {
    const getRecordKey = useMemo(() => getRecordKeyResolver(recordId), [recordId]);
    const sourceByKey = useMemo(() => {
        return records.reduce<Map<string, TRecord>>((acc, record) => {
            acc.set(getRecordKey(record), record);
            return acc;
        }, new Map());
    }, [getRecordKey, records]);

    const displayRecords = useMemo(() => buildDisplayRecords(records, columns, runAction), [columns, records, runAction]);

    return (
        <Table
            header={columns.map((column) => ({
                key: String(column.key),
                label: column.label,
                className: column.className,
                sort: column.sortable,
            }))}
            body={displayRecords}
            sortable={sortable}
            pagination={pagination}
            selectionMode={selection === "single" ? "single" : "multiple"}
            selectedKeys={selection ? selectedKeys : undefined}
            onSelectionChange={selection ? (nextSelection) => {
                const keySet = new Set(nextSelection.keys);
                const recordsForSelection = records.filter((record) => keySet.has(getRecordKey(record)));
                let normalizedRecords = recordsForSelection;
                let normalizedKeys = nextSelection.keys;

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
            onClick={onClickRow ? (record) => {
                const key = getRecordKey(record as TRecord);
                const sourceRecord = sourceByKey.get(key);
                if (sourceRecord) onClickRow(sourceRecord);
            } : undefined}
            onReorder={reorderable && onReorder ? (reorderedDisplayRecords, meta) => {
                const reorderedRecords = reorderedDisplayRecords
                    .map((record) => sourceByKey.get(getRecordKey(record as TRecord)))
                    .filter(Boolean) as TRecord[];
                const movedRecord = sourceByKey.get(getRecordKey(meta.record as TRecord));
                if (!movedRecord) return;
                onReorder(reorderedRecords, {
                    fromIndex: meta.fromIndex,
                    toIndex: meta.toIndex,
                    record: movedRecord,
                });
            } : undefined}
            activeKey={activeKey}
            wrapClass={wrapClass}
        />
    );
}

export default GridTableView;
