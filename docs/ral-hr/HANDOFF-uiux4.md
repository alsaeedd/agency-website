# RAL HR UI/UX cycle 4: HANDOFF (branch feature/ral-hr-uiux4)

## Done (round 1)
- Audit at 1440 and 390, scores in `docs/ral-hr/CYCLE4.md`.
- One CSS block appended to the end of `src/components/ralhr/RalHrPage.css` ("Cycle 4"). No TSX touched, no Demo, no video.
  - Rules: the 18% card leads (`order: -1`), so the bento packs 2+1 then 3 at 1024+, with no empty cells (it used to leave a hole on row 1 and an orphan Arabic card).
  - Press states (`:active` scale) on CTAs, plans and chips; a `:focus-visible` ring in #a78bfa on every control in the page sections; FAQ hover; brighter FAQ answers and rule copy.
  - Month: the day label is a pill, so it no longer sinks into the ghost number.
  - App pings: bigger, brighter text. Plans: more air; two-column feature list under 700 px (about 40% shorter on a phone).
  - 390: CTAs and FAQ rows have at least 48 to 56 px tap targets.

## Verified
- `npm run build` passes, including prerender. Zero console errors and no horizontal scroll at 1440, 768 and 390 on / and /ral-hr/.
- TBT (scratchpad pw.cjs: 4x CPU, 390, isMobile, long tasks after FCP, 6 s, 3 runs): /ral-hr/ went from 84/105/109 to 120/87/97 ms (noise; already under 150 with this method). Home: 94/91/76 ms.
- Tools: `pw.cjs shots <tag> <widths> [ids]`, `pw.cjs tbt`, `sheet.cjs` (contact sheets), all in the session scratchpad. The preview runs on port 4631. node_modules is a junction to the main repo.

## Left (next round, in order)
1. web-design-guidelines review of RalHrPage, Demo, RalHrHome and Inquire (not run: budget).
2. Month chapter 14 (Ask RAL card) shows a big empty area until the chat types. Give it a min-content state or prefill the first bubble (in Month.tsx; it is visual only).
3. Pricing at 390 is still long (3 stacked plans). Consider plan tabs on mobile with the chosen plan expanded and the other two collapsed to one line each.
4. App section: the copy around the phone could carry a short 3-point list for 768 and below. Wait for the video-crop branch to merge first.
5. Re-score the hero, the Demo and the home #ral-hr section (not re-audited this cycle).
6. TBT: the round 3 figure of 190 ms came from a different window. If the owner's measure still shows more than 150, stage-mount Pricing/FAQ/Closing in a second idle slot.
