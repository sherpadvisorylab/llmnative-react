import { describe, it, expect, vi } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import React from 'react';

vi.mock('../../../src/Config', () => ({
    getConfig: vi.fn(() => ({})),
    onConfigChange: vi.fn(),
    default: {},
}));
vi.mock('../../../src/providers/firebase-init', () => ({ default: vi.fn(), getSafeAuth: vi.fn() }));
vi.mock('../../../src/Theme', () => ({
    useMotionRegistry: vi.fn(() => ({})),
    useTheme: vi.fn(() => ({
        Card:         { wrapClass: '', className: '', headerClass: '', bodyClass: '', footerClass: '', showLoader: false },
        Loader:       { wrapClass: '', className: '', icon: '', title: '', description: '' },
        Select:       { wrapClass: '', className: '' },
        Autocomplete: { wrapClass: '', className: '' },
        Form: {
            wrapClass: '',
            buttonSaveClass: '', buttonDeleteClass: '', buttonBackClass: '',
            Card: { headerClass: '', bodyClass: '', footerClass: '' },
            i18n: { headerAdd: '', headerEdit: '', headerNewRecord: '', buttonSave: 'Save', buttonDelete: 'Delete', buttonBack: 'Back', noticeRequiredFields: '' },
        },
    })),
    ThemeProvider: ({ children }: any) => children,
}));

import Form from '../../../src/components/widgets/Form';
import userEvent from '@testing-library/user-event';
import { Autocomplete, Checklist, Select } from '../../../src/components/ui/fields/Select';
import { MockDataProvider } from '../../../src/providers/data/mock';
import { renderWithProviders } from '../../helpers/renderWithProviders';

const OPTIONS = [
    { label: 'Admin', value: 'admin' },
    { label: 'Editor', value: 'editor' },
    { label: 'Viewer', value: 'viewer' },
];

describe('Select', () => {
    it('renders static options', () => {
        renderWithProviders(
            <Form defaultValues={{ role: 'editor' }}>
                <Select name="role" label="Role" options={OPTIONS} />
            </Form>
        );

        expect(screen.getByLabelText('Role')).toHaveValue('editor');
        expect(screen.getByRole('option', { name: 'Admin' })).toBeInTheDocument();
    });

    it('loads options from the registered DataProvider using optionsSource.path', async () => {
        const provider = new MockDataProvider({
            '/categories': {
                ops: { label: 'Operations', value: 'ops' },
                sales: { label: 'Sales', value: 'sales' },
            },
        });

        renderWithProviders(
            <Form defaultValues={{ categoryId: 'sales' }}>
                <Select name="categoryId" label="Category" optionsSource={{ path: '/categories' }} />
            </Form>,
            { provider }
        );

        await waitFor(() => {
            expect(screen.getByRole('option', { name: 'Operations' })).toBeInTheDocument();
        });
        expect(screen.getByLabelText('Category')).toHaveValue('sales');
    });
});

describe('Autocomplete', () => {
    const PEOPLE = [
        { label: 'Mario Rossi', value: 'odoo-1' },
        { label: 'Lucía Bianchi', value: 'odoo-2' },
        { label: 'Anna Verdi', value: 'odoo-3' },
    ];

    function renderAutocomplete(props: Partial<React.ComponentProps<typeof Autocomplete>> = {}, defaultValues: Record<string, unknown> = { people: [] }) {
        const records: Array<Record<string, unknown>> = [];
        renderWithProviders(
            <Form defaultValues={defaultValues} onRecordChange={(record) => records.push(record)}>
                <Autocomplete name="people" label="People" placeholder="Search..." options={PEOPLE} {...props} />
            </Form>
        );
        return { records, input: screen.getByRole('combobox', { name: 'People' }), last: () => records[records.length - 1]?.people };
    }

    it('renders a combobox without a native datalist', () => {
        const { container } = renderWithProviders(
            <Form defaultValues={{ assignees: [] }}>
                <Autocomplete name="assignees" label="Assignees" placeholder="Type a person..." options={OPTIONS} />
            </Form>
        );
        expect(screen.getByRole('combobox', { name: 'Assignees' })).toHaveAttribute('aria-expanded', 'false');
        expect(container.querySelector('datalist')).toBeNull();
    });

    it('opens a themed listbox with labels only and filters ignoring case and accents', async () => {
        const user = userEvent.setup();
        const { input } = renderAutocomplete();
        await user.click(input);
        const listbox = screen.getByRole('listbox');
        expect(listbox.parentElement).toBe(document.body);
        expect(screen.getAllByRole('option').map((option) => option.textContent)).toEqual(['Anna Verdi', 'Lucía Bianchi', 'Mario Rossi']);
        expect(screen.queryByText('odoo-1')).toBeNull();
        await user.type(input, 'LUCIA');
        expect(screen.getAllByRole('option').map((option) => option.textContent)).toEqual(['Lucía Bianchi']);
    });

    it('selects with the mouse and shows the label in the chip, storing the value', async () => {
        const user = userEvent.setup();
        const { input, last } = renderAutocomplete({ maxItems: 1 });
        await user.click(input);
        await user.click(screen.getByRole('option', { name: 'Mario Rossi' }));
        expect(last()).toEqual(['odoo-1']);
        expect(screen.getByText('Mario Rossi')).toBeInTheDocument();
        expect(screen.queryByRole('listbox')).toBeNull();
        expect(screen.queryByRole('combobox')).toBeNull();
        await user.click(screen.getByRole('button', { name: 'Remove Mario Rossi' }));
        expect(last()).toEqual([]);
    });

    it('is driven by the keyboard', async () => {
        const user = userEvent.setup();
        const { input, last } = renderAutocomplete();
        await user.click(input);
        await user.keyboard('{ArrowDown}');
        expect(input).toHaveAttribute('aria-activedescendant', screen.getAllByRole('option')[1].id);
        await user.keyboard('{Enter}');
        expect(last()).toEqual(['odoo-2']);
        await user.keyboard('{Escape}');
        expect(screen.queryByRole('listbox')).toBeNull();
        await user.click(input);
        expect(screen.getByRole('listbox')).toBeInTheDocument();
        await user.keyboard('{Escape}{Backspace}');
        expect(last()).toEqual([]);
    });

    it('offers to create a value and lets onCreate keep it out of the selection', async () => {
        const user = userEvent.setup();
        const onCreate = vi.fn().mockReturnValue(false);
        const { input, last } = renderAutocomplete({ creatable: true, onCreate });
        await user.type(input, 'Paolo');
        await user.click(screen.getByRole('option', { name: 'Create «Paolo»' }));
        expect(onCreate).toHaveBeenCalledWith('Paolo');
        expect(last()).toEqual([]);
        expect(input).toHaveValue('');
    });

    it('selects a created value when onCreate does not return false', async () => {
        const user = userEvent.setup();
        const { input, last } = renderAutocomplete({ creatable: true });
        await user.type(input, 'Paolo{Enter}');
        expect(last()).toEqual(['Paolo']);
        expect(screen.getByText('Paolo')).toBeInTheDocument();
    });

    it('shows an empty state when nothing matches', async () => {
        const user = userEvent.setup();
        const { input } = renderAutocomplete();
        await user.type(input, 'zzz');
        expect(screen.getByText('No results')).toBeInTheDocument();
    });
});

describe('Checklist', () => {
    it('renders checkbox options', () => {
        renderWithProviders(
            <Form defaultValues={{ tags: ['admin'] }}>
                <Checklist name="tags" label="Tags" options={OPTIONS} />
            </Form>
        );

        expect(screen.getByLabelText('Admin')).toBeChecked();
        expect(screen.getByLabelText('Editor')).not.toBeChecked();
    });

    it('scopes checkbox ids per component instance even when names match', () => {
        renderWithProviders(
            <div>
                <Form defaultValues={{ tags: ['admin'] }}>
                    <Checklist name="tags" label="First tags" options={OPTIONS} />
                </Form>
                <Form defaultValues={{ tags: ['editor'] }}>
                    <Checklist name="tags" label="Second tags" options={OPTIONS} />
                </Form>
            </div>
        );

        const adminCheckboxes = screen.getAllByRole('checkbox', { name: 'Admin' });
        expect(adminCheckboxes).toHaveLength(2);
        expect(adminCheckboxes[0]).toHaveAttribute('id');
        expect(adminCheckboxes[1]).toHaveAttribute('id');
        expect(adminCheckboxes[0].id).not.toBe(adminCheckboxes[1].id);
    });
});

