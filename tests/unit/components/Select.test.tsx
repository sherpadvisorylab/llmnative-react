import { describe, it, expect, vi } from 'vitest';
import { fireEvent, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
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
    const CITY_OPTIONS = [
        { label: 'Milano', value: 'milano' },
        { label: 'Città di Castello', value: 'citta-castello' },
        { label: 'Roma', value: 'roma' },
    ];

    it('renders a framework combobox and no native datalist', async () => {
        renderWithProviders(
            <Form defaultValues={{ assignees: [] }}>
                <Autocomplete name="assignees" label="Assignees" placeholder="Type a person..." options={OPTIONS} />
            </Form>
        );

        const input = screen.getByPlaceholderText('Type a person...');
        expect(input).toHaveAttribute('role', 'combobox');
        expect(input).toHaveAttribute('aria-expanded', 'false');
        expect(document.querySelector('datalist')).toBeNull();

        await userEvent.click(input);

        const listbox = screen.getByRole('listbox');
        expect(input).toHaveAttribute('aria-expanded', 'true');
        expect(input).toHaveAttribute('aria-controls', listbox.id);
        expect(screen.getAllByRole('option')).toHaveLength(OPTIONS.length);
    });

    it('filters by label and value ignoring case and accents', async () => {
        renderWithProviders(
            <Form defaultValues={{ cities: [] }}>
                <Autocomplete name="cities" label="Cities" options={CITY_OPTIONS} />
            </Form>
        );

        const input = screen.getByRole('combobox');
        await userEvent.click(input);
        await userEvent.type(input, 'citta');

        expect(screen.getByRole('option', { name: 'Città di Castello' })).toBeInTheDocument();
        expect(screen.queryByRole('option', { name: 'Milano' })).toBeNull();

        await userEvent.clear(input);
        await userEvent.type(input, 'ROMA');

        expect(screen.getByRole('option', { name: 'Roma' })).toBeInTheDocument();
        expect(screen.queryByRole('option', { name: 'Città di Castello' })).toBeNull();
    });

    it('shows no-results feedback when nothing matches', async () => {
        renderWithProviders(
            <Form defaultValues={{ assignees: [] }}>
                <Autocomplete name="assignees" label="Assignees" options={OPTIONS} />
            </Form>
        );

        const input = screen.getByRole('combobox');
        await userEvent.click(input);
        await userEvent.type(input, 'zzz');

        expect(screen.getByText('No results')).toBeInTheDocument();
        expect(screen.queryAllByRole('option')).toHaveLength(0);
    });

    it('selects an option with the mouse and stores its value, showing the label as a chip', async () => {
        const onChange = vi.fn();
        renderWithProviders(
            <Form defaultValues={{ assignees: [] }}>
                <Autocomplete name="assignees" label="Assignees" options={OPTIONS} onChange={onChange} />
            </Form>
        );

        const input = screen.getByRole('combobox');
        await userEvent.click(input);
        fireEvent.mouseDown(screen.getByRole('option', { name: 'Admin' }));

        await waitFor(() => expect(screen.queryByRole('listbox')).toBeNull());
        expect(screen.getByText('Admin')).toBeInTheDocument();
        expect(screen.queryByText('admin')).toBeNull();
        await waitFor(() => expect(onChange).toHaveBeenCalled());
        expect(onChange.mock.calls.at(-1)?.[0].value).toEqual(['admin']);
    });

    it('selects an option with the keyboard', async () => {
        const onChange = vi.fn();
        renderWithProviders(
            <Form defaultValues={{ assignees: [] }}>
                <Autocomplete name="assignees" label="Assignees" options={OPTIONS} onChange={onChange} />
            </Form>
        );

        const input = screen.getByRole('combobox');
        await userEvent.click(input);
        await userEvent.keyboard('{ArrowDown}{Enter}');

        await waitFor(() => expect(screen.queryByRole('listbox')).toBeNull());
        expect(screen.getByText('Admin')).toBeInTheDocument();
        await waitFor(() => expect(onChange.mock.calls.at(-1)?.[0].value).toEqual(['admin']));
    });

    it('removes the last chip with Backspace on an empty input', async () => {
        const onChange = vi.fn();
        renderWithProviders(
            <Form defaultValues={{ assignees: ['admin', 'editor'] }}>
                <Autocomplete name="assignees" label="Assignees" options={OPTIONS} onChange={onChange} />
            </Form>
        );

        expect(screen.getByText('Admin')).toBeInTheDocument();
        expect(screen.getByText('Editor')).toBeInTheDocument();

        const input = screen.getByRole('combobox');
        await userEvent.click(input);
        await userEvent.keyboard('{Backspace}');

        await waitFor(() => expect(onChange.mock.calls.at(-1)?.[0].value).toEqual(['admin']));
        await userEvent.keyboard('{Escape}');
        expect(screen.queryByText('Editor')).toBeNull();
    });

    it('removes a chip with its remove button', async () => {
        const onChange = vi.fn();
        renderWithProviders(
            <Form defaultValues={{ assignees: ['admin', 'editor'] }}>
                <Autocomplete name="assignees" label="Assignees" options={OPTIONS} onChange={onChange} />
            </Form>
        );

        fireEvent.click(screen.getAllByRole('button', { name: '×' })[0]);

        await waitFor(() => expect(onChange.mock.calls.at(-1)?.[0].value).toEqual(['editor']));
        expect(screen.queryByText('Admin')).toBeNull();
    });

    it('respects maxItems by hiding the input once the limit is reached', async () => {
        const onChange = vi.fn();
        renderWithProviders(
            <Form defaultValues={{ assignees: [] }}>
                <Autocomplete name="assignees" label="Assignees" options={OPTIONS} maxItems={2} onChange={onChange} />
            </Form>
        );

        let input = screen.getByRole('combobox');
        await userEvent.click(input);
        fireEvent.mouseDown(screen.getByRole('option', { name: 'Admin' }));
        await waitFor(() => expect(screen.getByText('Admin')).toBeInTheDocument());

        input = screen.getByRole('combobox');
        await userEvent.click(input);
        fireEvent.mouseDown(screen.getByRole('option', { name: 'Editor' }));
        await waitFor(() => expect(screen.getByText('Editor')).toBeInTheDocument());

        await waitFor(() => expect(onChange.mock.calls.at(-1)?.[0].value).toEqual(['admin', 'editor']));
        expect(screen.queryByRole('combobox')).toBeNull();
    });

    it('offers a creatable entry and cancels selection when onCreate resolves to false', async () => {
        const onCreate = vi.fn().mockResolvedValue(false);
        const onChange = vi.fn();
        renderWithProviders(
            <Form defaultValues={{ tags: [] }}>
                <Autocomplete name="tags" label="Tags" options={OPTIONS} creatable onCreate={onCreate} onChange={onChange} />
            </Form>
        );

        const input = screen.getByRole('combobox');
        await userEvent.click(input);
        await userEvent.type(input, 'NewTag');

        const createOption = screen.getByRole('option', { name: 'Create «NewTag»' });
        expect(createOption).toBeInTheDocument();

        await userEvent.keyboard('{Enter}');

        await waitFor(() => expect(onCreate).toHaveBeenCalledWith('NewTag'));
        expect(screen.queryByText('NewTag')).toBeNull();
        expect(onChange).not.toHaveBeenCalled();
    });

    it('selects a created value when onCreate does not cancel it', async () => {
        const onCreate = vi.fn();
        const onChange = vi.fn();
        renderWithProviders(
            <Form defaultValues={{ tags: [] }}>
                <Autocomplete name="tags" label="Tags" options={OPTIONS} creatable onCreate={onCreate} onChange={onChange} />
            </Form>
        );

        const input = screen.getByRole('combobox');
        await userEvent.click(input);
        await userEvent.type(input, 'NewTag');
        await userEvent.keyboard('{Enter}');

        await waitFor(() => expect(onCreate).toHaveBeenCalledWith('NewTag'));
        await waitFor(() => expect(onChange.mock.calls.at(-1)?.[0].value).toEqual(['NewTag']));
        expect(screen.getByText('NewTag')).toBeInTheDocument();
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

