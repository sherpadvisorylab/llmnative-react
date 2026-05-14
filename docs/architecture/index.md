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
  â””â”€â”€ widgets  (Form, Grid)
        â””â”€â”€ ui/fields  (Input, Select, Upload)
              â””â”€â”€ ui primitives  (Card, Modal, Badge, Button)
                    â””â”€â”€ libs  (pure utilities, no React)
providers
  â””â”€â”€ concrete adapters behind stable interfaces
```

---

## Framework source â€” `src/`

The library itself. Published to npm as `react-firestrap`.

```text
src/
  App.tsx             â† Root component: wires Router, providers, theme, icons
  Config.tsx          â† RuntimeProvider: tenant config, Google, Firebase, Dropbox, AI
  Theme.tsx           â† ThemeProvider + useThemeController hook
  Global.tsx          â† localStorage-backed global state
  Head.tsx            â† HeadProvider for browser metadata (title, og:*, JSON-LD)

  components/
    ui/               â† Presentational primitives (no data fetching)
    â”‚   Alert, Badge, Button, Card, Icon, Image, Loader, Modal,
    â”‚   Pagination, Table, Gallery, Tab, Repeat, GridSystem
    â”‚
    ui/fields/        â† Controlled form fields
    â”‚   Input, Select, Upload, UploadCSV, Prompt, AssistantAI, ImageUrl
    â”‚
    blocks/           â† Layout compositions (use hooks, read from context)
    â”‚   Menu, Brand, Breadcrumbs, Notifications, Search, Carousel, Dropdown
    â”‚
    widgets/          â† Stateful smart components (data-connected)
        Form, Grid, MarkdownReader, ImageEditor

  providers/
    data/             â† DataProviderAdapter + FirebaseDataProvider, SupabaseDataProvider, MockDataProvider
    storage/          â† StorageProviderAdapter + FirebaseStorageProvider, SupabaseStorageProvider
    auth/             â† AuthProviderAdapter + GoogleAuthProvider
    email/            â† EmailProviderAdapter + GmailEmailProvider
    icon/             â† IconProviderAdapter + LucideIconProvider, PhosphorIconProvider
    ai/               â† AI multi-provider (OpenAI, Gemini, Anthropic, DeepSeek, Mistral)
    seo/              â† Google Ads keywords, Trends
    scrape/           â† SerpAPI scraping

  libs/               â† Pure utilities (no React, no providers)
  â”‚   converter, path, sanitizer, cache, fetch, â€¦
  â”‚
  types/              â† Shared TypeScript interfaces and types
  conf/               â† Static configuration (prompt templates)
```

### Dependency rules

- `libs/` must not import React or any component.
- `components/ui` must not import from `widgets` or `providers`.
- `components/` must not import concrete provider implementations (Firebase SDK, Supabase SDK, etc.) directly â€” use provider interfaces.
- New persistence behavior belongs in `providers/`; shared public types belong in `types/`.

---

## Build output â€” `dist/`

Vite builds the library in two module formats plus a single CSS bundle:

```text
dist/
  index.mjs       â† ESM build (tree-shakeable, recommended)
  index.js        â† CJS build (for CommonJS consumers)
  index.css       â† All component styles (Bootstrap compatibility layer + CSS tokens)
  types/
    index.d.ts    â† TypeScript declarations
```

Consumers import the stylesheet once at the app entry:

```tsx
import 'react-firestrap/dist/index.css';
```

---

## Scaffolded consumer app â€” `src/`

When you run `npx react-firestrap create`, the scaffold generates this structure. Every folder has a specific role â€” keeping them separate makes the codebase easy to navigate even as it grows.

```text
src/
  index.tsx             â† Vite entry: mounts <App>, imports globals.css

  conf/
    app.ts              â† Central wiring: exports providers, iconProvider, themeProvider
    menu.ts             â† Navigation tree: all routes + sidebar config
    theme.ts            â† ThemePresetConfig + ThemeConfig (edit freely, never overwritten)

  layouts/
    AppLayout.tsx       â† App shell: sidebar + topbar + <Outlet />
                           Must render <Outlet /> from react-router-dom

  pages/                â† One folder per route, one default export per file
  â”‚   home/
  â”‚     HomePage.tsx
  â”‚   users/
  â”‚     UsersPage.tsx   â† e.g. route /users â†’ file pages/Users.tsx (see convention below)
  â”‚
  sections/             â† Reusable page sections shared across multiple pages
  â”‚                        e.g. a StatsRow used on both Dashboard and Reports
  â”‚
  components/           â† App-specific UI components not in sections
  â”‚                        e.g. a custom StatusBadge or UserAvatar
  â”‚
  data/
    mockData.ts         â† Static fixture data for MockDataProvider (prototyping / tests)

  styles/
    globals.css         â† Tailwind v4 entry + --rf-* â†’ color utility bridge (required)
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

The rule: **only the last path segment is PascalCased** â€” the folder structure is preserved. Hyphens and underscores in the last segment become word boundaries (`user-settings` â†’ `UserSettings`). This convention is optional â€” provide an explicit `page:` import on any `MenuEntry` to bypass it entirely.

### `conf/` â€” the wiring layer

All app-level configuration lives here. Application pages and components never import providers directly â€” they go through hooks (`useDataProvider`, `useThemeController`, etc.).

| File | Role |
|------|------|
| `conf/app.ts` | Assembles `providers`, `iconProvider`, `themeProvider` from env vars and sub-configs |
| `conf/menu.ts` | Defines `MenuConfig` â€” every route and sidebar entry |
| `themes/*.ts` | Self-contained `ThemeDefinition` modules: preset tokens, motion effects and full component theme |

### `styles/globals.css` â€” why it is required

`react-firestrap/dist/index.css` injects runtime CSS custom properties (`--rf-primary`, `--rf-background`, etc.) but Tailwind v4 does not know about them at build time. `globals.css` bridges the two systems via `@theme inline`, so utilities like `bg-primary` and `text-success` reflect the active theme at runtime.

```css
@import "tailwindcss";
@import "react-firestrap/dist/index.css";

@theme inline {
  --color-primary:     hsl(var(--rf-primary));
  --color-background:  hsl(var(--rf-background));
  /* â€¦ all 25 tokens */
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
react-firestrap/           â† library root
  src/                     â† framework source (published to npm)
  docs/                    â† markdown docs (AI-first, consumed by the showcase)
  clients/
    showcase/              â† Vite app that documents and demos the library
  bin/                     â† CLI scripts (npx react-firestrap create)
  dist/                    â† build output (gitignored)
```
