import { describe, it, expect, vi } from 'vitest';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';

vi.mock('../../../src/Config', () => ({
    getConfig: vi.fn(() => ({})),
    onConfigChange: vi.fn(),
    default: {},
}));
vi.mock('../../../src/providers/firebase-init', () => ({ default: vi.fn(), getSafeAuth: vi.fn() }));
vi.mock('../../../src/Theme', () => ({
    useMotionRegistry: vi.fn(() => ({})),
    useTheme: vi.fn(() => ({ Loader: { wrapClass: '', className: '', icon: '', title: '', description: '' } })),
    ThemeProvider: ({ children }: any) => children,
}));
vi.mock('@xyflow/react/dist/style.css', () => ({}));

const flow = { setCenter: vi.fn(), fitView: vi.fn(), getZoom: () => 1 };
// A stand-in for @xyflow/react: each node drawn by its type, a click on its box is a click on the node.
vi.mock('@xyflow/react', () => ({
    ReactFlow: ({ nodes, nodeTypes, onNodeClick, children }: any) => (
        <div data-testid="flow">
            {nodes.map((node: any) => {
                const Type = nodeTypes[node.type];
                return (
                    <div key={node.id} data-node={node.id} data-type={node.type} onClick={(event) => onNodeClick?.(event, node)}>
                        <Type id={node.id} data={node.data} width={node.width} height={node.height} />
                    </div>
                );
            })}
            {children}
        </div>
    ),
    ReactFlowProvider: ({ children }: any) => children,
    useReactFlow: () => flow,
    Background: () => null,
    Controls: () => null,
    MiniMap: () => null,
    Handle: () => null,
    Panel: ({ children }: any) => <div>{children}</div>,
    Position: { Top: 'top', Bottom: 'bottom' },
    BackgroundVariant: { Dots: 'dots' },
}));

import { renderWithProviders as render } from '../../helpers/renderWithProviders';
import NetworkCanvasImpl from '../../../src/components/blocks/network-canvas/NetworkCanvasImpl';
import { initiallyOpen, layoutNetwork, revealNode, searchNetwork, type NetworkCanvasNode } from '../../../src/components/blocks/network-canvas/layout';

const rete: NetworkCanvasNode[] = [
    { id: 'luca', label: 'Luca' },
    { id: 'carla', parentId: 'luca', label: 'Carla' },
    { id: 'dario', parentId: 'carla', label: 'Dario' },
    ...Array.from({ length: 5 }, (_, i) => ({ id: `f${i}`, parentId: 'luca', label: `Figlio ${i}` })),
    { id: 'elena', label: 'Élena', description: 'Consulente' },
];

describe('NetworkCanvas — layout', () => {
    it('opens the first levels, lays a tree from the top and groups the many children behind a +N', () => {
        const open = initiallyOpen(rete, 1);
        expect([...open]).toEqual(['luca']);
        const { items, edges, bands } = layoutNetwork(rete, { open, showAll: new Set(), collapseAfter: 3 });
        const ids = items.map((i) => i.id);
        expect(ids).toEqual(['luca', 'carla', 'f0', 'f1', 'cluster:luca', 'elena']);
        expect(items.find((i) => i.id === 'cluster:luca')).toMatchObject({ kind: 'cluster', count: 3, depth: 1 });
        expect(edges.map((e) => e.id)).toContain('luca->cluster:luca');
        expect(bands.map((b) => b.depth)).toEqual([0, 1]);
        const luca = items.find((i) => i.id === 'luca')!;
        const figli = items.filter((i) => i.depth === 1);
        // The parent is centred over its children.
        const centro = (figli[0].x + figli[figli.length - 1].x) / 2;
        expect(Math.round(luca.x)).toBe(Math.round(centro));
    });

    it('shows all the children of a node in showAll; a node above a hidden one opens to reveal it', () => {
        const { items } = layoutNetwork(rete, { open: new Set(['luca', 'carla']), showAll: new Set(['luca']), collapseAfter: 3 });
        expect(items.some((i) => i.kind === 'cluster')).toBe(false);
        expect(items.find((i) => i.id === 'dario')).toMatchObject({ depth: 2 });
        expect(revealNode(rete, 'dario', 3)).toEqual({ open: ['carla', 'luca'], showAll: [] });
        expect(revealNode(rete, 'f4', 3)).toEqual({ open: ['luca'], showAll: ['luca'] });
    });

    it('searches the label and the description, without case or accents', () => {
        expect(searchNetwork(rete, 'elena').map((n) => n.id)).toEqual(['elena']);
        expect(searchNetwork(rete, 'consul').map((n) => n.id)).toEqual(['elena']);
        expect(searchNetwork(rete, '  ')).toEqual([]);
    });

    it('a loop in the data is cut, never drawn forever', () => {
        const loop: NetworkCanvasNode[] = [{ id: 'a', label: 'A' }, { id: 'b', parentId: 'a', label: 'B' }, { id: 'a2', parentId: 'a2', label: 'Self' }];
        const { items } = layoutNetwork(loop, { open: new Set(['a', 'b', 'a2']), showAll: new Set(), collapseAfter: 8 });
        expect(items.map((i) => i.id).sort()).toEqual(['a', 'a2', 'b']);
    });
});

describe('NetworkCanvas — component', () => {
    it('draws a band per level, the nodes, a +N that opens, a toggle that closes, a click that reaches the page', async () => {
        const onNodeClick = vi.fn();
        const { container } = render(<NetworkCanvasImpl nodes={rete} collapseAfter={3} initialDepth={1} levelLabel={(l) => `Livello ${l}`} onNodeClick={onNodeClick} />);
        expect(screen.getByText('Livello 0')).toBeTruthy();
        expect(screen.getByText('Livello 1')).toBeTruthy();
        expect(screen.getByText('Carla')).toBeTruthy();
        expect(screen.queryByText('Figlio 4')).toBeNull();

        fireEvent.click(container.querySelector('[data-node="cluster:luca"]')!);
        await waitFor(() => expect(screen.getByText('Figlio 4')).toBeTruthy());

        fireEvent.click(container.querySelector('[data-node="carla"]')!);
        expect(onNodeClick).toHaveBeenCalledWith(expect.objectContaining({ id: 'carla' }));

        const chiudi = container.querySelector('[data-node="luca"] button[aria-expanded="true"]')!;
        fireEvent.click(chiudi);
        await waitFor(() => expect(screen.queryByText('Carla')).toBeNull());
        expect(onNodeClick).toHaveBeenCalledTimes(1);
    });

    it('the search opens the branch of the match and centres it', async () => {
        flow.setCenter.mockClear();
        render(<NetworkCanvasImpl nodes={rete} initialDepth={0} />);
        expect(screen.queryByText('Dario')).toBeNull();
        const box = screen.getByRole('searchbox');
        fireEvent.change(box, { target: { value: 'dar' } });
        fireEvent.keyDown(box, { key: 'Enter' });
        await waitFor(() => expect(screen.getByText('Dario')).toBeTruthy());
        await waitFor(() => expect(flow.setCenter).toHaveBeenCalled());
        expect(screen.getByText('1/1')).toBeTruthy();
    });
});
