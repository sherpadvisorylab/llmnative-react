---
title: Utility integrations
group: Utility integrations
order: 60
path: /providers/integrations
description: AI is a runtime integration; Dropbox also registers an auth driver for OAuth.
---

# Utility integrations

AI is a runtime integration. Dropbox is configured through `<App>` and exposes specialized file utilities, but it also registers `dropboxAuth` so the OAuth connection can be driven through `AuthButton`.

For configuration details, see [AIConfig](/docs/app-configuration#aiconfig--passed-via-aiconfig-prop) and [DropboxConfig](/docs/app-configuration#dropboxconfig--declared-inside-providersdropbox).

| Integration | Config location | Access |
|---|---|---|
| AI | `aiConfig` prop | `AI.fetch(...)`, `AI.getModels(...)` |
| Dropbox | `providers.dropbox` | `dropboxAuth`, `dropBox`, `DropBoxConnectButton`, `useDropBoxConnect` |

## How they differ from service providers

Service providers fill the `data`, `storage`, `auth` and `email` registries. Utility integrations write runtime config and expose direct APIs. Dropbox is hybrid: it registers an auth driver for OAuth, while file operations remain Dropbox-specific utilities rather than `StorageProvider`.

```tsx
// Service slot
const data = useDataProvider();

// Utility integrations
const result = await AI.fetch(prompt, { provider: 'openai' });
const files = await dropBox.listFolders({ path: '/Projects' });
```

## AI integration

```tsx
import { App, AI } from 'react-firestrap';

<App
  aiConfig={{
    openaiApiKey: import.meta.env.VITE_OPENAI_API_KEY,
    geminiApiKey: import.meta.env.VITE_GEMINI_API_KEY,
  }}
  providers={{ mock: { data: mockData } }}
/>

const summary = await AI.fetch(
  'Summarize this record',
  { provider: 'openai', model: 'gpt-5.2' },
  { title: 'Quarterly report' }
);
```

`AI` currently supports these provider ids: `openai`, `gemini`, `anthropic` and `mistral`.

## Dropbox integration

Dropbox is configured under `providers.dropbox`. It registers `dropboxAuth` for OAuth, but it does not power `StorageProvider`. `useStorageProvider()` will not return Dropbox.

```tsx
import { App, AuthButton, dropBox } from 'react-firestrap';

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

Create a provider when a capability should power framework components:

- a record backend for `Form` or `Grid`;
- a file backend for upload/download flows;
- an auth backend used across protected UI;
- an email backend used by app workflows.

Keep an integration when the API is specialized, feature-specific or not one of the framework service slots.
