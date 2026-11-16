import { describe, expect, it, vi } from 'vitest';
import { fireEvent, screen, waitFor, within } from '@testing-library/react';
import React from 'react';
import Form from '../../../src/components/widgets/Form';
import { DropdownSelect } from '../../../src/components/ui/fields/DropdownSelect';
import { AsyncDropdown } from '../../../src/components/blocks/Dropdown';
import { Select } from '../../../src/components/ui/fields/Select';
import { renderWithProviders } from '../../helpers/renderWithProviders';

// CR-136: AsyncDropdown with groups under sticky headers, and DropdownSelect, the form field on it.

const OPTIONS = [
    { label: 'gemini-3.1-flash-lite', value: 'vertex/gemini-3.1-flash-lite', group: 'Vertex AI', hint: 'UE' },
    { label: 'gemini-4-argon', value: 'vertex/gemini-4-argon', group: 'Vertex AI', hint: 'UE' },
    { label: 'haiku', value: 'runner/claude-code:haiku', group: 'Abbonamenti sul runner' },
];

const openMenu = async () => {
    fireEvent.click(screen.getByRole('button', { name: /Vertex AI · gemini-4-argon|Select/ }));
    return waitFor(() => {
        const menu = screen.getAllByRole('menu').find((m) => m.getAttribute('aria-hidden') === 'false');
        expect(menu).toBeTruthy();
        return menu!;
    });
};

describe('AsyncDropdown with groups', () => {
    it('lists the items under the header of their group, sticky, in the order each group first appears', async () => {
        renderWithProviders(
            <AsyncDropdown
                trigger="Apri"
                loadItems={async () => [{ id: 'a', g: 'Due' }, { id: 'b', g: 'Uno' }, { id: 'c', g: 'Due' }]}
                getItemId={(item) => item.id}
                getItemGroup={(item) => item.g}
                renderItem={(item) => item.id}
                onSelect={() => undefined}
            />,
        );
        fireEvent.click(screen.getByRole('button', { name: 'Apri' }));
        const groups = await screen.findAllByRole('group');
        expect(groups.map((g) => g.getAttribute('aria-label'))).toEqual(['Due', 'Uno']);
        expect(groups[0].firstElementChild?.className).toMatch(/sticky/);
        expect(within(groups[0]).getAllByRole('menuitem').map((i) => i.textContent)).toEqual(['a', 'c']);
    });
});

describe('DropdownSelect', () => {
    it('shows the chosen option with its group and keeps the value for the form', () => {
        renderWithProviders(
            <Form appearance="empty" showNotice={false} defaultValues={{ modello: 'vertex/gemini-4-argon' }}>
                <DropdownSelect name="modello" label="Modello" options={OPTIONS} />
            </Form>,
        );
        expect(screen.getByRole('button', { name: /Vertex AI · gemini-4-argon/ })).toBeInTheDocument();
        expect(document.querySelector('input[type="hidden"][name="modello"]')).toHaveValue('vertex/gemini-4-argon');
    });

    it('searches on label, value and group, groups the rows and writes the choice to the form', async () => {
        const changes = vi.fn();
        renderWithProviders(
            <Form appearance="empty" showNotice={false} defaultValues={{ modello: 'vertex/gemini-4-argon' }} onRecordChange={changes}>
                <DropdownSelect name="modello" label="Modello" options={OPTIONS} />
            </Form>,
        );
        const menu = await openMenu();
        expect(within(menu).getAllByRole('group').map((g) => g.getAttribute('aria-label'))).toEqual(['Vertex AI', 'Abbonamenti sul runner']);
        expect(within(menu).getAllByText('UE')).toHaveLength(2);
        fireEvent.change(within(menu).getByPlaceholderText(/Search|Cerca/), { target: { value: 'abbonamenti' } });
        await waitFor(() => expect(within(menu).getAllByRole('menuitem').map((i) => i.textContent)).toEqual(['haiku']));
        fireEvent.click(within(menu).getByRole('menuitem', { name: 'haiku' }));
        await waitFor(() => expect(changes).toHaveBeenLastCalledWith(expect.objectContaining({ modello: 'runner/claude-code:haiku' })));
        expect(document.querySelector('input[type="hidden"][name="modello"]')).toHaveValue('runner/claude-code:haiku');
    });
});

describe('Select stays simple', () => {
    it('is the native select, with the groups as optgroup', () => {
        renderWithProviders(
            <Form appearance="empty" showNotice={false} defaultValues={{ s: '' }}>
                <Select name="s" label="S" options={OPTIONS} />
            </Form>,
        );
        const select = document.querySelector('select[name="s"]')!;
        expect([...select.querySelectorAll('optgroup')].map((g) => g.getAttribute('label'))).toEqual(['Vertex AI', 'Abbonamenti sul runner']);
    });
});
