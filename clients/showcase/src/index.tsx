import React from 'react';
import { createRoot } from 'react-dom/client';
import { App } from 'react-firestrap';
import 'react-firestrap/dist/index.css';
import './globals.css';

import { ShowcaseThemeProvider } from './context/ThemeContext';
import ShowcaseLayout from './layout/ShowcaseLayout';
import { menu } from './conf/menu';

const root = createRoot(document.getElementById('root')!);
root.render(
    <ShowcaseThemeProvider>
        <App
            importPage={(pageSource) => import(`${pageSource}`)}
            LayoutDefault={ShowcaseLayout}
            menuConfig={menu}
            firebaseConfig={{
                apiKey:            process.env.REACT_APP_FIREBASE_APIKEY            ?? '',
                authDomain:        process.env.REACT_APP_FIREBASE_AUTH_DOMAIN       ?? '',
                databaseURL:       process.env.REACT_APP_FIREBASE_DATABASE_URL      ?? '',
                projectId:         process.env.REACT_APP_FIREBASE_PROJECT_ID        ?? '',
                storageBucket:     process.env.REACT_APP_FIREBASE_STORAGE_BUCKET    ?? '',
                messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID ?? '',
                appId:             process.env.REACT_APP_FIREBASE_APP_ID            ?? '',
                measurementId:     process.env.REACT_APP_FIREBASE_MEASUREMENT_ID    ?? '',
            }}
            oAuth2={{
                clientId: process.env.REACT_APP_GOOGLE_CLIENT_ID ?? '',
                scope:    process.env.REACT_APP_GOOGLE_SCOPE      ?? '',
            }}
            aiConfig={{
                geminiApiKey:    process.env.REACT_APP_GEMINI_API_KEY,
                openaiApiKey:    process.env.REACT_APP_OPENAI_API_KEY,
                deepSeekApiKey:  process.env.REACT_APP_DEEPSEEK_API_KEY,
                anthropicApiKey: process.env.REACT_APP_ANTHROPIC_API_KEY,
                mistralApiKey:   process.env.REACT_APP_MISTRAL_API_KEY,
            }}
        />
    </ShowcaseThemeProvider>
);
