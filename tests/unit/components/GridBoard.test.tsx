import { describe, it, expect, vi } from 'vitest';
import { act, fireEvent, screen, waitFor, within } from '@testing-library/react';
import React from 'react';

vi.mock('../../../src/Config', () => ({
    getConfig: vi.fn(() => ({})),
    onConfigChange: vi.fn(),
    default: {},
}));
vi.mock('../../../src/providers/firebase-init', () => ({ default: vi.fn(), getSafeAuth: vi.fn() }));


import Grid from '../../../src/components/widgets/Grid';
import { renderWithProviders } from '../../helpers/renderWithProviders';

// CR-138 — the kanban view of Grid.

type Pratica = { id: string; nome: string; fase: string; prodotto: string };

const RECORDS: Pratica[] = [
    { id: 'p1', nome: 'Rossi Srl', fase: 'nuova', prodotto: 'Leasing' },
    { id: 'p2', nome: 'Bianchi Spa', fase: 'analisi', prodotto: 'Innovazione 4.0' },
    { id: 'p3', nome: 'Verdi Snc', fase: 'nuova', prodotto: 'Leasing' },
];

const BOARD_COLUMNS = [
    { id: 'nuova', label: 'Nuova' },
    { id: 'analisi', label: 'Analisi' },
    { id: 'firmata', label: 'Firmata' },
];

const COLUMNS = [
    { key: 'nome', label: 'Nome' },
    { key: 'prodotto', label: 'Prodotto' },
];

const NAMES = /(Rossi Srl|Bianchi Spa|Verdi Snc)/;
const column = (name: string) => screen.getAllByRole('listitem', { name }).find((el) => el.tagName === 'SECTION')!;
const cardsIn = (name: string) => within(column(name)).queryAllByRole('listitem').filter((li) => li.tabIndex === 0);
const namesIn = (name: string) => cardsIn(name).map((li) => li.textContent?.match(NAMES)?.[0]);

describe('Grid - board view (CR-138)', () => {
    it('places the records in the columns of their stage, with the count and the empty state', () => {
        renderWithProviders(
            <Grid<Pratica> records={RECORDS} recordId="id" columns={COLUMNS} view="board" views={{ board: { columns: BOARD_COLUMNS, column: 'fase' } }} />,
        );
        expect(screen.getAllByRole('listitem').filter((li) => li.tagName === 'SECTION').map((s) => s.getAttribute('aria-label'))).toEqual(['Nuova', 'Analisi', 'Firmata']);
        expect(namesIn('Nuova')).toEqual(['Rossi Srl', 'Verdi Snc']);
        expect(namesIn('Analisi')).toEqual(['Bianchi Spa']);
        expect(within(column('Nuova')).getByText('2')).toBeInTheDocument();
        expect(within(column('Firmata')).getByText('No records')).toBeInTheDocument();
        // The default card: the first column as its title, the next ones as label/value.
        expect(within(column('Analisi')).getByText('Prodotto:')).toBeInTheDocument();
    });

    it('keeps the search when switching between table and board', async () => {
        renderWithProviders(
            <Grid<Pratica>
                records={RECORDS}
                recordId="id"
                columns={COLUMNS}
                searchable={{ fields: ['nome'] }}
                views={{ toggle: ['table', 'board'], board: { columns: BOARD_COLUMNS, column: 'fase' } }}
            />,
        );
        expect(screen.queryByRole('button', { name: 'Gallery view' })).not.toBeInTheDocument();
        fireEvent.change(screen.getByPlaceholderText('Search'), { target: { value: 'verdi' } });
        await waitFor(() => expect(screen.queryByText('Rossi Srl')).not.toBeInTheDocument());
        fireEvent.click(screen.getByRole('button', { name: 'Board view' }));
        expect(namesIn('Nuova')).toEqual(['Verdi Snc']);
        expect(namesIn('Analisi')).toEqual([]);
        fireEvent.click(screen.getByRole('button', { name: 'Table view' }));
        expect(screen.getByText('Verdi Snc')).toBeInTheDocument();
        expect(screen.queryByText('Bianchi Spa')).not.toBeInTheDocument();
    });

    it('moves a card with the menu and with the arrow keys, calling onMove with the columns', async () => {
        const onMove = vi.fn(async () => undefined);
        renderWithProviders(
            <Grid<Pratica> records={RECORDS} recordId="id" columns={COLUMNS} view="board" views={{ board: { columns: BOARD_COLUMNS, column: 'fase', onMove } }} />,
        );
        // The menu of the card: the other columns.
        fireEvent.click(within(cardsIn('Analisi')[0]).getByRole('button', { name: 'Move to' }));
        fireEvent.click(await screen.findByRole('menuitem', { name: 'Firmata' }));
        await waitFor(() => expect(onMove).toHaveBeenCalledWith(expect.objectContaining({ id: 'p2' }), 'firmata', 'analisi'));
        await waitFor(() => expect(namesIn('Firmata')).toEqual(['Bianchi Spa']));

        // The arrow keys on a focused card.
        const rossi = cardsIn('Nuova')[0];
        fireEvent.keyDown(rossi, { key: 'ArrowRight' });
        await waitFor(() => expect(onMove).toHaveBeenLastCalledWith(expect.objectContaining({ id: 'p1' }), 'analisi', 'nuova'));
        await waitFor(() => expect(namesIn('Analisi')).toEqual(['Rossi Srl']));
    });

    it('moves a card by dragging it to another column', async () => {
        const onMove = vi.fn();
        renderWithProviders(
            <Grid<Pratica> records={RECORDS} recordId="id" columns={COLUMNS} view="board" views={{ board: { columns: BOARD_COLUMNS, column: 'fase', onMove } }} />,
        );
        const dataTransfer = { setData: vi.fn(), effectAllowed: '', dropEffect: '' };
        fireEvent.dragStart(cardsIn('Nuova')[1], { dataTransfer });
        fireEvent.dragOver(column('Firmata'), { dataTransfer });
        fireEvent.drop(column('Firmata'), { dataTransfer });
        await waitFor(() => expect(onMove).toHaveBeenCalledWith(expect.objectContaining({ id: 'p3' }), 'firmata', 'nuova'));
        expect(namesIn('Firmata')).toEqual(['Verdi Snc']);
    });

    it('puts the card back when onMove refuses, and offers only the columns canMove allows', async () => {
        let refuse!: (value: boolean) => void;
        const onMove = vi.fn(() => new Promise<boolean>((resolve) => { refuse = resolve; }));
        renderWithProviders(
            <Grid<Pratica>
                records={RECORDS}
                recordId="id"
                columns={COLUMNS}
                view="board"
                views={{ board: { columns: BOARD_COLUMNS, column: 'fase', onMove, canMove: (_record, to) => to !== 'firmata' } }}
            />,
        );
        const bianchi = cardsIn('Analisi')[0];
        fireEvent.keyDown(bianchi, { key: 'ArrowRight' }); // Firmata is not allowed: nothing happens.
        expect(onMove).not.toHaveBeenCalled();
        fireEvent.keyDown(bianchi, { key: 'ArrowLeft' });
        // Shown in the new column while pending…
        await waitFor(() => expect(namesIn('Nuova')).toEqual(['Rossi Srl', 'Bianchi Spa', 'Verdi Snc']));
        await act(async () => { refuse(false); });
        // …and back once refused.
        await waitFor(() => expect(namesIn('Analisi')).toEqual(['Bianchi Spa']));
        expect(namesIn('Nuova')).toEqual(['Rossi Srl', 'Verdi Snc']);
    });

    it('opens a card as a click on a row does', () => {
        const onRowClick = vi.fn();
        renderWithProviders(
            <Grid<Pratica> records={RECORDS} recordId="id" columns={COLUMNS} view="board" onRowClick={onRowClick} views={{ board: { columns: BOARD_COLUMNS, column: 'fase' } }} />,
        );
        fireEvent.click(cardsIn('Analisi')[0]);
        expect(onRowClick).toHaveBeenCalledWith(expect.objectContaining({ id: 'p2' }));
    });
});
