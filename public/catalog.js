import {getIconData,iconToSVG,iconToHTML} from '@iconify/utils';
const packs=new Map(),pending=new Map();let metadata,worker,sequence=0;
const isStatic=Boolean(window.ICON_SHELF_STATIC);
export async function loadPack(prefix){if(packs.has(prefix))return packs.get(prefix);const promise=fetch(`./data/collections/${encodeURIComponent(prefix)}.json`).then(r=>{if(!r.ok)throw Error('Could not load icon collection');return r.json()});packs.set(prefix,promise);const data=await promise;packs.set(prefix,data);return data;}
export async function api(endpoint,params='',signal){if(!isStatic){const r=await fetch('/api/'+endpoint+(params?'?'+params:''),{signal});if(!r.ok)throw Error('Request failed');return r.json();}
if(endpoint==='meta'){metadata??=fetch('./data/meta.json').then(r=>{if(!r.ok)throw Error('Catalog unavailable');return r.json()});return metadata;}
if(!worker){worker=new Worker(new URL('./search-worker.js',location.href),{type:'module'});worker.onmessage=({data})=>{const job=pending.get(data.id);if(job){pending.delete(data.id);data.error?job.reject(Error(data.error)):job.resolve(data.data);}};worker.onerror=()=>{for(const j of pending.values())j.reject(Error('Catalog search could not start'));pending.clear();};}
const id=++sequence;const result=await new Promise((resolve,reject)=>{pending.set(id,{resolve,reject});worker.postMessage({id,params:String(params)});});
if(signal?.aborted)throw new DOMException('Aborted','AbortError');await Promise.all([...new Set(result.icons.map(i=>i.pack))].map(loadPack));return result;
}
export function svgText(id,size=256,color='#394056'){const [prefix,name]=id.split(':'),data=packs.get(prefix);if(!data||data instanceof Promise)throw Error('Icon collection is still loading');const icon=getIconData(data,name);if(!icon)throw Error('Icon unavailable');const rendered=iconToSVG(icon,{height:size,width:size});return iconToHTML(rendered.body.replaceAll('currentColor',color),{...rendered.attributes,color});}
export function iconUrl(id,size=48,color='#394056'){if(!isStatic)return '/api/svg?'+new URLSearchParams({id,size,color});return 'data:image/svg+xml;charset=utf-8,'+encodeURIComponent(svgText(id,size,color));}
export async function svgSource(id,size,color){if(isStatic)return svgText(id,size,color);const r=await fetch(iconUrl(id,size,color));if(!r.ok)throw Error('Icon unavailable');return r.text();}
export async function preparePacks(list){if(isStatic)await Promise.all(list.map(p=>loadPack(p.id)));}
export async function exportIcon(id,color,size,format){if(!isStatic){const r=await fetch('/api/export?'+new URLSearchParams({id,color,size,format}));if(!r.ok)throw Error('Export failed');return r.blob();}
const svg=svgText(id,size,color);
if(format==='svg')return new Blob([svg],{type:'image/svg+xml'});
if(format==='png'||format==='jpeg'){const image=new Image();image.src='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(svg);await image.decode();const canvas=document.createElement('canvas');canvas.width=canvas.height=size;const ctx=canvas.getContext('2d');if(format==='jpeg'){ctx.fillStyle='#fff';ctx.fillRect(0,0,size,size);}ctx.drawImage(image,0,0,size,size);return new Promise((resolve,reject)=>canvas.toBlob(b=>b?resolve(b):reject(Error('Image export failed')),'image/'+format,.95));}
const {jsPDF}=await import('jspdf');await import('svg2pdf.js');const pdf=new jsPDF({unit:'pt',format:[size,size],orientation:'portrait'});await pdf.svg(new DOMParser().parseFromString(svg,'image/svg+xml').documentElement,{x:0,y:0,width:size,height:size});const buffer=pdf.output('arraybuffer');
if(format==='ai')return new Blob([buffer],{type:'application/pdf'});
return new Promise((resolve,reject)=>{const converter=new Worker('./eps-worker.js');const timer=setTimeout(()=>{converter.terminate();reject(Error('EPS conversion timed out'));},90000);converter.onmessage=({data})=>{clearTimeout(timer);converter.terminate();data.error?reject(Error(data.error)):resolve(new Blob([data.output],{type:'application/postscript'}));};converter.onerror=()=>{clearTimeout(timer);converter.terminate();reject(Error('EPS converter could not load'));};converter.postMessage({buffer},[buffer]);});
}

export function sampleIconUrl(id){return isStatic?'./data/samples/'+id.replace(':','--')+'.svg':iconUrl(id);}
