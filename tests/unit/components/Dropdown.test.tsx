import { describe, expect, it } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { Dropdown, DropdownItem } from '../../../src/components/blocks/Dropdown';

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
                <DropdownItem>Edit</DropdownItem>
            </Dropdown>
        );

        const menu = screen.getByRole('menu');

        expect(menu).not.toHaveClass('left-0');
        expect(menu).not.toHaveClass('right-0');
    });

    it('keeps the menu open after an internal click', () => {
        render(
            <Dropdown trigger="Actions" defaultOpen>
                <DropdownItem>Edit</DropdownItem>
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
});
