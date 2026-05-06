import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    return {
        plugins: [react()],
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
