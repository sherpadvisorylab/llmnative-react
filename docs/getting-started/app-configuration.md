---
title: App reference
group: Getting started
order: 40
path: /docs/app-configuration
description: Complete reference for all App props — providers, routing, theme, icons and the five service slots.
---

# App reference

`<App>` is the root orchestration point for the entire framework. Mount it once at the top of your consumer app: it wires routing, provider registries, theme, icons and runtime configuration.

```tsx
import { App } from '@llmnative/react';

<App
  LayoutDefault={AppLayout}
  menuConfig={menuConfig}
  providers={{ ... }}
  aiConfig={{ ... }}
  importPage={(path) => import(path)}
  iconProvider="lucide"
  themeProvider="default"
/>
```

---

## `AppProps`

```ts
interface AppProps {
  appName?: string;
  aiConfig?: AIConfig;
  scrapeConfig?: ScrapeConfig;
  tenantsURI?: string;
  proxyURI?: string;
  importPage: (path: string) => Promise<{ default: React.ComponentType }>;
  LayoutDefault?: React.ComponentType;
  menuConfig: MenuConfig;
  providers?: AppProvidersConfig;
  iconProvider?: AppIconProviderConfig;
  themeProvider?: AppThemeProviderConfig;
  children?: React.ReactNode;
}
```

### Notes

- `providers` selects which backend powers each framework service slot.
- `aiConfig` centralizes API keys for built-in AI providers.
- `services.ai` selects the default AI driver the same way `services.data` selects the default data driver.

---

## Service map

@llmnative/react has five service slots. Each slot represents one framework capability behind a stable interface.

| Service slot | What it does | Main entry points | Built-in drivers |
|---|---|---|---|
| `data` | Record CRUD and collection access | `Grid`, `Form`, `useDataProvider` | `dbRealtime`, `supabaseDb`, `mock` |
| `storage` | Upload, download, delete, file URL | `Upload`, `useStorageProvider` | `firestorage`, `supabaseStorage` |
| `auth` | Current user, sign-in/out, access token | `AuthButton`, `useAuthProvider` | `googleAuth`, `dropboxAuth` |
| `email` | Outbound email | `useEmailProvider` | `gmail` |
| `ai` | Prompt execution and model orchestration | `Prompt`, `AssistantAI`, `AI.fetch(...)`, `useAIProvider` | `openai`, `gemini`, `anthropic`, `mistral` |

The whole point is provider-agnostic UI:

- swap `services.data` without changing `Grid`
- swap `services.storage` without changing `Upload`
- swap `services.ai` without changing `Prompt`

Dropbox remains a hybrid case:

- `dropboxAuth` is an `auth` driver
- Dropbox file utilities still stay outside the five service slots

See [Providers overview](/providers) and [Utility integrations](/providers/integrations).

---

## `AppProvidersConfig`

`providers` declares available backends and routes each service slot to one active driver.

```ts
interface AppProvidersConfig {
  firebase?: FirebaseConfig;
  supabase?: SupabaseProviderConfig;
  google?: GoogleProviderConfig;
  dropbox?: DropboxConfig;
  mock?: MockProviderConfig;

  custom?: {
    data?: DataProviderAdapter | Record<string, DataProviderAdapter>;
    storage?: StorageProviderAdapter | Record<string, StorageProviderAdapter>;
    auth?: AuthProviderAdapter | Record<string, AuthProviderAdapter>;
    email?: EmailProviderAdapter | Record<string, EmailProviderAdapter>;
    ai?: AIProviderAdapter | Record<string, AIProviderAdapter>;
  };

  services?: {
    data?: 'dbRealtime' | 'supabaseDb' | 'mock' | string;
    storage?: 'firestorage' | 'supabaseStorage' | string;
    auth?: 'googleAuth' | 'dropboxAuth' | string;
    email?: 'gmail' | string;
    ai?: 'openai' | 'gemini' | 'anthropic' | 'mistral' | string;
  };
}
```

### Important behavior

- A provider can be declared but not selected as default.
- `providers.custom.*` lets you register custom adapters without changing UI code.
- `services.ai` works exactly like the other service selectors.

---

## Minimal examples

### Mock data only

```tsx
providers={{
  mock: {
    data: {
      '/users': {
        u1: { name: 'Alice', role: 'admin' },
      },
    },
  },
  services: {
    data: 'mock',
  },
}}
```

### Firebase + Google auth + OpenAI AI service

```tsx
<App
  aiConfig={{
    openaiApiKey: import.meta.env.VITE_OPENAI_API_KEY,
  }}
  providers={{
    firebase: firebaseConfig,
    google: { clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID },
    services: {
      data: 'dbRealtime',
      storage: 'firestorage',
      auth: 'googleAuth',
      ai: 'openai',
    },
  }}
/>
```

### Supabase + Gmail + Gemini

```tsx
<App
  aiConfig={{
    geminiApiKey: import.meta.env.VITE_GEMINI_API_KEY,
  }}
  providers={{
    supabase: supabaseConfig,
    google: {
      clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID,
      scope: 'email profile https://www.googleapis.com/auth/gmail.send',
    },
    services: {
      data: 'supabaseDb',
      storage: 'supabaseStorage',
      email: 'gmail',
      ai: 'gemini',
    },
  }}
/>
```

### Custom AI provider

```tsx
<App
  providers={{
    custom: {
      ai: new GatewayAIProvider(),
    },
    services: {
      ai: 'custom',
    },
  }}
/>
```

---

## `AIConfig` — centralized API keys for the AI service

Built-in AI providers are enabled by `aiConfig`. Only providers with a configured key are added to the runtime registry.

```ts
interface AIConfig {
  geminiApiKey?: string;
  openaiApiKey?: string;
  anthropicApiKey?: string;
  deepSeekApiKey?: string;
  mistralApiKey?: string;
}
```

```tsx
<App
  aiConfig={{
    openaiApiKey: import.meta.env.VITE_OPENAI_API_KEY,
    geminiApiKey: import.meta.env.VITE_GEMINI_API_KEY,
    anthropicApiKey: import.meta.env.VITE_ANTHROPIC_API_KEY,
  }}
  providers={{
    services: { ai: 'openai' },
  }}
/>
```

### Why `aiConfig` exists separately from `providers`

The AI service uses:

- `aiConfig` for centralized secrets / keys
- `providers.services.ai` for default driver selection
- `providers.custom.ai` for custom adapters

This keeps secret management centralized while preserving the same service-selection pattern as the other providers.

---

## `provider/model` convention

The canonical public model identifier is:

```ts
provider/model
```

Examples:

- `openai/gpt-5`
- `openai/gpt-5-mini`
- `gemini/gemini-2.5-pro`
- `anthropic/claude-opus-4.1`

This is what `Prompt` stores and what `AI.fetch(...)` can receive.

```tsx
await AI.fetch(
  'Summarize this record',
  { model: 'openai/gpt-5', temperature: 0.4 },
  { title: 'Quarterly report' }
);
```

If `services.ai` changes later, your component API does not need to change.

---

## Provider-specific config sections

### `FirebaseConfig`

```ts
interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  databaseURL: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  measurementId: string;
}
```

### `SupabaseProviderConfig`

```ts
interface SupabaseProviderConfig {
  url: string;
  anonKey: string;
  bucket?: string;
}
```

### `GoogleProviderConfig`

```ts
interface GoogleProviderConfig {
  clientId: string;
  scope?: string;
  serviceAccount?: GoogleServiceAccount;
  developerToken?: string;
}
```

### `DropboxConfig`

```ts
interface DropboxConfig {
  clientId: string;
  rootPath: string;
}
```

### `MockProviderConfig`

```ts
interface MockProviderConfig {
  data?: Record<string, Record<string, object>>;
}
```

---

## Access providers in components

Once mounted, each service can be accessed through its hook:

```tsx
import {
  useDataProvider,
  useStorageProvider,
  useAuthProvider,
  useEmailProvider,
  useAIProvider,
} from '@llmnative/react';

const data = useDataProvider();
const storage = useStorageProvider();
const auth = useAuthProvider();
const email = useEmailProvider();
const ai = useAIProvider();
```

Named access still works for alternate registered drivers:

```tsx
const supabase = useDataProvider('supabaseDb');
const gmail = useEmailProvider('gmail');
const openai = useAIProvider('openai');
```

---

## Reading config from environment

Keep runtime wiring centralized in `src/conf/app.ts`:

```ts
import type { AppProvidersConfig, AIConfig } from '@llmnative/react';

export const aiConfig: AIConfig = {
  openaiApiKey: import.meta.env.VITE_OPENAI_API_KEY,
  geminiApiKey: import.meta.env.VITE_GEMINI_API_KEY,
};

export const providers: AppProvidersConfig = {
  firebase: firebaseConfig,
  google: { clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID },
  services: {
    data: 'dbRealtime',
    storage: 'firestorage',
    auth: 'googleAuth',
    ai: 'openai',
  },
};
```

Example `.env.local`:

```bash
VITE_PROVIDER=firebase
VITE_FIREBASE_API_KEY=AIzaSy...
VITE_GOOGLE_CLIENT_ID=123.apps.googleusercontent.com
VITE_OPENAI_API_KEY=sk-...
VITE_GEMINI_API_KEY=...
```

---

## Related pages

- [Providers overview](/providers)
- [AIProvider](/providers/ai)
- [DataProvider](/providers/data)
- [StorageProvider](/providers/storage)
- [AuthProvider](/providers/auth)
- [EmailProvider](/providers/email)
- [Utility integrations](/providers/integrations)

