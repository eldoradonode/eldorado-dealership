import { handleEnquiry } from '../../lib/enquiry-core.mjs';

/* Netlify function. Set ENQUIRY_WEBHOOK_URL (and optionally ENQUIRY_WEBHOOK_SECRET) in the site settings. */
export default async (req, context) => {
  let body = null;
  try { body = await req.json(); } catch { body = null; }
  const ip = context?.ip || req.headers.get('x-nf-client-connection-ip') || '';
  const r = await handleEnquiry({ method: req.method, body, ip, env: process.env });
  return new Response(JSON.stringify(r.body), { status: r.status, headers: { 'content-type': 'application/json', 'cache-control': 'no-store' } });
};
