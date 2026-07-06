const fs = require('fs');
const path = require('path');

const root = process.cwd();
// Templates and the vite/packageExport split live in scripts/cli/proxy-templates/scaffold.json —
// the same JSON the framework's src/providers/proxy/scaffold.ts imports, so there's one shared
// source instead of two hand-maintained maps that can drift (as they had before this fix).
const PROXY_TEMPLATES_DIR = path.resolve(__dirname, 'proxy-templates');
const PROXY_PROVIDERS = require(path.join(PROXY_TEMPLATES_DIR, 'scaffold.json'));

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

    const dest = path.join(root, descriptor.outputPath);
    ensureDir(path.dirname(dest));
    if (fs.existsSync(dest)) return;

    if (descriptor.packageExport) {
        // vite only: re-export the framework's own build instead of copying a snapshot that
        // could drift from the real implementation — see dist/vite.mjs / package.json exports.
        fs.writeFileSync(dest, `export { ${descriptor.exportName} } from '${descriptor.packageExport}';\n`);
        console.log(`Created file: ${dest}`);
        return;
    }

    const src = path.join(PROXY_TEMPLATES_DIR, descriptor.templateFile);
    if (!fs.existsSync(src)) {
        console.warn(`Proxy template not found: ${src}`);
        return;
    }
    fs.copyFileSync(src, dest);
    console.log(`Created file: ${dest}`);
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
        console.log(`\nProxy file created: ${PROXY_PROVIDERS[proxyProvider].outputPath}`);
        if (proxyProvider === 'express') {
            console.log('  → Add registerProxy(app) to your server entry file.');
        }
        if (proxyProvider === 'vite') {
            console.log('  → createProxyPlugin() is already wired into vite.config.ts.');
        }
    }
}

module.exports = { setupDevTools, PROXY_PROVIDERS };
