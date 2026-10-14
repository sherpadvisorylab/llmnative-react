import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { Tree, treeFromPaths, type TreeNode } from '../../../src/components';

const nodes: TreeNode[] = treeFromPaths(['.claude/skills/dev/SKILL.md', '.claude/agents/dev.md', 'AGENTS.md']);

describe('treeFromPaths', () => {
    it('builds folders before files, sorted, with full paths as ids', () => {
        expect(nodes.map((node) => node.id)).toEqual(['.claude/', 'AGENTS.md']);
        const claude = nodes[0];
        expect(claude.children!.map((node) => node.id)).toEqual(['.claude/agents/', '.claude/skills/']);
        expect(claude.children![1].children![0]).toMatchObject({ id: '.claude/skills/dev/', label: 'dev' });
        expect(claude.children![1].children![0].children![0]).toMatchObject({ id: '.claude/skills/dev/SKILL.md', label: 'SKILL.md' });
    });

    it('lets the caller decorate the leaves', () => {
        const [leaf] = treeFromPaths(['a.md'], (path) => ({ description: `about ${path}` }));
        expect(leaf).toMatchObject({ id: 'a.md', label: 'a.md', description: 'about a.md' });
    });
});

describe('Tree', () => {
    it('is an ARIA tree: branches open on click, leaves are selected', () => {
        const onSelect = vi.fn();
        render(<Tree nodes={nodes} ariaLabel="Files" onSelect={onSelect} />);

        expect(screen.getByRole('tree', { name: 'Files' })).toBeInTheDocument();
        const claude = screen.getByRole('treeitem', { name: /\.claude/ });
        expect(claude).toHaveAttribute('aria-expanded', 'false');
        expect(screen.queryByText('agents')).toBeNull();

        fireEvent.click(claude);
        expect(claude).toHaveAttribute('aria-expanded', 'true');
        expect(screen.getByRole('treeitem', { name: /agents/ })).toHaveAttribute('aria-level', '2');

        fireEvent.click(screen.getByRole('treeitem', { name: /AGENTS\.md/ }));
        expect(onSelect).toHaveBeenCalledWith(expect.objectContaining({ id: 'AGENTS.md' }));
        expect(screen.getByRole('treeitem', { name: /AGENTS\.md/ })).toHaveAttribute('aria-selected', 'true');
    });

    it('has one tab stop and moves, opens and selects with the keyboard', () => {
        const onSelect = vi.fn();
        render(<Tree nodes={nodes} onSelect={onSelect} />);
        const items = () => screen.getAllByRole('treeitem');

        expect(items().filter((item) => item.tabIndex === 0)).toHaveLength(1);
        const claude = items()[0];
        fireEvent.keyDown(claude, { key: 'ArrowRight' });
        expect(claude).toHaveAttribute('aria-expanded', 'true');
        fireEvent.keyDown(claude, { key: 'ArrowRight' });
        expect(document.activeElement).toHaveTextContent('agents');
        fireEvent.keyDown(document.activeElement!, { key: 'ArrowLeft' });
        expect(document.activeElement).toBe(claude);
        fireEvent.keyDown(claude, { key: 'End' });
        expect(document.activeElement).toHaveTextContent('AGENTS.md');
        fireEvent.keyDown(document.activeElement!, { key: 'Enter' });
        expect(onSelect).toHaveBeenCalledWith(expect.objectContaining({ id: 'AGENTS.md' }));
        fireEvent.keyDown(claude, { key: 'ArrowLeft' });
        expect(claude).toHaveAttribute('aria-expanded', 'false');
    });

    it('works controlled, and opens every branch with defaultExpanded', () => {
        const onExpandedChange = vi.fn();
        const { unmount } = render(<Tree nodes={nodes} expanded={[]} selectedId="AGENTS.md" onExpandedChange={onExpandedChange} />);
        fireEvent.click(screen.getByRole('treeitem', { name: /\.claude/ }));
        expect(onExpandedChange).toHaveBeenCalledWith(['.claude/']);
        // Controlled: nothing opens until the owner says so.
        expect(screen.getByRole('treeitem', { name: /\.claude/ })).toHaveAttribute('aria-expanded', 'false');
        expect(screen.getByRole('treeitem', { name: /AGENTS\.md/ })).toHaveAttribute('aria-selected', 'true');

        unmount();
        render(<Tree nodes={nodes} defaultExpanded />);
        expect(screen.getByText('SKILL.md')).toBeInTheDocument();
    });
});
