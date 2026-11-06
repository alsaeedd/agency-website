// Insights articles on HR, payroll and local business software in Bahrain.
// Imported by content/pages.mjs. Same rules as the rest of the content: no
// invented clients, numbers, prices or awards. Where a government rule can
// change (SIO rates, WPS scope), the article explains the mechanism and points
// readers to the official source instead of quoting figures that may go stale.

const D = '2026-11-06'

export const hrArticles = [
  // ── WPS ─────────────────────────────────────────────────────────────────
  {
    path: '/insights/wps-payroll-bahrain-guide/',
    type: 'article',
    published: D,
    readMinutes: 7,
    tag: 'Payroll',
    title: 'WPS payroll in Bahrain: a practical guide for employers',
    description:
      'How the LMRA Wage Protection System works for Bahrain employers, what a WPS salary file contains, why files get rejected, and how to build a monthly payroll routine that passes first time.',
    eyebrow: 'Insights · Payroll',
    h1: 'WPS payroll in Bahrain: <span class="serif">a practical guide for employers.</span>',
    lead:
      'The Wage Protection System changed payroll in Bahrain from a private matter between employer and bank into something the Labour Market Regulatory Authority can see. This guide explains how it works in plain terms and how to make the monthly cycle calm instead of stressful.',
    updated: D,
    body: `
<h2>What WPS is, in one paragraph</h2>
<p>The Wage Protection System (WPS) is run by the Labour Market Regulatory Authority (LMRA). Its purpose is simple: to make sure workers are paid the wages they are owed, on time, through a channel that leaves a record. Instead of paying salaries in cash or by informal transfer, employers pay through a bank or a licensed payment provider that takes part in the system, and they submit a salary information file that describes each payment. The LMRA can then compare what was paid against what each worker is registered to receive.</p>
<p>The system was introduced in phases, starting with larger employers and extending to smaller ones over time. The exact scope, deadlines and file specifications are set by the LMRA and the participating banks, and they can change. Always check the LMRA's current guidance and your bank's WPS instructions before relying on any summary, including this one.</p>

<h2>Why it matters to a small business</h2>
<p>For a company with a handful of employees, it is tempting to see WPS as paperwork. In practice it changes three things:</p>
<ul>
  <li><strong>Payroll mistakes become visible.</strong> A salary paid late, paid short, or paid to the wrong account is no longer a quiet internal issue. It shows up in a record that a regulator can review.</li>
  <li><strong>Your HR records have to match reality.</strong> The salary you pay should agree with what is registered for the worker. If your records say one thing and your bank transfer says another, someone will ask why.</li>
  <li><strong>The file itself has to be right.</strong> A salary file with a wrong account number, a missing identifier or a total that does not add up can be rejected, which delays everybody's pay.</li>
</ul>

<h2>What goes into a salary file</h2>
<p>Each bank publishes its own template and validation rules, so the precise layout varies. The information inside is broadly the same everywhere:</p>
<ul>
  <li><strong>Employer details:</strong> the company's identifiers as registered with the authorities and the bank, and the account the salaries are paid from.</li>
  <li><strong>Employee identity:</strong> usually the CPR number or another identifier that links the payment to the right person.</li>
  <li><strong>Where the money goes:</strong> the employee's bank account or IBAN, or their wallet with a licensed provider.</li>
  <li><strong>What is being paid:</strong> the pay period, the basic salary, allowances, and deductions, which together explain the net amount.</li>
  <li><strong>Totals:</strong> a count of records and a total amount that must match the sum of the lines.</li>
</ul>
<p>None of this is complicated on its own. The trouble is that it lives in different places: identity numbers in an HR folder, bank details in emails, salaries in a spreadsheet, and this month's deductions in someone's head.</p>

<h2>The most common reasons a file is rejected</h2>
<p>From the payroll workflows we have looked at, the problems are rarely exotic. They are almost always data quality problems:</p>
<ol>
  <li><strong>Typos in IBANs or account numbers.</strong> One wrong character and the line fails.</li>
  <li><strong>Out of date identity details.</strong> A renewed document with a new number that never made it into the payroll sheet.</li>
  <li><strong>Totals that do not reconcile.</strong> A row added or deleted at the last minute without updating the summary line.</li>
  <li><strong>Formatting drift.</strong> Dates in the wrong format, numbers saved as text, or an extra column added by someone trying to be helpful.</li>
  <li><strong>New joiners and leavers.</strong> Someone who started mid-month or left last week, handled differently from everyone else, and handled by hand.</li>
</ol>
<p>Every one of these is preventable with validation before the file leaves the building.</p>

<h2>A monthly routine that works</h2>
<p>A calm payroll month follows the same steps every time, in the same order:</p>
<ol>
  <li><strong>Lock the inputs.</strong> Agree a cut-off date for attendance, overtime, leave and one-off payments. Anything after the cut-off goes into next month.</li>
  <li><strong>Update people records first.</strong> Joiners, leavers, salary changes and new bank details are entered into the employee record, not patched into the payroll sheet.</li>
  <li><strong>Calculate, then review.</strong> Produce the payroll and compare it with last month. Any employee whose net pay changed should have a reason you can name.</li>
  <li><strong>Generate the file from the same data.</strong> The salary file should be produced from the approved payroll, never retyped.</li>
  <li><strong>Validate before uploading.</strong> Check IBAN formats, required fields, record counts and totals against the bank's rules.</li>
  <li><strong>Keep the evidence.</strong> Save the approved payroll, the file you uploaded and the bank's confirmation together for that month.</li>
</ol>

<h2>Where software helps, and where it does not</h2>
<p>Software cannot decide your pay policy, and it cannot fix a contract that says one thing while practice says another. What it can do is remove the retyping. When the employee record, the payroll calculation and the salary file all come from one place, the classic errors mostly disappear: a bank detail is entered once and checked once, totals are calculated rather than typed, and the file format is produced by code that does not get tired at the end of the month.</p>
<p>This is the approach we took in RAL HR, our HR system for businesses in Bahrain. Payroll produces the LMRA WPS salary file from the approved payroll and checks it before download, so what you upload to the bank matches what you approved. Whatever tool you use, the principle is the same: one source of truth, validation before submission, and a record of what was sent.</p>

<h2>A short checklist</h2>
<ul>
  <li>Do you know which of your workers are in scope for WPS under the LMRA's current rules?</li>
  <li>Is every employee's bank or wallet detail stored in one place, and checked when it changes?</li>
  <li>Is your salary file generated from the payroll, or rebuilt by hand every month?</li>
  <li>Do you check totals and record counts before upload?</li>
  <li>Can you find last March's file and the bank's confirmation in under a minute?</li>
</ul>
<p>If any answer is "no" or "not sure", that is the place to start. And if you would like to see how a system handles it end to end, <a href="/contact/">get in touch</a>.</p>
<p><em>This article is general information, not legal or payroll advice. Rules and file formats are set by the LMRA and your bank and may change; confirm current requirements with them.</em></p>
`,
  },

  // ── SIO ─────────────────────────────────────────────────────────────────
  {
    path: '/insights/sio-contributions-explained/',
    type: 'article',
    published: D,
    readMinutes: 7,
    tag: 'Payroll',
    title: 'SIO contributions explained for Bahrain employers',
    description:
      'A plain-language explanation of Social Insurance Organization contributions in Bahrain: who is covered, what the contributions fund, how the monthly cycle works, and how to avoid the usual mistakes.',
    eyebrow: 'Insights · Payroll',
    h1: 'SIO contributions explained <span class="serif">for Bahrain employers.</span>',
    lead:
      'Every employer in Bahrain deals with the Social Insurance Organization, but few people can explain clearly what is being paid, for whom, and why. This is the explanation we wish we had been given.',
    updated: D,
    body: `
<h2>Who the SIO is</h2>
<p>The Social Insurance Organization (SIO) administers Bahrain's social insurance schemes. For private sector employers, that means registering your business and your employees with the SIO and paying monthly contributions on their wages. Those contributions fund benefits such as retirement pensions for Bahraini employees, insurance against work injuries, and unemployment insurance.</p>
<p>We deliberately do not quote contribution percentages in this article. The rates, the wage limits they apply to, and how they are split between employer and employee are set by law and have been revised in recent years. The SIO website and its employer services are the authoritative source. What does not change much is the mechanism, and that is what this guide explains.</p>

<h2>Bahraini and non-Bahraini employees are treated differently</h2>
<p>This is the single most important thing to understand. The schemes that apply to an employee depend on their nationality:</p>
<ul>
  <li><strong>Bahraini employees</strong> are covered by the full set of schemes, including the pension scheme for old age, disability and death. Contributions are shared between employer and employee, so part is deducted from the employee's salary and part is paid by the employer on top.</li>
  <li><strong>Non-Bahraini employees</strong> are covered by a narrower set of schemes, such as work injury insurance. In recent years Bahrain has also changed how end of service benefits for non-Bahraini workers are handled, moving towards monthly contributions through the SIO rather than a lump sum calculated by the employer at the end. Check the SIO's current guidance to see exactly what applies to your workforce.</li>
</ul>
<p>Because the two groups are calculated differently, a single "SIO percentage" column in a spreadsheet is almost always wrong for somebody.</p>

<h2>What the contribution is calculated on</h2>
<p>Contributions are calculated on the wage registered with the SIO for each employee, within the minimum and maximum limits the SIO sets. Which pay elements count towards that wage is defined by the rules, so it is worth checking how allowances are treated rather than assuming. Two practical consequences follow:</p>
<ul>
  <li><strong>Registration has to be kept up to date.</strong> When an employee's salary changes, the registered wage should change too. If it does not, you will be paying contributions on the wrong amount.</li>
  <li><strong>Joiners and leavers matter.</strong> Registering a new employee promptly, and ending the registration when someone leaves, keeps the monthly amount correct and avoids arrears.</li>
</ul>

<h2>The monthly cycle</h2>
<ol>
  <li><strong>Payroll is finalised.</strong> Salary changes, joiners and leavers for the month are confirmed.</li>
  <li><strong>Employee share is deducted.</strong> For employees who contribute, their share is deducted in the payroll and shown on the payslip.</li>
  <li><strong>Employer share is calculated.</strong> The employer's contributions are worked out per employee, according to the schemes that apply to them.</li>
  <li><strong>The amount due is checked against the SIO's figures.</strong> The SIO issues its own statement for the employer. Your calculation and theirs should agree, and any difference is a signal that a registration is out of date.</li>
  <li><strong>Payment is made by the due date.</strong> Late payment can bring penalties, so the SIO payment belongs on the payroll calendar next to the salary run.</li>
</ol>

<h2>Common mistakes</h2>
<ul>
  <li><strong>Applying one rate to everyone.</strong> The Bahraini and non-Bahraini calculations differ, as explained above.</li>
  <li><strong>Forgetting to update the registered wage.</strong> A raise in January that is only reflected at the SIO in June means months of contributions on the wrong base.</li>
  <li><strong>Hard-coding rates in a spreadsheet.</strong> When the law changes, every formula has to be found and updated, and one is always missed.</li>
  <li><strong>Not reconciling.</strong> If you never compare your figure with the SIO's statement, errors accumulate quietly.</li>
  <li><strong>Treating end of service as a problem for later.</strong> Whatever the current arrangement for your workforce, it should be calculated and recorded as you go, not reconstructed when someone resigns.</li>
</ul>

<h2>How software should handle it</h2>
<p>A good HR or payroll system treats social insurance as rules, not as a column. It should know each employee's nationality and registered wage, apply the right schemes to each person, keep rates in one configurable place so a change in the law is a single update, and produce a register you can reconcile against the SIO's statement.</p>
<p>In RAL HR, SIO contributions are calculated every month for Bahraini and non-Bahraini staff, together with end of service, and a register is produced alongside the payroll. Whatever system you use, ask the vendor to show you exactly where the rates live and how they are updated when the rules change.</p>

<h2>Where to get authoritative answers</h2>
<p>For anything that affects an actual payment, rely on the SIO directly: its website, its employer services, and its published circulars. If your situation is unusual, such as part-time staff, employees seconded from abroad, or employees with more than one employer, ask the SIO or a qualified adviser before you calculate.</p>
<p>If you want to see how contributions, payroll and payslips can come from one set of records, <a href="/contact/">talk to us</a>.</p>
<p><em>This article is general information, not legal, tax or payroll advice. Contribution rates and rules are set by Bahraini law and the SIO and may change.</em></p>
`,
  },

  // ── Document expiry ─────────────────────────────────────────────────────
  {
    path: '/insights/hr-document-expiry-tracking/',
    type: 'article',
    published: D,
    readMinutes: 6,
    tag: 'HR',
    title: 'Tracking CPR, visa and work permit expiries without a spreadsheet',
    description:
      'Why employee document expiries get missed, what a reliable tracking process looks like, and how to set reminders and ownership so CPR cards, passports, visas and work permits are renewed on time.',
    eyebrow: 'Insights · HR',
    h1: 'Tracking document expiries <span class="serif">without a spreadsheet.</span>',
    lead:
      'In a Bahrain business with an international team, every employee comes with a set of documents that expire: CPR cards, passports, residence permits, work permits, driving licences, professional licences and more. Missing one is rarely dramatic on the day. It becomes expensive a few weeks later.',
    updated: D,
    body: `
<h2>Why expiries get missed</h2>
<p>Almost every company starts with a spreadsheet: one row per employee, one column per document, an expiry date in each cell, maybe some conditional formatting that turns a cell red. It works for a while. Then it fails in predictable ways:</p>
<ul>
  <li><strong>Nobody opens it.</strong> A red cell only helps if someone looks at the sheet. Spreadsheets do not send reminders on their own.</li>
  <li><strong>Dates are not updated after renewal.</strong> The document is renewed, the new copy is filed somewhere, and the sheet still shows the old date. Now the tracker is wrong in both directions.</li>
  <li><strong>New document types are added inconsistently.</strong> One person adds a column for medical certificates, another writes them in a notes field.</li>
  <li><strong>Ownership is unclear.</strong> Is it HR's job to chase the renewal, the manager's, or the employee's? When everyone assumes someone else is on it, no one is.</li>
  <li><strong>Lead time is ignored.</strong> Some renewals take days, others take weeks and depend on another document being valid first. A reminder on the expiry date is too late.</li>
</ul>

<h2>What a reliable process looks like</h2>
<p>Good expiry tracking is less about technology and more about four habits. Software just makes them stick.</p>

<h3>1. One record per document, not per employee</h3>
<p>Each document should be its own record: type, number, issue date, expiry date, a scanned copy, and the employee it belongs to. That way an employee can have any number of documents, and a renewal creates a new record with its own dates while the old one stays in the history.</p>

<h3>2. A standard list of document types</h3>
<p>Decide which document types your business tracks and use that list everywhere. For each type, set a reminder lead time that reflects how long renewal actually takes. A passport may need months; a parking permit may need days.</p>

<h3>3. Reminders that go to a named person</h3>
<p>A reminder should go to someone who can act, at the right time, and repeat until the record is updated. Useful patterns are a first notice well ahead of expiry, a second closer to the date, and an escalation to a manager if the document actually expires. Many teams also send a reminder to the employee directly, since they often hold the original documents.</p>

<h3>4. Renewal closes the loop</h3>
<p>The reminder should only stop when a new document with a later expiry date is recorded. "Marked as done" without new dates is how trackers drift from reality.</p>

<h2>A weekly view that people actually read</h2>
<p>Alongside individual reminders, a short weekly summary helps: documents expiring in the next 30, 60 and 90 days, grouped by department, plus anything already expired. Keep it to one screen. A long report gets ignored; a short list of names gets acted on.</p>

<h2>Handling personal data properly</h2>
<p>Identity documents are personal data, and in Bahrain the Personal Data Protection Law (Law No. 30 of 2018) applies to how you collect, store and use them. Practical steps:</p>
<ul>
  <li>Store scans in a system with access control, not in a shared folder or a chat group.</li>
  <li>Limit who can view documents to the people who need them, typically HR and the employee concerned.</li>
  <li>Keep a record of who accessed or changed a document.</li>
  <li>Decide how long you keep copies after an employee leaves, and follow that rule.</li>
</ul>

<h2>Where a system helps</h2>
<p>Everything above can be done with discipline and a calendar. Most businesses find it easier with a system that holds the documents, knows the expiry dates, and sends the reminders without anyone remembering to look. In RAL HR, expiry alerts are part of the core product alongside leave and attendance, because in our experience missed CPR, visa and permit renewals are one of the most common pain points for HR teams in Bahrain.</p>
<p>Whichever route you choose, start by listing every document type you need to track and who owns each renewal. That list alone will show you where the gaps are.</p>
<p>Questions about setting this up for your team? <a href="/contact/">Get in touch</a>.</p>
`,
  },

  // ── AI assistant for HR ────────────────────────────────────────────────
  {
    path: '/insights/ai-assistant-for-hr/',
    type: 'article',
    published: D,
    readMinutes: 7,
    tag: 'AI',
    title: 'What an AI assistant can and cannot do for HR',
    description:
      'A grounded look at AI assistants inside HR software: the employee questions and requests they handle well, the guardrails they need, and the decisions that must stay with people.',
    eyebrow: 'Insights · AI',
    h1: 'What an AI assistant can <span class="serif">and cannot do for HR.</span>',
    lead:
      "Most of an HR team's day is spent answering the same questions: how many leave days do I have, where is my payslip, what is the policy on sick leave. An AI assistant can take a large share of that. It can also cause real harm if it is given the wrong job. Here is where we draw the line.",
    updated: D,
    body: `
<h2>The questions HR answers every day</h2>
<p>Ask any HR officer in a small or medium business what fills their inbox and the list is familiar:</p>
<ul>
  <li>"How many annual leave days do I have left?"</li>
  <li>"Can you send me my payslip for last month?"</li>
  <li>"I want to book leave from the 10th to the 14th."</li>
  <li>"What is the policy if I am sick on a working day?"</li>
  <li>"When does my visa expire?"</li>
  <li>"Who approves my overtime?"</li>
</ul>
<p>None of these need human judgement. They need someone to look up a record, apply a known rule, or start a standard request. That is exactly the kind of work a well-designed assistant handles well.</p>

<h2>What an assistant is good at</h2>
<h3>Answering from the employee's own records</h3>
<p>When the assistant is connected to the HR system, it can answer "how many leave days do I have" from the actual leave balance, not from a guess. The key word is connected. An assistant that only has a general language model behind it will produce a confident answer that may be wrong. An assistant that reads the employee's real record and shows where the answer came from is useful.</p>

<h3>Turning requests into actions</h3>
<p>"Book my leave from the 10th to the 14th" is a request, not a question. A good assistant turns it into the same leave request the employee would have filled in on a form, shows it back for confirmation, and sends it into the normal approval flow. The manager still approves. The assistant just removes the form-filling.</p>

<h3>Explaining policy in plain words</h3>
<p>Company policies are often long documents nobody reads. An assistant that has the policy text can answer a specific question and point to the relevant section. This works best when the policy is the company's own approved document, kept up to date, and the assistant quotes it rather than paraphrasing loosely.</p>

<h3>Working in the language people use</h3>
<p>In Bahrain, teams are multilingual. People type in English, in Arabic, and in a mix of both. Modern language models handle this well, which removes a real barrier for staff who are not comfortable with a form-heavy interface.</p>

<h2>What an assistant must not do</h2>
<ul>
  <li><strong>Make decisions about people.</strong> Approving or rejecting leave, setting salaries, handling disciplinary matters, hiring and dismissal are decisions for people, with accountability. An assistant can prepare information for them; it should not make the call.</li>
  <li><strong>Show anyone else's data.</strong> An employee asking about their own payslip should see only their own payslip. Permissions must be enforced by the system, not left to the assistant's good behaviour.</li>
  <li><strong>Invent answers.</strong> If the assistant does not know, it should say so and route the question to HR. A wrong answer about pay or legal entitlements is worse than no answer.</li>
  <li><strong>Give legal advice.</strong> Explaining the company's own policy is fine. Interpreting labour law for a specific dispute is a job for HR and qualified advisers.</li>
</ul>

<h2>Guardrails that make it safe</h2>
<ol>
  <li><strong>Permissions first.</strong> The assistant acts as the logged-in user and can only see and do what that user could already see and do.</li>
  <li><strong>Confirmation before action.</strong> Anything that creates or changes a record is shown back to the user before it is submitted.</li>
  <li><strong>Sources shown.</strong> Answers based on records or policy say where they came from.</li>
  <li><strong>A clear handover.</strong> Every conversation has an easy path to a human.</li>
  <li><strong>A log.</strong> What was asked and what was done is recorded, so problems can be investigated and the assistant improved.</li>
  <li><strong>Data protection.</strong> Employee data is personal data under Bahrain's Personal Data Protection Law (Law No. 30 of 2018). Know where the assistant's processing happens and what is stored.</li>
</ol>

<h2>How we approached it in RAL HR</h2>
<p>We built Ask RAL as the core of RAL HR, not as an add-on. Staff and managers can type a question or a request in their own words, such as "book my leave" or "show my payslip", and Ask RAL answers from their records or starts the right request for them. It works within each user's permissions, and approvals still go to the people who own them. Ask RAL is included in every RAL HR plan, because an assistant that only some staff can use does not reduce HR's workload much.</p>

<h2>How to evaluate any HR assistant</h2>
<p>If you are comparing products, try these tests during a demo:</p>
<ul>
  <li>Ask for another employee's salary while logged in as a regular employee. It should refuse.</li>
  <li>Ask a question the policy does not cover. It should say it does not know and offer a handover.</li>
  <li>Make a leave request in a casual sentence. It should produce a proper request and ask you to confirm.</li>
  <li>Ask in Arabic, then in English. Both should work.</li>
  <li>Ask where your data is processed and stored. You should get a clear answer.</li>
</ul>
<p>An assistant that passes these is a genuine time saver. One that fails them is a risk. If you would like to see Ask RAL in action, <a href="/contact/">contact us</a>.</p>
`,
  },

  // ── Choosing an HR system ──────────────────────────────────────────────
  {
    path: '/insights/choosing-an-hr-system-bahrain/',
    type: 'article',
    published: D,
    readMinutes: 8,
    tag: 'HR',
    title: 'Choosing an HR system in Bahrain: a practical checklist',
    description:
      'What a Bahrain business should look for in an HR and payroll system: local payroll rules, WPS and SIO, document expiry, Arabic support, data protection, mobile access and a sensible migration plan.',
    eyebrow: 'Insights · HR',
    h1: 'Choosing an HR system in Bahrain: <span class="serif">a practical checklist.</span>',
    lead:
      'Most HR software is built for a generic market and then adapted. In Bahrain, the details that matter most are local: LMRA, SIO, CPR numbers, end of service, and a workforce that mixes nationalities and languages. Here is a checklist for separating a good fit from a polished demo.',
    updated: D,
    body: `
<h2>Start with your own list, not the vendor's</h2>
<p>Before you look at any product, write down the five tasks that take your HR team the most time or cause the most mistakes. For many companies in Bahrain the list looks something like: running payroll, producing the WPS salary file, calculating SIO contributions, tracking document expiries, and answering staff questions about leave and payslips. That list is your scorecard. A system that is beautiful but does not remove those five pains is not the right system.</p>

<h2>1. Local payroll, done properly</h2>
<ul>
  <li><strong>WPS:</strong> can it produce the LMRA WPS salary file directly from the approved payroll, and does it validate the file before you upload it? See our <a href="/insights/wps-payroll-bahrain-guide/">guide to WPS payroll</a>.</li>
  <li><strong>SIO:</strong> does it calculate contributions differently for Bahraini and non-Bahraini employees, and where are the rates stored when the law changes? See <a href="/insights/sio-contributions-explained/">SIO contributions explained</a>.</li>
  <li><strong>End of service:</strong> is it calculated and tracked as you go, in line with current rules, rather than worked out in a spreadsheet when someone resigns?</li>
  <li><strong>Labour law basics:</strong> leave entitlements and working rules under Bahrain's private sector Labour Law (Law No. 36 of 2012) should be configurable to your policies, not hard-coded to another country's.</li>
</ul>

<h2>2. Documents and expiries</h2>
<p>Ask to see how the system stores CPR cards, passports, visas and work permits, and how it reminds people before they expire. The reminder should go to a named person with enough lead time to act. More on this in <a href="/insights/hr-document-expiry-tracking/">tracking document expiries</a>.</p>

<h2>3. Self-service that staff will actually use</h2>
<p>An HR system only saves time if employees use it instead of messaging HR. Check:</p>
<ul>
  <li>Is there a mobile app for staff and managers, not just a desktop web page?</li>
  <li>Can employees see their own payslips, leave balances and documents without asking?</li>
  <li>Can they make requests in a few taps, or in plain words through an assistant? We wrote about <a href="/insights/ai-assistant-for-hr/">what AI assistants can and cannot do for HR</a>.</li>
  <li>Does it work in Arabic as well as English?</li>
</ul>

<h2>4. Permissions and approvals</h2>
<p>Map your real approval chains: who approves leave, overtime, expenses and salary changes, and who stands in when they are away. Then ask the vendor to configure one of them during the demo. If a simple two-step approval needs custom development, that is a warning sign.</p>

<h2>5. Data protection and hosting</h2>
<p>Employee records are personal data under the Personal Data Protection Law (Law No. 30 of 2018). Ask:</p>
<ul>
  <li>Where is the data hosted, and who can access it?</li>
  <li>Is access logged?</li>
  <li>How are backups handled and how quickly can data be restored?</li>
  <li>Can you export all of your data if you leave?</li>
  <li>If the product uses AI, where is that processing done, and is your data used to train anything?</li>
</ul>

<h2>6. Migration without drama</h2>
<p>The move from spreadsheets or an old system is where projects go wrong. A good vendor will:</p>
<ul>
  <li>Import your existing employee records, balances and documents rather than asking you to retype them.</li>
  <li>Run at least one payroll in parallel, old way and new way, and compare the results line by line before switching over.</li>
  <li>Train HR, managers and staff separately, since they use the system differently.</li>
</ul>

<h2>7. Support you can reach</h2>
<p>Payroll problems happen at the end of the month, on a deadline. Find out who you will talk to when something goes wrong, in what time zone, and how quickly. A local team that understands LMRA and SIO is worth a lot in that moment.</p>

<h2>8. Total cost, honestly counted</h2>
<p>Compare more than the monthly price. Include setup and migration, per-user charges as you grow, paid add-ons for features you need (payroll, mobile, AI), and the internal time your team will spend. A cheaper licence that still leaves you building the WPS file by hand may not be cheaper.</p>

<h2>Questions to ask in every demo</h2>
<ol>
  <li>Show me this month's WPS file being generated and validated.</li>
  <li>Show me how a change in SIO rates would be applied.</li>
  <li>Show me an expiry reminder from the employee's point of view.</li>
  <li>Let a regular employee request leave on a phone.</li>
  <li>Show me the audit log for a salary change.</li>
  <li>Export all of my data.</li>
</ol>

<h2>A note on our own product</h2>
<p>We build RAL HR for businesses in Bahrain, so we are not neutral. It covers payroll with the LMRA WPS salary file, SIO and end of service calculations, leave, attendance and expiry alerts, a mobile app for staff and managers, and Ask RAL, an AI assistant included in every plan. Use the checklist above on us as well as on anyone else. If we are not the right fit, the checklist will show it. <a href="/contact/">Ask us for a demo</a>.</p>
`,
  },

  // ── Websites and apps for local businesses ─────────────────────────────
  {
    path: '/insights/website-for-local-business-bahrain/',
    type: 'article',
    published: D,
    readMinutes: 7,
    tag: 'Websites',
    title: 'What a local business in Bahrain actually needs from a website or app',
    description:
      'A practical guide for Bahrain businesses planning a website or app: what to build first, WhatsApp and Instagram as real channels, bilingual content, speed, search visibility, and when an app is worth it.',
    eyebrow: 'Insights · Websites',
    h1: 'What a local business actually needs <span class="serif">from a website or app.</span>',
    lead:
      'Restaurants, clinics, salons, contractors and shops in Bahrain often ask us for "a website" or "an app" without being sure what either should do. This is the conversation we have before quoting, written down.',
    updated: D,
    body: `
<h2>Start with the job, not the format</h2>
<p>A website is not a goal. The goal is usually one of a small number of things:</p>
<ul>
  <li><strong>Be found.</strong> People search for your type of business and your area, and you want to appear.</li>
  <li><strong>Be trusted.</strong> Someone has heard of you and wants to check you are real, professional and open.</li>
  <li><strong>Take an action.</strong> Book an appointment, place an order, request a quote, or send a message.</li>
  <li><strong>Save staff time.</strong> Stop answering the same questions by phone and message all day.</li>
</ul>
<p>Pick the one or two that matter most for you. They decide what gets built first.</p>

<h2>WhatsApp and Instagram are real channels, so design for them</h2>
<p>In Bahrain, a large share of customer conversations happen on WhatsApp and Instagram. A website that ignores this feels foreign to customers. Practical consequences:</p>
<ul>
  <li>Make "message us on WhatsApp" a primary button, with a pre-filled message so the customer does not stare at an empty chat.</li>
  <li>Link to Instagram for the visual side of the business, but keep essential facts (hours, location, services, prices if you publish them) on the website, where search engines and new customers can read them.</li>
  <li>If you share links in chats and stories, make sure each page has a clear title and preview image so the link looks right when shared.</li>
</ul>

<h2>Bilingual from the start</h2>
<p>If your customers speak Arabic and English, plan both languages from day one. Adding Arabic later is more than translation: right-to-left layout, different text lengths, and fonts that look right in both scripts all affect the design. Decide which language is the default and make switching obvious.</p>

<h2>Speed on a phone is the real test</h2>
<p>Most visitors will arrive on a phone, often from a link in a chat. If the page takes a long time to appear, many of them will leave before they see anything. Things that help:</p>
<ul>
  <li>Compressed, correctly sized images instead of full-resolution photos.</li>
  <li>Text that is real text, not text inside images.</li>
  <li>Restraint with heavy animations, video backgrounds and third-party widgets.</li>
  <li>Testing on a mid-range phone on mobile data, not only on a fast office connection.</li>
</ul>

<h2>Be readable by search engines</h2>
<p>Search engines can only rank what they can read. Basic habits go a long way:</p>
<ul>
  <li>One page per service, with a clear title and a few paragraphs explaining it in the words customers use.</li>
  <li>Your business name, area and contact details written consistently everywhere, including your Google Business Profile.</li>
  <li>A sitemap and sensible page titles and descriptions.</li>
  <li>Useful content that answers real questions, which also helps the customers who read it.</li>
</ul>

<h2>When an app makes sense</h2>
<p>An app is a bigger commitment than a website: it has to be built for iOS and Android, reviewed by Apple and Google, updated, and above all installed by customers. It is worth it when:</p>
<ul>
  <li>Customers come back often, such as for repeat orders, bookings, memberships or loyalty.</li>
  <li>You need phone features like notifications, the camera, location, or offline access.</li>
  <li>The experience is used daily by staff, for example a field team, drivers or a clinic front desk.</li>
</ul>
<p>If customers visit once or twice a year, a fast mobile website with WhatsApp contact usually serves them better than an app they will never download.</p>

<h2>Plan for the second month, not just launch day</h2>
<ul>
  <li>Who updates prices, hours and photos, and how easily can they do it?</li>
  <li>Who owns the domain, the hosting account and the code? It should be you.</li>
  <li>How are bookings or enquiries stored, and who is notified?</li>
  <li>If you collect personal data through forms or bookings, how does that fit with Bahrain's Personal Data Protection Law (Law No. 30 of 2018)?</li>
</ul>

<h2>A sensible first version</h2>
<p>For most local businesses, a strong first version is: a fast, bilingual site with a page per main service, clear location and hours, a WhatsApp button on every page, a simple booking or enquiry form if needed, and a way for the owner to update the basics. Everything else, from online payments to loyalty to a full app, can be added once you see how customers use the first version.</p>
<p>We build websites, apps and internal systems for businesses in Bahrain and the GCC. If you are planning one, <a href="/contact/">tell us what you want it to do</a> and we will tell you honestly what we would build first.</p>
`,
  },
]
