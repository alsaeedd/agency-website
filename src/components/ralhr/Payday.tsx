import { useCallback, useEffect, useRef, useState } from 'react'
import { t as tr, isAr } from './t'
import { gsap } from 'gsap'
import { calm, money, useIsoLayoutEffect } from './charts'
import { PAYROLL } from './data'
import './Payday.css'

// The hero: a real HTML app window that runs a Bahrain payday on its own
// (staff stream in, gross to SIO to net, approval, WPS file, phone ping),
// then hands the controls to the visitor. Arabic flips the app to RTL.

type Lang = 'en' | 'ar'
type Dev = 'web' | 'tablet' | 'phone'

const STAFF = [
  { en: 'Mohammed Kanoo', ar: 'محمد كانو', role: ['Accountant', 'محاسب'], bh: true, gross: 1003, cpr: '8907•••41', iban: 'BH67 •••• 0042' },
  { en: 'Fatima Janahi', ar: 'فاطمة جناحي', role: ['HR Officer', 'موارد بشرية'], bh: true, gross: 720, cpr: '9104•••27', iban: 'BH29 •••• 1180' },
  { en: 'Mahmoud Fathy', ar: 'محمود فتحي', role: ['Technician', 'فني'], bh: false, gross: 480, cpr: '7812•••90', iban: 'BH03 •••• 7715' },
  { en: 'Noor Al Sayed', ar: 'نور السيد', role: ['Site Supervisor', 'مشرفة موقع'], bh: true, gross: 860, cpr: '9302•••58', iban: 'BH84 •••• 2261' },
  { en: 'Omar Khatib', ar: 'عمر الخطيب', role: ['Electrician', 'كهربائي'], bh: false, gross: 425, cpr: '8203•••15', iban: 'BH51 •••• 3309' },
  { en: 'Rania Haddad', ar: 'رانيا حداد', role: ['Accountant', 'محاسبة'], bh: false, gross: 690, cpr: '9011•••62', iban: 'BH12 •••• 4470' },
  { en: 'Hassan Kanoo', ar: 'حسن كانو', role: ['Ops Manager', 'مدير عمليات'], bh: true, gross: 1240, cpr: '8605•••03', iban: 'BH40 •••• 9934' },
  { en: 'Tarek Mansour', ar: 'طارق منصور', role: ['Driver', 'سائق'], bh: false, gross: 395, cpr: '8812•••77', iban: 'BH95 •••• 5108' },
].map((s) => {
  const sio = Math.round(s.gross * (s.bh ? 0.08 : 0.01) * 1000) / 1000
  return { ...s, sio, net: s.gross - sio }
})

const T = {
  en: {
    nav: ['Home', 'People', 'Payroll', 'Leave', 'Ask RAL'], title: 'October payroll', co: 'Bahrain Horizon Facilities · 98 people',
    steps: ['Draft', 'Computed', 'Approved', 'Paid', 'WPS file'], emp: 'Employee', gross: 'Gross', sio: 'SIO', net: 'Net',
    toBank: 'Net pay to the bank', grossL: 'Gross pay', dedL: 'SIO and deductions', more: 'and 90 more people',
    wps: 'WPS salary file', done: '10 of 10 columns checked', building: 'Checking each row', stamp: 'Approved',
    bh: 'Bahraini', ex: 'Expat', slip: 'Payslip, October', close: 'Back to totals', rate: (bh: boolean) => (bh ? 'SIO, 8%' : 'SIO, 1%'),
    note: ['RAL HR', 'now', 'Your October payslip is ready', 'BD 922.760 net, sent to your bank'],
  },
  ar: {
    nav: ['الرئيسية', 'الموظفون', 'الرواتب', 'الإجازات', 'اسأل RAL'], title: 'رواتب أكتوبر', co: 'بحرين هورايزن للمرافق · 98 موظفًا',
    steps: ['مسودة', 'محسوبة', 'معتمدة', 'مدفوعة', 'ملف WPS'], emp: 'الموظف', gross: 'الإجمالي', sio: 'التأمينات', net: 'الصافي',
    toBank: 'صافي الرواتب إلى البنك', grossL: 'إجمالي الرواتب', dedL: 'التأمينات والاستقطاعات', more: 'و90 موظفًا آخرين',
    wps: 'ملف رواتب WPS', done: 'تم فحص 10 من 10 أعمدة', building: 'جاري فحص كل صف', stamp: 'معتمد',
    bh: 'بحريني', ex: 'وافد', slip: 'قسيمة راتب أكتوبر', close: 'العودة للإجماليات', rate: (bh: boolean) => (bh ? 'التأمينات 8%' : 'التأمينات 1%'),
    note: ['RAL HR', 'الآن', 'قسيمة راتب أكتوبر جاهزة', '922.760 د.ب صافي، حُوّلت إلى بنكك'],
  },
}
const DEVS: [Dev, string][] = [['web', 'Web'], ['tablet', 'Tablet'], ['phone', 'Phone']]
const ICONS = ['M3 11l9-7 9 7v9H3z', 'M8 8a4 4 0 108 0 4 4 0 10-8 0M3 21c1-5 5-7 9-7s8 2 9 7', 'M3 6h18v12H3zM3 10h18', 'M5 5h14v15H5zM5 9h14M9 3v4M15 3v4', 'M4 5h16v11H9l-5 4z']
const cur = (l: Lang, s: string) => (l === 'ar' ? s + ' د.ب' : 'BD ' + s)
const ini = (n: string) => n.split(' ').map((w) => w[0]).slice(0, 2).join('')

export default function Payday({ compact = false, waitForView = false, lite = false }: { compact?: boolean; waitForView?: boolean; lite?: boolean }) {
  const [lang, setLang] = useState<Lang>(isAr() ? 'ar' : 'en')
  const [dev, setDev] = useState<Dev>('web')
  const [rows, setRows] = useState(STAFF.length)
  const [step, setStep] = useState(5)
  const [wps, setWps] = useState(4)
  const [note, setNote] = useState(true)
  const [live, setLive] = useState(true)
  const [sel, setSel] = useState<number | null>(null)
  const frame = useRef<HTMLDivElement>(null)
  const nums = useRef<(HTMLSpanElement | null)[]>([])
  const tl = useRef<gsap.core.Timeline | null>(null)
  const prev = useRef<[number, number] | null>(null)
  const t = T[lang]

  const play = useCallback(() => {
    tl.current?.kill()
    setLive(false); setSel(null); setRows(0); setStep(0); setWps(0); setNote(false)
    const v = [PAYROLL.gross, PAYROLL.deductions, PAYROLL.net]
    nums.current.forEach((n) => { if (n) n.textContent = '0' })
    const o = { a: 0, b: 0, c: 0 }
    const k = gsap.timeline({ delay: 0.35, onComplete: () => setLive(true) })
    k.call(() => setStep(1), [], 0)
    STAFF.forEach((_, i) => k.call(() => setRows(i + 1), [], 0.1 + i * 0.14))
    k.to(o, { a: v[0], b: v[1], c: v[2], duration: 1.7, ease: 'expo.out', onUpdate: () => {
      const [x, y, z] = nums.current
      if (x) x.textContent = money(o.a); if (y) y.textContent = money(o.b); if (z) z.textContent = money(o.c)
    } }, 0.5)
      .call(() => setStep(2), [], 1.4)
      .call(() => setStep(3), [], 2.1)
    for (let i = 0; i < 4; i++) k.call(() => setWps(i + 1), [], 2.6 + i * 0.2)
    k.call(() => setStep(4), [], 3.5).call(() => { setStep(5); setNote(true) }, [], 4).to({}, { duration: 0.5 })
    tl.current = k
  }, [])
  const take = () => { if (tl.current) { tl.current.progress(1); tl.current.kill() } setLive(true) }

  // Fire-once settle (the window lands flat), then the run starts.
  useIsoLayoutEffect(() => {
    const el = frame.current
    if (!el || calm() || lite) return
    let id = 0
    let io: IntersectionObserver | null = null
    const go = () => {
      gsap.fromTo(el, { rotateX: 20, y: 70, scale: 0.94, opacity: 0 }, { rotateX: 0, y: 0, scale: 1, opacity: 1, duration: 1.6, ease: 'expo.out', transformPerspective: 1800, transformOrigin: '50% 0%', delay: 0.15, clearProps: 'transform,opacity' })
      id = window.setTimeout(play, 450)
    }
    // On the home page the window waits until it is actually on screen.
    if (waitForView && 'IntersectionObserver' in window) {
      gsap.set(el, { opacity: 0 })
      io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { io?.disconnect(); go() } }, { threshold: 0.3 })
      io.observe(el)
    } else go()
    return () => { io?.disconnect(); clearTimeout(id); tl.current?.kill() }
  }, [play, waitForView, lite])

  // Device switch: FLIP the frame from its old size to the new one.
  const toDev = (d: Dev) => {
    if (d === dev || !frame.current) return
    prev.current = [frame.current.offsetWidth, frame.current.offsetHeight]
    setDev(d)
  }
  useIsoLayoutEffect(() => {
    const el = frame.current, p = prev.current
    if (!el || !p) return
    prev.current = null
    if (calm()) return
    gsap.fromTo(el, { width: p[0], height: p[1] }, { width: el.offsetWidth, height: el.offsetHeight, duration: 0.8, ease: 'expo.inOut', clearProps: 'width,height' })
    gsap.fromTo(el.querySelector('.pd-app'), { opacity: 0 }, { opacity: 1, duration: 0.5, delay: 0.35 })
  }, [dev])
  useEffect(() => {
    const a = frame.current?.querySelector('.pd-app')
    if (a && !calm()) gsap.fromTo(a, { opacity: 0.25, x: lang === 'ar' ? -14 : 14 }, { opacity: 1, x: 0, duration: 0.55, ease: 'expo.out' })
  }, [lang])

  const pick = (i: number) => { if (!live) take(); setSel(sel === i ? null : i) }
  const s = sel === null ? null : STAFF[sel]
  const dedPct = (PAYROLL.deductions / PAYROLL.gross) * 100

  return (
    <div className={'pd' + (compact ? ' pd--compact' : '')} data-dev={dev} data-step={step}>
      <div className="pd-tools" role="toolbar" aria-label={tr("Demo controls")}>
        {!compact && <div className="pd-seg pd-devs" role="group" aria-label={tr("Device")}>
          {DEVS.map(([d, l]) => <button key={d} type="button" aria-pressed={dev === d} onClick={() => toDev(d)}>{tr(l)}</button>)}
        </div>}
        <div className="pd-seg" role="group" aria-label={tr("Language")}>
          <button type="button" aria-pressed={lang === 'en'} onClick={() => setLang('en')}>{tr("English")}</button>
          <button type="button" lang="ar" aria-pressed={lang === 'ar'} onClick={() => setLang('ar')}>عربي</button>
        </div>
        <button type="button" className={'pd-ctl' + (live ? '' : ' run')} onClick={live ? play : take}>
          {live ? <><span aria-hidden="true">↻</span> {tr('Run payday again')}</> : <><i aria-hidden="true" /> {tr('Take the controls')}</>}
        </button>
      </div>

      <div className="pd-stage">
        <div className="pd-frame" ref={frame} data-dev={dev}>
          <div className="pd-chrome" aria-hidden="true"><i /><i /><i /><span>{lang === 'ar' ? 'RAL HR · الرواتب' : 'RAL HR · Payroll'}</span></div>
          <div className="pd-app" dir={lang === 'ar' ? 'rtl' : 'ltr'} lang={lang}>
            <aside className="pd-side" aria-hidden="true">
              <p className="pd-logo"><b>RAL</b> HR</p>
              <ul>{t.nav.map((n, i) => <li key={n} className={i === 2 ? 'on' : ''}><svg viewBox="0 0 24 24"><path d={ICONS[i]} /></svg>{n}</li>)}</ul>
            </aside>
            <div className="pd-main">
              <header className="pd-head">
                <div><h3>{t.title} <span className="tnum">2026</span></h3><p>{t.co}</p></div>
                <ol className="pd-steps">{t.steps.map((x, i) => <li key={x} className={i < step ? 'on' : ''}><i />{x}</li>)}</ol>
              </header>
              <div className="pd-grid">
                <div className="pd-table">
                  <div className="pd-tr pd-th"><span>{t.emp}</span><span>{t.gross}</span><span>{t.sio}</span><span>{t.net}</span></div>
                  {STAFF.map((p, i) => (
                    <button key={p.en} type="button" className={'pd-tr' + (i < rows ? ' in' : '') + (sel === i ? ' sel' : '')} onClick={() => pick(i)} tabIndex={i < rows ? 0 : -1}>
                      <span className="pd-who"><i className={'pd-av' + (p.bh ? ' bh' : '')}>{ini(p.en)}</i><span><b>{lang === 'ar' ? p.ar : p.en}</b><small>{p.role[lang === 'ar' ? 1 : 0]} · {p.bh ? t.bh : t.ex}</small></span></span>
                      <span className="tnum pd-c-g">{money(p.gross, 3)}</span>
                      <span className="tnum pd-c-s">−{money(p.sio, 3)}</span>
                      <span className="tnum pd-c-n">{money(p.net, 3)}</span>
                    </button>
                  ))}
                  <p className="pd-more">{t.more}</p>
                </div>
                <div className="pd-col">
                  <div className={'pd-total' + (step >= 2 ? ' on' : '')}>
                    <span className={'pd-stamp' + (step >= 3 ? ' on' : '')} aria-hidden="true">{t.stamp}</span>
                    <p className="pd-k">{t.toBank}</p>
                    <p className="pd-big tnum">{lang === 'en' && <small>BD</small>}<span ref={(e) => { nums.current[2] = e }} dangerouslySetInnerHTML={{ __html: money(PAYROLL.net) }} />{lang === 'ar' && <small>د.ب</small>}</p>
                    <div className="pd-bars">
                      <div><span>{t.grossL}</span><em><i style={{ width: '100%' }} /></em><b className="tnum" ref={(e) => { nums.current[0] = e }} dangerouslySetInnerHTML={{ __html: money(PAYROLL.gross) }} /></div>
                      <div className="ded"><span>{t.dedL}</span><em><i style={{ width: dedPct + '%' }} /></em><b className="tnum">−<span ref={(e) => { nums.current[1] = e }} dangerouslySetInnerHTML={{ __html: money(PAYROLL.deductions) }} /></b></div>
                    </div>
                  </div>
                  {s ? (
                    <div className="pd-slip" key={sel}>
                      <p className="pd-k">{t.slip}</p>
                      <p className="pd-slip-who"><b>{lang === 'ar' ? s.ar : s.en}</b><span>{s.role[lang === 'ar' ? 1 : 0]}</span></p>
                      <dl>
                        <div><dt>{t.gross}</dt><dd className="tnum">{cur(lang, money(s.gross, 3))}</dd></div>
                        <div className="ded"><dt>{t.rate(s.bh)}</dt><dd className="tnum">−{money(s.sio, 3)}</dd></div>
                        <div className="net"><dt>{t.net}</dt><dd className="tnum">{cur(lang, money(s.net, 3))}</dd></div>
                      </dl>
                      <button type="button" onClick={() => setSel(null)}>{t.close}</button>
                    </div>
                  ) : (
                    <div className="pd-wps">
                      <p className="pd-k">{t.wps}<span className={wps === 4 ? 'ok' : ''}>{wps === 4 ? t.done : t.building}</span></p>
                      <ul>{STAFF.slice(0, 4).map((p, i) => (
                        <li key={p.en} className={i < wps ? 'in' : ''}><span className="tnum">{p.cpr}</span><span>{lang === 'ar' ? p.ar : p.en}</span><span className="tnum">{p.iban}</span><b className="tnum">{money(p.net, 3)}</b></li>
                      ))}</ul>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className={'pd-note' + (note ? ' on' : '')} dir={lang === 'ar' ? 'rtl' : 'ltr'} lang={lang} aria-live="polite">
          <i className="pd-note-i">R</i>
          <span><small><b>{t.note[0]}</b>{t.note[1]}</small><b>{t.note[2]}</b><span>{t.note[3]}</span></span>
        </div>
      </div>
      {!compact && <p className={'pd-hint' + (live ? ' on' : '')}>
        {isAr() ? <>دورك الآن. اضغط على أي شخص لفتح قسيمة راتبه، أو بدّل إلى <span lang="en">English</span>، أو جرّبه على الهاتف.</> : <>Your turn. Click anyone to open their payslip, switch to <span lang="ar">عربي</span>, or try it on a phone.</>}
      </p>}
    </div>
  )
}
