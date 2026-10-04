import type { MenuConfig } from '@llmnative/react';
import HomePage from '../pages/home/HomePage';

export const menu: MenuConfig = {
    main: [
        { path: '/', title: 'Home', icon: 'home', page: HomePage, end: true },
    ],
};
