---
title: ProxyProvider
group: Service providers
order: 65
path: /providers/proxy
description: Use the proxy service slot to relay outbound browser requests through an application-owned same-origin route.
---

# ProxyProvider

`ProxyProvider` is the sixth framework service slot. It does not decide *which* AI model runs. It decides *how* browser requests reach external upstream APIs when direct CORS access is not available.

The proxy service is intentionally orthogonal to the AI service:

- `services.ai` chooses the model provider
- `services.proxy` chooses the relay runtime

---

## Supported proxy drivers

| Driver | Runtime | Best for |
|---|---|---|
| `viteDevProxy` | Vite dev / preview middleware | local frontend development and showcase environments |
| `expressProxy` | Express-style server route | production server apps and custom Node deployments |
| custom | your adapter | Next routes, serverless handlers, edge runtimes, internal gateways |

---

## Shared config

All built-in proxy providers share the same config shape.

```ts
type ProxyConfig = {
  enabled?: boolean;
  route?: string;
};
```

That config lives in `providers.proxy`.

```tsx
providers={{
  proxy: {
    enabled: true,
    route: '/api/proxy',
  },
  services: {
    proxy: 'viteDevProxy',
  },
}}
```

---

## Why the config is shared

Proxy drivers differ by runtime implementation, not by client-side request semantics.

So the framework keeps the external model simple:

- one shared `proxy` config section
- one `services.proxy` selector
- one `proxyFetch(...)` entry point

---

## Client contract

The client side always goes through:

```ts
proxyFetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response>
```

If the active proxy provider is disabled or missing:

- `proxyFetch(...)` falls back to direct `fetch(...)`

If the active proxy provider is enabled:

- it rewrites external requests through the configured route

AI providers do not know whether the proxy is enabled. They always use the same fetch helpers.

---

## Register a custom ProxyProvider

```ts
import type { ProxyProviderAdapter } from '@llmnative/react';

class CloudflareWorkerProxyProvider implements ProxyProviderAdapter {
  id = 'cloudflareWorkerProxy';
  label = 'Cloudflare Worker proxy';

  isConfigured() {
    return true;
  }

  async proxy(input: RequestInfo | URL, init?: RequestInit) {
    const request = new Request(input, init);
    const headers = new Headers(request.headers);
    headers.set('x-llmnative-proxy', '1');

    return fetch(`/api/proxy?url=${encodeURIComponent(request.url)}`, {
      method: request.method,
      headers,
      body: ['GET', 'HEAD'].includes(request.method.toUpperCase()) ? undefined : request.body,
      signal: request.signal,
    });
  }
}
```

Register it through the normal provider registry:

```tsx
<App
  providers={{
    proxy: {
      enabled: true,
      route: '/api/proxy',
    },
    custom: {
      proxy: new CloudflareWorkerProxyProvider(),
    },
    services: {
      proxy: 'custom',
    },
  }}
/>
```

---

## Important boundary

`ProxyProvider` belongs to the service model, but the relay route itself still belongs to the application runtime.

So:

- the library owns the client abstraction
- the app owns the server-side execution environment

See [Proxy relay](/docs/proxy) for the runtime contract and scaffold details.
