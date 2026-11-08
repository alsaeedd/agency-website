# RAL HR final round: HANDOFF (branch feature/ral-hr-final)

## Done
- Round 1: Ask RAL payroll intent EN + AR (screens.tsx), payroll chip first in the tour.
- Round 2 (this commit):
  - Anchor: ids were already right (#demo = interactive demo, #app = video). The old sweep
    script measured before the demo mounted. Real issue: direct load of /ral-hr/#demo could
    settle 29 px high at 390. RalHrPage.tsx now realigns at 0.4/1/2 s, stops on user scroll.
    Home "Try the live demo" already links /ral-hr/#demo; section index links #demo.
  - Footer: SiteChrome.tsx adds `rh-foot-in` on <html> while the footer is in view;
    RalHrPage.css hides `.contact-circle` then (same rule as hp-demo-in).
  - "09" over "Friday 9 October": decorative watermark, same as all chapters. No change.
  - Demo tested 1440/768/390, EN + AR, web/tablet/phone: tabs, Ask payroll EN + AR,
    leave approve/decline, payroll steps, EOS slider. Zero console errors, no h-scroll.
- E2E-CHECKLIST.md updated: 17 PASS, 2 TODO (perf).

## Scripts
- `.playwright-mcp/demo-final.js` (main repo): full demo pass, port 4691.
- `.playwright-mcp/sweep-final.js`: page sweep (port 4688 inside, edit B).

## Next
1. Perf: Playwright, 4x CPU throttle (CDP Emulation.setCPUThrottlingRate 4), 390px,
   3 runs: /ral-hr/ TBT < 150 ms; home on this branch vs main (build main in a temp
   worktree). Record in E2E-CHECKLIST.md "Performance" rows.
2. Leftovers from round 1 list (home #ral-hr, FAQ) belong to the other agent's branch.

## Notes
- Do not touch src/components/RalHrHome.* or FAQ styles here.
- Build passes (old useLayoutEffect SSR warning is harmless).
