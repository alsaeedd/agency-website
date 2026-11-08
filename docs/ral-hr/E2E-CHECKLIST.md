# RAL HR end-to-end checklist

Local run: `npm run build && npx vite preview --port 4675`, Playwright. Status: PASS, FAIL, TODO (not yet run).
Rounds 1 and 2 ran the interactions at 1440 (EN, plus the demo in AR). The 768 and 390 layout sweeps (EN + AR) are still TODO.

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
| October calendar day buttons land on their chapter | PASS (round 2 fix): 01, 09, 14, 25, 31 all land at top 88, h3 below the navbar (nav bottom 102, h3 259), from the calendar, from sequential clicks and via keyboard Enter. Root cause: Lenis `anchors` measured from its cached scroll, stale after a native scroll; SiteChrome now resyncs Lenis from window.scrollY before the glide |
| Demo tabs Home, People, Payroll, Leave, End of service, Ask RAL render | PASS |
| Payroll: Compute, Review (5 checks), Approve disabled until IBAN fix, fix gives 98 of 98 IBANs, confirm modal (BD 111,295.000, second approver), Approved stamp, WPS file (WPS_BHF_2026-10.csv, 98 records) | PASS |
| People: search "Rajesh", open profile, payslip 320 + 130 + 30 = 480 gross, SIO 1% -4.800, net BD 475.200 | PASS |
| Leave approve / decline: queue badge, balance, team cover update (decline restores 7 days 19 to 26, cover +1 per day; approve keeps the previewed 18/30 and cover) | PASS (round 1 timeout was the test: non-exact "Approve" matched other buttons) |
| End of service: slider and person switch change the figures | PASS |
| Ask RAL typed questions EN + AR: answer streams in (text grows over ~1 s), SIO gives a table, leave balance and overtime (AR) give mini bars, "who is off" gives a table, AR answers dir=rtl | PASS (round 1 timeout was the test: the input has no type attr). Note: "How much is payroll this month?" gets the generic fallback, there is no payroll total intent (product gap, not a bug) |
| Demo in Arabic: all 6 tabs, dir=rtl, no clipped leaf text at 1440 | PASS |
| Pricing: 135 people x BD 1/2/3 = 135/270/405, yearly = x12, plan cards match | PASS (no minimums exist in data.ts) |
| Closing CTA wa.me/97366386602 text reflects team, plan and monthly total | PASS |
| Email mailto with subject "RAL HR demo, team of N" | PASS |
| FAQ open / close (first item open by default) | PASS |
| Footer links (pages, mailto, wa.me, socials) | PASS |
| Zero console / page errors in all runs so far (rounds 1 and 2) | PASS |

## /ral-hr/inquire/
| Item | Result |
|---|---|
| Full flow: team 135, needs, Professional, timing, name/company/phone. Empty name/company keeps step 5 and flags 2 fields. Message composed (BD 270 a month), WhatsApp link wa.me/97366386602?text=..., opens WhatsApp, CTA becomes "Open WhatsApp again", mailto info@raltech.dev subject "RAL HR demo: Gulf Foods W.L.L.". Answers persist across reloads (draft restore) | PASS |

## Layout sweeps (768, 390; EN + AR)
| Item | Result |
|---|---|
| No horizontal scroll, no clipped or overlapping text, nothing under the floating contact button or navbar | TODO |
