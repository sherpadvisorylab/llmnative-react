---
title: Utility integrations
group: Utility integrations
order: 70
path: /providers/integrations
description: Specialized runtime integrations that are intentionally outside the five service slots.
---

# Utility integrations

`@llmnative/react` has five service slots:

- `data`
- `storage`
- `auth`
- `email`
- `ai`

Everything that powers framework components should go through one of those provider registries. This page is only for integrations that stay intentionally outside that contract.

Today the main example is Dropbox file utilities: Dropbox can register `dropboxAuth` in the `auth` service slot, but Dropbox file browsing APIs still remain specialized helpers rather than a `StorageProvider`.

## Current utility integrations

| Integration | Config location | Access |
|---|---|---|
| Dropbox utilities | `providers.dropbox` | `dropBox`, `DropBoxConnectButton`, `useDropBoxConnect` |

## How utility integrations differ from service providers

Service providers:

- are mounted by `<App>`;
- live behind a stable adapter interface;
- can be swapped without changing component code;
- usually power framework widgets or hooks directly.

Utility integrations:

- may still be configured through `<App>`;
- expose vendor-specific helpers;
- are not expected to satisfy a generic service contract.

```tsx
// Service slot
const data = useDataProvider();

// Utility integration
const files = await dropBox.listFolders({ path: '/Projects' });
```

## Dropbox integration

Dropbox is configured under `providers.dropbox`. It registers `dropboxAuth` for OAuth, but it does **not** power the `storage` service slot. `useStorageProvider()` will not return a Dropbox adapter.

```tsx
import { App, AuthButton, dropBox } from '@llmnative/react';

<App
  providers={{
    dropbox: {
      clientId: import.meta.env.VITE_DROPBOX_CLIENT_ID,
      rootPath: '/Apps/MyApp',
    },
  }}
/>

function DropboxPanel() {
  const [files, setFiles] = React.useState<any[]>([]);

  return (
    <>
      <AuthButton
        provider="dropboxAuth"
        intent="connect"
        aspect="button"
        options={{ label: 'Connect Dropbox', icon: 'link' }}
      />
      <button onClick={() => dropBox.listFolders({ path: '/' }).then(setFiles)}>
        Load files
      </button>
    </>
  );
}
```

## When to create a provider instead

Create a provider when the capability should stay vendor-agnostic at the framework boundary:

- record persistence for `Form` or `Grid`;
- upload/download for `Upload`;
- shared identity and session state;
- outbound email;
- model execution through the AI orchestration layer.

Keep an integration when the API is feature-specific, vendor-specific or intentionally outside the generic framework contract.

