# RAL HR integrated rebuild: HANDOFF (branch feature/ral-hr-integrated)

## Done
- /ral-hr/ and /ral-hr/inquire/ now sit inside the main site chrome: `src/components/ralhr/SiteChrome.tsx` (real Navbar with `linkBase="/"`, `activeHref="/ral-hr/"`, `showAtTop`; Footer, Contact modal, ContactCircle, CursorFollower on fine pointers, NavLoader, Lenis, bg-blobs). The product page's own top menu is deleted.
- Navbar: 3 optional props (linkBase, activeHref, showAtTop) that change nothing when left out, plus CSS for the active-link dot. Home page behaves as before.
- New hero `Payday.tsx`: a real HTML app window that runs a Bahrain payday on its own (8 staff stream in, gross/SIO/net counters, steps, Approved stamp, WPS rows, phone notification). "Take the controls", then click any row to see that person's payslip. EN/عربي flips the app to RTL. Web/Tablet/Phone FLIP morph (desktop only). Layout uses container queries.
- `Month.tsx`: "October at a Bahrain company", 5 chapters, each with a live mini UI (CPR/IBAN checks + SIO by nationality, approving leave on a phone, Ask RAL chat in Arabic/English/Arabizi, WPS 10-column check, end of service slider).
- Rules strip (8%, 1%+3%, 18% ladder, 10/10, عربي), app video, pricing (slider, odometer roll, 3 plans), FAQ (details). The closing payoff is a WhatsApp composer, prefilled from the pricing headcount plus topic chips, going to wa.me/97366386602, with a form link to /ral-hr/inquire/.
- Founder note and the "Suhaib" quote are fully removed (JSX, GSAP, CSS). The inquiry `.iq` base CSS moved into Inquire.css.
- SSR prerender wraps both pages in SiteChrome (entry-server.tsx). Build is green.

## Verified
- `npm run build` exit 0, prerender ok. Playwright at 1440 + 390: no console errors, no horizontal overflow. Arabic + tablet morph screenshot looks right.
- Last fixes (hero word spacing, tighter hero, section index tracking, RTL minus signs) are built but NOT re-screenshotted.

## Left (next agent)
1. Full Demo (Demo.tsx/screens.tsx) is only restyled dark through CSS vars. The owner wants it to be the centrepiece with richer Bahrain data: more staff, leave balances that update, payroll totals that flow, an Ask RAL typed answer with a mini chart, smoother screen transitions. Screenshot the #demo section first.
2. Screenshot 768 and the #demo, #app, #pricing, #talk sections. Check the month numeral size on mobile.
3. Measure TBT (Lighthouse mobile) against the 225 ms target. The hero timeline makes about 20 React state updates.
4. Run the web-design-guidelines review. When merging: main has 0cf33b2 (founder note removal), so take this branch's RalHrPage.tsx/.css whole.
