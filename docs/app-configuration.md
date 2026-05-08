---
title: App configuration
group: Getting started
order: 50
path: /docs/app-configuration
description: App is the orchestration point for routing, layout, providers, theme, icons and external services.
---

# App configuration

A scaffolded consumer mounts `App` from `src/index.tsx` and keeps wiring inside `src/conf`.

```tsx
import React from 'react';
import { createRoot } from 'react-dom/client';
import { App } from 'react-firestrap';
import './styles/globals.css';

import AppLayout from './layouts/AppLayout';
import { appConfig } from './conf/app';
import { menu } from './conf/menu';
import { mockData } from './data/mockData';

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App
      LayoutDefault={AppLayout}
      menuConfig={menu}
      providers={{
        default: appConfig.provider,
        mock: {
          data: mockData,
        },
      }}
      iconProvider={appConfig.iconProvider}
      themeProvider={appConfig.themeProvider}
    />
  </React.StrictMode>
);
```

## Configuration From Env

Vite exposes client configuration through `import.meta.env`.

```ts
const env = import.meta.env;

export const appConfig = {
  provider: env.VITE_PROVIDER ?? 'mock',
  iconProvider: env.VITE_ICON_PROVIDER ?? 'lucide',
  themeProvider: env.VITE_THEME_PROVIDER ?? 'default',
};
```

## Provider Configuration

Use `providers` to declare available backends and choose which one powers each service:

```tsx
<App
  menuConfig={menu}
  LayoutDefault={AppLayout}
  providers={{
    firebase: {
      config: firebaseConfig,
    },
    supabase: {
      config: supabaseConfig,
    },
    google: {
      oAuth2: googleOAuth2,
    },
    services: {
      data: 'firebase',
      storage: 'supabase',
      auth: 'google',
    },
  }}
  iconProvider="lucide"
  themeProvider="default"
/>;
```

Provider classes are created internally. Custom adapters remain available through `providers.custom`.
