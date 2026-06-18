import React from 'react';
import { Navigate } from 'react-router-dom';

import { markdownDocs, providerMarkdownDocs } from '../docs/markdownDocs';
import MarkdownDocPage from '../pages/docs/MarkdownDocPage';
import Stub from '../pages/docs/Stub';

const lazyPage = <T extends { default: React.ComponentType<any> }>(
    loader: () => Promise<T>
) => React.lazy(loader);

const Home = lazyPage(() => import('../pages/Home'));
const ExamplesOverview = lazyPage(() => import('../pages/examples/ExamplesOverview'));

const AlertPage = lazyPage(() => import('../pages/components/AlertPage'));
const AuthPage = lazyPage(() => import('../pages/components/AuthPage'));
const BadgePage = lazyPage(() => import('../pages/components/BadgePage'));
const BrandPage = lazyPage(() => import('../pages/components/BrandPage'));
const BreadcrumbsPage = lazyPage(() => import('../pages/components/BreadcrumbsPage'));
const ButtonsIndexPage = lazyPage(() => import('../pages/components/buttons'));
const ActionButtonPage = lazyPage(() => import('../pages/components/buttons/ActionButtonPage'));
const LoadingButtonPage = lazyPage(() => import('../pages/components/buttons/LoadingButtonPage'));
const NavigationButtonsPage = lazyPage(() => import('../pages/components/buttons/NavigationButtonsPage'));
const CardPage = lazyPage(() => import('../pages/components/CardPage'));
const CarouselPage = lazyPage(() => import('../pages/components/CarouselPage'));
const CheckboxPage = lazyPage(() => import('../pages/components/CheckboxPage'));
const CodePage = lazyPage(() => import('../pages/components/CodePage'));
const LoaderPage = lazyPage(() => import('../pages/components/LoaderPage'));
const LocaleSwitcherPage = lazyPage(() => import('../pages/components/LocaleSwitcherPage'));
const DropdownPage = lazyPage(() => import('../pages/components/DropdownPage'));
const GalleryPage = lazyPage(() => import('../pages/components/GalleryPage'));
const GridSystemPage = lazyPage(() => import('../pages/components/GridSystemPage'));
const IconPage = lazyPage(() => import('../pages/components/IconPage'));
const ImagePage = lazyPage(() => import('../pages/components/ImagePage'));
const ImageAvatarPage = lazyPage(() => import('../pages/components/ImageAvatarPage'));
const ImageFieldPage = lazyPage(() => import('../pages/components/ImageFieldPage'));
const LayoutBuilderPage = lazyPage(() => import('../pages/components/LayoutBuilderPage'));
const ListGroupPage = lazyPage(() => import('../pages/components/ListGroupPage'));
const MenuPage = lazyPage(() => import('../pages/components/MenuPage'));
const ModalPage = lazyPage(() => import('../pages/components/ModalPage'));
const ModalYesNoPage = lazyPage(() => import('../pages/components/ModalYesNoPage'));
const ModalOkPage = lazyPage(() => import('../pages/components/ModalOkPage'));
const MotionPage = lazyPage(() => import('../pages/components/MotionPage'));
const NotificationsPage = lazyPage(() => import('../pages/components/NotificationsPage'));
const PaginationPage = lazyPage(() => import('../pages/components/PaginationPage'));
const PercentagePage = lazyPage(() => import('../pages/components/PercentagePage'));
const PromptIndexPage = lazyPage(() => import('../pages/components/prompt'));
const PromptEditorPage = lazyPage(() => import('../pages/components/prompt/PromptEditorPage'));
const PromptLivePage = lazyPage(() => import('../pages/components/prompt/PromptLivePage'));
const PromptPlainPage = lazyPage(() => import('../pages/components/prompt/PromptPlainPage'));
const RepeatPage = lazyPage(() => import('../pages/components/RepeatPage'));
const SearchPage = lazyPage(() => import('../pages/components/SearchPage'));
const SwitchPage = lazyPage(() => import('../pages/components/SwitchPage'));
const TabPage = lazyPage(() => import('../pages/components/TabPage'));
const TabDynamicPage = lazyPage(() => import('../pages/components/TabDynamicPage'));
const TablePage = lazyPage(() => import('../pages/components/TablePage'));
const TextAreaPage = lazyPage(() => import('../pages/components/TextAreaPage'));
const InputPage = lazyPage(() => import('../pages/components/InputPage'));
const SelectPage = lazyPage(() => import('../pages/components/SelectPage'));
const AutocompletePage = lazyPage(() => import('../pages/components/AutocompletePage'));
const ChecklistPage = lazyPage(() => import('../pages/components/ChecklistPage'));
const UploadPage = lazyPage(() => import('../pages/components/UploadPage'));
const UploadImagePage = lazyPage(() => import('../pages/components/upload/UploadImagePage'));
const UploadDocumentPage = lazyPage(() => import('../pages/components/upload/UploadDocumentPage'));
const UploadCSVPage = lazyPage(() => import('../pages/components/upload/UploadCSVPage'));
const FormPage = lazyPage(() => import('../pages/components/FormPage'));
const FormValidationPage = lazyPage(() => import('../pages/components/FormValidationPage'));
const RichTextPage = lazyPage(() => import('../pages/components/RichTextPage'));
const GridPage = lazyPage(() => import('../pages/components/GridPage'));
const GridArrayPage = lazyPage(() => import('../pages/components/GridArrayPage'));
const GridDbPage = lazyPage(() => import('../pages/components/GridDbPage'));
const GridPreviewPage = lazyPage(() => import('../pages/components/GridPreviewPage'));
const BenchmarkPage = lazyPage(() => import('../pages/BenchmarkPage'));
const MarkdownReaderPage = lazyPage(() => import('../pages/components/MarkdownReaderPage'));
const ImageEditorPage = lazyPage(() => import('../pages/components/ImageEditorPage'));
const CodeEditorPage = lazyPage(() => import('../pages/components/CodeEditorPage'));

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

    benchmark: [
        { path: '/benchmark', page: BenchmarkPage },
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
        // ── Foundation ──────────────────────────────────────────────────────────
        { path: '/components/motion', title: 'Motion', page: MotionPage, group: 'Foundation' },

        // ── UI Primitives (alphabetical) ─────────────────────────────────────
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
        { path: '/components/locale-switcher', title: 'LocaleSwitcher', page: LocaleSwitcherPage, group: 'UI Primitives' },
        {
            path: '/components/modal',
            title: 'Modal',
            page: ModalPage,
            group: 'UI Primitives',
            children: [
                { path: '/components/modal/yesno', title: 'ModalYesNo', page: ModalYesNoPage },
                { path: '/components/modal/ok', title: 'ModalOk', page: ModalOkPage },
            ],
        },
        { path: '/components/pagination', title: 'Pagination', page: PaginationPage, group: 'UI Primitives' },
        { path: '/components/percentage', title: 'Percentage', page: PercentagePage, group: 'UI Primitives' },
        { path: '/components/tab', title: 'Tab', page: TabPage, group: 'UI Primitives' },
        { path: '/components/table', title: 'Table', page: TablePage, group: 'UI Primitives' },

        // ── Widgets (alphabetical, Grid penultimate, Form last) ───────────────
        { path: '/components/auth', title: 'Auth', page: AuthPage, group: 'Widgets' },
        { path: '/components/image-editor', title: 'ImageEditor', page: ImageEditorPage, group: 'Widgets' },
        { path: '/components/layout-builder', title: 'LayoutBuilder', page: LayoutBuilderPage, group: 'Widgets' },
        { path: '/components/markdown-reader', title: 'MarkdownReader', page: MarkdownReaderPage, group: 'Widgets' },
        {
            path: '/components/prompt',
            title: 'Prompt',
            page: PromptIndexPage,
            group: 'Widgets',
            children: [
                { path: '/components/prompt/editor', title: 'PromptEdit', page: PromptEditorPage },
                { path: '/components/prompt/live', title: 'PromptRun', page: PromptLivePage },
                { path: '/components/prompt/plain', title: 'PromptPlain', page: PromptPlainPage },
            ],
        },
        { path: '/components/repeat', title: 'Repeat', page: RepeatPage, group: 'Widgets' },
        { path: '/components/tab-dynamic', title: 'TabDynamic', page: TabDynamicPage, group: 'Widgets' },
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
        {
            path: '/components/form',
            title: 'Form',
            page: FormPage,
            group: 'Widgets',
            children: [
                { path: '/components/form/validation', title: 'Validation', page: FormValidationPage },
            ],
        },

        // ── Form fields (alphabetical) ────────────────────────────────────────
        { path: '/components/autocomplete', title: 'Autocomplete', page: AutocompletePage, group: 'Form fields' },
        { path: '/components/checkbox', title: 'Checkbox', page: CheckboxPage, group: 'Form fields' },
        { path: '/components/code-editor', title: 'CodeEditor', page: CodeEditorPage, group: 'Form fields' },
        { path: '/components/checklist', title: 'Checklist', page: ChecklistPage, group: 'Form fields' },
        { path: '/components/image-field', title: 'ImageField', page: ImageFieldPage, group: 'Form fields' },
        { path: '/components/input', title: 'Input', page: InputPage, group: 'Form fields' },
        { path: '/components/list-group', title: 'ListGroup', page: ListGroupPage, group: 'Form fields' },
        { path: '/components/select', title: 'Select', page: SelectPage, group: 'Form fields' },
        { path: '/components/switch', title: 'Switch', page: SwitchPage, group: 'Form fields' },
        { path: '/components/textarea', title: 'TextArea', page: TextAreaPage, group: 'Form fields' },
        { path: '/components/rich-text', title: 'RichText', page: RichTextPage, group: 'Form fields' },
        {
            path: '/components/upload',
            title: 'Upload',
            page: UploadPage,
            group: 'Form fields',
            children: [
                { path: '/components/upload/image', title: 'UploadImage', page: UploadImagePage },
                { path: '/components/upload/document', title: 'UploadDocument', page: UploadDocumentPage },
                { path: '/components/upload/csv', title: 'UploadCSV', page: UploadCSVPage },
            ],
        },

        // ── Blocks (alphabetical) ─────────────────────────────────────────────
        { path: '/components/brand', title: 'Brand', page: BrandPage, group: 'Blocks' },
        { path: '/components/breadcrumbs', title: 'Breadcrumbs', page: BreadcrumbsPage, group: 'Blocks' },
        { path: '/components/menu', title: 'Menu', page: MenuPage, group: 'Blocks' },
        { path: '/components/notifications', title: 'Notifications', page: NotificationsPage, group: 'Blocks' },
        { path: '/components/search', title: 'Search', page: SearchPage, group: 'Blocks' },
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
