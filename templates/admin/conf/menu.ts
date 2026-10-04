import type { MenuConfig } from '@llmnative/react';
import HomePage from '../pages/home/HomePage';
import UsersPage from '../pages/users/UsersPage';
import RolesPage from '../pages/roles/RolesPage';
import SettingsPage from '../pages/settings/SettingsPage';

export const menu: MenuConfig = {
    main: [
        { path: '/',         title: 'Overview',  icon: 'layout-dashboard', page: HomePage,    end: true },
        { path: '/users',    title: 'Users',     icon: 'users',            page: UsersPage,   group: 'Management' },
        { path: '/roles',    title: 'Roles',     icon: 'shield',           page: RolesPage,   group: 'Management' },
        { path: '/settings', title: 'Settings',  icon: 'settings',         page: SettingsPage,group: 'System' },
    ],
};
