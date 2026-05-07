---
title: Provider pattern
group: Architecture
order: 20
path: /docs/providers
description: Provider interfaces keep UI, persistence and external services decoupled from each other.
---

# Provider Pattern

react-firestrap uses a Ports and Adapters style architecture. Components talk to stable interfaces, while Firebase, Supabase, mock data or custom services sit behind replaceable adapters.

| Domain | Interface | Hook |
|--------|-----------|------|
| Data | `DataProvider` | `useDataProvider()` |
| Storage | `StorageProvider` | `useStorageProvider()` |
| Auth | `AuthProvider` | `useAuthProvider()` |
| Email | `EmailProvider` | `useEmailProvider()` |
| Icons | `IconProvider` | `useIconController()` / `Icon` |

## Basic Setup

```tsx
import { App, FirebaseDataProvider, FirebaseStorageProvider } from 'react-firestrap';

export default function Root() {
  return (
    <App
      dataProvider={new FirebaseDataProvider()}
      storageProvider={new FirebaseStorageProvider()}
      menuConfig={menu}
      importPage={(path) => import(path)}
    />
  );
}
```

If no `dataProvider` is passed, `App` creates a default `FirebaseDataProvider` for backward compatibility.

## Multi-Provider Registry

When an app needs more than one backend, register named providers and choose the default provider from configuration.

```tsx
import {
  App,
  FirebaseDataProvider,
  MockDataProvider,
  SupabaseDataProvider,
} from 'react-firestrap';

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
        data: {
          firebase: new FirebaseDataProvider(),
          mock: new MockDataProvider(mockData),
          supabase: new SupabaseDataProvider({
            url: import.meta.env.VITE_SUPABASE_URL,
            anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY,
          }),
        },
      }}
      defaultProviders={{
        data: import.meta.env.VITE_DATA_PROVIDER || 'mock',
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

## DataProvider Surface

`Form` and `Grid` consume `DataProvider`. This is the minimum surface:

```ts
export interface DataProvider {
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

## Available Providers

| Provider | Status | Notes |
|----------|--------|-------|
| `FirebaseDataProvider` | stable | Main Firebase Realtime Database adapter. |
| `MockDataProvider` | stable | In-memory provider used by tests and offline showcase pages. |
| `SupabaseDataProvider` | partial | Initial REST implementation; still missing integration coverage. |
| `FirebaseStorageProvider` | stable legacy | Firebase Storage adapter. |
| `SupabaseStorageProvider` | partial | Supabase storage adapter. |

## Practical Rules

- Application components should use hooks such as `useDataProvider()` and `useStorageProvider()`.
- `libs/` remains for pure utilities and backward compatibility, not new provider logic.
- New providers should pass the shared provider contract tests.
- Demos, docs and visual tests should prefer `MockDataProvider` over real services.
