/* One set of rules, used by the browser form script and by the server function. */
const clean = s => String(s ?? '').replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g, '').trim();
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE = /^\+?[0-9][0-9\s\-()]{6,18}$/;
export const LAGOS = 3600e3; /* WAT is UTC+1 */
export const ymdLagos = (now, plusDays = 0) => { const t = new Date(now.getTime() + LAGOS + plusDays * 864e5); return t.toISOString().slice(0, 10); };
const TYPES = { swap: ['curMake', 'curModel', 'curYear', 'curMileage', 'curCondition', 'curDetails', 'wantVehicle', 'wantOther', 'budget', 'name', 'phone', 'email', 'contactMethod', 'comments'], 'test-drive': ['vehicle', 'date', 'slot', 'name', 'phone', 'email', 'licence', 'notes'], contact: ['subject', 'vehicle', 'message', 'name', 'phone', 'email'] };
export const TYPE_NAMES = Object.keys(TYPES);
const SLOTS = ['Morning, 9:00 to 12:00', 'Afternoon, 12:00 to 15:00', 'Late afternoon, 15:00 to 18:00'];
const CONDS = ['Excellent', 'Good', 'Fair', 'Needs work'];
const SUBJECTS = ['General enquiry', 'Vehicle enquiry', 'Vehicle swap', 'Test drive', 'Something else'];
const METHODS = ['WhatsApp', 'Phone call', 'Email'];

export function validate(type, raw, now = new Date()) {
  const errors = {}, d = {};
  if (!TYPES[type]) return { errors: { _: 'Unknown form type.' }, clean: {} };
  for (const k of TYPES[type]) d[k] = clean(raw?.[k]);
  const req = (k, msg, max = 120) => { if (!d[k]) errors[k] = msg; else if (d[k].length > max) errors[k] = `Please keep this under ${max} characters.`; };
  const opt = (k, max) => { if (d[k].length > max) errors[k] = `Please keep this under ${max} characters.`; };
  req('name', 'Please enter your full name.', 80); if (d.name && d.name.length < 2) errors.name = 'Please enter your full name.';
  if (!d.phone) errors.phone = 'Please enter a phone or WhatsApp number.';
  else if (!PHONE.test(d.phone) || d.phone.replace(/\D/g, '').length < 7 || d.phone.replace(/\D/g, '').length > 15) errors.phone = 'Please enter a valid number, for example +234 801 234 5678.';
  if (d.email && (!EMAIL.test(d.email) || d.email.length > 120)) errors.email = 'Please enter a valid email address.';
  if (type === 'swap') {
    req('curMake', 'Please enter the make of your vehicle.', 60); req('curModel', 'Please enter the model of your vehicle.', 60);
    if (!/^(19|20)\d{2}$/.test(d.curYear) || +d.curYear > 2027) errors.curYear = 'Please select the model year.';
    if (d.curMileage && (!/^\d{1,6}$/.test(d.curMileage))) errors.curMileage = 'Please enter the mileage as a whole number of kilometres.';
    if (!CONDS.includes(d.curCondition)) errors.curCondition = 'Please select the condition.';
    opt('curDetails', 1000); opt('wantVehicle', 80); opt('wantOther', 80); opt('comments', 1000);
    if (d.budget && !/^\d{1,13}$/.test(d.budget)) errors.budget = 'Please enter the budget as a whole number in Naira.';
    if (!METHODS.includes(d.contactMethod)) d.contactMethod = 'WhatsApp';
    if (d.contactMethod === 'Email' && !d.email) errors.email = 'Please enter your email, since you chose email replies.';
  }
  if (type === 'test-drive') {
    req('vehicle', 'Please choose a vehicle.', 80);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(d.date)) errors.date = 'Please choose a day.';
    else {
      const [y, m, dd] = d.date.split('-').map(Number), dt = new Date(Date.UTC(y, m - 1, dd));
      if (dt.getUTCMonth() !== m - 1) errors.date = 'Please choose a valid day.';
      else if (d.date < ymdLagos(now, 1)) errors.date = 'Please choose a day from tomorrow onward.';
      else if (d.date > ymdLagos(now, 60)) errors.date = 'Please choose a day within the next 60 days.';
      else if (dt.getUTCDay() === 0) errors.date = 'We are closed on Sundays. Please choose Monday to Saturday.';
    }
    if (!SLOTS.includes(d.slot)) errors.slot = 'Please select a time window.';
    if (!(raw?.licence === true || raw?.licence === 'on' || raw?.licence === 'true' || d.licence === 'on')) errors.licence = 'Please confirm that you hold a valid driving licence.';
    d.licence = 'yes'; opt('notes', 500);
  }
  if (type === 'contact') {
    if (!SUBJECTS.includes(d.subject)) errors.subject = 'Please select a subject.';
    if (!d.message) errors.message = 'Please write a short message.'; else if (d.message.length < 10) errors.message = 'Please write a little more, at least 10 characters.'; else if (d.message.length > 1500) errors.message = 'Please keep your message under 1,500 characters.';
    opt('vehicle', 80);
  }
  return { errors, clean: d };
}
