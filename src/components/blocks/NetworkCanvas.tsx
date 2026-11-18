import React, { Suspense, lazy } from 'react';
import Loader from '../ui/Loader';
import type { NetworkCanvasNode, NetworkCanvasProps } from './network-canvas/types';

// CR-144 — a network drawn as a tree on a canvas: who is under whom, level by level in numbered bands, branches
// that open and close, a "+N" for the many children of a node, search and focus, zoom, pan and minimap, light
// motion (none with `prefers-reduced-motion`). @xyflow/react is loaded only when a canvas is shown, as ImageEditor
// does with its editor.

// Its stylesheet comes first; where a stylesheet cannot be imported (Node, a test runner) the canvas still works.
const NetworkCanvasImpl = lazy(async () => {
    await import('@xyflow/react/dist/style.css').catch(() => undefined);
    return import('./network-canvas/NetworkCanvasImpl');
});

export function NetworkCanvas<TNode extends NetworkCanvasNode = NetworkCanvasNode>(props: NetworkCanvasProps<TNode>) {
    return (
        <Suspense fallback={<Loader show minHeight={typeof props.height === 'number' ? `${props.height}px` : props.height ?? '600px'}>{null}</Loader>}>
            <NetworkCanvasImpl {...(props as unknown as NetworkCanvasProps<NetworkCanvasNode>)} />
        </Suspense>
    );
}

export default NetworkCanvas;
export type { NetworkCanvasNode, NetworkCanvasProps } from './network-canvas/types';
export { layoutNetwork, searchNetwork, revealNode, initiallyOpen } from './network-canvas/layout';
