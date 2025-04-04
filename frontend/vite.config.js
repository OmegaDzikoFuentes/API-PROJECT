import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import eslint from 'vite-plugin-eslint';
import tailwindcss from '@tailwindcss/vite'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    tailwindcss(),
    eslint({
      lintOnStart: true,
      failOnError: mode === "production"
    })
  ],
  css: {
    postcss: './postcss.config.js',
  },
  // To automatically open the app in the browser whenever the server starts,
  // uncomment the following lines:
   server: {
    open: true,
    proxy: {
      '/api': 'http://localhost:8000'
    },
   }
}));
