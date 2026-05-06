import React from 'react';
import PageLayout from '../../components/PageLayout';
import Section from '../../components/Section';

export default function AppConfiguration() {
    return (
        <PageLayout
            title="App configuration"
            description="App is the orchestration point for routing, layout, menu, data, icons, theme and external service configuration."
        >
            <div className="space-y-8">
                <Section
                    title="Minimal Vite entry"
                    description="A scaffolded app mounts App from src/index.tsx and keeps wiring in src/conf."
                    preview={
                        <div className="grid gap-3 text-sm md:grid-cols-3 w-full">
                            {['src/index.tsx', 'src/conf/app.ts', 'src/conf/menu.ts'].map((item) => (
                                <div key={item} className="rounded-md border bg-card p-3 font-medium">{item}</div>
                            ))}
                        </div>
                    }
                    code={`import React from 'react';
import { createRoot } from 'react-dom/client';
import { App, MockDataProvider } from 'react-firestrap';
import './styles/globals.css';

import AppLayout from './layouts/AppLayout';
import { appConfig } from './conf/app';
import { menu } from './conf/menu';
import { mockData } from './data/mockData';

const dataProvider = new MockDataProvider(mockData);

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App
      importPage={(pageSource) => import(/* @vite-ignore */ pageSource)}
      LayoutDefault={AppLayout}
      menuConfig={menu}
      dataProvider={dataProvider}
      iconProvider={appConfig.iconProvider}
      themeProvider={appConfig.themeProvider}
    />
  </React.StrictMode>
);`}
                />

                <Section
                    title="Configuration from env"
                    description="Vite exposes public client configuration through import.meta.env. The scaffold maps it in src/conf/app.ts."
                    preview={
                        <div className="alert alert-info text-sm w-full">
                            The App API receives plain values; the env layer stays in the consumer app.
                        </div>
                    }
                    code={`// src/conf/app.ts
const env = import.meta.env;

export const appConfig = {
  dataProvider: env.VITE_DATA_PROVIDER ?? 'mock',
  iconProvider: env.VITE_ICON_PROVIDER ?? 'lucide',
  themeProvider: env.VITE_THEME_PROVIDER ?? 'default',
};

// .env
VITE_DATA_PROVIDER=mock
VITE_ICON_PROVIDER=lucide
VITE_THEME_PROVIDER=default`}
                />

                <Section
                    title="Menu and layout"
                    description="menuConfig defines routable pages. LayoutDefault wraps each route unless a menu item provides its own layout."
                    preview={
                        <div className="grid gap-3 text-sm md:grid-cols-2 w-full">
                            <div className="rounded-md border bg-card p-4">
                                <p className="font-semibold">menuConfig</p>
                                <p className="mt-1 text-xs text-muted-foreground">Routes, labels, groups and pages.</p>
                            </div>
                            <div className="rounded-md border bg-card p-4">
                                <p className="font-semibold">LayoutDefault</p>
                                <p className="mt-1 text-xs text-muted-foreground">Application shell around routed pages.</p>
                            </div>
                        </div>
                    }
                    code={`// src/conf/menu.ts
import HomePage from '../pages/home/HomePage';
import UsersPage from '../pages/users/UsersPage';

export const menu = {
  main: [
    { path: '/', title: 'Home', page: HomePage },
    { path: '/users', title: 'Users', page: UsersPage, group: 'Data' },
  ],
};

// src/layouts/AppLayout.tsx
export default function AppLayout({ children }: { children?: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b bg-card">My app</header>
      <main>{children}</main>
    </div>
  );
}`}
                />

                <Section
                    title="Provider shorthand"
                    description="Use strings when you only need built-in defaults. This is the recommended scaffold path."
                    preview={
                        <div className="flex flex-wrap gap-2">
                            {['themeProvider="default"', 'themeProvider="cyber"', 'iconProvider="lucide"', 'iconProvider="phosphor"'].map((item) => (
                                <span key={item} className="badge bg-secondary">{item}</span>
                            ))}
                        </div>
                    }
                    code={`<App
  menuConfig={menu}
  LayoutDefault={AppLayout}
  dataProvider={dataProvider}
  iconProvider="lucide"
  themeProvider="default"
/>`}
                />

                <Section
                    title="Advanced provider config"
                    description="Use objects when the app needs custom presets, provider registries or overrides on top of built-ins."
                    preview={
                        <div className="alert alert-success text-sm w-full">
                            Object config extends built-ins; it does not force consumers to re-declare lucide, phosphor or default theme presets.
                        </div>
                    }
                    code={`<App
  menuConfig={menu}
  LayoutDefault={AppLayout}
  dataProvider={dataProvider}
  iconProvider={{
    default: 'phosphor-bold',
    providers: {
      'phosphor-bold': new PhosphorIconProvider('bold'),
    },
    aliases: {
      delete: 'trash',
    },
  }}
  themeProvider={{
    defaultPreset: 'brand',
    presets: {
      brand: {
        mode: 'light',
        primary: '346.8 77.2% 49.8%',
        radius: 0.75,
      },
    },
  }}
/>`}
                />

                <Section
                    title="External service config"
                    description="Pass service configuration to App when the app uses Firebase, OAuth2, AI or other framework integrations."
                    preview={
                        <div className="grid gap-2 text-sm md:grid-cols-4 w-full">
                            {['firebaseConfig', 'oAuth2', 'aiConfig', 'dropBoxConfig'].map((item) => (
                                <div key={item} className="rounded-md border bg-card p-3">{item}</div>
                            ))}
                        </div>
                    }
                    code={`const env = import.meta.env;

<App
  menuConfig={menu}
  LayoutDefault={AppLayout}
  firebaseConfig={{
    apiKey: env.VITE_FIREBASE_APIKEY,
    authDomain: env.VITE_FIREBASE_AUTH_DOMAIN,
    databaseURL: env.VITE_FIREBASE_DATABASE_URL,
    projectId: env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: env.VITE_FIREBASE_APP_ID,
    measurementId: env.VITE_FIREBASE_MEASUREMENT_ID,
  }}
  oAuth2={{
    clientId: env.VITE_GOOGLE_CLIENT_ID,
    scope: env.VITE_GOOGLE_SCOPE,
  }}
/>`}
                />

                <Section
                    title="Page loading"
                    description="For scaffolded apps, pages are usually imported directly in menuConfig. importPage remains available for dynamic legacy paths."
                    preview={
                        <div className="alert alert-warning text-sm w-full">
                            Prefer explicit page imports in src/conf/menu.ts when using Vite.
                        </div>
                    }
                    code={`// Recommended Vite path: explicit imports
import HomePage from '../pages/home/HomePage';

export const menu = {
  main: [{ path: '/', title: 'Home', page: HomePage }],
};

// Dynamic fallback for legacy menu items without page
<App
  menuConfig={menu}
  importPage={(pageSource) => import(/* @vite-ignore */ pageSource)}
/>`}
                />
            </div>
        </PageLayout>
    );
}
