# Handoff: RAL HR video + E2E (branch feature/ral-hr-video-e2e)

## Done
- Video: re-encoded from C:/Users/Suhaib/Downloads/ralhr_marketing.mp4 (720x1280, 81 s).
  2-pass H.264 at 480k + AAC at 80k, faststart: 5.8 MB at 720x1280 (was 4.0 MB at 540x960).
  CRF 24 gave 9.6 MB (over the 6 MB cap), so 2-pass was used instead.
  Poster regenerated as webp from frame 0 of the new encode.
- Presentation (RalHrPage.tsx VideoTour; RalHrPage.css .hp-phone / .hp-vframe / .hp-video-ctl):
  the phone frame (9/19.5 with object-fit cover and 38 px corners) is replaced by a clean frame
  sized to the video (aspect 9/16, contain, 16 px corners). Controls moved below the frame.
  preload="none" and the lazy src are kept. Verified at 1440/768/390: box ratio 0.5625 = video.
- E2E round 1 at 1440: see docs/ral-hr/E2E-CHECKLIST.md.

## Open bug (fix first)
- October calendar (.hp-cal in Month.tsx, around line 167): clicking a day sets the hash (#oct-NN)
  but the scroll lands in the wrong place, except oct-14. After 3 s: oct-01 top 1833,
  oct-09 1285, oct-25 -1583, oct-31 -3817. Suspect the target is computed before hp-in or
  lazy content changes the layout, or a Lenis scrollTo with a stale offset. Check the click
  handler, then re-test every day.

## Next
1. Fix the calendar jump, rebuild, re-test.
2. Triage Leave approve/decline (getByRole Approve timed out) and the Ask RAL typed input
   (input[type=text] fill timed out): may be test selectors, may be real bugs.
3. Payroll steps 2 to 4, IBAN fix, WPS; People payslip.
4. /ral-hr/inquire/ full flow through to wa.me + mailto.
5. Sweeps at 768 and 390, EN + AR: hscroll, clipped text, floating contact button overlap.
6. Update E2E-CHECKLIST.md, commit. Do not push or merge to main.

## Notes
- Preview server: `npx vite preview --port 4673 --strictPort` (rebuild with `npm run build`).
- Video screenshots (scratchpad of the round 1 session): vid-1440-t0.jpg, vid-1440-t40.jpg,
  vid-390-t0.jpg, vid-390-t40.jpg.
- Another agent is polishing other sections: touch only the video, real bug fixes, minimal CSS.
