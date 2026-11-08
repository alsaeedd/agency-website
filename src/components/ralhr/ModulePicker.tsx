import { useEffect, useRef, useState } from 'react'
import { ralHrLang as lg } from './t'
import { gsap } from 'gsap'
import { ALL_MODS, CATEGORIES, fitTier, STR, tierName, type Status } from './modules'
import './ModulePicker.css'

const calm = () => typeof window === 'undefined' || window.matchMedia('(prefers-reduced-motion: reduce)').matches
const STATUSES: Status[] = ['live', 'demo', 'soon']

type Props = { value: string[]; onChange: (ids: string[]) => void; animate?: boolean; id?: string }

/** Categorised module picker: every module is a toggle, every category has select all, phones collapse categories. */
export default function ModulePicker({ value, onChange, animate = true, id = 'mp' }: Props) {
  const root = useRef<HTMLDivElement>(null)
  const picked = new Set(value)
  // Phones start with the first category and any category holding a pick open; desktop shows everything.
  const [open, setOpen] = useState<Set<string>>(() => new Set([CATEGORIES[0].id, ...CATEGORIES.filter((c) => c.mods.some((x) => picked.has(x.id))).map((c) => c.id)]))

  useEffect(() => {
    const el = root.current
    if (!el || !animate || calm()) return
    const ctx = gsap.context(() => {
      gsap.from('.mp-bar, .mp-cat', { opacity: 0, y: 18, duration: 0.8, ease: 'expo.out', stagger: 0.1, clearProps: 'opacity,transform' })
    }, el)
    return () => ctx.revert()
  }, [animate])

  // Keep the catalogue order in the value so the message reads the way the page does.
  const commit = (s: Set<string>) => onChange(ALL_MODS.filter((x) => s.has(x.id)).map((x) => x.id))
  const toggle = (mid: string) => { const s = new Set(picked); if (s.has(mid)) s.delete(mid); else s.add(mid); commit(s) }
  const setCat = (ids: string[], on: boolean) => { const s = new Set(picked); ids.forEach((x) => (on ? s.add(x) : s.delete(x))); commit(s) }
  const flip = (cid: string) => setOpen((o) => { const n = new Set(o); if (n.has(cid)) n.delete(cid); else n.add(cid); return n })
  const fit = tierName(fitTier(value))

  return (
    <div ref={root} className="mp" role="group" aria-label={STR.pickerLabel[lg()]}>
      <div className="mp-bar">
        <p className="mp-count" aria-live="polite">
          {value.length
            ? <><b className="tnum">{value.length}</b> {STR.of[lg()]} {ALL_MODS.length} {STR.modules[lg()]} {STR.picked[lg()]}<span className="mp-fit" title={STR.fitsHelp[lg()]}>{STR.fits[lg()]} <b>{fit}</b></span></>
            : STR.nonePicked[lg()]}
        </p>
        <ul className="mp-legend" aria-label={STR.statusKey[lg()]}>
          {STATUSES.map((s) => <li key={s} className={'mp-st mp-st-' + s} title={STR.statusHelp[s][lg()]}><i aria-hidden="true" />{STR.status[s][lg()]}</li>)}
        </ul>
        {value.length > 0 && <button type="button" className="mp-clear" onClick={() => onChange([])}>{STR.clearAll[lg()]}</button>}
      </div>

      <div className="mp-cats">
        {CATEGORIES.map((c) => {
          const ids = c.mods.map((x) => x.id)
          const n = ids.filter((x) => picked.has(x)).length
          const all = n === ids.length
          const isOpen = open.has(c.id)
          const listId = `${id}-${c.id}`
          return (
            <section key={c.id} className={'mp-cat' + (isOpen ? ' open' : '') + (n ? ' has' : '')} aria-labelledby={listId + '-h'}>
              <div className="mp-cat-head">
                <button type="button" className="mp-cat-toggle" aria-expanded={isOpen} aria-controls={listId} onClick={() => flip(c.id)}>
                  <span className="mp-cat-title">
                    <span id={listId + '-h'}>{c.name[lg()]}</span>
                    <small>{c.blurb[lg()]}</small>
                  </span>
                  <span className="mp-cat-n tnum" aria-label={`${n} ${STR.of[lg()]} ${ids.length} ${STR.picked[lg()]}`}>{n}/{ids.length}</span>
                  <span className="mp-chev" aria-hidden="true" />
                </button>
                <button type="button" className="mp-all" aria-pressed={all} onClick={() => setCat(ids, !all)}>
                  {all ? STR.clearCat[lg()] : STR.selectAll[lg()]}<span className="sr-only"> {c.name[lg()]}</span>
                </button>
              </div>
              <div className="mp-list" id={listId}>
                {c.mods.map((x) => {
                  const on = picked.has(x.id)
                  return (
                    <button key={x.id} type="button" aria-pressed={on} className={'mp-mod' + (on ? ' on' : '') + ' is-' + x.status} onClick={() => toggle(x.id)}>
                      <span className="mp-tick" aria-hidden="true"><svg viewBox="0 0 16 16"><path d="M3.5 8.5l3 3 6-7" /></svg></span>
                      <span className="mp-body">
                        <b>{x.name[lg()]}</b>
                        <small>{x.note[lg()]}</small>
                        <span className="mp-meta">
                          <span className={'mp-tier t' + x.tier}>{STR.inPlan[lg()]} {tierName(x.tier)}</span>
                          <span className={'mp-st mp-st-' + x.status}><i aria-hidden="true" />{STR.status[x.status][lg()]}</span>
                        </span>
                      </span>
                    </button>
                  )
                })}
              </div>
            </section>
          )
        })}
      </div>
    </div>
  )
}
