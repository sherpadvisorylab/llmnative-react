// `@llmnative/react/server`: what a Node server needs: server-held AI credentials (CR-102), GitHub sign-in,
// the email adapters (CR-130).
// No React and no browser API: it runs in the app's own server or in the Vite dev proxy.

import { findServerCredentials, isAIProviderTarget, type ServerAIConnection } from './serverCredentials';

export { AI_PROVIDER_HOSTS, isAIProviderTarget, serverCredential, SERVER_CREDENTIAL_PREFIX } from './serverCredentials';
export type { ServerAIConnection } from './serverCredentials';
// Sign-in with GitHub held by the app's server (CR-104): authorize URL, code exchange, profile, organizations.
export { createGitHubOAuth, GitHubOAuthError } from '../auth/github/githubOAuth';
export type { GitHubOAuth, GitHubOAuthConfig, GitHubOAuthOrganization, GitHubOAuthUser } from '../auth/github/githubOAuth';
// Provider-agnostic identity of models (CR-103): pure, so a server or a generator can resolve them too.
export { canonicalModelName, buildModelIdentityIndex, resolveModel, modelOffers, loadModelIdentityIndex } from './modelIdentity';
export type { ModelIdentity, ModelIdentityEntry, ModelIdentityIndex, ResolvedModel, ModelOffer, ModelCost } from './modelIdentity';

// The AI adapters on a server (CR-132): the same ones the browser uses, with a key or what gives a fresh one,
// structured answers validated against the project's schema, the tokens used, where each model processes the data.
export { createAIProvider, AI_PROVIDER_DEFINITIONS, createOpenAICompatibleProviderDefinition, createCloudflareProviderDefinition, getAIModelCatalog, formatAIModelRef, parseAIModelRef, AIOutputError, validateJsonSchema, extractJson } from './index';
export type {
    AIProviderAdapter, AIProviderDefinition, AIModelDescriptor, AIProviderCapabilities, AICompleteRequest, AICompleteResult, AIStructuredOutput,
    AIStructuredOutputMode, AIUsage, AIDataRegion, AICredential, AIAttachment, AIReasoningLevel, JsonSchema, JsonSchemaType,
} from './index';

/** The connection of a provider as the server keeps it, key included. */
export type ServerAISecret = ServerAIConnection & { apiKey: string };

/** The key of `provider` for `scope` (e.g. a company), or nothing when it is not connected. */
export type ServerCredentialLookup = (scope: string, provider: string) => ServerAISecret | undefined | Promise<ServerAISecret | undefined>;

export type ServerCredentialRequest = { url: string; headers: Record<string, string> };

export type ServerCredentialResolution =
    | { ok: true; url: string; headers: Record<string, string> }
    /** 404: the provider is not connected for that scope; 403: the target is not a host of that provider. */
    | { ok: false; status: 403 | 404; error: 'unknown-credential' | 'forbidden-target'; provider: string };

/**
 * Swaps every server-credential placeholder of a proxied request (headers and URL) for the key it
 * stands for. The key only goes to a host of its provider: any other target is refused, so a
 * placeholder can never carry a key elsewhere. A request without placeholders passes unchanged.
 */
export async function resolveServerCredentials(request: ServerCredentialRequest, lookup: ServerCredentialLookup): Promise<ServerCredentialResolution> {
    const found = [request.url, ...Object.values(request.headers)].flatMap(findServerCredentials);
    if (found.length === 0) return { ok: true, url: request.url, headers: request.headers };

    const target = new URL(request.url);
    let { url } = request;
    let headers = { ...request.headers };
    const done = new Set<string>();
    for (const { placeholder, scope, provider } of found) {
        if (done.has(placeholder)) continue;
        done.add(placeholder);
        const secret = await lookup(scope, provider);
        if (!secret?.apiKey) return { ok: false, status: 404, error: 'unknown-credential', provider };
        if (!isAIProviderTarget({ ...secret, id: provider }, target)) return { ok: false, status: 403, error: 'forbidden-target', provider };
        url = url.split(placeholder).join(encodeURIComponent(secret.apiKey));
        headers = Object.fromEntries(Object.entries(headers).map(([name, value]) => [name, value.split(placeholder).join(secret.apiKey)]));
    }
    return { ok: true, url, headers };
}

// Email (CR-130): the adapters of `emailSend` and `emailRead` for a server, Gmail's OAuth and push. IMAP loads
// the optional packages `imapflow` and `mailparser` only when it reads.
export { EmailProviderError } from '../email/EmailError';
export type { EmailProviderErrorCode } from '../email/EmailError';
export type { EmailSendAdapter, EmailSendParams, EmailSendResult, EmailAddress, EmailRecipient } from '../email/EmailSend';
export type { EmailReadAdapter, EmailMessage, EmailReadStart, EmailReadBatch, EmailReadOptions } from '../email/EmailRead';
export { EMAIL_SEND_PROVIDER_DEFINITIONS, EMAIL_READ_PROVIDER_DEFINITIONS } from '../email/definitions';
export type { EmailSendProviderId, EmailReadProviderId } from '../email/definitions';
export { ResendEmailSender } from '../email/resend/ResendEmailSender';
export type { ResendEmailSenderConfig } from '../email/resend/ResendEmailSender';
export { BrevoEmailSender } from '../email/brevo/BrevoEmailSender';
export type { BrevoEmailSenderConfig } from '../email/brevo/BrevoEmailSender';
export { GmailEmailSender } from '../email/gmail/GmailEmailSender';
export type { GmailEmailSenderConfig } from '../email/gmail/GmailEmailSender';
export { GmailEmailReader, decodeGmailPushNotification } from '../email/gmail/GmailEmailReader';
export type { GmailEmailReaderConfig } from '../email/gmail/GmailEmailReader';
export { createGmailOAuth } from '../email/gmail/gmailOAuth';
export type { GmailOAuth, GmailOAuthConfig } from '../email/gmail/gmailOAuth';
export { GMAIL_SCOPES } from '../email/gmail/gmailApi';
export type { GmailAuth } from '../email/gmail/gmailApi';
export { ImapEmailReader } from '../email/imap/ImapEmailReader';
export type { ImapEmailReaderConfig, ImapModules } from '../email/imap/ImapEmailReader';
