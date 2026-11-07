import { Fragment, lazy, Suspense, useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { calm, money, useIsoLayoutEffect } from './charts'
import { EMPLOYER_LADDER, FAQ, PAYROLL, PRICING, SIO_RATES } from './data'
import './RalHrPage.css'

const Demo = lazy(() => import('./Demo'))
const INQUIRE = '/ral-hr/inquire/'

function DemoSlot() {
  const ref = useRef<HTMLDivElement>(null)
  const [show, setShow] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el || !('IntersectionObserver' in window)) { setShow(true); return }
    const io = new IntersectionObserver((e) => { if (e[0].isIntersecting) { setShow(true); io.disconnect() } }, { rootMargin: '600px 0px' })
    io.observe(el)
    return () => io.disconnect()
  }, [])
  const fallback = <div className="rh-demo-fallback">Loading the live demo</div>
  return <div ref={ref}>{show ? <Suspense fallback={fallback}><Demo /></Suspense> : fallback}</div>
}

function VideoTour() {
  const ref = useRef<HTMLVideoElement>(null)
  const [playing, setPlaying] = useState(false)
  const [muted, setMuted] = useState(true)
  useEffect(() => {
    const v = ref.current
    if (!v || !('IntersectionObserver' in window)) return
    const nav = navigator as Navigator & { connection?: { saveData?: boolean } }
    const auto = !calm() && !nav.connection?.saveData
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        if (!v.src) v.src = '/assets/ral-hr/ralhr-tour.mp4'
        if (auto) v.play().catch(() => {})
      } else v.pause()
    }, { threshold: 0.5 })
    io.observe(v)
    return () => io.disconnect()
  }, [])
  const toggle = () => {
    const v = ref.current
    if (!v) return
    if (!v.src) v.src = '/assets/ral-hr/ralhr-tour.mp4'
    if (v.paused) v.play().catch(() => {}); else v.pause()
  }
  const unmute = () => { const v = ref.current; if (v) { v.muted = !v.muted; setMuted(v.muted); if (v.paused) v.play().catch(() => {}) } }
  return (
    <div className="rh-phone">
      <video ref={ref} poster="/assets/ral-hr/ralhr-tour-poster.webp" muted playsInline loop preload="none"
        onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} onClick={toggle} aria-label="RAL HR video tour" />
      <div className="rh-video-ctl">
        <button type="button" onClick={toggle}>{playing ? 'Pause' : 'Play'}</button>
        <button type="button" onClick={unmute}>{muted ? 'Sound on' : 'Sound off'}</button>
      </div>
    </div>
  )
}

const HEAD = ['HR', 'and', 'payroll', 'that', 'already', 'knows']
const RUN_STEPS: [string, string][] = [
  ['Gross pay worked out', 'BHD ' + money(PAYROLL.gross)],
  ['SIO and deductions taken', '− BHD ' + money(PAYROLL.deductions)],
  ['WPS file checked', PAYROLL.people + ' of ' + PAYROLL.people + ' rows pass'],
  ['Approved, ready for the bank', 'Aisha, HR'],
]
const NET_PCT = (PAYROLL.net / PAYROLL.gross) * 100

function Word({ w }: { w: string }) {
  return <span className="rh-w"><span>{w}</span></span>
}

/* Hero signature: a payroll run that counts, cascades and approves itself in the first 3 seconds. */
function HeroRun() {
  return (
    <div className="rh-run" role="img" aria-label={'Sample payroll run, ' + PAYROLL.month + ': ' + PAYROLL.people + ' people, BHD ' + money(PAYROLL.net) + ' net, WPS file passes'}>
      <div className="rh-run-card">
        <div className="rh-run-top"><i className="rh-run-dot" />Payroll run <b>{PAYROLL.month}</b><span className="rh-run-co">Sample company, {PAYROLL.people} staff</span></div>
        <p className="rh-run-label">Net pay to the bank</p>
        <p className="rh-run-big"><span className="rh-run-cur">BHD</span><span className="rh-run-num">{money(PAYROLL.net)}</span></p>
        <div className="rh-run-bars">
          <div className="rh-run-bar"><span>Gross</span><em><i style={{ width: '100%' }} /></em><span>{money(PAYROLL.gross)}</span></div>
          <div className="rh-run-bar ded"><span>Deductions</span><em><i style={{ width: (100 - NET_PCT) + '%', marginLeft: NET_PCT + '%' }} /></em><span>{'−'}{money(PAYROLL.deductions)}</span></div>
          <div className="rh-run-bar net"><span>Net</span><em><i style={{ width: NET_PCT + '%' }} /></em><span>{money(PAYROLL.net)}</span></div>
        </div>
        <ul className="rh-run-steps">
          {RUN_STEPS.map(([a, b]) => <li key={a} className="on"><i /><b>{a}</b><span>{b}</span></li>)}
        </ul>
      </div>
      <div className="rh-run-toast"><i>{'✓'}</i>{PAYROLL.month.split(' ')[0]} payroll approved. {PAYROLL.people} people, BHD {money(PAYROLL.net)}.</div>
    </div>
  )
}

function Cta({ children = 'Book a demo' }: { children?: string }) {
  return <a className="rh-cta" href={INQUIRE}>{children}<span className="rh-cta-i" aria-hidden="true">↗</span></a>
}

export default function RalHrPage() {
  const root = useRef<HTMLDivElement>(null)
  const [ar, setAr] = useState(false)
  const [team, setTeam] = useState(40)
  const bento = useRef<HTMLDivElement>(null)

  useIsoLayoutEffect(() => {
    const el = root.current
    if (!el || calm()) return
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'expo.out' } })
      tl.from('.rh-w > span', { yPercent: 112, duration: 1.1, stagger: 0.05 })
        .from('.rh-hero-copy .rh-in', { y: 24, opacity: 0, duration: 1, stagger: 0.1 }, 0.35)
        .from('.rh-run-card', { y: 48, opacity: 0, duration: 1.3 }, 0.2)
      const num = el.querySelector<HTMLElement>('.rh-run-num')
      if (num) { const o = { v: 0 }; num.textContent = '0'; tl.to(o, { v: PAYROLL.net, duration: 2, onUpdate: () => { num.textContent = money(o.v) } }, 0.55) }
      tl.from('.rh-run-bar i', { scaleX: 0, transformOrigin: '0 50%', duration: 1.1, stagger: 0.18 }, 0.7)
      const steps = gsap.utils.toArray<HTMLElement>('.rh-run-steps li')
      steps.forEach((li) => li.classList.remove('on'))
      steps.forEach((li, i) => tl.call(() => li.classList.add('on'), [], 1.05 + i * 0.4))
      tl.from('.rh-run-toast', { y: 28, opacity: 0, scale: 0.96, duration: 0.9, ease: 'back.out(1.7)' }, 1.15 + steps.length * 0.4)
      gsap.utils.toArray<HTMLElement>('.rh-reveal').forEach((s) => {
        gsap.from(s.querySelectorAll('.rh-in'), { y: 32, opacity: 0, duration: 1, ease: 'expo.out', stagger: 0.12,
          scrollTrigger: { trigger: s, start: 'top 80%', once: true } })
      })
    }, el)
    return () => ctx.revert()
  }, [])

  // Lit bento: the pointer brightens each tile's surface and edge (fine pointers only).
  useEffect(() => {
    const b = bento.current
    if (!b || calm() || !window.matchMedia('(pointer: fine)').matches) return
    const tiles = Array.from(b.querySelectorAll<HTMLElement>('.rh-tile'))
    let raf = 0, x = 0, y = 0
    const paint = () => {
      raf = 0
      for (const t of tiles) { const r = t.getBoundingClientRect(); t.style.setProperty('--mx', (x - r.left) + 'px'); t.style.setProperty('--my', (y - r.top) + 'px') }
    }
    const move = (e: PointerEvent) => { x = e.clientX; y = e.clientY; if (!raf) raf = requestAnimationFrame(paint) }
    const leave = () => { b.classList.remove('lit') }
    const enter = () => { b.classList.add('lit') }
    b.addEventListener('pointermove', move); b.addEventListener('pointerleave', leave); b.addEventListener('pointerenter', enter)
    return () => { cancelAnimationFrame(raf); b.removeEventListener('pointermove', move); b.removeEventListener('pointerleave', leave); b.removeEventListener('pointerenter', enter) }
  }, [])

  return (
    <div className="rh" ref={root}>
      <header className="rh-top">
        <a href="/" className="rh-brand">RAL <span>Technologies</span></a>
        <nav>
          <a href="#demo">Demo</a>
          <a href="#pricing">Pricing</a>
          <a href="#faq">FAQ</a>
        </nav>
        <a className="rh-top-cta" href={INQUIRE}>Book a demo</a>
      </header>

      <main>
        <section className="rh-hero">
          <div className="rh-hero-copy">
            <p className="rh-eyebrow rh-in">RAL HR, built in Bahrain</p>
            <h1>{HEAD.map((w) => <Fragment key={w}><Word w={w} />{' '}</Fragment>)}<em><Word w="Bahrain." /></em></h1>
            <p className="rh-sub rh-in">WPS files, SIO and end of service, done right. Ask RAL in Arabic or English. From BD 1 per employee a month.</p>
            <div className="rh-hero-ctas rh-in">
              <Cta />
              <a className="rh-ghost" href="#demo">Try the live demo</a>
            </div>
            <p className="rh-meta rh-in">Web, tablet and the iOS & Android app</p>
          </div>
          <HeroRun />
        </section>

        <section id="demo" className="rh-section rh-demo rh-reveal">
          <div className="rh-head rh-in">
            <p className="rh-eyebrow">Live demo</p>
            <h2>Click around. It is the real flow.</h2>
            <p>A sample Bahraini company with 98 staff. Run payroll, clear approvals, ask RAL a question. Switch between web, tablet and phone.</p>
          </div>
          <div className="rh-in"><DemoSlot /></div>
        </section>

        <section className="rh-section rh-reveal">
          <div className="rh-head rh-in">
            <p className="rh-eyebrow">Bahrain rules, built in</p>
            <h2>The parts other HR tools leave to Excel.</h2>
          </div>
          <div className="rh-bento" ref={bento}>
            <article className="rh-tile rh-t-wps rh-in">
              <h3>WPS file, in the exact LMRA format</h3>
              <p>All 10 columns, every row checked before you download. You upload it to your bank as usual.</p>
              <div className="rh-cols" aria-hidden="true">
                {['CPR', 'Name', 'IBAN', 'Bank', 'Basic', 'Allow.', 'Deduct.', 'Total', 'Month', 'Ref'].map((c) => <span key={c}>{c}</span>)}
              </div>
            </article>
            <article className="rh-tile rh-t-sio rh-in">
              <h3>SIO, worked out every month</h3>
              <ul className="rh-rates">{SIO_RATES.map((r) => <li key={r.who}><span>{r.who}</span><b>{r.rate}</b></li>)}</ul>
              <p className="rh-small">Bahraini employer share, rising each year</p>
              <div className="rh-ladder" aria-label="Employer SIO 16% in 2024 rising to 20% in 2028">
                {EMPLOYER_LADDER.map((l) => (
                  <div key={l.y}><i style={{ height: `${(l.r - 12) * 10}px` }} /><b>{l.r}%</b><span>{l.y}</span></div>
                ))}
              </div>
            </article>
            <article className="rh-tile rh-t-exp rh-in">
              <h3>Expiry alerts at 90, 30 and 7 days</h3>
              <p>CPRs, visas, passports and work permits. Nobody finds out at the airport.</p>
              <div className="rh-days"><span>90</span><span>30</span><span className="hot">7</span></div>
            </article>
            <article className="rh-tile rh-t-lang rh-in">
              <h3>Arabic and English, every screen</h3>
              <button type="button" className="rh-flip" onClick={() => setAr((v) => !v)} dir={ar ? 'rtl' : 'ltr'}>
                {ar ? 'صافي الراتب: ٩٢٢٫٧٦٠ د.ب' : 'Net pay: BHD 922.760'}
              </button>
              <p className="rh-small">Tap to flip. Full right-to-left layout.</p>
            </article>
            <article className="rh-tile rh-t-slip rh-in">
              <h3>Every payslip line shows its rule</h3>
              <div className="rh-slip">
                <span>Housing</span><b>248.000</b><em>40% of basic</em>
              </div>
              <div className="rh-slip">
                <span>SIO, employee</span><b>-80.240</b><em>8%, Bahraini staff</em>
              </div>
            </article>
          </div>
        </section>

        <section className="rh-section rh-video rh-reveal">
          <div className="rh-head rh-in">
            <p className="rh-eyebrow">On your phone</p>
            <h2>Staff check in, ask for leave and get payslips.</h2>
            <p>The iOS & Android app covers the daily things: GPS check-in inside a site radius, leave requests, payslips and approvals. Managers approve from anywhere.</p>
            <Cta>Get a walkthrough</Cta>
          </div>
          <div className="rh-in"><VideoTour /></div>
        </section>

        <section id="pricing" className="rh-section rh-reveal">
          <div className="rh-head rh-in">
            <p className="rh-eyebrow">Pricing</p>
            <h2>Per employee, per month. That is it.</h2>
          </div>
          <div className="rh-est rh-in">
            <label htmlFor="rh-team">Your team</label>
            <input id="rh-team" type="range" min={5} max={300} step={5} value={team} onChange={(e) => setTeam(+e.target.value)} />
            <output htmlFor="rh-team"><b>{team}</b> people</output>
          </div>
          <div className="rh-prices">
            {PRICING.map((p, i) => (
              <article key={p.name} className={`rh-price rh-in${i === 1 ? ' pop' : ''}`}>
                <h3>{p.name}</h3>
                <p className="rh-amt"><b>BD {p.price}</b> / employee / month</p>
                <p className="rh-small">{p.blurb}</p>
                <p className="rh-calc"><b>BD {money(team * p.price)}</b> a month for {team} people</p>
                <ul>{p.items.map((it) => <li key={it}>{it}</li>)}</ul>
                <a className={i === 1 ? 'rh-cta' : 'rh-ghost'} href={INQUIRE}>Talk to us</a>
              </article>
            ))}
          </div>
          <p className="rh-note rh-in">Ask RAL is in every plan. No per-user fee for managers or admins. A one-time setup fee sized to your company. Hosted by RAL, or on your own server.</p>
        </section>

        <section className="rh-section rh-founder rh-reveal">
          <blockquote className="rh-in">
            <p>Payroll in Bahrain has its own rules: the WPS file, SIO, end of service, Arabic payslips. Most HR tools treat them as an afterthought. I built RAL HR so they are the starting point, and so your team can just ask when they need something.</p>
            <footer>Suhaib, RAL Technologies, Manama</footer>
          </blockquote>
        </section>

        <section id="faq" className="rh-section rh-reveal">
          <div className="rh-head rh-in"><p className="rh-eyebrow">FAQ</p><h2>Straight answers.</h2></div>
          <div className="rh-faq">
            {FAQ.map((f) => (
              <details key={f.q} className="rh-in"><summary>{f.q}</summary><p>{f.a}</p></details>
            ))}
          </div>
        </section>

        <section className="rh-section rh-close rh-reveal">
          <p className="rh-eyebrow rh-in">Your turn</p>
          <h2 className="rh-in">See it with <em>your own</em> payroll.</h2>
          <ol className="rh-next rh-in">
            <li><b>1</b>Four quick questions, about a minute</li>
            <li><b>2</b>We talk on WhatsApp</li>
            <li><b>3</b>A demo built around your team</li>
          </ol>
          <div className="rh-in"><Cta /></div>
        </section>
      </main>

      <footer className="rh-foot">
        <span>© 2026 RAL Technologies, Manama</span>
        <a href="/">raltech.dev</a>
        <a href="mailto:info@raltech.dev">info@raltech.dev</a>
      </footer>
    </div>
  )
}
