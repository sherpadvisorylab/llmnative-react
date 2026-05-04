import { EmailProvider, EmailSendParams } from '../EmailProvider';
import { sendEmail as gmailSend } from './email';

export class GmailEmailProvider implements EmailProvider {
    async send(params: EmailSendParams): Promise<void> {
        await gmailSend({
            to: Array.isArray(params.to) ? params.to : [params.to],
            bcc: params.bcc
                ? (Array.isArray(params.bcc) ? params.bcc : [params.bcc])
                : undefined,
            subject: params.subject,
            message: params.message,
        });
    }
}
