---
title: EmailProvider
group: Service providers
order: 50
path: /providers/email
description: Use the active email service to send outbound messages.
---

# EmailProvider

`EmailProvider` is the service for outbound email. It is intentionally small: one `send()` method.

## Supported email services

| Driver | Backend | Best for |
|---|---|---|
| `gmail` | Gmail API | sending email through a Google account |
| custom | Your adapter | SendGrid, Mailgun, SES, internal APIs |

For Google scopes and credentials, see [GoogleOAuth2 sign-in config](/docs/app-configuration#googleoauth2--sign-in-config).

## Configuration state

The Gmail driver shares the Google OAuth configuration and checks `google.oAuth2.clientId`. If the key is missing, email actions should be disabled before calling `send()`.

```ts
const mail = useEmailProvider();
const state = mail?.getConfigurationState?.();
```

## Send an email

```tsx
import { useEmailProvider } from '@ash/react';

function SendInviteButton({ email }: { email: string }) {
  const mail = useEmailProvider();

  return (
    <button
      disabled={!mail}
      onClick={() => mail?.send({
        to: email,
        subject: 'You are invited',
        message: '<p>Welcome aboard.</p>',
      })}
    >
      Send invite
    </button>
  );
}
```

`useEmailProvider()` returns `null` when no email service is configured. That lets you disable optional email actions cleanly.

## Send to multiple recipients

```tsx
async function sendDigest(mail: EmailProviderAdapter) {
  await mail.send({
    to: ['ada@example.com', 'grace@example.com'],
    bcc: 'audit@example.com',
    subject: 'Weekly digest',
    message: '<h1>Digest</h1><p>Three projects need review.</p>',
  });
}
```

## Minimal configuration

The Gmail driver shares the `google` provider config.

```tsx
<App
  providers={{
    google: {
      clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID,
      scope: 'email profile https://www.googleapis.com/auth/gmail.send',
    },
    services: {
      auth: 'googleAuth',
      email: 'gmail',
    },
  }}
/>
```

For the full `google` object, scopes and environment variables, see [GoogleOAuth2 sign-in config](/docs/app-configuration#googleoauth2--sign-in-config).

## Custom EmailProvider

Use a custom provider when email should go through SendGrid, Mailgun, SES or your own backend.

```ts
import type { EmailProviderAdapter, EmailSendParams } from '@ash/react';

class ApiEmailProvider implements EmailProviderAdapter {
  isConfigured() {
    return true;
  }

  async send(params: EmailSendParams) {
    await fetch('/api/email/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
  }
}
```

Register it:

```tsx
<App
  providers={{
    custom: { email: new ApiEmailProvider() },
    services: { email: 'custom' },
  }}
/>
```
