import React, {
    forwardRef,
    useCallback,
    useEffect,
    useId,
    useImperativeHandle,
    useMemo,
    useRef,
    useState,
} from 'react';
import { createPortal } from 'react-dom';
import { cn } from '../../../libs/cn';
import type { UIProps } from '../../types';
import Icon from '../Icon';

export interface ContextMenuItem {
    label: string;
    value: string;
    icon?: string;
    /** Secondary muted text under the label — e.g. a variable's description/type. */
    description?: string;
}

export interface EditorContext {
    value: string;
    textBeforeCaret: string;
    textAfterCaret: string;
    trigger: string;
    query: string;
    triggerRange: { start: number; end: number };
    insert: (text: string) => void;
    replace: (start: number, end: number, text: string) => void;
}

export interface TextCommandContext {
    value: string;
    textBeforeCaret: string;
    textAfterCaret: string;
    trigger: string;
    query: string;
}

export interface EditorCommand {
    name: string;
    description?: string;
    icon?: string;
    /** Groups commands under a `ContextMenu.Heading` in menu order — commands sharing the
     * same `group` string render contiguously under one heading (see CodeEditor.tsx's
     * `commandMenuItems`/render logic, which does the grouping/heading-insertion). Commands
     * without a `group` render ungrouped, in their original order. */
    group?: string;
    handler?: (context: TextCommandContext) => string | Promise<string>;
}

export interface ContextMenuControlledState {
    open: boolean;
    anchorPosition: { top: number; left: number } | null;
    query: string;
    editorContext: EditorContext;
    onClose: () => void;
}

export interface ContextMenuHandle {
    moveNext: () => void;
    movePrev: () => void;
    selectActive: () => void;
    close: () => void;
}

export const CONTEXT_MENU_SEARCH_THRESHOLD = 10;

interface ContextMenuProps extends UIProps {
    trigger: string;
    searchable?: boolean;
    controlled?: ContextMenuControlledState;
    onSelect?: (item: ContextMenuItem, context: EditorContext) => void;
    children: React.ReactNode;
}

interface ContextMenuItemProps extends UIProps {
    label: string;
    value: string;
    icon?: string;
    /** Secondary muted text under the label — e.g. a variable's description/type. */
    description?: string;
}

interface ContextMenuHeadingProps {
    children: React.ReactNode;
    className?: string;
}

interface ContextMenuSeparatorProps {
    className?: string;
}

type ContextMenuComponent = React.ForwardRefExoticComponent<
    ContextMenuProps & React.RefAttributes<ContextMenuHandle>
> & {
    Item: React.FC<ContextMenuItemProps>;
    Heading: React.FC<ContextMenuHeadingProps>;
    Separator: React.FC<ContextMenuSeparatorProps>;
};

type QueryMatch = {
    query: string;
    start: number;
    end: number;
};

type CommandTriggerMatchOptions = {
    queryPattern?: RegExp;
    requireWhitespacePrefix?: boolean;
};

type ContextMenuRuntimeState = {
    open: boolean;
    anchorPosition: { top: number; left: number } | null;
    query: string;
    editorContext: EditorContext | null;
};

const isSupportedTarget = (element: Element | null): element is HTMLTextAreaElement | HTMLInputElement => {
    if (element instanceof HTMLTextAreaElement) return true;
    if (!(element instanceof HTMLInputElement)) return false;

    const type = element.type.toLowerCase();
    return type === '' || ['text', 'search', 'email', 'url', 'tel'].includes(type);
};

const isVisibleTarget = (element: HTMLTextAreaElement | HTMLInputElement) =>
    element.getClientRects().length > 0
    && window.getComputedStyle(element).visibility !== 'hidden';

const getContainerTargets = (container: HTMLElement) =>
    Array.from(container.querySelectorAll('textarea, input'))
        .filter(isSupportedTarget);

const resolveActiveTarget = (
    container: HTMLElement,
    currentTarget: HTMLTextAreaElement | HTMLInputElement | null,
) => {
    const activeElement = document.activeElement;
    if (isSupportedTarget(activeElement) && container.contains(activeElement) && isVisibleTarget(activeElement)) {
        return activeElement;
    }

    if (currentTarget && container.contains(currentTarget) && isVisibleTarget(currentTarget)) {
        return currentTarget;
    }

    const targets = getContainerTargets(container);
    return targets.find(isVisibleTarget) ?? targets[0] ?? null;
};

const MenuItem: React.FC<ContextMenuItemProps & { onSelect?: (item: ContextMenuItem) => void; active?: boolean }> = ({
    label,
    value,
    icon,
    description,
    className,
    onSelect,
    active,
}) => {
    const handleMouseDown = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        event.stopPropagation();
        onSelect?.({ label, value, icon, description });
    };

    return (
        <button
            type="button"
            role="menuitem"
            className={cn(
                'flex w-full cursor-pointer select-none items-start gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground',
                active && 'bg-accent text-accent-foreground',
                className,
            )}
            onMouseDown={handleMouseDown}
        >
            {icon && <Icon name={icon} size={16} className="mt-0.5 shrink-0 text-muted-foreground" />}
            <span className="min-w-0 flex-1 text-left">
                <span className="block truncate">{label}</span>
                {description && <span className="block truncate text-xs text-muted-foreground">{description}</span>}
            </span>
        </button>
    );
};

const ContextMenuHeading: React.FC<ContextMenuHeadingProps> = ({ children, className }) => (
    <div className={cn('px-2 py-1.5 text-xs font-medium uppercase tracking-wide text-muted-foreground', className)}>
        {children}
    </div>
);

const ContextMenuSeparator: React.FC<ContextMenuSeparatorProps> = ({ className }) => (
    <div className={cn('-mx-1 my-1 h-px bg-border', className)} />
);

const COMPOUND_TYPES = new Set([ContextMenuHeading, ContextMenuSeparator]);

/**
 * Whether `textAfterCaret` (from `TextCommandContext`/`EditorContext`) already starts with
 * `closer`, optionally preceded by whitespace — typically because the editor's own
 * bracket/quote auto-closing inserted it when the user typed the opening one. A command
 * `handler` that would otherwise insert a closer of its own (e.g. `"{{ x }}"`) should check
 * this first and omit its own closer when true, to avoid a duplicate
 * (`"{{ x }}}}"` instead of the intended `"{{ x }}"`).
 */
export const hasAutoClosedSuffix = (textAfterCaret: string, closer: string): boolean => {
    if (!closer) return false;
    const escaped = closer.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return new RegExp(`^\\s*${escaped}`).test(textAfterCaret);
};

export const matchCommandTrigger = (
    value: string,
    caret: number,
    trigger: string,
    options?: CommandTriggerMatchOptions,
): QueryMatch | null => {
    if (!trigger) return null;
    const beforeCaret = value.slice(0, caret);
    const triggerIndex = beforeCaret.lastIndexOf(trigger);
    if (triggerIndex === -1) return null;

    if (options?.requireWhitespacePrefix) {
        const prefix = triggerIndex === 0 ? '' : beforeCaret[triggerIndex - 1];
        if (prefix && !/\s/.test(prefix)) return null;
    }

    const query = beforeCaret.slice(triggerIndex + trigger.length);
    if (options?.queryPattern ? !options.queryPattern.test(query) : /\s/.test(query)) return null;

    return {
        query,
        start: triggerIndex,
        end: caret,
    };
};

const getQueryMatch = (value: string, caret: number, trigger: string): QueryMatch | null =>
    matchCommandTrigger(value, caret, trigger);

export const buildTextCommandContext = (context: EditorContext): TextCommandContext => ({
    value: context.value.slice(0, context.triggerRange.start) + context.value.slice(context.triggerRange.end),
    textBeforeCaret: context.value.slice(0, context.triggerRange.start),
    textAfterCaret: context.value.slice(context.triggerRange.end),
    trigger: context.trigger,
    query: context.query,
});

const getNativeCaretCoordinates = (
    el: HTMLTextAreaElement | HTMLInputElement,
    match: QueryMatch,
): { top: number; left: number } | null => {
    const style = window.getComputedStyle(el);
    const rect = el.getBoundingClientRect();
    const lineHeight = parseFloat(style.lineHeight) || 20;
    const borderLeft = parseFloat(style.borderLeftWidth) || 0;
    const paddingLeft = parseFloat(style.paddingLeft) || 0;

    const textBeforeTrigger = el.value.slice(0, match.start);
    const lineStartIdx = textBeforeTrigger.lastIndexOf('\n') + 1;
    const lineText = el.value.slice(lineStartIdx, match.start);
    const lineNumber = textBeforeTrigger.split('\n').length - 1;

    const span = document.createElement('span');
    span.style.all = 'initial';
    const textProps = [
        'fontFamily', 'fontSize', 'fontWeight', 'fontStyle', 'fontVariant',
        'letterSpacing', 'wordSpacing', 'lineHeight', 'textAlign', 'textIndent',
        'textRendering', 'textTransform', 'whiteSpace', 'wordBreak', 'wordWrap',
    ];
    for (const prop of textProps) {
        const value = style.getPropertyValue(prop);
        if (value) span.style.setProperty(prop, value);
    }
    span.style.whiteSpace = 'pre';
    span.style.position = 'absolute';
    span.style.visibility = 'hidden';
    span.style.pointerEvents = 'none';
    span.style.margin = '0';
    span.style.padding = '0';
    span.style.border = '0';
    span.textContent = lineText;
    document.body.appendChild(span);
    const textWidth = span.offsetWidth;
    document.body.removeChild(span);

    return {
        left: rect.left + borderLeft + paddingLeft + textWidth - el.scrollLeft,
        top: rect.top + ((lineNumber + 1) * lineHeight) - el.scrollTop,
    };
};

const buildNativeEditorContext = (
    el: HTMLTextAreaElement | HTMLInputElement,
    trigger: string,
): EditorContext | null => {
    const selectionStart = el.selectionStart ?? el.value.length;
    const selectionEnd = el.selectionEnd ?? selectionStart;
    const value = el.value;
    const match = getQueryMatch(value, selectionStart, trigger);
    if (!match) return null;

    const buildContext = (nextValue: string, nextStart: number, nextEnd = nextStart): EditorContext => {
        const nextMatch = getQueryMatch(nextValue, nextStart, trigger) ?? {
            query: '',
            start: nextStart,
            end: nextStart,
        };
        return {
            value: nextValue,
            textBeforeCaret: nextValue.slice(0, nextStart),
            textAfterCaret: nextValue.slice(nextEnd),
            trigger,
            query: nextMatch.query,
            triggerRange: { start: nextMatch.start, end: nextMatch.end },
            insert: (text: string) => {
                const start = el.selectionStart ?? nextValue.length;
                const end = el.selectionEnd ?? start;
                const insertedValue = nextValue.slice(0, start) + text + nextValue.slice(end);
                el.value = insertedValue;
                el.dispatchEvent(new Event('input', { bubbles: true }));
                el.selectionStart = el.selectionEnd = start + text.length;
                el.focus();
            },
            replace: (start: number, end: number, text: string) => {
                const replacedValue = nextValue.slice(0, start) + text + nextValue.slice(end);
                el.value = replacedValue;
                el.dispatchEvent(new Event('input', { bubbles: true }));
                el.selectionStart = el.selectionEnd = start + text.length;
                el.focus();
            },
        };
    };

    return buildContext(value, selectionStart, selectionEnd);
};

const ContextMenu = forwardRef<ContextMenuHandle, ContextMenuProps>(({
    trigger,
    searchable = false,
    controlled,
    onSelect,
    children,
    before,
    after,
    wrapperClassName,
    className,
}, ref) => {
    const menuId = useId();
    const containerRef = useRef<HTMLDivElement>(null);
    const menuRef = useRef<HTMLDivElement>(null);
    const targetRef = useRef<HTMLTextAreaElement | HTMLInputElement | null>(null);
    const [activeIndex, setActiveIndex] = useState(0);
    const [nativeState, setNativeState] = useState<ContextMenuRuntimeState>({
        open: false,
        anchorPosition: null,
        query: '',
        editorContext: null,
    });

    const items = useMemo(() => {
        const collected: ContextMenuItem[] = [];
        React.Children.forEach(children, (child) => {
            if (React.isValidElement(child) && child.type === MenuItem) {
                collected.push({
                    label: child.props.label,
                    value: child.props.value,
                    icon: child.props.icon,
                    description: child.props.description,
                });
            }
        });
        return collected;
    }, [children]);

    const runtimeState = controlled ? {
        open: controlled.open,
        anchorPosition: controlled.anchorPosition,
        query: controlled.query,
        editorContext: controlled.editorContext,
    } : nativeState;

    const filteredItems = useMemo(() => {
        if (!runtimeState.query) return items;
        const q = runtimeState.query.toLowerCase();
        return items.filter((item) =>
            item.label.toLowerCase().includes(q) || item.value.toLowerCase().includes(q),
        );
    }, [items, runtimeState.query]);

    const closeMenu = useCallback(() => {
        if (controlled) {
            controlled.onClose();
            return;
        }
        setNativeState({
            open: false,
            anchorPosition: null,
            query: '',
            editorContext: null,
        });
    }, [controlled]);

    const selectItem = useCallback((item: ContextMenuItem) => {
        const editorContext = runtimeState.editorContext;
        if (!editorContext) return;

        if (onSelect) {
            onSelect(item, editorContext);
        } else {
            editorContext.replace(
                editorContext.triggerRange.start,
                editorContext.triggerRange.end,
                item.value,
            );
        }
        closeMenu();
    }, [closeMenu, onSelect, runtimeState.editorContext]);

    useImperativeHandle(ref, () => ({
        moveNext: () => {
            if (!runtimeState.open || filteredItems.length === 0) return;
            setActiveIndex((current) => (current + 1) % filteredItems.length);
        },
        movePrev: () => {
            if (!runtimeState.open || filteredItems.length === 0) return;
            setActiveIndex((current) => (current - 1 + filteredItems.length) % filteredItems.length);
        },
        selectActive: () => {
            if (!runtimeState.open || filteredItems.length === 0) return;
            selectItem(filteredItems[activeIndex] ?? filteredItems[0]);
        },
        close: () => {
            closeMenu();
        },
    }), [activeIndex, closeMenu, filteredItems, runtimeState.open, selectItem]);

    useEffect(() => {
        setActiveIndex(0);
    }, [runtimeState.query]);

    useEffect(() => {
        if (controlled) return;

        const container = containerRef.current;
        if (!container) return;

        const targets = getContainerTargets(container);
        if (targets.length === 0) return;
        targetRef.current = resolveActiveTarget(container, targetRef.current);

        const updateNativeState = () => {
            const currentTarget = resolveActiveTarget(container, targetRef.current);
            if (!currentTarget) return;
            targetRef.current = currentTarget;

            const caret = currentTarget.selectionStart ?? currentTarget.value.length;
            const match = getQueryMatch(currentTarget.value, caret, trigger);
            if (!match) {
                setNativeState((current) => current.open ? {
                    open: false,
                    anchorPosition: null,
                    query: '',
                    editorContext: null,
                } : current);
                return;
            }

            const anchorPosition = getNativeCaretCoordinates(currentTarget, match);
            const editorContext = buildNativeEditorContext(currentTarget, trigger);
            if (!anchorPosition || !editorContext) return;

            setNativeState({
                open: true,
                anchorPosition,
                query: match.query,
                editorContext,
            });
        };

        const onKeyDown = (event: Event) => {
            const keyEvent = event as KeyboardEvent;
            if (!nativeState.open) return;

            switch (keyEvent.key) {
                case 'ArrowDown':
                    if (filteredItems.length === 0) return;
                    keyEvent.preventDefault();
                    setActiveIndex((current) => (current + 1) % filteredItems.length);
                    return;
                case 'ArrowUp':
                    if (filteredItems.length === 0) return;
                    keyEvent.preventDefault();
                    setActiveIndex((current) => (current - 1 + filteredItems.length) % filteredItems.length);
                    return;
                case 'Enter':
                case 'Tab':
                    if (filteredItems.length === 0) return;
                    keyEvent.preventDefault();
                    selectItem(filteredItems[activeIndex] ?? filteredItems[0]);
                    return;
                case 'Escape':
                    keyEvent.preventDefault();
                    closeMenu();
                    return;
                default:
                    return;
            }
        };

        const onKeyUp = (event: Event) => {
            const keyEvent = event as KeyboardEvent;
            if (['ArrowDown', 'ArrowUp', 'Enter', 'Tab', 'Escape'].includes(keyEvent.key)) return;
            updateNativeState();
        };

        const onClick = () => {
            updateNativeState();
        };

        const onFocusIn = (event: FocusEvent) => {
            const focusedTarget = isSupportedTarget(event.target as Element)
                ? event.target as HTMLTextAreaElement | HTMLInputElement
                : null;
            targetRef.current = focusedTarget && isVisibleTarget(focusedTarget)
                ? focusedTarget
                : resolveActiveTarget(container, targetRef.current);
            updateNativeState();
        };

        const onBlur = () => {
            window.setTimeout(() => {
                const activeElement = document.activeElement;
                const insideMenu = menuRef.current?.contains(activeElement);
                const insideContainer = containerRef.current?.contains(activeElement);
                if (!insideMenu && !insideContainer) closeMenu();
            }, 0);
        };

        container.addEventListener('focusin', onFocusIn);
        targets.forEach((target) => {
            target.addEventListener('keydown', onKeyDown);
            target.addEventListener('keyup', onKeyUp);
            // Also react to `input`/`change` directly — `keyup` alone misses paste, IME
            // composition, and any programmatic value change that doesn't originate from a
            // physical keystroke (e.g. React Testing Library's `fireEvent.change`).
            target.addEventListener('input', onKeyUp);
            target.addEventListener('change', onKeyUp);
            target.addEventListener('click', onClick);
            target.addEventListener('blur', onBlur);
        });

        return () => {
            container.removeEventListener('focusin', onFocusIn);
            targets.forEach((target) => {
                target.removeEventListener('keydown', onKeyDown);
                target.removeEventListener('keyup', onKeyUp);
                target.removeEventListener('input', onKeyUp);
                target.removeEventListener('change', onKeyUp);
                target.removeEventListener('click', onClick);
                target.removeEventListener('blur', onBlur);
            });
        };
    }, [activeIndex, closeMenu, controlled, filteredItems, nativeState.open, selectItem, trigger]);

    useEffect(() => {
        if (!runtimeState.open) return;

        const handlePointerDown = (event: PointerEvent) => {
            const target = event.target as Node;
            const insideContainer = containerRef.current?.contains(target);
            const insideMenu = menuRef.current?.contains(target);
            if (!insideContainer && !insideMenu) {
                closeMenu();
            }
        };

        document.addEventListener('pointerdown', handlePointerDown);
        return () => document.removeEventListener('pointerdown', handlePointerDown);
    }, [closeMenu, runtimeState.open]);

    const { domChildren, renderedItems } = useMemo(() => {
        const dom: React.ReactNode[] = [];
        const menu: React.ReactNode[] = [];
        let selectableIndex = -1;

        React.Children.forEach(children, (child) => {
            if (!React.isValidElement(child)) {
                dom.push(child);
                return;
            }

            if (child.type === MenuItem) {
                const item = child.props as ContextMenuItemProps;
                const visibleIndex = filteredItems.findIndex(
                    (candidate) => candidate.label === item.label && candidate.value === item.value && candidate.icon === item.icon,
                );

                if (visibleIndex === -1) return;
                selectableIndex += 1;

                menu.push(React.cloneElement(
                    child as React.ReactElement<ContextMenuItemProps & { onSelect?: (item: ContextMenuItem) => void; active?: boolean }>,
                    {
                        onSelect: selectItem,
                        active: selectableIndex === activeIndex,
                    },
                ));
                return;
            }

            if (COMPOUND_TYPES.has(child.type as React.FC)) {
                menu.push(child);
                return;
            }

            dom.push(child);
        });

        return { domChildren: dom, renderedItems: menu };
    }, [activeIndex, children, filteredItems, selectItem]);

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
            {runtimeState.open && runtimeState.anchorPosition && filteredItems.length > 0 && createPortal(
                <div
                    ref={menuRef}
                    role="menu"
                    id={menuId}
                    className="fixed z-[200] min-w-44 overflow-y-auto rounded-md border bg-popover p-1 text-popover-foreground shadow-md outline-none"
                    style={{
                        top: runtimeState.anchorPosition.top,
                        left: runtimeState.anchorPosition.left,
                        maxHeight: 240,
                    }}
                >
                    {renderedItems}
                </div>,
                document.body,
            )}
        </>
    );
}) as ContextMenuComponent;

ContextMenu.displayName = 'ContextMenu';
ContextMenu.Item = MenuItem;
ContextMenu.Heading = ContextMenuHeading;
ContextMenu.Separator = ContextMenuSeparator;

export { ContextMenu };
