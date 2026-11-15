/**
 * CR-130: the adapters of `emailSend` (Resend, Brevo, Gmail) and `emailRead` (Gmail, IMAP), on a simulated
 * `fetch` and simulated IMAP modules.
 */
import { describe, it, expect, vi } from 'vitest';
import { ResendEmailSender, RESEND_EMAIL_URL } from '../../../src/providers/email/resend/ResendEmailSender';
import { BrevoEmailSender, BREVO_EMAIL_URL } from '../../../src/providers/email/brevo/BrevoEmailSender';
import { GmailEmailSender } from '../../../src/providers/email/gmail/GmailEmailSender';
import { GmailEmailReader, decodeGmailPushNotification } from '../../../src/providers/email/gmail/GmailEmailReader';
import { createGmailOAuth } from '../../../src/providers/email/gmail/gmailOAuth';
import { base64Url, fromBase64Url } from '../../../src/providers/email/gmail/gmailApi';
import { ImapEmailReader, type ImapModules } from '../../../src/providers/email/imap/ImapEmailReader';
import { EmailProviderError } from '../../../src/providers/email/EmailError';

type Call = { url: string; init: RequestInit };

/** A fetch that answers each URL (by its start) with a status and a body, and records the calls. */
function fakeFetch(routes: [match: string, answer: (url: string, init: RequestInit) => { status?: number; body?: unknown }][]) {
    const calls: Call[] = [];
    const http = vi.fn(async (input: RequestInfo | URL, init: RequestInit = {}) => {
        const url = String(input);
        calls.push({ url, init });
        const route = routes.find(([match]) => url.startsWith(match));
        if (!route) return new Response('not found', { status: 404 });
        const { status = 200, body = {} } = route[1](url, init);
        return new Response(JSON.stringify(body), { status });
    });
    return { http: http as unknown as typeof fetch, calls };
}

const body = (call: Call) => JSON.parse(String(call.init.body));
const headers = (call: Call) => call.init.headers as Record<string, string>;

const MESSAGE = {
    from: { email: 'noreply@acme.it', name: 'Acme CRM' },
    to: ['ada@example.com', { email: 'grace@example.com', name: 'Grace' }],
    cc: 'cc@example.com',
    bcc: 'audit@example.com',
    replyTo: 'help@acme.it',
    subject: 'Il tuo codice',
    html: '<p>Codice <b>123456</b></p>',
    text: 'Codice 123456',
};

describe('ResendEmailSender', () => {
    it('sends the message as Resend takes it', async () => {
        const { http, calls } = fakeFetch([[RESEND_EMAIL_URL, () => ({ body: { id: 'r-1' } })]]);
        const result = await new ResendEmailSender({ apiKey: 're_key', fetch: http }).send(MESSAGE);
        expect(result).toEqual({ id: 'r-1' });
        expect(headers(calls[0]).authorization).toBe('Bearer re_key');
        expect(body(calls[0])).toEqual({
            from: 'Acme CRM <noreply@acme.it>',
            to: ['ada@example.com', 'Grace <grace@example.com>'],
            cc: ['cc@example.com'],
            bcc: ['audit@example.com'],
            reply_to: 'help@acme.it',
            subject: 'Il tuo codice',
            html: MESSAGE.html,
            text: MESSAGE.text,
        });
    });

    it('takes its default sender and reports what it misses', async () => {
        const { http, calls } = fakeFetch([[RESEND_EMAIL_URL, () => ({ body: { id: 'r-2' } })]]);
        await new ResendEmailSender({ apiKey: 'k', from: 'app@acme.it', fetch: http }).send({ to: 'ada@example.com', subject: 's', text: 't' });
        expect(body(calls[0]).from).toBe('app@acme.it');
        expect(new ResendEmailSender({ apiKey: '' }).getConfigurationState()).toMatchObject({ configured: false, missingKeys: ['apiKey'] });
        await expect(new ResendEmailSender({ apiKey: 'k', fetch: http }).send({ to: 'a@b.it', subject: 's', text: 't' }))
            .rejects.toMatchObject({ code: 'not-configured' });
    });

    it('refuses a message without recipient or body', async () => {
        const sender = new ResendEmailSender({ apiKey: 'k', from: 'a@acme.it', fetch: fakeFetch([]).http });
        await expect(sender.send({ to: [], subject: 's', text: 't' })).rejects.toMatchObject({ code: 'invalid-message' });
        await expect(sender.send({ to: 'a@b.it', subject: 's' })).rejects.toMatchObject({ code: 'invalid-message' });
    });

    it('turns the answers of Resend into errors without the key', async () => {
        for (const [status, code] of [[401, 'unauthorized'], [422, 'rejected'], [429, 'rate-limited'], [503, 'unavailable']] as const) {
            const { http } = fakeFetch([[RESEND_EMAIL_URL, () => ({ status, body: { message: 'secret re_key' } })]]);
            const error = await new ResendEmailSender({ apiKey: 're_key', from: 'a@acme.it', fetch: http })
                .send({ to: 'a@b.it', subject: 's', text: 't' }).catch((e) => e);
            expect(error).toBeInstanceOf(EmailProviderError);
            expect(error).toMatchObject({ code, status, provider: 'Resend' });
            expect(error.message).not.toContain('re_key');
        }
        const down = vi.fn(async () => { throw new TypeError('fetch failed'); }) as unknown as typeof fetch;
        await expect(new ResendEmailSender({ apiKey: 'k', from: 'a@acme.it', fetch: down }).send({ to: 'a@b.it', subject: 's', text: 't' }))
            .rejects.toMatchObject({ code: 'unavailable' });
    });
});

describe('BrevoEmailSender', () => {
    it('sends the message as Brevo takes it', async () => {
        const { http, calls } = fakeFetch([[BREVO_EMAIL_URL, () => ({ status: 201, body: { messageId: '<b-1@smtp-relay>' } })]]);
        const result = await new BrevoEmailSender({ apiKey: 'xkeysib', fetch: http }).send(MESSAGE);
        expect(result).toEqual({ id: '<b-1@smtp-relay>' });
        expect(headers(calls[0])['api-key']).toBe('xkeysib');
        expect(body(calls[0])).toEqual({
            sender: { email: 'noreply@acme.it', name: 'Acme CRM' },
            to: [{ email: 'ada@example.com' }, { email: 'grace@example.com', name: 'Grace' }],
            cc: [{ email: 'cc@example.com' }],
            bcc: [{ email: 'audit@example.com' }],
            replyTo: { email: 'help@acme.it' },
            subject: 'Il tuo codice',
            htmlContent: MESSAGE.html,
            textContent: MESSAGE.text,
        });
    });

    it('turns a refused sender into a rejected message', async () => {
        const { http } = fakeFetch([[BREVO_EMAIL_URL, () => ({ status: 400, body: { code: 'invalid_parameter' } })]]);
        await expect(new BrevoEmailSender({ apiKey: 'k', from: 'x@acme.it', fetch: http }).send({ to: 'a@b.it', subject: 's', html: '<p>h</p>' }))
            .rejects.toMatchObject({ code: 'rejected', status: 400, provider: 'Brevo' });
    });
});

const TOKEN_URL = 'https://oauth2.googleapis.com/token';
const GMAIL = 'https://gmail.googleapis.com/gmail/v1/users/me';
const SERVER_AUTH = { clientId: 'cid', clientSecret: 'csecret', refreshToken: 'rtoken' };

describe('GmailEmailSender', () => {
    it('sends a MIME message with the refresh token of a server', async () => {
        const { http, calls } = fakeFetch([
            [TOKEN_URL, () => ({ body: { access_token: 'atoken' } })],
            [`${GMAIL}/messages/send`, () => ({ body: { id: 'g-1', threadId: 't-1' } })],
        ]);
        const result = await new GmailEmailSender({ auth: SERVER_AUTH, fetch: http }).send({ ...MESSAGE, subject: 'Più codici', threadId: 't-1' });
        expect(result).toEqual({ id: 'g-1', threadId: 't-1' });
        expect(String(calls[0].init.body)).toContain('refresh_token=rtoken');
        expect(headers(calls[1]).authorization).toBe('Bearer atoken');
        const sent = body(calls[1]);
        expect(sent.threadId).toBe('t-1');
        const raw = fromBase64Url(sent.raw);
        expect(raw).toContain('From: Acme CRM <noreply@acme.it>');
        expect(raw).toContain('To: ada@example.com, Grace <grace@example.com>');
        expect(raw).toContain('Bcc: audit@example.com');
        expect(raw).toContain('Reply-To: help@acme.it');
        expect(raw).toMatch(/Subject: =\?UTF-8\?B\?.+\?=/);
        expect(raw).toContain('multipart/alternative');
        const parts = [...raw.matchAll(/Content-Type: (text\/\w+); charset=UTF-8\r\nContent-Transfer-Encoding: base64\r\n\r\n([A-Za-z0-9+/=\r\n]+?)\r\n--/g)]
            .map(([, type, data]) => [type, fromBase64Url(data.replace(/\r\n/g, ''))]);
        expect(parts).toEqual([['text/plain', MESSAGE.text], ['text/html', MESSAGE.html]]);
    });

    it('sends with the token of the browser and no sender', async () => {
        const { http, calls } = fakeFetch([[`${GMAIL}/messages/send`, () => ({ body: { id: 'g-2' } })]]);
        const accessToken = vi.fn(async () => 'browser-token');
        await new GmailEmailSender({ auth: { accessToken }, fetch: http }).send({ to: 'a@b.it', subject: 'Hi', text: 'ciao' });
        expect(accessToken).toHaveBeenCalled();
        const raw = fromBase64Url(body(calls[0]).raw);
        expect(raw).not.toContain('From:');
        expect(raw).toContain('Content-Type: text/plain; charset=UTF-8');
    });

    it('is not configured without the client or the refresh token', () => {
        expect(new GmailEmailSender({ auth: { clientId: 'c', clientSecret: '', refreshToken: 'r' } }).getConfigurationState())
            .toMatchObject({ configured: false, missingKeys: ['clientSecret'] });
    });
});

const gmailMessage = (id: string, extra: Record<string, unknown> = {}) => ({
    id,
    threadId: `t-${id}`,
    internalDate: '1763200000000',
    labelIds: ['INBOX'],
    payload: {
        mimeType: 'multipart/alternative',
        headers: [{ name: 'From', value: 'Ada <ada@example.com>' }, { name: 'To', value: 'lead@acme.it' }, { name: 'Subject', value: `Mail ${id}` }],
        parts: [{ mimeType: 'text/html', body: { data: base64Url('<p>Ciao</p>') } }, { mimeType: 'text/plain', body: { data: base64Url('Ciao Acme') } }],
    },
    ...extra,
});

describe('GmailEmailReader', () => {
    it('starts with a watch on the topic', async () => {
        const { http, calls } = fakeFetch([
            [TOKEN_URL, () => ({ body: { access_token: 'a' } })],
            [`${GMAIL}/watch`, () => ({ body: { historyId: '100', expiration: '1763800000000' } })],
        ]);
        const start = await new GmailEmailReader({ auth: SERVER_AUTH, topic: 'projects/p/topics/gmail', fetch: http }).start();
        expect(start).toEqual({ cursor: '100', expiresAt: new Date(1763800000000).toISOString() });
        expect(body(calls[1])).toEqual({ topicName: 'projects/p/topics/gmail', labelIds: ['INBOX'] });
    });

    it('starts from the profile without a topic', async () => {
        const { http } = fakeFetch([[TOKEN_URL, () => ({ body: { access_token: 'a' } })], [`${GMAIL}/profile`, () => ({ body: { historyId: '77' } })]]);
        expect(await new GmailEmailReader({ auth: SERVER_AUTH, fetch: http }).start()).toEqual({ cursor: '77' });
    });

    it('reads the new mails of the history as messages', async () => {
        const { http, calls } = fakeFetch([
            [TOKEN_URL, () => ({ body: { access_token: 'a' } })],
            [`${GMAIL}/history`, (url) => (url.includes('pageToken=p2')
                ? { body: { history: [{ id: '103', messagesAdded: [{ message: { id: 'm3' } }] }], historyId: '105' } }
                : { body: { history: [{ id: '101', messagesAdded: [{ message: { id: 'm1' } }] }, { id: '102', messagesAdded: [{ message: { id: 'm2' } }, { message: { id: 'm1' } }] }], nextPageToken: 'p2' } })],
            [`${GMAIL}/messages/m1`, () => ({ body: gmailMessage('m1') })],
            [`${GMAIL}/messages/m2`, () => ({ body: gmailMessage('m2', { labelIds: ['SENT'] }) })],
            [`${GMAIL}/messages/m3`, () => ({ status: 404 })],
        ]);
        const batch = await new GmailEmailReader({ auth: SERVER_AUTH, fetch: http }).read('100');
        expect(new URL(calls[1].url).searchParams.get('startHistoryId')).toBe('100');
        expect(batch.cursor).toBe('105');
        expect(batch.messages).toEqual([
            { id: 'm1', threadId: 't-m1', from: 'Ada <ada@example.com>', to: 'lead@acme.it', subject: 'Mail m1', date: new Date(1763200000000).toISOString(), text: 'Ciao Acme', direction: 'inbound', cursor: '101' },
            expect.objectContaining({ id: 'm2', direction: 'outbound', cursor: '102' }),
        ]);
    });

    it('stops at the limit and goes on from the last record read', async () => {
        const { http } = fakeFetch([
            [TOKEN_URL, () => ({ body: { access_token: 'a' } })],
            [`${GMAIL}/history`, () => ({ body: { history: [
                { id: '101', messagesAdded: [{ message: { id: 'm1' } }] },
                { id: '102', messagesAdded: [{ message: { id: 'm2' } }] },
                { id: '103', messagesAdded: [{ message: { id: 'm3' } }] },
            ], historyId: '103' } })],
            [`${GMAIL}/messages/`, (url) => ({ body: gmailMessage(url.split('/messages/')[1].split('?')[0]) })],
        ]);
        const batch = await new GmailEmailReader({ auth: SERVER_AUTH, fetch: http }).read('100', { limit: 2 });
        expect(batch.messages.map((m) => m.id)).toEqual(['m1', 'm2']);
        expect(batch.cursor).toBe('102');
    });

    it('gives each message the cursor after it, also inside a record', async () => {
        const { http } = fakeFetch([
            [TOKEN_URL, () => ({ body: { access_token: 'a' } })],
            [`${GMAIL}/history`, () => ({ body: { history: [
                { id: '101', messagesAdded: [{ message: { id: 'm1' } }] },
                { id: '102', messagesAdded: [{ message: { id: 'm2' } }, { message: { id: 'm3' } }] },
            ], historyId: '104' } })],
            [`${GMAIL}/messages/`, (url) => ({ body: gmailMessage(url.split('/messages/')[1].split('?')[0]) })],
        ]);
        const batch = await new GmailEmailReader({ auth: SERVER_AUTH, fetch: http }).read('100');
        expect(batch.messages.map((m) => [m.id, m.cursor])).toEqual([['m1', '101'], ['m2', '101'], ['m3', '102']]);
        expect(batch.cursor).toBe('104');
    });

    it('starts again from now when the history no longer reaches the cursor', async () => {
        const { http } = fakeFetch([
            [TOKEN_URL, () => ({ body: { access_token: 'a' } })],
            [`${GMAIL}/history`, () => ({ status: 404 })],
            [`${GMAIL}/profile`, () => ({ body: { historyId: '900' } })],
        ]);
        expect(await new GmailEmailReader({ auth: SERVER_AUTH, fetch: http }).read('1')).toEqual({ messages: [], cursor: '900' });
    });

    it('decodes the push notification of Pub/Sub', () => {
        const data = btoa(JSON.stringify({ emailAddress: 'Lead@Acme.it', historyId: 4321 }));
        expect(decodeGmailPushNotification(data)).toEqual({ emailAddress: 'lead@acme.it', historyId: '4321' });
        expect(decodeGmailPushNotification(btoa('nope'))).toBeNull();
        expect(decodeGmailPushNotification(undefined)).toBeNull();
    });
});

describe('createGmailOAuth', () => {
    it('gives the consent page and exchanges the code for the mailbox and its refresh token', async () => {
        const { http, calls } = fakeFetch([
            [TOKEN_URL, () => ({ body: { access_token: 'a', refresh_token: 'r' } })],
            [`${GMAIL}/profile`, () => ({ body: { emailAddress: 'Lead@Acme.it' } })],
        ]);
        const oauth = createGmailOAuth({ clientId: 'cid', clientSecret: 's', redirectUri: 'https://app/cb', fetch: http });
        const url = new URL(oauth.authorizationUrl({ state: 'st', scopes: ['a', 'b'] }));
        expect(Object.fromEntries(url.searchParams)).toMatchObject({ client_id: 'cid', redirect_uri: 'https://app/cb', scope: 'a b', access_type: 'offline', prompt: 'consent', state: 'st' });
        expect(await oauth.exchangeCode('code-1')).toEqual({ email: 'lead@acme.it', refreshToken: 'r' });
        expect(String(calls[0].init.body)).toContain('grant_type=authorization_code');
    });

    it('refuses a grant without refresh token', async () => {
        const { http } = fakeFetch([[TOKEN_URL, () => ({ body: { access_token: 'a' } })]]);
        await expect(createGmailOAuth({ clientId: 'c', clientSecret: 's', redirectUri: 'r', fetch: http }).exchangeCode('x'))
            .rejects.toMatchObject({ code: 'unauthorized' });
    });
});

/** IMAP modules on a mailbox in memory: UIDs 1..n, a UIDVALIDITY, the options of the last client. */
function fakeImap(mailbox: { uidValidity: number; mails: { uid: number; raw: string }[] }, connect: () => Promise<void> = async () => undefined) {
    const opened: Record<string, unknown>[] = [];
    let loggedOut = 0;
    const modules: ImapModules = {
        ImapFlow: class {
            constructor(options: Record<string, unknown>) { opened.push(options); }
            connect = connect;
            async mailboxOpen() {
                const last = mailbox.mails.at(-1)?.uid ?? 0;
                return { uidValidity: BigInt(mailbox.uidValidity), uidNext: last + 1 };
            }
            async *fetch(range: string) {
                const from = Number(range.split(':')[0]);
                const found = mailbox.mails.filter((m) => m.uid >= from);
                // `n:*` returns the last message even when it is older than n.
                for (const mail of found.length ? found : mailbox.mails.slice(-1)) yield { uid: mail.uid, source: Buffer.from(mail.raw) };
            }
            async logout() { loggedOut += 1; }
        } as unknown as ImapModules['ImapFlow'],
        simpleParser: async (source) => {
            const [subject, text] = source.toString().split('|');
            return { subject, text, from: { text: 'Ada <ada@example.com>' }, to: [{ text: 'info@acme.it' }], date: new Date('2026-11-15T10:00:00Z'), messageId: `<${subject}@x>` };
        },
    };
    return { modules: async () => modules, opened, loggedOut: () => loggedOut };
}

describe('ImapEmailReader', () => {
    const CONFIG = { host: 'imap.acme.it', user: 'info@acme.it', password: 'app-pass' };

    it('starts from the end of the mailbox', async () => {
        const imap = fakeImap({ uidValidity: 7, mails: [{ uid: 1, raw: 'a|x' }, { uid: 2, raw: 'b|y' }] });
        expect(await new ImapEmailReader(CONFIG, { modules: imap.modules }).start()).toEqual({ cursor: '7:2' });
        expect(imap.opened[0]).toMatchObject({ host: 'imap.acme.it', port: 993, secure: true, auth: { user: 'info@acme.it', pass: 'app-pass' } });
        expect(imap.loggedOut()).toBe(1);
    });

    it('reads the mails after the cursor, up to the limit', async () => {
        const imap = fakeImap({ uidValidity: 7, mails: [{ uid: 1, raw: 'a|x' }, { uid: 2, raw: 'b|y' }, { uid: 3, raw: 'c|z' }] });
        const reader = new ImapEmailReader(CONFIG, { modules: imap.modules });
        const first = await reader.read('7:1', { limit: 1 });
        expect(first).toEqual({
            messages: [{ id: '7-2', threadId: '<b@x>', from: 'Ada <ada@example.com>', to: 'info@acme.it', subject: 'b', date: '2026-11-15T10:00:00.000Z', text: 'y', direction: 'inbound', cursor: '7:2' }],
            cursor: '7:2',
        });
        expect((await reader.read(first.cursor)).messages.map((m) => m.subject)).toEqual(['c']);
        expect(await reader.read('7:3')).toEqual({ messages: [], cursor: '7:3' });
    });

    it('starts again from now when the mailbox was renumbered', async () => {
        const imap = fakeImap({ uidValidity: 8, mails: [{ uid: 1, raw: 'a|x' }, { uid: 2, raw: 'b|y' }] });
        expect(await new ImapEmailReader(CONFIG, { modules: imap.modules }).read('7:1')).toEqual({ messages: [], cursor: '8:2' });
    });

    it('tells refused credentials from a server that does not answer', async () => {
        const refused = fakeImap({ uidValidity: 1, mails: [] }, async () => { throw Object.assign(new Error('no'), { authenticationFailed: true }); });
        await expect(new ImapEmailReader(CONFIG, { modules: refused.modules }).start()).rejects.toMatchObject({ code: 'unauthorized', provider: 'IMAP' });
        const down = fakeImap({ uidValidity: 1, mails: [] }, async () => { throw new Error('ETIMEDOUT'); });
        await expect(new ImapEmailReader(CONFIG, { modules: down.modules }).start()).rejects.toMatchObject({ code: 'unavailable' });
        await expect(new ImapEmailReader({ ...CONFIG, password: '' }).start()).rejects.toMatchObject({ code: 'not-configured' });
    });
});
