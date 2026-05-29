export type ProxyProviderName = 'vite' | 'express' | 'nextjs-app' | 'nextjs-pages' | 'cloudflare';

export type ProxyScaffoldDescriptor = {
    label: string;
    templateFile: string;
    outputPath: string;
    hint: string;
};

export const PROXY_SCAFFOLD_MAP: Record<ProxyProviderName, ProxyScaffoldDescriptor> = {
    vite: {
        label: 'Vite dev server',
        templateFile: 'vite.ts',
        outputPath: 'src/proxy/proxy.ts',
        hint: 'Import createProxyPlugin() and add it to plugins[] in vite.config.ts',
    },
    express: {
        label: 'Express',
        templateFile: 'express.ts',
        outputPath: 'src/proxy/proxy.ts',
        hint: 'Import registerProxy() and mount it with app.use() in your server entry',
    },
    'nextjs-app': {
        label: 'Next.js App Router',
        templateFile: 'nextjs-app.ts',
        outputPath: 'app/api/proxy/route.ts',
        hint: 'File placed at app/api/proxy/route.ts — no extra setup needed',
    },
    'nextjs-pages': {
        label: 'Next.js Pages Router',
        templateFile: 'nextjs-pages.ts',
        outputPath: 'pages/api/proxy.ts',
        hint: 'File placed at pages/api/proxy.ts — no extra setup needed',
    },
    cloudflare: {
        label: 'Cloudflare Worker / Pages Function',
        templateFile: 'cloudflare.ts',
        outputPath: 'functions/api/proxy.ts',
        hint: 'File placed at functions/api/proxy.ts for Cloudflare Pages, or deploy as a standalone Worker',
    },
};

export const PROXY_PROVIDER_NAMES = Object.keys(PROXY_SCAFFOLD_MAP) as ProxyProviderName[];

export const getProxyScaffold = (name: ProxyProviderName): ProxyScaffoldDescriptor => {
    const descriptor = PROXY_SCAFFOLD_MAP[name];
    if (!descriptor) {
        throw new Error(`Unknown proxy provider: "${name}". Available: ${PROXY_PROVIDER_NAMES.join(', ')}`);
    }
    return descriptor;
};

