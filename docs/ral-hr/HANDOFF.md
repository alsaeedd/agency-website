# RAL HR page: handoff

## State
- v1 live since 2026-11-07 (deploy 5075717d). Cycle 1 of 3 done on feature/ral-hr-cycle1, merged to main (see git log). Scores and critique: docs/ral-hr/CYCLE1.md (5.8 to 6.9 average).
- Cycle 1 added (RalHrPage.tsx/.css only): hero payroll run card (count-up, waterfall bars, ticking checks, toast), per-word masked headline, lit bento torch, payslip tile full row, pricing team slider with live totals, big closing CTA with next steps, numbered eyebrows, demo halo, founder quote mark.

## Next (cycle 2)
- Demo internals: KPI readability in web mode, device switcher Flip morph polish, sidebar to bottom tab bar choreography.
- Inquiry send-step payoff moment.
- Video, FAQ and footer layout variety.

## Still open
- Tablet and web demo modes at 390 wide are tiny by nature (phone mode is the default there).
- eslint has no flat config in this repo, so `npm run lint` does not run.

## Gotchas
- Source files use CRLF. Scripted edits must normalise line endings first.
- Bash heredocs with quotes or backslashes break in this shell: write files with the Write tool.
- The Playwright MCP browser is shared. For QA use playwright-core in the scratchpad + `%LOCALAPPDATA%/ms-playwright/chromium-1243/chrome-win64/chrome.exe`, and serve a private dist copy (`vite preview --outDir <copy> --port 4318`).
- Element screenshots show the sticky top bar over headings; artefact, not a bug. The fold shot catches the hero mid-timeline (count-up at a partial value); expected.
- Use the Write tool for files with Arabic or apostrophes. No em dashes anywhere.
- Early Hints Link headers only for /index.html (perfPreload isHome guard); keep it.
