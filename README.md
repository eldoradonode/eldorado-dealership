# ELDORADO dealership website (portfolio showcase)

Static, multi-page site (plain HTML, CSS, JS) with a ScrollCraft scroll sequence on the home page, a filterable inventory,
vehicle pages, a vehicle-swap form, a test-drive booking form, contact and about pages, and one serverless endpoint for the forms.
`dist/` is the finished, prebuilt site. Vercel and Netlify serve it as-is (no build step needed).

## Deploy (Vercel or Netlify)
1. Put this folder in a GitHub repo and import it into Vercel or Netlify. Settings are already in `vercel.json` / `netlify.toml` (publish `dist`).
2. Forms: add the environment variable `ENQUIRY_WEBHOOK_URL` (your n8n webhook URL). Optional: `ENQUIRY_WEBHOOK_SECRET`, sent as header `x-webhook-secret`.
   Until it is set, the forms say they could not send and offer WhatsApp. They never show a fake success.
3. Webhook payload: `{ "source": "eldorado-site", "type": "swap" | "test-drive" | "contact", "receivedAt": "ISO date", "data": { ...validated fields } }`.

## Change the details for a client
- Contact details: edit `config.js` inside `dist/` (no rebuild), or `src/site.config.json` then rebuild.
- Vehicles, prices (Naira), specs, availability: `src/vehicles.json`. Set `"status": "sold"` to remove a car. Leave `price` out to show "Contact for Price".
- Images: put originals in `orig/`, register them in `lib/images.mjs` (SRC) and reference them in `vehicles.json`.
- Demo notice in the footer: set `"demo": false`. Search engines: set `"indexable": true` and a `"siteUrl"` (or env `SITE_URL`) to get canonical URLs and a sitemap.
- Everything marked as sample (vehicles, prices, hours, address) must be replaced with the client's real information.

## Commands
`npm install` once, then `npm run build` (writes `dist/`), `npm run preview` (local site on http://localhost:4173 including the form endpoint), `npm test` (validation and endpoint tests).
Links are root-based, so open the site through the preview server or a host, not by double-clicking `index.html`.

## Notes
- Images are AVIF with JPEG fallback. The home sequence loads frame by frame and respects reduced-motion.
- Caching headers for fingerprinted CSS/JS and fonts are set in `vercel.json` / `netlify.toml`.
- The rate limit in the endpoint is best-effort (in memory). Add a CAPTCHA or provider-level limit before real traffic.
