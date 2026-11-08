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

## Round 2 (average of the five scores)

| Section | Round 1 | Round 2 | What changed |
|---|---|---|---|
| Hero (#payday) | not scored | 8.6 | audited only (1440 viewed): strong, live demo is the moment; left as is |
| Demo frame (visual) | not scored | 8.8 | audited only; logic untouched by rule |
| Home #ral-hr | not scored | 8.5 | audited only (1440); left as is, see Left |
| Month: Ask RAL | 7.3 | 8.8 | seeded exchange (greeting, question, answer) so the card is never empty; "From: Your documents" source line on answers; "Try one, in any language" prompt; asked chips dim |
| Pricing | 7.7 | 9.1 | equation chips (40 people x BD 2 Professional =), "about 67 fils per person, per day", tick scale under a bigger slider thumb with grab/press states; phones: plans become 3 tabs with only the chosen plan open (about half the height) |
| App copy | 7.3 | 8.6 | tighter intro; 3 notes under the video (check-in, language, approvals); video element untouched |
| FAQ | 8.0 | 8.0 | not touched this round |

Guidelines fixes: no `transition: all` left in RalHrPage.css; decorative ticks aria-hidden; Inquire inputs have name attributes, headcount autocomplete off.
TBT round 2 (same method): /ral-hr/ 118/130/110 ms. Home 90/227/83 ms (227 is one noisy run; home code not touched).
