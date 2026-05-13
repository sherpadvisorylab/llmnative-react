import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import Modal from '../../../src/components/ui/Modal';

describe('Modal', () => {
    it('closes on backdrop click by default', () => {
        const onClose = vi.fn();

        render(
            <Modal title="Playground" onClose={onClose}>
                Modal body
            </Modal>
        );

        fireEvent.click(document.body.querySelector('.modal-backdrop') as Element);

        expect(onClose).toHaveBeenCalledOnce();
    });

    it('can keep the modal open when backdrop close is disabled', () => {
        const onClose = vi.fn();

        render(
            <Modal title="Locked" onClose={onClose} closeOnBackdrop={false}>
                Modal body
            </Modal>
        );

        fireEvent.click(document.body.querySelector('.modal-backdrop') as Element);

        expect(onClose).not.toHaveBeenCalled();
        expect(screen.getByText('Modal body')).toBeInTheDocument();
    });
});
