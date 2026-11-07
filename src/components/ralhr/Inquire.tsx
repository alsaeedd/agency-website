import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import './RalHrPage.css'
import './Inquire.css'

const WA = 'https://wa.me/97366386602?text='
const KEY = 'ralhr-inquire'

const SIZES = [
  { id: '1 to 10', guess: 8, phrase: 'a team of up to 10' },
  { id: '11 to 50', guess: 30, phrase: 'between 11 and 50 people' },
  { id: '51 to 200', guess: 120, phrase: 'between 51 and 200 people' },
  { id: '200+', guess: 250, phrase: 'over 200 people' },
]
const MODULES = ['Payroll + WPS', 'SIO + end of service', 'Leave + attendance', 'Ask RAL', 'Documents + expiry alerts', 'Hiring + onboarding', 'Reviews', 'Phone app for staff']
const PRO_MODULES = ['Hiring + onboarding', 'Reviews']
const PLANS = [
  { id: 'Starter', rate: 1, base: 15, line: 'The legal must-haves', has: 'Payroll + WPS, SIO + end of service, leave + attendance, records + expiry alerts, Ask RAL' },
  { id: 'Professional', rate: 2, base: 35, line: 'Starter plus the HR department', has: 'Hiring, onboarding, reviews, self-service, documents hub, e-signature, rosters' },
  { id: 'Premium', rate: 3, base: 90, line: 'Professional plus the big-company controls', has: 'Analytics export, pay equity, contractors + HSE, enforced SSO, legal hold' },
]
const TIMES = [
  { id: 'This month', phrase: 'hoping to start this month' },
  { id: 'Next month', phrase: 'hoping to start next month' },
  { id: 'This quarter', phrase: 'hoping to start this quarter' },
  { id: 'Just exploring', phrase: 'just exploring for now' },
]
const STEPS = ['Team', 'Needs', 'Plan', 'Timing', 'You']
const UNSURE = 'unsure'

type Answers = { size: string; count: string; modules: string[]; plan: string; time: string; name: string; company: string; phone: string }
const EMPTY: Answers = { size: '', count: '', modules: [], plan: '', time: '', name: '', company: '', phone: '' }

function load(): Answers {
  try {
    const v = { ...EMPTY, ...JSON.parse(sessionStorage.getItem(KEY) || '{}') }
    return { ...v, modules: Array.isArray(v.modules) ? v.modules : [] }
  } catch { return EMPTY }
}

const exact = (a: Answers) => { const n = parseInt(a.count, 10); return Number.isFinite(n) && n > 0 ? Math.min(n, 99999) : 0 }
const headcount = (a: Answers) => exact(a) || SIZES.find((s) => s.id === a.size)?.guess || 0
const planOf = (id: string) => PLANS.find((p) => p.id === id)
const monthly = (n: number, id: string) => { const p = planOf(id); return p ? Math.max(n * p.rate, p.base) : 0 }
const bd = (v: number) => {
  const whole = Math.abs(v - Math.round(v)) < 0.0005
  return `BD ${v.toLocaleString('en-US', { minimumFractionDigits: whole ? 0 : 3, maximumFractionDigits: whole ? 0 : 3 })}`
}
const listJoin = (xs: string[]) => xs.length < 2 ? xs.join('') : `${xs.slice(0, -1).join(', ')} and ${xs[xs.length - 1]}`
const digits = (s: string) => s.replace(/\D/g, '').length
const nameOk = (a: Answers) => a.name.trim().length > 1
const companyOk = (a: Answers) => a.company.trim().length > 1
const phoneOk = (a: Answers) => !a.phone.trim() || digits(a.phone) >= 7

function compose(a: Answers): string {
  const n = exact(a)
  const people = n ? `${n} ${n === 1 ? 'person' : 'people'}` : SIZES.find((s) => s.id === a.size)?.phrase || 'a growing team'
  const needs = a.modules.length ? `looking at ${listJoin(a.modules)}` : 'looking at RAL HR'
  const p = planOf(a.plan)
  const plan = p ? `on the ${p.id} plan` : 'and not sure on the plan yet'
  const time = TIMES.find((t) => t.id === a.time)?.phrase || 'hoping to start soon'
  const lines = [
    `Hi RAL, I'm ${a.name.trim()} from ${a.company.trim().replace(/\.+$/, '')}.`,
    `We're ${people}, ${needs} ${plan}, ${time}.`,
  ]
  if (p) lines.push(`Your calculator put that at about ${bd(monthly(headcount(a), p.id))} a month before setup.`)
  lines.push(a.phone.trim() ? `Could we book a demo? The best number for me is ${a.phone.trim()}.` : 'Could we book a demo?')
  return lines.join(' ')
}

const useIsoLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect
const reduced = () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

function Estimate({ value }: { value: number }) {
  const ref = useRef<HTMLSpanElement>(null)
  const last = useRef(value)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (reduced() || last.current === value) { el.textContent = bd(value); last.current = value; return }
    const o = { v: last.current }
    last.current = value
    const t = gsap.to(o, { v: value, duration: 0.7, ease: 'expo.out', onUpdate: () => { el.textContent = bd(Math.round(o.v)) }, onComplete: () => { el.textContent = bd(value) } })
    return () => { t.kill() }
  }, [value])
  return <span ref={ref}>{bd(value)}</span>
}

export default function Inquire({ onClose }: { onClose?: () => void } = {}) {
  const [step, setStep] = useState(0)
  const [a, setA] = useState<Answers>(EMPTY)
  const [msg, setMsg] = useState('')
  const [copied, setCopied] = useState(false)
  const [tried, setTried] = useState(false)
  const dir = useRef(1)
  const stage = useRef<HTMLDivElement>(null)
  const bubble = useRef<HTMLTextAreaElement>(null)
  const total = STEPS.length

  useEffect(() => { setA(load()) }, [])
  useEffect(() => { try { sessionStorage.setItem(KEY, JSON.stringify(a)) } catch { /* private mode */ } }, [a])

  // Step entrance: blur-rise stagger, direction aware. Reduced motion just shows it.
  useIsoLayoutEffect(() => {
    const el = stage.current
    if (!el) return
    const items = el.querySelectorAll<HTMLElement>('[data-rise]')
    const focusTarget = el.querySelector<HTMLElement>('[data-autofocus]') || el.querySelector<HTMLElement>('h1')
    focusTarget?.focus({ preventScroll: true })
    if (reduced()) { gsap.set(items, { clearProps: 'all' }); return }
    const ctx = gsap.context(() => {
      gsap.fromTo(items,
        { opacity: 0, y: 28 * dir.current, filter: 'blur(10px)' },
        { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.9, ease: 'expo.out', stagger: 0.1, clearProps: 'filter,transform' })
    }, el)
    return () => ctx.revert()
  }, [step])

  // Keep the editable bubble sized to its text, at any width.
  useIsoLayoutEffect(() => {
    const t = bubble.current
    if (!t) return
    const fit = () => { t.style.height = 'auto'; t.style.height = `${t.scrollHeight}px` }
    fit()
    window.addEventListener('resize', fit)
    return () => window.removeEventListener('resize', fit)
  }, [msg, step])

  const set = (p: Partial<Answers>) => setA((v) => ({ ...v, ...p }))
  const toggle = (m: string) => set({ modules: a.modules.includes(m) ? a.modules.filter((x) => x !== m) : [...a.modules, m] })
  const valid = [!!a.size, true, !!a.plan, !!a.time, nameOk(a) && companyOk(a) && phoneOk(a)]
  const ok = valid[step] ?? true

  const go = (to: number) => { dir.current = to > step ? 1 : -1; setTried(false); setStep(to) }
  const next = () => {
    if (step >= total) return
    if (!ok) { setTried(true); return }
    if (step === total - 1) { setMsg(compose(a)); setCopied(false) }
    go(step + 1)
  }
  const back = () => { if (step > 0) go(step - 1) }
  const copy = () => { navigator.clipboard?.writeText(msg).then(() => setCopied(true), () => {}) }

  // Enter advances from anywhere except buttons, links and the message bubble.
  const nextRef = useRef(next)
  nextRef.current = next
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Enter' || e.shiftKey || e.isComposing || e.defaultPrevented) return
      const t = e.target as HTMLElement
      const picked = t.closest('[role="radio"][aria-checked="true"], [aria-pressed]')
      if (!picked && t.closest('textarea, button, a, [contenteditable="true"]')) return
      e.preventDefault()
      nextRef.current()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const n = headcount(a)
  const fit = a.modules.some((m) => PRO_MODULES.includes(m)) ? 'Professional' : 'Starter'
  const shown = Math.min(step + 1, total)
  const err = (show: boolean, text: string) => tried && show ? <span className="iqx-err">{text}</span> : null
  const now = new Date()
  const stamp = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`

  return (
    <div className="rh">
      <header className="rh-top">
        <a href="/ral-hr/" className="rh-brand">RAL <span>HR</span></a>
        {onClose
          ? <button type="button" className="rh-top-cta iqx-close" onClick={onClose}>Close</button>
          : <a className="rh-top-cta" href="/ral-hr/">Back to RAL HR</a>}
      </header>
      <main className="iq iqx">
        <div className="iqx-progress" aria-label={step < total ? `Step ${shown} of ${total}` : 'Ready to send'}>
          <ol>
            {STEPS.map((s, i) => (
              <li key={s} className={i < step ? 'done' : i === step ? 'now' : ''}>
                <i><b /></i>
                <button type="button" disabled={i >= step} onClick={() => go(i)} tabIndex={i < step ? 0 : -1}>{s}</button>
              </li>
            ))}
          </ol>
          <span className="iqx-count">{step < total ? `${shown} / ${total}` : 'Ready'}</span>
        </div>

        <div ref={stage} className="iqx-stage" key={step}>
          {step === 0 && (<>
            <p className="iqx-eyebrow" data-rise>Let's size it up</p>
            <h1 tabIndex={-1} data-rise>How many people <em>work with you?</em></h1>
            <p className="iq-lead" data-rise>Pricing is per employee, so this is the number that matters most.</p>
            <div className="iqx-chips" data-rise role="radiogroup" aria-label="Team size">
              {SIZES.map((s) => (
                <button key={s.id} type="button" role="radio" aria-checked={a.size === s.id} className={`iqx-chip${a.size === s.id ? ' on' : ''}`} onClick={() => set({ size: s.id, count: '' })}>{s.id}</button>
              ))}
            </div>
            {a.size && (
              <label className="iqx-exact" data-rise>
                <span>Know the exact number? <small>Optional, it sharpens the estimate.</small></span>
                <input inputMode="numeric" pattern="[0-9]*" placeholder={`About ${SIZES.find((s) => s.id === a.size)?.guess}`} value={a.count} onChange={(e) => set({ count: e.target.value.replace(/\D/g, '').slice(0, 5) })} aria-label="Exact headcount" />
              </label>
            )}
            {err(!a.size, 'Pick the closest range to carry on.')}
          </>)}

          {step === 1 && (<>
            <p className="iqx-eyebrow" data-rise>What hurts today</p>
            <h1 tabIndex={-1} data-rise>What do you <em>need most?</em></h1>
            <p className="iq-lead" data-rise>Pick as many as you like. Not sure yet? Skip it, we'll work it out together.</p>
            <div className="iqx-mods" data-rise role="group" aria-label="Modules">
              {MODULES.map((m) => (
                <button key={m} type="button" aria-pressed={a.modules.includes(m)} className={`iqx-mod${a.modules.includes(m) ? ' on' : ''}`} onClick={() => toggle(m)}>
                  <span className="iqx-tick" aria-hidden="true"><svg viewBox="0 0 16 16"><path d="M3.5 8.5l3 3 6-7" /></svg></span>{m}
                </button>
              ))}
            </div>
            <p className="iqx-hint" data-rise>{a.modules.length ? `${a.modules.length} picked` : 'Nothing picked yet, that is fine too'}</p>
          </>)}

          {step === 2 && (<>
            <p className="iqx-eyebrow" data-rise>No per-user fees</p>
            <h1 tabIndex={-1} data-rise>Which plan <em>feels right?</em></h1>
            <p className="iq-lead" data-rise>Ask RAL comes in every plan. You can add or drop modules later.</p>
            <div className="iqx-plans" data-rise role="radiogroup" aria-label="Plan">
              {PLANS.map((p) => (
                <button key={p.id} type="button" role="radio" aria-checked={a.plan === p.id} className={`iqx-plan${a.plan === p.id ? ' on' : ''}`} onClick={() => set({ plan: p.id })}>
                  <span className="iqx-plan-head">
                    <strong>{p.id}</strong>
                    {a.modules.length > 0 && p.id === fit && <span className="iqx-fit">Fits your picks</span>}
                  </span>
                  <span className="iqx-plan-price">BD {p.rate}<small> / employee / month</small></span>
                  <span className="iqx-plan-line">{p.line}</span>
                  <span className="iqx-plan-has">{p.has}</span>
                  <span className="iqx-plan-est">{bd(monthly(n, p.id))} a month for {exact(a) ? '' : 'about '}{n} people</span>
                </button>
              ))}
              <button type="button" role="radio" aria-checked={a.plan === UNSURE} className={`iqx-plan iqx-plan-unsure${a.plan === UNSURE ? ' on' : ''}`} onClick={() => set({ plan: UNSURE })}>
                <strong>Help me choose</strong>
                <span className="iqx-plan-line">Tell us your setup and we'll suggest the smallest plan that does the job.</span>
              </button>
            </div>
            <div className={`iqx-total${planOf(a.plan) ? ' live' : ''}`} data-rise aria-live="polite">
              <span className="iqx-total-label"><i aria-hidden="true" />Live estimate</span>
              {planOf(a.plan) ? (<>
                <span className="iqx-total-sum">{exact(a) ? '' : 'About '}{n} people <span aria-hidden="true">×</span> BD {planOf(a.plan)!.rate}</span>
                <span className="iqx-total-val"><Estimate value={monthly(n, a.plan)} /><small> / month</small></span>
                {n * planOf(a.plan)!.rate < planOf(a.plan)!.base && <span className="iqx-total-note">{a.plan} starts at {bd(planOf(a.plan)!.base)} a month.</span>}
              </>) : <span className="iqx-total-sum">Pick a plan to see your monthly number.</span>}
              <span className="iqx-total-fine">Plus a one-time setup fee sized to your company. Final price agreed with you.</span>
            </div>
            {err(!a.plan, 'Choose a plan, or let us help you choose.')}
          </>)}

          {step === 3 && (<>
            <p className="iqx-eyebrow" data-rise>No pressure</p>
            <h1 tabIndex={-1} data-rise>When would you like <em>to start?</em></h1>
            <p className="iq-lead" data-rise>It shapes how we plan your setup. Exploring is a perfectly good answer.</p>
            <div className="iqx-chips" data-rise role="radiogroup" aria-label="Timeline">
              {TIMES.map((t) => (
                <button key={t.id} type="button" role="radio" aria-checked={a.time === t.id} className={`iqx-chip${a.time === t.id ? ' on' : ''}`} onClick={() => set({ time: t.id })}>{t.id}</button>
              ))}
            </div>
            {err(!a.time, 'Pick whichever is closest.')}
          </>)}

          {step === 4 && (<>
            <p className="iqx-eyebrow" data-rise>Last step</p>
            <h1 tabIndex={-1} data-rise>Who should we <em>talk to?</em></h1>
            <p className="iq-lead" data-rise>Nothing is sent until you press send. You'll see the exact message first.</p>
            <div className="iqx-fields" data-rise>
              <label className={tried && !nameOk(a) ? 'bad' : ''}>Your name
                <input data-autofocus value={a.name} onChange={(e) => set({ name: e.target.value })} autoComplete="name" placeholder="Ahmed" />
                {err(!nameOk(a), 'We need a name to say hello.')}
              </label>
              <label className={tried && !companyOk(a) ? 'bad' : ''}>Company
                <input value={a.company} onChange={(e) => set({ company: e.target.value })} autoComplete="organization" placeholder="Gulf Foods W.L.L." />
                {err(!companyOk(a), 'Which company is this for?')}
              </label>
              <label className={tried && !phoneOk(a) ? 'bad' : ''}>Phone <small>Optional</small>
                <input type="tel" value={a.phone} onChange={(e) => set({ phone: e.target.value })} autoComplete="tel" placeholder="+973 3xxx xxxx" />
                {err(!phoneOk(a), 'That number looks a little short.')}
              </label>
            </div>
          </>)}

          {step === 5 && (<>
            <p className="iqx-eyebrow" data-rise>Ready when you are</p>
            <h1 tabIndex={-1} data-rise>Here is your <em>message.</em></h1>
            <p className="iq-lead" data-rise>Tap the bubble to change anything. It goes straight to our WhatsApp, from your own phone.</p>
            <div className="iqx-chat" data-rise>
              <div className="iqx-chat-head">
                <span className="iqx-avatar" aria-hidden="true">R</span>
                <span><strong>RAL Technologies</strong><small><i aria-hidden="true" />Manama, Bahrain</small></span>
              </div>
              <div className="iqx-chat-body">
                <div className="iqx-bubble">
                  <textarea ref={bubble} value={msg} rows={3} onChange={(e) => { setMsg(e.target.value); setCopied(false) }} aria-label="Your WhatsApp message" spellCheck />
                  <span className="iqx-meta">{stamp}<svg viewBox="0 0 18 12" aria-hidden="true"><path d="M1 6.5l3 3 6-7M7 9.5l1 1 6-8" /></svg></span>
                </div>
              </div>
            </div>
            <div className="iqx-send" data-rise>
              <a className="rh-cta" href={WA + encodeURIComponent(msg)} target="_blank" rel="noopener" aria-disabled={!msg.trim()}>Send on WhatsApp<span className="rh-cta-i" aria-hidden="true">↗</span></a>
              <a className="rh-ghost" href={`mailto:info@raltech.dev?subject=${encodeURIComponent(`RAL HR demo${a.company.trim() ? `: ${a.company.trim()}` : ''}`)}&body=${encodeURIComponent(msg)}`}>Email it instead</a>
            </div>
            <div className="iq-alt" data-rise>
              <button type="button" className="iq-back" onClick={back}>Back</button>
              <button type="button" onClick={copy}>{copied ? 'Copied' : 'Copy message'}</button>
              <button type="button" onClick={() => { setMsg(compose(a)); setCopied(false) }}>Reset to my answers</button>
            </div>
          </>)}
        </div>

        {step < total && (
          <div className="iq-nav iqx-nav">
            {step > 0 ? <button type="button" className="iq-back" onClick={back}>Back</button> : <span />}
            <span className="iqx-enter" aria-hidden="true">press <kbd>Enter</kbd></span>
            <button type="button" className={`rh-cta iq-next${ok ? '' : ' soft'}`} aria-disabled={!ok} onClick={next}>
              {step === total - 1 ? 'Preview message' : step === 1 && !a.modules.length ? 'Skip for now' : 'Next'}<span className="rh-cta-i" aria-hidden="true">→</span>
            </button>
          </div>
        )}
      </main>
    </div>
  )
}
