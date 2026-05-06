import { describe, it, expect, vi } from 'vitest';
import { act, screen, waitFor } from '@testing-library/react';
import React from 'react';

vi.mock('../../../src/Config', () => ({
    getConfig: vi.fn(() => ({})),
    onConfigChange: vi.fn(),
    default: {},
}));
vi.mock('../../../src/providers/firebase-init', () => ({ default: vi.fn(), getSafeAuth: vi.fn() }));
vi.mock('../../../src/Theme', () => ({
    useTheme: vi.fn(() => ({
        getIcon: () => '',
        Icons: {},
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
            Table:   { wrapperClass: '', className: '', headerClass: '', bodyClass: '', footerClass: '', scrollClass: '', selectedClass: '' },
            Gallery: { wrapperClass: '', scrollClass: '', headerClass: '', bodyClass: '', footerClass: '', selectedClass: '', gutterSize: 0, rowCols: 3 },
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
    u1: { name: 'Alice', role: 'admin',  status: 'active'   },
    u2: { name: 'Bob',   role: 'editor', status: 'inactive' },
    u3: { name: 'Carol', role: 'viewer', status: 'active'   },
};

const COLUMNS = [
    { key: 'name',   label: 'Name'   },
    { key: 'role',   label: 'Role'   },
    { key: 'status', label: 'Status' },
];

// ── rendering ─────────────────────────────────────────────────────────────────

describe('Grid — rendering from DataProvider', () => {
    it('renders column headers', async () => {
        const provider = new MockDataProvider({ '/users': USERS });
        renderWithProviders(
            <Grid dataStoragePath="/users" columns={COLUMNS} type="table" />,
            { provider }
        );
        await waitFor(() => {
            expect(screen.getByText('Name')).toBeInTheDocument();
            expect(screen.getByText('Role')).toBeInTheDocument();
            expect(screen.getByText('Status')).toBeInTheDocument();
        });
    });

    it('renders all record rows', async () => {
        const provider = new MockDataProvider({ '/users': USERS });
        renderWithProviders(
            <Grid dataStoragePath="/users" columns={COLUMNS} type="table" />,
            { provider }
        );
        await waitFor(() => {
            expect(screen.getByText('Alice')).toBeInTheDocument();
            expect(screen.getByText('Bob')).toBeInTheDocument();
            expect(screen.getByText('Carol')).toBeInTheDocument();
        });
    });

    it('renders empty table when collection is empty', async () => {
        const provider = new MockDataProvider({ '/users': {} });
        renderWithProviders(
            <Grid dataStoragePath="/users" columns={COLUMNS} type="table" />,
            { provider }
        );
        // No user names should appear
        await waitFor(() => {
            expect(screen.queryByText('Alice')).not.toBeInTheDocument();
        });
    });
});

// ── dataArray ─────────────────────────────────────────────────────────────────

describe('Grid — dataArray (no provider needed)', () => {
    it('renders rows from static dataArray', () => {
        const data = [
            { _key: 'p1', name: 'Widget', price: 9.99  },
            { _key: 'p2', name: 'Gadget', price: 19.99 },
        ];
        renderWithProviders(
            <Grid
                dataArray={data}
                columns={[
                    { key: 'name',  label: 'Product' },
                    { key: 'price', label: 'Price'   },
                ]}
                type="table"
            />
        );
        expect(screen.getByText('Widget')).toBeInTheDocument();
        expect(screen.getByText('Gadget')).toBeInTheDocument();
    });
});

// ── column formatters ─────────────────────────────────────────────────────────

describe('Grid — column formatters', () => {
    it('applies onDisplay formatter to cell values', async () => {
        const provider = new MockDataProvider({
            '/products': { p1: { name: 'Widget', price: 9.99 } },
        });
        renderWithProviders(
            <Grid
                dataStoragePath="/products"
                columns={[
                    { key: 'name',  label: 'Product' },
                    { key: 'price', label: 'Price',
                      onDisplay: ({ value }) => `€ ${Number(value).toFixed(2)}` },
                ]}
                type="table"
            />,
            { provider }
        );
        await waitFor(() => {
            expect(screen.getByText('€ 9.99')).toBeInTheDocument();
        });
    });
});

// ── real-time reactivity ──────────────────────────────────────────────────────

describe('Grid — real-time updates', () => {
    it('re-renders when a new record is added to the provider', async () => {
        const provider = new MockDataProvider({ '/users': USERS });
        renderWithProviders(
            <Grid dataStoragePath="/users" columns={COLUMNS} type="table" />,
            { provider }
        );

        await waitFor(() => expect(screen.getByText('Alice')).toBeInTheDocument());

        await act(async () => {
            await provider.set('/users/u4', { name: 'Dave', role: 'admin', status: 'active' });
        });

        await waitFor(() => {
            expect(screen.getByText('Dave')).toBeInTheDocument();
        });
    });

    it('removes row when record is deleted from provider', async () => {
        const provider = new MockDataProvider({ '/users': USERS });
        renderWithProviders(
            <Grid dataStoragePath="/users" columns={COLUMNS} type="table" />,
            { provider }
        );

        await waitFor(() => expect(screen.getByText('Bob')).toBeInTheDocument());

        await act(async () => {
            await provider.remove('/users/u2');
        });

        await waitFor(() => {
            expect(screen.queryByText('Bob')).not.toBeInTheDocument();
        });
    });
});

// ── add action ────────────────────────────────────────────────────────────────

describe('Grid — allowedActions', () => {
    it('renders Add button when "add" is in allowedActions', async () => {
        const provider = new MockDataProvider({ '/users': USERS });
        renderWithProviders(
            <Grid
                dataStoragePath="/users"
                columns={COLUMNS}
                allowedActions={['add']}
                type="table"
            />,
            { provider }
        );
        await waitFor(() => {
            const addBtn = screen.getByRole('button', { name: /add|aggiungi|\+/i });
            expect(addBtn).toBeInTheDocument();
        });
    });
});
