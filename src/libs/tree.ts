/**
 * Pure tree helpers — no React, no provider access.
 *
 * `treeFromPaths` turns a flat list of slash-separated paths (`a/b/c`) into a
 * nested tree of `PathTreeNode`. The full path is used as the `id`, a node with
 * children is a folder and a leaf is a file. Siblings are ordered folders first,
 * then by label.
 */

export interface PathTreeNode {
    /** Full path of the node, e.g. `a/b/c`. */
    id: string;
    /** Last path segment. */
    label: string;
    children?: PathTreeNode[];
}

interface MutableTreeNode {
    id: string;
    label: string;
    children: Map<string, MutableTreeNode>;
}

/**
 * Builds a tree from a list of `a/b/c` paths.
 *
 * - The full path is used as the node `id`, the last segment as its `label`.
 * - Intermediate segments become folders; a path that is also a prefix of
 *   another path is treated as a folder.
 * - Every level is sorted with folders before files, then alphabetically.
 * - Empty paths and empty segments are ignored; duplicate paths collapse.
 */
export function treeFromPaths(paths: readonly string[]): PathTreeNode[] {
    const roots = new Map<string, MutableTreeNode>();

    for (const raw of paths) {
        const segments = raw.split('/').map((segment) => segment.trim()).filter(Boolean);
        if (segments.length === 0) continue;

        let level = roots;
        let currentId = '';
        for (const segment of segments) {
            currentId = currentId ? `${currentId}/${segment}` : segment;
            let node = level.get(segment);
            if (!node) {
                node = { id: currentId, label: segment, children: new Map() };
                level.set(segment, node);
            }
            level = node.children;
        }
    }

    const toNodes = (level: Map<string, MutableTreeNode>): PathTreeNode[] => {
        const nodes: PathTreeNode[] = [...level.values()].map((node) => {
            const children = toNodes(node.children);
            return {
                id: node.id,
                label: node.label,
                children: children.length > 0 ? children : undefined,
            };
        });

        nodes.sort((a, b) => {
            const aFolder = a.children !== undefined;
            const bFolder = b.children !== undefined;
            if (aFolder !== bFolder) return aFolder ? -1 : 1;
            return a.label.localeCompare(b.label);
        });

        return nodes;
    };

    return toNodes(roots);
}
