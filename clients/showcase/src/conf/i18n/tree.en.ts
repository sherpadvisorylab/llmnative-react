import { defineLocaleMessages } from '@llmnative/react';

export default defineLocaleMessages({
    showcase: {
        tree: {
            page: {
                title: 'Tree',
                description: 'Accessible folder/file tree (WAI-ARIA tree pattern): folders open and close, one node is selected. Expansion and selection can be controlled or uncontrolled.',
            },
            sections: {
                fileExplorer: { title: 'File explorer', description: 'A folder tree with icons, a badge and a disabled node; selecting a file shows it beside the tree.' },
                controlled: { title: 'Controlled expansion', description: 'The parent owns the expanded/selected state and can open or collapse every folder.' },
                fromPaths: { title: 'From paths', description: 'treeFromPaths turns a flat list of a/b/c paths into a tree: folders before files, the full path as id.' },
            },
            labels: {
                fileTree: 'Package files',
                selected: 'Selected',
                none: 'None',
                expandAll: 'Expand all',
                collapseAll: 'Collapse all',
                openFolders: 'Open folders',
                selectedNode: 'Selected node',
                preview: 'Preview',
            },
            propsDocs: { items: {
                nodes: { description: 'Tree nodes: { id, label, icon?, badge?, description?, children?, disabled? }.' },
                expanded: { description: 'Controlled expanded ids (together with onExpandedChange).' },
                defaultExpanded: { description: 'Initial expanded ids for uncontrolled usage.' },
                onExpandedChange: { description: 'Called with the next expanded ids on every toggle.' },
                selectedId: { description: 'Controlled selected id (together with onSelect).' },
                defaultSelectedId: { description: 'Initial selected id for uncontrolled usage.' },
                onSelect: { description: 'Called with the selected node on click, Enter or Space.' },
                ariaLabel: { description: 'Accessible name of the tree.' },
                className: { description: 'Classes on the role="tree" container.' },
                itemClassName: { description: 'Classes on every row.' },
                selectedClassName: { description: 'Extra classes on the selected row.' },
            } },
            playground: { title: 'Tree playground' },
        },
    },
});
