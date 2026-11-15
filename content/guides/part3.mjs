// Guides part 3: payroll month-end checklist and new hire onboarding checklist.
// EN + AR. Same content rules as content/articles-hr.mjs: no invented figures;
// where a government rule can change, describe it and point to the official source.

const D = '2026-11-15'

// ── Payroll month-end checklist (EN) ──────────────────────────────────────
const payrollEn = {
  path: '/insights/payroll-month-end-checklist/',
  type: 'article',
  published: D,
  updated: D,
  readMinutes: 9,
  tag: 'Payroll',
  title: 'Payroll month-end checklist for SMEs in Bahrain',
  description:
    'A step by step month-end payroll checklist for small businesses in Bahrain: cut-off dates, inputs, joiners and leavers, SIO, the WPS file, approvals and archiving.',
  eyebrow: 'Insights · Guides',
  h1: 'Payroll month-end checklist: <span class="serif">for SMEs in Bahrain.</span>',
  lead:
    'Most payroll problems are not calculation problems. They are timing problems: an overtime sheet that arrived late, a leaver nobody mentioned, a bank detail that changed last week. This checklist turns the month-end into a fixed routine so the numbers are right before anyone presses "pay".',
  body: `
<h2>Why a checklist beats memory</h2>
<p>In a small company, payroll is often run by one person who also handles HR, accounts or office management. That person usually knows the routine by heart, which works until they are on leave, the company grows past twenty people, or a new rule appears. A written checklist does three things. It makes the routine repeatable by someone else. It forces inputs to arrive on time, because everyone can see the cut-off date. And it creates a trail, so when a worker asks why their salary was lower in March, you can answer in minutes instead of digging through emails.</p>
<p>The checklist below is organised in the order work actually happens: collect, calculate, check, approve, pay, report, archive. Adjust the dates to your own pay day. Many Bahrain employers pay on the last working day of the month or in the first days of the next month; whatever you choose, write it down and keep it stable.</p>

<h2>Step 1: Fix your cut-off date</h2>
<p>The cut-off date is the last day on which changes are accepted for this month's payroll. Anything that arrives later goes into next month as an adjustment. Without a cut-off, payroll becomes a moving target and the person running it ends up recalculating on pay day.</p>
<ul>
  <li>Pick a cut-off that leaves at least five working days before pay day. That gives time to calculate, review, fix and submit the salary file to the bank.</li>
  <li>Announce it to managers once, then send a short reminder two or three days before each cut-off.</li>
  <li>Agree what happens to late items. The usual rule is simple: late overtime or late leave goes into next month's payroll as an arrears line, clearly labelled.</li>
</ul>

<h2>Step 2: Collect the time and attendance inputs</h2>
<p>These are the inputs that change every month. Collect them in one place, from one source, in one format.</p>
<ul>
  <li><strong>Attendance.</strong> Days worked, absences, and unpaid days. If you use a biometric device or an app, export the report for the full pay period, not just the days you think matter.</li>
  <li><strong>Leave.</strong> Annual leave taken, sick leave with the paid or partly paid status that applies, and any unpaid leave. Under Labour Law No. 36 of 2012, sick leave is paid at different rates depending on how much the worker has already used in the year, so the leave record needs the running total, not just this month.</li>
  <li><strong>Overtime.</strong> Hours, dates, and whether the hours were on a normal day, at night or on a rest day or public holiday, because the law sets different minimum premiums for these. Overtime should be approved by a manager before it reaches payroll.</li>
  <li><strong>Late arrivals and deductions for absence.</strong> Only if your contracts and internal rules allow them, and only within the limits of the law. When in doubt, check with the Ministry of Labour before deducting.</li>
</ul>

<h2>Step 3: Process joiners, leavers and changes</h2>
<p>This is where most mistakes happen, because the information sits with different people. Ask each manager a direct question before cut-off: "Has anyone joined, left, changed role or changed salary this month?"</p>
<h3>Joiners</h3>
<ul>
  <li>Confirm the start date, the agreed salary and allowances, and the bank or wallet details for WPS.</li>
  <li>Check that the worker is registered with the Social Insurance Organization (SIO), and for non-Bahraini workers, that the work permit is in place with the Labour Market Regulatory Authority (LMRA).</li>
  <li>Calculate a pro-rata salary for the first month (see the worked example below).</li>
</ul>
<h3>Leavers</h3>
<ul>
  <li>Confirm the last working day and the reason for leaving, because the final settlement depends on it.</li>
  <li>Calculate unpaid salary to the last day, any unused annual leave that must be paid out, notice pay if it applies, and any end of service amounts that the employer still owes directly.</li>
  <li>Stop the worker's SIO contributions from the right date and, for expats, start the LMRA cancellation steps on time.</li>
</ul>
<h3>Changes</h3>
<ul>
  <li>Salary increases, new allowances, promotions and transfers between branches or cost centres.</li>
  <li>Bank detail changes. Treat these with care: ask for the request in writing from the worker, and confirm it by a second channel, such as a short call, before you change anything. Fake bank change requests are a common fraud.</li>
</ul>

<h2>Step 4: Allowances and deductions</h2>
<p>List every recurring and one-off item for the month in a single sheet or system screen. Typical items include housing, transport and phone allowances, bonuses, commissions, salary advances being repaid, and loan instalments. For each deduction, keep the signed agreement or the legal basis on file. The Labour Law protects wages and limits what an employer can deduct, so a deduction that "everyone agreed to verbally" is a risk.</p>

<h2>Step 5: SIO contributions</h2>
<p>Social insurance contributions are calculated on the worker's insurable wage, with a share paid by the employer and a share deducted from the worker, and the rates and covered branches differ between Bahraini and non-Bahraini workers. Rates and wage ceilings are set by the SIO and have changed over time, so do not copy last year's percentages without checking. Each month, confirm that:</p>
<ul>
  <li>Every active worker is registered and every leaver has been removed.</li>
  <li>The insurable wage on the SIO record matches what you actually pay. If you increased a salary, the SIO record usually needs updating too.</li>
  <li>The amount deducted on payslips agrees with what the SIO will invoice.</li>
</ul>
<p>We explain the mechanism in more detail in <a href="/insights/sio-contributions-explained/">SIO contributions explained for Bahrain employers</a>.</p>

<h2>Step 6: Calculate, then check</h2>
<p>Run the calculation, then check it with fresh eyes, ideally a second person. Good checks are quick and boring:</p>
<ol>
  <li><strong>Headcount check.</strong> Last month's headcount, plus joiners, minus leavers, should equal this month's headcount.</li>
  <li><strong>Total check.</strong> Compare this month's gross and net totals with last month's. Any difference above a small threshold should have a reason you can name, such as two joiners or an annual bonus.</li>
  <li><strong>Outlier check.</strong> Sort net pay from highest to lowest and from lowest to highest. A zero, a negative or an unusually high figure jumps out at once.</li>
  <li><strong>Spot check.</strong> Recalculate two or three payslips by hand, including one with overtime and one with leave.</li>
</ol>

<h2>Worked example: a mid-month joiner</h2>
<p>Suppose a worker joins on 16 April with a monthly basic salary of BD 600 and a transport allowance of BD 60. April has 30 days. The worker is on the payroll for 15 days (16 to 30 April inclusive).</p>
<p>Many employers pro-rate by calendar days, using the actual number of days in the month:</p>
<ul>
  <li>Basic: 600 ÷ 30 × 15 = BD 300.000</li>
  <li>Transport: 60 ÷ 30 × 15 = BD 30.000</li>
  <li>Gross for April: BD 330.000, before any employee SIO deduction.</li>
</ul>
<p>Some employers always divide by 30 regardless of the month, and others use working days. Each method gives slightly different answers in months with 28 or 31 days. None of them is a trick; the point is to choose one method, write it in your payroll policy or contracts, and apply it the same way to joiners, leavers and unpaid leave. Inconsistency is what causes disputes.</p>

<h2>Step 7: Approve</h2>
<p>Before any money moves, someone with authority should approve the payroll. In a small company that is often the owner or general manager. Give them a one-page summary rather than the full detail: headcount, total gross, total net, total employer costs, a list of joiners and leavers, and the explanation for any large change. Their approval, with a date, should be saved alongside the payroll file.</p>

<h2>Step 8: Prepare and submit the WPS file</h2>
<p>Under the LMRA's Wage Protection System, salaries are paid through a participating bank or licensed provider together with a salary information file. Your bank sets the format and validation rules. Before uploading:</p>
<ul>
  <li>Make sure the file is generated from the approved payroll, not retyped by hand.</li>
  <li>Check that the record count and the total amount agree with the approved summary.</li>
  <li>Check identifiers and account details for every new joiner and every changed account.</li>
  <li>Submit early enough that a rejected file can be fixed and resubmitted before pay day.</li>
</ul>
<p>Our <a href="/insights/wps-payroll-bahrain-guide/">WPS payroll guide</a> covers the file and the common rejection reasons in more depth.</p>

<h2>Step 9: Reconcile after payment</h2>
<p>Once the bank confirms the payment, compare the bank's confirmation with your payroll. Every worker should appear once, with the right amount. Then check that payroll costs are posted correctly in your accounts: gross salaries, employer SIO costs, deductions held for third parties, and any accruals for leave or end of service.</p>

<h2>Step 10: Payslips and archiving</h2>
<ul>
  <li>Send payslips that show basic pay, each allowance, overtime, each deduction and net pay. A clear payslip prevents most salary questions.</li>
  <li>Store the month's records together in one folder or system record: inputs, the calculation, the approval, the WPS file, the bank confirmation and the payslips.</li>
  <li>Restrict access. Payroll data is personal data under Bahrain's Personal Data Protection Law (Law No. 30 of 2018), so only the people who need it should be able to open it.</li>
  <li>Keep records for as long as the law and your auditors require. Ask your accountant for the retention period that applies to you.</li>
</ul>

<h2>A week by week timeline</h2>
<p>Here is a simple timeline for a company that pays on the last working day of the month. Shift it if your pay day is different.</p>
<div class="table-wrap"><table>
  <thead><tr><th>When</th><th>What happens</th><th>Who</th></tr></thead>
  <tbody>
    <tr><td>Week 1</td><td>Close last month: archive records, log any late items as arrears for this month</td><td>Payroll</td></tr>
    <tr><td>Week 2</td><td>Record joiners, leavers and salary changes as they happen; verify bank detail changes</td><td>HR and managers</td></tr>
    <tr><td>Week 3</td><td>Reminder to managers; collect overtime approvals and leave records; cut-off at the end of the week</td><td>Managers, then payroll</td></tr>
    <tr><td>Week 4, days 1 to 2</td><td>Calculate payroll; run headcount, total, outlier and spot checks</td><td>Payroll and a reviewer</td></tr>
    <tr><td>Week 4, day 3</td><td>Approval by owner or general manager</td><td>Approver</td></tr>
    <tr><td>Week 4, days 3 to 4</td><td>Generate and upload WPS file; fix any rejection</td><td>Payroll</td></tr>
    <tr><td>Pay day</td><td>Salaries paid; bank confirmation received; payslips sent</td><td>Payroll</td></tr>
    <tr><td>After pay day</td><td>Reconcile bank to payroll; post to accounts; confirm SIO amounts</td><td>Payroll and accounts</td></tr>
  </tbody>
</table></div>

<h2>Common mistakes to avoid</h2>
<ul>
  <li>Paying a leaver a full month because nobody told payroll they had left.</li>
  <li>Forgetting to update the SIO record after a salary increase.</li>
  <li>Changing a bank account on the strength of a single email.</li>
  <li>Approving payroll without a summary, so the approver signs without really seeing it.</li>
  <li>Keeping payroll files on a personal laptop or in a shared folder that the whole office can open.</li>
</ul>

<h2>Frequently asked questions</h2>
<h3>How many days before pay day should the cut-off be?</h3>
<p>Five working days is a practical minimum for a small company. It leaves room to calculate, review, approve and resubmit a rejected WPS file without rushing.</p>
<h3>What if overtime arrives after the cut-off?</h3>
<p>Pay it in the next month as a clearly labelled arrears line. Do not reopen a payroll that has already been approved unless the error is serious, such as a worker being left out entirely.</p>
<h3>Should we pro-rate by calendar days or by 30 days?</h3>
<p>Either can be reasonable. What matters is consistency and a written rule. Check your contracts, and if a worker disputes the method, the Ministry of Labour can advise.</p>
<h3>Do we need a second person to check payroll?</h3>
<p>It is strongly recommended. Even a ten-minute review of totals and outliers by someone who did not run the calculation catches most errors.</p>
<h3>Where can we confirm current SIO rates and WPS rules?</h3>
<p>Go to the source: the Social Insurance Organization for contribution rates and registration, the LMRA for WPS scope, and your bank for the salary file format.</p>

<p>If your month-end still runs on spreadsheets and reminders, we are happy to show you how others in Bahrain have automated it; <a href="/contact/">get in touch</a>.</p>
<p><em>This article is general information, not legal or payroll advice. Rules, rates and file formats are set by the Ministry of Labour, the LMRA, the SIO and your bank, and may change; confirm current requirements with them.</em></p>
`,
}

// ── Onboarding checklist (EN) ─────────────────────────────────────────────
const onboardingEn = {
  path: '/insights/new-hire-onboarding-checklist-bahrain/',
  type: 'article',
  published: D,
  updated: D,
  readMinutes: 7,
  tag: 'HR',
  title: 'New hire onboarding checklist for employers in Bahrain',
  description:
    'A practical onboarding checklist for Bahrain employers: contract, work permit and CPR, SIO registration, WPS bank details, day one, the first week and probation.',
  eyebrow: 'Insights · Guides',
  h1: 'New hire onboarding checklist: <span class="serif">for employers in Bahrain.</span>',
  lead:
    'A good first month decides whether a new hire stays, and a missed registration can turn into a fine or a payroll problem months later. This checklist covers both sides: the legal and administrative steps that must happen, and the human steps that make someone productive quickly.',
  body: `
<h2>Why onboarding needs a written checklist</h2>
<p>In a growing company, hiring happens in bursts. One month you hire nobody, the next month three people start on the same Sunday. Without a checklist, the steps that matter most are the ones that get forgotten: the social insurance registration, the bank details for the salary file, the signed copy of the contract. These problems are invisible on day one and painful by month three.</p>
<p>The checklist below is split into four stages: before day one, day one, the first week, and the first ninety days. At the end there is a table of who usually owns each step, and a section on the differences between hiring a Bahraini and a non-Bahraini worker.</p>

<h2>Stage 1: Before day one</h2>
<h3>The offer and the contract</h3>
<ul>
  <li>Send a written offer that states the job title, start date, basic salary, each allowance, working hours, place of work and probation period.</li>
  <li>Prepare the employment contract. Under Labour Law No. 36 of 2012, the contract should be in writing, and the law sets out the details it must contain, such as the parties, the wage, the nature of the work and the duration if it is a fixed-term contract. Keep one signed copy for the worker and one for the file.</li>
  <li>If the worker does not read Arabic well, provide the contract in a language they understand as well. Ask the Ministry of Labour or your lawyer which version prevails if they differ.</li>
</ul>
<h3>Identity and permits</h3>
<ul>
  <li><strong>Bahraini workers:</strong> collect a copy of the CPR (the national ID card).</li>
  <li><strong>Non-Bahraini workers:</strong> the work permit must be issued by the LMRA before the worker starts. Depending on where the worker is coming from, this may involve an entry visa, a medical check and fingerprinting, and then issuing or updating the CPR. Do not let someone start working on the promise that the permit is "nearly done".</li>
  <li>Record every expiry date (passport, CPR, work permit, residence) in one place with reminders, so renewals start well before the deadline.</li>
</ul>
<h3>Payroll and social insurance</h3>
<ul>
  <li>Register the worker with the Social Insurance Organization (SIO) from the correct start date. Registration deadlines are set by the SIO, so check them and do it early rather than late.</li>
  <li>Collect bank or wallet details for the Wage Protection System. The account should be in the worker's own name.</li>
  <li>Add the worker to the payroll with the right start date so the first salary is pro-rated correctly.</li>
</ul>
<h3>Practical setup</h3>
<ul>
  <li>Order the laptop, phone, access card, uniform or tools.</li>
  <li>Create email and system accounts with only the access the role needs.</li>
  <li>Name a buddy: a colleague, not the manager, whom the new hire can ask small questions.</li>
  <li>Send a short welcome message with the time, address, parking or transport details, dress code and who will meet them.</li>
</ul>

<h2>Stage 2: Day one</h2>
<ul>
  <li>Meet them at the door. The first ten minutes set the tone.</li>
  <li>Collect any documents still missing and sign anything still unsigned.</li>
  <li>Hand over equipment and record it on an asset list that the worker signs.</li>
  <li>Walk through working hours, breaks, how to request leave, how to report sickness, and the attendance system.</li>
  <li>Explain health and safety basics for the workplace, including emergency exits and first aid.</li>
  <li>Explain how personal data is handled (see the PDPL section below).</li>
  <li>Have lunch with the team. It sounds minor; it is not.</li>
</ul>

<h2>Stage 3: The first week</h2>
<ul>
  <li>Give a short written plan for the week: who they will meet, what they will learn, and one small real task they can finish.</li>
  <li>Introduce the main internal tools and the main customers or suppliers they will deal with.</li>
  <li>Share the key policies: code of conduct, leave, expenses, IT and data use.</li>
  <li>At the end of the week, the manager holds a fifteen-minute check-in: what is clear, what is confusing, what is missing.</li>
</ul>

<h2>Stage 4: The first ninety days and probation</h2>
<p>The Labour Law allows a probation period, which must be stated in the contract. The law limits how long it can last and sets out how either side can end the contract during it; the commonly cited maximum is three months, and a worker cannot be placed on probation more than once with the same employer. Because the details matter if a dispute arises, confirm the current rules with the Ministry of Labour before you rely on them.</p>
<p>Use the probation period for what it is meant for: an honest, two-way check.</p>
<ol>
  <li><strong>Set expectations in week one.</strong> Write down three to five things the new hire should be able to do by the end of probation.</li>
  <li><strong>Check in at 30 and 60 days.</strong> A short documented conversation each time. If something is going wrong, say so early and say what would need to change.</li>
  <li><strong>Decide before the end date.</strong> Do not let probation expire by accident. Put the end date in the calendar with a reminder two weeks before.</li>
  <li><strong>Confirm in writing.</strong> When probation ends successfully, tell the worker in writing. It is a small thing that people remember.</li>
</ol>

<h2>Personal data: what PDPL means for onboarding</h2>
<p>Onboarding collects a lot of personal data: ID copies, passport details, bank accounts, addresses, emergency contacts, sometimes medical information. Bahrain's Personal Data Protection Law (Law No. 30 of 2018) applies. In practice:</p>
<ul>
  <li><strong>Collect only what you need.</strong> If a document is not needed for a legal or clear business purpose, do not ask for it.</li>
  <li><strong>Tell people why.</strong> A short privacy notice for employees explains what you collect, why, who sees it, and how long you keep it.</li>
  <li><strong>Treat sensitive data with extra care.</strong> Health information and similar categories have stricter rules. Keep them separate and restrict access tightly.</li>
  <li><strong>Lock it down.</strong> HR files should not sit in a shared folder that everyone can open, or in personal email or chat threads.</li>
  <li><strong>Delete on schedule.</strong> Keep records for as long as the law requires and then dispose of them securely.</li>
</ul>

<h2>Who owns each step</h2>
<p>In a small company one person may hold several of these roles. What matters is that every step has a name next to it.</p>
<div class="table-wrap"><table>
  <thead><tr><th>Step</th><th>Usual owner</th><th>When</th></tr></thead>
  <tbody>
    <tr><td>Offer letter and contract</td><td>HR, approved by manager</td><td>Before day one</td></tr>
    <tr><td>Work permit and visa (expats)</td><td>HR or PRO</td><td>Before day one</td></tr>
    <tr><td>SIO registration</td><td>HR or payroll</td><td>On or before the start date</td></tr>
    <tr><td>Bank details for WPS</td><td>Payroll</td><td>Before the first pay run</td></tr>
    <tr><td>Equipment and accounts</td><td>IT or office manager</td><td>Before day one</td></tr>
    <tr><td>Welcome, buddy, first week plan</td><td>Line manager</td><td>Day one to week one</td></tr>
    <tr><td>Policies and data notice</td><td>HR</td><td>Day one</td></tr>
    <tr><td>30, 60 and 90 day reviews</td><td>Line manager</td><td>During probation</td></tr>
    <tr><td>Expiry date tracking</td><td>HR</td><td>Ongoing</td></tr>
  </tbody>
</table></div>

<h2>Bahraini and non-Bahraini hires: the main differences</h2>
<ul>
  <li><strong>Permits.</strong> Non-Bahraini workers need an LMRA work permit before starting, plus residence and CPR steps. Bahraini workers do not need a work permit.</li>
  <li><strong>Lead time.</strong> Hiring from abroad can take weeks because of visas, medical checks and travel. Plan the start date around it.</li>
  <li><strong>Social insurance.</strong> Both are registered with the SIO, but the branches covered and the contribution rates differ between Bahraini and non-Bahraini workers. Check the current rules with the SIO.</li>
  <li><strong>Fees.</strong> Work permits carry government fees that the employer pays. The LMRA publishes the current fees.</li>
  <li><strong>Expiries.</strong> Expat files have more expiry dates to watch, and a missed renewal can stop someone from working legally.</li>
</ul>

<h2>Worked example: planning a start date</h2>
<p>Suppose you offer a job on 1 March to a candidate who is currently abroad. The steps might run like this: the candidate signs the offer within a few days; you apply for the work permit through the LMRA; once it is approved, the candidate travels; on arrival there are medical and biometric steps before the CPR is issued or updated. If any step takes longer than expected, the start date slips. A realistic plan sets the start date only after the permit is approved, and keeps the first week's plan flexible. For a candidate already in Bahrain on a transferable permit, the process is usually shorter, but it still needs to be complete before they start.</p>

<h2>Frequently asked questions</h2>
<h3>Can a new hire start before the work permit is issued?</h3>
<p>No. A non-Bahraini worker should not start work until the LMRA work permit is in place. Working without a valid permit creates legal risk for both the employer and the worker.</p>
<h3>When should we register a new hire with the SIO?</h3>
<p>From their start date, and within the deadline the SIO sets. Late registration can lead to penalties and to gaps in the worker's insurance record, so make it part of the pre-start checklist.</p>
<h3>How long can probation be?</h3>
<p>The Labour Law limits probation and requires it to be stated in the contract. Three months is the commonly cited maximum. Confirm the current rule with the Ministry of Labour.</p>
<h3>Do we need the worker's consent to store their ID copies?</h3>
<p>Under the PDPL, you need a lawful basis to process personal data, and employment obligations often provide one. You should still tell employees what you hold and why. For sensitive data, take advice.</p>
<h3>What is the single most forgotten onboarding step?</h3>
<p>Recording document expiry dates with reminders. It costs nothing on day one and prevents real problems a year later.</p>

<p>If you are building an onboarding routine and want a system that tracks these steps for you, <a href="/contact/">RAL Technologies can help</a>.</p>
<p><em>This article is general information, not legal advice. Rules on contracts, probation, permits and social insurance are set by the Ministry of Labour, the LMRA and the SIO, and may change; confirm current requirements with them.</em></p>
`,
}

// ── Payroll month-end checklist (AR) ──────────────────────────────────────
const payrollAr = {
  path: '/insights/payroll-month-end-checklist/',
  type: 'article',
  published: D,
  updated: D,
  readMinutes: 8,
  tag: 'الرواتب',
  title: 'قائمة تدقيق رواتب نهاية الشهر للشركات الصغيرة في البحرين',
  description:
    'قائمة عملية خطوة بخطوة لرواتب نهاية الشهر للشركات الصغيرة في البحرين: موعد الإقفال، والمدخلات، والمنضمون والمغادرون، والتأمين الاجتماعي، وملف WPS، والاعتماد، والأرشفة.',
  eyebrow: 'مقالات · أدلة',
  h1: 'قائمة تدقيق رواتب نهاية الشهر: <span class="serif">للشركات الصغيرة في البحرين.</span>',
  lead:
    'معظم مشكلات الرواتب ليست مشكلات حساب، بل مشكلات توقيت: كشف عمل إضافي وصل متأخرًا، أو موظف غادر ولم يخبر به أحد، أو حساب بنكي تغيّر الأسبوع الماضي. هذه القائمة تحوّل نهاية الشهر إلى روتين ثابت، حتى تكون الأرقام صحيحة قبل أن يضغط أحد زر الدفع.',
  body: `
<h2>لماذا القائمة المكتوبة أفضل من الذاكرة</h2>
<p>في الشركات الصغيرة، غالبًا ما يتولى الرواتب شخص واحد يدير أيضًا شؤون الموظفين أو الحسابات أو المكتب. هذا الشخص يحفظ الروتين عن ظهر قلب، وهذا ينجح حتى يأخذ إجازة، أو تكبر الشركة إلى أكثر من عشرين موظفًا، أو تظهر قاعدة جديدة. القائمة المكتوبة تحقق ثلاثة أمور: تجعل الروتين قابلًا للتكرار على يد شخص آخر، وتُلزم الجميع بتسليم المدخلات في وقتها لأن موعد الإقفال واضح للكل، وتترك أثرًا موثقًا، فإذا سأل موظف لماذا كان راتبه أقل في مارس، تجيبه خلال دقائق بدل البحث في الرسائل.</p>
<p>رتّبنا القائمة التالية بحسب تسلسل العمل الفعلي: الجمع، ثم الحساب، ثم المراجعة، ثم الاعتماد، ثم الدفع، ثم التقارير، ثم الأرشفة. عدّل التواريخ بحسب يوم صرف الرواتب عندك. كثير من أصحاب العمل في البحرين يصرفون الرواتب في آخر يوم عمل من الشهر أو في الأيام الأولى من الشهر التالي، وأيًّا كان اختيارك، اكتبه وحافظ عليه ثابتًا.</p>

<h2>الخطوة 1: حدّد موعد الإقفال</h2>
<p>موعد الإقفال هو آخر يوم تُقبل فيه التغييرات على رواتب هذا الشهر. وكل ما يصل بعده يدخل في الشهر التالي كتسوية. فبدون موعد إقفال، تصبح الرواتب هدفًا متحركًا، وينتهي الأمر بمن يعدّها إلى إعادة الحساب في يوم الصرف نفسه.</p>
<ul>
  <li>اختر موعد إقفال يترك خمسة أيام عمل على الأقل قبل يوم الصرف، حتى يتسع الوقت للحساب والمراجعة والتصحيح ورفع ملف الرواتب إلى البنك.</li>
  <li>أعلن الموعد للمديرين مرة واحدة، ثم أرسل تذكيرًا قصيرًا قبل كل إقفال بيومين أو ثلاثة.</li>
  <li>اتفقوا مسبقًا على مصير البنود المتأخرة. القاعدة المعتادة بسيطة: العمل الإضافي أو الإجازة المتأخرة تدخل رواتب الشهر التالي كبند متأخرات واضح التسمية.</li>
</ul>

<h2>الخطوة 2: اجمع مدخلات الوقت والحضور</h2>
<p>هذه المدخلات تتغير كل شهر. اجمعها في مكان واحد، ومن مصدر واحد، وبصيغة واحدة.</p>
<ul>
  <li><strong>الحضور.</strong> أيام العمل، والغياب، والأيام غير المدفوعة. إذا كنت تستخدم جهاز بصمة أو تطبيقًا، فاستخرج التقرير لفترة الرواتب كاملة، لا للأيام التي تظن أنها مهمة فقط.</li>
  <li><strong>الإجازات.</strong> الإجازة السنوية المأخوذة، والإجازة المرضية مع حالتها من حيث الأجر الكامل أو الجزئي، وأي إجازة بدون أجر. فبموجب قانون العمل رقم 36 لسنة 2012، تُدفع الإجازة المرضية بنسب مختلفة بحسب ما استخدمه العامل منها خلال السنة، لذلك يحتاج سجل الإجازات إلى الرصيد التراكمي، لا إلى هذا الشهر وحده.</li>
  <li><strong>العمل الإضافي.</strong> الساعات والتواريخ، وهل كانت في يوم عادي أم ليلًا أم في يوم راحة أو عطلة رسمية، لأن القانون يحدد حدًا أدنى مختلفًا للأجر الإضافي في كل حالة. ويجب أن يعتمد المدير العمل الإضافي قبل أن يصل إلى الرواتب.</li>
  <li><strong>التأخير والخصم مقابل الغياب.</strong> فقط إذا كانت العقود واللوائح الداخلية تسمح بذلك، وفي حدود القانون. وعند الشك، راجع وزارة العمل قبل أي خصم.</li>
</ul>

<h2>الخطوة 3: عالج المنضمين والمغادرين والتغييرات</h2>
<p>هنا تقع معظم الأخطاء، لأن المعلومات موزعة بين أشخاص مختلفين. اسأل كل مدير سؤالًا مباشرًا قبل الإقفال: "هل انضم أحد أو غادر أو تغيّر منصبه أو راتبه هذا الشهر؟"</p>
<h3>المنضمون الجدد</h3>
<ul>
  <li>تأكد من تاريخ المباشرة، والراتب والبدلات المتفق عليها، وبيانات الحساب البنكي أو المحفظة لنظام حماية الأجور.</li>
  <li>تأكد من تسجيل العامل في الهيئة العامة للتأمين الاجتماعي، وللعمال غير البحرينيين، من صدور تصريح العمل من هيئة تنظيم سوق العمل.</li>
  <li>احسب راتبًا تناسبيًا للشهر الأول (انظر المثال المحلول أدناه).</li>
</ul>
<h3>المغادرون</h3>
<ul>
  <li>تأكد من آخر يوم عمل ومن سبب انتهاء الخدمة، لأن التسوية النهائية تعتمد عليه.</li>
  <li>احسب الأجر غير المدفوع حتى آخر يوم، وبدل الإجازة السنوية غير المستخدمة الواجب صرفه، وبدل الإنذار إن وُجد، وأي مستحقات نهاية خدمة لا يزال صاحب العمل ملزمًا بدفعها مباشرة.</li>
  <li>أوقف اشتراكات التأمين الاجتماعي من التاريخ الصحيح، وابدأ إجراءات الإلغاء لدى هيئة تنظيم سوق العمل للعمال الأجانب في وقتها.</li>
</ul>
<h3>التغييرات</h3>
<ul>
  <li>زيادات الرواتب، والبدلات الجديدة، والترقيات، والنقل بين الفروع أو مراكز التكلفة.</li>
  <li>تغيير الحسابات البنكية. تعامل معها بحذر: اطلب الطلب كتابيًا من العامل، وتأكد منه عبر قناة ثانية كاتصال هاتفي قصير قبل تغيير أي شيء. فطلبات تغيير الحساب المزيفة من أشهر أساليب الاحتيال.</li>
</ul>

<h2>الخطوة 4: البدلات والاستقطاعات</h2>
<p>اجمع كل البنود الثابتة والطارئة للشهر في جدول واحد أو شاشة واحدة في النظام. ومن البنود المعتادة: بدل السكن والمواصلات والهاتف، والمكافآت، والعمولات، وأقساط السلف، وأقساط القروض. واحتفظ لكل استقطاع بالاتفاق الموقّع أو السند القانوني. فقانون العمل يحمي الأجر ويقيّد ما يجوز لصاحب العمل خصمه، والخصم الذي "وافق عليه الجميع شفهيًا" مخاطرة.</p>

<h2>الخطوة 5: اشتراكات التأمين الاجتماعي</h2>
<p>تُحسب اشتراكات التأمين الاجتماعي على الأجر الخاضع للاشتراك، بحصة يدفعها صاحب العمل وحصة تُستقطع من العامل، وتختلف النسب والفروع المشمولة بين العمال البحرينيين وغير البحرينيين. والنسب وحدود الأجر تحددها الهيئة العامة للتأمين الاجتماعي وقد تغيرت عبر الزمن، فلا تنسخ نسب العام الماضي دون تحقق. وفي كل شهر تأكد من أن:</p>
<ul>
  <li>كل عامل على رأس العمل مسجّل، وكل مغادر حُذف.</li>
  <li>الأجر المسجّل لدى الهيئة يطابق ما تدفعه فعلًا. فإذا رفعت راتبًا، فغالبًا ما يحتاج سجل الهيئة إلى تحديث أيضًا.</li>
  <li>المبلغ المستقطع في قسائم الرواتب يتفق مع ما ستطالب به الهيئة.</li>
</ul>
<p>شرحنا الآلية بتفصيل أكبر في <a href="/ar/insights/sio-contributions-explained/">شرح اشتراكات التأمين الاجتماعي لأصحاب العمل في البحرين</a>.</p>

<h2>الخطوة 6: احسب، ثم راجع</h2>
<p>شغّل الحساب، ثم راجعه بعين جديدة، ويُفضّل أن يكون المراجع شخصًا ثانيًا. المراجعات الجيدة سريعة ومملّة:</p>
<ol>
  <li><strong>مراجعة العدد.</strong> عدد موظفي الشهر الماضي، زائد المنضمين، ناقص المغادرين، يجب أن يساوي عدد هذا الشهر.</li>
  <li><strong>مراجعة الإجمالي.</strong> قارن إجمالي الرواتب وصافيها هذا الشهر بالشهر الماضي. وأي فرق يتجاوز حدًا صغيرًا يجب أن يكون له سبب تستطيع تسميته، كانضمام موظفَين أو مكافأة سنوية.</li>
  <li><strong>مراجعة القيم الشاذة.</strong> رتّب صافي الرواتب من الأعلى إلى الأدنى ثم العكس. فالصفر أو الرقم السالب أو الرقم المرتفع على غير العادة يظهر فورًا.</li>
  <li><strong>مراجعة العينة.</strong> أعد حساب قسيمتين أو ثلاث يدويًا، منها واحدة فيها عمل إضافي وأخرى فيها إجازة.</li>
</ol>

<h2>مثال محلول: موظف ينضم في منتصف الشهر</h2>
<p>لنفترض أن عاملًا انضم في 16 أبريل براتب أساسي شهري قدره 600 دينار وبدل مواصلات قدره 60 دينارًا. شهر أبريل ثلاثون يومًا، والعامل على الرواتب لمدة 15 يومًا (من 16 إلى 30 أبريل شاملة).</p>
<p>كثير من أصحاب العمل يحسبون الراتب التناسبي بالأيام التقويمية، أي بعدد أيام الشهر الفعلية:</p>
<ul>
  <li>الأساسي: 600 ÷ 30 × 15 = 300.000 دينار</li>
  <li>المواصلات: 60 ÷ 30 × 15 = 30.000 دينار</li>
  <li>إجمالي أبريل: 330.000 دينار، قبل أي استقطاع تأمين اجتماعي على العامل.</li>
</ul>
<p>بعض أصحاب العمل يقسمون دائمًا على ثلاثين أيًّا كان الشهر، وآخرون يستخدمون أيام العمل. وكل طريقة تعطي نتيجة مختلفة قليلًا في الأشهر ذات الثمانية والعشرين أو الواحد والثلاثين يومًا. لا خدعة في أيٍّ منها، والمهم أن تختار طريقة واحدة، وتكتبها في سياسة الرواتب أو العقود، وتطبقها بالطريقة نفسها على المنضمين والمغادرين والإجازة بدون أجر. فعدم الاتساق هو ما يولّد الخلافات.</p>

<h2>الخطوة 7: الاعتماد</h2>
<p>قبل أن يتحرك أي مبلغ، يجب أن يعتمد الرواتب شخص مخوّل، وفي الشركة الصغيرة يكون غالبًا المالك أو المدير العام. قدّم له ملخصًا في صفحة واحدة بدل التفاصيل الكاملة: عدد الموظفين، وإجمالي الرواتب، وصافيها، وإجمالي تكلفة صاحب العمل، وقائمة المنضمين والمغادرين، وتفسير أي تغيّر كبير. ويُحفظ اعتماده مع التاريخ بجانب ملف الرواتب.</p>

<h2>الخطوة 8: جهّز ملف WPS وارفعه</h2>
<p>بموجب نظام حماية الأجور التابع لهيئة تنظيم سوق العمل، تُدفع الرواتب عبر بنك مشارك أو مزوّد مرخّص مع ملف بيانات رواتب. والبنك هو من يحدد الصيغة وقواعد التحقق. وقبل الرفع:</p>
<ul>
  <li>تأكد أن الملف مستخرج من الرواتب المعتمدة، لا مُعاد كتابته يدويًا.</li>
  <li>تأكد أن عدد السجلات والمبلغ الإجمالي يطابقان الملخص المعتمد.</li>
  <li>راجع المعرّفات وأرقام الحسابات لكل منضم جديد ولكل حساب تغيّر.</li>
  <li>ارفع الملف مبكرًا بما يكفي لتصحيح أي رفض وإعادة الرفع قبل يوم الصرف.</li>
</ul>
<p>يتناول <a href="/ar/insights/wps-payroll-bahrain-guide/">دليلنا لرواتب WPS</a> الملف وأسباب الرفض الشائعة بتعمق أكبر.</p>

<h2>الخطوة 9: المطابقة بعد الدفع</h2>
<p>بعد أن يؤكد البنك الدفع، قارن تأكيد البنك بكشف الرواتب. يجب أن يظهر كل عامل مرة واحدة بالمبلغ الصحيح. ثم تأكد من قيد تكاليف الرواتب بشكل صحيح في الحسابات: إجمالي الرواتب، وتكلفة التأمين الاجتماعي على صاحب العمل، والاستقطاعات المحتجزة لجهات أخرى، وأي مخصصات للإجازات أو نهاية الخدمة.</p>

<h2>الخطوة 10: قسائم الرواتب والأرشفة</h2>
<ul>
  <li>أرسل قسائم رواتب تُظهر الأجر الأساسي، وكل بدل، والعمل الإضافي، وكل استقطاع، وصافي الأجر. فالقسيمة الواضحة تمنع معظم الأسئلة عن الرواتب.</li>
  <li>احفظ سجلات الشهر معًا في مجلد واحد أو سجل واحد في النظام: المدخلات، والحساب، والاعتماد، وملف WPS، وتأكيد البنك، والقسائم.</li>
  <li>قيّد الوصول. فبيانات الرواتب بيانات شخصية بموجب قانون حماية البيانات الشخصية في البحرين (القانون رقم 30 لسنة 2018)، ولا ينبغي أن يطّلع عليها إلا من يحتاجها.</li>
  <li>احتفظ بالسجلات للمدة التي يتطلبها القانون ومدققو الحسابات. واسأل محاسبك عن مدة الحفظ التي تنطبق عليك.</li>
</ul>

<h2>جدول زمني أسبوعي</h2>
<p>هذا جدول بسيط لشركة تصرف الرواتب في آخر يوم عمل من الشهر. عدّله إذا كان يوم الصرف عندك مختلفًا.</p>
<div class="table-wrap"><table>
  <thead><tr><th>متى</th><th>ماذا يحدث</th><th>من</th></tr></thead>
  <tbody>
    <tr><td>الأسبوع 1</td><td>إقفال الشهر الماضي: أرشفة السجلات، وتسجيل البنود المتأخرة كمتأخرات لهذا الشهر</td><td>الرواتب</td></tr>
    <tr><td>الأسبوع 2</td><td>تسجيل المنضمين والمغادرين وتغييرات الرواتب أولًا بأول، والتحقق من تغييرات الحسابات البنكية</td><td>الموارد البشرية والمديرون</td></tr>
    <tr><td>الأسبوع 3</td><td>تذكير المديرين، وجمع اعتمادات العمل الإضافي وسجلات الإجازات، والإقفال في نهاية الأسبوع</td><td>المديرون، ثم الرواتب</td></tr>
    <tr><td>الأسبوع 4، اليومان 1 و2</td><td>حساب الرواتب، وإجراء مراجعات العدد والإجمالي والقيم الشاذة والعينة</td><td>الرواتب ومراجع</td></tr>
    <tr><td>الأسبوع 4، اليوم 3</td><td>الاعتماد من المالك أو المدير العام</td><td>المعتمِد</td></tr>
    <tr><td>الأسبوع 4، اليومان 3 و4</td><td>إنشاء ملف WPS ورفعه، وتصحيح أي رفض</td><td>الرواتب</td></tr>
    <tr><td>يوم الصرف</td><td>صرف الرواتب، واستلام تأكيد البنك، وإرسال القسائم</td><td>الرواتب</td></tr>
    <tr><td>بعد يوم الصرف</td><td>مطابقة البنك مع الرواتب، والقيد في الحسابات، والتأكد من مبالغ التأمين الاجتماعي</td><td>الرواتب والحسابات</td></tr>
  </tbody>
</table></div>

<h2>أخطاء شائعة يجب تجنبها</h2>
<ul>
  <li>صرف راتب شهر كامل لموظف غادر لأن أحدًا لم يُبلغ قسم الرواتب.</li>
  <li>نسيان تحديث سجل التأمين الاجتماعي بعد زيادة الراتب.</li>
  <li>تغيير حساب بنكي بناءً على رسالة بريد إلكتروني واحدة.</li>
  <li>اعتماد الرواتب دون ملخص، فيوقّع المعتمِد دون أن يرى فعلًا ما يوقّع عليه.</li>
  <li>حفظ ملفات الرواتب على حاسوب شخصي أو في مجلد مشترك يستطيع المكتب كله فتحه.</li>
</ul>

<h2>الأسئلة الشائعة</h2>
<h3>كم يومًا قبل يوم الصرف يجب أن يكون الإقفال؟</h3>
<p>خمسة أيام عمل حد أدنى عملي للشركة الصغيرة. فهي تتيح وقتًا للحساب والمراجعة والاعتماد وإعادة رفع ملف WPS المرفوض دون استعجال.</p>
<h3>ماذا لو وصل العمل الإضافي بعد الإقفال؟</h3>
<p>اصرفه في الشهر التالي كبند متأخرات واضح التسمية. ولا تُعِد فتح رواتب اعتُمدت إلا إذا كان الخطأ جسيمًا، كأن يُستبعد عامل بالكامل.</p>
<h3>هل نحسب الراتب التناسبي بالأيام التقويمية أم على أساس ثلاثين يومًا؟</h3>
<p>كلاهما قد يكون معقولًا. المهم الاتساق ووجود قاعدة مكتوبة. راجع عقودك، وإذا اعترض عامل على الطريقة، فيمكن لوزارة العمل أن تقدم الإرشاد.</p>
<h3>هل نحتاج إلى شخص ثانٍ لمراجعة الرواتب؟</h3>
<p>يُنصح بذلك بشدة. فحتى مراجعة مدتها عشر دقائق للإجماليات والقيم الشاذة، على يد شخص لم يُجرِ الحساب، تكشف معظم الأخطاء.</p>
<h3>أين نتأكد من نسب التأمين الاجتماعي وقواعد WPS الحالية؟</h3>
<p>من المصدر مباشرة: الهيئة العامة للتأمين الاجتماعي لنسب الاشتراك والتسجيل، وهيئة تنظيم سوق العمل لنطاق نظام حماية الأجور، وبنكك لصيغة ملف الرواتب.</p>

<p>إذا كانت نهاية الشهر عندك ما زالت تعتمد على جداول البيانات والتذكيرات، يسعدنا أن نريك كيف أتمتها غيرك في البحرين؛ <a href="/ar/contact/">تواصل معنا</a>.</p>
<p><em>هذا المقال معلومات عامة وليس استشارة قانونية أو استشارة رواتب. القواعد والنسب وصيغ الملفات تحددها وزارة العمل وهيئة تنظيم سوق العمل والهيئة العامة للتأمين الاجتماعي وبنكك، وقد تتغير؛ تأكد من المتطلبات الحالية منهم.</em></p>
`,
}

// ── Onboarding checklist (AR) ─────────────────────────────────────────────
const onboardingAr = {
  path: '/insights/new-hire-onboarding-checklist-bahrain/',
  type: 'article',
  published: D,
  updated: D,
  readMinutes: 6,
  tag: 'الموارد البشرية',
  title: 'قائمة تهيئة الموظفين الجدد لأصحاب العمل في البحرين',
  description:
    'قائمة عملية لتهيئة الموظفين الجدد لأصحاب العمل في البحرين: العقد، وتصريح العمل والبطاقة الذكية، والتسجيل في التأمين الاجتماعي، وبيانات WPS، وفترة التجربة.',
  eyebrow: 'مقالات · أدلة',
  h1: 'قائمة تهيئة الموظفين الجدد: <span class="serif">لأصحاب العمل في البحرين.</span>',
  lead:
    'الشهر الأول الجيد يحدد غالبًا هل سيبقى الموظف الجديد أم لا، والتسجيل المنسي قد يتحول إلى غرامة أو مشكلة رواتب بعد أشهر. تغطي هذه القائمة الجانبين: الخطوات القانونية والإدارية التي يجب أن تتم، والخطوات الإنسانية التي تجعل الموظف منتجًا بسرعة.',
  body: `
<h2>لماذا تحتاج التهيئة إلى قائمة مكتوبة</h2>
<p>في الشركة النامية، يأتي التوظيف على دفعات. شهر لا توظّف فيه أحدًا، وفي الشهر التالي يبدأ ثلاثة موظفين في يوم الأحد نفسه. ومن دون قائمة، تكون أهم الخطوات هي التي تُنسى: التسجيل في التأمين الاجتماعي، وبيانات الحساب البنكي لملف الرواتب، والنسخة الموقعة من العقد. هذه المشكلات لا تُرى في اليوم الأول، لكنها مؤلمة في الشهر الثالث.</p>
<p>قسّمنا القائمة التالية إلى أربع مراحل: قبل اليوم الأول، واليوم الأول، والأسبوع الأول، والأيام التسعون الأولى. وفي النهاية جدول بمن يتولى كل خطوة عادة، وقسم عن الفروق بين توظيف عامل بحريني وعامل غير بحريني.</p>

<h2>المرحلة 1: قبل اليوم الأول</h2>
<h3>العرض والعقد</h3>
<ul>
  <li>أرسل عرضًا مكتوبًا يذكر المسمى الوظيفي، وتاريخ المباشرة، والراتب الأساسي، وكل بدل، وساعات العمل، ومكان العمل، وفترة التجربة.</li>
  <li>جهّز عقد العمل. فبموجب قانون العمل رقم 36 لسنة 2012، يكون العقد مكتوبًا، ويحدد القانون البيانات التي يجب أن يتضمنها، كأطراف العقد، والأجر، وطبيعة العمل، ومدته إن كان محدد المدة. احتفظ بنسخة موقعة للعامل وأخرى للملف.</li>
  <li>إذا كان العامل لا يجيد قراءة العربية، فوفّر العقد أيضًا بلغة يفهمها. واسأل وزارة العمل أو محاميك أي النسختين يُعتمد إذا اختلفتا.</li>
</ul>
<h3>الهوية والتصاريح</h3>
<ul>
  <li><strong>العمال البحرينيون:</strong> احصل على نسخة من البطاقة الذكية (الرقم الشخصي).</li>
  <li><strong>العمال غير البحرينيين:</strong> يجب أن يصدر تصريح العمل من هيئة تنظيم سوق العمل قبل أن يبدأ العامل. وبحسب مكان قدوم العامل، قد يشمل ذلك تأشيرة دخول وفحصًا طبيًا وأخذ البصمات، ثم إصدار البطاقة الذكية أو تحديثها. لا تدع أحدًا يبدأ العمل على وعد بأن التصريح "على وشك الصدور".</li>
  <li>سجّل كل تواريخ الانتهاء (جواز السفر، والبطاقة الذكية، وتصريح العمل، والإقامة) في مكان واحد مع تذكيرات، حتى يبدأ التجديد قبل الموعد بوقت كافٍ.</li>
</ul>
<h3>الرواتب والتأمين الاجتماعي</h3>
<ul>
  <li>سجّل العامل في الهيئة العامة للتأمين الاجتماعي من تاريخ المباشرة الصحيح. ومواعيد التسجيل تحددها الهيئة، فتحقق منها وسجّل مبكرًا لا متأخرًا.</li>
  <li>اجمع بيانات الحساب البنكي أو المحفظة لنظام حماية الأجور، على أن يكون الحساب باسم العامل نفسه.</li>
  <li>أضف العامل إلى الرواتب بتاريخ المباشرة الصحيح حتى يُحسب أول راتب تناسبيًا بشكل صحيح.</li>
</ul>
<h3>التجهيزات العملية</h3>
<ul>
  <li>اطلب الحاسوب والهاتف وبطاقة الدخول والزي أو الأدوات.</li>
  <li>أنشئ البريد الإلكتروني وحسابات الأنظمة، مع منح الصلاحيات التي يحتاجها الدور فقط.</li>
  <li>عيّن زميلًا مرافقًا، من غير المدير، يستطيع الموظف الجديد أن يسأله الأسئلة الصغيرة.</li>
  <li>أرسل رسالة ترحيب قصيرة فيها الموعد والعنوان وتفاصيل المواقف أو المواصلات وقواعد اللباس ومن سيستقبله.</li>
</ul>

<h2>المرحلة 2: اليوم الأول</h2>
<ul>
  <li>استقبله عند الباب. فالدقائق العشر الأولى تحدد الانطباع.</li>
  <li>اجمع أي مستندات ناقصة، ووقّعوا أي شيء لم يُوقّع بعد.</li>
  <li>سلّمه الأجهزة وسجّلها في قائمة عهدة يوقع عليها العامل.</li>
  <li>اشرح ساعات العمل، وفترات الراحة، وطريقة طلب الإجازة، وطريقة الإبلاغ عن المرض، ونظام الحضور.</li>
  <li>اشرح أساسيات الصحة والسلامة في مكان العمل، ومنها مخارج الطوارئ والإسعافات الأولية.</li>
  <li>اشرح كيف تُعالج البيانات الشخصية (انظر قسم قانون حماية البيانات أدناه).</li>
  <li>تناولوا الغداء مع الفريق. يبدو أمرًا صغيرًا، لكنه ليس كذلك.</li>
</ul>

<h2>المرحلة 3: الأسبوع الأول</h2>
<ul>
  <li>قدّم خطة مكتوبة قصيرة للأسبوع: من سيقابل، وماذا سيتعلم، ومهمة حقيقية صغيرة يستطيع إنجازها.</li>
  <li>عرّفه بالأدوات الداخلية الرئيسية، وبأهم العملاء أو الموردين الذين سيتعامل معهم.</li>
  <li>شاركه السياسات الأساسية: قواعد السلوك، والإجازات، والمصروفات، واستخدام التقنية والبيانات.</li>
  <li>في نهاية الأسبوع، يعقد المدير لقاء متابعة مدته ربع ساعة: ما الواضح، وما المربك، وما الناقص.</li>
</ul>

<h2>المرحلة 4: الأيام التسعون الأولى وفترة التجربة</h2>
<p>يسمح قانون العمل بفترة تجربة يجب النص عليها في العقد. ويقيّد القانون مدتها ويبيّن كيف يمكن لأي من الطرفين إنهاء العقد خلالها؛ والحد الأقصى المتداول عادة ثلاثة أشهر، ولا يجوز وضع العامل تحت التجربة أكثر من مرة لدى صاحب العمل نفسه. ولأن التفاصيل مهمة عند أي خلاف، تأكد من القواعد الحالية لدى وزارة العمل قبل الاعتماد عليها.</p>
<p>استخدم فترة التجربة لما وُضعت له: اختبار صادق في الاتجاهين.</p>
<ol>
  <li><strong>حدّد التوقعات في الأسبوع الأول.</strong> اكتب ثلاثة إلى خمسة أمور يجب أن يتقنها الموظف الجديد بنهاية فترة التجربة.</li>
  <li><strong>تابع عند اليوم 30 واليوم 60.</strong> حديث قصير موثّق في كل مرة. وإذا كان هناك خلل، فقل ذلك مبكرًا، وبيّن ما الذي يجب أن يتغير.</li>
  <li><strong>قرّر قبل تاريخ الانتهاء.</strong> لا تدع فترة التجربة تنتهي سهوًا. ضع تاريخ نهايتها في التقويم مع تذكير قبلها بأسبوعين.</li>
  <li><strong>أكّد كتابيًا.</strong> عندما تنتهي فترة التجربة بنجاح، أبلغ العامل كتابيًا. أمر صغير لكن الناس يتذكرونه.</li>
</ol>

<h2>البيانات الشخصية: ماذا يعني قانون حماية البيانات للتهيئة</h2>
<p>تجمع التهيئة كثيرًا من البيانات الشخصية: نسخ الهوية، وبيانات الجواز، والحسابات البنكية، والعناوين، وجهات الاتصال في الطوارئ، وأحيانًا معلومات طبية. وينطبق هنا قانون حماية البيانات الشخصية في البحرين (القانون رقم 30 لسنة 2018). وعمليًا:</p>
<ul>
  <li><strong>اجمع ما تحتاجه فقط.</strong> إذا لم يكن المستند مطلوبًا لغرض قانوني أو تجاري واضح، فلا تطلبه.</li>
  <li><strong>أخبر الناس بالسبب.</strong> إشعار خصوصية قصير للموظفين يشرح ما تجمعه، ولماذا، ومن يطّلع عليه، وكم تحتفظ به.</li>
  <li><strong>تعامل مع البيانات الحساسة بعناية إضافية.</strong> المعلومات الصحية وما يشبهها لها قواعد أشد. احفظها منفصلة وقيّد الوصول إليها بإحكام.</li>
  <li><strong>أحكم الحماية.</strong> لا ينبغي أن تكون ملفات الموارد البشرية في مجلد مشترك يفتحه الجميع، ولا في بريد شخصي أو محادثات.</li>
  <li><strong>احذف في الموعد.</strong> احتفظ بالسجلات للمدة التي يتطلبها القانون، ثم تخلّص منها بطريقة آمنة.</li>
</ul>

<h2>من يتولى كل خطوة</h2>
<p>في الشركة الصغيرة قد يجمع شخص واحد عدة أدوار. المهم أن يكون بجانب كل خطوة اسم.</p>
<div class="table-wrap"><table>
  <thead><tr><th>الخطوة</th><th>المسؤول المعتاد</th><th>متى</th></tr></thead>
  <tbody>
    <tr><td>خطاب العرض والعقد</td><td>الموارد البشرية، باعتماد المدير</td><td>قبل اليوم الأول</td></tr>
    <tr><td>تصريح العمل والتأشيرة (للأجانب)</td><td>الموارد البشرية أو مندوب العلاقات الحكومية</td><td>قبل اليوم الأول</td></tr>
    <tr><td>التسجيل في التأمين الاجتماعي</td><td>الموارد البشرية أو الرواتب</td><td>في تاريخ المباشرة أو قبله</td></tr>
    <tr><td>بيانات الحساب البنكي لنظام WPS</td><td>الرواتب</td><td>قبل أول دورة رواتب</td></tr>
    <tr><td>الأجهزة والحسابات</td><td>تقنية المعلومات أو مدير المكتب</td><td>قبل اليوم الأول</td></tr>
    <tr><td>الترحيب والزميل المرافق وخطة الأسبوع الأول</td><td>المدير المباشر</td><td>من اليوم الأول إلى الأسبوع الأول</td></tr>
    <tr><td>السياسات وإشعار البيانات</td><td>الموارد البشرية</td><td>اليوم الأول</td></tr>
    <tr><td>مراجعات الأيام 30 و60 و90</td><td>المدير المباشر</td><td>خلال فترة التجربة</td></tr>
    <tr><td>متابعة تواريخ انتهاء المستندات</td><td>الموارد البشرية</td><td>بشكل مستمر</td></tr>
  </tbody>
</table></div>

<h2>توظيف البحرينيين وغير البحرينيين: الفروق الرئيسية</h2>
<ul>
  <li><strong>التصاريح.</strong> يحتاج العامل غير البحريني إلى تصريح عمل من هيئة تنظيم سوق العمل قبل المباشرة، إضافة إلى إجراءات الإقامة والبطاقة الذكية. أما العامل البحريني فلا يحتاج إلى تصريح عمل.</li>
  <li><strong>المدة اللازمة.</strong> التوظيف من الخارج قد يستغرق أسابيع بسبب التأشيرات والفحوص الطبية والسفر. خطط لتاريخ المباشرة على هذا الأساس.</li>
  <li><strong>التأمين الاجتماعي.</strong> يُسجَّل الاثنان في الهيئة العامة للتأمين الاجتماعي، لكن الفروع المشمولة ونسب الاشتراك تختلف بين البحرينيين وغير البحرينيين. تحقق من القواعد الحالية لدى الهيئة.</li>
  <li><strong>الرسوم.</strong> لتصاريح العمل رسوم حكومية يدفعها صاحب العمل، وتنشر هيئة تنظيم سوق العمل الرسوم الحالية.</li>
  <li><strong>تواريخ الانتهاء.</strong> ملفات العمال الأجانب فيها تواريخ انتهاء أكثر للمتابعة، وأي تجديد فائت قد يمنع العامل من العمل بشكل قانوني.</li>
</ul>

<h2>مثال محلول: التخطيط لتاريخ المباشرة</h2>
<p>لنفترض أنك قدمت عرض عمل في 1 مارس لمرشح يقيم حاليًا خارج البحرين. قد تسير الخطوات كالتالي: يوقع المرشح العرض خلال أيام؛ تتقدم بطلب تصريح العمل عبر هيئة تنظيم سوق العمل؛ وبعد الموافقة يسافر المرشح؛ وعند وصوله تأتي الإجراءات الطبية والبيومترية قبل إصدار البطاقة الذكية أو تحديثها. وإذا تأخرت أي خطوة، يتأخر تاريخ المباشرة. والخطة الواقعية تحدد تاريخ المباشرة بعد الموافقة على التصريح فقط، وتُبقي خطة الأسبوع الأول مرنة. أما المرشح الموجود داخل البحرين بتصريح قابل للنقل، فالإجراءات عادة أقصر، لكن يجب أن تكتمل قبل أن يبدأ العمل.</p>

<h2>الأسئلة الشائعة</h2>
<h3>هل يجوز أن يبدأ الموظف الجديد قبل صدور تصريح العمل؟</h3>
<p>لا. لا ينبغي للعامل غير البحريني أن يبدأ العمل قبل صدور تصريح العمل من هيئة تنظيم سوق العمل. فالعمل دون تصريح ساري المفعول يعرّض صاحب العمل والعامل معًا للمخاطر القانونية.</p>
<h3>متى نسجل الموظف الجديد في التأمين الاجتماعي؟</h3>
<p>من تاريخ مباشرته، وضمن المهلة التي تحددها الهيئة العامة للتأمين الاجتماعي. فالتسجيل المتأخر قد يؤدي إلى غرامات وإلى فجوات في سجل العامل التأميني، لذلك اجعله جزءًا من قائمة ما قبل المباشرة.</p>
<h3>كم يمكن أن تطول فترة التجربة؟</h3>
<p>يقيّد قانون العمل فترة التجربة ويشترط النص عليها في العقد، والحد الأقصى المتداول ثلاثة أشهر. تأكد من القاعدة الحالية لدى وزارة العمل.</p>
<h3>هل نحتاج إلى موافقة العامل لحفظ نسخ هويته؟</h3>
<p>بموجب قانون حماية البيانات الشخصية، تحتاج إلى أساس قانوني لمعالجة البيانات الشخصية، والتزامات التوظيف توفر هذا الأساس في حالات كثيرة. ومع ذلك يجب أن تُعلم الموظفين بما تحتفظ به ولماذا. أما البيانات الحساسة فاطلب فيها المشورة.</p>
<h3>ما أكثر خطوة تُنسى في التهيئة؟</h3>
<p>تسجيل تواريخ انتهاء المستندات مع تذكيرات. لا تكلف شيئًا في اليوم الأول، وتمنع مشكلات حقيقية بعد عام.</p>

<p>إذا كنت تبني روتينًا للتهيئة وتريد نظامًا يتابع هذه الخطوات عنك، <a href="/ar/contact/">يسعد فريق RAL Technologies أن يساعدك</a>.</p>
<p><em>هذا المقال معلومات عامة وليس استشارة قانونية. قواعد العقود وفترة التجربة والتصاريح والتأمين الاجتماعي تحددها وزارة العمل وهيئة تنظيم سوق العمل والهيئة العامة للتأمين الاجتماعي، وقد تتغير؛ تأكد من المتطلبات الحالية منهم.</em></p>
`,
}

export const en = [payrollEn, onboardingEn]
export const ar = [payrollAr, onboardingAr]
