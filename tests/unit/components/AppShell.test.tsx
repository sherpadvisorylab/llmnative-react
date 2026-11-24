import { describe, expect, it, vi } from 'vitest';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import React, { createContext, useContext } from 'react';
import { MemoryRouter } from 'react-router-dom';

vi.mock('../../../src/Theme', async (original) => ({
    ...(await original<typeof import('../../../src/Theme')>()),
    useMotionRegistry: vi.fn(() => ({})),
}));

import { AccountMenu, PageBar, PageBarProvider, PageTitle } from '../../../src/components';
import SideNav from '../../../src/components/blocks/SideNav';
import { I18nProvider } from '../../../src/I18n';
import { AuthProvider } from '../../../src/providers/auth/AuthProviderContext';
import type { AuthProviderAdapter, UserProfile } from '../../../src/providers/auth/AuthProvider';

// CR-151 — the title of the page in the bar, the account in the sidebar, the slots of the sidebar.

const wrap = (ui: React.ReactNode) => render(<MemoryRouter><I18nProvider>{ui}</I18nProvider></MemoryRouter>);

describe('PageBar and PageTitle', () => {
    it('the title and the actions of the page go into the bar, keeping the contexts of the page', async () => {
        const PageContext = createContext('none');
        const Action = () => <button type="button">{`Action of ${useContext(PageContext)}`}</button>;
        const { container } = wrap(
            <PageBarProvider>
                <header><PageBar fallback={<span>BREADCRUMBS</span>} /></header>
                <main>
                    <PageContext.Provider value="the page">
                        <PageTitle title="Pratiche" parent={{ label: 'Home', to: '/' }} actions={<Action />} />
                        <p>content</p>
                    </PageContext.Provider>
                </main>
            </PageBarProvider>,
        );
        await waitFor(() => expect(container.querySelector('header h1')?.textContent).toBe('Pratiche'));
        expect(container.querySelector('main h1')).toBeNull();
        expect(screen.getByRole('button', { name: 'Action of the page' }).closest('header')).not.toBeNull();
        expect(screen.getByRole('link', { name: 'Home' })).toBeInTheDocument();
        expect(screen.queryByText('BREADCRUMBS')).toBeNull();
    });

    it('without a title the bar shows its fallback; without a provider the title stays in place', async () => {
        wrap(<PageBarProvider><header><PageBar fallback={<span>BREADCRUMBS</span>} /></header></PageBarProvider>);
        expect(screen.getByText('BREADCRUMBS')).toBeInTheDocument();
        const { container } = wrap(<main><PageTitle title="Alone" actions={<button type="button">Go</button>} /></main>);
        expect(container.querySelector('main h1')?.textContent).toBe('Alone');
    });
});

describe('AccountMenu', () => {
    const adapter = (user: UserProfile | null): AuthProviderAdapter => ({
        getUser: vi.fn(() => user),
        signIn: vi.fn(async () => user),
        signOut: vi.fn(async () => undefined),
        onAuthChange: vi.fn(() => () => undefined),
        isConfigured: vi.fn(() => true),
        isAuthenticated: vi.fn(() => !!user),
    });

    it('the avatar, the name and its line; the menu with the entries of the app and Sign out', async () => {
        const auth = adapter({ uid: 'u1', displayName: 'Ada Lovelace', email: 'ada@x.it' });
        const onProfile = vi.fn();
        wrap(
            <AuthProvider registry={{ mock: auth }} defaultKey="mock">
                <AccountMenu description="Admin" items={[{ id: 'p', label: 'Profile', icon: 'user', onClick: onProfile }]} />
            </AuthProvider>,
        );
        expect(screen.getByText('Ada Lovelace')).toBeInTheDocument();
        expect(screen.getByText('Admin')).toBeInTheDocument();
        fireEvent.click(screen.getByRole('button', { name: 'Ada Lovelace' }));
        fireEvent.click(screen.getByRole('menuitem', { name: /Profile/ }));
        expect(onProfile).toHaveBeenCalled();
        fireEvent.click(screen.getByRole('button', { name: 'Ada Lovelace' }));
        await act(async () => { fireEvent.click(screen.getByRole('menuitem', { name: /sign out/i })); });
        expect(auth.signOut).toHaveBeenCalled();
    });

    it('compact: only the avatar; without a user, nothing', () => {
        const { container } = wrap(
            <AuthProvider registry={{ mock: adapter({ uid: 'u1', displayName: 'Ada' }) }} defaultKey="mock">
                <AccountMenu compact />
            </AuthProvider>,
        );
        expect(screen.queryByText('Ada')).toBeNull();
        expect(screen.getByRole('button', { name: 'Ada' })).toBeInTheDocument();
        container.remove();
        const vuoto = wrap(<AuthProvider registry={{ mock: adapter(null) }} defaultKey="mock"><AccountMenu /></AuthProvider>);
        expect(vuoto.container.querySelector('button')).toBeNull();
    });
});

describe('SideNav slots', () => {
    it('header and footer as functions know the state, the collapse button in the header', () => {
        wrap(
            <SideNav
                items={[{ path: '/a', title: 'Alpha', icon: 'home' }]}
                collapseButtonPlacement="header"
                header={({ expanded }) => <span>{expanded ? 'BRAND WIDE' : 'B'}</span>}
                footer={({ collapsed }) => <span>{collapsed ? 'avatar' : 'account wide'}</span>}
            />,
        );
        expect(screen.getByText('BRAND WIDE')).toBeInTheDocument();
        expect(screen.getByText('account wide')).toBeInTheDocument();
        const toggle = screen.getByRole('button', { name: /collapse|comprimi|riduci/i });
        expect(toggle.closest('div')?.textContent).toContain('BRAND WIDE');
        fireEvent.click(toggle);
        expect(screen.getByText('B')).toBeInTheDocument();
        expect(screen.getByText('avatar')).toBeInTheDocument();
    });
});
