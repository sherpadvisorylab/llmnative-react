import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import Modal from '../../../src/components/ui/Modal';
import { I18nProvider } from '../../../src/I18n';

describe('Modal', () => {
    it('closes on backdrop click by default', async () => {
        const onClose = vi.fn();

        render(
            <I18nProvider><Modal title="Playground" onClose={onClose}>
                Modal body
            </Modal></I18nProvider>
        );

        fireEvent.click(document.body.querySelector('[data-rf-modal-backdrop]') as Element);

        await waitFor(() => {
            expect(onClose).toHaveBeenCalledOnce();
        });
    });

    it('can keep the modal open when backdrop close is disabled', () => {
        const onClose = vi.fn();

        render(
            <I18nProvider><Modal title="Locked" onClose={onClose} closeOnBackdrop={false}>
                Modal body
            </Modal></I18nProvider>
        );

        fireEvent.click(document.body.querySelector('[data-rf-modal-backdrop]') as Element);

        expect(onClose).not.toHaveBeenCalled();
        expect(screen.getByText('Modal body')).toBeInTheDocument();
    });

    it('exposes an accessible modal dialog named by its title', () => {
        render(
            <I18nProvider><Modal title="Settings" onClose={vi.fn()}>
                Modal body
            </Modal></I18nProvider>
        );

        const dialog = screen.getByRole('dialog', { name: 'Settings' });
        expect(dialog).toHaveAttribute('aria-modal', 'true');
        expect(dialog).toContainElement(screen.getByText('Modal body'));
    });

    it('names the dialog from a string header when there is no title', () => {
        render(<I18nProvider><Modal header="Navigation">Modal body</Modal></I18nProvider>);

        expect(screen.getByRole('dialog', { name: 'Navigation' })).toBeInTheDocument();
    });

    it('does not reference a missing label without title or string header', () => {
        render(<I18nProvider><Modal header={<span>custom</span>}>Modal body</Modal></I18nProvider>);

        expect(screen.getByRole('dialog')).not.toHaveAttribute('aria-labelledby');
    });

    it('is not aria-modal while stacked behind another modal', () => {
        render(<I18nProvider><Modal title="Behind" stackedBehind>Modal body</Modal></I18nProvider>);

        expect(screen.getByRole('dialog', { name: 'Behind' })).not.toHaveAttribute('aria-modal');
    });
});
