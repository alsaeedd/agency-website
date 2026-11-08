import { useCallback, useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { Flip } from 'gsap/Flip'
import { calm, useIsoLayoutEffect } from './charts'
import {
  HomeScreen, PeopleScreen, PayrollScreen, LeaveScreen, EosScreen, AskScreen, captureLeave, matchAsk, pendingCount, tx, nm,
  type Device, type TabId, type DemoState, type Act,
} from './screens'
import { ROSTER, TOTALS, REQUESTS, byName, bd, type Lang } from './data'
import './Demo.css'

gsap.registerPlugin(Flip)

// Each device renders the same app at a fixed design size, scaled to fit the
// frame with one transform, so the UI looks identical at any page width.
const DESIGN: Record<Device, { w: number; h: number }> = {
  web: { w: 1000, h: 660 },
  tablet: { w: 760, h: 1000 },
  phone: { w: 390, h: 800 },
}

const TABS: { id: TabId; label: [string, string]; line: [string, string] }[] = [
  { id: 'home', label: ['Dashboard', 'لوحة التحكم'], line: ['Who is at work, what is waiting, and October pay.', 'من في العمل، وما ينتظرك، ورواتب أكتوبر.'] },
  { id: 'payroll', label: ['Payroll + WPS', 'الرواتب و WPS'], line: ['Compute, check, approve, then the bank file.', 'احتساب ومراجعة واعتماد، ثم ملف البنك.'] },
  { id: 'leave', label: ['Leave', 'الإجازات'], line: ['Approve and watch balance and cover update.', 'وافق وشاهد الرصيد والتغطية تتحدث.'] },
  { id: 'people', label: ['People', 'الموظفون'], line: ['98 profiles, each with a real payslip.', '98 ملفًا، لكل منها قسيمة راتب حقيقية.'] },
  { id: 'eos', label: ['End of service', 'نهاية الخدمة'], line: ['Art. 116 and the 2024 SIO scheme, side by side.', 'المادة 116 ونظام التأمينات 2024 معًا.'] },
  { id: 'ask', label: ['Ask RAL', 'اسأل RAL'], line: ['Ask in Arabic or English, get the numbers.', 'اسأل بالعربية أو الإنجليزية واحصل على الأرقام.'] },
]
const NAV: Record<TabId, [string, string]> = { home: ['Home', 'الرئيسية'], people: ['People', 'الموظفون'], payroll: ['Payroll', 'الرواتب'], leave: ['Leave', 'الإجازات'], eos: ['End of service', 'نهاية الخدمة'], ask: ['Ask RAL', 'اسأل RAL'] }
const SIDE: TabId[] = ['home', 'people', 'payroll', 'leave', 'eos', 'ask']
const PHONE_TABS: TabId[] = ['home', 'people', 'payroll', 'leave', 'ask']

const TOUR: { tab: TabId; steps: string[] }[] = [
  { tab: 'home', steps: [] },
  { tab: 'payroll', steps: ['pay-compute', 'pay-review', 'pay-fix', 'pay-approve', 'pay-confirm', 'pay-wps'] },
  { tab: 'leave', steps: ['leave-ok-noor', 'leave-sel-suresh', 'leave-ok-suresh'] },
  { tab: 'people', steps: ['person-3', 'to-eos'] },
  { tab: 'ask', steps: ['ask-0', 'ask-1'] },
]
const CAPTION: Record<string, [string, string]> = {
  'pay-compute': ['Computing October for 98 people', 'احتساب أكتوبر لـ98 موظفًا'],
  'pay-review': ['Running the checks before approval', 'تشغيل الفحوصات قبل الاعتماد'],
  'pay-fix': ["Fixing Arun's IBAN from the HR record", 'تصحيح آيبان أرون من سجل الموارد البشرية'],
  'pay-approve': ['Approving: money moves only on a second tap', 'الاعتماد: لا تتحرك الأموال إلا بنقرة ثانية'],
  'pay-confirm': ['Second approver signs off', 'المعتمِد الثاني يوقّع'],
  'pay-wps': ['Building the WPS file row by row', 'بناء ملف WPS صفًا صفًا'],
  'leave-ok-noor': ["Approving Noor's 3 days", 'الموافقة على 3 أيام لنور'],
  'leave-sel-suresh': ["Opening Suresh's trip home", 'فتح طلب سوريش للسفر'],
  'leave-ok-suresh': ['Maintenance drops to minimum cover', 'الصيانة تصل إلى الحد الأدنى للتغطية'],
  'person-3': ["Opening Rajesh's profile and payslip", 'فتح ملف راجيش وقسيمة راتبه'],
  'to-eos': ['Working out his end of service', 'احتساب مكافأة نهاية خدمته'],
  'ask-0': ['Asking about SIO in English', 'سؤال عن التأمينات بالإنجليزية'],
  'ask-1': ['Asking about leave in Arabic', 'سؤال عن الإجازة بالعربية'],
}

const RAJESH = byName('Rajesh Kumar').id
const INITIAL: DemoState = {
  pay: 0, ibanFixed: false, confirm: false, decided: {}, sel: 'noor', person: byName('Mohammed Kanoo').id, profileOpen: false,
  q: '', dept: 'all', eosWho: RAJESH, eosYears: 12.5, asks: [],
}

type Token = { dead: boolean }

export default function Demo({ lang: langProp }: { lang?: Lang } = {}) {
  const [device, setDevice] = useState<Device>(() => (typeof window !== 'undefined' && window.innerWidth < 760 ? 'phone' : 'web'))
  const [lang, setLang] = useState<Lang>(langProp ?? 'en')
  useEffect(() => { if (langProp) setLang(langProp) }, [langProp])
  const [tab, setTab] = useState<TabId>('home')
  const [s, setS] = useState<DemoState>(INITIAL)
  const [toasts, setToasts] = useState<{ id: number; msg: string }[]>([])
  const [caption, setCaption] = useState('')
  const [touring, setTouring] = useState(false)
  const x = tx(lang)

  const rootRef = useRef<HTMLDivElement>(null)
  const frameRef = useRef<HTMLDivElement>(null)
  const screenRef = useRef<HTMLDivElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const cursorRef = useRef<HTMLDivElement>(null)
  const flipState = useRef<Flip.FlipState | null>(null)
  const token = useRef<Token>({ dead: true })
  const userActed = useRef(false)
  const hovering = useRef(false)
  const visible = useRef(false)
  const resumeTimer = useRef<number>()
  const prevTab = useRef<TabId>('home')
  const langRef = useRef(lang)
  langRef.current = lang

  const patch = useCallback((p: Partial<DemoState>) => setS((o) => ({ ...o, ...p })), [])
  const toastId = useRef(0)
  const flash = useCallback((en: string, ar: string) => {
    const id = ++toastId.current
    const msg = langRef.current === 'ar' ? ar : en
    setToasts((l) => [...l.slice(-1), { id, msg }])
    window.setTimeout(() => setToasts((l) => l.filter((t) => t.id !== id)), 3600)
  }, [])

  const go = (t: TabId) => { prevTab.current = tab; setTab(t) }
  const act: Act = {
    compute: () => patch({ pay: 1 }),
    review: () => patch({ pay: 2 }),
    fixIban: () => { patch({ ibanFixed: true }); flash("Arun Pillai's IBAN updated from his HR record", 'تم تحديث آيبان أرون بيلاي من سجل الموارد البشرية') },
    askApprove: () => patch({ confirm: true }),
    cancel: () => patch({ confirm: false }),
    confirm: () => { patch({ confirm: false, pay: 3 }); flash(`October payroll approved, ${ROSTER.length} people, ${bd(TOTALS.net, 'en')}`, `اعتُمدت رواتب أكتوبر، ${ROSTER.length} موظفًا، ${bd(TOTALS.net, 'ar')}`) },
    wps: () => patch({ pay: 4 }),
    download: () => flash('WPS file sent to NBB. Payslips go out when the bank confirms.', 'أُرسل ملف WPS إلى البنك الوطني. تصدر القسائم عند تأكيد البنك.'),
    decide: (id, ok) => {
      captureLeave(stageRef.current)
      setS((o) => ({ ...o, decided: { ...o.decided, [id]: ok ? 'ok' : 'no' } }))
      const r = REQUESTS.find((q) => q.id === id)
      if (!r) return
      const p = byName(r.who)
      if (ok) flash(`Approved: ${r.kind[0].toLowerCase()} for ${p.en}`, `تمت الموافقة: ${r.kind[1]} لـ${p.ar}`)
      else flash(`Declined. ${p.en.split(' ')[0]} has been told`, `رُفض الطلب وأُبلغ ${p.ar}`)
    },
    select: (sel) => patch({ sel }),
    openPerson: (person) => patch({ person, profileOpen: true }),
    closePerson: () => patch({ profileOpen: false }),
    setQ: (q) => patch({ q }),
    setDept: (dept) => patch({ dept }),
    setEos: (eosWho, eosYears) => patch({ eosWho, eosYears: Math.min(25, Math.max(1, eosYears)) }),
    ask: (q, l, a) => setS((o) => ({ ...o, asks: [...o.asks.slice(-3), { q, l, a: a ?? matchAsk(q) }] })),
    go,
  }

  // Scale the design canvas to the frame.
  useIsoLayoutEffect(() => {
    const el = screenRef.current
    if (!el) return
    const apply = () => stageRef.current?.style.setProperty('--s', String(el.clientWidth / DESIGN[device].w))
    apply()
    const ro = new ResizeObserver(apply)
    ro.observe(el)
    return () => ro.disconnect()
  }, [device])

  // Device morph: capture the frame, swap the device, Flip from the old box.
  const switchDevice = (d: Device) => {
    if (d === device) return
    stopTour(true)
    if (!calm() && frameRef.current) {
      flipState.current = Flip.getState(frameRef.current, { props: 'borderRadius,padding' })
      gsap.set(stageRef.current, { autoAlpha: 0 })
    }
    setDevice(d)
  }
  useIsoLayoutEffect(() => {
    const st = flipState.current
    if (!st || !frameRef.current) return
    flipState.current = null
    Flip.from(st, { targets: frameRef.current, duration: 0.8, ease: 'expo.inOut', props: 'borderRadius,padding' })
    gsap.to(stageRef.current, { autoAlpha: 1, duration: 0.45, delay: 0.42, ease: 'power3.out' })
    const app = stageRef.current?.querySelector('.ra-app')
    if (app) gsap.fromTo(app, { scale: 1.04, filter: 'blur(6px)' }, { scale: 1, filter: 'blur(0px)', duration: 0.7, delay: 0.38, ease: 'expo.out', clearProps: 'transform,filter' })
    const base = rootRef.current?.querySelector('.dv-laptop-base')
    if (base) gsap.fromTo(base, { scaleX: 0.4, autoAlpha: 0 }, { scaleX: 1, autoAlpha: 1, duration: 0.6, delay: 0.5, ease: 'expo.out' })
  }, [device])

  // Tab change: the new screen slides in from the side you are heading to.
  const firstTab = useRef(true)
  useIsoLayoutEffect(() => {
    if (firstTab.current) { firstTab.current = false; return }
    const body = stageRef.current?.querySelector('.ra-body')
    if (!body || calm()) return
    const dir = SIDE.indexOf(tab) >= SIDE.indexOf(prevTab.current) ? 1 : -1
    const tw = gsap.fromTo(body, { x: 28 * dir * (lang === 'ar' ? -1 : 1), autoAlpha: 0 }, { x: 0, autoAlpha: 1, duration: 0.55, ease: 'expo.out', clearProps: 'transform,opacity,visibility' })
    return () => { tw.progress(1).kill() }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab])

  // Language flip: the whole app cross-fades and mirrors.
  const firstLang = useRef(true)
  useIsoLayoutEffect(() => {
    if (firstLang.current) { firstLang.current = false; return }
    const app = stageRef.current?.querySelector('.ra-app')
    if (!app || calm()) return
    const tw = gsap.fromTo(app, { autoAlpha: 0.2, x: lang === 'ar' ? -16 : 16 }, { autoAlpha: 1, x: 0, duration: 0.6, ease: 'expo.out', clearProps: 'transform,opacity,visibility' })
    return () => { tw.progress(1).kill() }
  }, [lang])

  /* ---------- Ghost cursor tour ---------- */
  const wait = (ms: number, t: Token) => new Promise<void>((res, rej) => window.setTimeout(() => (t.dead ? rej(new Error('stop')) : res()), ms))

  const clickTarget = async (g: string, t: Token): Promise<boolean> => {
    const stage = stageRef.current
    const screen = screenRef.current
    const cur = cursorRef.current
    if (!stage || !screen || !cur) return false
    const el = stage.querySelector<HTMLElement>(`[data-g="${g}"]`)
    if (!el) return false
    const c = CAPTION[g]
    setCaption(c ? c[langRef.current === 'ar' ? 1 : 0] : '')
    const scroller = el.closest<HTMLElement>('.ra-scroll')
    if (scroller) {
      const er = el.getBoundingClientRect()
      const sr = scroller.getBoundingClientRect()
      if (er.bottom > sr.bottom || er.top < sr.top) scroller.scrollTop += (er.top - sr.top - sr.height / 3) / Number(stage.style.getPropertyValue('--s') || 1)
    }
    const r = el.getBoundingClientRect()
    const base = screen.getBoundingClientRect()
    gsap.set(cur, { autoAlpha: 1 })
    const tx2 = r.left - base.left + r.width / 2
    const ty = r.top - base.top + r.height / 2
    const dist = Math.hypot(tx2 - Number(gsap.getProperty(cur, 'x')), ty - Number(gsap.getProperty(cur, 'y')))
    await gsap.to(cur, { x: tx2, y: ty, duration: Math.min(0.95, 0.45 + dist / 900), ease: 'power3.inOut' })
    if (t.dead) throw new Error('stop')
    await wait(160, t)
    await gsap.to(cur, { scale: 0.84, duration: 0.12, ease: 'power3.out' })
    cur.classList.remove('ripple')
    void cur.offsetWidth
    cur.classList.add('ripple')
    el.classList.add('ra-pressed')
    window.setTimeout(() => el.classList.remove('ra-pressed'), 420)
    el.click()
    await gsap.to(cur, { scale: 1, duration: 0.35, ease: 'back.out(2.2)' })
    return true
  }

  const tabRef = useRef(tab)
  tabRef.current = tab
  const runTour = async (t: Token) => {
    let i = Math.max(0, TOUR.findIndex((st) => st.tab === tabRef.current))
    for (;;) {
      const step = TOUR[i]
      if (i === 0) setS(INITIAL)
      const navOk = await clickTarget(`nav-${step.tab}`, t)
      if (!navOk) go(step.tab)
      await wait(1200, t)
      for (const g of step.steps) {
        await clickTarget(g, t)
        await wait(g.startsWith('ask') ? 4200 : g === 'pay-compute' || g === 'pay-wps' ? 2000 : 1300, t)
      }
      await wait(2200, t)
      i = (i + 1) % TOUR.length
    }
  }

  const startTour = () => {
    if (calm() || userActed.current || hovering.current || !visible.current || !token.current.dead) return
    const t: Token = { dead: false }
    token.current = t
    setTouring(true)
    runTour(t).catch(() => undefined)
  }
  function stopTour(forGood = false) {
    token.current.dead = true
    if (forGood) userActed.current = true
    window.clearTimeout(resumeTimer.current)
    if (cursorRef.current) { gsap.killTweensOf(cursorRef.current); gsap.to(cursorRef.current, { autoAlpha: 0, duration: 0.2 }) }
    setTouring(false)
  }

  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    const io = new IntersectionObserver(([e]) => {
      visible.current = e.isIntersecting
      if (e.isIntersecting) startTour()
      else stopTour()
    }, { threshold: 0.3 })
    io.observe(root)
    const onVis = () => { if (document.hidden) stopTour(); else startTour() }
    document.addEventListener('visibilitychange', onVis)
    return () => { io.disconnect(); document.removeEventListener('visibilitychange', onVis); token.current.dead = true }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const onEnter = (e: React.PointerEvent) => { if (e.pointerType !== 'mouse') return; hovering.current = true; stopTour() }
  const onLeave = (e: React.PointerEvent) => {
    if (e.pointerType !== 'mouse') return
    hovering.current = false
    if (!userActed.current) resumeTimer.current = window.setTimeout(startTour, 6000)
  }
  const onUserClick = (e: React.MouseEvent) => { if (e.isTrusted) stopTour(true) }

  const pickTab = (t: TabId) => { stopTour(true); go(t) }
  const pickLang = (l: Lang) => { stopTour(true); setLang(l) }
  const Screen = { home: HomeScreen, people: PeopleScreen, payroll: PayrollScreen, leave: LeaveScreen, eos: EosScreen, ask: AskScreen }[tab]
  const d = DESIGN[device]
  const L = lang === 'ar' ? 1 : 0
  const waiting = pendingCount(s)
  const devs: [Device, string, string][] = [['web', 'Web', 'ويب'], ['tablet', 'Tablet', 'تابلت'], ['phone', 'Phone', 'جوال']]

  return (
    <div className="dv" ref={rootRef} dir={lang === 'ar' ? 'rtl' : 'ltr'} lang={lang}>
      <div className="dv-controls">
        <div className="dv-seg" role="tablist" aria-label={x('Device', 'الجهاز')} style={{ '--i': devs.findIndex((v) => v[0] === device) } as React.CSSProperties}>
          <span className="dv-seg-ind" aria-hidden="true" />
          {devs.map(([v, en, ar]) => <button key={v} type="button" role="tab" aria-selected={device === v} className={device === v ? 'on' : ''} onClick={() => switchDevice(v)}>{x(en, ar)}</button>)}
        </div>
        <div className="dv-seg dv-lang" role="group" aria-label="Language" style={{ '--i': L } as React.CSSProperties}>
          <span className="dv-seg-ind" aria-hidden="true" />
          <button type="button" aria-pressed={lang === 'en'} className={lang === 'en' ? 'on' : ''} lang="en" onClick={() => pickLang('en')}>English</button>
          <button type="button" aria-pressed={lang === 'ar'} className={lang === 'ar' ? 'on' : ''} lang="ar" onClick={() => pickLang('ar')}>عربي</button>
        </div>
        <p className="dv-status" aria-live="polite">{touring
          ? <><span className="dv-rec" aria-hidden="true" /><span>{caption || x('Playing a tour', 'جولة تلقائية')}<span className="dv-status-hint">{x('. Move in to take over.', '. حرّك المؤشر لتتولى القيادة.')}</span></span></>
          : x('Your turn. Click anything, it all works.', 'دورك الآن. اضغط أي شيء، كله يعمل.')}</p>
      </div>

      <div className="dv-layout" data-device={device}>
        <ol className="dv-story" aria-label={x('Demo chapters', 'أقسام العرض')}>
          {TABS.map((t, i) => (
            <li key={t.id}>
              <button type="button" className={tab === t.id ? 'on' : ''} onClick={() => pickTab(t.id)} aria-current={tab === t.id}>
                <span className="dv-story-n tnum">{String(i + 1).padStart(2, '0')}</span>
                <span className="dv-story-t">{t.label[L]}</span>
                <span className="dv-story-l">{t.line[L]}</span>
              </button>
            </li>
          ))}
        </ol>

        <div className="dv-stagewrap">
          <div className="dv-frame" ref={frameRef} data-device={device}>
            <div className="dv-screen" ref={screenRef} style={{ aspectRatio: `${d.w} / ${d.h}` }}
              onPointerEnter={onEnter} onPointerLeave={onLeave} onClickCapture={onUserClick} onTouchStart={() => stopTour(true)}>
              <div className="dv-stage" ref={stageRef} style={{ width: d.w, height: d.h }}>
                <div className={`ra-app ra-${device}`} dir={lang === 'ar' ? 'rtl' : 'ltr'} lang={lang}>
                  {device !== 'phone' && (
                    <aside className="ra-side">
                      <p className="ra-logo">RAL <span>HR</span></p>
                      <nav style={{ '--i': SIDE.indexOf(tab) } as React.CSSProperties}>
                        <span className="ra-nav-ind" aria-hidden="true" />
                        {SIDE.map((id) => (
                          <button key={id} type="button" data-g={`nav-${id}`} className={tab === id ? 'on' : ''} onClick={() => go(id)} title={NAV[id][L]}>
                            <Icon id={id} /><span>{NAV[id][L]}</span>{id === 'leave' && waiting > 0 && <em className="tnum">{waiting}</em>}
                          </button>
                        ))}
                      </nav>
                      <p className="ra-side-co">{lang === 'ar' ? 'بحرين هورايزن للمرافق' : 'Bahrain Horizon Facilities'}<small className="tnum">{x('98 people, 4 sites', '98 موظفًا، 4 مواقع')}</small></p>
                    </aside>
                  )}
                  {device === 'phone' && (
                    <div className="ra-statusbar" aria-hidden="true"><span className="tnum">9:41</span><span className="ra-sb-i"><span className="ra-sig"><i /><i /><i /><i /></span><span className="ra-batt"><i /></span></span></div>
                  )}
                  <div className="ra-main">
                    <header className="ra-top">
                      <span className="ra-top-title">{NAV[tab][L]}</span>
                      <span className="ra-top-right">
                        {device !== 'phone' && <span className="ra-top-co">{x('October 2026', 'أكتوبر 2026')}</span>}
                        <span className="ra-avatar" title={nm('Aisha Al Arrayed', lang)}>AA</span>
                      </span>
                    </header>
                    <div className="ra-body ra-scroll" key={tab}>
                      <Screen s={s} act={act} device={device} lang={lang} />
                    </div>
                    {device === 'phone' && (
                      <nav className="ra-tabbar" style={{ '--i': Math.max(0, PHONE_TABS.indexOf(tab)), '--o': PHONE_TABS.includes(tab) ? 1 : 0 } as React.CSSProperties}>
                        <span className="ra-tab-ind" aria-hidden="true" />
                        {PHONE_TABS.map((id) => (
                          <button key={id} type="button" data-g={`nav-${id}`} className={tab === id ? 'on' : ''} onClick={() => go(id)}>
                            <Icon id={id} /><span>{NAV[id][L]}</span>{id === 'leave' && waiting > 0 && <em className="tnum">{waiting}</em>}
                          </button>
                        ))}
                      </nav>
                    )}
                  </div>
                  <div className="ra-toasts" role="status" aria-live="polite">
                    {toasts.map((t) => <div key={t.id} className="ra-toast"><span className="ra-toast-ok" aria-hidden="true">✓</span>{t.msg}</div>)}
                  </div>
                </div>
              </div>
              <div className="dv-cursor" ref={cursorRef} aria-hidden="true" />
            </div>
          </div>
          {device === 'web' && <div className="dv-laptop-base" aria-hidden="true" />}
        </div>
      </div>
    </div>
  )
}

const ICONS: Record<TabId, string> = {
  home: 'M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z',
  people: 'M8 8a4 4 0 1 0 8 0a4 4 0 1 0-8 0M4 21c1-5 4.5-7 8-7s7 2 8 7',
  payroll: 'M3 7h15a3 3 0 0 1 3 3v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2zM3 7l12-3v3M16 14h2',
  leave: 'M4 6h16v14H4zM4 10h16M8 3v4M16 3v4',
  eos: 'M12 3v18M7 7h7a3 3 0 0 1 0 6H9a3 3 0 0 0 0 6h8',
  ask: 'M4 5h16v11H9l-5 4z',
}
function Icon({ id }: { id: TabId }) {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d={ICONS[id]} /></svg>
}
