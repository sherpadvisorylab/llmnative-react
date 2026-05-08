import React from 'react';
import PageLayout from '../../components/PageLayout';
import Section from '../../components/Section';

export default function QuickStart() {
    return (
        <PageLayout
            title="Quick start"
            description="Create a Vite app, mount App, and render your first provider-backed CRUD screen."
        >
            <Section
                title="Create an app"
                description="The fastest path is the official scaffold. It creates a Vite consumer with App, menuConfig, layout, theme, icons and provider wiring."
                preview={
                    <div className="alert alert-success text-sm w-full">
                        Recommended for new projects.
                    </div>
                }
                code={`npx react-firestrap create
cd my-app
npm install
npm run dev`}
            />

            <Section
                title="Manual install"
                description="Use this path when adding react-firestrap to an existing Vite React app."
                preview={
                    <div className="alert alert-info text-sm w-full">
                        Import the stylesheet once in your entry point.
                    </div>
                }
                code={`npm install react-firestrap

// src/index.tsx
import 'react-firestrap/dist/index.css';`}
            />

            <Section
                title="Mount App"
                description="App owns routing, providers, theme and icons. A minimal app can start with MockDataProvider."
                preview={
                    <div className="grid gap-3 md:grid-cols-3 w-full">
                        {['menuConfig', 'LayoutDefault', 'MockDataProvider'].map((item) => (
                            <div key={item} className="card p-4">
                                <p className="text-sm font-semibold">{item}</p>
                                <p className="mt-1 text-xs text-muted-foreground">Configured once</p>
                            </div>
                        ))}
                    </div>
                }
                code={`import React from 'react';
import { createRoot } from 'react-dom/client';
import { App } from 'react-firestrap';
import 'react-firestrap/dist/index.css';
import { menu } from './conf/menu';
import AppLayout from './layouts/AppLayout';

const mockData = {
  '/users': {
    alice: { name: 'Alice', email: 'alice@example.com', role: 'admin' },
  },
};

createRoot(document.getElementById('root')!).render(
  <App
    LayoutDefault={AppLayout}
    menuConfig={menu}
    providers={{
      default: 'mock',
      mock: { data: mockData },
    }}
    iconProvider="lucide"
    themeProvider="default"
  />
);`}
            />

            <Section
                title="First CRUD page"
                description="Grid reads from the active DataProvider. Add, edit and delete actions can open a Form automatically."
                preview={
                    <div className="alert alert-warning text-sm w-full">
                        See Components &gt; Grid for the live interactive version.
                    </div>
                }
                code={`import { Grid } from 'react-firestrap';

export default function UsersPage() {
  return (
    <Grid
      dataStoragePath="/users"
      columns={[
        { key: 'name',  label: 'Name', sort: true },
        { key: 'email', label: 'Email' },
        { key: 'role',  label: 'Role' },
      ]}
      allowedActions={['add', 'edit', 'delete']}
      modal={{ mode: 'form' }}
      type="table"
    />
  );
}`}
            />
        </PageLayout>
    );
}
