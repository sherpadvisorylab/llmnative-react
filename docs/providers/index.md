---
title: Providers & Integrations
group: Overview
order: 10
path: /providers
description: What external services @llmnative/react can use today, how the service slots work, and where specialized integrations still fit.
---

# Providers & Integrations

@llmnative/react can talk to data stores, file storage, auth systems, email APIs, AI model providers and specialized utilities without coupling your UI to a specific vendor.

For an app developer, the important idea is simple: configure the services once on `<App>`, then use framework components or hooks. `Grid`, `Form`, `Upload` and provider hooks all use the selected service behind the scenes.

## Supported services

| Area | What it does | Built-in support | Learn more |
|---|---|---|---|
| Data | Records, CRUD, realtime lists | Mock, Firebase Realtime DB, Cloud Firestore, Supabase | [DataProvider](/providers/data) |
| Storage | File upload, file URL, download, delete | Firebase Storage, Supabase Storage | [StorageProvider](/providers/storage) |
| Auth | Current user, auth changes, access tokens | Google OAuth, Firebase Auth, Supabase Auth, Dropbox OAuth2 | [AuthProvider](/providers/auth) |
| Email | Outbound email | Gmail | [EmailProvider](/providers/email) |
| AI | Model execution, prompt orchestration, provider/model discovery | OpenAI, OpenRouter, OpenCode, DeepSeek, Gemini, Anthropic, Mistral | [AIProvider](/providers/ai) |
| Credentials | App-level service account tokens for Google APIs | Google Service Account (Web Crypto JWT) | [CredentialsProvider](/providers/credentials) |
| Proxy | Same-origin relay for browser-safe external requests | Vite dev proxy, Express proxy | [ProxyProvider](/providers/proxy) |
| Utilities | Specialized helpers outside the service slots | Dropbox utilities | [Utility integrations](/providers/integrations) |

## How you usually use providers

Most of the time, you do not call a provider directly. You configure it and use higher-level components.

```tsx
<Grid
  dataStoragePath="/customers"
  columns={[
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'status', label: 'Status' },
  ]}
/>
```

The `Grid` reads from the active `DataProvider`. If tomorrow you switch from mock data to Firebase, the component does not change.

The same rule now applies to AI-first components:

```tsx
<Prompt
  name="summary"
  mode={PromptMode.RUN}
  defaultValue={{
    enabled: true,
    value: 'Summarize {title}',
    model: 'openai/gpt-5',
  }}
/>
```

If later you change `services.ai` from `openai` to `gemini`, the prompt component does not change.

## Configuration state

Provider-driven components only work when the provider they use is configured. Built-in providers expose `isConfigured()` and `getConfigurationState()` so components can disable themselves before they call a backend.

For example, an auth button using `dropboxAuth` checks `dropbox.clientId`; a Firebase storage control checks the Firebase keys. When a key is missing, the component should stay visible but disabled, show a light visual affordance, and expose a diagnostic title/tooltip.

```ts
const state = provider.getConfigurationState?.();

if (state && !state.configured) {
  console.warn(state.reason);
}
```

## When you use hooks directly

Hooks are useful for custom screens, dashboards, workflow buttons and integration glue.

```tsx
import { useDataProvider, useStorageProvider, useAuthProvider, useEmailProvider, useCredentialsProvider } from '@llmnative/react';

function WorkspaceSummary() {
  const data = useDataProvider();
  const storage = useStorageProvider();
  const auth = useAuthProvider();
  const email = useEmailProvider();
  const creds = useCredentialsProvider(); // null if not configured

  // build custom app logic here
}
```

## Configuration lives elsewhere

This section focuses on how to use the provider services. Full app configuration is covered in [AppProvidersConfig](/docs/app-configuration#appprovidersconfig).

At a glance, provider selection looks like this:

```tsx
<App
  providers={{
    mock: { data: mockData },
    firebase: firebaseConfig,
    google: googleOAuth2,
    services: {
      data: 'mock',
      storage: 'firestorage',
      auth: 'googleAuth',
      email: 'gmail',
      ai: 'openai',
      proxy: 'viteDevProxy',
    },
  }}
/>
```

## Custom providers

If the built-in services are not enough, each service area can receive a custom adapter:

- custom data backend;
- custom storage backend;
- custom auth system;
- custom email service;
- custom AI gateway or model router;
- custom credentials provider;
- custom proxy runtime.

Each provider page ends with a custom implementation example.

