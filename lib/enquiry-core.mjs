import { validate, TYPE_NAMES } from './validate.mjs';
const hits = new Map(); /* best-effort limiter: resets on cold start */
const limited = ip => { const now = Date.now(), arr = (hits.get(ip) || []).filter(t => now - t < 6e5); arr.push(now); hits.set(ip, arr); if (hits.size > 5000) hits.clear(); return arr.length > 8; };

export async function handleEnquiry({ method, body, ip = '', env = {}, fetchImpl = fetch, now = new Date() }) {
  if (method !== 'POST') return { status: 405, body: { ok: false, error: 'method_not_allowed' } };
  if (limited(ip || 'anon')) return { status: 429, body: { ok: false, error: 'too_many_requests' } };
  const type = body && body.type, data = body && body.data;
  if (!TYPE_NAMES.includes(type) || !data || typeof data !== 'object') return { status: 400, body: { ok: false, error: 'bad_request' } };
  if (String(data.company || '').trim()) return { status: 200, body: { ok: true } }; /* honeypot: pretend, drop */
  const { errors, clean } = validate(type, data, now);
  if (Object.keys(errors).length) return { status: 422, body: { ok: false, error: 'validation', errors } };
  const url = env.ENQUIRY_WEBHOOK_URL;
  if (!url) return { status: 503, body: { ok: false, error: 'not_configured' } };
  try {
    const ctl = new AbortController(), t = setTimeout(() => ctl.abort(), 8000);
    const res = await fetchImpl(url, { method: 'POST', signal: ctl.signal, headers: { 'content-type': 'application/json', ...(env.ENQUIRY_WEBHOOK_SECRET ? { 'x-webhook-secret': env.ENQUIRY_WEBHOOK_SECRET } : {}) }, body: JSON.stringify({ source: 'eldorado-site', type, receivedAt: now.toISOString(), data: clean }) });
    clearTimeout(t);
    if (!res.ok) return { status: 502, body: { ok: false, error: 'delivery_failed' } };
  } catch { return { status: 502, body: { ok: false, error: 'delivery_failed' } }; }
  return { status: 200, body: { ok: true } };
}
