import type React from 'react';
import type { NetworkCanvasNode } from './layout';

export type { NetworkCanvasNode } from './layout';

/** CR-144 — the props of a `NetworkCanvas`. */
export interface NetworkCanvasProps<TNode extends NetworkCanvasNode = NetworkCanvasNode> {
    /** The nodes, each with the id of the node above it (`parentId`); the ones without a parent go at the top. */
    nodes: TNode[];
    /** The level of the nodes at the top (default 0): the bands count from here. */
    rootLevel?: number;
    /** The label of the band of a level. Default: "Level {n}" in the language of the app. */
    levelLabel?: (level: number) => React.ReactNode;
    /** How many levels are open at the start (default 2); the deeper nodes show a "+" to open them. */
    initialDepth?: number;
    /** How many children of a node are drawn before a "+N" that shows the others (default 8). */
    collapseAfter?: number;
    /** A click on a node (not on its "+"): the page opens it, moves it… */
    onNodeClick?: (node: TNode) => void;
    /** The node drawn as selected. */
    selectedId?: string;
    /** A node to open and bring to the centre (its branch opens): set it to focus another one. */
    focusId?: string;
    /** The search box over the canvas (default `true`): it opens the branch of each match and centres it. */
    searchable?: boolean;
    /** The minimap (default `true`). */
    minimap?: boolean;
    /** Height of the canvas (default 600). */
    height?: number | string;
    /** Accessible name of the canvas. Default: "Network". */
    ariaLabel?: string;
    className?: string;
}
