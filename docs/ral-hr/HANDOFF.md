# RAL HR page: handoff

## State
- Live at https://raltech.dev/ral-hr/ since 2026-11-07. Three improvement cycles done, all merged to main (see git log).
- Scores: CYCLE1.md (5.8 to 6.9), CYCLE2.md (6.9 to 8.0), CYCLE3.md (8.0 to 8.4).
- Cycle 3 (RalHrPage.tsx/.css only): bento rules check (WPS columns tick + count, ladder grow, expiry ping), split bento head, pricing estimator console (big count, custom slider, presets, live plan bars, tweened monthly + yearly totals, selected card ring), founder word reveal + rule underlines + monogram signature.

## Next (below 8.5)
- Hero 8.3: one more beat after the toast.
- Video 7.8: chapter chips once real timestamps exist; larger frame on desktop.
- Closing CTA 8.0, footer 7.8.
- Perf: TBT 374 ms at 390 / 4x CPU, one ~320 ms hydration task. Idle rAF is the GSAP core ticker only.

## Still open
- Tablet and web demo modes at 390 wide are tiny by nature (phone mode is the default there).
- eslint has no flat config in this repo, so `npm run lint` does not run.

## Gotchas
- Source files use CRLF. Scripted edits must normalise line endings first.
- Bash heredocs with quotes or backslashes break in this shell: write files with the Write tool.
- The Playwright MCP browser is shared. For QA use playwright-core in the scratchpad + `%LOCALAPPDATA%/ms-playwright/chromium-1243/chrome-win64/chrome.exe`, and serve a private dist copy (`vite preview --outDir <copy> --port 4318`). Restart preview after every rebuild (it caches the file list).
- Video only loads at 50% visible: scroll the video element itself, not the section, when testing at 390.
- Never set textContent on React-owned nodes for count-ups; use the Tween component (state driven).
- Element screenshots show the sticky top bar over headings; artefact, not a bug.
- Use the Write tool for files with Arabic or apostrophes. No em dashes anywhere.
- Early Hints Link headers only for /index.html (perfPreload isHome guard); keep it.
