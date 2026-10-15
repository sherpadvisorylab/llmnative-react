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

    it('stacks side panels in the width of the first one, each one below 10% wider than the one above', async () => {
        // jsdom has no layout: widths from the size classes of the side panels.
        const widths: Record<string, number> = { 'w-[36rem]': 576, 'w-96': 384, 'w-[64rem]': 1024 };
        const spy = vi.spyOn(HTMLElement.prototype, 'offsetWidth', 'get').mockImplementation(function (this: HTMLElement) {
            return Object.entries(widths).find(([size]) => this.classList.contains(size))?.[1] ?? 0;
        });
        const stack = (depth: number) => (
            <I18nProvider>
                <Modal title="First" position="right" size="lg" stackedBehind={depth > 1}>First body</Modal>
                {depth > 1 && <Modal title="Second" position="right" size="md" stackedBehind={depth > 2}>Second body</Modal>}
                {depth > 2 && <Modal title="Third" position="right" size="2xl">Third body</Modal>}
            </I18nProvider>
        );
        const width = (name: string) => screen.getByRole('dialog', { name }).style.width;
        const { rerender } = render(stack(1));
        // Alone, a panel has the width of its size.
        expect(width('First')).toBe('');

        rerender(stack(3));
        // On top, the width of the first one, whatever its own size; below, 10% more each.
        await waitFor(() => expect(width('Third')).toBe('576px'));
        expect(parseFloat(width('Second'))).toBeCloseTo(576 * 1.1);
        expect(parseFloat(width('First'))).toBeCloseTo(576 * 1.21);
        // No translate, scale or filter: only the width.
        expect(screen.getByRole('dialog', { name: 'First' }).style.transform).not.toContain('translateX(-');
        expect(screen.getByRole('dialog', { name: 'First' }).style.filter).toBe('');

        rerender(stack(1));
        await waitFor(() => expect(width('First')).toBe(''));
        spy.mockRestore();
    });

    it('stacked behind, a modal dims and its backdrop stays as it is, and back', () => {
        const { rerender } = render(<I18nProvider><Modal title="Panel" position="right">Modal body</Modal></I18nProvider>);
        const dialog = () => screen.getByRole('dialog', { name: 'Panel' });
        const veil = () => dialog().querySelector('[data-rf-modal-veil]') as HTMLElement;
        const backdrop = () => document.querySelector('[data-rf-modal-backdrop]') as HTMLElement;

        expect(veil().style.opacity).toBe('0');
        const before = backdrop().style.opacity;

        rerender(<I18nProvider><Modal title="Panel" position="right" stackedBehind>Modal body</Modal></I18nProvider>);
        expect(veil().style.opacity).toBe('1');
        // The backdrop does not move: the upper modal's darkens the page one more step.
        expect(backdrop()).toBeInTheDocument();
        expect(backdrop().style.opacity).toBe(before);

        rerender(<I18nProvider><Modal title="Panel" position="right">Modal body</Modal></I18nProvider>);
        expect(veil().style.opacity).toBe('0');
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
});
