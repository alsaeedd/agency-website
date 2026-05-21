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
    // ES2020 drops legacy polyfills — every device that loads this site
    // supports it (Safari 14+, Chrome 90+, Firefox 88+). Smaller output,
    // no transpilation overhead for class fields / nullish coalescing.
    target: 'es2020',
    // terser at max compression beats the default esbuild minifier by
    // ~5-10% on a React+GSAP bundle. 3 passes catches dead code that
    // a single pass leaves behind.
    minify: 'terser',
    terserOptions: {
      compress: {
        passes: 3,
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info', 'console.debug', 'console.warn'],
        unsafe_arrows: true,
        unsafe_methods: true,
      },
      mangle: { toplevel: true },
      format: { comments: false },
    },
    // lightningcss minifies CSS tighter than esbuild's default and
    // de-duplicates rules across files.
    cssMinify: 'lightningcss',
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
