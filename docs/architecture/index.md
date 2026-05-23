---
title: Folder structure
group: Architecture
order: 10
path: /docs/architecture
description: How the framework source, providers, components and scaffolded consumer apps are organized.
---

# Folder structure

react-firestrap is organized around a strict **dependency direction**: application pages compose widgets, widgets use fields, fields use primitives, and all persistence sits behind provider interfaces. Nothing lower in the stack imports from something higher.

```
pages / app code
  └── widgets  (Form, Grid)
        └── ui/fields  (Input, Select, Upload)
              └── ui primitives  (Card, Modal, Badge, Button)
                    └── libs  (pure utilities, no React)
providers
  └── concrete adapters behind stable interfaces
```

---

## Framework source — `src/`

The library itself. Published to npm as `@llmnative/react`.

```text
src/
  App.tsx             ← Root component: wires Router, providers, theme, icons
  Config.tsx          ← RuntimeProvider: tenant config, Google, Firebase, Dropbox, AI
  Theme.tsx           ← ThemeProvider + useThemeController hook
  Global.tsx          ← localStorage-backed global state
  Head.tsx            ← HeadProvider for browser metadata (title, og:*, JSON-LD)

  components/
    ui/               ← Presentational primitives (no data fetching)
    │   Alert, Badge, Button, Card, Icon, Image, Loader, Modal,
    │   Pagination, Table, Gallery, Tab, Repeat, GridSystem
    │
    ui/fields/        ← Controlled form fields
    │   Input, Select, Upload, UploadCSV, Prompt, AssistantAI, ImageUrl
    │
    blocks/           ← Layout compositions (use hooks, read from context)
    │   Menu, Brand, Breadcrumbs, Notifications, Search, Carousel, Dropdown
    │
    widgets/          ← Stateful smart components (data-connected)
        Form, Grid, MarkdownReader, ImageEditor

  providers/
    data/             ← DataProviderAdapter + FirebaseDataProvider, SupabaseDataProvider, MockDataProvider
    storage/          ← StorageProviderAdapter + FirebaseStorageProvider, SupabaseStorageProvider
    auth/             ← AuthProviderAdapter + GoogleAuthProvider
    email/            ← EmailProviderAdapter + GmailEmailProvider
    icon/             ← IconProviderAdapter + LucideIconProvider, PhosphorIconProvider
    ai/               ← AI multi-provider (OpenAI, Gemini, Anthropic, DeepSeek, Mistral)
    seo/              ← Google Ads keywords, Trends
    scrape/           ← SerpAPI scraping

  libs/               ← Pure utilities (no React, no providers)
  │   converter, path, sanitizer, cache, fetch, …
  │
  types/              ← Shared TypeScript interfaces and types
  conf/               ← Static configuration (prompt templates)
```

### Dependency rules

- `libs/` must not import React or any component.
- `components/ui` must not import from `widgets` or `providers`.
- `components/` must not import concrete provider implementations (Firebase SDK, Supabase SDK, etc.) directly — use provider interfaces.
- New persistence behavior belongs in `providers/`; shared public types belong in `types/`.

---

## Build output — `dist/`

Vite builds the library in two module formats plus a single CSS bundle:

```text
dist/
  index.mjs       ← ESM build (tree-shakeable, recommended)
  index.js        ← CJS build (for CommonJS consumers)
  index.css       ← All component styles (Bootstrap compatibility layer + CSS tokens)
  types/
    index.d.ts    ← TypeScript declarations
```

Consumers import the stylesheet once at the app entry:

```tsx
import '@llmnative/react/dist/index.css';
```

---

## Scaffolded consumer app — `src/`

When you run `npx ash create`, the scaffold generates this structure. Every folder has a specific role — keeping them separate makes the codebase easy to navigate even as it grows.

```text
src/
  index.tsx             ← Vite entry: mounts <App>, imports globals.css

  conf/
    app.ts              ← Central wiring: exports providers, iconProvider, themeProvider
    menu.ts             ← Navigation tree: all routes + sidebar config
    theme.ts            ← ThemePresetConfig + ThemeConfig (edit freely, never overwritten)

  layouts/
    AppLayout.tsx       ← App shell: sidebar + topbar + <Outlet />
                           Must render <Outlet /> from react-router-dom

  pages/                ← One folder per route, one default export per file
  │   home/
  │     HomePage.tsx
  │   users/
  │     UsersPage.tsx   ← e.g. route /users → file pages/Users.tsx (see convention below)
  │
  sections/             ← Reusable page sections shared across multiple pages
  │                        e.g. a StatsRow used on both Dashboard and Reports
  │
  components/           ← App-specific UI components not in sections
  │                        e.g. a custom StatusBadge or UserAvatar
  │
  data/
    mockData.ts         ← Static fixture data for MockDataProvider (prototyping / tests)

  styles/
    globals.css         ← Tailwind v4 entry + --rf-* → color utility bridge (required)
```

### Page file naming convention

When a `MenuEntry` has no explicit `page:` import, the framework derives the page file from the route path automatically:

| Route | Derived file |
|-------|-------------|
| `/` | `pages/Home.tsx` |
| `/users` | `pages/Users.tsx` |
| `/admin` | `pages/Admin.tsx` |
| `/admin/users` | `pages/admin/Users.tsx` |
| `/admin/user-settings` | `pages/admin/UserSettings.tsx` |
| `/settings/profile` | `pages/settings/Profile.tsx` |
| `/settings/user-profile` | `pages/settings/UserProfile.tsx` |

The rule: **only the last path segment is PascalCased** — the folder structure is preserved. Hyphens and underscores in the last segment become word boundaries (`user-settings` → `UserSettings`). This convention is optional — provide an explicit `page:` import on any `MenuEntry` to bypass it entirely.

### `conf/` — the wiring layer

All app-level configuration lives here. Application pages and components never import providers directly — they go through hooks (`useDataProvider`, `useThemeController`, etc.).

| File | Role |
|------|------|
| `conf/app.ts` | Assembles `providers`, `iconProvider`, `themeProvider` from env vars and sub-configs |
| `conf/menu.ts` | Defines `MenuConfig` — every route and sidebar entry |
| `themes/*.ts` | Self-contained `ThemeDefinition` modules: preset tokens, motion effects and full component configuration |

### `styles/globals.css` — why it is required

`react-firestrap/dist/index.css` injects runtime CSS custom properties (`--rf-primary`, `--rf-background`, etc.) but Tailwind v4 does not know about them at build time. `globals.css` bridges the two systems via `@theme inline`, so utilities like `bg-primary` and `text-success` reflect the active theme at runtime.

```css
@import "tailwindcss";
@import "@llmnative/react/dist/index.css";

@theme inline {
  --color-primary:     hsl(var(--rf-primary));
  --color-background:  hsl(var(--rf-background));
  /* … all 25 tokens */
}

body {
  font-family:      var(--font-sans);
  background-color: hsl(var(--rf-background));
  color:            hsl(var(--rf-foreground));
}
```

Without this file, `bg-primary` compiles to a static value and ignores theme changes at runtime.

---

## Repository layout (monorepo)

```text
react-firestrap/           ← library root
  src/                     ← framework source (published to npm)
  docs/                    ← markdown docs (AI-first, consumed by the showcase)
  clients/
    showcase/              ← Vite app that documents and demos the library
  bin/                     ← CLI scripts (npx ash create)
  dist/                    ← build output (gitignored)
```
