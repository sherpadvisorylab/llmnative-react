import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
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
