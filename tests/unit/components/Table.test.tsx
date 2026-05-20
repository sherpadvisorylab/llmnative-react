import { afterEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import Table from '../../../src/components/ui/Table';

const header = [
    { key: 'name', label: 'Name', sort: true },
    { key: 'role', label: 'Role' },
];

const body = [
    { _key: 'u2', name: 'Bob', role: 'Editor' },
    { _key: 'u1', name: 'Alice', role: 'Admin' },
];

describe('Table', () => {
    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('sorts records internally and toggles direction from the header', async () => {
        render(<Table header={header} body={body} sortable />);

        await waitFor(() => {
            const initialCells = screen.getAllByRole('cell').filter((cell) => ['Alice', 'Bob'].includes(cell.textContent || ''));
            expect(initialCells[0]).toHaveTextContent('Alice');
            expect(initialCells[1]).toHaveTextContent('Bob');
        });

        let cells = screen.getAllByRole('cell').filter((cell) => ['Alice', 'Bob'].includes(cell.textContent || ''));
        expect(cells[0]).toHaveTextContent('Alice');
        expect(cells[1]).toHaveTextContent('Bob');

        fireEvent.click(screen.getByText('Name'));
        cells = screen.getAllByRole('cell').filter((cell) => ['Alice', 'Bob'].includes(cell.textContent || ''));
        expect(cells[0]).toHaveTextContent('Bob');
        expect(cells[1]).toHaveTextContent('Alice');
    });

    it('passes the clicked record to onClick', () => {
        const clicks: string[] = [];

        render(
            <Table
                header={header}
                body={body}
                sortable
                onClick={(record) => clicks.push(record._key || '')}
            />
        );

        fireEvent.click(screen.getByText('Bob'));
        expect(clicks).toEqual(['u2']);
    });

    it('keeps the clicked row highlighted after sort and toggles it off on second click', async () => {
        render(
            <Table
                header={header}
                body={body}
                sortable
                selectedClass="is-active"
                onClick={() => undefined}
            />
        );

        fireEvent.click(screen.getByText('Bob'));

        let bobRow = screen.getAllByRole('row').find((row) => row.textContent?.includes('Bob'));
        expect(bobRow).toHaveClass('is-active');

        fireEvent.click(screen.getByText('Name'));

        await waitFor(() => {
            bobRow = screen.getAllByRole('row').find((row) => row.textContent?.includes('Bob'));
            expect(bobRow).toHaveClass('is-active');
        });

        fireEvent.click(screen.getByText('Bob'));
        expect(bobRow).not.toHaveClass('is-active');
    });

    it('supports a controlled active row key', () => {
        const { rerender } = render(
            <Table
                header={header}
                body={body}
                activeKey="u2"
                selectedClass="is-active"
                onClick={() => undefined}
            />
        );

        let bobRow = screen.getAllByRole('row').find((row) => row.textContent?.includes('Bob'));
        expect(bobRow).toHaveClass('is-active');

        rerender(
            <Table
                header={header}
                body={body}
                activeKey={null}
                selectedClass="is-active"
                onClick={() => undefined}
            />
        );

        bobRow = screen.getAllByRole('row').find((row) => row.textContent?.includes('Bob'));
        expect(bobRow).not.toHaveClass('is-active');
    });

    it('reorders rows and calls onReorder', () => {
        const reorderedKeys: string[][] = [];

        render(
            <Table
                header={header}
                body={body}
                onReorder={(records) => reorderedKeys.push(records.map((record) => record._key || ''))}
            />
        );

        const rows = screen.getAllByRole('row');
        const bobRow = rows.find((row) => row.textContent?.includes('Bob'));
        const aliceRow = rows.find((row) => row.textContent?.includes('Alice'));

        expect(bobRow).toBeTruthy();
        expect(aliceRow).toBeTruthy();

        fireEvent.dragStart(bobRow!);
        fireEvent.dragOver(aliceRow!);
        fireEvent.drop(aliceRow!);

        expect(reorderedKeys).toEqual([['u1', 'u2']]);
        const cells = screen.getAllByRole('cell').filter((cell) => ['Alice', 'Bob'].includes(cell.textContent || ''));
        expect(cells[0]).toHaveTextContent('Alice');
        expect(cells[1]).toHaveTextContent('Bob');
    });

    it('starts drag reorder from the visible handle button', () => {
        const reorderedKeys: string[][] = [];

        render(
            <Table
                header={header}
                body={body}
                onReorder={(records) => reorderedKeys.push(records.map((record) => record._key || ''))}
            />
        );

        const handle = screen.getByLabelText('Reorder row u2');
        const aliceRow = screen.getAllByRole('row').find((row) => row.textContent?.includes('Alice'));

        expect(aliceRow).toBeTruthy();

        fireEvent.dragStart(handle);
        fireEvent.dragOver(aliceRow!);
        fireEvent.drop(aliceRow!);

        expect(reorderedKeys).toEqual([['u1', 'u2']]);
    });

    it('keeps the dropped order when reorder is enabled even if sortable is true', () => {
        const reorderedKeys: string[][] = [];

        render(
            <Table
                header={header}
                body={body}
                sortable
                onReorder={(records) => reorderedKeys.push(records.map((record) => record._key || ''))}
            />
        );

        const handle = screen.getByLabelText('Reorder row u2');
        const aliceRow = screen.getAllByRole('row').find((row) => row.textContent?.includes('Alice'));

        expect(aliceRow).toBeTruthy();

        fireEvent.dragStart(handle);
        fireEvent.dragOver(aliceRow!);
        fireEvent.drop(aliceRow!);

        const cells = screen.getAllByRole('cell').filter((cell) => ['Alice', 'Bob'].includes(cell.textContent || ''));
        expect(reorderedKeys).toEqual([['u1', 'u2']]);
        expect(cells[0]).toHaveTextContent('Alice');
        expect(cells[1]).toHaveTextContent('Bob');
    });

    it('warns and ignores sort configuration when reorder is enabled', () => {
        const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => undefined);

        render(
            <Table
                header={header}
                body={body}
                sortable={{ field: 'name', dir: 'desc' }}
                onReorder={() => undefined}
            />
        );

        const cells = screen.getAllByRole('cell').filter((cell) => ['Alice', 'Bob'].includes(cell.textContent || ''));

        expect(warnSpy).toHaveBeenCalledWith(
            'Table: `onReorder` cannot be combined with sortable sorting on the same view. Manual reorder takes precedence and sorting is ignored.'
        );
        expect(cells[0]).toHaveTextContent('Bob');
        expect(cells[1]).toHaveTextContent('Alice');
    });

    it('tracks checkbox selection and exposes it through onSelectionChange', () => {
        const selections: string[][] = [];

        render(
            <Table
                header={header}
                body={body}
                onSelectionChange={(selection) => selections.push(selection.keys)}
            />
        );

        fireEvent.click(screen.getByLabelText('Select row u2'));
        expect(selections.at(-1)).toEqual(['u2']);

        fireEvent.click(screen.getByLabelText('Select all rows'));
        expect(selections.at(-1)).toEqual(['u2', 'u1']);
    });

    it('keeps selection mapped to the original record when sorted rows have no _key', async () => {
        const selections: string[][] = [];

        render(
            <Table
                header={[{ key: 'name', label: 'Name', sort: true }]}
                body={[
                    { name: 'Bob' },
                    { name: 'Alice' },
                ]}
                sortable
                onSelectionChange={(selection) => selections.push(selection.records.map((record) => record.name))}
            />
        );

        await waitFor(() => {
            expect(screen.getByText('Alice')).toBeInTheDocument();
        });

        fireEvent.click(screen.getAllByRole('checkbox')[1]);
        expect(selections.at(-1)).toEqual(['Alice']);
    });
});
