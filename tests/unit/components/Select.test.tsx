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
        Card:         { wrapClass: '', className: '', headerClass: '', bodyClass: '', footerClass: '', showLoader: false, showArrow: false },
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

    it('loads options from the registered DataProvider using db.path', async () => {
        const provider = new MockDataProvider({
            '/categories': {
                ops: { label: 'Operations', value: 'ops' },
                sales: { label: 'Sales', value: 'sales' },
            },
        });

        renderWithProviders(
            <Form defaultValues={{ categoryId: 'sales' }}>
                <Select name="categoryId" label="Category" db={{ path: '/categories' }} />
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
    it('renders a datalist-backed input', () => {
        renderWithProviders(
            <Form defaultValues={{ assignees: [] }}>
                <Autocomplete name="assignees" label="Assignees" placeholder="Type a person..." options={OPTIONS} />
            </Form>
        );

        expect(screen.getByPlaceholderText('Type a person...')).toBeInTheDocument();
        expect(screen.getByText('Admin')).toBeInTheDocument();
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
