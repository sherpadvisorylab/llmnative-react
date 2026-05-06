import React from 'react';
import { createRoot } from 'react-dom/client';
import { App, MockDataProvider } from 'react-firestrap';
import 'react-firestrap/dist/index.css';
import './globals.css';

import ShowcaseLayout from './layout/ShowcaseLayout';
import { menu } from './conf/menu';

const env = import.meta.env;
const dataProvider = new MockDataProvider({
    '/showcase/users': {
        alice: { name: 'Alice', role: 'admin', status: 'active' },
        bob: { name: 'Bob', role: 'editor', status: 'inactive' },
    },
});

function importPage(pageSource: string): Promise<{ default: React.ComponentType }> {
    return Promise.reject(new Error(`Showcase pages must be declared in src/conf/menu.ts: ${pageSource}`));
}

const root = createRoot(document.getElementById('root')!);
root.render(
    <App
        importPage={importPage}
        LayoutDefault={ShowcaseLayout}
        menuConfig={menu}
        dataProvider={dataProvider}
        iconProvider="lucide"
        themeProvider="default"
        firebaseConfig={{
            apiKey:            env.VITE_FIREBASE_APIKEY            ?? '',
            authDomain:        env.VITE_FIREBASE_AUTH_DOMAIN       ?? '',
            databaseURL:       env.VITE_FIREBASE_DATABASE_URL      ?? '',
            projectId:         env.VITE_FIREBASE_PROJECT_ID        ?? '',
            storageBucket:     env.VITE_FIREBASE_STORAGE_BUCKET    ?? '',
            messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID ?? '',
            appId:             env.VITE_FIREBASE_APP_ID            ?? '',
            measurementId:     env.VITE_FIREBASE_MEASUREMENT_ID    ?? '',
        }}
        oAuth2={{
            clientId: env.VITE_GOOGLE_CLIENT_ID ?? '',
            scope:    env.VITE_GOOGLE_SCOPE      ?? '',
        }}
        aiConfig={{
            geminiApiKey:    env.VITE_GEMINI_API_KEY,
            openaiApiKey:    env.VITE_OPENAI_API_KEY,
            deepSeekApiKey:  env.VITE_DEEPSEEK_API_KEY,
            anthropicApiKey: env.VITE_ANTHROPIC_API_KEY,
            mistralApiKey:   env.VITE_MISTRAL_API_KEY,
        }}
    />
);
