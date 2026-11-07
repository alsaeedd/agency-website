# RAL HR page: improvement cycle 1

Jury: Awwwards SOTD panel plus a Linear/Stripe design lead. Screens: headless Chromium at 1440x900 and 390x844, every section (scratchpad shots, not committed).

## Scores (wow / clarity / craft, out of 10)
| Section | Before | After | What changed |
|---|---|---|---|
| Hero | 3 / 7 / 6 | 8 / 9 / 8 | Live payroll run card: BHD 111,295 counts up, Gross to Net waterfall bars cascade, 4 checks tick in order, approval toast lands. Per-word masked headline rise |
| Live demo | 6 / 6 / 7 | 7 / 6 / 7 | Violet halo behind the device; numbered eyebrow. Inner demo untouched this cycle |
| Bahrain bento | 5 / 7 / 6 | 7 / 7 / 8 | 4-column hole under the payslip tile closed (full row, two lines side by side); pointer torch lights surface and edge (fine pointers only) |
| Video tour | 5 / 7 / 7 | 5 / 7 / 7 | Unchanged |
| Pricing | 4 / 7 / 6 | 7 / 9 / 8 | Team-size slider (5 to 300); every plan shows its live monthly BD total |
| Founder note | 5 / 8 / 6 | 6 / 8 / 7 | Oversized Newsreader quote mark as an anchor |
| FAQ | 3 / 8 / 6 | 4 / 8 / 6 | Numbered eyebrow only |
| Closing CTA | 2 / 6 / 5 | 8 / 8 / 8 | 112px headline with italic "your own", glow, 3-step "what happens next", larger lit CTA |
| Footer | 3 / 7 / 5 | 3 / 7 / 5 | Unchanged |
| Inquiry flow | 5 / 8 / 7 | 5 / 8 / 7 | Unchanged |
| **Average** | **4.1 / 7.1 / 6.1 (5.8)** | **6.0 / 7.7 / 7.1 (6.9)** | |

## The 10 highest-impact upgrades (before critique)
| # | Problem found | Fix | Status |
|---|---|---|---|
| 1 | Hero has no signature moment; the right 45% of the fold is empty, no product, no number | Payroll run card (signature moments 1 and 2 from research) | Done |
| 2 | Headline enters as one block fade; research asked for a masked rise | Per-word mask, yPercent rise, 0.05s stagger | Done |
| 3 | Zero numbers above the fold; data not readable at a glance | 64px tabular BHD figure, labelled bars, values per check | Done |
| 4 | Bento leaves a 4-column hole at 1440; looks unfinished | Payslip tile spans the row | Done |
| 5 | "Lit grid" moment missing; bento is static | rAF pointer torch, CSS vars, fine pointer only | Done |
| 6 | Pricing makes the buyer do the maths | Team slider with live totals per plan | Done |
| 7 | Closing CTA is the weakest section (small h2, one line, no reason to click) | Big moment plus next steps | Done |
| 8 | Same-y rhythm: every section is pill plus left h2 | Numbered eyebrows 01 to 05; hero and close now break the pattern | Partly |
| 9 | Demo sits on a flat background, device does not feel lit | Halo behind the frame | Done |
| 10 | Device switcher and demo KPIs still feel generic; KPI text small in the scaled web stage; inquiry final step has no payoff moment | Cycle 2 | Open |

## Next (cycle 2)
- Demo: larger KPI type in web mode, Flip morph polish on Phone, sidebar to tab bar choreography.
- Inquiry: send-step payoff (message bubble lands, mint check), progress feel.
- Video section and FAQ layout variety; footer.

## Checks after
- /ral-hr/ and /ral-hr/inquire/: 200, 0 console errors or warnings, 0 horizontal overflow at 1440 and 390.
- Reduced motion and data-tier low: timeline skipped, card renders final values with every check ticked, toast visible.
