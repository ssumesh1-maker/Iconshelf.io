import fs from 'node:fs/promises';
import path from 'node:path';
import {createRequire} from 'node:module';
import {build} from 'esbuild';
import {getIconData,iconToSVG,iconToHTML} from '@iconify/utils';
import {functions,styles} from '../public/classify.js';
const require=createRequire(import.meta.url),root=process.cwd(),out=path.join(root,'dist');
await fs.rm(out,{recursive:true,force:true});await fs.mkdir(path.join(out,'data/collections'),{recursive:true});await fs.mkdir(path.join(out,'data/samples'),{recursive:true});
const all=require('@iconify/json/collections.json'),packs=[],index=[];
const preferred=['lucide','tabler','ph','mdi','simple-icons','twemoji'];
const ids=Object.keys(all).sort((a,b)=>{const rank=id=>preferred.includes(id)?preferred.indexOf(id):-1;return (rank(a)<0?999:rank(a))-(rank(b)<0?999:rank(b))||all[a].name.localeCompare(all[b].name)});
let total=0;
function svg(data,name,size=48,color='#394056'){const icon=getIconData(data,name);if(!icon)return '';const r=iconToSVG(icon,{width:size,height:size});return iconToHTML(r.body.replaceAll('currentColor',color),{...r.attributes,color});}
for(const id of ids){const data=require(`@iconify/json/json/${id}.json`),info=all[id],names=[...Object.keys(data.icons),...Object.keys(data.aliases||{})].filter(n=>!data.icons[n]?.hidden&&!data.aliases?.[n]?.hidden);const style=info.palette?'Flat':info.tags?.includes('Uses Stroke')?'Outlined':/line|outline|lucide|tabler|phosphor/i.test(info.name)?'Outlined':'Filled';const pack={id,name:info.name,description:info.category||'Icon collection',style,count:names.length,license:info.license?.title||'See collection license',licenseUrl:info.license?.url||'',author:info.author?.name||'',url:info.author?.url||'',category:info.category||'',samples:(info.samples||names.slice(0,6)).filter(n=>getIconData(data,n)).slice(0,6)};
packs.push(pack);index.push({id,name:pack.name,category:pack.category,style,names});total+=names.length;await fs.writeFile(path.join(out,'data/collections',id+'.json'),JSON.stringify(data));for(const name of pack.samples)await fs.writeFile(path.join(out,'data/samples',id+'--'+name+'.svg'),svg(data,name));}
await fs.writeFile(path.join(out,'data/meta.json'),JSON.stringify({total,packs,functions,styles,version:require('@iconify/json/package.json').version}));await fs.writeFile(path.join(out,'data/index.json'),JSON.stringify(index));
let html=await fs.readFile('public/index.html','utf8'),css=await fs.readFile('public/style.css','utf8');
function replaceApi(text){return text.replace(/\/api\/svg\?([^"'\s)]+)/g,(_,query)=>{const p=new URLSearchParams(query.replaceAll('&amp;','&')),id=p.get('id'),[prefix,name]=id.split(':');const data=require(`@iconify/json/json/${prefix}.json`);return 'data:image/svg+xml;base64,'+Buffer.from(svg(data,name,Number(p.get('size'))||48,p.get('color')||'#394056')).toString('base64');});}
html=replaceApi(html).replace('href="/"','href="./"').replaceAll('href="/"','href="./"').replace('href="/style.css"','href="./style.css"').replace('src="/app.js"','src="./app.js"').replace('<script type="module"','<script>window.ICON_SHELF_STATIC=true</script><script type="module"');
css=replaceApi(css).replaceAll('/fonts/','./fonts/');await fs.writeFile(path.join(out,'index.html'),html);await fs.writeFile(path.join(out,'style.css'),css);
await fs.mkdir(path.join(out,'fonts'));for(const weight of [400,600,700])await fs.copyFile(`node_modules/@fontsource/nunito-sans/files/nunito-sans-latin-${weight}-normal.woff2`,path.join(out,'fonts',`nunito-sans-latin-${weight}-normal.woff2`));
await fs.mkdir(path.join(out,'vendor'));for(const name of ['gs.js','gs.wasm','LICENSE'])await fs.copyFile('node_modules/@jspawn/ghostscript-wasm/'+name,path.join(out,'vendor',name));await fs.copyFile('public/eps-worker.js',path.join(out,'eps-worker.js'));
await build({entryPoints:['public/app.js','public/search-worker.js'],outdir:out,bundle:true,format:'esm',splitting:true,chunkNames:'chunks/[name]-[hash]',minify:true,platform:'browser'});
await fs.writeFile(path.join(out,'.nojekyll'),'');
await fs.writeFile(path.join(out,'SOURCE.txt'),'Source: https://github.com/ssumesh1-maker/Iconshelf.io\nIconify catalog: https://github.com/iconify/icon-sets\nEPS converter: https://github.com/jsscheller/ghostscript-wasm (AGPL-3.0; see vendor/LICENSE).\nGhostscript upstream source: https://www.ghostscript.com/releases/gsdnld.html\nCollection-specific licenses: data/meta.json and each collection JSON.\n');
console.log(`Built ${total.toLocaleString()} icons in ${packs.length} collections for GitHub Pages.`);
