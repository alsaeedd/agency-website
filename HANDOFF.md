# HANDOFF: fix/site-uiux-ar2 (Arabic UI/UX pass 2, excluding RAL HR)

## Done (pass 1, branch fix/site-uiux-ar)
- RTL fixes in src/i18n/rtl.css (burger side, hero cycler, footer links, arrow mirroring,
  contact close/divider, project quote rules). "soon" sweep clean. 18 AR pages audited.

## Done (pass 2, this branch)
- Burger menu at 390 AR verified (wheel down then up to reveal the navbar): X sits on the
  left, logo right, links centred in order, link tap scrolls to section and closes menu,
  lang toggle visible, 0 console errors.
- Contact modal AR at 390 + 1440: labels and inputs right-aligned (text-align start, rtl),
  Arabic placeholders, chips flow RTL, close button on the left, phone in <span dir=ltr>.
  Submit opens wa.me/97338218181 with a fully Arabic message. There are no budget chips
  in the current form (only interests, name, notes), so nothing BHD to check.
- Fix: rtl.css mobile close-button query was 768px but Contact.css uses 640px; aligned
  to 640px (641-768 now keeps the desktop 1.75rem left offset like EN keeps its right).
- Looked at section screenshots: AR home, /ar/services/, /ar/about/, /ar/work/letterlock/,
  /ar/contact/, one article, at 390 + 1440. RTL alignment, bullets, numbered lists,
  mixed strings (+12, 01., GMT+3, emails) read correctly. Heuristic sweep of 10 AR pages
  x 2 widths: no horizontal scroll, no left-aligned Arabic, no clipped text, 0 errors.
  Only Latin strings: client name "Knights Gate Advisers" and letterlock.raltech.dev.
- English regression (home 390 + 1440, footer): unchanged, Inter, negative tracking kept,
  dir unset, burger on the right.

## Notes (not bugs)
- Element screenshots of tall static pages look clipped on the right by ~15px: that is the
  scrollbar offset in Playwright element capture. Viewport shots confirm 16px gutters.
- The thin purple bar on the left of the AR mobile modal is the inner .contact-scroll
  scrollbar; Chrome puts it on the left in RTL. Same bar sits on the right in EN.
- Arabic eyebrow labels in the modal (11px) read small next to EN uppercase; left as is
  (would be a restyle).

## Left
- Nothing blocking in scope. RAL HR (src/components/ralhr/**) belongs to the other agent.
