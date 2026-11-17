import { describe, expect, it, vi } from 'vitest';
import { fireEvent, screen, waitFor } from '@testing-library/react';
import React from 'react';
import Form from '../../../src/components/widgets/Form';
import Repeat from '../../../src/components/ui/Repeat';
import { Input, Switch } from '../../../src/components/ui/fields/Input';
import SortableList from '../../../src/components/blocks/SortableList';
import Grid from '../../../src/components/widgets/Grid';
import { renderWithProviders } from '../../helpers/renderWithProviders';

// CR-140: the names of the fields of a Repeat row, a Switch on a boolean, and the announcements of the lists.

const type = (field: HTMLElement, value: string) => fireEvent.change(field, { target: { value } });

describe('Repeat: the name of a field of a row', () => {
    for (const [stile, nome] of [['relative', () => 'name'], ['full', (index: number) => `items.${index}.name`]] as const) {
        it(`a ${stile} name reads and writes the field of its row`, async () => {
            const changes = vi.fn();
            const { container } = renderWithProviders(
                <Form appearance="empty" showNotice={false} defaultValues={{ items: [{ name: 'a' }] }} onRecordChange={changes}>
                    <Repeat name="items">
                        {({ index }: { index: number }) => <Input name={nome(index)} label="Nome" />}
                    </Repeat>
                </Form>,
            );
            const field = container.querySelector('input[name="items.0.name"]') as HTMLInputElement;
            expect(field).toBeTruthy();
            expect(field.value).toBe('a');
            expect(container.querySelector('input[name="items.0.0.name"]')).toBeNull();
            type(field, 'b');
            await waitFor(() => expect(changes).toHaveBeenLastCalledWith(expect.objectContaining({ items: [{ name: 'b' }] })));
        });
    }
});

describe('Switch on a boolean', () => {
    it('is on for true, and writes a boolean when toggled', async () => {
        const changes = vi.fn();
        renderWithProviders(
            <Form appearance="empty" showNotice={false} defaultValues={{ obbligatorio: true, ricorrente: false }} onRecordChange={changes}>
                <Switch name="obbligatorio" label="Obbligatorio" />
                <Switch name="ricorrente" label="Ricorrente" />
            </Form>,
        );
        const obbligatorio = screen.getByLabelText('Obbligatorio') as HTMLInputElement;
        const ricorrente = screen.getByLabelText('Ricorrente') as HTMLInputElement;
        expect(obbligatorio.checked).toBe(true);
        expect(ricorrente.checked).toBe(false);
        fireEvent.click(obbligatorio);
        await waitFor(() => expect(changes).toHaveBeenLastCalledWith(expect.objectContaining({ obbligatorio: false })));
        fireEvent.click(ricorrente);
        await waitFor(() => expect(changes).toHaveBeenLastCalledWith(expect.objectContaining({ ricorrente: true })));
    });

    it('is on for true inside a Repeat row', () => {
        renderWithProviders(
            <Form appearance="empty" showNotice={false} defaultValues={{ voci: [{ attiva: true }, { attiva: false }] }}>
                <Repeat name="voci">
                    {() => <Switch name="attiva" label="Attiva" />}
                </Repeat>
            </Form>,
        );
        const [prima, seconda] = screen.getAllByLabelText('Attiva') as HTMLInputElement[];
        expect(prima.checked).toBe(true);
        expect(seconda.checked).toBe(false);
    });

    it('keeps the value it is given when it is not a boolean', async () => {
        const changes = vi.fn();
        renderWithProviders(
            <Form appearance="empty" showNotice={false} defaultValues={{ s: '' }} onRecordChange={changes}>
                <Switch name="s" label="S" />
            </Form>,
        );
        fireEvent.click(screen.getByLabelText('S'));
        await waitFor(() => expect(changes).toHaveBeenLastCalledWith(expect.objectContaining({ s: 'on' })));
    });
});

describe('The announcements of the lists stay inside them', () => {
    it('SortableList and the board are positioned, so their screen reader announcement cannot stretch a page', () => {
        const { container } = renderWithProviders(
            <SortableList items={[{ id: 'a' }]} getKey={(item) => item.id} renderItem={(item) => ({ title: item.id })} onReorder={() => undefined} />,
        );
        const annuncio = container.querySelector('[aria-live="polite"]');
        expect(annuncio?.parentElement?.className).toMatch(/\brelative\b/);

        const board = renderWithProviders(
            <Grid
                records={[{ id: 'r1', fase: 'a', nome: 'Uno' }]}
                recordId="id"
                columns={[{ key: 'nome', label: 'Nome' }]}
                view="board"
                views={{ board: { columns: [{ id: 'a', label: 'A' }], column: 'fase' } }}
            />,
        );
        const annunci = [...board.container.querySelectorAll('[aria-live="polite"]')];
        expect(annunci.length).toBeGreaterThan(0);
        expect(annunci.some((a) => /\brelative\b/.test(a.parentElement?.className ?? ''))).toBe(true);
    });
});
