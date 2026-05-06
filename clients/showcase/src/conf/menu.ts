import React from 'react';
import { Navigate } from 'react-router-dom';

import Home               from '../pages/Home';
import DocsOverview       from '../pages/docs/DocsOverview';
import Installation       from '../pages/docs/Installation';
import Icons              from '../pages/docs/Icons';
import ThemeDocs          from '../pages/docs/Theme';
import Stub               from '../pages/docs/Stub';
import ProvidersOverview  from '../pages/providers/ProvidersOverview';
import ExamplesOverview   from '../pages/examples/ExamplesOverview';

import AlertPage      from '../pages/components/AlertPage';
import BadgePage      from '../pages/components/BadgePage';
import ButtonPage     from '../pages/components/ButtonPage';
import CardPage       from '../pages/components/CardPage';
import LoaderPage     from '../pages/components/LoaderPage';
import ModalPage      from '../pages/components/ModalPage';
import PaginationPage from '../pages/components/PaginationPage';
import TabPage        from '../pages/components/TabPage';
import TablePage      from '../pages/components/TablePage';
import InputPage      from '../pages/components/InputPage';
import SelectPage     from '../pages/components/SelectPage';
import FormPage       from '../pages/components/FormPage';
import GridPage       from '../pages/components/GridPage';

const s = (title: string, description: string): React.ComponentType =>
    () => React.createElement(Stub, { title, description });

export const menu = {
    default: [
        { path: '/', page: Home },
    ],

    _nav: [
        { path: '/components', page: () => React.createElement(Navigate, { to: '/components/alert', replace: true }) },
        { path: '/examples',   page: () => React.createElement(Navigate, { to: '/examples/crud',   replace: true }) },
    ],

    docs: [
        { path: '/docs',                    title: 'Overview',          page: DocsOverview,  group: 'Getting started', end: true },
        { path: '/docs/installation',       title: 'Installation',      page: Installation,  group: 'Getting started' },
        { path: '/docs/scaffolding',        title: 'Scaffolding',       page: s('Scaffolding',    'CLI tool to bootstrap a new project with react-firestrap pre-configured.'), group: 'Getting started' },
        { path: '/docs/architecture',       title: 'Folder structure',  page: s('Folder structure', 'How src/ is organised and the dependency rules between layers.'),    group: 'Architecture' },
        { path: '/docs/providers',          title: 'Provider pattern',  page: s('Provider pattern', 'Ports & Adapters explained — how to read, write and swap providers.'), group: 'Architecture' },
        { path: '/docs/theme',              title: 'Theme system',      page: ThemeDocs,                                                                                                  group: 'Architecture' },
        { path: '/docs/icons',              title: 'Icon system',       page: Icons,                                                                                                       group: 'Architecture' },
        { path: '/docs/patterns/grid',      title: 'CRUD Grid',         page: s('CRUD Grid pattern',      'The most common pattern: schema-driven list with add/edit/delete.'), group: 'Core patterns' },
        { path: '/docs/patterns/form',      title: 'Standalone Form',   page: s('Standalone Form pattern', 'Load from Firebase, validate, save, redirect.'),               group: 'Core patterns' },
        { path: '/docs/patterns/nested',    title: 'Nested objects',    page: s('Nested objects & arrays', 'Dot notation and array index notation in Form and Grid.'),      group: 'Core patterns' },
        { path: '/docs/patterns/formatters',title: 'Column formatters', page: s('Column formatters',       'onDisplay callbacks, built-in converters, custom renderers.'),  group: 'Core patterns' },
    ],

    components: [
        { path: '/components/alert',      title: 'Alert',      page: AlertPage,      group: 'UI Primitives' },
        { path: '/components/badge',      title: 'Badge',      page: BadgePage,      group: 'UI Primitives' },
        { path: '/components/button',     title: 'Button',     page: ButtonPage,     group: 'UI Primitives' },
        { path: '/components/card',       title: 'Card',       page: CardPage,       group: 'UI Primitives' },
        { path: '/components/loader',     title: 'Loader',     page: LoaderPage,     group: 'UI Primitives' },
        { path: '/components/modal',      title: 'Modal',      page: ModalPage,      group: 'UI Primitives' },
        { path: '/components/pagination', title: 'Pagination', page: PaginationPage, group: 'UI Primitives' },
        { path: '/components/tab',        title: 'Tab',        page: TabPage,        group: 'UI Primitives' },
        { path: '/components/table',      title: 'Table',      page: TablePage,      group: 'UI Primitives' },
        { path: '/components/input',      title: 'Input',      page: InputPage,  group: 'Form fields' },
        { path: '/components/select',     title: 'Select',     page: SelectPage, group: 'Form fields' },
        { path: '/components/upload',     title: 'Upload',     page: s('Upload', 'Generic, Image (with crop) and Document upload with optional cloud storage.'), group: 'Form fields' },
        { path: '/components/form',       title: 'Form',       page: FormPage,   group: 'Widgets' },
        { path: '/components/grid',       title: 'Grid',       page: GridPage,   group: 'Widgets' },
    ],

    providers: [
        { path: '/providers',                   title: 'Overview',                  page: ProvidersOverview, group: 'Overview' },
        { path: '/providers/data',              title: 'DataProvider interface',    page: s('DataProvider interface',    'get, list, save, delete, subscribe — the full contract.'),         group: 'Data' },
        { path: '/providers/data/firebase',     title: 'FirebaseDataProvider',      page: s('FirebaseDataProvider',      'Real-time Realtime Database implementation.'),                      group: 'Data' },
        { path: '/providers/data/supabase',     title: 'SupabaseDataProvider',      page: s('SupabaseDataProvider',      'Supabase PostgreSQL implementation.'),                              group: 'Data' },
        { path: '/providers/data/custom',       title: 'Custom provider',           page: s('Custom DataProvider',       'How to implement and register your own DataProvider.'),             group: 'Data' },
        { path: '/providers/storage',           title: 'StorageProvider interface', page: s('StorageProvider interface', 'upload, getUrl — the storage contract.'),                           group: 'Storage' },
        { path: '/providers/storage/firebase',  title: 'FirebaseStorageProvider',   page: s('FirebaseStorageProvider',   'Firebase Storage implementation.'),                                group: 'Storage' },
        { path: '/providers/auth',              title: 'AuthProvider interface',    page: s('AuthProvider interface',    'signIn, signOut, onAuthStateChanged — the auth contract.'),         group: 'Auth' },
        { path: '/providers/auth/google',       title: 'GoogleAuthProvider',        page: s('GoogleAuthProvider',        'OAuth2 Google sign-in implementation.'),                            group: 'Auth' },
        { path: '/providers/email',             title: 'EmailProvider',             page: s('EmailProvider interface',   'send — the email contract.'),                                      group: 'Email & AI' },
        { path: '/providers/ai',                title: 'AI integration',            page: s('AI integration',            'AI.fetch, AI.json, AI.array — multi-provider (OpenAI, Gemini, Anthropic).'), group: 'Email & AI' },
    ],

    examples: [
        { path: '/examples/crud',         title: 'CRUD table',     page: s('CRUD table',     'Full create/read/update/delete with Grid + modal Form.'),          group: 'Common patterns' },
        { path: '/examples/dashboard',    title: 'Dashboard',      page: s('Dashboard',      'Metric cards, chart and recent-activity table.'),                   group: 'Common patterns' },
        { path: '/examples/nested-form',  title: 'Nested form',    page: s('Nested form',    'Deep dot notation, arrays and Repeat components.'),                 group: 'Common patterns' },
        { path: '/examples/file-manager', title: 'File manager',   page: s('File manager',   'Upload + gallery Grid backed by Firebase Storage.'),                group: 'Common patterns' },
        { path: '/examples/google-auth',  title: 'Google sign-in', page: s('Google sign-in', 'OAuth2 flow, protected routes and user profile.'),                  group: 'Auth flows' },
        { path: '/examples/ai',           title: 'AI assistant',   page: ExamplesOverview,                                                                        group: 'Auth flows' },
    ],
};

export default menu;
