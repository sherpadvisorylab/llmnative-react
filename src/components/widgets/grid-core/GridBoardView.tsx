import React, { useCallback, useEffect, useMemo, useState } from "react";
import { interpolate, useI18n } from "../../../I18n";
import { cn } from "../../../libs/cn";
import { getRecordValue } from "../../../libs/utils";
import { type RecordProps } from "../../../providers/data/DataProvider";
import { Dropdown, DropdownItem } from "../../blocks/Dropdown";
import Badge from "../../ui/Badge";
import { type GridBoardCardContext, type GridBoardViewProps, type GridColumn } from "./types";
import { getRecordKeyResolver, renderGridCellValue } from "./utils";

/** A move shown before the data says so: the card sits in `to` while the record still says `from`. */
type PendingMove = { from: string; to: string; pending: boolean };

/** How many table columns the default card shows: the first as its title, the others as label/value lines. */
const DEFAULT_CARD_FIELDS = 4;

function DefaultCard<TRecord extends RecordProps>({ record, columns, index, runAction }: {
    record: TRecord;
    columns: GridColumn<TRecord>[];
    index: number;
    runAction: (actionKey: string, record?: TRecord) => void;
}) {
    const shown = columns.slice(0, DEFAULT_CARD_FIELDS);
    const cell = (column: GridColumn<TRecord>) => {
        const key = String(column.key);
        return renderGridCellValue(column, {
            record,
            value: getRecordValue(record, key),
            key,
            rowIndex: index,
            runAction: (actionKey: string) => runAction(actionKey, record),
        });
    };
    if (!shown.length) return null;
    const [first, ...rest] = shown;
    return (
        <div className="flex min-w-0 flex-col gap-1">
            <div className="truncate text-sm font-medium text-foreground">{cell(first)}</div>
            {rest.map((column) => (
                <div key={String(column.key)} className="flex min-w-0 gap-1 text-xs text-muted-foreground">
                    <span className="shrink-0">{column.label}:</span>
                    <span className="min-w-0 truncate text-foreground/80">{cell(column)}</span>
                </div>
            ))}
        </div>
    );
}

/**
 * CR-138 — the kanban view of `Grid`: one column per stage, the records as cards. A card moves by dragging it,
 * from its "Move to" menu, or with the left/right arrow keys while it has the focus; the move shows at once and
 * goes back if `onMove` refuses it.
 */
function GridBoardView<TRecord extends RecordProps>({
    records,
    recordId,
    displayColumns,
    runAction,
    onCardClick,
    activeKey,
    wrapperClassName,
    before,
    after,
    columns,
    column,
    renderCard,
    onMove,
    canMove,
    emptyColumn,
    columnClassName,
    heightClassName,
}: GridBoardViewProps<TRecord>) {
    const dict = useI18n("grid");
    const getRecordKey = useMemo(() => getRecordKeyResolver(recordId), [recordId]);
    const columnOf = useCallback((record: TRecord): string | undefined => {
        const value = typeof column === "function" ? column(record) : getRecordValue(record, String(column));
        return value === undefined || value === null || value === "" ? undefined : String(value);
    }, [column]);

    const [moves, setMoves] = useState<Record<string, PendingMove>>({});
    const [dragged, setDragged] = useState<string | null>(null);
    const [over, setOver] = useState<string | null>(null);
    const [announcement, setAnnouncement] = useState("");

    // A move stays shown until the data changes the column of its record (to the new one, or to any other).
    useEffect(() => {
        setMoves((current) => {
            const keys = Object.keys(current);
            if (!keys.length) return current;
            const byKey = new Map(records.map((record) => [getRecordKey(record), record]));
            let changed = false;
            const next: Record<string, PendingMove> = {};
            for (const key of keys) {
                const record = byKey.get(key);
                const move = current[key];
                if (!record || (!move.pending && columnOf(record) !== move.from)) { changed = true; continue; }
                next[key] = move;
            }
            return changed ? next : current;
        });
    }, [records, getRecordKey, columnOf]);

    const shownColumnOf = useCallback((record: TRecord) => {
        const actual = columnOf(record);
        const move = moves[getRecordKey(record)];
        return move && actual === move.from ? move.to : actual;
    }, [columnOf, getRecordKey, moves]);

    const byColumn = useMemo(() => {
        const map = new Map<string, TRecord[]>(columns.map((c) => [c.id, []]));
        for (const record of records) {
            const id = shownColumnOf(record);
            if (id !== undefined) map.get(id)?.push(record);
        }
        return map;
    }, [columns, records, shownColumnOf]);

    const labelOf = useCallback((id: string) => {
        const label = columns.find((c) => c.id === id)?.label;
        return typeof label === "string" || typeof label === "number" ? String(label) : id;
    }, [columns]);

    const allowed = useCallback((record: TRecord, to: string) => {
        if (!onMove) return false;
        if (to === shownColumnOf(record)) return false;
        if (!columns.some((c) => c.id === to)) return false;
        return canMove ? canMove(record, to) : true;
    }, [canMove, columns, onMove, shownColumnOf]);

    const move = useCallback(async (record: TRecord, to: string) => {
        if (!onMove || !allowed(record, to)) return;
        const key = getRecordKey(record);
        const from = columnOf(record);
        if (from === undefined) return;
        setMoves((current) => ({ ...current, [key]: { from, to, pending: true } }));
        setAnnouncement(interpolate(dict.boardMoved, { column: labelOf(to) }));
        let accepted = true;
        try {
            accepted = (await onMove(record, to, from)) !== false;
        } catch {
            accepted = false;
        }
        setMoves((current) => {
            const next = { ...current };
            if (accepted) next[key] = { from, to, pending: false };
            else delete next[key];
            return next;
        });
        if (!accepted) setAnnouncement(dict.boardMoveFailed);
    }, [allowed, columnOf, dict.boardMoveFailed, dict.boardMoved, getRecordKey, labelOf, onMove]);

    const neighbour = (record: TRecord, step: -1 | 1) => {
        const index = columns.findIndex((c) => c.id === shownColumnOf(record));
        for (let i = index + step; i >= 0 && i < columns.length; i += step) {
            if (allowed(record, columns[i].id)) return columns[i].id;
        }
        return undefined;
    };

    const byKey = useMemo(() => new Map(records.map((record) => [getRecordKey(record), record])), [records, getRecordKey]);

    return (
        // CR-140: positioned, so the announcement (`sr-only`, absolute) stays inside the board.
        <div className={cn("relative", wrapperClassName)}>
            {before}
            <div className="flex gap-3 overflow-x-auto pb-2" role="list" aria-label={dict.boardView}>
                {columns.map((boardColumn) => {
                    const cards = byColumn.get(boardColumn.id) ?? [];
                    const draggedRecord = dragged ? byKey.get(dragged) : undefined;
                    const droppable = !!draggedRecord && allowed(draggedRecord, boardColumn.id);
                    return (
                        <section
                            key={boardColumn.id}
                            role="listitem"
                            aria-label={labelOf(boardColumn.id)}
                            className={cn(
                                "flex shrink-0 flex-col rounded-lg border border-border/60 bg-muted/40",
                                columnClassName ?? "w-72",
                                over === boardColumn.id && droppable && "border-primary/60 bg-primary/5",
                                boardColumn.className,
                            )}
                            onDragOver={(event) => {
                                if (!droppable) return;
                                event.preventDefault();
                                event.dataTransfer.dropEffect = "move";
                                if (over !== boardColumn.id) setOver(boardColumn.id);
                            }}
                            onDragLeave={(event) => {
                                if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
                                    setOver((current) => (current === boardColumn.id ? null : current));
                                }
                            }}
                            onDrop={(event) => {
                                event.preventDefault();
                                const record = draggedRecord;
                                setDragged(null);
                                setOver(null);
                                if (record && droppable) void move(record, boardColumn.id);
                            }}
                        >
                            <header className="sticky top-0 z-10 flex flex-col gap-0.5 rounded-t-lg border-b border-border/60 bg-muted/80 px-3 py-2 backdrop-blur">
                                <div className="flex items-center justify-between gap-2">
                                    <span className="min-w-0 truncate text-sm font-semibold text-foreground">{boardColumn.label}</span>
                                    <Badge variant="light">{cards.length}</Badge>
                                </div>
                                {boardColumn.hint !== undefined && <span className="text-xs text-muted-foreground">{boardColumn.hint}</span>}
                            </header>
                            <ul className={cn("flex flex-col gap-2 overflow-y-auto p-2", heightClassName ?? "max-h-[70vh]")}>
                                {cards.length === 0 ? (
                                    <li className="px-2 py-4 text-center text-xs text-muted-foreground">{emptyColumn ?? dict.boardEmptyColumn}</li>
                                ) : cards.map((record, index) => {
                                    const key = getRecordKey(record);
                                    const pending = !!moves[key]?.pending;
                                    const targets = onMove ? columns.filter((c) => allowed(record, c.id)) : [];
                                    const ctx: GridBoardCardContext<TRecord> = {
                                        columnId: boardColumn.id,
                                        index,
                                        pending,
                                        moveTo: (to) => { void move(record, to); },
                                        runAction,
                                    };
                                    return (
                                        <li
                                            key={key}
                                            tabIndex={0}
                                            draggable={targets.length > 0}
                                            aria-busy={pending || undefined}
                                            aria-keyshortcuts={targets.length ? "ArrowLeft ArrowRight" : undefined}
                                            className={cn(
                                                "group relative flex items-start gap-2 rounded-md border border-border bg-card p-3 text-left shadow-sm transition-shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                                                (onCardClick || targets.length > 0) && "cursor-pointer hover:shadow-md",
                                                targets.length > 0 && "active:cursor-grabbing",
                                                activeKey === key && "ring-2 ring-primary/60",
                                                dragged === key && "opacity-50",
                                                pending && "opacity-70",
                                            )}
                                            onClick={() => onCardClick?.(record)}
                                            onKeyDown={(event) => {
                                                if (event.target !== event.currentTarget) return;
                                                if (event.key === "Enter" && onCardClick) {
                                                    event.preventDefault();
                                                    onCardClick(record);
                                                } else if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
                                                    const to = neighbour(record, event.key === "ArrowLeft" ? -1 : 1);
                                                    if (!to) return;
                                                    event.preventDefault();
                                                    void move(record, to);
                                                }
                                            }}
                                            onDragStart={(event) => {
                                                setDragged(key);
                                                event.dataTransfer.effectAllowed = "move";
                                                event.dataTransfer.setData("text/plain", key);
                                            }}
                                            onDragEnd={() => { setDragged(null); setOver(null); }}
                                        >
                                            <div className="min-w-0 flex-1">
                                                {renderCard
                                                    ? renderCard(record, ctx)
                                                    : <DefaultCard record={record} columns={displayColumns} index={index} runAction={runAction} />}
                                            </div>
                                            {targets.length > 0 && (
                                                // The menu is the way to move a card without dragging it.
                                                <span className="shrink-0" onClick={(event) => event.stopPropagation()} onKeyDown={(event) => event.stopPropagation()}>
                                                    <Dropdown
                                                        trigger={{ icon: "move-horizontal", title: dict.boardMoveTo }}
                                                        triggerClassName="h-7 w-7 justify-center rounded-md p-0 text-muted-foreground hover:bg-muted hover:text-foreground"
                                                        position="end"
                                                    >
                                                        {targets.map((target) => (
                                                            <DropdownItem key={target.id} onClick={() => { void move(record, target.id); }}>
                                                                {target.label}
                                                            </DropdownItem>
                                                        ))}
                                                    </Dropdown>
                                                </span>
                                            )}
                                        </li>
                                    );
                                })}
                            </ul>
                        </section>
                    );
                })}
            </div>
            <span className="sr-only" aria-live="polite">{announcement}</span>
            {after}
        </div>
    );
}

export default GridBoardView;
