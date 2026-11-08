// One source of truth for the RAL HR module catalogue, shared by the pricing box and the inquiry flow.
// Every user-facing string is a { en, ar } object so the Arabic site can show it.
// Status and tier come from the RAL HR repo (platform/Modules.java gates, the web router, docs/32 gap register)
// mapped onto the public PRICING tiers in data.ts. Full table: docs/ral-hr/MODULES.md.
import { PRICING } from './data'

export type T = { en: string; ar: string }
export type Status = 'live' | 'demo' | 'soon'
/** Index into PRICING: 0 Starter, 1 Professional, 2 Premium. */
export type Tier = 0 | 1 | 2
export type Mod = { id: string; name: T; note: T; tier: Tier; status: Status }
export type Cat = { id: string; name: T; blurb: T; mods: Mod[] }

const t = (en: string, ar: string): T => ({ en, ar })
const m = (id: string, name: T, note: T, tier: Tier, status: Status): Mod => ({ id, name, note, tier, status })

export const CATEGORIES: Cat[] = [
  {
    id: 'pay', name: t('Payroll and compliance', 'الرواتب والامتثال'), blurb: t('Pay people right, on time, by the book.', 'رواتب صحيحة، في وقتها، وحسب القانون.'),
    mods: [
      m('payroll', t('Payroll runs', 'مسيرات الرواتب'), t('Monthly runs, payslips in EN and AR', 'مسير شهري وقسائم رواتب بالعربي والإنجليزي'), 0, 'live'),
      m('wps', t('WPS salary file', 'ملف رواتب حماية الأجور'), t('The LMRA bank file, checked row by row', 'ملف البنك بصيغة هيئة تنظيم سوق العمل، مدقق سطراً بسطر'), 0, 'live'),
      m('sio', t('SIO + end of service', 'التأمينات ومكافأة نهاية الخدمة'), t('Shares, register and gratuity worked out', 'الحصص والسجل والمكافأة محسوبة وجاهزة'), 0, 'live'),
      m('settlement', t('Final settlement', 'التسوية النهائية'), t('Leavers paid out to the article', 'مستحقات المغادرين حسب مواد القانون'), 0, 'live'),
      m('bahrainisation', t('Bahrainisation report', 'تقرير البحرنة'), t('Your quota figure, ready for LMRA', 'نسبة البحرنة جاهزة لهيئة تنظيم سوق العمل'), 0, 'live'),
      m('journals', t('Accounting journal export', 'تصدير القيود المحاسبية'), t('Xero, QuickBooks, Zoho and Odoo files', 'ملفات Xero وQuickBooks وZoho وOdoo'), 1, 'live'),
      m('acct-sync', t('Live accounting sync', 'ربط مباشر مع المحاسبة'), t('Post journals straight to your books', 'ترحيل القيود مباشرة إلى حساباتكم'), 2, 'soon'),
      m('multi-currency', t('Multi-currency payroll', 'رواتب بعدة عملات'), t('Pay staff in their own currency', 'صرف الراتب بعملة كل موظف'), 2, 'soon'),
    ],
  },
  {
    id: 'time', name: t('Time and leave', 'الوقت والإجازات'), blurb: t('Who is in, who is off, and who is on shift.', 'من حاضر، من في إجازة، ومن على المناوبة.'),
    mods: [
      m('leave', t('Leave + balances', 'الإجازات والأرصدة'), t('Statutory types, accrual and approvals', 'الإجازات النظامية والاستحقاق والموافقات'), 0, 'live'),
      m('attendance', t('Attendance + phone check-in', 'الحضور والتسجيل من الجوال'), t('GPS and site radius, overtime counted', 'تحديد الموقع ونطاق العمل، مع احتساب الإضافي'), 0, 'live'),
      m('rostering', t('Rosters + open shifts', 'جداول المناوبات والورديات المفتوحة'), t('Plan the week, publish, swap', 'خطط الأسبوع وانشره وبدّل الورديات'), 1, 'live'),
      m('travel', t('Business travel', 'سفر العمل'), t('Trip requests, approvals and per diems', 'طلبات السفر والموافقات والبدل اليومي'), 1, 'live'),
      m('hourly-leave', t('Hourly leave', 'الاستئذان بالساعات'), t('Short permissions within a day', 'استئذان قصير خلال اليوم'), 0, 'soon'),
      m('selfie', t('Selfie check-in', 'تسجيل الحضور بصورة'), t('Photo proof at the punch', 'صورة تثبت الحضور عند التسجيل'), 1, 'soon'),
    ],
  },
  {
    id: 'people', name: t('People and org', 'الموظفون والهيكل'), blurb: t('One clean record for every person.', 'ملف واحد مرتب لكل موظف.'),
    mods: [
      m('records', t('Records + expiry alerts', 'ملفات الموظفين وتنبيهات الانتهاء'), t('CPR, passport and permit reminders', 'تذكير بانتهاء البطاقة السكانية والجواز والتصريح'), 0, 'live'),
      m('org-chart', t('Org chart', 'الهيكل التنظيمي'), t('Departments, managers and headcount', 'الأقسام والمدراء وعدد الموظفين'), 0, 'live'),
      m('documents', t('Documents hub', 'مركز المستندات'), t('Every file in one place, per person', 'كل ملفات الموظف في مكان واحد'), 0, 'live'),
      m('contracts', t('Bilingual contracts', 'عقود بلغتين'), t('Written contracts in Arabic and English', 'عقود مكتوبة بالعربي والإنجليزي'), 0, 'live'),
      m('import', t('Excel import', 'الاستيراد من Excel'), t('Bring your sheets in with a dry run', 'انقل ملفاتك مع تجربة قبل الاعتماد'), 0, 'live'),
      m('hr-actions', t('HR actions', 'إجراءات الموارد البشرية'), t('Promotions, transfers and warnings', 'الترقيات والنقل والإنذارات'), 1, 'live'),
      m('esign', t('E-signature', 'التوقيع الإلكتروني'), t('Sign contracts and letters online', 'توقيع العقود والخطابات إلكترونياً'), 1, 'live'),
      m('assets', t('Assets + exit clearance', 'العهد وإخلاء الطرف'), t('Laptops, phones and cards tracked', 'متابعة الأجهزة والجوالات والبطاقات'), 1, 'demo'),
    ],
  },
  {
    id: 'talent', name: t('Talent', 'المواهب'), blurb: t('Hire, welcome and grow your people.', 'وظّف، استقبل، وطوّر فريقك.'),
    mods: [
      m('hiring', t('Hiring', 'التوظيف'), t('Openings, candidates and offers', 'الشواغر والمرشحون والعروض'), 1, 'live'),
      m('onboarding', t('Onboarding', 'تهيئة الموظفين الجدد'), t('Checklists from offer to day one', 'قوائم مهام من العرض إلى أول يوم عمل'), 1, 'live'),
      m('reviews', t('Reviews + goals', 'التقييمات والأهداف'), t('Cycles, ratings and feedback', 'دورات التقييم والدرجات والملاحظات'), 1, 'live'),
      m('learning', t('Learning', 'التدريب'), t('Courses, sessions and completions', 'الدورات والجلسات ونسب الإنجاز'), 1, 'demo'),
      m('compensation', t('Compensation + pay equity', 'التعويضات وعدالة الأجور'), t('Merit and bonus cycles, gap checks', 'دورات الزيادات والمكافآت وفحص الفجوات'), 2, 'demo'),
    ],
  },
  {
    id: 'engage', name: t('Engagement and service', 'التفاعل والخدمة'), blurb: t('Answers and care for every employee.', 'إجابات واهتمام لكل موظف.'),
    mods: [
      m('ask-ral', t('Ask RAL assistant', 'مساعد Ask RAL'), t('HR answers in Arabic and English', 'إجابات الموارد البشرية بالعربي والإنجليزي'), 0, 'demo'),
      m('app', t('Staff phone app', 'تطبيق الجوال للموظفين'), t('iOS and Android: leave, pay, check-in', 'iOS وAndroid: الإجازات والرواتب والحضور'), 0, 'live'),
      m('policies', t('Policies + sign-off', 'السياسات والإقرار'), t('Publish a policy, track who read it', 'انشر السياسة وتابع من اطّلع عليها'), 1, 'live'),
      m('benefits', t('Benefits', 'المزايا'), t('Plans, enrolment and dependants', 'الخطط والتسجيل والمعالون'), 1, 'live'),
      m('wall', t('Company wall', 'جدار الشركة'), t('Announcements, birthdays, anniversaries', 'الإعلانات وأعياد الميلاد وذكرى التعيين'), 1, 'demo'),
      m('rewards', t('Kudos + rewards', 'الشكر والمكافآت'), t('Recognition between colleagues', 'تقدير متبادل بين الزملاء'), 1, 'demo'),
    ],
  },
  {
    id: 'ops', name: t('Workforce operations', 'عمليات القوى العاملة'), blurb: t('For crews, sites and vehicles.', 'للفرق والمواقع والمركبات.'),
    mods: [
      m('automation', t('Workflow automation', 'أتمتة سير العمل'), t('Rules that act on dates and events', 'قواعد تعمل تلقائياً حسب التواريخ والأحداث'), 1, 'demo'),
      m('contractors', t('Contractors', 'المقاولون'), t('Agency staff, timesheets and costs', 'عمالة الوكالات وسجلات الساعات والتكاليف'), 2, 'demo'),
      m('hse', t('Health and safety', 'الصحة والسلامة'), t('Incidents, inspections, injury reports', 'الحوادث والتفتيش وتقارير الإصابات'), 2, 'demo'),
      m('fleet', t('Fleet', 'الأسطول'), t('Vehicles, drivers, services and fines', 'المركبات والسائقون والصيانة والمخالفات'), 2, 'demo'),
    ],
  },
  {
    id: 'control', name: t('Analytics and control', 'التحليلات والتحكم'), blurb: t('Oversight for owners, finance and IT.', 'رقابة للملاك والمالية وتقنية المعلومات.'),
    mods: [
      m('reports', t('Reports', 'التقارير'), t('Headcount, payroll and leave reports', 'تقارير الموظفين والرواتب والإجازات'), 0, 'live'),
      m('audit', t('Audit log', 'سجل التدقيق'), t('Every change, who and when', 'كل تغيير، من قام به ومتى'), 0, 'live'),
      m('analytics', t('Analytics export', 'تصدير التحليلات'), t('Every report to Excel', 'كل تقرير إلى Excel'), 2, 'demo'),
      m('legal-hold', t('Legal hold + retention', 'الحفظ القانوني والاحتفاظ'), t('Freeze records for a case', 'تجميد السجلات لقضية قائمة'), 2, 'demo'),
      m('sso', t('Enforced single sign-on', 'الدخول الموحد الإلزامي'), t('Microsoft and Google login', 'الدخول بحساب Microsoft أو Google'), 0, 'soon'),
      m('two-factor', t('Two-factor login', 'الدخول بخطوتين'), t('A second step for every staff login', 'خطوة تحقق إضافية لكل دخول'), 0, 'soon'),
      m('erp', t('ERP integration', 'الربط مع نظام ERP'), t('Two-way sync with your ERP', 'مزامنة باتجاهين مع نظام ERP'), 2, 'soon'),
    ],
  },
]

export const ALL_MODS: Mod[] = CATEGORIES.flatMap((c) => c.mods)
const BY_ID = new Map(ALL_MODS.map((x) => [x.id, x]))
export const modById = (id: string) => BY_ID.get(id)
export const cleanIds = (ids: unknown): string[] => Array.isArray(ids) ? [...new Set(ids.filter((x): x is string => typeof x === 'string' && BY_ID.has(x)))] : []

/** Lowest plan that covers every pick (the highest tier among them). */
export const fitTier = (ids: string[]): Tier => ids.reduce<Tier>((acc, id) => Math.max(acc, BY_ID.get(id)?.tier ?? 0) as Tier, 0)
export const tierName = (x: Tier) => PRICING[x].name
export const TIER_AR: Record<Tier, string> = { 0: 'الأساسية', 1: 'الاحترافية', 2: 'المميزة' }

/** Query string key that carries picks from the pricing box into the inquiry. */
export const QS = 'modules'
export const fromQuery = (search: string) => cleanIds((new URLSearchParams(search).get(QS) || '').split(','))
export const toQuery = (ids: string[]) => ids.length ? `?${QS}=${ids.join(',')}` : ''

export const STR = {
  status: { live: t('Live', 'متاح الآن'), demo: t('In the demo', 'في العرض التجريبي'), soon: t('Coming soon', 'قريباً') } as Record<Status, T>,
  statusHelp: {
    live: t('Running for clients today', 'يعمل لدى عملائنا اليوم'),
    demo: t('Built, try it in the full demo', 'جاهز، جرّبه في العرض التجريبي الكامل'),
    soon: t('On the roadmap, pick it to tell us you want it', 'ضمن خطتنا القادمة، اختره ليصلنا اهتمامك'),
  } as Record<Status, T>,
  statusKey: t('Status key', 'دليل الحالات'),
  selectAll: t('Select all', 'تحديد الكل'),
  clearCat: t('Clear', 'إلغاء'),
  clearAll: t('Clear all', 'إلغاء الكل'),
  picked: t('picked', 'مختارة'),
  of: t('of', 'من'),
  modules: t('modules', 'وحدات'),
  nonePicked: t('Nothing picked yet. Tap a module to add it.', 'لم تختر شيئاً بعد. اضغط على أي وحدة لإضافتها.'),
  fits: t('Fits', 'تناسبها باقة'),
  fitsHelp: t('the smallest plan that covers your picks', 'أصغر باقة تغطي اختياراتك'),
  inPlan: t('In', 'ضمن'),
  pickerLabel: t('RAL HR modules', 'وحدات RAL HR'),
  // Pricing box
  choose: t('Choose your modules', 'اختر وحداتك'),
  close: t('Hide modules', 'إخفاء الوحدات'),
  seePlan: t('Show this plan', 'اعرض هذه الباقة'),
  continue: t('Continue with these', 'تابع بهذه الاختيارات'),
  continueNone: t('Talk to us instead', 'تواصل معنا مباشرة'),
  // Pricing flow
  step1: t('Choose your plan', 'اختر باقتك'),
  step2: t('Size your team', 'حدد حجم فريقك'),
  modeKnow: t('I know my plan', 'أعرف باقتي'),
  modeHelp: t('Not sure? Choose modules', 'محتار؟ اختر الوحدات'),
  helpLead: t('Tick what you need. We suggest the cheapest plan that covers all of it.', 'حدد ما تحتاجه، ونقترح لك أرخص باقة تغطي كل اختياراتك.'),
  cheapest: t('Cheapest plan that covers your picks', 'أرخص باقة تغطي اختياراتك'),
  pickSome: t('Pick a few modules to get a suggestion.', 'اختر بعض الوحدات لنقترح لك الباقة.'),
  plusStarter: t('Everything in Starter, plus', 'كل ما في الأساسية، بالإضافة إلى'),
  plusPro: t('Everything in Professional, plus', 'كل ما في الاحترافية، بالإضافة إلى'),
  more: t('more', 'أخرى'),
  less: t('Show less', 'عرض أقل'),
  soonTag: t('Soon', 'قريباً'),
  book: t('Book a demo', 'احجز عرضاً تجريبياً'),
  bookNote: t('Opens WhatsApp with your plan, team and price filled in.', 'يفتح واتساب ورسالتك جاهزة بالباقة والفريق والسعر.'),
  guided: t('Prefer a guided form?', 'تفضل نموذجاً بخطوات؟'),
  // WhatsApp message
  waHi: t('Hi RAL, I would like to book a RAL HR demo.', 'مرحباً RAL، أود حجز عرض تجريبي لنظام RAL HR.'),
  waPlan: t('Plan', 'الباقة'),
  waTeam: t('Team', 'الفريق'),
  waPeople: t('people', 'موظف'),
  waPrice: t('Estimate', 'التقدير'),
  waMonth: t('a month, plus a one-time setup fee', 'شهرياً، مع رسوم تجهيز لمرة واحدة'),
  waPer: t('per person, per month', 'للموظف شهرياً'),
  msgHead: t('Modules we are interested in', 'الوحدات التي نهتم بها'),
  msgSoon: t('coming soon', 'قريباً'),
}
