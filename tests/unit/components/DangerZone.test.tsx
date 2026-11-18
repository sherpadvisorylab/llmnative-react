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
        Badge:         { className: '' },
        Modal:         { size: 'md', position: 'center', wrapClass: '', className: '', headerClass: '', titleClass: '', bodyClass: '', footerClass: '', iconExpand: '', iconCollapse: '' },
        ActionButton:  { className: '', badgeClass: '' },
        LoadingButton: { className: '', badgeClass: '', spinnerClass: '' },
        Alert:         { className: '' },
        Form: {
            wrapClass: '',
            buttonSaveClass: '', buttonDeleteClass: '', buttonBackClass: '',
            Card: { headerClass: '', bodyClass: '', footerClass: '' },
        },
    })),
    ThemeProvider: ({ children }: any) => children,
}));

import Form from '../../../src/components/widgets/Form';
import { DangerZone } from '../../../src/components/blocks/DangerZone';
import { Input } from '../../../src/components/ui/fields/Input';
import { MockDataProvider } from '../../../src/providers/data/mock';
import { renderWithProviders } from '../../helpers/renderWithProviders';

// CR-142 — the danger zone, alone and in a Form.

const confermaRossa = () => screen.getAllByRole('button').filter((b) => b.closest('[role="dialog"]')).at(-1) as HTMLButtonElement;

describe('DangerZone', () => {
    it('confirms with a key: the red button works only with the exact key, the button copies it (AC1)', async () => {
        const onConfirm = vi.fn(async () => undefined);
        const writeText = vi.fn(async () => undefined);
        Object.defineProperty(navigator, 'clipboard', { value: { writeText }, configurable: true });
        renderWithProviders(<DangerZone actions={[{ title: 'Delete the Partner', label: 'Delete', confirm: { key: 'Leasing Nord' }, onConfirm }]} />);
        expect(screen.getByText('Delete the Partner')).toBeInTheDocument();
        fireEvent.click(screen.getByRole('button', { name: /delete/i }));
        await waitFor(() => expect(screen.getByRole('dialog')).toBeInTheDocument());
        expect(screen.getByText('Leasing Nord')).toBeInTheDocument();
        expect(confermaRossa()).toBeDisabled();
        fireEvent.click(screen.getByRole('button', { name: /copy|copia/i }));
        await waitFor(() => expect(writeText).toHaveBeenCalledWith('Leasing Nord'));
        const campo = screen.getByRole('dialog').querySelector('input') as HTMLInputElement;
        fireEvent.change(campo, { target: { value: 'Leasing' } });
        expect(confermaRossa()).toBeDisabled();
        fireEvent.change(campo, { target: { value: 'Leasing Nord' } });
        expect(confermaRossa()).not.toBeDisabled();
        fireEvent.click(confermaRossa());
        await waitFor(() => expect(onConfirm).toHaveBeenCalledTimes(1));
        await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
    });

    it('without confirmation runs at once; with yes or no asks first; false keeps the confirmation open (AC2)', async () => {
        const subito = vi.fn();
        const chiede = vi.fn(async () => false as const);
        renderWithProviders(<DangerZone actions={[
            { id: 'a', title: 'Unblock', label: 'Unblock', variant: 'secondary', confirm: false, onConfirm: subito },
            { id: 'b', title: 'Block', label: 'Block', onConfirm: chiede },
        ]} />);
        fireEvent.click(screen.getByRole('button', { name: 'Unblock' }));
        await waitFor(() => expect(subito).toHaveBeenCalledTimes(1));
        expect(screen.queryByRole('dialog')).toBeNull();
        fireEvent.click(screen.getByRole('button', { name: 'Block' }));
        await waitFor(() => expect(screen.getByRole('dialog')).toBeInTheDocument());
        expect(chiede).not.toHaveBeenCalled();
        expect(confermaRossa()).not.toBeDisabled();
        fireEvent.click(confermaRossa());
        await waitFor(() => expect(chiede).toHaveBeenCalledTimes(1));
        expect(screen.getByRole('dialog')).toBeInTheDocument();
    });
});

describe('Form.dangerZone', () => {
    it('replaces the Delete button: the deletion first, with its key, then the custom actions (AC3)', async () => {
        const provider = new MockDataProvider({ items: { item_1: { name: 'Leasing Nord' } } });
        const blocca = vi.fn();
        const onComplete = vi.fn(async () => false);
        renderWithProviders(
            <Form
                path="/items/item_1"
                defaultValues={{ _key: 'item_1', name: 'Leasing Nord' }}
                onComplete={onComplete}
                dangerZone={{ delete: { key: (r) => String(r.name) }, actions: [{ title: 'Block', label: 'Block', confirm: false, onConfirm: blocca }] }}
            >
                <Input name="name" />
            </Form>,
            { provider }
        );
        const pulsanti = screen.getAllByRole('button').map((b) => b.textContent?.trim());
        expect(pulsanti.filter((t) => /^(delete|elimina)$/i.test(t ?? ''))).toHaveLength(1);
        const zona = screen.getByRole('region', { name: /danger zone|zona pericolosa/i });
        const voci = [...zona.querySelectorAll('li')].map((li) => li.querySelector('button')?.textContent?.trim());
        expect(voci).toEqual([expect.stringMatching(/delete|elimina/i), 'Block']);
        fireEvent.click(zona.querySelectorAll('li button')[1]);
        await waitFor(() => expect(blocca).toHaveBeenCalledTimes(1));
        fireEvent.click(zona.querySelectorAll('li button')[0]);
        await waitFor(() => expect(screen.getByRole('dialog')).toBeInTheDocument());
        fireEvent.change(screen.getByRole('dialog').querySelector('input') as HTMLInputElement, { target: { value: 'Leasing Nord' } });
        fireEvent.click(confermaRossa());
        await waitFor(() => expect(onComplete).toHaveBeenCalledWith(expect.objectContaining({ action: 'delete' })));
    });

    it('a new record has no deletion; delete: false leaves only the actions', () => {
        renderWithProviders(
            <Form path="/items" defaultValues={{}} dangerZone={{ actions: [{ title: 'Archive', label: 'Archive', onConfirm: () => undefined }] }}>
                <Input name="name" />
            </Form>
        );
        const zona = screen.getByRole('region', { name: /danger zone|zona pericolosa/i });
        expect([...zona.querySelectorAll('li button')].map((b) => b.textContent?.trim())).toEqual(['Archive']);
    });

    it('without dangerZone the Form keeps its Delete button and no zone (AC4)', () => {
        renderWithProviders(
            <Form path="/items/item_1" defaultValues={{ _key: 'item_1', name: 'x' }}>
                <Input name="name" />
            </Form>
        );
        expect(screen.queryByRole('region', { name: /danger zone|zona pericolosa/i })).toBeNull();
        expect(screen.getAllByRole('button').some((b) => /^(delete|elimina)$/i.test(b.textContent?.trim() ?? ''))).toBe(true);
    });
});
