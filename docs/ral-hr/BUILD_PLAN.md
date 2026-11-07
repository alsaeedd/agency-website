# RAL HR product page: build plan

Design read: B2B SaaS product page for GCC founders and HR/finance leads, warm founder-led voice on the site's dark violet atmosphere, with a live simulated app as the proof. Dials: variance 7, motion 6, density 4.

## Routing (how non-home pages work here)
| Item | Decision |
|---|---|
| Static content pages | `content/pages.mjs` + `scripts/prerender.mjs` template (plain HTML, no JS). Not enough for an interactive page |
| RAL HR pages | Vite multi-page inputs: `ral-hr/index.html` and `ral-hr/inquire/index.html` (own title, meta, OG, canonical, JSON-LD). Build emits `dist/ral-hr/index.html` and `dist/ral-hr/inquire/index.html`; Cloudflare Pages serves them at `/ral-hr/` and `/ral-hr/inquire/` |
| Crawlable content | `entry-server.tsx` exports `renderRalHr()` / `renderInquire()`; `prerender.mjs` injects the HTML into both pages, adds them to sitemap.xml. Client renders over it with `createRoot` (same pattern as the homepage) |
| Shared entry | `src/ralhr/main.tsx` picks the page from `location.pathname` |
| Early Hints | `perfPreload` in vite.config only collects Link headers for the root index.html (multi-page would otherwise overwrite them) |

## Sections (/ral-hr/)
| # | Section | Centrepiece |
|---|---|---|
| 1 | Top bar | RAL home link, Demo / Pricing / FAQ anchors, "Book a demo" |
| 2 | Hero | Masked line-rise headline with one Newsreader italic word, 20-word sub, 2 CTAs; the demo frame peeks above the fold |
| 3 | Demo (centrepiece) | Device switcher Web / Tablet / Phone (GSAP Flip), 6 story tabs, ghost cursor tour, count-ups, SVG charts |
| 4 | Built on Bahrain rules | 5-cell bento of tiny working UIs: WPS columns, SIO rates + employer ladder, expiry 90/30/7, AR/EN flip, rule-cited payslip line |
| 5 | Video tour | 81s reel in a CSS phone frame, lazy src, muted autoplay in view, custom play/unmute |
| 6 | Pricing | BD 1 / 2 / 3 per employee per month (Starter, Professional, Premium), sales-guide inclusions, setup fee note |
| 7 | Founder note | Short signed Newsreader letter |
| 8 | FAQ | Sales-guide objection answers (WPS, SIO, Arabic, data separation, Excel import, check-in) |
| 9 | Closing CTA | "Book a demo" to /ral-hr/inquire/ |

## Components (src/components/ralhr/)
`RalHrPage.tsx/.css`, `Demo.tsx/.css` (shell, frames, switcher, tabs, ghost), `screens.tsx` (6 app screens), `charts.tsx` (Spark, Donut-free bars, CountUp), `data.ts` (Bahrain Horizon Facilities sample data), `VideoTour.tsx`, `Inquire.tsx/.css`.

## In-device app palette: teal, light
The simulated app uses the real RAL HR default theme (brand teal `#0f766e`, zinc neutrals, canvas `#f7f7f8`) in light mode, while the page stays violet. Reasons: (1) faithful, so a prospect who later opens hr.raltech.dev sees the same product; (2) a light screen inside a dark violet page reads like a lit device and makes numbers readable in 2 seconds; (3) it keeps violet meaning "the website" and teal meaning "the product".

## Signature moments
1. Headline rises out of masked lines while the dashboard KPI tiles count up and sparklines draw on.
2. "Approve run": confirm step-up dialog, stepper advances, WPS check reports "Every row passes LMRA validation", toast lands.
3. Device morph: tap Phone and the frame Flip-morphs, sidebar becomes a bottom tab bar, still working.
4. Ask RAL books leave from Arabizi, then "زيد يوم" extends it to 2 days on the confirm card.
5. Lit bento: pointer lights each card's edge (fine pointer only).

## Performance
Transform/opacity only (frame morph via Flip transforms while content is hidden). Demo is `React.lazy` + mounted near view. Ghost tour, heartbeat and video pause off-screen and on hidden tab. `prefers-reduced-motion` and `data-tier="low"`: no ghost glide, counters show final values, no autoplay video. No new deps (gsap Flip only).

## Checklist
- [x] BUILD_PLAN.md
- [x] Video encoded (mp4 faststart + webp poster) to public/assets/ral-hr/
- [x] Vite multi-page + prerender + sitemap for /ral-hr/ and /ral-hr/inquire/
- [x] Page sections 1 to 9
- [x] Demo: switcher, 6 tabs, ghost tour, count-ups, charts
- [x] Inquiry flow with WhatsApp preview + email fallback
- [x] Entry link from main site (navbar link, no restyle)
- [ ] Visual QA at 1440 and 390 (not started, next agent)
- [ ] Polish pass: copy self-audit, spotlight bento, toast stack refinement
