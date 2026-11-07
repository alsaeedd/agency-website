# RAL HR page: improvement cycle 2

Jury: Awwwards SOTD panel plus a Linear/Stripe design lead. Screens: own headless Chromium (playwright-core) at 1440x900, 820x1180 (demo) and 390x844, viewed as small contact sheets (scratchpad, not committed).

## Scores (wow / clarity / craft, out of 10)
| Section | Before (cycle 1) | After | What changed |
|---|---|---|---|
| Hero | 8 / 9 / 8 | 8 / 9 / 8 | Unchanged |
| Live demo | 7 / 6 / 7 | 8.5 / 8.5 / 8.5 | Big tabular KPIs in every mode (net pay renders 46px tall at 1440, was about 20px); BHD unit set small; trend chips; red/amber/neutral expiry chips; "Payroll runs Thu 26 Nov" chip; staggered rise on every tab change; sliding indicators (device pill, sidebar, phone tab bar); Flip morph now animates radius and padding with a blur-focus settle and the laptop base growing in; ghost cursor glides by distance, hovers, presses with a ring and ripple; live caption says what the tour is doing; stacked toasts with a check; approval cards stamp "Approved" then lift away. Phone: status bar (9:41, signal, battery), large titles, hero net-pay card, 3-up KPIs, icon tab bar, thumb-sized buttons |
| Bahrain bento | 7 / 7 / 8 | 7 / 7 / 8 | Unchanged |
| Video tour | 5 / 7 / 7 | 7.5 / 8 / 8 | Newsreader numeral row (2 apps, 1 tap, عربي payslips). No chapter chips: no timestamps exist for the video, so chips would lie |
| Pricing | 7 / 9 / 8 | 7 / 9 / 8 | Unchanged |
| Founder note | 6 / 8 / 7 | 6 / 8 / 7 | Unchanged |
| FAQ | 4 / 8 / 6 | 8 / 9 / 8.5 | Split layout (sticky heading + "Ask a question" CTA left, list right); italic serif numerals 01 to 06; real GSAP height accordion (open and close both animate), plus-to-minus morph, aria-expanded/controls |
| Closing CTA | 8 / 8 / 8 | 8 / 8 / 8 | Unchanged |
| Footer | 3 / 7 / 5 | 7.5 / 8 / 8 | Section links row plus a giant fading "RAL HR" wordmark (serif italic HR) as the closing beat |
| Inquiry flow | 5 / 8 / 7 | 8 / 9 / 8.5 | Final step: typing dots, then the bubble pops in from the corner; after tapping WhatsApp a "WhatsApp is open with your message" card draws its check, ticks turn lavender, CTA becomes "Open WhatsApp again". Neutral copy: no reply-time promise (brief has none) |
| **Average** | **6.0 / 7.7 / 7.1 (6.9)** | **7.6 / 8.4 / 8.1 (8.0)** | |

## Critique before (top issues found)
| # | Problem | Fix | Status |
|---|---|---|---|
| 1 | Web KPIs about 20px on screen: the 1180px canvas was scaled to 0.68 | Canvas 1040x680 (tablet 700x940), KPI 40px, unit small | Done |
| 2 | Phone mode is the desktop app squeezed | Status bar, large title, icon tab bar, hero KPI card, thumb buttons | Done |
| 3 | Tabs cut over with no transition; nav highlight jumps | Staggered rise, sliding indicators | Done |
| 4 | Morph: frame resizes, then content pops | Radius/padding Flip, blur-focus settle | Done |
| 5 | Tour clicks feel robotic, single toast overwrites | Distance-timed glide, hover, press ring, captions, toast stack, approval stamp | Done |
| 6 | Inquiry last step has no payoff | Typing to bubble, sent card | Done |
| 7 | FAQ is a plain details list, closes with a snap | Split layout, numerals, tweened accordion | Done |
| 8 | Footer is one grey line | Links plus wordmark | Done |
| 9 | Video copy column is text only | Serif numeral row | Done |
| 10 | Home feed interval ran while offscreen | Skips ticks when the list is out of view or the tab is hidden | Done |

## Still below 8.5 (cycle 3)
- Bento (7/7/8), founder note (6/8/7), pricing wow (7): need a signature moment each.
- Video: chapter chips once real timestamps exist; frame larger on desktop.
- Demo: phone and tablet frames read small at 1440 (raised to 380 / 600 px max this cycle; check).
- Global rhythm: hero, bento and pricing still share the left-aligned head pattern.

## Checks after
- Local build: /ral-hr/ and /ral-hr/inquire/ 200 at 1440, 820, 390; 0 console errors or warnings; 0 horizontal overflow; typing and sent states render.
- Reduced motion: new animations (toasts, stamps, typing dots, sent check, indicators) disabled by media query; JS paths use calm().
