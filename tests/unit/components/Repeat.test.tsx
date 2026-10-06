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
        Repeat: { itemClassName: '', inlineItemClassName: '', addButtonClassName: '' },
    })),
    ThemeProvider: ({ children }: any) => children,
}));

import Form from '../../../src/components/widgets/Form';
import Repeat from '../../../src/components/ui/Repeat';
import { Input } from '../../../src/components/ui/fields/Input';
import { MockDataProvider } from '../../../src/providers/data/mock';
import { renderWithProviders } from '../../helpers/renderWithProviders';
import { I18nProvider } from '../../../src/I18n';
import { en, it as itLocale, de, ru, zh, ar } from '../../../src/conf/i18n';

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
                path="/projects/p1"
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

    it('keeps an absolute child name coherent with the parent (no duplicated index)', async () => {
        const provider = new MockDataProvider();

        renderWithProviders(
            <Form path="/projects/p1" defaultValues={{ items: [{ name: 'Plan' }] }}>
                <Repeat name="items">
                    {({ index }: { index: number }) => <Input name={`items.${index}.name`} label="Name" />}
                </Repeat>
            </Form>,
            { provider }
        );

        const input = screen.getByDisplayValue('Plan') as HTMLInputElement;
        expect(input.name).toBe('items.0.name');

        fireEvent.change(input, { target: { name: 'items.0.name', value: 'Review' } });
        fireEvent.click(screen.getByRole('button', { name: /save/i }));

        await waitFor(async () => {
            await expect(provider.read('/projects/p1')).resolves.toMatchObject({
                items: [{ name: 'Review' }],
            });
        });
    });

    it('prefixes a relative nested child name under the current row', () => {
        renderWithProviders(
            <Form defaultValues={{ items: [{ address: { city: 'Rome' } }] }}>
                <Repeat name="items">
                    <Input name="address.city" label="City" />
                </Repeat>
            </Form>
        );

        expect((screen.getByDisplayValue('Rome') as HTMLInputElement).name).toBe('items.0.address.city');
    });

    it('still manages an incoherent absolute child name under the current parent', () => {
        renderWithProviders(
            <Form defaultValues={{ items: [{ other: [{ name: 'X' }] }] }}>
                <Repeat name="items">
                    <Input name="other.0.name" label="Name" />
                </Repeat>
            </Form>
        );

        expect((screen.getByDisplayValue('X') as HTMLInputElement).name).toBe('items.0.other.0.name');
    });

    it('renders each row with its fields in the vertical layout', () => {
        renderWithProviders(
            <Form defaultValues={{ tasks: [{ title: 'Plan' }] }}>
                <Repeat name="tasks" layout="vertical">
                    <Input name="title" label="Title" />
                </Repeat>
            </Form>
        );

        const input = screen.getByDisplayValue('Plan') as HTMLInputElement;
        expect(input.name).toBe('tasks.0.title');
        expect(screen.getByRole('button', { name: 'Remove item' })).toBeInTheDocument();
    });

    it('exposes accessible add/remove button names from the repeat namespace', () => {
        renderWithProviders(
            <Form defaultValues={{ tasks: [{ title: 'Plan' }] }}>
                <Repeat name="tasks" label="Tasks">
                    <Input name="title" label="Title" />
                </Repeat>
            </Form>
        );

        expect(screen.getByRole('button', { name: 'Add item' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Remove item' })).toBeInTheDocument();
    });

    const localeCases = [
        { locale: 'en', dict: en, add: 'Add item', remove: 'Remove item' },
        { locale: 'it', dict: itLocale, add: 'Aggiungi elemento', remove: 'Rimuovi elemento' },
        { locale: 'de', dict: de, add: 'Element hinzufügen', remove: 'Element entfernen' },
        { locale: 'ru', dict: ru, add: 'Добавить элемент', remove: 'Удалить элемент' },
        { locale: 'zh', dict: zh, add: '添加项目', remove: '移除项目' },
        { locale: 'ar', dict: ar, add: 'إضافة عنصر', remove: 'إزالة عنصر' },
    ];

    localeCases.forEach(({ locale, dict, add, remove }) => {
        it(`localizes the add/remove buttons in ${locale}`, () => {
            renderWithProviders(
                <I18nProvider config={{ locale, translations: { [locale]: dict } }}>
                    <Form defaultValues={{ tasks: [{ title: 'Plan' }] }}>
                        <Repeat name="tasks" label="Tasks">
                            <Input name="title" label="Title" />
                        </Repeat>
                    </Form>
                </I18nProvider>
            );

            expect(screen.getByRole('button', { name: add })).toBeInTheDocument();
            expect(screen.getByRole('button', { name: remove })).toBeInTheDocument();
        });
    });
});

