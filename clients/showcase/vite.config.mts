import react from '@vitejs/plugin-react';
import { resolve } from 'node:path';
import { defineConfig, loadEnv } from 'vite';
import { visualizer } from 'rollup-plugin-visualizer';
import { createProxyPlugin } from './dev/proxy';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), '');
    const useProxy = env.VITE_PROXY_ENABLED === 'true' && env.VITE_PROXY_PROVIDER === 'viteDevProxy';

    return {
        plugins: [
            react(),
            useProxy ? createProxyPlugin() : null,
            visualizer({ filename: 'dist/stats.html', open: false, gzipSize: true, brotliSize: true }),
        ].filter(Boolean),
        resolve: {
            alias: {
                '@llmnative/react': resolve(__dirname, '../../src/index.ts'),
            },
            dedupe: ['react', 'react-dom', 'react-router-dom'],
        },
        optimizeDeps: {
            exclude: ['@llmnative/react'],
            include: [
                '@tiptap/react',
                '@tiptap/react > @tiptap/core',
                '@tiptap/starter-kit',
                '@tiptap/extension-underline',
                '@tiptap/extension-link',
                '@tiptap/extension-image',
                '@tiptap/extension-table',
                '@tiptap/extension-placeholder',
                '@tiptap/extension-character-count',
                '@tiptap/extension-bubble-menu',
                '@tiptap/react/menus',
            ],
        },
        server: {
            host: '127.0.0.1',
            port: 3000,
            strictPort: true,
            fs: {
                allow: [resolve(__dirname, '../..')],
            },
        },
        preview: {
            host: '127.0.0.1',
            port: 3000,
            strictPort: true,
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
