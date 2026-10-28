import fs from 'node:fs';
import crypto from 'node:crypto';
import sharp from 'sharp';
import { transform, build as bundle } from 'esbuild';
import { prepareImages, SRC } from './lib/images.mjs';
import { makeCtx, layout } from './lib/layout.mjs';
import { home, inventory, vehiclePages, swapPage, testDrivePage, contactPage, aboutPage } from './lib/pages.mjs';

const OUT = process.env.OUT || 'dist', ENGINE = process.env.ENGINE || 'vendor/scrollcraft';
const cfg = JSON.parse(fs.readFileSync('src/site.config.json', 'utf8'));
if (process.env.SITE_URL) cfg.siteUrl = process.env.SITE_URL;
const V = JSON.parse(fs.readFileSync('src/vehicles.json', 'utf8')).filter(v => v.status === 'available').sort((a, b) => Number(b.featured) - Number(a.featured));
const hash = s => crypto.createHash('md5').update(s).digest('hex').slice(0, 8);

fs.mkdirSync(`${OUT}/assets/fonts`, { recursive: true }); fs.mkdirSync(`${OUT}/assets/og`, { recursive: true });
for (const f of fs.readdirSync(`${OUT}/assets`)) if (/^(app|engine|home|common|inventory|vehicle|forms)\.[0-9a-f]{8}\.(css|js)$/.test(f)) fs.unlinkSync(`${OUT}/assets/${f}`);
for (const f of fs.readdirSync('src/fonts')) fs.copyFileSync(`src/fonts/${f}`, `${OUT}/assets/fonts/${f}`);
await prepareImages(OUT);
for (const v of V) { const o = `${OUT}/assets/og/${v.slug}.jpg`; if (!fs.existsSync(o)) await sharp(`orig/${SRC[v.gallery[0].k]}`).resize(1200, 630, { fit: 'cover', position: 'attention' }).jpeg({ quality: 78 }).toFile(o); }

/* css and js, fingerprinted for long-lived caching */
const css = (await transform(fs.readFileSync(`${ENGINE}/scrollcraft.css`, 'utf8') + '\n' + fs.readFileSync('src/styles.css', 'utf8'), { loader: 'css', minify: true })).code;
const eng = (await transform(fs.readFileSync(`${ENGINE}/scrollcraft.js`, 'utf8'), { minify: true })).code;
const ENTRY = { common: 'import "./common.js"', home: 'import "./common.js";import "./home.js"', inventory: 'import "./common.js";import "./inventory.js"', vehicle: 'import "./common.js";import "./vehicle.js"', forms: 'import "./common.js";import "./forms.js"' };
const F = { css: `app.${hash(css)}.css`, eng: `engine.${hash(eng)}.js`, js: {} };
fs.writeFileSync(`${OUT}/assets/${F.css}`, css); fs.writeFileSync(`${OUT}/assets/${F.eng}`, eng);
for (const [k, src] of Object.entries(ENTRY)) {
  const code = (await bundle({ stdin: { contents: src, resolveDir: 'src/js', loader: 'js' }, bundle: true, minify: true, write: false, format: 'iife', target: 'es2019' })).outputFiles[0].text;
  F.js[k] = `${k}.${hash(code)}.js`; fs.writeFileSync(`${OUT}/assets/${F.js[k]}`, code);
}

/* pages */
const ctx = makeCtx({ cfg, V, F });
const pages = [...home(ctx), ...inventory(ctx), ...vehiclePages(ctx), ...swapPage(ctx), ...testDrivePage(ctx), ...contactPage(ctx), ...aboutPage(ctx)];
const nf = layout(ctx, { title: 'Page not found | ELDORADO', desc: 'This page could not be found.', path: '/404.html', js: ['common'], body: '<section class="phead dark" style="min-height:70vh"><div class="wrap"><p class="label">404</p><h1>This page is not in the collection.</h1><p class="lede">The page may have moved, or the vehicle may no longer be available.</p><div class="row"><a class="btn" href="/vehicles/">View the collection</a><a class="btn btn--ghost" href="/">Back home</a></div></div></section>' });
pages.push({ path: '404.html', html: nf });
for (const p of pages) { const f = `${OUT}/${p.path}`; fs.mkdirSync(f.slice(0, f.lastIndexOf('/')), { recursive: true }); fs.writeFileSync(f, p.html); }

/* settings people can edit after deploy, plus robots and sitemap */
const pub = { whatsapp: cfg.whatsapp, phone: cfg.phone, email: cfg.email, address: cfg.address, hours: cfg.hours, endpoint: cfg.endpoint || '/api/enquiry' };
fs.writeFileSync(`${OUT}/config.js`, `/* ELDORADO settings. Edit the values between the quotes and save; no rebuild needed.\n   whatsapp: international format with country code, digits only or with a plus, for example +2348096454731. */\nwindow.ELDORADO = ${JSON.stringify(pub, null, 2)};\n`);
const base = cfg.siteUrl ? cfg.siteUrl.replace(/\/$/, '') : '';
fs.writeFileSync(`${OUT}/robots.txt`, cfg.indexable ? `User-agent: *\nAllow: /\n${base ? `Sitemap: ${base}/sitemap.xml\n` : ''}` : 'User-agent: *\nDisallow: /\n');
if (base && cfg.indexable) fs.writeFileSync(`${OUT}/sitemap.xml`, `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${pages.filter(p => p.path !== '404.html').map(p => `<url><loc>${base}/${p.path.replace(/index\.html$/, '')}</loc></url>`).join('\n')}\n</urlset>\n`);
console.log(`built ${OUT}: ${pages.length} pages, ${V.length} vehicles, indexable=${!!cfg.indexable}, siteUrl=${base || '(none)'}`);
