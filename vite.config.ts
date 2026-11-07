import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import { compression } from 'vite-plugin-compression2'
import fs from 'node:fs'
import path from 'node:path'

// ── Perf: font preload + Cloudflare Early Hints ─────────────────────────────
// Two related wins for first paint, wired at build time because asset names are
// content-hashed:
//   1. Inject <link rel=preload> for the fonts the hero actually renders with,
//      so the browser fetches them immediately instead of after the CSS parses.
//      The intro preloader waits on document.fonts.ready, so getting these on
//      the wire sooner lifts the curtain sooner.
//   2. Emit matching `Link:` headers into the `_headers` file so Cloudflare
//      Pages replays them as an HTTP 103 Early Hints response (Cloudflare's
//      automatic HTML->hints parsing skips crossorigin font preloads, so the
//      fonts have to be hinted via headers, not the tags alone).
function perfPreload(): Plugin {
  const CRITICAL_FONT = [
    /inter-latin-400-normal-[^/]*\.woff2$/,
    /inter-latin-600-normal-[^/]*\.woff2$/,
    /newsreader-latin-500-italic-[^/]*\.woff2$/,
  ]
  let outDir = 'dist'
  let publicDir = 'public'
  let linkHeaders: string[] = []

  return {
    name: 'ral-perf-preload',
    apply: 'build',
    configResolved(cfg) {
      outDir = cfg.build.outDir
      publicDir = cfg.publicDir
    },
    transformIndexHtml: {
      order: 'post',
      handler(_html, ctx) {
        const bundle = ctx.bundle
        if (!bundle) return
        const files = Object.keys(bundle)
        const fonts = files.filter((f) => CRITICAL_FONT.some((rx) => rx.test(f)))
        // Multi-page build (homepage + /ral-hr/ pages): only the homepage's
        // entry feeds the "/" Early Hints block, so pick its chunk and CSS.
        const isHome = ctx.path === '/index.html'
        const entryJs = files.find((f) => {
          const c = bundle[f]
          return c.type === 'chunk' && c.isEntry && !!c.facadeModuleId && /src[\\/]main\.tsx$/.test(c.facadeModuleId)
        })
        const entryChunk = entryJs ? bundle[entryJs] : undefined
        const importedCss = entryChunk && entryChunk.type === 'chunk' ? [...(entryChunk.viteMetadata?.importedCss ?? [])] : []
        const entryCss = importedCss[0] ?? files.find((f) => f.endsWith('.css'))

        // Stash the Link: header lines for closeBundle to write into _headers.
        if (isHome) {
          linkHeaders = []
          if (entryCss) linkHeaders.push(`</${entryCss}>; rel=preload; as=style`)
          if (entryJs) linkHeaders.push(`</${entryJs}>; rel=modulepreload`)
          for (const f of fonts) {
            linkHeaders.push(`</${f}>; rel=preload; as=font; crossorigin`)
          }
        }

        // Inject the browser-side font preloads into <head>.
        return fonts.map((f) => ({
          tag: 'link',
          attrs: {
            rel: 'preload',
            href: `/${f}`,
            as: 'font',
            type: 'font/woff2',
            crossorigin: true,
          },
          injectTo: 'head' as const,
        }))
      },
    },
    // closeBundle runs after the public dir is copied, so appending here wins
    // deterministically over the copied _headers.
    closeBundle() {
      if (!linkHeaders.length) return
      const target = path.resolve(outDir, '_headers')
      let base = ''
      try {
        base = fs.readFileSync(target, 'utf8')
      } catch {
        try {
          base = fs.readFileSync(path.resolve(publicDir, '_headers'), 'utf8')
        } catch {
          base = ''
        }
      }
      if (base.includes('# Early Hints')) return
      const block =
        '\n# Early Hints (103): Cloudflare replays these before the HTML finishes,\n' +
        '# so critical CSS, JS and hero fonts start downloading sooner.\n' +
        '/\n' +
        linkHeaders.map((h) => `  Link: ${h}`).join('\n') +
        '\n'
      fs.writeFileSync(target, base + block)
    },
  }
}

// https://vite.dev/config/
// isSsrBuild: the second `vite build --ssr` pass (see package.json) that only
// produces dist-ssr/entry-server.js for scripts/prerender.mjs. It must not copy
// public/, compress, rewrite _headers, or split GSAP (it stays external there).
export default defineConfig(({ isSsrBuild }) => ({
  plugins: isSsrBuild ? [react()] : [
    react(),
    perfPreload(),
    // Pre-compress build output. Hosts that serve static .br/.gz (Cloudflare
    // Pages, Vercel) ship these directly at max ratio instead of compressing
    // on the fly at a lower level.
    compression({ algorithm: 'brotliCompress', threshold: 1024 }),
    compression({ algorithm: 'gzip', threshold: 1024 }),
  ],
  build: {
    copyPublicDir: !isSsrBuild,
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
      // Multi-page: the homepage SPA plus the RAL HR product page and its
      // inquiry flow, each a real crawlable URL (see docs/ral-hr/BUILD_PLAN.md).
      input: isSsrBuild ? undefined : {
        main: path.resolve(__dirname, 'index.html'),
        ralhr: path.resolve(__dirname, 'ral-hr/index.html'),
        ralhrInquire: path.resolve(__dirname, 'ral-hr/inquire/index.html'),
      },
      output: {
        // Keep the heavy, rarely-changing GSAP lib in its own long-cached
        // chunk. (three was retired with the WebGL hero, so no chunk for it.)
        manualChunks: isSsrBuild ? undefined : {
          gsap: ['gsap', 'gsap/ScrollTrigger'],
        },
      },
    },
  },
}))
