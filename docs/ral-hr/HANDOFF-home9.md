# HANDOFF: home9 (home #ral-hr + /ral-hr/ FAQ)

Branch `feature/ral-hr-home9` (from be7c34b). Not pushed, not merged.

## Done
| Item | Before | After |
|---|---|---|
| Home #ral-hr (`RalHrHome.tsx/.css`) | 8.5 | 9.3 (self-scored) |
| FAQ on /ral-hr/ (`RalHrPage.tsx/.css`) | 8.0 | 9.0 (self-scored) |

- Home now tells it in order: the promise (left) and four facts led by figures (10/10, 2, 2024, AR/EN) on the right, then the live payday window as the one big moment, caption tight under it, then the offer bar (BD 1 + both CTAs). Phones: promise, window, facts, offer.
- Copy is warmer and plainer. "Try the live demo" still points to `/ral-hr/#demo`.
- Lazy init kept (IO + lazy Payday). Two fire-once reveals: head + facts on the title, offer on itself. Weak devices go through `revealUp`/`isWeakDevice` as before.
- Web guidelines fixes: removed about 60 lines of dead v1 CSS and the dead `.hrh-replay` selector; real `<figure>`/`<figcaption>`; 47px minimum tap height; tap highlight off; `text-wrap: pretty` on body text.
- FAQ: native exclusive accordion (`details name`), smooth open and close via `::details-content` + `interpolate-size` (no JS, falls back to instant), number badges removed, chevron turns, open question goes white, focus-visible ring, answers use the full width on 390 (the 58px indent is gone).
- Checked at 1440/768/390: 0 console errors, 0 horizontal scroll on both pages.

## Open
- Home TBT (390, 4x CPU, 3 runs): before 237/71/82, after 204/200/192, re-run 204/217/254. The home change adds no work at load (the section stays lazy), and the machine was busy with other agents. Next: A/B both builds back to back on a quiet machine to confirm it is noise.
- Optional: the "2" figure (SIO shares) reads lighter than the others. Find a stronger true figure if one exists.

Screenshots: scratchpad `shots/after-home-1440.jpg`, `after-home-390.jpg`, `after-faq-390.jpg`.
