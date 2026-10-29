import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { I18nProvider } from '../../../src/I18n';
import { AsyncDropdown, Dropdown, DropdownItem } from '../../../src/components/blocks/Dropdown';

const renderWithI18n = (ui: React.ReactElement) => render(ui, { wrapper: I18nProvider });

describe('Dropdown', () => {
    it('renders toggle badge through the shared overlay Badge component', () => {
        render(
            <Dropdown trigger="Actions" badge={{ content: '3', variant: 'danger' }}>
                <DropdownItem>Edit</DropdownItem>
            </Dropdown>
        );

        const badge = screen.getByText('3');

        expect(badge).toHaveClass('badge');
        expect(badge).toHaveClass('badge-overlay');
        expect(badge).toHaveClass('badge-danger');
    });

    it('can render as an always-visible static menu without a toggle button', () => {
        render(
            <Dropdown staticOpen header="Quick actions">
                <DropdownItem>Create</DropdownItem>
            </Dropdown>
        );

        expect(screen.queryByRole('button')).not.toBeInTheDocument();
        expect(screen.getByRole('menu')).toBeVisible();
        expect(screen.getByText('Create')).toBeVisible();
    });

    it('does not force a horizontal position by default', () => {
        render(
            <Dropdown trigger="Actions" defaultOpen>
                <DropdownItem onClick={() => undefined}>Edit</DropdownItem>
            </Dropdown>
        );

        const menu = screen.getByRole('menu');

        expect(menu).not.toHaveClass('left-0');
        expect(menu).not.toHaveClass('right-0');
    });

    it('closes after a DropdownItem selection by default', () => {
        render(
            <Dropdown trigger="Actions" defaultOpen>
                <DropdownItem onClick={() => undefined}>Edit</DropdownItem>
            </Dropdown>
        );

        const menu = screen.getByRole('menu');

        fireEvent.click(screen.getByText('Edit'));

        expect(menu).not.toBeVisible();
        expect(menu).toHaveAttribute('aria-hidden', 'true');
    });

    it('can keep the menu open after a selection when requested', () => {
        render(
            <Dropdown trigger="Actions" defaultOpen closeOnSelect={false}>
                <DropdownItem onClick={() => undefined}>Edit</DropdownItem>
            </Dropdown>
        );

        const menu = screen.getByRole('menu');
        fireEvent.click(screen.getByText('Edit'));

        expect(menu).toBeVisible();
        expect(menu).toHaveAttribute('aria-hidden', 'false');
    });

    it('closes after an outside click', () => {
        render(
            <div>
                <Dropdown trigger="Actions" defaultOpen>
                    <DropdownItem>Edit</DropdownItem>
                </Dropdown>
                <button variant="button">Outside</button>
            </div>
        );

        const menu = screen.getByRole('menu');

        fireEvent.pointerDown(screen.getByText('Outside'));

        expect(menu).not.toBeVisible();
        expect(menu).toHaveAttribute('aria-hidden', 'true');
    });

    describe('with placement auto', () => {
        // A trigger `top` px from the top of an 800px viewport, a menu 900px tall.
        const openAt = (top: number) => {
            Object.defineProperty(window, 'innerHeight', { configurable: true, value: 800 });
            const rect = { top, bottom: top + 36, left: 900, right: 936, width: 36, height: 36, x: 900, y: top, toJSON: () => ({}) };
            const spy = vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockReturnValue(rect as DOMRect);
            const height = vi.spyOn(HTMLElement.prototype, 'scrollHeight', 'get').mockReturnValue(900);
            render(
                <Dropdown trigger="Notifications" placement="auto" position="end" defaultOpen>
                    <DropdownItem>Item</DropdownItem>
                </Dropdown>
            );
            spy.mockRestore();
            height.mockRestore();
            return screen.getByRole('menu');
        };

        it('stays below a trigger at the top of the page when it does not fit, scrolling there', () => {
            const menu = openAt(10);
            expect(menu.style.top).toBe('50px');
            expect(menu.style.bottom).toBe('');
            expect(menu.style.maxHeight).toBe('746px');
        });

        it('opens above when it does not fit below and there is more room above', () => {
            const menu = openAt(700);
            expect(menu.style.bottom).toBe('104px');
            expect(menu.style.top).toBe('');
        });
    });
});

describe('AsyncDropdown', () => {
    const items = [
        { id: 'alpha', label: 'Alpha' },
        { id: 'beta', label: 'Beta' },
    ];

    it('loads results on open and sends the search query to its loader', async () => {
        const loadItems = vi.fn(async (query: string) => items.filter((item) => item.label.toLowerCase().includes(query.toLowerCase())));

        renderWithI18n(
            <AsyncDropdown
                trigger="Switch"
                loadItems={loadItems}
                getItemId={(item) => item.id}
                renderItem={(item) => item.label}
                onSelect={() => undefined}
                debounceMs={0}
            />
        );

        fireEvent.click(screen.getByRole('button', { name: 'Switch' }));
        await waitFor(() => expect(screen.getByText('Alpha')).toBeVisible());
        expect(loadItems).toHaveBeenCalledWith('', expect.any(AbortSignal));

        fireEvent.change(screen.getByRole('textbox'), { target: { value: 'beta' } });
        await waitFor(() => expect(screen.getByText('Beta')).toBeVisible());
        expect(loadItems).toHaveBeenCalledWith('beta', expect.any(AbortSignal));
    });

    it('marks the current item and closes after selection', async () => {
        const onSelect = vi.fn();
        renderWithI18n(
            <AsyncDropdown
                trigger="Switch"
                defaultOpen
                selectedId="beta"
                loadItems={async () => items}
                getItemId={(item) => item.id}
                renderItem={(item) => item.label}
                onSelect={onSelect}
                debounceMs={0}
            />
        );

        const beta = await screen.findByText('Beta');
        expect(beta.closest('button')).toHaveClass('bg-accent');
        fireEvent.click(beta);

        await waitFor(() => expect(onSelect).toHaveBeenCalledWith(items[1]));
        await waitFor(() => expect(screen.getByRole('menu', { hidden: true })).toHaveAttribute('aria-hidden', 'true'));
    });

    it('keeps the menu open when selection is declined by the consumer', async () => {
        renderWithI18n(
            <AsyncDropdown
                trigger="Switch"
                defaultOpen
                loadItems={async () => items}
                getItemId={(item) => item.id}
                renderItem={(item) => item.label}
                onSelect={() => false}
                debounceMs={0}
            />
        );

        fireEvent.click(await screen.findByText('Alpha'));

        await waitFor(() => expect(screen.getByRole('menu', { hidden: true })).toHaveAttribute('aria-hidden', 'false'));
    });

    it('renders the loader error state', async () => {
        renderWithI18n(
            <AsyncDropdown
                trigger="Switch"
                defaultOpen
                loadItems={async () => { throw new Error('Lookup failed'); }}
                getItemId={() => 'unused'}
                renderItem={() => null}
                onSelect={() => undefined}
                debounceMs={0}
            />
        );

        expect(await screen.findByText('Lookup failed')).toBeVisible();
    });

    it('gives an item secondary actions that do not select it and keep the menu open (CR-107)', () => {
        const opened: string[] = [];
        const archived: string[] = [];
        render(
            <Dropdown trigger="History" defaultOpen>
                <DropdownItem onClick={() => opened.push('chat')} actions={[{ icon: 'archive', label: 'Archive', onClick: () => archived.push('chat') }]}>Chat</DropdownItem>
            </Dropdown>
        );

        fireEvent.click(screen.getByRole('button', { name: 'Archive' }));
        expect(archived).toEqual(['chat']);
        expect(opened).toEqual([]);
        expect(screen.getByText('Chat')).toBeVisible();
        fireEvent.click(screen.getByText('Chat'));
        expect(opened).toEqual(['chat']);
    });

    it('closes the menu after an action that asks it', async () => {
        render(
            <Dropdown trigger="History" defaultOpen>
                <DropdownItem onClick={() => undefined} actions={[{ icon: 'archive', label: 'Archive', onClick: () => undefined, closeOnClick: true }]}>Chat</DropdownItem>
            </Dropdown>
        );

        const menu = screen.getByRole('menu');
        fireEvent.click(screen.getByRole('button', { name: 'Archive' }));
        await waitFor(() => expect(menu).toHaveAttribute('aria-hidden', 'true'));
    });
});
