import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { CountUp, Spark, useGrow, calm, money, useIsoLayoutEffect } from './charts'
import { KPIS, DEPARTMENTS, EXPIRING, FEED, PAYROLL, WPS_ROWS, PAYSLIP, APPROVALS, LEAVE_BALANCE, ATTENDANCE_GRID, ATTENDANCE_KPIS } from './data'

export type Device = 'web' | 'tablet' | 'phone'
export type TabId = 'home' | 'payroll' | 'leave' | 'attendance' | 'eosb' | 'ask'

export type DemoState = {
  payStage: number // 1 computed, 2 approved, 3 WPS checked
  confirmOpen: boolean
  decided: string[]
  checkedIn: boolean
  eosbYears: number
  eosbBasic: number
  chat: number // conversation step, 0 to 5
}

export type Act = {
  approveRun: () => void
  confirmRun: () => void
  cancelRun: () => void
  checkWps: () => void
  decide: (id: string) => void
  checkIn: () => void
  setEosb: (years: number, basic: number) => void
  say: (step: number) => void
  go: (tab: TabId) => void
}

type P = { s: DemoState; act: Act; device: Device }

/* ---------------- Home ---------------- */
export function HomeScreen({ device, act }: P) {
  const [feed, setFeed] = useState(FEED.slice(0, 4))
  const idx = useRef(4)
  const listRef = useRef<HTMLUListElement>(null)
  useEffect(() => {
    if (calm()) return
    const tick = () => {
      if (document.hidden) return
      const next = FEED[idx.current % FEED.length]
      idx.current += 1
      setFeed((f) => [next, ...f.slice(0, 3)])
    }
    const id = window.setInterval(tick, 4200)
    return () => window.clearInterval(id)
  }, [])
  useIsoLayoutEffect(() => {
    const first = listRef.current?.firstElementChild
    if (!first || calm() || idx.current === 4) return
    gsap.fromTo(first, { y: -8, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.5, ease: 'power3.out' })
  }, [feed])
  return (
    <div className="ra-screen ra-home">
      <div className="ra-greet">
        <div>
          <p className="ra-muted">Saturday 7 November</p>
          <h3 className="ra-h">Good morning, Aisha.</h3>
        </div>
        <button className="ra-btn ra-btn-primary" data-g="review" onClick={() => act.go('leave')}>Review approvals</button>
      </div>
      <div className="ra-kpis">
        {KPIS.map((k) => (
          <div className={`ra-kpi tone-${k.tone}`} key={k.key}>
            <p className="ra-kpi-label">{k.label}</p>
            <p className="ra-kpi-num"><CountUp value={k.value} prefix={k.prefix} /></p>
            <p className="ra-kpi-note">{k.note}</p>
            <Spark data={k.spark} tone={k.tone} />
          </div>
        ))}
      </div>
      <div className="ra-grid2">
        <section className="ra-card">
          <h4 className="ra-card-h">Expiring soon</h4>
          <ul className="ra-list">
            {EXPIRING.map((e) => (
              <li key={e.who}>
                <span><b>{e.who}</b><span className="ra-muted"> {e.what}</span></span>
                <span className={`ra-chip ${e.days <= 30 ? 'chip-warn' : ''}`}>{e.days} days</span>
              </li>
            ))}
          </ul>
        </section>
        <section className="ra-card ra-feed-card">
          <h4 className="ra-card-h"><span className="ra-live" />Live today</h4>
          <ul className="ra-feed" ref={listRef}>
            {feed.map((f, i) => <li key={f + i}>{f}</li>)}
          </ul>
        </section>
        {device === 'web' && (
          <section className="ra-card ra-depts">
            <h4 className="ra-card-h">People by department</h4>
            <Depts />
          </section>
        )}
      </div>
    </div>
  )
}

function Depts() {
  const ref = useGrow('.ra-bar-fill')
  const max = DEPARTMENTS[0].n
  return (
    <div ref={ref} className="ra-bars">
      {DEPARTMENTS.map((d) => (
        <div className="ra-bar" key={d.name}>
          <span className="ra-bar-label">{d.name}</span>
          <span className="ra-bar-track"><span className="ra-bar-fill" style={{ width: `${(d.n / max) * 100}%` }} /></span>
          <span className="ra-bar-val tnum">{d.n}</span>
        </div>
      ))}
    </div>
  )
}

/* ---------------- Payroll ---------------- */
export function PayrollScreen({ s, act, device }: P) {
  const wf = useGrow('.ra-wf-bar')
  const g = PAYROLL.gross
  return (
    <div className="ra-screen ra-pay">
      <div className="ra-greet">
        <div>
          <p className="ra-muted">Payroll run</p>
          <h3 className="ra-h">{PAYROLL.month}</h3>
        </div>
        <div className="ra-actions">
          {s.payStage < 2 && <button className="ra-btn ra-btn-primary" data-g="approve-run" onClick={act.approveRun}>Approve run</button>}
          {s.payStage === 2 && <button className="ra-btn ra-btn-primary" data-g="check-wps" onClick={act.checkWps}>Check WPS file</button>}
          {s.payStage >= 3 && <button className="ra-btn ra-btn-ghost">Download WPS file</button>}
        </div>
      </div>
      <ol className="ra-steps">
        {PAYROLL.steps.map((st, i) => {
          const reached = i <= (s.payStage >= 3 ? 4 : s.payStage)
          return <li key={st} className={reached ? 'on' : ''}><span className="ra-step-dot">{reached ? '✓' : i + 1}</span>{st}</li>
        })}
      </ol>
      {s.payStage >= 3 && (
        <section className="ra-card ra-wps">
          <div className="ra-wps-head">
            <span className="ra-ok">✓</span>
            <div>
              <b>Every row passes LMRA validation.</b>
              <p className="ra-muted">WPS salary file, 10 columns, {PAYROLL.people} rows</p>
            </div>
          </div>
          <table className="ra-table ra-wps-table">
            <thead><tr><th>CPR</th><th>Worker name</th>{device !== 'phone' && <th>IBAN</th>}<th className="r">Total BHD</th></tr></thead>
            <tbody>
              {WPS_ROWS.map((r) => <tr key={r.cpr}><td className="tnum">{r.cpr}</td><td>{r.name}</td>{device !== 'phone' && <td className="tnum">{r.iban}</td>}<td className="tnum r">{r.total}</td></tr>)}
            </tbody>
          </table>
        </section>
      )}
      <div className="ra-grid2 ra-pay-grid">
        <section className="ra-card">
          <h4 className="ra-card-h">Gross to net, {PAYROLL.people} people</h4>
          <div className="ra-wf" ref={wf}>
            <WfRow label="Gross" value={g} start={0} width={1} />
            <WfRow label="Deductions" value={-PAYROLL.deductions} start={(g - PAYROLL.deductions) / g} width={PAYROLL.deductions / g} minus />
            <WfRow label="Net pay" value={PAYROLL.net} start={0} width={PAYROLL.net / g} net />
          </div>
          <p className="ra-foot">SIO: Bahraini staff 8%, expat staff 1%, expat employer 3%. A wrong rate is refused.</p>
        </section>
        {device !== 'phone' && (
          <section className="ra-card">
            <h4 className="ra-card-h">Payslip, {PAYSLIP.who}</h4>
            <table className="ra-table">
              <tbody>
                {PAYSLIP.lines.map((l) => <tr key={l.label}><td>{l.label}</td><td className="ra-rule">{l.rule}</td><td className="tnum r">{l.amount}</td></tr>)}
                <tr className="ra-sub"><td>Gross</td><td /><td className="tnum r">{PAYSLIP.gross}</td></tr>
                <tr><td>SIO employee</td><td className="ra-rule">8%, Bahraini</td><td className="tnum r">-{PAYSLIP.sio}</td></tr>
                <tr className="ra-total"><td>Net pay</td><td /><td className="tnum r">{PAYSLIP.net} BHD</td></tr>
              </tbody>
            </table>
          </section>
        )}
      </div>
      {s.confirmOpen && (
        <div className="ra-dialog-wrap">
          <div className="ra-dialog" role="dialog" aria-label="Confirm payroll approval">
            <h4>Approve October payroll?</h4>
            <p>This action moves money. Confirm it is you.</p>
            <div className="ra-pass" aria-hidden="true">••••••••••</div>
            <div className="ra-dialog-actions">
              <button className="ra-btn ra-btn-ghost" onClick={act.cancelRun}>Cancel</button>
              <button className="ra-btn ra-btn-primary" data-g="confirm-run" onClick={act.confirmRun}>Confirm</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function WfRow({ label, value, start, width, minus, net }: { label: string; value: number; start: number; width: number; minus?: boolean; net?: boolean }) {
  return (
    <div className="ra-wf-row">
      <span className="ra-wf-label">{label}</span>
      <span className="ra-wf-track">
        <span className={`ra-wf-bar ${minus ? 'minus' : ''} ${net ? 'net' : ''}`} style={{ left: `${start * 100}%`, width: `${Math.max(width * 100, 1.5)}%` }} />
      </span>
      <span className={`ra-wf-val tnum ${net ? 'net' : ''}`}>
        {net ? <CountUp value={value} suffix=" BHD" duration={1.6} /> : `${value < 0 ? '-' : ''}${money(Math.abs(value))} BHD`}
      </span>
    </div>
  )
}

/* ---------------- Leave approvals ---------------- */
export function LeaveScreen({ s, act }: P) {
  const waiting = APPROVALS.filter((a) => !s.decided.includes(a.id))
  const b = LEAVE_BALANCE
  return (
    <div className="ra-screen ra-leave">
      <div className="ra-greet">
        <div>
          <p className="ra-muted">Approvals</p>
          <h3 className="ra-h">Waiting for you <span className="ra-count tnum">{waiting.length}</span></h3>
        </div>
      </div>
      <div className="ra-approvals">
        {waiting.length === 0 && (
          <div className="ra-empty">
            <span className="ra-ok">✓</span>
            <p><b>Nothing waiting for you.</b> Enjoy the quiet.</p>
          </div>
        )}
        {waiting.map((a) => (
          <article className="ra-card ra-approval" key={a.id}>
            <div className="ra-approval-top">
              <span className="ra-avatar">{a.who.split(' ').map((w) => w[0]).slice(0, 2).join('')}</span>
              <div>
                <b>{a.who}</b>
                <p className="ra-muted">{a.role}</p>
              </div>
            </div>
            <p className="ra-approval-what"><b>{a.what}</b> <span className="ra-muted">{a.detail}</span></p>
            <ol className="ra-chain">
              <li className="on">1. {a.stage1}, approved</li>
              <li className="you">2. {a.stage2}, you</li>
            </ol>
            <div className="ra-dialog-actions">
              <button className="ra-btn ra-btn-ghost" onClick={() => act.decide(a.id)}>Reject</button>
              <button className="ra-btn ra-btn-primary" data-g={`approve-${a.id}`} onClick={() => act.decide(a.id)}>Approve</button>
            </div>
          </article>
        ))}
      </div>
      <section className="ra-card ra-balance">
        <h4 className="ra-card-h">Noor's annual leave, 2026</h4>
        <div className="ra-bullet" aria-label={`${b.used} used, ${b.pending} pending, of ${b.total}`}>
          <span className="ra-bullet-used" style={{ width: `${(b.used / b.total) * 100}%` }} />
          <span className="ra-bullet-pend" style={{ left: `${(b.used / b.total) * 100}%`, width: `${(b.pending / b.total) * 100}%` }} />
        </div>
        <p className="ra-bullet-legend"><span><b className="tnum">{b.total - b.used - b.pending}</b> available</span><span>{b.used} used</span><span>{b.pending} pending</span><span>{b.total} a year</span></p>
      </section>
    </div>
  )
}

/* ---------------- Attendance ---------------- */
export function AttendanceScreen({ s, act }: P) {
  const gridRef = useRef<HTMLDivElement>(null)
  useIsoLayoutEffect(() => {
    if (!gridRef.current || calm()) return
    const t = gsap.from(gridRef.current.children, { autoAlpha: 0, scale: 0.6, duration: 0.4, ease: 'power3.out', stagger: { each: 0.012, grid: [5, 7], from: 'start' } })
    return () => { t.kill() }
  }, [])
  const days = ['S', 'M', 'T', 'W', 'T', 'F', 'S']
  return (
    <div className="ra-screen ra-att">
      <section className={`ra-card ra-checkin ${s.checkedIn ? 'in' : ''}`}>
        <div>
          <p className="ra-muted">{s.checkedIn ? 'Checked in at' : 'Good morning, Fatima'}</p>
          <p className="ra-checkin-time tnum">{s.checkedIn ? '07:02' : 'Not checked in'}</p>
          <p className="ra-geo"><span className={`ra-geo-dot ${s.checkedIn ? 'on' : ''}`} />{s.checkedIn ? 'On site, Seef HQ (150 m radius)' : 'Seef HQ, 150 m radius'}</p>
        </div>
        <button className={`ra-btn ${s.checkedIn ? 'ra-btn-ghost' : 'ra-btn-primary'} ra-btn-lg`} data-g="check-in" onClick={act.checkIn}>{s.checkedIn ? 'Check out' : 'Check in'}</button>
      </section>
      <div className="ra-kpis ra-kpis-att">
        {ATTENDANCE_KPIS.map((k) => (
          <div className={`ra-kpi tone-${k.tone}`} key={k.label}>
            <p className="ra-kpi-label">{k.label}</p>
            <p className="ra-kpi-num"><CountUp value={k.value} suffix={'suffix' in k ? k.suffix : ''} /></p>
          </div>
        ))}
      </div>
      <section className="ra-card">
        <h4 className="ra-card-h">November, Sunday to Thursday week</h4>
        <div className="ra-heat-days">{days.map((d, i) => <span key={i}>{d}</span>)}</div>
        <div className="ra-heat" ref={gridRef}>
          {ATTENDANCE_GRID.map((v, i) => <span key={i} className={`h h${v < 0 ? 'x' : v}`} />)}
        </div>
        <p className="ra-heat-legend"><span><i className="h h1" />Present</span><span><i className="h h2" />Late</span><span><i className="h h3" />Leave</span><span><i className="h h0" />Fri, Sat off</span></p>
      </section>
    </div>
  )
}

/* ---------------- End of service ---------------- */
// Illustrative split for an expat leaving on 31 Oct 2026 (basic wage only):
// service before 1 March 2024 accrues under Labour Law Art. 116 (15 days a
// year for the first 3 years, 30 after); from March 2024 SIO collects 4.2% a
// month (first 3 years of service) or 8.4% (after).
export function eosb(years: number, basic: number) {
  const newMonths = Math.min(32, Math.round(years * 12))
  const oldYears = Math.max(0, years - newMonths / 12)
  const oldDays = 15 * Math.min(oldYears, 3) + 30 * Math.max(oldYears - 3, 0)
  const oldAmt = (basic / 30) * oldDays
  let newAmt = 0
  for (let m = 0; m < newMonths; m++) newAmt += basic * (oldYears + m / 12 < 3 ? 0.042 : 0.084)
  return { oldAmt, newAmt, total: oldAmt + newAmt, oldDays }
}

export function EosbScreen({ s, act }: P) {
  const r = eosb(s.eosbYears, s.eosbBasic)
  const presets = [
    { label: 'Technician, 2 yrs', y: 2, b: 340 },
    { label: 'HVAC tech, 6 yrs', y: 6, b: 380 },
    { label: 'Senior tech, 11 yrs', y: 11, b: 520 },
  ]
  return (
    <div className="ra-screen ra-eosb">
      <div className="ra-greet">
        <div>
          <p className="ra-muted">Final settlement, expat, leaving 31 Oct 2026</p>
          <h3 className="ra-h">End of service, both schemes</h3>
        </div>
      </div>
      <div className="ra-presets">
        {presets.map((p, i) => (
          <button key={p.label} data-g={`preset-${i}`} className={`ra-chip-btn ${s.eosbYears === p.y && s.eosbBasic === p.b ? 'on' : ''}`} onClick={() => act.setEosb(p.y, p.b)}>{p.label}</button>
        ))}
      </div>
      <div className="ra-grid2">
        <section className="ra-card ra-sliders">
          <label>Years of service <b className="tnum">{s.eosbYears}</b>
            <input type="range" min={1} max={20} value={s.eosbYears} onChange={(e) => act.setEosb(+e.target.value, s.eosbBasic)} />
          </label>
          <label>Monthly basic <b className="tnum">{money(s.eosbBasic)} BHD</b>
            <input type="range" min={260} max={3200} step={10} value={s.eosbBasic} onChange={(e) => act.setEosb(s.eosbYears, +e.target.value)} />
          </label>
        </section>
        <section className="ra-card ra-eosb-out">
          <div className="ra-eosb-row"><span>Labour Law Art. 116, to Feb 2024 <em>{money(r.oldDays, 1)} days</em></span><b className="tnum">{money(r.oldAmt, 3)}</b></div>
          <div className="ra-eosb-row"><span>SIO monthly scheme, from Mar 2024 <em>4.2% / 8.4%</em></span><b className="tnum">{money(r.newAmt, 3)}</b></div>
          <div className="ra-eosb-row ra-eosb-total"><span>Total end of service</span><b><CountUp value={r.total} decimals={3} suffix=" BHD" duration={0.6} /></b></div>
          <p className="ra-foot">Illustrative, on basic wage only. The real settlement cites the rule on every line.</p>
        </section>
      </div>
    </div>
  )
}

/* ---------------- Ask RAL ---------------- */
type Msg = { from: 'me' | 'ral'; text: string; dir?: 'rtl'; card?: 'book1' | 'book2' | 'done'; src?: string }

export const ASK_PROMPTS = [
  'How many leave days do I have left?',
  'متى العطلة الرسمية الجاية؟',
  'abi ajaza yom el a7ad',
  'زيد يوم',
]

const HISTORY: Msg[] = [
  { from: 'me', text: 'When does my November payslip come out?' },
  { from: 'ral', text: 'Thursday 26 November. Your net pay is BD 1,240.500 after SIO, paid by WPS to your NBB account.', src: 'Payroll calendar 2026' },
  { from: 'me', text: 'شنو أسوي إذا جوازي بينتهي؟', dir: 'rtl' },
  { from: 'ral', text: 'جوازك ينتهي في ٣ مارس ٢٠٢٧. ارفع صورة الجواز الجديد في المستندات، والموارد البشرية تجدد التأشيرة.', dir: 'rtl', src: 'Documents and expiry' },
  { from: 'me', text: 'who approves my leave?' },
  { from: 'ral', text: 'Khalid Al Zayani, Finance Manager. He usually replies within a day.', src: 'Org chart' },
]

function conversation(step: number): Msg[] {
  const m: Msg[] = []
  if (step >= 1) m.push({ from: 'me', text: ASK_PROMPTS[0] }, { from: 'ral', text: 'You have 18 annual leave days left: 30 a year, 9 used, 3 waiting for approval.', src: 'Leave balance 2026' })
  if (step >= 2) m.push({ from: 'me', text: ASK_PROMPTS[1], dir: 'rtl' }, { from: 'ral', text: 'اليوم الوطني، الأربعاء ١٦ والخميس ١٧ ديسمبر.', dir: 'rtl', src: 'Bahrain holidays 2026' })
  if (step >= 3) m.push({ from: 'me', text: ASK_PROMPTS[2] }, { from: 'ral', text: step >= 4 ? 'Sure. Here is your request:' : 'Sure. Here is your request, check it and confirm:', card: step >= 4 ? undefined : 'book1' })
  if (step >= 4) m.push({ from: 'me', text: ASK_PROMPTS[3], dir: 'rtl' }, { from: 'ral', text: 'تم، صارت يومين:', dir: 'rtl', card: step >= 5 ? 'done' : 'book2' })
  return m
}

export function AskScreen({ s, act }: P) {
  const bodyRef = useRef<HTMLDivElement>(null)
  const msgs = conversation(s.chat)
  useIsoLayoutEffect(() => {
    const el = bodyRef.current
    if (!el) return
    el.scrollTop = el.scrollHeight
    const all = el.querySelectorAll('.ra-msg')
    if (!all.length || calm()) return
    gsap.fromTo([...all].slice(-2), { y: 10, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.45, ease: 'power3.out', stagger: 0.3 })
  }, [s.chat])
  const next = s.chat < 4 ? s.chat : -1
  return (
    <div className="ra-screen ra-ask">
      <div className="ra-ask-head"><b>Ask RAL</b><span className="ra-muted">Mohammed Kanoo, Finance</span></div>
      <div className="ra-ask-body" ref={bodyRef}>
        <p className="ra-ask-day">Yesterday</p>
        {HISTORY.map((m, i) => (
          <div key={`h${i}`} className={`ra-msg ${m.from}`} dir={m.dir}>
            <p>{m.text}</p>
            {m.src && <p className="ra-src" dir="ltr">Source: {m.src}</p>}
          </div>
        ))}
        <p className="ra-ask-day">Today</p>
        {msgs.length === 0 && <p className="ra-ask-hint ra-muted">Ask about your leave, payslip, holidays, manager or policies. Arabic, Arabizi or English.</p>}
        {msgs.map((m, i) => (
          <div key={i} className={`ra-msg ${m.from}`} dir={m.dir}>
            <p>{m.text}</p>
            {(m.card === 'book1' || m.card === 'book2') && (
              <div className="ra-book" dir="ltr">
                <p className="ra-book-type">Annual leave</p>
                <p className="ra-book-dates">{m.card === 'book1' ? 'Sun 15 Nov 2026' : 'Sun 15 to Mon 16 Nov 2026'}</p>
                <p className="ra-muted">Counted: {m.card === 'book1' ? '1 working day' : '2 working days'}, 0 weekend, 0 holiday</p>
                {m.card === 'book2' && (
                  <div className="ra-dialog-actions">
                    <button className="ra-btn ra-btn-ghost" onClick={() => act.say(0)}>Cancel</button>
                    <button className="ra-btn ra-btn-primary" data-g="confirm-leave" onClick={() => act.say(5)}>Confirm</button>
                  </div>
                )}
              </div>
            )}
            {m.card === 'done' && (
              <div className="ra-book ra-book-done" dir="ltr">
                <p><b>Confirmed.</b> Sun 15 to Mon 16 Nov, sent to Khalid Al Zayani.</p>
              </div>
            )}
            {m.src && <p className="ra-src" dir="ltr">Source: {m.src}</p>}
          </div>
        ))}
      </div>
      <div className="ra-ask-chips">
        {next >= 0 && <button data-g="ask-chip" className="ra-chip-btn" dir={next % 2 ? 'rtl' : 'ltr'} onClick={() => act.say(next + 1)}>{ASK_PROMPTS[next]}</button>}
        {s.chat >= 5 && <button className="ra-chip-btn" onClick={() => act.say(0)}>Start over</button>}
        <button className="ra-chip-btn ghost">Send to HR</button>
      </div>
      <div className="ra-ask-input"><span className="ra-muted">Ask about your leave, payslip, holidays...</span><span className="ra-send" aria-hidden="true">↑</span></div>
    </div>
  )
}
