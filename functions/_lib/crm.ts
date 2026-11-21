// One CRM client for the site functions: Twenty (today, default) or the new RAL CRM.
//   CRM_BACKEND unset or 'twenty': exactly the Twenty REST calls the site made before (TWENTY_URL, TWENTY_API_KEY).
//   CRM_BACKEND='newcrm': NEWCRM_URL + /api/v1/site/* with `Authorization: Bearer NEWCRM_API_KEY` (key scope "site").
//   Any other value: every CRM call throws, so a typo never writes to the wrong CRM.
// Contract: CRM repo docs/newcrm/ARCHITECTURE.md section 6 (site/unsubscribe, site/interest).
export interface Env {
  CRM_BACKEND?: string
  TWENTY_URL?: string
  TWENTY_API_KEY?: string
  NEWCRM_URL?: string
  NEWCRM_API_KEY?: string
  UNSUB_SECRET: string
}

// The CRM sits behind a proxy that 403s default/bot user agents.
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36'
const base = (env: Env) => (env.TWENTY_URL || 'https://crm.raltech.dev').replace(/\/$/, '')
const headers = (env: Env) => ({ Authorization: `Bearer ${env.TWENTY_API_KEY}`, 'User-Agent': UA, 'Content-Type': 'application/json', Accept: 'application/json' })

export function newcrm(env: Env): boolean {
  const b = (env.CRM_BACKEND || 'twenty').trim().toLowerCase()
  if (b !== 'twenty' && b !== 'newcrm') throw new Error('CRM_BACKEND must be twenty or newcrm')
  return b === 'newcrm'
}

/** True when the active backend has its key (the interest ping silently does nothing otherwise, as before). */
export function crmConfigured(env: Env): boolean {
  try { return newcrm(env) ? !!env.NEWCRM_API_KEY : !!env.TWENTY_API_KEY } catch { return false }
}

export const validLid = (lid: unknown): lid is string => typeof lid === 'string' && /^RAL-[A-Z]+-\d{1,6}$/.test(lid)

// ---------------------------------------------------------------- Twenty (unchanged calls)
export interface Lead { id: string; leadId: string; stage?: string; notes?: string | null }

export async function findLead(env: Env, lid: string): Promise<Lead | null> {
  const filter = encodeURIComponent(`leadId[eq]:"${lid}"`)
  const r = await fetch(`${base(env)}/rest/ralHrLeads?limit=1&filter=${filter}`, { headers: headers(env) })
  if (!r.ok) throw new Error(`CRM lookup ${r.status}`)
  const j = await r.json() as { data?: { ralHrLeads?: Lead[] } }
  return j.data?.ralHrLeads?.[0] || null
}

export async function patchLead(env: Env, id: string, data: Record<string, unknown>): Promise<void> {
  const r = await fetch(`${base(env)}/rest/ralHrLeads/${id}`, { method: 'PATCH', headers: headers(env), body: JSON.stringify(data) })
  if (!r.ok) throw new Error(`CRM update ${r.status}`)
}

// ---------------------------------------------------------------- new CRM
async function site<T>(env: Env, path: string, body: Record<string, unknown>): Promise<T | null> {
  const url = `${(env.NEWCRM_URL || 'https://crm.raltech.dev').replace(/\/$/, '')}/api/v1/site/${path}`
  const r = await fetch(url, {
    method: 'POST', body: JSON.stringify(body),
    headers: { Authorization: `Bearer ${env.NEWCRM_API_KEY}`, 'User-Agent': UA, 'Content-Type': 'application/json', Accept: 'application/json' },
  })
  if (!r.ok) throw new Error(`CRM site/${path} ${r.status}`)
  return r.status === 204 ? null : await r.json() as T
}

// ---------------------------------------------------------------- what the functions call
export interface Found { found: boolean; id: string | null; lead: Lead | null }

/** Look the lead up without changing it. Twenty: GET /rest/ralHrLeads. New CRM: site/unsubscribe dry_run. */
export async function lookup(env: Env, lid: string): Promise<Found> {
  if (newcrm(env)) {
    const d = await site<{ found?: boolean }>(env, 'unsubscribe', { lead_code: lid, dry_run: true })
    return { found: !!d?.found, id: null, lead: null }
  }
  const lead = await findLead(env, lid)
  return { found: !!lead, id: lead?.id || null, lead }
}

/** Unsubscribe a lead found by lookup(). Twenty: PATCH emailStatus + outreachStatus (as before). New CRM: site/unsubscribe. */
export async function unsubscribe(env: Env, lid: string, f: Found): Promise<void> {
  if (newcrm(env)) { await site(env, 'unsubscribe', { lead_code: lid }); return }
  if (f.lead) await patchLead(env, f.lead.id, { emailStatus: 'UNSUBSCRIBED', outreachStatus: 'DO_NOT_CONTACT' })
}

/** Site interest ping. Twenty: notes line + NEW_LEAD/CONTACTED to DISCOVERY (as before). New CRM: site/interest does both. */
export async function interest(env: Env, lid: string, action: string, utm: Record<string, string>): Promise<void> {
  if (newcrm(env)) { await site(env, 'interest', { lead_code: lid, action, utm }); return }
  const lead = await findLead(env, lid)
  if (!lead) return
  const u = Object.entries(utm).map(([key, v]) => `${key}=${v}`).join(' ')
  const line = `[${new Date().toISOString().slice(0, 16).replace('T', ' ')} UTC] Site: ${action}${u ? ` (${u})` : ''}`
  const data: Record<string, unknown> = { notes: lead.notes ? `${lead.notes}\n${line}` : line }
  if (lead.stage === 'NEW_LEAD' || lead.stage === 'CONTACTED') data.stage = 'DISCOVERY'
  await patchLead(env, lead.id, data)
}

export async function hmacHex(secret: string, msg: string): Promise<string> {
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign'])
  const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(msg))
  return [...new Uint8Array(sig)].map((b) => b.toString(16).padStart(2, '0')).join('')
}

export function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false
  let d = 0
  for (let i = 0; i < a.length; i++) d |= a.charCodeAt(i) ^ b.charCodeAt(i)
  return d === 0
}
