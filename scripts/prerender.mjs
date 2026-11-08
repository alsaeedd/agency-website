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

// i18n (docs/i18n/PLAN.md): Arabic mirrors live at /ar<path>. AR_PATHS in
// src/i18n/index.ts is the list the SPA links to; content/pages-ar.mjs holds
// the Arabic static pages. The build fails if the two drift apart.
const { arPages } = await import('../content/pages-ar.mjs')
const AR_PATHS = JSON.parse(
  fs.readFileSync(path.join(root, 'src', 'i18n', 'index.ts'), 'utf8').match(/export const AR_PATHS = (\[[^\]]*\])/)[1].replace(/'/g, '"'),
)
const AR_SET = new Set(AR_PATHS)
const SPA_AR = new Set(['/', '/ral-hr/', '/ral-hr/inquire/'])
for (const p of AR_PATHS) if (!SPA_AR.has(p) && !arPages.some((a) => a.path === '/ar' + p)) throw new Error(`prerender: AR_PATHS has ${p} but content/pages-ar.mjs has no /ar${p}`)
for (const a of arPages) if (!AR_SET.has(a.path.replace(/^\/ar/, ''))) throw new Error(`prerender: ${a.path} missing from AR_PATHS in src/i18n/index.ts`)
const alternates = (enPath) =>
  `<link rel="alternate" hreflang="en" href="${SITE}${enPath}" />\n<link rel="alternate" hreflang="ar" href="${SITE}/ar${enPath}" />\n<link rel="alternate" hreflang="x-default" href="${SITE}${enPath}" />`
const attr = (s) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;')
const must = (html, needle, where) => {
  if (!html.includes(needle)) throw new Error(`prerender: ${where} is missing ${needle}`)
  return html
}

// 1. Homepage ------------------------------------------------------------------
const { render, renderRalHr, renderInquire } = await import(pathToFileURL(path.join(root, 'dist-ssr', 'entry-server.js')).href)
const indexPath = path.join(dist, 'index.html')
let index = fs.readFileSync(indexPath, 'utf8')
const shell = index
const appHtml = render('en')
if (!index.includes('<div id="root"></div>')) throw new Error('prerender: empty #root not found in dist/index.html')
index = index.replace('<div id="root"></div>', () => `<div id="root">${appHtml}</div>`).replace('</head>', alternates('/') + '\n</head>')
fs.writeFileSync(indexPath, index)

// 1a. Arabic homepage (/ar/): same bundle, Arabic SSR, RTL shell and meta.
const AR_HOME = {
  title: 'RAL Technologies | برمجيات وذكاء اصطناعي من البحرين',
  description: 'تبني RAL Technologies برمجيات مخصصة وأتمتة بالذكاء الاصطناعي تُنمّي إيرادات المؤسسين والشركات الصغيرة والمتوسطة والمؤسسات في الخليج. من البحرين، وبقيادة مؤسسيها.',
}
const arAppHtml = render('ar')
let arIndex = must(shell, '<html lang="en">', 'dist/index.html')
  .replace('<html lang="en">', '<html lang="ar" dir="rtl">')
  .replace(/<title>[^<]*<\/title>/, `<title>${AR_HOME.title}</title>`)
  .replace(/(<meta\s+name="description"\s+content=")[^"]*"/, (_, a) => a + attr(AR_HOME.description) + '"')
  .replace(/(<meta\s+property="og:description"\s+content=")[^"]*"/, (_, a) => a + attr(AR_HOME.description) + '"')
  .replace(/(<meta\s+name="twitter:description"\s+content=")[^"]*"/, (_, a) => a + attr(AR_HOME.description) + '"')
  .replace(/(<meta\s+property="og:title"\s+content=")[^"]*"/, (_, a) => a + attr(AR_HOME.title) + '"')
  .replace('<link rel="canonical" href="https://raltech.dev/" />', '<link rel="canonical" href="https://raltech.dev/ar/" />')
  .replace('<meta property="og:url" content="https://raltech.dev/" />', '<meta property="og:url" content="https://raltech.dev/ar/" />')
  .replace('content="en_US"', 'content="ar_AR"')
  .replace('</head>', alternates('/') + '\n<link rel="preload" href="/fonts/plex-arabic-600.woff2" as="font" type="font/woff2" crossorigin />\n</head>')
  .replace('<div id="root"></div>', () => `<div id="root">${arAppHtml}</div>`)
must(arIndex, 'href="https://raltech.dev/ar/"', 'dist/ar/index.html')
fs.mkdirSync(path.join(dist, 'ar'), { recursive: true })
fs.writeFileSync(path.join(dist, 'ar', 'index.html'), arIndex)

// 1c. Arabic 404 (Cloudflare Pages serves the nearest 404.html up the tree).
const nf = fs.readFileSync(path.join(dist, '404.html'), 'utf8')
fs.writeFileSync(
  path.join(dist, 'ar', '404.html'),
  must(nf, 'That page does not exist.', 'dist/404.html')
    .replace(/<html[^>]*>/, '<html lang="ar" dir="rtl">')
    .replace(/<title>[^<]*<\/title>/, '<title>الصفحة غير موجودة · RAL Technologies</title>')
    .replace('That page does not exist.', 'هذه الصفحة غير موجودة.')
    .replace('<a href="/">Back to raltech.dev</a>', '<a href="/ar/">العودة إلى الصفحة الرئيسية</a>'),
)

// 1b. RAL HR product pages (own Vite entries, rendered the same way) ---------
// Each also gets an Arabic twin at /ar/ral-hr/... (lang=ar dir=rtl, META_AR).
const metaSrc = fs.readFileSync(path.join(root, 'src', 'components', 'ralhr', 'i18n-ar.ts'), 'utf8')
const META_AR = new Function('return ' + metaSrc.slice(metaSrc.indexOf('export const META_AR = ') + 23).trim().replace(/;?\s*$/, ''))()
for (const [rel, fn, enPath, meta] of [['ral-hr/index.html', renderRalHr, '/ral-hr/', META_AR.ralhr], ['ral-hr/inquire/index.html', renderInquire, '/ral-hr/inquire/', META_AR.inquire]]) {
  const p = path.join(dist, ...rel.split('/'))
  const src = fs.readFileSync(p, 'utf8')
  if (!src.includes('<div id="root"></div>')) throw new Error('prerender: empty #root not found in dist/' + rel)
  fs.writeFileSync(p, src.replace('</head>', alternates(enPath) + '\n</head>').replace('<div id="root"></div>', () => '<div id="root">' + fn('en') + '</div>'))
  const ar = must(src, '<html lang="en">', 'dist/' + rel)
    .replace('<html lang="en">', '<html lang="ar" dir="rtl">')
    .replace(/<title>[^<]*<\/title>/, `<title>${meta.title}</title>`)
    .replace(/(<meta\s+name="description"\s+content=")[^"]*"/, (_, a) => a + attr(meta.description) + '"')
    .replace(/(<meta\s+property="og:description"\s+content=")[^"]*"/, (_, a) => a + attr(meta.description) + '"')
    .replace(/(<meta\s+name="twitter:description"\s+content=")[^"]*"/, (_, a) => a + attr(meta.description) + '"')
    .replace(/(<meta\s+property="og:title"\s+content=")[^"]*"/, (_, a) => a + attr(meta.title) + '"')
    .replace(/(<meta\s+name="twitter:title"\s+content=")[^"]*"/, (_, a) => a + attr(meta.title) + '"')
    .replace(`<link rel="canonical" href="${SITE}${enPath}" />`, `<link rel="canonical" href="${SITE}/ar${enPath}" />`)
    .replace(`<meta property="og:url" content="${SITE}${enPath}" />`, `<meta property="og:url" content="${SITE}/ar${enPath}" />`)
    .replace('content="en_US"', 'content="ar_AR"')
    .replace('</head>', alternates(enPath) + '\n<link rel="preload" href="/fonts/plex-arabic-600.woff2" as="font" type="font/woff2" crossorigin />\n</head>')
    .replace('<div id="root"></div>', () => '<div id="root">' + fn('ar') + '</div>')
  must(ar, `href="${SITE}/ar${enPath}"`, 'dist/ar/' + rel)
  fs.mkdirSync(path.join(dist, 'ar', ...rel.split('/').slice(0, -1)), { recursive: true })
  fs.writeFileSync(path.join(dist, 'ar', ...rel.split('/')), ar)
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

const NAV_AR = { Services: 'الخدمات', Work: 'أعمالنا', About: 'من نحن', Insights: 'مقالات', Contact: 'تواصل' }

const FOOT = {
  en: { blurb: 'A small, founder-led team in Bahrain building production-grade software for GCC founders, SMBs and enterprise teams.', pages: 'Pages', home: 'Home', ll: 'LetterLock case study', privacy: 'Privacy', terms: 'Terms', touch: 'Get in touch', wa: 'WhatsApp', play: 'Play LetterLock', rights: 'All rights reserved.' },
  ar: { blurb: 'فريق صغير بقيادة مؤسسيه في البحرين، يبني برمجيات جاهزة للإنتاج لمؤسسي الخليج والشركات الصغيرة والمتوسطة وفرق المؤسسات الكبرى.', pages: 'الصفحات', home: 'الرئيسية', ll: 'دراسة حالة LetterLock', privacy: 'الخصوصية', terms: 'الشروط', touch: 'تواصل معنا', wa: 'واتساب', play: 'العب LetterLock', rights: 'جميع الحقوق محفوظة.' },
}
function footer(ar, lp) {
  const L = FOOT[ar ? 'ar' : 'en']
  return `<footer class="site-foot">
  <div class="wrap foot-grid">
    <div>
      <p class="foot-brand">RAL Technologies</p>
      <p>${L.blurb}</p>
      <p>RAL SOFTWARE SERVICES, ${ar ? 'مملكة البحرين' : 'Kingdom of Bahrain'}</p>
    </div>
    <nav aria-label="${L.pages}">
      <p class="foot-label">${L.pages}</p>
      <a href="${lp('/')}">${L.home}</a>${NAV.map(([h, l]) => `<a href="${lp(h)}">${ar ? NAV_AR[l] : l}</a>`).join('')}<a href="${lp('/work/letterlock/')}">${L.ll}</a><a href="/ral-hr/">RAL HR</a><a href="${lp('/privacy/')}">${L.privacy}</a><a href="${lp('/terms/')}">${L.terms}</a>
    </nav>
    <div>
      <p class="foot-label">${L.touch}</p>
      <a href="mailto:info@raltech.dev">info@raltech.dev</a>
      <a href="https://wa.me/97338218181">${L.wa} <span dir="ltr">+973 3821 8181</span></a>
      <a href="https://letterlock.raltech.dev/">${L.play}</a>
    </div>
  </div>
  <p class="wrap copy">© 2026 RAL Technologies. ${L.rights}</p>
</footer>`
}

function template(p, lang = 'en') {
  const ar = lang === 'ar'
  const enPath = ar ? p.path.replace(/^\/ar/, '') : p.path
  const hasPair = AR_SET.has(enPath)
  const lp = (h) => (ar && AR_SET.has(h) ? '/ar' + h : h)
  const toggleHref = hasPair ? (ar ? enPath : '/ar' + enPath) : ar ? '/' : '/ar/'
  const toggle = `<a class="lang-toggle" href="${toggleHref}" hreflang="${ar ? 'en' : 'ar'}">${ar ? 'English' : 'عربي'}</a>`
  const url = SITE + p.path
  const title = `${p.title} | RAL Technologies`
  const nav = NAV.map(([href, label]) => `<a href="${lp(href)}"${enPath.startsWith(href) ? ' aria-current="page"' : ''}>${ar ? NAV_AR[label] : label}</a>`).join('') + toggle
  const org = { '@type': 'Organization', name: 'RAL Technologies', url: SITE + '/' }
  const ld = p.type === 'article'
    ? { '@context': 'https://schema.org', '@type': 'Article', headline: p.title, description: p.description, datePublished: p.published, dateModified: p.updated, mainEntityOfPage: url, author: org, publisher: { ...org, logo: { '@type': 'ImageObject', url: SITE + '/apple-touch-icon.png' } } }
    : { '@context': 'https://schema.org', '@type': 'WebPage', name: p.title, description: p.description, url, isPartOf: { '@type': 'WebSite', name: 'RAL Technologies', url: SITE + '/' } }
  const byline = p.type === 'article'
    ? `<p class="byline">By the RAL Technologies team · Published <time datetime="${p.published}">${p.published}</time> · ${p.readMinutes} min read</p>`
    : ''
  return `<!doctype html>
<html lang="${lang}"${ar ? ' dir="rtl"' : ''}>
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
<meta property="og:locale" content="${ar ? 'ar_AR' : 'en_US'}" />${hasPair ? '\n' + alternates(enPath) : ''}
<meta name="twitter:card" content="summary" />
<meta name="twitter:title" content="${esc(p.title)}" />
<meta name="twitter:description" content="${esc(p.description)}" />
<link rel="stylesheet" href="/pages.css" />
<script type="application/ld+json">${JSON.stringify(ld)}</script>
</head>
<body>
<header class="site-head">
  <div class="wrap head-row">
    <a class="brand" href="${lp('/')}" aria-label="${ar ? 'الصفحة الرئيسية لـ RAL Technologies' : 'RAL Technologies home'}">RAL<span>Technologies</span></a>
    <nav class="site-nav" aria-label="${ar ? 'القائمة الرئيسية' : 'Main'}">${nav}</nav>
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
${footer(ar, lp)}
</body>
</html>
`
}

for (const p of pages) {
  const dir = path.join(dist, ...p.path.split('/').filter(Boolean))
  fs.mkdirSync(dir, { recursive: true })
  fs.writeFileSync(path.join(dir, 'index.html'), template(p))
}
for (const p of arPages) {
  const dir = path.join(dist, ...p.path.split('/').filter(Boolean))
  fs.mkdirSync(dir, { recursive: true })
  fs.writeFileSync(path.join(dir, 'index.html'), template(p, 'ar'))
}

// 3. Sitemap -------------------------------------------------------------------
const newest = pages.reduce((m, p) => (p.updated > m ? p.updated : m), '')
const urls = [{ loc: SITE + '/', lastmod: newest, pri: '1.0' }]
urls.push({ loc: SITE + '/ral-hr/', lastmod: newest, pri: '0.9' }, { loc: SITE + '/ral-hr/inquire/', lastmod: newest, pri: '0.5' })
urls.push({ loc: SITE + '/ar/', lastmod: newest, pri: '1.0' })
urls.push({ loc: SITE + '/ar/ral-hr/', lastmod: newest, pri: '0.9' }, { loc: SITE + '/ar/ral-hr/inquire/', lastmod: newest, pri: '0.5' })
for (const p of arPages) urls.push({ loc: SITE + p.path, lastmod: p.updated, pri: '0.7' })
for (const p of pages) urls.push({ loc: SITE + p.path, lastmod: p.updated, pri: (p.path === '/privacy/' || p.path === '/terms/') ? '0.3' : p.type === 'article' ? '0.7' : '0.8' })
fs.writeFileSync(
  path.join(dist, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls
    .map((u) => `  <url>\n    <loc>${u.loc}</loc>\n    <lastmod>${u.lastmod}</lastmod>\n    <priority>${u.pri}</priority>\n  </url>`)
    .join('\n')}\n</urlset>\n`,
)
console.log(`prerender: EN homepage ${words(appHtml)} words + ${pages.length} pages; AR homepage ${words(arAppHtml)} words + ${arPages.length} pages + 404; ${urls.length} sitemap URLs`)
