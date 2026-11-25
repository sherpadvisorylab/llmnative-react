import { createConfigurationState, getMissingKeys, type ProviderConfigurationState } from '../../ProviderConfiguration';
import { EmailProviderError } from '../EmailError';
import { attachmentMaxBytes, DEFAULT_EMAIL_READ_LIMIT, rangeOf, type EmailMessage, type EmailReadAttachment, type EmailReadRangeBatch, type EmailReadRangeOptions, type EmailReadAdapter, type EmailReadBatch, type EmailReadOptions, type EmailReadStart } from '../EmailRead';

export type ImapEmailReaderConfig = {
    host: string;
    /** Default 993. */
    port?: number;
    /** TLS from the start (default `true`, port 993); `false` for STARTTLS or plain (port 143). */
    secure?: boolean;
    user: string;
    /** The password, or an app password where the provider has them. */
    password: string;
    /** Default `INBOX`. */
    mailbox?: string;
};

/** The parts of `imapflow` and `mailparser` the reader uses: injectable for tests. */
export type ImapModules = {
    ImapFlow: new (options: Record<string, unknown>) => ImapClient;
    simpleParser: (source: Buffer) => Promise<ParsedMail>;
};

type ImapClient = {
    connect(): Promise<void>;
    mailboxOpen(path: string, options?: { readOnly?: boolean }): Promise<{ uidValidity: bigint | number; uidNext: number }>;
    fetch(range: string, query: { uid?: boolean; source?: boolean }, options?: { uid?: boolean }): AsyncIterable<{ uid: number; source?: Buffer }>;
    /** CR-156: the UIDs of the messages of a period (by day, as IMAP searches). */
    search(query: { since?: Date; before?: Date }, options?: { uid?: boolean }): Promise<number[] | false>;
    logout(): Promise<void>;
};

type ParsedAddress = { text?: string };
type ParsedMail = {
    messageId?: string;
    inReplyTo?: string;
    references?: string | string[];
    from?: ParsedAddress;
    to?: ParsedAddress | ParsedAddress[];
    subject?: string;
    date?: Date;
    text?: string;
    html?: string | false;
    attachments?: { filename?: string; contentType?: string; size?: number; contentDisposition?: string; related?: boolean; content?: Uint8Array }[];
};

const PROVIDER = 'IMAP';

const loadModules = async (): Promise<ImapModules> => {
    try {
        const [{ ImapFlow }, { simpleParser }] = await Promise.all([import('imapflow'), import('mailparser')]);
        return { ImapFlow: ImapFlow as unknown as ImapModules['ImapFlow'], simpleParser: simpleParser as unknown as ImapModules['simpleParser'] };
    } catch (cause) {
        throw new EmailProviderError('not-configured', PROVIDER, 'IMAP needs the packages imapflow and mailparser', { cause });
    }
};

const addresses = (value: ParsedAddress | ParsedAddress[] | undefined): string =>
    (Array.isArray(value) ? value : value ? [value] : []).map((a) => a.text ?? '').filter(Boolean).join(', ');

/** A parsed mail as an `EmailMessage`, with the content of its files up to `maxBytes` (CR-155). */
function toMessage(mail: ParsedMail, id: string, cursor: string, maxBytes: number | null): EmailMessage {
    const files: EmailReadAttachment[] = (mail.attachments ?? []).filter((a) => a.filename).map((a) => {
        const size = Number(a.size ?? a.content?.byteLength ?? 0);
        return {
            filename: String(a.filename),
            contentType: a.contentType || 'application/octet-stream',
            size,
            ...(a.contentDisposition === 'inline' || a.related ? { inline: true } : {}),
            ...(maxBytes !== null && a.content && size <= maxBytes ? { content: new Uint8Array(a.content) } : {}),
        };
    });
    const text = (mail.text ?? (typeof mail.html === 'string' ? mail.html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ') : '')).trim();
    return {
        id,
        threadId: mail.messageId ?? id,
        from: addresses(mail.from),
        to: addresses(mail.to),
        subject: mail.subject ?? '',
        ...(mail.messageId ? { messageId: mail.messageId } : {}),
        ...(mail.inReplyTo ? { inReplyTo: mail.inReplyTo } : {}),
        ...(mail.references ? { references: Array.isArray(mail.references) ? mail.references.join(' ') : mail.references } : {}),
        date: (mail.date ?? new Date()).toISOString(),
        text,
        direction: 'inbound',
        cursor,
        ...(files.length ? { attachments: files } : {}),
    };
}

/** `<uidValidity>:<last uid read>`. */
const cursorOf = (uidValidity: string, lastUid: number) => `${uidValidity}:${lastUid}`;

const parseCursor = (cursor: string): { uidValidity: string; lastUid: number } | null => {
    const match = /^(\d+):(\d+)$/.exec(cursor);
    return match ? { uidValidity: match[1], lastUid: Number(match[2]) } : null;
};

/**
 * Reads a mailbox with IMAP (CR-130), for the providers without push: the app calls `read()` every few
 * minutes. The cursor is the UIDVALIDITY of the mailbox and the last UID read; a new UIDVALIDITY (the
 * mailbox renumbered) starts again from now. Server only: it opens a TCP connection. Needs the optional
 * packages `imapflow` and `mailparser`, loaded on the first read.
 */
export class ImapEmailReader implements EmailReadAdapter {
    constructor(private readonly config: ImapEmailReaderConfig, private readonly options: { modules?: () => Promise<ImapModules> } = {}) {}

    getConfigurationState(): ProviderConfigurationState {
        return createConfigurationState('ImapEmailReader', getMissingKeys(this.config as Record<string, unknown>, ['host', 'user', 'password']));
    }

    isConfigured(): boolean {
        return this.getConfigurationState().configured;
    }

    /** Opens the mailbox read-only, runs `work`, logs out whatever happens. */
    private async withMailbox<T>(work: (client: ImapClient, box: { uidValidity: string; lastUid: number }, modules: ImapModules) => Promise<T>): Promise<T> {
        const state = this.getConfigurationState();
        if (!state.configured) throw new EmailProviderError('not-configured', PROVIDER, state.reason ?? 'IMAP is not configured');
        const modules = await (this.options.modules ?? loadModules)();
        const client = new modules.ImapFlow({
            host: this.config.host,
            port: this.config.port ?? 993,
            secure: this.config.secure ?? true,
            auth: { user: this.config.user, pass: this.config.password },
            logger: false,
            socketTimeout: 30_000,
        });
        try {
            await client.connect();
        } catch (cause) {
            const authFailed = (cause as { authenticationFailed?: boolean } | null)?.authenticationFailed === true;
            throw new EmailProviderError(authFailed ? 'unauthorized' : 'unavailable', PROVIDER, authFailed ? 'The IMAP server refused the credentials' : 'The IMAP server did not answer', { cause });
        }
        try {
            const box = await client.mailboxOpen(this.config.mailbox ?? 'INBOX', { readOnly: true });
            return await work(client, { uidValidity: String(box.uidValidity), lastUid: Math.max(0, Number(box.uidNext) - 1) }, modules);
        } finally {
            await client.logout().catch(() => undefined);
        }
    }

    async start(): Promise<EmailReadStart> {
        return this.withMailbox(async (_client, box) => ({ cursor: cursorOf(box.uidValidity, box.lastUid) }));
    }

    /**
     * CR-156: the mails received in a period, oldest first, a page at a time: `SEARCH SINCE/BEFORE` (by day), then
     * only those of the exact period; the position in the list as `next`.
     */
    async readRange({ from, to, page, limit = DEFAULT_EMAIL_READ_LIMIT, attachments }: EmailReadRangeOptions): Promise<EmailReadRangeBatch> {
        const range = rangeOf({ from, to });
        if (!range) throw new EmailProviderError('invalid-message', PROVIDER, 'The period needs a start before its end');
        const maxBytes = attachmentMaxBytes(attachments);
        return this.withMailbox(async (client, box, { simpleParser }) => {
            const day = (date: Date) => new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
            const before = day(range.to);
            if (before < range.to) before.setUTCDate(before.getUTCDate() + 1);
            const found = await client.search({ since: day(range.from), before }, { uid: true });
            const uids = (found || []).slice().sort((a, b) => a - b);
            const start = Math.max(0, Number(page) || 0);
            const slice = uids.slice(start, start + limit);
            const messages: EmailMessage[] = [];
            if (slice.length) {
                for await (const item of client.fetch(slice.join(','), { uid: true, source: true }, { uid: true })) {
                    if (!item.source) continue;
                    const message = toMessage(await simpleParser(item.source), `${box.uidValidity}-${item.uid}`, '', maxBytes);
                    const at = new Date(message.date).getTime();
                    if (at >= range.from.getTime() && at < range.to.getTime()) messages.push(message);
                }
            }
            const next = start + limit;
            return { messages, ...(next < uids.length ? { next: String(next) } : {}) };
        });
    }

    async read(cursor: string, { limit = DEFAULT_EMAIL_READ_LIMIT, attachments }: EmailReadOptions = {}): Promise<EmailReadBatch> {
        const maxBytes = attachmentMaxBytes(attachments);
        return this.withMailbox(async (client, box, { simpleParser }) => {
            const from = parseCursor(cursor);
            if (!from || from.uidValidity !== box.uidValidity) return { messages: [], cursor: cursorOf(box.uidValidity, box.lastUid) };
            const messages: EmailMessage[] = [];
            let lastUid = from.lastUid;
            if (box.lastUid > from.lastUid) {
                for await (const item of client.fetch(`${from.lastUid + 1}:*`, { uid: true, source: true }, { uid: true })) {
                    // `n:*` always returns the last message, even when it is older than n.
                    if (item.uid <= from.lastUid || !item.source) continue;
                    messages.push(toMessage(await simpleParser(item.source), `${box.uidValidity}-${item.uid}`, cursorOf(box.uidValidity, item.uid), maxBytes));
                    lastUid = Math.max(lastUid, item.uid);
                    if (messages.length >= limit) break;
                }
            }
            return { messages, cursor: cursorOf(box.uidValidity, lastUid) };
        });
    }
}
