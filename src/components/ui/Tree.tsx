import React, { useCallback, useMemo, useRef, useState } from 'react';
import { useTheme } from '../../Theme';
import { useI18n } from '../../I18n';
import { cn } from '../../libs/cn';
import Icon from './Icon';

/**
 * One node of a `<Tree>`.
 *
 * A node with `children` is a folder (expandable/collapsible); a node without
 * children is a file. `id` must be unique and stable.
 */
export interface TreeNode {
    /** Unique, stable identifier — also used as the keyboard/focus key. */
    id: string;
    label: React.ReactNode;
    /** Optional leading icon: a provider icon name or any React node. */
    icon?: React.ReactNode;
    /** Optional trailing badge. */
    badge?: React.ReactNode;
    /** Optional secondary text shown after the label. */
    description?: React.ReactNode;
    /** Child nodes — presence makes this node a folder. */
    children?: TreeNode[];
    /** Disabled nodes are rendered but cannot be selected. */
    disabled?: boolean;
}

export interface TreeProps {
    nodes: readonly TreeNode[];
    /** Controlled expanded ids. Pass together with `onExpandedChange`. */
    expanded?: readonly string[];
    /** Initial expanded ids for uncontrolled usage. Default: none. */
    defaultExpanded?: readonly string[];
    /** Called with the next expanded ids on every toggle. */
    onExpandedChange?: (expanded: string[]) => void;
    /** Controlled selected id (`null` = nothing selected). Pass with `onSelect`. */
    selectedId?: string | null;
    /** Initial selected id for uncontrolled usage. Default: none. */
    defaultSelectedId?: string | null;
    /** Called with the selected node on click, Enter or Space. */
    onSelect?: (node: TreeNode) => void;
    /** Accessible name of the tree. Defaults to the `tree.label` translation. */
    ariaLabel?: string;
    /** Classes on the `role="tree"` container. */
    className?: string;
    /** Classes on every row. */
    itemClassName?: string;
    /** Extra classes on the selected row. */
    selectedClassName?: string;
}

interface FlatNode {
    node: TreeNode;
    level: number;
    parentId: string | null;
    hasChildren: boolean;
}

function flattenNodes(
    nodes: readonly TreeNode[],
    expanded: ReadonlySet<string>,
    level = 1,
    parentId: string | null = null,
    out: FlatNode[] = [],
): FlatNode[] {
    for (const node of nodes) {
        const hasChildren = Array.isArray(node.children) && node.children.length > 0;
        out.push({ node, level, parentId, hasChildren });
        if (hasChildren && expanded.has(node.id)) {
            flattenNodes(node.children!, expanded, level + 1, node.id, out);
        }
    }
    return out;
}

/**
 * Accessible tree of folders and files (WAI-ARIA `tree` pattern).
 *
 * Folders open/close, one node can be selected. Expansion and selection can be
 * controlled or uncontrolled. Keyboard: ↑/↓ move between visible nodes, → opens
 * a folder / enters its first child, ← closes a folder / jumps to the parent,
 * Home/End go to the first/last visible node, Enter/Space select.
 */
export default function Tree({
    nodes,
    expanded,
    defaultExpanded,
    onExpandedChange,
    selectedId,
    defaultSelectedId = null,
    onSelect,
    ariaLabel,
    className,
    itemClassName,
    selectedClassName,
}: TreeProps) {
    const theme = useTheme('tree').Tree;
    const dict = useI18n('tree');

    const expansionControlled = expanded !== undefined;
    const selectionControlled = selectedId !== undefined;

    const [uncontrolledExpanded, setUncontrolledExpanded] = useState<Set<string>>(
        () => new Set(defaultExpanded ?? []),
    );
    const [uncontrolledSelected, setUncontrolledSelected] = useState<string | null>(defaultSelectedId);
    const [focusedId, setFocusedId] = useState<string | null>(null);

    const itemRefs = useRef(new Map<string, HTMLDivElement>());

    const expandedSet = useMemo(
        () => new Set<string>(expansionControlled ? expanded : uncontrolledExpanded),
        [expansionControlled, expanded, uncontrolledExpanded],
    );
    const selected = selectionControlled ? selectedId : uncontrolledSelected;

    const visible = useMemo(() => flattenNodes(nodes, expandedSet), [nodes, expandedSet]);

    const tabbableId = useMemo(() => {
        if (focusedId && visible.some((entry) => entry.node.id === focusedId)) return focusedId;
        if (selected && visible.some((entry) => entry.node.id === selected)) return selected;
        return visible[0]?.node.id ?? null;
    }, [focusedId, selected, visible]);

    const applyExpanded = useCallback((next: Set<string>) => {
        if (expansionControlled) onExpandedChange?.([...next]);
        else setUncontrolledExpanded(next);
    }, [expansionControlled, onExpandedChange]);

    const toggleExpanded = useCallback((id: string, force?: boolean) => {
        const next = new Set(expandedSet);
        const shouldExpand = force ?? !next.has(id);
        if (shouldExpand) next.add(id);
        else next.delete(id);
        applyExpanded(next);
    }, [expandedSet, applyExpanded]);

    const selectNode = useCallback((node: TreeNode) => {
        if (node.disabled) return;
        if (!selectionControlled) setUncontrolledSelected(node.id);
        onSelect?.(node);
    }, [selectionControlled, onSelect]);

    const focusAt = useCallback((index: number) => {
        const target = visible[index];
        if (!target) return;
        setFocusedId(target.node.id);
        itemRefs.current.get(target.node.id)?.focus();
    }, [visible]);

    const handleKeyDown = useCallback((event: React.KeyboardEvent<HTMLDivElement>) => {
        const target = event.target as HTMLElement | null;
        const targetId = target?.closest('[data-tree-id]')?.getAttribute('data-tree-id') ?? null;
        const currentId = targetId ?? tabbableId;
        if (!currentId) return;
        const index = visible.findIndex((entry) => entry.node.id === currentId);
        if (index < 0) return;
        const current = visible[index];

        switch (event.key) {
            case 'ArrowDown':
                event.preventDefault();
                focusAt(Math.min(index + 1, visible.length - 1));
                break;
            case 'ArrowUp':
                event.preventDefault();
                focusAt(Math.max(index - 1, 0));
                break;
            case 'ArrowRight':
                event.preventDefault();
                if (!current.hasChildren) break;
                if (!expandedSet.has(current.node.id)) toggleExpanded(current.node.id, true);
                else focusAt(index + 1);
                break;
            case 'ArrowLeft': {
                event.preventDefault();
                if (current.hasChildren && expandedSet.has(current.node.id)) {
                    toggleExpanded(current.node.id, false);
                } else if (current.parentId) {
                    const parentIndex = visible.findIndex((entry) => entry.node.id === current.parentId);
                    if (parentIndex >= 0) focusAt(parentIndex);
                }
                break;
            }
            case 'Home':
                event.preventDefault();
                focusAt(0);
                break;
            case 'End':
                event.preventDefault();
                focusAt(visible.length - 1);
                break;
            case 'Enter':
            case ' ':
                event.preventDefault();
                selectNode(current.node);
                break;
            default:
                break;
        }
    }, [tabbableId, visible, expandedSet, focusAt, toggleExpanded, selectNode]);

    const renderNodes = (list: readonly TreeNode[], level: number): React.ReactNode =>
        list.map((node) => {
            const hasChildren = Array.isArray(node.children) && node.children.length > 0;
            const isExpanded = expandedSet.has(node.id);
            const isSelected = selected === node.id;

            return (
                <div
                    key={node.id}
                    role="treeitem"
                    aria-level={level}
                    aria-expanded={hasChildren ? isExpanded : undefined}
                    aria-selected={isSelected}
                    aria-disabled={node.disabled || undefined}
                    data-tree-id={node.id}
                    data-selected={isSelected ? 'true' : undefined}
                    tabIndex={tabbableId === node.id ? 0 : -1}
                    ref={(element) => {
                        if (element) itemRefs.current.set(node.id, element);
                        else itemRefs.current.delete(node.id);
                    }}
                    onFocus={() => setFocusedId(node.id)}
                    className="outline-none"
                >
                    <div
                        data-tree-row={node.id}
                        onClick={() => {
                            setFocusedId(node.id);
                            if (hasChildren) toggleExpanded(node.id);
                            selectNode(node);
                            itemRefs.current.get(node.id)?.focus();
                        }}
                        style={{ paddingLeft: `${(level - 1) * 16 + 8}px` }}
                        className={cn(
                            'flex items-center gap-1.5 rounded-md py-1 pr-2 text-sm transition-colors cursor-pointer',
                            'hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring',
                            node.disabled && 'opacity-50 cursor-not-allowed',
                            itemClassName || theme?.itemClassName,
                            isSelected && (selectedClassName || theme?.selectedClassName),
                            isSelected && 'bg-primary/10 font-medium text-primary',
                        )}
                    >
                        {hasChildren ? (
                            <button
                                type="button"
                                tabIndex={-1}
                                aria-label={isExpanded ? dict.collapse : dict.expand}
                                onClick={(event) => {
                                    event.stopPropagation();
                                    toggleExpanded(node.id);
                                    itemRefs.current.get(node.id)?.focus();
                                }}
                                className="flex h-4 w-4 shrink-0 items-center justify-center text-muted-foreground"
                            >
                                <Icon name={isExpanded ? 'chevron-down' : 'chevron-right'} size={14} />
                            </button>
                        ) : (
                            <span aria-hidden className="h-4 w-4 shrink-0" />
                        )}

                        {typeof node.icon === 'string'
                            ? <Icon name={node.icon} size={15} className="shrink-0 text-muted-foreground" />
                            : node.icon}

                        <span className="truncate">{node.label}</span>

                        {node.description !== undefined && (
                            <span className="truncate text-xs text-muted-foreground">{node.description}</span>
                        )}

                        {node.badge !== undefined && (
                            <span className="ml-auto shrink-0 rounded-full bg-primary/15 px-1.5 py-[3px] text-[10px] font-semibold leading-none text-primary">
                                {node.badge}
                            </span>
                        )}
                    </div>

                    {hasChildren && isExpanded && (
                        <div role="group">
                            {renderNodes(node.children!, level + 1)}
                        </div>
                    )}
                </div>
            );
        });

    return (
        <div
            role="tree"
            aria-label={ariaLabel ?? dict.label}
            onKeyDown={handleKeyDown}
            className={cn('text-sm select-none', className || theme?.className)}
        >
            {renderNodes(nodes, 1)}
        </div>
    );
}
