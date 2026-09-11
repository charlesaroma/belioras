import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'node:path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: { '@': path.resolve(import.meta.dirname, 'src') },
  },
  server: {
    // Mirrors the Netlify proxy, so the client calls a relative /api in every
    // environment and the refresh cookie stays first-party.
    proxy: { '/api': 'http://localhost:5002' },
  },
})
