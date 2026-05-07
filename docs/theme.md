---
title: Theme system
group: Architecture
order: 30
path: /docs/theme
description: Theme is managed by App with built-in presets, overrides and runtime control.
---

# Theme system

Theme is managed by `App`. You can use built-in presets by name or extend the registry with custom presets.

```tsx
// Built-in defaults
<App />;

// String shorthand
<App themeProvider="cyber" />;

// Advanced registry
<App
  themeProvider={{
    defaultMode: 'dark',
    defaultPreset: 'brand',
    presets: {
      brand: {
        primary: '346.8 77.2% 49.8%',
        radius: 0.75,
        theme: {
          Button: { className: 'font-semibold' },
          Card: { className: 'shadow-sm' },
        },
      },
    },
  }}
/>;
```

## Runtime Control

Use `useThemeController()` in layouts, settings panels or live customization tools.

```tsx
import { useThemeController } from 'react-firestrap';

function Preferences() {
  const theme = useThemeController();

  return (
    <>
      <button onClick={() => theme.applyPreset('flat')}>Flat</button>
      <button onClick={() => theme.applyPreset('cyber')}>Cyber</button>
      <button onClick={theme.toggleMode}>Toggle mode</button>
    </>
  );
}
```

Preset built-in: `default`, `flat`, `cyber`.
