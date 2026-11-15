import { createConfigurationState, getMissingKeys, type ProviderConfigurationState } from '../../ProviderConfiguration';
import { callEmailApi, EmailProviderError } from '../EmailError';
import { formatEmailAddress, prepareEmail, type EmailRecipient, type EmailSendAdapter, type EmailSendParams, type EmailSendResult } from '../EmailSend';

export const RESEND_EMAIL_URL = 'https://api.resend.com/emails';

export type ResendEmailSenderConfig = {
    apiKey: string;
    /** The default sender, on a domain verified in Resend. */
    from?: EmailRecipient;
    /** The `fetch` to use (a proxy, a test). */
    fetch?: typeof fetch;
};

/**
 * Sends with Resend (CR-130). The key is a secret: use it on a server, not in a browser bundle.
 */
export class ResendEmailSender implements EmailSendAdapter {
    constructor(private readonly config: ResendEmailSenderConfig) {}

    getConfigurationState(): ProviderConfigurationState {
        return createConfigurationState('ResendEmailSender', getMissingKeys(this.config as Record<string, unknown>, ['apiKey']));
    }

    isConfigured(): boolean {
        return this.getConfigurationState().configured;
    }

    async send(params: EmailSendParams): Promise<EmailSendResult> {
        if (!this.isConfigured()) throw new EmailProviderError('not-configured', 'Resend', 'Resend has no API key');
        const mail = prepareEmail('Resend', params, this.config.from);
        const list = (addresses: typeof mail.to) => (addresses.length ? addresses.map(formatEmailAddress) : undefined);
        const sent = await callEmailApi<{ id?: string }>('Resend', this.config.fetch ?? globalThis.fetch, RESEND_EMAIL_URL, {
            method: 'POST',
            headers: { authorization: `Bearer ${this.config.apiKey}`, 'content-type': 'application/json' },
            body: JSON.stringify({
                from: formatEmailAddress(mail.from!),
                to: list(mail.to),
                cc: list(mail.cc),
                bcc: list(mail.bcc),
                reply_to: mail.replyTo ? formatEmailAddress(mail.replyTo) : undefined,
                subject: mail.subject,
                html: mail.html,
                text: mail.text,
            }),
        });
        return { id: String(sent.id ?? '') };
    }
}
