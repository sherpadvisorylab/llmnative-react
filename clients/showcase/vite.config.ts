import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
            // Hard-pin peer deps to the showcase's copies — prevents a second instance
            // being picked up from react-firestrap's own node_modules via the symlink.
            'react':            path.resolve(__dirname, 'node_modules/react'),
            'react-dom':        path.resolve(__dirname, 'node_modules/react-dom'),
            'react-router-dom': path.resolve(__dirname, 'node_modules/react-router-dom'),
        },
        preserveSymlinks: true,
        dedupe: ['react', 'react-dom', 'react-router-dom'],
    },
    optimizeDeps: {
        // Force esbuild to pre-bundle react-firestrap (CJS → ESM)
        include: ['react-firestrap'],
    },
});
