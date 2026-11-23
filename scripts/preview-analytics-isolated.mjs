// Loopback-only QA proxy. Never deploy this helper or use it as a production server.
import http from 'node:http';

const upstream = 'http://127.0.0.1:3006';
const injection = `<script>
(() => {
  const events = [];
  let configured = false;
  const layer = [];
  const render = () => {
    const box = document.getElementById('analytics-qa-log');
    if (!box) return;
    box.textContent = JSON.stringify({ isolated: true, configured, eventCount: events.length, events }, null, 2);
  };
  layer.push = function(...items) {
    for (const item of items) {
      const args = Array.from(item);
      if (args[0] === 'config') configured = true;
      if (args[0] === 'event') events.push({ name: args[1], parameters: args[2] });
    }
    const length = Array.prototype.push.apply(this, items);
    render();
    return length;
  };
  window.dataLayer = layer;
  document.addEventListener('DOMContentLoaded', () => {
    const panel = document.createElement('aside');
    panel.id = 'analytics-qa-panel';
    panel.setAttribute('aria-label', 'Isolated analytics QA output');
    panel.style.cssText = 'position:fixed;bottom:0;left:0;right:0;max-height:22vh;overflow:auto;z-index:9999;background:#06110d;color:#5cff9d;border-top:1px solid #36704b;padding:8px 14px;pointer-events:none;font:12px monospace;direction:ltr;text-align:left';
    const title = document.createElement('strong');
    title.textContent = 'LOCAL QA ONLY — external scripts/connections blocked; store navigation suppressed';
    const log = document.createElement('pre');
    log.id = 'analytics-qa-log';
    log.style.cssText = 'white-space:pre-wrap;margin:5px 0';
    panel.append(title, log);
    document.body.append(panel);
    render();
  });
  // Runs after the product's document listener, preserving normal tracking order.
  // External navigation is suppressed only in this isolated QA copy.
  function blockExternal(event) {
    const a = event.target instanceof Element ? event.target.closest('a[href]') : null;
    if (a && new URL(a.href, location.href).origin !== location.origin) event.preventDefault();
  }
  window.addEventListener('click', blockExternal);
  window.addEventListener('auxclick', blockExternal);
  document.addEventListener('submit', event => event.preventDefault(), true);
})();
</script>`;

const policy = [
  "default-src 'none'", "script-src 'self' 'unsafe-inline'", "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:", "font-src 'self'", "connect-src 'self'",
  "form-action 'none'", "base-uri 'none'", "frame-ancestors 'none'", "object-src 'none'",
].join('; ');

http.createServer(async (request, response) => {
  // No writes, external upstreams, request credentials, arbitrary proxy targets, or redirects.
  if (request.method !== 'GET' && request.method !== 'HEAD') {
    response.writeHead(405); response.end('QA proxy is read-only'); return;
  }
  let url;
  try { url = new URL(request.url, upstream); } catch { response.writeHead(400); response.end(); return; }
  if (url.origin !== upstream || !(url.pathname === '/' || url.pathname.startsWith('/_next/') ||
      url.pathname.startsWith('/marketing/') || /^\/(?:favicon[^/]*|icon-\d+\.png|apple-touch-icon\.png|manifest\.json)$/.test(url.pathname))) {
    response.writeHead(404); response.end(); return;
  }
  try {
    const result = await fetch(url, { redirect: 'manual', signal: AbortSignal.timeout(15000) });
    const type = result.headers.get('content-type') ?? 'application/octet-stream';
    let body = Buffer.from(await result.arrayBuffer());
    if (type.includes('text/html')) body = Buffer.from(body.toString('utf8').replace('<head>', `<head>${injection}`));
    response.writeHead(result.status, {
      'Content-Type': type, 'Cache-Control': 'no-store',
      'Content-Security-Policy': policy, 'X-Content-Type-Options': 'nosniff',
      'X-Robots-Tag': 'noindex, nofollow', 'Referrer-Policy': 'no-referrer',
    });
    response.end(request.method === 'HEAD' ? undefined : body);
  } catch {
    response.writeHead(503); response.end('Start the local production preview on 127.0.0.1:3006 first.');
  }
}).listen(3007, '127.0.0.1', () => console.log('ISOLATED QA ONLY: http://127.0.0.1:3007/'));
