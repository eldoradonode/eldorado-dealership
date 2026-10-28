export const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
export const naira = n => '\u20a6' + Number(n).toLocaleString('en-NG');
export const vName = v => [v.year, v.make, v.model].filter(Boolean).join(' ');
export const vTitle = v => [v.make, v.model].filter(Boolean).join(' ');
export const priceOf = v => (v.price ? naira(v.price) : 'Contact for Price');
export const mileageOf = v => (v.mileageKm != null ? `${Number(v.mileageKm).toLocaleString('en-NG')} km` : (v.mileageLabel || ''));
export const plural = (n, a, b) => `${n} ${n === 1 ? a : b}`;
export const waMsgVehicle = v => `Hello ELDORADO, I'm interested in the ${vName(v)}${v.price ? ` listed at ${naira(v.price)}` : ''}. Please share availability and the next steps.`;
