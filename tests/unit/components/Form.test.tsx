import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
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
        Card:          { wrapClass: '', className: '', headerClass: '', bodyClass: '', footerClass: '', showLoader: false },
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
            Card:    { className: '', headerClass: '', bodyClass: '', footerClass: '' },
            Modal:   { size: 'md', position: 'center', wrapClass: '', className: '', headerClass: '', titleClass: '', bodyClass: '', footerClass: '' },
        },
    })),
    ThemeProvider: ({ children }: any) => children,
}));

import Form from '../../../src/components/widgets/Form';
import { ActionButton } from '../../../src/components/ui/Buttons';
import { Input, TextArea } from '../../../src/components/ui/fields/Input';
import { MockDataProvider } from '../../../src/providers/data/mock';
import { renderWithProviders } from '../../helpers/renderWithProviders';
import { useFormController } from '../../../src/components/widgets/form-controller';

beforeEach(() => {
    localStorage.clear();
});

afterEach(() => {
    vi.useRealTimers();
});

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

    it('supports CSS-only floating labels for inputs and textareas', () => {
        renderWithProviders(
            <Form defaultValues={{ title: '', description: '' }}>
                <Input name="title" label="Title" labelMode="floating" />
                <TextArea name="description" label="Description" labelMode="floating" />
            </Form>
        );

        const title = screen.getByLabelText('Title') as HTMLInputElement;
        const description = screen.getByLabelText('Description') as HTMLTextAreaElement;

        expect(title.placeholder).toBe(' ');
        expect(description.placeholder).toBe(' ');
    });

    it('renders Save button', () => {
        renderWithProviders(
            <Form defaultValues={{}} path="/items" keyGenerator={() => 'new'}>
                <Input name="x" />
            </Form>
        );
        expect(screen.getByRole('button', { name: /save|salva/i })).toBeInTheDocument();
    });

    it('keeps Save disabled until the record changes', () => {
        renderWithProviders(
            <Form defaultValues={{ title: 'Original' }} path="/items/item_1">
                <Input name="title" label="Title" />
            </Form>
        );

        const saveButton = screen.getByRole('button', { name: /save|salva/i }) as HTMLButtonElement;
        const input = screen.getByRole('textbox') as HTMLInputElement;

        expect(saveButton.disabled).toBe(true);

        fireEvent.change(input, { target: { name: 'title', value: 'Updated' } });
        expect(saveButton.disabled).toBe(false);

        fireEvent.change(input, { target: { name: 'title', value: 'Original' } });
        expect(saveButton.disabled).toBe(true);
    });
});

// ── path — existing record (FormDatabase path) ─────────────────────

describe('Form — loading from DataProvider', () => {
    it('shows loading state then renders record fields', async () => {
        const provider = new MockDataProvider({
            '/users': { u1: { name: 'Alice', role: 'admin' } },
        });
        renderWithProviders(
            <Form path="/users/u1">
                <Input name="name" label="Name" />
                <Input name="role" label="Role" />
            </Form>,
            { provider }
        );

        // Loading spinner shown initially
        expect(screen.getByText(/loading/i)).toBeInTheDocument();

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
                path="/products/new_id"
                defaultValues={{ title: 'Widget' }}
            >
                <Input name="title" label="Title" />
            </Form>,
            { provider }
        );

        const saveBtn = screen.getByRole('button', { name: /save|salva/i });
        fireEvent.change(screen.getByRole('textbox'), { target: { name: 'title', value: 'Widget updated' } });
        fireEvent.click(saveBtn);

        await waitFor(async () => {
            const saved = await provider.read('/products/new_id');
            expect(saved).toMatchObject({ title: 'Widget updated' });
        });
    });

    it('calls onComplete after save', async () => {
        const onComplete = vi.fn(async () => false);
        const provider = new MockDataProvider();

        renderWithProviders(
            <Form
                path="/items/item_1"
                defaultValues={{ _key: 'item_1', name: 'Test' }}
                onComplete={onComplete}
            >
                <Input name="name" />
            </Form>,
            { provider }
        );

        const input = screen.getByRole('textbox') as HTMLInputElement;
        fireEvent.change(input, { target: { name: 'name', value: 'Test updated' } });
        fireEvent.click(screen.getByRole('button', { name: /save|salva/i }));

        await waitFor(() => {
            expect(onComplete).toHaveBeenCalledWith(
                expect.objectContaining({ action: 'update' })
            );
        });
    });

    it('renders the save notice as sticky when noticeAnchorRef is provided', async () => {
        const provider = new MockDataProvider();
        const anchorRef = React.createRef<HTMLDivElement>();

        renderWithProviders(
            <div ref={anchorRef}>
                <Form
                    path="/products/sticky_notice"
                    defaultValues={{ title: 'Widget' }}
                    noticeAnchorRef={anchorRef}
                >
                    <Input name="title" label="Title" />
                </Form>
            </div>,
            { provider }
        );

        fireEvent.change(screen.getByRole('textbox'), { target: { name: 'title', value: 'Widget updated' } });
        fireEvent.click(screen.getByRole('button', { name: /save|salva/i }));

        await waitFor(() => {
            expect(screen.getByRole('alert')).toBeInTheDocument();
        });

        expect(anchorRef.current?.querySelector('[role="alert"]')?.textContent).toContain('Record saved successfully');
    });

    it('saves with Ctrl+S when a field inside the form is focused', async () => {
        const provider = new MockDataProvider();

        renderWithProviders(
            <Form path="/products/shortcut" defaultValues={{ title: 'Widget' }}>
                <Input name="title" label="Title" />
            </Form>,
            { provider }
        );

        const input = screen.getByRole('textbox') as HTMLInputElement;
        fireEvent.change(input, { target: { name: 'title', value: 'Widget v2' } });
        input.focus();
        await waitFor(() => {
            expect(screen.getByRole('button', { name: /save|salva/i })).not.toBeDisabled();
        });

        fireEvent.keyDown(input, { key: 's', code: 'KeyS', ctrlKey: true, bubbles: true });

        await waitFor(async () => {
            const saved = await provider.read('/products/shortcut');
            expect(saved).toMatchObject({ title: 'Widget v2' });
        });
    });

    it('lets an external button reuse native dirty state and save through FormController', async () => {
        const provider = new MockDataProvider({
            '/products': { controlled: { title: 'Widget' } },
        });

        function ControlledForm() {
            const form = useFormController();

            return (
                <>
                    <ActionButton
                        label="Save from header"
                        disabled={form.saveDisabled}
                        loading={form.isSaving}
                        onClick={() => { void form.save(); }}
                    />
                    <Form controller={form} path="/products/controlled">
                        <Input name="title" label="Title" />
                    </Form>
                </>
            );
        }

        renderWithProviders(<ControlledForm />, { provider });

        await waitFor(() => {
            expect(screen.getByDisplayValue('Widget')).toBeInTheDocument();
        });

        const saveButton = screen.getByRole('button', { name: /save from header/i }) as HTMLButtonElement;
        const input = screen.getByRole('textbox') as HTMLInputElement;

        expect(saveButton.disabled).toBe(true);

        fireEvent.change(input, { target: { name: 'title', value: 'Widget v2' } });
        expect(saveButton.disabled).toBe(false);

        fireEvent.click(saveButton);

        await waitFor(async () => {
            const saved = await provider.read('/products/controlled');
            expect(saved).toMatchObject({ title: 'Widget v2' });
        });
    });
});

describe('Form — draft restore', () => {
    it('does not persist a local draft unless explicitly enabled', async () => {
        const initial = (
            <Form path="/drafts/item_disabled" defaultValues={{ title: 'Original' }}>
                <Input name="title" label="Title" />
            </Form>
        );

        const firstRender = renderWithProviders(initial);
        const input = screen.getByRole('textbox') as HTMLInputElement;
        fireEvent.change(input, { target: { name: 'title', value: 'Draft value' } });

        await new Promise((resolve) => setTimeout(resolve, 250));
        firstRender.unmount();

        renderWithProviders(initial);

        expect(screen.queryByText(/unsaved changes found/i)).not.toBeInTheDocument();
        expect(screen.getByDisplayValue('Original')).toBeInTheDocument();
    });

    it('offers to restore a local draft from its bucket after remount and can discard it again', async () => {
        const initial = (
            <Form path="/drafts/item_1" defaultValues={{ title: 'Original' }} draftBucket="tenant-a">
                <Input name="title" label="Title" />
            </Form>
        );

        const firstRender = renderWithProviders(initial);
        const input = screen.getByRole('textbox') as HTMLInputElement;
        fireEvent.change(input, { target: { name: 'title', value: 'Draft value' } });

        await new Promise((resolve) => setTimeout(resolve, 250));
        firstRender.unmount();

        renderWithProviders(initial);

        expect(await screen.findByText(/unsaved changes found/i)).toBeInTheDocument();
        fireEvent.click(screen.getByRole('button', { name: /restore/i }));

        await waitFor(() => {
            expect(screen.getByDisplayValue('Draft value')).toBeInTheDocument();
        });

        fireEvent.click(screen.getAllByRole('button', { name: /discard/i })[0]);

        await waitFor(() => {
            expect(screen.getByDisplayValue('Original')).toBeInTheDocument();
        });
    });

    it('flushes a dirty draft when the user leaves before the debounce expires', async () => {
        const initial = (
            <Form path="/drafts/immediate_exit" defaultValues={{ title: 'Original' }} draftBucket="tenant-a">
                <Input name="title" label="Title" />
            </Form>
        );

        const firstRender = renderWithProviders(initial);
        fireEvent.change(screen.getByRole('textbox'), { target: { name: 'title', value: 'Final edit' } });
        firstRender.unmount();

        renderWithProviders(initial);

        expect(await screen.findByText(/unsaved changes found/i)).toBeInTheDocument();
        fireEvent.click(screen.getByRole('button', { name: /restore/i }));
        await waitFor(() => {
            expect(screen.getByDisplayValue('Final edit')).toBeInTheDocument();
        });
    });

    it('isolates drafts with the same form path in different buckets', async () => {
        const tenantA = (
            <Form path="/drafts/shared" defaultValues={{ title: 'Original' }} draftBucket="tenant-a">
                <Input name="title" label="Title" />
            </Form>
        );
        const tenantB = (
            <Form path="/drafts/shared" defaultValues={{ title: 'Original' }} draftBucket="tenant-b">
                <Input name="title" label="Title" />
            </Form>
        );

        const firstRender = renderWithProviders(tenantA);
        fireEvent.change(screen.getByRole('textbox'), { target: { name: 'title', value: 'Tenant A draft' } });
        await new Promise((resolve) => setTimeout(resolve, 250));
        firstRender.unmount();

        renderWithProviders(tenantB);

        expect(screen.queryByText(/unsaved changes found/i)).not.toBeInTheDocument();
        expect(screen.getByDisplayValue('Original')).toBeInTheDocument();
    });
});

// ── validation — required fields block submit ─────────────────────────────────

describe('Form — required validation', () => {
    it('blocks submit and shows error when a required Input is empty', async () => {
        const provider = new MockDataProvider();
        renderWithProviders(
            <Form path="/items/x" defaultValues={{ title: 'Seed' }}>
                <Input name="title" label="Title" required />
            </Form>,
            { provider }
        );

        fireEvent.change(screen.getByRole('textbox'), { target: { name: 'title', value: '' } });
        fireEvent.click(screen.getByRole('button', { name: /save|salva/i }));

        // Error message appears
        await waitFor(() => {
            expect(screen.getByText(/title is required/i)).toBeInTheDocument();
        });

        // Nothing was written to the provider
        const saved = await provider.read('/items/x');
        expect(saved).toBeUndefined();
    });

    it('allows submit when required Input has a value', async () => {
        const provider = new MockDataProvider();
        renderWithProviders(
            <Form path="/items/y" defaultValues={{ title: 'Hello' }}>
                <Input name="title" label="Title" required />
            </Form>,
            { provider }
        );

        fireEvent.change(screen.getByRole('textbox'), { target: { name: 'title', value: 'Hello again' } });
        fireEvent.click(screen.getByRole('button', { name: /save|salva/i }));

        await waitFor(async () => {
            const saved = await provider.read('/items/y');
            expect(saved).toMatchObject({ title: 'Hello again' });
        });
    });

    it('blocks submit and shows error for multiple required fields', async () => {
        const provider = new MockDataProvider();
        renderWithProviders(
            <Form path="/items/z" defaultValues={{ name: 'Alice', email: 'alice@example.com' }}>
                <Input name="name"  label="Name"  required />
                <Input name="email" label="Email" required />
            </Form>,
            { provider }
        );

        const inputs = screen.getAllByRole('textbox') as HTMLInputElement[];
        fireEvent.change(inputs[0], { target: { name: 'name', value: '' } });
        fireEvent.change(inputs[1], { target: { name: 'email', value: '' } });
        fireEvent.click(screen.getByRole('button', { name: /save|salva/i }));

        await waitFor(() => {
            expect(screen.getByText(/name is required/i)).toBeInTheDocument();
            expect(screen.getByText(/email is required/i)).toBeInTheDocument();
        });
    });

    it('clears the error when the user fills the field after a failed submit', async () => {
        renderWithProviders(
            <Form path="/items/clr" defaultValues={{ title: 'Seed' }}>
                <Input name="title" label="Title" required />
            </Form>
        );

        fireEvent.change(screen.getByRole('textbox'), { target: { name: 'title', value: '' } });
        fireEvent.click(screen.getByRole('button', { name: /save|salva/i }));

        await waitFor(() => {
            expect(screen.getByText(/title is required/i)).toBeInTheDocument();
        });

        const input = screen.getByRole('textbox') as HTMLInputElement;
        fireEvent.change(input, { target: { name: 'title', value: 'New value' } });

        await waitFor(() => {
            expect(screen.queryByText(/title is required/i)).not.toBeInTheDocument();
        });
    });

    it('runs custom validator and blocks submit when it returns an error', async () => {
        const provider = new MockDataProvider();
        const validateEmail = (v: string) =>
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? undefined : 'Invalid email address';

        renderWithProviders(
            <Form path="/items/v" defaultValues={{ email: 'valid@example.com' }}>
                <Input name="email" label="Email" validator={validateEmail} />
            </Form>,
            { provider }
        );

        fireEvent.change(screen.getByRole('textbox'), { target: { name: 'email', value: 'not-an-email' } });
        fireEvent.click(screen.getByRole('button', { name: /save|salva/i }));

        await waitFor(() => {
            expect(screen.getByText('Invalid email address')).toBeInTheDocument();
        });

        const saved = await provider.read('/items/v');
        expect(saved).toBeUndefined();
    });

    it('awaits async validators and blocks submit when they return an error', async () => {
        const provider = new MockDataProvider();
        const validateJson = vi.fn(async (value: string) => {
            await Promise.resolve();
            return value.startsWith('{') ? undefined : 'Invalid JSON payload';
        });

        renderWithProviders(
            <Form path="/items/async-validator" defaultValues={{ payload: '{"ok":true}' }}>
                <Input name="payload" label="Payload" validator={validateJson} />
            </Form>,
            { provider }
        );

        fireEvent.change(screen.getByRole('textbox'), { target: { name: 'payload', value: 'oops' } });
        fireEvent.click(screen.getByRole('button', { name: /save|salva/i }));

        await waitFor(() => {
            expect(screen.getByText('Invalid JSON payload')).toBeInTheDocument();
        });

        expect(validateJson).toHaveBeenCalledWith('oops');
        const saved = await provider.read('/items/async-validator');
        expect(saved).toBeUndefined();
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
                path="/orders/ord_1"
                defaultValues={{ shipping: { country: 'US' } }}
            >
                <Input name="shipping.country" label="Country" />
            </Form>,
            { provider }
        );

        fireEvent.change(screen.getByRole('textbox'), { target: { name: 'shipping.country', value: 'IT' } });
        fireEvent.click(screen.getByRole('button', { name: /save|salva/i }));

        await waitFor(async () => {
            const saved = await provider.read('/orders/ord_1');
            expect(saved).toMatchObject({ shipping: { country: 'IT' } });
        });
    });
});

