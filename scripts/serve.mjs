import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
const root=path.resolve('dist'),port=Number(process.env.PORT)||3000;
if(!fs.existsSync(path.join(root,'index.html')))throw Error('Run npm run build first.');
const mime={'.html':'text/html','.js':'text/javascript','.json':'application/json','.css':'text/css','.svg':'image/svg+xml','.woff2':'font/woff2','.wasm':'application/wasm','.txt':'text/plain'};
http.createServer((req,res)=>{try{let pathname=decodeURIComponent(new URL(req.url,'http://local').pathname);const base='/Iconshelf.io';if(pathname===base||pathname===base+'/')pathname='/';else if(pathname.startsWith(base+'/'))pathname=pathname.slice(base.length);const file=path.resolve(root,'.'+(pathname==='/'?'/index.html':pathname));if(!file.startsWith(root+path.sep)||!fs.existsSync(file)||fs.statSync(file).isDirectory()){res.writeHead(404);res.end('Not found');return;}res.setHeader('Content-Type',mime[path.extname(file)]||'application/octet-stream');fs.createReadStream(file).pipe(res);}catch{res.writeHead(400);res.end('Bad request');}}).listen(port,'0.0.0.0',()=>console.log(`Static Icon Shelf running on port ${port}`));
