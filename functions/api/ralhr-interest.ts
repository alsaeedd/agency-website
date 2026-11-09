// Interest ping from the RAL HR pages: POST {lid, utm, action}.
// Moves the CRM lead to DISCOVERY if it is still NEW_LEAD/CONTACTED and logs
// the action in notes. Always answers 204 so the page never waits or errors.
import { type Env, findLead, patchLead, validLid } from '../_lib/twenty'

const ACTIONS = new Set(['video', 'book', 'inquire'])
const recent = new Map<string, number>() // naive per-isolate rate limit
const done = () => new Response(null, { status: 204 })

export const onRequestPost: PagesFunction<Env> = async ({ request, env, waitUntil }) => {
  let b: { lid?: unknown; utm?: Record<string, unknown>; action?: unknown }
  try { b = await request.json() } catch { return done() }
  const { lid, action } = b
  if (!validLid(lid) || typeof action !== 'string' || !ACTIONS.has(action) || !env.TWENTY_API_KEY) return done()
  const k = `${request.headers.get('cf-connecting-ip') || ''}|${lid}|${action}`
  const now = Date.now()
  if ((recent.get(k) || 0) > now - 10 * 60_000) return done()
  if (recent.size > 5000) recent.clear()
  recent.set(k, now)
  const utm = Object.entries(b.utm || {})
    .filter(([key]) => /^utm_[a-z]{1,20}$/.test(key))
    .map(([key, v]) => `${key}=${String(v).slice(0, 60)}`).join(' ')
  waitUntil((async () => {
    const lead = await findLead(env, lid)
    if (!lead) return
    const line = `[${new Date().toISOString().slice(0, 16).replace('T', ' ')} UTC] Site: ${action}${utm ? ` (${utm})` : ''}`
    const data: Record<string, unknown> = { notes: lead.notes ? `${lead.notes}\n${line}` : line }
    if (lead.stage === 'NEW_LEAD' || lead.stage === 'CONTACTED') data.stage = 'DISCOVERY'
    await patchLead(env, lead.id, data)
  })().catch(() => {}))
  return done()
}
