import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// `base: './'` keeps every asset path relative, so the built site works
// from any folder or sub-path of any static host (Netlify, GitHub Pages, S3...).
export default defineConfig({
  base: './',
  plugins: [react()],
  build: {
    target: 'es2020',
    chunkSizeWarningLimit: 700,
  },
  server: { port: 5173, strictPort: false },
});
