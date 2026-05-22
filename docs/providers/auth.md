---
title: AuthProvider
group: Service providers
order: 40
path: /providers/auth
description: Use the active auth service for current user, sign-out and access tokens.
---

# AuthProvider

`AuthProvider` is the service for identity. It exposes the current user, auth-state changes, sign-out and optional access tokens.

## Supported auth services

| Driver | Backend | Best for |
|---|---|---|
| `googleAuth` | Google OAuth | Google sign-in and Google API access |
| `dropboxAuth` | Dropbox OAuth2 | connecting Dropbox file APIs |
| custom | Your adapter | JWT sessions, enterprise SSO, internal auth |

For full OAuth configuration, see [GoogleOAuth2 sign-in config](/docs/app-configuration#googleoauth2--sign-in-config).

If you want the ready-made browser login/logout UI, use the [Auth component](/components/auth). `AuthButton` can render as a standard button or as an avatar menu, and delegates the OAuth details to the selected `AuthProvider`.

## Configuration state

Auth providers expose configuration state. `googleAuth` requires `google.oAuth2.clientId`; `dropboxAuth` requires `dropbox.clientId`.

`AuthButton` uses that state automatically: if the selected provider is not configured, the button/avatar is disabled, slightly faded, and its title explains which key is missing.

```ts
const auth = useAuthProvider('googleAuth');
const state = auth.getConfigurationState?.();

console.log(state?.configured, state?.missingKeys);
```

## Show the current user

```tsx
import { useAuthProvider } from '@ash/react';

function CurrentUser() {
  const auth = useAuthProvider();
  const [user, setUser] = React.useState(auth.getUser());

  React.useEffect(() => {
    return auth.onAuthChange(setUser);
  }, [auth]);

  return (
    <div>
      {user?.photoURL && <img src={user.photoURL} alt="" width={32} height={32} />}
      <span>{user?.email ?? 'Signed out'}</span>
    </div>
  );
}
```

## Sign out

```tsx
function SignOutButton() {
  const auth = useAuthProvider();

  return (
    <button onClick={() => auth.signOut()}>
      Sign out
    </button>
  );
}
```

## Access tokens for integrations

Some providers can expose access tokens for external APIs.

```tsx
function GoogleApiButton() {
  const auth = useAuthProvider();

  return (
    <button
      onClick={async () => {
        const token = await auth.getAccessToken?.([
          'https://www.googleapis.com/auth/gmail.send',
        ]);

        console.log(token);
      }}
    >
      Get Gmail token
    </button>
  );
}
```

## Browser login/logout UI

Use `AuthButton` with `aspect="avatar"` when the app needs a ready-made sign-in/profile/logout surface.

```tsx
import { AuthButton } from '@ash/react';

function HeaderAuth() {
  return <AuthButton provider="googleAuth" intent="signIn" aspect="avatar" />;
}
```

Use `AuthButton` with `aspect="button"` when an integration needs a browser OAuth flow and the resulting access token can be reused later with `getAccessToken()`.

```tsx
import { AuthButton, getAccessToken } from '@ash/react';

function DropboxConnect() {
  return (
    <AuthButton
      provider="dropboxAuth"
      intent="connect"
      aspect="button"
      scopes={['files.metadata.read', 'files.content.read']}
      options={{ icon: 'link', label: 'Connect Dropbox' }}
    />
  );
}

async function loadDropboxToken() {
  const token = await getAccessToken(import.meta.env.VITE_DROPBOX_CLIENT_ID);
  return token;
}
```

For the component API and live examples, see [Auth component](/components/auth).

## Minimal configuration

```tsx
<App
  providers={{
    google: {
      clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID,
      scope: 'email profile',
    },
    services: { auth: 'googleAuth' },
  }}
/>
```

To enable Dropbox OAuth as an integration provider, declare `providers.dropbox`. It registers `dropboxAuth`, which can be selected directly by `AuthButton`.

```tsx
<App
  providers={{
    google: { clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID },
    dropbox: {
      clientId: import.meta.env.VITE_DROPBOX_CLIENT_ID,
      rootPath: '/Apps/MyApp',
    },
    services: { auth: 'googleAuth' },
  }}
/>
```

For the full `google` object, scopes and environment variables, see [GoogleOAuth2 sign-in config](/docs/app-configuration#googleoauth2--sign-in-config).

## Custom AuthProvider

Use a custom provider when your app already has sessions, JWT auth or enterprise SSO.

```ts
import type { AuthProviderAdapter, UserProfile } from '@ash/react';

class SessionAuthProvider implements AuthProviderAdapter {
  private user: UserProfile | null = null;

  getUser() {
    return this.user;
  }

  async signIn() {
    const res = await fetch('/api/login/session');
    this.user = res.ok ? await res.json() : null;
    return this.user;
  }

  async signOut() {
    await fetch('/api/logout', { method: 'POST' });
    this.user = null;
  }

  onAuthChange(callback: (user: UserProfile | null) => void) {
    fetch('/api/me')
      .then((res) => res.ok ? res.json() : null)
      .then((user) => {
        this.user = user;
        callback(user);
      });

    return () => {};
  }

  isAuthenticated() {
    return this.user != null;
  }

  isConfigured() {
    return true;
  }
}
```

Register it:

```tsx
<App
  providers={{
    custom: { auth: new SessionAuthProvider() },
    services: { auth: 'custom' },
  }}
/>
```
