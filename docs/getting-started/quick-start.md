---
title: Quick start
group: Getting started
order: 20
path: /docs/quick-start
description: From zero to a running app in under 5 minutes using the official scaffold.
---

# Quick start

The fastest path is the official scaffold. Run one command, answer a few prompts, and you have a fully wired Vite app with routing, providers, theme and icons ready.

```bash
npx react-firestrap create
cd my-app
npm install
npm run dev
```

Your app is running at `http://localhost:5173`.

> **Adding to an existing project?** Skip to [Manual setup](/docs/manual-setup) instead.

---

## The prompts

| Prompt | Recommended for a first run |
|--------|----------------------------|
| Project name | any |
| Data provider | `mock` — no credentials needed |
| Icon provider | `lucide` |
| Theme | `default` |
| App template | `blank` — or pick one that matches your use case |

You can change every choice later without re-scaffolding — they're just configuration values in `src/conf/app.ts`.

---

## App templates

The scaffold asks which kind of app you are building and generates starter pages and mock data to match.

| Template | What it generates |
|----------|-------------------|
| `blank` | Home page with a simple task list — clean starting point |
| `crm` | Contacts, Companies, Deals pipeline grouped by stage |
| `admin` | Users, Roles, Settings singleton form |
| `inventory` | Products with price formatting, Categories, stock overview |
| `project` | Projects, Tasks grouped by status, Team |

All templates use the same sidebar shell — only the pages and mock data differ.

---

## What you have

The scaffold generates a conventional folder layout. The exact pages depend on the template you chose; the wiring is always the same.

```text
src/
  conf/
    app.ts        ← central wiring: provider, theme, icons
    menu.ts       ← navigation tree (template-specific)
  layouts/
    Default.tsx   ← shell: header + sidebar + <Outlet />
  sections/
    Header.tsx    ← topbar with Brand, Menu, Notifications
    Sidebar.tsx   ← responsive sidebar using <Menu>
    Footer.tsx
    PageHeader.tsx← breadcrumbs
    PreLoader.tsx ← initial spinner
  pages/          ← starter pages (template-specific)
  data/
    mockData.ts   ← fixture data for MockDataProvider
  styles/
    globals.css   ← Tailwind v4 + --rf-* color bridge
  index.tsx       ← Vite entry: mounts <App>
```

Open `src/conf/menu.ts` and `src/conf/app.ts` — these two files are where almost all configuration lives.

---

## Write your first CRUD page

Create `src/pages/users/UsersPage.tsx`:

```tsx
import { Grid } from 'react-firestrap';

export default function UsersPage() {
  return (
    <Grid
      providerPath="/users"
      columns={[
        { key: 'name',  label: 'Name',  sort: true },
        { key: 'email', label: 'Email' },
        { key: 'role',  label: 'Role' },
      ]}
      order={{ field: 'name', dir: 'asc' }}
      actions={{ default: { add: true, edit: true, delete: true } }}
      editor={{ mode: 'modal', form: <UserFormFields /> }}
      view="table"
      pagination={{ limit: 20, align: 'end' }}
    />
  );
}
```

Then add it to `src/conf/menu.ts`:

```ts
import Default from '../layouts/Default';
import UsersPage from '../pages/users/UsersPage';

{ path: '/users', title: 'Users', icon: 'users', page: UsersPage, layout: Default, group: 'Management' },
```

`Grid` reads and writes through the active `DataProvider` — with `mock`, data lives in memory and resets on reload. Switch the provider to `firebase` in `src/conf/app.ts` when you are ready for persistence.

As the page grows, keep these semantics in mind:

- `order` sets the initial sort in both table and gallery mode.
- `selectedKeys` and `onSelectionChange` share the same contract in `Grid`, `Table` and `Gallery`.
- `onReorder` enables manual drag reorder only when `view="table"`.

---

## Next steps

| Goal | Where to go |
|------|-------------|
| Understand every generated file | [Scaffold output](/docs/scaffolding) |
| Add Firebase / Supabase | [App reference](/docs/app-configuration) → Provider configuration |
| Customize colors, radius, font | [Theme system](/docs/theme) |
| Change the icon library | [Icon system](/docs/icons) |
| Add nested fields, array inputs | [Core patterns](/docs/patterns) |
