import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'node:path'
import seo from './scripts/seo/vitePluginSeo.js'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), seo()],
  resolve: {
    alias: { '@': path.resolve(import.meta.dirname, 'src') },
  },
  server: {
    // Mirrors the Netlify proxy, so the client calls a relative /api in every
    // environment and the refresh cookie stays first-party.
    proxy: { '/api': 'http://localhost:5002' },
  },
})
