import { esc } from './util.mjs';
import { preloadHero } from './images.mjs';

const MARK = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' fill='%230a0a0b'/%3E%3Crect x='11' y='11' width='10' height='10' fill='none' stroke='%23c9b27c' stroke-width='1.5' transform='rotate(45 16 16)'/%3E%3C/svg%3E";
export const NAV = [['Vehicles', '/vehicles/'], ['Vehicle Swap', '/vehicle-swap/'], ['Test Drive', '/test-drive/'], ['About', '/about/'], ['Contact', '/contact/']];

export function makeCtx({ cfg, V, F }) {
  const waNum = String(cfg.whatsapp || '').replace(/\D/g, '');
  const wa = (msg, label, cls = 'btn') => waNum
    ? `<a class="${cls}" href="https://wa.me/${waNum}?text=${encodeURIComponent(msg)}" target="_blank" rel="noopener">${label}</a>`
    : `<button type="button" class="${cls}" data-wa-missing data-msg="${esc(msg)}">${label}</button>`;
  const abs = p => (cfg.siteUrl ? cfg.siteUrl.replace(/\/$/, '') + p : '');
  return { cfg, V, F, waNum, wa, abs };
}

export const header = (ctx, active = '') => `<header class="bar">
  <a class="mark" href="/" aria-label="ELDORADO, home">ELDORADO</a>
  <nav class="nav" aria-label="Primary">${NAV.map(([t, h]) => `<a href="${h}"${active === h ? ' aria-current="page"' : ''}>${t}</a>`).join('')}</nav>
  <div class="row">${ctx.wa('Hello ELDORADO, I would like to enquire about a vehicle.', 'WhatsApp', 'btn btn--ghost btn-wa')}<a class="btn btn--accent btn-td" href="/test-drive/">Test Drive</a><button class="menu-btn" id="menu-btn" aria-label="Open menu" aria-expanded="false" aria-controls="menu"><span></span></button></div>
</header>
<div class="menu" id="menu" role="dialog" aria-label="Menu"><button class="menu-x" type="button">Close</button>${NAV.map(([t, h]) => `<a href="${h}">${t}</a>`).join('')}${ctx.wa('Hello ELDORADO, I would like to enquire about a vehicle.', 'Enquire on WhatsApp')}</div>`;

export const footer = (ctx) => {
  const c = ctx.cfg;
  const lines = [c.phone && `<a href="tel:${esc(c.phone.replace(/[^\d+]/g, ''))}">${esc(c.phone)}</a>`, c.email && `<a href="mailto:${esc(c.email)}">${esc(c.email)}</a>`, c.address && `<span>${esc(c.address)}</span>`, c.hours && `<span>${esc(c.hours)}</span>`].filter(Boolean);
  return `<footer><div class="wrap">
  <div><a class="mark" href="/">ELDORADO</a><p class="lede" style="margin:.8rem 0 1.2rem;font-size:.95rem">Premium new and foreign-used automobiles, Nigeria.</p><div class="contact-lines" id="contact-lines">${lines.join('')}</div></div>
  <nav aria-label="Footer">${NAV.map(([t, h]) => `<a href="${h}">${t}</a>`).join('')}</nav>
  <div class="frow">${ctx.wa('Hello ELDORADO, I would like to enquire about a vehicle.', 'WhatsApp', 'btn btn--ghost')}<a class="btn btn--accent" href="/test-drive/">Schedule a Test Drive</a></div>
  <p class="small">\u00a9 ${new Date().getFullYear()} ELDORADO. All prices are in Nigerian Naira. Images are representative of the vehicles offered.${c.demo ? ' ELDORADO is a portfolio demonstration by Eldorado Node; vehicle listings and prices are sample content.' : ''}</p>
</div></footer>
<dialog id="wa-missing" aria-labelledby="wm-t"><form method="dialog"><h2 id="wm-t">WhatsApp is being set up</h2><p>Our WhatsApp line is not connected yet. Please check back shortly.</p><button class="btn btn--ghost">Close</button></form></dialog>`;
};

/* one page shell for every route */
export function layout(ctx, { title, desc, path, body, active = '', og = '/assets/og.jpg', jsonld = '', js = ['common'], engine = false, hero = false }) {
  const { cfg, F } = ctx, canon = ctx.abs(path), ogAbs = ctx.abs(og);
  const robots = cfg.indexable ? '' : '<meta name="robots" content="noindex, nofollow">\n';
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
<meta name="theme-color" content="#0a0a0b">
${robots}${canon ? `<link rel="canonical" href="${canon}">\n<meta property="og:url" content="${canon}">\n` : ''}${ogAbs ? `<meta property="og:image" content="${ogAbs}">\n` : ''}<meta property="og:type" content="website"><meta property="og:site_name" content="ELDORADO"><meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${esc(desc)}">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="${MARK}">
<link rel="preload" href="/assets/fonts/bodoni-moda-latin-wght-normal.woff2" as="font" type="font/woff2" crossorigin>
${hero ? preloadHero() + '\n' : ''}<link rel="stylesheet" href="/assets/${F.css}">
<script>document.documentElement.className+=' js'</script>
${jsonld ? `<script type="application/ld+json">${jsonld}</script>\n` : ''}</head>
<body>
<a class="skip" href="#main">Skip to content</a>
${header(ctx, active)}
<main id="main">
${body}
</main>
${footer(ctx)}
<script src="/config.js" defer></script>
${engine ? `<script src="/assets/${F.eng}" defer></script>\n` : ''}${js.map(k => `<script src="/assets/${F.js[k]}" defer></script>`).join('\n')}
</body>
</html>`;
}
