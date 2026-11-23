import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
const file = path.resolve('output/rate-qa-report.html');
http.createServer(async (request,response) => {
  if (request.method !== 'GET' || request.url !== '/') { response.writeHead(404); response.end(); return; }
  try { response.writeHead(200,{'Content-Type':'text/html; charset=utf-8','Cache-Control':'no-store'}); response.end(await fs.readFile(file)); }
  catch { response.writeHead(503); response.end('Report unavailable'); }
}).listen(3004,'127.0.0.1',()=>console.log('QA report: http://127.0.0.1:3004/'));
