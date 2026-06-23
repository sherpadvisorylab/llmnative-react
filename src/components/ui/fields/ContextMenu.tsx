import React, { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '../../../libs/cn';
import type { UIProps } from '../../types';
import Icon from '../Icon';

export interface ContextMenuItem {
    label: string;
    value: string;
    icon?: string;
}

export interface EditorContext {
    textBeforeCaret: string;
    textAfterCaret: string;
    insert: (text: string) => void;
    replace: (start: number, end: number, text: string) => void;
}

interface ContextMenuProps extends UIProps {
    trigger: string;
    searchable?: boolean;
    onSelect?: (item: ContextMenuItem, context: EditorContext) => void;
    children: React.ReactNode;
}

interface ContextMenuItemProps extends UIProps {
    label: string;
    value: string;
    icon?: string;
}

interface ContextMenuHeadingProps {
    children: React.ReactNode;
    className?: string;
}

interface ContextMenuSeparatorProps {
    className?: string;
}

type ContextMenuComponent = React.FC<ContextMenuProps> & {
    Item: React.FC<ContextMenuItemProps>;
    Heading: React.FC<ContextMenuHeadingProps>;
    Separator: React.FC<ContextMenuSeparatorProps>;
};

const MenuItem: React.FC<ContextMenuItemProps & { onSelect?: (item: ContextMenuItem) => void; active?: boolean }> = ({
    label,
    value,
    icon,
    className,
    onSelect,
    active,
}) => (
    <button
        type="button"
        role="menuitem"
        className={cn(
            'flex w-full cursor-pointer select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground',
            active && 'bg-accent text-accent-foreground',
            className
        )}
        onClick={() => onSelect?.({ label, value, icon })}
        onPointerDown={(e) => e.preventDefault()}
    >
        {icon && <Icon name={icon} size={16} className="shrink-0 text-muted-foreground" />}
        <span className="min-w-0 truncate">{label}</span>
    </button>
);

const ContextMenuHeading: React.FC<ContextMenuHeadingProps> = ({ children, className }) => (
    <div className={cn('px-2 py-1.5 text-xs font-medium uppercase tracking-wide text-muted-foreground', className)}>
        {children}
    </div>
);

const ContextMenuSeparator: React.FC<ContextMenuSeparatorProps> = ({ className }) => (
    <div className={cn('-mx-1 my-1 h-px bg-border', className)} />
);

const COMPOUND_TYPES = new Set([ContextMenuHeading, ContextMenuSeparator]);

const ContextMenu: ContextMenuComponent = ({
    trigger,
    searchable = false,
    onSelect,
    children,
    before,
    after,
    wrapperClassName,
    className,
}) => {
    const menuId = useId();
    const containerRef = useRef<HTMLDivElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement | HTMLInputElement | null>(null);
    const [open, setOpen] = useState(false);
    const [filter, setFilter] = useState('');
    const [caretPos, setCaretPos] = useState<{ top: number; left: number } | null>(null);
    const [activeIndex, setActiveIndex] = useState(0);
    const selectItemRef = useRef<((item: { label: string; value: string; icon?: string }) => void) | null>(null);

    const items = useMemo(() => {
        const collected: { label: string; value: string; icon?: string }[] = [];
        React.Children.forEach(children, (child) => {
            if (React.isValidElement(child) && child.type === MenuItem) {
                collected.push({
                    label: child.props.label,
                    value: child.props.value,
                    icon: child.props.icon,
                });
            }
        });
        return collected;
    }, [children]);

    const filteredItems = useMemo(() => {
        if (!searchable || !filter) return items;
        const q = filter.toLowerCase();
        return items.filter((item) => item.label.toLowerCase().includes(q) || item.value.toLowerCase().includes(q));
    }, [items, searchable, filter]);

    const getCaretCoordinates = useCallback((el: HTMLTextAreaElement | HTMLInputElement): { top: number; left: number } | null => {
        const pos = el.selectionStart ?? 0;
        const triggerIdx = el.value.lastIndexOf(trigger, pos - 1);
        if (triggerIdx === -1) return null;

        const textBefore = el.value.slice(0, pos);
        let line = 0;
        let col = 0;
        for (let i = pos - 1; i >= 0; i--) {
            if (textBefore[i] === '\n') { line++; col = 0; }
            else { col++; }
        }
        const colAtTrigger = (() => {
            let c = 0;
            for (let i = triggerIdx - 1; i >= 0; i--) {
                if (textBefore[i] === '\n') break;
                c++;
            }
            return c;
        })();

        const charWidth = 8;
        const lineHeight = 20;
        const scrollTop = el.scrollTop;
        const rect = el.getBoundingClientRect();

        return {
            left: rect.left + colAtTrigger * charWidth + 4,
            top: rect.top + (line - (scrollTop / lineHeight)) * lineHeight + lineHeight + 4,
        };
    }, [trigger]);

    const buildEditorContext = useCallback((el: HTMLTextAreaElement | HTMLInputElement): EditorContext | null => {
        const pos = el.selectionStart ?? 0;
        const fullText = el.value;
        const triggerIdx = fullText.lastIndexOf(trigger, pos - 1);
        if (triggerIdx === -1) return null;

        return {
            textBeforeCaret: fullText.slice(0, pos),
            textAfterCaret: fullText.slice(pos),
            insert: (text: string) => {
                const start = el.selectionStart ?? fullText.length;
                const end = el.selectionEnd ?? start;
                const newValue = fullText.slice(0, start) + text + fullText.slice(end);
                el.value = newValue;
                el.dispatchEvent(new Event('input', { bubbles: true }));
                el.selectionStart = el.selectionEnd = start + text.length;
                el.focus();
            },
            replace: (start: number, end: number, text: string) => {
                const newValue = fullText.slice(0, start) + text + fullText.slice(end);
                el.value = newValue;
                el.dispatchEvent(new Event('input', { bubbles: true }));
                el.selectionStart = el.selectionEnd = start + text.length;
                el.focus();
            },
        };
    }, [trigger]);

    const close = useCallback(() => {
        setOpen(false);
        setFilter('');
        setCaretPos(null);
        setActiveIndex(0);
    }, []);

    const selectItem = useCallback((item: { label: string; value: string; icon?: string }) => {
        const el = textareaRef.current;
        if (!el) return;

        if (onSelect) {
            const ctx = buildEditorContext(el);
            if (ctx) {
                onSelect(item, ctx);
            }
        } else {
            const pos = el.selectionStart ?? el.value.length;
            const fullText = el.value;
            const triggerIdx = fullText.lastIndexOf(trigger, pos - 1);
            if (triggerIdx !== -1) {
                const beforeTrigger = fullText.slice(0, triggerIdx);
                const after = fullText.slice(pos);
                el.value = beforeTrigger + item.value + after;
                el.dispatchEvent(new Event('input', { bubbles: true }));
                el.selectionStart = el.selectionEnd = beforeTrigger.length + item.value.length;
                el.focus();
            }
        }
        close();
    }, [onSelect, buildEditorContext, trigger, close]);

    selectItemRef.current = selectItem;

    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        const target = e.target as HTMLElement;
        if (!containerRef.current?.contains(target)) return;
        if (target.tagName !== 'TEXTAREA' && target.tagName !== 'INPUT') return;

        const el = target as HTMLTextAreaElement | HTMLInputElement;
        textareaRef.current = el;

        if (!open) {
            if (e.key === trigger) {
                const pos = el.selectionStart ?? 0;
                if (pos > 0 && el.value[pos - 1] === trigger) {
                    e.preventDefault();
                    setFilter('');
                    setActiveIndex(0);
                    const coords = getCaretCoordinates(el);
                    if (coords) {
                        setCaretPos(coords);
                        setOpen(true);
                    }
                }
            }
            return;
        }

        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                setActiveIndex((prev) => (prev + 1) % filteredItems.length);
                break;
            case 'ArrowUp':
                e.preventDefault();
                setActiveIndex((prev) => (prev - 1 + filteredItems.length) % filteredItems.length);
                break;
            case 'Enter':
            case 'Tab':
                if (filteredItems.length === 0) break;
                e.preventDefault();
                selectItemRef.current?.(filteredItems[activeIndex] ?? filteredItems[0]);
                break;
            case 'Escape':
                e.preventDefault();
                close();
                break;
            default:
                if (searchable) {
                    const pos = el.selectionStart ?? 0;
                    const parts = el.value.slice(0, pos).split(trigger);
                    setFilter(parts[parts.length - 1] ?? '');
                }
                break;
        }
    }, [open, trigger, searchable, filteredItems, activeIndex, getCaretCoordinates, close]);

    useEffect(() => {
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [handleKeyDown]);

    useEffect(() => {
        if (!open) return;
        const handlePointerDown = (e: PointerEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                close();
            }
        };
        document.addEventListener('pointerdown', handlePointerDown);
        return () => document.removeEventListener('pointerdown', handlePointerDown);
    }, [open, close]);

    const { domChildren, renderedItems } = useMemo(() => {
        const dom: React.ReactNode[] = [];
        const menu: React.ReactNode[] = [];
        React.Children.forEach(children, (child) => {
            if (!React.isValidElement(child)) { dom.push(child); return; }
            if (child.type === MenuItem) {
                const item = child.props as ContextMenuItemProps;
                const idx = items.findIndex((i) => i.label === item.label && i.value === item.value);
                const visible = !searchable || !filter || filteredItems.some((f) => f.label === item.label);
                if (!visible) {
                    menu.push(null);
                    return;
                }
                menu.push(React.cloneElement(child as React.ReactElement<ContextMenuItemProps & { onSelect?: (item: ContextMenuItem) => void; active?: boolean }>, {
                    onSelect: (selected: ContextMenuItem) => selectItemRef.current?.(selected),
                    active: idx === activeIndex,
                }));
                return;
            }
            if (COMPOUND_TYPES.has(child.type as React.FC)) {
                menu.push(child);
                return;
            }
            dom.push(child);
        });
        return { domChildren: dom, renderedItems: menu };
    }, [children, searchable, filter, filteredItems, items, activeIndex]);

    return (
        <>
            <div
                ref={containerRef}
                className={cn(className, wrapperClassName)}
            >
                {before}
                {domChildren}
                {after}
            </div>
            {open && caretPos && createPortal(
                <div
                    role="menu"
                    className="fixed z-[200] min-w-44 overflow-y-auto rounded-md border bg-popover p-1 text-popover-foreground shadow-md outline-none"
                    style={{ top: caretPos.top, left: caretPos.left, maxHeight: 240 }}
                    id={menuId}
                >
                    {renderedItems}
                    {filteredItems.length === 0 && searchable && filter && (
                        <div className="px-2 py-1.5 text-xs text-muted-foreground">
                            No matches
                        </div>
                    )}
                </div>,
                document.body
            )}
        </>
    );
};

ContextMenu.Item = MenuItem;
ContextMenu.Heading = ContextMenuHeading;
ContextMenu.Separator = ContextMenuSeparator;

export { ContextMenu };
