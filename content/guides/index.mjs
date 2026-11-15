// Long-form reference guides (Bahrain labour, payroll, HR and software buying).
// Deliberately low-visibility: listed only on /insights/ (after the other
// articles) and in sitemap.xml. Never link them from nav, header, footer or
// the home page.
import * as p1 from './part1.mjs'
import * as p2 from './part2.mjs'
import * as p3 from './part3.mjs'
import * as p4 from './part4.mjs'

const parts = [p1, p2, p3, p4]
export const guidesEn = parts.flatMap((p) => p.en)
export const guidesAr = parts.flatMap((p) => p.ar)

const card = (a, href) => `  <li>
    <p class="tag">${a.tag} · ${a.published}</p>
    <h2><a href="${href}">${a.title}</a></h2>
    <p>${a.description}</p>
  </li>`

export const guideCardsEn = guidesEn.map((a) => card(a, a.path)).join('\n')
export const guideCardsAr = guidesAr.map((a) => card(a, '/ar' + a.path)).join('\n')
