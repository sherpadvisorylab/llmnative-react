import type { ProviderConfigurable } from '../ProviderConfiguration';

// Mirrors the contract long-designed in the CMS's own docs/12-providers.md (originally
// planned as a CMS-only category, moved into the framework so it gets the same registry/
// adapter treatment as data/storage/auth/email). A site can configure several channels, each
// with its own domain — one flagged isDefault as the target used when none is picked
// explicitly (CMS-side concern, not part of this contract). deploy()/rollback()/
// getDeployments() are the full contract; concrete vendor classes (CloudflarePagesProvider,
// NetlifyProvider, ...) come later once a Build Engine actually produces BuildArtifacts to
// hand them — see providers/publish/definitions.ts for the metadata-only descriptors
// available today.

export interface BuildManifest {
    pages: number;
    sizeBytes: number;
    generatedAt: string;
}

export interface BuildArtifacts {
    buildId: string;
    outputPath: string;
    manifest: BuildManifest;
}

// Reserved for future deploy-time hints — no fields yet, since nothing produces or reads any today.
export type DeployOptions = Record<string, never>;

export interface DeployResult {
    success: boolean;
    buildId: string;
    url?: string;
    error?: string;
}

export interface Deployment {
    buildId: string;
    timestamp: string;
    status: 'success' | 'failed' | 'in_progress';
    url?: string;
}

export interface PublishProviderAdapter extends ProviderConfigurable {
    deploy(artifacts: BuildArtifacts, options?: DeployOptions): Promise<DeployResult>;
    rollback(buildId: string): Promise<DeployResult>;
    getDeployments(limit?: number): Promise<Deployment[]>;
}
