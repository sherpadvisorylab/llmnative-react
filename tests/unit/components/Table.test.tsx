import { describe, expect, it } from 'vitest';
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
});
