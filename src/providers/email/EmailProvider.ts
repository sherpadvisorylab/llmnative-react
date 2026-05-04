export interface EmailSendParams {
    to: string | string[];
    bcc?: string | string[];
    subject: string;
    message: string;
}

export interface EmailProvider {
    send(params: EmailSendParams): Promise<void>;
}
