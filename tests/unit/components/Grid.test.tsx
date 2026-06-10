import { describe, it, expect, vi } from 'vitest';
import { act, fireEvent, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { useLocation } from 'react-router-dom';

vi.mock('../../../src/Config', () => ({
    getConfig: vi.fn(() => ({})),
    onConfigChange: vi.fn(),
    default: {},
}));
vi.mock('../../../src/providers/firebase-init', () => ({ default: vi.fn(), getSafeAuth: vi.fn() }));
vi.mock('../../../src/Theme', () => ({
    useMotionRegistry: vi.fn(() => ({})),
    useTheme: vi.fn(() => ({
        Card:          { wrapClass: '', className: '', headerClass: '', bodyClass: '', footerClass: '', showLoader: false, showArrow: false },
        Loader:        { wrapClass: '', className: '', icon: '', title: '', description: '' },
        Modal:         { size: 'md', position: 'center', wrapClass: '', className: '', headerClass: '', titleClass: '', bodyClass: '', footerClass: '', iconExpand: '', iconCollapse: '' },
        ActionButton:  { className: '', badgeClass: '' },
        LoadingButton: { className: '', badgeClass: '', spinnerClass: '' },
        Badge:         { className: '' },
        Alert:         { className: '' },
        Table:         { wrapClass: '', scrollClass: '', className: '', headerClass: '', bodyClass: '', footerClass: '', selectedClass: '' },
        Pagination:    { wrapClass: '', className: '', stickyClass: '', scrollToTop: false, scrollBehavior: 'auto', maxItems: 5, sticky: false, align: 'end' },
        Select:        { wrapClass: '', className: '' },
        Autocomplete:  { wrapClass: '', className: '' },
        Form: {
            wrapClass: '',
            buttonSaveClass: '', buttonDeleteClass: '', buttonBackClass: '',
            Card: { headerClass: '', bodyClass: '', footerClass: '' },
            i18n: { headerAdd: 'Add record', headerEdit: 'Edit record', headerNewRecord: '', buttonSave: 'Save', buttonDelete: 'Delete', buttonBack: 'Back', noticeRequiredFields: '' },
        },
        Grid: {
            i18n: { buttonAdd: 'Add', headerAdd: 'Add record', headerEdit: 'Edit record' },
            Table:   { wrapClass: '', className: '', headerClass: '', bodyClass: '', footerClass: '', scrollClass: '', selectedClass: '' },
            Gallery: { wrapClass: '', scrollClass: '', headerClass: '', bodyClass: '', footerClass: '', selectedClass: '', gutterSize: 0, rowCols: 3 },
            Card:    { className: '', headerClass: '', bodyClass: '', footerClass: '', showArrow: false },
            Modal:   { size: 'md', position: 'center', wrapClass: '', className: '', headerClass: '', titleClass: '', bodyClass: '', footerClass: '' },
        },
    })),
    ThemeProvider: ({ children }: any) => children,
}));

import Grid from '../../../src/components/widgets/Grid';
import GridDB from '../../../src/components/widgets/grid-core/GridDB';
import { resolveGridPathFromUrl } from '../../../src/components/widgets/grid-core/resolveGridPathFromUrl';
import { MockDataProvider } from '../../../src/providers/data/mock';
import { renderWithProviders } from '../../helpers/renderWithProviders';

const USERS = {
    u1: { name: 'Alice', role: 'admin', status: 'active', email: 'alice@example.com' },
    u2: { name: 'Bob', role: 'editor', status: 'inactive', email: 'bob@example.com' },
    u3: { name: 'Carol', role: 'viewer', status: 'active', email: 'carol@example.com' },
};

const COLUMNS = [
    { key: 'name', label: 'Name', sortable: true },
    { key: 'role', label: 'Role', sortable: true },
    { key: 'status', label: 'Status', sortable: true },
];

function LocationHash() {
    const location = useLocation();
    return <span data-testid="location-hash">{location.hash}</span>;
}

function UserFormFields() {
    return <div>Editor</div>;
}

describe('Grid - provider source', () => {
    it('renders column headers and rows from a provider source', async () => {
        const provider = new MockDataProvider({ '/users': USERS });
        renderWithProviders(
            <Grid
                path="/users"
                columns={COLUMNS}
            />,
            { provider }
        );

        await waitFor(() => {
            expect(screen.getByText('Name')).toBeInTheDocument();
            expect(screen.getByText('Alice')).toBeInTheDocument();
            expect(screen.getByText('Bob')).toBeInTheDocument();
            expect(screen.getByText('Carol')).toBeInTheDocument();
        });
    });

    it('re-renders when the provider changes in real time', async () => {
        const provider = new MockDataProvider({ '/users': USERS });
        renderWithProviders(<Grid path="/users" columns={COLUMNS} />, { provider });

        await waitFor(() => expect(screen.getByText('Alice')).toBeInTheDocument());

        await act(async () => {
            await provider.set('/users/u4', { name: 'Dave', role: 'admin', status: 'active', email: 'dave@example.com' });
        });

        await waitFor(() => expect(screen.getByText('Dave')).toBeInTheDocument());

        await act(async () => {
            await provider.remove('/users/u2');
        });

        await waitFor(() => expect(screen.queryByText('Bob')).not.toBeInTheDocument());
    });

    it('resolves path="fromUrl" from the current route in Grid', async () => {
        const provider = new MockDataProvider({ '/members': USERS });
        renderWithProviders(
            <Grid
                fromUrl
                columns={COLUMNS}
            />,
            { provider, route: '/members' }
        );

        await waitFor(() => {
            expect(screen.getByText('Alice')).toBeInTheDocument();
            expect(screen.getByText('Bob')).toBeInTheDocument();
        });
    });

    it('resolves path="fromUrl" from the current route in GridDB', async () => {
        const provider = new MockDataProvider({ '/members/u1': USERS });
        renderWithProviders(
            <GridDB
                fromUrl
                columns={COLUMNS}
            />,
            { provider, route: '/members/u1' }
        );

        await waitFor(() => {
            expect(screen.getByText('Alice')).toBeInTheDocument();
            expect(screen.getByText('Bob')).toBeInTheDocument();
        });
    });
});

describe('resolveGridPathFromUrl', () => {
    it('returns the pathname as-is', () => {
        expect(resolveGridPathFromUrl('/users')).toBe('/users');
        expect(resolveGridPathFromUrl('/users/123')).toBe('/users/123');
        expect(resolveGridPathFromUrl('/companies/acme/orders')).toBe('/companies/acme/orders');
    });
});

describe('Grid - array source', () => {
    it('renders static records when records and recordId are provided', async () => {
        renderWithProviders(
            <Grid
                records={[
                    { id: 'p1', name: 'Widget', price: 9.99 },
                    { id: 'p2', name: 'Gadget', price: 19.99 },
                ]}
                recordId="id"
                columns={[
                    { key: 'name', label: 'Product', sortable: true },
                    { key: 'price', label: 'Price', sortable: true },
                ]}
            />
        );

        await waitFor(() => {
            expect(screen.getByText('Widget')).toBeInTheDocument();
            expect(screen.getByText('Gadget')).toBeInTheDocument();
        });
    });

    it('uses render to format cells', async () => {
        renderWithProviders(
            <Grid
                records={[
                    { id: 'p1', name: 'Widget', price: 9.99 },
                ]}
                recordId="id"
                columns={[
                    { key: 'name', label: 'Product', sortable: true },
                    { key: 'price', label: 'Price', sortable: true, render: ({ value }) => `EUR ${Number(value).toFixed(2)}` },
                ]}
            />
        );

        await waitFor(() => {
            expect(screen.getByText('EUR 9.99')).toBeInTheDocument();
        });
    });

    it('does not mark rows as clickable when no row interaction is configured', async () => {
        renderWithProviders(
            <Grid
                records={[
                    { id: 'p1', name: 'Widget', price: 9.99 },
                ]}
                recordId="id"
                columns={[
                    { key: 'name', label: 'Product', sortable: true },
                    { key: 'price', label: 'Price', sortable: true },
                ]}
            />
        );

        const cell = await screen.findByText('Widget');
        const row = cell.closest('tr');
        expect(row).not.toBeNull();
        expect(row).toHaveStyle({ cursor: 'default' });
    });

    it('transforms only the records visible on the current page in table mode', async () => {
        const renderSpy = vi.fn(({ value }) => `View ${String(value)}`);

        renderWithProviders(
            <Grid
                records={[
                    { id: 'u1', name: 'Alpha' },
                    { id: 'u2', name: 'Bravo' },
                    { id: 'u3', name: 'Charlie' },
                    { id: 'u4', name: 'Delta' },
                    { id: 'u5', name: 'Echo' },
                ]}
                recordId="id"
                sortable={false}
                pagination={{ limit: 2, align: 'end' }}
                columns={[
                    { key: 'name', label: 'Name', sortable: false, render: renderSpy },
                ]}
            />
        );

        await waitFor(() => {
            expect(screen.getByText('View Alpha')).toBeInTheDocument();
            expect(screen.getByText('View Bravo')).toBeInTheDocument();
        });

        expect(screen.queryByText('View Charlie')).not.toBeInTheDocument();
        expect(renderSpy).toHaveBeenCalledTimes(2);

        await act(async () => {
            screen.getByRole('button', { name: '2' }).click();
        });

        await waitFor(() => {
            expect(screen.getByText('View Charlie')).toBeInTheDocument();
            expect(screen.getByText('View Delta')).toBeInTheDocument();
        });

        expect(renderSpy).toHaveBeenCalledTimes(4);
    });

    it('reuses cached transformed cells when previously visible records become visible again', async () => {
        const renderSpy = vi.fn(({ value }) => `View ${String(value)}`);

        renderWithProviders(
            <Grid
                records={[
                    { id: 'u1', name: 'Alpha' },
                    { id: 'u2', name: 'Bravo' },
                    { id: 'u3', name: 'Charlie' },
                    { id: 'u4', name: 'Delta' },
                ]}
                recordId="id"
                sortable
                pagination={{ limit: 2, align: 'end' }}
                columns={[
                    { key: 'name', label: 'Name', sortable: true, render: renderSpy },
                ]}
            />
        );

        await waitFor(() => {
            expect(screen.getByText('View Alpha')).toBeInTheDocument();
            expect(screen.getByText('View Bravo')).toBeInTheDocument();
        });

        expect(renderSpy).toHaveBeenCalledTimes(2);

        await act(async () => {
            screen.getByRole('button', { name: '2' }).click();
        });

        await waitFor(() => {
            expect(screen.getByText('View Charlie')).toBeInTheDocument();
            expect(screen.getByText('View Delta')).toBeInTheDocument();
        });

        expect(renderSpy).toHaveBeenCalledTimes(4);

        await act(async () => {
            screen.getByRole('button', { name: /sort by name, currently ascending/i }).click();
        });

        await waitFor(() => {
            expect(screen.getByText('View Bravo')).toBeInTheDocument();
            expect(screen.getByText('View Alpha')).toBeInTheDocument();
        });

        expect(renderSpy).toHaveBeenCalledTimes(6);

        await act(async () => {
            screen.getByRole('button', { name: /sort by name, currently descending/i }).click();
        });

        await waitFor(() => {
            expect(screen.getByText('View Charlie')).toBeInTheDocument();
            expect(screen.getByText('View Delta')).toBeInTheDocument();
        });

        expect(renderSpy).toHaveBeenCalledTimes(6);
    });
});

describe('Grid - form and modal workflows', () => {
    it('shows the add button when add is declared as a modal action', async () => {
        const provider = new MockDataProvider({ '/users': USERS });
        renderWithProviders(
            <Grid
                path="/users"
                columns={COLUMNS}
                form={<UserFormFields />}
                actions={['add', 'edit', 'delete']}
            />,
            { provider }
        );

        await waitFor(() => {
            expect(screen.getByRole('button', { name: /add/i })).toBeInTheDocument();
        });
    });

    it('shows custom global actions in the default header', async () => {
        const provider = new MockDataProvider({ '/users': USERS });
        const exportSpy = vi.fn();

        renderWithProviders(
            <Grid
                path="/users"
                columns={COLUMNS}
                title="Bulk selection"
                actions={{
                    exportSelected: {
                        kind: 'inline',
                        label: 'Export selected',
                        run: exportSpy,
                    },
                }}
            />,
            { provider }
        );

        await waitFor(() => {
            expect(screen.getByRole('button', { name: /export selected/i })).toBeInTheDocument();
        });
    });

    it('opens and closes the default edit modal from row click with route sync enabled', async () => {
        const provider = new MockDataProvider({ '/users': USERS });

        renderWithProviders(
            <>
                <LocationHash />
                <Grid
                    path="/users"
                    columns={COLUMNS}
                    form={<UserFormFields />}
                    actions={['add', 'edit', 'delete']}
                    editDeepLink
                />
            </>,
            { provider, route: '/members' }
        );

        await waitFor(() => expect(screen.getByText('Alice')).toBeInTheDocument());

        await act(async () => {
            screen.getByText('Alice').click();
        });

        await waitFor(() => expect(screen.getByText('Editor')).toBeInTheDocument());
        expect(screen.getByTestId('location-hash').textContent).toMatch(/^#users-.*:u1$/);

        await act(async () => {
            screen.getByText('Alice').click();
        });

        await waitFor(() => expect(screen.queryByText('Editor')).not.toBeInTheDocument());
        expect(screen.getByTestId('location-hash').textContent).toBe('');
    });

    it('shows save, delete and cancel in the default edit modal footer', async () => {
        const provider = new MockDataProvider({ '/users': USERS });

        renderWithProviders(
            <Grid
                path="/users"
                columns={COLUMNS}
                form={<UserFormFields />}
                actions={['add', 'edit', 'delete']}
            />,
            { provider }
        );

        await waitFor(() => expect(screen.getByText('Alice')).toBeInTheDocument());

        await act(async () => {
            screen.getByText('Alice').click();
        });

        await waitFor(() => expect(screen.getByText('Editor')).toBeInTheDocument());
        const saveButton = screen.getByRole('button', { name: 'Save' });
        const deleteButton = screen.getByRole('button', { name: 'Delete' });
        const cancelButton = screen.getByRole('button', { name: 'Cancel' });

        expect(saveButton).toBeInTheDocument();
        expect(deleteButton).toBeInTheDocument();
        expect(cancelButton).toBeInTheDocument();

        const footer = saveButton.parentElement;
        expect(footer).not.toBeNull();
        expect(footer?.children[0]).toBe(saveButton);
        expect(footer?.children[1]).toBe(deleteButton);
        expect(footer?.textContent).toContain('SaveDeleteCancel');
    });

    it('supports custom action kinds for modal and record-bound remove flows', async () => {
        const user = userEvent.setup();
        const provider = new MockDataProvider({ '/users': USERS });

        renderWithProviders(
            <Grid
                path="/users"
                columns={COLUMNS}
                form={<UserFormFields />}
                actions={{
                    add: { kind: 'modal' },
                    edit: {
                        kind: 'modal',
                        body: ({ record }) => (
                            <div>
                                <div>Edit {record?.name}</div>
                            </div>
                        ),
                        footer: ({ runAction }) => (
                            <>
                                <button type="button" onClick={() => runAction('save')}>Save now</button>
                                <button type="button" onClick={() => runAction('remove')}>Delete now</button>
                            </>
                        ),
                    },
                    delete: {
                        kind: 'delete',
                        body: ({ record }) => <div>Delete {record?.name}?</div>,
                    },
                }}
            />,
            { provider }
        );

        await waitFor(() => expect(screen.getByText('Alice')).toBeInTheDocument());
        await user.click(screen.getByText('Alice'));
        await waitFor(() => expect(screen.getByText('Edit Alice')).toBeInTheDocument());
        expect(screen.queryByRole('button', { name: 'Cancel' })).not.toBeInTheDocument();
        const saveNowButton = screen.getByRole('button', { name: 'Save now' });
        const deleteNowButton = screen.getByRole('button', { name: 'Delete now' });
        const footer = saveNowButton.parentElement;
        expect(footer).not.toBeNull();
        expect(footer?.children[0]).toBe(saveNowButton);
        expect(footer?.children[1]).toBe(deleteNowButton);
        expect(footer?.textContent).toContain('Save nowDelete now');
        await user.click(screen.getByRole('button', { name: 'Delete now' }));
        await waitFor(() => expect(screen.queryByText('Alice')).not.toBeInTheDocument());
    });

    it('supports array-backed delete workflows through onDelete without a provider path', async () => {
        const user = userEvent.setup();

        function ArrayCrudHarness() {
            const [records, setRecords] = React.useState([
                { _key: 'u1', name: 'Alice', role: 'admin', status: 'active', email: 'alice@example.com' },
                { _key: 'u2', name: 'Bob', role: 'editor', status: 'inactive', email: 'bob@example.com' },
            ]);

            return (
                <Grid
                    records={records}
                    recordId="_key"
                    columns={COLUMNS}
                    form={<UserFormFields />}
                    actions={['add', 'edit', 'delete']}
                    onDelete={async ({ record }) => {
                        if (!record?._key) return '';
                        setRecords((prev) => prev.filter((entry) => entry._key !== record._key));
                        return '';
                    }}
                />
            );
        }

        renderWithProviders(<ArrayCrudHarness />);

        await waitFor(() => expect(screen.getByText('Alice')).toBeInTheDocument());
        await user.click(screen.getByText('Alice'));
        await waitFor(() => expect(screen.getByText('Editor')).toBeInTheDocument());
        await user.click(screen.getByRole('button', { name: 'Delete' }));
        await waitFor(() => expect(screen.queryByText('Alice')).not.toBeInTheDocument());
    });
});

describe('Grid - event payloads', () => {
    it('returns the original source record on row click after provider ordering', async () => {
        const clicks: string[] = [];
        const provider = new MockDataProvider({
            '/users': {
                u2: { name: 'Bob', role: 'editor', status: 'inactive', email: 'bob@example.com' },
                u1: { name: 'Alice', role: 'admin', status: 'active', email: 'alice@example.com' },
            },
        });

        renderWithProviders(
            <Grid
                path="/users"
                order={{ name: 'asc' }}
                columns={[{ key: 'name', label: 'Name', sortable: true }]}
                onRowClick={(record) => clicks.push(record._key || '')}
            />,
            { provider }
        );

        await waitFor(() => expect(screen.getByText('Alice')).toBeInTheDocument());

        await act(async () => {
            screen.getByText('Alice').click();
        });

        expect(clicks).toEqual(['u1']);
    });

    it('reflects provider-side order as the initial visible grid sort when sortable is implicit', async () => {
        const provider = new MockDataProvider({
            '/users': {
                u1: { name: 'Zed', role: 'admin', status: 'active', email: 'alice@example.com' },
                u2: { name: 'Amy', role: 'editor', status: 'active', email: 'zoe@example.com' },
            },
        });

        renderWithProviders(
            <Grid
                path="/users"
                order={{ email: 'asc' }}
                columns={[
                    { key: 'name', label: 'Name', sortable: true },
                    { key: 'email', label: 'Email', sortable: true },
                ]}
            />,
            { provider }
        );

        await waitFor(() => expect(screen.getByText('Zed')).toBeInTheDocument());

        const emailHeader = screen.getByRole('button', { name: /sort by email, currently ascending/i });
        expect(emailHeader.closest('th')).toHaveAttribute('aria-sort', 'ascending');

        const rows = screen.getAllByRole('row');
        expect(rows[1]).toHaveTextContent('Zed');
        expect(rows[2]).toHaveTextContent('Amy');
    });

    it('returns original records through onSelectionChange in table mode', async () => {
        const selections: string[][] = [];

        renderWithProviders(
            <Grid
                records={[
                    { _key: 'u2', name: 'Bob', role: 'editor', status: 'inactive' },
                    { _key: 'u1', name: 'Alice', role: 'admin', status: 'active' },
                ]}
                recordId="_key"
                columns={[{ key: 'name', label: 'Name', sortable: true }]}
                selection={{
                    mode: 'multiple',
                    onChange: (selection) => selections.push(selection.records.map((record) => record._key || '')),
                }}
            />
        );

        await waitFor(() => expect(screen.getByText('Alice')).toBeInTheDocument());
        await act(async () => {
            screen.getByLabelText('Select row u1').click();
        });

        expect(selections.at(-1)).toEqual(['u1']);
    });

    it('shows row radio controls in single selection mode and toggles through the control', async () => {
        const selections: string[][] = [];

        renderWithProviders(
            <Grid
                records={[
                    { _key: 'u2', name: 'Bob', role: 'editor', status: 'inactive' },
                    { _key: 'u1', name: 'Alice', role: 'admin', status: 'active' },
                ]}
                recordId="_key"
                columns={[{ key: 'name', label: 'Name', sortable: true }]}
                selection={{
                    mode: 'single',
                    onChange: (selection) => selections.push(selection.keys),
                }}
            />
        );

        await waitFor(() => expect(screen.getByText('Alice')).toBeInTheDocument());
        expect(screen.queryByLabelText('Select all rows')).not.toBeInTheDocument();
        const radio = screen.getByLabelText('Select row u1');
        expect(radio).toBeInTheDocument();

        await act(async () => {
            radio.click();
        });
        expect(selections.at(-1)).toEqual(['u1']);

        await act(async () => {
            radio.click();
        });
        expect(selections.at(-1)).toEqual([]);
    });

    it('forwards table drag reorder with source records', () => {
        const payloads: string[][] = [];

        renderWithProviders(
            <Grid
                records={[
                    { _key: 'u2', name: 'Bob', role: 'Editor' },
                    { _key: 'u1', name: 'Alice', role: 'Admin' },
                ]}
                recordId="_key"
                columns={[
                    { key: 'name', label: 'Name', sortable: false },
                    { key: 'role', label: 'Role', sortable: false },
                ]}
                sortable={false}
                reorderable
                onReorder={(records) => payloads.push(records.map((record) => record._key || ''))}
            />
        );

        const handle = screen.getByLabelText('Reorder row u2');
        const aliceRow = screen.getAllByRole('row').find((row) => row.textContent?.includes('Alice'));

        expect(aliceRow).toBeTruthy();

        fireEvent.dragStart(handle);
        fireEvent.dragOver(aliceRow!);
        fireEvent.drop(aliceRow!);

        expect(payloads).toEqual([['u1', 'u2']]);
    });
});

