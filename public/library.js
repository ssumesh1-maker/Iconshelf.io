export const libraryKey='icon-shelf-library-v1';
const empty=()=>({saved:new Set(),folders:[],placements:{}});
export function readLibrary(storage){
 try{
  const raw=storage.getItem(libraryKey);
  if(raw){const value=JSON.parse(raw);if(value.version!==1||!Array.isArray(value.saved)||!Array.isArray(value.folders))throw Error('Invalid library');const saved=new Set(value.saved.filter(id=>typeof id==='string'));const folderIds=new Set(),folders=[];for(const f of value.folders){if(typeof f?.id==='string'&&f.id&&typeof f.name==='string'&&f.name.trim()&&!folderIds.has(f.id)){folderIds.add(f.id);folders.push({id:f.id,name:f.name.trim().slice(0,64)});}}const placements={};for(const [icon,folder] of Object.entries(value.placements||{}))if(saved.has(icon)&&folderIds.has(folder))placements[icon]=folder;return {saved,folders,placements};}
 }catch{}
 try{const legacy=JSON.parse(storage.getItem('icon-shelf-saved')||'[]');return {...empty(),saved:new Set(Array.isArray(legacy)?legacy.filter(id=>typeof id==='string'):[])};}catch{return empty();}
}
export function copyLibrary(library){return {saved:new Set(library.saved),folders:library.folders.map(f=>({...f})),placements:{...library.placements}};}
export function writeLibrary(storage,library){storage.setItem(libraryKey,JSON.stringify({version:1,saved:[...library.saved],folders:library.folders,placements:library.placements}));}
export function folderIcons(library,folder=''){return [...library.saved].filter(id=>!folder||(folder==='__unfiled__'?!library.placements[id]:library.placements[id]===folder));}
