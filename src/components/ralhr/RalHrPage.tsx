import { Fragment, lazy, startTransition, Suspense, useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { calm, money, useIsoLayoutEffect } from './charts'
import { EMPLOYER_LADDER, FAQ, PAYROLL, PRICING, SIO_RATES } from './data'
import './RalHrPage.css'

const Demo = lazy(() => import('./Demo'))
const INQUIRE = '/ral-hr/inquire/'
// Idle scheduling: below-the-fold work waits for gaps between frames instead of one long startup task.
const idle = (f: () => void): number => (typeof requestIdleCallback === 'function' ? requestIdleCallback(f, { timeout: 900 }) : window.setTimeout(f, 60))
const unidle = (id: number) => { if (typeof cancelIdleCallback === 'function') cancelIdleCallback(id); else clearTimeout(id) }

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
    <div className="rh-vt">
      <div className="rh-phone">
      <video ref={ref} poster="/assets/ral-hr/ralhr-tour-poster.webp" muted playsInline loop preload="none"
        onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} onClick={toggle} aria-label="RAL HR video tour" />
      <div className="rh-video-ctl">
        <button type="button" onClick={toggle}>{playing ? 'Pause' : 'Play'}</button>
        <button type="button" onClick={unmute}>{muted ? 'Sound on' : 'Sound off'}</button>
      </div>
      </div>
      <ul className="rh-pings" aria-label="What staff see in the app">
        <li><i>{'✓'}</i><b>Checked in, 07:58</b><span>Inside the site radius, 42 m</span></li>
        <li><i>{'✓'}</i><b>Leave approved, 3 days</b><span>Aisha in HR, one tap</span></li>
        <li><i>{'✓'}</i><b>Payslip ready</b><span lang="ar" dir="rtl">قسيمة راتب أكتوبر جاهزة</span></li>
      </ul>
    </div>
  )
}

// Accordion with a real height tween (details/summary cannot animate closed).
function Faq() {
  const [open, setOpen] = useState(0)
  const panels = useRef<(HTMLDivElement | null)[]>([])
  const toggle = (i: number) => {
    const next = open === i ? -1 : i
    const move = (el: HTMLDivElement | null | undefined, show: boolean) => {
      if (!el) return
      if (calm()) gsap.set(el, { height: show ? 'auto' : 0 })
      else gsap.to(el, { height: show ? 'auto' : 0, duration: 0.55, ease: 'expo.out', overwrite: true })
    }
    if (open >= 0) move(panels.current[open], false)
    if (next >= 0) move(panels.current[next], true)
    setOpen(next)
  }
  return (
    <div className="rh-faq">
      {FAQ.map((f, i) => (
        <div key={f.q} className={`rh-faq-item rh-in${open === i ? ' open' : ''}`}>
          <h3>
            <button type="button" id={`faqb-${i}`} aria-expanded={open === i} aria-controls={`faqp-${i}`} onClick={() => toggle(i)}>
              <span className="rh-faq-n tnum">{String(i + 1).padStart(2, '0')}</span>
              <span className="rh-faq-q">{f.q}</span>
              <span className="rh-faq-x" aria-hidden="true" />
            </button>
          </h3>
          <div className="rh-faq-a" id={`faqp-${i}`} role="region" aria-labelledby={`faqb-${i}`} ref={(el) => { panels.current[i] = el }} style={{ height: i === 0 ? 'auto' : 0 }}>
            <p>{f.a}</p>
          </div>
        </div>
      ))}
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
        <span className="rh-run-stamp" aria-hidden="true">Approved</span>
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
      <a className="rh-run-toast" href="#demo"><i>{'✓'}</i><span>{PAYROLL.month.split(' ')[0]} payroll approved. {PAYROLL.people} people, BHD {money(PAYROLL.net)}.<small className="rh-run-go">Open this run in the live demo <span aria-hidden="true">{'↓'}</span></small></span></a>
    </div>
  )
}

/* Tweened money figure for the pricing console. */
function Tween({ v }: { v: number }) {
  const [shown, setShown] = useState(v)
  const cur = useRef(v)
  useEffect(() => {
    if (calm()) { cur.current = v; setShown(v); return }
    const o = { x: cur.current }
    const t = gsap.to(o, { x: v, duration: 0.6, ease: 'expo.out', onUpdate: () => { cur.current = o.x; setShown(o.x) } })
    return () => { t.kill() }
  }, [v])
  return <>{money(shown)}</>
}

const TICKS = [5, 100, 200, 300]

function Clock() {
  const [t, setT] = useState('')
  useEffect(() => {
    const f = new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Bahrain' })
    const tick = () => setT(f.format(new Date()))
    tick()
    const id = window.setInterval(tick, 30000)
    return () => clearInterval(id)
  }, [])
  return <b>{t || '--:--'}</b>
}

function Cta({ children = 'Book a demo' }: { children?: string }) {
  return <a className="rh-cta" href={INQUIRE}>{children}<span className="rh-cta-i" aria-hidden="true">↗</span></a>
}

export default function RalHrPage() {
  const root = useRef<HTMLDivElement>(null)
  const [ar, setAr] = useState(false)
  const [team, setTeam] = useState(40)
  const [plan, setPlan] = useState(1)
  const bento = useRef<HTMLDivElement>(null)

  // Hero renders first; the rest mounts in two idle, time-sliced steps (SSR renders everything).
  const [stage, setStage] = useState(typeof window === 'undefined' ? 2 : 0)

  useIsoLayoutEffect(() => {
    const el = root.current
    if (!el || calm()) return
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'expo.out' } })
      tl.from('.rh-hero .rh-w > span', { yPercent: 112, duration: 1.1, stagger: 0.05 })
        .from('.rh-hero-copy .rh-in', { y: 24, opacity: 0, duration: 1, stagger: 0.1 }, 0.35)
        .from('.rh-run-card', { y: 48, opacity: 0, duration: 1.3 }, 0.2)
      const num = el.querySelector<HTMLElement>('.rh-run-num')
      if (num) { const o = { v: 0 }; num.textContent = '0'; tl.to(o, { v: PAYROLL.net, duration: 2, onUpdate: () => { num.textContent = money(o.v) } }, 0.55) }
      tl.from('.rh-run-bar i', { scaleX: 0, transformOrigin: '0 50%', duration: 1.1, stagger: 0.18 }, 0.7)
      const steps = gsap.utils.toArray<HTMLElement>('.rh-run-steps li')
      steps.forEach((li) => li.classList.remove('on'))
      steps.forEach((li, i) => tl.call(() => li.classList.add('on'), [], 1.05 + i * 0.4))
      // The extra beat: an approval stamp lands on the card, then the toast points into the demo.
      const at = 1.0 + steps.length * 0.4
      tl.from('.rh-run-stamp', { scale: 2.4, opacity: 0, duration: 0.4, ease: 'power4.in' }, at)
        .to('.rh-run-card', { y: 4, duration: 0.07, yoyo: true, repeat: 1, ease: 'power1.inOut' }, at + 0.4)
        .from('.rh-run-toast', { y: 28, opacity: 0, scale: 0.96, duration: 0.9, ease: 'back.out(1.7)' }, at + 0.55)
        .from('.rh-run-go', { opacity: 0, x: -8, duration: 0.7 }, at + 1.25)
    }, el)
    return () => ctx.revert()
  }, [])

  useEffect(() => {
    if (stage >= 2) return
    const id = idle(() => startTransition(() => setStage((n) => n + 1)))
    return () => unidle(id)
  }, [stage])

  // Below-the-fold motion: set up after everything is mounted, one idle slot per section.
  useEffect(() => {
    if (stage < 2) return
    const el = root.current
    if (!el) return
    const hash = location.hash.slice(1)
    if (hash) document.getElementById(hash)?.scrollIntoView()
    if (calm()) return
    const ctx = gsap.context(() => {}, el)
    const jobs: (() => void)[] = gsap.utils.toArray<HTMLElement>('.rh-reveal', el).map((s) => () => {
      gsap.from(s.querySelectorAll('.rh-in'), { y: 32, opacity: 0, duration: 1, ease: 'expo.out', stagger: 0.12,
        scrollTrigger: { trigger: s, start: 'top 80%', once: true } })
    })
    jobs.push(() => {
      // Bento signature: the Bahrain rules check themselves as the grid arrives.
      const cols = gsap.utils.toArray<HTMLElement>('.rh-cols span')
      const days = gsap.utils.toArray<HTMLElement>('.rh-days span')
      cols.concat(days).forEach((c) => c.classList.remove('ok'))
      const bt = gsap.timeline({ defaults: { ease: 'expo.out' }, scrollTrigger: { trigger: '.rh-bento', start: 'top 72%', once: true } })
      cols.forEach((c, i) => bt.call(() => c.classList.add('ok'), [], 0.35 + i * 0.07))
      const wn = el.querySelector<HTMLElement>('.rh-wps-n')
      if (wn) { const o = { v: 0 }; wn.textContent = '0'; bt.to(o, { v: cols.length, duration: 0.07 * cols.length, ease: 'none', onUpdate: () => { wn.textContent = String(Math.round(o.v)) } }, 0.35) }
      bt.from('.rh-ladder i', { scaleY: 0, transformOrigin: '50% 100%', duration: 1.1, stagger: 0.1 }, 0.3)
        .from('.rh-ladder b', { opacity: 0, y: 6, duration: 0.6, stagger: 0.1 }, 0.5)
        .from('.rh-slip em', { opacity: 0, x: -10, duration: 0.8, stagger: 0.15 }, 0.6)
      days.forEach((d, i) => bt.call(() => d.classList.add('ok'), [], 0.7 + i * 0.35))
    }, () => {
      // Video: the three things staff see pop out of the phone, one after another.
      gsap.from('.rh-pings li', { opacity: 0, scale: 0.8, y: 16, duration: 0.8, stagger: 0.4, ease: 'back.out(1.6)', delay: 0.3,
        scrollTrigger: { trigger: '.rh-phone', start: 'top 72%', once: true } })
    }, () => {
      // Closing: the headline rises like the hero, then the three steps connect and light in order.
      const ol = el.querySelector('.rh-next')
      ol?.classList.add('pre')
      gsap.timeline({ scrollTrigger: { trigger: '.rh-close', start: 'top 70%', once: true } })
        .from('.rh-close h2 .rh-w > span', { yPercent: 112, duration: 1.1, stagger: 0.07, ease: 'expo.out' })
        .call(() => ol?.classList.add('go'), [], 0.55)
    }, () => {
      // Footer: the RAL HR wordmark fills from the floor up.
      const m = el.querySelector('.rh-foot-mark')
      if (!m) return
      m.classList.add('pre')
      gsap.timeline({ scrollTrigger: { trigger: m, start: 'top 96%', once: true } }).call(() => m.classList.add('go'))
    })
    let id = 0, i = 0
    const next = () => { id = idle(() => { ctx.add(jobs[i++]); if (i < jobs.length) next() }) }
    next()
    return () => { unidle(id); ctx.revert() }
  }, [stage])

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
  }, [stage])

  return (
    <div className="rh" ref={root} data-ssr={typeof window === 'undefined' ? '' : undefined}>
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

        {stage >= 1 ? (<>
        <section id="demo" className="rh-section rh-demo rh-reveal">
          <div className="rh-head rh-in">
            <p className="rh-eyebrow">Live demo</p>
            <h2>Click around. It is the real flow.</h2>
            <p>A sample Bahraini company with 98 staff. Run payroll, clear approvals, ask RAL a question. Switch between web, tablet and phone.</p>
          </div>
          <div className="rh-in"><DemoSlot /></div>
        </section>

        <section className="rh-section rh-reveal">
          <div className="rh-head rh-head-split rh-in">
            <p className="rh-eyebrow">Bahrain rules, built in</p>
            <h2>The parts other HR tools leave to Excel.</h2>
            <p>WPS, SIO, expiry dates and Arabic payslips are the core of RAL HR, not add-ons. Each one is checked before anything reaches your bank or your staff.</p>
          </div>
          <div className="rh-bento" ref={bento}>
            <article className="rh-tile rh-t-wps rh-in">
              <h3>WPS file, in the exact LMRA format</h3>
              <p>All 10 columns, every row checked before you download. You upload it to your bank as usual.</p>
              <div className="rh-cols" aria-hidden="true">
                {['CPR', 'Name', 'IBAN', 'Bank', 'Basic', 'Allow.', 'Deduct.', 'Total', 'Month', 'Ref'].map((c) => <span key={c} className="ok">{c}</span>)}
              </div>
              <p className="rh-wps-status"><i aria-hidden="true" /><span><b className="rh-wps-n">10</b> of 10 columns valid, {PAYROLL.people} rows checked</span></p>
            </article>
            <article className="rh-tile rh-t-sio rh-in">
              <h3>SIO, worked out every month</h3>
              <ul className="rh-rates">{SIO_RATES.map((r) => <li key={r.who}><span>{r.who}</span><b>{r.rate}</b></li>)}</ul>
              <p className="rh-small">Bahraini employer share, rising each year</p>
              <div className="rh-ladder" aria-label="Employer SIO 16% in 2024 rising to 20% in 2028">
                {EMPLOYER_LADDER.map((l) => (
                  <div key={l.y}><b>{l.r}%</b><i style={{ height: ((l.r - 12) * 10) + 'px' }} /><span>{l.y}</span></div>
                ))}
              </div>
            </article>
            <article className="rh-tile rh-t-exp rh-in">
              <h3>Expiry alerts at 90, 30 and 7 days</h3>
              <p>CPRs, visas, passports and work permits. Nobody finds out at the airport.</p>
              <div className="rh-days"><span className="ok">90<small>days</small></span><span className="ok">30<small>days</small></span><span className="ok hot">7<small>days</small></span></div>
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
            <dl className="rh-vstats">
              <div><dt>2</dt><dd>apps, iOS and Android</dd></div>
              <div><dt>1 tap</dt><dd>to approve a leave request</dd></div>
              <div><dt lang="ar">عربي</dt><dd>payslips in Arabic and English</dd></div>
            </dl>
            <Cta>Get a walkthrough</Cta>
          </div>
          <div className="rh-in"><VideoTour /></div>
        </section>

        </>) : <div className="rh-later" aria-hidden="true" />}
        {stage >= 2 && (<>
        <section id="pricing" className="rh-section rh-pricing rh-reveal">
          <div className="rh-head rh-in">
            <p className="rh-eyebrow">Pricing</p>
            <h2>Per employee, per month. That is it.</h2>
            <p>Set your headcount and every plan updates live, so you see the real monthly number before we talk.</p>
          </div>
          <div className="rh-est rh-in">
            <div className="rh-est-team">
              <label htmlFor="rh-team">Your team</label>
              <output htmlFor="rh-team" className="rh-est-n"><b>{team}</b>people</output>
              <input id="rh-team" type="range" min={5} max={300} step={5} value={team} aria-valuetext={team + ' people'}
                style={{ backgroundSize: 'calc(15px + (100% - 30px) * ' + ((team - 5) / 295) + ') 100%, auto' }}
                onChange={(e) => setTeam(+e.target.value)} />
              <div className="rh-ticks" aria-hidden="true">{TICKS.map((n) => <span key={n} style={{ left: ((n - 5) / 295 * 100) + '%' }}>{n}</span>)}</div>
              <div className="rh-presets" role="group" aria-label="Quick team sizes">
                {[10, 25, 50, 100, 250].map((n) => <button type="button" key={n} className={team === n ? 'on' : ''} aria-pressed={team === n} onClick={() => setTeam(n)}>{n}</button>)}
              </div>
            </div>
            <div className="rh-est-cost">
              <p className="rh-est-k">Monthly cost by plan</p>
              <ul className="rh-cmp">
                {PRICING.map((p, i) => (
                  <li key={p.name}>
                    <button type="button" className={plan === i ? 'on' : ''} aria-pressed={plan === i} onClick={() => setPlan(i)}>
                      <span className="rh-cmp-name">{p.name}<em>BD {p.price} / person</em></span>
                      <span className="rh-cmp-bar" aria-hidden="true"><i style={{ width: (team * p.price / 9) + '%' }} /></span>
                      <b>BD <Tween v={team * p.price} /></b>
                    </button>
                  </li>
                ))}
              </ul>
              <div className="rh-est-total" aria-live="polite">
                <div>
                  <span className="rh-est-k">{PRICING[plan].name}, {team} people</span>
                  <p className="rh-est-big"><small>BD</small><Tween v={team * PRICING[plan].price} /><span>a month</span></p>
                </div>
                <p className="rh-est-yr"><b>BD <Tween v={team * PRICING[plan].price * 12} /></b> a year<br />plus a one-time setup fee</p>
              </div>
            </div>
          </div>
          <div className="rh-prices">
            {PRICING.map((p, i) => (
              <article key={p.name} className={'rh-price rh-in' + (i === 1 ? ' pop' : '') + (plan === i ? ' sel' : '')}>
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


        <section id="faq" className="rh-section rh-faqsec rh-reveal">
          <div className="rh-head rh-in">
            <p className="rh-eyebrow">FAQ</p>
            <h2>Straight <em>answers.</em></h2>
            <p>Anything not covered here, ask us directly. We answer on WhatsApp.</p>
            <Cta>Ask a question</Cta>
          </div>
          <Faq />
        </section>

        <section className="rh-section rh-close rh-reveal">
          <p className="rh-eyebrow rh-in">Your turn</p>
          <h2>{['See', 'it', 'with'].map((w) => <Fragment key={w}><Word w={w} />{' '}</Fragment>)}<em><Word w="your" />{' '}<Word w="own" /></em>{' '}<Word w="payroll." /></h2>
          <ol className="rh-next">
            <li><b>1</b>Four quick questions, about a minute</li>
            <li><b>2</b>We talk on WhatsApp</li>
            <li><b>3</b>A demo built around your team</li>
          </ol>
          <div className="rh-in"><Cta /></div>
        </section>
        </>)}
      </main>
      {stage >= 2 && (
      <footer className="rh-foot">
        <div className="rh-foot-grid">
          <div className="rh-foot-brand">
            <b>RAL <em>HR</em></b>
            <p>HR and payroll built around Bahrain's rules, by RAL Technologies in Manama.</p>
            <Cta />
          </div>
          <nav aria-label="RAL HR">
            <p className="rh-foot-k">Product</p>
            <a href="#demo">Live demo</a>
            <a href="#pricing">Pricing</a>
            <a href="#faq">FAQ</a>
            <a href={INQUIRE}>Book a demo</a>
          </nav>
          <nav aria-label="Contact">
            <p className="rh-foot-k">Contact</p>
            <a href="https://wa.me/97366386602" target="_blank" rel="noopener noreferrer">WhatsApp</a>
            <a href="mailto:info@raltech.dev">info@raltech.dev</a>
            <a href="/">raltech.dev</a>
          </nav>
          <div className="rh-foot-clock">
            <p className="rh-foot-k">In Manama now</p>
            <Clock />
            <span>GMT+3, Sunday to Thursday</span>
          </div>
        </div>
        <p className="rh-foot-mark" aria-hidden="true">RAL <em>HR</em></p>
        <div className="rh-foot-base"><span>© 2026 RAL Technologies, Manama</span><span>Built in Bahrain, for Bahrain</span></div>
      </footer>
      )}
    </div>
  )
}
