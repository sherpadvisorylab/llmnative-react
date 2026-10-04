import type { MenuConfig } from '@llmnative/react';
import HomePage from '../pages/home/HomePage';
import ContactsPage from '../pages/contacts/ContactsPage';
import CompaniesPage from '../pages/companies/CompaniesPage';
import DealsPage from '../pages/deals/DealsPage';

export const menu: MenuConfig = {
    main: [
        { path: '/',          title: 'Dashboard', icon: 'layout-dashboard', page: HomePage,      end: true },
        { path: '/contacts',  title: 'Contacts',  icon: 'users',            page: ContactsPage,  group: 'Sales' },
        { path: '/companies', title: 'Companies', icon: 'building-2',       page: CompaniesPage, group: 'Sales' },
        { path: '/deals',     title: 'Deals',     icon: 'handshake',        page: DealsPage,     group: 'Sales' },
    ],
};
