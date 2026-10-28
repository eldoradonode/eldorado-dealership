import { esc, naira, vName, vTitle, priceOf, mileageOf, plural, waMsgVehicle } from './util.mjs';
import { pic } from './images.mjs';
import { layout } from './layout.mjs';

const MSG = { general: 'Hello ELDORADO, I would like to enquire about a vehicle.', swap: 'Hello ELDORADO, I would like to ask about swapping my current vehicle for another one from ELDORADO.', drive: 'Hello ELDORADO, I would like to schedule a test drive.' };
const bodyOf = v => v.bodyType.toLowerCase();
const url = v => `/vehicles/${v.slug}/`;
const blob = v => [v.make, v.model, v.trim, v.year, v.bodyType, v.condition, v.exteriorColor, v.engine, v.fuel, v.transmission].filter(Boolean).join(' ').toLowerCase();

/* ---------- shared pieces ---------- */
export const tile = (ctx, v, { compare = false } = {}) => `<article class="tile" data-slug="${v.slug}" data-body="${bodyOf(v)}" data-make="${esc(v.make)}" data-year="${v.year}" data-cond="${esc(v.condition)}" data-price="${v.price || 0}" data-added="${v.dateAdded}" data-name="${esc(vTitle(v))}" data-text="${esc(blob(v))}">
  <a class="ph" href="${url(v)}" aria-label="View the ${esc(vName(v))}">${pic(v.image, { sizes: '(min-width:1100px) 28vw,(min-width:700px) 44vw,92vw', alt: v.alt, style: `--pos:${v.pos}` })}</a>
  <div class="meta"><div class="trow"><span class="badge">${esc(v.condition)}</span><span class="yr">${v.year}</span></div>
    <h3><a href="${url(v)}">${esc(vTitle(v))}</a></h3>
    <p class="sub">${esc([v.trim, v.bodyType, mileageOf(v)].filter(Boolean).join(' \u00b7 '))}</p>
    <p class="price">${esc(priceOf(v))}</p>
    <div class="row"><a class="link" href="${url(v)}">View vehicle</a>${ctx.wa(waMsgVehicle(v), 'Enquire', 'link')}</div>
    ${compare ? `<label class="cmp"><input type="checkbox" data-cmp="${v.slug}"> Compare</label>` : ''}</div>
</article>`;

const faq = items => items.map(([q, a]) => `<details><summary>${q}</summary><p>${a}</p></details>`).join('');
const FAQ = [
  ['What does foreign used mean?', 'A foreign-used vehicle, often called tokunbo, was first registered and driven abroad before it was imported to Nigeria. Every listing shows its year, mileage and condition.'],
  ['Are the listed prices final?', 'Prices are shown in Naira. Final terms are confirmed when you speak to our team, because availability and specification can change.'],
  ['Can I test drive a vehicle first?', 'Yes. Choose a vehicle, a day and a time window, and we will confirm by WhatsApp or phone.'],
  ['How does a vehicle swap work?', 'Tell us about the vehicle you own and the one you would like. We assess your vehicle, and any valuation, inspection, eligibility and final arrangement are subject to dealership assessment.'],
  ['What is the fastest way to reach you?', 'WhatsApp. You can also call or email, and we reply during business hours.']
];
const step = (b, s) => `<li><div><b>${b}</b><span>${s}</span></div></li>`;
const hp = '<div class="hp" aria-hidden="true"><label>Company<input name="company" tabindex="-1" autocomplete="off"></label></div>';
const F = (id, label, { type = 'text', req = false, hint = '', attrs = '', cls = '' } = {}) => `<div class="field ${cls}"><label for="${id}">${label}${req ? ' <span aria-hidden="true">*</span>' : ''}</label><input id="${id}" name="${id}" type="${type}"${req ? ' required' : ''} ${attrs}>${hint ? `<p class="hint">${hint}</p>` : ''}<p class="err" id="${id}-err" role="alert"></p></div>`;
const S = (id, label, opts, { req = false, cls = '', hint = '' } = {}) => `<div class="field ${cls}"><label for="${id}">${label}${req ? ' <span aria-hidden="true">*</span>' : ''}</label><select id="${id}" name="${id}"${req ? ' required' : ''}>${opts}</select>${hint ? `<p class="hint">${hint}</p>` : ''}<p class="err" id="${id}-err" role="alert"></p></div>`;
const T = (id, label, { req = false, hint = '', rows = 4, cls = '' } = {}) => `<div class="field ${cls}"><label for="${id}">${label}${req ? ' <span aria-hidden="true">*</span>' : ''}</label><textarea id="${id}" name="${id}" rows="${rows}"${req ? ' required' : ''}></textarea>${hint ? `<p class="hint">${hint}</p>` : ''}<p class="err" id="${id}-err" role="alert"></p></div>`;
const vOpts = (V, first) => `<option value="">${first}</option>` + V.map(v => `<option value="${v.slug}">${esc(vName(v))}${v.price ? ' \u00b7 ' + naira(v.price) : ''}</option>`).join('');
const phead = (label, h, lede) => `<section class="phead dark"><div class="wrap"><p class="label">${label}</p><h1>${h}</h1>${lede ? `<p class="lede">${lede}</p>` : ''}</div></section>`;

/* ---------- HOME ---------- */
const FR = [
  { k: 'hero-front', fit: 'cover', posm: '60% 50%', alt: 'Black Mercedes-Benz S-Class in a dark showroom, front three-quarter view' },
  { k: 'side-profile', fit: 'band', posm: '50% 50%', label: 'Exterior', t: 'A calm silhouette.', p: 'Long, level and composed. The profile says everything before the door opens.', alt: 'Black Mercedes-Benz S-Class in side profile' },
  { k: 'rear-showroom', fit: 'band', posm: '38% 55%', label: 'Exterior', t: 'Presence from every angle.', p: 'Slim tail lamps, a clean rear and polished wheels, even from behind.', alt: 'Black Mercedes-Benz S-Class seen from the rear in a showroom' },
  { k: 'grille-detail', fit: 'cover', posm: '72% 55%', cap: 'top', label: 'Detail', t: 'The star at the front.', p: 'A chrome grille, a signature headlamp and the three-pointed star on the bonnet.', alt: 'Close view of the S-Class headlamp, grille and bonnet star' },
  { k: 'front-cabin', fit: 'cover', posm: '55% 50%', label: 'Cabin', t: 'Step inside.', p: 'Soft light, leather and brushed metal, arranged with restraint.', alt: 'Front cabin of the S-Class with the driver door open' },
  { k: 'driver-view', fit: 'cover', posm: '48% 55%', label: 'Cabin', t: 'The driver\u2019s view.', p: 'A clean steering wheel and a wide central screen, framed by ambient light.', alt: 'Driver\u2019s view of the S-Class dashboard and screens' },
  { k: 'rear-seats', fit: 'cover', posm: '65% 55%', label: 'Cabin', t: 'Room to settle back.', p: 'Quilted leather seats, a screen for each passenger and a glass roof overhead.', alt: 'Rear passenger seats of the S-Class with quilted leather' },
  { k: 'craft', fit: 'cover', posm: '45% 50%', label: 'Craft', t: 'The details you notice last.', p: 'Stitched leather, brushed metal and a fine line of copper light.', alt: 'Close view of the S-Class centre console, stitched leather and brushed metal' }
];
const frame = (ctx, f, i) => {
  const N = FR.length, a = i === 0 ? -1 : +(i / N).toFixed(4), b = i === N - 1 ? 2 : +((i + 1) / N).toFixed(4);
  const im = pic(f.k, { alt: f.alt, eager: i === 0, defer: i > 0 });
  const btns = `<div class="row" style="margin-top:1.5rem"><a class="btn" href="#collection">Explore Collection</a>${ctx.wa(MSG.general, 'Enquire on WhatsApp', 'btn btn--ghost')}</div>`;
  let cap;
  if (i === 0) cap = `<div class="cap"><p class="label">Premium automobiles</p><p class="hero-h">Arrive well.</p><p class="lede">Carefully selected new and foreign-used automobiles from Mercedes-Benz, Range Rover, Lexus, Toyota and BMW.</p>${btns}</div>`;
  else cap = `<div class="cap${f.cap === 'top' ? ' cap--top' : ''}"><p class="label">${f.label}</p><h2>${f.t}</h2><p>${f.p}</p>${i === N - 1 ? btns : ''}</div>`;
  return `<article class="frame${i === 0 ? ' frame--first' : ''}${i === N - 1 ? ' frame--last' : ''}" style="--a:${a};--b:${b}" data-fit="${f.fit}"><figure class="fimg" style="--pos:50% 50%;--posm:${f.posm}">${im}</figure>${cap}</article>`;
};

export function home(ctx) {
  const { V } = ctx, feat = V.filter(v => v.featured), nS = V.filter(v => bodyOf(v) === 'sedan').length, nU = V.filter(v => bodyOf(v) === 'suv').length;
  const body = `<h1 class="sr-only">ELDORADO: premium new and foreign-used automobiles in Nigeria</h1>
<section class="seq" id="top" data-sc-act="pin" data-sc-span="6.2" aria-label="The Mercedes-Benz S-Class, from exterior to cabin">
  <div class="seq-stage" data-sc-stage>
    ${FR.map((f, i) => frame(ctx, f, i)).join('\n    ')}
    <a class="seq-skip" href="#collection">Skip to collection</a>
    <div class="seq-bar" aria-hidden="true"><i></i></div><span class="seq-hint" aria-hidden="true">Scroll</span>
  </div>
</section>

<section id="about" class="sec light" data-sc-act="flow"><div class="wrap intro">
  <div data-sc-in><p class="label">About ELDORADO</p><h2>Premium automobiles, chosen with care.</h2>
    <p class="lede">ELDORADO is a premium automobile dealership serving customers in Nigeria. We offer brand-new and foreign-used vehicles, and we consider vehicle swaps.</p>
    <div class="trio"><div><h3>Selection</h3><p>A focused range of sedans and SUVs worth your time.</p></div><div><h3>Clear details</h3><p>Year, mileage, condition and price are shown on every listing.</p></div><div><h3>Swaps considered</h3><p>Tell us what you drive now. Any valuation is subject to dealership assessment.</p></div></div>
    <p class="brands" aria-label="Brands we carry"><span>Mercedes-Benz</span><span>Range Rover</span><span>Lexus</span><span>Toyota</span><span>BMW</span></p>
    <div class="row" style="margin-top:1.6rem"><a class="btn" href="/about/">Our approach</a></div></div>
  <div class="pic-tall">${pic('architecture', { sizes: '(min-width:900px) 40vw,92vw', alt: 'A long stone and glass showroom hall with a single dark sedan at the far end' })}</div>
</div></section>

<section id="collection" class="sec dark" data-sc-act="flow"><div class="wrap">
  <div class="head" data-sc-in><div><p class="label">The collection</p><h2>A collection worth a closer look.</h2></div>
    <div class="pills" role="group" aria-label="Filter by body type"><button type="button" class="pill" data-f="all" aria-pressed="true">All</button><button type="button" class="pill" data-f="sedan" aria-pressed="false">Sedans</button><button type="button" class="pill" data-f="suv" aria-pressed="false">SUVs</button></div></div>
  <p class="count" id="count" aria-live="polite">${plural(V.length, 'vehicle', 'vehicles')}</p>
  <div class="grid">${V.map(v => tile(ctx, v)).join('\n')}</div>
  <p class="empty" id="empty" hidden>No vehicles match this filter right now.</p>
  <div class="row" style="margin-top:2.4rem"><a class="btn btn--ghost" href="/vehicles/">Search the full collection</a></div>
</div></section>

<section class="sec light" style="background:var(--ivory2)" data-sc-act="flow"><div class="wrap">
  <div class="head" data-sc-in><div><p class="label">Browse by type</p><h2>Two ways to arrive.</h2></div></div>
  <div class="cats">
    <a class="cat" href="/vehicles/?body=sedan"><div class="ph">${pic('sedans', { sizes: '(min-width:760px) 46vw,92vw', alt: 'Three sedans in a showroom: Lexus LS, Mercedes-Benz S-Class and BMW 7 Series' })}</div><h3>Sedans</h3><p><span>Composed and refined, for the driver and the back seat alike.</span><span>${plural(nS, 'vehicle', 'vehicles')}</span></p></a>
    <a class="cat" href="/vehicles/?body=suv"><div class="ph">${pic('lexus-lx', { sizes: '(min-width:760px) 46vw,92vw', alt: 'Black Lexus LX SUV', style: 'object-position:50% 55%' })}</div><h3>SUVs</h3><p><span>Commanding, spacious and ready for any journey.</span><span>${plural(nU, 'vehicle', 'vehicles')}</span></p></a>
  </div>
</div></section>

<section class="sec dark" data-sc-act="flow"><div class="wrap two">
  <div data-sc-in><p class="label">Comfort and craft</p><h2>Details you notice, and details you feel.</h2>
    <p class="lede">Inside the S-Class the materials do the talking: stitched leather, brushed metal and calm ambient light.</p>
    <ul class="pts"><li>Quilted leather seating</li><li>Brushed metal and fine copper trim</li><li>Screens and controls arranged with restraint</li></ul>
    <div class="row" style="margin-top:1.6rem"><a class="btn btn--ghost" href="${url(V[0])}">See the S-Class</a></div></div>
  <figure class="fig">${pic('craft', { sizes: '(min-width:900px) 50vw,92vw', alt: 'Stitched leather, brushed metal and copper light on the S-Class centre console' })}</figure>
</div></section>

<section id="test-drive" class="sec light" data-sc-act="flow"><div class="wrap two two--r">
  <figure class="fig">${pic('front-cabin', { sizes: '(min-width:900px) 50vw,92vw', alt: 'Front cabin of the S-Class with the driver door open' })}</figure>
  <div data-sc-in><p class="label">Test drive</p><h2>Experience it in person.</h2>
    <p class="lede">Pick a vehicle and a day. We will confirm your slot by WhatsApp or phone.</p>
    <form class="qd" action="/test-drive/" method="get">
      <div class="field"><label for="qd-v">Vehicle</label><select id="qd-v" name="vehicle">${vOpts(V, 'Choose a vehicle')}</select></div>
      <div class="field"><label for="qd-d">Preferred day</label><input id="qd-d" name="date" type="date" data-mindate></div>
      <button class="btn" type="submit">Schedule a Test Drive</button>
    </form>
    <p class="fine">${esc(ctx.cfg.hours)}. A valid driving licence is required.</p></div>
</div></section>

<section id="swap" class="sec dark" data-sc-act="flow"><div class="wrap two">
  <figure class="fig">${pic('swap', { sizes: '(min-width:900px) 46vw,92vw', alt: 'Mercedes-Benz GLE and Lexus RX parked outside a modern house' })}</figure>
  <div data-sc-in><p class="label">Vehicle swap</p><h2>Your next vehicle could start with the one you own.</h2>
    <p class="lede">Tell us what you drive now and which ELDORADO vehicle interests you. We take it from there.</p>
    <ol class="steps">${step('Tell us what you drive', 'Make, model, year and condition.')}${step('Choose your next vehicle', 'Pick from the collection, or tell us what you are looking for.')}${step('We assess and confirm', 'Our team reviews your vehicle and talks you through the options.')}</ol>
    <p class="fine">Any valuation, inspection, eligibility and final arrangement are subject to dealership assessment.</p>
    <div class="row"><a class="btn" href="/vehicle-swap/">Start a Vehicle Swap</a>${ctx.wa(MSG.swap, 'Ask on WhatsApp', 'btn btn--ghost')}</div></div>
</div></section>

<section class="sec light" data-sc-act="flow"><div class="wrap">
  <div class="head" data-sc-in><div><p class="label">The journey</p><h2>From first message to the keys.</h2></div></div>
  <ol class="journey" data-sc-in data-sc-stagger="90">
    <li><b>1</b><h3>Find your vehicle</h3><p>Browse the collection with year, mileage, condition and price shown up front.</p></li>
    <li><b>2</b><h3>Ask or book</h3><p>Message us on WhatsApp, or book a test drive for a day that suits you.</p></li>
    <li><b>3</b><h3>Swap if you like</h3><p>Bring the vehicle you own. We assess it and talk you through the options.</p></li>
    <li><b>4</b><h3>Drive away</h3><p>We prepare the paperwork and hand over the keys in person.</p></li>
  </ol>
</div></section>

<section id="faq" class="sec dark" data-sc-act="flow"><div class="wrap faqw">
  <div data-sc-in><p class="label">Questions</p><h2>Good to know before you ask.</h2></div>
  <div class="faq">${faq(FAQ)}</div>
</div></section>

<section id="contact" class="sec dark close" data-sc-act="flow">
  <div class="bgimg" aria-hidden="true">${pic('rear-dusk', { sizes: '100vw', alt: '' })}</div>
  <div class="wrap" data-sc-in><p class="label">Speak to ELDORADO</p><h2>Tell us which car.</h2>
    <p class="lede">Send a message and we will reply with availability and the next steps.</p>
    <div class="row">${ctx.wa(MSG.general, 'Enquire on WhatsApp')}<a class="btn btn--accent" href="/test-drive/">Schedule a Test Drive</a><a class="btn btn--ghost" href="/contact/">All contact options</a></div>
    <div class="facts"><div><h3>New and foreign used</h3><p>Brand-new and foreign-used vehicles, listed clearly in Naira.</p></div><div><h3>Straight answers</h3><p>Real details on every listing, and a real person when you ask.</p></div><div><h3>Swaps considered</h3><p>Bring the vehicle you own. Assessment comes first, then any arrangement.</p></div></div>
  </div>
</section>`;
  return [{ path: 'index.html', html: layout(ctx, { title: 'ELDORADO | Premium New and Foreign-Used Automobiles in Nigeria', desc: 'Premium new and foreign-used automobiles in Nigeria: Mercedes-Benz, Range Rover, Lexus, Toyota and BMW, priced in Naira. Test drives and vehicle swaps available.', path: '/', body, js: ['home'], engine: true, hero: true }) }];
}

/* ---------- INVENTORY ---------- */
export function inventory(ctx) {
  const { V } = ctx, makes = [...new Set(V.map(v => v.make))].sort(), years = [...new Set(V.map(v => v.year))].sort((a, b) => b - a), conds = [...new Set(V.map(v => v.condition))];
  const caps = [100, 150, 200, 250, 300].map(m => `<option value="${m * 1e6}">Up to ${naira(m * 1e6)}</option>`).join('');
  const body = `${phead('The collection', 'Find your next vehicle.', 'Search by make or model, narrow by body type, year, condition or budget, then open any vehicle for the full details.')}
<section class="sec dark invsec"><div class="wrap">
  <h2 class="sr-only">Search results</h2>
  <div class="invbar"><button class="btn btn--ghost" id="fbtn" aria-expanded="false" aria-controls="filters">Filters</button><p class="count" id="count" aria-live="polite">${plural(V.length, 'vehicle', 'vehicles')}</p>
    <div class="field sortf"><label for="sort">Sort</label><select id="sort"><option value="new">Newest first</option><option value="plow">Price, low to high</option><option value="phigh">Price, high to low</option><option value="year">Model year, newest</option><option value="name">Name, A to Z</option></select></div></div>
  <div class="inv">
    <form class="filters" id="filters" role="search" aria-label="Filter vehicles">
      <div class="field"><label for="q">Search</label><input id="q" type="search" placeholder="Make, model or keyword" autocomplete="off"></div>
      <div class="field"><label for="f-make">Make</label><select id="f-make"><option value="">All makes</option>${makes.map(m => `<option>${esc(m)}</option>`).join('')}</select></div>
      <div class="field"><label for="f-body">Body type</label><select id="f-body"><option value="">All types</option><option value="sedan">Sedan</option><option value="suv">SUV</option></select></div>
      <div class="field"><label for="f-year">Model year</label><select id="f-year"><option value="">Any year</option>${years.map(y => `<option>${y}</option>`).join('')}</select></div>
      <div class="field"><label for="f-cond">Condition</label><select id="f-cond"><option value="">Any condition</option>${conds.map(c => `<option>${esc(c)}</option>`).join('')}</select></div>
      <div class="field"><label for="f-max">Budget</label><select id="f-max"><option value="">Any budget</option>${caps}</select></div>
      <button class="btn btn--ghost" type="button" id="reset">Reset filters</button>
    </form>
    <div>
      <div class="chips" id="chips" role="group" aria-label="Active filters"></div>
      <div class="grid" id="grid">${V.map(v => tile(ctx, v, { compare: true })).join('\n')}</div>
      <div class="emptyb" id="empty" hidden><h2>No vehicles match.</h2><p>Try fewer filters, or tell us what you are looking for and we will check what is coming in.</p><div class="row"><button class="btn" type="button" id="reset2">Reset filters</button>${ctx.wa('Hello ELDORADO, I could not find the vehicle I want in your collection. Can you help me find one?', 'Ask on WhatsApp', 'btn btn--ghost')}</div></div>
    </div>
  </div>
  <div class="cbar" id="cbar" hidden><span id="ctext"></span><div class="row"><button class="btn btn--accent" id="copen" type="button">Compare</button><button class="btn btn--ghost" id="cclear" type="button">Clear</button></div></div>
</div></section>
<dialog id="cdlg" class="wide" aria-labelledby="ct"><div class="dh"><h2 id="ct">Compare vehicles</h2><button class="x" type="button" data-close>Close</button></div><div class="tw" id="ctable"></div></dialog>
<script type="application/json" id="cmpdata">${JSON.stringify(V.map(v => ({ slug: v.slug, name: vName(v), price: priceOf(v), year: v.year, cond: v.condition, body: v.bodyType, mileage: mileageOf(v), trans: v.transmission || '', engine: v.engine || '', drive: v.drivetrain || '', fuel: v.fuel || '', color: v.exteriorColor || '' }))).replace(/</g, '\\u003c')}</script>`;
  return [{ path: 'vehicles/index.html', html: layout(ctx, { title: 'Vehicles | ELDORADO', desc: 'Browse ELDORADO\u2019s new and foreign-used Mercedes-Benz, Range Rover, Lexus, Toyota and BMW vehicles. Search, filter and compare, with prices in Naira.', path: '/vehicles/', body, active: '/vehicles/', js: ['inventory'] }) }];
}

/* ---------- VEHICLE DETAIL ---------- */
export function vehiclePages(ctx) {
  const { V } = ctx;
  return V.map(v => {
    const name = vName(v), imgs = v.gallery;
    const rows = [['Make', v.make], ['Model', v.model], ['Trim', v.trim], ['Model year', v.year], ['Body type', v.bodyType], ['Condition', v.condition], ['Mileage', mileageOf(v)], ['Transmission', v.transmission], ['Engine', v.engine], ['Drivetrain', v.drivetrain], ['Fuel', v.fuel], ['Exterior colour', v.exteriorColor], ['Interior', v.interiorColor], ['Seats', v.seats]].filter(r => r[1]);
    const related = [...V.filter(x => x.slug !== v.slug && x.bodyType === v.bodyType), ...V.filter(x => x.slug !== v.slug && x.bodyType !== v.bodyType)].slice(0, 3);
    const gal = `<div class="gal" data-gallery>
      <div class="stage" aria-live="polite">${imgs.map((g, i) => `<figure class="gfig" data-i="${i}"${i ? ' hidden' : ''}>${pic(g.k, { sizes: '(min-width:960px) 58vw,100vw', alt: g.alt, eager: i === 0, defer: i > 0 })}</figure>`).join('')}</div>
      ${imgs.length > 1 ? `<div class="gthumbs" role="group" aria-label="Vehicle images">${imgs.map((g, i) => `<button type="button" data-t="${i}" aria-label="Show image ${i + 1} of ${imgs.length}: ${esc(g.alt)}" aria-pressed="${i === 0}">${pic(g.k, { sizes: '120px', alt: '' })}</button>`).join('')}</div>` : ''}</div>`;
    const jsonld = ctx.abs('/') ? JSON.stringify({ '@context': 'https://schema.org', '@type': 'Car', name, brand: { '@type': 'Brand', name: v.make }, model: v.model || v.make, vehicleModelDate: String(v.year), bodyType: v.bodyType, itemCondition: v.condition === 'Brand New' ? 'https://schema.org/NewCondition' : 'https://schema.org/UsedCondition', fuelType: v.fuel, vehicleTransmission: v.transmission, color: v.exteriorColor, image: [ctx.abs(`/assets/og/${v.slug}.jpg`)], ...(v.mileageKm != null ? { mileageFromOdometer: { '@type': 'QuantitativeValue', value: v.mileageKm, unitCode: 'KMT' } } : {}), offers: { '@type': 'Offer', price: String(v.price), priceCurrency: 'NGN', availability: 'https://schema.org/InStock', url: ctx.abs(url(v)) } }).replace(/</g, '\\u003c') : '';
    const body = `<section class="vhead dark"><div class="wrap"><nav class="crumbs" aria-label="Breadcrumb"><a href="/">Home</a><span aria-hidden="true">/</span><a href="/vehicles/">Vehicles</a><span aria-hidden="true">/</span><span aria-current="page">${esc(vTitle(v))}</span></nav></div></section>
<section class="sec dark vsec"><div class="wrap vgrid">
  ${gal}
  <div class="vinfo">
    <p class="label">${esc(v.condition)} \u00b7 ${esc(v.bodyType)}</p>
    <h1>${esc(name)}</h1>
    <p class="vtrim">${esc(v.trim || '')}</p>
    <p class="vprice">${esc(priceOf(v))}</p>
    <p class="avail"><i></i>Available</p>
    <ul class="qfacts">${[mileageOf(v), v.transmission, v.drivetrain, v.fuel].filter(Boolean).map(x => `<li>${esc(x)}</li>`).join('')}</ul>
    <div class="vcta">${ctx.wa(waMsgVehicle(v), 'Enquire on WhatsApp')}<a class="btn btn--accent" href="/test-drive/?vehicle=${v.slug}">Schedule a Test Drive</a><a class="btn btn--ghost" href="/vehicle-swap/?vehicle=${v.slug}">Swap your vehicle</a></div>
    <p class="fine">Prices are in Nigerian Naira. Final terms are confirmed with our team.</p>
  </div>
</div></section>
<section class="sec light"><div class="wrap vdetail">
  <div><p class="label">Overview</p><h2>About this ${esc(vTitle(v))}</h2><p class="lede">${esc(v.description)}</p>${v.highlights ? `<ul class="pts pts--l">${v.highlights.map(h => `<li>${esc(h)}</li>`).join('')}</ul>` : ''}</div>
  <div><p class="label">Specifications</p><dl class="specs">${rows.map(([k, val]) => `<div><dt>${k}</dt><dd>${esc(val)}</dd></div>`).join('')}</dl></div>
</div></section>
<section class="sec dark"><div class="wrap"><div class="head"><div><p class="label">You may also like</p><h2>More from the collection.</h2></div><a class="link" href="/vehicles/">Back to all vehicles</a></div>
  <div class="grid">${related.map(r => tile(ctx, r)).join('\n')}</div></div></section>`;
    return { path: `vehicles/${v.slug}/index.html`, html: layout(ctx, { title: `${name}${v.trim ? ' ' + v.trim : ''} | ${v.condition} | ELDORADO`, desc: `${name}${v.trim ? ' ' + v.trim : ''}, ${v.condition.toLowerCase()}, ${priceOf(v)}. ${v.description}`.slice(0, 300), path: url(v), body, active: '/vehicles/', js: ['vehicle'], jsonld, og: `/assets/og/${v.slug}.jpg` }) };
  });
}

/* ---------- FORM PAGES ---------- */
const yearOpts = () => '<option value="">Select year</option>' + Array.from({ length: 28 }, (_, i) => 2026 - i).map(y => `<option>${y}</option>`).join('');
const contactFields = (p) => `<fieldset><legend>Your contact details</legend><div class="fgrid">${F(p + 'name', 'Full name', { req: true, attrs: 'autocomplete="name"' })}${F(p + 'phone', 'Phone or WhatsApp number', { req: true, type: 'tel', attrs: 'autocomplete="tel" inputmode="tel" placeholder="+234 801 234 5678"' })}${F(p + 'email', 'Email', { type: 'email', attrs: 'autocomplete="email"', hint: 'Optional, unless you prefer email replies.' })}</div></fieldset>`;
const statusBox = '<div class="form-status" role="status" aria-live="polite" hidden></div>';

export function swapPage(ctx) {
  const { V } = ctx;
  const body = `<section class="phead dark pheadimg"><div class="bgimg" aria-hidden="true">${pic('swap', { sizes: '100vw', alt: '', eager: true })}</div><div class="wrap"><p class="label">Vehicle swap</p><h1>Your next vehicle could start with the one you own.</h1><p class="lede">Tell us what you drive and what you would like next. Our team reviews your vehicle and talks you through the options.</p><div class="row"><a class="btn" href="#swap-form">Start a Vehicle Swap</a>${ctx.wa(MSG.swap, 'Ask on WhatsApp', 'btn btn--ghost')}</div></div></section>
<section class="sec light"><div class="wrap"><div class="head"><div><p class="label">How it works</p><h2>Three simple steps.</h2></div></div>
  <ol class="journey journey--3"><li><b>1</b><h3>Share your vehicle</h3><p>Make, model, year, mileage and condition, plus anything we should know.</p></li><li><b>2</b><h3>Choose what is next</h3><p>Pick a vehicle from the collection or describe what you want.</p></li><li><b>3</b><h3>We assess and reply</h3><p>Our team reviews your enquiry and contacts you with the next steps.</p></li></ol></div></section>
<section id="swap-form" class="sec light formsec" style="background:var(--ivory2)"><div class="wrap fwrap">
  <div><p class="label">Swap enquiry</p><h2>Tell us about your swap.</h2><p class="lede">This takes about two minutes. Submitting the form does not approve a swap. Any valuation, inspection, eligibility and final arrangement are subject to dealership assessment.</p></div>
  <form class="form" data-form="swap" novalidate>
    <fieldset><legend>Your current vehicle</legend><div class="fgrid">
      ${F('curMake', 'Make', { req: true, attrs: 'autocomplete="off" placeholder="For example, Toyota"' })}${F('curModel', 'Model', { req: true, attrs: 'placeholder="For example, Camry"' })}
      ${S('curYear', 'Model year', yearOpts(), { req: true })}${F('curMileage', 'Approximate mileage (km)', { type: 'number', attrs: 'min="0" max="999999" inputmode="numeric"' })}
      ${S('curCondition', 'Condition', '<option value="">Select condition</option><option>Excellent</option><option>Good</option><option>Fair</option><option>Needs work</option>', { req: true })}
    </div>${T('curDetails', 'Additional details', { hint: 'Service history, accident history, modifications or anything else that matters. Up to 1,000 characters.', cls: 'full' })}</fieldset>
    <fieldset><legend>The vehicle you want</legend><div class="fgrid">
      ${S('wantVehicle', 'Vehicle of interest', vOpts(V, 'Not decided yet'), { cls: '' })}${F('wantOther', 'Preferred make or model', { hint: 'If it is not in the collection yet.' })}
      ${F('budget', 'Budget in Naira', { type: 'number', attrs: 'min="0" inputmode="numeric" placeholder="Optional"', hint: 'Optional. Share only if you wish.' })}
    </div></fieldset>
    ${contactFields('')}
    <fieldset><legend>How should we reach you?</legend><div class="radios" role="radiogroup" aria-label="Preferred contact method"><label><input type="radio" name="contactMethod" value="WhatsApp" checked> WhatsApp</label><label><input type="radio" name="contactMethod" value="Phone call"> Phone call</label><label><input type="radio" name="contactMethod" value="Email"> Email</label></div>
    ${T('comments', 'Anything else?', { rows: 3 })}</fieldset>
    ${hp}${statusBox}
    <button class="btn" type="submit">Send swap enquiry</button>
  </form>
</div></section>
<section class="sec dark"><div class="wrap faqw"><div><p class="label">Good to know</p><h2>Before you send.</h2></div><div class="faq">${faq([
    ['Is a swap guaranteed?', 'No. A swap depends on our assessment of your vehicle and on the vehicle you choose. Nothing is approved by submitting the form.'],
    ['How is my vehicle valued?', 'Our team reviews the details you provide and will usually ask to inspect the vehicle before any figure is discussed.'],
    ['Can I add cash to the swap?', 'Often, yes. Tell us your budget if you wish and we will talk it through.'],
    ['Do I have to swap?', 'No. You can also simply browse and enquire about a vehicle.']])}</div></div></section>`;
  return [{ path: 'vehicle-swap/index.html', html: layout(ctx, { title: 'Vehicle Swap | ELDORADO', desc: 'Swap your current vehicle toward a new or foreign-used car at ELDORADO. Send a swap enquiry; valuation and final arrangement are subject to dealership assessment.', path: '/vehicle-swap/', body, active: '/vehicle-swap/', js: ['forms'] }) }];
}

export function testDrivePage(ctx) {
  const { V, cfg } = ctx;
  const body = `${phead('Test drive', 'Come and drive it.', 'Choose a vehicle, a day and a time window. We confirm every booking by WhatsApp or phone.')}
<section class="sec light formsec"><div class="wrap fwrap">
  <div><p class="label">What to expect</p><h2>A relaxed, unhurried drive.</h2>
    <ul class="pts pts--l"><li>Bring a valid driving licence and a form of ID.</li><li>Allow about 45 minutes with a member of our team.</li><li>${esc(cfg.hours)}.</li><li>Your slot is confirmed only when we reply to you.</li></ul>
    <div class="row" style="margin-top:1.4rem">${ctx.wa(MSG.drive, 'Book on WhatsApp instead', 'btn btn--ghost')}</div></div>
  <form class="form" data-form="test-drive" novalidate>
    <fieldset><legend>Your drive</legend><div class="fgrid">
      ${S('vehicle', 'Vehicle', vOpts(V, 'Choose a vehicle'), { req: true })}${F('date', 'Preferred day', { type: 'date', req: true, attrs: 'data-mindate data-nosunday', hint: 'Monday to Saturday.' })}
      ${S('slot', 'Time window', '<option value="">Select a time window</option><option>Morning, 9:00 to 12:00</option><option>Afternoon, 12:00 to 15:00</option><option>Late afternoon, 15:00 to 18:00</option>', { req: true })}
    </div></fieldset>
    ${contactFields('')}
    <fieldset><legend>Before you book</legend><div class="check"><label><input type="checkbox" name="licence" id="licence" required> I hold a valid driving licence.</label><p class="err" id="licence-err" role="alert"></p></div>${T('notes', 'Notes', { rows: 3, hint: 'Anything we should prepare, such as a child seat or a specific route.' })}</fieldset>
    ${hp}${statusBox}
    <button class="btn" type="submit">Request test drive</button>
  </form>
</div></section>`;
  return [{ path: 'test-drive/index.html', html: layout(ctx, { title: 'Schedule a Test Drive | ELDORADO', desc: 'Book a test drive at ELDORADO. Choose a vehicle, a day and a time window; we confirm by WhatsApp or phone.', path: '/test-drive/', body, active: '/test-drive/', js: ['forms'] }) }];
}

export function contactPage(ctx) {
  const { V, cfg } = ctx, ph = cfg.phone ? `<a href="tel:${esc(cfg.phone.replace(/[^\d+]/g, ''))}">${esc(cfg.phone)}</a>` : '', em = cfg.email ? `<a href="mailto:${esc(cfg.email)}">${esc(cfg.email)}</a>` : '';
  const body = `${phead('Contact', 'Speak to ELDORADO.', 'WhatsApp is the fastest way to reach us. You can also call, email or send the form below.')}
<section class="sec light"><div class="wrap"><h2 class="sr-only">Ways to reach us</h2><div class="cards">
  <div class="card"><h3>WhatsApp</h3><p>The quickest reply, usually the same day.</p>${ctx.wa(MSG.general, 'Message on WhatsApp')}</div>
  <div class="card"><h3>Call</h3><p>${ph}</p><p class="fine">${esc(cfg.hours)}</p></div>
  <div class="card"><h3>Email</h3><p>${em}</p><p class="fine">We reply during business hours.</p></div>
  <div class="card"><h3>Visit</h3><p>${esc(cfg.address)}</p><p class="fine">Showroom visits and test drives by appointment.</p></div>
</div></div></section>
<section class="sec light formsec" style="background:var(--ivory2)"><div class="wrap fwrap">
  <div><p class="label">Send a message</p><h2>How can we help?</h2><p class="lede">Tell us a little and we will get back to you. For anything urgent, WhatsApp is best.</p></div>
  <form class="form" data-form="contact" novalidate>
    <fieldset><legend>Your message</legend><div class="fgrid">${S('subject', 'Subject', '<option value="">Select a subject</option><option>General enquiry</option><option>Vehicle enquiry</option><option>Vehicle swap</option><option>Test drive</option><option>Something else</option>', { req: true })}${S('vehicle', 'Vehicle (optional)', vOpts(V, 'None in particular'))}</div>${T('message', 'Message', { req: true, rows: 5, cls: 'full', hint: 'Up to 1,500 characters.' })}</fieldset>
    ${contactFields('')}
    ${hp}${statusBox}
    <button class="btn" type="submit">Send message</button>
  </form>
</div></section>`;
  return [{ path: 'contact/index.html', html: layout(ctx, { title: 'Contact | ELDORADO', desc: 'Contact ELDORADO by WhatsApp, phone or email, or send an enquiry about a vehicle, a swap or a test drive.', path: '/contact/', body, active: '/contact/', js: ['forms'] }) }];
}

export function aboutPage(ctx) {
  const body = `${phead('About ELDORADO', 'A dealership built on clarity.', 'ELDORADO exists to make buying a premium automobile in Nigeria straightforward: well-chosen vehicles, honest details and a team that answers.')}
<section class="sec light"><div class="wrap two"><div><p class="label">Our approach</p><h2>Fewer cars, better chosen.</h2>
  <p class="lede">We would rather show a focused collection than a long list. Every vehicle is presented with the details a buyer needs: year, mileage, condition and price in Naira.</p>
  <div class="trio trio--stack"><div><h3>Selection</h3><p>Sedans and SUVs from Mercedes-Benz, Range Rover, Lexus, Toyota and BMW, new and foreign used.</p></div><div><h3>Transparency</h3><p>Clear listings, plain answers and no pressure. If a detail is not on the page, ask us.</p></div><div><h3>Service</h3><p>Test drives by appointment, vehicle swaps considered and a person on the other end of WhatsApp.</p></div></div></div>
  <figure class="fig">${pic('collection', { sizes: '(min-width:900px) 50vw,92vw', alt: 'A Mercedes-Benz S-Class, Range Rover, Lexus RX and Toyota Land Cruiser in a showroom' })}</figure></div></section>
<section class="sec dark"><div class="wrap two two--r"><figure class="fig">${pic('architecture', { sizes: '(min-width:900px) 50vw,92vw', alt: 'A long stone and glass showroom hall with one dark sedan at the far end' })}</figure>
  <div><p class="label">What we offer</p><h2>Four ways to arrive.</h2>
  <ol class="steps">${step('Brand-new vehicles', 'Current-year models, delivered with delivery mileage only.')}${step('Foreign-used vehicles', 'Low-mileage, carefully selected vehicles, often called tokunbo.')}${step('Vehicle swaps', 'Bring the vehicle you own. Valuation is subject to dealership assessment.')}${step('Test drives', 'Choose a day and a time window. We confirm by WhatsApp or phone.')}</ol>
  <div class="row"><a class="btn" href="/vehicles/">View the collection</a><a class="btn btn--ghost" href="/contact/">Contact us</a></div></div></div></section>`;
  return [{ path: 'about/index.html', html: layout(ctx, { title: 'About | ELDORADO', desc: 'ELDORADO is a premium automobile dealership in Nigeria offering new and foreign-used vehicles, test drives and vehicle swaps.', path: '/about/', body, active: '/about/', js: ['common'] }) }];
}
