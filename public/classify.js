export const functions=['UI / Navigation','Action','Status','App','Favicon','Brand / Social','Informational & Decorative'];
export const styles=['Outlined','Filled','Line Duotone','Flat','Gradient','3D / Skeuomorphic','Hand-drawn','Isometric'];
export function classify(name,pack){
 let mask=0;
 if(/home|house|menu|search|arrow|chevron|navigation|compass|layout|panel|sidebar/.test(name))mask|=1;
 if(/play|pause|trash|delete|pencil|edit|download|upload|save|copy|cut|send|share|plus|minus|refresh|rotate|check|add|remove|zoom|filter|sort/.test(name))mask|=2;
 if(/wifi|battery|loader|loading|alert|warning|error|signal|bell|notification|progress|shield|lock|check-circle/.test(name))mask|=4;
 if(/app|application|calculator|calendar|camera|mail|music|browser|terminal|code/.test(name))mask|=8;
 if(/star|heart|circle|hexagon|diamond|sparkle|flower/.test(name))mask|=16;
 if(pack.id==='simple-icons'||pack.category==='Brands'||/brand-|logo-|facebook|instagram|youtube|github|twitter/.test(name))mask|=32;
 if(!mask||/info|help|question|sparkle|flower|sun|moon/.test(name))mask|=64;
 const metaphor=/help|question|power|command|hash|asterisk|plus|minus|check|x$/.test(name)||pack.category==='Brands'?'Arbitrary':/cloud|home|house|link|share|save|download|upload|shield|lock|key|flag|bookmark/.test(name)?'Reference (Analogy)':'Resemblance';
 let style=pack.style;
 if(/duotone|two-tone/.test(name)||/duotone/i.test(pack.name))style='Line Duotone';
 else if(/isometric/i.test(pack.name))style='Isometric';
 else if(/doodle|hand.drawn/i.test(pack.name))style='Hand-drawn';
 else if(/gradient/i.test(pack.name))style='Gradient';
 else if(/(^|-)3d($|-)/i.test(pack.name))style='3D / Skeuomorphic';
 else if(/-fill(ed)?$|^baseline-/.test(name))style='Filled';
 else if(/outline|line$|linear/.test(name))style='Outlined';
 return {mask,metaphor,style};
}
