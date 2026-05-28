---
title: Manual setup
group: Getting started
order: 30
path: /docs/manual-setup
description: Add @llmnative/react to an existing Vite React project without the scaffold.
---

# Manual setup

Use this path when adding @llmnative/react to an existing Vite React app or when you prefer full control over the project structure. The scaffold does all of this automatically - see [Quick start](/docs/quick-start) if you are starting fresh.

---

## 1. Install

```bash
npm install @llmnative/react
npm install react react-dom react-router-dom
```

If you plan to use Firebase, also install:

```bash
npm install firebase
```

---

## 2. CSS entry point

Import the library stylesheet once at the top of your app entry. It provides the validated global compatibility classes from `globals.css` plus the `--rf-*` CSS custom properties used by the theme system.

```ts
// src/index.tsx (or main.tsx)
import '@llmnative/react/dist/index.css';
```

---

## 3. Tailwind v4 bridge

If you use Tailwind v4, add this `@theme inline` block to your CSS entry so utilities like `bg-primary` and `text-success` track the active theme at runtime.

```css
/* src/styles/globals.css */
@import "tailwindcss";
@import "@llmnative/react/dist/index.css";

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
import { Brand, Menu } from '@llmnative/react';

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

Define your navigation tree in a dedicated file.

```ts
// src/conf/menu.ts
import type { MenuConfig } from '@llmnative/react';

export const menuConfig: MenuConfig = [
  { label: 'Home', icon: 'home', path: '/home' },
  { label: 'Users', icon: 'users', path: '/users' },
];
```

---

## 6. Mount App

`<App>` is the single orchestration point. Mount it once at the root of your application:

```tsx
// src/index.tsx
import React from 'react';
import { createRoot } from 'react-dom/client';
import { App, type AIConfig, type AppProvidersConfig } from '@llmnative/react';
import './styles/globals.css';

import AppLayout from './layouts/AppLayout';
import { menuConfig } from './conf/menu';

const mockData = {
  '/users': {
    alice: { name: 'Alice', email: 'alice@example.com', role: 'admin' },
  },
};

const aiConfig: AIConfig = {
  openaiApiKey: import.meta.env.VITE_OPENAI_API_KEY,
};

const providers: AppProvidersConfig = {
  mock: { data: mockData },
  services: {
    data: 'mock',
    ai: 'openai',
  },
};

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App
      LayoutDefault={AppLayout}
      menuConfig={menuConfig}
      providers={providers}
      aiConfig={aiConfig}
      iconProvider="lucide"
      themeProvider="default"
      importPage={(path) => import(/* @vite-ignore */ path)}
    />
  </React.StrictMode>
);
```

---

## 7. Switch to real providers

When you are ready to connect to Firebase and an AI provider, add credentials to `.env` and update the central config:

```bash
npm install firebase
```

```ts
// .env
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_PROJECT_ID=...
VITE_OPENAI_API_KEY=...
```

```tsx
<App
  providers={{
    firebase: { config: firebaseConfig },
    services: {
      data: 'dbRealtime',
      storage: 'firestorage',
      auth: 'googleAuth',
      ai: 'openai',
    },
  }}
  aiConfig={{
    openaiApiKey: import.meta.env.VITE_OPENAI_API_KEY,
  }}
/>
```

The important rule is always the same: pages talk to framework services, not to vendor SDKs directly.

---

## Next steps

| Goal | Where to go |
|------|-------------|
| All `<App>` props and types | [App reference](/docs/app-configuration) |
| Understand the AI service slot | [AIProvider](/providers/ai) |
| Customize colors, radius, font | [Theme system](/docs/theme) |
| Change the icon library | [Icon system](/docs/icons) |
| Build a CRUD page | [Core patterns](/docs/patterns) |

