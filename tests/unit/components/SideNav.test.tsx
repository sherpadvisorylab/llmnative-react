import { describe, expect, it } from 'vitest';
import { fireEvent, render, screen, within } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import SideNav from '../../../src/components/blocks/SideNav';
import type { SideNavItemDef } from '../../../src/components/blocks/SideNav';
import { I18nProvider } from '../../../src/I18n';
import { ThemeProvider } from '../../../src/Theme';
import { components as defaultComponents, motion as defaultMotion, preset as defaultPreset } from '../../../themes/default';

const MAIN_ITEMS: SideNavItemDef[] = [
    { path: '/', title: 'Home', end: true },
    { path: '/reports', title: 'Reports' },
];

const BOTTOM_ITEMS: SideNavItemDef[] = [
    { path: '/settings', title: 'Settings', icon: 'settings', badge: '3' },
];

function renderSideNav(
    props: Partial<React.ComponentProps<typeof SideNav>> = {},
    route = '/settings',
) {
    return render(
        <ThemeProvider
            config={{
                theme: 'test',
                themes: { test: { preset: defaultPreset, motion: defaultMotion, components: defaultComponents } },
                themeOverride: { SideNav: { bottomNavClassName: 'test-bottom-nav' } },
            }}
        >
            <I18nProvider>
                <MemoryRouter initialEntries={[route]}>
                    <SideNav items={MAIN_ITEMS} bottomItems={BOTTOM_ITEMS} {...props} />
                </MemoryRouter>
            </I18nProvider>
        </ThemeProvider>
    );
}

describe('SideNav bottomItems', () => {
    it('renders bottom items outside the main scrollable nav, above the footer', () => {
        const { container } = renderSideNav({ footer: <span>Footer content</span> });

        const nav = screen.getByRole('navigation');
        expect(within(nav).queryByText('Settings')).toBeNull();

        const bottom = container.querySelector('.test-bottom-nav');
        expect(bottom).not.toBeNull();
        expect(within(bottom as HTMLElement).getByText('Settings')).toBeInTheDocument();

        const footer = screen.getByText('Footer content');
        expect(
            (bottom as HTMLElement).compareDocumentPosition(footer) & Node.DOCUMENT_POSITION_FOLLOWING,
        ).toBeTruthy();
    });

    it('marks the bottom item active on the current route', () => {
        renderSideNav();

        const active = screen.getByRole('link', { name: /Settings/ });
        expect(active).toHaveClass('text-primary');
        expect(active).not.toHaveClass('text-muted-foreground');
    });

    it('respects the `end` flag like the main items', () => {
        renderSideNav(
            { bottomItems: [{ path: '/settings', title: 'Settings', end: true }] },
            '/settings/profile',
        );

        const link = screen.getByRole('link', { name: /Settings/ });
        expect(link).not.toHaveClass('text-primary');
    });

    it('collapses to icon-only with a dot badge, then expands on hover', () => {
        const { container } = renderSideNav({ defaultCollapsed: true });

        const link = screen.getByRole('link', { name: /Settings/ });
        expect(link).toHaveAttribute('title', 'Settings');
        expect(container.querySelectorAll('[class*="h-[7px]"]').length).toBeGreaterThan(0);

        fireEvent.mouseEnter(container.querySelector('aside') as HTMLElement);

        expect(screen.getByRole('link', { name: /Settings/ })).not.toHaveAttribute('title');
    });

    it('renders bottom items after the main items and separated in embedded mode', () => {
        const { container } = renderSideNav({ embedded: true }, '/reports');

        const links = screen.getAllByRole('link');
        const titles = links.map((link) => link.textContent ?? '');
        const reportsIndex = titles.findIndex((t) => t.includes('Reports'));
        const settingsIndex = titles.findIndex((t) => t.includes('Settings'));
        expect(settingsIndex).toBeGreaterThan(reportsIndex);

        const nav = screen.getByRole('navigation');
        expect(within(nav).getByText('Settings')).toBeInTheDocument();
        expect(container.querySelector('.test-bottom-nav')).not.toBeNull();
    });

    it('supports groups and auto-opens children on the active child route', () => {
        renderSideNav(
            {
                bottomItems: [
                    {
                        path: '/account',
                        title: 'Account',
                        group: 'Settings',
                        children: [{ path: '/account/profile', title: 'Profile' }],
                    },
                ],
            },
            '/account/profile',
        );

        expect(screen.getByText('Settings')).toBeInTheDocument();
        expect(screen.getByRole('link', { name: 'Profile' })).toBeInTheDocument();
        expect(screen.getByRole('link', { name: 'Account' })).toHaveClass('text-primary');
    });

    it('renders the component when only bottom items are provided', () => {
        render(
            <I18nProvider>
                <MemoryRouter initialEntries={['/settings']}>
                    <SideNav bottomItems={BOTTOM_ITEMS} />
                </MemoryRouter>
            </I18nProvider>
        );

        expect(screen.getByRole('link', { name: /Settings/ })).toBeInTheDocument();
    });
});
