import { existsSync, renameSync } from 'node:fs';
import { builtinModules } from 'node:module';
import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import pkg from './package.json';

const externalPackages = new Set([
    ...Object.keys(pkg.dependencies ?? {}),
    ...Object.keys(pkg.peerDependencies ?? {}),
]);

const external = (id: string) => {
    if (id.startsWith('node:')) return true;
    if (builtinModules.includes(id)) return true;
    if (id.startsWith('prismjs/')) return true;
    if (id.startsWith('firebase/')) return true;

    return [...externalPackages].some((packageName) => (
        id === packageName || id.startsWith(`${packageName}/`)
    ));
};

export default defineConfig({
    plugins: [
        {
            name: 'dynai-css-filename',
            closeBundle() {
                const stylePath = resolve(__dirname, 'dist/style.css');
                const indexPath = resolve(__dirname, 'dist/index.css');
                if (existsSync(stylePath)) {
                    renameSync(stylePath, indexPath);
                }
            },
        },
    ],
    build: {
        lib: {
            entry: resolve(__dirname, 'src/index.ts'),
            formats: ['es', 'cjs'],
            fileName: (format) => format === 'es' ? 'index.mjs' : 'index.js',
        },
        rollupOptions: {
            external,
        },
        sourcemap: false,
        emptyOutDir: true,
    },
});
