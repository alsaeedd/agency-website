# RAL HR: product page design research

Research date: 2026-11-07. Sources: live fetches of attio.com, ramp.com and raycast.com, published teardowns (SaaSFrame, 925studios, webdesignhot), the GSAP scripted-demo write-up (dev.to/vein05), the playthru demo library docs, Navattic's 2025 demo report and CXL's form study, plus long-run observation of Linear, Stripe, Vercel, Clerk, Resend, Mercury, Rippling and Apple.

Every pattern below fits our constraints: React 18 + TS + Vite, vanilla CSS variables, GSAP fire-once only (no pin, no scrub), no WebGL, dark violet palette, Inter + Newsreader, smooth on weak phones.

## Benchmarks worth knowing
| Fact | Source | What it means for us |
|---|---|---|
| 73% of top demo CTAs sit above the fold | Navattic 2025 | The demo (or its door) belongs in the hero |
| Avg demo time 2.1 min, 54% completion | Navattic 2025 | 5 to 8 steps per guided story, no more |
| Engaged demo viewers convert ~8x more (24% vs 3%) | Userpilot (vendor data) | The demo is the conversion engine, not decoration |
| An extra qualifying step raised B2B form conversion ~20% | CXL | A short qualifier beats a bare "contact us" |
| Scripted DOM demo: ~37 KB gz vs 2 to 4 MB MP4 | dev.to/vein05 | Build demos as DOM + GSAP, never video |

## The patterns (16)

### 1. The real app as hero, not a screenshot (Clerk, Resend, Lovable)
- **What:** Clerk puts a working `<SignIn />` on the homepage; Resend's hero is an editable code block; Lovable lets you prompt the product right on the page.
- **Why jaws drop:** The visitor realises in 2 seconds that the marketing page *is* the product. No "watch video" leap of faith.
- **Build:** Hero right column = a live, typeable "Request leave" mini-form inside the RAL HR shell. Submitting it flips the card to "Approved by Sara, 0.4s" with a mint dot. Pure React state, no backend.

### 2. Scripted ghost-cursor film that yields to the real mouse (playthru, Linear-style)
- **What:** A fake cursor glides, clicks, types inside real DOM UI on a loop; it freezes and hides the moment a real pointer enters.
- **Why:** It reads like a person using the app live, yet it is crisp at any zoom and weighs kilobytes.
- **Build:** One `gsap.timeline({repeat:-1, repeatDelay:1.2})`, labels named after actions (`"approveClick"`), offsets like `"approveClick+=0.16"`. Cursor moves `power2.out`, 0.4 to 0.6s short hops, ~1s cross-screen. Click = scale 0.88 + ripple, release `back.out(2.2)`. Typing `ease:"none"`. Reset block at position 0 restoring every prop (missed `rotation` = visible snap). `autoAlpha` for scene swaps. Mirror `:hover` via `[data-ghost-hover]` since a fake cursor cannot trigger it. `pointerenter` on stage = `tl.pause()` + hide cursor; `IntersectionObserver` pauses when off-screen. Start only once 30% visible.

### 3. Fixed design canvas, scaled by transform (Linear, Vercel product shots)
- **What:** App mockups render at one design width (e.g. 1200px) and the whole stage scales down with `transform: scale()`.
- **Why:** The mini-app looks pixel-identical on a phone and a 27" screen; timings never break.
- **Build:** `ResizeObserver` on wrapper sets `--s: width/1200`; stage `transform: scale(var(--s)); transform-origin: 0 0`. Wrapper height = 1200 x aspect x s. No media queries inside the demo.

### 4. Numbered story tabs that swap the mockup (Attio "Build pipeline -> Retain and expand")
- **What:** Five numbered steps, each swaps the product panel beside it. Attio uses this as its main explainer.
- **Why:** It turns a feature list into a narrative of a working week, and the visitor drives it.
- **Build:** Tabs "01 Hire / 02 Onboard / 03 Time off / 04 Payroll / 05 Insights". Active tab gets a thin progress line that fills over 6s (CSS `transition: width 6s linear`) then auto-advances; any click stops autoplay for good. Panels crossfade with `autoAlpha`, 0.35s `power3.out`. No scroll pinning.

### 5. Device switcher: Web / Tablet / Phone (Framer, Webflow previews)
- **What:** A segmented control morphs the same demo frame between desktop, tablet and phone.
- **Why:** For GCC HR buyers "does it work on the staff's phones?" is the first objection; this answers it with a gesture.
- **Build:** One frame element, GSAP tweens `width`, `height`, `borderRadius` (0.6s `expo.out`) while inner layout switches via a `data-device` attribute (sidebar collapses to bottom tab bar). Content fades out at 0.1s, back in at 0.45s so the reflow is hidden. On real phones default to Phone and show the switcher as "see it on desktop".

### 6. Numbers that count up once, with tabular figures (Stripe, Ramp stats)
- **What:** KPIs tick from 0 to value as they enter.
- **Why:** Motion on numbers signals "live system", not brochure.
- **Build:** `font-variant-numeric: tabular-nums` so width never jitters. GSAP tween on a proxy `{v:0}` -> value, 1.4s `expo.out`, `onUpdate` writes `textContent`. ScrollTrigger `once:true, start:"top 85%"`. Use honest units: "BHD 18,420 payroll run", "2 min to approve".

### 7. "Live" heartbeat micro-updates (Linear, Vercel deploy logs)
- **What:** After entrance, a small element keeps quietly changing: a new row slides into an activity feed every 4 to 6s.
- **Why:** The page feels inhabited. One moving thing beats ten glowing things.
- **Build:** `setInterval` (paused via `document.visibilitychange` + IntersectionObserver) pushes a fake event ("Fatima clocked in, Manama office") into a 4-row list; new row `y:-8, autoAlpha:0 -> 0`. Mint `.label-pulse` dot only here. Cap at one heartbeat per viewport.

### 8. Bento grid where every tile is a tiny working UI (Vercel, Raycast, Apple "Highlights")
- **What:** Each bento cell holds a micro-interaction, not an icon + paragraph.
- **Why:** Six tiny proofs in one glance; the grid reads as capability, not filler.
- **Build:** Tiles: leave balance ring (SVG `stroke-dashoffset`), shift calendar with draggable chip, GOSI/PASI contribution line, doc expiry list (CPR, visa, passport) with a "3 days" warning chip, payslip PDF preview that unfolds on hover, Arabic/English toggle that flips the tile `dir`. Entrance stagger 0.1s, `once:true`. Hover effects are CSS only.

### 9. Command palette you can actually press (Raycast, Linear `Cmd K`)
- **What:** The page tells you a shortcut and it works on the page itself.
- **Why:** Developers and power buyers get a private "oh nice" moment; it proves speed.
- **Build:** Small hint "Press / to search the demo". Opens an overlay with fuzzy list ("Approve Sara's leave", "Run November payroll", "Who's off tomorrow?"); choosing one jumps the main demo to that scene (calls `tl.seek(label)`). On touch, a visible "Search" pill opens it. 2 KB of code, no library.

### 10. Before / after toggle: "the spreadsheet vs RAL HR" (Ramp "Systems that never spoke")
- **What:** Ramp contrasts a broken multi-tool flight reimbursement with the one-step Ramp flow.
- **Why:** Pain made visible is more persuasive than benefits listed. Every SMB founder has the WhatsApp-group-plus-Excel leave process.
- **Build:** Toggle "Today / With RAL HR". Today = a messy Excel grid + WhatsApp bubbles ("Can I take Thursday?", "Check with Ali") + a red "3 days" timer. With = single approval card, "approved in 40s". Crossfade + the timer number tweens down. Real Bahraini context in the copy.

### 11. Ask-it-anything typed answer (Attio "Forecast revenue", Raycast AI chat)
- **What:** A natural-language question types itself and the answer renders as a table or chart.
- **Why:** Shows intelligence without the word "AI" plastered everywhere.
- **Build:** Pre-scripted Q&A chips: "Who has leave left over 20 days?", "Payroll cost by branch". Chip click -> question types (`ease:"none"`, 28ms/char), 3 skeleton rows shimmer 0.6s, then result rows stagger in. All canned, deterministic.

### 12. ROI / time-back calculator with one slider (Ramp savings, Deel cost calculators)
- **What:** Drag employee count, see hours and BHD saved per month.
- **Why:** Gives the founder their own number to repeat to a co-founder, and it feeds the inquiry form.
- **Build:** Single `<input type=range>` (5 to 500 staff) styled with CSS vars. Formula on-screen and honest ("~12 min admin per employee per month saved"). Number tween 0.3s on change. "Use these numbers in my enquiry" link carries `?staff=40` to the inquiry page.

### 13. Product chrome that is quiet and exact (Linear, Mercury)
- **What:** The mockup UI uses real density: 13px text, 1px hairlines, muted icons, true table alignment. Mercury avoids banking jargon ("Product", not "Checking Accounts").
- **Why:** Fake-looking UI (huge rounded cards, lorem ipsum) is the instant tell of a template.
- **Build:** Demo uses `--color-surface` panels, `--color-border` hairlines, Inter 13/12px, lavender secondary text. Real GCC names, real BHD, real holidays (National Day 16 Dec). One violet accent per screen.

### 14. Serif accent words in a sans headline (Stripe Sessions, Attio, editorial SaaS 2025)
- **What:** One or two words of the headline swap to an italic serif.
- **Why:** Instant warmth and authorship; kills the "generic dev shop" feel without adding effects.
- **Build:** `<em class="serif">` with Newsreader italic 400, same size, `letter-spacing:-0.01em`. Use once per page section max. E.g. "HR that runs itself, *so you can run the company*."

### 15. Founder note in the product page (Linear "Method", Basecamp-style letters)
- **What:** A short signed note from the builder explaining why it exists.
- **Why:** Fits "warm, founder-led"; enterprise buyers trust a named human behind the software.
- **Build:** Newsreader body 19px, max 62ch, signature line "Suhaib, RAL Technologies, Manama". Fade-up once. No photo grid, no quotes carousel.

### 16. Inquiry flow that feels like a conversation and ends in WhatsApp (Typeform pacing, Cal.com routing)
- **What:** 4 one-tap questions, each on its own screen, then a preview of the exact WhatsApp message before sending.
- **Why:** Preview-before-send is the trust move: no black-box form, the visitor sees what we will read. Multi-step + a qualifying question is backed by CXL (+20%).
- **Build:** Steps: team size (chips: 1-10 / 11-50 / 51-200 / 200+), what hurts most (multi-select: leave, payroll, attendance, documents, hiring), timeline (this month / this quarter / exploring), name + company (one text step). Progress as "2 of 4", back keeps answers (state in one `useReducer`, mirrored to `sessionStorage` in try/catch). Final screen renders a chat-bubble preview, then a big "Send on WhatsApp" button: `https://wa.me/97338218181?text=${encodeURIComponent(msg)}`. Slide transitions `x:24 -> 0`, 0.4s `expo.out`. Enter key advances. No email field required.

## Recommended architecture: product page (`/hr`)
| # | Section | Centrepiece | Patterns |
|---|---|---|---|
| 1 | Hero | Headline with serif accent left; live mini-app right (leave request you can submit) + ghost-cursor loop when idle | 1, 2, 3, 14 |
| 2 | Proof strip | 3 counted stats + "built in Bahrain" line (no fake logo wall) | 6 |
| 3 | Before / after | "Today vs With RAL HR" toggle | 10 |
| 4 | **The demo** (centrepiece) | Full simulated app in device frame: story tabs 01 to 05, device switcher, `/` palette, live feed | 2, 3, 4, 5, 7, 9 |
| 5 | Bento of micro-UIs | 6 working tiles (GCC compliance, bilingual, docs expiry) | 8 |
| 6 | Ask it | Canned NL questions -> tables | 11 |
| 7 | Time-back calculator | One slider, feeds inquiry | 12 |
| 8 | Founder note | Signed Newsreader letter | 15 |
| 9 | Pricing hint + FAQ | "From BHD X / employee", 5 honest FAQs (data residency, Arabic, PASI/GOSI, migration from Excel) | |
| 10 | Closing CTA | "Talk to us on WhatsApp" -> `/hr/enquire` | |

## Recommended architecture: inquiry page (`/hr/enquire`)
| # | Screen | Notes |
|---|---|---|
| 0 | Intro | "4 quick taps, then you'll see the message before it's sent." Prefills staff count from calculator param |
| 1 to 4 | Questions | One per screen, chips over typing, back keeps answers, "2 of 4" |
| 5 | Preview | Chat bubble with the composed message, editable textarea, "Send on WhatsApp" |
| 6 | After send | "Opened WhatsApp. Didn't open? Copy message / email info@raltech.dev" fallback |

Example prefilled message: `Hi RAL, I'm Ahmed from Gulf Logistics (40 staff). Biggest pain: leave + payroll. Looking to start this quarter. Saw RAL HR on raltech.dev.`

## Performance rules for weak phones
- Demo timelines only run while in view (IntersectionObserver) and tab visible; pause otherwise.
- Animate only `transform` and `opacity` (plus the one device-frame size tween, done while content is hidden).
- No `backdrop-filter` on scrolling elements; no big blurred radial glows inside the demo.
- Lazy-mount the demo module (`React.lazy`) when the section is 1 viewport away.
- `prefers-reduced-motion` and the site's weak-device tier: ghost cursor jumps instead of glides, heartbeat off, counters show final value.

## Don'ts (what would make it look templated)
- Hero screenshot in a tilted perspective frame with a purple glow behind it.
- "Trusted by" grey logo wall of companies that are not customers.
- Three icon cards ("Fast. Secure. Scalable.") with one-line blurbs.
- Lorem ipsum or "John Doe" in the demo; USD prices; American holidays.
- Gradient text on every headline; glassmorphism cards stacked on glow blobs.
- "AI-powered", "revolutionise", "seamless", "next-gen" in copy; sparkle icons.
- Autoplay video with a play button overlay instead of a DOM demo.
- Testimonial carousel with stock headshots and 5 gold stars.
- Scroll-jacked or pinned storytelling (also banned by our rules).
- A one-page "Contact us" form with 9 fields and a reCAPTCHA.
- Animating everything on entrance; if every block fades up, nothing feels alive. Reserve motion for the demo and the numbers.
- Pricing tables with three columns and a "Most popular" ribbon before the visitor has seen the product.

## Round 2

Research date: 2026-11-07. Goes deeper on craft, data clarity, devices, delight and GSAP technique. Nothing here repeats round 1's 16 patterns; where it touches one, it adds the missing build detail. Sources: Frontend Masters (glow hover, grainy gradients), Codrops (Evervault mask hover; free GSAP plugin demos, May 2025; stagger tips, Sept 2025), Emil Kowalski ("Building a toast component", "CSS transforms"), Bejamas + Ryan Mulligan (`@property` borders), GSAP docs (SplitText 3.13, Flip, matchMedia, quickTo), Webflow "GSAP becomes free" (30 Apr 2025), web.dev (lazy-loading video, content-visibility), Stephen Few / Perceptual Edge (bullet graph spec), CSS-Tricks (SVG donut), devices.css repos, Linear redesign posts.

### A. Visual craft that reads "expensive"

**A1. Film grain over the violet atmosphere** (Linear site, Frontend Masters "Grainy Gradients")
- Why: grain kills gradient banding on dark violet (very visible on cheap phone panels) and feels printed and physical. Texture, not another glow.
- Build: one fixed `::before` on the page wrapper with an inline SVG tile, painted once.
```css
.hr-page::before{content:"";position:fixed;inset:0;pointer-events:none;z-index:1;opacity:.07;
  background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");}
```
- Rules: `numOctaves` 3 max; a 160px tile, never a full-screen live filter; no `mix-blend-mode` on the weak tier (plain opacity is enough on near-black).

**A2. Hairline gradient borders lit from one edge** (Vercel/Linear cards, Bejamas guide)
- Why: a 1px border brighter at the top-left reads as a lit physical edge. Far calmer and cheaper than a glow.
```css
.edge{position:relative;border-radius:16px;background:var(--color-surface)}
.edge::after{content:"";position:absolute;inset:0;border-radius:inherit;padding:1px;pointer-events:none;
  background:linear-gradient(160deg,rgba(209,196,233,.35),rgba(209,196,233,.06) 40%,transparent 70%);
  -webkit-mask:linear-gradient(#000 0 0) content-box,linear-gradient(#000 0 0);
  -webkit-mask-composite:xor;mask-composite:exclude;}
```
- Variant, on the demo frame only: `@property --a{syntax:'<angle>';inherits:false;initial-value:0deg}` + `conic-gradient(from var(--a),transparent 80%,#a78bfa,transparent)` animated over 8s = a slow "border beam". `@property` must sit outside any `@layer`. Paused off-screen.

**A3. Spotlight cards: one listener, many cards** (Frontend Masters glow hover, Codrops Evervault mask)
- Why: surface and border brighten exactly under the pointer; the grid feels lit by the visitor.
- Build: one `pointermove` on the grid writes `--x/--y` per card; cache card rects on grid `pointerenter` and resize, not per move. Card `::before` = `radial-gradient(240px circle at var(--x) var(--y),rgba(180,80,255,.14),transparent 60%)`; the A2 border layer gets the same radial mask so the edge lights too. Opacity fade 300ms. Gate with `@media (hover:hover) and (pointer:fine)`; touch keeps the static A2 edge.

**A4. Typography scale moments** (Apple product pages, Stripe Sessions, Vercel Ship)
- Why: one giant numeral per section is the cheapest drama there is. Expensive pages alternate dense UI with one huge, quiet statement.
- Build: `font-size:clamp(96px,18vw,240px);font-weight:300;letter-spacing:-.05em;line-height:.85;font-variant-numeric:tabular-nums lining-nums`. Fill `background:linear-gradient(180deg,#f8f8f8 30%,rgba(209,196,233,.2));-webkit-background-clip:text;color:transparent` so it dissolves into the page. Beside it a 20px Newsreader italic aside. Max 3 per page. Section index "01 to 05" as 12px eyebrows gives an editorial spine.

**A5. Section transitions without pinning** (Linear, Raycast)
- Blend `--color-bg` into `--color-surface` with a 160px gradient band; divider hairlines get `mask-image:linear-gradient(90deg,transparent,#000 30% 70%,transparent)` so they dissolve at both ends.
- One static "horizon" per transition: `radial-gradient(50% 100% at 50% 0,rgba(180,80,255,.18),transparent)`, 240px tall at the top of the next section.
- Glass on exactly one element (sticky "Talk to us" pill): `backdrop-filter:blur(12px) saturate(140%)` over `rgba(22,14,39,.6)`. Weak tier: solid surface.

### B. Data readable in 2 seconds

**B1. KPI tile anatomy** (Few, "Information Dashboard Design"; KPI card guides)
- Top to bottom: label (12px lavender) / number (32px tabular, unit inside: "BHD 18,420") / context ("+3 vs Oct") / sparkline. The number answers "what", the sparkline answers "is this normal".
- Max 4 tiles. Colour means something or it is grey: violet = selected, mint = good/live, amber `#f5b95c` = needs action. Red only for overdue.

**B2. Pure SVG micro-charts** (CSS-Tricks donut, Perceptual Edge bullet graph spec)
- Sparkline: `viewBox="0 0 100 24" preserveAspectRatio="none"`, one `<polyline vector-effect="non-scaling-stroke">`, a dot on the last point, area fill 0 to 20% violet. Draw-on: `pathLength="1"`, `stroke-dasharray:1;stroke-dashoffset:1`, GSAP to 0 in 1.2s `expo.out`.
- Donut (payroll split): `r="15.9155"` so circumference = 100 and dasharray = percent (`"62 38"`); dashoffset = running total; `rotate(-90deg)` to start at 12; subtract 1 per dash for gaps; total in the centre. Max 4 segments: Basic / Allowances / GOSI-PASI / Overtime.
- Bullet graph for "leave used vs entitlement": 6px bar over 2 grey ranges + 2px target tick, 40px tall instead of a gauge.
- Bars are `<div>`s with `transform:scaleX(v);transform-origin:left` so they animate on the compositor.

**B3. Payroll as a waterfall** (Ramp/Mercury statements)
- Gross, minus GOSI/PASI, minus deductions, equals Net: 4 bars, each starting where the last ended. Bars grow in sequence (stagger 0.12s); Net counts up last and gets the only violet fill.

**B4. Attendance heatmap** (GitHub contributions grid)
- 5 weeks x 7 days, Sun to Thu active, Fri/Sat dimmed (GCC week). 10px cells, `gap:3px`, 4 opacity steps of `#a78bfa` (.15/.35/.6/.9). 16 to 17 Dec dotted outline + tooltip. Entrance: `stagger:{each:.008,grid:[7,5],from:"start"}` gives a diagonal wash.

**B5. Org chart that stays readable**
- 3 levels, max 4 nodes per row; node = 28px initials avatar + name + 12px role. Connectors: one SVG layer of elbow paths (`M x y V mid H x2 V y2`). Hover a node: its reporting line brightens, everything else drops to 40% (focus by dimming, not glowing).

### C. Devices and video without 3D

**C1. CSS-only frames** (picturepan2 and amjulash devices.css, css-device-mockups)
- Laptop: screen with `border:10px solid #1a1226;border-radius:14px 14px 0 0` + a 112%-wide base `height:12px;border-radius:0 0 12px 12px;background:linear-gradient(#2b1b3d,#160e27)` with a notch `::after`. Phone: `border-radius:44px;border:9px solid #120b1f;box-shadow:inset 0 0 0 1px rgba(209,196,233,.12)` + 90x24 island. Flat, no fake reflections. Same React demo inside each (round 1 #3 scaling); 1 to 2 KB CSS per frame.

**C2. Device morph with GSAP Flip** (GSAP Flip docs; every plugin is free and on npm since v3.13, 30 Apr 2025, `import { Flip } from "gsap/Flip"`)
- Upgrade over hand-tweening width/height (round 1 #5): `const s = Flip.getState(".frame,.sidebar,.tabbar")`, set `data-device`, then `Flip.from(s,{duration:.6,ease:"expo.out",nested:true,absolute:".sidebar"})`. Transform-based, so it stays on the compositor. In React: capture state before `setDevice`, run `Flip.from` in `useLayoutEffect`, pass fresh nodes as `targets` (React may recreate them).

**C3. Marketing video, presented properly** (web.dev lazy-loading video)
- Never the hero (the DOM demo owns it). A "60-second tour" block lower down.
- `<video muted playsinline loop preload="none" poster="tour.avif">`, poster = a real frame. IntersectionObserver at 50%: set `src`, `load()`, `play()`; pause on exit; no autoplay on weak tier or `navigator.connection.saveData`.
- Custom play button: 72px circle, `rgba(22,14,39,.7)` + A2 edge, triangle nudged 2px right optically. Click: unmute, show controls, button `scale:.9, autoAlpha:0`.
- Chapters: `<track kind="chapters" src="tour.vtt">`; build chip buttons from `video.textTracks` cues ("Leave", "Payroll", "Attendance", "Docs"); `cuechange` highlights the active chip. Browsers mostly ignore chapter tracks in native UI, so the chips are the UI.

### D. Micro-interactions and delight (no sound, no confetti)

**D1. Magnetic CTA, restrained** (GSAP `quickTo`)
- Only the main "Talk to us" button. `const xTo = gsap.quickTo(el,"x",{duration:.5,ease:"power3.out"})` created once (same for y); on move `xTo(clamp((e.clientX-cx)*.25, -8, 8))`; label moves 1.5x for depth; on leave `gsap.to(el,{x:0,y:0,ease:"elastic.out(1,.4)",duration:.8})`. Fine pointer only.

**D2. Cursor-reactive ambient light**
- The 600px violet light behind the demo follows the pointer at 10% of its travel via `quickTo` (2s `power3.out`): it drifts, never chases. One element, transform only.

**D3. Toast choreography** (Emil Kowalski, Sonner)
- Stack of max 3: older toasts `translateY(calc(-14px * i)) scale(calc(1 - .05 * i))`; enter from `translateY(100%)` via a 400ms CSS transition (interruptible, unlike keyframes); hover expands to full heights; 4s auto-dismiss, timer pauses on hover and `visibilitychange`. Never animate from `scale(0)`; start at .9 + opacity.

**D4. Celebration without confetti**
- "Run payroll" done: label slides `yPercent:-100` out, a mint check draws on (`strokeDashoffset`), the button Flips into a 44px circle, the related KPI ticks over with a one-off lavender border flash. 0.8s total, then a D3 toast.

**D5. Feedback that replaces sound**
- Press `scale(.97)` in 80ms, release 200ms `back.out(2)`. Toggle: knob travels, track colour lags 60ms. Copy WhatsApp number: icon swaps to a check for 1.5s. Everything in the demo answers within 100ms.

### E. GSAP technique, non-pinned

**E1. SplitText is free: use it, do not hand-roll** (GSAP 3.13 docs, Codrops May 2025)
- `SplitText.create(h,{type:"lines,words",mask:"lines",autoSplit:true,onSplit:(s)=>gsap.from(s.lines,{yPercent:110,duration:1,ease:"expo.out",stagger:.12})})`. `mask:"lines"` adds clip wrappers; `autoSplit` re-splits after font load and resize, and returning the tween from `onSplit` keeps it synced; `aria:"auto"` keeps it readable to screen readers. Await `document.fonts.ready` first.
- Headings only, 3 to 4 per page. Body copy gets a plain `autoAlpha` fade.

**E2. Stagger choreography** (Codrops stagger tips)
- Grids: `stagger:{each:.06,grid:"auto",from:"center"}` reads as "assembling"; lists `from:"start"`. Any group's entrance under 0.9s.
- Overlap, never queue: next group at `"<0.15"` in the timeline.
- One verb per element type, page-wide: headings rise, numbers count, charts draw, tiles fade.

**E3. Reduced motion + weak tier in one place** (`gsap.matchMedia`)
```ts
const mm = gsap.matchMedia();
mm.add({ full: "(prefers-reduced-motion: no-preference)", reduce: "(prefers-reduced-motion: reduce)" }, (ctx) => {
  if (ctx.conditions!.reduce || weakTier) { gsap.set(".rv", { autoAlpha: 1 }); return; } // final state, no motion
  /* full choreography */
});
// inside useGSAP, so it all reverts on unmount
```

**E4. Weak-phone performance**
- `transform` + `opacity` only; small SVG `strokeDashoffset` draws are fine.
- `content-visibility:auto;contain-intrinsic-size:auto 900px` on sections below the demo (web.dev saw 232ms to 30ms render). Call `ScrollTrigger.refresh()` after fonts load and after lazy sections mount.
- One shared IntersectionObserver pauses every loop (border beam, heartbeat, ghost cursor, video) out of view.
- `will-change` only during a tween (add `onStart`, remove `onComplete`).

## Signature moments (what people should remember)
1. **The first 2 seconds:** the headline rises line by line out of masked lines, and the dashboard's 4 KPI tiles count up while their sparklines draw on, inside a flat dark laptop frame with a lit hairline edge.
2. **"Run payroll":** waterfall bars cascade from Gross to Net, the button morphs into a mint check, and a stacked toast lands: "November payroll approved, 40 people, BHD 18,420".
3. **The device morph:** tap Phone and the live demo Flip-morphs from laptop to phone in 0.6s, the sidebar folding into a bottom tab bar, still working.
4. **The giant numeral:** "4 min" at 240px dissolving into the page, with a Newsreader italic aside: *to pay 40 people, GOSI included*.
5. **The lit grid:** the pointer moves across the bento and each card's edge and surface brighten under it like a torch over the GCC-only features (CPR expiry, Arabic toggle, PASI line).
