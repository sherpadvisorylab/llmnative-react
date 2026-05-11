---
title: Scaffold output
group: Architecture
order: 50
path: /docs/scaffolding
description: A detailed walkthrough of every file the scaffold generates and how to modify each one.
---

# Scaffold output

This page is a file-by-file reference for everything the scaffold generates. If you haven't run it yet, start with [Quick start](/docs/quick-start). If you are adding react-firestrap to an existing project, see [Manual setup](/docs/manual-setup).

Every generated file is yours to edit freely — the scaffold never overwrites after the initial generation.

```bash
npx react-firestrap create
```

For CI or non-interactive environments, skip all prompts with `--yes` and pass answers as flags:

```bash
npx react-firestrap create --yes --name=my-app --provider=mock --theme=flat --template=crm
```

---

## Prompts

The scaffold asks six questions. Every choice can be changed after generation — nothing is locked in.

| Prompt | Options | Effect |
|--------|---------|--------|
| Project name | any string | Sets the folder name and `package.json` name |
| Data provider | `firebase` · `supabase` · `mock` · `custom` | Wires the correct `DataProviderAdapter`; generates `.env` stubs for credentials |
| Icon provider | `lucide` · `phosphor` | Sets `iconProvider` in `conf/app.ts` |
| Theme | `default` · `flat` · `cyber` | Sets the visual color preset — passed as `themeProvider` to `<App>` |
| App template | `blank` · `crm` · `admin` · `inventory` · `project` | Copies starter pages and mock data for that use case |
| Credentials | varies | Only asked when Firebase or Supabase is selected; written to `.env` as `VITE_*` variables |

---

## Theme vs template

These are two independent choices:

- **Theme** — controls only colors, radius and font. The three built-in options (`default`, `flat`, `cyber`) are full light + dark palettes. Change theme without touching a single page file.
- **Template** — controls the initial page set, mock data and navigation. It has no effect on colors. Change pages without touching the theme.

Any combination is valid: `--theme=cyber --template=crm` gives you a neon CRM, `--theme=flat --template=admin` gives a sharp-edged admin panel.

---

## Generated structure

The scaffold follows a **convention-first** layout. All app-level wiring lives in `conf/` so components never need to import providers directly. Pages are leaf components that use react-firestrap widgets.

```text
my-app/
  index.html
  vite.config.ts
  package.json
  .env                       ← VITE_* provider credentials (never commit this)
  src/
    index.tsx                ← Vite entry: mounts <App>
    conf/
      app.ts                 ← provider, theme, icon provider
      menu.ts                ← navigation tree (template-specific)
    layouts/
      Default.tsx            ← shell: header + sidebar + main + footer
    sections/
      Header.tsx             ← topbar: Brand, Menu, Notifications, SignInButton
      Sidebar.tsx            ← responsive sidebar using <Menu context="sidebar">
      Footer.tsx
      PageHeader.tsx         ← Breadcrumbs above page content
      PreLoader.tsx          ← initial spinner, auto-removes after mount
    pages/                   ← starter pages (varies by template)
    data/
      mockData.ts            ← fixture data used by MockDataProvider
    styles/
      globals.css            ← Tailwind v4 entry + --rf-* → color utility bridge
```

---

## Template starter pages

Each template ships with ready-to-run pages that showcase common react-firestrap patterns.

| Template | Pages generated |
|----------|----------------|
| `blank` | `home/HomePage` — Grid with task list |
| `crm` | `home/HomePage` · `contacts/ContactsPage` · `companies/CompaniesPage` · `deals/DealsPage` |
| `admin` | `home/HomePage` · `users/UsersPage` · `roles/RolesPage` · `settings/SettingsPage` |
| `inventory` | `home/HomePage` · `products/ProductsPage` · `categories/CategoriesPage` |
| `project` | `home/HomePage` · `projects/ProjectsPage` · `tasks/TasksPage` · `team/TeamPage` |

---

## `conf/app.ts`

`conf/app.ts` holds the three runtime choices that `src/index.tsx` reads via `import.meta.env`:

```ts
// src/conf/app.ts
const env = import.meta.env;

export const appConfig = {
  provider:     env.VITE_PROVIDER      ?? 'mock',
  iconProvider: env.VITE_ICON_PROVIDER ?? 'lucide',
  theme:        env.VITE_THEME         ?? 'default',
};
```

Switch the provider at any time by editing `VITE_PROVIDER` in `.env` — no code change needed.

---

## `conf/menu.ts`

`conf/menu.ts` exports the navigation tree consumed by `<App>`. Each entry maps a path to a page component and a sidebar label. The layout shell is attached per route via the `layout` field.

```ts
// src/conf/menu.ts  — example from the crm template
import type { MenuConfig } from 'react-firestrap';
import Default from '../layouts/Default';
import ContactsPage from '../pages/contacts/ContactsPage';

export const menu: MenuConfig = {
  main: [
    { path: '/contacts', title: 'Contacts', icon: 'users', page: ContactsPage, layout: Default, group: 'Sales' },
  ],
};
```

See [Routing & menu](/docs/menu-config) for the full `MenuEntry` interface and all available fields.

---

## `layouts/Default.tsx`

The shell component wired to every route. It renders the Header, Sidebar, main content area and Footer. Edit freely — the scaffold generates it as a plain React component with no hidden magic.

```tsx
export default function Default({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <PreLoader />
      <Header onMenuToggle={() => setSidebarOpen(o => !o)} />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <main className="flex-1 overflow-auto p-4">
          <PageHeader />
          {children}
        </main>
      </div>
      <Footer />
    </div>
  );
}
```

---

## `styles/globals.css` — Tailwind v4 bridge

`src/styles/globals.css` is required for Tailwind color utilities like `bg-primary` or `text-success` to reflect the active theme. It bridges the `--rf-*` CSS custom properties injected at runtime by `ThemeProvider` into Tailwind v4's `@theme inline` layer.

Without this file, `bg-primary` compiles to a static color that ignores theme changes. With it, the utility always reflects the current `--rf-primary` value.

```css
@import "tailwindcss";
@import "react-firestrap/dist/index.css";

@theme inline {
  --color-background: hsl(var(--rf-background));
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
  /* … all 25 tokens */
}

body {
  font-family:      var(--font-sans);
  background-color: hsl(var(--rf-background));
  color:            hsl(var(--rf-foreground));
}
```

---

## After scaffolding

Typical first steps after `npx react-firestrap create`:

1. **Fill in credentials** — open `.env` and add your Firebase / Supabase keys if you chose a real provider.
2. **Edit the menu** — open `src/conf/menu.ts` and add or replace routes for your app.
3. **Add a page** — create `src/pages/my-feature/MyFeaturePage.tsx`, add the route to `conf/menu.ts`, and use `<Grid>` or `<Form>` to connect to your data.
4. **Adjust the theme** — change `VITE_THEME` in `.env` to switch presets, or pass a full `ThemePresetConfig` object to `themeProvider` in `src/index.tsx` for custom colors. See [Theme system](/docs/theme).
