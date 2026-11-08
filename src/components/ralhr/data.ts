// Demo company for the RAL HR page: Bahrain Horizon Facilities W.L.L., 98 people.
// One source of truth. The roster is generated from a fixed seed, so it is the
// same on every load, and every total on the page (hero, demo, Ask RAL) is
// summed from it. Money is kept in fils (1 BHD = 1000 fils) so sums are exact.
// Everything here is a demo company, not a customer. CPRs and IBANs are fake.

export type Lang = 'en' | 'ar'
export type Bi = readonly [string, string]
export type Dept = 'ops' | 'mnt' | 'fin' | 'sal' | 'adm' | 'it' | 'hr'

export const COMPANY = {
  name: 'Bahrain Horizon Facilities W.L.L.',
  nameAr: 'شركة بحرين هورايزن للمرافق ذ.م.م',
  headcount: 98,
  site: 'Seef HQ',
}

export const DEPTS: { id: Dept; name: Bi }[] = [
  { id: 'ops', name: ['Operations', 'العمليات'] },
  { id: 'mnt', name: ['Maintenance', 'الصيانة'] },
  { id: 'fin', name: ['Finance', 'المالية'] },
  { id: 'sal', name: ['Sales', 'المبيعات'] },
  { id: 'adm', name: ['Admin', 'الإدارة'] },
  { id: 'it', name: ['IT', 'تقنية المعلومات'] },
  { id: 'hr', name: ['HR', 'الموارد البشرية'] },
]
export const deptName = (d: Dept, l: Lang) => DEPTS.find((x) => x.id === d)!.name[l === 'ar' ? 1 : 0]

export const SITES: Bi[] = [['Seef HQ', 'مقر السيف'], ['Juffair site', 'موقع الجفير'], ['Sitra site', 'موقع سترة'], ['Hidd site', 'موقع الحد']]

/* ---------- money ---------- */
export function fmt(fils: number, dp = 3): string {
  return (fils / 1000).toLocaleString('en-US', { minimumFractionDigits: dp, maximumFractionDigits: dp })
}
export const bd = (fils: number, l: Lang, dp = 3) => (l === 'ar' ? `${fmt(fils, dp)} د.ب` : `BD ${fmt(fils, dp)}`)

/* ---------- roster ---------- */
type Role = { t: Bi; bh: number; band: [number, number]; staff: boolean; n: number }
const R = (en: string, ar: string, n: number, bh: number, lo: number, hi: number, staff = true): Role => ({ t: [en, ar], n, bh, band: [lo, hi], staff })
const ROLES: Record<Dept, Role[]> = {
  ops: [R('Operations Manager', 'مدير العمليات', 1, 1, 1500, 1500), R('Site Supervisor', 'مشرف موقع', 5, 0.8, 640, 820), R('Facilities Coordinator', 'منسق مرافق', 4, 0.75, 520, 640),
    R('Housekeeping Lead', 'مشرف نظافة', 3, 0, 300, 360, false), R('Security Guard', 'حارس أمن', 8, 0.4, 260, 340, false), R('Driver', 'سائق', 5, 0.2, 250, 300, false), R('Cleaner', 'عامل نظافة', 11, 0, 160, 200, false)],
  mnt: [R('Maintenance Manager', 'مديرة الصيانة', 1, 1, 1450, 1450), R('Maintenance Engineer', 'مهندس صيانة', 4, 0.75, 820, 1050), R('HVAC Technician', 'فني تكييف', 6, 0.35, 360, 460, false),
    R('Technician', 'فني', 6, 0.35, 320, 420, false), R('Electrician', 'كهربائي', 5, 0.35, 300, 400, false), R('Plumber', 'سبّاك', 5, 0.2, 280, 360, false)],
  fin: [R('Finance Manager', 'مدير المالية', 1, 1, 1700, 1700), R('Accountant', 'محاسب', 4, 0.75, 620, 760), R('Payroll Officer', 'مسؤولة رواتب', 2, 1, 640, 720), R('AP Clerk', 'موظف حسابات دائنة', 1, 0.5, 440, 520)],
  sal: [R('Sales Manager', 'مدير المبيعات', 1, 1, 1600, 1600), R('Account Manager', 'مدير حسابات', 4, 0.75, 800, 1000), R('Bid Coordinator', 'منسق عطاءات', 3, 0.5, 560, 680)],
  adm: [R('General Manager', 'المدير العام', 1, 1, 2800, 2800), R('Procurement Officer', 'مسؤول مشتريات', 2, 0.75, 560, 680), R('Receptionist', 'موظفة استقبال', 2, 0.5, 380, 460), R('Storekeeper', 'أمين مخزن', 2, 0.25, 300, 360, false), R('Office Assistant', 'مساعد مكتب', 2, 0.25, 260, 320, false)],
  it: [R('IT Lead', 'رئيس تقنية المعلومات', 1, 1, 1350, 1350), R('Systems Admin', 'مسؤول أنظمة', 2, 0.75, 820, 960), R('IT Support', 'دعم فني', 2, 0.75, 480, 560)],
  hr: [R('HR Manager', 'مديرة الموارد البشرية', 1, 1, 1500, 1500), R('HR Officer', 'موظفة موارد بشرية', 2, 1, 560, 640), R('PRO', 'مندوب علاقات حكومية', 1, 1, 520, 560)],
}

// People the rest of the page talks about by name. The first 8 are the hero's
// payday staff, with the same gross pay, CPR and IBAN as the hero shows.
type Fixed = { en: string; ar: string; d: Dept; r: string; bh: boolean; f?: boolean; gross?: number; cpr?: string; iban?: string; joined?: number; used?: number }
const FIXED: Fixed[] = [
  { en: 'Mohammed Kanoo', ar: 'محمد كانو', d: 'fin', r: 'Accountant', bh: true, gross: 1003, cpr: '8907•••41', iban: 'BH67 •••• 0042', joined: 2016, used: 12 },
  { en: 'Fatima Janahi', ar: 'فاطمة جناحي', d: 'hr', r: 'HR Officer', bh: true, f: true, gross: 720, cpr: '9104•••27', iban: 'BH29 •••• 1180', joined: 2019 },
  { en: 'Rajesh Kumar', ar: 'راجيش كومار', d: 'mnt', r: 'Technician', bh: false, gross: 480, cpr: '7812•••90', iban: 'BH03 •••• 7715', joined: 2014, used: 6 },
  { en: 'Noor Al Sayed', ar: 'نور السيد', d: 'ops', r: 'Site Supervisor', bh: true, f: true, gross: 860, cpr: '9302•••58', iban: 'BH84 •••• 2261', joined: 2020, used: 9 },
  { en: 'Arun Pillai', ar: 'أرون بيلاي', d: 'mnt', r: 'Electrician', bh: false, gross: 425, cpr: '8203•••15', iban: 'BH51 •••• 3309', joined: 2017 },
  { en: 'Priya Reddy', ar: 'بريا ريدي', d: 'fin', r: 'Accountant', bh: false, f: true, gross: 690, cpr: '9011•••62', iban: 'BH12 •••• 4470', joined: 2021 },
  { en: 'Hassan Kanoo', ar: 'حسن كانو', d: 'ops', r: 'Operations Manager', bh: true, gross: 1240, cpr: '8605•••03', iban: 'BH40 •••• 9934', joined: 2012 },
  { en: 'Joseph Fernandes', ar: 'جوزيف فرنانديز', d: 'ops', r: 'Driver', bh: false, gross: 395, cpr: '8812•••77', iban: 'BH95 •••• 5108', joined: 2015, used: 14 },
  { en: 'Khalid Al Zayani', ar: 'خالد الزياني', d: 'adm', r: 'General Manager', bh: true, joined: 2009 },
  { en: 'Aisha Al Arrayed', ar: 'عائشة العريض', d: 'hr', r: 'HR Manager', bh: true, f: true, joined: 2013 },
  { en: 'Yousif Fakhro', ar: 'يوسف فخرو', d: 'fin', r: 'Finance Manager', bh: true, joined: 2011 },
  { en: 'Maryam Al Mannai', ar: 'مريم المناعي', d: 'mnt', r: 'Maintenance Manager', bh: true, f: true, joined: 2014 },
  { en: 'Suresh Nair', ar: 'سوريش ناير', d: 'mnt', r: 'HVAC Technician', bh: false, joined: 2018, used: 4 },
  { en: 'Bilal Hussain', ar: 'بلال حسين', d: 'mnt', r: 'Plumber', bh: false, joined: 2022, used: 11 },
  { en: 'Maria Santos', ar: 'ماريا سانتوس', d: 'adm', r: 'Receptionist', bh: false, f: true, joined: 2021, used: 8 },
  { en: 'Imran Khan', ar: 'عمران خان', d: 'ops', r: 'Security Guard', bh: false, joined: 2019 },
  { en: 'Anil Menon', ar: 'أنيل مينون', d: 'mnt', r: 'Technician', bh: false, joined: 2016 },
  { en: 'Sara Bucheeri', ar: 'سارة بوجيري', d: 'fin', r: 'Payroll Officer', bh: true, f: true, joined: 2020 },
  { en: 'Joy Mendoza', ar: 'جوي ميندوزا', d: 'ops', r: 'Housekeeping Lead', bh: false, f: true, joined: 2018 },
  { en: 'Vinod Thomas', ar: 'فينود توماس', d: 'ops', r: 'Driver', bh: false, joined: 2017 },
]

const BH_M: Bi[] = [['Ahmed', 'أحمد'], ['Ali', 'علي'], ['Hussain', 'حسين'], ['Ebrahim', 'إبراهيم'], ['Salman', 'سلمان'], ['Jassim', 'جاسم'], ['Hamad', 'حمد'], ['Abdulla', 'عبدالله'], ['Mahmood', 'محمود'], ['Sayed Hashim', 'السيد هاشم'], ['Isa', 'عيسى'], ['Fawaz', 'فواز']]
const BH_F: Bi[] = [['Zainab', 'زينب'], ['Hessa', 'حصة'], ['Amina', 'أمينة'], ['Dana', 'دانة'], ['Latifa', 'لطيفة'], ['Mariam', 'مريم'], ['Shaikha', 'شيخة'], ['Reem', 'ريم']]
const BH_L: Bi[] = [['Al Khaja', 'الخاجة'], ['Al Haddad', 'الحداد'], ['Al Shehabi', 'الشهابي'], ['Al Mahroos', 'المحروس'], ['Al Aali', 'العالي'], ['Al Doseri', 'الدوسري'], ['Al Qassab', 'القصاب'], ['Matar', 'مطر'], ['Al Musawi', 'الموسوي'], ['Bukhammas', 'بوخماس'], ['Al Jishi', 'الجشي'], ['Taqi', 'تقي']]
const EX: { f: Bi[]; l: Bi[]; w: Bi[] }[] = [
  { f: [['Sunil', 'سونيل'], ['Manoj', 'مانوج'], ['Ravi', 'رافي'], ['Deepak', 'ديباك'], ['Santhosh', 'سانتوش'], ['Biju', 'بيجو'], ['Prakash', 'براكاش']], w: [['Lakshmi', 'لاكشمي'], ['Anjali', 'أنجالي']], l: [['Varghese', 'فارغيز'], ['Nambiar', 'نامبيار'], ['Sharma', 'شارما'], ['Das', 'داس'], ['Iyer', 'آيير'], ['George', 'جورج'], ['Kurian', 'كوريان']] },
  { f: [['Asif', 'آصف'], ['Tariq', 'طارق'], ['Usman', 'عثمان'], ['Waqas', 'وقاص'], ['Naveed', 'نويد']], w: [['Sana', 'ثناء']], l: [['Iqbal', 'إقبال'], ['Mahmood', 'محمود'], ['Butt', 'بت'], ['Raza', 'رضا'], ['Akhtar', 'أختر']] },
  { f: [['Jomar', 'جومار'], ['Carlo', 'كارلو'], ['Mark', 'مارك']], w: [['Rhea', 'ريا'], ['Grace', 'غريس'], ['Liza', 'ليزا']], l: [['Dela Cruz', 'ديلا كروز'], ['Reyes', 'رييس'], ['Bautista', 'باوتيستا'], ['Villanueva', 'فيلانويفا'], ['Ramos', 'راموس']] },
  { f: [['Rahim', 'رحيم'], ['Shafiqul', 'شفيق'], ['Mizanur', 'ميزان'], ['Kamal', 'كمال']], w: [], l: [['Uddin', 'الدين'], ['Islam', 'إسلام'], ['Rahman', 'رحمن'], ['Hossain', 'حسين']] },
  { f: [['Ramesh', 'راميش'], ['Bikash', 'بيكاش'], ['Suman', 'سومان']], w: [], l: [['Thapa', 'ثابا'], ['Gurung', 'غورونغ'], ['Rai', 'راي']] },
]
const BANKS: Bi[] = [['NBB', 'الوطني'], ['BBK', 'بي بي كي'], ['KFH', 'بيتك'], ['BisB', 'البحرين الإسلامي'], ['Ahli United', 'الأهلي المتحد']]

function rng(seed: number) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export type Person = {
  id: number; en: string; ar: string; role: Bi; d: Dept; bh: boolean; f: boolean; staff: boolean
  basic: number; housing: number; transport: number; phone: number; social: number; gross: number
  sio: number; advance: number; net: number; erSio: number; eos: number
  cpr: string; iban: string; bank: Bi; site: number; joined: number; leave: { total: number; used: number }
}

const GROSS_TARGET = 118_460_000 // October gross, fils
const DED_TARGET = 7_165_000 // October deductions, fils
const SIO_CAP = 4_000_000 // contributions stop at BD 4,000 a month
export const SIO = { bhEmp: 0.08, exEmp: 0.01, bhEr: 0.18, exEr: 0.03, eosNew: 0.042, eosLater: 0.084 }

function build(): Person[] {
  const rand = rng(98)
  const pick = <T,>(a: T[]) => a[Math.floor(rand() * a.length)]
  const used = new Set(FIXED.map((x) => x.en))
  const out: Person[] = []
  const comp = (p: { basic: number; staff: boolean; bh: boolean }) => {
    const transport = p.staff ? 60_000 : 30_000
    const phone = p.staff ? 25_000 : 0
    const social = p.bh ? 50_000 : 0
    return { transport, phone, social }
  }
  for (const d of DEPTS) {
    for (const role of ROLES[d.id]) {
      const fixed = FIXED.filter((x) => x.d === d.id && x.r === role.t[0])
      for (let k = 0; k < role.n; k++) {
        const fx = fixed[k]
        let en: string, ar: string, bh: boolean, f: boolean
        if (fx) ({ en, ar, bh, f = false } = { ...fx })
        else {
          bh = rand() < role.bh
          f = !role.staff ? false : rand() < 0.3
          for (;;) {
            let fn: Bi, ln: Bi
            if (bh) { fn = pick(f ? BH_F : BH_M); ln = pick(BH_L) } else {
              const g = pick(EX.filter((x) => !f || x.w.length)); fn = pick(f ? g.w : g.f); ln = pick(g.l)
            }
            en = `${fn[0]} ${ln[0]}`; ar = `${fn[1]} ${ln[1]}`
            if (!used.has(en)) { used.add(en); break }
          }
        }
        const lift = (bh ? 1.25 : 1) * 1.36
        let basic = Math.round(((role.band[0] + rand() * (role.band[1] - role.band[0])) * lift) / 5) * 5_000
        const c = comp({ basic, staff: role.staff, bh })
        let housing = Math.round(basic * 0.4)
        if (fx?.gross) {
          const rest = fx.gross * 1000 - c.transport - c.phone - c.social
          basic = Math.round(rest / 1.4 / 5000) * 5000
          if (fx.en === 'Mohammed Kanoo') basic = 620_000
          housing = rest - basic
        }
        const id = out.length
        const yy = bh ? 70 + Math.floor(rand() * 30) : 0
        out.push({
          id, en, ar, role: role.t, d: d.id, bh, f, staff: role.staff, basic, housing, ...c, gross: 0, sio: 0, advance: 0, net: 0, erSio: 0, eos: 0,
          cpr: fx?.cpr ?? `${bh ? yy : 80 + Math.floor(rand() * 20)}${String(1 + Math.floor(rand() * 12)).padStart(2, '0')}•••${String(Math.floor(rand() * 90) + 10)}`,
          iban: fx?.iban ?? `BH${String(Math.floor(rand() * 90) + 10)} •••• ${String(Math.floor(rand() * 9000) + 1000)}`,
          bank: pick(BANKS), site: d.id === 'ops' || d.id === 'mnt' ? Math.floor(rand() * 4) : 0,
          joined: fx?.joined ?? 2008 + Math.floor(rand() * 18),
          leave: { total: 30, used: fx?.used ?? Math.floor(rand() * 22) },
        })
      }
    }
  }
  // Pay: gross, then the GM's pay closes the month to the October total.
  for (const p of out) p.gross = p.basic + p.housing + p.transport + p.phone + p.social
  const gm = out.find((p) => p.en === 'Khalid Al Zayani')!
  const others = out.reduce((a, p) => a + (p === gm ? 0 : p.gross), 0)
  const gmRest = GROSS_TARGET - others - gm.transport - gm.phone - gm.social
  gm.basic = Math.round(gmRest / 1.4 / 5000) * 5000
  gm.housing = gmRest - gm.basic
  gm.gross = GROSS_TARGET - others
  // SIO on pay up to the cap, then salary advance repayments close deductions.
  for (const p of out) {
    const base = Math.min(p.gross, SIO_CAP)
    p.sio = Math.round(base * (p.bh ? SIO.bhEmp : SIO.exEmp))
    const years = 2026 - p.joined
    p.erSio = Math.round(base * (p.bh ? SIO.bhEr : SIO.exEr + (years >= 3 ? SIO.eosLater : SIO.eosNew)))
  }
  const sioAll = out.reduce((a, p) => a + p.sio, 0)
  const adv = ['Suresh Nair', 'Bilal Hussain', 'Imran Khan', 'Joy Mendoza', 'Vinod Thomas', 'Anil Menon'].map((n) => out.find((p) => p.en === n)!)
  const plan = [95_000, 80_000, 60_000, 55_000, 70_000]
  let left = DED_TARGET - sioAll
  adv.forEach((p, i) => { p.advance = i < plan.length ? plan[i] : left; left -= p.advance })
  for (const p of out) p.net = p.gross - p.sio - p.advance
  return out
}

export const ROSTER: Person[] = build()
export const byName = (en: string) => ROSTER.find((p) => p.en === en)!
const sum = (f: (p: Person) => number, list = ROSTER) => list.reduce((a, p) => a + f(p), 0)

export const TOTALS = {
  gross: sum((p) => p.gross),
  sio: sum((p) => p.sio),
  advance: sum((p) => p.advance),
  net: sum((p) => p.net),
  erSio: sum((p) => p.erSio),
  bh: ROSTER.filter((p) => p.bh).length,
  bhSio: sum((p) => (p.bh ? p.sio : 0)),
  exSio: sum((p) => (p.bh ? 0 : p.sio)),
  bhEr: sum((p) => (p.bh ? p.erSio : 0)),
  exEr: sum((p) => (p.bh ? 0 : p.erSio)),
  septNet: 109_975_300,
}

// Kept in BHD for the hero, which reads these three numbers.
export const PAYROLL = {
  month: 'October 2026',
  gross: TOTALS.gross / 1000,
  deductions: (TOTALS.sio + TOTALS.advance) / 1000,
  net: TOTALS.net / 1000,
  people: ROSTER.length,
  steps: ['Draft', 'Computed', 'Approved', 'Paid', 'WPS'],
}

export const deptTotals = () => DEPTS.map((d) => {
  const list = ROSTER.filter((p) => p.d === d.id)
  return { d: d.id, n: list.length, gross: sum((p) => p.gross, list) }
})

/* ---------- leave: November 2026, starts on a Sunday, Fri + Sat off ---------- */
export const NOV_START_DOW = 0
export const isOff = (day: number) => { const w = (day - 1 + NOV_START_DOW) % 7; return w === 5 || w === 6 }
export const workDays = (a: number, b: number) => { const o: number[] = []; for (let d = a; d <= b; d++) if (!isOff(d)) o.push(d); return o }

export type LeaveReq = { id: string; who: string; kind: Bi; from: number; to: number; note: Bi; stage1: string }
export const REQUESTS: LeaveReq[] = [
  { id: 'noor', who: 'Noor Al Sayed', kind: ['Annual leave', 'إجازة سنوية'], from: 15, to: 17, note: ['Family wedding in Muharraq', 'حفل زفاف عائلي في المحرق'], stage1: 'Hassan Kanoo' },
  { id: 'suresh', who: 'Suresh Nair', kind: ['Annual leave', 'إجازة سنوية'], from: 22, to: 30, note: ['Flight home to Kochi, ticket attached', 'رحلة إلى كوتشي، التذكرة مرفقة'], stage1: 'Maryam Al Mannai' },
  { id: 'maria', who: 'Maria Santos', kind: ['Annual leave', 'إجازة سنوية'], from: 4, to: 5, note: ['Passport renewal at the embassy', 'تجديد الجواز في السفارة'], stage1: 'Khalid Al Zayani' },
  { id: 'bilal', who: 'Bilal Hussain', kind: ['Emergency leave', 'إجازة طارئة'], from: 2, to: 2, note: ['Family matter', 'ظرف عائلي'], stage1: 'Maryam Al Mannai' },
]
// Leave already approved this month, shown on the calendar.
export const BOOKED: { who: string; from: number; to: number }[] = [
  { who: 'Anil Menon', from: 1, to: 5 },
  { who: 'Vinod Thomas', from: 8, to: 12 },
  { who: 'Imran Khan', from: 16, to: 19 },
  { who: 'Sara Bucheeri', from: 18, to: 19 },
  { who: 'Joy Mendoza', from: 23, to: 26 },
  { who: 'Arun Pillai', from: 25, to: 29 },
  { who: 'Rajesh Kumar', from: 26, to: 26 },
]
export const MIN_COVER: Record<Dept, number> = { ops: 33, mnt: 24, fin: 6, sal: 6, adm: 7, it: 4, hr: 3 }

/* ---------- attendance today (Thu 29 Oct, payroll day) ---------- */
export const ATTENDANCE = {
  onTime: 83, late: 4, leave: 6, sick: 3, notIn: 2,
  bySite: [31, 24, 19, 13],
  overtime: [46, 112, 88, 61], // hours this month, by site
}
export const FEED: { who: string; what: Bi; site: number; at: string }[] = [
  { who: 'Fatima Janahi', what: ['checked in', 'سجّلت الحضور'], site: 0, at: '07:02' },
  { who: 'Arun Pillai', what: ['checked in', 'سجّل الحضور'], site: 1, at: '06:48' },
  { who: 'Joseph Fernandes', what: ['checked in', 'سجّل الحضور'], site: 0, at: '07:10' },
  { who: 'Rajesh Kumar', what: ['checked in late', 'سجّل الحضور متأخرًا'], site: 2, at: '07:24' },
  { who: 'Bilal Hussain', what: ['checked in', 'سجّل الحضور'], site: 2, at: '06:55' },
]
export const EXPIRING: { who: string; what: Bi; days: number }[] = [
  { who: 'Rajesh Kumar', what: ['Work permit', 'تصريح العمل'], days: 12 },
  { who: 'Suresh Nair', what: ['Residence permit', 'الإقامة'], days: 27 },
  { who: 'Imran Khan', what: ['Passport', 'جواز السفر'], days: 84 },
]

/* ---------- end of service ---------- */
// Labour Law Art. 116 gratuity for service up to 29 Feb 2024 (15 days a year
// for the first 3 years, 30 days after), then the SIO monthly scheme from
// March 2024 (employer pays 4.2% in the first 3 years, 8.4% after).
// Leaving date 30 Nov 2026. Bahrainis are covered by the SIO pension instead.
export function endOfService(basic: number, years: number) {
  const months = Math.round(years * 12)
  const newMonths = Math.min(months, 33) // Mar 2024 to Nov 2026
  const oldMonths = months - newMonths
  const daily = basic / 30
  const oldYears = oldMonths / 12
  const oldDays = Math.min(oldYears, 3) * 15 + Math.max(0, oldYears - 3) * 30
  const oldAmt = Math.round(oldDays * daily)
  let newAmt = 0
  for (let m = 0; m < newMonths; m++) newAmt += basic * (oldMonths + m < 36 ? SIO.eosNew : SIO.eosLater)
  newAmt = Math.round(newAmt)
  return { months, oldMonths, newMonths, oldDays, oldAmt, newAmt, total: oldAmt + newAmt }
}

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
