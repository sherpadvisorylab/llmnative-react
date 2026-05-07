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
import { App, MockDataProvider } from 'react-firestrap';
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
      dataProvider={new MockDataProvider(mockData)}
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
  dataProvider: env.VITE_DATA_PROVIDER ?? 'mock',
  iconProvider: env.VITE_ICON_PROVIDER ?? 'lucide',
  themeProvider: env.VITE_THEME_PROVIDER ?? 'default',
};
```

## Provider shorthand

Use strings when the built-in defaults are enough:

```tsx
<App
  menuConfig={menu}
  LayoutDefault={AppLayout}
  dataProvider={dataProvider}
  iconProvider="lucide"
  themeProvider="default"
/>;
```

Use objects when you need custom presets, registries or overrides.
