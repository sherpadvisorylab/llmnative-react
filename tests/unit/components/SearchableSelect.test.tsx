import { describe, expect, it, vi } from 'vitest';
import { act, fireEvent, screen, waitFor, within } from '@testing-library/react';
import React from 'react';
import Form from '../../../src/components/widgets/Form';
import { Select } from '../../../src/components/ui/fields/Select';
import { renderWithProviders } from '../../helpers/renderWithProviders';

// CR-135: a Select with a search box and the options grouped, each group's header sticky.

const OPTIONS = [
    { label: 'gemini-3.1-flash-lite · UE', value: 'vertex/gemini-3.1-flash-lite', group: 'Vertex AI' },
    { label: 'gemini-4-argon · UE', value: 'vertex/gemini-4-argon', group: 'Vertex AI' },
    { label: 'haiku', value: 'runner/claude-code:haiku', group: 'Abbonamenti sul runner' },
];

function renderSelect(onRecordChange = vi.fn(), extra: Record<string, unknown> = {}) {
    renderWithProviders(
        <Form appearance="empty" showNotice={false} defaultValues={{ modello: 'vertex/gemini-4-argon' }} onRecordChange={onRecordChange}>
            <Select name="modello" label="Modello" searchable options={OPTIONS} {...extra} />
        </Form>,
    );
    return onRecordChange;
}

describe('Select searchable', () => {
    it('shows the chosen option with its group, and keeps the value for the form', () => {
        renderSelect();
        const field = screen.getByRole('button', { name: /Modello/ });
        expect(field).toHaveTextContent('Vertex AI · gemini-4-argon · UE');
        expect(document.querySelector('input[type="hidden"][name="modello"]')).toHaveValue('vertex/gemini-4-argon');
    });

    it('opens on a search box and the options grouped, each group with a sticky header', async () => {
        renderSelect();
        fireEvent.click(screen.getByRole('button', { name: /Modello/ }));
        const list = await screen.findByRole('listbox');
        const groups = within(list).getAllByRole('group');
        expect(groups.map((g) => g.getAttribute('aria-label'))).toEqual(['Vertex AI', 'Abbonamenti sul runner']);
        expect(groups[0].firstElementChild?.className).toMatch(/sticky/);
        expect(within(groups[0]).getAllByRole('option').map((o) => o.textContent)).toEqual(['gemini-3.1-flash-lite · UE', 'gemini-4-argon · UE✓']);
        await waitFor(() => expect(screen.getByRole('combobox')).toHaveFocus());
    });

    it('filters on label, value and group, and a click chooses', async () => {
        const changes = renderSelect();
        fireEvent.click(screen.getByRole('button', { name: /Modello/ }));
        const search = await screen.findByRole('combobox');
        fireEvent.change(search, { target: { value: 'abbonamenti' } });
        expect(within(screen.getByRole('listbox')).getAllByRole('option').map((o) => o.textContent)).toEqual(['haiku']);
        fireEvent.change(search, { target: { value: 'nessuno' } });
        expect(within(screen.getByRole('listbox')).queryAllByRole('option')).toHaveLength(0);
        fireEvent.change(search, { target: { value: 'haiku' } });
        fireEvent.click(within(screen.getByRole('listbox')).getByRole('option', { name: 'haiku' }));
        await waitFor(() => expect(changes).toHaveBeenLastCalledWith(expect.objectContaining({ modello: 'runner/claude-code:haiku' })));
        expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    });

    it('is driven by the keyboard; Escape closes the list only', async () => {
        const changes = renderSelect();
        const field = screen.getByRole('button', { name: /Modello/ });
        fireEvent.keyDown(field, { key: 'ArrowDown' });
        const search = await screen.findByRole('combobox');
        fireEvent.change(search, { target: { value: 'gemini' } });
        fireEvent.keyDown(search, { key: 'ArrowDown' });
        fireEvent.keyDown(search, { key: 'Enter' });
        await waitFor(() => expect(changes).toHaveBeenLastCalledWith(expect.objectContaining({ modello: 'vertex/gemini-4-argon' })));
        fireEvent.click(field);
        const again = await screen.findByRole('combobox');
        const outer = vi.fn();
        document.addEventListener('keydown', outer);
        await act(async () => { fireEvent.keyDown(again, { key: 'Escape' }); });
        document.removeEventListener('keydown', outer);
        expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
        expect(outer).not.toHaveBeenCalled();
    });

    it('without groups the list is flat; without searchable it stays the native select', async () => {
        renderWithProviders(
            <Form appearance="empty" showNotice={false} defaultValues={{ a: '', b: '' }}>
                <Select name="a" label="A" searchable options={['uno', 'due']} />
                <Select name="b" label="B" options={['uno', 'due']} />
            </Form>,
        );
        expect(document.querySelector('select[name="b"]')).toBeInTheDocument();
        fireEvent.click(screen.getByRole('button', { name: /A/ }));
        const list = await screen.findByRole('listbox');
        expect(within(list).queryAllByRole('group')).toHaveLength(0);
        expect(within(list).getAllByRole('option').map((o) => o.textContent)).toEqual(['Select...✓', 'due', 'uno']);
    });
});
