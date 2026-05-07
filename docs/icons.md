---
title: Icon system
group: Architecture
order: 40
path: /docs/icons
description: Icons are provider-based: App selects the provider, components use semantic names.
---

# Icon system

The icon provider is managed by `App`. The default is `lucide`; `phosphor` is available as a built-in alternative.

```tsx
// Built-in defaults
<App />;

// String shorthand
<App iconProvider="phosphor" />;
```

## Advanced Registry

You can register custom providers and aliases.

```tsx
<App
  iconProvider={{
    default: 'heroicons',
    providers: {
      heroicons: new HeroIconProvider(),
    },
    aliases: {
      delete: 'trash',
      edit: 'pencil',
    },
  }}
/>;
```

## Runtime Control

```tsx
import { useIconController, PhosphorIconProvider } from 'react-firestrap';

function Preferences() {
  const icons = useIconController();

  return (
    <>
      <button onClick={() => icons.setProvider('lucide')}>Lucide</button>
      <button onClick={() => icons.setProvider('phosphor')}>Phosphor</button>
      <button onClick={() => {
        icons.registerProvider('phosphor', new PhosphorIconProvider('fill'));
        icons.setProvider('phosphor');
      }}>
        Phosphor fill
      </button>
    </>
  );
}
```
