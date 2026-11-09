# HANDOFF: fix/ralhr-uiux-ar2 (RAL HR UI/UX, round 2)

Builds on fix/ralhr-uiux-ar (7312b70, 99321aa). See that branch's HANDOFF for round 1.

## Done (committed)
- Emoji hunt: src/components/ralhr has NO real emoji in code. Only text glyphs (check marks, CTA arrows, the Payday "run again" arrow). The emoji the owner saw are baked into the English app tour video/poster (hourglass, clock, alert icons, English payroll screen) shown in the "In every pocket / iOS & Android" phone.
- Arabic pages now show a still of the Arabic payroll screen in that phone (public/assets/ral-hr/ralhr-tour-poster-ar.jpg, 686x1220, captured from the AR hero demo). The English video and its Play/Sound buttons are not rendered on AR. EN is unchanged.
- Pricing on AR: the plan price chip now reads "2 د.ب" (number first) and the big total reads "80 د.ب شهريًا" right to left (number, currency, period), so "شهريًا" no longer sits against the number. Equation order is people x price = total.
- `grep -rniE "soon|قريب" src/components/ralhr` is empty.
- AR mobile 390: 0 console errors, no horizontal scroll on /ar/ral-hr/.

## Left / not done
- Proper Arabic app tour video (record one from the AR demo in phone mode) to replace the still on AR.
- Desktop 1440x900 section-by-section visual pass of all 4 pages (AR + EN) not done.
- AR inquire flow automated click-through stalled: the Next button is disabled on a step that needs text input (name/company). Needs a manual run filling the fields, then check the wa.me/97338218181 Arabic message at 390 and 1440.
- The "Payslip ready" ping on AR shows two near-identical Arabic lines (title + hardcoded Arabic subtitle). Consider a different AR subtitle.
- Shared footer RTL issues (other agent).
