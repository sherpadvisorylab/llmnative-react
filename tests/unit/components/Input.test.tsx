import { describe, it, expect, vi } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';
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
import { Input } from '../../../src/components/ui/fields/Input';
import { renderWithProviders } from '../../helpers/renderWithProviders';

// Input must be rendered inside a Form to have FormContext
function InputInForm({ name = 'field', ...props }: any) {
    return (
        <Form defaultValues={{ field: '' }}>
            <Input name={name} {...props} />
        </Form>
    );
}

describe('Input — rendering', () => {
    it('renders a text input by default', () => {
        renderWithProviders(<InputInForm name="username" />);
        expect(screen.getByRole('textbox')).toBeInTheDocument();
    });

    it('renders a label when label prop is given', () => {
        renderWithProviders(<InputInForm name="username" label="Username" />);
        expect(screen.getByLabelText('Username')).toBeInTheDocument();
    });

    it('renders required marker on label', () => {
        renderWithProviders(<InputInForm name="email" label="Email" required />);
        const label = screen.getByText(/Email/);
        expect(label).toBeInTheDocument();
        // required field shows asterisk marker
        expect(label.closest('label')?.textContent).toContain('*');
    });

    it('renders with correct type attribute', () => {
        renderWithProviders(<InputInForm name="pwd" type="password" />);
        expect(screen.getByDisplayValue('')).toHaveAttribute('type', 'password');
    });

    it('renders with placeholder', () => {
        renderWithProviders(<InputInForm name="search" placeholder="Search…" />);
        expect(screen.getByPlaceholderText('Search…')).toBeInTheDocument();
    });

    it('pre-fills with defaultValue from Form', () => {
        renderWithProviders(
            <Form defaultValues={{ city: 'Rome' }}>
                <Input name="city" label="City" />
            </Form>
        );
        expect(screen.getByDisplayValue('Rome')).toBeInTheDocument();
    });
});

describe('Input — interaction', () => {
    it('updates value on user input', () => {
        renderWithProviders(<InputInForm name="name" label="Name" />);
        const input = screen.getByRole('textbox') as HTMLInputElement;
        fireEvent.change(input, { target: { name: 'name', value: 'Alice' } });
        expect(input.value).toBe('Alice');
    });

    it('is disabled when disabled prop is true', () => {
        renderWithProviders(<InputInForm name="id" disabled />);
        expect(screen.getByRole('textbox')).toBeDisabled();
    });

    it('renders number input', () => {
        renderWithProviders(<InputInForm name="age" type="number" />);
        const input = screen.getByRole('spinbutton');
        expect(input).toHaveAttribute('type', 'number');
    });
});

