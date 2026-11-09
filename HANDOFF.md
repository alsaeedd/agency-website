# HANDOFF: fix/ralhr-uiux-ar (RAL HR UI/UX, Arabic mobile)

## Done (committed)
- Removed every "soon" / "Coming soon" / "قريباً" from RAL HR (grep is clean). Former soon modules now use internal status `next`: no badge, no dashed style, no legend entry, no "(coming soon)" suffix in WhatsApp messages.
- Removed the `hp-plan-soon` tag in the plan feature lists.
- "Documents expiring" in AR is now "وثائق تقترب من الانتهاء". The inquiry fallback "hoping to start soon" is now translated ("shortly").
- Physical CSS changed to logical (text-align start, margin/padding/border-inline, inset-inline-end) in Inquire.css, ModulePicker.css and RalHrPage.css, so the picker, inquiry options, proof row, app notes and pricing numbers line up in RTL.
- Module picker cards: the text now aligns to the start in Arabic (it used to be ragged, left-aligned).
- `.hp-fine-chev` arrow now mirrors in RTL.
- Month.tsx: the end-of-service amounts use `t('BD {0}')` (shows د.ب in AR), and the "Checking…" button label is translated.
- The "+N more" count in the plan lists is wrapped in `<bdi>` so the plus sign stays with the number.
- Checked on AR mobile at 390px: plan pick, the modules picker (select and deselect, Selfie check-in shows no badge), the team slider plus a custom number (250), and Book a demo (wa.me/97338218181 with a fully Arabic message). 0 console errors, no horizontal scroll on all 4 pages.

## Left / not done
- The 1440x900 desktop pass and the EN screenshot pass were not done (only audited: no overflow, no errors).
- The AR inquire flow was not clicked through step by step (only screenshotted).
- The app tour video poster (/assets/ral-hr/ralhr-tour-poster.webp, plus the mp4) is English only. It needs an Arabic asset.
- Shared footer (not RAL HR scope): footer nav links are text-align left on /ar pages, and the contact arrows are not mirrored. This is for the other agent.
- The Ask RAL chip "abi shahadat ratib lil bank" (Arabizi) is shown as-is; it looks intentional.
