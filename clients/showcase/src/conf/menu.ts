import React from 'react';
import { Navigate } from 'react-router-dom';

import Home from '../pages/Home';
import { markdownDocs, providerMarkdownDocs } from '../docs/markdownDocs';
import MarkdownDocPage from '../pages/docs/MarkdownDocPage';
import Stub from '../pages/docs/Stub';
import ExamplesOverview from '../pages/examples/ExamplesOverview';

import AlertPage from '../pages/components/AlertPage';
import AssistantAIPage from '../pages/components/AssistantAIPage';
import AuthPage from '../pages/components/AuthPage';
import BadgePage from '../pages/components/BadgePage';
import BrandPage from '../pages/components/BrandPage';
import BreadcrumbsPage from '../pages/components/BreadcrumbsPage';
import ButtonsIndexPage from '../pages/components/buttons';
import ActionButtonPage from '../pages/components/buttons/ActionButtonPage';
import LoadingButtonPage from '../pages/components/buttons/LoadingButtonPage';
import NavigationButtonsPage from '../pages/components/buttons/NavigationButtonsPage';
import CardPage from '../pages/components/CardPage';
import CarouselPage from '../pages/components/CarouselPage';
import CheckboxPage from '../pages/components/CheckboxPage';
import CodePage from '../pages/components/CodePage';
import LoaderPage from '../pages/components/LoaderPage';
import DropdownPage from '../pages/components/DropdownPage';
import GalleryPage from '../pages/components/GalleryPage';
import GridSystemPage from '../pages/components/GridSystemPage';
import IconPage from '../pages/components/IconPage';
import ImagePage from '../pages/components/ImagePage';
import ImageAvatarPage from '../pages/components/ImageAvatarPage';
import ImageUrlPage from '../pages/components/ImageUrlPage';
import LayoutBuilderPage from '../pages/components/LayoutBuilderPage';
import ListGroupPage from '../pages/components/ListGroupPage';
import MenuPage from '../pages/components/MenuPage';
import ModalPage from '../pages/components/ModalPage';
import MotionPage from '../pages/components/MotionPage';
import NotificationsPage from '../pages/components/NotificationsPage';
import PaginationPage from '../pages/components/PaginationPage';
import PercentagePage from '../pages/components/PercentagePage';
import PromptPage from '../pages/components/PromptPage';
import RepeatPage from '../pages/components/RepeatPage';
import SearchPage from '../pages/components/SearchPage';
import SwitchPage from '../pages/components/SwitchPage';
import TabPage from '../pages/components/TabPage';
import TabDynamicPage from '../pages/components/TabDynamicPage';
import TablePage from '../pages/components/TablePage';
import TextAreaPage from '../pages/components/TextAreaPage';
import InputPage from '../pages/components/InputPage';
import SelectPage from '../pages/components/SelectPage';
import AutocompletePage from '../pages/components/AutocompletePage';
import ChecklistPage from '../pages/components/ChecklistPage';
import UploadPage from '../pages/components/UploadPage';
import FormPage from '../pages/components/FormPage';
import GridPage from '../pages/components/GridPage';
import GridArrayPage from '../pages/components/GridArrayPage';
import GridDbPage from '../pages/components/GridDbPage';
import GridPreviewPage from '../pages/components/GridPreviewPage';
import MarkdownReaderPage from '../pages/components/MarkdownReaderPage';

const s = (title: string, description: string): React.ComponentType =>
    () => React.createElement(Stub, { title, description });

const docsRoutes = markdownDocs.map((doc) => ({
    path: doc.meta.path,
    title: doc.meta.title,
    page: () => React.createElement(MarkdownDocPage, { doc }),
    group: doc.meta.group,
    end: doc.meta.path === '/docs',
}));

const providerRoutes = providerMarkdownDocs.map((doc) => ({
    path: doc.meta.path,
    title: doc.meta.title,
    page: () => React.createElement(MarkdownDocPage, { doc }),
    group: doc.meta.group,
    end: doc.meta.path === '/providers',
}));

export const menu = {
    default: [
        { path: '/', page: Home },
    ],

    _nav: [
        { path: '/docs/providers', page: () => React.createElement(Navigate, { to: '/providers', replace: true }) },
        { path: '/components', page: () => React.createElement(Navigate, { to: '/components/alert', replace: true }) },
        { path: '/components/button', page: () => React.createElement(Navigate, { to: '/components/buttons', replace: true }) },
        { path: '/examples', page: () => React.createElement(Navigate, { to: '/examples/crud', replace: true }) },
    ],

    _hidden: [
        { path: '/components/grid/preview', page: GridPreviewPage },
    ],

    docs: docsRoutes,

    components: [
        { path: '/components/alert', title: 'Alert', page: AlertPage, group: 'UI Primitives' },
        { path: '/components/badge', title: 'Badge', page: BadgePage, group: 'UI Primitives' },
        {
            path: '/components/buttons',
            title: 'Buttons',
            page: ButtonsIndexPage,
            group: 'UI Primitives',
            children: [
                { path: '/components/buttons/action', title: 'ActionButton', page: ActionButtonPage },
                { path: '/components/buttons/loading', title: 'LoadingButton', page: LoadingButtonPage },
                { path: '/components/buttons/navigation', title: 'Navigation buttons', page: NavigationButtonsPage },
            ],
        },
        { path: '/components/card', title: 'Card', page: CardPage, group: 'UI Primitives' },
        { path: '/components/code', title: 'Code', page: CodePage, group: 'UI Primitives' },
        { path: '/components/dropdown', title: 'Dropdown', page: DropdownPage, group: 'UI Primitives' },
        { path: '/components/gallery', title: 'Gallery', page: GalleryPage, group: 'UI Primitives' },
        { path: '/components/grid-system', title: 'GridSystem', page: GridSystemPage, group: 'UI Primitives' },
        { path: '/components/icon', title: 'Icon', page: IconPage, group: 'UI Primitives' },
        { path: '/components/image', title: 'Image', page: ImagePage, group: 'UI Primitives' },
        { path: '/components/image-avatar', title: 'ImageAvatar', page: ImageAvatarPage, group: 'UI Primitives' },
        { path: '/components/loader', title: 'Loader', page: LoaderPage, group: 'UI Primitives' },
        { path: '/components/modal', title: 'Modal', page: ModalPage, group: 'UI Primitives' },
        { path: '/components/motion', title: 'Motion', page: MotionPage, group: 'Foundation' },
        { path: '/components/pagination', title: 'Pagination', page: PaginationPage, group: 'UI Primitives' },
        { path: '/components/percentage', title: 'Percentage', page: PercentagePage, group: 'UI Primitives' },
        { path: '/components/tab', title: 'Tab', page: TabPage, group: 'UI Primitives' },
        { path: '/components/tab-dynamic', title: 'TabDynamic', page: TabDynamicPage, group: 'Widgets' },
        { path: '/components/table', title: 'Table', page: TablePage, group: 'UI Primitives' },
        { path: '/components/auth', title: 'Auth', page: AuthPage, group: 'Widgets' },
        { path: '/components/brand', title: 'Brand', page: BrandPage, group: 'Blocks' },
        { path: '/components/breadcrumbs', title: 'Breadcrumbs', page: BreadcrumbsPage, group: 'Blocks' },
        { path: '/components/menu', title: 'Menu', page: MenuPage, group: 'Blocks' },
        { path: '/components/notifications', title: 'Notifications', page: NotificationsPage, group: 'Blocks' },
        { path: '/components/search', title: 'Search', page: SearchPage, group: 'Blocks' },
        { path: '/components/input', title: 'Input', page: InputPage, group: 'Form fields' },
        { path: '/components/textarea', title: 'TextArea', page: TextAreaPage, group: 'Form fields' },
        { path: '/components/checkbox', title: 'Checkbox', page: CheckboxPage, group: 'Form fields' },
        { path: '/components/switch', title: 'Switch', page: SwitchPage, group: 'Form fields' },
        { path: '/components/select', title: 'Select', page: SelectPage, group: 'Form fields' },
        { path: '/components/autocomplete', title: 'Autocomplete', page: AutocompletePage, group: 'Form fields' },
        { path: '/components/checklist', title: 'Checklist', page: ChecklistPage, group: 'Form fields' },
        { path: '/components/image-url', title: 'ImageUrl', page: ImageUrlPage, group: 'Form fields' },
        { path: '/components/list-group', title: 'ListGroup', page: ListGroupPage, group: 'Form fields' },
        { path: '/components/prompt', title: 'Prompt', page: PromptPage, group: 'Widgets' },
        { path: '/components/upload', title: 'Upload', page: UploadPage, group: 'Form fields' },
        { path: '/components/assistant-ai', title: 'AssistantAI', page: AssistantAIPage, group: 'Widgets' },
        { path: '/components/form', title: 'Form', page: FormPage, group: 'Widgets' },
        {
            path: '/components/grid',
            title: 'Grid',
            page: GridPage,
            group: 'Widgets',
            children: [
                { path: '/components/grid/array', title: 'GridArray', page: GridArrayPage },
                { path: '/components/grid/db', title: 'GridDB', page: GridDbPage },
            ],
        },
        { path: '/components/layout-builder', title: 'LayoutBuilder', page: LayoutBuilderPage, group: 'Widgets' },
        { path: '/components/markdown-reader', title: 'MarkdownReader', page: MarkdownReaderPage, group: 'Widgets' },
        { path: '/components/repeat', title: 'Repeat', page: RepeatPage, group: 'Widgets' },
    ],

    providers: [
        ...providerRoutes,
        { path: '/providers/data/firebase', title: 'FirebaseDataProvider', page: s('FirebaseDataProvider', 'Real-time Realtime Database implementation.'), group: 'Built-in drivers' },
        { path: '/providers/data/supabase', title: 'SupabaseDataProvider', page: s('SupabaseDataProvider', 'Supabase PostgreSQL implementation.'), group: 'Built-in drivers' },
        { path: '/providers/storage/firebase', title: 'FirebaseStorageProvider', page: s('FirebaseStorageProvider', 'Firebase Storage implementation.'), group: 'Built-in drivers' },
        { path: '/providers/auth/google', title: 'GoogleAuthProvider', page: s('GoogleAuthProvider', 'OAuth2 Google sign-in implementation.'), group: 'Built-in drivers' },
    ],

    examples: [
        { path: '/examples/crud', title: 'CRUD table', page: s('CRUD table', 'Full create/read/update/delete with Grid + modal Form.'), group: 'Common patterns' },
        { path: '/examples/dashboard', title: 'Dashboard', page: s('Dashboard', 'Metric cards, chart and recent-activity table.'), group: 'Common patterns' },
        { path: '/examples/nested-form', title: 'Nested form', page: s('Nested form', 'Deep dot notation, arrays and Repeat components.'), group: 'Common patterns' },
        { path: '/examples/file-manager', title: 'File manager', page: s('File manager', 'Upload + gallery Grid backed by Firebase Storage.'), group: 'Common patterns' },
        { path: '/examples/google-auth', title: 'Google sign-in', page: s('Google sign-in', 'OAuth2 flow, protected routes and user profile.'), group: 'Auth flows' },
        { path: '/examples/ai', title: 'AI assistant', page: ExamplesOverview, group: 'Auth flows' },
    ],
};

export default menu;
