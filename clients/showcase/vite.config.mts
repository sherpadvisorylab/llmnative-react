import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    return {
        plugins: [react()],
        resolve: {
            dedupe: ['react', 'react-dom', 'react-router-dom'],
        },
        server: {
            host: '127.0.0.1',
            port: 3000,
            strictPort: true,
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
