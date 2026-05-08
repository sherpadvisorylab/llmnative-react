import React from 'react';
import { createRoot } from 'react-dom/client';
import { App } from 'react-firestrap';
import './styles/globals.css';

import AppLayout from './layouts/AppLayout';
import { appConfig } from './conf/app';
import { menu } from './conf/menu';
import { mockData } from './data/mockData';

const env = import.meta.env;

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App
      importPage={(pageSource) => import(/* @vite-ignore */ pageSource)}
      LayoutDefault={AppLayout}
      menuConfig={menu}
      providers={{
        default: appConfig.provider,
        mock: {
          data: mockData,
        },
        firebase: {
          config: {
            apiKey: env.VITE_FIREBASE_APIKEY ?? '',
            authDomain: env.VITE_FIREBASE_AUTH_DOMAIN ?? '',
            databaseURL: env.VITE_FIREBASE_DATABASE_URL ?? '',
            projectId: env.VITE_FIREBASE_PROJECT_ID ?? '',
            storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET ?? '',
            messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID ?? '',
            appId: env.VITE_FIREBASE_APP_ID ?? '',
            measurementId: env.VITE_FIREBASE_MEASUREMENT_ID ?? '',
          },
        },
        supabase: {
          config: {
            url: env.VITE_SUPABASE_URL ?? '',
            anonKey: env.VITE_SUPABASE_ANON_KEY ?? '',
          },
        },
        google: {
          oAuth2: {
            clientId: env.VITE_GOOGLE_CLIENT_ID ?? '',
            scope: env.VITE_GOOGLE_SCOPE ?? '',
          },
        },
        services: {
          data: appConfig.provider,
          storage: appConfig.provider === 'supabase' ? 'supabase' : 'firebase',
          auth: appConfig.provider === 'firebase' ? 'firebase' : 'google',
        },
      }}
      iconProvider={appConfig.iconProvider}
      themeProvider={appConfig.themeProvider}
    />
  </React.StrictMode>
);
    