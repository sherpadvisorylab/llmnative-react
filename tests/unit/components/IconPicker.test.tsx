import { describe, it, expect, vi } from 'vitest';
import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';

vi.mock('../../../src/Config', () => ({
    getConfig: vi.fn(() => ({})),
    onConfigChange: vi.fn(),
    default: {},
}));
vi.mock('../../../src/providers/firebase-init', () => ({ default: vi.fn(), getSafeAuth: vi.fn() }));
vi.mock('../../../src/Theme', () => ({
    PLACEHOLDER_IMAGE: 'placeholder.png',
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
        Pagination:    { maxItems: 5 },
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
import { IconPicker } from '../../../src/components/ui/fields/IconPicker';
import { IconProvider } from '../../../src/providers/icon/IconProviderContext';
import { LucideIconProvider } from '../../../src/providers/icon/LucideIconProvider';
import { PhosphorIconProvider } from '../../../src/providers/icon/PhosphorIconProvider';
import { renderWithProviders } from '../../helpers/renderWithProviders';

describe('icon providers list their icons (CR-148)', () => {
    it('lists the names that resolve, for Lucide and Phosphor', () => {
        for (const provider of [new LucideIconProvider(), new PhosphorIconProvider()]) {
            const names = provider.list();
            expect(names.length).toBeGreaterThan(1000);
            expect(names.every((n) => provider.resolve(n))).toBe(true);
        }
        expect(new LucideIconProvider().list()).toEqual(expect.arrayContaining(['landmark', 'piggy-bank', 'arrow-up-01']));
        // A Phosphor icon exported only with the `Icon` suffix resolves by its name.
        expect(new PhosphorIconProvider().resolve('activity')).not.toBeNull();
    });
});

describe('IconPicker (CR-148)', () => {
    const renderPicker = (props: Partial<React.ComponentProps<typeof IconPicker>> = {}, value = 'landmark') => {
        const saved: unknown[] = [];
        const utils = renderWithProviders(
            <IconProvider config="lucide">
                <Form defaultValues={{ icona: value }} onSubmit={async ({ record }) => { saved.push(record.icona); }}>
                    <IconPicker name="icona" label="Icona" {...props} />
                </Form>
            </IconProvider>
        );
        return { ...utils, saved };
    };

    it('opens a modal with a search box and the grid, and saves the icon chosen', async () => {
        const user = userEvent.setup();
        renderPicker({ options: ['landmark', 'car', 'house', 'piggy-bank'] });
        await user.click(screen.getByRole('button', { name: /landmark/ }));
        const dialog = screen.getByRole('dialog');
        expect(within(dialog).getAllByRole('option').map((o) => o.getAttribute('title'))).toEqual(['landmark', 'car', 'house', 'piggy-bank']);
        await user.type(within(dialog).getByRole('searchbox'), 'piggy');
        expect(within(dialog).getAllByRole('option').map((o) => o.getAttribute('title'))).toEqual(['piggy-bank']);
        await user.click(within(dialog).getByRole('option', { name: 'piggy-bank' }));
        await user.click(within(dialog).getByRole('button', { name: /save|salva/i }));
        expect(screen.queryByRole('dialog')).toBeNull();
        expect(screen.getByText('piggy-bank')).toBeInTheDocument();
    });

    it('leaves out the excluded icons but keeps the current one, and finds an icon by its keywords', async () => {
        const user = userEvent.setup();
        renderPicker({ options: ['landmark', 'car', 'house'], exclude: ['car', 'landmark'], keywords: { house: 'casa' } });
        await user.click(screen.getByRole('button', { name: /landmark/ }));
        const dialog = screen.getByRole('dialog');
        expect(within(dialog).getAllByRole('option').map((o) => o.getAttribute('title'))).toEqual(['landmark', 'house']);
        await user.type(within(dialog).getByRole('searchbox'), 'casa');
        expect(within(dialog).getAllByRole('option').map((o) => o.getAttribute('title'))).toEqual(['house']);
    });

    it('compact: only the button, its name in the tooltip', async () => {
        const user = userEvent.setup();
        renderPicker({ compact: true, options: ['landmark', 'car'] });
        expect(screen.queryByText('landmark')).toBeNull();
        const button = screen.getByRole('button', { name: /landmark/ });
        expect(button.getAttribute('title')).toMatch(/^landmark/);
        await user.click(button);
        expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    it('without options, shows the icons of the active provider, at most a page of them', async () => {
        const user = userEvent.setup();
        renderPicker({}, '');
        await user.click(screen.getAllByRole('button', { name: /choose|scegli/i })[0]);
        const dialog = screen.getByRole('dialog');
        expect(within(dialog).getAllByRole('option').length).toBe(240);
    });
});
