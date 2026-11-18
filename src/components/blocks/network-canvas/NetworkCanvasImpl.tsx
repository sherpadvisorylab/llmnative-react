import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
    Background,
    BackgroundVariant,
    Controls,
    Handle,
    MiniMap,
    Panel,
    Position,
    ReactFlow,
    ReactFlowProvider,
    useReactFlow,
    type Edge,
    type Node,
    type NodeProps,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useI18n } from '../../../I18n';
import { cn } from '../../../libs/cn';
import Icon from '../../ui/Icon';
import {
    NODE_HEIGHT,
    NODE_WIDTH,
    initiallyOpen,
    layoutNetwork,
    revealNode,
    searchNetwork,
    type LaidCluster,
    type LaidNode,
    type NetworkCanvasNode,
} from './layout';
import type { NetworkCanvasProps } from './types';

// CR-144 — the canvas of a NetworkCanvas (loaded only when shown: @xyflow/react stays out of the main bundle).

const reducedMotion = () => typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches === true;
const fill = (template: string, n: number | string) => template.replace('{n}', String(n));

type PersonData = {
    laid: LaidNode;
    selected: boolean;
    highlighted: boolean;
    clickable: boolean;
    toggleLabel: string;
    onToggle: (id: string) => void;
};
type ClusterData = { laid: LaidCluster; label: string };
type BandData = { label: React.ReactNode; even: boolean };

const hiddenHandle = '!h-1 !w-1 !min-h-0 !min-w-0 !border-0 !bg-transparent';

function PersonNode({ data }: NodeProps<Node<PersonData, 'person'>>) {
    const { laid, selected, highlighted, clickable, toggleLabel, onToggle } = data;
    const { node, childCount, open } = laid;
    return (
        <div
            className={cn(
                'relative flex h-full flex-col justify-center gap-0.5 rounded-xl border bg-card px-3 py-2 text-card-foreground shadow-sm',
                'transition-[box-shadow,opacity] duration-300 motion-reduce:transition-none',
                selected ? 'border-primary ring-2 ring-primary' : 'border-border',
                highlighted && !selected && 'ring-2 ring-ring ring-offset-2 ring-offset-background',
                node.muted && 'opacity-50',
                clickable && 'cursor-pointer hover:shadow-md',
            )}
            style={{ width: NODE_WIDTH, height: NODE_HEIGHT }}
        >
            <Handle type="target" position={Position.Top} isConnectable={false} className={hiddenHandle} />
            <div className="flex min-w-0 items-center gap-2">
                {node.icon && <Icon name={node.icon} size={16} className="shrink-0 text-primary" />}
                <span className={cn('truncate text-sm font-semibold', node.muted && 'line-through')} title={node.label}>{node.label}</span>
                {node.badge && <span className="ms-auto shrink-0 rounded-full bg-secondary px-2 py-0.5 text-[10px] font-medium text-secondary-foreground">{node.badge}</span>}
            </div>
            {node.description && <span className="truncate text-xs text-muted-foreground" title={node.description}>{node.description}</span>}
            {childCount > 0 && (
                // nodrag/nopan: the toggle opens or closes the children; it neither pans nor clicks the node.
                <button
                    type="button"
                    className="nodrag nopan absolute -bottom-3 left-1/2 flex h-6 min-w-6 -translate-x-1/2 items-center justify-center gap-1 rounded-full border border-border bg-background px-2 text-[11px] font-medium text-muted-foreground shadow-sm hover:text-foreground"
                    aria-expanded={open}
                    aria-label={toggleLabel}
                    title={toggleLabel}
                    onClick={(event) => { event.stopPropagation(); onToggle(node.id); }}
                >
                    <Icon name={open ? 'minus' : 'plus'} size={12} />
                    {!open && childCount}
                </button>
            )}
            <Handle type="source" position={Position.Bottom} isConnectable={false} className={hiddenHandle} />
        </div>
    );
}

function ClusterNode({ data }: NodeProps<Node<ClusterData, 'cluster'>>) {
    return (
        <div
            className="flex h-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-primary/50 bg-primary/5 text-sm font-semibold text-primary transition-colors duration-300 hover:bg-primary/10 motion-reduce:transition-none"
            style={{ width: NODE_WIDTH, height: NODE_HEIGHT }}
        >
            <Handle type="target" position={Position.Top} isConnectable={false} className={hiddenHandle} />
            <Icon name="users" size={16} />
            {data.label}
        </div>
    );
}

function BandNode({ data, width, height }: NodeProps<Node<BandData, 'band'>>) {
    return (
        <div className={cn('pointer-events-none rounded-2xl', data.even ? 'bg-muted/40' : 'bg-muted/15')} style={{ width, height }}>
            <span className="sticky left-0 ms-4 mt-2 inline-block rounded-full bg-background/80 px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                {data.label}
            </span>
        </div>
    );
}

const nodeTypes = { person: PersonNode, cluster: ClusterNode, band: BandNode };

function Canvas<TNode extends NetworkCanvasNode>({
    nodes,
    rootLevel = 0,
    levelLabel,
    initialDepth = 2,
    collapseAfter = 8,
    onNodeClick,
    selectedId,
    searchable = true,
    minimap = true,
    focusId,
}: NetworkCanvasProps<TNode>) {
    const dict = useI18n('networkCanvas');
    const flow = useReactFlow();
    const [open, setOpen] = useState(() => initiallyOpen(nodes, initialDepth));
    const [showAll, setShowAll] = useState(() => new Set<string>());
    const [query, setQuery] = useState('');
    const [match, setMatch] = useState(0);
    const [focus, setFocus] = useState<string | null>(null);
    const animate = !reducedMotion();
    const first = useRef(true);

    const laid = useMemo(() => layoutNetwork(nodes, { open, showAll, collapseAfter }), [nodes, open, showAll, collapseAfter]);
    const results = useMemo(() => searchNetwork(nodes, query), [nodes, query]);

    const toggle = useCallback((id: string) => {
        setOpen((current) => {
            const next = new Set(current);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    }, []);

    /** Opens the branch of a node and brings it to the centre. */
    const reveal = useCallback((id: string) => {
        const { open: toOpen, showAll: toShow } = revealNode(nodes, id, collapseAfter);
        setOpen((current) => new Set([...current, ...toOpen]));
        if (toShow.length) setShowAll((current) => new Set([...current, ...toShow]));
        setFocus(id);
    }, [nodes, collapseAfter]);

    // Once the branch is laid out, centre the node in focus.
    useEffect(() => {
        if (!focus) return;
        const item = laid.items.find((i) => i.id === focus);
        if (!item) return;
        void flow.setCenter(item.x + NODE_WIDTH / 2, item.y + NODE_HEIGHT / 2, { zoom: Math.max(flow.getZoom(), 1), duration: animate ? 500 : 0 });
    }, [focus, laid, flow, animate]);

    // A node the page asks to show (its own person, a search of its own).
    useEffect(() => {
        if (focusId) reveal(focusId);
    }, [focusId, reveal]);

    useEffect(() => {
        if (first.current) { first.current = false; return; }
        if (!focus) void flow.fitView({ padding: 0.15, duration: animate ? 400 : 0 });
        // Only when the network itself changes: opening a node keeps the view where it is.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [nodes]);

    const label = (level: number) => (levelLabel ? levelLabel(level) : fill(dict.level, level));

    const rfNodes = useMemo<Node[]>(() => [
        ...laid.bands.map((band, i): Node<BandData, 'band'> => ({
            id: `band:${band.depth}`,
            type: 'band',
            position: { x: band.x, y: band.y },
            width: band.width,
            height: band.height,
            data: { label: label(rootLevel + band.depth), even: i % 2 === 0 },
            draggable: false,
            selectable: false,
            focusable: false,
            zIndex: -1,
        })),
        ...laid.items.map((item): Node => (item.kind === 'node'
            ? {
                id: item.id,
                type: 'person',
                position: { x: item.x, y: item.y },
                width: NODE_WIDTH,
                height: NODE_HEIGHT,
                draggable: false,
                data: {
                    laid: item,
                    selected: item.id === selectedId,
                    highlighted: item.id === focus || (query !== '' && results.some((r) => r.id === item.id)),
                    clickable: Boolean(onNodeClick),
                    toggleLabel: item.open ? dict.collapse : fill(dict.expand, item.childCount),
                    onToggle: toggle,
                } satisfies PersonData,
            }
            : {
                id: item.id,
                type: 'cluster',
                position: { x: item.x, y: item.y },
                width: NODE_WIDTH,
                height: NODE_HEIGHT,
                draggable: false,
                data: { laid: item, label: fill(dict.more, item.count) } satisfies ClusterData,
            })),
    // `label` reads the props and the dictionary given below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    ], [laid, selectedId, focus, query, results, onNodeClick, dict, toggle, rootLevel, levelLabel]);

    const rfEdges = useMemo<Edge[]>(() => laid.edges.map((edge) => ({
        ...edge,
        type: 'smoothstep',
        selectable: false,
        focusable: false,
        animated: false,
    })), [laid]);

    /** To the match of the search: the current one first, then the next (or the one before). */
    const advance = (back = false) => {
        if (!results.length) return;
        const onCurrent = focus === results[match]?.id;
        const next = onCurrent ? (match + (back ? -1 : 1) + results.length) % results.length : match;
        setMatch(next);
        reveal(results[next].id);
    };

    return (
        <ReactFlow
            nodes={rfNodes}
            edges={rfEdges}
            nodeTypes={nodeTypes}
            fitView
            fitViewOptions={{ padding: 0.15 }}
            minZoom={0.1}
            maxZoom={2}
            nodesDraggable={false}
            nodesConnectable={false}
            elementsSelectable={false}
            proOptions={{ hideAttribution: true }}
            onNodeClick={(_event, node) => {
                if (node.type === 'cluster') {
                    const parent = (node.data as ClusterData).laid.parentId;
                    setShowAll((current) => new Set([...current, parent]));
                } else if (node.type === 'person' && onNodeClick) {
                    onNodeClick((node.data as PersonData).laid.node as TNode);
                }
            }}
            style={{ width: '100%', height: '100%' }}
        >
            <Background variant={BackgroundVariant.Dots} gap={20} size={1} />
            <Controls showInteractive={false} position="bottom-left" />
            {minimap && <MiniMap pannable zoomable position="bottom-right" nodeStrokeWidth={2} className="!bg-background" />}
            {searchable && (
                <Panel position="top-right" className="flex items-center gap-1 rounded-lg border border-border bg-background/95 p-1.5 shadow-sm">
                    <Icon name="search" size={14} className="ms-1 text-muted-foreground" />
                    <input
                        type="search"
                        value={query}
                        placeholder={dict.search}
                        aria-label={dict.search}
                        className="w-44 bg-transparent px-1 py-1 text-sm placeholder:text-muted-foreground focus:outline-none"
                        onChange={(event) => { setQuery(event.target.value); setMatch(0); }}
                        onKeyDown={(event) => { if (event.key === 'Enter') { event.preventDefault(); advance(event.shiftKey); } }}
                    />
                    {query !== '' && (
                        <span className="whitespace-nowrap px-1 text-xs text-muted-foreground" aria-live="polite">
                            {results.length ? `${match + 1}/${results.length}` : dict.noResults}
                        </span>
                    )}
                    {results.length > 0 && (
                        <button type="button" className="rounded p-1 text-muted-foreground hover:bg-muted hover:text-foreground" aria-label={dict.next} title={dict.next} onClick={() => advance()}>
                            <Icon name="arrow-down" size={14} />
                        </button>
                    )}
                </Panel>
            )}
        </ReactFlow>
    );
}

export default function NetworkCanvasImpl<TNode extends NetworkCanvasNode>(props: NetworkCanvasProps<TNode>) {
    const dict = useI18n('networkCanvas');
    return (
        <div
            role="region"
            aria-label={props.ariaLabel ?? dict.title}
            className={cn(
                'relative w-full overflow-hidden rounded-xl border border-border bg-background',
                // Light motion when the tree opens or closes, none for who asks for less.
                '[&_.react-flow__node]:transition-transform [&_.react-flow__node]:duration-300 [&_.react-flow__node]:ease-out',
                'motion-reduce:[&_.react-flow__node]:transition-none',
                '[&_.react-flow]:!bg-transparent',
                props.className,
            )}
            style={{
                height: props.height ?? 600,
                ['--xy-edge-stroke' as string]: 'hsl(var(--muted-foreground) / 0.45)',
                ['--xy-controls-button-background-color' as string]: 'hsl(var(--background))',
                ['--xy-controls-button-color' as string]: 'hsl(var(--foreground))',
                ['--xy-controls-button-border-color' as string]: 'hsl(var(--border))',
                ['--xy-minimap-background-color' as string]: 'hsl(var(--background))',
                ['--xy-background-pattern-color' as string]: 'hsl(var(--border))',
            }}
        >
            <ReactFlowProvider>
                <Canvas {...props} />
            </ReactFlowProvider>
        </div>
    );
}
