import type { ProviderConfigurable } from '../ProviderConfiguration';

// The category `emailRead` (CR-130): the new mails of a mailbox, from a cursor the app keeps. The same
// messages whatever provider reads them (Gmail with Pub/Sub, IMAP by UID).

export interface EmailMessage {
    /** The id of the message in its mailbox. */
    id: string;
    /** The conversation: Gmail's thread, the Message-ID of the first message elsewhere. */
    threadId: string;
    /** The headers as text (`Ada <ada@example.com>`). */
    from: string;
    to: string;
    subject: string;
    /** CR-146 — its `Message-ID`, and the ones it answers (`In-Reply-To`, `References`): a reply is recognised by them. */
    messageId?: string;
    inReplyTo?: string;
    references?: string;
    /** When it arrived, ISO 8601. */
    date: string;
    /** The plain text: the text part, else the HTML without tags. */
    text: string;
    /** `outbound` for a message the mailbox sent itself (Gmail's SENT). */
    direction: 'inbound' | 'outbound';
    /**
     * CR-155 — the files of the message (the parts with a file name), when it has any. Their `content` is there
     * only when the reading asks for it (`EmailReadOptions.attachments`).
     */
    attachments?: EmailReadAttachment[];
    /**
     * Where to read on from once this message is handled: when the app stops at a message (its handler
     * failed), it keeps the `cursor` of the last one handled and the next reading starts with the rest.
     * With Gmail the next reading may give again the messages of the same history record handled before it.
     */
    cursor: string;
}

/** CR-155 — a file of a message read. */
export interface EmailReadAttachment {
    filename: string;
    contentType: string;
    /** Bytes. */
    size: number;
    /** A part shown inside the body (an image of the signature) rather than a file the sender attached. */
    inline?: boolean;
    /** The bytes, when the reading asked for them and the file is not above `maxBytes`. */
    content?: Uint8Array;
}

export interface EmailReadStart {
    /** Where reading goes on from: opaque, the app keeps it as it is. */
    cursor: string;
    /** Gmail: when its push to Pub/Sub ends; call `start()` again before. */
    expiresAt?: string;
}

export interface EmailReadBatch {
    messages: EmailMessage[];
    /** The cursor to read on from next time. */
    cursor: string;
}

export interface EmailReadOptions {
    /** At most this many messages (default 50): the returned cursor goes on from the last one. */
    limit?: number;
    /**
     * CR-155 — also the content of the files: `true`, or the largest file read (`maxBytes`, default
     * `DEFAULT_EMAIL_ATTACHMENT_MAX_BYTES`). A larger file stays listed without `content`.
     */
    attachments?: boolean | { maxBytes?: number };
}

/** CR-156 — the mails of a period: `from` included, `to` excluded (ISO dates), a page at a time. */
export interface EmailReadRangeOptions extends EmailReadOptions {
    from: string;
    to: string;
    /** The `next` of the page before; none for the first page. */
    page?: string;
}

/** CR-156 — a page of a period. The messages carry `cursor: ''`: a period is not a reading position. */
export interface EmailReadRangeBatch {
    messages: EmailMessage[];
    /** The page after this one; absent on the last page. */
    next?: string;
}

export interface EmailReadAdapter extends ProviderConfigurable {
    /** Reading starts now: the mails already in the mailbox stay out. */
    start(): Promise<EmailReadStart>;
    /**
     * The new mails since `cursor`, oldest first, and the cursor after them. A cursor the mailbox no longer
     * knows (Gmail's history expired, IMAP's UIDVALIDITY changed) starts again from now, reading nothing old.
     */
    read(cursor: string, options?: EmailReadOptions): Promise<EmailReadBatch>;
    /**
     * CR-156 — the mails received in a period, a page at a time (an app that connects a mailbox late, or reads a
     * past period again). Optional: an adapter without it reads no period.
     */
    readRange?(options: EmailReadRangeOptions): Promise<EmailReadRangeBatch>;
}

/** The two ends of a period, checked: `from` before `to`. */
export function rangeOf({ from, to }: { from: string; to: string }): { from: Date; to: Date } | null {
    const start = new Date(from);
    const end = new Date(to);
    return Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || start >= end ? null : { from: start, to: end };
}

export const DEFAULT_EMAIL_READ_LIMIT = 50;

/** CR-155 — 10 MB. */
export const DEFAULT_EMAIL_ATTACHMENT_MAX_BYTES = 10 * 1024 * 1024;

/** The largest file whose content a reading takes, or `null` when it takes none. */
export function attachmentMaxBytes(options: EmailReadOptions['attachments']): number | null {
    if (!options) return null;
    return options === true ? DEFAULT_EMAIL_ATTACHMENT_MAX_BYTES : options.maxBytes ?? DEFAULT_EMAIL_ATTACHMENT_MAX_BYTES;
}
