const fs = require('fs');
const path = require('path');
const root = __dirname;
// Posiciones anteriores a la actualización de los enlaces; los jugadores nuevos no tienen posición previa.
const previousRanks = JSON.parse(fs.readFileSync(path.join(root, 'posiciones-anteriores.json'), 'utf8'));
const premierHistory = JSON.parse(fs.readFileSync(path.join(root, 'premier-historico.json'), 'utf8'));
const secondaryAccount = JSON.parse(fs.readFileSync(path.join(root, 'cuenta-secundaria.json'), 'utf8'));
const htmlPath = path.join(root, 'index.html');
let html = fs.readFileSync(htmlPath, 'utf8');
const lines = fs.readFileSync(path.join(root, 'estadisticas-2026-11-07.txt'), 'utf8').split(/\r?\n/).filter(x => x && !x.startsWith('#'));
const keys = ['aim','utility','position','clutch','opening','kd','leetRating','hs','preaim','ttd','he','accuracy','strafe','kast','win'];
const trackerKeys = ['trust','trackerKd','adr','hltv','teamDamage'];
const profiles = lines.map(line => {
  const [nick,id,leet,elo,tracker,premier] = line.split('|');
  const history = premierHistory[id];
  const p = { nick,id,elo: elo ? Number(elo) : null, premier: premier ? Number(premier) : (history?.rating ?? null), premierHistoryDate: premier ? null : (history?.date ?? null) };
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
const fields = ['rating','impact','kpr','dpr','adr','kast','leetRating','aim','preaim','ttd','hs','accuracy','strafe','utility','he','clutch','opening','position','kd','win','hltv','trackerKd','teamDamage','trust','elo','premier'];
const stats = Object.fromEntries(fields.map(k => {
 const vals=profiles.map(p=>p[k]).filter(v=>v!==null); const mean=vals.reduce((a,b)=>a+b,0)/vals.length;
 const sd=Math.sqrt(vals.reduce((a,b)=>a+(b-mean)**2,0)/vals.length); return [k,{mean,sd,vals}];
}));
const z = (p,k) => p[k] === null ? null : Math.max(-2.5,Math.min(2.5,(p[k]-stats[k].mean)/(stats[k].sd || 1)*(lower.has(k)?-1:1)));
// La categoría competitiva usa Premier actual o último registrado; si no existe, FACEIT.
// Cada fuente se normaliza por separado, sin mezclar sus escalas.
const categories = [
 ['Rendimiento','REN',.35,[['leetRating',.20],['adr',.10],['kast',.05]]],
 ['Resultados','RES',.20,[['win',.10],['competitive',.10]]],
 ['Mecanica','MEC',.20,[['ttd',.07],['preaim',.05],['strafe',.04],['hs',.04]]],
 ['Juego colectivo','COL',.15,[['utility',.08],['position',.07]]],
 ['Momentos decisivos','DEC',.10,[['opening',.05],['clutch',.05]]]
];
const metricZ = (p,k) => k === 'competitive' ? (p.premier !== null ? z(p,'premier') : z(p,'elo')) : z(p,k);
for(const p of profiles){
 let sum=0, availableWeight=0;
 p.cats=categories.map(([, , , components])=>{
  const available=components.map(([k,w])=>[metricZ(p,k),w]).filter(([value])=>value!==null);
  if(!available.length)return null;
  const weight=available.reduce((a,[,w])=>a+w,0);
  const categoryZ=available.reduce((a,[value,w])=>a+value*w,0)/weight;
  sum += available.reduce((a,[value,w])=>a+(50+20*value)*w,0);
  availableWeight += weight;
  return Math.max(0,Math.min(100,50+20*categoryZ));
 });
 p.score=availableWeight ? sum/availableWeight : null;
}
profiles.sort((a,b)=>b.score-a.score || a.nick.localeCompare(b.nick));
const oldRows=[...html.matchAll(/<tr class="clk [^"]+" data-p="\d+"[\s\S]*?<\/tr>/g)];
const avatars={};for(const [row] of oldRows){const m=row.match(/<td class="pl">[\s\S]*?<img src="([^"]+)"[^>]*>[\s\S]*?<strong>([^<]+)<\/strong>/);if(m) avatars[m[2].replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&amp;/g,'&')]=m[1];}
const fallback='data:image/svg+xml,'+encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" rx="50" fill="#253249"/><circle cx="50" cy="36" r="19" fill="#8fa4bd"/><path d="M15 92c3-25 18-36 35-36s32 11 35 36" fill="#8fa4bd"/></svg>');
const img=p=>escape(avatars[p.nick] || fallback);
const n=(v,d=1)=>v===null?'—':v.toFixed(d);
const signed=v=>v===null?'—':(v>=0?'+':'')+v.toFixed(1);
const rank=(p,k)=>{if(p[k]===null)return [null,null];const vals=stats[k].vals;return [1+vals.filter(v=>lower.has(k)?v<p[k]:v>p[k]).length,vals.length];};
const groupDefs=[['Rating 2.0 estilo HLTV (calculado)',[['Rating 2.0','rating',v=>n(v,2)],['Impact','impact',v=>n(v,2)],['KPR','kpr',v=>n(v,2)],['DPR','dpr',v=>n(v,2)],['ADR','adr',v=>n(v)],['KAST','kast',v=>n(v)+'%']]],['Leetify',[['Rating','leetRating',signed],['Aim','aim',v=>n(v)],['Preaim','preaim',v=>n(v,2)+'°'],['Time to dmg','ttd',v=>n(v,0)+' ms'],['HS kills','hs',v=>n(v)+'%'],['Precision','accuracy',v=>n(v)+'%'],['Counter-strafe','strafe',v=>n(v)+'%'],['Utility','utility',v=>n(v)],['Dano HE','he',v=>n(v)],['Clutch','clutch',signed],['Opening','opening',signed],['Position','position',v=>n(v)],['KD','kd',v=>n(v,2)],['Winrate','win',v=>n(v,0)+'%']]],['cstracker.gg',[['HLTV','hltv',v=>n(v,2)],['KD','trackerKd',v=>n(v,2)],['Team damage','teamDamage',v=>n(v)],['Trust','trust',v=>n(v)+'%']]],['Premier',[['Rating Premier','premier',v=>n(v,0)]]]];
const barHTML=p=>categories.map(([label,abbr],i)=>{const v=p.cats[i];return `<div class="bar${v===null?' na':''}" title="${label}: ${v===null?'sin datos':Math.round(v)}"><span>${abbr}</span><i style="width:${v===null?0:Math.round(v)}%"></i><b>${v===null?'—':Math.round(v)}</b></div>`}).join('');
for(let i=0;i<profiles.length;i++){
 const p=profiles[i];p.rank=i+1;p.previousRank=previousRanks[p.nick] ?? null;p.movement=p.previousRank===null ? null : p.previousRank-p.rank;p.div=i<15?[`Division ${Math.floor(i/5)+1}`,['Elite','Contendientes','Aspirantes'][Math.floor(i/5)],`d${Math.floor(i/5)+1}`]:null;
 const displayedScore=Number(p.score.toFixed(1));
 p.tier=displayedScore>=70?'S':displayedScore>=60?'A':displayedScore>=50?'B':displayedScore>=40?'C':displayedScore>=30?'D':displayedScore>=20?'E':'F';
 p.groups=groupDefs.map(([name,entries])=>[name,entries.map(([label,key,format])=>[key==='premier' && p.premierHistoryDate ? 'Consultado · '+p.premierHistoryDate.split('-').reverse().join('/') : label,p[key]===null?'—':format(p[key]),...rank(p,key)])]);
 const descriptors=[['Rating 2.0','rating'],['Impact','impact'],['KPR','kpr'],['DPR','dpr'],['ADR','adr'],['KAST','kast'],['Leetify Rating','leetRating'],['Aim','aim'],['Preaim','preaim'],['Time to dmg','ttd'],['HS kills','hs'],['Precision','accuracy'],['Counter-strafe','strafe'],['Utility','utility'],['Dano HE','he'],['Clutch','clutch'],['Opening','opening'],['Position','position'],['KD Leetify','kd'],['Team damage','teamDamage'],['Rating Premier','premier']].filter(([,k])=>z(p,k)!==null).sort((a,b)=>z(p,b[1])-z(p,a[1]));
 p.best=descriptors.filter(([,k])=>z(p,k)>0).slice(0,3).map(([label])=>label);p.worst=descriptors.filter(([,k])=>z(p,k)<0).slice(-3).reverse().map(([label])=>label);p.bars=barHTML(p);
}
const movementHTML = p => {
 const value=p.movement; const cls=value===null?'new':value>0?'up':value<0?'down':'same';
 const label=value===null?'-':value>0?'+'+value:value<0?String(value):'-';
 const title=value===null?'Sin posición anterior':value>0?`Subió ${value} puesto(s) desde #${p.previousRank}`:value<0?`Bajó ${-value} puesto(s) desde #${p.previousRank}`:'Sin cambios desde #'+p.previousRank;
 return `<span class="rank-change ${cls}" title="${title}" aria-label="${title}">${label}</span>`;
};
const formatElo = value => String(value).replace(/\B(?=(\d{3})+(?!\d))/g,'.');
const premierHTML = p => {
 if (p.premier === null) return '<span class="premier-badge no-premier" aria-label="Premier sin registro histórico">Premier sin dato</span>';
 const level = p.premier < 5000 ? 'gray' : p.premier < 10000 ? 'lightblue' : p.premier < 15000 ? 'blue' : p.premier < 20000 ? 'purple' : p.premier < 25000 ? 'pink' : p.premier < 30000 ? 'red' : 'gold';
 const detail = p.premierHistoryDate ? 'Último consultado en Leetify: '+p.premierHistoryDate.split('-').reverse().join('/') : 'Rating Premier actual';
 return `<span class="premier-badge premier-${level}" title="${detail}" aria-label="${detail}: ${p.premier}"><span aria-hidden="true">${formatElo(p.premier)}</span></span>`;
};
const row=(p,i)=>`<tr class="clk ${p.div?p.div[2]:'dx'}" data-p="${i}" tabindex="0" role="button" aria-label="Ver perfil de ${escape(p.nick)}, puesto ${p.rank}"><td class="rk"><span>${String(p.rank).padStart(2,'0')}</span></td><td class="pl"><div class="plin"><img src="${img(p)}" alt=""><div class="player-name"><div class="player-title"><strong>${escape(p.nick)}</strong></div><small>Ver perfil <span aria-hidden="true">↗</span></small></div></div></td><td class="premier-cell">${premierHTML(p)}</td><td class="sc"><div class="score-line">${movementHTML(p)}<span class="tier t${p.tier}">TIER ${p.tier}</span><b>${p.score.toFixed(1)}</b></div></td></tr>`;

const podium=[1,0,2].map(i=>{const p=profiles[i];return `<div class="pod clk p${i+1}" data-p="${i}" tabindex="0"><img src="${img(p)}" alt=""><strong>${escape(p.nick)}</strong><small>PUNTUACIÓN OBF</small><b>${p.score.toFixed(1)}</b>${movementHTML(p)}<div class="step">#${p.rank}</div></div>`}).join('');

html=html.replace(/<div class="podium">[\s\S]*?<\/div>\s*<div class="tablewrap">/,`<div class="podium">${podium}</div>\n<div class="list-heading"><div><span class="eyebrow">RANKING OBF</span><h2>Jugadores</h2></div><span class="list-hint">Selecciona un jugador para ver sus estadísticas <span aria-hidden="true">↗</span></span></div>\n<div class="tablewrap">`);
html=html.replace('<th>WR</th><th>ELO</th>', '<th>WR</th><th>Premier</th><th>FACEIT</th>');
html=html.replace(/<tbody>[\s\S]*?<\/tbody>/,`<tbody>${profiles.map(row).join('\n')}</tbody>`);
const publicProfiles=profiles.map(p=>({nick:p.nick,rank:p.rank,score:Number(p.score.toFixed(1)),movement:p.movement,previousRank:p.previousRank,tier:p.tier,div:p.div,bars:p.bars,groups:p.groups,best:p.best,worst:p.worst,url:'https://csst.at/profile/'+p.id}));
html=html.replace(/const PROFILES = [\s\S]*?;\s*(?:const SECONDARY_ACCOUNT = [^\n]*;\s*)?\n?\(\(\) => \{/,`const PROFILES = ${JSON.stringify(publicProfiles).replace(/</g,'\\u003c')};\nconst SECONDARY_ACCOUNT = ${JSON.stringify(secondaryAccount).replace(/</g,'\\u003c')};\n(() => {`);
const explanation = `<div class="method">
<p>La puntuación OBF combina cinco categorías. Cada estadística se compara con los jugadores que tienen datos mediante un z-score limitado a ±2,5 y se convierte a una escala de 0 a 100: 50 + 20 × z. Las ponderaciones de la tabla son puntos porcentuales del total.</p>
<ul><li><strong>Rendimiento · 35%</strong> — Leetify Rating 20%, ADR de cstracker.gg 10%, KAST de Leetify 5%.</li><li><strong>Resultados · 20%</strong> — Winrate de Leetify 10% y rango competitivo 10%.</li><li><strong>Mecánica · 20%</strong> — Time to damage 7%, Preaim 5%, Counter-strafe 4%, HS kills 4%.</li><li><strong>Juego colectivo · 15%</strong> — Utility 8%, Position 7%.</li><li><strong>Momentos decisivos · 10%</strong> — Opening 5%, Clutch 5%.</li></ul>
<p><strong>Rango competitivo:</strong> se usa Premier actual o su último valor registrado. Si no hay ningún Premier conocido, se utiliza FACEIT si está disponible. Ambas escalas se normalizan por separado y solo una aporta el 10%. Los valores recuperados se identifican con la fecha de consulta y no representan necesariamente el rango activo.</p>
<p>Si falta una estadística, su peso se reparte proporcionalmente entre todas las estadísticas disponibles del jugador. Los valores ausentes no cuentan como cero; por ello, las puntuaciones con menos datos son menos completas. El winrate vuelve a formar parte del cálculo. Tiers: S ≥ 70 · A ≥ 60 · B ≥ 50 · C ≥ 40 · D ≥ 30 · E ≥ 20 · F &lt; 20.</p>
<p>El Rating 2.0, Impact, KPR y DPR mostrados en las fichas son estimaciones informativas y no intervienen en la puntuación OBF. La puntuación OBF es propia y no es un rating oficial de HLTV.</p>
</div>`;
html=html.replace(/<div class="method">[\s\S]*?<\/div>/,explanation);
if (!html.includes('Ver fuente de estadísticas en CSStats')) html=html.replace('<div class="pf-grid">', '<p><a href="${esc(p.url)}" target="_blank" rel="noopener noreferrer">Ver fuente de estadísticas en CSStats ↗</a></p><div class="pf-grid">');
fs.writeFileSync(htmlPath,html,'utf8');
console.log(profiles.map(p=>`${p.rank}. ${p.nick}: ${p.score.toFixed(1)}`).join('\n'));
