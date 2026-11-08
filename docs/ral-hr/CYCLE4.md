# RAL HR cycle 4: UI/UX audit (branch feature/ral-hr-uiux4)

Scores 1-10, in order: hierarchy / data readability / delight / site consistency / spacing rhythm. Audited at 1440 and 390.

| Section | Before | After round 1 | Main issue found |
|---|---|---|---|
| Month (chapters) | 7/6/7/8/6 | 7.5/7/7/8/7 | day label buried inside the ghost number |
| Rules strip | 6/7/6/8/4 | 8.5/8/7.5/8.5/8.5 | bento left empty cells at 1440 (18% card wrapped to row 2) |
| App (around video) | 7/6/7/8/7 | 7.5/7/7/8/7 | ping text small and dim; video crop owned by another branch |
| Pricing | 8/7/7/8/7 | 8/8/7/8/7.5 | plan lists long and single column at 390 |
| FAQ | 8/7/7/8/8 | 8.5/8/7.5/8/8 | no hover feedback, low answer contrast |
| Closing (talk) | 8/8/8/8/8 | 8/8/8/8/8 | fine |
| Hero, Demo, home #ral-hr | not re-scored | | covered in polish round 3 |

TBT (Playwright, 4x CPU, 390 px, isMobile, long tasks after FCP, 6 s window, 3 runs):
/ral-hr/ 84/105/109 ms before cycle 4 (already under 150 with this method; round 3 quoted 190 with a different window).
