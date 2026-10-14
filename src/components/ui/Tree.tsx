import React, { useMemo, useRef, useState } from "react";
import { useTheme } from "../../Theme";
import { cn } from "../../libs/cn";
import Icon from "./Icon";

/** One node of a `<Tree>`: a leaf, or a branch with `children`. */
export interface TreeNode {
    /** Unique in the tree: it is what `selectedId`, `expanded` and `onSelect` speak of. */
    id: string;
    label: React.ReactNode;
    /** Icon name; branches default to a folder, leaves to a file. */
    icon?: string;
    /** Shown after the label, e.g. a count or a status. */
    badge?: React.ReactNode;
    /** Muted text after the label, e.g. what a file is for. */
    description?: React.ReactNode;
    children?: TreeNode[];
    disabled?: boolean;
}

export interface TreeProps {
    nodes: readonly TreeNode[];
    /** Selected node (controlled). */
    selectedId?: string | null;
    /** Selected node at start (uncontrolled). */
    defaultSelectedId?: string | null;
    onSelect?: (node: TreeNode) => void;
    /** Open branches (controlled). */
    expanded?: readonly string[];
    /** Open branches at start (uncontrolled); `true` opens them all. */
    defaultExpanded?: readonly string[] | true;
    onExpandedChange?: (expanded: string[]) => void;
    /** Branches can be selected too, not only opened. Default `false`. */
    selectableBranches?: boolean;
    /** Accessible name of the tree. */
    ariaLabel?: string;
    wrapperClassName?: string;
    className?: string;
    itemClassName?: string;
    selectedClassName?: string;
}

const isBranch = (node: TreeNode) => !!node.children?.length;

function branchIds(nodes: readonly TreeNode[]): string[] {
    return nodes.flatMap((node) => (isBranch(node) ? [node.id, ...branchIds(node.children!)] : []));
}

type Row = { node: TreeNode; level: number; parent?: TreeNode };

/** The nodes in reading order, inside open branches only. */
function visibleRows(nodes: readonly TreeNode[], open: Set<string>, level = 1, parent?: TreeNode): Row[] {
    return nodes.flatMap((node) => [
        { node, level, parent },
        ...(isBranch(node) && open.has(node.id) ? visibleRows(node.children!, open, level + 1, node) : []),
    ]);
}

/**
 * A tree of nodes (folders and files, a hierarchy), WAI-ARIA tree pattern: one tab stop, arrows to
 * move, → / ← to open and close, Enter or Space to select. Branches open on click; leaves are
 * selected. Expansion and selection work controlled or uncontrolled.
 */
export default function Tree({
    nodes,
    selectedId = undefined,
    defaultSelectedId = null,
    onSelect = undefined,
    expanded = undefined,
    defaultExpanded = undefined,
    onExpandedChange = undefined,
    selectableBranches = false,
    ariaLabel = undefined,
    wrapperClassName = undefined,
    className = undefined,
    itemClassName = undefined,
    selectedClassName = undefined,
}: TreeProps) {
    const theme = useTheme("tree").Tree;
    const [ownExpanded, setOwnExpanded] = useState<string[]>(() => (defaultExpanded === true ? branchIds(nodes) : [...(defaultExpanded ?? [])]));
    const [ownSelected, setOwnSelected] = useState<string | null>(defaultSelectedId);
    const open = useMemo(() => new Set(expanded ?? ownExpanded), [expanded, ownExpanded]);
    const selected = selectedId !== undefined ? selectedId : ownSelected;
    const rows = useMemo(() => visibleRows(nodes, open), [nodes, open]);
    const [focusedId, setFocusedId] = useState<string | null>(null);
    const refs = useRef(new Map<string, HTMLDivElement>());
    // The tab stop: the focused row, else the selected one, else the first.
    const tabStop = rows.find((row) => row.node.id === focusedId)?.node.id
        ?? rows.find((row) => row.node.id === selected)?.node.id
        ?? rows[0]?.node.id;

    const setOpen = (id: string, value: boolean) => {
        const next = value ? [...open, id] : [...open].filter((candidate) => candidate !== id);
        if (expanded === undefined) setOwnExpanded(next);
        onExpandedChange?.(next);
    };
    const select = (node: TreeNode) => {
        if (node.disabled) return;
        if (selectedId === undefined) setOwnSelected(node.id);
        onSelect?.(node);
    };
    const focus = (id: string | undefined) => {
        if (!id) return;
        setFocusedId(id);
        refs.current.get(id)?.focus();
    };
    const activate = (node: TreeNode) => {
        if (isBranch(node)) {
            setOpen(node.id, !open.has(node.id));
            if (selectableBranches) select(node);
        } else {
            select(node);
        }
    };

    const onKeyDown = (event: React.KeyboardEvent, row: Row) => {
        const index = rows.findIndex((candidate) => candidate.node.id === row.node.id);
        const branch = isBranch(row.node);
        switch (event.key) {
            case "ArrowDown": focus(rows[index + 1]?.node.id); break;
            case "ArrowUp": focus(rows[index - 1]?.node.id); break;
            case "Home": focus(rows[0]?.node.id); break;
            case "End": focus(rows[rows.length - 1]?.node.id); break;
            case "ArrowRight":
                if (branch && !open.has(row.node.id)) setOpen(row.node.id, true);
                else if (branch) focus(row.node.children![0]?.id);
                break;
            case "ArrowLeft":
                if (branch && open.has(row.node.id)) setOpen(row.node.id, false);
                else focus(row.parent?.id);
                break;
            case "Enter":
            case " ":
                activate(row.node);
                break;
            default: return;
        }
        event.preventDefault();
    };

    const renderNodes = (list: readonly TreeNode[], level: number, parent?: TreeNode): React.ReactNode => list.map((node) => {
        const branch = isBranch(node);
        const isOpen = branch && open.has(node.id);
        const isSelected = selected === node.id;
        const row: Row = { node, level, parent };
        return (
            <div key={node.id} role="none">
                <div
                    ref={(element) => { if (element) refs.current.set(node.id, element); else refs.current.delete(node.id); }}
                    role="treeitem"
                    aria-level={level}
                    aria-expanded={branch ? isOpen : undefined}
                    aria-selected={!branch || selectableBranches ? isSelected : undefined}
                    aria-disabled={node.disabled || undefined}
                    tabIndex={node.id === tabStop ? 0 : -1}
                    data-selected={isSelected || undefined}
                    className={cn(
                        "flex cursor-pointer select-none items-center gap-1.5 rounded-md py-1 pe-2 text-sm outline-none",
                        "hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring",
                        node.disabled && "cursor-not-allowed opacity-50",
                        itemClassName || theme?.itemClassName,
                        isSelected && cn("bg-primary/10 font-medium text-primary", selectedClassName || theme?.selectedClassName),
                    )}
                    style={{ paddingInlineStart: `${(level - 1) * 1 + 0.25}rem` }}
                    onClick={() => { setFocusedId(node.id); activate(node); }}
                    onKeyDown={(event) => onKeyDown(event, row)}
                >
                    <span className="inline-flex w-4 shrink-0 justify-center text-muted-foreground">
                        {branch && <Icon name={isOpen ? "chevron-down" : "chevron-right"} size={14} />}
                    </span>
                    <Icon name={node.icon ?? (branch ? (isOpen ? "folder-open" : "folder") : "file")} size={16} className="shrink-0 text-muted-foreground" />
                    <span className="min-w-0 truncate">{node.label}</span>
                    {node.description && <span className="min-w-0 truncate text-xs font-normal text-muted-foreground">{node.description}</span>}
                    {node.badge && <span className="ms-auto shrink-0">{node.badge}</span>}
                </div>
                {isOpen && <div role="group">{renderNodes(node.children!, level + 1, node)}</div>}
            </div>
        );
    });

    const tree = (
        <div role="tree" aria-label={ariaLabel} className={cn("space-y-0.5", className || theme?.className)}>
            {renderNodes(nodes, 1)}
        </div>
    );
    return wrapperClassName || theme?.wrapperClassName ? <div className={wrapperClassName || theme?.wrapperClassName}>{tree}</div> : tree;
}

/**
 * A tree from `a/b/c` paths: one branch per folder, one leaf per path (its id is the full path,
 * folders get `path/`). Folders come before files, each sorted by name. `leaf` decorates a leaf.
 */
export function treeFromPaths(paths: readonly string[], leaf?: (path: string) => Partial<TreeNode>): TreeNode[] {
    type Folder = { node: TreeNode; folders: Map<string, Folder>; files: TreeNode[] };
    const root: Folder = { node: { id: "", label: "" }, folders: new Map(), files: [] };
    for (const path of paths) {
        const parts = path.split("/").filter(Boolean);
        let folder = root;
        parts.slice(0, -1).forEach((part, index) => {
            const id = `${parts.slice(0, index + 1).join("/")}/`;
            if (!folder.folders.has(part)) folder.folders.set(part, { node: { id, label: part }, folders: new Map(), files: [] });
            folder = folder.folders.get(part)!;
        });
        folder.files.push({ id: path, label: parts[parts.length - 1] ?? path, ...leaf?.(path) });
    }
    const build = (folder: Folder): TreeNode[] => [
        ...[...folder.folders.entries()].sort(([a], [b]) => a.localeCompare(b)).map(([, child]) => ({ ...child.node, children: build(child) })),
        ...folder.files.sort((a, b) => a.id.localeCompare(b.id)),
    ];
    return build(root);
}
