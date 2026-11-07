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

## Not checked or still open
1. Inquiry flow: a helper agent is rewriting Inquire.tsx + Inquire.css (plan step, BHD estimate, WhatsApp sentence). After it lands: step through all steps at 390 and 1440, check the final preview and that the wa.me href decodes to the preview text. v1 showed a big empty gap between the step body and the Next button on both widths.
2. Ask RAL tab (web mode): the empty state leaves a large blank area; consider seeding one example exchange or centring the suggestion chips.
3. Tablet and web modes at 390 wide are tiny by nature (phone mode is the default there, which is right).
4. Home page navbar "RAL HR" link and home visuals not re-verified in this pass.
5. Merge to main per MEMORY (fetch first, --no-ff) only when the owner says go. Do not push.

## Gotchas
- The Playwright MCP browser is shared with other agents (it got navigated to hr.raltech.dev mid-run). For QA use an isolated script: playwright-core in the scratchpad + `%LOCALAPPDATA%/ms-playwright/chromium-1243/chrome-win64/chrome.exe`, and serve a private copy of dist (`vite preview --outDir <copy> --port 4318`), since other agents rebuild dist.
- Element screenshots show the sticky top bar over section headings; that is a screenshot artefact, not a bug.
- Use the Write tool for files with Arabic or apostrophes. No em dashes anywhere.
- Early Hints Link headers only for /index.html (perfPreload isHome guard); keep it.
