import test from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
import { handleEnquiry } from '../lib/enquiry-core.mjs';

const NOW = new Date('2026-10-26T10:00:00Z');
const good = { type: 'contact', data: { name: 'Ada Okafor', phone: '08012345678', subject: 'Vehicle enquiry', message: 'Is the Range Rover available?' } };
const hook = async (status = 200) => { const got = []; const srv = http.createServer((q, r) => { let b = ''; q.on('data', c => b += c); q.on('end', () => { got.push({ h: q.headers, b: JSON.parse(b) }); r.writeHead(status); r.end('ok'); }); }); await new Promise(r => srv.listen(0, r)); return { got, url: `http://127.0.0.1:${srv.address().port}/`, close: () => srv.close() }; };
let n = 0; const ip = () => `10.0.0.${++n}`;

test('valid enquiry is forwarded to the webhook with the secret header', async () => {
  const w = await hook(); const r = await handleEnquiry({ method: 'POST', body: good, ip: ip(), env: { ENQUIRY_WEBHOOK_URL: w.url, ENQUIRY_WEBHOOK_SECRET: 's3' }, now: NOW });
  assert.equal(r.status, 200); assert.equal(r.body.ok, true); assert.equal(w.got.length, 1);
  assert.equal(w.got[0].b.type, 'contact'); assert.equal(w.got[0].b.data.name, 'Ada Okafor'); assert.equal(w.got[0].h['x-webhook-secret'], 's3'); w.close();
});
test('invalid input returns 422 with field errors and nothing is forwarded', async () => {
  const w = await hook(); const r = await handleEnquiry({ method: 'POST', body: { type: 'contact', data: { name: 'A' } }, ip: ip(), env: { ENQUIRY_WEBHOOK_URL: w.url }, now: NOW });
  assert.equal(r.status, 422); assert.ok(r.body.errors.phone && r.body.errors.subject); assert.equal(w.got.length, 0); w.close();
});
test('not configured is reported honestly, never as success', async () => {
  const r = await handleEnquiry({ method: 'POST', body: good, ip: ip(), env: {}, now: NOW });
  assert.equal(r.status, 503); assert.equal(r.body.ok, false);
});
test('webhook failure is reported as 502', async () => {
  const w = await hook(500); const r = await handleEnquiry({ method: 'POST', body: good, ip: ip(), env: { ENQUIRY_WEBHOOK_URL: w.url }, now: NOW });
  assert.equal(r.status, 502); assert.equal(r.body.ok, false); w.close();
});
test('honeypot is dropped silently, wrong method and bad body are refused', async () => {
  const w = await hook();
  const hp = await handleEnquiry({ method: 'POST', body: { ...good, data: { ...good.data, company: 'Spam Ltd' } }, ip: ip(), env: { ENQUIRY_WEBHOOK_URL: w.url }, now: NOW });
  assert.equal(hp.status, 200); assert.equal(w.got.length, 0);
  assert.equal((await handleEnquiry({ method: 'GET', body: null, ip: ip(), env: {} })).status, 405);
  assert.equal((await handleEnquiry({ method: 'POST', body: null, ip: ip(), env: {} })).status, 400);
  assert.equal((await handleEnquiry({ method: 'POST', body: { type: 'hack', data: {} }, ip: ip(), env: {} })).status, 400); w.close();
});
test('rate limit kicks in after repeated requests from one address', async () => {
  const same = '203.0.113.9'; let last;
  for (let i = 0; i < 10; i++) last = await handleEnquiry({ method: 'POST', body: good, ip: same, env: {}, now: NOW });
  assert.equal(last.status, 429);
});
