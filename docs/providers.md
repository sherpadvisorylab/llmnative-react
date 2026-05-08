---
title: Provider pattern
group: Architecture
order: 20
path: /docs/providers
description: Provider interfaces keep UI, persistence and external services decoupled from each other.
---

# Provider Pattern

react-firestrap uses a Ports and Adapters style architecture. Components talk to stable interfaces, while Firebase, Supabase, mock data or custom services sit behind replaceable adapters.

| Domain | Adapter contract | Hook |
|--------|-----------|------|
| Data | `DataProviderAdapter` | `useDataProvider()` |
| Storage | `StorageProviderAdapter` | `useStorageProvider()` |
| Auth | `AuthProviderAdapter` | `useAuthProvider()` |
| Email | `EmailProviderAdapter` | `useEmailProvider()` |
| Icons | `IconProviderAdapter` | `useIconController()` / `Icon` |

## Basic Setup

```tsx
import { App } from 'react-firestrap';
import { firebaseConfig } from './conf/firebase';

export default function Root() {
  return (
    <App
      providers={{
        default: 'firebase',
        firebase: {
          config: firebaseConfig,
        },
      }}
      menuConfig={menu}
      importPage={(path) => import(path)}
    />
  );
}
```

If no data backend is configured, `App` creates an internal `MockDataProvider`. Auth defaults to the Google adapter; storage and email stay unavailable until configured.

## Multi-Provider Registry

When an app needs more than one backend, declare provider configurations and choose which backend powers each service.

```tsx
import { App } from 'react-firestrap';

const mockData = {
  '/tasks': {
    'task-1': { title: 'Review scaffold structure', status: 'done' },
    'task-2': { title: 'Connect your first provider', status: 'next' },
  },
};

export default function Root() {
  return (
    <App
      providers={{
        mock: {
          data: mockData,
        },
        firebase: {
          config: firebaseConfig,
        },
        supabase: {
          config: {
            url: import.meta.env.VITE_SUPABASE_URL,
            anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY,
          },
        },
        services: {
          data: import.meta.env.VITE_PROVIDER || 'mock',
          storage: 'firebase',
          auth: 'firebase',
        },
      }}
      menuConfig={menu}
      importPage={(path) => import(path)}
    />
  );
}
```

Components can use the default provider or request a named provider.

```tsx
import { useDataProvider } from 'react-firestrap';

export function TasksPanel() {
  const data = useDataProvider();
  const supabase = useDataProvider('supabase');

  // ...
}
```

## DataProviderAdapter Surface

`Form` and `Grid` consume `DataProviderAdapter`. This is the minimum surface:

```ts
export interface DataProviderAdapter {
  read(path: string, options?: ReadOptions): Promise<any>;
  set(path: string, data: object, exception?: boolean): Promise<void>;
  update(path: string, data: object, exception?: boolean): Promise<void>;
  remove(path: string, exception?: boolean): Promise<void>;
  useListener(
    path: string | undefined,
    setRecords: (records: RecordArray) => void,
    options?: DatabaseOptions
  ): void;
}
```

Optional methods such as `count`, `readShallow` and `setChunks` are used only by specific features.

## StorageProviderAdapter Surface

The current storage interface in code is:

```ts
export interface StorageProviderAdapter {
  upload(file: string, path: string): Promise<string | undefined>;
  getURL(path: string): Promise<string | undefined>;
  download(path: string): Promise<Blob | undefined>;
  delete(path: string): Promise<boolean>;
}
```

Note the exact method names: `getURL` and `delete`. Older planning notes may mention `getUrl` or `remove`; those are not the interface currently implemented in `src/providers/storage/StorageProvider.ts`.

## Available Providers

| Provider | Status | Notes |
|----------|--------|-------|
| `FirebaseDataProvider` | stable | Main Firebase Realtime Database adapter. |
| `MockDataProvider` | stable | In-memory provider used by tests and offline showcase pages. |
| `SupabaseDataProvider` | partial | Initial REST implementation; still missing integration coverage. |
| `FirebaseStorageProvider` | stable | Firebase Storage adapter. |
| `SupabaseStorageProvider` | partial | Supabase storage adapter. |

## Practical Rules

- Application components should use hooks such as `useDataProvider()` and `useStorageProvider()`.
- `libs/` remains for pure utilities; new provider logic belongs in `providers/`.
- New providers should pass the shared provider contract tests.
- Today the shared contract is exercised by `MockDataProvider`; Firebase/Supabase integration coverage is still pending.
- Demos, docs and visual tests should prefer `MockDataProvider` over real services.
