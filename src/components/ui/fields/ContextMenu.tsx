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
    const menuRef = useRef<HTMLDivElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement | HTMLInputElement | null>(null);
    const [open, setOpen] = useState(false);
    const [filter, setFilter] = useState('');
    const [caretPos, setCaretPos] = useState<{ top: number; left: number } | null>(null);
    const [activeIndex, setActiveIndex] = useState(0);

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

        const style = window.getComputedStyle(el);
        const rect = el.getBoundingClientRect();

        const lineHeight = parseFloat(style.lineHeight) || 20;
        const bl = parseFloat(style.borderLeftWidth) || 0;
        const pl = parseFloat(style.paddingLeft) || 0;

        const textBefore = el.value.slice(0, pos);
        let line = 0;
        for (let i = pos - 1; i >= 0; i--) {
            if (textBefore[i] === '\n') line++;
        }

        const lineStartIdx = textBefore.lastIndexOf('\n', triggerIdx - 1) + 1;
        const textBeforeTriggerOnLine = el.value.slice(lineStartIdx, triggerIdx);

        /* Misura larghezza testo con uno span mirror che replica fedelmente il
           font rendering della textarea (all:initial + copia proprietà testuali). */
        const span = document.createElement('span');
        span.style.all = 'initial';
        const textProps: string[] = [
            'fontFamily', 'fontSize', 'fontWeight', 'fontStyle', 'fontVariant',
            'letterSpacing', 'wordSpacing', 'lineHeight', 'textAlign', 'textIndent',
            'textRendering', 'textTransform', 'whiteSpace', 'wordBreak', 'wordWrap',
        ];
        for (const p of textProps) {
            const val = style.getPropertyValue(p);
            if (val) span.style.setProperty(p, val);
        }
        span.style.whiteSpace = 'pre';
        span.style.position = 'absolute';
        span.style.visibility = 'hidden';
        span.style.pointerEvents = 'none';
        span.style.margin = '0';
        span.style.padding = '0';
        span.style.border = '0';
        span.textContent = textBeforeTriggerOnLine;
        document.body.appendChild(span);
        const textWidth = span.offsetWidth;
        document.body.removeChild(span);

        return {
            left: rect.left + bl + pl + textWidth - el.scrollLeft,
            top: rect.top + (line + 1) * lineHeight - el.scrollTop,
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

    const openRef = useRef(open);
    const activeIndexRef = useRef(activeIndex);
    const filteredItemsRef = useRef(filteredItems);
    const closeRef = useRef(close);
    const selectItemRef = useRef<((item: { label: string; value: string; icon?: string }) => void) | null>(null);

    openRef.current = open;
    activeIndexRef.current = activeIndex;
    filteredItemsRef.current = filteredItems;
    closeRef.current = close;
    selectItemRef.current = selectItem;

    useEffect(() => {
        const els = containerRef.current?.querySelectorAll<HTMLTextAreaElement | HTMLInputElement>('textarea, input');
        if (!els || els.length === 0) return;
        textareaRef.current = els[0];

        const onKeyDown = (e: Event) => {
            if (!openRef.current) return;
            const ke = e as KeyboardEvent;
            const target = e.target as HTMLTextAreaElement | HTMLInputElement;
            switch (ke.key) {
                case 'ArrowDown':
                    ke.preventDefault();
                    setActiveIndex((prev) => (prev + 1) % filteredItemsRef.current.length);
                    break;
                case 'ArrowUp':
                    ke.preventDefault();
                    setActiveIndex((prev) => (prev - 1 + filteredItemsRef.current.length) % filteredItemsRef.current.length);
                    break;
                case 'Enter':
                case 'Tab':
                    if (filteredItemsRef.current.length === 0) break;
                    ke.preventDefault();
                    selectItemRef.current?.(filteredItemsRef.current[activeIndexRef.current] ?? filteredItemsRef.current[0]);
                    break;
                case 'Escape':
                    ke.preventDefault();
                    closeRef.current();
                    break;
                default:
                    if (searchable) {
                        const pos = target.selectionStart ?? 0;
                        const parts = target.value.slice(0, pos).split(trigger);
                        setFilter(parts[parts.length - 1] ?? '');
                    }
                    break;
            }
        };

        const onKeyUp = (e: Event) => {
            if (openRef.current) return;
            const ke = e as KeyboardEvent;
            if (ke.key !== trigger) return;
            const target = e.target as HTMLTextAreaElement | HTMLInputElement;
            textareaRef.current = target;

            const pos = target.selectionStart ?? 0;
            if (pos > 0 && target.value[pos - 1] === trigger) {
                setFilter('');
                setActiveIndex(0);
                const coords = getCaretCoordinates(target);
                if (coords) {
                    setCaretPos(coords);
                    setOpen(true);
                }
            }
        };

        els.forEach((el) => {
            el.addEventListener('keydown', onKeyDown);
            el.addEventListener('keyup', onKeyUp);
        });
        return () => {
            els.forEach((el) => {
                el.removeEventListener('keydown', onKeyDown);
                el.removeEventListener('keyup', onKeyUp);
            });
        };
    }, [trigger, searchable, getCaretCoordinates]);

    useEffect(() => {
        if (!open) return;
            const handlePointerDown = (e: PointerEvent) => {
            const target = e.target as Node;
            const insideContainer = containerRef.current?.contains(target);
            const insideMenu = menuRef.current?.contains(target);
            if (!insideContainer && !insideMenu) {
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
                        ref={menuRef}
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
