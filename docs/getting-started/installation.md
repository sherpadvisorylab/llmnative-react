---
title: Installation
group: Getting started
order: 15
path: /docs/installation
description: Choose between the scaffold for new projects and manual setup for existing apps.
---

# Installation

There are two supported ways to get started with `@llmnative/react`.

---

## Scaffold - recommended for new projects

The official scaffold generates a complete Vite app with routing, providers, theme, icons, and all five service slots already wired.

Preferred one-shot command:

```bash
npx @llmnative/react create
```

Published CLI bin name:

```bash
npx llmnative create
```

Both commands target the same CLI. The public package is `@llmnative/react`; the executable bin exported by the package is `llmnative`.

-> Continue with [Quick start](/docs/quick-start)

---

## Manual setup - for existing projects

Add `@llmnative/react` to a project you already have. Install the package, wire `<App>` manually, and connect only the providers you need.

```bash
npm install @llmnative/react
```

-> Continue with [Manual setup](/docs/manual-setup)
