import type { ProviderConfigurationState } from '../../ProviderConfiguration';
import { callEmailApi, EmailProviderError } from '../EmailError';
import { prepareEmail, type EmailRecipient, type EmailSendAdapter, type EmailSendParams, type EmailSendResult } from '../EmailSend';
import { GMAIL_API, gmailAccessToken, gmailConfigurationState, gmailRawMessage, PROVIDER, type GmailAuth } from './gmailApi';

export type GmailEmailSenderConfig = {
    auth: GmailAuth;
    /** The sender shown; without it Gmail uses the address of the account (an alias must be set in Gmail). */
    from?: EmailRecipient;
    fetch?: typeof fetch;
};

/**
 * Sends from a Gmail mailbox (CR-130): with the browser's Google sign-in (`auth.accessToken`), or on a server
 * with the app's OAuth client and the mailbox's refresh token (scope `GMAIL_SCOPES.send`). `threadId` keeps a
 * reply in its conversation.
 */
export class GmailEmailSender implements EmailSendAdapter {
    constructor(protected readonly config: GmailEmailSenderConfig) {}

    getConfigurationState(): ProviderConfigurationState {
        return gmailConfigurationState('GmailEmailSender', this.config.auth);
    }

    isConfigured(): boolean {
        return this.getConfigurationState().configured;
    }

    async send(params: EmailSendParams): Promise<EmailSendResult> {
        const state = this.getConfigurationState();
        if (!state.configured) throw new EmailProviderError('not-configured', PROVIDER, state.reason ?? 'Gmail is not configured');
        const mail = prepareEmail(PROVIDER, params, this.config.from, { fromRequired: false });
        const http = this.config.fetch ?? globalThis.fetch;
        const token = await gmailAccessToken(this.config.auth, http);
        const sent = await callEmailApi<{ id?: string; threadId?: string }>(PROVIDER, http, `${GMAIL_API}/messages/send`, {
            method: 'POST',
            headers: { authorization: `Bearer ${token}`, 'content-type': 'application/json' },
            body: JSON.stringify({ raw: gmailRawMessage(mail), ...(mail.threadId ? { threadId: mail.threadId } : {}) }),
        });
        return { id: String(sent.id ?? ''), ...(sent.threadId ? { threadId: String(sent.threadId) } : {}) };
    }
}
