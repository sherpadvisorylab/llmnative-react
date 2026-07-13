---
title: ApiProvider
group: Service providers
order: 55
path: /providers/api
description: Call third-party REST APIs from browser code — with client-resident, Firebase Function, Supabase Edge Function or mock adapters.
---

# ApiProvider

`ApiProvider` is a framework service slot for REST API integration. It lets you call an external API (payments, email delivery, a non-streaming AI service, etc.) through a stable `fetch(request)` contract, regardless of whether the call is made directly from the browser or routed through a serverless function that carries the real secret.

## When to use it

Use `ApiProvider` when a widget or adapter needs to call a specific third-party REST API:

- a payments gateway (Stripe, Brevo)
- a REST-only AI service
- any vendor whose API is a simple request/response shape

Do NOT use it for generic HTTP calls — use `fetch()` or `proxyFetch()` directly. `ApiProvider` is for calls that need a registered **base URL + fixed headers + optional secret** so that other framework adapters (e.g. an `EmailProviderAdapter` for Brevo) can stay thin.

## Contract

```ts
interface ApiProviderAdapter extends ProviderConfigurable {
    fetch(request: ApiProviderRequest): Promise<unknown>;
}

type ApiProviderRequest = {
    path: string;                          // e.g. "/v3/send"
    method?: string;                      // default "POST"
    query?: Record<string, string>;
    body?: unknown;
};
```

## Built-in adapters

### `DirectApiProviderAdapter` — client-resident

Calls the target directly from the browser via `proxyFetch()` (CORS-safe). The secret is visible to the browser — use only for dev keys, personal tokens, or no-backend deploys.

```ts
import { DirectApiProviderAdapter } from '@llmnative/react';

const adapter = new DirectApiProviderAdapter({
    baseUrl: 'https://api.brevo.com',
    header: { 'api-key': 'xkeysib-...' },
});
```

### `FirebaseApiProviderAdapter` — secret server-side

Routes through a Firebase Callable Function. The secret lives server-side, resolved from the registered tenant/user. The function receives `{ provider, request }` and returns the upstream response.

```ts
import { FirebaseApiProviderAdapter } from '@llmnative/react';

const adapter = new FirebaseApiProviderAdapter({
    functionName: 'callThirdPartyApi',
    providerName: 'brevo',
    region: 'europe-west1',
});
```

### `SupabaseApiProviderAdapter` — secret server-side

Same pattern via a Supabase Edge Function.

```ts
import { SupabaseApiProviderAdapter } from '@llmnative/react';

const adapter = new SupabaseApiProviderAdapter({
    url: 'https://xyzcompany.supabase.co',
    anonKey: '...',
    functionName: 'callThirdPartyApi',
    providerName: 'brevo',
});
```

### `MockApiProviderAdapter` — dev/tests

Resolves via a local resolver, no network.

```ts
import { MockApiProviderAdapter } from '@llmnative/react';

const adapter = new MockApiProviderAdapter((request) => ({
    id: 'mock-response',
    ...request.body,
}));
```

## Usage in a component

```tsx
import { useApiProvider } from '@llmnative/react';

function PaymentButton() {
    const payments = useApiProvider('payments');

    return (
        <button onClick={async () => {
            const result = await payments.fetch({
                path: '/charges',
                body: { amount: 1000, currency: 'eur' },
            });
            console.log('Charge created:', result);
        }}>
            Pay €10.00
        </button>
    );
}
```

## Register a custom adapter at runtime

```tsx
import { App, DirectApiProviderAdapter } from '@llmnative/react';

<App
    providers={{
        custom: {
            api: new DirectApiProviderAdapter({
                baseUrl: 'https://payments.acme.com/api',
                header: { Authorization: 'Bearer <dev-key>' },
            }),
        },
    }}
/>
```

## Related pages

- [AppProvidersConfig](/docs/app-configuration#appprovidersconfig)
- [Proxy relay](/docs/proxy)
