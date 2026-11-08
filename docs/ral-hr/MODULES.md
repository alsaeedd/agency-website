# RAL HR module catalogue (website)

Source of truth in code: `src/components/ralhr/modules.ts` (EN + AR strings). Researched 2026-11-08 from the RAL HR repo:
`apps/api/.../platform/Modules.java` (plan gates), `apps/web/src/router.tsx` (live screens), `docs/27-module-gap-audit.md`,
`docs/32-gap-register.md`, `docs/23-gap-roadmap-2026-09-21.md`. The all-modules demo tenant is seeded as ENTERPRISE, kind DEMO (`seed/Seeder.java`).

Status: **Live** = shipped, in client use. **Demo** = built and on in the all-modules demo tenant, newer or Premium-only. **Soon** = on the roadmap, not built.
Tier follows the public pricing in `data.ts` (Starter BD 1, Professional BD 2, Premium BD 3). Where pricing does not name a module, the tier follows the app's gate; ungated core items sit in Starter.

| Category | Module | Plan | Status |
|---|---|---|---|
| Payroll and compliance | Payroll runs, WPS salary file, SIO + end of service, Final settlement, Bahrainisation report | Starter | Live |
| | Accounting journal export (Xero, QuickBooks, Zoho, Odoo files) | Professional | Live |
| | Live accounting sync, Multi-currency payroll | Premium | Soon |
| Time and leave | Leave + balances, Attendance + phone check-in | Starter | Live |
| | Rosters + open shifts, Business travel | Professional | Live |
| | Hourly leave (Starter), Selfie check-in (Professional) | | Soon |
| People and org | Records + expiry alerts, Org chart, Documents hub, Bilingual contracts, Excel import | Starter | Live |
| | HR actions, E-signature | Professional | Live |
| | Assets + exit clearance | Professional | Demo |
| Talent | Hiring, Onboarding, Reviews + goals | Professional | Live |
| | Learning | Professional | Demo |
| | Compensation + pay equity | Premium | Demo |
| Engagement and service | Staff phone app | Starter | Live |
| | Ask RAL assistant (keyword answers today, model pending) | Starter | Demo |
| | Policies + sign-off, Benefits | Professional | Live |
| | Company wall, Kudos + rewards | Professional | Demo |
| Workforce operations | Workflow automation | Professional | Demo |
| | Contractors, Health and safety, Fleet | Premium | Demo |
| Analytics and control | Reports, Audit log | Starter | Live |
| | Analytics export, Legal hold + retention | Premium | Demo |
| | Enforced single sign-on, Two-factor login (Starter), ERP integration (Premium) | | Soon |

Totals: 7 categories, 44 modules: 25 Live, 12 Demo, 7 Soon. Self-service and Service desk removed from plans and picker (owner, 2026-11-08). Enforced SSO is in every plan (listed in Starter, marked Soon).

Note: the app's own gate puts Org chart and Documents hub in PROFESSIONAL; the website sells them in Starter (owner decision, pricing commit 453b759).

Plan split: the RAL HR repo has no Starter-only tenant seed (bhf and nile are both ENTERPRISE demo tenants), so tiers follow the repo gate map in Modules.java (CORE = Starter, PRO = Professional, ENT = Premium) with the website overrides: Org chart, Documents hub, Ask RAL and Enforced SSO in Starter.

Pricing flow: 1 Choose your plan (cards show top 6 modules + "N more") or "Not sure? Choose modules" (picker auto-selects the cheapest covering plan), then 2 Size your team, then one primary "Book a demo" (WhatsApp prefilled with plan, team, monthly estimate and picked modules). "Prefer a guided form?" carries picks to /ral-hr/inquire/?modules=..., whose plan step preselects the cheapest covering plan.
