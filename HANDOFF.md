# HANDOFF: fix/site-uiux-ar (Arabic UI/UX pass, excluding RAL HR)

## Done
- "soon" sweep: no user-visible soon/Coming soon/قريبًا outside src/components/ralhr (RAL HR agent owns those). The قريب hits in content/*.mjs are تقريبًا ("about"), not "soon".
- Automated audit of all 18 AR pages at 390 and 1440 (script: .playwright-mcp/audit-ar.js, gitignored): no horizontal scroll, dir=rtl everywhere, no leftover English sentences except the client name "Knights Gate Advisers", 0 console errors. Static prerendered pages came back clean.
- src/i18n/rtl.css RTL fixes (all scoped to html[dir=rtl]/[lang=ar], English untouched):
  - mobile burger glued to the logo (margin-left:auto) -> margin-inline-start:auto
  - hero word cycler: synthesized italic Arabic -> normal, words anchored right
  - footer links text-align:left -> start, hover nudge flipped (also on /ar/ral-hr/, verified: align start, footer arrow scale -1 1)
  - hero CTA + CTA-large arrow hover nudges flipped; contact submit arrow mirrored
  - contact modal close button + sidebar divider swapped to the left
  - project detail quote rules (.pd-outcome, .pd-client-note) moved to the start edge
- Language toggle round trip OK (/ar/services/ <-> /services/).

## Left (next agent)
1. Burger menu + contact modal NOT yet visually verified: Playwright click failed because the navbar sits at translateY(-102px) after the scripted scroll (hide-on-scroll-down; Lenis never sees an up-scroll). Wheel-scroll up (page.mouse.wheel(0,-600)) before clicking, or click via evaluate. Then check: menu side/close placement, modal fields, budget chips, submit -> wa.me/97338218181 Arabic text.
2. Look at the section screenshots (scratchpad site-m-sec*.jpg / site-d-sec*.jpg) by eye; the audit heuristics only catch computed-style problems.
3. Confirm contact.css mobile breakpoint is 768px (rtl.css media query assumes it).
4. Mixed-direction strings (phone +973, email) in footer/contact: check order, wrap in <bdi dir="ltr"> if wrong.
5. English regression screenshots of home + /services/ at both sizes.
6. Note: another agent shares the Playwright browser; always use context().newPage() + bringToFront.
