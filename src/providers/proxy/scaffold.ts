// Single source of truth shared with the CLI (scripts/cli/setup-devtools.js), which requires
// the same JSON file directly at scaffold time — see scripts/cli/proxy-templates/scaffold.json.
// Kept as JSON (not .ts) so a plain Node script can read it without a TypeScript loader.
import scaffoldData from '../../../scripts/cli/proxy-templates/scaffold.json';

export type ProxyProviderName = 'vite' | 'express' | 'nextjs-app' | 'nextjs-pages' | 'cloudflare';

export type ProxyScaffoldDescriptor = {
    label: string;
    outputPath: string;
    hint: string;
    /** Copied verbatim into outputPath — for server runtimes with no importable package build (express/nextjs/cloudflare). */
    templateFile?: string;
    /**
     * outputPath is generated as a one-line re-export of this instead of a copy — for runtimes
     * where the framework already ships a real, separately-built package export (vite only:
     * `@llmnative/react/vite` → dist/vite.mjs). Never goes stale relative to the real implementation.
     */
    packageExport?: string;
    exportName?: string;
};

export const PROXY_SCAFFOLD_MAP: Record<ProxyProviderName, ProxyScaffoldDescriptor> = scaffoldData;

export const PROXY_PROVIDER_NAMES = Object.keys(PROXY_SCAFFOLD_MAP) as ProxyProviderName[];

export const getProxyScaffold = (name: ProxyProviderName): ProxyScaffoldDescriptor => {
    const descriptor = PROXY_SCAFFOLD_MAP[name];
    if (!descriptor) {
        throw new Error(`Unknown proxy provider: "${name}". Available: ${PROXY_PROVIDER_NAMES.join(', ')}`);
    }
    return descriptor;
};
