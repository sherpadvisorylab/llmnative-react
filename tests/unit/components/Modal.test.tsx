import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import Modal, { ModalOk, ModalYesNo } from '../../../src/components/ui/Modal';
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
});

describe('Modal accessibility', () => {
    it('exposes the dialog role and takes its accessible name from the title', () => {
        render(
            <I18nProvider><Modal title="Playground" onClose={() => {}}>
                Modal body
            </Modal></I18nProvider>
        );

        expect(screen.getByRole('dialog', { name: 'Playground' })).toBeInTheDocument();
    });

    it('marks the active dialog as aria-modal', () => {
        render(
            <I18nProvider><Modal title="Active" onClose={() => {}}>
                Modal body
            </Modal></I18nProvider>
        );

        expect(screen.getByRole('dialog')).toHaveAttribute('aria-modal', 'true');
    });

    it('omits aria-modal on a dialog stacked behind another', () => {
        render(
            <I18nProvider><Modal title="Behind" stackedBehind onClose={() => {}}>
                Modal body
            </Modal></I18nProvider>
        );

        expect(screen.getByRole('dialog')).not.toHaveAttribute('aria-modal');
    });

    it('uses a string header as the accessible name when there is no title', () => {
        render(
            <I18nProvider><Modal header="Header title" onClose={() => {}}>
                Modal body
            </Modal></I18nProvider>
        );

        expect(screen.getByRole('dialog', { name: 'Header title' })).toBeInTheDocument();
    });

    it('has no aria-labelledby when there is neither a title nor a string header', () => {
        render(
            <I18nProvider><Modal onClose={() => {}}>
                Modal body
            </Modal></I18nProvider>
        );

        expect(screen.getByRole('dialog')).not.toHaveAttribute('aria-labelledby');
    });

    it('inherits the dialog semantics in ModalYesNo', () => {
        render(
            <I18nProvider><ModalYesNo title="Confirm?" onClose={() => {}}>
                Modal body
            </ModalYesNo></I18nProvider>
        );

        expect(screen.getByRole('dialog', { name: 'Confirm?' })).toHaveAttribute('aria-modal', 'true');
    });

    it('inherits the dialog semantics in ModalOk', () => {
        render(
            <I18nProvider><ModalOk title="Done" onClose={() => {}}>
                Modal body
            </ModalOk></I18nProvider>
        );

        expect(screen.getByRole('dialog', { name: 'Done' })).toBeInTheDocument();
    });
});
