---
title: Quick start
group: Getting started
order: 30
path: /docs/quick-start
description: Create an app, mount App and render a first provider-backed CRUD screen.
---

# Quick start

The recommended path is to start from the scaffold.

```bash
npx react-firestrap create
cd my-app
npm install
npm run dev
```

## Mount App

`App` orchestrates routing, providers, theme and icons. To start without external services, configure the built-in mock provider.

```tsx
import React from 'react';
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
      mock: {
        data: mockData,
      },
    }}
    iconProvider="lucide"
    themeProvider="default"
  />
);
```

## First CRUD Page

`Grid` reads from the active `DataProvider`. Actions such as add, edit and delete can automatically open a `Form`.

```tsx
import { Grid } from 'react-firestrap';

export default function UsersPage() {
  return (
    <Grid
      dataStoragePath="/users"
      columns={[
        { key: 'name', label: 'Name', sort: true },
        { key: 'email', label: 'Email' },
        { key: 'role', label: 'Role' },
      ]}
      allowedActions={['add', 'edit', 'delete']}
      modal={{ mode: 'form' }}
      type="table"
    />
  );
}
```

See also [App configuration](./app-configuration.md) and [Routing & menu](./menu-config.md).
