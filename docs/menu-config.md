---
title: Routing & menu
group: Getting started
order: 60
path: /docs/menu-config
description: menuConfig is the single source for routes, labels, groups and page components.
---

# Routing & menu

`menuConfig` defines routes and navigation metadata. In Vite consumers, the recommended pattern is to import pages explicitly.

```tsx
import HomePage from '../pages/home/HomePage';
import UsersPage from '../pages/users/UsersPage';

export const menu = {
  main: [
    { path: '/', title: 'Home', page: HomePage },
    { path: '/users', title: 'Users', page: UsersPage, group: 'Data' },
  ],
};
```

## Sections

A menu can expose multiple sections: `default`, `docs`, `components`, `providers`, `examples`. Layouts read one section at a time with `useMenu(type)`.

```tsx
import { useMenu } from 'react-firestrap';

function Sidebar() {
  const items = useMenu('docs');

  return (
    <nav>
      {items.map((item) => (
        <a key={item.path} href={item.path}>
          {item.title}
        </a>
      ))}
    </nav>
  );
}
```

## Redirect Routes

When a root route should point to a concrete child page, use `Navigate`.

```tsx
import React from 'react';
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
};
```
