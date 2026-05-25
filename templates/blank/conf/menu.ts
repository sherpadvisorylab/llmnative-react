import type { MenuConfig } from '@llmnative/react';
import HomePage from '../pages/home/HomePage';
import Default from '../layouts/Default';

export const menu: MenuConfig = {
    main: [
        { path: '/', title: 'Home', icon: 'home', page: HomePage, layout: Default, end: true },
    ],
};
