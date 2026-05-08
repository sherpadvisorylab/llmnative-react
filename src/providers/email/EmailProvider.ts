export interface EmailSendParams {
    to: string | string[];
    bcc?: string | string[];
    subject: string;
    message: string;
}

export interface EmailProviderAdapter {
    send(params: EmailSendParams): Promise<void>;
}
