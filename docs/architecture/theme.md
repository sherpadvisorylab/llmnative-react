---
title: Theme system
group: Architecture
order: 30
path: /docs/theme
description: Built-in self-contained themes, runtime control, custom palettes and component class overrides.
---

# Theme system

@llmnative/react themes are self-contained modules. Each theme exports:

- `preset`: visual tokens such as mode, colors, radius, fonts and CSS variables.
- `motion`: semantic motion effects such as `fade`, `slideFromRight`, `fadeUp` and `press`.
- `components`: component class defaults and component-level references to motion effects.
- default export: `{ preset, motion, components }`.

The built-in themes live in `themes/default.ts`, `themes/flat.ts` and `themes/cyber.ts`. Each file is complete: there is no hidden merge between built-in themes.

## Built-in themes

```tsx
<App themeProvider="default" />
<App themeProvider="flat" />
<App themeProvider="cyber" />
```

| Theme | Radius | Primary | Character |
|---|---:|---|---|
| `default` | `0.5` | Blue | clean, rounded, neutral |
| `flat` | `0.125` | Slate | dense, administrative |
| `cyber` | `0` | Green | dark-first, sharp, neon |
| `vscode-light-modern` / `vscode-dark-modern` | — | VS Code blue | VS Code Modern, both modes; the scaffold default |
| `vscode-light-plus` / `vscode-dark-plus` | — | VS Code blue | VS Code Plus: gray title bar, blue status bar |
| `tokyo-night-light` / `tokyo-night` | — | Tokyo blue | Tokyo Night, both modes |

The IDE themes are compiled from the VS Code theme JSON by `scripts/themes/compile-vscode-themes.js`.

## The frame of the app

An app has a frame, as an IDE: a top bar, a side bar and a status bar (CR-126). Their colors are tokens of the
theme, optional: `header`, `headerForeground`, `headerBorder`, `sidebar`, `sidebarForeground`, `sidebarBorder`,
`sidebarAccent`, `sidebarAccentForeground`, `footer`, `footerForeground`, `footerBorder`.

| Token | VS Code key | Without it |
|---|---|---|
| `header*` | `titleBar.activeBackground`, `titleBar.activeForeground`, `titleBar.border` | `background`, `foreground`, `border` |
| `sidebar*` | `sideBar.background`, `sideBar.foreground`, `sideBar.border` | `card`, `foreground`, `border` |
| `sidebarAccent*` | `list.inactiveSelectionBackground`, `list.inactiveSelectionForeground` | `accent`, `accentForeground` |
| `footer*` | `statusBar.background`, `statusBar.foreground`, `statusBar.border` | `background`, `mutedForeground`, `border` |

A bar border VS Code does not draw takes the bar's own color. `SideNav` uses the sidebar tokens; the scaffold's
`Header` and `Footer` use `bg-header`/`bg-footer` and their borders. A border without a color class is the theme's
`border` (base rule of `globals.css`), never the text color.

## App override

For small app-local changes, use `themeOverride`. This is the only supported patch layer after the selected theme.

```tsx
<App
  themeProvider={{
    theme: 'flat',
    themeOverride: {
      Form: { buttonSaveClass: 'btn-primary' },
      Modal: { motion: { right: 'slideFromRight' } },
    },
  }}
/>
```

## Custom themes

Register full themes with `themes`. A custom theme should provide `preset`, `motion`, and a complete `components` object.

```tsx
import { App, type ThemeDefinition } from '@llmnative/react';
import { components as defaultComponents, motion as defaultMotion } from './themes/default';

const brand: ThemeDefinition = {
  preset: {
    mode: 'light',
    radius: 0.75,
    colors: {
      primary: '346.8 77.2% 49.8%',
      primaryForeground: '0 0% 100%',
    },
  },
  motion: {
    ...defaultMotion,
    slideFromRight: {
      from: { opacity: 0, transform: 'translateX(100%)' },
      to: { opacity: 1, transform: 'translateX(0)' },
      transition: {
        duration: 180,
        easing: 'cubic-bezier(0.2, 0, 0, 1)',
        properties: ['opacity', 'transform'],
      },
    },
  },
  components: {
    ...defaultComponents,
    Card: { ...defaultComponents.Card, headerClassName: 'bg-primary/5 font-semibold' },
    Form: { ...defaultComponents.Form, buttonSaveClass: 'btn-primary' },
  },
};

// Direct custom theme. It becomes the active theme with id "custom".
<App themeProvider={brand} />

// Named custom theme registry. Use this when you want a stable theme id
// or several custom themes available to applyTheme().
<App
  themeProvider={{
    theme: 'brand',
    themes: { brand },
  }}
/>
```

## Runtime control

Use `useThemeController()` inside `<App>` to update theme state at runtime.

```tsx
const {
  theme,
  resolvedMode,
  primary,
  radius,
  applyTheme,
  toggleMode,
  setPrimary,
  setRadius,
  setFont,
  setTokens,
} = useThemeController();
```

`applyTheme(id)` switches to another registered theme. `setPrimary`, `setRadius`, `setFont` and `setTokens` are runtime controls for live customization panels.

## Types

```ts
interface ThemeDefinition {
  preset: ThemePresetConfig;
  motion: MotionRegistry;
  components: Theme;
}

type AppThemeProviderConfig =
  | 'default'
  | 'flat'
  | 'cyber'
  | ThemeDefinition
  | {
      defaultMode?: ThemeMode;
      theme?: string;
      themes?: Record<string, ThemeDefinition>;
      themeOverride?: ThemeConfig;
    };
```

`Theme` is the resolved, complete runtime shape. `ThemeConfig` is a partial patch shape used only for `themeOverride`.

