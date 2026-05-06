import React from 'react';
import PageLayout from '../../components/PageLayout';
import Section from '../../components/Section';

export default function MenuConfig() {
    return (
        <PageLayout
            title="Menu config"
            description="menuConfig is the single source for application routes, navigation metadata and page components."
        >
            <div className="space-y-8">
                <Section
                    title="Single source"
                    description="Keep the menu in src/conf/menu.ts and pass it to App. This keeps routing and navigation metadata together."
                    preview={
                        <div className="grid gap-3 text-sm md:grid-cols-3 w-full">
                            {['path', 'title', 'page'].map((item) => (
                                <div key={item} className="rounded-md border bg-card p-3 font-medium">{item}</div>
                            ))}
                        </div>
                    }
                    code={`// src/conf/menu.ts
import HomePage from '../pages/home/HomePage';
import UsersPage from '../pages/users/UsersPage';

export const menu = {
  main: [
    { path: '/', title: 'Home', page: HomePage },
    { path: '/users', title: 'Users', page: UsersPage },
  ],
};

// src/index.tsx
<App menuConfig={menu} />`}
                />

                <Section
                    title="Menu sections"
                    description="A menu config can expose several named sections. Layouts can read one section at a time with useMenu(type)."
                    preview={
                        <div className="grid gap-3 text-sm md:grid-cols-4 w-full">
                            {['default', 'docs', 'components', 'providers'].map((item) => (
                                <div key={item} className="rounded-md border bg-card p-3">{item}</div>
                            ))}
                        </div>
                    }
                    code={`export const menu = {
  default: [
    { path: '/', page: HomePage },
  ],

  docs: [
    { path: '/docs', title: 'Overview', page: DocsOverview, group: 'Getting started' },
    { path: '/docs/scaffolding', title: 'Scaffolding', page: Scaffolding, group: 'Getting started' },
  ],

  components: [
    { path: '/components/button', title: 'Button', page: ButtonPage, group: 'UI primitives' },
    { path: '/components/grid', title: 'Grid', page: GridPage, group: 'Widgets' },
  ],
};`}
                />

                <Section
                    title="Reading menu state"
                    description="useMenu() returns items with active state already resolved from the current location."
                    preview={
                        <div className="alert alert-info text-sm w-full">
                            Use this in sidebars, topbars and contextual navigation.
                        </div>
                    }
                    code={`import { useMenu } from 'react-firestrap';

function Sidebar() {
  const items = useMenu('docs');

  return (
    <nav>
      {items.map((item) => (
        <a
          key={item.path}
          href={item.path}
          className={item.active ? 'text-primary' : 'text-muted-foreground'}
        >
          {item.title}
        </a>
      ))}
    </nav>
  );
}`}
                />

                <Section
                    title="Groups and nested items"
                    description="group is navigation metadata. children define nested routes and nested active state."
                    preview={
                        <div className="grid gap-3 text-sm md:grid-cols-2 w-full">
                            <div className="rounded-md border bg-card p-4">
                                <p className="font-semibold">group</p>
                                <p className="mt-1 text-xs text-muted-foreground">Organize sidebars and menus.</p>
                            </div>
                            <div className="rounded-md border bg-card p-4">
                                <p className="font-semibold">children</p>
                                <p className="mt-1 text-xs text-muted-foreground">Nested routes with inherited active state.</p>
                            </div>
                        </div>
                    }
                    code={`export const menu = {
  docs: [
    {
      path: '/docs/providers',
      title: 'Providers',
      page: ProvidersOverview,
      group: 'Architecture',
      children: [
        { path: '/docs/providers/data', title: 'Data', page: DataProviderDocs },
        { path: '/docs/providers/auth', title: 'Auth', page: AuthProviderDocs },
      ],
    },
  ],
};`}
                />

                <Section
                    title="Redirect routes"
                    description="Use a page component with Navigate when a menu root should redirect to a concrete child page."
                    preview={
                        <div className="flex flex-wrap gap-2">
                            {['/components', '/examples', '/providers'].map((item) => (
                                <span key={item} className="badge bg-secondary">{item}</span>
                            ))}
                        </div>
                    }
                    code={`import React from 'react';
import { Navigate } from 'react-router-dom';

export const menu = {
  _nav: [
    {
      path: '/components',
      page: () => React.createElement(Navigate, {
        to: '/components/button',
        replace: true,
      }),
    },
  ],
};`}
                />

                <Section
                    title="Vite page imports"
                    description="For Vite apps, prefer explicit page imports. It keeps route ownership clear and avoids bundler-specific dynamic path issues."
                    preview={
                        <div className="alert alert-success text-sm w-full">
                            The showcase follows this pattern: every page is imported by src/conf/menu.ts.
                        </div>
                    }
                    code={`import DashboardPage from '../pages/dashboard/DashboardPage';
import UserListPage from '../pages/users/UserListPage';

export const menu = {
  main: [
    { path: '/dashboard', title: 'Dashboard', page: DashboardPage },
    { path: '/users', title: 'Users', page: UserListPage },
  ],
};`}
                />

                <Section
                    title="Dynamic fallback"
                    description="importPage is still available for legacy menu items without a page component, but it should be the fallback path in Vite consumers."
                    preview={
                        <div className="alert alert-warning text-sm w-full">
                            If a menu item has page, App uses it directly and does not call importPage.
                        </div>
                    }
                    code={`<App
  menuConfig={menu}
  importPage={(pageSource) => import(/* @vite-ignore */ pageSource)}
/>

// A menu item without page falls back to:
// ./pages/Home.js for /
// ./pages/Users.js for /users
// ./pages/AdminUsers.js for /admin/users`}
                />

                <Section
                    title="Current showcase pattern"
                    description="The showcase validates the same pattern used by the official scaffold."
                    preview={
                        <div className="grid gap-2 text-sm md:grid-cols-2 w-full">
                            <div className="rounded-md border bg-card p-3">clients/showcase/src/conf/menu.ts</div>
                            <div className="rounded-md border bg-card p-3">clients/showcase/src/index.tsx</div>
                        </div>
                    }
                    code={`import { menu } from './conf/menu';

<App
  menuConfig={menu}
  importPage={(pageSource) => Promise.reject(
    new Error(\`Showcase pages must be declared in src/conf/menu.ts: \${pageSource}\`)
  )}
/>`}
                />
            </div>
        </PageLayout>
    );
}
