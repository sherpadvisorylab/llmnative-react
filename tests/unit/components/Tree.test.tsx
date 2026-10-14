import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { Tree } from '../../../src/components';
import type { TreeNode } from '../../../src/components';
import { treeFromPaths } from '../../../src/libs';
import { I18nProvider } from '../../../src/I18n';

const NODES: TreeNode[] = [
    {
        id: 'src',
        label: 'src',
        children: [
            { id: 'src/index.ts', label: 'index.ts' },
            {
                id: 'src/libs',
                label: 'libs',
                children: [{ id: 'src/libs/cn.ts', label: 'cn.ts' }],
            },
        ],
    },
    { id: 'package.json', label: 'package.json' },
    { id: 'locked', label: 'locked', disabled: true },
];

const view = (props: React.ComponentProps<typeof Tree>) => (
    <I18nProvider>
        <Tree {...props} />
    </I18nProvider>
);

function renderTree(props: Partial<React.ComponentProps<typeof Tree>> = {}) {
    const result = render(view({ nodes: NODES, ...props }));
    const item = (id: string) => result.container.querySelector(`[data-tree-id="${id}"]`) as HTMLElement;
    const row = (id: string) => result.container.querySelector(`[data-tree-row="${id}"]`) as HTMLElement;
    return { ...result, item, row };
}

describe('Tree', () => {
    it('renders the WAI-ARIA tree structure with a single tab stop', () => {
        const { item } = renderTree();

        const tree = screen.getByRole('tree');
        expect(tree).toHaveAttribute('aria-label', 'File tree');
        expect(screen.getAllByRole('treeitem')).toHaveLength(3);

        expect(item('src')).toHaveAttribute('aria-level', '1');
        expect(item('src')).toHaveAttribute('aria-expanded', 'false');
        expect(item('package.json')).toHaveAttribute('aria-selected', 'false');

        const tabStops = document.querySelectorAll('[role="treeitem"][tabindex="0"]');
        expect(tabStops).toHaveLength(1);
        expect(tabStops[0]).toBe(item('src'));
    });

    it('opens and closes a folder by click (uncontrolled expansion)', () => {
        const { item, row } = renderTree();

        expect(item('src')).toHaveAttribute('aria-expanded', 'false');
        expect(item('src/index.ts')).toBeNull();

        fireEvent.click(row('src'));
        expect(item('src')).toHaveAttribute('aria-expanded', 'true');
        expect(item('src/index.ts')).not.toBeNull();
        expect(screen.getAllByRole('treeitem')).toHaveLength(5);

        fireEvent.click(row('src'));
        expect(item('src')).toHaveAttribute('aria-expanded', 'false');
        expect(item('src/index.ts')).toBeNull();
    });

    it('supports controlled expansion through expanded/onExpandedChange', () => {
        const onExpandedChange = vi.fn();
        const { item, row, rerender } = renderTree({ expanded: [], onExpandedChange });

        fireEvent.click(row('src'));
        expect(onExpandedChange).toHaveBeenCalledWith(['src']);
        expect(item('src')).toHaveAttribute('aria-expanded', 'false');

        rerender(view({ nodes: NODES, expanded: ['src'], onExpandedChange }));
        expect(item('src')).toHaveAttribute('aria-expanded', 'true');
    });

    it('selects a node by click and never selects disabled nodes (uncontrolled)', () => {
        const onSelect = vi.fn();
        const { item, row } = renderTree({ onSelect });

        fireEvent.click(row('package.json'));
        expect(onSelect).toHaveBeenCalledWith(expect.objectContaining({ id: 'package.json' }));
        expect(item('package.json')).toHaveAttribute('aria-selected', 'true');

        fireEvent.click(row('locked'));
        expect(onSelect).toHaveBeenCalledTimes(1);
        expect(item('locked')).toHaveAttribute('aria-selected', 'false');
    });

    it('supports controlled selection through selectedId/onSelect', () => {
        const onSelect = vi.fn();
        const { item, row } = renderTree({ selectedId: null, onSelect });

        fireEvent.click(row('package.json'));
        expect(onSelect).toHaveBeenCalledWith(expect.objectContaining({ id: 'package.json' }));
        expect(item('package.json')).toHaveAttribute('aria-selected', 'false');
    });

    it('honours defaultSelectedId and defaultExpanded', () => {
        const { item } = renderTree({ defaultExpanded: ['src'], defaultSelectedId: 'src/index.ts' });

        expect(item('src')).toHaveAttribute('aria-expanded', 'true');
        expect(item('src/index.ts')).toHaveAttribute('aria-selected', 'true');
    });

    it('navigates with the keyboard (arrows, Home/End, Enter/Space)', () => {
        const onSelect = vi.fn();
        const { item } = renderTree({ onSelect });
        const press = (id: string, key: string) => fireEvent.keyDown(item(id), { key });

        item('src').focus();
        press('src', 'ArrowDown');
        expect(document.activeElement).toBe(item('package.json'));

        press('package.json', 'ArrowDown');
        expect(document.activeElement).toBe(item('locked'));

        press('locked', 'ArrowUp');
        expect(document.activeElement).toBe(item('package.json'));

        press('package.json', 'Home');
        expect(document.activeElement).toBe(item('src'));

        press('src', 'End');
        expect(document.activeElement).toBe(item('locked'));

        press('locked', 'ArrowRight');
        expect(item('src')).toHaveAttribute('aria-expanded', 'false');

        press('src', 'ArrowRight');
        expect(item('src')).toHaveAttribute('aria-expanded', 'true');

        press('src', 'ArrowRight');
        expect(document.activeElement).toBe(item('src/index.ts'));

        press('src/index.ts', 'ArrowLeft');
        expect(document.activeElement).toBe(item('src'));

        press('src', 'ArrowLeft');
        expect(item('src')).toHaveAttribute('aria-expanded', 'false');

        press('package.json', 'Enter');
        expect(onSelect).toHaveBeenCalledWith(expect.objectContaining({ id: 'package.json' }));

        press('locked', ' ');
        expect(onSelect).toHaveBeenCalledTimes(1);
    });

    it('opens a folder from its disclosure button without selecting it', () => {
        const onSelect = vi.fn();
        const { item } = renderTree({ onSelect });

        fireEvent.click(screen.getByRole('button', { name: 'Expand' }));
        expect(item('src')).toHaveAttribute('aria-expanded', 'true');
        expect(onSelect).not.toHaveBeenCalled();
    });

    it('applies custom class names and the aria-label override', () => {
        const { item, container } = renderTree({
            ariaLabel: 'Repository',
            className: 'tree-root',
            itemClassName: 'tree-item',
            selectedClassName: 'tree-selected',
            defaultSelectedId: 'package.json',
        });

        expect(screen.getByRole('tree')).toHaveAttribute('aria-label', 'Repository');
        expect(container.querySelector('.tree-root')).not.toBeNull();
        expect(item('package.json').firstElementChild).toHaveClass('tree-item');
        expect(item('package.json').firstElementChild).toHaveClass('tree-selected');
    });
});

describe('treeFromPaths', () => {
    it('builds a tree from a/b/c paths using the full path as id', () => {
        const tree = treeFromPaths([
            'src/index.ts',
            'src/libs/cn.ts',
            'src/libs/tree.ts',
            'README.md',
        ]);

        expect(tree.map((node) => node.id)).toEqual(['src', 'README.md']);

        const src = tree[0];
        expect(src.label).toBe('src');
        expect(src.children?.map((node) => node.id)).toEqual(['src/libs', 'src/index.ts']);

        const libs = src.children?.[0];
        expect(libs?.children?.map((node) => node.id)).toEqual([
            'src/libs/cn.ts',
            'src/libs/tree.ts',
        ]);
    });

    it('sorts folders before files at every level', () => {
        const tree = treeFromPaths(['a.txt', 'z/b.txt', 'm/c.txt']);

        expect(tree.map((node) => node.id)).toEqual(['m', 'z', 'a.txt']);
        expect(tree.every((node) => node.id !== 'a.txt' || node.children === undefined)).toBe(true);
    });

    it('ignores empty paths and segments and collapses duplicates', () => {
        const tree = treeFromPaths(['', '  ', '/src/index.ts', 'src/index.ts', 'src//index.ts']);

        expect(tree.map((node) => node.id)).toEqual(['src']);
        expect(tree[0].children?.map((node) => node.id)).toEqual(['src/index.ts']);
    });
});
