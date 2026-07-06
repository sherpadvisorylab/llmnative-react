import { createApiProvider } from './ApiProvider';
import type { EmailProviderAdapter, EmailSendParams } from '../email/EmailProvider';

/**
 * Bridges the generic "api" engine into the `email` category's own interface, so a
 * declaratively-registered provider (Brevo, Resend, ...) is indistinguishable from a
 * hand-written one (GmailEmailProvider) to the rest of the app:
 *
 *   setProvider('email', 'brevo', createEmailApiProvider({...}))
 *   useEmailProvider('brevo').send({ to, subject, message })   // same call as Gmail
 *
 * Without this, a declaratively-registered provider would sit in a separate 'api' category
 * behind useApiProvider() instead — working, but defeating the point of the email category:
 * swapping vendors without the caller knowing or caring which one it's talking to.
 *
 * Full chain for a call: EmailProviderAdapter.send() -> mapParams() -> the 'api' engine's
 * merge+dispatch (secret injected authoritatively) -> proxyFetch (CORS) -> fetch -> response.
 */
export type EmailApiProviderRegistration = {
    name: string;
    url: string;
    /** Default: 'POST'. */
    method?: string;
    header?: Record<string, string>;
    query?: Record<string, string>;
    /**
     * Every provider's send API shapes its body differently (Brevo wants sender/to[]/htmlContent,
     * not EmailSendParams's to/subject/message) — this is the one bit that can't be pure data.
     * Defaults to passing EmailSendParams through unchanged, for a target that happens to match.
     */
    mapParams?: (params: EmailSendParams) => Record<string, unknown>;
    gatewayUrl?: string;
};

export function createEmailApiProvider(registration: EmailApiProviderRegistration): EmailProviderAdapter {
    const engine = createApiProvider({
        name: registration.name,
        header: registration.header,
        query: registration.query,
        gatewayUrl: registration.gatewayUrl,
        endpoints: [{ name: 'send', method: registration.method ?? 'POST', url: registration.url }],
    });

    return {
        async send(params: EmailSendParams): Promise<void> {
            const body = registration.mapParams ? registration.mapParams(params) : (params as unknown as Record<string, unknown>);
            await engine.send(body);
        },
    };
}
