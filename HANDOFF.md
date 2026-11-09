# HANDOFF: fix/ralhr-uiux-ar3 (RAL HR UI/UX, round 3)

Builds on fix/ralhr-uiux-ar2 (2549699). See earlier branches' HANDOFF for rounds 1 and 2.

## Done (committed)
- Payslip ready ping on AR: subline is now "صافي 922.760 د.ب، أُرسل إلى بنكك" (EN keeps the Arabic proof line).
- Inquire WhatsApp message is fully Arabic on AR (was English template literals). Module list uses Arabic comma on AR (inquire + pricing card message).
- Inquire plan step on AR: plan line, feature list, "BD x", per-plan estimate, live total sum, "starts at" note, fit badge now translated.
- Bug: the "Cheapest for your picks" badge and plan preselect never worked on AR (tierName returned the Arabic name, compared with the English id). Now uses PRICING[...].name.
- Untranslated "Ready" count, headcount placeholder "About N", progress aria-label: now t().
- RTL hover on CTA arrow circle undid the mirror (rotate overrode scaleX). Added RTL hover rule in RalHrPage.css.
- Verified (vite preview, Playwright): AR inquire at 390 and 1440 and EN at 390, all 5 steps, validation messages Arabic, inputs rtl, step indicator right to left, Back on right / Next on left with mirrored arrow, module select/deselect (2 on), custom headcount 37, href wa.me/97338218181 with Arabic text.
- 0 console errors, no horizontal scroll, no offscreen text on all 4 pages at 390 and 1440.
- 1440 section pass AR + EN looked fine (sheets in scratchpad r3-ar1440a/b, r3-en1440a/b, r3-ar390a/b).
- `grep -rniE "soon|قريب" src/components/ralhr` empty.

## Left / not done
- Arabic app tour video (still image on AR for now).
- EN 1440 and AR 390 contact sheets were generated but not reviewed closely (budget).
- Shared footer RTL issues (other agent).
