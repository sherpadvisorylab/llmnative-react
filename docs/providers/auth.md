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

| Driver | Backend | Sign-in methods |
|---|---|---|
| `googleAuth` | Google Identity Services | Google OAuth popup |
| `firebaseAuth` | Firebase Auth | `password`, `anonymous`, `oauth` (GitHub, Apple, Microsoft…) |
| `supabaseAuth` | Supabase Auth | `password`, `magic_link`, `oauth`, `anonymous` |
| `dropboxAuth` | Dropbox OAuth2 | Dropbox OAuth popup |
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
import { useAuthProvider } from '@llmnative/react';

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
import { AuthButton } from '@llmnative/react';

function HeaderAuth() {
  return <AuthButton provider="googleAuth" intent="signIn" aspect="avatar" />;
}
```

Use `AuthButton` with `aspect="button"` when an integration needs a browser OAuth flow and the resulting access token can be reused later with `getAccessToken()`.

```tsx
import { AuthButton, getAccessToken } from '@llmnative/react';

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

## Sign-in methods

### FirebaseAuthProvider

```tsx
const auth = useAuthProvider(); // configured with services.auth: 'firebaseAuth'

// Email + password (default)
await auth.signIn({ method: 'password', email: 'user@example.com', password: 'secret' });

// Anonymous session
await auth.signIn({ method: 'anonymous' });

// OAuth SSO — GitHub, Apple, Microsoft, Yahoo, Twitter, Facebook
// Note: for Google OAuth use googleAuth, not firebaseAuth
await auth.signIn({ method: 'oauth', provider: 'github' });
await auth.signIn({ method: 'oauth', provider: 'apple' });
await auth.signIn({ method: 'oauth', provider: 'saml.my-provider' }); // SAML pass-through

const token = await auth.getAccessToken(); // Firebase ID token
```

### SupabaseAuthProvider

```tsx
const auth = useAuthProvider(); // configured with services.auth: 'supabaseAuth'

await auth.signIn({ method: 'password', email: 'user@example.com', password: 'secret' });
await auth.signIn({ method: 'magic_link', email: 'user@example.com' });
await auth.signIn({ method: 'oauth', provider: 'github' });
await auth.signIn({ method: 'anonymous' });
```

### GoogleAuthProvider

```tsx
const auth = useAuthProvider(); // configured with services.auth: 'googleAuth'

await auth.signIn(); // GIS popup
// Scoped token for Google APIs (Gmail, Drive, etc.)
const token = await auth.getAccessToken('https://www.googleapis.com/auth/gmail.send');
```

## Minimal configuration

### Google Auth

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

### Firebase Auth

```tsx
<App
  providers={{
    firebase: { config: firebaseConfig },
    services: { auth: 'firebaseAuth' },
  }}
/>
```

### Supabase Auth

```tsx
<App
  providers={{
    supabase: {
      url: import.meta.env.VITE_SUPABASE_URL,
      anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY,
    },
    services: { auth: 'supabaseAuth' },
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
import type { AuthProviderAdapter, UserProfile } from '@llmnative/react';

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
