import React, { useState } from 'react';
import { interpolate, useI18n } from '../../I18n';
import { cn } from '../../libs/cn';
import ListCard, { type ListCardProps } from './ListCard';
import Icon from '../ui/Icon';

/** What a card of the list shows: the content of a compact ListCard. */
export type SortableListCard = Pick<ListCardProps, 'title' | 'description' | 'meta' | 'badge' | 'icon' | 'trailing' | 'active' | 'disabled'>;

export type SortableListReorderMeta<TItem> = { fromIndex: number; toIndex: number; item: TItem };

export interface SortableListProps<TItem> {
    /** The items, in their order. */
    items: TItem[];
    /** A stable key of an item. */
    getKey: (item: TItem) => string;
    /** The card of an item. */
    renderItem: (item: TItem, index: number) => SortableListCard;
    /** The items in their new order, after a drag or a key press on a handle. */
    onReorder?: (items: TItem[], meta: SortableListReorderMeta<TItem>) => void;
    /** The name of the list, for assistive technologies. */
    label?: string;
    /** Shows the position of each item (1, 2, 3…) before its card. */
    numbered?: boolean;
    /** No reordering: the handles are left out. */
    disabled?: boolean;
    /** What the list shows without items. */
    emptyState?: React.ReactNode;
    className?: string;
    itemClassName?: string;
    cardClassName?: string;
}

/** `items` with the one at `from` moved to `to`. */
export function moveItem<TItem>(items: readonly TItem[], from: number, to: number): TItem[] {
    const next = [...items];
    const [moved] = next.splice(from, 1);
    next.splice(Math.max(0, Math.min(to, next.length)), 0, moved);
    return next;
}

/**
 * A list of compact cards in an order the person chooses (CR-120): each card is dragged by its handle, or
 * moved with the arrow keys on it; `onReorder` gets the new order. A screen reader hears where it went.
 */
export default function SortableList<TItem>({
    items,
    getKey,
    renderItem,
    onReorder = undefined,
    label = undefined,
    numbered = false,
    disabled = false,
    emptyState = undefined,
    className = undefined,
    itemClassName = undefined,
    cardClassName = undefined,
}: SortableListProps<TItem>) {
    const dict = useI18n('sortableList');
    const [dragged, setDragged] = useState<number | null>(null);
    const [over, setOver] = useState<{ index: number; after: boolean } | null>(null);
    const [announcement, setAnnouncement] = useState('');
    const sortable = !disabled && !!onReorder && items.length > 1;

    if (!items.length) return emptyState ? <>{emptyState}</> : null;

    const move = (from: number, to: number) => {
        if (!onReorder || from === to || to < 0 || to >= items.length) return;
        const next = moveItem(items, from, to);
        onReorder(next, { fromIndex: from, toIndex: to, item: items[from] });
        setAnnouncement(interpolate(dict.moved, { position: to + 1, total: items.length }));
    };

    const drop = (index: number) => {
        if (dragged === null || !over) return;
        // Dropped after the card under it, or before; seen from the list without the dragged card.
        const target = over.after ? index + 1 : index;
        move(dragged, target > dragged ? target - 1 : target);
        setDragged(null);
        setOver(null);
    };

    return (
        <div className={className}>
            <ul className="flex flex-col gap-2" aria-label={label}>
                {items.map((item, index) => {
                    const card = renderItem(item, index);
                    const isOver = over?.index === index && dragged !== null && dragged !== index;
                    return (
                        <li
                            key={getKey(item)}
                            className={cn(
                                'relative flex items-stretch gap-2',
                                dragged === index && 'opacity-50',
                                itemClassName,
                            )}
                            onDragOver={(event) => {
                                if (!sortable || dragged === null) return;
                                event.preventDefault();
                                const box = event.currentTarget.getBoundingClientRect();
                                setOver({ index, after: event.clientY > box.top + box.height / 2 });
                            }}
                            onDragLeave={() => setOver((current) => (current?.index === index ? null : current))}
                            onDrop={(event) => {
                                if (!sortable) return;
                                event.preventDefault();
                                drop(index);
                            }}
                        >
                            {isOver && (
                                <span
                                    aria-hidden="true"
                                    className={cn('pointer-events-none absolute inset-x-0 h-0.5 rounded-full bg-primary', over!.after ? '-bottom-1.5' : '-top-1.5')}
                                />
                            )}
                            {sortable && (
                                <button
                                    type="button"
                                    draggable
                                    aria-label={interpolate(dict.handle, { position: index + 1, total: items.length })}
                                    className="flex w-6 shrink-0 cursor-grab items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring active:cursor-grabbing"
                                    onDragStart={(event) => {
                                        setDragged(index);
                                        event.dataTransfer.effectAllowed = 'move';
                                        event.dataTransfer.setData('text/plain', getKey(item));
                                    }}
                                    onDragEnd={() => {
                                        setDragged(null);
                                        setOver(null);
                                    }}
                                    onKeyDown={(event) => {
                                        if (event.key === 'ArrowUp') {
                                            event.preventDefault();
                                            move(index, index - 1);
                                        } else if (event.key === 'ArrowDown') {
                                            event.preventDefault();
                                            move(index, index + 1);
                                        }
                                    }}
                                >
                                    <Icon name="grip-vertical" size={16} />
                                </button>
                            )}
                            {numbered && (
                                <span className="flex w-6 shrink-0 items-center justify-center text-sm font-medium tabular-nums text-muted-foreground" aria-hidden="true">
                                    {index + 1}
                                </span>
                            )}
                            <ListCard compact wrapperClassName="min-w-0 flex-1" className={cardClassName} {...card} />
                        </li>
                    );
                })}
            </ul>
            <span className="sr-only" aria-live="polite">{announcement}</span>
        </div>
    );
}
