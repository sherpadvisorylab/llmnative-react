---
title: Routing & menu
group: Getting started
order: 60
path: /docs/menu-config
description: menuConfig is the single source of truth for routes, sidebar navigation and page loading.
---

# Routing & menu

`menuConfig` is the single object that drives both React Router and the sidebar simultaneously. Every route the app can render must appear here — there is no separate router file.

```ts
// src/conf/menu.ts
import type { MenuConfig } from 'react-firestrap';
import HomePage  from '../pages/home/HomePage';
import UsersPage from '../pages/users/UsersPage';

export const menuConfig: MenuConfig = {
  main: [
    { path: '/',      title: 'Home',  icon: 'home',  page: HomePage },
    { path: '/users', title: 'Users', icon: 'users', page: UsersPage, group: 'Data' },
  ],
};

// ⚠️ The sidebar reads `title`, not `label`. Always use `title` for the display name.
```

Pass it to `<App>`:

```tsx
<App menuConfig={menuConfig} importPage={(path) => import(path)} ... />
```

---

## `MenuConfig` — structure

`MenuConfig` is an object whose keys are **section names** and whose values are arrays of `MenuEntry`. The framework builds one React Router `<Routes>` tree from all sections combined; each section can be read independently by the sidebar via `useMenu(sectionName)`.

```ts
type MenuConfig = {
  [sectionName: string]: MenuEntry[];
};
```

Typical section names:

| Key | Convention |
|-----|------------|
| `default` | Main routes not shown in a named sidebar (e.g. home, 404) |
| `main` / `app` | Primary navigation shown in the main sidebar |
| `docs` | Documentation section with its own sidebar |
| `admin` | Admin area with a separate layout |
| `_nav` | Internal redirect routes — underscore prefix hides from sidebars by convention |

Any key name is valid. Use whatever makes sense for your app structure.

---

## `MenuEntry` — all fields

```ts
interface MenuEntry {
  /** Route path registered with React Router. Must be unique. Required. */
  path: string;

  /**
   * Sidebar label. Omit for routes that should not appear in navigation
   * (redirects, layout wrappers, etc.).
   */
  title?: string;

  /** Icon name passed to <Icon>. Displayed next to title in the sidebar. */
  icon?: string;

  /**
   * Sidebar section header. Entries with the same group value are rendered
   * under a shared heading. Entries without a group appear at the top level.
   */
  group?: string;

  /** Badge text or count shown next to the title (e.g. 'New', 3). */
  badge?: string | number;

  /**
   * Page component to render at this route.
   *
   * Two forms:
   *   - Static:  page: MyPage           — component is always bundled
   *   - Dynamic: page: () => import('../pages/MyPage')  — code-split
   *
   * If omitted, the framework derives the page file from path automatically
   * (see Auto page loading below).
   */
  page?: React.ComponentType
       | (() => Promise<{ default: React.ComponentType }>);

  /**
   * Layout component for this specific route. Overrides LayoutDefault from App.
   * Useful when one section of the app needs a different shell (e.g. full-screen,
   * no sidebar, or a different topbar).
   * Accepts React.ComponentType only — not a string.
   */
  layout?: React.ComponentType;

  /**
   * Overrides the auto-derived page file path.
   * Use when the file does not follow the path→PascalCase convention.
   * Value is appended to './pages/', e.g. component: 'auth/Login' → './pages/auth/Login.js'
   */
  component?: string;

  /**
   * React Router `end` prop for active-link matching.
   * Set to true on the root route (path: '/') to prevent it from matching
   * every path that starts with '/'.
   */
  end?: boolean;

  /** Nested entries — produce an expandable submenu in the sidebar. */
  children?: MenuEntry[];
}
```

---

## Page loading

### Explicit (recommended for Vite)

Pass a static import or a dynamic import factory directly on the `page` field. Vite analyses the import at build time and handles code splitting automatically.

```ts
// Static — always bundled with the main chunk
{ path: '/dashboard', title: 'Dashboard', page: DashboardPage }

// Dynamic — code-split into a separate chunk, loaded on first navigation
{ path: '/reports', title: 'Reports', page: () => import('../pages/reports/ReportsPage') }
```

### Auto (convention-based)

When `page` is omitted, the framework derives the page file from the route path using a **path → PascalCase** conversion and calls `importPage` with the resulting path.

| Route path | Derived file |
|------------|-------------|
| `/` | `./pages/Home.js` |
| `/users` | `./pages/Users.js` |
| `/admin` | `./pages/Admin.js` |
| `/admin/users` | `./pages/admin/Users.js` |
| `/admin/user-settings` | `./pages/admin/UserSettings.js` |
| `/settings/profile` | `./pages/settings/Profile.js` |
| `/settings/user-profile` | `./pages/settings/UserProfile.js` |

The rule: **only the last path segment is PascalCased** — the folder structure is preserved exactly. Hyphens and underscores in the last segment are treated as word separators (`user-settings` → `UserSettings`). All intermediate segments are kept as-is.

The `importPage` function you pass to `<App>` is called with the derived path:

```tsx
// src/index.tsx
<App
  importPage={(path) => import(/* @vite-ignore */ path)}
  ...
/>
```

> **Tip:** In a Vite project, use `/* @vite-ignore */` to suppress the warning about non-static import paths. For full Vite optimization, prefer explicit `page:` imports which are statically analysable.

Override the derived path for a specific entry using `component`:

```ts
// File lives at pages/auth/LoginPage.tsx — path convention would miss it
{ path: '/login', component: 'auth/LoginPage' }
```

---

## Per-route layout

Override `LayoutDefault` for a specific route by setting `layout` on the entry. The value must be a React component that renders `<Outlet />`.

```ts
import FullscreenLayout from '../layouts/FullscreenLayout';

{ path: '/editor', title: 'Editor', page: EditorPage, layout: FullscreenLayout }
```

---

## Nested menus (submenus)

`children` produces an expandable submenu in the sidebar. Child entries are also registered as full React Router routes — their paths must be complete (not relative).

```ts
{
  path: '/settings',
  title: 'Settings',
  icon: 'settings',
  children: [
    { path: '/settings/profile',  title: 'Profile',  page: ProfilePage },
    { path: '/settings/billing',  title: 'Billing',  page: BillingPage },
    { path: '/settings/security', title: 'Security', page: SecurityPage },
  ],
}
```

---

## Multiple sections

Use multiple sections when different parts of the app need separate sidebars or layouts:

```ts
export const menuConfig: MenuConfig = {
  // Routes rendered by the main app shell
  app: [
    { path: '/dashboard', title: 'Dashboard', icon: 'layout-dashboard', page: DashboardPage, group: 'Overview' },
    { path: '/users',     title: 'Users',     icon: 'users',            page: UsersPage,    group: 'Data' },
  ],

  // Documentation section with its own sidebar
  docs: [
    { path: '/docs',           title: 'Introduction', page: DocsIntroPage, group: 'Getting started' },
    { path: '/docs/api',       title: 'API reference', page: ApiRefPage,   group: 'Reference' },
  ],

  // Internal redirects — not shown in any sidebar
  _nav: [
    { path: '/', page: () => React.createElement(Navigate, { to: '/dashboard', replace: true }) },
  ],
};
```

Read a specific section in your layout component:

```tsx
import { useMenu } from 'react-firestrap';

function Sidebar() {
  const items = useMenu('app');  // section name as string

  return (
    <nav>
      {items.map((item) => (
        <a
          key={item.path}
          href={item.path}
          className={item.active ? 'active' : ''}
        >
          {item.title}
        </a>
      ))}
    </nav>
  );
}
```

`useMenu` returns the section with an `active` boolean added to each entry (and recursively to children), derived from the current React Router location.

---

## Redirect routes

Use React Router's `<Navigate>` to redirect one path to another. This is the standard pattern for index routes that should point to a default child page:

```tsx
import React from 'react';
import { Navigate } from 'react-router-dom';

_nav: [
  {
    path: '/components',
    page: () => React.createElement(Navigate, { to: '/components/overview', replace: true }),
  },
],
```

---

## Group labels

The `group` field on a `MenuEntry` controls the section header rendered in the sidebar above that entry. All consecutive entries sharing the same `group` value are visually grouped together.

```ts
app: [
  { path: '/dashboard', title: 'Dashboard', group: 'Overview' },
  { path: '/analytics', title: 'Analytics', group: 'Overview' },
  { path: '/users',     title: 'Users',     group: 'Data' },
  { path: '/products',  title: 'Products',  group: 'Data' },
  // entries without group appear ungrouped at the top
],
```
