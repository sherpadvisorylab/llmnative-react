import React from 'react';
import { Navigate } from 'react-router-dom';

import Home from '../pages/Home';
import { markdownDocs } from '../docs/markdownDocs';
import MarkdownDocPage from '../pages/docs/MarkdownDocPage';
import Stub from '../pages/docs/Stub';
import ProvidersOverview from '../pages/providers/ProvidersOverview';
import DataProviderPage from '../pages/providers/DataProviderPage';
import ExamplesOverview from '../pages/examples/ExamplesOverview';

import AlertPage from '../pages/components/AlertPage';
import BadgePage from '../pages/components/BadgePage';
import ButtonPage from '../pages/components/ButtonPage';
import CardPage from '../pages/components/CardPage';
import LoaderPage from '../pages/components/LoaderPage';
import ModalPage from '../pages/components/ModalPage';
import PaginationPage from '../pages/components/PaginationPage';
import TabPage from '../pages/components/TabPage';
import TablePage from '../pages/components/TablePage';
import InputPage from '../pages/components/InputPage';
import SelectPage from '../pages/components/SelectPage';
import UploadPage from '../pages/components/UploadPage';
import FormPage from '../pages/components/FormPage';
import GridPage from '../pages/components/GridPage';
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

export const menu = {
    default: [
        { path: '/', page: Home },
    ],

    _nav: [
        { path: '/components', page: () => React.createElement(Navigate, { to: '/components/alert', replace: true }) },
        { path: '/examples', page: () => React.createElement(Navigate, { to: '/examples/crud', replace: true }) },
    ],

    docs: docsRoutes,

    components: [
        { path: '/components/alert', title: 'Alert', page: AlertPage, group: 'UI Primitives' },
        { path: '/components/badge', title: 'Badge', page: BadgePage, group: 'UI Primitives' },
        { path: '/components/button', title: 'Button', page: ButtonPage, group: 'UI Primitives' },
        { path: '/components/card', title: 'Card', page: CardPage, group: 'UI Primitives' },
        { path: '/components/loader', title: 'Loader', page: LoaderPage, group: 'UI Primitives' },
        { path: '/components/modal', title: 'Modal', page: ModalPage, group: 'UI Primitives' },
        { path: '/components/pagination', title: 'Pagination', page: PaginationPage, group: 'UI Primitives' },
        { path: '/components/tab', title: 'Tab', page: TabPage, group: 'UI Primitives' },
        { path: '/components/table', title: 'Table', page: TablePage, group: 'UI Primitives' },
        { path: '/components/input', title: 'Input', page: InputPage, group: 'Form fields' },
        { path: '/components/select', title: 'Select', page: SelectPage, group: 'Form fields' },
        { path: '/components/upload', title: 'Upload', page: UploadPage, group: 'Form fields' },
        { path: '/components/form', title: 'Form', page: FormPage, group: 'Widgets' },
        { path: '/components/grid', title: 'Grid', page: GridPage, group: 'Widgets' },
        { path: '/components/markdown-reader', title: 'MarkdownReader', page: MarkdownReaderPage, group: 'Widgets' },
    ],

    providers: [
        { path: '/providers', title: 'Overview', page: ProvidersOverview, group: 'Overview' },
        { path: '/providers/data', title: 'DataProvider interface', page: DataProviderPage, group: 'Data' },
        { path: '/providers/data/firebase', title: 'FirebaseDataProvider', page: s('FirebaseDataProvider', 'Real-time Realtime Database implementation.'), group: 'Data' },
        { path: '/providers/data/supabase', title: 'SupabaseDataProvider', page: s('SupabaseDataProvider', 'Supabase PostgreSQL implementation.'), group: 'Data' },
        { path: '/providers/data/custom', title: 'Custom provider', page: s('Custom DataProvider', 'How to implement and register your own DataProvider.'), group: 'Data' },
        { path: '/providers/storage', title: 'StorageProvider interface', page: s('StorageProvider interface', 'upload, getUrl - the storage contract.'), group: 'Storage' },
        { path: '/providers/storage/firebase', title: 'FirebaseStorageProvider', page: s('FirebaseStorageProvider', 'Firebase Storage implementation.'), group: 'Storage' },
        { path: '/providers/auth', title: 'AuthProvider interface', page: s('AuthProvider interface', 'signIn, signOut, onAuthStateChanged - the auth contract.'), group: 'Auth' },
        { path: '/providers/auth/google', title: 'GoogleAuthProvider', page: s('GoogleAuthProvider', 'OAuth2 Google sign-in implementation.'), group: 'Auth' },
        { path: '/providers/email', title: 'EmailProvider', page: s('EmailProvider interface', 'send - the email contract.'), group: 'Email & AI' },
        { path: '/providers/ai', title: 'AI integration', page: s('AI integration', 'AI.fetch, AI.json, AI.array - multi-provider (OpenAI, Gemini, Anthropic).'), group: 'Email & AI' },
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
