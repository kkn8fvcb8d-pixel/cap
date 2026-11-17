
/* Detail-window enhancements are installed AFTER the original feature code. */
(function(){
 'use strict';
 if(typeof openDetail!=='function')return;
 const oldOpenDetail=openDetail;
 const oldOriginalDetail=typeof originalDetail==='function'?originalDetail:null;
 const stationCache=new Map();
 let noticeTimeout;
 const ko=()=>document.documentElement.lang.toLowerCase().startsWith('ko');
 const label=(a,b)=>ko()?b:a;
 function notice(saved){
  let el=document.getElementById('oshiDetailFavoriteNotice');
  if(!el){el=document.createElement('div');el.id='oshiDetailFavoriteNotice';el.className='oshi-fav-notice';el.setAttribute('role','status');el.setAttribute('aria-live','polite');document.body.appendChild(el)}
  el.textContent=saved?label('♥ お気に入りに追加しました！','♥ 즐겨찾기에 추가했어요!'):label('♡ お気に入りから削除しました','♡ 즐겨찾기를 해제했어요');
  el.classList.add('shown');clearTimeout(noticeTimeout);noticeTimeout=setTimeout(()=>el.classList.remove('shown'),1800);
 }
 function bounce(button){
  if(!button)return;
  button.classList.remove('heart-bounce');void button.offsetWidth;button.classList.add('heart-bounce');
  if(window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches)return;
  const r=button.getBoundingClientRect();
  [[-45,-51],[8,-65],[43,-42],[-15,-82]].forEach(([dx,dy],i)=>{
   const heart=document.createElement('span');heart.className='oshi-heart-spark';heart.textContent=i===2?'♡':'♥';
   heart.style.setProperty('--x',r.left+r.width/2+'px');heart.style.setProperty('--y',r.top+r.height/2+'px');
   heart.style.setProperty('--dx',dx+'px');heart.style.setProperty('--dy',dy+'px');document.body.appendChild(heart);
   setTimeout(()=>heart.remove(),900);
  });
 }
 function syncHeart(button,p){
  const saved=favorites.includes(p.id);button.classList.toggle('is-saved',saved);
  button.textContent=saved?'♥':'♡';button.setAttribute('aria-pressed',String(saved));
  button.setAttribute('aria-label',saved?label('お気に入りから削除','즐겨찾기 해제'):label('お気に入りに追加','즐겨찾기 추가'));
 }
 async function nearestStation(p,element){
  if(!Number.isFinite(p.lat)||!Number.isFinite(p.lng)){
   element.textContent=label('位置を確認した後にご案内します','위치를 확인한 뒤 안내할게요');return;
  }
  const key=p.lat.toFixed(5)+','+p.lng.toFixed(5);
  if(stationCache.has(key)){element.innerHTML=stationCache.get(key);return;}
  element.textContent=label('近くの地下鉄駅を検索中…','가까운 지하철역을 확인 중…');
  const query=`[out:json][timeout:12];(node["railway"="station"]["station"="subway"](around:2500,${p.lat},${p.lng});node["railway"="station"]["subway"="yes"](around:2500,${p.lat},${p.lng});node["railway"="station"]["network"~"Seoul|서울"](around:2500,${p.lat},${p.lng}););out body;`;
  const controller=new AbortController();const timer=setTimeout(()=>controller.abort(),9000);
  try{
   const r=await fetch('https://overpass.kumi.systems/api/interpreter',{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded;charset=UTF-8'},body:'data='+encodeURIComponent(query),signal:controller.signal});
   if(!r.ok)throw Error('network');
   const data=await r.json();
   const d=(lat,lng)=>{const R=6371000,rad=Math.PI/180,a=Math.sin((lat-p.lat)*rad/2)**2+Math.cos(p.lat*rad)*Math.cos(lat*rad)*Math.sin((lng-p.lng)*rad/2)**2;return Math.round(2*R*Math.asin(Math.sqrt(a)));};
   const options=(data.elements||[]).filter(x=>Number.isFinite(x.lat)&&Number.isFinite(x.lon)&&x.tags&&(x.tags.name||x.tags['name:ko'])).map(x=>({name:ko()?(x.tags['name:ko']||x.tags.name):(x.tags['name:ja']||x.tags.name),meters:d(x.lat,x.lon)})).sort((a,b)=>a.meters-b.meters);
   if(!options.length)throw Error('no stations');
   const station=options[0];
   const line=document.createElement('span');line.className='oshi-location-station';
   line.textContent=station.name+' · '+station.meters.toLocaleString()+'m';
   const small=document.createElement('small');small.textContent=label('※ 地図上の直線距離です。実際の徒歩経路とは異なります。','※ 지도상 직선거리예요. 실제 도보 거리는 다를 수 있어요.');line.appendChild(small);
   // Cache text, built from live OpenStreetMap station coordinates.
   stationCache.set(key,line.outerHTML);
   if(element.isConnected)element.replaceChildren(line);
  }catch(e){
   if(element.isConnected)element.textContent=label('最寄り駅・距離の確認中（地図情報の取得不可）','가까운 역·거리 확인 중 (지도 정보를 불러오지 못했어요)');
  }finally{clearTimeout(timer)}
 }
 function replaceLocationTab(wrap,p){
  const panel=wrap.querySelector('.oshi-detail-tabbody[data-panel="2"]');if(!panel)return;
  const rows=panel.querySelector('.oshi-detail-rows');if(!rows)return;
  // Coordinates and coordinate-source records are technical and removed from the tourist-facing Location tab.
  rows.replaceChildren();
  const makeRow=(title,value)=>{const row=document.createElement('div');const b=document.createElement('b');b.textContent=title;const span=document.createElement('span');span.textContent=value;row.append(b,span);rows.appendChild(row);return span;};
  makeRow(label('スポットの住所','장소 주소'),p.address||label('住所未確認','주소 확인 중'));
  const station=makeRow(label('最寄り駅・距離','가까운 역 · 거리'),label('確認中','확인 중'));
  const transit=(p.transit||'').trim();
  if(transit&&transit!=='미기재'&&transit!=='정보 미확인')makeRow(label('アクセス（調査資料）','교통 안내 (조사 자료)'),transit);
  // Search on the initial location-tab opening rather than making an external request on every modal opening.
  const locationTab=wrap.querySelector('[data-tab="2"]');let fetched=false;
  const run=()=>{if(!fetched){fetched=true;void nearestStation(p,station)}};
  locationTab?.addEventListener('click',run);
  if(!panel.hidden)run();
 }
 function enhanceTwice(p,wrap){
  const heart=wrap.querySelector('.oshi-detail-heart');const action=wrap.querySelector('.oshi-detail-action');
  if(!heart)return;
  syncHeart(heart,p);
  replaceLocationTab(wrap,p);
  // Capture-phase feedback survives card re-render after original save handler.
  [heart,action].filter(Boolean).forEach(button=>button.addEventListener('click',()=>{
   const nextSaved=!favorites.includes(p.id);
   bounce(heart);notice(nextSaved);
   // Original click handler changes favorites and re-renders; synchronize immediately afterwards.
   queueMicrotask(()=>syncHeart(heart,p));
  },true));
 }
 function enhanceOther(p,wrap){
  const dialog=wrap.querySelector('.detail-dialog');const existing=dialog?.querySelector('.detail-save');
  if(!dialog||!existing)return;
  const button=document.createElement('button');button.type='button';button.className='oshi-original-fav';
  button.setAttribute('title',label('お気に入り','즐겨찾기'));syncHeart(button,p);
  dialog.appendChild(button);
  button.addEventListener('click',()=>{
   const saved=!favorites.includes(p.id);bounce(button);notice(saved);
   existing.click();syncHeart(button,p);
  });
  // General detail cards have no location tab, so append clear transit/address information without fake distances.
  const grid=dialog.querySelector('.detail-grid');
  if(grid){const row=document.createElement('div');
   const title=document.createElement('b');title.textContent=label('最寄り駅・距離','가까운 역 · 거리');
   const value=document.createElement('span');value.className='oshi-location-station';value.textContent=label('確認中','확인 중');
   row.append(title,document.createElement('br'),value);grid.insertBefore(row,grid.children[1]||null);
   void nearestStation(p,value);
  }
 }
 openDetail=function(p){
  const result=oldOpenDetail.apply(this,arguments);
  const wrap=document.getElementById('detailRoot');if(!wrap)return result;
  if(wrap.querySelector('.oshi-detail-panel'))enhanceTwice(p,wrap);
  else enhanceOther(p,wrap);
  return result;
 };
 // Map popups are authored in a different script; expose the FINAL enhanced detail renderer.
 window.OSHI_STEP03_OPEN_DETAIL=(place)=>openDetail(place);
})();
