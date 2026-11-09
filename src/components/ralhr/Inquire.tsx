import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { localePath } from '../../i18n'
import { ralHrLang as lg } from './t'
import { t } from './t'
import { gsap } from 'gsap'
import { calm as calmMotion } from './charts'
import './RalHrPage.css'
import './Inquire.css'
import ModulePicker from './ModulePicker'
import { CATEGORIES, cleanIds, fitTier, fromQuery, STR as MSTR, tierName } from './modules'

const WA = 'https://wa.me/97338218181?text='
const KEY = 'ralhr-inquire'

const SIZES = [
  { id: '1 to 10', guess: 8, phrase: t('a team of up to 10') },
  { id: '11 to 50', guess: 30, phrase: t('between 11 and 50 people') },
  { id: '51 to 200', guess: 120, phrase: t('between 51 and 200 people') },
  { id: '200+', guess: 250, phrase: t('over 200 people') },
]
const PLANS = [
  { id: 'Starter', rate: 1, base: 15, line: 'The operational must-haves', has: 'Payroll + WPS, SIO + end of service, leave + attendance, org chart + documents hub, records + expiry alerts, Ask RAL, enforced SSO' },
  { id: 'Professional', rate: 2, base: 35, line: t('Starter plus the HR department'), has: 'Hiring, onboarding, reviews, e-signature, benefits, rosters, travel' },
  { id: 'Premium', rate: 3, base: 90, line: t('Professional plus the big-company controls'), has: 'Analytics export, pay equity, contractors + HSE, fleet, legal hold' },
]
const TIMES = [
  { id: 'This month', phrase: t('hoping to start this month') },
  { id: 'Next month', phrase: t('hoping to start next month') },
  { id: 'This quarter', phrase: t('hoping to start this quarter') },
  { id: 'Just exploring', phrase: t('just exploring for now') },
]
const STEPS = ['Team', 'Needs', 'Plan', 'Timing', 'You']
const UNSURE = 'unsure'

type Answers = { size: string; count: string; modules: string[]; plan: string; time: string; name: string; company: string; phone: string }
const EMPTY: Answers = { size: '', count: '', modules: [], plan: '', time: '', name: '', company: '', phone: '' }

function load(): Answers {
  try {
    const v = { ...EMPTY, ...JSON.parse(sessionStorage.getItem(KEY) || '{}') }
    // Picks from the pricing box arrive as ?modules=a,b and join whatever this visitor already chose.
    const q = fromQuery(window.location.search)
    if (q.length) window.history.replaceState(null, '', window.location.pathname + window.location.hash)
    return { ...v, modules: cleanIds([...cleanIds(v.modules), ...q]) }
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
const digits = (s: string) => s.replace(/\D/g, '').length
const nameOk = (a: Answers) => a.name.trim().length > 1
const companyOk = (a: Answers) => a.company.trim().length > 1
const phoneOk = (a: Answers) => !a.phone.trim() || digits(a.phone) >= 7

function compose(a: Answers): string {
  const n = exact(a)
  const people = n ? `${n} ${n === 1 ? 'person' : t('people')}` : SIZES.find((s) => s.id === a.size)?.phrase || 'a growing team'
  const needs = a.modules.length ? '' : ' looking at RAL HR'
  const p = planOf(a.plan)
  const plan = p ? `on the ${p.id} plan` : 'and not sure on the plan yet'
  const time = TIMES.find((t) => t.id === a.time)?.phrase || t('hoping to start shortly')
  const lines = [
    `Hi RAL, I'm ${a.name.trim()} from ${a.company.trim().replace(/\.+$/, '')}.`,
    `We're ${people},${needs} ${plan}, ${time}.`,
  ]
  const picks = moduleLines(a.modules)
  const tail: string[] = []
  if (p) tail.push(`Your calculator put that at about ${bd(monthly(headcount(a), p.id))} a month before setup.`)
  tail.push(a.phone.trim() ? `Could we book a demo? The best number for me is ${a.phone.trim()}.` : t('Could we book a demo?'))
  return [lines.join(' '), picks, tail.join(' ')].filter(Boolean).join('\n\n')
}

// Picks grouped by category, one line each, so the WhatsApp message stays readable.
function moduleLines(ids: string[]): string {
  if (!ids.length) return ''
  const rows = CATEGORIES.map((c) => {
    const on = c.mods.filter((x) => ids.includes(x.id))
    return on.length ? `- ${c.name[lg()]}: ${on.map((x) => x.name[lg()]).join(', ')}` : ''
  }).filter(Boolean)
  return [`${MSTR.msgHead[lg()]} (${ids.length}):`, ...rows].join('\n')
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
  const [typing, setTyping] = useState(false)
  const [sent, setSent] = useState(false)
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
  }, [msg, step, typing])

  const set = (p: Partial<Answers>) => setA((v) => ({ ...v, ...p }))
  const valid = [!!a.size, true, !!a.plan, !!a.time, nameOk(a) && companyOk(a) && phoneOk(a)]
  const ok = valid[step] ?? true

  const go = (to: number) => { dir.current = to > step ? 1 : -1; setTried(false); setStep(to) }
  const next = () => {
    if (step >= total) return
    if (!ok) { setTried(true); return }
    if (step === total - 1) {
      setMsg(compose(a)); setCopied(false); setSent(false)
      if (!calmMotion()) { setTyping(true); window.setTimeout(() => setTyping(false), 1100) }
    }
    // Arriving at the plan step with picks and no plan: start on the cheapest plan that covers them.
    if (step === 1 && !a.plan && a.modules.length) set({ plan: tierName(fitTier(a.modules)) })
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
  const fit = tierName(fitTier(a.modules))
  const shown = Math.min(step + 1, total)
  const err = (show: boolean, text: string) => tried && show ? <span className="iqx-err">{text}</span> : null
  const now = new Date()
  const stamp = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`

  return (
    <div className="rh">
      {onClose
        ? <header className="rh-top"><a href={localePath(lg(), "/ral-hr/")} className="rh-brand">{t("RAL")} <span>{t("HR")}</span></a><button type="button" className="rh-top-cta iqx-close" onClick={onClose}>{t("Close")}</button></header>
        : <a className="iqx-back" href={localePath(lg(), "/ral-hr/")}><span aria-hidden="true" className="rh-flip">{'\u2190'} </span>{t("Back to RAL HR")}</a>}
      <main className="iq iqx">
        <div className="iqx-progress" aria-label={step < total ? `Step ${shown} of ${total}` : t('Ready to send')}>
          <ol>
            {STEPS.map((s, i) => (
              <li key={s} className={i < step ? 'done' : i === step ? 'now' : ''}>
                <i><b /></i>
                <button type="button" disabled={i >= step} onClick={() => go(i)} tabIndex={i < step ? 0 : -1}>{t(s)}</button>
              </li>
            ))}
          </ol>
          <span className="iqx-count">{step < total ? `${shown} / ${total}` : 'Ready'}</span>
        </div>

        <div ref={stage} className="iqx-stage" key={step}>
          {step === 0 && (<>
            <p className="iqx-eyebrow" data-rise>{t("Let's size it up")}</p>
            <h1 tabIndex={-1} data-rise>{t("How many people")} <em>{t("work with you?")}</em></h1>
            <p className="iq-lead" data-rise>{t("Pricing is per employee, so this is the number that matters most.")}</p>
            <div className="iqx-chips" data-rise role="radiogroup" aria-label={t("Team size")}>
              {SIZES.map((s) => (
                <button key={s.id} type="button" role="radio" aria-checked={a.size === s.id} className={`iqx-chip${a.size === s.id ? ' on' : ''}`} onClick={() => set({ size: s.id, count: '' })}>{t(s.id)}</button>
              ))}
            </div>
            {a.size && (
              <label className="iqx-exact" data-rise>
                <span>{t("Know the exact number?")} <small>{t("Optional, it sharpens the estimate.")}</small></span>
                <input inputMode="numeric" pattern="[0-9]*" placeholder={`About ${SIZES.find((s) => s.id === a.size)?.guess}`} value={a.count} onChange={(e) => set({ count: e.target.value.replace(/\D/g, '').slice(0, 5) })} name="headcount" autoComplete="off" aria-label={t("Exact headcount")} />
              </label>
            )}
            {err(!a.size, t('Pick the closest range to carry on.'))}
          </>)}

          {step === 1 && (<>
            <p className="iqx-eyebrow" data-rise>{t("What hurts today")}</p>
            <h1 tabIndex={-1} data-rise>{t("What do you")} <em>{t("need most?")}</em></h1>
            <p className="iq-lead" data-rise>{t("Pick as many as you like. Not sure yet? Skip it, we'll work it out together.")}</p>
            <div data-rise><ModulePicker id="iq-mp" value={a.modules} onChange={(modules) => set({ modules })} animate={false} /></div>
          </>)}

          {step === 2 && (<>
            <p className="iqx-eyebrow" data-rise>{t("No per-user fees")}</p>
            <h1 tabIndex={-1} data-rise>{t("Which plan")} <em>{t("feels right?")}</em></h1>
            <p className="iq-lead" data-rise>{t("Ask RAL comes in every plan. You can add or drop modules later.")}</p>
            <div className="iqx-plans" data-rise role="radiogroup" aria-label={t("Plan")}>
              {PLANS.map((p) => (
                <button key={p.id} type="button" role="radio" aria-checked={a.plan === p.id} className={`iqx-plan${a.plan === p.id ? ' on' : ''}`} onClick={() => set({ plan: p.id })}>
                  <span className="iqx-plan-head">
                    <strong>{t(p.id)}</strong>
                    {a.modules.length > 0 && p.id === fit && <span className="iqx-fit">Cheapest for your picks</span>}
                  </span>
                  <span className="iqx-plan-price">BD {p.rate}<small> {t("/ employee / month")}</small></span>
                  <span className="iqx-plan-line">{t(p.line)}</span>
                  <span className="iqx-plan-has">{t(p.has)}</span>
                  <span className="iqx-plan-est">{bd(monthly(n, p.id))} a month for {exact(a) ? '' : 'about '}{n} people</span>
                </button>
              ))}
              <button type="button" role="radio" aria-checked={a.plan === UNSURE} className={`iqx-plan iqx-plan-unsure${a.plan === UNSURE ? ' on' : ''}`} onClick={() => set({ plan: UNSURE })}>
                <strong>{t("Help me choose")}</strong>
                <span className="iqx-plan-line">{t("Tell us your setup and we'll suggest the smallest plan that does the job.")}</span>
              </button>
            </div>
            <div className={`iqx-total${planOf(a.plan) ? ' live' : ''}`} data-rise aria-live="polite">
              <span className="iqx-total-label"><i aria-hidden="true" />{t("Live estimate")}</span>
              {planOf(a.plan) ? (<>
                <span className="iqx-total-sum">{exact(a) ? '' : 'About '}{n} people <span aria-hidden="true">×</span> BD {planOf(a.plan)!.rate}</span>
                <span className="iqx-total-val"><Estimate value={monthly(n, a.plan)} /><small> {t("/ month")}</small></span>
                {n * planOf(a.plan)!.rate < planOf(a.plan)!.base && <span className="iqx-total-note">{a.plan} starts at {bd(planOf(a.plan)!.base)} a month.</span>}
              </>) : <span className="iqx-total-sum">{t("Pick a plan to see your monthly number.")}</span>}
              <span className="iqx-total-fine">{t("Plus a one-time setup fee sized to your company. Final price agreed with you.")}</span>
            </div>
            {err(!a.plan, t('Choose a plan, or let us help you choose.'))}
          </>)}

          {step === 3 && (<>
            <p className="iqx-eyebrow" data-rise>{t("No pressure")}</p>
            <h1 tabIndex={-1} data-rise>{t("When would you like")} <em>{t("to start?")}</em></h1>
            <p className="iq-lead" data-rise>{t("It shapes how we plan your setup. Exploring is a perfectly good answer.")}</p>
            <div className="iqx-chips" data-rise role="radiogroup" aria-label={t("Timeline")}>
              {TIMES.map((tm) => (
                <button key={tm.id} type="button" role="radio" aria-checked={a.time === tm.id} className={`iqx-chip${a.time === tm.id ? ' on' : ''}`} onClick={() => set({ time: tm.id })}>{t(tm.id)}</button>
              ))}
            </div>
            {err(!a.time, t('Pick whichever is closest.'))}
          </>)}

          {step === 4 && (<>
            <p className="iqx-eyebrow" data-rise>{t("Last step")}</p>
            <h1 tabIndex={-1} data-rise>{t("Who should we")} <em>{t("talk to?")}</em></h1>
            <p className="iq-lead" data-rise>{t("Nothing is sent until you press send. You'll see the exact message first.")}</p>
            <div className="iqx-fields" data-rise>
              <label className={tried && !nameOk(a) ? 'bad' : ''}>{t("Your name")}
                <input data-autofocus value={a.name} onChange={(e) => set({ name: e.target.value })} name="name" autoComplete="name" placeholder={t("Ahmed")} />
                {err(!nameOk(a), t('We need a name to say hello.'))}
              </label>
              <label className={tried && !companyOk(a) ? 'bad' : ''}>{t("Company")}
                <input value={a.company} onChange={(e) => set({ company: e.target.value })} name="company" autoComplete="organization" placeholder={t("Gulf Foods W.L.L.")} />
                {err(!companyOk(a), t('Which company is this for?'))}
              </label>
              <label className={tried && !phoneOk(a) ? 'bad' : ''}>{t("Phone")} <small>{t("Optional")}</small>
                <input type="tel" value={a.phone} onChange={(e) => set({ phone: e.target.value })} name="phone" autoComplete="tel" placeholder={t("+973 3xxx xxxx")} />
                {err(!phoneOk(a), t('That number looks a little short.'))}
              </label>
            </div>
          </>)}

          {step === 5 && (<>
            <p className="iqx-eyebrow" data-rise>{t("Ready when you are")}</p>
            <h1 tabIndex={-1} data-rise>{t("Here is your")} <em>{t("message.")}</em></h1>
            <p className="iq-lead" data-rise>{t("Tap the bubble to change anything. It goes straight to our WhatsApp, from your own phone.")}</p>
            <div className="iqx-chat" data-rise>
              <div className="iqx-chat-head">
                <span className="iqx-avatar" aria-hidden="true">R</span>
                <span><strong>{t("RAL Technologies")}</strong><small><i aria-hidden="true" />{t("Manama, Bahrain")}</small></span>
              </div>
              <div className="iqx-chat-body">
                {typing ? <div className="iqx-typing" aria-label={t("Writing your message")}><i /><i /><i /></div> : <div className="iqx-bubble iqx-pop">
                  <textarea ref={bubble} value={msg} rows={3} onChange={(e) => { setMsg(e.target.value); setCopied(false) }} aria-label={t("Your WhatsApp message")} spellCheck />
                  <span className={`iqx-meta${sent ? ' sent' : ''}`}>{stamp}<svg viewBox="0 0 18 12" aria-hidden="true"><path d="M1 6.5l3 3 6-7M7 9.5l1 1 6-8" /></svg></span>
                </div>}
              </div>
            </div>
            {sent && (
              <div className="iqx-sent" role="status">
                <svg viewBox="0 0 40 40" aria-hidden="true"><circle cx="20" cy="20" r="18" /><path d="M12 20.5l5.5 5.5L28 15" /></svg>
                <div>
                  <strong>{t("WhatsApp is open with your message.")}</strong>
                  <p>{t("Press send there and we reply in that same chat. If it did not open, copy the message or email it instead.")}</p>
                </div>
              </div>
            )}
            <div className="iqx-send" data-rise>
              <a className="rh-cta" href={WA + encodeURIComponent(msg)} target="_blank" rel="noopener" aria-disabled={!msg.trim()} onClick={() => setSent(true)}>{sent ? t('Open WhatsApp again') : t('Send on WhatsApp')}<span className="rh-cta-i" aria-hidden="true">↗</span></a>
              <a className="rh-ghost" href={`mailto:info@raltech.dev?subject=${encodeURIComponent(`RAL HR demo${a.company.trim() ? `: ${a.company.trim()}` : ''}`)}&body=${encodeURIComponent(msg)}`}>{t("Email it instead")}</a>
            </div>
            <div className="iq-alt" data-rise>
              <button type="button" className="iq-back" onClick={back}>{t("Back")}</button>
              <button type="button" onClick={copy}>{copied ? t('Copied') : t('Copy message')}</button>
              <button type="button" onClick={() => { setMsg(compose(a)); setCopied(false) }}>{t("Reset to my answers")}</button>
            </div>
          </>)}
        </div>

        {step < total && (
          <div className="iq-nav iqx-nav">
            {step > 0 ? <button type="button" className="iq-back" onClick={back}>{t("Back")}</button> : <span />}
            <span className="iqx-enter" aria-hidden="true">{t("press")} <kbd>{t("Enter")}</kbd></span>
            <button type="button" className={`rh-cta iq-next${ok ? '' : ' soft'}`} aria-disabled={!ok} onClick={next}>
              {step === total - 1 ? t('Preview message') : step === 1 && !a.modules.length ? t('Skip for now') : t('Next')}<span className="rh-cta-i" aria-hidden="true">→</span>
            </button>
          </div>
        )}
      </main>
    </div>
  )
}
