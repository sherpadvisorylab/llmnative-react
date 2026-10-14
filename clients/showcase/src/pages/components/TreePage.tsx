import React from 'react';
import { ActionButton, Badge, Tree, treeFromPaths } from '@llmnative/react';
import type { TreeNode } from '@llmnative/react';
import PageLayout from '../../showcase/page';
import Section from '../../docs-kit/page/Section';
import PropDocsTable from '../../docs-kit/docs/PropDocsTable';
import { usePlayground } from '../../docs-kit/playground';
import type { PropDef, PlaygroundConfig } from '../../docs-kit/playground';
import { useShowcaseCommonI18n, useShowcaseTreeI18n } from '../../showcase/i18n';

const PACKAGE_NODES: TreeNode[] = [
    {
        id: 'src',
        label: 'src',
        icon: 'folder',
        children: [
            { id: 'src/index.ts', label: 'index.ts', icon: 'file' },
            {
                id: 'src/libs',
                label: 'libs',
                icon: 'folder',
                children: [
                    { id: 'src/libs/cn.ts', label: 'cn.ts', icon: 'file' },
                    { id: 'src/libs/tree.ts', label: 'tree.ts', icon: 'file', badge: <Badge variant="success">new</Badge> },
                ],
            },
            {
                id: 'src/conf',
                label: 'conf',
                icon: 'folder',
                children: [
                    {
                        id: 'src/conf/i18n',
                        label: 'i18n',
                        icon: 'folder',
                        children: [{ id: 'src/conf/i18n/en.ts', label: 'en.ts', icon: 'file' }],
                    },
                ],
            },
        ],
    },
    { id: 'package.json', label: 'package.json', icon: 'file' },
    { id: 'README.md', label: 'README.md', icon: 'file' },
    { id: 'node_modules', label: 'node_modules', icon: 'folder', description: 'ignored', disabled: true },
];

const PATH_NODES: TreeNode[] = treeFromPaths([
    'src/components/ui/Tree.tsx',
    'src/components/index.ts',
    'src/libs/tree.ts',
    'tests/unit/components/Tree.test.tsx',
    'package.json',
    'README.md',
]);

function ControlledDemo() {
    const t = useShowcaseTreeI18n();
    const [expanded, setExpanded] = React.useState<string[]>(['src']);
    const [selectedId, setSelectedId] = React.useState<string | null>(null);

    const allFolders = React.useMemo(() => {
        const ids: string[] = [];
        const walk = (nodes: readonly TreeNode[]) => {
            for (const node of nodes) {
                if (node.children?.length) {
                    ids.push(node.id);
                    walk(node.children);
                }
            }
        };
        walk(PACKAGE_NODES);
        return ids;
    }, []);

    return (
        <div className="grid w-full max-w-3xl gap-4 sm:grid-cols-[minmax(0,1fr)_14rem]">
            <div className="space-y-3">
                <div className="flex flex-wrap gap-2">
                    <ActionButton label={t.labels.expandAll} icon="add" onClick={() => setExpanded(allFolders)} />
                    <ActionButton label={t.labels.collapseAll} icon="close" onClick={() => setExpanded([])} />
                </div>
                <Tree
                    nodes={PACKAGE_NODES}
                    expanded={expanded}
                    onExpandedChange={setExpanded}
                    selectedId={selectedId}
                    onSelect={(node) => setSelectedId(node.id)}
                    ariaLabel={t.labels.fileTree}
                />
            </div>
            <div className="rounded-md border bg-muted/30 p-3 text-sm">
                <div className="text-xs font-medium uppercase tracking-widest text-muted-foreground">{t.labels.openFolders}</div>
                <div className="mb-3 break-words">{expanded.length ? expanded.join(', ') : t.labels.none}</div>
                <div className="text-xs font-medium uppercase tracking-widest text-muted-foreground">{t.labels.selectedNode}</div>
                <div className="break-words">{selectedId ?? t.labels.none}</div>
            </div>
        </div>
    );
}

function ExplorerDemo() {
    const t = useShowcaseTreeI18n();
    const [selectedId, setSelectedId] = React.useState<string | null>('src/index.ts');

    return (
        <div className="grid w-full max-w-3xl gap-4 sm:grid-cols-[minmax(0,1fr)_14rem]">
            <Tree
                nodes={PACKAGE_NODES}
                defaultExpanded={['src', 'src/libs']}
                selectedId={selectedId}
                onSelect={(node) => setSelectedId(node.id)}
                ariaLabel={t.labels.fileTree}
            />
            <div className="rounded-md border bg-muted/30 p-3 text-sm">
                <div className="text-xs font-medium uppercase tracking-widest text-muted-foreground">{t.labels.selected}</div>
                <div className="break-words">{selectedId ?? t.labels.none}</div>
            </div>
        </div>
    );
}

export default function TreePage() {
    const common = useShowcaseCommonI18n();
    const t = useShowcaseTreeI18n();

    const props = React.useMemo<PropDef[]>(() => [
        { name: 'nodes', type: 'TreeNode[]', description: t.propsDocs.items.nodes.description },
        { name: 'expanded', type: 'string[]', description: t.propsDocs.items.expanded.description },
        { name: 'defaultExpanded', type: 'string[]', description: t.propsDocs.items.defaultExpanded.description },
        { name: 'onExpandedChange', type: '(expanded: string[]) => void', description: t.propsDocs.items.onExpandedChange.description },
        { name: 'selectedId', type: 'string | null', description: t.propsDocs.items.selectedId.description },
        { name: 'defaultSelectedId', type: 'string | null', description: t.propsDocs.items.defaultSelectedId.description },
        { name: 'onSelect', type: '(node: TreeNode) => void', description: t.propsDocs.items.onSelect.description },
        { name: 'ariaLabel', type: 'string', description: t.propsDocs.items.ariaLabel.description, control: 'text' },
        { name: 'className', type: 'string', description: t.propsDocs.items.className.description, control: 'text' },
        { name: 'itemClassName', type: 'string', description: t.propsDocs.items.itemClassName.description, control: 'text' },
        { name: 'selectedClassName', type: 'string', description: t.propsDocs.items.selectedClassName.description, control: 'text' },
    ], [t]);

    const playground = React.useMemo<PlaygroundConfig>(() => ({
        props,
        defaultProps: { ariaLabel: t.labels.fileTree, className: '', itemClassName: '', selectedClassName: '' },
        render: (p) => (
            <Tree
                nodes={PATH_NODES}
                defaultExpanded={['src', 'src/components', 'src/libs']}
                defaultSelectedId="src/libs/tree.ts"
                ariaLabel={p.ariaLabel || undefined}
                className={p.className || undefined}
                itemClassName={p.itemClassName || undefined}
                selectedClassName={p.selectedClassName || undefined}
            />
        ),
    }), [props, t.labels.fileTree]);

    usePlayground(playground, t.playground.title);

    return (
        <PageLayout title={t.page.title} description={t.page.description}>
            <Section
                title={t.sections.fileExplorer.title}
                description={t.sections.fileExplorer.description}
                preview={<ExplorerDemo />}
                code={`import { Tree } from '@llmnative/react';

<Tree
    nodes={[
        { id: 'src', label: 'src', icon: 'folder', children: [
            { id: 'src/index.ts', label: 'index.ts', icon: 'file' },
            { id: 'src/libs', label: 'libs', icon: 'folder', children: [
                { id: 'src/libs/tree.ts', label: 'tree.ts', icon: 'file', badge: <Badge>new</Badge> },
            ]},
        ]},
        { id: 'package.json', label: 'package.json', icon: 'file' },
    ]}
    defaultExpanded={['src', 'src/libs']}
    selectedId={selectedId}
    onSelect={(node) => setSelectedId(node.id)}
/>`}
            />

            <Section
                title={t.sections.controlled.title}
                description={t.sections.controlled.description}
                preview={<ControlledDemo />}
                code={`const [expanded, setExpanded] = useState(['src']);
const [selectedId, setSelectedId] = useState<string | null>(null);

<Tree
    nodes={nodes}
    expanded={expanded}
    onExpandedChange={setExpanded}
    selectedId={selectedId}
    onSelect={(node) => setSelectedId(node.id)}
/>`}
            />

            <Section
                title={t.sections.fromPaths.title}
                description={t.sections.fromPaths.description}
                preview={
                    <div className="w-full max-w-md">
                        <Tree nodes={PATH_NODES} defaultExpanded={['src', 'src/components', 'src/libs']} defaultSelectedId="src/libs/tree.ts" />
                    </div>
                }
                code={`import { Tree, treeFromPaths } from '@llmnative/react';

const nodes = treeFromPaths([
    'src/components/ui/Tree.tsx',
    'src/libs/tree.ts',
    'tests/unit/components/Tree.test.tsx',
    'package.json',
]);

<Tree nodes={nodes} defaultExpanded={['src']} />`}
            />

            <PropDocsTable props={props} title={common.sections.props} />
        </PageLayout>
    );
}
