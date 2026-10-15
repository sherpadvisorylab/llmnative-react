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

    it('closes with Escape', async () => {
        const onClose = vi.fn();
        render(<I18nProvider><Modal title="Esc" onClose={onClose}>Modal body</Modal></I18nProvider>);

        fireEvent.keyDown(document, { key: 'Escape' });

        await waitFor(() => expect(onClose).toHaveBeenCalledOnce());
    });

    it('closes only the top-most modal on Escape', async () => {
        const closeBottom = vi.fn();
        const closeTop = vi.fn();
        const { rerender } = render(
            <I18nProvider><Modal title="Bottom" onClose={closeBottom}>Bottom body</Modal></I18nProvider>
        );
        rerender(
            <I18nProvider>
                <Modal title="Bottom" onClose={closeBottom}>Bottom body</Modal>
                <Modal title="Top" onClose={closeTop}>Top body</Modal>
            </I18nProvider>
        );

        fireEvent.keyDown(document, { key: 'Escape' });
        await waitFor(() => expect(closeTop).toHaveBeenCalledOnce());
        expect(closeBottom).not.toHaveBeenCalled();

        rerender(<I18nProvider><Modal title="Bottom" onClose={closeBottom}>Bottom body</Modal></I18nProvider>);
        fireEvent.keyDown(document, { key: 'Escape' });
        await waitFor(() => expect(closeBottom).toHaveBeenCalledOnce());
    });

    it('ignores Escape when closeOnEscape is false', async () => {
        const onClose = vi.fn();
        render(<I18nProvider><Modal title="Sticky" onClose={onClose} closeOnEscape={false}>Modal body</Modal></I18nProvider>);

        fireEvent.keyDown(document, { key: 'Escape' });

        await new Promise((resolve) => setTimeout(resolve, 400));
        expect(onClose).not.toHaveBeenCalled();
    });

    it('does not scale or filter a stacked-behind panel', () => {
        render(<I18nProvider><Modal title="Behind" position="right" stackedBehind>Modal body</Modal></I18nProvider>);

        const dialog = screen.getByRole('dialog', { name: 'Behind' });
        expect(dialog.style.filter).toBe('');
        expect(dialog.style.transform).not.toContain('scale');
    });

    it('shifts a right panel inward with a translate offset when stacked behind', () => {
        render(<I18nProvider><Modal title="Behind" position="right" stackedBehind>Modal body</Modal></I18nProvider>);

        const dialog = screen.getByRole('dialog', { name: 'Behind' });
        expect(dialog.style.translate).toBe('-16px 0');
        expect(dialog.style.transition).toContain('translate');
    });

    it('shifts a left panel inward with a translate offset when stacked behind', () => {
        render(<I18nProvider><Modal title="Behind" position="left" stackedBehind>Modal body</Modal></I18nProvider>);

        expect(screen.getByRole('dialog', { name: 'Behind' }).style.translate).toBe('16px 0');
    });

    it('dims a stacked-behind panel with an opacity veil instead of a filter', () => {
        render(<I18nProvider><Modal title="Behind" position="right" stackedBehind>Modal body</Modal></I18nProvider>);

        const veil = screen.getByRole('dialog', { name: 'Behind' }).querySelector('[data-rf-modal-veil]') as HTMLElement;
        expect(veil).not.toBeNull();
        expect(veil.style.filter).toBe('');
        expect(veil.style.transition).toContain('opacity');
        expect(Number(veil.style.opacity)).toBeCloseTo(0.4);
    });

    it('keeps the stacked-behind backdrop mounted, dimmed and non-interactive', async () => {
        render(<I18nProvider><Modal title="Behind" position="right" stackedBehind onClose={vi.fn()}>Modal body</Modal></I18nProvider>);

        const backdrop = document.body.querySelector('[data-rf-modal-backdrop]') as HTMLElement;
        expect(backdrop).not.toBeNull();
        expect(backdrop.style.pointerEvents).toBe('none');
        await waitFor(() => expect(Number(backdrop.style.opacity)).toBeCloseTo(0.35));
    });

    it('keeps the stacked-behind cover non-interactive', () => {
        render(<I18nProvider><Modal title="Behind" position="right" stackedBehind>Modal body</Modal></I18nProvider>);

        const dialog = screen.getByRole('dialog', { name: 'Behind' });
        expect(dialog.parentElement?.style.pointerEvents).toBe('none');
    });

    it('leaves the panel untouched and the veil transparent when not stacked', () => {
        render(<I18nProvider><Modal title="Front" position="right">Modal body</Modal></I18nProvider>);

        const dialog = screen.getByRole('dialog', { name: 'Front' });
        expect(dialog.style.translate).toBe('');
        const veil = dialog.querySelector('[data-rf-modal-veil]') as HTMLElement;
        expect(Number(veil.style.opacity)).toBe(0);
    });
});
