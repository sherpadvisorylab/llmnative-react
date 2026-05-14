import { describe, it, expect, vi } from 'vitest';
import { screen, fireEvent, waitFor } from '@testing-library/react';
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
        Card:          { wrapClass: '', className: '', headerClass: '', bodyClass: '', footerClass: '', showLoader: false, showArrow: false },
        Loader:        { wrapClass: '', className: '', icon: '', title: '', description: '' },
        Modal:         { size: 'md', position: 'center', wrapClass: '', className: '', headerClass: '', titleClass: '', bodyClass: '', footerClass: '', iconExpand: '', iconCollapse: '' },
        ActionButton:  { className: '', badgeClass: '' },
        LoadingButton: { className: '', badgeClass: '', spinnerClass: '' },
        Badge:         { className: '' },
        Alert:         { className: '' },
        Table:         { wrapClass: '', scrollClass: '', className: '', headerClass: '', bodyClass: '', footerClass: '', selectedClass: '' },
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

import Form from '../../../src/components/widgets/Form';
import { Input } from '../../../src/components/ui/fields/Input';
import { MockDataProvider } from '../../../src/providers/data/mock';
import { renderWithProviders } from '../../helpers/renderWithProviders';

// ── defaultValues (FormData path — no DB read) ────────────────────────────────

describe('Form — defaultValues', () => {
    it('renders children inside a form element', () => {
        renderWithProviders(
            <Form defaultValues={{}}>
                <Input name="name" label="Name" />
            </Form>
        );
        expect(screen.getByRole('textbox')).toBeInTheDocument();
    });

    it('pre-fills fields from defaultValues', () => {
        renderWithProviders(
            <Form defaultValues={{ email: 'test@example.com' }}>
                <Input name="email" label="Email" />
            </Form>
        );
        expect(screen.getByDisplayValue('test@example.com')).toBeInTheDocument();
    });

    it('reflects user edits in the field', () => {
        renderWithProviders(
            <Form defaultValues={{ title: '' }}>
                <Input name="title" label="Title" />
            </Form>
        );
        const input = screen.getByRole('textbox') as HTMLInputElement;
        fireEvent.change(input, { target: { name: 'title', value: 'Hello' } });
        expect(input.value).toBe('Hello');
    });

    it('renders Save button', () => {
        renderWithProviders(
            <Form defaultValues={{}} dataStoragePath="/items" setPrimaryKey={() => 'new'}>
                <Input name="x" />
            </Form>
        );
        expect(screen.getByRole('button', { name: /save|salva/i })).toBeInTheDocument();
    });
});

// ── dataStoragePath — existing record (FormDatabase path) ─────────────────────

describe('Form — loading from DataProvider', () => {
    it('shows loading state then renders record fields', async () => {
        const provider = new MockDataProvider({
            '/users': { u1: { name: 'Alice', role: 'admin' } },
        });
        renderWithProviders(
            <Form dataStoragePath="/users/u1">
                <Input name="name" label="Name" />
                <Input name="role" label="Role" />
            </Form>,
            { provider }
        );

        // Loading spinner shown initially
        expect(screen.getByText(/caricamento/i)).toBeInTheDocument();

        // After read resolves, fields are pre-filled
        await waitFor(() => {
            expect(screen.getByDisplayValue('Alice')).toBeInTheDocument();
        });
        expect(screen.getByDisplayValue('admin')).toBeInTheDocument();
    });
});

// ── save — writes to DataProvider ─────────────────────────────────────────────

describe('Form — save', () => {
    it('calls provider.set() with form data on save', async () => {
        const provider = new MockDataProvider();

        renderWithProviders(
            <Form
                dataStoragePath="/products/new_id"
                defaultValues={{ title: 'Widget' }}
            >
                <Input name="title" label="Title" />
            </Form>,
            { provider }
        );

        const saveBtn = screen.getByRole('button', { name: /save|salva/i });
        fireEvent.click(saveBtn);

        await waitFor(async () => {
            const saved = await provider.read('/products/new_id');
            expect(saved).toMatchObject({ title: 'Widget' });
        });
    });

    it('calls onFinally after save', async () => {
        const onFinally = vi.fn(async () => false);
        const provider = new MockDataProvider();

        renderWithProviders(
            <Form
                dataStoragePath="/items/item_1"
                defaultValues={{ name: 'Test' }}
                onFinally={onFinally}
            >
                <Input name="name" />
            </Form>,
            { provider }
        );

        fireEvent.click(screen.getByRole('button', { name: /save|salva/i }));

        await waitFor(() => {
            expect(onFinally).toHaveBeenCalledWith(
                expect.objectContaining({ action: 'update' })
            );
        });
    });
});

// ── nested dot notation ───────────────────────────────────────────────────────

describe('Form — nested dot notation', () => {
    it('pre-fills nested object fields', () => {
        renderWithProviders(
            <Form defaultValues={{ address: { city: 'Rome', zip: '00100' } }}>
                <Input name="address.city" label="City" />
                <Input name="address.zip"  label="ZIP"  />
            </Form>
        );
        expect(screen.getByDisplayValue('Rome')).toBeInTheDocument();
        expect(screen.getByDisplayValue('00100')).toBeInTheDocument();
    });

    it('saves nested fields as a nested object', async () => {
        const provider = new MockDataProvider();
        renderWithProviders(
            <Form
                dataStoragePath="/orders/ord_1"
                defaultValues={{ shipping: { country: 'IT' } }}
            >
                <Input name="shipping.country" label="Country" />
            </Form>,
            { provider }
        );

        fireEvent.click(screen.getByRole('button', { name: /save|salva/i }));

        await waitFor(async () => {
            const saved = await provider.read('/orders/ord_1');
            expect(saved).toMatchObject({ shipping: { country: 'IT' } });
        });
    });
});
