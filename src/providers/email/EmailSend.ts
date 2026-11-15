import type { ProviderConfigurable } from '../ProviderConfiguration';
import { EmailProviderError } from './EmailError';

// The category `emailSend` (CR-130): one contract to send a message, whatever provider sends it.

/** An address, with the name shown to who reads it. */
export type EmailAddress = { email: string; name?: string };

/** An address as text (`ada@example.com`) or with its name. */
export type EmailRecipient = string | EmailAddress;

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
    return {
        from: sender?.email ? sender : undefined,
        to, cc, bcc,
        replyTo: params.replyTo ? toEmailAddress(params.replyTo) : undefined,
        subject: params.subject,
        html: params.html || undefined,
        text: params.text || undefined,
        threadId: params.threadId,
    };
}

export type PreparedEmail = ReturnType<typeof prepareEmail>;
