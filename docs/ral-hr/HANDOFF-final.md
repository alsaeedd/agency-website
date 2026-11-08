# RAL HR final round: HANDOFF (branch feature/ral-hr-final, from feature/ral-hr-round4)

## Done (round 1 of the final cycle)
- Ask RAL payroll intent (screens.tsx): `matchAsk` returns 6 for payroll / salary / wage / gross /
  رواتب / راتب / أجور / rawatib. Answer: gross BD 118,460.000, deductions 7,165.000, net 111,295.000
  (same TOTALS as the hero), BD up vs September, 3-row table (BD + share of gross), bars for the
  4 biggest departments, source line. EN + AR. New first chip "How much is payroll this month?".
  Tour (Demo.tsx) now plays ask-0 (payroll) then ask-2 (Noor, Arabic).
- Layout sweep script: `.playwright-mcp/sweep-final.js` in the main repo (Playwright MCP may only
  read files there). Run with browser_run_code_unsafe `filename`. Preview on port 4688.

## Sweep results so far (768 + 390, EN + AR, /ral-hr/, /ral-hr/inquire/, home #ral-hr)
- PASS: no horizontal scroll anywhere, zero console errors, inquire page clean.
- False positives to ignore: `.nav-loader-bar` (offscreen transform), CountUp digit spans in
  pricing, Payday stamp / payslip toast overlays (intended layering).
- BUG (sweep script): `#demo` is NOT the interactive demo (it is the video/app section: Play and
  Sound on buttons). All demo tabs reported "no-tab". Find the demo section id
  (grep `<Demo` in RalHrPage.tsx) and point the script's scrollTo + `#demo` scope at it.
  Tabs, Ask payroll answers (EN + AR) and the 390 Ask screenshots still need that rerun.
- REAL: at page end on 390, footer links ("Work", "About", "Insights") sit under the floating
  `.contact-circle`. Fix with bottom padding on the footer under 600px (scope to ral-hr if the
  footer is shared and home must not change).
- CHECK: 390 EN `.hp-ch-n "09"` overlaps "Friday 9 October" (month section). Likely a decorative
  number; verify in a screenshot.
- At 768 the floating button covers a Payday row when the video section is centered: transient,
  probably fine; recheck with the right demo id.

## Next (priority order)
1. Fix sweep script demo id, rerun, fix real issues, update E2E-CHECKLIST.md (row 55 is TODO).
2. Home #ral-hr to 9 (RalHrHome.tsx/.css). Current: eyebrow, title, intro, price+CTAs, Payday
   window, 4 equal facts. Give the facts a lead fact or merge with the offer; keep lazy init.
3. FAQ to 9 (RalHrPage.tsx `Faq`, CSS at RalHrPage.css ~246 and ~420): group questions, spacing
   rhythm between `.hp-sec` sections.
4. web-design-guidelines review of Demo.tsx and RalHrHome.tsx.
5. Perf: Playwright 4x CPU, 390, 3 runs: /ral-hr/ under 150 ms TBT, home not worse than main.

## Notes
- Shots go to the scratchpad `shots/` folder; screenshots reduced (jpeg q55, scale css).
- Build: `npm run build` passes (the useLayoutEffect SSR warning is old and harmless).
