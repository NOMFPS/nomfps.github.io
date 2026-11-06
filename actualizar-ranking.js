const fs = require('fs');
const path = require('path');
const root = __dirname;
const htmlPath = path.join(root, 'index.html');
let html = fs.readFileSync(htmlPath, 'utf8');
const lines = fs.readFileSync(path.join(root, 'estadisticas-2026-11-06.txt'), 'utf8').split(/\r?\n/).filter(x => x && !x.startsWith('#'));
const keys = ['aim','utility','position','clutch','opening','kd','leetRating','hs','preaim','ttd','he','accuracy','strafe','kast','win'];
const trackerKeys = ['trust','trackerKd','adr','hltv','teamDamage'];
const profiles = lines.map(line => {
  const [nick,id,leet,elo,tracker] = line.split('|');
  const p = { nick,id,elo: elo ? Number(elo) : null };
  leet.split(',').forEach((v,i) => p[keys[i]] = v === '' ? null : Number(v));
  tracker.split(',').forEach((v,i) => p[trackerKeys[i]] = v === '' ? null : Number(v));
  p.kpr = p.adr / 110; p.dpr = p.kpr / p.trackerKd;
  p.impact = 2.13 * p.kpr + 0.42 * 0.12 - 0.41;
  p.rating = .0073*p.kast + .3591*p.kpr - .5329*p.dpr + .2372*p.impact + .0032*p.adr + .1587;
  return p;
});
if (profiles.length !== 20 || profiles.some(p => keys.some(k => p[k] !== null && !Number.isFinite(p[k])))) throw new Error('Datos inválidos');
const escape = s => String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const lower = new Set(['dpr','preaim','ttd','teamDamage']);
const fields = ['rating','impact','kpr','dpr','adr','kast','leetRating','aim','preaim','ttd','hs','accuracy','strafe','utility','he','clutch','opening','position','kd','win','hltv','trackerKd','teamDamage','trust','elo'];
const stats = Object.fromEntries(fields.map(k => {
 const vals=profiles.map(p=>p[k]).filter(v=>v!==null); const mean=vals.reduce((a,b)=>a+b,0)/vals.length;
 const sd=Math.sqrt(vals.reduce((a,b)=>a+(b-mean)**2,0)/vals.length); return [k,{mean,sd,vals}];
}));
const z = (p,k) => p[k] === null ? null : Math.max(-2.5,Math.min(2.5,(p[k]-stats[k].mean)/(stats[k].sd || 1)*(lower.has(k)?-1:1)));
const categories = [
 ['Impacto','IMP',.30,[['rating',4],['impact',2],['leetRating',2],['kd',1]]],
 ['Punteria','AIM',.25,[['aim',3],['preaim',2],['ttd',2],['hs',1],['accuracy',1],['strafe',1]]],
 ['Equipo','TEAM',.15,[['kast',3],['utility',2],['he',1],['teamDamage',1]]],
 ['Clutch/Entry','CLU',.15,[['clutch',2],['opening',2],['position',1]]],
 ['Victorias','WIN',.10,[['win',1]]],['FACEIT','ELO',.05,[['elo',1]]]
];
for(const p of profiles){
 p.cats=categories.map(([, , , components])=>{const v=components.filter(([k])=>z(p,k)!==null);if(!v.length)return null;return Math.max(0,Math.min(100,50+20*v.reduce((s,[k,w])=>s+z(p,k)*w,0)/v.reduce((s,[,w])=>s+w,0)));});
 const avail=categories.map((c,i)=>[c[2],p.cats[i]]).filter(([,v])=>v!==null);p.score=avail.reduce((s,[w,v])=>s+w*v,0)/avail.reduce((s,[w])=>s+w,0);
}
profiles.sort((a,b)=>b.score-a.score || a.nick.localeCompare(b.nick));
const oldRows=[...html.matchAll(/<tr class="clk [^"]+" data-p="\d+"[\s\S]*?<\/tr>/g)];
const avatars={};for(const [row] of oldRows){const m=row.match(/<td class="pl">[\s\S]*?<img src="([^"]+)"[^>]*><strong>([^<]+)<\/strong>/);if(m) avatars[m[2].replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&amp;/g,'&')]=m[1];}
const fallback='data:image/svg+xml,'+encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" rx="50" fill="#253249"/><circle cx="50" cy="36" r="19" fill="#8fa4bd"/><path d="M15 92c3-25 18-36 35-36s32 11 35 36" fill="#8fa4bd"/></svg>');
const img=p=>escape(avatars[p.nick] || fallback);
const n=(v,d=1)=>v===null?'—':v.toFixed(d);
const signed=v=>v===null?'—':(v>=0?'+':'')+v.toFixed(1);
const rank=(p,k)=>{if(p[k]===null)return [null,null];const vals=stats[k].vals;return [1+vals.filter(v=>lower.has(k)?v<p[k]:v>p[k]).length,vals.length];};
const groupDefs=[['Rating 2.0 estilo HLTV (calculado)',[['Rating 2.0','rating',v=>n(v,2)],['Impact','impact',v=>n(v,2)],['KPR','kpr',v=>n(v,2)],['DPR','dpr',v=>n(v,2)],['ADR','adr',v=>n(v)],['KAST','kast',v=>n(v)+'%']]],['Leetify',[['Rating','leetRating',signed],['Aim','aim',v=>n(v)],['Preaim','preaim',v=>n(v,2)+'°'],['Time to dmg','ttd',v=>n(v,0)+' ms'],['HS kills','hs',v=>n(v)+'%'],['Precision','accuracy',v=>n(v)+'%'],['Counter-strafe','strafe',v=>n(v)+'%'],['Utility','utility',v=>n(v)],['Dano HE','he',v=>n(v)],['Clutch','clutch',signed],['Opening','opening',signed],['Position','position',v=>n(v)],['KD','kd',v=>n(v,2)],['Winrate','win',v=>n(v,0)+'%']]],['cstracker.gg',[['HLTV','hltv',v=>n(v,2)],['KD','trackerKd',v=>n(v,2)],['Team damage','teamDamage',v=>n(v)],['Trust','trust',v=>n(v)+'%']]],['FACEIT',[['ELO','elo',v=>n(v,0)]]]];
const barHTML=p=>categories.map(([label,abbr],i)=>{const v=p.cats[i];return `<div class="bar${v===null?' na':''}" title="${label}: ${v===null?'sin datos':Math.round(v)}"><span>${abbr}</span><i style="width:${v===null?0:Math.round(v)}%"></i><b>${v===null?'—':Math.round(v)}</b></div>`}).join('');
for(let i=0;i<profiles.length;i++){
 const p=profiles[i];p.rank=i+1;p.div=i<15?[`Division ${Math.floor(i/5)+1}`,['Elite','Contendientes','Aspirantes'][Math.floor(i/5)],`d${Math.floor(i/5)+1}`]:null;
 p.tier=p.score>=70?'S':p.score>=58?'A':p.score>=48?'B':p.score>=40?'C':'D';
 p.groups=groupDefs.map(([name,entries])=>[name,entries.map(([label,key,format])=>[label,p[key]===null?'—':format(p[key]),...rank(p,key)])]);
 const descriptors=[['Rating 2.0','rating'],['Impact','impact'],['KPR','kpr'],['DPR','dpr'],['ADR','adr'],['KAST','kast'],['Leetify Rating','leetRating'],['Aim','aim'],['Preaim','preaim'],['Time to dmg','ttd'],['HS kills','hs'],['Precision','accuracy'],['Counter-strafe','strafe'],['Utility','utility'],['Dano HE','he'],['Clutch','clutch'],['Opening','opening'],['Position','position'],['KD Leetify','kd'],['Winrate','win'],['Team damage','teamDamage'],['ELO FACEIT','elo']].filter(([,k])=>z(p,k)!==null).sort((a,b)=>z(p,b[1])-z(p,a[1]));
 p.best=descriptors.filter(([,k])=>z(p,k)>0).slice(0,3).map(([label])=>label);p.worst=descriptors.filter(([,k])=>z(p,k)<0).slice(-3).reverse().map(([label])=>label);p.bars=barHTML(p);
}
const row=(p,i)=>`<tr class="clk ${p.div?p.div[2]:'dx'}" data-p="${i}" tabindex="0"><td class="rk">#${p.rank}</td><td class="pl"><div class="plin"><img src="${img(p)}" alt=""><strong>${escape(p.nick)}</strong></div></td><td class="sc"><b>${p.score.toFixed(1)}</b><span class="tier t${p.tier}">${p.tier}</span></td><td class="cats">${p.bars}</td><td class="hl">${n(p.rating,2)}</td><td>${n(p.impact,2)}</td><td>${n(p.kpr,2)}</td><td>${n(p.dpr,2)}</td><td>${signed(p.leetRating)}</td><td>${n(p.adr)}</td><td>${n(p.aim)}</td><td>${n(p.kast)}%</td><td>${n(p.win,0)}%</td><td>${n(p.elo,0)}</td><td><span class="dtag ${p.div?p.div[2]:'dx'}">${p.div?Math.floor(i/5)+1:'—'}</span></td></tr>`;
const podium=[1,0,2].map(i=>{const p=profiles[i];return `<div class="pod clk p${i+1}" data-p="${i}" tabindex="0"><img src="${img(p)}" alt=""><strong>${escape(p.nick)}</strong><small>Rating 2.0: ${n(p.rating,2)}</small><b>${p.score.toFixed(1)}</b><div class="step">#${p.rank}</div></div>`}).join('');
const divisions=[0,1,2].map(d=>{const ps=profiles.slice(d*5,d*5+5);return `<section class="div d${d+1}"><header><h3>Division ${d+1}</h3><span>${['Elite','Contendientes','Aspirantes'][d]}</span><em>media ${(ps.reduce((a,p)=>a+p.score,0)/ps.length).toFixed(1)}</em></header><ol>${ps.map((p,j)=>`<li class="clk" data-p="${d*5+j}" tabindex="0"><span class="n">${p.rank}</span><img src="${img(p)}" alt=""><div><strong>${escape(p.nick)}</strong><small>Rating 2.0: ${n(p.rating,2)}</small></div><b>${p.score.toFixed(1)}</b></li>`).join('')}</ol></section>`}).join('');
html=html.replace(/<div class="podium">[\s\S]*?<\/div>\s*<div class="tablewrap">/,`<div class="podium">${podium}</div>\n<div class="tablewrap">`);
html=html.replace(/<tbody>[\s\S]*?<\/tbody>/,`<tbody>${profiles.map(row).join('\n')}</tbody>`);
html=html.replace(/<div class="divs">[\s\S]*?<\/div>\s*<p class="note">[\s\S]*?<\/p>/,`<div class="divs">${divisions}</div>\n<p class="note">Fuera de division (puestos 16-20): ${profiles.slice(15).map(p=>`${escape(p.nick)} (#${p.rank}, ${p.score.toFixed(1)})`).join(', ')}.</p>`);
const publicProfiles=profiles.map(p=>({nick:p.nick,rank:p.rank,score:Number(p.score.toFixed(1)),tier:p.tier,div:p.div,bars:p.bars,groups:p.groups,best:p.best,worst:p.worst,url:'https://csst.at/profile/'+p.id}));
html=html.replace(/const PROFILES = [\s\S]*?;\s*\n\(\(\) => \{/,`const PROFILES = ${JSON.stringify(publicProfiles).replace(/</g,'\\u003c')};\n(() => {`);
html=html.replace(/18 jugadores · Puntuacion/, '20 jugadores · Datos consultados el 6 de noviembre de 2026 · Puntuacion');
const desc=`Clasificacion de 20 jugadores de CS2 con Rating 2.0 estimado y puntuacion OBF. Top 3: ${profiles.slice(0,3).map(p=>`${p.nick} (${p.score.toFixed(1)})`).join(', ')}.`;
html=html.replace(/(content=")Clasificacion de 18 jugadores[^\"]*(")/g,(_,a,b)=>a+escape(desc)+b);
html=html.replace('Cada stat se compara contra el resto del grupo (z-score:', 'Cada stat se compara contra el resto del grupo (z-score:');
html=html.replace('cada categoria se pasa a una escala 0-100 donde <b>50 = jugador medio del grupo</b>.','cada categoria se pasa a una escala 0-100 con 50 + 20 por desviacion estandar, limitada a 0-100; <b>50 representa la media de cada estadistica</b>.');
html=html.replace('KPR = ADR / 110 (dano medio por kill), DPR = KPR / KD y APR = 0.12', 'KPR = ADR de cstracker.gg / 110 (dano medio por kill), DPR = KPR / KD de cstracker.gg y APR = 0.12');
if (!html.includes('Ver fuente de estadísticas en CSStats')) html=html.replace('<div class="pf-grid">', '<p><a href="${esc(p.url)}" target="_blank" rel="noopener noreferrer">Ver fuente de estadísticas en CSStats ↗</a></p><div class="pf-grid">');
fs.writeFileSync(htmlPath,html,'utf8');
console.log(profiles.map(p=>`${p.rank}. ${p.nick}: ${p.score.toFixed(1)}`).join('\n'));
