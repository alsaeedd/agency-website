// Guides part 1: annual leave and public holidays; overtime rules.
// Same object shape as content/articles-hr.mjs. No invented figures: where a
// number can change or is uncertain, the article states the rule and points
// readers to the Ministry of Labour, LMRA or SIO.

const D = '2026-11-15'

const a1 = {
  path: '/insights/bahrain-annual-leave-public-holidays/',
  type: 'article',
  published: D,
  updated: D,
  readMinutes: 9,
  tag: 'HR',
  title: 'Annual leave, public holidays and other leave in Bahrain: a guide for employers',
  description:
    'How annual leave builds up under Bahrain Labour Law No. 36 of 2012, pro rata balances, carry over, payout on exit, public holidays, sick leave and Ramadan hours.',
  eyebrow: 'Insights · Guides',
  h1: 'Annual leave and public holidays in Bahrain: <span class="serif">a guide for employers.</span>',
  lead:
    'Leave is the HR topic that causes the most small, avoidable arguments. Most of them come from the same few gaps: nobody wrote down the balance, nobody agreed the dates, or nobody knew how to pay out the days that were left. This guide walks through the rules in plain words and shows the arithmetic.',
  body: `
<h2>Who this guide is for</h2>
<p>This guide is for owners, office managers and HR staff at private sector companies in Bahrain who manage leave themselves, often in a spreadsheet. It covers employees under the Labour Law for the Private Sector, Law No. 36 of 2012. Government employees follow civil service rules instead, and domestic workers are covered by only some parts of the Labour Law, so check their position separately.</p>
<p>We describe the rules as they are generally understood and applied. The law can be amended, and ministerial decisions add detail, so treat this as a map, not as legal advice. Where a figure matters for a real decision, confirm it with the Ministry of Labour or a qualified adviser.</p>

<h2>The basic entitlement</h2>
<p>Under the Labour Law, a worker is entitled to paid annual leave of not less than 30 days a year. The law expresses this as building up at the rate of two and a half days for each month of service. Two things follow from that wording:</p>
<ul>
  <li><strong>It is a minimum.</strong> A contract or company policy can give more, never less. If your offer letter promises more days, you are bound by the better promise.</li>
  <li><strong>It accrues monthly.</strong> An employee does not wait a full year and then receive 30 days in one go. The balance grows each month, which matters most when someone joins or leaves part way through a year.</li>
</ul>
<p>Leave is paid at the employee's wage: the employee receives their normal pay for the leave days, as if they had worked. Problems start when companies pay only the basic salary during leave and drop fixed allowances that are part of the agreed wage. Check what your contract defines as the wage and be consistent.</p>

<h2>Pro rata balances for part years</h2>
<p>Because leave accrues at two and a half days a month, a part year is simple to work out: count the complete months of service and multiply by 2.5. For a part month, many employers count days in proportion (for example 15 days of a 30 day month earns 1.25 days). Whatever method you choose, write it into your leave policy and use it for everyone.</p>

<h2>Worked example: how a balance builds up</h2>
<p>Take an employee who joins on 1 March on the statutory minimum of 30 days a year.</p>
<div class="table-wrap"><table>
  <thead><tr><th>Date</th><th>Months of service</th><th>Days earned</th></tr></thead>
  <tbody>
    <tr><td>31 March</td><td>1</td><td>2.5</td></tr>
    <tr><td>30 June</td><td>4</td><td>10</td></tr>
    <tr><td>30 September</td><td>7</td><td>17.5</td></tr>
    <tr><td>31 December</td><td>10</td><td>25</td></tr>
    <tr><td>28 February next year</td><td>12</td><td>30</td></tr>
  </tbody>
</table></div>
<p>If the employee took 8 days in August, their balance on 31 December is 25 minus 8, which is 17 days. That one line, days earned minus days taken, is the whole of leave accounting. The difficulty is only ever keeping both numbers accurate.</p>

<h2>Calendar days, working days and holidays inside leave</h2>
<p>A common source of confusion is whether leave is counted in calendar days or working days, and what happens when a public holiday falls in the middle of someone's leave. The safest approach is:</p>
<ul>
  <li>Write the counting method into the contract or your leave policy, in plain words, with an example.</li>
  <li>Do not deduct public holidays that fall inside a period of annual leave from the leave balance. The generally accepted reading is that an official holiday is a separate entitlement, not part of annual leave.</li>
  <li>Apply the same method to everyone. Inconsistency is what turns a small difference into a complaint.</li>
</ul>

<h2>Scheduling leave and carrying it over</h2>
<p>The employer generally decides when leave is taken, taking account of the needs of the work, and tells the employee the dates in advance. Good companies agree the dates rather than impose them. A few practical rules keep this calm:</p>
<ol>
  <li><strong>Ask for requests early.</strong> Summer and the Eid periods are popular. A rule such as "requests for July and August by the end of April" avoids a scramble.</li>
  <li><strong>Approve in writing.</strong> A message in a group chat is not a record. An approval in an HR system or a signed form is.</li>
  <li><strong>Allow splitting.</strong> Leave can be taken in parts by agreement, so a two week trip and a few single days can both come from the same balance.</li>
  <li><strong>Agree carry over rules.</strong> Whether unused days can roll into next year, how many, and by when they must be used, should be written down. The law allows leave to be postponed or accumulated by agreement, within limits, so check the current rule before you set a cap.</li>
</ol>
<p>An employee should not lose a legal entitlement simply because nobody reminded them to use it, and they cannot validly give up their minimum annual leave in exchange for nothing. If someone prefers to keep working, record what was agreed about carrying the days forward.</p>

<h2>Paying out unused leave when someone leaves</h2>
<p>When employment ends, the employee is entitled to be paid for annual leave they earned but did not take. You need two numbers: the unused balance on the last day and a daily rate. A widely used convention is to divide the monthly wage by 30 to get the daily rate. Some contracts use a different divisor, so follow yours if it says otherwise.</p>
<div class="table-wrap"><table>
  <thead><tr><th>Step</th><th>Example</th></tr></thead>
  <tbody>
    <tr><td>Monthly wage</td><td>BHD 450</td></tr>
    <tr><td>Daily rate (450 / 30)</td><td>BHD 15</td></tr>
    <tr><td>Unused balance on last day</td><td>12 days</td></tr>
    <tr><td>Leave payout (15 x 12)</td><td>BHD 180</td></tr>
  </tbody>
</table></div>
<p>The wage here is only an illustration. The method is what matters: the balance must be correct to the last working day, and the wage must be the same wage you would have paid during leave.</p>

<h2>Public holidays</h2>
<p>Private sector workers are entitled to paid official holidays, announced by the government. They include fixed date holidays, such as New Year's Day, Labour Day on 1 May and the National Day holidays in December, and holidays that follow the Hijri calendar, such as Eid al-Fitr, Eid al-Adha, the Islamic New Year, Ashura and the Prophet's Birthday.</p>
<p>Because Hijri dates depend on the sighting of the moon, the exact days are often confirmed only shortly before. Put the expected dates in your calendar at the start of the year marked as provisional, then update them the day the official announcement is made.</p>
<h3>When a holiday falls on the weekly rest day</h3>
<p>If an official holiday falls on an employee's weekly rest day, the law provides for the employee to be compensated, generally with a replacement day off. Check each announcement too, because the government sometimes names the replacement day itself. Confirm the current rule with the Ministry of Labour and apply it the same way for everyone.</p>
<h3>When someone works on a public holiday</h3>
<p>Some businesses cannot close: hospitals, hotels, restaurants, security, retail. The law allows work on an official holiday, but the worker must be compensated with pay at an increased rate on top of the normal wage, or with another day off, as the law sets out. Confirm the current rate before setting your policy, then write it down so every manager applies it the same way. Keep a record of who worked, on which holiday, for how many hours, and what compensation was given.</p>

<h2>Sick leave</h2>
<p>Sick leave is a separate balance from annual leave and needs a medical certificate from an approved provider. The Labour Law gives a set number of sick days each year in tiers: a first period on full pay, a second period on half pay and a third period without pay. The tiers are commonly applied as 15 days on full pay, 20 days on half pay and 20 days unpaid, but confirm the current figures with the Ministry of Labour before you rely on them. Track each tier separately so payroll knows exactly which rate to apply in a given month.</p>

<h2>Other leave types, briefly</h2>
<ul>
  <li><strong>Maternity leave.</strong> Paid leave around childbirth, with an option for further unpaid leave, plus nursing breaks after return.</li>
  <li><strong>Special short leave.</strong> Short paid leave for events such as the employee's marriage, the birth of a child and the death of close relatives.</li>
  <li><strong>Hajj leave.</strong> A one time paid leave for Hajj after a qualifying period of service.</li>
</ul>
<p>Each has conditions set in the law. Treat them as separate balances, never take them out of annual leave.</p>

<h2>A note on Ramadan hours</h2>
<p>During Ramadan, the Labour Law reduces the maximum working hours for Muslim workers (commonly applied as six hours a day and 36 a week). This affects rosters and overtime more than leave, but it is worth noting here because many employers also see more leave requests at the end of Ramadan for Eid. Plan cover early, and remember that hours worked above the reduced limit may count as overtime.</p>

<h2>Common mistakes</h2>
<ul>
  <li><strong>No running balance.</strong> There is no single figure per employee that both sides agree on.</li>
  <li><strong>Deducting holidays from leave.</strong> A public holiday in the middle of a trip is quietly counted as a leave day.</li>
  <li><strong>Paying leave on basic only.</strong> Fixed allowances that form part of the wage are dropped for leave days.</li>
  <li><strong>Forgetting leave in the final settlement.</strong> End of service is calculated carefully and the unused leave is missed.</li>
  <li><strong>Mixing sick leave into annual leave.</strong> Certified sick days are taken from the annual balance instead of the sick leave tiers.</li>
</ul>

<h2>A simple leave record that works</h2>
<p>You do not need complex software, but you do need one source of truth. For each employee, keep the start date and contractual entitlement; each approved leave with dates, days and approver; the carried over balance at the start of each year; sick leave by tier and special leave in separate columns; and holidays worked with the compensation given. Once a month, share each person's balance with them. Disagreements found early are cheap to fix.</p>

<h2>Frequently asked questions</h2>
<h3>Is a new employee entitled to leave in their first year?</h3>
<p>Leave builds up from the start of employment at two and a half days a month. Some companies ask new staff not to take long leave during probation, which is a scheduling matter, but the days are still being earned.</p>
<h3>Can we pay an employee instead of letting them take leave?</h3>
<p>Leave exists so people rest. Paying it out while the person is still employed, instead of letting them take it, is risky and can be challenged. Payment in lieu is normally for unused leave at the end of employment.</p>
<h3>What if an employee falls sick during annual leave?</h3>
<p>A common and fair approach is that a properly certified illness during leave is recorded as sick leave for those days. Write your rule into the leave policy.</p>
<h3>Do part time employees get annual leave?</h3>
<p>Part time workers generally receive leave in proportion to the time they work. Agree the method in the contract.</p>
<h3>Where can I check the current rules?</h3>
<p>The Ministry of Labour publishes the Labour Law and related decisions, and the LMRA publishes guidance for employers of foreign workers. When in doubt, ask them directly.</p>

<p>If you would rather have balances, approvals and holiday records kept for you, this is the kind of system we build at RAL; <a href="/contact/">say hello</a> if it would help.</p>
<p><em>This article is general information, not legal advice. It reflects Bahrain Labour Law No. 36 of 2012 as generally applied; laws and decisions change, so confirm current requirements with the Ministry of Labour, the LMRA or the SIO.</em></p>
`,
}

const a2 = {
  path: '/insights/overtime-rules-bahrain/',
  type: 'article',
  published: D,
  updated: D,
  readMinutes: 7,
  tag: 'Payroll',
  title: 'Overtime rules in Bahrain: how to calculate it correctly',
  description:
    'Normal working hours, daytime, night and rest day overtime under Bahrain Labour Law No. 36 of 2012, the hourly rate from a monthly wage, worked examples and records.',
  eyebrow: 'Insights · Guides',
  h1: 'Overtime rules in Bahrain: <span class="serif">how to calculate it correctly.</span>',
  lead:
    'Overtime is where payroll and the shop floor meet. The rules themselves are short, but small errors in the hourly rate or in the record of hours add up month after month. This guide explains the rules, shows the arithmetic with worked examples, and lists the records that make overtime easy to defend.',
  body: `
<h2>Who this guide is for</h2>
<p>This guide is for owners, supervisors and payroll staff in Bahrain's private sector, especially in businesses with shifts: retail, restaurants, logistics, construction, clinics and security. It covers the Labour Law for the Private Sector, Law No. 36 of 2012. Where we are not certain a figure is current, we say so. Confirm anything you rely on with the Ministry of Labour.</p>

<h2>Normal working hours</h2>
<p>The Labour Law sets the normal maximum at eight hours a day and 48 hours a week. Anything beyond the normal hours agreed for the worker, within the legal limits, is overtime. A few related rules shape the working day:</p>
<ul>
  <li><strong>Breaks.</strong> The working day must include a rest break, which is not counted as working time. The law sets the minimum length and how long someone may work before a break, so build those into your rosters.</li>
  <li><strong>Ramadan.</strong> For Muslim workers, maximum hours are reduced during Ramadan (commonly applied as six hours a day and 36 a week). Hours above the reduced limit should be treated as overtime.</li>
  <li><strong>A daily ceiling.</strong> Even with overtime, total working hours in a day are capped, commonly cited as 10 hours, with limited exceptions. Check the current cap and exceptions before you plan long shifts.</li>
  <li><strong>Weekly rest.</strong> Workers are entitled to a paid weekly rest day of at least 24 consecutive hours, usually Friday unless agreed otherwise.</li>
</ul>

<h2>When overtime is allowed</h2>
<p>An employer can ask for overtime when the needs of the work require it. Overtime should be the exception that covers peaks, not the hidden basis of the roster. If a role needs ten hours every day, the roster is the real problem, and it will also run into the daily ceiling. Agree in the contract or policy how overtime is requested and approved, so nobody works extra hours that a manager did not know about.</p>

<h2>The overtime premiums</h2>
<p>Overtime is paid as the worker's normal hourly wage plus a premium. The premium depends on when the work is done:</p>
<div class="table-wrap"><table>
  <thead><tr><th>When</th><th>What the worker receives</th><th>Note</th></tr></thead>
  <tbody>
    <tr><td>Daytime overtime</td><td>Hourly wage plus at least 25%</td><td>So at least 125% of the hourly wage</td></tr>
    <tr><td>Night overtime</td><td>Hourly wage plus a higher premium</td><td>Commonly cited as 50%; confirm the rate and the night hours</td></tr>
    <tr><td>Work on the weekly rest day</td><td>Wage plus 150%, or another rest day</td><td>The choice of a replacement day is set by the law</td></tr>
    <tr><td>Work on a public holiday</td><td>Increased pay or a day off in exchange</td><td>Confirm the current rate with the Ministry</td></tr>
  </tbody>
</table></div>
<p>These are minimums. A contract or company policy can be more generous, and then the better terms apply. Because the night premium and the definition of night hours matter a great deal for shift businesses, check the current wording of the law before you build them into payroll.</p>

<h2>Working out the hourly rate</h2>
<p>Overtime is calculated from the hourly wage, but most people in Bahrain are paid monthly. You need a consistent way to turn a monthly wage into an hourly one. A common method is:</p>
<ol>
  <li>Take the monthly wage as your contract defines it.</li>
  <li>Divide by 30 to get the daily wage.</li>
  <li>Divide by the normal daily hours (usually 8) to get the hourly wage.</li>
</ol>
<p>Some employers divide by the actual number of working days or use 26 working days; others compute weekly hours. Different methods give slightly different answers. What matters is that the method is written down, is not less favourable to the worker than the law allows, and is the same every month.</p>
<p>Also be clear about what the "wage" includes. If fixed allowances form part of the wage under the contract, leaving them out of the hourly rate lowers every overtime payment. This is one of the most common errors we see.</p>

<h2>Worked example 1: daytime overtime</h2>
<p>An employee earns BHD 480 a month and normally works 8 hours a day. In one month they work 10 hours of daytime overtime.</p>
<div class="table-wrap"><table>
  <thead><tr><th>Step</th><th>Calculation</th><th>Result</th></tr></thead>
  <tbody>
    <tr><td>Daily wage</td><td>480 / 30</td><td>BHD 16.000</td></tr>
    <tr><td>Hourly wage</td><td>16 / 8</td><td>BHD 2.000</td></tr>
    <tr><td>Daytime overtime rate</td><td>2 x 1.25</td><td>BHD 2.500 per hour</td></tr>
    <tr><td>Overtime pay</td><td>2.5 x 10</td><td>BHD 25.000</td></tr>
  </tbody>
</table></div>

<h2>Worked example 2: night overtime</h2>
<p>The same employee also works 6 hours of overtime at night. Using an illustrative night premium of 50% (confirm the current rate):</p>
<ul>
  <li>Night overtime rate: 2.000 x 1.5 = BHD 3.000 per hour.</li>
  <li>Night overtime pay: 3 x 6 = BHD 18.000.</li>
</ul>
<p>The month's total overtime is 25 + 18 = BHD 43.000, on top of the normal salary.</p>

<h2>Worked example 3: working on the rest day</h2>
<p>The employee works a full 8 hour shift on their weekly rest day and chooses payment instead of a replacement day. They receive their hourly wage plus 150%, so 2.000 x 2.5 = BHD 5.000 an hour, or BHD 40.000 for the shift. If they choose a replacement rest day instead, record the date it is taken.</p>
<p>All wage figures are illustrations, not typical salaries. Use the real wage from your payroll.</p>

<h2>Who is outside the overtime rules</h2>
<p>The Labour Law excludes some roles and situations from the working hours provisions. These generally include people in senior management or supervisory positions with real authority, and some kinds of work that by their nature run outside normal hours, such as certain preparatory or supplementary work and some essential services. The exact list and its conditions are in the law and ministerial decisions.</p>
<p>Be careful with job titles. Calling someone a "manager" does not take them outside the rules if they have no management authority in practice. If you rely on an exclusion, write down why it applies to that role.</p>

<h2>Records that make overtime easy to defend</h2>
<p>Overtime disputes are almost always about records. Keep, for every worker:</p>
<ul>
  <li>The normal schedule: start and finish times, break, weekly rest day.</li>
  <li>Actual daily start and finish times, from a time clock, app or signed sheet.</li>
  <li>Who approved each block of overtime, and when.</li>
  <li>Whether hours were daytime, night, rest day or public holiday.</li>
  <li>For rest day and holiday work, whether the worker chose pay or a replacement day, and when that day was taken.</li>
  <li>The hourly rate used and the method behind it.</li>
</ul>
<p>Pay overtime through the same salary channel as normal pay so that the Wage Protection System record matches your payslip. Show overtime as its own line on the payslip, with hours and rate, so the worker can check it.</p>

<h2>Building overtime into the monthly payroll cycle</h2>
<p>Overtime goes wrong most often at month end, when hours from several sources have to be pulled together in a hurry. A simple routine prevents that:</p>
<ol>
  <li><strong>Set a cut off date.</strong> For example, overtime worked up to the 25th is paid this month, and anything after rolls into next month. Tell staff the rule so nobody thinks hours were lost.</li>
  <li><strong>Lock the timesheets.</strong> After the cut off, supervisors confirm their team's hours and approvals. Late changes go into the next cycle with a note.</li>
  <li><strong>Check the outliers.</strong> Before running payroll, list anyone whose overtime is unusually high, anyone over the daily ceiling, and anyone with rest day work but no recorded choice of pay or replacement day.</li>
  <li><strong>Reconcile totals.</strong> Total overtime hours by type should match the sum of the payslip lines, and the payment file should match payroll.</li>
</ol>
<p>Done every month, this takes minutes rather than hours, and it gives you a clean answer if a worker or an inspector ever asks how a figure was reached.</p>

<h2>Common mistakes</h2>
<ul>
  <li><strong>A flat "overtime allowance"</strong> paid every month regardless of hours worked, with no record of the hours behind it.</li>
  <li><strong>Hourly rate on basic only</strong> when the contract wage includes fixed allowances.</li>
  <li><strong>Night hours paid at the day rate</strong> because the roster system does not know what night means.</li>
  <li><strong>Ignoring Ramadan limits,</strong> so hours above the reduced maximum are not treated as overtime.</li>
  <li><strong>Unapproved overtime</strong> that nobody can verify months later.</li>
</ul>

<h2>Frequently asked questions</h2>
<h3>Can we refuse to pay overtime that a manager did not approve?</h3>
<p>If the work was done with the employer's knowledge, refusing to pay is risky. The better fix is a clear approval process, so unapproved overtime does not happen in the first place.</p>
<h3>Can we give time off instead of overtime pay?</h3>
<p>For the weekly rest day and public holidays, the law provides for a replacement day as an alternative. For ordinary overtime, paying the premium is the safe default; agree anything else in writing and check it with the Ministry.</p>
<h3>Does overtime count towards end of service?</h3>
<p>End of service is based on the wage as defined in the law and contract. Occasional overtime is generally not part of the fixed wage, but regular, contractual payments may be. Check your specific case.</p>
<h3>Do employees on a fixed monthly package with "all hours included" get overtime?</h3>
<p>A contract cannot remove a legal minimum. Unless the role falls within a legal exclusion, hours above the normal limit attract overtime.</p>
<h3>How should we round partial hours?</h3>
<p>Choose a fair, written rule, such as recording in 15 minute steps, and apply it the same way to everyone.</p>

<p>We build time, attendance and payroll tools for Bahrain employers at RAL; <a href="/contact/">get in touch</a> if accurate overtime would save you time.</p>
<p><em>This article is general information, not legal advice. It reflects Bahrain Labour Law No. 36 of 2012 as generally applied; rates and limits can change, so confirm current requirements with the Ministry of Labour, the LMRA or the SIO.</em></p>
`,
}

const a1ar = {
  path: '/insights/bahrain-annual-leave-public-holidays/',
  type: 'article',
  published: D,
  updated: D,
  readMinutes: 7,
  tag: 'الموارد البشرية',
  title: 'الإجازة السنوية والعطل الرسمية وأنواع الإجازات الأخرى في البحرين: دليل لأصحاب العمل',
  description:
    'كيف تتراكم الإجازة السنوية وفق قانون العمل البحريني رقم 36 لسنة 2012، والرصيد النسبي، والترحيل، وصرف الرصيد عند نهاية الخدمة، والعطل والإجازة المرضية وساعات رمضان.',
  eyebrow: 'مقالات · أدلة',
  h1: 'الإجازة السنوية والعطل الرسمية في البحرين: <span class="serif">دليل لأصحاب العمل.</span>',
  lead:
    'الإجازات هي أكثر موضوع في الموارد البشرية يسبب خلافات صغيرة يمكن تجنبها. ومعظم هذه الخلافات تأتي من الثغرات نفسها: لم يدوّن أحد الرصيد، أو لم يُتفق على التواريخ، أو لم يعرف أحد كيف تُصرف الأيام المتبقية. يشرح هذا الدليل القواعد بكلمات بسيطة ويعرض الحسابات خطوة بخطوة.',
  body: `
<h2>لمن هذا الدليل</h2>
<p>هذا الدليل لأصحاب الشركات ومديري المكاتب وموظفي الموارد البشرية في شركات القطاع الخاص في البحرين، الذين يديرون الإجازات بأنفسهم، وغالبًا في جدول بيانات. وهو يغطي الموظفين الخاضعين لقانون العمل في القطاع الأهلي، القانون رقم 36 لسنة 2012. أما موظفو الحكومة فيتبعون قواعد الخدمة المدنية، وعمال المنازل لا تشملهم إلا بعض أحكام قانون العمل، لذا تحقق من وضعهم بشكل منفصل.</p>
<p>نعرض القواعد كما تُفهم وتُطبق عادة. وقد يُعدّل القانون، وتضيف القرارات الوزارية تفاصيل، لذا تعامل مع هذا الدليل كخريطة لا كاستشارة قانونية. وحين يكون الرقم مهمًا لقرار فعلي، تأكد منه لدى وزارة العمل أو مستشار مختص.</p>

<h2>الاستحقاق الأساسي</h2>
<p>وفق قانون العمل، يستحق العامل إجازة سنوية مدفوعة الأجر لا تقل عن 30 يومًا في السنة. ويعبّر القانون عن ذلك بأنها تتراكم بمعدل يومين ونصف عن كل شهر خدمة. ويترتب على هذه الصياغة أمران:</p>
<ul>
  <li><strong>إنها حد أدنى.</strong> يجوز للعقد أو لسياسة الشركة أن تمنح أكثر، لا أقل. وإذا وعدت رسالة العرض بأيام أكثر، فأنت ملتزم بالوعد الأفضل.</li>
  <li><strong>إنها تتراكم شهريًا.</strong> لا ينتظر الموظف سنة كاملة ليحصل على 30 يومًا دفعة واحدة. بل ينمو الرصيد كل شهر، وهذا أهم ما يكون عند الالتحاق أو المغادرة في منتصف السنة.</li>
</ul>
<p>تُدفع الإجازة بأجر الموظف، أي يحصل على أجره المعتاد عن أيام الإجازة كأنه عمل. وتبدأ المشكلات حين تدفع الشركات الراتب الأساسي فقط أثناء الإجازة وتُسقط البدلات الثابتة التي هي جزء من الأجر المتفق عليه. تحقق من تعريف الأجر في عقدك والتزم به دائمًا.</p>

<h2>الرصيد النسبي لجزء من السنة</h2>
<p>لأن الإجازة تتراكم بمعدل يومين ونصف شهريًا، فحساب جزء السنة بسيط: احسب أشهر الخدمة الكاملة واضربها في 2.5. وبالنسبة لجزء الشهر، يحسب كثير من أصحاب العمل الأيام بالتناسب (مثلًا 15 يومًا من شهر من 30 يومًا تعطي 1.25 يوم). وأيًا كانت الطريقة، اكتبها في سياسة الإجازات وطبقها على الجميع.</p>

<h2>مثال محلول: كيف يتكون الرصيد</h2>
<p>لنأخذ موظفًا التحق في 1 مارس على الحد الأدنى القانوني، أي 30 يومًا في السنة.</p>
<div class="table-wrap"><table>
  <thead><tr><th>التاريخ</th><th>أشهر الخدمة</th><th>الأيام المكتسبة</th></tr></thead>
  <tbody>
    <tr><td>31 مارس</td><td>1</td><td>2.5</td></tr>
    <tr><td>30 يونيو</td><td>4</td><td>10</td></tr>
    <tr><td>30 سبتمبر</td><td>7</td><td>17.5</td></tr>
    <tr><td>31 ديسمبر</td><td>10</td><td>25</td></tr>
    <tr><td>28 فبراير من السنة التالية</td><td>12</td><td>30</td></tr>
  </tbody>
</table></div>
<p>إذا أخذ الموظف 8 أيام في أغسطس، فرصيده في 31 ديسمبر هو 25 ناقص 8، أي 17 يومًا. هذا السطر الواحد، الأيام المكتسبة ناقص الأيام المأخوذة، هو كل محاسبة الإجازات. والصعوبة الوحيدة هي إبقاء الرقمين دقيقين.</p>

<h2>الأيام التقويمية وأيام العمل والعطل داخل الإجازة</h2>
<p>من مصادر الالتباس الشائعة: هل تُحسب الإجازة بالأيام التقويمية أم بأيام العمل، وماذا يحدث إذا وقعت عطلة رسمية في منتصف إجازة الموظف؟ الأسلم أن:</p>
<ul>
  <li>تكتب طريقة الحساب في العقد أو سياسة الإجازات بكلمات واضحة مع مثال.</li>
  <li>لا تخصم العطل الرسمية الواقعة داخل الإجازة السنوية من رصيد الإجازة. فالقراءة المقبولة عمومًا أن العطلة الرسمية استحقاق مستقل وليست جزءًا من الإجازة السنوية.</li>
  <li>تطبق الطريقة نفسها على الجميع. فعدم الاتساق هو ما يحول الفرق الصغير إلى شكوى.</li>
</ul>

<h2>جدولة الإجازات وترحيلها</h2>
<p>يحدد صاحب العمل عادة موعد الإجازة مراعيًا حاجة العمل، ويبلغ الموظف بالتواريخ مسبقًا. والشركات الجيدة تتفق على التواريخ مع الموظف بدل فرضها. وهذه قواعد عملية تبقي الأمور هادئة:</p>
<ol>
  <li><strong>اطلب الطلبات مبكرًا.</strong> الصيف وفترات العيد مزدحمة. وقاعدة مثل "طلبات يوليو وأغسطس قبل نهاية أبريل" تمنع التزاحم.</li>
  <li><strong>وافق كتابيًا.</strong> رسالة في مجموعة دردشة ليست سجلًا. أما الموافقة في نظام موارد بشرية أو نموذج موقّع فهي سجل.</li>
  <li><strong>اسمح بالتجزئة.</strong> يمكن أخذ الإجازة على أجزاء بالاتفاق، فتخرج رحلة أسبوعين وبضعة أيام متفرقة من الرصيد نفسه.</li>
  <li><strong>اتفق على قواعد الترحيل.</strong> يجب أن يُكتب هل تُرحّل الأيام غير المستخدمة إلى السنة التالية، وكم منها، ومتى يجب استخدامها. ويسمح القانون بتأجيل الإجازة أو تجميعها بالاتفاق ضمن حدود، فتحقق من القاعدة الحالية قبل وضع سقف.</li>
</ol>
<p>لا ينبغي أن يخسر الموظف استحقاقًا قانونيًا لمجرد أن أحدًا لم يذكّره باستخدامه، ولا يصح أن يتنازل عن الحد الأدنى من إجازته السنوية دون مقابل. وإذا فضّل أحدهم الاستمرار في العمل، فدوّن ما اتُفق عليه بشأن ترحيل الأيام.</p>

<h2>صرف رصيد الإجازة عند انتهاء الخدمة</h2>
<p>عند انتهاء العمل، يستحق الموظف أجر الإجازة السنوية التي اكتسبها ولم يأخذها. تحتاج إلى رقمين: الرصيد غير المستخدم في آخر يوم، والأجر اليومي. والعرف الشائع قسمة الأجر الشهري على 30 للحصول على الأجر اليومي. وبعض العقود تستخدم مقسومًا آخر، فاتبع عقدك إن نص على غير ذلك.</p>
<div class="table-wrap"><table>
  <thead><tr><th>الخطوة</th><th>المثال</th></tr></thead>
  <tbody>
    <tr><td>الأجر الشهري</td><td>450 دينارًا</td></tr>
    <tr><td>الأجر اليومي (450 / 30)</td><td>15 دينارًا</td></tr>
    <tr><td>الرصيد غير المستخدم في آخر يوم</td><td>12 يومًا</td></tr>
    <tr><td>بدل الإجازة (15 × 12)</td><td>180 دينارًا</td></tr>
  </tbody>
</table></div>
<p>الأجر هنا للتوضيح فقط. المهم هو الطريقة: يجب أن يكون الرصيد صحيحًا حتى آخر يوم عمل، وأن يكون الأجر هو نفسه الذي كنت ستدفعه أثناء الإجازة.</p>

<h2>العطل الرسمية</h2>
<p>يستحق عمال القطاع الخاص العطل الرسمية مدفوعة الأجر، وتعلنها الحكومة. وتشمل عطلًا بتواريخ ثابتة، مثل رأس السنة الميلادية، وعيد العمال في 1 مايو، وعطلة العيد الوطني في ديسمبر، وعطلًا تتبع التقويم الهجري، مثل عيد الفطر وعيد الأضحى ورأس السنة الهجرية وعاشوراء والمولد النبوي الشريف.</p>
<p>ولأن التواريخ الهجرية تعتمد على رؤية الهلال، فغالبًا لا تتأكد الأيام إلا قبلها بوقت قصير. ضع التواريخ المتوقعة في تقويمك في بداية السنة مع وسمها بأنها مبدئية، ثم حدّثها في يوم صدور الإعلان الرسمي.</p>
<h3>عندما تقع العطلة في يوم الراحة الأسبوعية</h3>
<p>إذا وقعت عطلة رسمية في يوم الراحة الأسبوعية للموظف، فإن القانون ينص على تعويضه، وغالبًا بيوم راحة بديل. وراجع كل إعلان أيضًا، لأن الحكومة تحدد أحيانًا اليوم البديل بنفسها. تأكد من القاعدة الحالية لدى وزارة العمل وطبقها بالطريقة نفسها على الجميع.</p>
<h3>عندما يعمل الموظف في عطلة رسمية</h3>
<p>بعض الأعمال لا تستطيع الإغلاق: المستشفيات والفنادق والمطاعم والأمن والتجزئة. ويجيز القانون العمل في العطلة الرسمية، لكن يجب تعويض العامل بأجر بنسبة زيادة فوق الأجر المعتاد، أو بيوم راحة بديل، وفق ما ينص عليه القانون. تأكد من النسبة الحالية قبل وضع سياستك، ثم اكتبها حتى يطبقها كل مدير بالطريقة نفسها. واحتفظ بسجل لمن عمل، وفي أي عطلة، وكم ساعة، وما التعويض الذي حصل عليه.</p>

<h2>الإجازة المرضية</h2>
<p>الإجازة المرضية رصيد منفصل عن الإجازة السنوية، وتحتاج إلى شهادة طبية من جهة معتمدة. ويمنح قانون العمل عددًا محددًا من أيام المرض كل سنة على شرائح: مدة بأجر كامل، ثم مدة بنصف الأجر، ثم مدة بدون أجر. وتُطبق الشرائح عادة على أنها 15 يومًا بأجر كامل، و20 يومًا بنصف الأجر، و20 يومًا بدون أجر، لكن تأكد من الأرقام الحالية لدى وزارة العمل قبل الاعتماد عليها. وتتبّع كل شريحة على حدة حتى يعرف قسم الرواتب أي نسبة يطبق في كل شهر.</p>

<h2>أنواع أخرى من الإجازات باختصار</h2>
<ul>
  <li><strong>إجازة الوضع.</strong> إجازة مدفوعة حول الولادة، مع خيار إجازة إضافية بدون أجر، وفترات رضاعة بعد العودة.</li>
  <li><strong>الإجازات الخاصة القصيرة.</strong> إجازة قصيرة مدفوعة لمناسبات مثل زواج الموظف وولادة طفل له ووفاة الأقارب المقربين.</li>
  <li><strong>إجازة الحج.</strong> إجازة مدفوعة لمرة واحدة لأداء الحج بعد مدة خدمة مؤهلة.</li>
</ul>
<p>لكل منها شروط يحددها القانون. تعامل معها كأرصدة منفصلة، ولا تخصمها أبدًا من الإجازة السنوية.</p>

<h2>ملاحظة عن ساعات رمضان</h2>
<p>خلال شهر رمضان، يخفض قانون العمل الحد الأقصى لساعات العمل للعمال المسلمين (ويُطبق عادة على أنه ست ساعات يوميًا و36 ساعة أسبوعيًا). وهذا يؤثر في الجداول والعمل الإضافي أكثر من الإجازات، لكنه جدير بالذكر هنا لأن كثيرًا من أصحاب العمل يتلقون طلبات إجازة أكثر في نهاية رمضان لأجل العيد. خطط للتغطية مبكرًا، وتذكر أن الساعات التي تتجاوز الحد المخفض قد تُحسب عملًا إضافيًا.</p>

<h2>أخطاء شائعة</h2>
<ul>
  <li><strong>لا يوجد رصيد جارٍ.</strong> لا يوجد رقم واحد لكل موظف يتفق عليه الطرفان.</li>
  <li><strong>خصم العطل من الإجازة.</strong> تُحسب عطلة رسمية في منتصف رحلة يوم إجازة دون أن ينتبه أحد.</li>
  <li><strong>دفع أجر الإجازة على الأساسي فقط.</strong> تُسقط البدلات الثابتة التي هي جزء من الأجر عن أيام الإجازة.</li>
  <li><strong>نسيان الإجازة في التسوية النهائية.</strong> تُحسب مكافأة نهاية الخدمة بعناية ويُنسى رصيد الإجازة.</li>
  <li><strong>خلط الإجازة المرضية بالسنوية.</strong> تُخصم أيام مرض موثقة من الرصيد السنوي بدل شرائح الإجازة المرضية.</li>
</ul>

<h2>سجل إجازات بسيط وفعّال</h2>
<p>لا تحتاج إلى برنامج معقد، لكنك تحتاج إلى مصدر واحد للحقيقة. احتفظ لكل موظف بتاريخ الالتحاق والاستحقاق التعاقدي، وكل إجازة معتمدة بتواريخها وعدد أيامها ومن اعتمدها، والرصيد المرحّل في بداية كل سنة، والإجازة المرضية حسب الشريحة والإجازات الخاصة في أعمدة منفصلة، والعطل التي عمل فيها والتعويض الممنوح. وشارك كل موظف رصيده مرة في الشهر، فاكتشاف الخلاف مبكرًا يجعل حله رخيصًا.</p>

<h2>أسئلة شائعة</h2>
<h3>هل يستحق الموظف الجديد إجازة في سنته الأولى؟</h3>
<p>تتراكم الإجازة منذ بداية العمل بمعدل يومين ونصف شهريًا. وبعض الشركات تطلب من الموظفين الجدد عدم أخذ إجازة طويلة أثناء فترة التجربة، وهذه مسألة جدولة، لكن الأيام تُكتسب رغم ذلك.</p>
<h3>هل يمكننا دفع بدل للموظف بدل أن يأخذ إجازته؟</h3>
<p>الإجازة موجودة ليرتاح الناس. ودفع بدلها والموظف لا يزال على رأس عمله، بدل أن يأخذها، أمر محفوف بالمخاطر وقد يُطعن فيه. والبدل النقدي يكون عادة عن الإجازة غير المستخدمة عند انتهاء الخدمة.</p>
<h3>ماذا لو مرض الموظف أثناء إجازته السنوية؟</h3>
<p>من الأساليب الشائعة والعادلة أن يُسجل المرض الموثق أثناء الإجازة إجازةً مرضية عن تلك الأيام. اكتب قاعدتك في سياسة الإجازات.</p>
<h3>هل يستحق موظفو الدوام الجزئي إجازة سنوية؟</h3>
<p>يحصل موظفو الدوام الجزئي عمومًا على إجازة بنسبة الوقت الذي يعملونه. اتفق على الطريقة في العقد.</p>
<h3>أين أتحقق من القواعد الحالية؟</h3>
<p>تنشر وزارة العمل قانون العمل والقرارات المتعلقة به، وتنشر هيئة تنظيم سوق العمل إرشادات لأصحاب العمل الذين يستخدمون عمالة أجنبية. وعند الشك، اسألهم مباشرة.</p>

<p>إذا كنت تفضّل أن تُحفظ الأرصدة والموافقات وسجلات العطل نيابة عنك، فهذا هو نوع الأنظمة التي نبنيها في RAL؛ <a href="/ar/contact/">تواصل معنا</a> إن كان ذلك مفيدًا.</p>
<p><em>هذا المقال معلومات عامة وليس استشارة قانونية. وهو يعكس قانون العمل البحريني رقم 36 لسنة 2012 كما يُطبق عادة؛ والقوانين والقرارات تتغير، لذا تأكد من المتطلبات الحالية لدى وزارة العمل أو هيئة تنظيم سوق العمل أو الهيئة العامة للتأمين الاجتماعي.</em></p>
`,
}

const a2ar = {
  path: '/insights/overtime-rules-bahrain/',
  type: 'article',
  published: D,
  updated: D,
  readMinutes: 6,
  tag: 'الرواتب',
  title: 'قواعد العمل الإضافي في البحرين: كيف تحسبه بشكل صحيح',
  description:
    'ساعات العمل المعتادة، والعمل الإضافي النهاري والليلي وفي يوم الراحة وفق قانون العمل البحريني رقم 36 لسنة 2012، وأجر الساعة من الراتب الشهري، مع أمثلة محلولة.',
  eyebrow: 'مقالات · أدلة',
  h1: 'قواعد العمل الإضافي في البحرين: <span class="serif">كيف تحسبه بشكل صحيح.</span>',
  lead:
    'العمل الإضافي هو النقطة التي يلتقي فيها قسم الرواتب بأرض العمل. القواعد نفسها قصيرة، لكن الأخطاء الصغيرة في أجر الساعة أو في سجل الساعات تتراكم شهرًا بعد شهر. يشرح هذا الدليل القواعد، ويعرض الحسابات بأمثلة محلولة، ويسرد السجلات التي تجعل العمل الإضافي سهل الإثبات.',
  body: `
<h2>لمن هذا الدليل</h2>
<p>هذا الدليل لأصحاب الأعمال والمشرفين وموظفي الرواتب في القطاع الخاص البحريني، خاصة في الأعمال التي تعمل بنظام الورديات: التجزئة والمطاعم والخدمات اللوجستية والإنشاءات والعيادات والأمن. وهو يغطي قانون العمل في القطاع الأهلي، القانون رقم 36 لسنة 2012. وحين لا نكون متأكدين من أن رقمًا ما لا يزال ساريًا، نقول ذلك صراحة. تأكد من أي شيء تعتمد عليه لدى وزارة العمل.</p>

<h2>ساعات العمل المعتادة</h2>
<p>يحدد قانون العمل الحد الأقصى المعتاد بثماني ساعات يوميًا و48 ساعة أسبوعيًا. وكل ما يتجاوز الساعات المعتادة المتفق عليها للعامل، ضمن الحدود القانونية، يُعد عملًا إضافيًا. وهناك قواعد مرتبطة تشكل يوم العمل:</p>
<ul>
  <li><strong>فترات الراحة.</strong> يجب أن يتضمن يوم العمل فترة راحة لا تُحسب من وقت العمل. ويحدد القانون مدتها الدنيا والمدة التي يجوز العمل خلالها قبل الراحة، فأدخلها في جداولك.</li>
  <li><strong>رمضان.</strong> تُخفض الساعات القصوى للعمال المسلمين خلال رمضان (وتُطبق عادة على أنها ست ساعات يوميًا و36 أسبوعيًا). والساعات التي تتجاوز الحد المخفض يجب أن تُعامل كعمل إضافي.</li>
  <li><strong>سقف يومي.</strong> حتى مع العمل الإضافي، لمجموع ساعات العمل في اليوم سقف، ويُذكر عادة أنه 10 ساعات، مع استثناءات محدودة. تحقق من السقف والاستثناءات الحالية قبل التخطيط لورديات طويلة.</li>
  <li><strong>الراحة الأسبوعية.</strong> يستحق العامل يوم راحة أسبوعيًا مدفوع الأجر لا يقل عن 24 ساعة متصلة، وهو عادة يوم الجمعة ما لم يُتفق على غيره.</li>
</ul>

<h2>متى يُسمح بالعمل الإضافي</h2>
<p>يجوز لصاحب العمل طلب العمل الإضافي حين تقتضي حاجة العمل ذلك. ويجب أن يكون العمل الإضافي استثناءً يغطي أوقات الذروة، لا الأساس الخفي للجدول. فإذا كانت الوظيفة تحتاج عشر ساعات كل يوم، فالمشكلة الحقيقية في الجدول، وستصطدم أيضًا بالسقف اليومي. اتفق في العقد أو السياسة على طريقة طلب العمل الإضافي واعتماده، حتى لا يعمل أحد ساعات إضافية لا يعلم بها مديره.</p>

<h2>علاوات العمل الإضافي</h2>
<p>يُدفع العمل الإضافي بأجر الساعة المعتاد للعامل مضافًا إليه علاوة. وتعتمد العلاوة على وقت أداء العمل:</p>
<div class="table-wrap"><table>
  <thead><tr><th>التوقيت</th><th>ما يحصل عليه العامل</th><th>ملاحظة</th></tr></thead>
  <tbody>
    <tr><td>عمل إضافي نهاري</td><td>أجر الساعة مضافًا إليه 25% على الأقل</td><td>أي 125% على الأقل من أجر الساعة</td></tr>
    <tr><td>عمل إضافي ليلي</td><td>أجر الساعة مضافًا إليه علاوة أعلى</td><td>يُذكر عادة أنها 50%؛ تأكد من النسبة ومن تعريف ساعات الليل</td></tr>
    <tr><td>العمل في يوم الراحة الأسبوعية</td><td>الأجر مضافًا إليه 150%، أو يوم راحة آخر</td><td>خيار اليوم البديل يحدده القانون</td></tr>
    <tr><td>العمل في عطلة رسمية</td><td>أجر بزيادة أو يوم راحة بديل</td><td>تأكد من النسبة الحالية لدى الوزارة</td></tr>
  </tbody>
</table></div>
<p>هذه حدود دنيا. ويجوز للعقد أو لسياسة الشركة أن تكون أسخى، وعندها تُطبق الشروط الأفضل. ولأن علاوة الليل وتعريف ساعات الليل مهمان جدًا لأعمال الورديات، راجع النص الحالي للقانون قبل إدخالهما في نظام الرواتب.</p>

<h2>حساب أجر الساعة</h2>
<p>يُحسب العمل الإضافي من أجر الساعة، لكن معظم الناس في البحرين يتقاضون رواتب شهرية. لذا تحتاج إلى طريقة ثابتة لتحويل الأجر الشهري إلى أجر بالساعة. والطريقة الشائعة:</p>
<ol>
  <li>خذ الأجر الشهري كما يعرّفه عقدك.</li>
  <li>اقسمه على 30 للحصول على الأجر اليومي.</li>
  <li>اقسم الأجر اليومي على ساعات العمل اليومية المعتادة (عادة 8) للحصول على أجر الساعة.</li>
</ol>
<p>بعض أصحاب العمل يقسمون على عدد أيام العمل الفعلية أو يستخدمون 26 يوم عمل، وآخرون يحسبون الساعات الأسبوعية. والطرق المختلفة تعطي نتائج مختلفة قليلًا. المهم أن تكون الطريقة مكتوبة، وألا تكون أقل فائدة للعامل مما يسمح به القانون، وأن تبقى نفسها كل شهر.</p>
<p>وكن واضحًا أيضًا بشأن ما يشمله "الأجر". فإذا كانت البدلات الثابتة جزءًا من الأجر وفق العقد، فإن إسقاطها من أجر الساعة يخفض كل دفعة عمل إضافي. وهذا من أكثر الأخطاء التي نراها شيوعًا.</p>

<h2>مثال محلول 1: عمل إضافي نهاري</h2>
<p>موظف يتقاضى 480 دينارًا شهريًا ويعمل عادة 8 ساعات يوميًا. وفي شهر ما عمل 10 ساعات إضافية نهارية.</p>
<div class="table-wrap"><table>
  <thead><tr><th>الخطوة</th><th>الحساب</th><th>النتيجة</th></tr></thead>
  <tbody>
    <tr><td>الأجر اليومي</td><td>480 / 30</td><td>16.000 دينارًا</td></tr>
    <tr><td>أجر الساعة</td><td>16 / 8</td><td>2.000 دينار</td></tr>
    <tr><td>أجر الساعة الإضافية النهارية</td><td>2 × 1.25</td><td>2.500 دينار للساعة</td></tr>
    <tr><td>أجر العمل الإضافي</td><td>2.5 × 10</td><td>25.000 دينارًا</td></tr>
  </tbody>
</table></div>

<h2>مثال محلول 2: عمل إضافي ليلي</h2>
<p>عمل الموظف نفسه أيضًا 6 ساعات إضافية ليلًا. باستخدام علاوة ليلية توضيحية قدرها 50% (تأكد من النسبة الحالية):</p>
<ul>
  <li>أجر الساعة الإضافية الليلية: 2.000 × 1.5 = 3.000 دنانير للساعة.</li>
  <li>أجر العمل الإضافي الليلي: 3 × 6 = 18.000 دينارًا.</li>
</ul>
<p>مجموع العمل الإضافي في الشهر 25 + 18 = 43.000 دينارًا، فوق الراتب المعتاد.</p>

<h2>مثال محلول 3: العمل في يوم الراحة</h2>
<p>عمل الموظف وردية كاملة من 8 ساعات في يوم راحته الأسبوعية، واختار الأجر بدل يوم الراحة البديل. فيحصل على أجر الساعة مضافًا إليه 150%، أي 2.000 × 2.5 = 5.000 دنانير للساعة، أو 40.000 دينارًا عن الوردية. وإذا اختار يوم راحة بديلًا، فسجّل تاريخ أخذه.</p>
<p>كل الأجور في الأمثلة للتوضيح وليست رواتب نموذجية. استخدم الأجر الفعلي من كشف رواتبك.</p>

<h2>من هم خارج قواعد العمل الإضافي</h2>
<p>يستثني قانون العمل بعض الوظائف والحالات من أحكام ساعات العمل. وتشمل عمومًا أصحاب المناصب الإدارية العليا أو الإشرافية ذات الصلاحيات الفعلية، وبعض الأعمال التي تجري بطبيعتها خارج الساعات المعتادة، مثل بعض الأعمال التحضيرية أو التكميلية وبعض الخدمات الأساسية. والقائمة الدقيقة وشروطها موجودة في القانون والقرارات الوزارية.</p>
<p>احذر من المسميات الوظيفية. فتسمية شخص "مديرًا" لا تخرجه من القواعد إذا لم تكن له صلاحيات إدارية فعلية. وإذا اعتمدت على استثناء، فاكتب سبب انطباقه على تلك الوظيفة.</p>

<h2>سجلات تجعل العمل الإضافي سهل الإثبات</h2>
<p>تكاد كل نزاعات العمل الإضافي تدور حول السجلات. احتفظ لكل عامل بما يلي:</p>
<ul>
  <li>الجدول المعتاد: وقت البداية والنهاية، والاستراحة، ويوم الراحة الأسبوعية.</li>
  <li>أوقات البداية والنهاية الفعلية يوميًا، من جهاز بصمة أو تطبيق أو كشف موقّع.</li>
  <li>من اعتمد كل فترة عمل إضافي، ومتى.</li>
  <li>هل كانت الساعات نهارية أم ليلية أم في يوم راحة أم في عطلة رسمية.</li>
  <li>في العمل يوم الراحة أو العطلة، هل اختار العامل الأجر أم يومًا بديلًا، ومتى أُخذ ذلك اليوم.</li>
  <li>أجر الساعة المستخدم والطريقة التي حُسب بها.</li>
</ul>
<p>ادفع العمل الإضافي عبر قناة الرواتب نفسها المستخدمة للأجر المعتاد، حتى يتطابق سجل نظام حماية الأجور مع قسيمة الراتب. واعرض العمل الإضافي في سطر مستقل في القسيمة، مع الساعات والنسبة، ليتمكن العامل من مراجعته.</p>

<h2>إدخال العمل الإضافي في دورة الرواتب الشهرية</h2>
<p>يقع الخطأ في العمل الإضافي غالبًا في نهاية الشهر، حين يجب جمع الساعات من مصادر عدة على عجل. وروتين بسيط يمنع ذلك:</p>
<ol>
  <li><strong>حدد تاريخ إقفال.</strong> مثلًا، العمل الإضافي حتى يوم 25 يُدفع هذا الشهر، وما بعده يُرحّل إلى الشهر التالي. أبلغ الموظفين بالقاعدة حتى لا يظن أحد أن ساعاته ضاعت.</li>
  <li><strong>أقفل كشوف الساعات.</strong> بعد تاريخ الإقفال، يؤكد المشرفون ساعات فرقهم واعتماداتها. وتدخل التعديلات المتأخرة في الدورة التالية مع ملاحظة.</li>
  <li><strong>راجع الحالات الشاذة.</strong> قبل تشغيل الرواتب، اعرض قائمة بمن كان عمله الإضافي مرتفعًا على غير العادة، ومن تجاوز السقف اليومي، ومن عمل في يوم راحته دون تسجيل اختياره بين الأجر واليوم البديل.</li>
  <li><strong>طابق المجاميع.</strong> يجب أن يطابق مجموع ساعات العمل الإضافي حسب النوع مجموع سطور قسائم الرواتب، وأن يطابق ملف الدفع كشف الرواتب.</li>
</ol>
<p>إذا طُبق هذا كل شهر، فإنه يستغرق دقائق لا ساعات، ويمنحك إجابة واضحة إذا سأل عامل أو مفتش يومًا عن طريقة الوصول إلى رقم ما.</p>

<h2>أخطاء شائعة</h2>
<ul>
  <li><strong>"بدل عمل إضافي" ثابت</strong> يُدفع كل شهر بغض النظر عن الساعات، دون أي سجل للساعات خلفه.</li>
  <li><strong>أجر الساعة على الأساسي فقط</strong> مع أن أجر العقد يشمل بدلات ثابتة.</li>
  <li><strong>دفع ساعات الليل بأجر النهار</strong> لأن نظام الجداول لا يعرف ما معنى الليل.</li>
  <li><strong>تجاهل حدود رمضان،</strong> فلا تُعامل الساعات فوق الحد المخفض كعمل إضافي.</li>
  <li><strong>عمل إضافي غير معتمد</strong> لا يستطيع أحد التحقق منه بعد أشهر.</li>
</ul>

<h2>أسئلة شائعة</h2>
<h3>هل يمكننا رفض دفع عمل إضافي لم يعتمده المدير؟</h3>
<p>إذا أُدي العمل بعلم صاحب العمل، فإن رفض الدفع محفوف بالمخاطر. والحل الأفضل هو آلية اعتماد واضحة، حتى لا يحدث العمل الإضافي غير المعتمد أصلًا.</p>
<h3>هل يمكننا منح إجازة بدل أجر العمل الإضافي؟</h3>
<p>بالنسبة ليوم الراحة الأسبوعية والعطل الرسمية، ينص القانون على يوم بديل كخيار. أما العمل الإضافي العادي، فدفع العلاوة هو الخيار الآمن؛ واتفق على أي شيء آخر كتابيًا وتحقق منه لدى الوزارة.</p>
<h3>هل يدخل العمل الإضافي في حساب مكافأة نهاية الخدمة؟</h3>
<p>تُحسب مكافأة نهاية الخدمة على الأجر كما يعرّفه القانون والعقد. والعمل الإضافي العارض ليس عمومًا جزءًا من الأجر الثابت، لكن المدفوعات المنتظمة التعاقدية قد تكون كذلك. تحقق من حالتك تحديدًا.</p>
<h3>هل يستحق الموظفون على راتب شهري ثابت "شامل لكل الساعات" أجر عمل إضافي؟</h3>
<p>لا يستطيع العقد إلغاء حد أدنى قانوني. وما لم تندرج الوظيفة ضمن استثناء قانوني، فإن الساعات التي تتجاوز الحد المعتاد تستحق أجر عمل إضافي.</p>
<h3>كيف نقرّب أجزاء الساعات؟</h3>
<p>اختر قاعدة عادلة ومكتوبة، مثل التسجيل بخطوات من 15 دقيقة، وطبقها بالطريقة نفسها على الجميع.</p>

<p>نبني في RAL أدوات للحضور والوقت والرواتب لأصحاب العمل في البحرين؛ <a href="/ar/contact/">تواصل معنا</a> إن كان حساب العمل الإضافي بدقة سيوفر وقتك.</p>
<p><em>هذا المقال معلومات عامة وليس استشارة قانونية. وهو يعكس قانون العمل البحريني رقم 36 لسنة 2012 كما يُطبق عادة؛ والنسب والحدود قد تتغير، لذا تأكد من المتطلبات الحالية لدى وزارة العمل أو هيئة تنظيم سوق العمل أو الهيئة العامة للتأمين الاجتماعي.</em></p>
`,
}

export const en = [a1, a2]
export const ar = [a1ar, a2ar]
