// Arabic static pages, same shape as content/pages.mjs, served at /ar<path>.
// Every entry's English path must also be listed in AR_PATHS
// (src/i18n/index.ts); scripts/prerender.mjs fails the build otherwise.
// Insights (stage B): the index and 3 articles from content/pages.ar.mjs plus
// the HR articles from content/articles-hr.ar.mjs. Both use the English paths,
// so they are prefixed with /ar here.
import { pagesAr } from './pages.ar.mjs'
import { hrArticlesAr } from './articles-hr.ar.mjs'

const toAr = (p) => ({ ...p, path: '/ar' + p.path })

export const arPages = [...pagesAr, ...hrArticlesAr].map(toAr)
