import { createConfigurationState, getMissingKeys, type ProviderConfigurationState } from '../../ProviderConfiguration';
import { callEmailApi, EmailProviderError } from '../EmailError';
import { formatEmailAddress, type PreparedEmail } from '../EmailSend';
import type { EmailMessage } from '../EmailRead';

// The Gmail REST API as the Gmail adapters use it (CR-130): only `fetch`, `TextEncoder` and `btoa`/`atob`,
// so the same code runs in a browser and on a server.

export const GMAIL_API = 'https://gmail.googleapis.com/gmail/v1/users/me';
export const GOOGLE_TOKEN_URL = 'https://oauth2.googleapis.com/token';

/** The scopes of Gmail: read the mailbox, send from it. */
export const GMAIL_SCOPES = {
    read: 'https://www.googleapis.com/auth/gmail.readonly',
    send: 'https://www.googleapis.com/auth/gmail.send',
} as const;

/**
 * How a Gmail adapter gets its access token: a function (the browser's Google sign-in), or the OAuth client
 * of the app and the refresh token of the mailbox (a server).
 */
export type GmailAuth =
    | { accessToken: () => Promise<string> }
    | { clientId: string; clientSecret: string; refreshToken: string };

export const PROVIDER = 'Gmail';

/** Whether the auth has what it needs. */
export function gmailConfigurationState(name: string, auth: GmailAuth | undefined): ProviderConfigurationState {
    if (auth && 'accessToken' in auth) return createConfigurationState(name, typeof auth.accessToken === 'function' ? [] : ['accessToken']);
    return createConfigurationState(name, getMissingKeys(auth as Record<string, unknown> | undefined, ['clientId', 'clientSecret', 'refreshToken']));
}

/** A fresh access token: from the function, or exchanging the refresh token. */
export async function gmailAccessToken(auth: GmailAuth, http: typeof fetch): Promise<string> {
    if ('accessToken' in auth) return auth.accessToken();
    const grant = await callEmailApi<{ access_token?: string }>(PROVIDER, http, GOOGLE_TOKEN_URL, {
        method: 'POST',
        headers: { 'content-type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
            client_id: auth.clientId,
            client_secret: auth.clientSecret,
            refresh_token: auth.refreshToken,
            grant_type: 'refresh_token',
        }),
    });
    if (!grant.access_token) throw new EmailProviderError('unauthorized', PROVIDER, 'Google returned no access token');
    return grant.access_token;
}

// ── Base64 ───────────────────────────────────────────────────────────────────

const bytesToBase64 = (bytes: Uint8Array): string => {
    let binary = '';
    for (let i = 0; i < bytes.length; i += 0x8000) binary += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
    return btoa(binary);
};

const base64 = (text: string): string => bytesToBase64(new TextEncoder().encode(text));

export const base64Url = (text: string): string => base64(text).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

export const fromBase64Url = (data: string): string => {
    const binary = atob(data.replace(/-/g, '+').replace(/_/g, '/'));
    return new TextDecoder().decode(Uint8Array.from(binary, (char) => char.charCodeAt(0)));
};

// ── The message Gmail sends ───────────────────────────────────────────────────

const CRLF = '\r\n';

/** A header value in UTF-8 when it is not plain ASCII (RFC 2047). */
const headerText = (text: string): string => (/^[\x20-\x7e]*$/.test(text) ? text : `=?UTF-8?B?${base64(text)}?=`);

const headerAddress = (address: { email: string; name?: string }): string =>
    address.name ? `${headerText(address.name)} <${address.email}>` : formatEmailAddress(address);

/** The headers of a body part in UTF-8 and base64. */
const partHeaders = (type: string): string[] => [`Content-Type: ${type}; charset=UTF-8`, 'Content-Transfer-Encoding: base64'];

/** A body in base64, 76 characters a line. */
const partBody = (body: string): string => (base64(body).match(/.{1,76}/g) ?? []).join(CRLF);

/** The raw message (RFC 2822) in base64url, as `messages.send` takes it. */
export function gmailRawMessage(mail: PreparedEmail): string {
    const headers = [
        mail.from ? `From: ${headerAddress(mail.from)}` : null,
        mail.to.length ? `To: ${mail.to.map(headerAddress).join(', ')}` : null,
        mail.cc.length ? `Cc: ${mail.cc.map(headerAddress).join(', ')}` : null,
        mail.bcc.length ? `Bcc: ${mail.bcc.map(headerAddress).join(', ')}` : null,
        mail.replyTo ? `Reply-To: ${headerAddress(mail.replyTo)}` : null,
        `Subject: ${headerText(mail.subject)}`,
        ...Object.entries(mail.headers ?? {}).map(([name, value]) => `${name}: ${value}`),
        'MIME-Version: 1.0',
    ].filter((line): line is string => line !== null);
    // The body: text, HTML, or both as alternatives.
    let contentHeaders: string[];
    let content: string;
    if (mail.html && mail.text) {
        const boundary = `llmnative-${Math.random().toString(36).slice(2)}`;
        contentHeaders = [`Content-Type: multipart/alternative; boundary="${boundary}"`];
        const section = (type: string, text: string) => [`--${boundary}`, ...partHeaders(type), '', partBody(text)].join(CRLF);
        content = [section('text/plain', mail.text), section('text/html', mail.html), `--${boundary}--`].join(CRLF);
    } else {
        contentHeaders = partHeaders(mail.html ? 'text/html' : 'text/plain');
        content = partBody(mail.html ?? mail.text ?? '');
    }
    // CR-146: with attachments, the body and each file in a multipart/mixed.
    const attachments = mail.attachments ?? [];
    if (!attachments.length) return base64Url([...headers, ...contentHeaders, '', content].join(CRLF));
    const mixed = `llmnative-mixed-${Math.random().toString(36).slice(2)}`;
    const files = attachments.map((a) => [
        `--${mixed}`,
        `Content-Type: ${a.contentType}; name="${a.filename}"`,
        `Content-Disposition: attachment; filename="${a.filename}"`,
        'Content-Transfer-Encoding: base64',
        '',
        (a.content.match(/.{1,76}/g) ?? []).join(CRLF),
    ].join(CRLF));
    const body = [`--${mixed}`, ...contentHeaders, '', content, ...files, `--${mixed}--`].join(CRLF);
    return base64Url([...headers, `Content-Type: multipart/mixed; boundary="${mixed}"`, '', body].join(CRLF));
}

// ── The messages Gmail reads ──────────────────────────────────────────────────

type GmailPart = { mimeType?: string; body?: { data?: string }; parts?: GmailPart[] };

/** The first part of the tree with this MIME type and a body, decoded. */
function partOf(payload: GmailPart | undefined, mime: string): string | undefined {
    if (!payload) return undefined;
    if (payload.mimeType === mime && payload.body?.data) return fromBase64Url(payload.body.data);
    for (const child of payload.parts ?? []) {
        const found = partOf(child, mime);
        if (found !== undefined) return found;
    }
    return undefined;
}

/** The text of a message: its text part wherever it is, else its HTML part without tags. */
function textOf(payload: GmailPart | undefined): string {
    return partOf(payload, 'text/plain')
        ?? partOf(payload, 'text/html')?.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
        ?? '';
}

export type GmailApiMessage = {
    id: string;
    threadId?: string;
    labelIds?: string[];
    snippet?: string;
    internalDate?: string;
    payload?: GmailPart & { headers?: { name: string; value: string }[] };
};

/** A message of the API (`format=full`) as an `EmailMessage`, with the cursor after it. */
export function toEmailMessage(message: GmailApiMessage, cursor: string): EmailMessage {
    const header = (name: string) => String(message.payload?.headers?.find((h) => h.name.toLowerCase() === name)?.value ?? '');
    const arrived = message.internalDate ? new Date(Number(message.internalDate)) : new Date(header('date'));
    return {
        id: String(message.id),
        threadId: String(message.threadId ?? message.id),
        from: header('from'),
        to: header('to'),
        subject: header('subject'),
        ...(header('message-id') ? { messageId: header('message-id') } : {}),
        ...(header('in-reply-to') ? { inReplyTo: header('in-reply-to') } : {}),
        ...(header('references') ? { references: header('references') } : {}),
        date: (Number.isNaN(arrived.getTime()) ? new Date() : arrived).toISOString(),
        text: (textOf(message.payload) || String(message.snippet ?? '')).trim(),
        direction: (message.labelIds ?? []).includes('SENT') ? 'outbound' : 'inbound',
        cursor,
    };
}
