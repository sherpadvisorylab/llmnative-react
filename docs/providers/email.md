---
title: Email providers
group: Service providers
order: 50
path: /providers/email
description: Send mail with Resend, Brevo or Gmail, and read the new mails of a mailbox with Gmail (Pub/Sub) or IMAP.
---

# Email providers

A mailbox does two things, and the framework has one category for each:

| Category | Contract | What it does | Adapters |
|---|---|---|---|
| `emailSend` | `EmailSendAdapter` | sends a message | `ResendEmailSender`, `BrevoEmailSender`, `GmailEmailSender` |
| `emailRead` | `EmailReadAdapter` | reads the new mails, from a cursor the app keeps | `GmailEmailReader` (push through Pub/Sub), `ImapEmailReader` |

The app's code does not change when the provider changes: the same `send()`, the same `start()`/`read()`, the
same `EmailMessage`, the same `EmailProviderError`.

Resend and Brevo use an API key, Gmail a refresh token, IMAP a password: they are secrets, so these adapters run
on a server (a Cloud Function, the app's Node server). Import them from `@llmnative/react/server`, which has no
React. The only adapter meant for the browser is the `gmail` driver of the `google` provider, which sends as the
user signed in with Google.

## Send

```ts
import { BrevoEmailSender, ResendEmailSender } from '@llmnative/react/server';

const mail = provider === 'brevo'
  ? new BrevoEmailSender({ apiKey: process.env.BREVO_KEY!, from: { email: 'noreply@acme.it', name: 'Acme' } })
  : new ResendEmailSender({ apiKey: process.env.RESEND_KEY!, from: 'Acme <noreply@acme.it>' });

const { id } = await mail.send({
  to: ['ada@example.com', { email: 'grace@example.com', name: 'Grace' }],
  bcc: 'audit@acme.it',
  replyTo: 'help@acme.it',
  subject: 'Your access code',
  text: 'Your code is 123456.',
  html: '<p>Your code is <b>123456</b>.</p>',
});
```

`EmailSendParams`:

| Field | |
|---|---|
| `from` | the sender; without it, the adapter's `from` (Resend and Brevo need one, on a verified domain) |
| `to`, `cc`, `bcc` | an address or a list; an address is a string or `{ email, name }` |
| `replyTo` | where replies go |
| `subject` | |
| `html`, `text` | the body, at least one; with both the reader's client picks |
| `threadId` | Gmail only: the conversation the message joins |

`send()` returns `{ id, threadId? }`: the id the provider gave the message.

### Gmail

On a server, with the app's OAuth client and the refresh token of the mailbox (scope `GMAIL_SCOPES.send`):

```ts
import { GmailEmailSender } from '@llmnative/react/server';

const gmail = new GmailEmailSender({
  auth: { clientId, clientSecret, refreshToken },
  from: { email: 'office@acme.it', name: 'Acme office' }, // optional: Gmail uses the account's address
});
await gmail.send({ to: client, subject: 'Re: your request', text, threadId });
```

In the browser the `google` provider registers the `gmail` driver of `emailSend`, which asks the signed-in user for
the scope:

```tsx
<App
  providers={{
    google: { clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID },
    services: { auth: 'googleAuth', emailSend: 'gmail' },
  }}
/>

const mail = useEmailSendProvider(); // EmailSendAdapter | null
await mail?.send({ to: 'ada@example.com', subject: 'Hi', html: '<p>Welcome</p>' });
```

## Read

`start()` returns a cursor: reading starts there, the mails already in the mailbox stay out. `read(cursor)` returns
the new messages, oldest first, and the cursor to keep for the next time. With `limit` (default 50) a reading stops
early and the cursor goes on from the last message taken. A cursor the mailbox no longer knows (Gmail's history
expired, IMAP's UIDVALIDITY changed) starts again from now, reading nothing old.

```ts
const { messages, cursor } = await reader.read(saved.cursor);
for (const message of messages) {
  // { id, threadId, from, to, subject, date, text, direction, cursor }
  try { await handle(message); } catch { return save({ cursor: last }); } // the rest is read again next time
  last = message.cursor;
}
await save({ cursor });
```

Every message carries the `cursor` after it: when a handler fails, keep the cursor of the last message handled and
the next reading starts with the rest (with Gmail, possibly again with the messages of the same history record).

### Gmail with Pub/Sub

Gmail notifies a Pub/Sub topic of every change, so the app reads only when there is something new. The topic needs
`roles/pubsub.publisher` for `gmail-api-push@system.gserviceaccount.com`; scope `GMAIL_SCOPES.read`.

```ts
import { GmailEmailReader, decodeGmailPushNotification } from '@llmnative/react/server';

const reader = new GmailEmailReader({
  auth: { clientId, clientSecret, refreshToken },
  topic: 'projects/my-project/topics/gmail',
});

// When connecting the mailbox, and again before `expiresAt` (Gmail's push lasts 7 days):
const { cursor, expiresAt } = await reader.start();

// On every message of the topic:
const notice = decodeGmailPushNotification(pubsubMessage.data); // { emailAddress, historyId } | null
if (notice) {
  const batch = await reader.read(mailboxOf(notice.emailAddress).cursor);
}
```

Without `topic`, `start()` registers no push and the app reads by polling.

Connecting a mailbox: `createGmailOAuth({ clientId, clientSecret, redirectUri })` gives the consent page
(`authorizationUrl({ state, scopes })`) and turns the code Google comes back with into `{ email, refreshToken }`
(`exchangeCode(code)`). The secret and the refresh token stay on the server.

### IMAP

For every other provider. The app calls `read()` every few minutes. The cursor is the UIDVALIDITY of the mailbox
and the last UID read. IMAP needs the optional packages `imapflow` and `mailparser` (`npm i imapflow mailparser`),
loaded on the first reading.

```ts
import { ImapEmailReader } from '@llmnative/react/server';

const reader = new ImapEmailReader({ host: 'imap.example.com', port: 993, secure: true, user, password });
const { cursor } = await reader.start();
```

## Errors

Every adapter throws an `EmailProviderError`: `code` (`not-configured`, `invalid-message`, `unauthorized`,
`rejected`, `rate-limited`, `unavailable`, `unknown`), `provider` and the HTTP `status`. The message never carries a
key, a token or the body of the provider's answer, so it can go to a log.

## Connect screens

`EMAIL_SEND_PROVIDER_DEFINITIONS` and `EMAIL_READ_PROVIDER_DEFINITIONS` describe each provider for a "connect" UI:
label, description, credential fields, where to get them. Resend, Brevo, Gmail and IMAP have an adapter; SendGrid,
Mailgun, Postmark, SES and SMTP are described for an adapter of the app.

## Registry

`emailSend` and `emailRead` are categories of `<App>` like `data` or `ai`: register adapters with
`providers.custom`, pick the default with `services`, read them with `useEmailSendProvider(name?)` and
`useEmailReadProvider(name?)`, swap them with `setProvider`.

```tsx
<App
  providers={{
    custom: { emailSend: { api: new ApiEmailSender() } },
    services: { emailSend: 'api' },
  }}
/>
```

A custom adapter implements the contract:

```ts
import type { EmailSendAdapter, EmailSendParams } from '@llmnative/react';

class ApiEmailSender implements EmailSendAdapter {
  async send(params: EmailSendParams) {
    const response = await fetch('/api/email/send', { method: 'POST', body: JSON.stringify(params) });
    return { id: (await response.json()).id };
  }
}
```
