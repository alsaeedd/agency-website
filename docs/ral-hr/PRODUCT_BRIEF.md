# RAL HR: Product Brief (for the marketing page + in-browser demo)

Compiled 2026-11-07 from code and marketing material. Every claim cites its source. Items marked **[CHECK]** are uncertain or conflict between sources: confirm with Suhaib before they go on the page.

## 0. Sources and canonical repo

| Repo | Last commit | Verdict |
|---|---|---|
| `repos/ralhr` | 2026-11-05 | **Canonical.** Java 21 / Spring Boot API, React 19 web, Expo mobile. Remote `revenueautomationlab/ralhr`, live at `hr.raltech.dev` |
| `repos/ralhr-hotfix` | 2026-09-26 | Older copy of the same monorepo (Saudi fixes). Not canonical |
| `repos/ralhr-legacy` | 2026-09-15 | Retired first implementation (read-only, served at legacy.hr.raltech.dev) |
| `repos/ral-hr-frontend`, `ral-hr-backend` | 2026-09-04 | Small separate Node/Vite attendance-correction project. Not RAL HR proper |

Marketing sources: `ral-workspace/clients/ral_hr_sales/sales_guide.html` (Sales Guide v1.1, Nov 2026, also `ral-workspace/.tmp/RAL_HR_Sales_Guide_v1.1.pdf` and page PNGs in `ral-workspace/.tmp/ral_hr_sales_pages/`), `ral-workspace/products/ralhr/deck.py` (enterprise deck), `ralhr/PLAN.md`, `ralhr/docs/01-product-requirements.md`, `ralhr/docs/03-navigation-map.md`.

## 1. Positioning

**One line (sales guide):** "The AI-first HR and payroll platform for Bahrain."
**Deck line:** "HR and payroll for the Gulf. Payroll you can defend line by line, in the country you actually operate in."
**20-second pitch (sales guide):** Problem: payroll in Excel, WPS files rejected, SIO by hand, expiries missed. Outcome: AI answers staff instantly; payroll, WPS, SIO done right. Proof: live demo of a working Bahrain company. Offer: from BD 1 per employee per month.

**Who it is for:** Bahrain SMEs first (PLAN.md section 1), with Egypt and Saudi rule packs. Built in-house in Bahrain by RAL Technologies (CR 196651-1); no open-source HR platform underneath.

**GCC context actually in code:**
| Term | Where |
|---|---|
| LMRA WPS salary file (exact 10-column xlsx, sheet `WPS - Salary File`, split at 1,000 rows, pre-validated) | `apps/api/.../pay/WpsController.java` (headers: CPR/GCC ID, Worker Name, IBAN/Wallet Number, Currency, Fixed Salary, Social Allowance, Variable Salary BHD, Total Amount BHD, Salary Month, Salary Year) |
| SIO (Bahrain social insurance): Bahraini employee 8%, expat employee 1%, expat employer 3%; Bahraini employer ladder 16/17/18/19/20% for 2024 to 2028 | `db/migration/V2__*.sql`, PLAN.md row 23 / docs/22 |
| EOSB / indemnity: new SIO scheme 4.2% / 8.4% monthly for expats from 1 March 2024, plus old Labour Law 36/2012 Art. 116 accrual (15 days/yr first 3 yrs, 30 after) | V2 migration |
| GOSI + Mudad (Saudi), Egypt Law 148/2019 + income tax | `packages/shared/strings.ts`, deck.py |
| CPR (9 digits), LMRA work permit + visa + CPR + passport expiries, IBAN mod-97 check | docs/01 B |
| Bahrainisation % report, Ramadan shift hours, Hajj/iddah leave, 2026 Bahrain holidays (lunar ones "unconfirmed") | docs/01, strings.ts |
| Arabic + English on every string, full RTL, bilingual payslip PDFs | CLAUDE.md rule, strings.ts (EN + AR pairs) |
| Money in fils (3 dp BHD), time rendered Asia/Bahrain | CLAUDE.md |

## 2. Modules

| Module | One line |
|---|---|
| Home | Greeting, next action, KPI tiles per persona, holidays, balances |
| Self service (`/me`) | Leave, payslip PDF, letters, check-in, papers, Ask RAL in one place |
| Ask RAL | Chat assistant over the company's own data: answers, books leave via confirm cards, cites sources, hands off to HR |
| People | Directory, profiles (overview, contact, documents, leave, pay, history), CPR/IBAN checks |
| Org chart | Zoomable tree from reports-to, search, role-scoped |
| Documents | Typed uploads, expiry board with 90/30/7-day alerts |
| Leave | Balance tiles, range-calendar request, team calendar, holidays, 10+ Bahrain leave types with law articles |
| Attendance | Web + mobile GPS check-in with geofence, month KPIs, overtime approval, maker-checker corrections |
| Shifts / rosters | Shift types with grace, half-day threshold, Ramadan variant |
| Payroll | Runs: compute, review warnings, approve (password step-up), WPS check + download, mark paid |
| Payslips | Bilingual PDF, every line cites its rule |
| Requests + approvals | Letters, shift change, advance, expense, document, profile; two-stage chain drawn by name; delegation/out of office |
| HR actions | Promotion, transfer, warning, renewal, exit: auditable, reversible cases |
| Final settlements / exit visas | Exit settlement fils-exact with rule citations |
| Recruitment + careers page, Onboarding, Performance, Learning, Compensation + pay equity, Benefits, Travel, Help desk + grievances, HSE, Fleet, Contractors, Assets, Company wall, Rewards | Phase 25 tracks (PLAN.md row 25, nav labels in strings.ts). **[CHECK]** Fleet + HSE may have been trimmed (`docs/29-trim-fleet-and-hse.md`) |
| Contracts + e-signature, Policies with acknowledgement | Bilingual contracts; who has not acknowledged |
| Reports | Catalogue of cards (headcount, Bahrainisation, payroll register, SIO, EOSB liability, leave, attendance, expiry, turnover, cost by dept), xlsx/csv/pdf in EN or AR |
| Executive dashboard | Company aggregates, no individual pay |
| Import data | Excel migration import with dry run and undo |
| Audit | Append-only trail with field-level diff, legal hold, retention, consent |
| Settings / platform | Company, users + invites, statutory settings as editable rows, modules, billing, invoices |
| Security | Google + Microsoft SSO, Argon2id, per-device sessions, row-level tenant isolation |

### Top 8 selling points (ranked)

| # | Selling point | Proof |
|---|---|---|
| 1 | **Ask RAL: ask or request in plain words** ("Book my leave", "Show my payslip", "What is the policy?"), in English, Gulf Arabic, Egyptian Arabic and Arabizi. Shows the records it used, says when it cannot answer, hands to HR | Sales guide "#1 selling point"; `packages/shared/ask-cards.ts`; `HANDOFF-ask3.md` (126 test conversations, AskEngine). **[CHECK]** It is a deterministic in-house engine; the LLM "model half" is on hold (PLAN.md lines 229, 406). Say "AI assistant", avoid "powered by GPT/LLM" |
| 2 | **WPS done for you:** exact LMRA salary file, every row checked before download ("Every row passes LMRA validation.") | `WpsController.java`, strings `wpsCheck`/`wpsOk`; sales guide #2 |
| 3 | **SIO automatic:** Bahraini + expat, employee + employer, monthly register; rate refused if wrong | V2 migration, PLAN row 23; sales guide #3 |
| 4 | **End of service both ways:** old Art. 116 gratuity + new 2024 SIO scheme | V2 migration; sales guide "Pain → fix" |
| 5 | **Every number cites its law:** payslip lines name the rule; statutory values are editable rows with source + confidence, never hardcoded | docs/01 D, deck "Every number cites", `statutory_setting` table |
| 6 | **Truly bilingual:** every screen, payslip PDF and report in Arabic + English, full RTL | strings.ts, `PayslipPdfTest`, qa-shots `*-ar-*` |
| 7 | **Phone app for staff + managers:** GPS check-in with offline queue, 2-tap leave approval, payslips, voice input | `apps/mobile`, docs/03 section 2, MOBILE_RELEASE.md |
| 8 | **Never miss an expiry:** CPR, passport, visa, work permit alerts at 90/30/7 days | docs/01 B; sales guide FAQ |

Runners-up: approve + lock payroll with full audit log; Excel import with dry run + undo; data isolation per company; on-premise or hosted.

## 3. Platforms

| Platform | Status |
|---|---|
| Web app | Live, `https://hr.raltech.dev`, responsive 320 to 1920, light + dark |
| Tablet | Same responsive web (tablet KPI grid, PLAN row 20); no separate tablet app |
| PWA | Yes: `apps/web/public/manifest.webmanifest` + `sw.js` registered in `main.tsx` |
| Mobile app (iOS + Android, Expo) | Built. Apple app id `6829531131`, TestFlight + Google Play pipeline (MOBILE_RELEASE.md). Sales guide says "App live on App Store + Google Play". **[CHECK]** store-live status vs TestFlight only |
| REST API | Yes (`/api/...`, public careers door `/api/public/{tenant}`) |
| Hosting | Client picks: on their own server, or RAL-hosted (sales guide) |

## 4. Demo screens to simulate

Demo company (real seed, `seed/Seeder.java`, `seed/Org.java`): **Bahrain Horizon Facilities W.L.L.** (شركة بحرين هورايزن للمرافق ذ.م.م), a facilities management contractor, **98 employees**, 10 departments, BHD. Office roles Bahraini, field roles largely expat. Second tenant: Nile Arc Developments S.A.E. (Cairo, EGP).

Departments (headcount): Executive Office 1, Operations 37, Maintenance 27, Health and Safety 4, Finance 8, Human Resources 4, Sales 8, IT 5, Administration 4.

Real seed names: Bahraini first names Ahmed, Mohammed, Ali, Hassan, Khalid, Yousif, Hamad, Fatima, Maryam, Noor, Zainab, Aisha, Hessa, Dana, Reem, Shaikha; family names Al Khalifa, Al Mannai, Kanoo, Al Zayani, Fakhro, Al Doseri, Al Arrayed, Bucheeri, Janahi, Al Alawi, Al Kooheji. Expat: Rajesh Kumar, Suresh Nair, Imran Khan, Joseph Fernandes, Maria, Priya, Arun Pillai, Bilal Hussain. Personas: Aisha Al Arrayed (HR manager), Ahmed Al Khalifa (executive). Video shows Noor Al Sayed and Priya Reddy in approvals.

Seed basic salaries (BHD/month, before seniority step): CEO 3,200; Finance Mgr 1,900; Ops Mgr 1,850; HR Mgr 1,600; Senior Accountant 880; Payroll Officer 640; Accountant 620; Safety Officer 620; Senior Technician 520; HVAC Tech 380; Technician 340; Driver 260. Staff structure: housing 40% of basic, transport 60, phone 25, social allowance 50 (Bahrainis).

| Screen | Real labels / fields | Sample data |
|---|---|---|
| **Home** (HR persona) | Greeting by time of day, next-action button, tiles: Headcount, Pending, Expiring documents, holidays, Leave balances | Good morning, Aisha. Headcount 98. 4 approvals waiting. 3 documents expiring (e.g. Rajesh Kumar work permit, 12 days left). Next holiday |
| **Ask RAL** | Placeholder "Ask about your leave, payslip, holidays, manager or policies"; Sources; "Send to HR"; leave card with Confirm/Cancel, then "Confirmed" + weekday/time; counted line (working/weekend/holiday days) | Prompts from sales guide: "How many leave days do I have left?", "When is the next public holiday?", "What was on my last payslip?", "How many people joined my team this year?", HR-only "What is our pay bill?". Arabic: "زيد يوم" (add a day) |
| **Leave** | Balance tiles: available / used / pending / total; Request leave: Leave type chips, From, To, Half day, Reason; statuses Pending/Approved/Rejected/Cancelled; two-month team calendar | Annual 30 days/yr, Sick 15 full + 20 half + 20 unpaid, Maternity 60+15, Paternity 1, Bereavement 3 each time, Hajj 14 once after 5 yrs, Marriage 3 once |
| **Approvals** | Tabs: waiting for you / with someone else / decided; chain stage 1 (manager or cover) then stage 2 (HR) by name; Approve / Reject; empty: "Nothing waiting for you. Enjoy the quiet." | Noor Al Sayed, Annual leave 3 days; Priya Reddy, salary certificate |
| **Attendance** | Check-in hero: Check in / Check out, "Checked in at", On site / Off site (geofence radius); This month: Present, Late, Absent, On leave, Holiday, Weekly off, Overtime; Request correction | Checked in 07:02, On site (Seef HQ, 150 m radius); OT at 125% / 150% |
| **Payroll run** | Status steps (Draft, Computed, Approved, Paid, WPS); KPIs Gross / Deductions / Net pay / Employer cost; Compute, Approve run (dialog "This action moves money. Confirm it is you."), Mark paid, Check WPS file, Download WPS file | From the marketing video: October 2026, 118,460 BHD gross, 7,164 BHD deductions, 111,295 BHD net, "Every row passes LMRA validation". **[CHECK]** video figures vs live seed |
| **Payslip** | Earnings, Deductions, Employer contributions, Net pay, Rule column, PDF | Illustrative (computed from seed, verify): Bahraini Accountant: basic 620.000, housing 248.000, transport 60.000, phone 25.000, social 50.000 = gross 1,003.000; SIO employee 8% 80.240; net 922.760 BHD. Expat Technician: SIO 1%, employer 3% + EOSB 4.2% |
| **WPS file** | 10 columns listed in section 1 | CPR 9 digits, IBAN BH.., BHD, fixed = net minus social minus variable |
| **Org chart** | Tree, search, collapse, department filter | CEO Ahmed Al Khalifa, then 9 department heads, Site Supervisors under Ops |
| **Reports** | Card catalogue; result table 25/page, row count, xlsx in EN or AR | Headcount, Bahrainisation % (Nationality: National / Expatriate), SIO register, EOSB liability |
| **Mobile** | Tabs: Home, Leave, Check-in, Pay, More | One-tap GPS check-in, latest payslip card |

Payslip/run screens use money LTR-isolated with 3 decimals ("15,176.473 BHD" style).

## 5. Brand

| Item | Path / value |
|---|---|
| RAL HR app logo | `ralhr/brand/app-images/ral-hr-logo.png`, inverse `ral-hr-logo-inverse.png`, splash `ral-splash.png`, favicon `ral-favicon.png` |
| RAL logos | `ralhr/brand/Logo-no-background.png`, `logo_main.png`, `logo_watermark.png`, `ral_logo_inkbbox.png`; web `apps/web/public/wordmark.png`, `icon-512.png` |
| Fonts | Plus Jakarta Sans (Latin) + IBM Plex Sans Arabic (Arabic), files in `ralhr/brand/fonts/` |
| App palette (default) | Brand teal `#0f766e`, strong `#115e59`, deep `#134e4a`, secondary indigo `#4338ca`; gradient teal to indigo. Neutrals zinc: ink `#18181b`, canvas `#f7f7f8`, rule `#e4e4e7`. Tones: good `#15803d`, warn `#92400e`, bad `#b91c1c`. Tenant palettes: ocean, forest, plum, sunset, gold, royal, rose (`packages/shared/tokens.css` l.260 to 302) |
| Motion | `--ral-ease: cubic-bezier(.32,.72,0,1)`, spring `(.2,.9,.3,1.15)`, 140/240/440 ms |
| Radii | 6 / 8 / 11 / 14 / 18 px |
| Video palette | Marketing video uses lavender/violet + white with a purple "RAL HR" wordmark (fits raltech.dev's violet theme better than the app teal). **[CHECK]** which palette the page should lead with |
| Screenshots | `ralhr/docs/qa-shots/keep/`: `hr-en-desktop-home.png`, `hr-ar-desktop-payroll.png`, `hr-ar-mobile-leave.png`, `employee-en-mobile-home.png`, `employee-ar-desktop-ask.png`, `employee-ar-desktop-attendance.png`, `employee-ar-desktop-calendar.png`, `hr-en-desktop-reports-headcount.png`, `login-en.png`, `login-ar.png`, `billing-1440.png`; also `ralhr/login-desktop-light.png`, folders `apps/web/e2e-shots-*` |

## 6. Videos

| File | Specs | What it shows |
|---|---|---|
| `C:/Users/Suhaib/Downloads/ralhr_marketing.mp4` (15 MB) | 81.2 s, 720x1280 vertical, 30 fps, has audio | Illustrated + UI-mockup reel on lavender. Frames: ~8 s "This is RAL HR." (woman in abaya entering an office); ~28 s "Live on HR's dashboard. On the manager's phone." (phone Approvals: Noor Al Sayed, Priya Reddy, Approve); ~48 s "WPS-ready payroll." (October 2026 run, status stepper, 118,460 / 7,164 / 111,295 BHD, "Check WPS file", chip "October net pay 15,176.473 BHD"); ~70 s "Arabic and English. Web and mobile." (laptop + phone, EN/عربي toggle, "Same record, live") |
| `ralhr/apps/api/src/main/resources/learning/sample-lesson.webm` | n/a | Seed lesson for the Learning module, not marketing |
| `ralhr/apps/api/data/files/*/learning/*.webm` (hundreds) | n/a | Per-tenant copies of seeded learning lessons. Ignore |
| `ral-workspace/.tmp/RAL_SIO_AI_Chatbot_Demo*.mp4`, `sio_video_raw/*.webm` | n/a | **Not RAL HR**: SIO tender chatbot demo (different product) |

No Remotion project or written video script for RAL HR found. Sales guide stresses "Always have the latest demo video ready to send" (WhatsApp follow-up).

## 7. Pricing

Two sources that **disagree [CHECK]**:

| Plan | Sales guide v1.1 (Nov 2026, public-facing) | Database `V31__prices_and_the_invoice_header.sql` (Bahrain rows) |
|---|---|---|
| Starter: the legal must-haves (Ask RAL, payroll + WPS, SIO + EOSB, leave + attendance, records + expiry alerts, audit log) | BD 1 / employee / month | BD 15 base incl. 10 employees, then BD 1.000 per employee |
| Professional: Starter + the HR department (org chart, documents hub, self-service, hiring, onboarding, reviews, service desk, e-signature, benefits, rosters, travel) | BD 2 / emp / month | BD 35 base incl. 15, then BD 1.750 |
| Premium / Enterprise: + analytics export, compensation + pay equity, contractors + HSE, enforced SSO, legal hold | BD 3 / emp / month | BD 90 base incl. 25, then BD 2.500 |

Plus a one-time setup fee sized to company (size, migration, attendance system, branches, integrations, training). Ask RAL in every plan. Modules can be added/removed; legal core always on. No per-user fee. Price negotiable. Recommended page copy: "From BD 1 per employee per month".

Competitor table (sales guide, approx, 5 Nov 2026): RemoteApps (Bahrain, main rival, quote only), ZenHR USD 5 to 8/emp, Bayzat quote, Jisr SAR 10 to 18/emp, Keka unpublished, Zoho Payroll, greytHR, Odoo. Wins: AI-first, exact WPS, built on Bahrain rules, local Arabic team.

Objection answers (sales guide FAQ): WPS exact LMRA format, never moves money; SIO Bahraini + expat with monthly register; Arabic on every screen, payslip and report; each company separated, role access, full log, nightly backups; Excel import with dry run, undoable; phone + web check-in built in.

Live demo: `hr.raltech.dev`, demo logins listed in the sales guide (do not publish passwords on the marketing site).
