// Sample data for the simulated RAL HR demo. Company, names, salaries and the
// October payroll totals come from the product brief (seed + marketing video).
// Everything here is a demo company, not a customer.

export const COMPANY = {
  name: 'Bahrain Horizon Facilities W.L.L.',
  nameAr: 'شركة بحرين هورايزن للمرافق ذ.م.م',
  headcount: 98,
  site: 'Seef HQ',
}

export const KPIS = [
  { key: 'headcount', label: 'Headcount', value: 98, prefix: '', suffix: '', note: '10 departments', delta: '2', tone: 'plain', spark: [88, 89, 91, 91, 93, 94, 96, 98] },
  { key: 'pending', label: 'Approvals waiting', value: 4, prefix: '', suffix: '', note: '2 leave, 2 letters', tone: 'warn', spark: [6, 3, 5, 2, 4, 3, 5, 4] },
  { key: 'expiring', label: 'Documents expiring', value: 3, prefix: '', suffix: '', note: 'Next: 12 days', tone: 'warn', spark: [1, 2, 1, 3, 2, 4, 2, 3] },
  { key: 'net', label: 'October net pay', value: 111295, prefix: 'BHD ', suffix: '', note: '98 people paid', delta: '1.2%', tone: 'good', spark: [104, 105, 107, 106, 108, 109, 110, 111] },
] as const

export const DEPARTMENTS = [
  { name: 'Operations', n: 37 },
  { name: 'Maintenance', n: 27 },
  { name: 'Finance', n: 8 },
  { name: 'Sales', n: 8 },
  { name: 'IT', n: 5 },
  { name: 'Other', n: 13 },
]

export const EXPIRING = [
  { who: 'Rajesh Kumar', what: 'Work permit', days: 12 },
  { who: 'Suresh Nair', what: 'Visa', days: 27 },
  { who: 'Imran Khan', what: 'Passport', days: 84 },
]

export const FEED = [
  'Fatima Janahi checked in, Seef HQ, 07:02',
  'Noor Al Sayed requested 3 days annual leave',
  'Priya Reddy asked for a salary certificate',
  'Arun Pillai checked in, Juffair site, 06:48',
  'Hassan Kanoo uploaded a renewed CPR',
  'Bilal Hussain checked out, Sitra site, 15:31',
  'Maryam Al Mannai approved an overtime request',
  'Joseph Fernandes checked in, Seef HQ, 07:10',
]

export const PAYROLL = {
  month: 'October 2026',
  gross: 118460,
  deductions: 7164,
  net: 111295,
  people: 98,
  steps: ['Draft', 'Computed', 'Approved', 'Paid', 'WPS'],
}

// LMRA WPS salary file, 4 of the 10 columns shown in the preview.
// CPRs and IBANs are fake demo values, masked as the real screen does.
export const WPS_ROWS = [
  { cpr: '8907•••41', name: 'Mohammed Kanoo', iban: 'BH67 •••• 0042', total: '922.760' },
  { cpr: '9104•••27', name: 'Fatima Janahi', iban: 'BH29 •••• 1180', total: '596.400' },
  { cpr: '7812•••90', name: 'Rajesh Kumar', iban: 'BH03 •••• 7715', total: '476.600' },
  { cpr: '8203•••15', name: 'Arun Pillai', iban: 'BH51 •••• 3309', total: '421.400' },
]

export const PAYSLIP = {
  who: 'Mohammed Kanoo, Accountant',
  lines: [
    { label: 'Basic', amount: '620.000', rule: 'Contract' },
    { label: 'Housing', amount: '248.000', rule: '40% of basic' },
    { label: 'Transport', amount: '60.000', rule: 'Policy' },
    { label: 'Phone', amount: '25.000', rule: 'Policy' },
    { label: 'Social allowance', amount: '50.000', rule: 'Bahraini staff' },
  ],
  gross: '1,003.000',
  sio: '80.240',
  net: '922.760',
}

export const APPROVALS = [
  { id: 'noor', who: 'Noor Al Sayed', role: 'Site Supervisor, Operations', what: 'Annual leave', detail: 'Sun 15 to Tue 17 Nov, 3 days', stage1: 'Khalid Al Zayani', stage2: 'Aisha Al Arrayed' },
  { id: 'priya', who: 'Priya Reddy', role: 'Accountant, Finance', what: 'Salary certificate', detail: 'For a bank loan, English', stage1: 'Yousif Fakhro', stage2: 'Aisha Al Arrayed' },
]

export const LEAVE_BALANCE = { total: 30, used: 9, pending: 3 }

// Attendance month: 5 weeks, Sun to Sat. 0 = weekly off (Fri, Sat),
// 1 = present, 2 = late, 3 = leave, 4 = holiday, -1 = not yet.
export const ATTENDANCE_GRID: number[] = [
  1, 1, 1, 2, 1, 0, 0,
  1, 1, 1, 1, 1, 0, 0,
  1, 3, 3, 1, 1, 0, 0,
  2, 1, 1, 1, 1, 0, 0,
  1, 1, -1, -1, -1, 0, 0,
]

export const ATTENDANCE_KPIS = [
  { label: 'Present', value: 18, tone: 'good' },
  { label: 'Late', value: 2, tone: 'warn' },
  { label: 'On leave', value: 2, tone: 'plain' },
  { label: 'Overtime', value: 6, suffix: ' h', tone: 'plain' },
] as const

export const SIO_RATES = [
  { who: 'Bahraini, employee', rate: '8%' },
  { who: 'Expat, employee', rate: '1%' },
  { who: 'Expat, employer', rate: '3%' },
]

// Bahraini employer SIO ladder, 2024 to 2028.
export const EMPLOYER_LADDER = [
  { y: '2024', r: 16 },
  { y: '2025', r: 17 },
  { y: '2026', r: 18 },
  { y: '2027', r: 19 },
  { y: '2028', r: 20 },
]

export const PRICING = [
  {
    name: 'Starter',
    price: 1,
    blurb: 'The legal must-haves.',
    items: ['Ask RAL', 'Payroll + WPS file', 'SIO + end of service', 'Leave + attendance', 'Records + expiry alerts', 'Audit log'],
  },
  {
    name: 'Professional',
    price: 2,
    blurb: 'Starter, plus the HR department.',
    items: ['Org chart + documents hub', 'Self-service', 'Hiring + onboarding', 'Reviews', 'Service desk', 'E-signature', 'Benefits, rosters, travel'],
  },
  {
    name: 'Premium',
    price: 3,
    blurb: 'Professional, plus control at scale.',
    items: ['Analytics export', 'Compensation + pay equity', 'Contractors + HSE', 'Enforced SSO', 'Legal hold'],
  },
]

export const FAQ = [
  { q: 'Is the WPS file in the exact LMRA format?', a: 'Yes. RAL HR builds the 10-column LMRA salary file and checks every row before you download it. It never moves money itself: you upload the file to your bank as usual.' },
  { q: 'Does it handle SIO for Bahraini and expat staff?', a: 'Yes. Employee and employer shares for Bahraini and expat staff are worked out each month, with a monthly register. A rate that does not match the rules is refused.' },
  { q: 'Is it really in Arabic?', a: 'Every screen, payslip and report works in Arabic and English, with full right-to-left layout. Ask RAL understands Gulf Arabic, Egyptian Arabic, Arabizi and English.' },
  { q: 'Who can see our data?', a: 'Each company is kept separate, access follows roles, and every change lands in a full log. Backups run nightly. You choose RAL hosting or your own server.' },
  { q: 'We run everything in Excel today. How do we move?', a: 'Import your sheets with a dry run first, so you see exactly what will change. Imports can be undone.' },
  { q: 'Can staff check in from their phones?', a: 'Yes. Web and phone check-in are built in, with GPS and a site radius. The iOS & Android app also covers leave, payslips and approvals.' },
]
