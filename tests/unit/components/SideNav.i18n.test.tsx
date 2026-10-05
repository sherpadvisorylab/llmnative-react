import { describe, expect, it } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import SideNav from '../../../src/components/blocks/SideNav';
import { I18nProvider } from '../../../src/I18n';
import { it as itDict } from '../../../src/conf/i18n';

function renderSideNav(locale?: 'it') {
    return render(
        <I18nProvider config={locale ? { locale, translations: { it: itDict } } : undefined}>
            <MemoryRouter initialEntries={['/reports']}>
                <SideNav items={[{ path: '/reports', title: 'Reports', icon: 'chart', children: [{ path: '/reports/daily', title: 'Daily' }] }]} />
            </MemoryRouter>
        </I18nProvider>
    );
}

describe('SideNav i18n', () => {
    it('names its icon-only buttons in English by default', () => {
        renderSideNav();

        expect(screen.getByRole('button', { name: 'Collapse sidebar' })).toHaveAttribute('title', 'Collapse sidebar');
        expect(screen.getByRole('button', { name: /^(Expand|Collapse)$/ })).toBeInTheDocument();
    });

    it('translates the sidebar and group toggles with the active locale', () => {
        renderSideNav('it');

        const sidebarToggle = screen.getByRole('button', { name: 'Comprimi barra laterale' });
        expect(sidebarToggle).toHaveAttribute('title', 'Comprimi barra laterale');
        expect(screen.getByRole('button', { name: /^(Espandi|Comprimi)$/ })).toBeInTheDocument();

        fireEvent.click(sidebarToggle);
        expect(screen.getByRole('button', { name: 'Espandi barra laterale' })).toBeInTheDocument();
    });
});
