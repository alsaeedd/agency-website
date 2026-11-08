# RAL HR UI/UX cycle 4: HANDOFF (branch feature/ral-hr-uiux4)

## Done
- Round 1: rules bento, press/focus states, month day pills, pings, compact plans (see CYCLE4.md).
- Round 2 (this commit), scores in CYCLE4.md "Round 2":
  - Month.tsx `Ask`: seeded conversation (SEED), source line per answer, try prompt, asked chips dim.
  - Pricing (RalHrPage.tsx + CSS): equation chips, fils-per-day line, slider ticks + thumb states, phone plan tabs (CSS only: `.hp-plan { display: contents }` under 700 px).
  - App section: new intro copy + `.hp-app-notes` (3 notes) under the video. Video untouched.
  - Guidelines: removed `transition: all`, aria-hidden ticks, Inquire input names.
- All new CSS is the "Cycle 4 round 2" block at the end of RalHrPage.css.

## Verified
- Build + prerender pass. Zero console errors, no horizontal scroll at 1440 and 390 on /ral-hr/ and /.
- TBT: /ral-hr/ 118/130/110 ms; home 90/227/83 (one noisy run).
- Shots: scratchpad shots/r2-pricing-390.jpg, r2-pricing-1440.jpg, r2-ask-390.jpg. Preview on port 4632.

## Left (next round, in order)
1. Check 768 for the new pricing and app notes (not shot this round).
2. Home #ral-hr (8.5): the stat row under the demo reads like four equal captions; give it one hero figure or merge with the CTA row.
3. Hero (8.6) and Demo (8.8): view the 390 shots (b4-payday-390, b4-demo-390) and fix anything below 9.
4. FAQ (8.0): group questions or add a short answer preview; section spacing rhythm pass.
5. Full web-design-guidelines pass on Demo.tsx and RalHrHome.tsx (only RalHrPage, Month and Inquire were fixed).
6. Re-run TBT on home to confirm the 227 ms run was noise.
