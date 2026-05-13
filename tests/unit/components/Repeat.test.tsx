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
import Repeat from '../../../src/components/ui/Repeat';
import { Input } from '../../../src/components/ui/fields/Input';
import { MockDataProvider } from '../../../src/providers/data/mock';
import { renderWithProviders } from '../../helpers/renderWithProviders';

describe('Repeat', () => {
    it('renders one group for each array item', () => {
        renderWithProviders(
            <Form defaultValues={{ tasks: [{ title: 'Plan' }, { title: 'Ship' }] }}>
                <Repeat name="tasks">
                    <Input name="title" label="Title" />
                </Repeat>
            </Form>
        );

        expect(screen.getByDisplayValue('Plan')).toBeInTheDocument();
        expect(screen.getByDisplayValue('Ship')).toBeInTheDocument();
    });

    it('adds a new empty item and keeps nested field names writable', () => {
        renderWithProviders(
            <Form defaultValues={{ tasks: [{ title: 'Plan' }] }}>
                <Repeat name="tasks">
                    <Input name="title" label="Title" />
                </Repeat>
            </Form>
        );

        fireEvent.click(screen.getByRole('button', { name: /add/i }));

        const inputs = screen.getAllByRole('textbox') as HTMLInputElement[];
        expect(inputs).toHaveLength(2);

        fireEvent.change(inputs[1], { target: { name: 'tasks.1.title', value: 'Review' } });
        expect(inputs[1].value).toBe('Review');
    });

    it('does not render add/remove controls when readOnly', () => {
        renderWithProviders(
            <Form defaultValues={{ tasks: [{ title: 'Plan' }] }}>
                <Repeat name="tasks" readOnly>
                    <Input name="title" label="Title" />
                </Repeat>
            </Form>
        );

        expect(screen.queryByRole('button')).not.toBeInTheDocument();
    });

    it('saves repeated nested values through Form', async () => {
        const provider = new MockDataProvider();

        renderWithProviders(
            <Form
                dataStoragePath="/projects/p1"
                defaultValues={{ tasks: [{ title: 'Plan' }] }}
            >
                <Repeat name="tasks">
                    <Input name="title" label="Title" />
                </Repeat>
            </Form>,
            { provider }
        );

        fireEvent.click(screen.getByRole('button', { name: /add/i }));
        const inputs = screen.getAllByRole('textbox') as HTMLInputElement[];
        fireEvent.change(inputs[1], { target: { name: 'tasks.1.title', value: 'Review' } });
        fireEvent.click(screen.getByRole('button', { name: /save/i }));

        await waitFor(async () => {
            await expect(provider.read('/projects/p1')).resolves.toMatchObject({
                tasks: [{ title: 'Plan' }, { title: 'Review' }],
            });
        });
    });
});
