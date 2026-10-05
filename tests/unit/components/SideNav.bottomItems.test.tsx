import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import SideNav from '../../../src/components/blocks/SideNav';
import { I18nProvider } from '../../../src/I18n';

const items = [{ path: '/dashboard', title: 'Dashboard', icon: 'home' }];
const bottomItems = [{ path: '/settings', title: 'Settings', icon: 'settings' }];

function renderSideNav(props: Partial<React.ComponentProps<typeof SideNav>> = {}, path = '/settings') {
    return render(
        <I18nProvider>
            <MemoryRouter initialEntries={[path]}>
                <SideNav items={items} bottomItems={bottomItems} {...props} />
            </MemoryRouter>
        </I18nProvider>
    );
}

describe('SideNav bottomItems', () => {
    it('pins bottom items outside the scrolling list', () => {
        renderSideNav();

        const nav = screen.getByRole('navigation');
        const settings = screen.getByRole('link', { name: 'Settings' });
        expect(nav).toContainElement(screen.getByRole('link', { name: 'Dashboard' }));
        expect(nav).not.toContainElement(settings);
        expect(settings).toHaveAttribute('href', '/settings');
    });

    it('marks a bottom item active on its route', () => {
        renderSideNav();

        expect(screen.getByRole('link', { name: 'Settings' })).toHaveAttribute('aria-current', 'page');
        expect(screen.getByRole('link', { name: 'Dashboard' })).not.toHaveAttribute('aria-current');
    });

    it('keeps bottom items reachable when collapsed', () => {
        renderSideNav({ defaultCollapsed: true });

        expect(screen.getByRole('link', { name: 'Settings' })).toHaveAttribute('title', 'Settings');
    });

    it('lists bottom items after the main items in embedded mode', () => {
        renderSideNav({ embedded: true });

        const links = screen.getAllByRole('link').map(link => link.textContent);
        expect(links).toEqual(['Dashboard', 'Settings']);
    });

    it('renders with bottom items only', () => {
        render(
            <I18nProvider>
                <MemoryRouter>
                    <SideNav bottomItems={bottomItems} />
                </MemoryRouter>
            </I18nProvider>
        );

        expect(screen.getByRole('link', { name: 'Settings' })).toBeInTheDocument();
    });
});
