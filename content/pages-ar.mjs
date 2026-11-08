// Arabic static pages, same shape as content/pages.mjs, served at /ar<path>.
// Every entry's English path must also be listed in AR_PATHS
// (src/i18n/index.ts); scripts/prerender.mjs fails the build otherwise.
// Stage B: Insights articles from content/articles-hr.ar.mjs (hrArticlesAr,
// same order/shape as hrArticles) are added here as /ar/insights/<slug>/.
export const arPages = []
