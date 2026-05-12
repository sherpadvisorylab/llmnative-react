---
title: Provider pattern
group: Architecture
order: 20
path: /docs/providers
description: Provider interfaces keep UI, persistence and external services decoupled from each other.
---

# Provider pattern

react-firestrap follows a **Ports and Adapters** architecture. Every component talks to a stable interface (the port); concrete backends — Firebase, Supabase, mock, or your own — sit behind replaceable adapters. Swapping backends never requires touching a component.

| Domain | Interface | Hook |
|--------|-----------|------|
| Data | `DataProviderAdapter` | `useDataProvider()` |
| Storage | `StorageProviderAdapter` | `useStorageProvider()` |
| Auth | `AuthProviderAdapter` | `useAuthProvider()` |
| Email | `EmailProviderAdapter` | `useEmailProvider()` |
| Icons | `IconProviderAdapter` | `useIconController()` / `<Icon>` |

---

## Basic setup

Pass the `providers` config to `<App>`. The `services` object selects a specific **driver** by name. If no data backend is configured, `App` falls back to an empty `MockDataProvider`.

```tsx
import { App } from 'react-firestrap';
import { firebaseConfig } from './conf/firebase';

<App
  providers={{
    firebase: firebaseConfig,          // FirebaseConfig object directly
    google:   { clientId: '...' },
    services: {
      data:    'dbRealtime',   // Firebase Realtime Database driver
      storage: 'firestorage',  // Firebase Storage driver
      auth:    'googleAuth',   // Google OAuth2 driver
    },
  }}
  menuConfig={menu}
  importPage={(path) => import(path)}
/>
```

See [App reference](/docs/app-configuration) for the full `AppProvidersConfig` interface, all config shapes and third-party credential guides.

---

## Multi-provider registry

Register multiple backends and pick which one powers each service. Useful when you want to develop against mock data and switch to a real backend via an environment variable.

```tsx
<App
  providers={{
    mock: {
      data: {
        '/tasks': {
          'task-1': { title: 'Review scaffold structure', status: 'done' },
          'task-2': { title: 'Connect your first provider', status: 'next' },
        },
      },
    },
    firebase: firebaseConfig,
    supabase: {
      url:     import.meta.env.VITE_SUPABASE_URL,
      anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY,
    },
    google: { clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID },
    services: {
      data:    import.meta.env.VITE_PROVIDER ?? 'mock',  // 'mock' | 'dbRealtime' | 'supabaseDb'
      storage: 'firestorage',
      auth:    'googleAuth',
    },
  }}
  menuConfig={menu}
  importPage={(path) => import(path)}
/>
```

---

## Using providers in components

`Form` and `Grid` consume the default data provider automatically. For direct access use the hooks — they work anywhere inside `<App>`.

```tsx
import { useDataProvider, useStorageProvider } from 'react-firestrap';

function TasksPanel() {
  const data    = useDataProvider();           // default (services.data) provider
  const storage = useStorageProvider();        // null if storage not configured

  // Named access — when multiple backends are registered
  const supabase = useDataProvider('supabase');
}
```

---

## Custom provider

Implement the relevant interface to bring in any backend that is not built-in. All four service slots support custom adapters.

```ts
// src/providers/RestDataProvider.ts
import type { DataProviderAdapter, RecordArray, DatabaseOptions, ReadOptions } from 'react-firestrap';

export class RestDataProvider implements DataProviderAdapter {
  constructor(private baseUrl: string) {}

  async read(path: string, options?: ReadOptions): Promise<any> {
    const res = await fetch(`${this.baseUrl}${path}`);
    return res.json();
  }

  async set(path: string, data: object): Promise<void> {
    await fetch(`${this.baseUrl}${path}`, {
      method: 'PUT',
      body: JSON.stringify(data),
      headers: { 'Content-Type': 'application/json' },
    });
  }

  async update(path: string, data: object): Promise<void> {
    await fetch(`${this.baseUrl}${path}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
      headers: { 'Content-Type': 'application/json' },
    });
  }

  async remove(path: string): Promise<void> {
    await fetch(`${this.baseUrl}${path}`, { method: 'DELETE' });
  }

  useListener(path: string | undefined, setRecords: (records: RecordArray) => void): void {
    // REST has no real-time — do a one-shot load inside useEffect
    React.useEffect(() => {
      if (!path) return;
      this.read(path).then(setRecords);
    }, [path]);
  }
}
```

Register it via `providers.custom`:

```tsx
<App
  providers={{
    custom: { data: new RestDataProvider('https://api.myapp.com') },
    services: { data: 'custom' },
  }}
/>
```

---

## `DataProviderAdapter` — interface

`Form` and `Grid` depend only on this interface. Implement it to connect any data source.

```ts
interface DataProviderAdapter {
  read(path: string, options?: ReadOptions): Promise<any>;
  set(path: string, data: object, exception?: boolean): Promise<void>;
  update(path: string, data: object, exception?: boolean): Promise<void>;
  remove(path: string, exception?: boolean): Promise<void>;
  useListener(
    path: string | undefined,
    setRecords: (records: RecordArray) => void,
    options?: DatabaseOptions
  ): void;

  // Optional — used only by specific features
  count?(path: string): Promise<number>;
  readShallow?(path: string, exception?: boolean): Promise<string[]>;
  setChunks?(path: string, data: object, options?: SetChunksOptions): Promise<void>;
}
```

---

## `StorageProviderAdapter` — interface

Used by `Upload`, `Upload.Image` and `Upload.Document`.

```ts
interface StorageProviderAdapter {
  upload(file: string, path: string): Promise<string | undefined>;
  getURL(path: string): Promise<string | undefined>;
  download(path: string): Promise<Blob | undefined>;
  delete(path: string): Promise<boolean>;
}
```

---

## Available built-in drivers

Each provider registers one or more **drivers**. Use the driver name in `services` to select which one powers each service slot.

| Driver name | Provider config key | Service | Status |
|-------------|--------------------|---------|-|
| `dbRealtime` | `firebase` | data | Stable — Firebase Realtime Database |
| `supabaseDb` | `supabase` | data | Partial — initial REST implementation |
| `mock` | `mock` | data | Stable — in-memory, ideal for dev and tests |
| `firestorage` | `firebase` | storage | Stable — Firebase Storage |
| `supabaseStorage` | `supabase` | storage | Partial |
| `googleAuth` | `google` | auth | Stable — Google OAuth2 sign-in |
| `gmail` | `google` | email | Stable — Gmail API outbound email |

**Utility integrations** (not service slots — accessed via dedicated hooks/utilities):

| Key | Access |
|-----|--------|
| `providers.dropbox` | Dropbox file components and utilities |
| `aiConfig` prop | `AI.fetch()`, `AI.json()`, `AI.array()` |
