import React, { useMemo, useState } from 'react';
import { Grid, NetworkCanvas, type NetworkCanvasNode } from '@llmnative/react';
import PageLayout from '../../showcase/page';
import Section from '../../docs-kit/page/Section';
import PropDocsTable from '../../docs-kit/docs/PropDocsTable';
import type { PropDef } from '../../docs-kit/playground';

// CR-144 — a network drawn as a tree on a canvas.

const PROPS: PropDef[] = [
    { name: 'nodes', type: 'NetworkCanvasNode[]', description: 'The nodes: `id`, `parentId` (the node above; missing at the top), `label`, `description`, `icon`, `badge`, `muted`.' },
    { name: 'rootLevel', type: 'number', default: '0', description: 'The level of the nodes at the top: the bands count from here.' },
    { name: 'levelLabel', type: '(level) => ReactNode', default: 'networkCanvas.level', description: 'The label of the band of a level.' },
    { name: 'initialDepth', type: 'number', default: '2', description: 'How many levels are open at the start; deeper nodes show a "+" to open them.' },
    { name: 'collapseAfter', type: 'number', default: '8', description: 'How many children of a node are drawn before a "+N" that shows the others.' },
    { name: 'onNodeClick', type: '(node) => void', description: 'A click on a node (not on its "+").' },
    { name: 'selectedId / focusId', type: 'string', description: 'The node drawn as selected; a node to open and bring to the centre.' },
    { name: 'searchable / minimap', type: 'boolean', default: 'true', description: 'The search box (it opens the branch of each match and centres it) and the minimap.' },
    { name: 'height', type: 'number | string', default: '600', description: 'Height of the canvas.' },
];

const NAMES = ['Anna', 'Bruno', 'Carla', 'Dario', 'Elena', 'Fabio', 'Giulia', 'Hugo', 'Irene', 'Luca', 'Marta', 'Nico', 'Olga', 'Paolo', 'Rita', 'Sara', 'Tino', 'Ugo', 'Vera', 'Zeno'];

/** A network of a few levels, made the same way at every render. */
function sampleNetwork(): NetworkCanvasNode[] {
    const nodes: NetworkCanvasNode[] = [{ id: 'n0', label: 'Anna Rossi', description: 'Consultant', icon: 'crown', badge: '1' }];
    let next = 1;
    const grow = (parent: string, depth: number, count: number) => {
        for (let i = 0; i < count; i += 1) {
            const id = `n${next}`;
            nodes.push({ id, parentId: parent, label: `${NAMES[next % NAMES.length]} ${depth}.${i + 1}`, description: depth % 2 ? 'Accountant' : 'Sales', icon: 'user', muted: next % 13 === 0 });
            next += 1;
            if (depth < 3) grow(id, depth + 1, depth === 1 ? 3 : 2);
        }
    };
    grow('n0', 1, 11);
    return nodes;
}

export default function NetworkCanvasPage() {
    const nodes = useMemo(sampleNetwork, []);
    const [selected, setSelected] = useState<string | undefined>();
    return (
        <PageLayout
            title="NetworkCanvas"
            description="Who is under whom, level by level: numbered bands, branches that open and close, a +N for the many children of a node, search and focus, zoom, pan and minimap. @xyflow/react loads only when a canvas is shown."
        >
            <Section
                title="A network"
                description="Two levels open at the start; the first node has more children than collapseAfter, so a +N shows the others. Search a name: its branch opens and the canvas centres it."
                preview={(
                    <div className="w-full">
                        <NetworkCanvas
                            nodes={nodes}
                            height={520}
                            collapseAfter={6}
                            levelLabel={(level) => (level === 0 ? 'Top' : `Level ${level}`)}
                            selectedId={selected}
                            onNodeClick={(node) => setSelected(node.id)}
                        />
                    </div>
                )}
                code={`import { NetworkCanvas } from '@llmnative/react';

<NetworkCanvas
    nodes={people.map((p) => ({ id: p.uid, parentId: p.sponsorId, label: p.name, description: p.kind }))}
    levelLabel={(level) => (level === 0 ? 'You' : \`Level \${level}\`)}
    onNodeClick={(node) => open(node.id)}
/>`}
            />
            <Section
                title="As a view of a Grid"
                description="CR-145: views.custom adds the tree to the switch of the Grid, next to the table; the search and the filters of the Grid hold for the tree too."
                preview={(
                    <div className="w-full">
                        <Grid<NetworkCanvasNode>
                            records={nodes}
                            recordId="id"
                            columns={[{ key: 'label', label: 'Name' }, { key: 'description', label: 'Kind' }]}
                            searchable={{ fields: ['label', 'description'] }}
                            view="tree"
                            views={{
                                toggle: ['tree', 'table'],
                                custom: [{
                                    id: 'tree',
                                    label: 'Tree',
                                    icon: 'network',
                                    render: ({ records }) => <NetworkCanvas nodes={records} height={460} searchable={false} />,
                                }],
                            }}
                        />
                    </div>
                )}
                code={`<Grid records={people} recordId="id" columns={columns} searchable={{ fields: ['label'] }}
    view="tree"
    views={{
        toggle: ['tree', 'table'],
        custom: [{ id: 'tree', label: 'Tree', icon: 'network', render: ({ records }) => <NetworkCanvas nodes={records} /> }],
    }}
/>`}
            />
            <PropDocsTable props={PROPS} title="NetworkCanvas props" />
        </PageLayout>
    );
}
