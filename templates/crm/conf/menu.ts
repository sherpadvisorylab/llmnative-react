import type { MenuConfig } from '@ash/react';
import Default from '../layouts/Default';
import HomePage from '../pages/home/HomePage';
import ContactsPage from '../pages/contacts/ContactsPage';
import CompaniesPage from '../pages/companies/CompaniesPage';
import DealsPage from '../pages/deals/DealsPage';

export const menu: MenuConfig = {
    main: [
        { path: '/',          title: 'Dashboard', icon: 'layout-dashboard', page: HomePage,      layout: Default, end: true },
        { path: '/contacts',  title: 'Contacts',  icon: 'users',            page: ContactsPage,  layout: Default, group: 'Sales' },
        { path: '/companies', title: 'Companies', icon: 'building-2',       page: CompaniesPage, layout: Default, group: 'Sales' },
        { path: '/deals',     title: 'Deals',     icon: 'handshake',        page: DealsPage,     layout: Default, group: 'Sales' },
    ],
};
