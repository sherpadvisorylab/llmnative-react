---
title: App reference
group: Getting started
order: 40
path: /docs/app-configuration
description: Complete reference for all App props â€” providers, routing, layout, theme and icons.
---

# App reference

`<App>` is the single orchestration point for the entire framework. Mount it once at the root â€” it wires React Router, the provider registry, the theme system and the icon system, then renders pages through `LayoutDefault`.

```tsx
import { App } from 'react-firestrap';

<App
  LayoutDefault={AppLayout}
  menuConfig={menuConfig}
  providers={{ ... }}
  importPage={(path) => import(path)}
  iconProvider="lucide"
  themeProvider="default"
/>
```

---

## `AppProps` â€” full interface

```ts
interface AppProps {
  /** Displayed in the browser title and Brand component. Default: 'react-firestrap' */
  appName?: string;

  /**
   * Shell component rendered around every page.
   * Must render <Outlet /> from react-router-dom to display page content.
   * Accepts React.ComponentType only â€” not a string.
   * Individual routes can override this with the layout field in MenuEntry.
   */
  LayoutDefault?: React.ComponentType;

  /**
   * Navigation tree. Defines routes, sidebar labels, icons and groups.
   * Required. See MenuConfig below.
   */
  menuConfig: MenuConfig;

  /**
   * Dynamic import function used to load page modules by path.
   * Required. Standard form: (path) => import(path)
   * Vite resolves the dynamic import graph at build time.
   */
  importPage: (path: string) => Promise<{ default: React.ComponentType }>;

  /**
   * Provider registry. Declares all available backends and routes each
   * service (data, storage, auth, email) to a specific backend.
   * Defaults to an empty MockDataProvider if omitted.
   */
  providers?: AppProvidersConfig;

  /**
   * Icon provider. Built-in ids: 'lucide' | 'phosphor'.
   * Also accepts a provider instance or instance + aliases.
   * Default: 'lucide'. See Icon system for details.
   */
  iconProvider?: AppIconProviderConfig;

  /**
   * Theme provider. Built-in ids: 'default' | 'flat' | 'cyber'.
   * Also accepts a direct ThemeDefinition or a config object with custom self-contained themes and themeOverride.
   * Default: 'default'. See Theme system for details.
   */
  themeProvider?: AppThemeProviderConfig;

  /** AI provider API keys (OpenAI, Gemini, Anthropic, DeepSeek, Mistral). */
  aiConfig?: AIConfig;

  /** SerpAPI key for scraping integrations. */
  scrapeConfig?: ScrapeConfig;

  /** URL to a JSON array of tenant configs for multi-tenant apps. */
  tenantsURI?: string;

  /** Base URI for proxied API calls. */
  proxyURI?: string;
}
```

---

## Service map

react-firestrap has four **service slots** â€” each represents a capability the framework needs. You choose which driver powers each slot via `services`. A provider that is declared but whose drivers are not assigned to any slot is still instantiated but not used as the default.

| Service slot | What it does | Built-in drivers |
|---|---|---|
| `data` | Read/write records â€” used by `Grid`, `Form`, `useDataProvider` | `dbRealtime` Â· `supabaseDb` Â· `mock` Â· custom |
| `storage` | File upload/download â€” used by `Upload`, `useStorageProvider` | `firestorage` Â· `supabaseStorage` Â· custom |
| `auth` | Sign-in / sign-out / current user â€” used by `AuthButton`, `useAuthProvider` | `googleAuth` Â· `dropboxAuth` Â· custom |
| `email` | Outbound email â€” used by `useEmailProvider` | `gmail` Â· custom |

Standalone AI configuration is not a service slot. Dropbox is hybrid: `providers.dropbox` registers `dropboxAuth` for OAuth, while Dropbox file APIs remain dedicated utilities instead of `StorageProvider`.

> **Custom providers:** all four service slots support custom adapter implementations via `providers.custom`. Implement the corresponding interface (`DataProviderAdapter`, `StorageProviderAdapter`, `AuthProviderAdapter`, `EmailProviderAdapter`) and register it â€” the framework treats it identically to any built-in provider. See [Provider pattern](/docs/providers) for the interfaces and a complete example.

---

## `AppProvidersConfig`

Declares all backends and routes each service slot to a specific backend. Only the keys you declare are instantiated â€” unused backends add no overhead.

```ts
interface AppProvidersConfig {
  // â”€â”€ Provider configs â€” each key activates a provider's drivers â”€â”€â”€â”€

  /** Firebase â€” activates drivers: dbRealtime (data), firestorage (storage). */
  firebase?: FirebaseConfig;

  /** Supabase â€” activates drivers: supabaseDb (data), supabaseStorage (storage). */
  supabase?: SupabaseProviderConfig;

  /**
   * Google â€” activates drivers: googleAuth (auth), gmail (email).
   * Both drivers share this single config object.
   */
  google?: {
    clientId:         string;   // required for sign-in
    scope?:           string;   // OAuth scopes, space-separated
    serviceAccount?:  GoogleServiceAccount;  // backend API access only
    developerToken?:  string;   // Google Ads API only
  };

  /**
   * Dropbox â€” activates driver: dropboxAuth (auth).
   * File APIs are still consumed through Dropbox utilities, not StorageProvider.
   */
  dropbox?: {
    clientId:  string;  // from Dropbox App Console
    rootPath:  string;  // base path inside the Dropbox folder
  };

  /** In-memory mock â€” activates driver: mock (data). Resets on reload. No credentials needed. */
  mock?: {
    data?: Record<string, Record<string, object>>;
    // { '/users': { u1: { name: 'Alice' } }, '/posts': { ... } }
  };

  /**
   * Custom adapter implementations.
   * Pass a single adapter (registered as 'custom') or a named map
   * { myKey: adapter } to register multiple variants under different names.
   * All four service slots are supported.
   */
  custom?: {
    data?:    DataProviderAdapter    | Record<string, DataProviderAdapter>;
    storage?: StorageProviderAdapter | Record<string, StorageProviderAdapter>;
    auth?:    AuthProviderAdapter    | Record<string, AuthProviderAdapter>;
    email?:   EmailProviderAdapter   | Record<string, EmailProviderAdapter>;
  };

  /**
   * Routes each service slot to a specific driver by name.
   * Omit a slot to leave it unconfigured â€” its hook returns null.
   *
   * Built-in driver names:
   *   data:    'dbRealtime' | 'supabaseDb' | 'mock'
   *   storage: 'firestorage' | 'supabaseStorage'
   *   auth:    'googleAuth' | 'dropboxAuth'
   *   email:   'gmail'
   */
  services?: {
    data?:    'dbRealtime' | 'supabaseDb' | 'mock' | string;
    storage?: 'firestorage' | 'supabaseStorage' | string;
    auth?:    'googleAuth' | 'dropboxAuth' | string;
    email?:   'gmail' | string;
  };

  // â”€â”€ Standalone integrations (not service slots) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

}
```

### Quick examples

**Mock only** â€” no credentials, resets on reload:
```tsx
providers={{
  mock: { data: { '/users': { u1: { name: 'Alice', role: 'admin' } } } },
  services: { data: 'mock' },
}}
```

**Firebase for data + storage, Google for auth:**
```tsx
providers={{
  firebase: { apiKey: '...', projectId: '...', /* see FirebaseConfig */ },
  google:   { clientId: '...' },
  services: { data: 'dbRealtime', storage: 'firestorage', auth: 'googleAuth' },
}}
```

**Firebase + Google auth + Gmail email:**
```tsx
providers={{
  firebase: firebaseConfig,
  google:   { clientId: '...' },   // gmail driver shares the same google config
  services: { data: 'dbRealtime', storage: 'firestorage', auth: 'googleAuth', email: 'gmail' },
}}
```

**Mixed backends â€” different service per backend:**
```tsx
const provider = import.meta.env.VITE_PROVIDER ?? 'mock';
const dataDriver =
  provider === 'firebase' ? 'dbRealtime'
    : provider === 'supabase' ? 'supabaseDb'
      : 'mock';
const storageDriver =
  provider === 'firebase' ? 'firestorage'
    : provider === 'supabase' ? 'supabaseStorage'
      : undefined;

providers={{
  firebase: { /* ... */ },
  supabase: { url: '...', anonKey: '...' },
  google:   { clientId: '...' },
  services: {
    data:    dataDriver,
    storage: storageDriver,
    auth:    'googleAuth',
  },
}}
```

**Custom data provider:**
```tsx
import { RestDataProvider } from './providers/RestDataProvider';

providers={{
  custom: { data: new RestDataProvider('https://api.myapp.com') },
  services: { data: 'custom' },
}}
```

---

## `FirebaseConfig`

All fields are required. Copy them from the Firebase console under **Project settings â†’ Your apps â†’ SDK setup and configuration â†’ Config**.

â†’ [Firebase docs: get config object](https://firebase.google.com/docs/web/setup#config-object)

```ts
interface FirebaseConfig {
  apiKey:            string;  // 'AIzaSy...'
  authDomain:        string;  // 'my-project.firebaseapp.com'
  databaseURL:       string;  // 'https://my-project-default-rtdb.firebaseio.com'
  projectId:         string;  // 'my-project'
  storageBucket:     string;  // 'my-project.appspot.com'
  messagingSenderId: string;  // '123456789'
  appId:             string;  // '1:123456789:web:abc...'
  measurementId:     string;  // 'G-XXXXXXX' (Analytics, optional but typed as required)
}
```

In a Vite project, store these values in `.env.local` and read them via `import.meta.env`:

```ts
// src/conf/firebase.ts
export const firebaseConfig: FirebaseConfig = {
  apiKey:            import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain:        import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL:       import.meta.env.VITE_FIREBASE_DATABASE_URL,
  projectId:         import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket:     import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId:             import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId:     import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};
```

---

## `SupabaseProviderConfig`

Copy the URL and anonymous key from the Supabase dashboard under **Project settings â†’ API**.

â†’ [Supabase docs: project API settings](https://supabase.com/dashboard/project/_/settings/api)

```ts
interface SupabaseProviderConfig {
  url:      string;   // 'https://xyzabc.supabase.co'
  anonKey:  string;   // 'eyJhbGci...' â€” safe to expose in the browser
  bucket?:  string;   // Storage bucket name, default: 'public'
}
```

```ts
// src/conf/supabase.ts
export const supabaseConfig: SupabaseProviderConfig = {
  url:     import.meta.env.VITE_SUPABASE_URL,
  anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY,
};
```

---

## `GoogleOAuth2` â€” sign-in config

The `clientId` comes from the Google Cloud Console under **APIs & Services â†’ Credentials â†’ OAuth 2.0 Client IDs**. Make sure `http://localhost:5173` (or your domain) is listed in **Authorised JavaScript origins**.

â†’ [Google Cloud Console: credentials](https://console.cloud.google.com/apis/credentials)

```ts
interface GoogleOAuth2 {
  clientId: string;  // '123456789-abc.apps.googleusercontent.com'
  scope?:   string;  // space-separated OAuth scopes; default: 'email profile'
}
```

```ts
// src/conf/google.ts
export const googleOAuth2: GoogleOAuth2 = {
  clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID,
};
```

---

## Standalone integrations

AI settings are not service slots and are not accessible via provider hooks. Dropbox is listed here because its file APIs are consumed directly, even though `providers.dropbox` also registers the `dropboxAuth` auth driver.

### `AIConfig` â€” passed via `aiConfig` prop

Multi-model AI integration. `AI.fetch`, `AI.json` and `AI.array` automatically use the first key that is set. You can configure multiple providers simultaneously â€” the utilities will pick the active one based on priority order.

â†’ [AI integration](/providers/integrations)

```ts
interface AIConfig {
  geminiApiKey?:    string;  // Google AI Studio â†’ aistudio.google.com/apikey
  openaiApiKey?:    string;  // platform.openai.com â†’ API keys
  anthropicApiKey?: string;  // console.anthropic.com â†’ API keys
  deepSeekApiKey?:  string;  // platform.deepseek.com â†’ API keys
  mistralApiKey?:   string;  // console.mistral.ai â†’ API keys
}
```

```tsx
<App
  aiConfig={{
    geminiApiKey:   import.meta.env.VITE_GEMINI_API_KEY,
    openaiApiKey:   import.meta.env.VITE_OPENAI_API_KEY,
  }}
/>
```

### `DropboxConfig` â€” declared inside `providers.dropbox`

Dropbox file access used by Dropbox-specific components and utilities. It registers `dropboxAuth` for OAuth connection buttons, but it does **not** power the `storage` service slot â€” `useStorageProvider()` will not return a Dropbox adapter.

â†’ [Dropbox App Console](https://www.dropbox.com/developers/apps)

```ts
interface DropboxConfig {
  clientId:  string;  // from Dropbox App Console â†’ App key
  rootPath:  string;  // base path inside the Dropbox folder, e.g. '/my-app'
}
```

---

## `MenuConfig`

Defines routes and navigation simultaneously. `<App>` builds the React Router tree and the sidebar from this single source of truth.

```ts
type MenuConfig = {
  [section: string]: MenuEntry[];
  // e.g. { default: [...], docs: [...], admin: [...] }
};

interface MenuEntry {
  path:       string;                    // route path, must be unique
  title?:     string;                    // sidebar label
  icon?:      string;                    // icon name passed to <Icon>
  group?:     string;                    // sidebar section header
  badge?:     string | number;           // badge next to label
  page?:      React.ComponentType        // static component (always loaded)
            | (() => Promise<{ default: React.ComponentType }>);  // dynamic import
  layout?:    React.ComponentType;       // per-route layout override
  children?:  MenuEntry[];              // nested entries â†’ submenu
}
```

See [Routing & menu](/docs/menu-config) for guards, active-link behaviour and advanced options.

---

## Reading config from environment

Vite exposes `VITE_*` variables via `import.meta.env`. Centralise all runtime config in `src/conf/app.ts`:

```ts
// src/conf/app.ts
import type { AppProvidersConfig } from 'react-firestrap';
import { firebaseConfig } from './firebase';
import { supabaseConfig } from './supabase';

const provider = import.meta.env.VITE_PROVIDER ?? 'mock';
const dataDriver =
  provider === 'firebase' ? 'dbRealtime'
    : provider === 'supabase' ? 'supabaseDb'
      : 'mock';
const storageDriver =
  provider === 'firebase' ? 'firestorage'
    : provider === 'supabase' ? 'supabaseStorage'
      : undefined;

export const providers: AppProvidersConfig = {
  firebase: firebaseConfig,
  supabase: supabaseConfig,
  google:   { clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID },
  services: {
    data:    dataDriver,    // 'mock' | 'dbRealtime' | 'supabaseDb'
    storage: storageDriver, // 'firestorage' | 'supabaseStorage' | undefined
    auth:    'googleAuth',
  },
};
```

```
# .env.local  â€” never commit this file
VITE_PROVIDER=firebase
VITE_FIREBASE_API_KEY=AIzaSy...
VITE_FIREBASE_PROJECT_ID=my-project
# â€¦ other keys
```

---

## Accessing providers in components

Once declared in `<App>`, every provider is available anywhere in the tree via hooks:

```tsx
import {
  useDataProvider,
  useStorageProvider,
  useAuthProvider,
  useEmailProvider,
} from 'react-firestrap';

const data    = useDataProvider();           // services.data provider
const storage = useStorageProvider();        // null if storage not configured
const auth    = useAuthProvider();

// Named access by driver name â€” useful when multiple backends are registered
const supabase = useDataProvider('supabaseDb');
const gmail    = useEmailProvider('gmail');  // null if not configured
```

See [Providers & Integrations](/providers) for service usage and custom provider examples.
