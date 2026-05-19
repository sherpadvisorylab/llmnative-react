import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'node:path';

export default defineConfig(({ mode }) => {
    return {
        plugins: [react()],
        resolve: {
            alias: [
                { find: /^react-firestrap$/, replacement: resolve(__dirname, '../../src/index.ts') },
            ],
            dedupe: ['react', 'react-dom', 'react-router-dom'],
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
