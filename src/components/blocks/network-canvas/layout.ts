// CR-144 — the layout of a NetworkCanvas, as pure functions (no React, no @xyflow/react): which nodes are visible
// (opened, grouped behind a "+N"), where each one goes (a tree from the top, one row per level), the bands of the
// levels and the search. The component draws what this returns.

/** One person (or thing) of the network. */
export interface NetworkCanvasNode {
    id: string;
    /** The node above it; missing (or not among the nodes) at the top. */
    parentId?: string | null;
    label: string;
    /** A second line under the label. */
    description?: string;
    /** An icon of the icon provider. */
    icon?: string;
    /** A short text in a badge (a count, a role). */
    badge?: string;
    /** Drawn faded (a blocked person, an inactive one). */
    muted?: boolean;
}

export const NODE_WIDTH = 220;
export const NODE_HEIGHT = 76;
export const GAP_X = 24;
export const ROW_HEIGHT = 150;
export const BAND_PADDING = 48;

export interface LaidNode {
    kind: 'node';
    id: string;
    node: NetworkCanvasNode;
    x: number;
    y: number;
    depth: number;
    /** How many nodes it has right under it. */
    childCount: number;
    /** Whether its children are shown. */
    open: boolean;
}

export interface LaidCluster {
    kind: 'cluster';
    /** `cluster:<parentId>`. */
    id: string;
    parentId: string;
    /** How many children it stands for. */
    count: number;
    x: number;
    y: number;
    depth: number;
}

export interface LaidBand {
    depth: number;
    x: number;
    y: number;
    width: number;
    height: number;
}

export interface NetworkLayout {
    items: Array<LaidNode | LaidCluster>;
    edges: Array<{ id: string; source: string; target: string }>;
    bands: LaidBand[];
}

/** The children of each node, in the order of `nodes`, and the roots (no parent among the nodes). */
export function indexNetwork(nodes: NetworkCanvasNode[]) {
    const ids = new Set(nodes.map((n) => n.id));
    const children = new Map<string, NetworkCanvasNode[]>();
    const roots: NetworkCanvasNode[] = [];
    for (const node of nodes) {
        const parent = node.parentId && ids.has(node.parentId) && node.parentId !== node.id ? node.parentId : null;
        if (!parent) {
            roots.push(node);
            continue;
        }
        const list = children.get(parent) ?? [];
        list.push(node);
        children.set(parent, list);
    }
    const byId = new Map(nodes.map((n) => [n.id, n]));
    return { roots, children, byId };
}

/** The nodes open at the start: those above `initialDepth` (0 = only the roots are shown, closed). */
export function initiallyOpen(nodes: NetworkCanvasNode[], initialDepth: number): Set<string> {
    const { roots, children } = indexNetwork(nodes);
    const open = new Set<string>();
    const seen = new Set<string>();
    const walk = (node: NetworkCanvasNode, depth: number) => {
        if (seen.has(node.id)) return;
        seen.add(node.id);
        if (depth >= initialDepth) return;
        if (children.get(node.id)?.length) open.add(node.id);
        for (const child of children.get(node.id) ?? []) walk(child, depth + 1);
    };
    for (const root of roots) walk(root, 0);
    return open;
}

/**
 * Where each visible node goes: a tree from the top, each subtree as wide as its children, a parent centred over
 * them. A node with more than `collapseAfter` children shows the first ones and a cluster "+N" for the others,
 * unless it is in `showAll`. A loop in the data is cut where it closes.
 */
export function layoutNetwork(
    nodes: NetworkCanvasNode[],
    { open, showAll, collapseAfter }: { open: Set<string>; showAll: Set<string>; collapseAfter: number },
): NetworkLayout {
    const { roots, children } = indexNetwork(nodes);
    const items: Array<LaidNode | LaidCluster> = [];
    const edges: NetworkLayout['edges'] = [];
    const seen = new Set<string>();

    type Visible = { kind: 'node'; node: NetworkCanvasNode } | { kind: 'cluster'; parentId: string; count: number };
    const visibleChildren = (node: NetworkCanvasNode): Visible[] => {
        if (!open.has(node.id)) return [];
        const kids = (children.get(node.id) ?? []).filter((k) => !seen.has(k.id));
        if (kids.length <= collapseAfter || showAll.has(node.id)) return kids.map((k) => ({ kind: 'node', node: k }));
        return [
            ...kids.slice(0, collapseAfter).map((k): Visible => ({ kind: 'node', node: k })),
            { kind: 'cluster', parentId: node.id, count: kids.length - collapseAfter },
        ];
    };

    // The width of each subtree, measured once (`seen` also cuts loops).
    const widths = new Map<string, number>();
    const visible = new Map<string, Visible[]>();
    const measure = (node: NetworkCanvasNode): number => {
        seen.add(node.id);
        const kids = visibleChildren(node);
        visible.set(node.id, kids);
        const inner = kids.reduce((sum, kid, i) => sum + (i ? GAP_X : 0) + (kid.kind === 'node' ? measure(kid.node) : NODE_WIDTH), 0);
        const width = Math.max(NODE_WIDTH, inner);
        widths.set(node.id, width);
        return width;
    };
    const rootWidths = roots.map((root) => (seen.has(root.id) ? 0 : measure(root)));

    const place = (node: NetworkCanvasNode, left: number, depth: number) => {
        const width = widths.get(node.id) ?? NODE_WIDTH;
        const kids = visible.get(node.id) ?? [];
        items.push({
            kind: 'node', id: node.id, node, depth,
            x: left + width / 2 - NODE_WIDTH / 2,
            y: depth * ROW_HEIGHT,
            childCount: children.get(node.id)?.length ?? 0,
            open: open.has(node.id) && kids.length > 0,
        });
        const inner = kids.reduce((sum, kid, i) => sum + (i ? GAP_X : 0) + (kid.kind === 'node' ? widths.get(kid.node.id) ?? NODE_WIDTH : NODE_WIDTH), 0);
        let cursor = left + (width - inner) / 2;
        for (const kid of kids) {
            if (kid.kind === 'node') {
                edges.push({ id: `${node.id}->${kid.node.id}`, source: node.id, target: kid.node.id });
                place(kid.node, cursor, depth + 1);
                cursor += (widths.get(kid.node.id) ?? NODE_WIDTH) + GAP_X;
            } else {
                const id = `cluster:${kid.parentId}`;
                edges.push({ id: `${node.id}->${id}`, source: node.id, target: id });
                items.push({ kind: 'cluster', id, parentId: kid.parentId, count: kid.count, x: cursor, y: (depth + 1) * ROW_HEIGHT, depth: depth + 1 });
                cursor += NODE_WIDTH + GAP_X;
            }
        }
    };
    let left = 0;
    roots.forEach((root, i) => {
        if (!rootWidths[i]) return;
        place(root, left, 0);
        left += rootWidths[i] + GAP_X * 2;
    });

    const depths = [...new Set(items.map((item) => item.depth))].sort((a, b) => a - b);
    const minX = Math.min(0, ...items.map((item) => item.x)) - BAND_PADDING;
    const maxX = Math.max(NODE_WIDTH, ...items.map((item) => item.x + NODE_WIDTH)) + BAND_PADDING;
    const bands = depths.map((depth) => ({
        depth,
        x: minX - 120,
        y: depth * ROW_HEIGHT - (ROW_HEIGHT - NODE_HEIGHT) / 2,
        width: maxX - minX + 120,
        height: ROW_HEIGHT,
    }));
    return { items, edges, bands };
}

/** A text for the search: lower case, without accents. */
export const normalize = (text: string) => text.normalize('NFD').replace(/\p{M}/gu, '').toLowerCase().trim();

/** The nodes whose label (or description) has the query, in order. */
export function searchNetwork(nodes: NetworkCanvasNode[], query: string): NetworkCanvasNode[] {
    const q = normalize(query);
    if (!q) return [];
    return nodes.filter((n) => normalize(n.label).includes(q) || (n.description ? normalize(n.description).includes(q) : false));
}

/**
 * What to open to show a node: each node above it is opened, and shows all its children when the node (or the
 * branch to it) is behind a "+N".
 */
export function revealNode(nodes: NetworkCanvasNode[], id: string, collapseAfter: number) {
    const { children, byId } = indexNetwork(nodes);
    const open: string[] = [];
    const showAll: string[] = [];
    const seen = new Set<string>();
    let current = byId.get(id);
    while (current?.parentId && byId.has(current.parentId) && !seen.has(current.id)) {
        seen.add(current.id);
        const parent = current.parentId;
        open.push(parent);
        const index = (children.get(parent) ?? []).findIndex((k) => k.id === current?.id);
        if (index >= collapseAfter) showAll.push(parent);
        current = byId.get(parent);
    }
    return { open, showAll };
}

/** The depth of each node from its root (0 = at the top). */
export function depthOf(nodes: NetworkCanvasNode[], id: string): number {
    const { byId } = indexNetwork(nodes);
    let depth = 0;
    const seen = new Set<string>();
    let current = byId.get(id);
    while (current?.parentId && byId.has(current.parentId) && !seen.has(current.id)) {
        seen.add(current.id);
        depth += 1;
        current = byId.get(current.parentId);
    }
    return depth;
}
