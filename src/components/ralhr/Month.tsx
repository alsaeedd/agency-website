import { useEffect, useRef, useState, type ReactNode } from 'react'
import { t } from './t'
import { calm, money } from './charts'
import { EMPLOYER_LADDER } from './data'

// "A month at a Bahrain company": five chapters, each with a small live UI.

function useOnView(cb: () => void) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el || !('IntersectionObserver' in window)) { cb(); return }
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { cb(); io.disconnect() } }, { threshold: 0.45 })
    io.observe(el)
    return () => io.disconnect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return ref
}

// Bahrain end of service: old rules up to March 2024, monthly SIO payments since.
function eosb(years: number, basic: number) {
  const newMonths = Math.min(31, Math.round(years * 12))
  const oldYears = Math.max(0, years - newMonths / 12)
  const oldDays = 15 * Math.min(oldYears, 3) + 30 * Math.max(oldYears - 3, 0)
  const oldAmt = (basic / 30) * oldDays
  let newAmt = 0
  for (let m = 0; m < newMonths; m++) newAmt += basic * (oldYears + m / 12 < 3 ? 0.042 : 0.084)
  return { oldAmt, newAmt, total: oldAmt + newAmt, oldDays }
}

function Onboard() {
  const [cpr, setCpr] = useState('910412275')
  const [iban, setIban] = useState('BH67 BMAG 0000 1299 1234 56')
  const [bh, setBh] = useState(true)
  const cprOk = /^\d{9}$/.test(cpr.replace(/\s/g, ''))
  const ibOk = /^BH\d{2}[A-Z]{4}[A-Z0-9]{14}$/.test(iban.replace(/\s/g, '').toUpperCase())
  return (
    <div className="mu">
      <div className="mu-bar"><b>{t("New starter")}</b><span>{t("Step 2 of 3")}</span></div>
      <div className="mu-person"><span className="mu-av">FJ</span><span><b>{t("Fatima Janahi")}</b><small>{t("HR Officer · starts Thursday 1 October")}</small></span></div>
      <label className="mu-f"><span>{t("CPR number")}</span><input value={cpr} onChange={(e) => setCpr(e.target.value)} inputMode="numeric" maxLength={11} spellCheck={false} /><i className={cprOk ? 'ok' : 'no'} aria-hidden="true">{cprOk ? '✓' : '!'}</i></label>
      <label className="mu-f"><span>{t("IBAN")}</span><input value={iban} onChange={(e) => setIban(e.target.value)} maxLength={34} spellCheck={false} /><i className={ibOk ? 'ok' : 'no'} aria-hidden="true">{ibOk ? '✓' : '!'}</i></label>
      <div className="mu-seg" role="group" aria-label={t("Nationality")}>
        <button type="button" aria-pressed={bh} onClick={() => setBh(true)}>{t("Bahraini")}</button>
        <button type="button" aria-pressed={!bh} onClick={() => setBh(false)}>{t("Expat")}</button>
      </div>
      <ul className="mu-checks" aria-live="polite">
        <li className={cprOk ? 'ok' : 'no'}>{cprOk ? t('CPR looks right') : t('A CPR number has 9 digits')}</li>
        <li className={ibOk ? 'ok' : 'no'}>{ibOk ? t('Bahrain IBAN, 22 characters') : t('Bahrain IBANs start with BH and have 22 characters')}</li>
        <li className="ok">{bh ? t('SIO set: 8% from her salary, 18% from you') : t('SIO set: 1% from her salary, 3% from you')}</li>
        <li className="ok">{t("30 days annual leave, from her contract")}</li>
      </ul>
    </div>
  )
}

function Leave() {
  const [st, setSt] = useState<'wait' | 'ok' | 'no'>('wait')
  const left = st === 'ok' ? 18 : 21
  return (
    <div className="mu mu-phone">
      <p className="mu-ph-top" aria-hidden="true"><span>09:12</span><i /></p>
      <div className="mu-card">
        <p className="mu-k">{t("Leave request")}</p>
        <div className="mu-person"><span className="mu-av">NA</span><span><b>{t("Noor Al Sayed")}</b><small>{t("Site Supervisor, Sitra")}</small></span></div>
        <p className="mu-what"><b>{t("Annual leave, 3 days")}</b><span>{t("Sunday 15 to Tuesday 17 November")}</span></p>
        <div className="mu-bal"><span>{t("Balance after this")}</span><b className="tnum">{t('{0} of 30 days', left)}</b><em><i style={{ width: (left / 30) * 100 + '%' }} /></em></div>
        {st === 'wait' ? (
          <div className="mu-acts"><button type="button" className="mu-no" onClick={() => setSt('no')}>{t("Decline")}</button><button type="button" className="mu-yes" onClick={() => setSt('ok')}>{t("Approve")}</button></div>
        ) : (
          <div className={'mu-done ' + st} aria-live="polite">
            <b>{st === 'ok' ? t('Approved') : t('Declined')}</b>
            <span>{st === 'ok' ? t('Noor gets a notification. HR sees it next.') : t('Noor gets a notification with your reason.')}</span>
            <button type="button" onClick={() => setSt('wait')}>{t("Undo")}</button>
          </div>
        )}
      </div>
    </div>
  )
}

const QA = [
  { q: t('When does my work permit expire?'), a: t('On 20 November, 12 days from now. HR already has a reminder, so you do not need to do anything yet.'), src: t('Your documents') },
  { q: 'كم يوم إجازة باقي لي؟', a: 'باقي لك 18 يوم إجازة سنوية. آخر إجازة أخذتها كانت في أغسطس.', src: t('Leave balance') },
  { q: 'abi shahadat ratib lil bank', a: 'تم. طلبت لك شهادة راتب بالإنجليزي للبنك، وبتوصلك في التطبيق خلال يوم عمل.', src: t('Letter requests') },
]
const isAr = (s: string) => /[؀-ۿ]/.test(s)
type Msg = { me: boolean; t: string; src?: string }
// Seeded with one full exchange so the card never sits empty before a visitor taps.
const SEED: Msg[] = [
  { me: false, t: 'هلا! اسألني عن إجازتك أو راتبك أو أي ورقة تحتاجها.' },
  { me: true, t: QA[0].q },
  { me: false, t: QA[0].a, src: QA[0].src },
]

function Ask() {
  const [log, setLog] = useState<Msg[]>(SEED)
  const [busy, setBusy] = useState(false)
  const [asked, setAsked] = useState<number[]>([0])
  const ask = (i: number) => {
    if (busy) return
    setAsked((a) => (a.includes(i) ? a : [...a, i]))
    setLog((l) => [...l.slice(-2), { me: true, t: QA[i].q }])
    setBusy(true)
    window.setTimeout(() => { setLog((l) => [...l, { me: false, t: QA[i].a, src: QA[i].src }]); setBusy(false) }, calm() ? 0 : 900)
  }
  return (
    <div className="mu mu-chat">
      <div className="mu-bar"><b>{t("Ask RAL")}</b><span>{t("Demo answers")}</span></div>
      <div className="mu-log" aria-live="polite">
        {log.map((m, i) => (
          <p key={i + m.t} className={'mu-msg' + (m.me ? ' me' : '')} dir={isAr(m.t) ? 'rtl' : 'ltr'} lang={isAr(m.t) ? 'ar' : 'en'}>
            {m.t}{m.src && <small className="mu-src">{t('From')}: <span dir="ltr" lang="en">{m.src}</span></small>}
          </p>
        ))}
        {busy && <p className="mu-msg typing" aria-label={t("Ask RAL is typing")}><i /><i /><i /></p>}
      </div>
      <p className="mu-try">{t("Try one, in any language:")}</p>
      <div className="mu-chips">{QA.map((x, i) => <button key={x.q} type="button" dir="auto" className={asked.includes(i) ? 'done' : undefined} onClick={() => ask(i)} disabled={busy}>{x.q}</button>)}</div>
    </div>
  )
}

const COLS = ['CPR', 'Name', 'Bank', 'IBAN', 'Month', 'Basic', 'Allowances', 'Deductions', 'Net pay', 'Days worked']
function Wps() {
  const [n, setN] = useState(COLS.length)
  const [running, setRunning] = useState(false)
  const timer = useRef(0)
  const run = () => {
    clearTimeout(timer.current)
    if (calm()) { setN(COLS.length); return }
    setN(0); setRunning(true)
    let k = 0
    const tick = () => { k++; setN(k); if (k < COLS.length) timer.current = window.setTimeout(tick, 150); else setRunning(false) }
    timer.current = window.setTimeout(tick, 250)
  }
  const ref = useOnView(run)
  useEffect(() => () => clearTimeout(timer.current), [])
  const done = n === COLS.length
  return (
    <div className="mu" ref={ref}>
      <div className="mu-bar"><b>{t("WPS salary file, October")}</b><span className="tnum">{t('{0}/10 checked', n)}</span></div>
      <ul className="mu-cols">{COLS.map((c, i) => <li key={c} className={i < n ? 'ok' : ''}><i aria-hidden="true">{i < n ? '✓' : ''}</i>{t(c)}</li>)}</ul>
      <div className={'mu-file' + (done ? ' on' : '')}>
        <span className="mu-file-i">{t("TXT")}</span>
        <span><b>WPS_OCT_2026.txt</b><small>{done ? t('98 rows, every one checked. Ready for your bank.') : t('Checking every row…')}</small></span>
      </div>
      <button type="button" className="mu-go" onClick={run} disabled={running}>{running ? t('Checking…') : t('Build it again')}</button>
    </div>
  )
}

function Eos() {
  const [y, setY] = useState(6)
  const [basic, setBasic] = useState(600)
  const r = eosb(y, basic)
  const oldPct = r.total ? (r.oldAmt / r.total) * 100 : 0
  return (
    <div className="mu">
      <div className="mu-bar"><b>{t("Final settlement")}</b><span>{t("Mahmoud Fathy, expat")}</span></div>
      <label className="mu-range"><span>{t("Years of service")} <b className="tnum">{y}</b></span>
        <input type="range" min={1} max={20} step={0.5} value={y} onChange={(e) => setY(+e.target.value)} style={{ backgroundSize: ((y - 1) / 19) * 100 + '% 100%' }} />
      </label>
      <div className="mu-seg" role="group" aria-label={t("Basic salary")}>
        {[400, 600, 900].map((b) => <button key={b} type="button" aria-pressed={basic === b} onClick={() => setBasic(b)}>{t('BD {0} basic', b)}</button>)}
      </div>
      <p className="mu-total"><small>{t("End of service due")}</small><b className="tnum">{t('BD {0}', money(r.total, 3))}</b></p>
      <div className="mu-split" aria-hidden="true"><i style={{ width: oldPct + '%' }} /><i /></div>
      <dl className="mu-dl">
        <div><dt><i className="a" />{t('Before March 2024, {0} days', Math.round(r.oldDays))}</dt><dd className="tnum">{t('BD {0}', money(r.oldAmt, 3))}</dd></div>
        <div><dt><i className="b" />{t("Since March 2024, paid monthly to SIO")}</dt><dd className="tnum">{t('BD {0}', money(r.newAmt, 3))}</dd></div>
      </dl>
    </div>
  )
}

const EVENTS: Record<number, string> = { 1: 'Starts', 9: 'Leave', 14: 'Ask RAL', 25: 'Payday', 31: 'Leaves' }
// October 2026 at a glance: the five chapter days are lit and jump to their chapter.
function Cal() {
  return (
    <ol className="hp-cal hp-in" aria-label={t("October 2026")}>
      {Array.from({ length: 31 }, (_, i) => {
        const d = i + 1, ev = EVENTS[d], wd = (d + 3) % 7
        return (
          <li key={d} className={wd >= 5 ? 'we' : undefined}>
            {ev
              ? <a href={'#oct-' + String(d).padStart(2, '0')} className={d === 25 ? 'pay' : undefined} aria-label={d + ' ' + t('October') + ': ' + t(ev)}>{d}<small>{t(ev)}</small></a>
              : <span aria-hidden="true">{d}</span>}
          </li>
        )
      })}
    </ol>
  )
}

function Ch({ n, day, title, children, ui }: { n: string; day: string; title: string; children: ReactNode; ui: ReactNode }) {
  return (
    <article className="hp-ch hp-rv" id={'oct-' + n}>
      <div className="hp-ch-copy">
        <span className="hp-ch-n" aria-hidden="true">{n}</span>
        <p className="hp-ch-day hp-in">{day}</p>
        <h3 className="hp-in">{title}</h3>
        <p className="hp-in">{children}</p>
      </div>
      <div className="hp-ch-ui hp-in">{ui}</div>
    </article>
  )
}

export function Month() {
  return (
    <section id="month" className="hp-sec hp-month">
      <div className="hp-head hp-rv">
        <p className="hp-eyebrow hp-in">{t("A month with RAL HR")}</p>
        <h2 className="hp-in">{t("October at a Bahrain company.")} <span className="serif">{t("Every chore, handled.")}</span></h2>
        <p className="hp-in">{t("Follow one month at our demo company: 98 people across Seef, Sitra and Juffair. Everything below is live. Type in it, tap it, slide it.")}</p>
      </div>
      <div className="hp-rv"><Cal /></div>
      <div className="hp-chs">
        <Ch n="01" day={t("Thursday 1 October")} title={t("Fatima starts today.")} ui={<Onboard />}>
          {t("Add a new starter with her CPR and IBAN. RAL HR checks both as you type, sets up her leave, SIO and WPS details, and her app invite is on her phone before lunch.")}
        </Ch>
        <Ch n="09" day={t("Friday 9 October")} title={t("Leave, approved from the car park.")} ui={<Leave />}>
          {t("Noor asks for three days off in the app. Her manager taps approve on his phone, HR sees it next, and her balance updates on its own. No forms, no chasing.")}
        </Ch>
        <Ch n="14" day={t("Wednesday 14 October")} title={t("Questions, answered in Arabic.")} ui={<Ask />}>
          {t("Staff ask the way they talk: Gulf Arabic, English, even Arabizi. Ask RAL answers from your policies and their own records, so HR stops answering the same question ten times a week.")}
        </Ch>
        <Ch n="25" day={t("Sunday 25 October")} title={t("Payday, and a WPS file your bank accepts.")} ui={<Wps />}>
          {t("Payroll runs with SIO worked out for every Bahraini and expat. Then RAL HR builds the LMRA salary file and checks all 10 columns on every row. You upload it to your bank as usual. We never touch the money.")}
        </Ch>
        <Ch n="31" day={t("Saturday 31 October")} title={t("Mahmoud leaves. His gratuity is ready.")} ui={<Eos />}>
          {t("End of service is worked out for you, split between the old rules and the monthly SIO payments that started in March 2024. Slide the years and watch it update.")}
        </Ch>
      </div>
    </section>
  )
}

export function Rules() {
  return (
    <section id="rules" className="hp-sec hp-rv">
      <div className="hp-head">
        <p className="hp-eyebrow hp-in">{t("The rules, built in")}</p>
        <h2 className="hp-in">{t("The numbers Bahrain payroll")} <span className="serif">{t("runs on.")}</span></h2>
        <p className="hp-in">{t("Every one of these is in the product and checked on every run. When a rate changes, we update it. You do not have to.")}</p>
      </div>
      <div className="hp-rules">
        <div className="hp-rule hp-in"><b className="hp-rule-n tnum">8<small>%</small></b><p>{t("Bahraini staff pay into SIO from their salary, every month.")}</p></div>
        <div className="hp-rule hp-in"><b className="hp-rule-n tnum">1<small>%</small><em>+</em>3<small>%</small></b><p>{t("SIO for expat staff, from them and from you.")}</p></div>
        <div className="hp-rule hp-rule-wide hp-in">
          <div><b className="hp-rule-n tnum">18<small>%</small></b><p>{t("Your share for Bahraini staff in 2026, going up one point a year until 2028.")}</p></div>
          <div className="hp-ladder">
            {EMPLOYER_LADDER.map((l) => <span key={l.y} className={l.y === '2026' ? 'now' : ''}><b className="tnum">{l.r}%</b><i style={{ height: ((l.r - 14) / 6) * 100 + '%' }} /><small>{l.y}</small></span>)}
          </div>
        </div>
        <div className="hp-rule hp-in"><b className="hp-rule-n tnum">10<small>/10</small></b><p>{t("WPS columns checked on every row, before your bank ever sees the file.")}</p></div>
        <div className="hp-rule hp-in"><b className="hp-rule-n ar" lang="ar">عربي</b><p>{t("Arabic and English on every screen, payslip and report, with right to left done properly.")}</p></div>
      </div>
    </section>
  )
}
