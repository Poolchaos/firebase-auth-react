import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer';
import EnvironmentPlugin from 'vite-plugin-environment';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    EnvironmentPlugin('all'),
    ViteImageOptimizer({
      webp: {
        quality: 75,
      },
      png: {
        quality: 75,
      },
      jpeg: {
        quality: 75,
      },
    }),
  ],
  define: {
    'process.env': {},
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    chunkSizeWarningLimit: 550,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return 'vendor';
          }
          if (id.includes('node_modules/react-dom')) {
            return 'react-dom';
          }
          if (id.includes('node_modules/replay')) {
            return 'replay';
          }
        },
      },
    },
  },
});
