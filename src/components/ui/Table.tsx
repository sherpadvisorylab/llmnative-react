import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
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

interface TableProps extends UIProps {
    header?: TableHeaderProp[],
    body?: RecordArray,
    Footer?: string | React.ReactNode,
    onClick?: (record: RecordProps) => void;
    onReorder?: (reorderedRecords: RecordArray, meta: TableReorderMeta) => void;
    onSelectionChange?: (selection: TableSelectionState) => void;
    sortable?: boolean | OrderConfig;
    pagination?: PaginationParams;
    activeKey?: string | null;
    selectedKeys?: string[];
    selectedRowKeys?: string[];
    headerClass?: string,
    bodyClass?: string,
    footerClass?: string,
    heightClass?: string,
    scrollClass?: string,
    selectedClass?: string
};

function Table({
    header = undefined,
    body = undefined,
    Footer = undefined,
    onClick = undefined,
    onReorder = undefined,
    onSelectionChange = undefined,
    sortable = false,
    pagination = undefined,
    activeKey = undefined,
    selectedKeys = undefined,
    selectedRowKeys = undefined,
    pre = undefined,
    post = undefined,
    wrapClass = undefined,
    className = undefined,
    headerClass = undefined,
    bodyClass = undefined,
    footerClass = undefined,
    heightClass = undefined,
    scrollClass = undefined,
    selectedClass = undefined
}: TableProps) {
    const theme = useTheme("table");
    const activeClass = selectedClass || theme.Table.selectedClass;
    const [rows, setRows] = useState<RecordArray>(body || []);
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

    const reorderable = !!onReorder;
    const hasSortConfiguration = sortingEnabled || !!Order.normalize(sortableOrder);
    const sortDisabledByReorder = reorderable && hasSortConfiguration;
    const effectiveSortable = sortDisabledByReorder ? false : sortingEnabled;
    const effectiveOrder = sortDisabledByReorder ? undefined : sortableOrder;

    useEffect(() => {
        setRows(body || []);
    }, [body]);

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
        legacySelectedKeys: selectedRowKeys,
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
        if (currentOrder || !header?.length || reorderable) return;
        const firstSortable = header.find((column) => effectiveSortable && column.sort !== false);
        if (firstSortable) {
            setCurrentOrder({ field: firstSortable.key, dir: 'asc' });
        }
    }, [currentOrder, effectiveSortable, header, reorderable]);

    const sortedBody = useMemo<RecordArray>(() => Order.records(rows, currentOrder) || [], [rows, currentOrder]);

    const handleClick = (e: React.MouseEvent<HTMLElement>, record: RecordProps) => {
        let currentElement = e.target as HTMLElement;

        while (currentElement && currentElement.tagName !== 'TR') {
            if (['A', 'BUTTON', 'INPUT', 'LABEL'].includes(currentElement.tagName)) {
                return;
            }
            currentElement = currentElement.parentNode as HTMLElement;
        }

        if (activeClass) {
            const rowKey = getRecordKey(record);
            if (activeKey === undefined) {
                setActiveRowKey((current) => current === rowKey ? null : rowKey);
            }
        }

        onClick?.(record);
    };

    const getFieldComponent = (item: RecordProps, key: string): React.ReactNode => {
        const v = (item[key]?.prompt && item[key]?.value) || item[key];
        if (React.isValidElement(v) || v == null || typeof v !== 'object') return v;
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
        return <p className={"p-4"}>Nessun dato trovato</p>;
    }

    const headers: TableHeaderProp[] = header || Object.keys(sortedBody[0]).map((key) => ({ key, label: key, sort: sortingEnabled }));
    const viewportClass = [
        "fixed-table-container",
        theme.Table.scrollClass,
        heightClass ? `${heightClass} overflow-auto` : "",
        scrollClass || "",
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
        <div ref={paginationNavRef} className={"table-responsive " + (wrapClass || theme.Table.wrapClass)}>
            <div className={viewportClass}>
                {pre && <div className="mb-3">{pre}</div>}
                <table className={"table " + (className || theme.Table.className)}>
                    <thead className={headerClass || theme.Table.headerClass}>
                        <tr>
                            {showSelection && (
                                <th style={{ width: '1%', whiteSpace: 'nowrap' }}>
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
                    <tbody className={bodyClass || theme.Table.bodyClass}>
                        <Pagination
                            recordSet={sortedBody}
                            appendTo={paginationNavEl}
                            wrapClass="px-3 pt-4 pb-2"
                            {...(pagination || {})}
                        >
                            {(pageRecords, pageOffset) =>
                                pageRecords.map((record, index) => {
                                    const absoluteIndex = pageOffset + index;
                                    const rowKey = getRecordKey(record, absoluteIndex);
                                    const isSelected = activeSelectedKeys.includes(rowKey);
                                    const isDraggedOver = dragOverKey === rowKey;
                                    const isDragged = draggedKey === rowKey;
                                    const resolvedActiveKey = activeKey === undefined ? activeRowKey : activeKey;
                                    const isActiveRow = activeClass && resolvedActiveKey === rowKey;

                                    return (
                                        <React.Fragment key={rowKey}>
                                            {renderDropIndicator(rowKey, 'before', record, absoluteIndex)}
                                            <tr
                                                draggable={reorderable}
                                                className={[
                                                    isDraggedOver ? "bg-muted/30" : "",
                                                    isActiveRow ? activeClass : "",
                                                ].filter(Boolean).join(" ") || undefined}
                                                style={{
                                                    cursor: onClick ? "pointer" : reorderable ? "grab" : "default",
                                                    opacity: isDragged ? 0.45 : 1,
                                                }}
                                                onClick={(e) => {
                                                    if (onClick) handleClick(e, record);
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
                                                            type="checkbox"
                                                            aria-label={`Select row ${rowKey}`}
                                                            checked={isSelected}
                                                            onChange={() => toggleRowSelection(record, absoluteIndex)}
                                                            onClick={(event) => event.stopPropagation()}
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
                                                    <td key={hdr.key}>{getFieldComponent(record, hdr.key)}</td>
                                                ))}
                                            </tr>
                                            {renderDropIndicator(rowKey, 'after', record, absoluteIndex)}
                                        </React.Fragment>
                                    );
                                })
                            }
                        </Pagination>
                    </tbody>
                    {Footer && <tfoot className={footerClass || theme.Table.footerClass}>{Footer}</tfoot>}
                </table>
                {post && <div className="mt-3">{post}</div>}
            </div>
        </div>
    );
}

export default Table;
