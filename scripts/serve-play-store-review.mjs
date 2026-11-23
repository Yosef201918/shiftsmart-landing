import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const assets=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../assets');
const prefixes=['/play-store/183-review/','/app-captures/play-183-light/','/play-store/183-dark-A/','/app-captures/play-183-dark/'];
http.createServer(async(req,res)=>{
 if(req.method!=='GET'&&req.method!=='HEAD'){res.writeHead(405).end();return;}
 try{
  const url=new URL(req.url,'http://127.0.0.1');
  if(url.pathname==='/'){res.writeHead(302,{Location:'/play-store/183-review/GALLERY.html'}).end();return;}
  const pathname=decodeURIComponent(url.pathname);
  if(!prefixes.some(prefix=>pathname.startsWith(prefix))){res.writeHead(404).end();return;}
  const file=path.resolve(assets,'.'+pathname);
  if(!file.startsWith(assets+path.sep)){res.writeHead(404).end();return;}
  const types={'.html':'text/html; charset=utf-8','.png':'image/png','.json':'application/json; charset=utf-8'};
  if(!types[path.extname(file)]){res.writeHead(404).end();return;}
  const bytes=await fs.readFile(file);
  res.writeHead(200,{'Content-Type':types[path.extname(file)],'Cache-Control':'no-store','X-Content-Type-Options':'nosniff'});
  res.end(req.method==='HEAD'?undefined:bytes);
 }catch{res.writeHead(404).end();}
}).listen(Number(process.env.PLAY_REVIEW_PORT??3011),'127.0.0.1',()=>console.log('שרת גלריה מקומי מוכן'));
