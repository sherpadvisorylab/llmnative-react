import React from 'react';
import { createRoot } from 'react-dom/client';
import { App } from '@llmnative/react';
import '../../../dist/index.css';
import './globals.css';

import ShowcaseLayout from './layouts/ShowcaseLayout';
import { menu } from './conf/menu';

const env = import.meta.env;
const mockData = {
    '/showcase/users': {
        alice: { name: 'Alice', role: 'admin', status: 'active' },
        bob: { name: 'Bob', role: 'editor', status: 'inactive' },
    },
    '/showcase/categories': {
        ops: { label: 'Operations', value: 'ops' },
        sales: { label: 'Sales', value: 'sales' },
        support: { label: 'Support', value: 'support' },
    },
};

function importPage(pageSource: string): Promise<{ default: React.ComponentType }> {
    return Promise.reject(new Error(`Showcase pages must be declared in src/conf/menu.ts: ${pageSource}`));
}

const root = createRoot(document.getElementById('root')!);
root.render(
    <App
        appName="@llmnative/react showcase"
        importPage={importPage}
        LayoutDefault={ShowcaseLayout}
        menuConfig={menu}
        providers={{
            proxy: {
                enabled: env.VITE_PROXY_ENABLED === 'true',
            },
            mock: {
                data: mockData,
            },
            firebase: {
                apiKey: env.VITE_FIREBASE_APIKEY ?? '',
                authDomain: env.VITE_FIREBASE_AUTH_DOMAIN ?? '',
                databaseURL: env.VITE_FIREBASE_DATABASE_URL ?? '',
                projectId: env.VITE_FIREBASE_PROJECT_ID ?? '',
                storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET ?? '',
                messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID ?? '',
                appId: env.VITE_FIREBASE_APP_ID ?? '',
                measurementId: env.VITE_FIREBASE_MEASUREMENT_ID ?? '',
            },
            google: {
                clientId: env.VITE_GOOGLE_CLIENT_ID ?? '',
                scope: env.VITE_GOOGLE_SCOPE ?? '',
            },
            dropbox: {
                clientId: env.VITE_DROPBOX_CLIENT_ID ?? '',
                rootPath: env.VITE_DROPBOX_ROOT_PATH ?? '',
            },
            ai: {
                openaiApiKey: env.VITE_OPENAI_API_KEY,
                openRouterApiKey: env.VITE_OPENROUTER_API_KEY,
                openCodeApiKey: env.VITE_OPENCODE_API_KEY,
                geminiApiKey: env.VITE_GEMINI_API_KEY,
                anthropicApiKey: env.VITE_ANTHROPIC_API_KEY,
                deepSeekApiKey: env.VITE_DEEPSEEK_API_KEY,
                mistralApiKey: env.VITE_MISTRAL_API_KEY,
                openAICompatible: env.VITE_OPENAI_COMPATIBLE_BASE_URL ? {
                    apiKey: env.VITE_OPENAI_COMPATIBLE_API_KEY,
                    baseUrl: env.VITE_OPENAI_COMPATIBLE_BASE_URL,
                } : undefined,
            },
            services: {
                data: 'mock',
                storage: 'firestorage',
                auth: 'googleAuth',
            },
        }}
        iconProvider="lucide"
        themeProvider={{
            theme: 'default',
            themeOverride: {
                Pagination: {
                    sticky: false,
                },
            },
        }}
    />
);
