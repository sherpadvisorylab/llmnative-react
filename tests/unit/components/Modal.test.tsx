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
});
