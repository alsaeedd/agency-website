# Handoff: RAL HR on the home page

Branch: `feature/home-ral-hr` (not pushed, not merged, not deployed).

## Done
- `src/components/RalHrHome.tsx` + `.css`: new section `#ral-hr`, placed after Portfolio
  (client work, then "our own product", then the working-with-us Interlude, then CTA).
  - Double-bezel panel, copy left (eyebrow "Our own product", headline, intro, 4 facts,
    "From BD 1 per employee a month", CTAs "Explore RAL HR" -> /ral-hr/,
    "Try the live demo" -> /ral-hr/#demo), live payroll run card right.
  - Card: November 2026 sample run, 98 staff, gross 72,486.000, employee SIO 2,941.380,
    net 69,544.620 BHD, steps bar, WPS "98 of 98 rows pass LMRA checks", Approved stamp,
    phone lock screen with "Payslip ready" notification. Labelled "Sample run with demo
    company data". "Run it again" replays.
  - Markup renders the final state (SSR/no-JS correct). GSAP timeline + ScrollTriggers are
    built only when an IntersectionObserver sees the section (25% viewport ahead): zero
    load-time work. Once-only, expo.out, stagger 0.12-0.14. Weak tier: shorter, no blur
    (via `isWeakDevice` / `revealUp`). Reduced motion: no animation, replay hidden.
  - At <=1100px the copy wrapper is `display: contents` so the card sits right under the
    intro (facts and offer follow).
- Hero: the "Bahrain, GMT+3, currently building" chip is now a link pill
  "New | RAL HR, HR and payroll for Bahrain ->" (short tail at <=480px). Click smooth-scrolls
  (Lenis) to `#ral-hr` through App's `scrollToSection`; href `#ral-hr` without JS.
  `HeroStatus` is no longer imported by Hero (file kept).
- No quotes, testimonials or named people (owner order).

## Verified
- `npm run build` (tsc, client, SSR, prerender) passes; prerendered dist/index.html has the section.
- Playwright on preview at 1440, 768, 390: no horizontal overflow, no page errors, pill click
  lands the section at 80px, stamp and notification finish. No test suite exists in the repo.
- web-design-guidelines pass applied (nbsp in BD amounts, text-wrap balance, touch-action,
  phone mock is role=img with a label).

## Left / ideas
- Owner review of copy and placement; merge to staging, then main with `--no-ff` after fetch.
- Live-browser check after deploy (Cloudflare edge scripts, per memory).
