import { lazy, startTransition, Suspense, useEffect, useRef, useState } from 'react'
import { localePath } from '../../i18n'
import { ralHrLang as lg } from './t'
import { t } from './t'
import { gsap } from 'gsap'
import { calm, money, useIsoLayoutEffect } from './charts'
import { FAQ, PRICING } from './data'
import Payday from './Payday'
import { Month, Rules } from './Month'
import './RalHrPage.css'
import ModulePicker from './ModulePicker'
import { CATEGORIES, fitTier, STR as MSTR, tierName, toQuery, type Tier } from './modules'

// Plan cards list their own tier's modules, top six first; Professional and Premium build on the tier below.
const PLAN_MODS = ([0, 1, 2] as Tier[]).map((tier) => CATEGORIES.flatMap((c) => c.mods).filter((x) => x.tier === tier))
const TOP = 6

function waText(plan: number, team: number, mods: string[]) {
  const x = PRICING[plan]
  const lines = [MSTR.waHi[lg()], '', `${MSTR.waPlan[lg()]}: ${t(x.name)} (${t('BD {0}', x.price)} ${MSTR.waPer[lg()]})`, `${MSTR.waTeam[lg()]}: ${team} ${MSTR.waPeople[lg()]}`, `${MSTR.waPrice[lg()]}: ${t('BD {0}', money(team * x.price))} ${MSTR.waMonth[lg()]}`]
  const rows = CATEGORIES.map((c) => { const on = c.mods.filter((m) => mods.includes(m.id)); return on.length ? `- ${c.name[lg()]}: ${on.map((m) => m.name[lg()]).join(lg() === 'ar' ? '، ' : ', ')}` : '' }).filter(Boolean)
  if (rows.length) lines.push('', `${MSTR.msgHead[lg()]} (${mods.length}):`, ...rows)
  return lines.join('\n')
}

const Demo = lazy(() => import('./Demo'))
const INQUIRE = '/ral-hr/inquire/'
const inquireHref = () => localePath(lg(), INQUIRE)
const WA = 'https://wa.me/97338218181?text='
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
    <nav className="hp-index" aria-label={t("On this page")}>
      {INDEX.map(([id, l]) => <a key={id} href={'#' + id} className={on === id ? 'on' : ''} aria-current={on === id ? 'true' : undefined}><i />{t(l)}</a>)}
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
  const fallback = <div className="hp-demo-fallback">{t("Loading the full demo")}</div>
  return <div ref={ref}>{show ? <Suspense fallback={fallback}><Demo lang={lg()} /></Suspense> : fallback}</div>
}

function VideoTour() {
  const ref = useRef<HTMLVideoElement>(null)
  const [playing, setPlaying] = useState(false)
  const [muted, setMuted] = useState(true)
  const src = '/assets/ral-hr/ralhr-tour.mp4'
  useEffect(() => {
    const v = ref.current
    if (!v || !('IntersectionObserver' in window)) return // no video on Arabic
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
  // The tour video is English only, so Arabic shows a still of the Arabic payroll screen.
  const ar = lg() === 'ar'
  return (
    <div className="hp-vt hp-in">
      <div className="hp-phone">
        <div className="hp-vframe">
          {ar ? <img src="/assets/ral-hr/ralhr-tour-poster-ar.jpg" width={686} height={1220} loading="lazy" decoding="async" alt={t("RAL HR app video tour")} /> : <video ref={ref} poster="/assets/ral-hr/ralhr-tour-poster.webp" width={720} height={1280} muted playsInline loop preload="none"
            onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} onClick={toggle} aria-label={t("RAL HR app video tour")} />}
        </div>
        {!ar && <div className="hp-video-ctl">
          <button type="button" onClick={toggle}>{playing ? t('Pause') : t('Play')}</button>
          <button type="button" onClick={sound}>{muted ? t('Sound on') : t('Sound off')}</button>
        </div>}
      </div>
      <ul className="hp-pings" aria-label={t("What staff see in the app")}>
        <li><i aria-hidden="true">✓</i><b>{t("Checked in, 07:58")}</b><span>{t("Inside the site radius, 42 m")}</span></li>
        <li><i aria-hidden="true">✓</i><b>{t("Leave approved, 3 days")}</b><span>{t("Aisha in HR, one tap")}</span></li>
        <li><i aria-hidden="true">✓</i><b>{t("Payslip ready")}</b>{lg() === 'ar' ? <span>صافي 922.760 د.ب، أُرسل إلى بنكك</span> : <span lang="ar" dir="rtl">قسيمة راتب أكتوبر جاهزة</span>}</li>
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
  const [helping, setHelping] = useState(false)
  const [mods, setMods] = useState<string[]>([])
  const [open, setOpen] = useState<number | null>(null)
  const fit = fitTier(mods)
  const onMods = (ids: string[]) => { setMods(ids); if (ids.length) setPlan(fitTier(ids)) }
  const sentMods = helping ? mods : []
  const [draft, setDraft] = useState<string | null>(null) // typed text while editing, so the box can be cleared
  const onType = (v: string) => {
    const t = v.replace(/\D/g, '').slice(0, 6)
    setDraft(t)
    if (+t >= 1) setTeam(+t)
  }
  const shown = draft ?? String(team)
  return (
    <section id="pricing" className="hp-sec hp-rv">
      <div className="hp-head">
        <p className="hp-eyebrow hp-in">{t("Pricing")}</p>
        <h2 className="hp-in">{t("One price per person.")} <span className="serif">{t("That is it.")}</span></h2>
        <p className="hp-in">{t("Slide to your headcount and pick a plan. You see your real monthly number before we even talk.")}</p>
      </div>
      <div className="hp-step hp-in">
        <div className="hp-step-head">
          <h3><i className="tnum">1</i>{MSTR.step1[lg()]}</h3>
          <div className="hp-mode" role="group" aria-label={MSTR.step1[lg()]}>
            <button type="button" aria-pressed={!helping} onClick={() => setHelping(false)}>{MSTR.modeKnow[lg()]}</button>
            <button type="button" aria-pressed={helping} onClick={() => setHelping(true)}>{MSTR.modeHelp[lg()]}</button>
          </div>
        </div>
        {helping ? (
          <div className="hp-help">
            <p className="hp-help-lead">{MSTR.helpLead[lg()]}</p>
            <ModulePicker id="hp-mp" value={mods} onChange={onMods} />
            <p className="hp-help-fit" aria-live="polite">
              {mods.length ? <>{MSTR.cheapest[lg()]}: <b>{tierName(fit)}</b> <span className="tnum">{t('BD {0}', PRICING[fit].price)}</span></> : MSTR.pickSome[lg()]}
            </p>
          </div>
        ) : (
          <div className="hp-plans">
            {PRICING.map((x, i) => {
              const list = PLAN_MODS[i]
              const all = open === i
              const shownMods = all ? list : list.slice(0, TOP)
              return (
                <article key={x.name} className={'hp-plan' + (i === plan ? ' on' : '')} onClick={() => setPlan(i)}>
                  <button type="button" className="hp-plan-pick" aria-pressed={i === plan} onClick={(e) => { e.stopPropagation(); setPlan(i) }}>
                    <b>{t(x.name)}</b>{i === 1 && <em>{t("Most teams")}</em>}<span className="hp-plan-tab-price tnum">{t('BD {0}', x.price)}</span>
                  </button>
                  <p className="hp-plan-price"><b className="tnum">{t('BD {0}', x.price)}</b> {t("per person, per month")}</p>
                  <p className="hp-plan-blurb">{t(x.blurb)}</p>
                  {i > 0 && <p className="hp-plan-plus">{(i === 1 ? MSTR.plusStarter : MSTR.plusPro)[lg()]}</p>}
                  <ul>{shownMods.map((m) => <li key={m.id}>{m.name[lg()]}</li>)}</ul>
                  {list.length > TOP && (
                    <button type="button" className="hp-plan-more" aria-expanded={all} onClick={(e) => { e.stopPropagation(); setOpen(all ? null : i) }}>
                      {all ? MSTR.less[lg()] : <><bdi className="tnum">+{list.length - TOP}</bdi> {MSTR.more[lg()]}</>}
                    </button>
                  )}
                </article>
              )
            })}
          </div>
        )}
      </div>
      <div className="hp-step hp-in">
        <div className="hp-step-head"><h3><i className="tnum">2</i>{MSTR.step2[lg()]}</h3></div>
        <div className="hp-price">
          <div className="hp-price-ctl">
            <label htmlFor="hp-team" className="hp-k">{t("Your team")}</label>
            <p className="hp-price-team">
              <input className="hp-team-num tnum" type="text" inputMode="numeric" aria-label={t("Team size, type any number")} value={shown}
                style={{ width: `calc(${Math.max(shown.length, 1)}ch + 4px)` }} onFocus={(e) => e.target.select()}
                onChange={(e) => onType(e.target.value)} onBlur={() => setDraft(null)} onKeyDown={(e) => { if (e.key === 'Enter') e.currentTarget.blur() }} />
             {' ' + t('people')}
              <span className="hp-team-hint">{team > 300 ? t('Custom team size') : t('More than 300? Tap the number and type yours.')}</span>
            </p>
            <input id="hp-team" type="range" min={5} max={300} step={5} value={Math.min(team, 300)} aria-valuetext={t('{0} people', team)}
              style={{ backgroundSize: ((Math.min(team, 300) - 5) / 295) * 100 + '% 100%' }} onChange={(e) => { setDraft(null); setTeam(+e.target.value) }} />
            <div className="hp-ticks" aria-hidden="true"><span>5</span><span>100</span><span>200</span><span>300</span></div>
            <div className="hp-presets" role="group" aria-label={t("Quick team sizes")}>
              {[10, 25, 50, 100, 250].map((n) => <button key={n} type="button" aria-pressed={team === n} onClick={() => { setDraft(null); setTeam(n) }}>{n}</button>)}
            </div>
          </div>
          <div className="hp-price-out" aria-live="polite">
            <p className="hp-eq"><span><b className="tnum">{team}</b>{' ' + t('people')}</span><i aria-hidden="true">×</i><span><b className="tnum">{t('BD {0}', p.price)}</b> {t(p.name)}</span><i aria-hidden="true">=</i></p>
            <p className="hp-big"><small>{t("BD")}</small><Odometer value={team * p.price} /><span>{t("a month")}</span></p>
            <p className="hp-yr">{t('BD {0} a year, plus a one-time setup fee.', money(team * p.price * 12))}</p>
            <p className="hp-day">{t("That is about")} <b className="tnum">{t('{0} fils', Math.round(p.price * 1000 / 30))}</b> {t("per person, per day.")}</p>
            <div className="hp-bookrow">
              <a className="rh-cta" href={WA + encodeURIComponent(waText(plan, team, sentMods))} target="_blank" rel="noopener">{MSTR.book[lg()]}<span className="rh-cta-i" aria-hidden="true">↗</span></a>
              <small>{MSTR.bookNote[lg()]} <a href={inquireHref() + toQuery(sentMods)}>{MSTR.guided[lg()]}</a></small>
            </div>
          </div>
        </div>
      </div>
      <div className="hp-fine hp-in">
        <p className="hp-fine-lead"><b>{t("Built to your requirements.")}</b> {t("Every plan is customizable: tell us which modules you need and we set RAL HR up the way your company works.")}</p>
        <ul className="hp-fine-perks">
          <li>{t("Ask RAL in every plan")}</li>
          <li>{t("Managers and admins at no extra cost")}</li>
          <li>{t("RAL's secure cloud or your own server")}</li>
        </ul>
      </div>
    </section>
  )
}

function Faq() {
  return (
    <section id="questions" className="hp-sec hp-rv hp-faq">
      <div className="hp-head">
        <p className="hp-eyebrow hp-in">{t("Questions")}</p>
        <h2 className="hp-in">{t("The things people")} <span className="serif">{t("ask us first.")}</span></h2>
      </div>
      <div className="hp-faq-list">
        {FAQ.map((f, i) => (
          <details key={f.q} className="hp-in" open={i === 0} {...{ name: 'hp-faq' }}>
            <summary>{t(f.q)}<i aria-hidden="true" /></summary>
            <p>{t(f.a)}</p>
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
  const [picked, setPicked] = useState<string[]>(['The WPS file', t('Arabic for staff')])
  const [typing, setTyping] = useState(false)
  const [sent, setSent] = useState(false)
  const box = useRef<HTMLDivElement>(null)
  const out = useRef<HTMLSpanElement>(null)
  const list = lg() === 'ar' ? (picked.length ? picked.map((x) => t(x)).join('، ') : t('getting payroll right')) : picked.length ? picked.map((x) => x.toLowerCase().replace('sio', 'SIO').replace('wps', 'WPS').replace('excel', 'Excel').replace('arabic', 'Arabic')).join(', ') : t('getting payroll right')
  const monthly = money(team * p.price)
  const msg = t('Hi RAL, I would like to book a RAL HR demo. We are a team of {0} in Bahrain, looking at the {1} plan (about BD {2} a month). What matters most to us: {3}.', team, t(p.name), monthly, list)
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
        <h2 className="hp-in">{t("See your own payday")} <span className="serif">{t("before you pay a single fils.")}</span></h2>
        <p className="hp-in">{t("Book a demo on WhatsApp. We load your team and salary structure, run a payday in Arabic and English, and show you the WPS file your bank will see.")}</p>
        <dl className="hp-close-sum hp-in" aria-label={t("Your demo request")}>
          <div><dt>{t("Team")}</dt><dd className="tnum">{t('{0} people', team)}</dd></div>
          <div><dt>{t("Plan")}</dt><dd>{t(p.name)}</dd></div>
          <div><dt>{t("Estimate")}</dt><dd className="tnum">{t('BD {0} a month', monthly)}</dd></div>
          <a href="#pricing">{t("Change")}</a>
        </dl>
      </div>
      <div className="hp-wa hp-in" ref={box}>
        <div className="hp-wa-top">
          <span className="hp-wa-av">R</span>
          <span><b>{t("RAL Technologies")}</b><small>{t("WhatsApp, +973 3821 8181")}</small></span>
          <span className="live-dot" aria-hidden="true" />
        </div>
        <div className="hp-wa-body">
          <p className="hp-wa-in">{t("Hi! Tell us a little about your team and we will take it from there.")}</p>
          <p className="hp-wa-out">{typing ? <><span ref={out} /><span className="hp-caret" aria-hidden="true" /></> : msg}</p>
        </div>
        <p className="hp-wa-q">{t("Add what matters most to you")}</p>
        <div className="hp-wa-topics" role="group" aria-label={t("What matters most to you")}>
          {TOPICS.map((x) => <button key={x} type="button" aria-pressed={picked.includes(x)} onClick={() => toggle(x)}>{t(x)}</button>)}
        </div>
      </div>
      <div className="hp-close-act hp-in">
        <a className={'hp-book' + (sent ? t(' sent') : '')} href={WA + encodeURIComponent(msg)} target="_blank" rel="noopener noreferrer" onClick={() => setSent(true)}>
          <span className="hp-book-sheen" aria-hidden="true" />
          <span className="hp-book-t"><b>{sent ? t('Opening WhatsApp') : t('Book a demo')}</b><small>{t("On WhatsApp, your message is ready")}</small></span>
          <span className="hp-book-i" aria-hidden="true">
            {sent
              ? <svg viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="#f8f8f8" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
              : <svg viewBox="0 0 24 24"><path d={WA_ICON} /></svg>}
          </span>
        </a>
        <p className="hp-close-alt">{t("Not on WhatsApp? Email")} <a href={mail}>{EMAIL}</a> {t("or use the")} <a href={inquireHref()}>{t("two minute form")}</a>.</p>
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
            <p className="hp-eyebrow hp-fade"><span className="live-dot" aria-hidden="true" /> {t("RAL HR · HR and payroll, made in Bahrain")}</p>
            <h1 className="hp-h1"><span className="hp-line">{words(t('Payday in Bahrain,'))}</span><span className="hp-line serif">{words(t('sorted before lunch.'))}</span></h1>
            <p className="hp-sub hp-fade">{t("Payroll, SIO, the WPS file and end of service, done right and checked for you. Your team gets an app in Arabic and English. From BD 1 per person a month.")}</p>
            <div className="hp-ctas hp-fade">
              <a className="rh-cta" href="#talk">{t("Book a demo")}<span className="rh-cta-i" aria-hidden="true">↗</span></a>
              <a className="rh-ghost" href="#pricing">{t("See pricing")}</a>
            </div>
          </div>
          <Payday />
          <ul className="hp-proof hp-fade">
            <li><b className="tnum">10/10</b>{t("WPS columns checked")}</li>
            <li><b className="tnum">8% · 1% · 3%</b>{t("SIO, worked out")}</li>
            <li><b lang="ar">عربي</b>{t("and English, every screen")}</li>
            <li><b>{t("iOS & Android")}</b>{t("app for your staff")}</li>
          </ul>
        </section>
        {stage >= 1 && (
          <>
            <Month />
            <section id="demo" className="hp-sec hp-rv hp-demo">
              <div className="hp-head">
                <p className="hp-eyebrow hp-in">{t("The full demo")}</p>
                <h2 className="hp-in">{t("Now try the whole app.")} <span className="serif">{t("Nothing to install.")}</span></h2>
                <p className="hp-in">{t("Dashboard, payroll, leave, attendance, end of service and Ask RAL, with a full demo company inside. Switch between web, tablet and phone.")}</p>
              </div>
              <div className="hp-in"><DemoSlot /></div>
            </section>
            <Rules />
            <section id="app" className="hp-sec hp-rv hp-app">
              <div className="hp-head">
                <p className="hp-eyebrow hp-in">{t("The app")}</p>
                <h2 className="hp-in">{t("In every pocket.")} <span className="serif">{t("iOS & Android.")}</span></h2>
                <p className="hp-in">{t("Staff check in, ask for leave and open payslips in Arabic or English. Managers approve from the same app. No training day needed.")}</p>
              </div>
              <VideoTour />
              <ul className="hp-app-notes hp-in" aria-label={t("App at a glance")}>
                <li><b>{t("Check-in that counts")}</b>{t("Only inside your site radius, with the time on record.")}</li>
                <li><b>{t("Arabic or English")}</b>{t("Each person picks their language. Payslips follow.")}</li>
                <li><b>{t("Approvals in one tap")}</b>{t("Leave and letter requests land with the right manager.")}</li>
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
