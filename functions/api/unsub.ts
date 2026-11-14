// One-click unsubscribe for RAL HR cold email (RFC 8058).
// GET  /api/unsub?lid=RAL-HR-0123&t=<hex hmac>  -> confirm button only (link scanners prefetch GETs)
// POST /api/unsub?lid=...&t=...  (body List-Unsubscribe=One-Click) -> 200
// POST /api/unsub?lid=...&t=...&web=1  (the confirm button) -> done page
// t = hex HMAC-SHA256(lid, UNSUB_SECRET). ?dry=1 verifies and looks up only.
import { type Env, findLead, hmacHex, patchLead, safeEqual, validLid } from '../_lib/twenty'

const page = (title: string, body: string, status = 200, extra = '') => new Response(`<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>${title} | RAL Technologies</title>
<style>body{margin:0;min-height:100vh;display:grid;place-items:center;background:#2B1B3D;color:#D1C4E9;font:16px/1.6 Inter,system-ui,sans-serif;padding:16px;box-sizing:border-box}main{max-width:440px;text-align:center}h1{color:#fff;font-weight:600;font-size:26px;margin:0 0 12px}a{color:#fff}button{font:inherit;font-weight:600;background:#D1C4E9;color:#2B1B3D;border:0;border-radius:8px;padding:12px 24px;cursor:pointer}</style></head>
<body><main><h1>${title}</h1><p>${body}</p>${extra}<p><a href="https://raltech.dev/">raltech.dev</a></p></main></body></html>`, { status, headers: { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-store' } })

async function handle(request: Request, env: Env, isPost: boolean): Promise<Response> {
  const u = new URL(request.url)
  const lid = (u.searchParams.get('lid') || '').trim()
  const t = (u.searchParams.get('t') || '').trim().toLowerCase()
  const dry = u.searchParams.get('dry') === '1'
  const html = !isPost || u.searchParams.get('web') === '1'
  const bad = () => !html
    ? new Response('invalid link', { status: 403 })
    : page('Link not valid', 'This unsubscribe link is not valid. Reply to the email with "unsubscribe" and we will remove you by hand.', 403)
  if (!env.UNSUB_SECRET || !validLid(lid) || !/^[0-9a-f]{64}$/.test(t)) return bad()
  if (!safeEqual(t, await hmacHex(env.UNSUB_SECRET, lid))) return bad()
  try {
    const lead = await findLead(env, lid)
    if (!isPost && !dry) return page('Unsubscribe from RAL HR emails?', 'Press the button and we will stop emailing you about RAL HR.', 200,
      `<form method="post" action="/api/unsub?lid=${encodeURIComponent(lid)}&amp;t=${t}&amp;web=1"><button type="submit">Unsubscribe</button></form>`)
    if (dry) return Response.json({ ok: true, dry: true, found: !!lead, id: lead?.id || null }, { headers: { 'cache-control': 'no-store' } })
    if (lead) await patchLead(env, lead.id, { emailStatus: 'UNSUBSCRIBED', outreachStatus: 'DO_NOT_CONTACT' })
  } catch {
    return !html
      ? new Response('try again', { status: 502 })
      : page('Something went wrong', 'We could not update your preferences just now. Please reply to the email with "unsubscribe" and we will remove you.', 502)
  }
  return !html
    ? new Response('unsubscribed', { status: 200 })
    : page('You are unsubscribed', 'You will not get any more emails about RAL HR from us. Sorry for the noise.')
}

export const onRequestGet: PagesFunction<Env> = ({ request, env }) => handle(request, env, false)
export const onRequestPost: PagesFunction<Env> = ({ request, env }) => handle(request, env, true)
