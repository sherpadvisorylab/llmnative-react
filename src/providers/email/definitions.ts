// Metadata for the email providers a "connect" UI can offer (CR-130): what each is called, the credentials it
// needs and where to get them — separate from the runtime contracts (EmailSendAdapter, EmailReadAdapter).
// The providers with an adapter in the framework: Resend, Brevo, Gmail (send); Gmail, IMAP (read).
import type { ProviderDescriptor } from '../ProviderDescriptor';

export type EmailSendProviderId = 'resend' | 'brevo' | 'gmail' | 'sendgrid' | 'mailgun' | 'postmark' | 'ses' | 'smtp';
export type EmailReadProviderId = 'gmail' | 'imap';

const GMAIL_CONSENT_STEPS = [
    'Google Cloud console → APIs & Services → enable the Gmail API.',
    'OAuth consent screen: add the Gmail scopes the app asks for.',
    'Credentials → Create OAuth client ID → Web application, with the redirect URI of the app\'s server.',
    'In the app, connect the mailbox: Google asks the owner for consent.',
];

export const EMAIL_SEND_PROVIDER_DEFINITIONS: ProviderDescriptor[] = [
    {
        id:          'resend',
        label:       'Resend',
        description: 'Developer-first transactional email API.',
        credentialFields: [
            { key: 'apiKey', label: 'API Key', type: 'password', placeholder: 're_...' },
            { key: 'from',   label: 'Sender',  type: 'text',     placeholder: 'App <noreply@yourdomain.com>' },
        ],
        credentialsUrl:  'https://resend.com/api-keys',
        credentialsHint: 'Resend dashboard → API Keys → Create API Key. The sender\'s domain must be verified under Domains.',
    },
    {
        id:          'brevo',
        label:       'Brevo',
        description: 'Transactional and marketing email, EU-based.',
        credentialFields: [
            { key: 'apiKey', label: 'API Key', type: 'password', placeholder: 'xkeysib-...' },
            { key: 'from',   label: 'Sender',  type: 'text',     placeholder: 'App <noreply@yourdomain.com>' },
        ],
        credentialsUrl:  'https://app.brevo.com/settings/keys/api',
        credentialsHint: 'Brevo → SMTP & API → API Keys → Generate a new API key. The sender must be verified under Senders, Domains & Dedicated IPs.',
    },
    {
        id:          'gmail',
        label:       'Gmail',
        description: 'Send from a Gmail or Google Workspace mailbox, with the owner\'s consent.',
        credentialFields: [],
        credentialsUrl:   'https://console.cloud.google.com/apis/credentials',
        credentialsSteps: GMAIL_CONSENT_STEPS,
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

export const EMAIL_READ_PROVIDER_DEFINITIONS: ProviderDescriptor[] = [
    {
        id:          'gmail',
        label:       'Gmail',
        description: 'New mails arrive at once, through a Pub/Sub topic of Google Cloud.',
        credentialFields: [],
        credentialsUrl:   'https://console.cloud.google.com/cloudpubsub/topic/list',
        credentialsSteps: [
            ...GMAIL_CONSENT_STEPS,
            'Pub/Sub: create a topic and give roles/pubsub.publisher on it to gmail-api-push@system.gserviceaccount.com.',
        ],
    },
    {
        id:          'imap',
        label:       'IMAP',
        description: 'Any other mailbox, read every few minutes.',
        credentialFields: [
            { key: 'host',     label: 'IMAP server', type: 'text',     placeholder: 'imap.example.com' },
            { key: 'port',     label: 'Port',        type: 'text',     placeholder: '993' },
            { key: 'user',     label: 'User',        type: 'text',     placeholder: 'name@example.com' },
            { key: 'password', label: 'Password',    type: 'password' },
        ],
        credentialsHint: 'The IMAP settings of your mail provider. Use an app password where the provider has them.',
    },
];
