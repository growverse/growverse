/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access -- Node URL helpers lack typings under bundler mode */
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const srcPath = new URL('./src', import.meta.url).pathname;
const indexPath = new URL('./index.html', import.meta.url).pathname;

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': srcPath,
    },
  },
  root: '.',
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
  build: {
    rollupOptions: {
        input: {
          main: indexPath,
        },
      },
    },
});
