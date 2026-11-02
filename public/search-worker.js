import {classify,functions} from './classify.js';
const preferred=['house','home','search','heart','star','settings','camera','mail','bell','user','folder','image','download','arrow-right','check','calendar','globe','bookmark','music','sun','moon','cloud','code','shopping-bag'];
let index;
const ready=fetch('./data/index.json').then(r=>{if(!r.ok)throw Error('Catalog index unavailable');return r.json()}).then(packs=>index=packs.map(p=>({...p,entries:p.names.map(name=>({name,pack:p.id,...classify(name,p)}))})));
self.onmessage=async({data:{id,params}})=>{try{await ready;const p=new URLSearchParams(params),q=(p.get('q')||'').trim().toLowerCase().split(/\s+/).filter(Boolean),list=k=>(p.get(k)||'').split('|').filter(Boolean),packs=list('pack'),styles=list('style'),categories=list('category'),metaphors=list('metaphor'),ids=new Set(list('ids')),mask=categories.reduce((m,c)=>m|(1<<functions.indexOf(c)),0);let found=[];
for(const pack of index){if(packs.length&&!packs.includes(pack.id))continue;for(const icon of pack.entries){if(styles.length&&!styles.includes(icon.style)||categories.length&&!(icon.mask&mask)||metaphors.length&&!metaphors.includes(icon.metaphor)||p.has('ids')&&!ids.has(pack.id+':'+icon.name))continue;
if(!q.every(t=>(icon.name.replaceAll('-',' ')+' '+pack.id+' '+pack.name+' '+pack.category+' '+functions.filter((_,i)=>icon.mask&(1<<i)).join(' ')).toLowerCase().includes(t)))continue;
found.push(icon);}}
if(p.get('sort')==='az'||p.get('sort')==='za'){const direction=p.get('sort')==='az'?1:-1;found.sort((a,b)=>direction*a.name.localeCompare(b.name));}
else if(!q.length){const rank=i=>{const n=preferred.indexOf(i.name);return (['lucide','tabler','ph','mdi','simple-icons','twemoji'].includes(i.pack)?0:10000)+(n<0?999:n)};found.sort((a,b)=>rank(a)-rank(b)||a.pack.localeCompare(b.pack));}
const total=found.length,page=Math.max(1,Math.min(Math.ceil(total/60)||1,Number(p.get('page'))||1));found=found.slice((page-1)*60,page*60).map(i=>({...i,id:i.pack+':'+i.name,label:i.name.replaceAll('-',' '),categories:functions.filter((_,n)=>i.mask&(1<<n))}));self.postMessage({id,data:{total,page,pages:Math.ceil(total/60),icons:found}});
}catch(e){self.postMessage({id,error:e.message});}};
