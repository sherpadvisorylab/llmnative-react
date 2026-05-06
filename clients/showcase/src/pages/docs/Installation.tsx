import React from 'react';
import PageLayout from '../../components/PageLayout';
import Section from '../../components/Section';

export default function Installation() {
    return (
        <PageLayout
            title="Installation"
            description="Add react-firestrap to an existing React project in three steps."
        >
            <Section
                title="1. Install the package"
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
                title="2. Import the stylesheet"
                description="Import once in your entry point. This loads the Tailwind-generated CSS for all components."
                preview={
                    <div className="alert alert-warning text-sm w-full">
                        <strong>Required.</strong> Without this import, components have no visual styles.
                    </div>
                }
                code={`// main.tsx or index.tsx
import 'react-firestrap/dist/index.css';`}
            />

            <Section
                title="3. Wrap your app"
                description="Pass your Firebase config and provider instances to the App component."
                preview={
                    <div className="alert alert-success text-sm w-full">
                        The App component sets up all React contexts — data, storage, auth and email providers.
                    </div>
                }
                code={`import { App } from 'react-firestrap';
import { FirebaseDataProvider } from 'react-firestrap';

const firebaseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_APIKEY,
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_FIREBASE_APP_ID,
};

<App
    firebaseConfig={firebaseConfig}
    dataProvider={new FirebaseDataProvider()}
    menuConfig={menuConfig}
    importPage={(path) => import(path)}
/>`}
            />
        </PageLayout>
    );
}
