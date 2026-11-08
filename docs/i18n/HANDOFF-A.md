# Handoff: i18n stage A

## Done
- Architecture per `docs/i18n/PLAN.md`: `src/i18n/index.ts` (useLang, useT, localePath, altPath, AR_PATHS), `src/i18n/rtl.css`, and self-hosted Plex Arabic in `public/fonts`.
- AR home `/ar/`, all sections: Hero, Services, About, Clients, Portfolio (+ detail), RAL HR teaser, CTA, interlude, Footer, Navbar, and the contact modal with the Arabic WhatsApp message.
- The Payday demo inside the RAL HR teaser stays English until stage C.
- Prerender: AR shell + meta + hreflang, `/ar/404.html`, sitemap, and the AR_PATHS/arPages drift check. The static template supports `lang='ar'`.
- Verified on vite preview at 390 and 1440:
  - lang and dir are correct, with no leftover English;
  - no horizontal scroll and 0 console errors;
  - the toggle round-trips;
  - `#services` lands at 102px;
  - the AR modal and WhatsApp text work.

## Next
1. Translate the static pages services/about/work/letterlock/contact into `content/pages-ar.mjs` (`path: '/ar/<p>/'`). Add `'/<p>/'` to `AR_PATHS`.
2. Privacy and terms: same as step 1, plus the note "النسخة الإنجليزية هي المرجع عند أي اختلاف".
3. Stage B Insights: build `/ar/insights/<slug>/` from `hrArticlesAr` (see PLAN.md).
4. Stage C RAL HR: `/ar/ral-hr/` HTML + `useLang()` + the `AR` dictionary (see PLAN.md).

## Gotchas
- Arabic text must never be split per letter (see `buildPhrase(..., whole)` in Hero).
- Never add letter-spacing to Arabic text.
- Phone numbers need `dir="ltr"`.
