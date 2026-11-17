
(function(){
'use strict';
const KEY='oshimichi-saved-route-v1';
const step=document.getElementById('oshiStep06');
const result=document.getElementById('courseResult');
const course=document.getElementById('course');
if(!step||!result||!course)return;
let saving=false;
const ja=()=>typeof language!=='undefined'&&language==='ja';
const t=(jp,ko)=>ja()?jp:ko;
function read(){try{const v=JSON.parse(localStorage.getItem(KEY)||'null');return v&&Array.isArray(v.stops)?v:null}catch(e){return null}}
function write(v){try{localStorage.setItem(KEY,JSON.stringify(v));return true}catch(e){return false}}
function hideStep(){step.classList.remove('active');step.setAttribute('aria-hidden','true')}
function selectedEntries(){return window.OSHI_STEP05_BRIDGE?.getRoute?.()||[]}
function snapshot(){
 // STEP 05 owns the actual route state inside a private closure. Use its bridge,
 // not a free variable named routeEntries (which is not visible here).
 const rows=selectedEntries();if(!rows.length)return null;
 return {savedAt:new Date().toISOString(),date:document.getElementById('travelDate')?.value||'',
 time:document.getElementById('travelTime')?.value||'',mode:document.getElementById('travelMode')?.value||'',
 origin:document.getElementById('originSelect')?.selectedOptions?.[0]?.textContent||'',
 stops:rows};
}
function showSaved(){
 const data=read();if(!data?.stops?.length){hideStep();window.OSHI_STEP05_BRIDGE?.openCourse?.();return;}
 // Existing showPage() hides the welcome screen and other pages. It also clears the old
 // recommendation, which is restored on pressing Edit.
 window.OSHI_STEP05_BRIDGE?.openCourse?.();
 course.classList.remove('active');course.setAttribute('aria-hidden','true');
 step.classList.add('active');step.setAttribute('aria-hidden','false');
 document.querySelectorAll('.oshi-quick-link').forEach(b=>{if(b.id==='navCourse')b.setAttribute('aria-current','page');else b.removeAttribute('aria-current')});
 renderSaved();window.scrollTo(0,0);
}
function editCourse(){hideStep();
 try{window.OSHI_STEP05_BRIDGE?.edit?.()}catch(e){console.error('STEP 05 redraw',e)}
}
function mapLink(a,b,mode){return 'https://www.google.com/maps/dir/?'+new URLSearchParams({api:'1',origin:a.lat+','+a.lng,destination:b.lat+','+b.lng,travelmode:mode==='walk'?'walking':'transit'}).toString()}
function withCoordinates(p){return Number.isFinite(p?.lat)&&Number.isFinite(p?.lng)}
function renderSaved(){
 const data=read(),out=document.getElementById('step06Contents');out.replaceChildren();
 document.getElementById('step06Title').innerHTML=t('私の<em>聖地巡礼コース</em> ✧','나의 <em>성지순례 코스</em> ✧');
 document.getElementById('step06Intro').textContent=t('確定した訪問順と区間別の経路をいつでも確認できます。','확정한 방문 순서와 구간별 이동 경로를 언제든 다시 확인할 수 있어요.');
 document.getElementById('step06Edit').textContent=t('訪問順を編集','방문 순서 다시 편집');
 document.getElementById('step06Delete').textContent=t('保存したコースを削除','저장된 코스 삭제');
 if(!data?.stops?.length){out.textContent=t('保存されたコースがありません。','저장된 코스가 없어요.');return;}
 const panel=document.createElement('div');panel.className='step06-panel';
 const heading=document.createElement('h3');heading.textContent=t('✦ 確定した訪問ルート','✦ 확정된 방문 코스');panel.append(heading);
 const meta=document.createElement('p');meta.className='step06-note';meta.textContent=[data.date,data.time,data.origin,data.mode==='walk'?t('徒歩','도보'):t('公共交通','대중교통')].filter(Boolean).join(' · ');panel.append(meta);
 data.stops.forEach((p,i)=>{
  if(i>0){const prev=data.stops[i-1];const leg=document.createElement('div');leg.className='step06-leg';
   const mode=data.mode==='walk'?'🚶':'🚇';
   const desc=document.createElement('span');desc.textContent=mode+' '+t(`${i} → ${i+1} スポットの移動`,`${i} → ${i+1}번째 장소 이동`);leg.append(desc);
   if(withCoordinates(prev)&&withCoordinates(p)){const a=document.createElement('a');a.href=mapLink(prev,p,data.mode);a.target='_blank';a.rel='noopener noreferrer';a.textContent=t('実際の経路・乗換を見る ↗','실제 길찾기·환승 확인 ↗');leg.append(a)}panel.append(leg);
  }
  const item=document.createElement('div');item.className='step06-stop';
  const n=document.createElement('span');n.className='step06-number';n.textContent=String(i+1).padStart(2,'0');
  const content=document.createElement('div');const name=document.createElement('b');name.textContent=ja()?p.ja||p.ko:p.ko||p.ja;
  const detail=document.createElement('small');detail.textContent=[p.arrival,p.stay?t(`滞在 ${p.stay}分`,`체류 ${p.stay}분`):'',p.address].filter(Boolean).join(' · ');content.append(name,detail);
  if(withCoordinates(p)){const a=document.createElement('a');a.href='https://www.google.com/maps/search/?api=1&query='+encodeURIComponent(p.lat+','+p.lng);a.target='_blank';a.rel='noopener noreferrer';a.textContent=t('📍 地図で場所を見る','📍 지도에서 장소 보기');content.append(a)}
  item.append(n,content);panel.append(item);
 });out.append(panel);
 const note=document.createElement('p');note.className='step06-note';note.textContent=t('※ 到着時刻は計画用の推定値です。実際の交通ルートと所要時間はリンク先でご確認ください。','※ 도착 시각은 계획용 예상치입니다. 실제 이동 경로와 소요 시간은 길찾기 링크에서 확인해 주세요.');out.append(note);
}
function ensureSave(){
 let box=document.getElementById('oshiSaveArea');
 const list=result.querySelector('.oshi-improved-course, .course-list');
 const valid=!!list && !!list.querySelector('.oshi-course-spot, .course-item');
 if(!valid){if(box)box.remove();return;}
 if(!box){box=document.createElement('div');box.id='oshiSaveArea';box.className='oshi-save-area';
  box.innerHTML='<h3 id="oshiSaveTitle"></h3><p id="oshiSaveDesc"></p><div class="oshi-progress-track" role="progressbar" aria-label="코스 저장 진행률" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0"><div class="oshi-progress-fill" id="oshiProgressFill"></div></div><div class="oshi-progress-number" id="oshiProgressNumber">0%</div><div class="oshi-save-actions"><button type="button" class="step06-primary" id="oshiSaveButton"></button></div>';
  box.querySelector('button').addEventListener('click',saveAnimated);
 }
 // Keep the confirm panel in the reading flow, immediately AFTER the visit cards
 // and BEFORE the external map links / tall interactive map.
 if(list.nextSibling!==box)list.insertAdjacentElement('afterend',box);
 document.getElementById('oshiSaveTitle').textContent=t('✦ 訪問順を確定','✦ 방문 순서 확정하기');
 document.getElementById('oshiSaveDesc').textContent=t('訪問順を確認し、保存するとSTEP 06に進みます。','장소와 방문 순서를 확인한 뒤 저장하면 STEP 06으로 이동해요.');
 document.getElementById('oshiSaveButton').textContent=t('コースを確定して保存する →','코스 확정하고 저장하기 →');
}
function saveAnimated(){
 if(saving)return;const data=snapshot();if(!data?.stops?.length){alert(t('訪問場所を選んでください。','방문 장소를 먼저 선택해 주세요.'));return}
 saving=true;
 const button=document.getElementById('oshiSaveButton'),fill=document.getElementById('oshiProgressFill'),number=document.getElementById('oshiProgressNumber'),track=document.querySelector('#oshiSaveArea [role="progressbar"]');
 button.disabled=true;button.textContent=t('保存中…','저장 중…');
 fill.style.width='0%';number.textContent='0%';track.setAttribute('aria-valuenow','0');
 let start=null;const duration=1700;
 function frame(now){if(start===null)start=now;const ratio=Math.min(1,(now-start)/duration),pct=Math.min(100,Math.round((1-Math.pow(1-ratio,3))*100));
  fill.style.width=pct+'%';number.textContent=pct+'%';track.setAttribute('aria-valuenow',String(pct));
  if(ratio<1){requestAnimationFrame(frame);return;}
  if(!write(data)){alert(t('保存できませんでした。ブラウザの保存設定をご確認ください。','저장할 수 없어요. 브라우저 저장 설정을 확인해 주세요.'));button.disabled=false;saving=false;return}
  saving=false;showSaved();
 }
 requestAnimationFrame(frame);
}
// Attach directly to the actual STEP 05 painting operation. A MutationObserver-only
// solution may fail if its callback runs before the route data is ready.
try{if(typeof paintCourse==='function'){const originalPaint=paintCourse;paintCourse=function(){const r=originalPaint.apply(this,arguments);ensureSave();return r}}}catch(e){console.error(e)}
// STEP 06 must disappear when any ordinary page navigation happens.
try{if(typeof showPage==='function'){const originalShowPage=showPage;showPage=function(){hideStep();return originalShowPage.apply(this,arguments)}}}catch(e){console.error(e)}
const nav=document.getElementById('navCourse');
if(nav)nav.addEventListener('click',function(e){if(read()?.stops?.length){e.preventDefault();e.stopImmediatePropagation();showSaved()}},true);
document.getElementById('step06Back').addEventListener('click',editCourse);
document.getElementById('step06Edit').addEventListener('click',editCourse);
document.getElementById('step06Delete').addEventListener('click',()=>{if(!confirm(t('保存したコースを削除しますか？','저장된 코스를 삭제할까요?')))return;try{localStorage.removeItem(KEY)}catch(e){}editCourse()});
const observer=new MutationObserver(()=>{if(!saving){const list=result.querySelector('.oshi-improved-course, .course-list');const save=document.getElementById('oshiSaveArea');if((list&&!save)||(!list&&save)||(list&&save&&list.nextSibling!==save))ensureSave()}});observer.observe(result,{childList:true});
try{if(typeof translate==='function'){const originalTranslate=translate;translate=function(){const r=originalTranslate.apply(this,arguments);if(step.classList.contains('active'))renderSaved();else ensureSave();return r}}}catch(e){console.error(e)}
ensureSave();
})();
