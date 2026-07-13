---
title: PublishProvider
group: Service providers
order: 75
path: /providers/publish
description: Deploy static builds to hosting providers — metadata-only descriptors today, with a runtime adapter contract ready for future build pipelines.
---

# PublishProvider

`PublishProvider` is a framework category for static-site deployment — the "publish" counterpart of the build process. It provides a common `deploy()` / `rollback()` / `getDeployments()` contract so that the same CMS or admin UI can publish to Cloudflare Pages, Netlify, Firebase Hosting, GitHub Pages, SFTP, etc. without hardcoding the vendor.

## Status

**Runtime adapters are not yet implemented.** No build engine produces `BuildArtifacts` to hand to them yet — this is on the CMS roadmap, not started.

What **does** exist today is the metadata layer:

- the `PublishProviderAdapter` interface (ready for when a build pipeline exists)
- `PUBLISH_PROVIDER_DEFINITIONS` — a list of `ProviderDescriptor` objects for every supported channel, so a "connect this publishing channel" UI can be built today

## Contract

```ts
interface PublishProviderAdapter extends ProviderConfigurable {
    deploy(artifacts: BuildArtifacts, options?: DeployOptions): Promise<DeployResult>;
    rollback(buildId: string): Promise<DeployResult>;
    getDeployments(limit?: number): Promise<Deployment[]>;
}
```

### Types

| Type | Fields |
|------|--------|
| `BuildManifest` | `pages: number`, `sizeBytes: number`, `generatedAt: string` |
| `BuildArtifacts` | `buildId: string`, `outputPath: string`, `manifest: BuildManifest` |
| `DeployResult` | `success: boolean`, `buildId: string`, `url?: string`, `error?: string` |
| `Deployment` | `buildId: string`, `timestamp: string`, `status: 'success' \| 'failed' \| 'in_progress'`, `url?: string` |
| `DeployOptions` | `Record<string, never>` (reserved for future deploy-time hints) |

## Supported channels (descriptors)

These are metadata-only today. They let a UI show each channel's name, description, credential fields and help links — no actual deployment happens.

| Channel | ID | Credentials needed |
|---------|----|--------------------|
| Cloudflare Pages | `cloudflare_pages` | API Token, Account ID, Project name |
| Firebase Hosting | `firebase_hosting` | Project ID, Site ID, Service account JSON |
| Supabase (Storage) | `supabase_storage` | Project URL, Service role key, Bucket name |
| FTP | `ftp` | Host, Port, Username, Password, Remote path |
| SFTP | `sftp` | Host, Port, Username, Password/key, Remote path |
| Netlify | `netlify` | Personal access token, Site ID |
| GitHub Pages | `github_pages` | Repository, Branch, Access token |
| AWS S3 + CloudFront | `s3_cloudfront` | Access Key ID, Secret Access Key, Bucket, Distribution ID, Region |
| Static export (download) | `static_export` | None (packages build as archive for self-hosting) |

## Access the definitions

```ts
import { PUBLISH_PROVIDER_DEFINITIONS } from '@llmnative/react';

PUBLISH_PROVIDER_DEFINITIONS.forEach((channel) => {
    console.log(channel.label, channel.credentialFields);
});
```

Each definition follows the `ProviderDescriptor` shape (`id`, `label`, `description`, `credentialFields`, `credentialsUrl`, `credentialsHint`) — the same shape used by AI provider descriptors for a "connect this service" UI.

## Future

Once a build engine produces `BuildArtifacts`, concrete adapter classes will be added:

- `CloudflarePagesProvider`
- `NetlifyProvider`
- `FirebaseHostingProvider`
- `GitHubPagesProvider`
- `S3CloudFrontProvider`
- `FtpProvider` / `SftpProvider`
- `StaticExportProvider`

Each will implement `PublishProviderAdapter` and be registered through the normal provider registry:

```tsx
<App
    providers={{
        custom: {
            publish: new CloudflarePagesProvider({
                apiToken: env.CLOUDFLARE_API_TOKEN,
                accountId: env.CLOUDFLARE_ACCOUNT_ID,
            }),
        },
    }}
/>
```

## Related pages

- [ProviderDescriptor](/docs/provider-descriptor)
- [AppProvidersConfig](/docs/app-configuration#appprovidersconfig)
