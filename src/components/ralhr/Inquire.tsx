import { useEffect, useState } from 'react'
import './RalHrPage.css'

const WA = 'https://wa.me/97366386602?text='
const KEY = 'ralhr-inquire'
const SIZES = ['1 to 10', '11 to 50', '51 to 200', '200+']
const MODULES = ['Payroll + WPS', 'SIO + end of service', 'Leave + attendance', 'Ask RAL', 'Documents + expiry alerts', 'Hiring + onboarding', 'Reviews', 'Phone app for staff']
const TIMES = ['This month', 'This quarter', 'Just exploring']

type Answers = { size: string; modules: string[]; time: string; name: string; company: string }
const EMPTY: Answers = { size: '', modules: [], time: '', name: '', company: '' }

function load(): Answers {
  try { return { ...EMPTY, ...JSON.parse(sessionStorage.getItem(KEY) || '{}') } } catch { return EMPTY }
}

function compose(a: Answers): string {
  return [
    `Hi RAL, I'd like a demo of RAL HR.`,
    ``,
    `Name: ${a.name}`,
    `Company: ${a.company}`,
    `Employees: ${a.size}`,
    `Interested in: ${a.modules.join(', ') || 'Not sure yet'}`,
    `Timeline: ${a.time}`,
  ].join('\n')
}

export default function Inquire() {
  const [step, setStep] = useState(0)
  const [a, setA] = useState<Answers>(EMPTY)
  const [msg, setMsg] = useState('')
  const [copied, setCopied] = useState(false)

  useEffect(() => { setA(load()) }, [])
  useEffect(() => { try { sessionStorage.setItem(KEY, JSON.stringify(a)) } catch { /* private mode */ } }, [a])

  const set = (p: Partial<Answers>) => setA((v) => ({ ...v, ...p }))
  const toggle = (m: string) => set({ modules: a.modules.includes(m) ? a.modules.filter((x) => x !== m) : [...a.modules, m] })
  const ok = [!!a.size, true, !!a.time, a.name.trim().length > 1 && a.company.trim().length > 1][step] ?? true
  const next = () => { if (step === 3) setMsg(compose(a)); setStep((s) => s + 1) }
  const copy = () => { navigator.clipboard?.writeText(msg).then(() => setCopied(true), () => {}) }

  const total = 4
  const shown = Math.min(step + 1, total)

  return (
    <div className="rh">
      <header className="rh-top">
        <a href="/ral-hr/" className="rh-brand">RAL <span>HR</span></a>
        <a className="rh-top-cta" href="/ral-hr/">Back to RAL HR</a>
      </header>
      <main className="iq">
        <div className="iq-progress">
          <span>{step < total ? `${shown} of ${total}` : 'Ready'}</span>
          <div className="iq-bar"><i style={{ transform: `scaleX(${Math.min(step, total) / total})` }} /></div>
        </div>

        {step === 0 && (<>
          <h1>How many people do you employ?</h1>
          <p className="iq-lead">Pricing is per employee, so this sizes the setup.</p>
          <div className="iq-opts">{SIZES.map((s) => <button key={s} type="button" className={`iq-opt${a.size === s ? ' on' : ''}`} onClick={() => set({ size: s })}>{s}</button>)}</div>
        </>)}

        {step === 1 && (<>
          <h1>What do you need most?</h1>
          <p className="iq-lead">Pick any. Skip if you are not sure yet.</p>
          <div className="iq-opts">{MODULES.map((m) => <button key={m} type="button" className={`iq-opt${a.modules.includes(m) ? ' on' : ''}`} onClick={() => toggle(m)}>{m}</button>)}</div>
        </>)}

        {step === 2 && (<>
          <h1>When would you like to start?</h1>
          <p className="iq-lead">No pressure either way.</p>
          <div className="iq-opts">{TIMES.map((t) => <button key={t} type="button" className={`iq-opt${a.time === t ? ' on' : ''}`} onClick={() => set({ time: t })}>{t}</button>)}</div>
        </>)}

        {step === 3 && (<>
          <h1>Who should we talk to?</h1>
          <p className="iq-lead">Last step. Nothing is sent until you press send.</p>
          <div className="iq-fields">
            <label>Your name<input value={a.name} onChange={(e) => set({ name: e.target.value })} autoComplete="name" /></label>
            <label>Company<input value={a.company} onChange={(e) => set({ company: e.target.value })} autoComplete="organization" /></label>
          </div>
        </>)}

        {step === 4 && (<>
          <h1>Here is your message.</h1>
          <p className="iq-lead">Edit anything, then send it on WhatsApp.</p>
          <textarea value={msg} onChange={(e) => { setMsg(e.target.value); setCopied(false) }} aria-label="Your WhatsApp message" />
          <div className="iq-nav">
            <button type="button" className="iq-back" onClick={() => setStep(3)}>Back</button>
            <a className="rh-cta" href={WA + encodeURIComponent(msg)} target="_blank" rel="noopener">Send on WhatsApp<span className="rh-cta-i" aria-hidden="true">↗</span></a>
          </div>
          <div className="iq-alt">
            <button type="button" onClick={copy}>{copied ? 'Copied' : 'Copy message'}</button>
            <a href={`mailto:info@raltech.dev?subject=${encodeURIComponent('RAL HR demo')}&body=${encodeURIComponent(msg)}`}>Email it instead</a>
          </div>
        </>)}

        {step < 4 && (
          <div className="iq-nav">
            {step > 0 ? <button type="button" className="iq-back" onClick={() => setStep(step - 1)}>Back</button> : <span />}
            <button type="button" className="rh-cta iq-next" disabled={!ok} onClick={next}>{step === 3 ? 'Preview message' : 'Next'}<span className="rh-cta-i" aria-hidden="true">→</span></button>
          </div>
        )}
      </main>
    </div>
  )
}
