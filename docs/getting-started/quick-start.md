---
title: Quick start
group: Getting started
order: 20
path: /docs/quick-start
description: From zero to a running app in under 5 minutes using the official scaffold.
---

# Quick start

The fastest path is the official scaffold. Run one command, answer a few prompts, and you have a fully wired Vite app with routing, theme, icons, and all service slots ready.

```bash
npx @llmnative/react create
cd my-app
npm install
npm run dev
```

Your app is running at `http://localhost:5173`.

> **Adding to an existing project?** Skip to [Manual setup](/docs/manual-setup) instead.

---

## The prompts

| Prompt | Recommended for a first run |
|--------|-----------------------------|
| Project name | any |
| Data provider | `mock` - no credentials needed |
| AI provider | `none` for a clean start, `openai` if you want AI features immediately |
| Icon provider | `lucide` |
| Theme | `default` |
| App template | `blank` - or pick one that matches your use case |

You can change every choice later without re-scaffolding. The generated app keeps provider wiring centralized in `src/conf/app.ts`.

---

## App templates

The scaffold asks which kind of app you are building and generates starter pages and mock data to match.

| Template | What it generates |
|----------|-------------------|
| `blank` | Home page with a simple task list - clean starting point |
| `crm` | Contacts, Companies, Deals pipeline grouped by stage |
| `admin` | Users, Roles, Settings singleton form |
| `inventory` | Products with price formatting, Categories, stock overview |
| `project` | Projects, Tasks grouped by status, Team |

All templates use the same sidebar shell - only the pages and mock data differ.

---

## What you have

The scaffold generates a conventional folder layout. The exact pages depend on the template you chose; the wiring is always the same.

```text
src/
  conf/
    app.ts        <- central wiring: data, storage, auth, email, ai, theme, icons
    menu.ts       <- navigation tree (template-specific)
  layouts/
    Default.tsx   <- shell: header + sidebar + <Outlet />
  sections/
    Header.tsx    <- topbar with Brand, Menu, Notifications
    Sidebar.tsx   <- responsive sidebar using <Menu>
    Footer.tsx
    PageHeader.tsx<- breadcrumbs
    PreLoader.tsx <- initial spinner
  pages/          <- starter pages (template-specific)
  data/
    mockData.ts   <- fixture data for MockDataProvider
  styles/
    globals.css   <- Tailwind v4 + --rf-* color bridge
  index.tsx       <- Vite entry: mounts <App>
```

Open `src/conf/menu.ts` and `src/conf/app.ts` first. Those two files are where almost all configuration lives.

---

## AI in scaffolded apps

If you choose an AI provider during scaffolding, the generator will:

- add `VITE_AI_PROVIDER` to `.env`
- add the relevant API key variable (`VITE_OPENAI_API_KEY`, `VITE_GEMINI_API_KEY`, etc.)
- generate `aiConfig` in `src/conf/app.ts`
- set `providers.services.ai` so `Prompt`, `AssistantAI`, and `AI.fetch(...)` all use the same orchestrator

The public API stays stable. Switching from `openai` to `gemini` should be a config change in `src/conf/app.ts`, not a component rewrite.

---

## Write your first CRUD page

Create `src/pages/users/UsersPage.tsx`:

```tsx
import { Grid } from '@llmnative/react';

export default function UsersPage() {
  return (
    <Grid
      path="/users"
      order={{ name: 'asc' }}
      columns={[
        { key: 'name', label: 'Name', sortable: true },
        { key: 'email', label: 'Email' },
        { key: 'role', label: 'Role' },
      ]}
      title="Users"
      sortable={{ field: 'name', dir: 'asc' }}
      form={<UserFormFields />}
      layout="table"
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

`Grid` reads and writes through the active `DataProvider`. With `mock`, data lives in memory and resets on reload. Switch the provider to `firebase` or `supabase` in `src/conf/app.ts` when you are ready for persistence.

---

## Next steps

| Goal | Where to go |
|------|-------------|
| Understand every generated file | [Scaffold output](/docs/scaffolding) |
| Add Firebase / Supabase / AI | [App reference](/docs/app-configuration) |
| Customize colors, radius, font | [Theme system](/docs/theme) |
| Change the icon library | [Icon system](/docs/icons) |
| Add nested fields, array inputs | [Core patterns](/docs/patterns) |

