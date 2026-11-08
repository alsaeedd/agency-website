# RAL HR polish round 3: HANDOFF (branch feature/home-ral-hr)

## Done this round
- Merged feature/ral-hr-integrated (rebuilt demo: Demo.tsx/.css, screens.tsx, charts.tsx, data.ts).
- Demo money figures fit at every size, EN and AR: KPI cards and payroll summary use container queries (`container-type: inline-size`, font in `cqi`, tabular nums); modal value is fluid. Audited all 8 or 9 demo tabs at 1440/768/390 in Arabic: no clipped or touching figures.
- ContactCircle hides (opacity + visibility) while the demo is on screen (`html.hp-demo-in`, set by an IntersectionObserver in DemoSlot).
- Month: new "October 2026" calendar strip under the heading; the 5 chapter days are lit and jump to `#oct-01` and so on, Payday is the bright cell. 7-column calendar under 860 px.
- Rules: machined double-bezel rate card, 18% cell is the glowing hero, Arabic watermark on the last cell.
- App: phone sits in concentric orbit rings; at 1024+ the three pings hang off both sides with hairline connectors.
- Pricing: double-bezel panels, grid-paper output panel, label now "40 people × BD 2, Professional", plans are one connected strip with the chosen plan lifted.
- FAQ: two columns at 1024+ (sticky heading left, answer panels right), open item glows, round number badges.
- Dead CSS removed: old home card rules in RalHrHome.css (13.8 KB to 7.3 KB), `.hp-steps`, `.hp-wa-send`, `.hp-wa-alt`.

## Verified
- `npm run build` green incl. prerender. Zero console errors on /, /ral-hr/, /ral-hr/inquire/. No horizontal scroll at 1440/768/390.
- Diff has zero em dashes and zero "Suhaib".
- TBT (Playwright, 4x CPU, 390 px, long tasks after FCP, 3 runs): home 189/180/199 ms vs live raltech.dev 290/256/238 (no regression); /ral-hr/ 194/188/197 ms.
- Screenshots (session scratchpad): demo-home-1440-en/ar, month-1440, month-390, pricing-1440, app-1440, rules-1440, faq-1440.

## Left
1. /ral-hr/ TBT is about 190 ms, over the 150 ms target. Suspects: the hero Payday timeline (about 20 React updates) and the idle mount of every section at once. Try mounting Month/Rules/App/Pricing/FAQ in two idle slots, or content-visibility on below-fold sections.
2. web-design-guidelines review not run (budget). Run on RalHrPage, Demo, RalHrHome.
3. Pricing, app, rules, faq 1440 screenshots taken but only pricing and month were looked at. Eyeball app (ping positions vs phone) and FAQ sticky heading. Pricing odometer had a dark box behind the digits from a text-shadow; shadow removed, not re-shot.
4. Demo audit flags `.dv-story` sitting outside the `.dv` box at 768/390 (likely the intended caption rail). Confirm visually.
5. Fixed navbar shows the hero proof strip through it on scroll (pre-existing, nav background is transparent there).
