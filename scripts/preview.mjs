import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { handleEnquiry } from '../lib/enquiry-core.mjs';
/* Local preview with clean URLs and the enquiry endpoint. Run: npm run preview */
const root = path.resolve(process.env.DIST || 'dist'), port = +process.env.PORT || 4173;
const T = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.json': 'application/json', '.jpg': 'image/jpeg', '.avif': 'image/avif', '.woff2': 'font/woff2', '.txt': 'text/plain', '.xml': 'application/xml' };
http.createServer(async (req, res) => {
  const u = new URL(req.url, 'http://x');
  if (u.pathname === '/api/enquiry') {
    let b = ''; for await (const c of req) b += c; let body = null; try { body = JSON.parse(b); } catch { body = null; }
    const r = await handleEnquiry({ method: req.method, body, ip: req.socket.remoteAddress, env: process.env });
    res.writeHead(r.status, { 'content-type': 'application/json' }); return res.end(JSON.stringify(r.body));
  }
  let p = path.join(root, decodeURIComponent(u.pathname));
  if (!p.startsWith(root)) { res.writeHead(403); return res.end(); }
  if (fs.existsSync(p) && fs.statSync(p).isDirectory()) p = path.join(p, 'index.html');
  if (!fs.existsSync(p)) { res.writeHead(404, { 'content-type': T['.html'] }); return res.end(fs.readFileSync(path.join(root, '404.html'))); }
  res.writeHead(200, { 'content-type': T[path.extname(p)] || 'application/octet-stream' }); fs.createReadStream(p).pipe(res);
}).listen(port, () => console.log(`ELDORADO preview on http://localhost:${port}`));
