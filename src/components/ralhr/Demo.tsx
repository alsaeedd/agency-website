import { useCallback, useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { Flip } from 'gsap/Flip'
import { calm, useIsoLayoutEffect } from './charts'
import { HomeScreen, PayrollScreen, LeaveScreen, AttendanceScreen, EosbScreen, AskScreen, type Device, type TabId, type DemoState, type Act } from './screens'
import { PAYROLL, APPROVALS } from './data'
import './Demo.css'

gsap.registerPlugin(Flip)

// Each device renders the same app at a fixed design size, scaled to fit the
// frame with one transform, so the UI looks identical at any page width.
const DESIGN: Record<Device, { w: number; h: number }> = {
  web: { w: 1040, h: 680 },
  tablet: { w: 700, h: 940 },
  phone: { w: 390, h: 800 },
}

const TABS: { id: TabId; label: string; nav: string; line: string }[] = [
  { id: 'home', label: 'Dashboard', nav: 'Home', line: 'Headcount, approvals, expiries and pay at a glance.' },
  { id: 'payroll', label: 'Payroll + WPS', nav: 'Payroll', line: 'Approve the run, then check the LMRA file row by row.' },
  { id: 'leave', label: 'Approvals', nav: 'Leave', line: 'Two-stage chain by name. Approve in one tap.' },
  { id: 'attendance', label: 'Attendance', nav: 'Check-in', line: 'GPS check-in with a site radius, month at a glance.' },
  { id: 'eosb', label: 'End of service', nav: 'Settle', line: 'Old Art. 116 gratuity and the 2024 SIO scheme, both.' },
  { id: 'ask', label: 'Ask RAL', nav: 'Ask', line: 'Arabic, Arabizi or English. It even books the leave.' },
]
const PHONE_TABS: TabId[] = ['home', 'payroll', 'leave', 'attendance', 'ask']

const TOUR: { tab: TabId; steps: string[] }[] = [
  { tab: 'home', steps: [] },
  { tab: 'payroll', steps: ['approve-run', 'confirm-run', 'check-wps'] },
  { tab: 'leave', steps: ['approve-noor', 'approve-priya'] },
  { tab: 'attendance', steps: ['check-in'] },
  { tab: 'eosb', steps: ['preset-2'] },
  { tab: 'ask', steps: ['ask-chip', 'ask-chip', 'ask-chip', 'ask-chip', 'confirm-leave'] },
]

// What the ghost cursor is doing, shown next to the device while the tour plays.
const CAPTION: Record<string, string> = {
  'approve-run': 'Approving the October run',
  'confirm-run': 'Confirming: money moves only on a second tap',
  'check-wps': 'Checking every WPS row against LMRA rules',
  'approve-noor': "Approving Noor's annual leave",
  'approve-priya': "Approving Priya's salary certificate",
  'check-in': 'Checking in on site at Seef HQ',
  'preset-2': 'Settling 11 years of service, both schemes',
  'ask-chip': 'Asking in English, Arabic and Arabizi',
  'confirm-leave': 'Booking the leave straight from the chat',
}
const captionFor = (g: string) => CAPTION[g] ?? (g.startsWith('nav-') ? `Opening ${TABS.find((x) => `nav-${x.id}` === g)?.label ?? ''}` : '')

const INITIAL: DemoState = { payStage: 1, confirmOpen: false, decided: [], checkedIn: false, eosbYears: 6, eosbBasic: 380, chat: 0 }

type Token = { dead: boolean }

export default function Demo() {
  const [device, setDevice] = useState<Device>(() => (typeof window !== 'undefined' && window.innerWidth < 760 ? 'phone' : 'web'))
  const [tab, setTab] = useState<TabId>('home')
  const [s, setS] = useState<DemoState>(INITIAL)
  const [toasts, setToasts] = useState<{ id: number; msg: string }[]>([])
  const [caption, setCaption] = useState('')
  const [touring, setTouring] = useState(false)

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

  const patch = useCallback((p: Partial<DemoState>) => setS((o) => ({ ...o, ...p })), [])
  const toastId = useRef(0)
  const flash = useCallback((msg: string) => {
    const id = ++toastId.current
    setToasts((l) => [...l.slice(-2), { id, msg }])
    window.setTimeout(() => setToasts((l) => l.filter((x) => x.id !== id)), 3800)
  }, [])

  const act: Act = {
    approveRun: () => patch({ confirmOpen: true }),
    confirmRun: () => { patch({ confirmOpen: false, payStage: 2 }); flash(`October payroll approved, ${PAYROLL.people} people, BHD 111,295`) },
    cancelRun: () => patch({ confirmOpen: false }),
    checkWps: () => { patch({ payStage: 3 }); flash('WPS file ready for your bank') },
    decide: (id, ok) => {
      setS((o) => ({ ...o, decided: [...o.decided, id] }))
      const a = APPROVALS.find((x) => x.id === id)
      if (a) flash(ok ? `Approved: ${a.what.toLowerCase()} for ${a.who}` : `Declined. ${a.who.split(' ')[0]} has been told`)
    },
    checkIn: () => { if (!s.checkedIn) flash('Checked in 07:02, on site at Seef HQ'); setS((o) => ({ ...o, checkedIn: !o.checkedIn })) },
    setEosb: (eosbYears, eosbBasic) => patch({ eosbYears, eosbBasic }),
    say: (chat) => { patch({ chat }); if (chat === 5) flash('Leave booked and sent to Khalid Al Zayani') },
    go: (t) => setTab(t),
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
    // The frame stretches and re-rounds its corners, then the new layout
    // focuses in from a soft blur as the morph settles.
    Flip.from(st, { targets: frameRef.current, duration: 0.8, ease: 'expo.inOut', props: 'borderRadius,padding' })
    gsap.to(stageRef.current, { autoAlpha: 1, duration: 0.45, delay: 0.42, ease: 'power3.out' })
    const app = stageRef.current?.querySelector('.ra-app')
    if (app) gsap.fromTo(app, { scale: 1.05, filter: 'blur(6px)' }, { scale: 1, filter: 'blur(0px)', duration: 0.7, delay: 0.38, ease: 'expo.out', clearProps: 'transform,filter' })
    const base = rootRef.current?.querySelector('.dv-laptop-base')
    if (base) gsap.fromTo(base, { scaleX: 0.4, autoAlpha: 0 }, { scaleX: 1, autoAlpha: 1, duration: 0.6, delay: 0.5, ease: 'expo.out' })
  }, [device])

  // Tab change: the new screen's blocks rise in, staggered.
  const firstTab = useRef(true)
  useIsoLayoutEffect(() => {
    if (firstTab.current) { firstTab.current = false; return }
    const kids = stageRef.current?.querySelectorAll('.ra-body > .ra-screen > *')
    if (!kids?.length || calm()) return
    const tw = gsap.fromTo(kids, { y: 16, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.6, ease: 'expo.out', stagger: 0.05, clearProps: 'transform,opacity,visibility' })
    return () => { tw.kill() }
  }, [tab])

  /* ---------- Ghost cursor tour ---------- */
  const wait = (ms: number, t: Token) => new Promise<void>((res, rej) => window.setTimeout(() => (t.dead ? rej(new Error('stop')) : res()), ms))

  const clickTarget = async (g: string, t: Token): Promise<boolean> => {
    const stage = stageRef.current
    const screen = screenRef.current
    const cur = cursorRef.current
    if (!stage || !screen || !cur) return false
    const el = stage.querySelector<HTMLElement>(`[data-g="${g}"]`)
    if (!el) return false
    setCaption(captionFor(g))
    const scroller = el.closest<HTMLElement>('.ra-scroll')
    if (scroller) {
      const er = el.getBoundingClientRect()
      const sr = scroller.getBoundingClientRect()
      if (er.bottom > sr.bottom || er.top < sr.top) scroller.scrollTop += er.top - sr.top - sr.height / 3
    }
    const r = el.getBoundingClientRect()
    const base = screen.getBoundingClientRect()
    gsap.set(cur, { autoAlpha: 1 })
    const tx = r.left - base.left + r.width / 2
    const ty = r.top - base.top + r.height / 2
    const dist = Math.hypot(tx - Number(gsap.getProperty(cur, 'x')), ty - Number(gsap.getProperty(cur, 'y')))
    await gsap.to(cur, { x: tx, y: ty, duration: Math.min(0.95, 0.45 + dist / 900), ease: 'power3.inOut' })
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

  const runTour = async (t: Token) => {
    let i = Math.max(0, TOUR.findIndex((x) => x.tab === tabRef.current))
    for (;;) {
      const step = TOUR[i]
      setS(INITIAL)
      const navOk = await clickTarget(`nav-${step.tab}`, t)
      if (!navOk) setTab(step.tab)
      await wait(1100, t)
      for (const g of step.steps) {
        await clickTarget(g, t)
        await wait(g === 'ask-chip' ? 1500 : 1000, t)
      }
      await wait(2400, t)
      i = (i + 1) % TOUR.length
    }
  }

  const tabRef = useRef(tab)
  tabRef.current = tab

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

  const onEnter = (e: React.PointerEvent) => {
    if (e.pointerType !== 'mouse') return
    hovering.current = true
    stopTour()
  }
  const onLeave = (e: React.PointerEvent) => {
    if (e.pointerType !== 'mouse') return
    hovering.current = false
    if (!userActed.current) resumeTimer.current = window.setTimeout(startTour, 6000)
  }
  const onUserClick = (e: React.MouseEvent) => { if (e.isTrusted) stopTour(true) }

  const pickTab = (t: TabId) => { stopTour(true); setTab(t) }
  const Screen = { home: HomeScreen, payroll: PayrollScreen, leave: LeaveScreen, attendance: AttendanceScreen, eosb: EosbScreen, ask: AskScreen }[tab]
  const d = DESIGN[device]
  const active = TABS.find((x) => x.id === tab)!

  return (
    <div className="dv" ref={rootRef}>
      <div className="dv-controls">
        <div className="dv-seg" role="tablist" aria-label="Device" style={{ '--i': (['web', 'tablet', 'phone'] as Device[]).indexOf(device) } as React.CSSProperties}>
          <span className="dv-seg-ind" aria-hidden="true" />
          {(['web', 'tablet', 'phone'] as Device[]).map((x) => (
            <button key={x} role="tab" aria-selected={device === x} className={device === x ? 'on' : ''} onClick={() => switchDevice(x)}>
              {x === 'web' ? 'Web' : x === 'tablet' ? 'Tablet' : 'Phone'}
            </button>
          ))}
        </div>
        <p className="dv-status" aria-live="polite">{touring ? <><span className="dv-rec" aria-hidden="true" /><span>{caption || 'Playing a tour'}<span className="dv-status-hint">. Move in to take over.</span></span></> : 'Your turn. Click anything.'}</p>
      </div>

      <div className="dv-layout" data-device={device}>
        <ol className="dv-story" aria-label="Demo chapters">
          {TABS.map((x, i) => (
            <li key={x.id}>
              <button className={tab === x.id ? 'on' : ''} onClick={() => pickTab(x.id)} aria-current={tab === x.id}>
                <span className="dv-story-n tnum">{String(i + 1).padStart(2, '0')}</span>
                <span className="dv-story-t">{x.label}</span>
                <span className="dv-story-l">{x.line}</span>
              </button>
            </li>
          ))}
        </ol>

        <div className="dv-stagewrap">
          <div className="dv-frame" ref={frameRef} data-device={device}>
            <div
              className="dv-screen"
              ref={screenRef}
              style={{ aspectRatio: `${d.w} / ${d.h}` }}
              onPointerEnter={onEnter}
              onPointerLeave={onLeave}
              onClickCapture={onUserClick}
              onTouchStart={() => stopTour(true)}
            >
              <div className="dv-stage" ref={stageRef} style={{ width: d.w, height: d.h }}>
                <div className={`ra-app ra-${device}`}>
                  {device !== 'phone' && (
                    <aside className="ra-side">
                      <p className="ra-logo">RAL <span>HR</span></p>
                      <nav style={{ '--i': TABS.findIndex((x) => x.id === tab) } as React.CSSProperties}>
                        <span className="ra-nav-ind" aria-hidden="true" />
                        {TABS.map((x) => (
                          <button key={x.id} data-g={`nav-${x.id}`} className={tab === x.id ? 'on' : ''} onClick={() => setTab(x.id)}>{x.nav === 'Settle' ? 'End of service' : x.nav}</button>
                        ))}
                      </nav>
                      <p className="ra-side-co">Bahrain Horizon Facilities</p>
                    </aside>
                  )}
                  {device === 'phone' && (
                    <div className="ra-statusbar" aria-hidden="true"><span>9:41</span><span className="ra-sb-i"><span className="ra-sig"><i /><i /><i /><i /></span><span className="ra-batt"><i /></span></span></div>
                  )}
                  <div className="ra-main">
                    <header className="ra-top">
                      <span className="ra-top-title">{device === 'phone' ? active.label : active.nav === 'Settle' ? 'End of service' : active.nav}</span>
                      <span className="ra-top-right"><span className="ra-lang">EN | عربي</span><span className="ra-avatar sm">AA</span></span>
                    </header>
                    <div className="ra-body ra-scroll" key={tab}>
                      <Screen s={s} act={act} device={device} />
                    </div>
                    {device === 'phone' && (
                      <nav className="ra-tabbar" style={{ '--i': Math.max(0, PHONE_TABS.indexOf(tab)), '--o': PHONE_TABS.includes(tab) ? 1 : 0 } as React.CSSProperties}>
                        <span className="ra-tab-ind" aria-hidden="true" />
                        {PHONE_TABS.map((id) => {
                          const x = TABS.find((y) => y.id === id)!
                          return <button key={id} data-g={`nav-${id}`} className={tab === id ? 'on' : ''} onClick={() => setTab(id)}><Icon id={id} /><span>{x.nav}</span></button>
                        })}
                      </nav>
                    )}
                  </div>
                  <div className="ra-toasts" role="status" aria-live="polite">
                    {toasts.map((x) => <div key={x.id} className="ra-toast"><span className="ra-toast-ok" aria-hidden="true">✓</span>{x.msg}</div>)}
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

const ICONS: Record<string, string> = {
  home: 'M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z',
  payroll: 'M3 7h15a3 3 0 0 1 3 3v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2zM3 7l12-3v3M16 14h2',
  leave: 'M4 6h16v14H4zM4 10h16M8 3v4M16 3v4',
  attendance: 'M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11zM12 12.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z',
  ask: 'M4 5h16v11H9l-5 4z',
}
function Icon({ id }: { id: TabId }) {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d={ICONS[id]} /></svg>
}
