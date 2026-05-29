---
title: Proxy relay
group: Architecture
order: 45
path: /docs/proxy
description: How proxyFetch, the proxy service slot, and scaffolded relay implementations work together.
---

# Proxy relay

`@llmnative/react` exposes `proxyFetch(...)`, a fetch-compatible transport wrapper used internally by AI and scrape calls.

The important boundary is:

- `proxyFetch(...)` lives in the library client runtime
- the actual relay route lives in the application project

The framework can decide whether to use a proxy. It cannot materialize a server route inside a browser-only app by itself.

---

## Why it exists

Some upstream APIs reject browser CORS preflight requests or do not expose the headers needed by pure frontend apps.

With `proxyFetch(...)`, the framework can do this:

- direct request when the proxy service is disabled
- same-origin relay request when the proxy service is enabled

That keeps provider code deterministic and vendor-agnostic.

---

## The API shape

`proxyFetch(...)` deliberately mirrors the native fetch contract.

```ts
proxyFetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response>
```

This is intentional:

- no custom request envelope in the client
- no AI-specific transport signature
- no response translation layer

AI providers call `fetchJson(...)` / `fetchRest(...)`, and those helpers use `proxyFetch(...)` internally.

---

## Service-slot model

The proxy is a first-class service slot, just like `data`, `storage`, `auth`, `email` and `ai`.

```ts
providers: {
  proxy: {
    enabled: true,
    route: '/api/llmnative/proxy',
  },
  services: {
    ai: 'opencode',
    proxy: 'viteDevProxy',
  },
}
```

This splits concerns cleanly:

- `services.proxy` selects the proxy driver
- `providers.proxy` provides the shared config

Built-in proxy drivers currently are:

- `viteDevProxy`
- `expressProxy`

---

## Direct vs proxy mode

`proxyFetch(...)` checks the active proxy provider at runtime.

If there is no active proxy provider, or `providers.proxy.enabled !== true`:

- it falls back to direct `fetch(...)`

If the active proxy provider is enabled:

- external absolute URLs are rewritten to the configured relay route
- same-origin and relative URLs stay direct
- the returned value is still a normal `Response`

---

## Relay route

The default route is:

```text
/api/llmnative/proxy
```

The relay accepts the original target through:

```text
?url=<encoded-upstream-url>
```

and requires the internal header:

```text
x-llmnative-proxy: 1
```

That header is added by `proxyFetch(...)`, not by application code.

---

## Where the implementation lives

The client wrapper belongs to the library. The relay implementation belongs to the app runtime.

Examples:

- Vite dev middleware
- Express route
- Next route handler
- serverless function
- edge worker

Scaffolded Vite apps generate the selected implementation:

- `dev/llmnativeProxy.ts` for `viteDevProxy`
- `server/llmnativeProxy.ts` for `expressProxy`

---

## Env in scaffolded apps

Scaffolded apps now include:

```env
VITE_PROXY_PROVIDER=none
VITE_PROXY_ENABLED=false
VITE_PROXY_ROUTE=/api/llmnative/proxy
```

The generated `src/conf/app.ts` maps those env values into:

- `providers.proxy`
- `providers.services.proxy`

So the app stays aligned with the framework service model instead of passing a one-off prop to `<App>`.

---

## Safety rules

The scaffolded relay implementations stay intentionally small, but they keep a few hard guards:

- reject missing `url`
- reject recursive calls back into the relay
- reject requests without `x-llmnative-proxy: 1`
- strip unsafe forwarding headers such as `host`, `origin`, `referer` and `content-length`
- forward upstream status and body as-is

---

## Example

```tsx
import { App } from '@llmnative/react';

const env = import.meta.env;

<App
  aiConfig={{
    openCodeApiKey: env.VITE_OPENCODE_API_KEY,
  }}
  providers={{
    proxy: {
      enabled: env.VITE_PROXY_ENABLED === 'true',
      route: env.VITE_PROXY_ROUTE ?? '/api/llmnative/proxy',
    },
    services: {
      ai: 'opencode',
      proxy: env.VITE_PROXY_PROVIDER !== 'none'
        ? env.VITE_PROXY_PROVIDER
        : undefined,
    },
  }}
/>
```

With this setup:

- provider code always calls `proxyFetch(...)`
- `proxyFetch(...)` decides direct vs relay
- the relay route stays an application responsibility

---

## Related pages

- [App reference](/docs/app-configuration)
- [ProxyProvider](/providers/proxy)
- [Scaffold output](/docs/scaffolding)
- [AIProvider](/providers/ai)
