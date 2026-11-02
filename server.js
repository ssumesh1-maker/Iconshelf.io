import http from 'node:http';
import {execFile} from 'node:child_process';
import {promisify} from 'node:util';
import os from 'node:os';
const execFileAsync=promisify(execFile);
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createRequire} from 'node:module';
import sharp from 'sharp';
import PDFDocument from 'pdfkit';
import SVGtoPDF from 'svg-to-pdfkit';
const require=createRequire(import.meta.url), root=path.dirname(fileURLToPath(import.meta.url));
const definitions=[['lucide','Lucide','Clean, consistent essentials','Outlined','ISC','24'],['tabler','Tabler Icons','A toolkit for every interface','Outlined','MIT','24'],['ph','Phosphor','Flexible icons with personality','Outlined','MIT','256'],['mdi','Material Design Icons','A comprehensive UI collection','Filled','Apache-2.0','24'],['simple-icons','Simple Icons','The brands you build with','Filled','CC0-1.0','24'],['twemoji','Twemoji','A little more expression','Flat','CC-BY-4.0','36']];
const collections=definitions.map(([id,name,description,style,license,size])=>({id,name,description,style,license,size,...require(`@iconify-json/${id}/icons.json`),info:require(`@iconify-json/${id}/info.json`)}));
export const functions=['UI / Navigation','Action','Status','App','Favicon','Brand / Social','Informational & Decorative'];
export const styles=['Outlined','Filled','Line Duotone','Flat','Gradient','3D / Skeuomorphic','Hand-drawn','Isometric'];
function classify(name,pack){
 const categories=[];
 if(/home|house|menu|search|arrow|chevron|navigation|compass|layout|panel|sidebar/.test(name))categories.push(functions[0]);
 if(/play|pause|trash|delete|pencil|edit|download|upload|save|copy|cut|send|share|plus|minus|refresh|rotate|check|add|remove|zoom|filter|sort/.test(name))categories.push(functions[1]);
 if(/wifi|battery|loader|loading|alert|warning|error|signal|bell|notification|progress|shield|lock|check-circle/.test(name))categories.push(functions[2]);
 if(/app|application|calculator|calendar|camera|mail|music|browser|terminal|code/.test(name))categories.push(functions[3]);
 if(/star|heart|circle|hexagon|diamond|sparkle|flower/.test(name))categories.push(functions[4]);
 if(pack==='simple-icons'||/brand-|logo-|facebook|instagram|youtube|github|twitter/.test(name))categories.push(functions[5]);
 if(!categories.length||/info|help|question|sparkle|flower|sun|moon/.test(name))categories.push(functions[6]);
 let metaphor=/help|question|power|command|hash|asterisk|plus|minus|check|x$/.test(name)?'Arbitrary':/cloud|home|house|link|share|save|download|upload|shield|lock|key|flag|bookmark/.test(name)?'Reference (Analogy)':'Resemblance';
 if(pack==='simple-icons')metaphor='Arbitrary';
 let style=collections.find(c=>c.id===pack).style;
 if(pack==='ph') style=name.endsWith('-duotone')?'Line Duotone':/-fill$/.test(name)?'Filled':'Outlined';
 if(pack==='tabler'&&name.endsWith('-filled'))style='Filled';
 if(pack==='mdi'&&name.endsWith('-outline'))style='Outlined';
 return {categories,metaphor,style};
}
const icons=collections.flatMap(c=>Object.keys(c.icons).map(name=>({id:`${c.id}:${name}`,name,label:name.replace(/-/g,' '),pack:c.id,...classify(name,c.id)})));
const packInfo=collections.map(c=>({id:c.id,name:c.name,description:c.description,style:c.style,count:Object.keys(c.icons).length,license:c.info.license?.title||c.license,licenseUrl:c.info.license?.url||'',author:c.info.author?.name||'',url:c.info.author?.url||'',samples:Object.keys(c.icons).filter(n=>/^(home|heart|star|search|camera|house|github|apple|sparkles|flower|airplane|sun)$/.test(n)).slice(0,6)}));
export function getSvg(id,color='#263f35',size=24){
 const [prefix,name]=id.split(':'),c=collections.find(c=>c.id===prefix),icon=c?.icons[name];
 if(!icon)return null;
 const width=icon.width||c.width||24,height=icon.height||c.height||24;
 return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${width} ${height}" color="${color}">${icon.body.replaceAll('currentColor',color)}</svg>`;
}
export function search(params){
 const q=(params.get('q')||'').trim().toLowerCase().split(/\s+/).filter(Boolean);
 const values=k=>(params.get(k)||'').split('|').filter(Boolean);
 const categories=values('category'), selectedStyles=values('style'),packs=values('pack'),metaphors=values('metaphor'),ids=values('ids');
 let found=icons.filter(i=>q.every(t=>(i.label+' '+i.pack+' '+i.categories.join(' ')).toLowerCase().includes(t))&&(!categories.length||categories.some(c=>i.categories.includes(c)))&&(!selectedStyles.length||selectedStyles.includes(i.style))&&(!packs.length||packs.includes(i.pack))&&(!metaphors.length||metaphors.includes(i.metaphor))&&(!params.has('ids')||ids.includes(i.id)));
 if(params.get('sort')==='az')found.sort((a,b)=>a.label.localeCompare(b.label));
 else if(params.get('sort')==='za')found.sort((a,b)=>b.label.localeCompare(a.label));
 else if(!q.length){const preferred=['house','home','search','heart','star','settings','camera','mail','bell','user','folder','image','download','arrow-right','check','calendar','globe','bookmark','music','sun','moon','cloud','code','shopping-bag'];found.sort((a,b)=>{const rank=i=>{let n=preferred.indexOf(i.name);return n<0?999:n};return rank(a)-rank(b)||a.pack.localeCompare(b.pack)});}
 const page=Math.max(1,Number(params.get('page'))||1),limit=60;
 return {total:found.length,page,pages:Math.ceil(found.length/limit),icons:found.slice((page-1)*limit,page*limit)};
}
export const server=http.createServer(async(req,res)=>{
 try{
 const url=new URL(req.url,'http://localhost'),p=url.searchParams;
 if(url.pathname==='/api/meta')return json(res,{total:icons.length,packs:packInfo,functions,styles});
 if(url.pathname==='/api/icons')return json(res,search(p));
 if(url.pathname==='/api/export'||url.pathname==='/api/svg'){
 const id=p.get('id')||'',color=/^#[0-9a-f]{6}$/i.test(p.get('color')||'')?p.get('color'):'#263f35',size=Math.min(2048,Math.max(16,Number(p.get('size'))||256)),svg=getSvg(id,color,size);
 if(!svg)return json(res,{error:'Icon not found'},404);
 const format=url.pathname==='/api/svg'?'svg':p.get('format')||'svg',base=id.replace(':','-');
 if(!['svg','png','jpeg','eps','ai'].includes(format))return json(res,{error:'Unsupported format'},400);
 res.setHeader('Content-Type',{svg:'image/svg+xml',png:'image/png',jpeg:'image/jpeg',eps:'application/postscript',ai:'application/pdf'}[format]);
 if(url.pathname==='/api/export')res.setHeader('Content-Disposition',`attachment; filename="${base}.${format==='jpeg'?'jpg':format}"`);
 if(format==='svg')return res.end(svg);
 if(format==='ai'){
 const doc=new PDFDocument({size:[size,size],margin:0,info:{Title:id,Subject:'PDF-based Illustrator-compatible vector artwork'}});doc.pipe(res);SVGtoPDF(doc,svg,0,0,{width:size,height:size});doc.end();return;
 }
 if(format==='eps'){
 const dir=await fs.promises.mkdtemp(path.join(os.tmpdir(),'icon-shelf-'));
 try{
 const pdf=await new Promise((resolve,reject)=>{const chunks=[],doc=new PDFDocument({size:[size,size],margin:0});doc.on('data',chunk=>chunks.push(chunk));doc.on('end',()=>resolve(Buffer.concat(chunks)));doc.on('error',reject);SVGtoPDF(doc,svg,0,0,{width:size,height:size});doc.end();});
 await fs.promises.writeFile(path.join(dir,'icon.pdf'),pdf);
 await execFileAsync('pdftops',['-eps','-level3',path.join(dir,'icon.pdf'),path.join(dir,'icon.eps')],{timeout:15000,maxBuffer:1024*1024});
 res.end(await fs.promises.readFile(path.join(dir,'icon.eps')));
 }finally{await fs.promises.rm(dir,{recursive:true,force:true});}
 return;
 }
 let raster=sharp(Buffer.from(svg));res.end(await(format==='png'?raster.png():raster.flatten({background:'#fff'}).jpeg({quality:95})).toBuffer());return;
 }
 if(/^\/fonts\/nunito-sans-latin-(400|600|700)-normal\.woff2$/.test(url.pathname)){
 res.setHeader('Content-Type','font/woff2');res.setHeader('Cache-Control','public, max-age=31536000, immutable');
 return res.end(fs.readFileSync(path.join(root,'node_modules/@fontsource/nunito-sans/files',path.basename(url.pathname))));
 }
 const files={'/':'index.html','/app.js':'app.js','/style.css':'style.css'};const file=files[url.pathname];
 if(!file){res.writeHead(404);res.end('Not found');return;}
 res.setHeader('Content-Type',file.endsWith('.js')?'text/javascript':file.endsWith('.css')?'text/css':'text/html');res.end(fs.readFileSync(path.join(root,'public',file)));
 }catch(error){console.error(error);if(!res.headersSent)json(res,{error:'Could not complete the request. Please try again.'},500);else res.end();}
});
function json(res,data,status=200){res.writeHead(status,{'Content-Type':'application/json'});res.end(JSON.stringify(data));}
if(process.argv[1]===fileURLToPath(import.meta.url))server.listen(Number(process.env.PORT)||3000,'0.0.0.0',()=>console.log('Icon Shelf running on port '+(process.env.PORT||3000)));
