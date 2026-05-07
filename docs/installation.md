---
title: Installation
group: Getting started
order: 20
path: /docs/installation
description: Install react-firestrap through the official scaffold or inside an existing Vite React project.
---

# Installation

For new projects, use the official scaffold. It generates Vite, `App`, menu wiring, layout, theme, icons and providers.

```bash
npx react-firestrap create
cd my-app
npm install
npm run dev
```

For repeatable scenarios, CI or fixtures:

```bash
npx react-firestrap create --yes --provider=mock
```

## Manual Installation

Use this path when adding react-firestrap to an existing Vite React app.

```bash
npm install react-firestrap
npm install react react-dom react-router-dom firebase
```

Import the CSS once in the application entry point:

```tsx
import 'react-firestrap/dist/index.css';
```

Then mount `App` with menu, layout and provider configuration:

```tsx
import { App, FirebaseDataProvider } from 'react-firestrap';
import { menu } from './conf/menu';
import AppLayout from './layouts/AppLayout';

<App
  menuConfig={menu}
  LayoutDefault={AppLayout}
  dataProvider={new FirebaseDataProvider()}
  iconProvider="lucide"
  themeProvider="default"
/>;
```

Continue with [Quick start](./quick-start.md) to create the first CRUD page.
