import type { MenuConfig } from 'react-firestrap';
import Default from '../layouts/Default';
import HomePage from '../pages/home/HomePage';
import ProductsPage from '../pages/products/ProductsPage';
import CategoriesPage from '../pages/categories/CategoriesPage';

export const menu: MenuConfig = {
    main: [
        { path: '/',           title: 'Overview',   icon: 'layout-dashboard', page: HomePage,      layout: Default, end: true },
        { path: '/products',   title: 'Products',   icon: 'package',          page: ProductsPage,  layout: Default, group: 'Catalog' },
        { path: '/categories', title: 'Categories', icon: 'tag',              page: CategoriesPage,layout: Default, group: 'Catalog' },
    ],
};
