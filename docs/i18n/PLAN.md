# Arabic (i18n) plan

## URLs and language
- English stays at its current paths. Arabic mirrors live under `/ar/` (`/ar/`, `/ar/services/`, `/ar/insights/<slug>/`, later `/ar/ral-hr/`).
- The language comes from the URL only: `langFromPath()` in `src/i18n/index.ts` (`/ar` prefix means Arabic).
- `useLang()` returns `'en' | 'ar'`. It reads `LangContext` (set in `main.tsx` / `entry-server.tsx`). Without a provider it falls back to `location`, so any entry (RAL HR pages included) can import it. In SSR without a provider it returns `'en'`.
- `useT({ en, ar })` picks a dictionary. Dictionaries live next to each component (`HERO_T`, `CTA_T`, ...). No library.

## Which pages have an Arabic twin
- `AR_PATHS` in `src/i18n/index.ts` lists the English paths that have an `/ar` twin (now just `/`).
- `content/pages-ar.mjs` exports `arPages` (same shape as `pages.mjs`, `path` starts with `/ar/`).
- `scripts/prerender.mjs` fails the build if `AR_PATHS` and `arPages` drift apart.
- `localePath(lang, href)` adds `/ar` only to paths in `AR_PATHS`, so links never point at a page that does not exist. `altPath()` drives the navbar toggle (same page, falling back to the other home page).

## Prerender
- AR home: `dist/ar/index.html` is the same Vite shell with `<html lang="ar" dir="rtl">`, an Arabic title, description, OG and Twitter tags, `og:locale ar_AR`, canonical `/ar/`, and the body is `render('ar')`.
- Every page that has a twin gets `hreflang` en / ar / x-default (x-default points to English).
- Static AR pages: `template(p, 'ar')` gives an RTL shell, the Arabic nav and footer, and the toggle.
- `dist/ar/404.html` is an Arabic 404. The sitemap lists `/ar/` and every `arPages` entry.

## Type and RTL
- The font is IBM Plex Sans Arabic, self-hosted in `public/fonts` (Arabic unicode-range only, so Latin stays Inter). It is only referenced under `html[lang="ar"]`, so English pages never download it. There is no CSP change (`font-src 'self'`).
- Digits are Western (0-9) everywhere. Phone numbers are wrapped in `dir="ltr"`.
- `src/i18n/rtl.css`:
  - letter-spacing 0 (tracking breaks Arabic joins);
  - no synthetic italics;
  - taller line-height;
  - directional arrows mirrored with `scale: -1 1`;
  - marquees kept LTR so their loop math holds.
- GSAP x-offsets that imply direction are flipped when `lang === 'ar'` (hero year, contact sidebar).
- The hero splits Arabic by word, never by letter, because per-letter spans break shaping.
- Brand terms stay Latin: RAL, RAL HR, WPS, LMRA, SIO, Letterlock.

## Stages
- **A (done):** architecture, AR home (all sections), navbar toggle, footer, contact modal plus the Arabic WhatsApp message, 404, hreflang, sitemap.
- **A2:** static pages services/about/work/letterlock/contact into `arPages`, plus their paths in `AR_PATHS`. Privacy and terms carry the note "the English version prevails".
- **B (Insights):** `content/articles-hr.ar.mjs` exports `hrArticlesAr` (same order and shape as `hrArticles`). In `pages-ar.mjs`, map it to `/ar/insights/<slug>/` entries using the same builder as the English articles, and add `/insights/<slug>/` to `AR_PATHS`.
- **C (RAL HR):** components use `useLang()` and `AR` from `src/components/ralhr/i18n-ar.ts` (`AR[en] ?? en`). They need `/ar/ral-hr/...` HTML. Either add Vite inputs or have prerender copy each ral-hr `index.html` into `dist/ar/ral-hr/...` with `lang="ar" dir="rtl"`, then add the paths to `AR_PATHS`. Until then, AR links to `/ral-hr/` open English.
