---
title: Motion system
group: Architecture
order: 45
path: /docs/motion
description: Configure semantic motion effects across react-firestrap.
---

# Motion system

react-firestrap motion is theme-driven and semantic. Themes define named effects once, then components reference those effects by intent.

The default is intentionally quiet: short transitions, no layout shift, and support for `prefers-reduced-motion`.

## Theme-level effects

Each theme exports a `motion` registry next to `preset` and `theme`:

```ts
export const motion = {
  fade: {
    from: { opacity: 0 },
    to: { opacity: 1 },
    transition: {
      duration: 160,
      easing: 'cubic-bezier(0.2, 0, 0, 1)',
      properties: ['opacity'],
    },
    reducedMotion: 'respect-user',
  },

  slideFromRight: {
    from: { opacity: 0, transform: 'translateX(100%)' },
    to: { opacity: 1, transform: 'translateX(0)' },
    transition: {
      duration: 180,
      easing: 'cubic-bezier(0.2, 0, 0, 1)',
      properties: ['opacity', 'transform'],
    },
  },
};
```

## Component mapping

Component theme sections choose which semantic effect to use:

```ts
export const theme = {
  Modal: {
    motion: {
      center: 'fade',
      top: 'slideFromTop',
      left: 'slideFromLeft',
      right: 'slideFromRight',
      bottom: 'slideFromBottom',
      backdrop: 'fade',
    },
  },
  ActionButton: {
    motion: {
      press: 'press',
    },
  },
  Dropdown: {
    motion: {
      open: 'fadeDown',
      press: 'press',
    },
  },
};
```

This keeps component configuration readable: the component asks for `theme.Modal.motion.right`, while the theme decides what `slideFromRight` means.

## Local override

Components that support motion expose a `motion` prop. Use it only for local exceptions:

```tsx
<ActionButton label="Save" motion={false} />
<ActionButton label="Run" motion="press" />
<Modal motion="slideFromRight" />
<Dropdown motion="fadeDown" />
<Tab motion="fadeUp" />
```

You can also pass an inline effect:

```tsx
<Modal
  motion={{
    from: { opacity: 0, transform: 'scale(0.96)' },
    to: { opacity: 1, transform: 'scale(1)' },
    transition: {
      duration: 140,
      easing: 'ease-out',
      properties: ['opacity', 'transform'],
    },
  }}
/>
```

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
