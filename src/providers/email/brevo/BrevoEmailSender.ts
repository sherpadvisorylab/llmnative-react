import { createConfigurationState, getMissingKeys, type ProviderConfigurationState } from '../../ProviderConfiguration';
import { callEmailApi, EmailProviderError } from '../EmailError';
import { prepareEmail, type EmailAddress, type EmailRecipient, type EmailSendAdapter, type EmailSendParams, type EmailSendResult } from '../EmailSend';

export const BREVO_EMAIL_URL = 'https://api.brevo.com/v3/smtp/email';

export type BrevoEmailSenderConfig = {
    apiKey: string;
    /** The default sender, a sender or domain verified in Brevo. */
    from?: EmailRecipient;
    /** The `fetch` to use (a proxy, a test). */
    fetch?: typeof fetch;
};

/** An address as Brevo takes it. */
const brevoAddress = ({ email, name }: EmailAddress) => (name ? { email, name } : { email });

/**
 * Sends with Brevo's transactional API (CR-130). The key is a secret: use it on a server, not in a
 * browser bundle.
 */
export class BrevoEmailSender implements EmailSendAdapter {
    constructor(private readonly config: BrevoEmailSenderConfig) {}

    getConfigurationState(): ProviderConfigurationState {
        return createConfigurationState('BrevoEmailSender', getMissingKeys(this.config as Record<string, unknown>, ['apiKey']));
    }

    isConfigured(): boolean {
        return this.getConfigurationState().configured;
    }

    async send(params: EmailSendParams): Promise<EmailSendResult> {
        if (!this.isConfigured()) throw new EmailProviderError('not-configured', 'Brevo', 'Brevo has no API key');
        const mail = prepareEmail('Brevo', params, this.config.from);
        const list = (addresses: EmailAddress[]) => (addresses.length ? addresses.map(brevoAddress) : undefined);
        const sent = await callEmailApi<{ messageId?: string }>('Brevo', this.config.fetch ?? globalThis.fetch, BREVO_EMAIL_URL, {
            method: 'POST',
            headers: { 'api-key': this.config.apiKey, 'content-type': 'application/json', accept: 'application/json' },
            body: JSON.stringify({
                sender: brevoAddress(mail.from!),
                to: list(mail.to),
                cc: list(mail.cc),
                bcc: list(mail.bcc),
                replyTo: mail.replyTo ? brevoAddress(mail.replyTo) : undefined,
                subject: mail.subject,
                htmlContent: mail.html,
                textContent: mail.text,
                attachment: mail.attachments.length ? mail.attachments.map((a) => ({ name: a.filename, content: a.content })) : undefined,
                headers: Object.keys(mail.headers).length ? mail.headers : undefined,
            }),
        });
        return { id: String(sent.messageId ?? '') };
    }
}
