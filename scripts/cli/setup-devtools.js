const fs = require('fs');
const path = require('path');

const root = process.cwd();
const PROXY_SRC = path.resolve(__dirname, '../../src/providers/proxy');

const PROXY_PROVIDERS = {
    vite:           { src: 'vite.ts',          dest: 'dev/proxy.ts' },
    express:        { src: 'express.ts',        dest: 'server/proxy.ts' },
    'nextjs-app':   { src: 'nextjs-app.ts',     dest: 'app/api/proxy/route.ts' },
    'nextjs-pages': { src: 'nextjs-pages.ts',   dest: 'pages/api/proxy.ts' },
    cloudflare:     { src: 'cloudflare.ts',     dest: 'functions/api/proxy.ts' },
};

function ensureFile(filePath, content) {
    if (!fs.existsSync(filePath)) {
        fs.mkdirSync(path.dirname(filePath), { recursive: true });
        fs.writeFileSync(filePath, content.trimStart());
        console.log(`Created file: ${filePath}`);
    }
}

function ensureDir(dirPath) {
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
        console.log(`Created directory: ${dirPath}`);
    }
}

function copyProxyFile(proxyProvider) {
    const descriptor = PROXY_PROVIDERS[proxyProvider];
    if (!descriptor) return;

    const src  = path.join(PROXY_SRC, descriptor.src);
    const dest = path.join(root, descriptor.dest);

    if (!fs.existsSync(src)) {
        console.warn(`Proxy template not found: ${src}`);
        return;
    }

    ensureDir(path.dirname(dest));
    if (!fs.existsSync(dest)) {
        fs.copyFileSync(src, dest);
        console.log(`Created file: ${dest}`);
    }
}

function createViteConfig(proxyProvider) {
    const usesVitePlugin = proxyProvider === 'vite';
    const importBlock = usesVitePlugin
        ? "import { createProxyPlugin } from './dev/proxy';\n"
        : '';
    const pluginBlock = usesVitePlugin
        ? "      env.VITE_PROXY_ENABLED === 'true' ? createProxyPlugin() : null,\n"
        : '';

    return `
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
${importBlock}
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [
      react(),
${pluginBlock}    ].filter(Boolean),
    resolve: {
      dedupe: ['react', 'react-dom', 'react-router-dom'],
    },
    build: {
      cssMinify: false,
      chunkSizeWarningLimit: 10000,
    },
    define: {
      'process.env.NODE_ENV': JSON.stringify(mode === 'production' ? 'production' : 'development'),
    },
  };
});
`;
}

function setupDevTools(options = {}) {
    const proxyProvider = options.proxyProvider ?? 'none';

    console.log('Setting up Vite + React + TypeScript');

    ensureFile(path.join(root, 'tsconfig.json'), `
{
  "compilerOptions": {
    "target": "ES2021",
    "useDefineForClassFields": true,
    "lib": ["DOM", "DOM.Iterable", "ES2021"],
    "allowJs": false,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx"
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
    `);

    ensureFile(path.join(root, 'tsconfig.node.json'), `
{
  "compilerOptions": {
    "composite": true,
    "skipLibCheck": true,
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "allowSyntheticDefaultImports": true,
    "strict": true
  },
  "include": ["vite.config.ts", "dev/**/*.ts", "server/**/*.ts"]
}
    `);

    if (proxyProvider !== 'none') {
        copyProxyFile(proxyProvider);
    }

    ensureFile(path.join(root, 'vite.config.ts'), createViteConfig(proxyProvider));

    ensureFile(path.join(root, 'postcss.config.js'), `
export default {
  plugins: {
    '@tailwindcss/postcss': {},
    autoprefixer: {},
  },
};
    `);

    if (proxyProvider !== 'none' && PROXY_PROVIDERS[proxyProvider]) {
        console.log(`\nProxy file created: ${PROXY_PROVIDERS[proxyProvider].dest}`);
        if (proxyProvider === 'express') {
            console.log('  → Add registerProxy(app) to your server entry file.');
        }
        if (proxyProvider === 'vite') {
            console.log('  → createProxyPlugin() is already wired into vite.config.ts.');
        }
    }
}

module.exports = { setupDevTools, PROXY_PROVIDERS };
