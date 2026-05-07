---
title: Create an app
group: Getting started
order: 40
path: /docs/scaffolding
description: The official scaffold generates a Vite consumer with provider, menu and layout configuration already wired.
---

# Create an app

The scaffold creates a Vite-first app with `App`, `menuConfig`, layout and provider configuration already wired.

```bash
npx react-firestrap create
```

For non-interactive usage:

```bash
npx react-firestrap create --yes --name=my-app --provider=mock
```

## Main Prompts

- Project name
- Data provider: `firebase`, `supabase`, `mock`, `custom`
- Icon provider: `lucide`, `phosphor`
- Theme preset: `default`, `flat`, `cyber`
- Provider credentials when required

## Generated Structure

```text
my-app/
  index.html
  vite.config.ts
  package.json
  src/
    index.tsx
    conf/
      app.ts
      menu.ts
    layouts/
      AppLayout.tsx
    pages/
      home/
        HomePage.tsx
    sections/
    components/
    data/
      mockData.ts
    styles/
      globals.css
```

Public client variables use the `VITE_*` prefix. `REACT_APP_*` remains legacy CRA/Webpack naming.
