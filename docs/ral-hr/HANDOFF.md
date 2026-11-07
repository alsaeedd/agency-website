# RAL HR page: handoff

## Done (v1 committed, build + prerender clean)
- /ral-hr/ and /ral-hr/inquire/ are Vite multi-page entries (vite.config.ts input map), SSR-prerendered by scripts/prerender.mjs (renderRalHr, renderInquire in src/entry-server.tsx). Sitemap and static footer updated.
- Own title, meta, canonical, OG, JSON-LD in ral-hr/index.html and ral-hr/inquire/index.html.
- Page: src/components/ralhr/RalHrPage.tsx + RalHrPage.css (hero, live demo, Bahrain-rules bento, video tour, pricing BD 1/2/3, founder note, FAQ, close, footer).
- Demo: Demo.tsx + Demo.css + screens.tsx + charts.tsx + data.ts. Lazy-loaded near view (own 48KB chunk). Web/tablet/phone switcher with Flip, 6 tabs, ghost cursor tour.
- Video: public/assets/ral-hr/ralhr-tour.mp4 (4MB, 540w, faststart) + ralhr-tour-poster.webp. src set at 50% visible, pauses offscreen, no autoplay when calm() or saveData.
- Inquiry: src/components/ralhr/Inquire.tsx (styles in RalHrPage.css, .iq-*). 4 steps, editable preview, wa.me link, copy, mailto fallback, sessionStorage.
- Main-site entry: Navbar.tsx gets "RAL HR" link; click handler now skips preventDefault for non-# hrefs.

## Next
1. Visual QA with Playwright at 1440 and 390 (not done yet): `npx vite preview`, check /ral-hr/ demo scaling per device, ghost tour, Ask RAL tab layout, bento on mobile, phone video frame, inquire steps.
2. Fix whatever QA finds (likely: Ask RAL height on phone, bento ladder sizing, story chips scroll on mobile).
3. Polish pass: copy self-audit vs PRODUCT_BRIEF claims, toast refinement.
4. Then merge to main per MEMORY (fetch first, --no-ff) when owner approves. Do not push from this branch without the go-ahead.

## Gotchas
- The coordinator's helper was told to build src/components/ralhr/inquire/ and ralhr-marketing.mp4. Both were already done here (Inquire.tsx, ralhr-tour.mp4). Pick one; current wiring uses mine.
- Use the Write tool, not multi-file Bash heredocs, for files with Arabic or apostrophes.
- The SSR "useLayoutEffect does nothing on the server" warnings come from existing homepage components, not ralhr (which uses useIsoLayoutEffect).
- Early Hints Link headers are only emitted for /index.html (perfPreload isHome guard); keep it that way.
- No em dashes anywhere (grep checked clean).
