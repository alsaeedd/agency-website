export interface Env { TWENTY_URL?: string; TWENTY_API_KEY: string; UNSUB_SECRET: string }

// The CRM sits behind a proxy that 403s default/bot user agents.
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36'
const base = (env: Env) => (env.TWENTY_URL || 'https://crm.raltech.dev').replace(/\/$/, '')
const headers = (env: Env) => ({ Authorization: `Bearer ${env.TWENTY_API_KEY}`, 'User-Agent': UA, 'Content-Type': 'application/json', Accept: 'application/json' })

export const validLid = (lid: unknown): lid is string => typeof lid === 'string' && /^RAL-[A-Z]+-\d{1,6}$/.test(lid)

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
