---
title: Manual setup
group: Getting started
order: 30
path: /docs/manual-setup
description: Add react-firestrap to an existing Vite React project without the scaffold.
---

# Manual setup

Use this path when adding react-firestrap to an existing Vite React app or when you prefer full control over the project structure. The scaffold does all of this automatically — see [Quick start](/docs/quick-start) if you are starting fresh.

---

## 1. Install

```bash
npm install react-firestrap
npm install react react-dom react-router-dom
```

If you plan to use Firebase, also install:

```bash
npm install firebase
```

---

## 2. CSS entry point

Import the library stylesheet once at the top of your app entry. It provides the compatibility layer (`btn`, `badge`, `modal`, etc.) and the `--rf-*` CSS custom properties used by the theme system.

```ts
// src/index.tsx  (or main.tsx)
import 'react-firestrap/dist/index.css';
```

---

## 3. Tailwind v4 bridge

If you use Tailwind v4, add this `@theme inline` block to your CSS entry so that utilities like `bg-primary` and `text-success` track the active theme at runtime. Without it, those utilities compile to static values that ignore theme changes.

```css
/* src/styles/globals.css */
@import "tailwindcss";
@import "react-firestrap/dist/index.css";

@theme inline {
  --color-background:  hsl(var(--rf-background));
  --color-foreground:  hsl(var(--rf-foreground));
  --color-primary:     hsl(var(--rf-primary));
  --color-secondary:   hsl(var(--rf-secondary));
  --color-muted:       hsl(var(--rf-muted));
  --color-accent:      hsl(var(--rf-accent));
  --color-destructive: hsl(var(--rf-destructive));
  --color-success:     hsl(var(--rf-success));
  --color-warning:     hsl(var(--rf-warning));
  --color-info:        hsl(var(--rf-info));
  --color-border:      hsl(var(--rf-border));
  --color-input:       hsl(var(--rf-input));
  --color-ring:        hsl(var(--rf-ring));
}

body {
  font-family:      var(--font-sans);
  background-color: hsl(var(--rf-background));
  color:            hsl(var(--rf-foreground));
}
```

---

## 4. Layout component

`<App>` renders pages inside `LayoutDefault`. Create a shell component that wraps `<Outlet />` from React Router:

```tsx
// src/layouts/AppLayout.tsx
import { Outlet } from 'react-router-dom';
import { Menu, Brand } from 'react-firestrap';

export default function AppLayout() {
  return (
    <div className="flex h-screen">
      <aside className="w-64 border-r p-4">
        <Brand label="My App" />
        <Menu />
      </aside>
      <main className="flex-1 overflow-auto p-6">
        <Outlet />
      </main>
    </div>
  );
}
```

---

## 5. Menu configuration

Define your navigation tree in a dedicated file. Each entry maps a label and icon to a route; nested entries produce submenus.

```ts
// src/conf/menu.ts
import type { MenuConfig } from 'react-firestrap';

export const menuConfig: MenuConfig = [
  { label: 'Home',  icon: 'home',  path: '/home' },
  { label: 'Users', icon: 'users', path: '/users' },
];
```

See [Routing & menu](/docs/menu-config) for the full `MenuConfig` type and all options.

---

## 6. Mount App

`<App>` is the single orchestration point. Mount it once at the root of your application:

```tsx
// src/index.tsx
import React from 'react';
import { createRoot } from 'react-dom/client';
import { App } from 'react-firestrap';
import './styles/globals.css';

import AppLayout from './layouts/AppLayout';
import { menuConfig } from './conf/menu';

const mockData = {
  '/users': {
    alice: { name: 'Alice', email: 'alice@example.com', role: 'admin' },
  },
};

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App
      LayoutDefault={AppLayout}
      menuConfig={menuConfig}
      providers={{
        mock: { data: mockData },
        services: { data: 'mock' },
      }}
      iconProvider="lucide"
      themeProvider="default"
      importPage={(path) => import(/* @vite-ignore */ path)}
    />
  </React.StrictMode>
);
```

---

## 7. Switch to a real provider

When you are ready to connect to Firebase, install it, add credentials to `.env`, and update the `providers` config:

```bash
npm install firebase
```

```ts
// .env
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_PROJECT_ID=...
```

```tsx
import { initializeApp } from 'firebase/app';

const firebaseConfig = {
  apiKey:    import.meta.env.VITE_FIREBASE_API_KEY,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  // … other Firebase config fields
};

<App
  providers={{
    firebase: { config: firebaseConfig },
    services: { data: 'dbRealtime', storage: 'firestorage', auth: 'googleAuth' },
  }}
  // … rest of props
/>
```

---

## Next steps

| Goal | Where to go |
|------|-------------|
| All `<App>` props and types | [App reference](/docs/app-configuration) |
| Customize colors, radius, font | [Theme system](/docs/theme) |
| Change the icon library | [Icon system](/docs/icons) |
| Build a CRUD page | [Core patterns](/docs/patterns) |
