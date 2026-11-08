# RAL HR polish round: HANDOFF (branch feature/home-ral-hr, merged with feature/ral-hr-integrated)

## Done
- Merged feature/ral-hr-integrated (redesigned product page) into this branch.
- Payday hero window CSS moved to `src/components/ralhr/Payday.css` (shared). Payday takes `compact`, `waitForView`, `lite` props and exposes `data-step`.
- Hero signature moment: machined double-bezel frame, a one-time light pass across the window and a glow landing on the net total when payday finishes (CSS, compositor only, off under reduced motion).
- Closing CTA rebuilt as "Book a demo": request summary (team, plan, monthly estimate from the pricing slider, Change link), WhatsApp composer preview with topic chips, one premium pill button (sheen, lift, icon kick, press, "Opening WhatsApp" sent state) to wa.me/97366386602 with the pre-filled message; email (mailto with subject and body) and the inquiry form as secondary. Plan state lifted from Pricing to the page. Typing effect writes to the DOM (no React renders).
- Hero CTA and index label now "Book a demo" (one label per intent).
- Home `RalHrHome.tsx`: the old card is replaced by the real Payday window (lazy chunk, fetched only when the section nears; starts when 30% visible; final state on weak devices). Layout: headline, intro + price/CTAs, full-width window, 4 facts row.

## Verified
- `npm run build` green, prerender ok. Playwright 1440/768/390: zero console errors, no horizontal overflow, headline word gaps render (9 px at 390).
- Payday chunk is NOT loaded at home load.
- TBT (Playwright, 4x CPU, 390 px, long tasks after FCP): /ral-hr/ 145 then 24 ms (cold, warm); home 157 then 82 ms.
- Screenshots in the session scratchpad: hero-1440, hero-390, hero-768, close-1440, close-768, close-390, book-hover, home-1440, home-768, home-390.

## Left
1. Re-screenshot home after the last fix (row names and Run button were dark on dark on home: global button colour; fixed in Payday.css, built, not re-shot).
2. web-design-guidelines skill review not run this round (budget). Run it on Closing + RalHrHome.
3. Home TBT vs main not measured side by side: build main in another worktree, same script.
4. Old home card CSS (`.hrh-run`, `.hrh-phone`, `.hrh-notif`, `.hrh-wps`, `.hrh-step*`, `.hrh-stamp*`) in RalHrHome.css is now dead: delete.
5. Unused `.hp-steps` rules in RalHrPage.css (closing steps list removed).
6. Other sections (Month, Rules, App, Pricing, FAQ) were not restyled this round.
