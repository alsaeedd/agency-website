# RAL HR page: handoff

## State
- v1 live since 2026-11-07 (deploy 5075717d). Cycle 1 of 3 done on feature/ral-hr-cycle1, merged to main (see git log). Scores and critique: docs/ral-hr/CYCLE1.md (5.8 to 6.9 average).
- Cycle 1 added (RalHrPage.tsx/.css only): hero payroll run card (count-up, waterfall bars, ticking checks, toast), per-word masked headline, lit bento torch, payslip tile full row, pricing team slider with live totals, big closing CTA with next steps, numbered eyebrows, demo halo, founder quote mark.

## Cycle 2 (done, merged to main)
- Scores and critique: docs/ral-hr/CYCLE2.md (6.9 to 8.0 average).
- Demo: readable KPIs (canvas 1040 web / 700 tablet), native phone shell (status bar, icon tab bar, large titles), sliding indicators, tab-change stagger, radius Flip morph, tour captions, press ring, toast stack, approval stamps.
- Inquiry: typing dots to bubble pop, sent card after WhatsApp tap. FAQ: split layout, serif numerals, GSAP accordion (component Faq in RalHrPage.tsx). Footer: links + wordmark. Video: serif numeral row.

## Next (cycle 3)
- Bento, founder note and pricing need a signature moment each (all below 8.5).
- Video chapter chips only once real timestamps exist.
- Section head rhythm still repeats on hero/bento/pricing.

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
