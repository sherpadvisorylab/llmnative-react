import type { ProviderConfigurable } from '../ProviderConfiguration';
import { EmailProviderError } from './EmailError';

// The category `emailSend` (CR-130): one contract to send a message, whatever provider sends it.

/** An address, with the name shown to who reads it. */
export type EmailAddress = { email: string; name?: string };

/** An address as text (`ada@example.com`) or with its name. */
export type EmailRecipient = string | EmailAddress;

/** CR-146 — a file sent with a message. */
export type EmailAttachment = {
    /** The name the reader sees. */
    filename: string;
    /** The content, in base64. */
    content: string;
    /** Its MIME type. Default: `application/octet-stream`. */
    contentType?: string;
};

export interface EmailSendParams {
    /** The sender; without it, the adapter's own `from`. */
    from?: EmailRecipient;
    to: EmailRecipient | EmailRecipient[];
    cc?: EmailRecipient | EmailRecipient[];
    bcc?: EmailRecipient | EmailRecipient[];
    replyTo?: EmailRecipient;
    subject: string;
    /** The body as HTML, as text, or both (the reader's client picks). At least one. */
    html?: string;
    text?: string;
    /** Gmail: the conversation the message joins. The other providers ignore it. */
    threadId?: string;
    /** CR-146 — files sent with the message. */
    attachments?: EmailAttachment[];
    /**
     * CR-146 — headers to add: `Message-ID`, `In-Reply-To`, `References` (a reply recognised by its client) or an
     * `X-` header of the app. A name outside these, or a value with a line break, is refused (`invalid-message`).
     */
    headers?: Record<string, string>;
}

export interface EmailSendResult {
    /** The id the provider gave the message. */
    id: string;
    threadId?: string;
}

export interface EmailSendAdapter extends ProviderConfigurable {
    send(params: EmailSendParams): Promise<EmailSendResult>;
}

/** An address as `{ email, name? }`. */
export const toEmailAddress = (recipient: EmailRecipient): EmailAddress =>
    typeof recipient === 'string' ? { email: recipient.trim() } : { email: recipient.email.trim(), ...(recipient.name ? { name: recipient.name } : {}) };

/** One or more addresses as a list, without the empty ones. */
export const toEmailAddresses = (recipients: EmailRecipient | EmailRecipient[] | undefined): EmailAddress[] =>
    (recipients === undefined ? [] : Array.isArray(recipients) ? recipients : [recipients])
        .map(toEmailAddress)
        .filter((address) => address.email !== '');

/** An address as a header shows it: `Ada <ada@example.com>`, or the bare address. */
export const formatEmailAddress = ({ email, name }: EmailAddress): string =>
    name ? `${/[",<>@;:]/.test(name) ? JSON.stringify(name) : name} <${email}>` : email;

/**
 * The message an adapter sends: sender and recipients as addresses, at least one recipient and one body.
 * Throws `invalid-message` or (no sender, when the provider needs one) `not-configured`.
 */
export function prepareEmail(provider: string, params: EmailSendParams, defaultFrom: EmailRecipient | undefined, { fromRequired = true } = {}) {
    const from = params.from ?? defaultFrom;
    const sender = from ? toEmailAddress(from) : undefined;
    if (fromRequired && !sender?.email) throw new EmailProviderError('not-configured', provider, `${provider} has no sender`);
    const to = toEmailAddresses(params.to);
    const cc = toEmailAddresses(params.cc);
    const bcc = toEmailAddresses(params.bcc);
    if (to.length + cc.length + bcc.length === 0) throw new EmailProviderError('invalid-message', provider, 'The message has no recipient');
    if (!params.html && !params.text) throw new EmailProviderError('invalid-message', provider, 'The message has no body');
    const attachments = (params.attachments ?? []).map((a) => {
        if (!a || typeof a.filename !== 'string' || !a.filename.trim() || /[\r\n"]/.test(a.filename) || typeof a.content !== 'string' || !/^[A-Za-z0-9+/=\s]*$/.test(a.content)) {
            throw new EmailProviderError('invalid-message', provider, 'An attachment is not valid');
        }
        return { filename: a.filename.trim(), content: a.content.replace(/\s+/g, ''), contentType: a.contentType && /^[\w.+-]+\/[\w.+-]+$/.test(a.contentType) ? a.contentType : 'application/octet-stream' };
    });
    const headers: Record<string, string> = {};
    for (const [name, value] of Object.entries(params.headers ?? {})) {
        if (!HEADER_PERMESSI.has(name.toLowerCase()) && !/^x-[a-z0-9-]+$/i.test(name)) throw new EmailProviderError('invalid-message', provider, `The header ${name} is not allowed`);
        if (typeof value !== 'string' || /[\r\n]/.test(value)) throw new EmailProviderError('invalid-message', provider, `The header ${name} is not valid`);
        headers[name] = value;
    }
    return {
        from: sender?.email ? sender : undefined,
        to, cc, bcc,
        replyTo: params.replyTo ? toEmailAddress(params.replyTo) : undefined,
        subject: params.subject,
        html: params.html || undefined,
        text: params.text || undefined,
        threadId: params.threadId,
        attachments,
        headers,
    };
}

/** The headers a message may add besides the `X-` ones of the app: those of a reply. */
const HEADER_PERMESSI = new Set(['message-id', 'in-reply-to', 'references']);

export type PreparedEmail = ReturnType<typeof prepareEmail>;
