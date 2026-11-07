import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { calm, useIsoLayoutEffect } from './charts'
import { EMPLOYER_LADDER, FAQ, PRICING, SIO_RATES } from './data'
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

function Cta({ children = 'Book a demo' }: { children?: string }) {
  return <a className="rh-cta" href={INQUIRE}>{children}<span className="rh-cta-i" aria-hidden="true">↗</span></a>
}

export default function RalHrPage() {
  const root = useRef<HTMLDivElement>(null)
  const [ar, setAr] = useState(false)

  useIsoLayoutEffect(() => {
    const el = root.current
    if (!el || calm()) return
    const ctx = gsap.context(() => {
      gsap.from('.rh-hero .rh-in', { y: 28, opacity: 0, duration: 1.1, ease: 'expo.out', stagger: 0.12 })
      gsap.utils.toArray<HTMLElement>('.rh-reveal').forEach((s) => {
        gsap.from(s.querySelectorAll('.rh-in'), { y: 32, opacity: 0, duration: 1, ease: 'expo.out', stagger: 0.12,
          scrollTrigger: { trigger: s, start: 'top 80%', once: true } })
      })
    }, el)
    return () => ctx.revert()
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
          <p className="rh-eyebrow rh-in">RAL HR, built in Bahrain</p>
          <h1 className="rh-in">HR and payroll that already knows <em>Bahrain.</em></h1>
          <p className="rh-sub rh-in">WPS files, SIO and end of service, done right. Ask RAL in Arabic or English. From BD 1 per employee a month.</p>
          <div className="rh-hero-ctas rh-in">
            <Cta />
            <a className="rh-ghost" href="#demo">Try the live demo</a>
          </div>
          <p className="rh-meta rh-in">Web, tablet and the iOS & Android app</p>
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
          <div className="rh-bento">
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
          <div className="rh-prices">
            {PRICING.map((p, i) => (
              <article key={p.name} className={`rh-price rh-in${i === 1 ? ' pop' : ''}`}>
                <h3>{p.name}</h3>
                <p className="rh-amt"><b>BD {p.price}</b> / employee / month</p>
                <p className="rh-small">{p.blurb}</p>
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
          <h2 className="rh-in">See it with your own payroll.</h2>
          <p className="rh-in">Four quick questions, then we talk on WhatsApp.</p>
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
