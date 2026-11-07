# RAL HR page: improvement cycle 3

Jury: Awwwards SOTD panel plus a Linear/Stripe design lead. Screens: own headless Chromium (playwright-core) at 1440x900 and 390x844, viewed as small contact sheets (scratchpad, not committed). Scope was cut to the three weakest sections because of a hard tool budget; see "Still below 8.5".

## Scores (wow / clarity / craft, out of 10)
| Section | Before (cycle 2) | After | What changed |
|---|---|---|---|
| Hero | 8 / 9 / 8 (8.3) | 8.3 | Unchanged |
| Live demo | 8.5 (8.5) | 8.5 | Unchanged |
| Bahrain bento | 7 / 7 / 8 (7.3) | 8.5 / 9 / 8.5 (8.7) | Split head (heading left, line right) breaks the repeated left head. Signature: the rules check themselves on arrival: the 10 WPS columns tick one by one with a "0 to 10 of 10 columns valid, 98 rows checked" count, SIO ladder bars grow with the % above each bar, expiry chips light 90, 30, 7 with a ping on 7 and a "days" unit, payslip rules slide in |
| Video tour | 7.8 | 7.8 | Unchanged |
| Pricing | 7 / 9 / 8 (8.0) | 9 / 9.5 / 9 (9.2) | Centered head plus a full-width estimator console: 80px team count, custom gradient slider (30px thumb, focus ring, 5/100/200/300 ticks), preset chips 10/25/50/100/250, live bar comparison of all three plans (tap to select), big tweened monthly total plus yearly figure and setup-fee note; the selected plan's card gets a lavender ring. Duplicate per-card total removed |
| Founder note | 6 / 8 / 7 (7.0) | 8.5 / 8.5 / 8.5 (8.5) | Words light up in reading order, the four Bahrain rules (WPS file, SIO, end of service, Arabic payslips) underline in sequence, then a monogram and "Suhaib" signature line with a drawn swash; role line "Founder, RAL Technologies, Manama" |
| FAQ | 8.5 | 8.5 | Unchanged |
| Closing CTA | 8.0 | 8.0 | Unchanged |
| Footer | 7.8 | 7.8 | Unchanged |
| Inquiry flow | 8.5 | 8.5 | Unchanged |
| **Average** | **8.0** | **8.4** | Target 8.8 not reached |

## Critique before (top issues found)
| # | Problem | Fix | Status |
|---|---|---|---|
| 1 | Bento is static: nothing proves the rules are checked | Sequenced check: columns, count, ladder, expiry ping | Done |
| 2 | Pricing slider is a small default range input in a pill | Console with big number, custom slider, presets | Done |
| 3 | Plans cannot be compared at a glance | Live bars for all three plans, selectable, tweened totals, yearly figure | Done |
| 4 | Founder note is a plain italic block | Word reveal, rule underlines, monogram and signature | Done |
| 5 | Hero, bento and pricing heads all left-aligned | Bento split head, pricing centered head | Done |
| 6 | Total repeated on every card (noise) | Removed, console owns the number | Done |

## Perf (390x844, 4x CPU throttle, local preview)
| Metric | Before | After |
|---|---|---|
| FCP / LCP | 460 / 860 ms | 480 / 888 ms |
| TBT (load + full scroll) | 307 ms (2 long tasks, max 301) | 374 ms (3 long tasks, max 325) |
| CLS | 0.0001 | 0.0002 |
| Video requests before scroll | 0 | 0 (preload none, src set at 50% visible) |
| rAF at footer, idle | 149/s, all GSAP core ticker | same; app loops (demo tour, feed) already pause offscreen |

TBT is dominated by one hydration task; the extra ~60 ms is the larger pricing/founder DOM. Acceptable, flagged for later.

## Checks after
- /, /ral-hr/, /ral-hr/inquire/ 200 at 1440 and 390; 0 console errors; 0 horizontal overflow; home still links to RAL HR; git diff vs main touches only src/components/ralhr (home untouched).
- Demo mounts, video loads when visible, pricing presets + plan select give "BD 300 a month" for 100 people on Premium.
- Reduced motion: new timelines sit inside the calm() guard; ping, bar and chip transitions off by media query; markup ships in the final state (all checks on) for no-JS and prerender.

## Still below 8.5 (next)
- Hero 8.3: first 5 s are fine, needs one more beat (e.g. the toast linking into the demo).
- Video 7.8: chapter chips once real timestamps exist; frame larger on desktop.
- Closing CTA 8.0 and footer 7.8: no change this cycle.

## Finishing round

Branch feature/ral-hr-finish (committed, NOT merged or deployed: tool budget ran out after QA).

| Section | Before | After | Change |
|---|---|---|---|
| Hero | 8.3 | 8.8 | An APPROVED stamp slams onto the run card after the last step (card nudges), then the toast lands and is now a link: "Open this run in the live demo" |
| Video tour | 7.8 | 8.4 | Larger phone on desktop (380px). Three app notifications pop out of the phone in turn: check-in inside radius, leave approved in one tap, Arabic payslip ready |
| Closing CTA | 8.0 | 8.8 | Headline rises word by word like the hero; the three steps sit on a track that draws across and lights 1, 2, 3 in order |
| Footer | 7.8 | 8.8 | Four-column footer (brand + CTA, product, contact incl. WhatsApp, live Manama clock), RAL HR wordmark fills from the floor up on arrival |

Perf (390x844, 4x CPU, local preview, 2 runs each):

| Metric | Before | After |
|---|---|---|
| TBT (load + scroll) | 365 / 384 ms | 218 / 231 ms |
| Longest task | 321 / 326 ms | 195 / 202 ms |
| LCP | 872 / 888 ms | 748 / 748 ms |
| CLS | 0.0002 | 0.0002 |

What changed: the long task was mostly the browser laying out the whole prerendered page (about 260 ms of Layout at 4x). Prerendered HTML now carries data-ssr, and below-the-fold sections get content-visibility: auto only in that phase. The client then renders the hero first and mounts the rest in two idle, time-sliced transitions; below-fold GSAP setup runs one section per idle slot. The Demo mount is a transition too.

Still open (next):
- TBT 150 ms target not met. Remaining big task is about 170 ms of script: bundle eval + hero render + hero GSAP timeline (gsap reads computed styles). Next try: start the hero timeline in a rAF after first paint with the hero hidden by a CSS class, or split the vendor chunk.
- Video pings: at 1440 the right ping sits 64px outside the phone, check it is not clipped on the live page; at 390 the pings cover the video edges, consider smaller chips or only two on mobile.
- Ship: fetch, pull main, merge --no-ff, rebuild, push, watch raltech-prod, live check home, /ral-hr/, /ral-hr/inquire/ at 1440 + 390.
