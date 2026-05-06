import React from 'react';
import PageLayout from '../../components/PageLayout';
import Section from '../../components/Section';

export default function Installation() {
    return (
        <PageLayout
            title="Installation"
            description="Start from the official scaffold, or add react-firestrap manually to an existing Vite React project."
        >
            <Section
                title="Recommended: create a Vite app"
                description="The CLI generates the app shell, App wiring, menuConfig, VITE_* env file, layout and starter pages."
                preview={
                    <div className="alert alert-success text-sm w-full">
                        Use this path for new projects.
                    </div>
                }
                code={`npx react-firestrap create
cd my-app
npm install
npm run dev

# Repeatable scaffold for CI/examples
npx react-firestrap create --yes --provider=mock`}
            />

            <Section
                title="Manual: install the package"
                preview={
                    <div className="alert alert-info text-sm w-full">
                        Requires React 18+, react-router-dom 6+, and Firebase 10+ as peer dependencies.
                    </div>
                }
                code={`npm install react-firestrap

# Peer dependencies (if not already installed)
npm install react react-dom react-router-dom firebase`}
            />

            <Section
                title="Manual: import the stylesheet"
                description="Import once in your Vite entry point. This loads the Tailwind-generated CSS for all components."
                preview={
                    <div className="alert alert-warning text-sm w-full">
                        <strong>Required.</strong> Without this import, components have no visual styles.
                    </div>
                }
                code={`// src/index.tsx
import 'react-firestrap/dist/index.css';`}
            />

            <Section
                title="Manual: wrap your app"
                description="Pass provider configuration to App. Vite exposes client env through import.meta.env."
                preview={
                    <div className="alert alert-success text-sm w-full">
                        App sets up routing plus data, storage, auth, email, icon and theme providers.
                    </div>
                }
                code={`import { App, FirebaseDataProvider } from 'react-firestrap';
import { menu } from './conf/menu';
import AppLayout from './layouts/AppLayout';

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_APIKEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

<App
    firebaseConfig={firebaseConfig}
    dataProvider={new FirebaseDataProvider()}
    menuConfig={menu}
    LayoutDefault={AppLayout}
    iconProvider="lucide"
    themeProvider="default"
    importPage={(path) => Promise.reject(new Error(\`Missing page: \${path}\`))}
/>`}
            />
        </PageLayout>
    );
}
