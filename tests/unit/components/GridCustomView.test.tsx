import { describe, it, expect, vi } from 'vitest';
import { fireEvent, screen, waitFor } from '@testing-library/react';
import React from 'react';

vi.mock('../../../src/Config', () => ({
    getConfig: vi.fn(() => ({})),
    onConfigChange: vi.fn(),
    default: {},
}));
vi.mock('../../../src/providers/firebase-init', () => ({ default: vi.fn(), getSafeAuth: vi.fn() }));

import Grid from '../../../src/components/widgets/Grid';
import type { GridCustomView } from '../../../src/components/widgets/grid-core/types';
import { renderWithProviders } from '../../helpers/renderWithProviders';

// CR-145 — the views a page adds to the switch of the Grid.

type Persona = { id: string; nome: string; sponsor?: string };
const RECORDS: Persona[] = [
    { id: 'a', nome: 'Anna' },
    { id: 'b', nome: 'Bruno', sponsor: 'a' },
    { id: 'c', nome: 'Carla', sponsor: 'a' },
];
const COLUMNS = [{ key: 'nome', label: 'Nome' }];

const albero: GridCustomView<Persona> = {
    id: 'albero',
    label: 'Tree view',
    icon: 'network',
    render: ({ records, onRecordClick }) => (
        <ul aria-label="tree">
            {records.map((r) => <li key={r.id}><button type="button" onClick={() => onRecordClick?.(r)}>{`${r.nome} under ${r.sponsor ?? '-'}`}</button></li>)}
        </ul>
    ),
};

describe('Grid - custom views (CR-145)', () => {
    it('offers the custom view after the built-in ones and gives it the searched records', async () => {
        const onRowClick = vi.fn();
        renderWithProviders(
            <Grid<Persona> records={RECORDS} recordId="id" columns={COLUMNS} searchable={{ fields: ['nome'] }} onRowClick={onRowClick} views={{ toggle: true, custom: [albero] }} />,
        );
        expect(screen.getByRole('button', { name: 'Gallery view' })).toBeInTheDocument();
        fireEvent.change(screen.getByPlaceholderText('Search'), { target: { value: 'carla' } });
        await waitFor(() => expect(screen.queryByText('Anna')).not.toBeInTheDocument());
        fireEvent.click(screen.getByRole('button', { name: 'Tree view' }));
        expect(screen.getByRole('list', { name: 'tree' }).textContent).toBe('Carla under a');
        fireEvent.click(screen.getByText('Carla under a'));
        expect(onRowClick).toHaveBeenCalledWith(expect.objectContaining({ id: 'c' }));
    });

    it('opens on a custom view with `view`, and the toggle list names it by id', () => {
        renderWithProviders(
            <Grid<Persona> records={RECORDS} recordId="id" columns={COLUMNS} view="albero" views={{ toggle: ['albero', 'table'], custom: [albero] }} />,
        );
        expect(screen.getByRole('list', { name: 'tree' }).children).toHaveLength(3);
        expect(screen.queryByRole('button', { name: 'Gallery view' })).not.toBeInTheDocument();
        fireEvent.click(screen.getByRole('button', { name: 'Table view' }));
        expect(screen.queryByRole('list', { name: 'tree' })).not.toBeInTheDocument();
        expect(screen.getByText('Bruno')).toBeInTheDocument();
    });
});
