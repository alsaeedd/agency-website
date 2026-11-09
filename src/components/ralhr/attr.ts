// Email attribution: keep the CRM lead id (lid) and utm_* from the landing URL
// for the whole visit, so WhatsApp/email handoffs and interest pings carry them.
const KEY = 'ralhr-attr'
type Attr = { lid?: string; utm: Record<string, string> }

export function getAttr(): Attr {
  try { const v = JSON.parse(sessionStorage.getItem(KEY) || '{}'); return { lid: v.lid, utm: v.utm || {} } } catch { return { utm: {} } }
}

export function captureAttr(): void {
  try {
    const q = new URLSearchParams(window.location.search)
    const lid = (q.get('lid') || '').trim()
    const utm: Record<string, string> = {}
    q.forEach((v, k) => { if (k.startsWith('utm_')) utm[k] = v.slice(0, 100) })
    if (!lid && !Object.keys(utm).length) return
    const prev = getAttr()
    sessionStorage.setItem(KEY, JSON.stringify({
      lid: /^[A-Za-z0-9-]{1,40}$/.test(lid) ? lid : prev.lid,
      utm: Object.keys(utm).length ? utm : prev.utm,
    }))
  } catch { /* private mode */ }
}

/** Appends "Ref: RAL-HR-0123" to a prefilled message when the visit came from an email. */
export const withRef = (msg: string) => { const { lid } = getAttr(); return lid ? `${msg}\n\nRef: ${lid}` : msg }

const sent = new Set<string>()
/** Fire-and-forget interest ping to the CRM (once per action per page view). */
export function pingInterest(action: 'video' | 'book' | 'inquire'): void {
  const { lid, utm } = getAttr()
  if (!lid || sent.has(action)) return
  sent.add(action)
  try {
    const body = JSON.stringify({ lid, utm, action })
    if (!navigator.sendBeacon?.('/api/ralhr-interest', new Blob([body], { type: 'application/json' })))
      fetch('/api/ralhr-interest', { method: 'POST', body, headers: { 'content-type': 'application/json' }, keepalive: true }).catch(() => {})
  } catch { /* never block the click */ }
}
