import React, { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react';
import { ArrowDown, ArrowUp, ArrowUpDown, GripVertical } from 'lucide-react';
import { useTheme } from "../../Theme";
import { RecordArray, RecordProps } from "../../providers/data/DataProvider";
import { UIProps } from '../';
import Pagination, { PaginationParams } from './Pagination';
import { Order, type OrderConfig } from '../../libs/order';
import { RecordSelectionState, useRecordSelection } from './useRecordSelection';
import { useStableRecordKey } from './useStableRecordKey';

export type TableHeaderProp = {
    key: string,
    label: string,
    className?: string,
    sort?: boolean
};

export type TableReorderMeta = {
    fromIndex: number;
    toIndex: number;
    record: RecordProps;
};

type DropIndicatorPosition = 'before' | 'after';

export type TableSelectionState = RecordSelectionState<RecordProps>;
export type TableSelectionMode = 'single' | 'multiple';
export type TableSelectionChangeHandler = (selection: TableSelectionState) => void;
export type TableReorderHandler = (reorderedRecords: RecordArray, meta: TableReorderMeta) => void;

export interface TableProps extends UIProps {
    columns?: TableHeaderProp[],
    records?: RecordArray,
    footer?: string | React.ReactNode,
    onRowClick?: (record: RecordProps) => void;
    onReorder?: TableReorderHandler;
    onSelectionChange?: TableSelectionChangeHandler;
    selection?: TableSelectionMode;
    sortable?: boolean | OrderConfig;
    pagination?: PaginationParams;
    activeKey?: string | null;
    selectedKeys?: string[];
    groupBy?: string | string[];
    headerClassName?: string,
    bodyClassName?: string,
    footerClassName?: string,
    heightClassName?: string,
    scrollClassName?: string,
    selectedClassName?: string,
    renderCell?: (record: RecordProps, key: string, absoluteIndex: number) => React.ReactNode
};

function Table({
    columns = undefined,
    records = undefined,
    footer = undefined,
    onRowClick = undefined,
    onReorder = undefined,
    onSelectionChange = undefined,
    selection = 'multiple',
    sortable = false,
    pagination = undefined,
    activeKey = undefined,
    selectedKeys = undefined,
    groupBy = undefined,
    before = undefined,
    after = undefined,
    wrapperClassName = undefined,
    className = undefined,
    headerClassName = undefined,
    bodyClassName = undefined,
    footerClassName = undefined,
    heightClassName = undefined,
    scrollClassName = undefined,
    selectedClassName = undefined,
    renderCell = undefined
}: TableProps) {
    const theme = useTheme("table");
    const activeClass = selectedClassName || theme.Table.selectedClassName;
    const [rows, setRows] = useState<RecordArray>(records || []);
    const sortableOrder = useMemo(() => {
        if (!sortable || typeof sortable === 'boolean') return undefined;
        return sortable;
    }, [typeof sortable === 'object' ? sortable?.dir : undefined, typeof sortable === 'object' ? sortable?.field : undefined]);
    const sortingEnabled = sortable !== false;
    const [currentOrder, setCurrentOrder] = useState<OrderConfig | undefined>(sortableOrder);
    const [paginationNavEl, setPaginationNavEl] = useState<HTMLElement | null>(null);
    const [draggedKey, setDraggedKey] = useState<string | null>(null);
    const [dragOverKey, setDragOverKey] = useState<string | null>(null);
    const [dropIndicator, setDropIndicator] = useState<{ key: string; position: DropIndicatorPosition } | null>(null);
    const [activeRowKey, setActiveRowKey] = useState<string | null>(null);
    const hasWarnedReorderSortConflict = useRef(false);
    const paginationNavRef = useCallback((node: HTMLDivElement | null) => {
        if (node) setPaginationNavEl(node);
    }, []);
    const singleSelectionGroupName = useId();

    const reorderable = !!onReorder;
    const hasSortConfiguration = sortingEnabled || !!Order.normalize(sortableOrder);
    const sortDisabledByReorder = reorderable && hasSortConfiguration;
    const effectiveSortable = sortDisabledByReorder ? false : sortingEnabled;
    const effectiveOrder = sortDisabledByReorder ? undefined : sortableOrder;

    useEffect(() => {
        setRows(records || []);
    }, [records]);

    useEffect(() => {
        setCurrentOrder(effectiveOrder);
    }, [effectiveOrder?.field, effectiveOrder?.dir]);

    useEffect(() => {
        if (!sortDisabledByReorder || hasWarnedReorderSortConflict.current) return;

        console.warn(
            'Table: `onReorder` cannot be combined with sortable sorting on the same view. Manual reorder takes precedence and sorting is ignored.'
        );
        hasWarnedReorderSortConflict.current = true;
    }, [sortDisabledByReorder]);

    const getStableRecordKey = useStableRecordKey<RecordProps>('row');
    const getRecordKey = useCallback((record: RecordProps, index?: number) => getStableRecordKey(record, index), [getStableRecordKey]);
    const {
        activeSelectedKeys,
        selectionState,
        showSelection,
        updateSelection,
    } = useRecordSelection<RecordProps>({
        records: rows,
        selectedKeys,
        legacySelectedKeys: undefined,
        onSelectionChange,
        getRecordKey,
    });

    useEffect(() => {
        if (!activeRowKey) return;

        const rowStillExists = rows.some((record, index) => getRecordKey(record, index) === activeRowKey);
        if (!rowStillExists) {
            setActiveRowKey(null);
        }
    }, [activeRowKey, getRecordKey, rows]);

    useEffect(() => {
        if (currentOrder || !columns?.length || reorderable) return;
        const firstSortable = columns.find((column) => effectiveSortable && column.sort !== false);
        if (firstSortable) {
            setCurrentOrder({ field: firstSortable.key, dir: 'asc' });
        }
    }, [currentOrder, effectiveSortable, columns, reorderable]);

    const sortedBody = useMemo<RecordArray>(() => Order.records(rows, currentOrder) || [], [rows, currentOrder]);

    const handleClick = (e: React.MouseEvent<HTMLElement>, record: RecordProps, absoluteIndex?: number) => {
        let currentElement = e.target as HTMLElement;

        while (currentElement && currentElement.tagName !== 'TR') {
            if (['A', 'BUTTON', 'INPUT', 'LABEL'].includes(currentElement.tagName)) {
                return;
            }
            currentElement = currentElement.parentNode as HTMLElement;
        }

        const rowKey = getRecordKey(record, absoluteIndex);

        if (activeClass) {
            if (activeKey === undefined) {
                setActiveRowKey((current) => current === rowKey ? null : rowKey);
            }
        }

        onRowClick?.(record);
    };

    const getFieldComponent = (item: RecordProps, key: string, absoluteIndex: number): React.ReactNode => {
        if (renderCell) return renderCell(item, key, absoluteIndex);
        const rawVal = item[key];
        const asObj = (rawVal !== null && rawVal !== undefined && typeof rawVal === 'object' && !Array.isArray(rawVal))
            ? rawVal as Record<string, unknown>
            : null;
        const v = (asObj?.prompt && asObj?.value) || rawVal;
        if (React.isValidElement(v) || v == null || typeof v !== 'object') return v as React.ReactNode;
        return Array.isArray(v) && !v.some((entry) => typeof entry === 'object' && entry)
            ? v.join(", ")
            : "";
    };

    const toggleRowSelection = useCallback((record: RecordProps, absoluteIndex: number) => {
        const rowKey = getRecordKey(record, absoluteIndex);
        const nextKeys = activeSelectedKeys.includes(rowKey)
            ? activeSelectedKeys.filter((key) => key !== rowKey)
            : [...activeSelectedKeys, rowKey];
        updateSelection(nextKeys);
    }, [activeSelectedKeys, getRecordKey, updateSelection]);

    const toggleSingleRowSelection = useCallback((record: RecordProps, absoluteIndex: number) => {
        const rowKey = getRecordKey(record, absoluteIndex);
        updateSelection(activeSelectedKeys.includes(rowKey) ? [] : [rowKey]);
    }, [activeSelectedKeys, getRecordKey, updateSelection]);

    const handleDrop = useCallback((targetRecord: RecordProps, targetIndex: number) => {
        if (!draggedKey) return;

        const sourceIndex = sortedBody.findIndex((record, index) => getRecordKey(record, index) === draggedKey);
        const destinationIndex = sortedBody.findIndex((record, index) => getRecordKey(record, index) === getRecordKey(targetRecord, targetIndex));

        setDragOverKey(null);
        setDraggedKey(null);
        const indicatorPosition = dropIndicator?.position || 'after';
        setDropIndicator(null);

        if (sourceIndex < 0 || destinationIndex < 0 || sourceIndex === destinationIndex) return;

        const nextRows = [...sortedBody];
        const [movedRecord] = nextRows.splice(sourceIndex, 1);
        const adjustedDestinationIndex =
            sourceIndex < destinationIndex
                ? destinationIndex + (indicatorPosition === 'after' ? 0 : -1)
                : destinationIndex + (indicatorPosition === 'after' ? 1 : 0);

        nextRows.splice(adjustedDestinationIndex, 0, movedRecord);

        setCurrentOrder(undefined);
        setRows(nextRows);
        onReorder?.(nextRows, {
            fromIndex: sourceIndex,
            toIndex: adjustedDestinationIndex,
            record: movedRecord,
        });
    }, [draggedKey, dropIndicator?.position, getRecordKey, onReorder, sortedBody]);

    if (sortedBody.length === 0) {
        return <p className={"p-4"}>No data found</p>;
    }

    const headers: TableHeaderProp[] = columns || Object.keys(sortedBody[0]).map((key) => ({ key, label: key, sort: sortingEnabled }));
    const viewportClass = [
        "fixed-table-container",
        theme.Table.scrollClassName,
        heightClassName ? `${heightClassName} overflow-auto` : "",
        scrollClassName || "",
    ].filter(Boolean).join(" ");
    const totalColumns = headers.length + (showSelection ? 1 : 0) + (reorderable ? 1 : 0);

    const renderDropIndicator = (
        key: string,
        position: DropIndicatorPosition,
        record: RecordProps,
        absoluteIndex: number
    ) => {
        if (!dropIndicator || dropIndicator.key !== key || dropIndicator.position !== position) {
            return null;
        }

        return (
            <tr
                aria-hidden="true"
                onDragOver={(event) => {
                    if (!reorderable) return;
                    event.preventDefault();
                    if (dragOverKey !== key) {
                        setDragOverKey(key);
                    }
                    setDropIndicator({ key, position });
                }}
                onDrop={(event) => {
                    if (!reorderable) return;
                    event.preventDefault();
                    setDropIndicator({ key, position });
                    handleDrop(record, absoluteIndex);
                }}
            >
                <td colSpan={totalColumns} className="border-0 p-0">
                    <div className="relative h-5 cursor-grab">
                        <div className="absolute inset-x-2 top-1/2 -translate-y-1/2">
                            <div className="h-0 rounded-full border-t-2 border-primary/80" />
                            <div className="absolute left-0 top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-primary shadow-sm" />
                        </div>
                    </div>
                </td>
            </tr>
        );
    };

    return (
        <div className="flex items-stretch gap-3">
            {before && <div className="table-before flex shrink-0 items-center self-stretch">{before}</div>}
            <div ref={paginationNavRef} className={"table-responsive min-w-0 flex-1 " + (wrapperClassName || theme.Table.wrapperClassName)}>
                <div className={viewportClass}>
                    <table className={"table " + (className || theme.Table.className)}>
                    <thead className={headerClassName || theme.Table.headerClassName}>
                        <tr>
                            {showSelection && (
                                <th style={{ width: '1%', whiteSpace: 'nowrap' }}>
                                    {selection !== 'single' ? (
                                        <div className="th-inner py-1">
                                            <input
                                                type="checkbox"
                                                aria-label="Select all rows"
                                                checked={selectionState.records.length > 0 && selectionState.records.length === rows.length}
                                                onChange={(event) => {
                                                    const nextKeys = event.target.checked
                                                        ? sortedBody.map((record, index) => getRecordKey(record, index))
                                                        : [];
                                                    updateSelection(nextKeys);
                                                }}
                                            />
                                        </div>
                                    ) : (
                                        <div className="th-inner py-1" />
                                    )}
                                </th>
                            )}
                            {reorderable && (
                                <th style={{ width: '1%', whiteSpace: 'nowrap' }}>
                                    <div className="th-inner py-1" />
                                </th>
                            )}
                            {headers.map((hdr) => (
                                hdr.label ? (
                                    (() => {
                                        const isSortable = effectiveSortable && hdr.sort !== false;
                                        const isActiveSort = isSortable && currentOrder?.field === hdr.key;
                                        const ariaSort = !isActiveSort
                                            ? "none"
                                            : currentOrder?.dir === 'desc'
                                                ? "descending"
                                                : "ascending";

                                        return (
                                            <th
                                                key={hdr.key}
                                                className={hdr.className}
                                                aria-sort={ariaSort}
                                            >
                                                {isSortable ? (
                                                    <button
                                                        type="button"
                                                        className={
                                                            "th-inner group inline-flex w-full cursor-pointer items-center gap-2 rounded-sm border-0 bg-transparent px-0 py-1 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 " +
                                                            (isActiveSort
                                                                ? "font-semibold text-foreground"
                                                                : "text-muted-foreground hover:text-foreground")
                                                        }
                                                        onClick={() => setCurrentOrder((prev) => Order.toggle(prev, hdr.key))}
                                                        aria-label={
                                                            isActiveSort
                                                                ? `Sort by ${hdr.label}, currently ${currentOrder?.dir === 'desc' ? 'descending' : 'ascending'}`
                                                                : `Sort by ${hdr.label}`
                                                        }
                                                        title={
                                                            isActiveSort
                                                                ? `${hdr.label}: ${currentOrder?.dir === 'desc' ? 'descending' : 'ascending'}`
                                                                : `Sort by ${hdr.label}`
                                                        }
                                                    >
                                                        <span
                                                            className={
                                                                "inline-flex h-4 w-4 flex-none items-center justify-center transition-colors " +
                                                                (isActiveSort
                                                                    ? "text-primary"
                                                                    : "text-muted-foreground/70 group-hover:text-foreground/80")
                                                            }
                                                            aria-hidden="true"
                                                        >
                                                            {isActiveSort ? (
                                                                currentOrder?.dir === 'desc' ? <ArrowDown size={14} /> : <ArrowUp size={14} />
                                                            ) : (
                                                                <ArrowUpDown size={14} />
                                                            )}
                                                        </span>
                                                        <span>{hdr.label}</span>
                                                    </button>
                                                ) : (
                                                    <div className="th-inner py-1">{hdr.label}</div>
                                                )}
                                            </th>
                                        );
                                    })()
                                ) : (
                                    <th key={hdr.key} style={{ width: '1%', whiteSpace: 'nowrap' }}></th>
                                )
                            ))}
                        </tr>
                    </thead>
                    <tbody className={bodyClassName || theme.Table.bodyClassName}>
                        <Pagination
                            records={sortedBody}
                            appendTo={paginationNavEl}
                            wrapperClassName="px-3 pt-4 pb-2"
                            {...(pagination || {})}
                        >
                            {(pageRecords, pageOffset) => {
                                const groupFields = groupBy
                                    ? (Array.isArray(groupBy) ? groupBy : [groupBy])
                                    : null;
                                let prevGroupKey: string | undefined;
                                return pageRecords.map((record, index) => {
                                    const absoluteIndex = pageOffset + index;
                                    const rowKey = getRecordKey(record, absoluteIndex);
                                    const currentGroupKey = groupFields
                                        ? groupFields.map((f) => String(record[f] ?? '')).join(' · ')
                                        : undefined;
                                    const showGroupHeader = currentGroupKey !== undefined && currentGroupKey !== prevGroupKey;
                                    prevGroupKey = currentGroupKey;
                                    const isSelected = activeSelectedKeys.includes(rowKey);
                                    const isDraggedOver = dragOverKey === rowKey;
                                    const isDragged = draggedKey === rowKey;
                                    const resolvedActiveKey = activeKey === undefined ? activeRowKey : activeKey;
                                    const isActiveRow = activeClass && resolvedActiveKey === rowKey;

                                    return (
                                        <React.Fragment key={rowKey}>
                                            {showGroupHeader && (
                                                <tr aria-hidden="true">
                                                    <td
                                                        colSpan={totalColumns}
                                                        className="bg-muted/40 px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground"
                                                    >
                                                        {currentGroupKey}
                                                    </td>
                                                </tr>
                                            )}
                                            {renderDropIndicator(rowKey, 'before', record, absoluteIndex)}
                                            <tr
                                                draggable={reorderable}
                                                className={[
                                                    isDraggedOver ? "bg-muted/30" : "",
                                                    isActiveRow ? activeClass : "",
                                                ].filter(Boolean).join(" ") || undefined}
                                                style={{
                                                    cursor: onRowClick ? "pointer" : reorderable ? "grab" : "default",
                                                    opacity: isDragged ? 0.45 : 1,
                                                }}
                                                onClick={(e) => {
                                                    if (onRowClick) {
                                                        handleClick(e, record, absoluteIndex);
                                                    }
                                                }}
                                                onDragStart={() => {
                                                    setDraggedKey(rowKey);
                                                }}
                                                onDragOver={(event) => {
                                                    if (!reorderable) return;
                                                    event.preventDefault();
                                                    const rect = event.currentTarget.getBoundingClientRect();
                                                    const nextPosition: DropIndicatorPosition =
                                                        event.clientY < rect.top + rect.height / 2 ? 'before' : 'after';

                                                    if (dragOverKey !== rowKey) {
                                                        setDragOverKey(rowKey);
                                                    }

                                                    if (draggedKey !== rowKey) {
                                                        setDropIndicator((current) =>
                                                            current?.key === rowKey && current.position === nextPosition
                                                                ? current
                                                                : { key: rowKey, position: nextPosition }
                                                        );
                                                    }
                                                }}
                                                onDragLeave={() => {
                                                    if (dragOverKey === rowKey) {
                                                        setDragOverKey(null);
                                                    }
                                                }}
                                                onDragEnd={() => {
                                                    setDraggedKey(null);
                                                    setDragOverKey(null);
                                                    setDropIndicator(null);
                                                }}
                                                onDrop={(event) => {
                                                    if (!reorderable) return;
                                                    event.preventDefault();
                                                    handleDrop(record, absoluteIndex);
                                                }}
                                            >
                                                {showSelection && (
                                                    <td style={{ width: '1%', whiteSpace: 'nowrap' }}>
                                                        <input
                                                            type={selection === 'single' ? 'radio' : 'checkbox'}
                                                            name={selection === 'single' ? singleSelectionGroupName : undefined}
                                                            aria-label={`Select row ${rowKey}`}
                                                            checked={isSelected}
                                                            onChange={() => {
                                                                if (selection === 'single') {
                                                                    toggleSingleRowSelection(record, absoluteIndex);
                                                                    return;
                                                                }
                                                                toggleRowSelection(record, absoluteIndex);
                                                            }}
                                                            onClick={(event) => {
                                                                event.stopPropagation();
                                                                if (selection === 'single') {
                                                                    event.preventDefault();
                                                                    toggleSingleRowSelection(record, absoluteIndex);
                                                                }
                                                            }}
                                                        />
                                                    </td>
                                                )}
                                                {reorderable && (
                                                    <td style={{ width: '1%', whiteSpace: 'nowrap' }}>
                                                        <button
                                                            type="button"
                                                            draggable={reorderable}
                                                            className="inline-flex cursor-grab items-center justify-center rounded-sm border-0 bg-transparent p-0 text-muted-foreground"
                                                            aria-label={`Reorder row ${rowKey}`}
                                                            onClick={(event) => event.preventDefault()}
                                                            onDragStart={(event) => {
                                                                event.stopPropagation();
                                                                setDraggedKey(rowKey);
                                                            }}
                                                            onDragEnd={(event) => {
                                                                event.stopPropagation();
                                                                setDraggedKey(null);
                                                                setDragOverKey(null);
                                                                setDropIndicator(null);
                                                            }}
                                                        >
                                                            <GripVertical size={14} />
                                                        </button>
                                                    </td>
                                                )}
                                                {headers.map((hdr) => (
                                                    <td key={hdr.key}>{getFieldComponent(record, hdr.key, absoluteIndex)}</td>
                                                ))}
                                            </tr>
                                            {renderDropIndicator(rowKey, 'after', record, absoluteIndex)}
                                        </React.Fragment>
                                    );
                                });
                            }}
                        </Pagination>
                    </tbody>
                    {footer && <tfoot className={footerClassName || theme.Table.footerClassName}>{footer}</tfoot>}
                    </table>
                </div>
            </div>
            {after && <div className="table-after flex shrink-0 items-center self-stretch">{after}</div>}
        </div>
    );
}

export default Table;
