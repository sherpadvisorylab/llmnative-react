import type { ProviderConfigurable } from '../ProviderConfiguration';

export interface EmailSendParams {
    to: string | string[];
    bcc?: string | string[];
    subject: string;
    message: string;
}

export interface EmailProviderAdapter extends ProviderConfigurable {
    send(params: EmailSendParams): Promise<void>;
}
