import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { Flip } from 'gsap/Flip'
import { calm, CountUp, useIsoLayoutEffect } from './charts'
import {
  ROSTER, TOTALS, REQUESTS, BOOKED, ATTENDANCE, FEED, EXPIRING, SITES, DEPTS, MIN_COVER, SIO,
  byName, bd, fmt, deptName, deptTotals, workDays, isOff, endOfService, type Lang, type Person, type Dept,
} from './data'

// The screens of the RAL HR demo app. Every number is read from data.ts, so
// the dashboard, payroll, payslips, WPS file and Ask RAL always agree.

export type Device = 'web' | 'tablet' | 'phone'
export type TabId = 'home' | 'people' | 'payroll' | 'leave' | 'eos' | 'ask'
export type DemoState = {
  pay: number // 0 draft, 1 computed, 2 review, 3 approved, 4 WPS file
  ibanFixed: boolean
  confirm: boolean
  decided: Record<string, 'ok' | 'no'>
  sel: string
  person: number
  profileOpen: boolean
  q: string
  dept: Dept | 'all'
  eosWho: number
  eosYears: number
  asks: { q: string; a: number; l: Lang }[]
}
export type Act = {
  compute: () => void; review: () => void; fixIban: () => void; askApprove: () => void; confirm: () => void; cancel: () => void; wps: () => void; download: () => void
  decide: (id: string, ok: boolean) => void; select: (id: string) => void
  openPerson: (id: number) => void; closePerson: () => void; setQ: (q: string) => void; setDept: (d: Dept | 'all') => void
  setEos: (who: number, years: number) => void; ask: (q: string, l: Lang, a?: number) => void; go: (t: TabId) => void
}
type P = { s: DemoState; act: Act; device: Device; lang: Lang }

export const tx = (l: Lang) => (en: string, ar: string) => (l === 'ar' ? ar : en)
export const nm = (p: Person | string, l: Lang) => { const x = typeof p === 'string' ? byName(p) : p; return l === 'ar' ? x.ar : x.en }
const ini = (p: Person) => p.en.replace('Al ', '').split(' ').map((w) => w[0]).slice(0, 2).join('')
const Av = ({ p, big }: { p: Person; big?: boolean }) => <i className={'ra-av' + (p.bh ? ' bh' : '') + (big ? ' big' : '')} style={{ '--h': (p.id * 47) % 360 } as React.CSSProperties}>{ini(p)}</i>
const Money = ({ fils, l, className = '' }: { fils: number; l: Lang; className?: string }) => (
  <CountUp value={fils / 1000} decimals={3} prefix={l === 'ar' ? '' : 'BD '} suffix={l === 'ar' ? ' د.ب' : ''} className={className} />
)
const MONTH = (l: Lang, d: number) => (l === 'ar' ? `${d} نوفمبر` : `${d} Nov`)
const range = (l: Lang, a: number, b: number) => (a === b ? MONTH(l, a) : l === 'ar' ? `${a} إلى ${b} نوفمبر` : `${a} to ${b} Nov`)

// Rows and bars cascade in whenever `dep` changes.
function useCascade(dep: unknown) {
  const ref = useRef<HTMLDivElement>(null)
  useIsoLayoutEffect(() => {
    const root = ref.current
    if (!root || calm()) return
    const rows = root.querySelectorAll('.cx')
    const bars = root.querySelectorAll('.gx')
    const tl = gsap.timeline()
    if (rows.length) tl.fromTo(rows, { y: 12, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.55, ease: 'expo.out', stagger: 0.035, clearProps: 'transform,opacity,visibility' }, 0)
    if (bars.length) tl.fromTo(bars, { scaleX: 0 }, { scaleX: 1, duration: 0.9, ease: 'expo.out', stagger: 0.06 }, 0.1)
    return () => { tl.progress(1).kill() }
  }, [dep])
  return ref
}

export function leaveOf(p: Person, s: DemoState) {
  const days = (ok: boolean) => REQUESTS.filter((r) => r.who === p.en && (ok ? s.decided[r.id] === 'ok' : !s.decided[r.id])).reduce((a, r) => a + workDays(r.from, r.to).length, 0)
  const used = p.leave.used + days(true)
  return { used, pending: days(false), left: p.leave.total - used }
}
function offOn(day: number, s: DemoState) {
  return [...BOOKED.filter((b) => day >= b.from && day <= b.to).map((b) => b.who), ...REQUESTS.filter((r) => s.decided[r.id] === 'ok' && day >= r.from && day <= r.to).map((r) => r.who)]
}
export const pendingCount = (s: DemoState) => REQUESTS.filter((r) => !s.decided[r.id]).length + (s.pay < 3 ? 1 : 0)

/* ================= Home ================= */
export function HomeScreen({ s, act, lang }: P) {
  const x = tx(lang)
  const ref = useCascade('home')
  const A = ATTENDANCE
  const present = A.onTime + A.late
  const parts = [
    { k: 'ok', n: A.onTime, t: x('On time', 'في الموعد') }, { k: 'late', n: A.late, t: x('Late', 'متأخر') }, { k: 'leave', n: A.leave, t: x('On leave', 'إجازة') },
    { k: 'sick', n: A.sick, t: x('Sick', 'مرضية') }, { k: 'out', n: A.notIn, t: x('Not in yet', 'لم يصل') },
  ]
  const depts = deptTotals().sort((a, b) => b.gross - a.gross)
  const maxD = depts[0].gross
  const payState = [x('Draft', 'مسودة'), x('Computed', 'محسوبة'), x('In review', 'قيد المراجعة'), x('Approved', 'معتمدة'), x('Sent to bank', 'أُرسلت للبنك')][s.pay]
  return (
    <div className="ra-screen ra-home" ref={ref}>
      <div className="ra-hello cx">
        <h2>{x('Good morning, Aisha', 'صباح الخير يا عائشة')}</h2>
        <p>{x('Thursday 29 October. Payroll day.', 'الخميس 29 أكتوبر. يوم الرواتب.')}</p>
      </div>
      <div className="ra-kpis">
        <button type="button" className="ra-kpi cx" onClick={() => act.go('people')} data-g="kpi-people">
          <span className="ra-kpi-l">{x('Headcount', 'عدد الموظفين')}</span>
          <b className="ra-kpi-v tnum"><CountUp value={ROSTER.length} /></b>
          <span className="ra-kpi-n">{x(`${TOTALS.bh} Bahraini, ${ROSTER.length - TOTALS.bh} expat`, `${TOTALS.bh} بحرينيًا، ${ROSTER.length - TOTALS.bh} وافدًا`)}</span>
        </button>
        <div className="ra-kpi cx">
          <span className="ra-kpi-l">{x('At work now', 'في العمل الآن')}</span>
          <b className="ra-kpi-v tnum"><CountUp value={present} /><small>/{ROSTER.length}</small></b>
          <span className="ra-meter"><i className="gx" style={{ '--w': present / ROSTER.length } as React.CSSProperties} /></span>
        </div>
        <button type="button" className="ra-kpi warn cx" onClick={() => act.go('leave')}>
          <span className="ra-kpi-l">{x('Waiting for you', 'بانتظارك')}</span>
          <b className="ra-kpi-v tnum"><CountUp value={pendingCount(s)} /></b>
          <span className="ra-kpi-n">{x('Leave requests and payroll', 'طلبات إجازة والرواتب')}</span>
        </button>
        <button type="button" className="ra-kpi hero cx" onClick={() => act.go('payroll')}>
          <span className="ra-kpi-l">{x('October net pay', 'صافي رواتب أكتوبر')}<em className={'ra-chip s' + s.pay}>{payState}</em></span>
          <b className="ra-kpi-v tnum"><Money fils={TOTALS.net} l={lang} /></b>
          <span className="ra-kpi-n up">{x('+1.2% on September', '+1.2% عن سبتمبر')}</span>
        </button>
      </div>
      <div className="ra-grid2">
        <section className="ra-card cx">
          <h3>{x('Today at work', 'الحضور اليوم')}</h3>
          <div className="ra-stack" role="img" aria-label={x(`${present} of ${ROSTER.length} at work`, `${present} من ${ROSTER.length} في العمل`)}>
            {parts.map((p) => <i key={p.k} className={'gx ' + p.k} style={{ flexGrow: p.n }} />)}
          </div>
          <ul className="ra-legend">{parts.map((p) => <li key={p.k}><i className={p.k} /><span>{p.t}</span><b className="tnum">{p.n}</b></li>)}</ul>
          <ul className="ra-sites">
            {SITES.map((st, i) => (
              <li key={st[0]}><span>{lang === 'ar' ? st[1] : st[0]}</span><span className="ra-bar"><i className="gx" style={{ '--w': A.bySite[i] / A.bySite[0] } as React.CSSProperties} /></span><b className="tnum">{A.bySite[i]}</b></li>
            ))}
          </ul>
        </section>
        <section className="ra-card cx">
          <h3>{x('Check-ins', 'تسجيل الحضور')}<span className="ra-live">{x('Live', 'مباشر')}</span></h3>
          <ul className="ra-feed">
            {FEED.map((f) => { const p = byName(f.who); return (
              <li key={f.who}><Av p={p} /><span><b>{nm(p, lang)}</b> {lang === 'ar' ? f.what[1] : f.what[0]}<small>{lang === 'ar' ? SITES[f.site][1] : SITES[f.site][0]}</small></span><time className="tnum">{f.at}</time></li>
            ) })}
          </ul>
          <h3 className="ra-sub">{x('Documents expiring', 'وثائق تنتهي قريبًا')}</h3>
          <ul className="ra-exp">
            {EXPIRING.map((e) => <li key={e.who}><span><b>{nm(e.who, lang)}</b><small>{lang === 'ar' ? e.what[1] : e.what[0]}</small></span><em className={e.days < 30 ? 'warn' : ''}>{x(`${e.days} days`, `${e.days} يومًا`)}</em></li>)}
          </ul>
        </section>
      </div>
      <section className="ra-card ra-depts cx">
        <h3>{x('October gross pay by department', 'إجمالي رواتب أكتوبر حسب القسم')}</h3>
        <ul>
          {depts.map((d) => (
            <li key={d.d}><span>{deptName(d.d, lang)}<small className="tnum">{x(`${d.n} people`, `${d.n} موظفين`)}</small></span><span className="ra-bar"><i className="gx" style={{ '--w': d.gross / maxD } as React.CSSProperties} /></span><b className="tnum">{fmt(d.gross, 0)}</b></li>
          ))}
        </ul>
      </section>
    </div>
  )
}

/* ================= People ================= */
export function PeopleScreen({ s, act, device, lang }: P) {
  const x = tx(lang)
  const q = s.q.trim().toLowerCase()
  const list = ROSTER.filter((p) => (s.dept === 'all' || p.d === s.dept) && (!q || p.en.toLowerCase().includes(q) || p.ar.includes(q) || p.role[0].toLowerCase().includes(q)))
  const ref = useCascade(s.dept)
  const split = device !== 'phone'
  return (
    <div className={'ra-screen ra-people' + (split ? ' split' : '')} ref={ref}>
      <div className="ra-plist">
        <label className="ra-search cx"><span className="sr">{x('Search people', 'ابحث عن موظف')}</span>
          <input value={s.q} onChange={(e) => act.setQ(e.target.value)} placeholder={x('Search 98 people', 'ابحث في 98 موظفًا')} />
        </label>
        <div className="ra-chips cx" role="group">
          {(['all', ...DEPTS.map((d) => d.id)] as (Dept | 'all')[]).map((d) => (
            <button key={d} type="button" className={s.dept === d ? 'on' : ''} onClick={() => act.setDept(d)}>{d === 'all' ? x('All', 'الكل') : deptName(d, lang)}</button>
          ))}
        </div>
        <p className="ra-count tnum">{x(`${list.length} people`, `${list.length} موظفًا`)}</p>
        <ul className="ra-rows">
          {list.map((p, i) => (
            <li key={p.id} className={i < 14 ? 'cx' : ''}>
              <button type="button" data-g={`person-${p.id}`} className={split && s.person === p.id ? 'on' : ''} onClick={() => act.openPerson(p.id)}>
                <Av p={p} /><span><b>{nm(p, lang)}</b><small>{lang === 'ar' ? p.role[1] : p.role[0]}</small></span><em className="tnum">{fmt(p.net)}</em>
              </button>
            </li>
          ))}
          {!list.length && <li className="ra-empty">{x('Nobody matches that. Try a first name or a role.', 'لا نتائج. جرّب الاسم الأول أو المسمى الوظيفي.')}</li>}
        </ul>
      </div>
      {(split || s.profileOpen) && <Profile key={s.person} p={ROSTER[s.person]} s={s} act={act} lang={lang} phone={!split} />}
    </div>
  )
}

function Profile({ p, s, act, lang, phone }: { p: Person; s: DemoState; act: Act; lang: Lang; phone: boolean }) {
  const x = tx(lang)
  const lv = leaveOf(p, s)
  const ref = useCascade(p.id)
  useIsoLayoutEffect(() => {
    if (!phone || !ref.current || calm()) return
    const t = gsap.fromTo(ref.current, { xPercent: lang === 'ar' ? -100 : 100 }, { xPercent: 0, duration: 0.6, ease: 'expo.out' })
    return () => { t.kill() }
  }, [])
  const lines: [string, number, string][] = [
    [x('Basic', 'الأساسي'), p.basic, x('Contract', 'العقد')],
    [x('Housing', 'السكن'), p.housing, x('Allowance', 'بدل')],
    [x('Transport', 'المواصلات'), p.transport, x('Policy', 'السياسة')],
  ]
  if (p.phone) lines.push([x('Phone', 'الهاتف'), p.phone, x('Policy', 'السياسة')])
  if (p.social) lines.push([x('Social allowance', 'العلاوة الاجتماعية'), p.social, x('Bahraini staff', 'للبحرينيين')])
  const ring = 2 * Math.PI * 34
  return (
    <div className={'ra-profile' + (phone ? ' push' : '')} ref={ref}>
      {phone && <button type="button" className="ra-back" onClick={act.closePerson}>{x('‹ People', '› الموظفون')}</button>}
      <header className="ra-ph cx">
        <Av p={p} big />
        <div><h2>{nm(p, lang)}</h2><p>{lang === 'ar' ? p.role[1] : p.role[0]}, {deptName(p.d, lang)}</p>
          <span className={'ra-tag' + (p.bh ? ' bh' : '')}>{p.bh ? x('Bahraini', 'بحريني') : x('Expat', 'وافد')}</span></div>
      </header>
      <dl className="ra-facts cx">
        <div><dt>CPR</dt><dd className="tnum">{p.cpr}</dd></div>
        <div><dt>{x('Joined', 'تاريخ الالتحاق')}</dt><dd className="tnum">{p.joined}</dd></div>
        <div><dt>{x('Bank', 'البنك')}</dt><dd>{lang === 'ar' ? p.bank[1] : p.bank[0]} <span className="tnum">{p.iban}</span></dd></div>
        <div><dt>{x('Site', 'الموقع')}</dt><dd>{lang === 'ar' ? SITES[p.site][1] : SITES[p.site][0]}</dd></div>
      </dl>
      <div className="ra-pgrid">
        <section className="ra-card ra-slip cx">
          <h3>{x('October payslip', 'قسيمة راتب أكتوبر')}</h3>
          <ul>
            {lines.map(([l, v, r]) => <li key={l}><span>{l}<small>{r}</small></span><b className="tnum">{fmt(v)}</b></li>)}
            <li className="tot"><span>{x('Gross', 'الإجمالي')}</span><b className="tnum">{fmt(p.gross)}</b></li>
            <li className="minus"><span>{x('SIO', 'التأمينات')}<small>{p.bh ? '8%' : '1%'}</small></span><b className="tnum">-{fmt(p.sio)}</b></li>
            {p.advance > 0 && <li className="minus"><span>{x('Salary advance', 'سلفة راتب')}<small>{x('Repayment', 'قسط')}</small></span><b className="tnum">-{fmt(p.advance)}</b></li>}
          </ul>
          <p className="ra-net"><span>{x('Net to bank', 'الصافي للبنك')}</span><Money fils={p.net} l={lang} className="v" /></p>
          <p className="ra-fine">{x(`The company also pays BD ${fmt(p.erSio)} SIO for ${nm(p, 'en').split(' ')[0]}.`, `وتدفع الشركة أيضًا ${fmt(p.erSio)} د.ب للتأمينات.`)}</p>
        </section>
        <section className="ra-card ra-lv cx">
          <h3>{x('Annual leave', 'الإجازة السنوية')}</h3>
          <svg viewBox="0 0 80 80" className="ra-ring" aria-hidden="true">
            <circle cx="40" cy="40" r="34" className="trk" />
            <circle cx="40" cy="40" r="34" className="val" strokeDasharray={ring} strokeDashoffset={ring * (lv.used / p.leave.total)} />
          </svg>
          <p className="ra-ring-v"><b className="tnum">{lv.left}</b><span>{x('days left', 'يومًا متبقية')}</span></p>
          <p className="ra-fine">{x(`${lv.used} used of ${p.leave.total}`, `استخدم ${lv.used} من ${p.leave.total}`)}{lv.pending ? x(`, ${lv.pending} waiting`, `، ${lv.pending} بالانتظار`) : ''}</p>
          {!p.bh && <button type="button" className="ra-btn ghost" data-g="to-eos" onClick={() => { act.setEos(p.id, Math.round((2026.9 - p.joined) * 2) / 2); act.go('eos') }}>{x('End of service', 'مكافأة نهاية الخدمة')}</button>}
        </section>
      </div>
    </div>
  )
}

/* ================= Payroll ================= */
const STEPS: [string, string][] = [['Compute', 'الاحتساب'], ['Review', 'المراجعة'], ['Approve', 'الاعتماد'], ['WPS file', 'ملف WPS']]
export function PayrollScreen({ s, act, lang, device }: P) {
  const x = tx(lang)
  const ref = useCascade(s.pay)
  const on = s.pay >= 1
  const ded = TOTALS.sio + TOTALS.advance
  const stepAt = s.pay === 0 ? 0 : s.pay === 1 ? 1 : s.pay === 2 ? 2 : s.pay === 3 ? 3 : 4
  const rows = ROSTER.slice().sort((a, b) => a.d.localeCompare(b.d) || b.gross - a.gross).slice(0, device === 'phone' ? 6 : 8)
  const arun = byName('Arun Pillai')
  return (
    <div className="ra-screen ra-pay" ref={ref}>
      <ol className="ra-steps cx" style={{ '--p': stepAt / 4 } as React.CSSProperties}>
        <span className="ra-steps-line" aria-hidden="true"><i /></span>
        {STEPS.map((st, i) => <li key={st[0]} className={i < stepAt ? 'done' : i === stepAt ? 'now' : ''}><i className="tnum">{i < stepAt ? '✓' : i + 1}</i><span>{lang === 'ar' ? st[1] : st[0]}</span></li>)}
      </ol>
      <div className="ra-sum cx">
        <div><span>{x('Gross pay', 'إجمالي الرواتب')}</span>{on ? <Money fils={TOTALS.gross} l={lang} className="v" /> : <b className="v dim">{x('Not run yet', 'لم تُحتسب')}</b>}</div>
        <div><span>{x('SIO and deductions', 'التأمينات والاستقطاعات')}</span>{on ? <Money fils={ded} l={lang} className="v minus" /> : <b className="v dim">.</b>}</div>
        <div className="net"><span>{x('Net to the bank', 'الصافي إلى البنك')}</span>{on ? <Money fils={TOTALS.net} l={lang} className="v" /> : <b className="v dim">.</b>}</div>
      </div>

      {s.pay === 0 && (
        <section className="ra-card ra-draft cx">
          <h3>{x('October 2026, ready to compute', 'أكتوبر 2026، جاهزة للاحتساب')}</h3>
          <ul className="ra-ticks">
            <li>{x('98 people, 2 joiners and 1 leaver since September', '98 موظفًا، انضم 2 وغادر 1 منذ سبتمبر')}</li>
            <li>{x('SIO at 8% for Bahrainis and 1% for expats, capped at BD 4,000', 'التأمينات 8% للبحرينيين و1% للوافدين، بحد أقصى 4,000 د.ب')}</li>
            <li>{x('6 salary advance repayments', '6 أقساط سلف رواتب')}</li>
          </ul>
          <button type="button" className="ra-btn" data-g="pay-compute" onClick={act.compute}>{x('Compute payroll', 'احتساب الرواتب')}</button>
        </section>
      )}

      {s.pay === 1 && (
        <>
          <section className="ra-card ra-table cx">
            <div className="ra-tr th"><span>{x('Employee', 'الموظف')}</span><span>{x('Gross', 'الإجمالي')}</span><span>{x('SIO', 'التأمينات')}</span><span>{x('Net', 'الصافي')}</span></div>
            {rows.map((p) => <div key={p.id} className="ra-tr cx"><span className="who"><Av p={p} /><b>{nm(p, lang)}</b></span><span className="tnum">{fmt(p.gross)}</span><span className="tnum minus">-{fmt(p.sio)}</span><b className="tnum">{fmt(p.net)}</b></div>)}
            <p className="ra-more">{x(`and ${ROSTER.length - rows.length} more people`, `و${ROSTER.length - rows.length} موظفًا آخرين`)}</p>
          </section>
          <div className="ra-split cx">
            <div><span>{x(`Bahraini staff, ${TOTALS.bh}`, `البحرينيون، ${TOTALS.bh}`)}</span><b className="tnum">{x('8% + 18%', '8% + 18%')}</b><small>{x(`Staff BD ${fmt(TOTALS.bhSio)}, company BD ${fmt(TOTALS.bhEr)}`, `الموظف ${fmt(TOTALS.bhSio)}، الشركة ${fmt(TOTALS.bhEr)} د.ب`)}</small></div>
            <div><span>{x(`Expat staff, ${ROSTER.length - TOTALS.bh}`, `الوافدون، ${ROSTER.length - TOTALS.bh}`)}</span><b className="tnum">{x('1% + 3%', '1% + 3%')}</b><small>{x(`Staff BD ${fmt(TOTALS.exSio)}, company BD ${fmt(TOTALS.exEr)} with end of service`, `الموظف ${fmt(TOTALS.exSio)}، الشركة ${fmt(TOTALS.exEr)} د.ب مع نهاية الخدمة`)}</small></div>
          </div>
          <button type="button" className="ra-btn cx" data-g="pay-review" onClick={act.review}>{x('Check before approving', 'افحص قبل الاعتماد')}</button>
        </>
      )}

      {s.pay === 2 && (
        <section className="ra-card ra-checks cx">
          <h3>{x('5 checks before money moves', '5 فحوصات قبل تحويل الأموال')}</h3>
          <ul>
            <li className="ok cx"><i>✓</i><span>{x('98 CPR numbers match LMRA records', '98 رقمًا شخصيًا مطابقًا لسجلات هيئة تنظيم سوق العمل')}</span></li>
            <li className={(s.ibanFixed ? 'ok' : 'bad') + ' cx'}><i>{s.ibanFixed ? '✓' : '!'}</i>
              <span>{s.ibanFixed ? x('98 of 98 IBANs pass the check digit', '98 من 98 رقم آيبان صحيح') : x(`${nm(arun, 'en')}: IBAN check digit fails. HR has a newer one.`, `${arun.ar}: رقم الآيبان غير صحيح. لدى الموارد البشرية رقم أحدث.`)}</span>
              {!s.ibanFixed && <button type="button" className="ra-btn sm" data-g="pay-fix" onClick={act.fixIban}>{x('Use HR record', 'استخدم سجل الموارد البشرية')}</button>}</li>
            <li className="ok cx"><i>✓</i><span>{x('Net equals gross minus deductions on every row', 'الصافي يساوي الإجمالي ناقص الاستقطاعات في كل صف')}</span></li>
            <li className="warn cx"><i>!</i><span>{x("Rajesh Kumar's work permit ends in 12 days. Pay is fine, renewal reminder sent.", 'تصريح عمل راجيش كومار ينتهي خلال 12 يومًا. الراتب سليم، وأُرسل تذكير بالتجديد.')}</span></li>
            <li className="ok cx"><i>✓</i><span>{x(`BD ${fmt(TOTALS.net - TOTALS.septNet)} more than September (+1.2%), from 2 joiners`, `أكثر من سبتمبر بـ ${fmt(TOTALS.net - TOTALS.septNet)} د.ب (+1.2%) بسبب موظفَين جديدين`)}</span></li>
          </ul>
          <button type="button" className="ra-btn" data-g="pay-approve" disabled={!s.ibanFixed} onClick={act.askApprove}>{s.ibanFixed ? x('Approve payroll', 'اعتماد الرواتب') : x('Fix 1 issue to approve', 'أصلح مشكلة واحدة للاعتماد')}</button>
        </section>
      )}

      {s.pay === 3 && (
        <section className="ra-card ra-approved cx">
          <span className="ra-stamp">{x('Approved', 'معتمدة')}</span>
          <ul className="ra-chain">
            <li className="cx"><i>✓</i><span><b>{nm('Yousif Fakhro', lang)}</b>{x('Finance Manager, 09:14', 'مدير المالية، 09:14')}</span></li>
            <li className="cx"><i>✓</i><span><b>{nm('Aisha Al Arrayed', lang)}</b>{x('HR Manager, just now', 'مديرة الموارد البشرية، الآن')}</span></li>
          </ul>
          <button type="button" className="ra-btn" data-g="pay-wps" onClick={act.wps}>{x('Create the WPS file', 'إنشاء ملف WPS')}</button>
        </section>
      )}

      {s.pay === 4 && (
        <section className="ra-card ra-wps cx">
          <h3>{x('WPS salary file, LMRA format', 'ملف رواتب WPS بصيغة الهيئة')}<span className="ra-live ok">{x('98 of 98 rows pass', '98 من 98 صفًا سليم')}</span></h3>
          <div className="ra-tr th"><span>CPR</span><span>{x('Name', 'الاسم')}</span><span className="hide-s">{x('Bank', 'البنك')}</span><span className="hide-s">IBAN</span><span>{x('Net', 'الصافي')}</span></div>
          {ROSTER.slice(0, device === 'phone' ? 6 : 8).map((p) => (
            <div key={p.id} className="ra-tr cx"><span className="tnum">{p.cpr}</span><span>{nm(p, lang)}</span><span className="hide-s">{lang === 'ar' ? p.bank[1] : p.bank[0]}</span><span className="tnum hide-s">{p.iban}</span><b className="tnum">{fmt(p.net)} <i className="ok">✓</i></b></div>
          ))}
          <div className="ra-wps-foot cx"><span className="tnum">WPS_BHF_2026-10.csv</span><span>{x('98 records', '98 سجلًا')}</span><b className="tnum">{bd(TOTALS.net, lang)}</b></div>
          <button type="button" className="ra-btn" data-g="pay-dl" onClick={act.download}>{x('Send to NBB', 'إرسال إلى البنك الوطني')}</button>
        </section>
      )}
      {s.confirm && (
        <div className="ra-modal" role="dialog" aria-modal="true">
          <div className="ra-modal-in">
            <h3>{x('Approve October payroll?', 'اعتماد رواتب أكتوبر؟')}</h3>
            <p className="ra-modal-v tnum">{bd(TOTALS.net, lang)}</p>
            <p>{x(`To ${ROSTER.length} people. Yousif Fakhro approved at 09:14. You are the second approver.`, `إلى ${ROSTER.length} موظفًا. اعتمدها يوسف فخرو الساعة 09:14. أنتِ المعتمِد الثاني.`)}</p>
            <div className="ra-modal-b"><button type="button" className="ra-btn ghost" onClick={act.cancel}>{x('Not yet', 'ليس الآن')}</button><button type="button" className="ra-btn" data-g="pay-confirm" onClick={act.confirm}>{x('Approve', 'اعتماد')}</button></div>
          </div>
        </div>
      )}
    </div>
  )
}

/* ================= Leave ================= */
let leaveFlip: Flip.FlipState | null = null
export const captureLeave = (root: HTMLElement | null) => { if (root && !calm()) leaveFlip = Flip.getState(root.querySelectorAll('.lv-req')) }

export function LeaveScreen({ s, act, lang, device }: P) {
  const x = tx(lang)
  const ref = useCascade('leave')
  const listRef = useRef<HTMLUListElement>(null)
  useIsoLayoutEffect(() => {
    if (!leaveFlip) return
    Flip.from(leaveFlip, { duration: 0.6, ease: 'expo.inOut', absolute: false, onEnter: (els) => gsap.fromTo(els, { autoAlpha: 0 }, { autoAlpha: 1 }) })
    leaveFlip = null
  }, [s.decided])
  const req = REQUESTS.find((r) => r.id === s.sel) ?? REQUESTS[0]
  const who = byName(req.who)
  const lv = leaveOf(who, s)
  const status = s.decided[req.id]
  const days = workDays(req.from, req.to)
  const dSize = ROSTER.filter((p) => p.d === who.d).length
  const order = [...REQUESTS].sort((a, b) => Number(!!s.decided[a.id]) - Number(!!s.decided[b.id]))
  const cells = Array.from({ length: 35 }, (_, i) => i + 1)
  return (
    <div className={'ra-screen ra-leave ' + device} ref={ref}>
      <ul className="ra-queue cx" ref={listRef}>
        {order.map((r) => { const p = byName(r.who); const st = s.decided[r.id]; return (
          <li key={r.id} className={'lv-req' + (st ? ' done ' + st : '') + (r.id === req.id ? ' on' : '')} data-flip-id={r.id}>
            <button type="button" data-g={`leave-sel-${r.id}`} onClick={() => act.select(r.id)}>
              <Av p={p} /><span><b>{nm(p, lang)}</b><small>{lang === 'ar' ? r.kind[1] : r.kind[0]}, {range(lang, r.from, r.to)}</small></span>
              <em>{st === 'ok' ? x('Approved', 'معتمدة') : st === 'no' ? x('Declined', 'مرفوضة') : x(`${workDays(r.from, r.to).length} days`, `${workDays(r.from, r.to).length} أيام`)}</em>
            </button>
          </li>
        ) })}
      </ul>
      <section className="ra-card ra-req cx" key={req.id}>
        <header className="ra-req-h"><Av p={who} big /><div><h3>{nm(who, lang)}</h3><p>{lang === 'ar' ? who.role[1] : who.role[0]}, {deptName(who.d, lang)}</p></div></header>
        <p className="ra-req-what"><b>{lang === 'ar' ? req.kind[1] : req.kind[0]}</b> {range(lang, req.from, req.to)}<span>“{lang === 'ar' ? req.note[1] : req.note[0]}”</span></p>
        <div className="ra-bal">
          <div className="ra-bal-bar" role="img" aria-label={x(`${lv.left} days left`, `${lv.left} يومًا متبقية`)}>
            <i className="used" style={{ flexGrow: who.leave.used }} /><i className={'this ' + (status ?? 'pending')} style={{ flexGrow: status === 'no' ? 0 : days.length }} /><i className="left" style={{ flexGrow: Math.max(0, lv.left - (status ? 0 : days.length)) }} />
          </div>
          <p><span>{x('Balance after this', 'الرصيد بعد الطلب')}</span><b className="tnum">{status === 'no' ? lv.left : status === 'ok' ? lv.left : lv.left - days.length}<small>/{who.leave.total}</small></b></p>
        </div>
        <ul className="ra-avail" aria-label={x('Team cover', 'تغطية الفريق')}>
          {days.slice(0, 7).map((d) => {
            const off = offOn(d, s).filter((n) => byName(n).d === who.d && n !== who.en).length + (status === 'ok' ? 1 : 0)
            const avail = dSize - off - (status ? 0 : 1)
            const low = avail <= MIN_COVER[who.d]
            return <li key={d} className={low ? 'low' : ''}><span className="ra-col"><i className="gx-y" style={{ '--h': avail / dSize } as React.CSSProperties} /></span><b className="tnum">{avail}</b><small className="tnum">{d}</small></li>
          })}
        </ul>
        <p className="ra-fine">{x(`${deptName(who.d, 'en')} cover if approved. Minimum ${MIN_COVER[who.d]} of ${dSize}.`, `تغطية ${deptName(who.d, 'ar')} عند الموافقة. الحد الأدنى ${MIN_COVER[who.d]} من ${dSize}.`)}</p>
        {status ? (
          <p className={'ra-done ' + status}>{status === 'ok' ? x(`Approved. ${nm(who, 'en').split(' ')[0]} and ${nm(req.stage1, 'en')} have been told.`, `تمت الموافقة وأُبلغ ${nm(who, 'ar')} و${nm(req.stage1, 'ar')}.`) : x(`Declined. ${nm(who, 'en').split(' ')[0]} has been told.`, `رُفض الطلب وأُبلغ ${nm(who, 'ar')}.`)}</p>
        ) : (
          <div className="ra-req-b">
            <span className="ra-fine">{x(`${nm(req.stage1, 'en')} approved. You are the final step.`, `وافق ${nm(req.stage1, 'ar')}. أنتِ الخطوة الأخيرة.`)}</span>
            <button type="button" className="ra-btn ghost" onClick={() => act.decide(req.id, false)}>{x('Decline', 'رفض')}</button>
            <button type="button" className="ra-btn" data-g={`leave-ok-${req.id}`} onClick={() => act.decide(req.id, true)}>{x('Approve', 'موافقة')}</button>
          </div>
        )}
      </section>
      <section className="ra-card ra-cal cx">
        <h3>{x('November 2026', 'نوفمبر 2026')}</h3>
        <div className="ra-cal-g">
          {(lang === 'ar' ? ['أحد', 'إثن', 'ثلا', 'أرب', 'خمي', 'جمع', 'سبت'] : ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']).map((d) => <b key={d}>{d}</b>)}
          {cells.map((d) => {
            if (d > 30) return <span key={d} className="pad" />
            const names = offOn(d, s)
            const inReq = d >= req.from && d <= req.to && !isOff(d)
            return (
              <span key={d} className={(isOff(d) ? 'off' : '') + (inReq ? ' sel ' + (status ?? 'pending') : '')}>
                <em className="tnum">{d}</em>
                <span className="ra-dots">{names.slice(0, 3).map((n) => <i key={n} className={byName(n).bh ? 'bh' : ''} title={n} />)}</span>
              </span>
            )
          })}
        </div>
      </section>
    </div>
  )
}

/* ================= End of service ================= */
const EOS_PEOPLE = ['Rajesh Kumar', 'Suresh Nair', 'Joseph Fernandes', 'Priya Reddy']
export function EosScreen({ s, act, lang }: P) {
  const x = tx(lang)
  const p = ROSTER[s.eosWho]
  const r = endOfService(p.basic, s.eosYears)
  const ref = useCascade(p.id)
  const total = Math.max(1, r.total)
  return (
    <div className="ra-screen ra-eos" ref={ref}>
      <div className="ra-chips cx" role="group">
        {EOS_PEOPLE.map((n) => { const q = byName(n); return (
          <button key={n} type="button" className={q.id === p.id ? 'on' : ''} onClick={() => act.setEos(q.id, Math.round((2026.9 - q.joined) * 2) / 2)}>{nm(q, lang)}</button>
        ) })}
      </div>
      <section className="ra-card ra-eos-main cx">
        <div className="ra-eos-who"><Av p={p} big /><div><h3>{nm(p, lang)}</h3><p>{x(`Last basic wage BD ${fmt(p.basic)}, leaving 30 Nov 2026`, `آخر راتب أساسي ${fmt(p.basic)} د.ب، المغادرة 30 نوفمبر 2026`)}</p></div></div>
        <label className="ra-slider">
          <span>{x('Years served', 'سنوات الخدمة')}<b className="tnum">{s.eosYears.toFixed(1)}</b></span>
          <input type="range" min={1} max={25} step={0.5} value={s.eosYears} data-g="eos-slider" onChange={(e) => act.setEos(p.id, Number(e.target.value))} />
        </label>
        <p className="ra-eos-total"><span>{x('End of service due', 'مكافأة نهاية الخدمة المستحقة')}</span><Money fils={r.total} l={lang} className="v" /></p>
        <div className="ra-eos-bar" role="img" aria-label={x('Split between the two schemes', 'التوزيع بين النظامين')}>
          <i className="old" style={{ flexGrow: r.oldAmt / total }} /><i className="new" style={{ flexGrow: r.newAmt / total }} />
        </div>
        <ul className="ra-eos-rows">
          <li><i className="old" /><span>{x('Labour Law Art. 116, service to Feb 2024', 'المادة 116 من قانون العمل، الخدمة حتى فبراير 2024')}<small className="tnum">{x(`${r.oldDays.toFixed(1)} days at BD ${fmt(Math.round(p.basic / 30))} a day`, `${r.oldDays.toFixed(1)} يومًا بواقع ${fmt(Math.round(p.basic / 30))} د.ب لليوم`)}</small></span><b className="tnum">{fmt(r.oldAmt)}</b></li>
          <li><i className="new" /><span>{x('SIO monthly scheme, from Mar 2024', 'نظام التأمينات الشهري، من مارس 2024')}<small className="tnum">{x(`${r.newMonths} months at ${SIO.eosNew * 100}% then ${SIO.eosLater * 100}%`, `${r.newMonths} شهرًا بنسبة ${SIO.eosNew * 100}% ثم ${SIO.eosLater * 100}%`)}</small></span><b className="tnum">{fmt(r.newAmt)}</b></li>
        </ul>
        <p className="ra-fine">{x('The first 3 years earn 15 days a year, every year after earns a full month. Bahraini staff are covered by the SIO pension instead.', 'أول 3 سنوات تُحتسب بـ15 يومًا للسنة، وما بعدها بشهر كامل. البحرينيون يغطيهم نظام التقاعد في التأمينات.')}</p>
      </section>
    </div>
  )
}

/* ================= Ask RAL ================= */
export const ASK_CHIPS: { q: string; l: Lang; a: number }[] = [
  { q: 'How much SIO are we paying for October?', l: 'en', a: 0 },
  { q: 'كم يوم إجازة باقي لنور السيد؟', l: 'ar', a: 1 },
  { q: 'Who is off the week of 15 November?', l: 'en', a: 2 },
  { q: 'shu el overtime kil site hal shahar?', l: 'ar', a: 3 },
  { q: 'What does Rajesh get at end of service?', l: 'en', a: 4 },
]
export function matchAsk(q: string): number {
  const t = q.toLowerCase()
  if (/sio|تأمين|تامين|insurance/.test(t)) return 0
  if (/noor|نور|balance|رصيد/.test(t)) return 1
  if (/off|week|away|غياب|أسبوع|اسبوع|who/.test(t)) return 2
  if (/overtime|اضافي|إضافي|ساعات/.test(t)) return 3
  if (/end of service|gratuity|eos|نهاية|مكافأة|rajesh|راجيش/.test(t)) return 4
  if (/leave|إجاز|اجاز/.test(t)) return 1
  return 5
}

type Ans = { text: string; table?: [string, string, string?][]; bars?: [string, number, string][] }
function answer(a: number, l: Lang, s: DemoState): Ans {
  const x = tx(l)
  if (a === 0) return {
    text: x(`October SIO comes to BD ${fmt(TOTALS.sio + TOTALS.erSio)}. Staff pay BD ${fmt(TOTALS.sio)} from their salaries, and the company pays BD ${fmt(TOTALS.erSio)}, which includes the new end of service contributions for expats.`,
      `إجمالي التأمينات لشهر أكتوبر ${fmt(TOTALS.sio + TOTALS.erSio)} د.ب. يدفع الموظفون ${fmt(TOTALS.sio)} د.ب من رواتبهم، وتدفع الشركة ${fmt(TOTALS.erSio)} د.ب تشمل اشتراكات نهاية الخدمة الجديدة للوافدين.`),
    table: [[x('Bahraini staff', 'البحرينيون'), fmt(TOTALS.bhSio), fmt(TOTALS.bhEr)], [x('Expat staff', 'الوافدون'), fmt(TOTALS.exSio), fmt(TOTALS.exEr)], [x('Total', 'المجموع'), fmt(TOTALS.sio), fmt(TOTALS.erSio)]],
  }
  if (a === 1) {
    const n = byName('Noor Al Sayed'); const lv = leaveOf(n, s); const st = s.decided.noor
    return {
      text: x(`Noor Al Sayed has ${lv.left} days of annual leave left. She has used ${lv.used} of 30.${st === 'ok' ? ' Her 3 days from 15 November are approved.' : st === 'no' ? ' Her request for 15 November was declined.' : ' Her 3 days from 15 November are waiting for you.'}`,
        `لدى نور السيد ${lv.left} يومًا من إجازتها السنوية. استخدمت ${lv.used} من 30 يومًا.${st === 'ok' ? ' تمت الموافقة على 3 أيام من 15 نوفمبر.' : st === 'no' ? ' رُفض طلبها ليوم 15 نوفمبر.' : ' وطلبها لـ3 أيام من 15 نوفمبر بانتظار موافقتك.'}`),
      bars: [[x('Used', 'مستخدمة'), lv.used, String(lv.used)], [x('Waiting', 'بالانتظار'), lv.pending, String(lv.pending)], [x('Left', 'متبقية'), lv.left, String(lv.left)]],
    }
  }
  if (a === 2) {
    const names = new Map<string, [number, number]>()
    BOOKED.forEach((b) => { if (b.to >= 15 && b.from <= 19) names.set(b.who, [b.from, b.to]) })
    REQUESTS.forEach((r) => { if (s.decided[r.id] === 'ok' && r.to >= 15 && r.from <= 19) names.set(r.who, [r.from, r.to]) })
    const rows = [...names].map(([n, [f, t]]) => [nm(n, l), range(l, f, t), deptName(byName(n).d, l)] as [string, string, string])
    return { text: x(`${rows.length} people are off between 15 and 19 November. Operations stays above its minimum cover every day.`, `${rows.length} موظفين في إجازة بين 15 و19 نوفمبر. يبقى قسم العمليات فوق الحد الأدنى للتغطية كل يوم.`), table: rows }
  }
  if (a === 3) {
    const tot = ATTENDANCE.overtime.reduce((m, v) => m + v, 0)
    return {
      text: x(`${tot} overtime hours so far this month. Juffair has the most, mostly the HVAC team.`, `مجموع ساعات العمل الإضافي هذا الشهر ${tot} ساعة. موقع الجفير هو الأعلى، ومعظمها لفريق التكييف.`),
      bars: SITES.map((st, i) => [l === 'ar' ? st[1] : st[0], ATTENDANCE.overtime[i], x(`${ATTENDANCE.overtime[i]} h`, `${ATTENDANCE.overtime[i]} س`)] as [string, number, string]),
    }
  }
  if (a === 4) {
    const p = byName('Rajesh Kumar'); const r = endOfService(p.basic, 12.5)
    return {
      text: x(`If Rajesh Kumar leaves on 30 November after 12.5 years, his end of service is BD ${fmt(r.total)}: BD ${fmt(r.oldAmt)} under Art. 116 for service to February 2024, and BD ${fmt(r.newAmt)} paid through the SIO scheme since.`,
        `إذا غادر راجيش كومار في 30 نوفمبر بعد 12.5 سنة، فمكافأته ${fmt(r.total)} د.ب: ${fmt(r.oldAmt)} وفق المادة 116 عن الخدمة حتى فبراير 2024، و${fmt(r.newAmt)} عبر نظام التأمينات بعدها.`),
      bars: [[x('Art. 116', 'المادة 116'), r.oldAmt, fmt(r.oldAmt)], [x('SIO scheme', 'نظام التأمينات'), r.newAmt, fmt(r.newAmt)]],
    }
  }
  return { text: x('I answer from your own payroll, leave and attendance records. Try SIO, a leave balance, who is off, overtime or end of service.', 'أجيب من سجلات الرواتب والإجازات والحضور لديك. جرّب: التأمينات، رصيد إجازة، من في إجازة، العمل الإضافي أو نهاية الخدمة.') }
}

function Stream({ text, live, onDone }: { text: string; live: boolean; onDone: () => void }) {
  const ref = useRef<HTMLSpanElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (!live || calm()) { el.textContent = text; onDone(); return }
    let i = 0
    el.textContent = ''
    const id = window.setInterval(() => {
      i = Math.min(text.length, i + 3)
      el.textContent = text.slice(0, i)
      if (i >= text.length) { window.clearInterval(id); onDone() }
    }, 18)
    return () => window.clearInterval(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text, live])
  return <span ref={ref} />
}

function Answer({ a, l, s, live }: { a: number; l: Lang; s: DemoState; live: boolean }) {
  const [done, setDone] = useState(!live)
  const ans = answer(a, l, s)
  const x = tx(l)
  const ref = useCascade(done)
  const max = Math.max(1, ...(ans.bars ?? []).map((b) => b[1]))
  return (
    <div className="ra-msg ral" dir={l === 'ar' ? 'rtl' : 'ltr'} lang={l} ref={ref}>
      <p><Stream text={ans.text} live={live} onDone={() => setDone(true)} /></p>
      {done && ans.table && (
        <div className="ra-mini">
          {a === 0 && <div className="ra-tr th"><span /><span>{x('Staff', 'الموظف')}</span><span>{x('Company', 'الشركة')}</span></div>}
          {ans.table.map((r) => <div key={r[0]} className="ra-tr cx"><b>{r[0]}</b><span className="tnum">{r[1]}</span><span className="tnum">{r[2]}</span></div>)}
        </div>
      )}
      {done && ans.bars && (
        <ul className="ra-mbars">{ans.bars.map((b) => <li key={b[0]} className="cx"><span>{b[0]}</span><span className="ra-bar"><i className="gx" style={{ '--w': b[1] / max } as React.CSSProperties} /></span><b className="tnum">{b[2]}</b></li>)}</ul>
      )}
      {done && a === 4 && <small className="ra-src">{x('From: Labour Law 2012 Art. 116, SIO Resolution 2024', 'المصدر: قانون العمل 2012 المادة 116، قرار التأمينات 2024')}</small>}
    </div>
  )
}

export function AskScreen({ s, act, lang }: P) {
  const x = tx(lang)
  const [draft, setDraft] = useState('')
  const logRef = useRef<HTMLDivElement>(null)
  useEffect(() => { const el = logRef.current?.closest('.ra-scroll'); if (el) el.scrollTo({ top: el.scrollHeight, behavior: calm() ? 'auto' : 'smooth' }) }, [s.asks.length])
  const send = (e: React.FormEvent) => {
    e.preventDefault()
    const q = draft.trim()
    if (!q) return
    act.ask(q, /[؀-ۿ]/.test(q) ? 'ar' : 'en')
    setDraft('')
  }
  return (
    <div className="ra-screen ra-ask">
      <div className="ra-log" ref={logRef}>
        <div className="ra-msg ral intro"><p>{x('Hi Aisha. Ask me about pay, leave, attendance or the law, in Arabic or English.', 'أهلًا عائشة. اسأليني عن الرواتب أو الإجازات أو الحضور أو القانون، بالعربية أو الإنجليزية.')}</p></div>
        {s.asks.map((m, i) => (
          <div key={i} className="ra-turn">
            <p className="ra-msg me" dir={/[؀-ۿ]/.test(m.q) ? 'rtl' : 'ltr'}>{m.q}</p>
            <Answer a={m.a} l={m.l} s={s} live={i === s.asks.length - 1} />
          </div>
        ))}
      </div>
      <div className="ra-askbar">
        <div className="ra-chips sugg">
          {ASK_CHIPS.map((c, i) => <button key={c.q} type="button" data-g={`ask-${i}`} dir={c.l === 'ar' ? 'rtl' : 'ltr'} onClick={() => act.ask(c.q, c.l, c.a)}>{c.q}</button>)}
        </div>
        <form className="ra-input" onSubmit={send}>
          <input value={draft} onChange={(e) => setDraft(e.target.value)} placeholder={x('Ask anything about your people', 'اسأل أي شيء عن موظفيك')} aria-label={x('Ask RAL', 'اسأل RAL')} />
          <button type="submit" className="ra-btn sm">{x('Ask', 'اسأل')}</button>
        </form>
      </div>
    </div>
  )
}
