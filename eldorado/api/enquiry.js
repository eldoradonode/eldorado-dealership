import { handleEnquiry } from '../lib/enquiry-core.mjs';

/* Vercel serverless function. Set ENQUIRY_WEBHOOK_URL (and optionally ENQUIRY_WEBHOOK_SECRET) in the project settings. */
export default async function handler(req, res) {
  let body = req.body;
  if (typeof body === 'string') { try { body = JSON.parse(body); } catch { body = null; } }
  const ip = String(req.headers['x-forwarded-for'] || '').split(',')[0].trim() || req.socket?.remoteAddress || '';
  const r = await handleEnquiry({ method: req.method, body, ip, env: process.env });
  res.setHeader('Cache-Control', 'no-store');
  res.status(r.status).json(r.body);
}
