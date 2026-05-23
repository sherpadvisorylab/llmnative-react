---
title: StorageProvider
group: Service providers
order: 30
path: /providers/storage
description: Use file storage from Firebase, Supabase or your own backend.
---

# StorageProvider

`StorageProvider` is the service for files. It handles upload, public URL resolution, download and delete operations.

## Supported storage services

| Driver | Backend | Best for |
|---|---|---|
| `firestorage` | Firebase Storage | production file storage with Firebase |
| `supabaseStorage` | Supabase Storage | Supabase file buckets |
| custom | Your adapter | S3, REST file APIs, private storage |

For complete storage configuration, see [AppProvidersConfig](/docs/app-configuration#appprovidersconfig).

## Configuration state

Built-in storage providers expose configuration state before any upload or download runs:

- `firestorage` checks the Firebase config keys.
- `supabaseStorage` checks `supabase.url` and `supabase.anonKey`.

Custom storage providers can implement `isConfigured()` or `getConfigurationState()` so UI components can disable upload controls when storage is not available.

## Use storage in custom components

```tsx
import { useStorageProvider } from '@llmnative/react';

function PublicFileLink({ path }: { path: string }) {
  const storage = useStorageProvider();
  const [url, setUrl] = React.useState<string>();

  React.useEffect(() => {
    storage?.getURL(path).then(setUrl);
  }, [storage, path]);

  if (!storage) return <span>Storage is not configured</span>;
  return url ? <a href={url}>Open file</a> : <span>Loading file...</span>;
}
```

`useStorageProvider()` returns `null` if no storage service is configured. That makes it safe to keep upload features optional.

## Upload a generated file

```tsx
function ExportButton() {
  const storage = useStorageProvider();

  return (
    <button
      disabled={!storage}
      onClick={async () => {
        const csv = 'name,email\\nAda,ada@example.com';
        await storage?.upload(csv, '/exports/customers.csv');
      }}
    >
      Export CSV
    </button>
  );
}
```

## Download and delete

```tsx
function FileActions({ path }: { path: string }) {
  const storage = useStorageProvider();

  return (
    <>
      <button onClick={() => storage?.download(path)}>
        Download
      </button>
      <button onClick={() => storage?.delete(path)}>
        Delete
      </button>
    </>
  );
}
```

The public method names are `getURL` and `delete`.

## Minimal configuration

```tsx
<App
  providers={{
    firebase: firebaseConfig,
    services: { storage: 'firestorage' },
  }}
/>
```

See [FirebaseConfig](/docs/app-configuration#firebaseconfig) and [SupabaseProviderConfig](/docs/app-configuration#supabaseproviderconfig) for credentials.

## Custom StorageProvider

Use a custom provider for S3, a private REST API or any storage backend that is not built in.

```ts
import type { StorageProviderAdapter } from '@llmnative/react';

class RestStorageProvider implements StorageProviderAdapter {
  constructor(private baseUrl: string) {}

  isConfigured() {
    return Boolean(this.baseUrl);
  }

  async upload(file: string, path: string) {
    await fetch(this.baseUrl + path, { method: 'PUT', body: file });
    return path;
  }

  async getURL(path: string) {
    return this.baseUrl + path;
  }

  async download(path: string) {
    return fetch(this.baseUrl + path).then((res) => res.blob());
  }

  async delete(path: string) {
    const res = await fetch(this.baseUrl + path, { method: 'DELETE' });
    return res.ok;
  }
}
```

Register it:

```tsx
<App
  providers={{
    custom: {
      storage: {
        assets: new RestStorageProvider('/api/files'),
      },
    },
    services: { storage: 'assets' },
  }}
/>
```
