import React, { useCallback, useEffect, useMemo, useRef } from "react";
import Table from "../../ui/Table";
import { type RecordProps } from "../../../providers/data/DataProvider";
import { type GridSelectionState, type GridTableViewProps } from "./types";
import { getRecordKeyResolver, renderGridCellValue } from "./utils";
import { getRecordValue } from "../../../libs/utils";

type CellCacheEntry<TRecord extends RecordProps> = {
    recordRef: TRecord;
    valueRef: unknown;
    renderRef: GridTableViewProps<TRecord>["columns"][number]["render"];
    rowIndex: number;
    output: React.ReactNode;
};

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
    groupBy,
    wrapClass,
    pre,
    post,
}: GridTableViewProps<TRecord>) {
    const getRecordKey = useMemo(() => getRecordKeyResolver(recordId), [recordId]);
    const cellCacheRef = useRef<Map<string, Map<string, CellCacheEntry<TRecord>>>>(new Map());
    const sourceByKey = useMemo(() => {
        return records.reduce<Map<string, TRecord>>((acc, record) => {
            acc.set(getRecordKey(record), record);
            return acc;
        }, new Map());
    }, [getRecordKey, records]);
    const columnsByKey = useMemo(() => {
        return columns.reduce<Map<string, GridTableViewProps<TRecord>["columns"][number]>>((acc, column) => {
            acc.set(String(column.key), column);
            return acc;
        }, new Map());
    }, [columns]);

    useEffect(() => {
        const validKeys = new Set(records.map((record) => getRecordKey(record)));
        for (const recordKey of cellCacheRef.current.keys()) {
            if (!validKeys.has(recordKey)) {
                cellCacheRef.current.delete(recordKey);
            }
        }
    }, [getRecordKey, records]);

    const renderCell = useCallback((record: RecordProps, columnKey: string, absoluteIndex: number) => {
        const sourceRecord = record as TRecord;
        const recordKey = getRecordKey(sourceRecord);
        const column = columnsByKey.get(columnKey);
        if (!column) return getRecordValue(sourceRecord, columnKey) as React.ReactNode;

        const value = getRecordValue(sourceRecord, columnKey);
        const perRecordCache = cellCacheRef.current.get(recordKey) ?? new Map<string, CellCacheEntry<TRecord>>();
        const cached = perRecordCache.get(columnKey);
        const rowIndexSensitive = typeof column.render === "function";

        if (
            cached
            && cached.recordRef === sourceRecord
            && cached.valueRef === value
            && cached.renderRef === column.render
            && (!rowIndexSensitive || cached.rowIndex === absoluteIndex)
        ) {
            return cached.output;
        }

        const output = renderGridCellValue(column, {
            record: sourceRecord,
            value,
            key: columnKey,
            rowIndex: absoluteIndex,
            runAction: (actionKey: string) => runAction(actionKey, sourceRecord),
        });

        perRecordCache.set(columnKey, {
            recordRef: sourceRecord,
            valueRef: value,
            renderRef: column.render,
            rowIndex: absoluteIndex,
            output,
        });
        cellCacheRef.current.set(recordKey, perRecordCache);
        return output;
    }, [columnsByKey, getRecordKey, runAction]);

    return (
        <Table
            header={columns.map((column) => ({
                key: String(column.key),
                label: column.label,
                className: column.className,
                sort: column.sortable,
            }))}
            body={records}
            sortable={sortable}
            pagination={pagination}
            renderCell={renderCell}
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
            groupBy={groupBy as string | string[] | undefined}
            wrapClass={wrapClass}
            pre={pre}
            post={post}
        />
    );
}

export default GridTableView;
