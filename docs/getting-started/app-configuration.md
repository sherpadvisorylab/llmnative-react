---
title: App reference
group: Getting started
order: 40
path: /docs/app-configuration
description: Complete reference for App props, provider wiring, AI config and the six service slots.
---

# App reference

`<App>` is the root orchestration point for the framework. Mount it once at the top of your consumer app to wire:

- routing
- provider registries
- theme and icons
- runtime config

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
- `providers.proxy` holds the shared proxy config.
- `services.ai` and `services.proxy` select the default AI and proxy drivers.

---

## Service map

@llmnative/react currently has six service slots.

| Service slot | What it does | Main entry points | Built-in drivers |
|---|---|---|---|
| `data` | Record CRUD and collection access | `Grid`, `Form`, `useDataProvider` | `dbRealtime`, `supabaseDb`, `mock` |
| `storage` | Upload, download, delete, file URL | `Upload`, `useStorageProvider` | `firestorage`, `supabaseStorage` |
| `auth` | Current user, sign-in/out, access token | `AuthButton`, `useAuthProvider` | `googleAuth`, `dropboxAuth` |
| `email` | Outbound email | `useEmailProvider` | `gmail` |
| `ai` | Prompt execution and model orchestration | `Prompt`, `AssistantAI`, `AI.fetch(...)`, `useAIProvider` | `openai`, `openrouter`, `opencode`, `openai-compatible`, `deepseek`, `gemini`, `anthropic`, `mistral` |
| `proxy` | Same-origin relay for browser-safe external requests | `proxyFetch(...)`, `useProxyProvider` | `viteDevProxy`, `expressProxy` |

The point is provider-agnostic UI:

- swap `services.data` without changing `Grid`
- swap `services.storage` without changing `Upload`
- swap `services.ai` without changing `Prompt`
- swap `services.proxy` without changing provider fetch helpers

Dropbox remains a hybrid case:

- `dropboxAuth` is an `auth` driver
- Dropbox file utilities still stay outside the service slots

---

## `AppProvidersConfig`

```ts
interface AppProvidersConfig {
  firebase?: FirebaseConfig;
  supabase?: SupabaseProviderConfig;
  google?: GoogleProviderConfig;
  dropbox?: DropboxConfig;
  mock?: MockProviderConfig;
  proxy?: ProxyConfig;

  custom?: {
    data?: DataProviderAdapter | Record<string, DataProviderAdapter>;
    storage?: StorageProviderAdapter | Record<string, StorageProviderAdapter>;
    auth?: AuthProviderAdapter | Record<string, AuthProviderAdapter>;
    email?: EmailProviderAdapter | Record<string, EmailProviderAdapter>;
    ai?: AIProviderAdapter | Record<string, AIProviderAdapter>;
    proxy?: ProxyProviderAdapter | Record<string, ProxyProviderAdapter>;
  };

  services?: {
    data?: 'dbRealtime' | 'supabaseDb' | 'mock' | string;
    storage?: 'firestorage' | 'supabaseStorage' | string;
    auth?: 'googleAuth' | 'dropboxAuth' | string;
    email?: 'gmail' | string;
    ai?: 'openai' | 'openrouter' | 'opencode' | 'openai-compatible' | 'deepseek' | 'gemini' | 'anthropic' | 'mistral' | string;
    proxy?: 'viteDevProxy' | 'expressProxy' | string;
  };
}
```

### Important behavior

- a provider can be declared but not selected as default
- `providers.custom.*` lets you register custom adapters without changing UI code
- `services.ai` and `services.proxy` work exactly like the other service selectors

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

### Firebase + Google auth + OpenAI + Vite proxy

```tsx
<App
  aiConfig={{
    openaiApiKey: import.meta.env.VITE_OPENAI_API_KEY,
  }}
  providers={{
    proxy: {
      enabled: true,
    },
    firebase: firebaseConfig,
    google: { clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID },
    services: {
      data: 'dbRealtime',
      storage: 'firestorage',
      auth: 'googleAuth',
      ai: 'openai',
      proxy: 'viteDevProxy',
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

## `AIConfig`

Built-in AI providers are enabled by `aiConfig`. Only providers with a configured key are added to the runtime registry.

```ts
interface AIConfig {
  geminiApiKey?: string;
  openaiApiKey?: string;
  openRouterApiKey?: string;
  openCodeApiKey?: string;
  anthropicApiKey?: string;
  deepSeekApiKey?: string;
  mistralApiKey?: string;
  openAICompatible?: {
    apiKey?: string;
    baseUrl?: string;
    modelsUrl?: string;
    chatCompletionsUrl?: string;
    defaultModel?: string;
    label?: string;
    fallbackModels?: string[];
  };
}
```

The AI service uses:

- `aiConfig` for centralized secrets / keys
- `providers.services.ai` for default driver selection
- `providers.custom.ai` for custom adapters

---

## `ProxyConfig`

The proxy service uses one shared config shape for every built-in driver.

```ts
type ProxyConfig = {
  enabled?: boolean;
};
```

Example:

```tsx
providers={{
  proxy: {
    enabled: true,
  },
  services: {
    proxy: 'viteDevProxy',
  },
}}
```

When `enabled !== true`, `proxyFetch(...)` falls back to direct `fetch(...)`.

See [Proxy relay](/docs/proxy) and [ProxyProvider](/providers/proxy) for the runtime contract.

---

## `provider/model` convention

The canonical public model identifier is:

```ts
provider/model
```

Examples:

- `openai/gpt-5`
- `openrouter/openai/gpt-4`
- `opencode/kimi-k2.6`
- `deepseek/deepseek-chat`

Routers split only on the first slash. So `openrouter/openai/gpt-4` resolves to:

- provider: `openrouter`
- upstream model id: `openai/gpt-4`

---

## Access providers in components

```tsx
import {
  useDataProvider,
  useStorageProvider,
  useAuthProvider,
  useEmailProvider,
  useAIProvider,
  useProxyProvider,
} from '@llmnative/react';

const data = useDataProvider();
const storage = useStorageProvider();
const auth = useAuthProvider();
const email = useEmailProvider();
const ai = useAIProvider();
const proxy = useProxyProvider();
```

Named access still works for alternate registered drivers:

```tsx
const openai = useAIProvider('openai');
const expressProxy = useProxyProvider('expressProxy');
```

---

## Reading config from environment

Keep runtime wiring centralized in `src/conf/app.ts`:

```ts
import type { AIConfig, AppProvidersConfig } from '@llmnative/react';

export const aiConfig: AIConfig = {
  openaiApiKey: import.meta.env.VITE_OPENAI_API_KEY,
};

export const providers: AppProvidersConfig = {
  proxy: {
    enabled: import.meta.env.VITE_PROXY_ENABLED === 'true',
  },
  services: {
    data: 'mock',
    ai: 'openai',
  },
};
```

Example `.env.local`:

```bash
VITE_PROVIDER=mock
VITE_AI_PROVIDER=openai
VITE_PROXY_PROVIDER=viteDevProxy
VITE_PROXY_ENABLED=false
VITE_OPENAI_API_KEY=sk-...
```

---

## Related pages

- [Providers overview](/providers)
- [AIProvider](/providers/ai)
- [ProxyProvider](/providers/proxy)
- [Proxy relay](/docs/proxy)
