// Contact modal submissions: POST {name, email?, phone?, services[], message, lang, channel, website}.
// channel 'whatsapp' is a fire-and-forget copy of the WhatsApp handoff; channel 'email' is the
// visitor choosing email. Both are emailed to info@raltech.dev via the Resend REST API.
interface Env { RESEND_API_KEY?: string }

const TO = 'info@raltech.dev'
const FROM = 'RAL Website <website@mail.raltech.dev>'
const EMAIL_RE = /^[^\s@<>()",;:]{1,64}@[^\s@<>()",;:]{1,190}\.[a-z]{2,24}$/i
const SERVICES = new Set(['site-scratch', 'system-from-scratch', 'ai-agents', 'cloud-deployment-only', 'other'])
const recent = new Map<string, number[]>() // naive per-isolate rate limit: 5 per 10 min per IP

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' } })
const str = (v: unknown, max: number) => (typeof v === 'string' ? v.trim().slice(0, max) : '')
const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]!))

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  let b: Record<string, unknown>
  try { b = await request.json() } catch { return json({ ok: false, error: 'bad_json' }, 400) }

  // Honeypot: real visitors never see this field. Pretend success so bots learn nothing.
  if (str(b.website, 200)) return json({ ok: true })

  const channel = b.channel === 'email' ? 'email' : b.channel === 'whatsapp' ? 'whatsapp' : ''
  const name = str(b.name, 120)
  const email = str(b.email, 254)
  const phone = str(b.phone, 40).replace(/[^\d+()\s-]/g, '')
  const message = str(b.message, 5000)
  const lang = b.lang === 'ar' ? 'ar' : 'en'
  const services = Array.isArray(b.services) ? b.services.filter((s): s is string => typeof s === 'string' && SERVICES.has(s)).slice(0, 5) : []

  const errors: string[] = []
  if (!channel) errors.push('channel')
  if (!name) errors.push('name')
  if (!message) errors.push('message')
  if (email && !EMAIL_RE.test(email)) errors.push('email')
  if (channel === 'email' && !email) errors.push('email')
  if (errors.length) return json({ ok: false, error: 'invalid', fields: [...new Set(errors)] }, 400)

  const ip = request.headers.get('cf-connecting-ip') || 'unknown'
  const now = Date.now()
  const hits = (recent.get(ip) || []).filter((t) => t > now - 10 * 60_000)
  if (hits.length >= 5) return json({ ok: false, error: 'rate_limited' }, 429)
  if (recent.size > 5000) recent.clear()
  recent.set(ip, [...hits, now])

  if (!env.RESEND_API_KEY) return json({ ok: false, error: 'not_configured' }, 500)

  const when = new Date(now)
  const utc = when.toISOString().slice(0, 16).replace('T', ' ') + ' UTC'
  const bh = new Date(now + 3 * 3600_000).toISOString().slice(0, 16).replace('T', ' ') + ' Bahrain'
  const via = channel === 'email' ? 'Email form (visitor expects an email reply)' : 'WhatsApp handoff (may or may not have sent the chat)'
  const rows: [string, string][] = [
    ['Name', name],
    ['Email', email || '(not given)'],
    ['Phone', phone || '(not given)'],
    ['Interested in', services.join(', ') || '(none selected)'],
    ['Channel', via],
    ['Page language', lang === 'ar' ? 'Arabic' : 'English'],
    ['Time', `${utc} / ${bh}`],
    ['Country', request.headers.get('cf-ipcountry') || 'unknown'],
  ]
  const text = [...rows.map(([k, v]) => `${k}: ${v}`), '', 'Message:', message].join('\n')
  const html = `<div style="font-family:-apple-system,Segoe UI,Arial,sans-serif;max-width:600px;color:#1a1325">
<h2 style="margin:0 0 4px;font-size:20px">New inquiry from raltech.dev</h2>
<p style="margin:0 0 18px;color:#6b5b85;font-size:13px">${esc(via)}</p>
<table style="border-collapse:collapse;width:100%;font-size:14px">${rows
    .map(([k, v]) => `<tr><td style="padding:7px 12px 7px 0;color:#6b5b85;white-space:nowrap;vertical-align:top;border-bottom:1px solid #eee">${esc(k)}</td><td style="padding:7px 0;border-bottom:1px solid #eee">${esc(v)}</td></tr>`)
    .join('')}</table>
<h3 style="margin:22px 0 8px;font-size:15px">Message</h3>
<div style="white-space:pre-wrap;font-size:14px;line-height:1.55;background:#f6f3fb;border-radius:8px;padding:14px"${lang === 'ar' ? ' dir="auto"' : ''}>${esc(message)}</div>
</div>`

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: FROM,
      to: [TO],
      ...(email && EMAIL_RE.test(email) ? { reply_to: email } : {}),
      subject: `${channel === 'email' ? 'Email inquiry' : 'WhatsApp lead'}: ${name}`.slice(0, 160),
      html,
      text,
    }),
  }).catch(() => null)
  const out = res ? ((await res.json().catch(() => ({}))) as { id?: string; message?: string }) : {}
  if (!res || !res.ok || !out.id) {
    console.log('contact: resend failed', res?.status, out.message)
    return json({ ok: false, error: 'send_failed' }, 502)
  }
  console.log('contact: sent', channel, out.id)
  return json({ ok: true, id: out.id })
}
