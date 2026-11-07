# RAL HR page: handoff

## Done
- v1 committed (af5f933): /ral-hr/ and /ral-hr/inquire/ as Vite multi-page entries, SSR-prerendered (scripts/prerender.mjs, src/entry-server.tsx). Page in src/components/ralhr/ (RalHrPage, Demo, screens, charts, data, Inquire).
- Visual QA pass 1 (1440x900, 390x844, 820x1180), isolated headless Chromium on a private dist copy:
  - 0 console errors or warnings on both pages, all three widths.
  - No horizontal overflow (scrollWidth equals clientWidth at 390, 820, 1440) on /ral-hr/ and /ral-hr/inquire/.
  - Demo: web, tablet, phone modes and all 6 tabs render cleanly; ghost cursor tour runs.
- Fixes in RalHrPage.css (QA commit):
  - Video tour was cropped at the sides (CSS said 540/1170, file is 540x960). Now 540/960.
  - h2 text-wrap: balance (killed the "flow." orphan on the demo heading).
  - Anchor targets get scroll-margin-top under the sticky bar.
  - Hit targets: top nav links, footer links and video Play/Sound buttons enlarged; "Sound on" no longer wraps on phone.
  - Keyboard focus ring (#a78bfa) on all .rh / .dv links, buttons, video.

## Shipped (2026-11-07)
- Final QA commit 93c7320: Ask RAL tab seeded with a "Yesterday" conversation (no blank area), inquiry step gap removed (Next sits 32px under content on every step), company trailing dot no longer doubles, SSR-safe layout effect in Inquire.
- Merged to main as c3273cd (--no-ff), pushed. Cloudflare Pages raltech-prod deployment 5075717d, live.
- Live checks (headless Chromium, 1440 and 390): /, /ral-hr/, /ral-hr/inquire/ all 200, 0 console errors, video tour plays (readyState 4), Ask RAL demo responds, navbar RAL HR link lands on /ral-hr/, wa.me goes to 97366386602 with the natural sentence, mailto fallback carries the same text. curl /ral-hr/ returns the prerendered title.
- Home hero and navbar match the old prod pixel for pixel apart from the cycling word.

## Still open
- Tablet and web demo modes at 390 wide are tiny by nature (phone mode is the default there).
- eslint has no flat config in this repo, so `npm run lint` does not run.

## Gotchas
- The Playwright MCP browser is shared with other agents (it got navigated to hr.raltech.dev mid-run). For QA use an isolated script: playwright-core in the scratchpad + `%LOCALAPPDATA%/ms-playwright/chromium-1243/chrome-win64/chrome.exe`, and serve a private copy of dist (`vite preview --outDir <copy> --port 4318`), since other agents rebuild dist.
- Element screenshots show the sticky top bar over section headings; that is a screenshot artefact, not a bug.
- Use the Write tool for files with Arabic or apostrophes. No em dashes anywhere.
- Early Hints Link headers only for /index.html (perfPreload isHome guard); keep it.
