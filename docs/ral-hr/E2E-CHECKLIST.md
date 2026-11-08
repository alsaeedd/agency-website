# RAL HR end-to-end checklist

Local run: `npm run build && npx vite preview --port 4673`, Playwright. Status: PASS, FAIL, TODO (not yet run).
Round 1 ran the interactions at 1440 only (EN, plus the demo in AR). The 768 and 390 sweeps are still TODO.

## Video tour (/ral-hr/)
| Item | 1440 | 768 | 390 |
|---|---|---|---|
| Box ratio equals video ratio (0.5625), object-fit contain, no crop | PASS | PASS | PASS |
| Play / Sound controls sit below the video, never over burned-in text | PASS | PASS | PASS |
| Seek to 0, 4, 15, 40, 55 and 70 s: full frame visible, no page errors | PASS | PASS | PASS |
| Poster equals frame 0 (extracted from the same encode) | PASS | PASS | PASS |
| No horizontal scroll | PASS | PASS | PASS |

## Home (/)
| Item | Result |
|---|---|
| Hero "New · RAL HR" pill scrolls to #ral-hr (top 81 px, below the navbar) | PASS |
| EN / عربي toggle in the home section switches to RTL | PASS |
| "Take the controls" runs payday, then "Run payday again" appears | PASS |
| "Explore RAL HR" href is /ral-hr/, "Try the live demo" href is /ral-hr/#demo | PASS |
| /ral-hr/#demo lands on the demo (top 88 px) | PASS |

## /ral-hr/
| Item | Result |
|---|---|
| Navbar: Services/About/Clients go to /#..., RAL HR is active (aria-current) | PASS |
| Contact Us opens the modal, Escape closes it and restores scroll | PASS |
| Side section index (8 links, #payday first) | PASS |
| Hero payday take over + Run payday again | PASS |
| Web / Tablet / Phone switch | PASS |
| October calendar day buttons land on their chapter | FAIL: only oct-14 lands (top 88). After 3 s: oct-01 at 1833, oct-09 at 1285, oct-25 at -1583, oct-31 at -3817 |
| Demo tabs Home, People, Payroll, Leave, End of service, Ask RAL render | PASS |
| Payroll: Compute payroll step renders totals | PASS (steps 2 to 4, IBAN fix, WPS: TODO) |
| People + payslip | TODO |
| Leave approve / decline updates the balance | TODO (test selector timed out, not yet triaged) |
| End of service: slider and person switch change the figures | PASS |
| Ask RAL EN + AR chips and a typed question | TODO (typed input selector timed out) |
| Demo in Arabic: all 6 tabs, dir=rtl, no clipped leaf text at 1440 | PASS |
| Pricing: 135 people x BD 1/2/3 = 135/270/405, yearly = x12, plan cards match | PASS (no minimums exist in data.ts) |
| Closing CTA wa.me/97366386602 text reflects team, plan and monthly total | PASS |
| Email mailto with subject "RAL HR demo, team of N" | PASS |
| FAQ open / close (first item open by default) | PASS |
| Footer links (pages, mailto, wa.me, socials) | PASS |
| Zero console / page errors in all runs so far | PASS |

## /ral-hr/inquire/
| Item | Result |
|---|---|
| Full flow through to the WhatsApp link + email fallback | TODO |

## Layout sweeps (768, 390; EN + AR)
| Item | Result |
|---|---|
| No horizontal scroll, no clipped or overlapping text, nothing under the floating contact button or navbar | TODO |
