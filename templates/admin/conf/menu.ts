import type { MenuConfig } from 'react-firestrap';
import Default from '../layouts/Default';
import HomePage from '../pages/home/HomePage';
import UsersPage from '../pages/users/UsersPage';
import RolesPage from '../pages/roles/RolesPage';
import SettingsPage from '../pages/settings/SettingsPage';

export const menu: MenuConfig = {
    main: [
        { path: '/',         title: 'Overview',  icon: 'layout-dashboard', page: HomePage,    layout: Default, end: true },
        { path: '/users',    title: 'Users',     icon: 'users',            page: UsersPage,   layout: Default, group: 'Management' },
        { path: '/roles',    title: 'Roles',     icon: 'shield',           page: RolesPage,   layout: Default, group: 'Management' },
        { path: '/settings', title: 'Settings',  icon: 'settings',         page: SettingsPage,layout: Default, group: 'System' },
    ],
};
