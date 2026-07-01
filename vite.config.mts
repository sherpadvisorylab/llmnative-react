import { copyFileSync, existsSync, rmSync } from 'node:fs';
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
                    rmSync(indexPath, { force: true });
                    copyFileSync(stylePath, indexPath);
                }
            },
        },
    ],
    build: {
        lib: {
            entry: {
                index: resolve(__dirname, 'src/index.ts'),
                vite: resolve(__dirname, 'src/providers/proxy/vite.ts'),
            },
            formats: ['es', 'cjs'],
            fileName: (format, entryName) =>
                format === 'es' ? `${entryName}.mjs` : `${entryName}.js`,
        },
        rollupOptions: {
            external,
        },
        sourcemap: false,
        emptyOutDir: true,
    },
});
