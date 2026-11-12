(() => {
  'use strict';
  const esc = value => String(value).replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  const cap = value => Math.max(0, Math.min(100, value));
  const players = PUG_PLAYERS.map(row => {
    const [id,name,avatar,n,w,l,k,d,a,damage,adrSum,deltaSum,ratingSum,kastSum,open,trades] = row;
    const rating=ratingSum/n, adr=adrSum/n, kast=kastSum/n, kd=d ? k/d : 0;
    const raw=.4*cap(rating/2*100)+.2*cap(adr/150*100)+.15*cap(kd/2*100)+.1*cap(kast)+.15*(w/n*100);
    const score=40+(raw-40)*n/(n+5);
    return {id,name,avatar,n,w,l,k,d,a,damage,adr,delta:deltaSum/n,rating,kast,kd,open,trades,score,qualified:n>=3};
  }).sort((a,b)=>Number(b.qualified)-Number(a.qualified)||b.score-a.score||b.n-a.n||a.name.localeCompare(b.name));
  players.forEach((p,i)=>p.rank=p.qualified?i+1:null);
  const avatar=p=>`https://avatars.steamstatic.com/${p.avatar}_medium.jpg`;
  const record=p=>`<span class="record" aria-label="${p.w} victorias y ${p.l} derrotas"><span class="wins">${p.w} V</span> <span aria-hidden="true">/</span> <span class="losses">${p.l} D</span></span>`;
  const tier=score=>score>=70?'S':score>=60?'A':score>=50?'B':score>=40?'C':score>=30?'D':score>=20?'E':'F';
  document.getElementById('podium').innerHTML=[1,0,2].map(i=>{const p=players[i];return `<div class="pod clk p${i+1}" data-i="${i}" tabindex="0" role="button" aria-label="Ver perfil de ${esc(p.name)}"><img src="${avatar(p)}" alt=""><strong>${esc(p.name)}</strong><small>PUNTUACIÓN PUG</small><b>${p.score.toFixed(1)}</b><div class="step">#${p.rank}</div></div>`}).join('');
  document.getElementById('rows').innerHTML=players.map((p,i)=>`<tr class="clk ${p.rank&&p.rank<=5?'d1':'dx'}" data-i="${i}" tabindex="0" role="button" aria-label="Ver perfil de ${esc(p.name)}"><td class="rk">${p.rank?String(p.rank).padStart(2,'0'):'–'}</td><td class="pl"><div class="plin"><img src="${avatar(p)}" alt=""><div class="player-name"><strong>${esc(p.name)}</strong><small>${p.n} ${p.n===1?'partida':'partidas'}${p.qualified?'':' · Provisional'}</small></div></div></td><td>${record(p)}</td><td class="sc"><span class="tier t${tier(p.score)}">TIER ${tier(p.score)}</span> <b>${p.score.toFixed(1)}</b></td></tr>`).join('');
  document.getElementById('matches').innerHTML=PUG_MATCHES.map(([id,map,date,score])=>`<a href="https://app.scope.gg/matches/${id}/1546214474" target="_blank" rel="noopener noreferrer">${esc(map)} · ${esc(date)} · ${esc(score)} ↗</a>`).join('');
  const modal=document.getElementById('modal'),detail=document.getElementById('detail');let lastFocus;
  const field=(name,value)=>`<div><span>${name}</span><b>${value}</b></div>`;
  function open(index){const p=players[index];lastFocus=document.activeElement;detail.innerHTML=`<header><img src="${avatar(p)}" alt=""><div><h2 id="pug-name">${esc(p.name)}</h2><p>${p.rank?'#'+p.rank:'Provisional'} · ${p.n} partidas · ${record(p)}</p></div></header><p>Puntuación PUG: <strong>${p.score.toFixed(1)}</strong>. ${p.qualified?'':'Se necesitan tres partidas para obtener una posición.'}</p><div class="pug-detail">${field('Rating Scope 2.1',p.rating.toFixed(2))}${field('ADR medio',p.adr.toFixed(1))}${field('K/D',p.kd.toFixed(2))}${field('KAST medio',p.kast.toFixed(1)+'%')}${field('Victorias',p.w)}${field('Derrotas',p.l)}${field('Bajas / muertes / asistencias',`${p.k} / ${p.d} / ${p.a}`)}${field('Daño total',p.damage)}${field('Diferencia ADR media',p.delta.toFixed(1))}${field('Bajas de apertura',p.open)}${field('Trade kills',p.trades)}${field('Win rate',(p.w/p.n*100).toFixed(1)+'%')}</div><p><a href="https://app.scope.gg/profile/${p.id}" target="_blank" rel="noopener noreferrer">Ver perfil en Scope ↗</a></p>`;modal.hidden=false;document.getElementById('close').focus();}
  function close(){modal.hidden=true;if(lastFocus)lastFocus.focus()}
  document.addEventListener('click',e=>{const item=e.target.closest('[data-i]');if(item)open(Number(item.dataset.i));else if(e.target===modal||e.target.closest('#close'))close();});
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!modal.hidden)close();const item=e.target.closest('[data-i]');if(item&&(e.key==='Enter'||e.key===' ')){e.preventDefault();open(Number(item.dataset.i));}});
})();
