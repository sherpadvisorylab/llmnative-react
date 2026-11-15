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
    /** When it arrived, ISO 8601. */
    date: string;
    /** The plain text: the text part, else the HTML without tags. */
    text: string;
    /** `outbound` for a message the mailbox sent itself (Gmail's SENT). */
    direction: 'inbound' | 'outbound';
    /**
     * Where to read on from once this message is handled: when the app stops at a message (its handler
     * failed), it keeps the `cursor` of the last one handled and the next reading starts with the rest.
     * With Gmail the next reading may give again the messages of the same history record handled before it.
     */
    cursor: string;
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
}

export interface EmailReadAdapter extends ProviderConfigurable {
    /** Reading starts now: the mails already in the mailbox stay out. */
    start(): Promise<EmailReadStart>;
    /**
     * The new mails since `cursor`, oldest first, and the cursor after them. A cursor the mailbox no longer
     * knows (Gmail's history expired, IMAP's UIDVALIDITY changed) starts again from now, reading nothing old.
     */
    read(cursor: string, options?: EmailReadOptions): Promise<EmailReadBatch>;
}

export const DEFAULT_EMAIL_READ_LIMIT = 50;
