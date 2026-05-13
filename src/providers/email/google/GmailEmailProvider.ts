import { EmailProviderAdapter, EmailSendParams } from '../EmailProvider';
import {
    createConfigurationState,
    getMissingKeys,
    type ProviderConfigurationState,
} from '../../ProviderConfiguration';
import { authConfig } from '../../auth/google/auth';
import { sendEmail as gmailSend } from './email';

export class GmailEmailProvider implements EmailProviderAdapter {
    getConfigurationState(): ProviderConfigurationState {
        return createConfigurationState(
            'GmailEmailProvider',
            getMissingKeys(authConfig('oAuth2') as Record<string, unknown> | undefined, ['clientId'], 'google.oAuth2.')
        );
    }

    isConfigured(): boolean {
        return this.getConfigurationState().configured;
    }

    async send(params: EmailSendParams): Promise<void> {
        if (!this.isConfigured()) {
            throw new Error(this.getConfigurationState().reason || 'GmailEmailProvider is not configured.');
        }

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
