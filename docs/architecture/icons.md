---
title: Icon system
group: Architecture
order: 40
path: /docs/icons
description: Icons are provider-based. App selects the provider; components reference icons by semantic name.
---

# Icon system

react-firestrap uses a **provider pattern** for icons: components never import icon libraries directly. Every `<Icon name="…" />` delegates resolution to the active provider, which maps the semantic name to a React component. This means you can swap the entire icon library — or mix multiple libraries — without changing a single component in your UI.

The default provider is `lucide`. Switch to `phosphor` or bring your own adapter with zero changes to your components.

---

## Built-in providers

Two providers ship out of the box with no extra installation or configuration. Both accept the same semantic icon names used throughout react-firestrap components.

| Provider | Icons | Style | Notes |
|----------|-------|-------|-------|
| `lucide` | 1 000+ | Stroke SVG | Default — aligned with shadcn/ui conventions |
| `phosphor` | 1 400+ | Multi-weight SVG | Supports thin / light / regular / bold / fill / duotone |

```tsx
<App />                                                   // default: lucide
<App iconProvider="lucide" />                             // explicit lucide
<App iconProvider="phosphor" />                           // phosphor, regular weight
<App iconProvider={new PhosphorIconProvider('bold')} />   // phosphor with a fixed weight
```

`PhosphorIconProvider` accepts a weight at construction time. If you need the weight to change at runtime (e.g. from a settings panel), use `registerProvider` + `setProvider` — see [Runtime control](#runtime-control) below.

---

## App-level API

`iconProvider` is the single prop that configures the entire icon system for your app. It accepts three forms, from zero-config to fully custom, so you only add complexity when you actually need it.

### String shorthand

The simplest form — selects one of the built-in providers by id. TypeScript autocompletes `'lucide'` and `'phosphor'`. Use this when the built-in defaults are sufficient and you do not need custom weights or aliases.

```tsx
<App iconProvider="phosphor" />
```

### Provider instance

Pass a provider object directly when you need a specific Phosphor weight or a custom implementation. The built-in providers (`lucide`, `phosphor`) remain registered in the background and can still be activated via `setProvider` at runtime.

```tsx
<App iconProvider={new PhosphorIconProvider('fill')} />
<App iconProvider={new HeroIconProvider()} />
```

### Object with aliases

Use this form when you need to decouple semantic names used in your components from the actual names each library exports. Aliases are applied transparently before resolution — components keep using `"delete"` or `"edit"` and the provider never sees the semantic name. This makes switching icon libraries in the future a one-line change in `App` rather than a codebase-wide rename.

```tsx
<App
  iconProvider={{
    provider: new HeroIconProvider(),
    aliases: {
      delete: 'trash',       // <Icon name="delete" /> → resolves 'trash' in heroicons
      edit:   'pencil',
      add:    'plus-circle',
    },
  }}
/>
```

---

## Runtime control

`useIconController()` gives full programmatic access to the icon registry without a page reload. Use it in settings panels, theme customizers, or anywhere the user should be able to switch icon library or Phosphor weight on the fly. The hook must be called inside `<App>` or a standalone `<IconProvider>`.

```tsx
import { useIconController, PhosphorIconProvider } from '@ash/react';

const {
  providerId,        // id of the currently active provider, e.g. 'phosphor'
  providers,         // all registered providers — built-ins always present
  aliases,           // active alias map, e.g. { delete: 'trash' }
  setProvider,       // activate a provider that is already registered
  registerProvider,  // add or replace a provider in the registry
  resolve,           // resolve a name to a component (useful for custom renderers)
} = useIconController();

// Switch to Phosphor bold at runtime
registerProvider('phosphor', new PhosphorIconProvider('bold'));
setProvider('phosphor');

// Register a completely new provider and activate it
registerProvider('heroicons', new HeroIconProvider());
setProvider('heroicons');
```

> `registerProvider` does not activate the provider automatically — call `setProvider` after if you want to switch immediately. This lets you pre-register multiple providers at startup and activate them on demand without triggering unnecessary re-renders.

---

## Custom provider

To use any icon library not built in, implement `IconProviderAdapter` — just two members. The example below wraps `@heroicons/react`. The same pattern works for any library that exports named React components: Material Icons, Tabler, Radix Icons, and more.

```ts
import type { IconProviderAdapter, IconComponentProps } from '@ash/react';
import * as HeroIcons from '@heroicons/react/24/outline';

// Convert kebab-case to PascalCase: 'arrow-right' → 'ArrowRight'
function toPascalCase(name: string) {
  return name.split('-').map((s) => s[0].toUpperCase() + s.slice(1)).join('');
}

export class HeroIconProvider implements IconProviderAdapter {
  readonly id = 'heroicons';

  resolve(name: string): React.ComponentType<IconComponentProps> | null {
    // heroicons exports components as 'ArrowRightIcon', 'TrashIcon', etc.
    return (HeroIcons as any)[toPascalCase(name) + 'Icon'] ?? null;
  }
}
```

Register it in `App`:

```tsx
// Direct instance — no aliases needed
<App iconProvider={new HeroIconProvider()} />

// With aliases so existing <Icon name="delete" /> still works after switching
<App
  iconProvider={{
    provider: new HeroIconProvider(),
    aliases: { delete: 'trash', edit: 'pencil' },
  }}
/>
```

---

## Local override

The App-level registry is the right approach for 99% of cases. For isolated subtrees or a one-off icon that needs a different provider without affecting the rest of the app, use the `provider` prop on `<Icon>` or wrap a section with `<IconProvider>`.

```tsx
// Single icon with a different provider
<Icon name="star" provider={new PhosphorIconProvider('fill')} />

// Entire subtree uses a different provider
<IconProvider provider={new PhosphorIconProvider('bold')}>
  <SidebarNav />
  <ToolbarActions />
</IconProvider>
```

---

## `AppIconProviderConfig` — full type

The TypeScript type accepted by the `iconProvider` prop on `<App>`. Import it when you need to type a variable or helper function that constructs the config before passing it to `<App>`. All three union members are valid — pick the simplest one that covers your use case.

```ts
/** Built-in provider ids — TypeScript autocompletes these. */
type BuiltInIconProviderId = 'lucide' | 'phosphor';

/**
 * - string:              selects a built-in provider by id
 * - IconProviderAdapter: registers and activates a custom provider directly
 * - object:              custom provider with optional icon name aliases
 */
type AppIconProviderConfig =
  | BuiltInIconProviderId
  | IconProviderAdapter
  | {
      /** The icon provider instance to register and activate. */
      provider: IconProviderAdapter;
      /**
       * Remap semantic icon names to provider-specific names.
       * Applied before resolve() — components keep using their original names.
       * Example: { delete: 'trash', edit: 'pencil' }
       */
      aliases?: Record<string, string>;
    };
```

---

## `IconProviderAdapter` — interface to implement

The only contract you need to satisfy to bring any icon library into react-firestrap. The `id` must be unique across all registered providers. `resolve` is called on every `<Icon>` render — keep it synchronous, pure, and fast (a simple map lookup or named export access). Return `null` for unknown names; `<Icon>` renders nothing silently rather than throwing.

```ts
interface IconProviderAdapter {
  /**
   * Unique identifier for this provider (e.g. 'heroicons').
   * Used as the key in the registry and in setProvider() / registerProvider() calls.
   */
  readonly id: string;

  /**
   * Resolve a semantic icon name to a React component.
   * Called on every <Icon> render — no async, no side-effects.
   * Return null if the name is unknown; <Icon> renders nothing silently.
   * Aliases are applied BEFORE resolve() is called — the name received here
   * is already the remapped one.
   */
  resolve(name: string): React.ComponentType<IconComponentProps> | null;
}

/** Props forwarded to the resolved icon component by <Icon>. */
interface IconComponentProps {
  size?:      number;            // pixel size passed as width/height attribute
  className?: string;            // Tailwind or plain CSS class
  style?:     React.CSSProperties;
}
```

---

## `IconController` — `useIconController()` return type

The full object returned by `useIconController()`. Every field and method here corresponds directly to what you see in the Runtime control examples above. `setProvider` and `registerProvider` are the two methods you will call most often; `resolve` is only needed when building custom renderers that need to bypass the `<Icon>` component.

```ts
interface IconController {
  /** Id of the currently active provider. */
  providerId: string;

  /**
   * All registered providers.
   * lucide and phosphor are always present regardless of the iconProvider config.
   */
  providers: Record<string, IconProviderAdapter>;

  /**
   * Active alias map.
   * Set via { aliases: { … } } in iconProvider or updated by registerProvider.
   */
  aliases: Record<string, string>;

  /**
   * Activate a provider that is already in the registry.
   * Falls back to 'lucide' with a console warning if the id is unknown.
   */
  setProvider(id: string): void;

  /**
   * Add or replace a provider in the registry.
   * Does NOT activate it — call setProvider() after if needed.
   * Useful for registering weight variants (e.g. phosphor-bold) before switching.
   */
  registerProvider(id: string, provider: IconProviderAdapter): void;

  /**
   * Resolve a name through the active provider + alias map.
   * Same logic as <Icon name="…" /> — useful for custom icon renderers.
   */
  resolve(name: string): React.ComponentType<IconComponentProps> | null;
}
```
