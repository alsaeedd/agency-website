import { lazy, startTransition, Suspense, useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { calm, money, useIsoLayoutEffect } from './charts'
import { FAQ, PRICING } from './data'
import Payday from './Payday'
import { Month, Rules } from './Month'
import './RalHrPage.css'

const Demo = lazy(() => import('./Demo'))
const INQUIRE = '/ral-hr/inquire/'
const WA = 'https://wa.me/97366386602?text='
const idle = (f: () => void): number => (typeof requestIdleCallback === 'function' ? requestIdleCallback(f, { timeout: 900 }) : window.setTimeout(f, 60))
const unidle = (id: number) => { if (typeof cancelIdleCallback === 'function') cancelIdleCallback(id); else clearTimeout(id) }
const words = (t: string) => t.split(' ').flatMap((w, i) => [i ? ' ' : '', <span key={i} className="hp-w"><span>{w}</span></span>])

const INDEX: [string, string][] = [['payday', 'Payday'], ['month', 'A month'], ['demo', 'Full demo'], ['rules', 'The rules'], ['app', 'The app'], ['pricing', 'Pricing'], ['questions', 'Questions'], ['talk', 'Book a demo']]

// Subtle in-page index (desktop only), never a second header.
function SectionIndex({ ready }: { ready: boolean }) {
  const [on, setOn] = useState('payday')
  useEffect(() => {
    if (!('IntersectionObserver' in window)) return
    const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) setOn(e.target.id) }), { rootMargin: '-45% 0px -50% 0px' })
    INDEX.forEach(([id]) => { const el = document.getElementById(id); if (el) io.observe(el) })
    return () => io.disconnect()
  }, [ready])
  return (
    <nav className="hp-index" aria-label="On this page">
      {INDEX.map(([id, l]) => <a key={id} href={'#' + id} className={on === id ? 'on' : ''} aria-current={on === id ? 'true' : undefined}><i />{l}</a>)}
    </nav>
  )
}

function DemoSlot() {
  const ref = useRef<HTMLDivElement>(null)
  const [show, setShow] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el || !('IntersectionObserver' in window)) { setShow(true); return }
    const io = new IntersectionObserver((e) => { if (e[0].isIntersecting) { startTransition(() => setShow(true)); io.disconnect() } }, { rootMargin: '600px 0px' })
    io.observe(el)
    return () => io.disconnect()
  }, [])
  // Keep the floating contact button off the demo's phone frame while the demo is on screen.
  useEffect(() => {
    const el = ref.current
    if (!el || !('IntersectionObserver' in window)) return
    const root = document.documentElement
    const io = new IntersectionObserver(([e]) => root.classList.toggle('hp-demo-in', e.isIntersecting), { threshold: 0.12 })
    io.observe(el)
    return () => { io.disconnect(); root.classList.remove('hp-demo-in') }
  }, [])
  const fallback = <div className="hp-demo-fallback">Loading the full demo</div>
  return <div ref={ref}>{show ? <Suspense fallback={fallback}><Demo /></Suspense> : fallback}</div>
}

function VideoTour() {
  const ref = useRef<HTMLVideoElement>(null)
  const [playing, setPlaying] = useState(false)
  const [muted, setMuted] = useState(true)
  const src = '/assets/ral-hr/ralhr-tour.mp4'
  useEffect(() => {
    const v = ref.current
    if (!v || !('IntersectionObserver' in window)) return
    const nav = navigator as Navigator & { connection?: { saveData?: boolean } }
    const auto = !calm() && !nav.connection?.saveData
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { if (!v.src) v.src = src; if (auto) v.play().catch(() => {}) } else v.pause()
    }, { threshold: 0.5 })
    io.observe(v)
    return () => io.disconnect()
  }, [])
  const toggle = () => { const v = ref.current; if (!v) return; if (!v.src) v.src = src; if (v.paused) v.play().catch(() => {}); else v.pause() }
  const sound = () => { const v = ref.current; if (v) { v.muted = !v.muted; setMuted(v.muted); if (v.paused) v.play().catch(() => {}) } }
  return (
    <div className="hp-vt hp-in">
      <div className="hp-phone">
        <div className="hp-vframe">
          <video ref={ref} poster="/assets/ral-hr/ralhr-tour-poster.webp" width={720} height={1280} muted playsInline loop preload="none"
            onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} onClick={toggle} aria-label="RAL HR app video tour" />
        </div>
        <div className="hp-video-ctl">
          <button type="button" onClick={toggle}>{playing ? 'Pause' : 'Play'}</button>
          <button type="button" onClick={sound}>{muted ? 'Sound on' : 'Sound off'}</button>
        </div>
      </div>
      <ul className="hp-pings" aria-label="What staff see in the app">
        <li><i aria-hidden="true">✓</i><b>Checked in, 07:58</b><span>Inside the site radius, 42 m</span></li>
        <li><i aria-hidden="true">✓</i><b>Leave approved, 3 days</b><span>Aisha in HR, one tap</span></li>
        <li><i aria-hidden="true">✓</i><b>Payslip ready</b><span lang="ar" dir="rtl">قسيمة راتب أكتوبر جاهزة</span></li>
      </ul>
    </div>
  )
}

const DIGITS = '0123456789'.split('').map((d) => <span key={d}>{d}</span>)
// Rolling digits: each digit is a strip of 0 to 9 that slides into place.
function Odometer({ value }: { value: number }) {
  const s = Math.round(value).toLocaleString('en-US')
  return (
    <span className="od" aria-label={s} role="img">
      {s.split('').map((ch, i) => (/\d/.test(ch)
        ? <span key={'d' + (s.length - i)} className="od-d" aria-hidden="true"><span className="od-s" style={{ transform: `translateY(${-+ch * 10}%)` }}>{DIGITS}</span></span>
        : <span key={'c' + (s.length - i)} className="od-c" aria-hidden="true">{ch}</span>))}
    </span>
  )
}

function Pricing({ team, setTeam, plan, setPlan }: { team: number; setTeam: (n: number) => void; plan: number; setPlan: (n: number) => void }) {
  const p = PRICING[plan]
  return (
    <section id="pricing" className="hp-sec hp-rv">
      <div className="hp-head">
        <p className="hp-eyebrow hp-in">Pricing</p>
        <h2 className="hp-in">One price per person. <span className="serif">That is it.</span></h2>
        <p className="hp-in">Slide to your headcount and pick a plan. You see your real monthly number before we even talk.</p>
      </div>
      <div className="hp-price hp-in">
        <div className="hp-price-ctl">
          <label htmlFor="hp-team" className="hp-k">Your team</label>
          <p className="hp-price-team"><b className="tnum">{team}</b> people</p>
          <input id="hp-team" type="range" min={5} max={300} step={5} value={team} aria-valuetext={team + ' people'}
            style={{ backgroundSize: ((team - 5) / 295) * 100 + '% 100%' }} onChange={(e) => setTeam(+e.target.value)} />
          <div className="hp-ticks" aria-hidden="true"><span>5</span><span>100</span><span>200</span><span>300</span></div>
          <div className="hp-presets" role="group" aria-label="Quick team sizes">
            {[10, 25, 50, 100, 250].map((n) => <button key={n} type="button" aria-pressed={team === n} onClick={() => setTeam(n)}>{n}</button>)}
          </div>
        </div>
        <div className="hp-price-out" aria-live="polite">
          <p className="hp-eq"><span><b className="tnum">{team}</b> people</span><i aria-hidden="true">×</i><span><b className="tnum">BD {p.price}</b> {p.name}</span><i aria-hidden="true">=</i></p>
          <p className="hp-big"><small>BD</small><Odometer value={team * p.price} /><span>a month</span></p>
          <p className="hp-yr">BD {money(team * p.price * 12)} a year, plus a one-time setup fee.</p>
          <p className="hp-day">That is about <b className="tnum">{Math.round(p.price * 1000 / 30)} fils</b> per person, per day.</p>
        </div>
      </div>
      <div className="hp-plans">
        {PRICING.map((x, i) => (
          <article key={x.name} className={'hp-plan hp-in' + (i === plan ? ' on' : '')} onClick={() => setPlan(i)}>
            <button type="button" className="hp-plan-pick" aria-pressed={i === plan} onClick={(e) => { e.stopPropagation(); setPlan(i) }}>
              <b>{x.name}</b>{i === 1 && <em>Most teams</em>}<span className="hp-plan-tab-price tnum">BD {x.price}</span>
            </button>
            <p className="hp-plan-price"><b className="tnum">BD {x.price}</b> per person, per month</p>
            <p className="hp-plan-blurb">{x.blurb}</p>
            <ul>{x.items.map((it) => <li key={it}>{it}</li>)}</ul>
            <p className="hp-plan-total">Your team: <b className="tnum">BD {money(team * x.price)}</b> a month</p>
          </article>
        ))}
      </div>
      <div className="hp-fine hp-in">
        <p className="hp-fine-lead"><b>Built to your requirements.</b> Every plan is customizable: tell us which modules you need and we set RAL HR up the way your company works.</p>
        <a className="hp-fine-cta" href="/ral-hr/inquire/">Choose your modules <span aria-hidden="true">→</span></a>
        <ul className="hp-fine-perks">
          <li>Ask RAL in every plan</li>
          <li>Managers and admins at no extra cost</li>
          <li>RAL's secure cloud or your own server</li>
        </ul>
      </div>
    </section>
  )
}

function Faq() {
  return (
    <section id="questions" className="hp-sec hp-rv hp-faq">
      <div className="hp-head">
        <p className="hp-eyebrow hp-in">Questions</p>
        <h2 className="hp-in">The things people <span className="serif">ask us first.</span></h2>
      </div>
      <div className="hp-faq-list">
        {FAQ.map((f, i) => (
          <details key={f.q} className="hp-in" open={i === 0} {...{ name: 'hp-faq' }}>
            <summary>{f.q}<i aria-hidden="true" /></summary>
            <p>{f.a}</p>
          </details>
        ))}
      </div>
    </section>
  )
}

const TOPICS = ['The WPS file', 'SIO', 'End of service', 'Arabic for staff', 'Moving from Excel']
const EMAIL = 'info@raltech.dev'
const WA_ICON = 'M12 2a10 10 0 00-8.6 15.1L2 22l5-1.3A10 10 0 1012 2zm5.3 14.1c-.2.6-1.3 1.2-1.8 1.2-.5.1-1 .2-3.3-.7-2.8-1.1-4.5-3.9-4.7-4.1-.1-.2-1.1-1.5-1.1-2.9s.7-2.1 1-2.4c.3-.3.6-.3.8-.3h.6c.2 0 .4 0 .6.5l.9 2.1c.1.2.1.3 0 .5l-.3.5-.4.4c-.1.1-.3.3-.1.6.2.3.8 1.3 1.7 2.1 1.2 1 2.1 1.3 2.4 1.5.3.1.5.1.6-.1l.9-1c.2-.3.4-.2.6-.1l2 1c.3.1.5.2.5.3.1.2.1.7-.1 1.3z'
function Closing({ team, plan }: { team: number; plan: number }) {
  const p = PRICING[plan]
  const [picked, setPicked] = useState<string[]>(['The WPS file', 'Arabic for staff'])
  const [typing, setTyping] = useState(false)
  const [sent, setSent] = useState(false)
  const box = useRef<HTMLDivElement>(null)
  const out = useRef<HTMLSpanElement>(null)
  const list = picked.length ? picked.map((x) => x.toLowerCase().replace('sio', 'SIO').replace('wps', 'WPS').replace('excel', 'Excel').replace('arabic', 'Arabic')).join(', ') : 'getting payroll right'
  const monthly = money(team * p.price)
  const msg = `Hi RAL, I would like to book a RAL HR demo. We are a team of ${team} in Bahrain, looking at the ${p.name} plan (about BD ${monthly} a month). What matters most to us: ${list}.`
  const msgRef = useRef(msg)
  msgRef.current = msg
  const mail = `mailto:${EMAIL}?subject=${encodeURIComponent(`RAL HR demo, team of ${team}`)}&body=${encodeURIComponent(msg)}`
  // The note types itself once, when the composer is on screen. Text is written
  // straight to the DOM node, so typing costs no React renders.
  useEffect(() => {
    const el = box.current
    if (!el || calm() || !('IntersectionObserver' in window)) return
    setTyping(true)
    let tw: gsap.core.Tween | null = null
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return
      io.disconnect()
      const o = { n: 0 }
      tw = gsap.to(o, { n: 1, duration: 2.2, ease: 'power1.inOut', delay: 0.3,
        onUpdate: () => { const m = msgRef.current; if (out.current) out.current.textContent = m.slice(0, Math.round(m.length * o.n)) },
        onComplete: () => setTyping(false) })
    }, { threshold: 0.5 })
    io.observe(el)
    return () => { io.disconnect(); tw?.kill() }
  }, [])
  useEffect(() => {
    if (!sent) return
    const id = window.setTimeout(() => setSent(false), 2600)
    return () => clearTimeout(id)
  }, [sent])
  const toggle = (x: string) => setPicked((q) => (q.includes(x) ? q.filter((y) => y !== x) : [...q, x]))
  return (
    <section id="talk" className="hp-close hp-rv">
      <div className="hp-close-glow" aria-hidden="true" />
      <div className="hp-close-copy">
        <h2 className="hp-in">See your own payday <span className="serif">before you pay a single fils.</span></h2>
        <p className="hp-in">Book a demo on WhatsApp. We load your team and salary structure, run a payday in Arabic and English, and show you the WPS file your bank will see.</p>
        <dl className="hp-close-sum hp-in" aria-label="Your demo request">
          <div><dt>Team</dt><dd className="tnum">{team} people</dd></div>
          <div><dt>Plan</dt><dd>{p.name}</dd></div>
          <div><dt>Estimate</dt><dd className="tnum">BD {monthly} a month</dd></div>
          <a href="#pricing">Change</a>
        </dl>
      </div>
      <div className="hp-wa hp-in" ref={box}>
        <div className="hp-wa-top">
          <span className="hp-wa-av">R</span>
          <span><b>RAL Technologies</b><small>WhatsApp, +973 6638 6602</small></span>
          <span className="live-dot" aria-hidden="true" />
        </div>
        <div className="hp-wa-body">
          <p className="hp-wa-in">Hi! Tell us a little about your team and we will take it from there.</p>
          <p className="hp-wa-out">{typing ? <><span ref={out} /><span className="hp-caret" aria-hidden="true" /></> : msg}</p>
        </div>
        <p className="hp-wa-q">Add what matters most to you</p>
        <div className="hp-wa-topics" role="group" aria-label="What matters most to you">
          {TOPICS.map((x) => <button key={x} type="button" aria-pressed={picked.includes(x)} onClick={() => toggle(x)}>{x}</button>)}
        </div>
      </div>
      <div className="hp-close-act hp-in">
        <a className={'hp-book' + (sent ? ' sent' : '')} href={WA + encodeURIComponent(msg)} target="_blank" rel="noopener noreferrer" onClick={() => setSent(true)}>
          <span className="hp-book-sheen" aria-hidden="true" />
          <span className="hp-book-t"><b>{sent ? 'Opening WhatsApp' : 'Book a demo'}</b><small>On WhatsApp, your message is ready</small></span>
          <span className="hp-book-i" aria-hidden="true">
            {sent
              ? <svg viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="#f8f8f8" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
              : <svg viewBox="0 0 24 24"><path d={WA_ICON} /></svg>}
          </span>
        </a>
        <p className="hp-close-alt">Not on WhatsApp? Email <a href={mail}>{EMAIL}</a> or use the <a href={INQUIRE}>two minute form</a>.</p>
      </div>
    </section>
  )
}

export default function RalHrPage() {
  const root = useRef<HTMLDivElement>(null)
  const [team, setTeam] = useState(40)
  const [plan, setPlan] = useState(1)
  // Hero renders first; the rest mounts in an idle slot (SSR renders everything).
  const [stage, setStage] = useState(typeof window === 'undefined' ? 1 : 0)

  useIsoLayoutEffect(() => {
    const el = root.current
    if (!el || calm()) return
    const ctx = gsap.context(() => {
      gsap.timeline({ defaults: { ease: 'expo.out' } })
        .from('.hp-hero .hp-w > span', { yPercent: 115, duration: 1.2, stagger: 0.05 })
        .from('.hp-hero .hp-fade', { y: 20, opacity: 0, duration: 1, stagger: 0.1 }, 0.3)
    }, el)
    return () => ctx.revert()
  }, [])
  useEffect(() => {
    if (stage >= 1) return
    const id = idle(() => startTransition(() => setStage(1)))
    return () => unidle(id)
  }, [stage])
  useEffect(() => {
    if (stage < 1) return
    const el = root.current
    if (!el) return
    // Direct load with a hash (/ral-hr/#demo): jump once the sections exist, then
    // realign a few times while late layout above the target settles, until the
    // visitor scrolls on their own.
    const hash = location.hash.slice(1)
    const timers: number[] = []
    let user = false
    const mine = () => { user = true }
    const evs = ['wheel', 'touchstart', 'keydown', 'pointerdown'] as const
    if (hash && document.getElementById(hash)) {
      const align = () => { if (!user) document.getElementById(hash)?.scrollIntoView() }
      align()
      evs.forEach((n) => window.addEventListener(n, mine, { passive: true }))
      ;[400, 1000, 2000].forEach((t) => timers.push(window.setTimeout(align, t)))
    }
    const unalign = () => { timers.forEach(clearTimeout); evs.forEach((n) => window.removeEventListener(n, mine)) }
    if (calm()) return unalign
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('.hp-rv').forEach((s) => {
        const items = s.querySelectorAll('.hp-in')
        if (items.length) gsap.from(items, { y: 36, opacity: 0, duration: 1.1, ease: 'expo.out', stagger: 0.12, clearProps: 'transform,translate,opacity', scrollTrigger: { trigger: s, start: 'top 80%', once: true } })
        const n = s.querySelector('.hp-ch-n')
        if (n) gsap.from(n, { yPercent: 35, opacity: 0, duration: 1.5, ease: 'expo.out', scrollTrigger: { trigger: s, start: 'top 78%', once: true } })
      })
      gsap.from('.hp-ladder i', { scaleY: 0, transformOrigin: '50% 100%', duration: 1.2, stagger: 0.1, ease: 'expo.out', scrollTrigger: { trigger: '.hp-ladder', start: 'top 85%', once: true } })
      gsap.from('.hp-cal a', { opacity: 0, duration: 0.9, stagger: 0.12, ease: 'expo.out', scrollTrigger: { trigger: '.hp-cal', start: 'top 85%', once: true } })
      gsap.from('.hp-pings li', { opacity: 0, scale: 0.85, y: 16, duration: 0.8, stagger: 0.15, ease: 'back.out(1.6)', delay: 0.3, scrollTrigger: { trigger: '.hp-phone', start: 'top 72%', once: true } })
    }, el)
    return () => { unalign(); ctx.revert() }
  }, [stage])

  return (
    <div className="rh hp" ref={root}>
      <SectionIndex ready={stage >= 1} />
      <main>
        <section id="payday" className="hp-hero">
          <div className="hp-hero-copy">
            <p className="hp-eyebrow hp-fade"><span className="live-dot" aria-hidden="true" /> RAL HR · HR and payroll, made in Bahrain</p>
            <h1 className="hp-h1"><span className="hp-line">{words('Payday in Bahrain,')}</span><span className="hp-line serif">{words('sorted before lunch.')}</span></h1>
            <p className="hp-sub hp-fade">Payroll, SIO, the WPS file and end of service, done right and checked for you. Your team gets an app in Arabic and English. From BD 1 per person a month.</p>
            <div className="hp-ctas hp-fade">
              <a className="rh-cta" href="#talk">Book a demo<span className="rh-cta-i" aria-hidden="true">↗</span></a>
              <a className="rh-ghost" href="#pricing">See pricing</a>
            </div>
          </div>
          <Payday />
          <ul className="hp-proof hp-fade">
            <li><b className="tnum">10/10</b>WPS columns checked</li>
            <li><b className="tnum">8% · 1% · 3%</b>SIO, worked out</li>
            <li><b lang="ar">عربي</b>and English, every screen</li>
            <li><b>iOS & Android</b>app for your staff</li>
          </ul>
        </section>
        {stage >= 1 && (
          <>
            <Month />
            <section id="demo" className="hp-sec hp-rv hp-demo">
              <div className="hp-head">
                <p className="hp-eyebrow hp-in">The full demo</p>
                <h2 className="hp-in">Now try the whole app. <span className="serif">Nothing to install.</span></h2>
                <p className="hp-in">Dashboard, payroll, leave, attendance, end of service and Ask RAL, with a full demo company inside. Switch between web, tablet and phone.</p>
              </div>
              <div className="hp-in"><DemoSlot /></div>
            </section>
            <Rules />
            <section id="app" className="hp-sec hp-rv hp-app">
              <div className="hp-head">
                <p className="hp-eyebrow hp-in">The app</p>
                <h2 className="hp-in">In every pocket. <span className="serif">iOS & Android.</span></h2>
                <p className="hp-in">Staff check in, ask for leave and open payslips in Arabic or English. Managers approve from the same app. No training day needed.</p>
              </div>
              <VideoTour />
              <ul className="hp-app-notes hp-in" aria-label="App at a glance">
                <li><b>Check-in that counts</b>Only inside your site radius, with the time on record.</li>
                <li><b>Arabic or English</b>Each person picks their language. Payslips follow.</li>
                <li><b>Approvals in one tap</b>Leave and letter requests land with the right manager.</li>
              </ul>
            </section>
            <Pricing team={team} setTeam={setTeam} plan={plan} setPlan={setPlan} />
            <Faq />
            <Closing team={team} plan={plan} />
          </>
        )}
      </main>
    </div>
  )
}
