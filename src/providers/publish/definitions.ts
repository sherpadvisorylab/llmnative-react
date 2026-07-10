// Metadata for the static-site publish/deploy channels a "connect" UI can offer —
// deliberately separate from PublishProviderAdapter (./PublishProvider.ts), which is the
// runtime deploy()/rollback()/getDeployments() contract. No adapter exists yet for any of
// these — there's no Build Engine producing BuildArtifacts to hand them yet (CMS roadmap,
// not started) — this list exists so a consuming app has a real id/label/credential-field/
// docs-link table to build a channel-picker UI against today. Add the corresponding
// PublishProviderAdapter class here once a build pipeline exists to actually call it.
import type { ProviderDescriptor } from '../ProviderDescriptor';

export type PublishProviderId =
    | 'cloudflare_pages'
    | 'firebase_hosting'
    | 'supabase_storage'
    | 'ftp'
    | 'sftp'
    | 'netlify'
    | 'github_pages'
    | 's3_cloudfront'
    | 'static_export';

export const PUBLISH_PROVIDER_DEFINITIONS: ProviderDescriptor[] = [
    {
        id:          'cloudflare_pages',
        label:       'Cloudflare Pages',
        description: 'Static hosting on Cloudflare\'s edge network, with native rollback.',
        credentialFields: [
            { key: 'apiToken',   label: 'API Token',    type: 'password' },
            { key: 'accountId',  label: 'Account ID',   type: 'text' },
            { key: 'projectName', label: 'Project name', type: 'text', placeholder: 'my-site' },
        ],
        credentialsUrl:  'https://dash.cloudflare.com/profile/api-tokens',
        credentialsHint: 'Cloudflare dashboard → My Profile → API Tokens → Create Token (Pages edit permission).',
    },
    {
        id:          'firebase_hosting',
        label:       'Firebase Hosting',
        description: 'Google\'s static hosting, same project family as Firestore/Auth.',
        credentialFields: [
            { key: 'projectId',        label: 'Firebase project ID', type: 'text' },
            { key: 'siteId',           label: 'Hosting site ID',     type: 'text' },
            { key: 'serviceAccountJson', label: 'Service account JSON', type: 'password' },
        ],
        credentialsUrl:  'https://console.firebase.google.com/project/_/settings/serviceaccounts/adminsdk',
        credentialsHint: 'Firebase Console → Project settings → Service accounts → Generate new private key.',
    },
    {
        id:          'supabase_storage',
        label:       'Supabase (Storage + custom domain)',
        description: 'Not a hosting product — serves the static build from a public Storage bucket behind your own domain. DIY, not officially supported by Supabase.',
        credentialFields: [
            { key: 'projectUrl',   label: 'Project URL',   type: 'text', placeholder: 'https://xyzcompany.supabase.co' },
            { key: 'serviceKey',   label: 'Service role key', type: 'password' },
            { key: 'bucketName',   label: 'Bucket name',   type: 'text' },
        ],
        credentialsUrl:  'https://supabase.com/dashboard/project/_/settings/api',
        credentialsHint: 'Supabase dashboard → Project Settings → API → service_role key (never the anon key).',
    },
    {
        id:          'ftp',
        label:       'FTP',
        description: 'Direct upload to any server over plain FTP — legacy, usually unencrypted; prefer SFTP when the server supports it.',
        credentialFields: [
            { key: 'host',       label: 'Host',        type: 'text', placeholder: 'ftp.example.com' },
            { key: 'port',       label: 'Port',         type: 'text', placeholder: '21' },
            { key: 'username',   label: 'Username',     type: 'text' },
            { key: 'password',   label: 'Password',     type: 'password' },
            { key: 'remotePath', label: 'Remote path',  type: 'text', placeholder: '/var/www/html' },
        ],
        credentialsHint: 'Ask your hosting provider or server admin for FTP host, port, and credentials.',
    },
    {
        id:          'sftp',
        label:       'SFTP',
        description: 'Direct upload to any server over SFTP (SSH) — no vendor lock-in.',
        credentialFields: [
            { key: 'host',       label: 'Host',        type: 'text', placeholder: 'sftp.example.com' },
            { key: 'port',       label: 'Port',         type: 'text', placeholder: '22' },
            { key: 'username',   label: 'Username',     type: 'text' },
            { key: 'password',   label: 'Password / key', type: 'password' },
            { key: 'remotePath', label: 'Remote path',  type: 'text', placeholder: '/var/www/html' },
        ],
        credentialsHint: 'Ask your hosting provider or server admin for SFTP host, port, and credentials.',
    },
    {
        id:          'netlify',
        label:       'Netlify',
        description: 'Popular JAMstack hosting with a simple deploy API.',
        credentialFields: [
            { key: 'accessToken', label: 'Personal access token', type: 'password' },
            { key: 'siteId',      label: 'Site ID',                type: 'text' },
        ],
        credentialsUrl:  'https://app.netlify.com/user/applications#personal-access-tokens',
        credentialsHint: 'Netlify → User settings → Applications → New access token.',
    },
    {
        id:          'github_pages',
        label:       'GitHub Pages',
        description: 'Publishes by pushing the build to a branch of a GitHub repository.',
        credentialFields: [
            { key: 'repo',  label: 'Repository', type: 'text', placeholder: 'owner/repo' },
            { key: 'branch', label: 'Branch',     type: 'text', placeholder: 'gh-pages' },
            { key: 'token', label: 'Access token', type: 'password' },
        ],
        credentialsUrl:  'https://github.com/settings/tokens',
        credentialsHint: 'GitHub → Settings → Developer settings → Personal access tokens (repo scope).',
    },
    {
        id:          's3_cloudfront',
        label:       'AWS S3 + CloudFront',
        description: 'Classic static hosting on S3, served and cached through a CloudFront distribution.',
        credentialFields: [
            { key: 'accessKeyId',     label: 'Access Key ID',     type: 'text' },
            { key: 'secretAccessKey', label: 'Secret Access Key', type: 'password' },
            { key: 'bucketName',      label: 'Bucket name',       type: 'text' },
            { key: 'distributionId',  label: 'CloudFront distribution ID', type: 'text' },
            { key: 'region',          label: 'Region', type: 'text', placeholder: 'us-east-1' },
        ],
        credentialsUrl:  'https://console.aws.amazon.com/iam/home#/security_credentials',
        credentialsHint: 'AWS IAM → Security credentials → Access keys, for a user with S3 + CloudFront invalidation permissions.',
    },
    {
        id:          'static_export',
        label:       'Static export (download)',
        description: 'No vendor — packages the build as a downloadable archive for self-hosting anywhere else.',
        credentialFields: [],
    },
];
