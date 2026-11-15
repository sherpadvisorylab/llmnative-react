import type { ProviderConfigurationState } from '../../ProviderConfiguration';
import { callEmailApi, EmailProviderError } from '../EmailError';
import { DEFAULT_EMAIL_READ_LIMIT, type EmailMessage, type EmailReadAdapter, type EmailReadBatch, type EmailReadOptions, type EmailReadStart } from '../EmailRead';
import { fromBase64Url, GMAIL_API, gmailAccessToken, gmailConfigurationState, PROVIDER, toEmailMessage, type GmailApiMessage, type GmailAuth } from './gmailApi';

export type GmailEmailReaderConfig = {
    auth: GmailAuth;
    /**
     * The Pub/Sub topic Gmail notifies (`projects/<project>/topics/<name>`, with `roles/pubsub.publisher` to
     * `gmail-api-push@system.gserviceaccount.com`). Without it `start()` registers no push: the app reads by polling.
     */
    topic?: string;
    /** The label read (default `INBOX`). */
    labelId?: string;
    fetch?: typeof fetch;
};

type HistoryPage = {
    history?: { id: string; messagesAdded?: { message: { id: string } }[] }[];
    historyId?: string;
    nextPageToken?: string;
};

/**
 * Reads a Gmail mailbox (CR-130) by its history: the cursor is a `historyId`. With a `topic`, `start()` also
 * asks Gmail to notify the topic of every change (the push lasts 7 days: call `start()` again before
 * `expiresAt`); a notification (`decodeGmailPushNotification`) tells the app when to `read()`.
 * Scope `GMAIL_SCOPES.read`.
 */
export class GmailEmailReader implements EmailReadAdapter {
    constructor(private readonly config: GmailEmailReaderConfig) {}

    getConfigurationState(): ProviderConfigurationState {
        return gmailConfigurationState('GmailEmailReader', this.config.auth);
    }

    isConfigured(): boolean {
        return this.getConfigurationState().configured;
    }

    private async session() {
        const state = this.getConfigurationState();
        if (!state.configured) throw new EmailProviderError('not-configured', PROVIDER, state.reason ?? 'Gmail is not configured');
        const http = this.config.fetch ?? globalThis.fetch;
        const token = await gmailAccessToken(this.config.auth, http);
        const call = <T>(path: string, init: RequestInit = {}) =>
            callEmailApi<T>(PROVIDER, http, `${GMAIL_API}${path}`, { ...init, headers: { authorization: `Bearer ${token}`, ...(init.body ? { 'content-type': 'application/json' } : {}) } });
        return { call, label: this.config.labelId ?? 'INBOX' };
    }

    async start(): Promise<EmailReadStart> {
        const { call, label } = await this.session();
        if (!this.config.topic) {
            const profile = await call<{ historyId: string }>('/profile');
            return { cursor: String(profile.historyId) };
        }
        const watch = await call<{ historyId: string; expiration?: string }>('/watch', {
            method: 'POST',
            body: JSON.stringify({ topicName: this.config.topic, labelIds: [label] }),
        });
        return {
            cursor: String(watch.historyId),
            ...(watch.expiration ? { expiresAt: new Date(Number(watch.expiration)).toISOString() } : {}),
        };
    }

    async read(cursor: string, { limit = DEFAULT_EMAIL_READ_LIMIT }: EmailReadOptions = {}): Promise<EmailReadBatch> {
        const { call, label } = await this.session();
        // Each message with the cursor after it: its record's id when it is the record's last message, else the
        // cursor before the record (reading from there gives the rest of the record again).
        const taken: { id: string; cursor: string }[] = [];
        let next = cursor;
        let pageToken: string | undefined;
        let full = false;
        try {
            do {
                const params = new URLSearchParams({ startHistoryId: cursor, historyTypes: 'messageAdded', labelId: label });
                if (pageToken) params.set('pageToken', pageToken);
                const page = await call<HistoryPage>(`/history?${params}`);
                for (const record of page.history ?? []) {
                    const added = [...new Set((record.messagesAdded ?? []).map((m) => m.message.id))].filter((id) => !taken.some((t) => t.id === id));
                    // A record is taken whole: the cursor stops before the one that would go past the limit.
                    if (taken.length > 0 && taken.length + added.length > limit) { full = true; break; }
                    const before = next;
                    added.forEach((id, i) => taken.push({ id, cursor: i === added.length - 1 ? String(record.id) : before }));
                    next = String(record.id);
                }
                if (full) break;
                if (page.historyId) next = String(page.historyId);
                pageToken = page.nextPageToken;
            } while (pageToken);
        } catch (error) {
            // The history no longer reaches the cursor: start again from now.
            if (error instanceof EmailProviderError && error.status === 404) {
                const profile = await call<{ historyId: string }>('/profile');
                return { messages: [], cursor: String(profile.historyId) };
            }
            throw error;
        }
        const messages: EmailMessage[] = [];
        for (const { id, cursor: after } of taken) {
            try {
                messages.push(toEmailMessage(await call<GmailApiMessage>(`/messages/${encodeURIComponent(id)}?format=full`), after));
            } catch (error) {
                // Deleted in the meantime.
                if (!(error instanceof EmailProviderError && error.status === 404)) throw error;
            }
        }
        return { messages, cursor: next };
    }
}

/**
 * The notification Gmail publishes on the topic: the `data` of the Pub/Sub message (base64 JSON) as
 * `{ emailAddress, historyId }`, or `null` when it is not one.
 */
export function decodeGmailPushNotification(data: string | undefined | null): { emailAddress: string; historyId: string } | null {
    if (!data) return null;
    try {
        const parsed = JSON.parse(fromBase64Url(data)) as { emailAddress?: unknown; historyId?: unknown };
        if (typeof parsed.emailAddress !== 'string' || parsed.historyId === undefined) return null;
        return { emailAddress: parsed.emailAddress.toLowerCase(), historyId: String(parsed.historyId) };
    } catch {
        return null;
    }
}
