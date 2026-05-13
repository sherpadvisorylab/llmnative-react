---
title: Motion system
group: Architecture
order: 45
path: /docs/motion
description: Configure interaction and disclosure motion across react-firestrap.
---

# Motion system

react-firestrap includes a small motion layer for interaction feedback and component disclosure animations.

The default is intentionally quiet: professional micro-interactions, short durations, no layout shift, and support for `prefers-reduced-motion`.

## Global configuration

Motion lives in the theme system. Configure it through `themeProvider.motion`:

```tsx
<App
  themeProvider={{
    motion: {
      preset: 'standard',
      reducedMotion: 'respect-user',
      duration: 160,
      easing: 'cubic-bezier(0.2, 0, 0, 1)',
      pressScale: 0.98,
      enterDistance: 8,
    },
  }}
/>
```

Available presets:

| Preset | Use case |
|---|---|
| `none` | Disable non-essential motion |
| `subtle` | Dense dashboards and operational apps |
| `standard` | Default professional motion |
| `expressive` | Showcase, demos, consumer-style tools |

## Preset-level configuration

Motion can also live inside a custom theme preset:

```ts
export const preset = {
  motion: {
    preset: 'subtle',
    duration: 120,
  },
};
```

## Local override

Components can expose a `motion` prop for local behavior:

```tsx
<ActionButton label="Save" motion={false} />
<ActionButton label="Run" motion={{ preset: 'expressive', pressScale: 0.96 }} />
<Modal motion={{ preset: 'subtle' }} />
<Dropdown motion={{ duration: 120 }} />
<Tab motion={{ enterDistance: 4 }} />
```

Use local overrides sparingly. Prefer global theme defaults so the app feels consistent.

## Current coverage

Implemented:

- `ActionButton`
- `LoadingButton`
- `Modal`
- `Dropdown`
- `Tab`
- Showcase playground accordions

Planned next:

- Dedicated library `Accordion` component, if promoted from showcase-only usage
- `Notifications`-specific polish on top of dropdown motion
- Menu/context menu refinements
