import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Static demo build: relative asset paths so it works from any folder or
// sub-path on static hosting (GitHub Pages, S3, a /sites/ URL, etc.).
export default defineConfig({
  plugins: [react()],
  base: './',
  server: { port: 5174, host: true },
  preview: { port: 4174, host: true },
})
