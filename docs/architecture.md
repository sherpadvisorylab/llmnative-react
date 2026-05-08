---
title: Folder structure
group: Architecture
order: 10
path: /docs/architecture
description: How the framework, providers, components and scaffolded consumers are organized.
---

# Folder Structure

react-firestrap is organized around a clear dependency direction: application pages compose widgets, widgets use fields, fields use UI primitives, and persistence sits behind providers.

```text
pages
  -> widgets
  -> ui/fields
  -> ui primitives
  -> libs
providers
  -> concrete adapters behind stable interfaces
```

## Repository Layout

```text
react-firestrap/
  src/
    App.tsx
    Config.tsx
    Theme.tsx
    Global.tsx
    components/
      ui/
      ui/fields/
      blocks/
      widgets/
    providers/
      data/
      storage/
      auth/
      email/
      icon/
      ai/
    Head.tsx
    libs/
    types/
  docs/
  clients/
    showcase/
  bin/
```

## Component Layers

| Layer | Responsibility |
|-------|----------------|
| `components/ui` | Presentational primitives such as Button, Card, Modal, Table, Badge and Alert. |
| `components/ui/fields` | Controlled form fields such as Input, Select and Upload. |
| `components/widgets` | Stateful widgets such as Form, Grid and MarkdownReader. |
| `components/blocks` | App layout compositions such as menu, breadcrumbs and search. |
| `providers/*` | Ports and adapters for data, storage, auth, email, icons and AI. |
| `libs/*` | Pure utilities with no React dependency. |

## Dependency Rules

- `libs/` must stay framework-agnostic and must not import React components.
- UI primitives must not import widgets.
- Components should not talk directly to concrete Firebase or Supabase SDKs.
- New persistence behavior should go through provider interfaces.
- New persistence behavior should stay in `providers/`; shared public types belong in `types/`.

## Toolchain

The library build is Vite-first.

```bash
npm run build         # Vite library build + TypeScript declarations
npm run build:dev     # Development build + declarations
npm run test          # Vitest
```

Public output:

```text
dist/index.mjs
dist/index.js
dist/index.css
dist/types/index.d.ts
```

Consumers must import the stylesheet once:

```tsx
import 'react-firestrap/dist/index.css';
```

## Scaffolded Consumers

The official scaffold creates a Vite app with a predictable structure.

```text
src/
  index.tsx
  conf/
    app.ts
    menu.ts
  layouts/
  pages/
  sections/
  components/
  data/
  styles/
    globals.css
```

`App` is the orchestration point for routing, providers, theme and icons. The consumer app owns business pages and local composition.
