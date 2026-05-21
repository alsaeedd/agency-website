import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { compression } from 'vite-plugin-compression2'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // Pre-compress build output. Hosts that serve static .br/.gz (Cloudflare
    // Pages, Vercel) ship these directly at max ratio instead of compressing
    // on the fly at a lower level.
    compression({ algorithm: 'brotliCompress', threshold: 1024 }),
    compression({ algorithm: 'gzip', threshold: 1024 }),
  ],
  build: {
    rollupOptions: {
      output: {
        // Keep the heavy, rarely-changing libs in their own long-cached chunks.
        // three is only pulled in by the lazy WebGL scenes, so it stays
        // out of the initial bundle.
        manualChunks: {
          three: ['three'],
          gsap: ['gsap', 'gsap/ScrollTrigger'],
        },
      },
    },
  },
})
