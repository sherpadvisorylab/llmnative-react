import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';

vi.mock('../../../src/I18n', () => ({
    useI18n: vi.fn(() => ({})),
    I18nProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

vi.mock('../../../src/motion', () => ({
    useEnterMotion: vi.fn(() => ({})),
    useMotionState: vi.fn(() => ({})),
    usePressMotion: vi.fn(() => ({})),
}));

vi.mock('../../../src/App', () => ({
    useMenu: vi.fn(() => [
        { path: '/dashboard', title: 'Dashboard', icon: 'dashboard', children: [], active: false },
        { path: '/profile', title: 'Profile', icon: 'user', children: [], active: false },
    ]),
}));

import ListCard from '../../../src/components/blocks/ListCard';
import Menu from '../../../src/components/blocks/Menu';
import SideNav from '../../../src/components/blocks/SideNav';

describe('ListCard', () => {
    it('renders title and description', () => {
        render(
            <MemoryRouter>
                <ListCard title="Settings" description="Manage your account" />
            </MemoryRouter>
        );
        expect(screen.getByText('Settings')).toBeInTheDocument();
        expect(screen.getByText('Manage your account')).toBeInTheDocument();
    });

    it('a clickable card with actions is a button that holds them without nesting buttons', () => {
        const opened = vi.fn();
        const deleted = vi.fn();
        const { container } = render(
            <MemoryRouter>
                <ListCard title="Chat" onClick={opened} trailing={<button type="button" onClick={(event) => { event.stopPropagation(); deleted(); }}>Delete</button>} />
            </MemoryRouter>
        );
        expect(container.querySelector('button button')).toBeNull();
        const card = screen.getByRole('button', { name: /Chat/ });
        expect(card.tagName).toBe('DIV');
        fireEvent.keyDown(card, { key: 'Enter' });
        fireEvent.keyDown(card, { key: ' ' });
        expect(opened).toHaveBeenCalledTimes(2);
        fireEvent.click(screen.getByText('Delete'));
        expect(deleted).toHaveBeenCalledTimes(1);
        expect(opened).toHaveBeenCalledTimes(2);
        // Without actions it stays a real button.
        render(<MemoryRouter><ListCard title="Plain" onClick={opened} /></MemoryRouter>);
        expect(screen.getByRole('button', { name: /Plain/ }).tagName).toBe('BUTTON');
    });
});

describe('Menu', () => {
    it('renders menu items', () => {
        const { container } = render(
            <MemoryRouter>
                <Menu menuKey="main" />
            </MemoryRouter>
        );
        expect(container.querySelector('a[href="/dashboard"]')).toBeTruthy();
        expect(container.querySelector('a[href="/profile"]')).toBeTruthy();
    });
});

describe('SideNav', () => {
    it('renders nav items', () => {
        const { container } = render(
            <MemoryRouter>
                <SideNav
                    items={[
                        { path: '/', title: 'Home', icon: 'home' },
                        { path: '/about', title: 'About', icon: 'info' },
                    ]}
                />
            </MemoryRouter>
        );
        expect(container.querySelector('a[href="/"]')).toBeTruthy();
        expect(container.querySelector('a[href="/about"]')).toBeTruthy();
    });
});
