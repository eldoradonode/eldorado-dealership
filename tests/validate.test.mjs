import test from 'node:test';
import assert from 'node:assert/strict';
import { validate, ymdLagos } from '../lib/validate.mjs';

const NOW = new Date('2026-10-26T10:00:00Z'); /* a Monday */
const base = { name: 'Ada Okafor', phone: '+234 801 234 5678' };

test('test drive: valid request passes', () => {
  const r = validate('test-drive', { ...base, vehicle: 'lexus-lx', date: '2026-10-28', slot: 'Morning, 9:00 to 12:00', licence: 'on' }, NOW);
  assert.deepEqual(r.errors, {});
});
test('test drive: Sunday, past day and far future are refused', () => {
  const mk = date => validate('test-drive', { ...base, vehicle: 'x', date, slot: 'Morning, 9:00 to 12:00', licence: 'on' }, NOW).errors.date;
  assert.match(mk('2026-11-01'), /Sunday/); /* 1 Nov 2026 is a Sunday */
  assert.ok(mk('2026-10-26')); assert.ok(mk('2026-10-20')); assert.ok(mk('2027-03-01')); assert.ok(mk('2026-02-30'));
});
test('test drive: licence confirmation and slot are required', () => {
  const r = validate('test-drive', { ...base, vehicle: 'x', date: '2026-10-28', slot: 'Whenever' }, NOW);
  assert.ok(r.errors.licence && r.errors.slot);
});
test('phone and email rules', () => {
  assert.ok(validate('contact', { name: 'A B', phone: '12', subject: 'General enquiry', message: 'Hello there friend' }).errors.phone);
  assert.ok(validate('contact', { name: 'A B', phone: '+2348012345678', email: 'nope', subject: 'General enquiry', message: 'Hello there friend' }).errors.email);
  assert.deepEqual(validate('contact', { name: 'A B', phone: '08012345678', subject: 'General enquiry', message: 'Hello there friend' }).errors, {});
});
test('swap: required fields, numbers, and email when email is chosen', () => {
  const ok = { ...base, curMake: 'Toyota', curModel: 'Camry', curYear: '2019', curCondition: 'Good', contactMethod: 'WhatsApp' };
  assert.deepEqual(validate('swap', ok).errors, {});
  assert.ok(validate('swap', { ...ok, curYear: '' }).errors.curYear);
  assert.ok(validate('swap', { ...ok, curMileage: '12abc' }).errors.curMileage);
  assert.ok(validate('swap', { ...ok, budget: '-5' }).errors.budget);
  assert.ok(validate('swap', { ...ok, contactMethod: 'Email' }).errors.email);
  assert.ok(validate('swap', { ...ok, curDetails: 'x'.repeat(1001) }).errors.curDetails);
});
test('control characters are stripped and values trimmed', () => {
  const r = validate('contact', { name: '  Ada\u0007  ', phone: '08012345678', subject: 'General enquiry', message: 'Hello there\u0000 friend' });
  assert.equal(r.clean.name, 'Ada'); assert.equal(r.clean.message, 'Hello there friend');
});
test('unknown form types are rejected', () => assert.ok(validate('nope', {}).errors._));
test('Lagos date helper', () => assert.equal(ymdLagos(new Date('2026-10-26T23:30:00Z')), '2026-10-27'));
