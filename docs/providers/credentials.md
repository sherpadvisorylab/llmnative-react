---
title: CredentialsProvider
group: Service providers
order: 45
path: /providers/credentials
description: App-level service account tokens for calling Google APIs directly from the browser.
---

# CredentialsProvider

`CredentialsProvider` handles **app-level** API credentials — service account tokens for calling external APIs like Google Solar, Maps, Ads, or Trends directly from the browser, without a Node.js server.

This is distinct from `AuthProvider`, which manages **user identity**. Credentials are for your app; auth is for your users.

## Supported credentials services

| Driver | Backend | Best for |
|---|---|---|
| `googleServiceAccount` | Google Service Account + Web Crypto JWT | Google APIs (Solar, Maps, Ads, Trends, etc.) |
| custom | Your adapter | Internal token vending machines, other service accounts |

## Configuration

```tsx
<App
  providers={{
    google: {
      oAuth2: { clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID },
      serviceAccount: {
        clientEmail: import.meta.env.VITE_SA_CLIENT_EMAIL,
        privateKey: import.meta.env.VITE_SA_PRIVATE_KEY,
      },
    },
    services: {
      auth: 'googleAuth',
      credentials: 'googleServiceAccount',
    },
  }}
/>
```

`googleServiceAccount` is only registered when `google.serviceAccount` is present. If omitted, `useCredentialsProvider()` returns `null`.

## Call a Google API

```tsx
import { useCredentialsProvider } from '@llmnative/react';

function SolarApiButton() {
  const creds = useCredentialsProvider();

  return (
    <button
      disabled={!creds}
      onClick={async () => {
        const token = await creds!.getToken(
          'https://www.googleapis.com/auth/solar'
        );

        const res = await fetch(
          'https://solar.googleapis.com/v1/buildingInsights:findClosest?location.latitude=37.4&location.longitude=-122.1',
          { headers: { Authorization: `Bearer ${token}` } }
        );
        console.log(await res.json());
      }}
    >
      Get Solar Data
    </button>
  );
}
```

Tokens are cached per scope and refreshed automatically before expiry.

## Default scope

If you call `getToken()` without a scope argument, the default scope is `https://www.googleapis.com/auth/cloud-platform`.

```tsx
const token = await creds.getToken(); // cloud-platform scope
const mapsToken = await creds.getToken('https://www.googleapis.com/auth/maps-platform.places');
```

## How it works

`GoogleServiceAccountProvider` uses the browser-native **Web Crypto API** (`crypto.subtle`) to sign JWTs with RSASSA-PKCS1-v1_5 + SHA-256. No Node.js dependency, no server round-trip for signing. The signed JWT is exchanged for an access token via `https://oauth2.googleapis.com/token`.

## Custom CredentialsProvider

Use a custom provider when your tokens come from an internal service or a different cloud provider.

```ts
import type { CredentialsAdapter } from '@llmnative/react';

class InternalTokenProvider implements CredentialsAdapter {
  async getToken(scope?: string): Promise<string> {
    const res = await fetch(`/api/token?scope=${scope ?? ''}`);
    const { access_token } = await res.json();
    return access_token;
  }
}
```

Register it:

```tsx
<App
  providers={{
    custom: { credentials: new InternalTokenProvider() },
    services: { credentials: 'custom' },
  }}
/>
```
