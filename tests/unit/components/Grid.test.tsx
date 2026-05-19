import { describe, it, expect, vi } from 'vitest';
import { act, screen, waitFor } from '@testing-library/react';
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
            i18n: { headerAdd: '', headerEdit: '', headerNewRecord: '', buttonSave: 'Save', buttonDelete: 'Delete', buttonBack: 'Back', noticeRequiredFields: '' },
        },
        Grid: {
            i18n: { buttonAdd: 'Add', headerAdd: '', headerEdit: '' },
            Table:   { wrapClass: '', className: '', headerClass: '', bodyClass: '', footerClass: '', scrollClass: '', selectedClass: '' },
            Gallery: { wrapClass: '', scrollClass: '', headerClass: '', bodyClass: '', footerClass: '', selectedClass: '', gutterSize: 0, rowCols: 3 },
            Card:    { className: '', headerClass: '', bodyClass: '', footerClass: '', showArrow: false },
            Modal:   { size: 'md', position: 'center', wrapClass: '', className: '', headerClass: '', titleClass: '', bodyClass: '', footerClass: '' },
        },
    })),
    ThemeProvider: ({ children }: any) => children,
}));

import Grid from '../../../src/components/widgets/Grid';
import { MockDataProvider } from '../../../src/providers/data/mock';
import { renderWithProviders } from '../../helpers/renderWithProviders';

const USERS = {
    u1: { name: 'Alice', role: 'admin', status: 'active' },
    u2: { name: 'Bob', role: 'editor', status: 'inactive' },
    u3: { name: 'Carol', role: 'viewer', status: 'active' },
};

const COLUMNS = [
    { key: 'name', label: 'Name' },
    { key: 'role', label: 'Role' },
    { key: 'status', label: 'Status' },
];

function LocationHash() {
    const location = useLocation();
    return <span data-testid="location-hash">{location.hash}</span>;
}

describe('Grid - rendering from provider', () => {
    it('renders column headers', async () => {
        const provider = new MockDataProvider({ '/users': USERS });
        renderWithProviders(<Grid providerPath="/users" columns={COLUMNS} view="table" />, { provider });

        await waitFor(() => {
            expect(screen.getByText('Name')).toBeInTheDocument();
            expect(screen.getByText('Role')).toBeInTheDocument();
            expect(screen.getByText('Status')).toBeInTheDocument();
        });
    });

    it('renders all provider rows', async () => {
        const provider = new MockDataProvider({ '/users': USERS });
        renderWithProviders(<Grid providerPath="/users" columns={COLUMNS} view="table" />, { provider });

        await waitFor(() => {
            expect(screen.getByText('Alice')).toBeInTheDocument();
            expect(screen.getByText('Bob')).toBeInTheDocument();
            expect(screen.getByText('Carol')).toBeInTheDocument();
        });
    });

    it('renders an empty state when the collection is empty', async () => {
        const provider = new MockDataProvider({ '/users': {} });
        renderWithProviders(<Grid providerPath="/users" columns={COLUMNS} view="table" />, { provider });

        await waitFor(() => {
            expect(screen.queryByText('Alice')).not.toBeInTheDocument();
        });
    });
});

describe('Grid - records prop', () => {
    it('renders rows from static records', () => {
        const data = [
            { _key: 'p1', name: 'Widget', price: 9.99 },
            { _key: 'p2', name: 'Gadget', price: 19.99 },
        ];

        renderWithProviders(
            <Grid
                records={data}
                columns={[
                    { key: 'name', label: 'Product' },
                    { key: 'price', label: 'Price' },
                ]}
                view="table"
            />
        );

        expect(screen.getByText('Widget')).toBeInTheDocument();
        expect(screen.getByText('Gadget')).toBeInTheDocument();
    });
});

describe('Grid - column transforms', () => {
    it('applies transform callbacks to cell values', async () => {
        const provider = new MockDataProvider({
            '/products': { p1: { name: 'Widget', price: 9.99 } },
        });

        renderWithProviders(
            <Grid
                providerPath="/products"
                columns={[
                    { key: 'name', label: 'Product' },
                    { key: 'price', label: 'Price', transform: ({ value }) => `€ ${Number(value).toFixed(2)}` },
                ]}
                view="table"
            />,
            { provider }
        );

        await waitFor(() => {
            expect(screen.getByText('€ 9.99')).toBeInTheDocument();
        });
    });
});

describe('Grid - real-time updates', () => {
    it('re-renders when a new record is added to the provider', async () => {
        const provider = new MockDataProvider({ '/users': USERS });
        renderWithProviders(<Grid providerPath="/users" columns={COLUMNS} view="table" />, { provider });

        await waitFor(() => expect(screen.getByText('Alice')).toBeInTheDocument());

        await act(async () => {
            await provider.set('/users/u4', { name: 'Dave', role: 'admin', status: 'active' });
        });

        await waitFor(() => {
            expect(screen.getByText('Dave')).toBeInTheDocument();
        });
    });

    it('removes a row when the provider record is deleted', async () => {
        const provider = new MockDataProvider({ '/users': USERS });
        renderWithProviders(<Grid providerPath="/users" columns={COLUMNS} view="table" />, { provider });

        await waitFor(() => expect(screen.getByText('Bob')).toBeInTheDocument());

        await act(async () => {
            await provider.remove('/users/u2');
        });

        await waitFor(() => {
            expect(screen.queryByText('Bob')).not.toBeInTheDocument();
        });
    });
});

describe('Grid - actions.default', () => {
    it('renders the add button when actions.default.add is enabled', async () => {
        const provider = new MockDataProvider({ '/users': USERS });

        renderWithProviders(
            <Grid
                providerPath="/users"
                columns={COLUMNS}
                view="table"
                editor={{ form: <div>Editor</div> }}
                actions={{ default: { add: true, edit: false, delete: false } }}
            />,
            { provider }
        );

        await waitFor(() => {
            expect(screen.getByRole('button', { name: /add/i })).toBeInTheDocument();
        });
    });

    it('opens the modal editor from a row click without entering a render loop', async () => {
        const provider = new MockDataProvider({ '/users': USERS });

        renderWithProviders(
            <Grid
                providerPath="/users"
                columns={COLUMNS}
                view="table"
                editor={{ form: <div>Editor</div> }}
                actions={{ default: { add: true, edit: true, delete: false } }}
            />,
            { provider }
        );

        await waitFor(() => expect(screen.getByText('Alice')).toBeInTheDocument());

        await act(async () => {
            screen.getByText('Alice').click();
        });

        expect(screen.getByText('Editor')).toBeInTheDocument();
    });

    it('opens only the clicked grid when multiple grids share record keys', async () => {
        const user = userEvent.setup();

        renderWithProviders(
            <>
                <LocationHash />
                <Grid
                    records={[{ _key: 'u1', name: 'Alice' }]}
                    columns={[{ key: 'name', label: 'Name' }]}
                    view="table"
                    editor={{ form: <div>Team editor</div> }}
                    actions={{ default: { edit: true, delete: false } }}
                />
                <Grid
                    records={[{ _key: 'u1', name: 'Alice' }]}
                    columns={[{ key: 'name', label: 'Name' }]}
                    view="table"
                    editor={{ form: <div>Audit editor</div> }}
                    actions={{ default: { edit: true, delete: false } }}
                />
            </>
        );

        await waitFor(() => expect(screen.getAllByText('Alice')).toHaveLength(2));

        await act(async () => {
            screen.getAllByText('Alice')[0].click();
        });

        await waitFor(() => expect(screen.getByText('Team editor')).toBeInTheDocument());
        expect(screen.queryByText('Audit editor')).not.toBeInTheDocument();
        expect(screen.getByTestId('location-hash').textContent).toMatch(/^#grid-records-.*:u1$/);

        await user.click(screen.getByRole('button', { name: /close/i }));

        await waitFor(() => {
            expect(screen.queryByText('Team editor')).not.toBeInTheDocument();
        });

        expect(screen.queryByText('Audit editor')).not.toBeInTheDocument();
    });
});

describe('Grid - selection after ordering', () => {
    it('returns the original record when the table view is ordered', async () => {
        const clicks: string[] = [];

        renderWithProviders(
            <Grid
                records={[
                    { _key: 'u2', name: 'Bob', role: 'editor', status: 'inactive' },
                    { _key: 'u1', name: 'Alice', role: 'admin', status: 'active' },
                ]}
                columns={[{ key: 'name', label: 'Name', sort: true }]}
                view="table"
                order={{ field: 'name', dir: 'asc' }}
                onClick={(record) => clicks.push(record._key || '')}
            />
        );

        await waitFor(() => expect(screen.getByText('Alice')).toBeInTheDocument());

        await act(async () => {
            screen.getByText('Alice').click();
        });

        expect(clicks).toEqual(['u1']);
    });
});

describe('Grid - shared selection semantics', () => {
    it('returns original records through onSelectionChange in table mode', async () => {
        const selections: string[][] = [];

        renderWithProviders(
            <Grid
                records={[
                    { _key: 'u2', name: 'Bob', role: 'editor', status: 'inactive' },
                    { _key: 'u1', name: 'Alice', role: 'admin', status: 'active' },
                ]}
                columns={[{ key: 'name', label: 'Name' }]}
                view="table"
                onSelectionChange={(selection) => selections.push(selection.records.map((record) => record._key || ''))}
            />
        );

        await waitFor(() => expect(screen.getByText('Alice')).toBeInTheDocument());

        await act(async () => {
            screen.getByLabelText('Select row u1').click();
        });

        expect(selections.at(-1)).toEqual(['u1']);
    });
});
