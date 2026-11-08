# Handoff: RAL HR video + E2E (branch feature/ral-hr-video-e2e)

## Done (rounds 1 and 2)
- Video: 720x1280 re-encode (5.8 MB), clean 9:16 frame, controls below. Verified at 1440/768/390.
- Calendar bug FIXED (commit 0779544, src/components/ralhr/SiteChrome.tsx): Lenis `anchors`
  option removed; a window click handler takes same-page `a[href^="#"]` links, resyncs Lenis with
  `scrollTo(window.scrollY, { immediate })`, then glides to target top + scrollY - 88 and pushes
  the hash. Root cause: Lenis measured from its cached scroll, stale after any native scroll
  (keyboard focus, Playwright auto-scroll). All 5 days land at top 88, h3 visible below the navbar.
  Touch devices (no Lenis) still use native anchors + scroll-margin-top 110.
- Interactions at 1440, all PASS, zero console errors: Leave approve/decline, Ask RAL typed EN + AR
  (streamed, table / mini bars), Payroll steps 2 to 4 + IBAN fix + WPS, People payslip,
  /ral-hr/inquire/ full flow to wa.me + mailto. Round 1 timeouts were test selectors, not bugs.
- Checklist: docs/ral-hr/E2E-CHECKLIST.md (30 PASS, 1 TODO).

## Next
1. Layout sweeps at 768 and 390, EN + AR, every /ral-hr/ section, the demo (all 6 tabs) and
   /ral-hr/inquire/: no hscroll, no clipped or overlapping text, nothing under the navbar or the
   floating contact button, zero console errors. Fix real bugs with minimal CSS only.
2. Optional product gap (not a bug): Ask RAL has no "payroll total" intent (matchAsk in
   screens.tsx), so "How much is payroll this month?" gets the generic fallback.
3. Update E2E-CHECKLIST.md, commit. Do not push or merge to main.

## Test notes
- Preview: `npm run build && npx vite preview --port 4675 --strictPort` (4673 was killed).
- Demo nav buttons exist twice (sidebar + phone tab bar): use `[data-g="nav-x"]:visible`.
- Use exact role names (`{ name: 'Approve', exact: true }`); Ask RAL input: getByRole textbox "Ask RAL".
- CountUp animates figures: wait about 2.5 s before reading totals.
- Inquire next button `.iq-next` is aria-disabled when invalid: click with force to test validation.
  Answers persist in localStorage, so start from a fresh context or expect restored values.
- Another agent restyles sections in parallel: only real bug fixes and minimal CSS here.
