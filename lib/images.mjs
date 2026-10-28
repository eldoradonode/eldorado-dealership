import fs from 'node:fs';
import sharp from 'sharp';
import { esc } from './util.mjs';

export const SRC = { 'hero-front': 'a.png', 'side-profile': 'b.png', 'rear-dusk': 'j1.jpg', sedans: 'j2.jpg', craft: 'j3.jpg', architecture: 'j4.jpg', swap: 'j5.jpg', 'land-cruiser': 'j6.jpg', collection: 'j7.jpg', 'lexus-lx': 'j8.jpg', 'range-rover': 'j9.jpg', 'grille-detail': 'j10.jpg', 'rear-seats': 'j11.jpg', 'driver-view': 'j12.jpg', 'front-cabin': 'j13.jpg', 'rear-showroom': 'j14.jpg', ls: 'ls.png', bmw7: 'bmw7.png', gle: 'gle.png', rx: 'rx.png', 'rr-front': 'rr-front.png', 'rr-side': 'rr-side.png', 'lx-front': 'lx-front.png', 'lx-side': 'lx-side.png', 'lc-front': 'lc-front.png', 'lc-side': 'lc-side.png' };
export const IM = {};

export async function prepareImages(OUT) {
  fs.mkdirSync(`${OUT}/assets/img`, { recursive: true });
  for (const [k, f] of Object.entries(SRC)) {
    const input = `orig/${f}`, m = await sharp(input).metadata();
    const ws = [...new Set([480, 960, m.width].filter(w => w <= m.width))].sort((a, b) => a - b);
    const jw = ws.filter(w => w <= 1200).pop();
    IM[k] = { w: m.width, h: m.height, ws, jw };
    for (const w of ws) {
      const a = `${OUT}/assets/img/${k}-${w}.avif`;
      if (!fs.existsSync(a)) await sharp(input).resize({ width: w, withoutEnlargement: true }).avif({ quality: 50, effort: 4 }).toFile(a);
    }
    const j = `${OUT}/assets/img/${k}-${jw}.jpg`;
    if (!fs.existsSync(j)) await sharp(input).resize({ width: jw, withoutEnlargement: true }).jpeg({ quality: 74, mozjpeg: true }).toFile(j);
  }
  await sharp('orig/a.png').resize(1200, 630, { fit: 'cover' }).jpeg({ quality: 80 }).toFile(`${OUT}/assets/og.jpg`);
}
const ss = (k) => IM[k].ws.map(w => `/assets/img/${k}-${w}.avif ${w}w`).join(', ');
export const preloadHero = () => `<link rel="preload" as="image" type="image/avif" imagesrcset="${ss('hero-front')}" imagesizes="100vw" fetchpriority="high">`;
/* eager: priority image. defer: loaded by script (data-srcset). default: native lazy. */
export const pic = (k, { sizes = '100vw', alt = '', eager = false, defer = false, style = '', cls = '' } = {}) => {
  const m = IM[k], st = style ? ` style="${style}"` : '', c = cls ? ` class="${cls}"` : '', src = `/assets/img/${k}-${m.jw}.jpg`;
  if (defer) return `<picture data-defer><source type="image/avif" data-srcset="${ss(k)}" sizes="${sizes}"><img data-src="${src}" src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==" width="${m.w}" height="${m.h}" alt="${esc(alt)}" decoding="async"${st}${c}></picture><noscript><img src="${src}" width="${m.w}" height="${m.h}" alt="${esc(alt)}"></noscript>`;
  return `<picture><source type="image/avif" srcset="${ss(k)}" sizes="${sizes}"><img src="${src}" width="${m.w}" height="${m.h}" alt="${esc(alt)}" ${eager ? 'fetchpriority="high" decoding="async"' : 'loading="lazy" decoding="async"'}${st}${c}></picture>`;
};
