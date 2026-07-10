// Metadata for the outbound transactional email providers a "connect" UI can offer —
// deliberately separate from EmailProviderAdapter (./EmailProvider.ts), which is the runtime
// send() contract. No adapter exists yet for any of these (only GmailEmailProvider does,
// under ./google, a different OAuth-based flow) — this list exists so a consuming app isn't
// forced to hand-roll its own id/label/credential-field/docs-link table while waiting for
// the real adapters to be built. Add the corresponding EmailProviderAdapter here when one
// of these actually gains send() support; the descriptor below doesn't need to change.
import type { ProviderDescriptor } from '../ProviderDescriptor';

export type EmailProviderId = 'resend' | 'sendgrid' | 'mailgun' | 'postmark' | 'ses' | 'smtp';

export const EMAIL_PROVIDER_DEFINITIONS: ProviderDescriptor[] = [
    {
        id:          'resend',
        label:       'Resend',
        description: 'Developer-first transactional email API.',
        credentialFields: [{ key: 'apiKey', label: 'API Key', type: 'password', placeholder: 're_...' }],
        credentialsUrl:  'https://resend.com/api-keys',
        credentialsHint: 'Resend dashboard → API Keys → Create API Key.',
    },
    {
        id:          'sendgrid',
        label:       'SendGrid',
        description: 'Scalable email delivery by Twilio.',
        credentialFields: [{ key: 'apiKey', label: 'API Key', type: 'password', placeholder: 'SG...' }],
        credentialsUrl:  'https://app.sendgrid.com/settings/api_keys',
        credentialsHint: 'SendGrid dashboard → Settings → API Keys → Create API Key.',
    },
    {
        id:          'mailgun',
        label:       'Mailgun',
        description: 'Email API with analytics and webhooks.',
        credentialFields: [
            { key: 'apiKey', label: 'API Key',        type: 'password' },
            { key: 'domain', label: 'Mailgun domain', type: 'text', placeholder: 'mg.yourdomain.com' },
        ],
        credentialsUrl:  'https://app.mailgun.com/settings/api_security/api_keys',
        credentialsHint: 'Mailgun dashboard → Security → API Keys. The domain is the sending domain you verified under Sending → Domains.',
    },
    {
        id:          'postmark',
        label:       'Postmark',
        description: 'High-deliverability transactional email.',
        credentialFields: [{ key: 'serverToken', label: 'Server API Token', type: 'password' }],
        credentialsUrl:  'https://account.postmarkapp.com/servers',
        credentialsHint: 'Postmark → your Server → API Tokens tab (each server has its own token).',
    },
    {
        id:          'ses',
        label:       'AWS SES',
        description: 'Amazon Simple Email Service.',
        credentialFields: [
            { key: 'accessKeyId',     label: 'Access Key ID',     type: 'text' },
            { key: 'secretAccessKey', label: 'Secret Access Key', type: 'password' },
            { key: 'region',          label: 'Region',            type: 'text', placeholder: 'us-east-1' },
        ],
        credentialsUrl:  'https://console.aws.amazon.com/iam/home#/security_credentials',
        credentialsHint: 'AWS IAM → Security credentials → Access keys, for a user with SES send permissions.',
    },
    {
        id:          'smtp',
        label:       'SMTP',
        description: 'Any SMTP-compatible mail server.',
        credentialFields: [
            { key: 'host',     label: 'Host',     type: 'text',     placeholder: 'smtp.example.com' },
            { key: 'port',     label: 'Port',     type: 'text',     placeholder: '587' },
            { key: 'username', label: 'Username', type: 'text' },
            { key: 'password', label: 'Password', type: 'password' },
        ],
        credentialsHint: 'Ask your mail host or hosting provider for the SMTP host, port, and credentials.',
    },
];
