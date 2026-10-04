import type { MenuConfig } from '@llmnative/react';
import HomePage from '../pages/home/HomePage';
import ProductsPage from '../pages/products/ProductsPage';
import CategoriesPage from '../pages/categories/CategoriesPage';

export const menu: MenuConfig = {
    main: [
        { path: '/',           title: 'Overview',   icon: 'layout-dashboard', page: HomePage, end: true },
        { path: '/products',   title: 'Products',   icon: 'package',          page: ProductsPage, group: 'Catalog' },
        { path: '/categories', title: 'Categories', icon: 'tag',              page: CategoriesPage, group: 'Catalog' },
    ],
};
