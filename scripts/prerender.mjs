// Post-build step (see package.json "build"). Three jobs, all so crawlers and
// no-JS visitors see real content instead of an empty <div id="root">:
//   1. Homepage: render <App /> with react-dom/server (dist-ssr, built by the
//      `vite build --ssr` pass) and inject it into dist/index.html. The client
//      then renders over it with createRoot, so there is no hydration step to
//      mismatch; the inline preloader covers the swap, so nothing moves.
//   2. Content pages: wrap each entry in content/pages.mjs in the shared
//      template and write dist/<path>index.html (plain HTML, no JS).
//   3. sitemap.xml with every page and its lastmod.
import fs from 'node:fs'
import path from 'node:path'
import { pathToFileURL, fileURLToPath } from 'node:url'
import { pages } from '../content/pages.mjs'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const dist = path.join(root, 'dist')
const SITE = 'https://raltech.dev'

// 1. Homepage ------------------------------------------------------------------
const { render, renderRalHr, renderInquire } = await import(pathToFileURL(path.join(root, 'dist-ssr', 'entry-server.js')).href)
const indexPath = path.join(dist, 'index.html')
let index = fs.readFileSync(indexPath, 'utf8')
const appHtml = render()
if (!index.includes('<div id="root"></div>')) throw new Error('prerender: empty #root not found in dist/index.html')
index = index.replace('<div id="root"></div>', () => `<div id="root">${appHtml}</div>`)
fs.writeFileSync(indexPath, index)

// 1b. RAL HR product pages (own Vite entries, rendered the same way) ---------
for (const [rel, fn] of [['ral-hr/index.html', renderRalHr], ['ral-hr/inquire/index.html', renderInquire]]) {
  const p = path.join(dist, ...rel.split('/'))
  let h = fs.readFileSync(p, 'utf8')
  if (!h.includes('<div id="root"></div>')) throw new Error('prerender: empty #root not found in dist/' + rel)
  h = h.replace('<div id="root"></div>', () => '<div id="root">' + fn() + '</div>')
  fs.writeFileSync(p, h)
}

// 2. Content pages -------------------------------------------------------------
const assets = fs.readdirSync(path.join(dist, 'assets'))
const font = (rx) => {
  const f = assets.find((a) => rx.test(a))
  if (!f) throw new Error(`prerender: font ${rx} not found in dist/assets`)
  return `/assets/${f}`
}
const fontCss = [
  ['Inter', 400, 'normal', /^inter-latin-400-normal-.*\.woff2$/],
  ['Inter', 600, 'normal', /^inter-latin-600-normal-.*\.woff2$/],
  ['Newsreader', 500, 'italic', /^newsreader-latin-500-italic-.*\.woff2$/],
]
  .map(([fam, w, st, rx]) => `@font-face{font-family:${fam};font-style:${st};font-weight:${w};font-display:swap;src:url(${font(rx)}) format("woff2")}`)
  .join('\n')
fs.writeFileSync(path.join(dist, 'pages.css'), fontCss + '\n' + fs.readFileSync(path.join(root, 'content', 'pages.css'), 'utf8'))

const NAV = [
  ['/services/', 'Services'],
  ['/work/', 'Work'],
  ['/about/', 'About'],
  ['/insights/', 'Insights'],
  ['/contact/', 'Contact'],
]
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
const words = (html) => html.replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length

function template(p) {
  const url = SITE + p.path
  const title = `${p.title} | RAL Technologies`
  const nav = NAV.map(([href, label]) => `<a href="${href}"${p.path.startsWith(href) ? ' aria-current="page"' : ''}>${label}</a>`).join('')
  const org = { '@type': 'Organization', name: 'RAL Technologies', url: SITE + '/' }
  const ld = p.type === 'article'
    ? { '@context': 'https://schema.org', '@type': 'Article', headline: p.title, description: p.description, datePublished: p.published, dateModified: p.updated, mainEntityOfPage: url, author: org, publisher: { ...org, logo: { '@type': 'ImageObject', url: SITE + '/apple-touch-icon.png' } } }
    : { '@context': 'https://schema.org', '@type': 'WebPage', name: p.title, description: p.description, url, isPartOf: { '@type': 'WebSite', name: 'RAL Technologies', url: SITE + '/' } }
  const byline = p.type === 'article'
    ? `<p class="byline">By the RAL Technologies team · Published <time datetime="${p.published}">${p.published}</time> · ${p.readMinutes} min read</p>`
    : ''
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
<meta name="theme-color" content="#0c0715" />
<meta name="google-adsense-account" content="ca-pub-7138183978612183" />
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7138183978612183" crossorigin="anonymous"></script>
<title>${esc(title)}</title>
<meta name="description" content="${esc(p.description)}" />
<meta name="robots" content="index, follow" />
<link rel="canonical" href="${url}" />
<link rel="icon" type="image/x-icon" href="/favicon.ico" />
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
<link rel="apple-touch-icon" href="/apple-touch-icon.png" />
<link rel="manifest" href="/site.webmanifest" />
<meta property="og:type" content="${p.type === 'article' ? 'article' : 'website'}" />
<meta property="og:site_name" content="RAL Technologies" />
<meta property="og:title" content="${esc(p.title)}" />
<meta property="og:description" content="${esc(p.description)}" />
<meta property="og:url" content="${url}" />
<meta property="og:image" content="${SITE}/apple-touch-icon.png" />
<meta property="og:locale" content="en_US" />
<meta name="twitter:card" content="summary" />
<meta name="twitter:title" content="${esc(p.title)}" />
<meta name="twitter:description" content="${esc(p.description)}" />
<link rel="stylesheet" href="/pages.css" />
<script type="application/ld+json">${JSON.stringify(ld)}</script>
</head>
<body>
<header class="site-head">
  <div class="wrap head-row">
    <a class="brand" href="/" aria-label="RAL Technologies home">RAL<span>Technologies</span></a>
    <nav class="site-nav" aria-label="Main">${nav}</nav>
  </div>
</header>
<main class="wrap">
  <article>
    <p class="eyebrow">${p.eyebrow}</p>
    <h1>${p.h1}</h1>
    ${p.lead ? `<p class="lead">${p.lead}</p>` : ''}
    ${byline}
    <div class="prose">
${p.body}
    </div>
  </article>
</main>
<footer class="site-foot">
  <div class="wrap foot-grid">
    <div>
      <p class="foot-brand">RAL Technologies</p>
      <p>A small, founder-led team in Bahrain building production-grade software for GCC founders, SMBs and enterprise teams.</p>
      <p>RAL SOFTWARE SERVICES, Kingdom of Bahrain</p>
    </div>
    <nav aria-label="Pages">
      <p class="foot-label">Pages</p>
      <a href="/">Home</a>${NAV.map(([h, l]) => `<a href="${h}">${l}</a>`).join('')}<a href="/work/letterlock/">LetterLock case study</a><a href="/ral-hr/">RAL HR</a><a href="/privacy/">Privacy</a><a href="/terms/">Terms</a>
    </nav>
    <div>
      <p class="foot-label">Get in touch</p>
      <a href="mailto:info@raltech.dev">info@raltech.dev</a>
      <a href="https://wa.me/97338218181">WhatsApp +973 3821 8181</a>
      <a href="https://letterlock.raltech.dev/">Play LetterLock</a>
    </div>
  </div>
  <p class="wrap copy">© 2026 RAL Technologies. All rights reserved.</p>
</footer>
</body>
</html>
`
}

for (const p of pages) {
  const dir = path.join(dist, ...p.path.split('/').filter(Boolean))
  fs.mkdirSync(dir, { recursive: true })
  fs.writeFileSync(path.join(dir, 'index.html'), template(p))
}

// 3. Sitemap -------------------------------------------------------------------
const newest = pages.reduce((m, p) => (p.updated > m ? p.updated : m), '')
const urls = [{ loc: SITE + '/', lastmod: newest, pri: '1.0' }]
urls.push({ loc: SITE + '/ral-hr/', lastmod: newest, pri: '0.9' }, { loc: SITE + '/ral-hr/inquire/', lastmod: newest, pri: '0.5' })
for (const p of pages) urls.push({ loc: SITE + p.path, lastmod: p.updated, pri: (p.path === '/privacy/' || p.path === '/terms/') ? '0.3' : p.type === 'article' ? '0.7' : '0.8' })
fs.writeFileSync(
  path.join(dist, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls
    .map((u) => `  <url>\n    <loc>${u.loc}</loc>\n    <lastmod>${u.lastmod}</lastmod>\n    <priority>${u.pri}</priority>\n  </url>`)
    .join('\n')}\n</urlset>\n`,
)
console.log(`prerender: homepage ${words(appHtml)} words, ${pages.length} pages, ${urls.length} sitemap URLs`)
