
/* existing HTML enhancement */

(() => {
'use strict';
const $=id=>document.getElementById(id), yes=()=>language==='ja', translatePair=(ja,ko)=>yes()?ja:ko;
const AREAS={hongdae:[37.5563,126.9236],myeongdong:[37.5636,126.9834],gangnam:[37.4979,127.0276],seongsu:[37.5446,127.0566],jamsil:[37.5131,127.1001]};
const metadata={tw_yongma:'tw_yongma',tw_yangjae:'tw_yangjae',tw_jyp:'tw_jyp',tw_lotteworld:'tw_lotteworld',tw_seogang:'tw_seogang',tw_colorpool:'tw_colorpool',tw_changsin:'tw_changsin',tw_kimkyeongja:'tw_kimkyeongja',tw_yukmong_yongsan:'tw_yukmong_yongsan',tw_yukmong_hongdae:'tw_yukmong_hongdae',sk_namsan:'nseoul',sk_jungang:'jungang',sk_yeouido:'yeouido',sk_jyp:'jyp'};
const sourceData=window.OSHI_PLACES;
// Add manually curated statuses. Unknown != open. An event venue with no verified source stays unverified.
demoPlaces.forEach(p=>{
 const rec=sourceData.find(x=>x.id===p.id || x.id===metadata[p.id]);
 if(rec){p.verified=!!rec.verified;p.category=rec.category;p.hoursJa=rec.hours;p.hoursKo=rec.hoursKo;p.offJa=rec.weeklyOffJa;p.offKo=rec.weeklyOffKo;p.status=rec.status;p.verifiedDate=rec.verifiedDate;p.visitMinutes=rec.visitMinutes;p.opening=rec.opening;p.closedWeekdays=rec.closedWeekdays||[];p.source=rec.sourceUrl;p.relationJa=rec.relationJa;p.relationKo=rec.relationKo;p.descriptionJa=rec.descriptionJa;p.descriptionKo=rec.descriptionKo;p.address=rec.address;p.lat=rec.lat;p.lng=rec.lng;if(p.group==='TWICE'){p.members=rec.members||[];p.coordinateSource=rec.coordinateSource;p.documentNumber=rec.documentNumber;p.sourceName=rec.sourceName;p.transit=rec.transit;p.phone=rec.phone;p.fee=rec.fee;p.notice=rec.notice;p.memberLabelKo=rec.memberLabelKo;p.businessCheckedAt=rec.businessCheckedAt;}}
 else{p.verified=false;p.category='other';p.hoursJa='要確認';p.hoursKo='확인 필요';p.offJa='要確認';p.offKo='확인 필요';p.status='check';p.verifiedDate=null;p.visitMinutes=45;p.opening=null;p.relationJa='公演会場としての関連情報・一次資料は未確認';p.relationKo='공연장 관련 정보·1차 출처 미확인';}
});
const statusText=p=>p.status==='public'?translatePair('屋外・営業対象外','야외·영업대상 아님'):p.status==='exterior'?translatePair('外観のみ','외관만 관람'):p.status==='closed'?translatePair('閉業','폐업'):p.status==='temporary_closed'?translatePair('臨時休業','임시휴무'):p.status==='regular_closed'?translatePair('定休日','정기휴무'):translatePair('営業・入場要確認','영업·출입 확인 필요');
let gender=null,manualArea='',route=[],routeEntries=[],excluded=[];
// Public bridge for STEP 06: access exactly the data that painted STEP 05.
window.OSHI_STEP05_BRIDGE={
 getRoute(){return routeEntries.map(x=>({id:x.p.id,ja:x.p.ja||'',ko:x.p.ko||'',address:x.p.address||'',lat:x.p.lat,lng:x.p.lng,arrival:x.arrival||'',stay:x.stay||0,buffer:x.buffer||0}))},
 getChosen(){return [...courseChosen]},
 edit(){showPage('course');if(courseChosen.size)paintCourse()},
 openCourse(){showPage('course')}
};

const origRenderSpots=renderSpots,origMakeCourse=makeCourse,origTranslate=translate,origRenderFavorites=renderFavorites,origRenderCourseChoices=renderCourseChoices,origShowPage=showPage;
function safeText(s){return String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function updateGender(){const future=document.getElementById('futureArtists');if(future)future.hidden=!gender;document.querySelectorAll('[data-future-card]').forEach(c=>c.hidden=c.dataset.futureCard!==gender);document.querySelectorAll('[data-gender]').forEach(b=>{b.classList.toggle('active',b.dataset.gender===gender);b.textContent=(b.dataset.gender==='girls'?translatePair('♡ 女性アイドル','♡ 여자 아이돌'):translatePair('✦ 男性アイドル','✦ 남자 아이돌'))});document.querySelectorAll('.group').forEach(b=>b.classList.toggle('hidden-gender',gender!==({'TWICE':'girls','IVE':'girls','Stray Kids':'boys','SEVENTEEN':'boys'}[b.dataset.name])))}
$('start').addEventListener('click',()=>{gender=null;updateGender()});document.querySelectorAll('[data-gender]').forEach(b=>b.addEventListener('click',()=>{gender=b.dataset.gender;updateGender()}));updateGender();
const origFiltered=filteredPlaces;
filteredPlaces=function(){let ps=origFiltered();const c=$('categoryFilter').value;if(c!=='all')ps=ps.filter(p=>p.category===c);if($('verifiedOnly').checked)ps=ps.filter(p=>p.verified);return ps};
function getPhoto(p){return `<div class="photo-placeholder">${p.category==='filming'?'▣':p.category==='other'?'✦':'♡'} &nbsp; ${translatePair('写真は許諾確認後に掲載','사진은 사용 권한 확인 후 제공')}</div>`}
function originalDetail(p){$('detailRoot')?.remove();const wrap=document.createElement('div');wrap.className='detail-overlay';wrap.id='detailRoot';wrap.innerHTML=`<section class="detail-dialog" role="dialog" aria-modal="true" aria-labelledby="detailTitle"><button class="soft-button detail-close" type="button">✕</button>${getPhoto(p)}<h2 id="detailTitle">${safeText(yes()?p.ja:p.ko)}</h2><p>${safeText(yes()?p.descriptionJa:p.descriptionKo)}</p><div class="detail-grid"><div><b>${translatePair('韓国語住所','한국어 주소')}</b><br>${safeText(p.address)}</div><div><b>${translatePair('アーティスト・関連内容','아티스트·관련 내용')}</b><br>${safeText(p.group)} · ${safeText(yes()?p.relationJa:p.relationKo)}</div><div><b>${translatePair('営業・立入状況','영업·출입 상태')}</b><br>${statusText(p)} · ${safeText(yes()?p.hoursJa:p.hoursKo)}</div><div><b>${translatePair('定休日・注意事項','휴무일·주의사항')}</b><br>${safeText(yes()?p.offJa:p.offKo)}</div><div><b>${translatePair('最終確認日','마지막 확인일')}</b><br>${safeText(p.verifiedDate||translatePair('未確認','미확인'))} · ${translatePair('訪問前の再確認必須','방문 전 재확인 필수')}</div><div><b>${translatePair('出典の確認','출처 검증')}</b><br>${p.verified?translatePair('公式観光資料で関連性を確認','공식 관광 자료로 관련성 확인'):translatePair('一次資料未確認・検証済み聖地ではありません','1차 자료 미확인·검증된 성지가 아님')}</div></div><div class="place-actions" style="margin-top:18px"><a class="pink-button" href="${safeText(p.source||'#')}" target="_blank" rel="noopener noreferrer">↗ ${translatePair('出典を見る','출처 보기')}</a><button type="button" class="soft-button detail-save">${favorites.includes(p.id)?'♥':'♡'} ${translatePair('お気に入り','즐겨찾기')}</button></div></section>`;document.body.appendChild(wrap);const close=()=>wrap.remove();wrap.addEventListener('click',e=>{if(e.target===wrap)close()});if(!p.source){const link=wrap.querySelector('.detail-dialog a.pink-button');if(link){link.removeAttribute('href');link.removeAttribute('target');link.style.opacity='.5';link.style.pointerEvents='none';link.textContent=translatePair('出典確認が必要','출처 확인 필요')}}wrap.querySelector('.detail-close').onclick=close;wrap.querySelector('.detail-save').onclick=()=>{favorites=favorites.includes(p.id)?favorites.filter(x=>x!==p.id):[...favorites,p.id];save();wrap.querySelector('.detail-save').textContent=(favorites.includes(p.id)?'♥ ':'♡ ')+translatePair('お気に入り','즐겨찾기');renderSpots()};wrap.querySelector('.detail-close').focus()}
function openDetail(p){
 if(p.group!=='TWICE')return originalDetail(p);
 document.getElementById('detailRoot')?.remove();
 const wrap=document.createElement('div');wrap.id='detailRoot';wrap.className='detail-overlay oshi-detail-overlay';
 const ko=language==='ko';const say=(ja,kr)=>ko?kr:ja;
 const name=ko?p.ko:p.ja;
 const sourceStatus=p.source?(p.verified?say('場所の公式情報あり（訪問資料と区別）','장소 관련 정보 확인 (방문 근거와 별개)'):say('関連リンクあり・訪問根拠は要確認','관련 링크 있음·방문 근거 확인 필요')):say('原本URL未確認','원본 URL 미확인');
 const coords=Number.isFinite(p.lat)&&Number.isFinite(p.lng);
 const tabInfo=[say('詳細画像','상세 이미지'),say('説明','설명'),say('位置','위치')];
 const s=safeText;
 const truth=(v)=>v&&v!=='미기재'?s(v):say('情報未確認','정보 미확인');
 const documentTitle=say('調査資料の関連内容','조사 자료 관련 내용');
 const sourceLink=p.source?`<a class="oshi-detail-link" href="${s(p.source)}" target="_blank" rel="noopener noreferrer">↗ ${say('関連情報を見る','관련 정보 보기')}</a>`:`<span class="oshi-detail-disabled">${say('出典URL確認中','출처 URL 확인 중')}</span>`;
 const mapLink=coords?`<a class="oshi-detail-link" target="_blank" rel="noopener noreferrer" href="https://www.openstreetmap.org/?mlat=${p.lat}&mlon=${p.lng}#map=17/${p.lat}/${p.lng}">↗ ${say('地図で開く','지도에서 위치 보기')}</a>`:'';
 wrap.innerHTML=`<section class="oshi-detail-panel" role="dialog" aria-modal="true" aria-labelledby="oshi-detail-title">
   <div class="oshi-detail-hero"><div class="oshi-detail-art"><span>推し道</span><strong>SEOUL SPOT</strong><small>${say('掲載許諾済みの現地写真を準備中','사용 허가된 장소 사진 준비 중')}</small></div>
     <button type="button" class="oshi-detail-back" aria-label="${say('戻る','돌아가기')}">←</button>
     <button type="button" class="oshi-detail-heart" aria-label="${say('お気に入り','즐겨찾기')}">${favorites.includes(p.id)?'♥':'♡'}</button>
     <div class="oshi-detail-maincard"><div class="oshi-detail-tag">TWICE · ${s(p.documentNumber)}</div><h2 id="oshi-detail-title">${s(name)}</h2>
     <div class="oshi-detail-summary"><div>✦ <span>${s(p.memberLabelKo||'전원')}</span> · ${s(p.group)}</div><div>⌖ <span>${s(p.address)}</span></div><div>◷ <span>${statusText(p)} · ${say('訪問前に再確認','방문 전 재확인')}</span></div></div></div>
   </div>
   <div class="oshi-detail-tabs" role="tablist">${tabInfo.map((a,i)=>`<button type="button" role="tab" data-tab="${i}" aria-selected="${i===1}" class="${i===1?'active':''}">${a}</button>`).join('')}</div>
   <div class="oshi-detail-tabbody" data-panel="0" hidden><div class="oshi-photo-empty">▧<p>${say('現地写真はまだ登録されていません。','장소 사진이 아직 등록되지 않았습니다.')}</p><small>${say('メンバー写真・訪問写真を別の場所の写真として使用しません。','멤버 사진을 실제 장소 사진으로 대신 사용하지 않습니다.')}</small></div></div>
   <div class="oshi-detail-tabbody" data-panel="1"><p class="oshi-detail-desc">${s(ko?p.descriptionKo:p.descriptionJa)}</p><div class="oshi-detail-rows">
    <div><b>${say('関連メンバー','관련 멤버')}</b><span>${s(p.memberLabelKo||'전원')}</span></div>
    <div><b>${documentTitle}</b><span>${s(p.sourceName||'미기재')}</span></div>
    <div><b>${say('出典の検証','출처 확인')}</b><span>${sourceStatus}</span></div>
    <div><b>${say('営業時間（資料記載）','영업시간 (자료 기준)')}</b><span>${truth(p.hoursKo)}</span></div>
    <div><b>${say('定休日（資料記載）','휴무일 (자료 기준)')}</b><span>${truth(p.offKo)}</span></div>
    <div><b>${say('近隣駅・アクセス','가까운 역·교통')}</b><span>${truth(p.transit)}</span></div>
    <div><b>${say('電話番号','전화번호')}</b><span>${truth(p.phone)}</span></div>
    <div><b>${say('料金・追加情報','요금·추가정보')}</b><span>${truth(p.fee)}</span></div>
    <div><b>${say('営業情報の最終確認日','영업정보 마지막 확인일')}</b><span>${truth(p.businessCheckedAt)}</span></div>
    <div><b>${say('訪問時の注意','방문 주의사항')}</b><span>${truth(p.notice)}</span></div>
   </div><p class="oshi-detail-caution">⚠ ${say('資料掲載の営業時間と料金は現在の運営状況を保証しません。','자료에 적힌 영업시간과 요금은 현재 운영 상태를 보장하지 않습니다.')}</p>${sourceLink}</div>
   <div class="oshi-detail-tabbody" data-panel="2" hidden><div class="oshi-detail-rows"><div><b>${say('住所','한국어 주소')}</b><span>${s(p.address)}</span></div><div><b>${say('緯度・経度','위도·경도')}</b><span>${coords?`${Number(p.lat).toFixed(6)}, ${Number(p.lng).toFixed(6)}`:say('正確な座標未確認','정확한 좌표 확인 필요')}</span></div><div><b>${say('座標の資料','좌표 확인 출처')}</b><span>${coords&&p.coordinateSource?`<a href="${s(p.coordinateSource)}" target="_blank" rel="noopener noreferrer">${say('位置の根拠を開く','좌표 근거 열기')} ↗</a>`:say('未確認のため地図マーカーなし','미확인으로 지도 마커 제외')}</span></div></div>${coords?`<div class="oshi-mini-map"><iframe loading="lazy" title="${s(name)}" src="https://www.openstreetmap.org/export/embed.html?bbox=${p.lng-.006}%2C${p.lat-.004}%2C${p.lng+.006}%2C${p.lat+.004}&layer=mapnik&marker=${p.lat}%2C${p.lng}"></iframe></div>`:`<p class="oshi-detail-caution">${say('位置を確認するまで地図にピンを置きません。','위치를 확인하기 전까지 지도에 임의의 핀을 표시하지 않습니다.')}</p>`}${mapLink}</div>
   <div class="oshi-detail-bottom"><button class="oshi-detail-action" type="button">${favorites.includes(p.id)?say('♥ お気に入りから削除','♥ 즐겨찾기 해제'):say('♡ お気に入りに追加','♡ 즐겨찾기에 추가')}</button><button type="button" class="oshi-detail-close">${say('閉じる','닫기')}</button></div>
  </section>`;
 document.body.appendChild(wrap); const close=()=>wrap.remove();
 wrap.querySelector('.oshi-detail-back').onclick=close;wrap.querySelector('.oshi-detail-close').onclick=close;
 wrap.addEventListener('click',e=>{if(e.target===wrap)close()});
 const syncFavorite=()=>{const saved=favorites.includes(p.id);wrap.querySelector('.oshi-detail-heart').textContent=saved?'♥':'♡';wrap.querySelector('.oshi-detail-action').textContent=saved?say('♥ お気に入りから削除','♥ 즐겨찾기 해제'):say('♡ お気に入りに追加','♡ 즐겨찾기에 추가')};
 const toggle=()=>{favorites=favorites.includes(p.id)?favorites.filter(id=>id!==p.id):[...favorites,p.id];save();syncFavorite();renderSpots()};
 wrap.querySelector('.oshi-detail-action').onclick=toggle;wrap.querySelector('.oshi-detail-heart').onclick=toggle;
 wrap.querySelectorAll('[data-tab]').forEach(btn=>btn.onclick=()=>{wrap.querySelectorAll('[data-tab]').forEach(b=>{b.classList.toggle('active',b===btn);b.setAttribute('aria-selected',String(b===btn))});wrap.querySelectorAll('[data-panel]').forEach(panel=>panel.hidden=panel.dataset.panel!==btn.dataset.tab)});
 wrap.querySelector('.oshi-detail-back').focus();
}
/* STEP 03 single source of truth for every group's detail modal. */
(function(){
 'use strict';
 if(typeof openDetail!=='function')return;
 const icon={
  person:'<circle cx="12" cy="7" r="4"/><path d="M4 21v-2a8 8 0 0 1 16 0v2"/>',
  pin:'<path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/>',
  link:'<path d="M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7.1-7.1l-1.7 1.7"/><path d="M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7.1 7.1l1.7-1.7"/>',
  train:'<rect x="5" y="2" width="14" height="16" rx="3"/><path d="M5 10h14M8 22l2-4m6 4-2-4M9 14h.01M15 14h.01"/>'
 };
 const svg=k=>'<svg viewBox="0 0 24 24" aria-hidden="true">'+icon[k]+'</svg>';
 const txt=(x)=>String(x??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
 const ko=()=>document.documentElement.lang==='ko';
 const tr=(ja,kr)=>ko()?kr:ja;
 const valid=x=>x!==undefined&&x!==null&&String(x).trim()!==''&&!['미기재','—','정보 미확인'].includes(String(x).trim());
 const coords=p=>Number.isFinite(p.lat)&&Number.isFinite(p.lng);
 const stationCache=new Map();
 const memberLabel=p=>{
  // This line is for people only: never use relationKo, which contains program titles.
  const raw=String(p.memberLabelKo||'').trim();
  if(p.member==='ALL'||(/^(그룹 전체|공통|전원|전체)$/.test(raw)))return tr('グループ全体','그룹 전체');
  if(raw&&!/^(관련 멤버|출처|관련 콘텐츠)/.test(raw))return raw;
  const names={
   TWICE:{NAYEON:'나연',JEONGYEON:'정연',MOMO:'모모',SANA:'사나',JIHYO:'지효',MINA:'미나',DAHYUN:'다현',CHAEYOUNG:'채영',TZUYU:'쯔위'},
   'Stray Kids':{'BANG CHAN':'방찬','LEE KNOW':'리노',CHANGBIN:'창빈',HYUNJIN:'현진',HAN:'한',FELIX:'필릭스',SEUNGMIN:'승민','I.N':'아이엔',IN:'아이엔'},
   IVE:{YUJIN:'안유진',GAEUL:'가을',REI:'레이',WONYOUNG:'장원영',LIZ:'리즈',LEESEO:'이서'},
   SEVENTEEN:{'S.COUPS':'에스쿱스',JEONGHAN:'정한',JOSHUA:'조슈아',JUN:'준',HOSHI:'호시',WONWOO:'원우',WOOZI:'우지','THE 8':'디에잇',MINGYU:'민규',DK:'도겸',SEUNGKWAN:'승관',VERNON:'버논',DINO:'디노'}
  };
  const keys=Array.isArray(p.members)&&p.members.length?p.members:[p.member];
  const values=keys.filter(x=>x&&x!=='ALL').map(x=>names[p.group]?.[x]||x);
  return values.length?values.join('·'):tr('関連メンバー未確認','관련 멤버 확인 필요');
 };
 function row(label,content){return '<div class="oshi-unified-detailrow"><b>'+txt(label)+'</b><div>'+content+'</div></div>'}
 function sourceRefs(p){
  const catalog=window.OSHI_ORIGINAL_REFERENCES||{};
  const legacy={tw_lotteworld:'twice_002',tw_yangjae:'twice_003',tw_changsin:'twice_004',tw_kimkyeongja:'twice_005',tw_yongma:'twice_006',tw_yukmong_yongsan:'twice_007',tw_yukmong_hongdae:'twice_008',sk_jungang:'skz_014',sk_namsan:'skz_018'};
  return catalog[p.id]||catalog[legacy[p.id]]||[];
 }
 function contentRefs(p){return sourceRefs(p).filter(x=>x.kind==='content'||x.kind==='evidence');}
 function status(p){return contentRefs(p).length?tr('出典確認済み','출처 확인 완료'):tr('コンテンツ原典リンク未確認','콘텐츠 원본 링크 미확인');}
 function referenceDetail(p){
  const primary=contentRefs(p),places=sourceRefs(p).filter(x=>x.kind==='place');
  const intro=(ko()?p.relationKo:p.relationJa)||p.sourceName||tr('確認中','확인 중');
  let out='';
  if(primary.length){out=primary.map(x=>'<div class="oshi-original-program"><div class="oshi-original-program-name">'+txt(x.label)+'</div><a class="oshi-original-program-url" href="'+txt(x.url)+'" target="_blank" rel="noopener noreferrer"><span class="oshi-original-program-action">↗ '+(x.kind==='content'?tr('動画・コンテンツを見る','영상·콘텐츠 바로 보기'):tr('原本投稿を見る','원본 게시물 바로 보기'))+'</span><span class="oshi-original-url-text">'+txt(x.url)+'</span></a></div>').join('');}
  else out='<div class="oshi-original-missing">'+txt(intro)+'</div>';
  if(places.length)out+='<div class="oshi-original-extra"><span class="oshi-original-source-label">'+tr('施設公式サイト・案内','장소 홈페이지·안내')+'</span>'+places.map(x=>'<div><a href="'+txt(x.url)+'" target="_blank" rel="noopener noreferrer">↗ '+txt(x.label)+'</a></div>').join('')+'</div>';
  return out;
 }
 function referenceStatus(p){return contentRefs(p).length?'<strong class="oshi-original-confirmed">✓ '+status(p)+'</strong><small class="oshi-original-caveat">'+tr('※ 原典リンクの確認を意味し、実際の訪問や撮影地点の独立検証とは異なります。','※ 원본 링크 확보 기준이며 실제 방문·정확한 촬영 지점의 독립 검증과는 별개입니다.')+'</small>':'<span class="oshi-original-missing">'+status(p)+'</span>';}

 let noticeTimer;
 function toast(saved){let el=document.getElementById('oshiUnifiedToast');if(!el){el=document.createElement('div');el.id='oshiUnifiedToast';el.className='oshi-unified-toast';el.setAttribute('role','status');el.setAttribute('aria-live','polite');document.body.appendChild(el)}el.textContent=saved?tr('♥ お気に入りに追加しました！','♥ 즐겨찾기에 추가했어요!'):tr('♡ お気に入りから削除しました','♡ 즐겨찾기 해제했어요');el.classList.add('show');clearTimeout(noticeTimer);noticeTimer=setTimeout(()=>el.classList.remove('show'),1800)}
 function bounce(heart){heart.classList.remove('oshi-unified-fav-bounce');void heart.offsetWidth;heart.classList.add('oshi-unified-fav-bounce');if(window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches)return;const rect=heart.getBoundingClientRect();for(const [dx,dy] of [[-48,-42],[-19,-77],[22,-73],[48,-35]]){let spark=document.createElement('span');spark.className='oshi-unified-burst';spark.textContent='♥';spark.style.setProperty('--x',(rect.left+rect.width/2)+'px');spark.style.setProperty('--y',(rect.top+rect.height/2)+'px');spark.style.setProperty('--dx',dx+'px');spark.style.setProperty('--dy',dy+'px');document.body.appendChild(spark);setTimeout(()=>spark.remove(),950)}}
 const OSHI_SUPPLIED_STATION_GUIDE = {"tw_jyp":{"lines":[{"station":"둔촌동역 3번 출구","metric":"1.1km (도보 17분)"},{"station":"강동구청역 3번 출구","metric":"1.2km (도보 19분)"}],"note":""},"tw_lotteworld":{"lines":[{"station":"잠실역 4번 출구","metric":"144m (도보 2분)"}],"note":""},"tw_yangjae":{"lines":[{"station":"양재시민의숲역 1번 출구","metric":"916m (도보 14분)"},{"station":"양재역 8번 출구","metric":"1km (도보 16분)"}],"note":""},"tw_changsin":{"lines":[{"station":"동대문역 3번 출구","metric":"135m"}],"note":""},"tw_kimkyeongja":{"lines":[{"station":"금호역 1번 출구","metric":"576m"}],"note":""},"tw_yongma":{"lines":[{"station":"면목역 2번 출구","metric":""}],"note":"버스 242·2227번 이용"},"tw_yukmong_yongsan":{"lines":[{"station":"삼각지역 1번 출구","metric":"195m"}],"note":""},"tw_yukmong_hongdae":{"lines":[{"station":"홍대입구역 9번 출구","metric":"469m"}],"note":""},"ive_002":{"lines":[{"station":"홍대입구역 8번 출구","metric":"약 80m (도보 1분)"}],"note":""},"ive_003":{"lines":[{"station":"강남구청역 4번 출구","metric":"약 600m (도보 10분)"}],"note":""},"ive_004":{"lines":[{"station":"압구정로데오역 5번 출구","metric":"약 455m (도보 7분)"}],"note":""},"ive_005":{"lines":[{"station":"회현역 7번 출구","metric":"약 150m (도보 3분)"}],"note":""},"svt_001":{"lines":[{"station":"서울숲역 1번 출구","metric":"518m (도보 8분)"},{"station":"뚝섬역 5번 출구","metric":"574m (도보 9분)"}],"note":""},"svt_002":{"lines":[{"station":"청계산입구역 2번 출구","metric":"590m (도보 9분)"}],"note":""},"svt_003":{"lines":[{"station":"건대입구역 6번 출구","metric":"485m (도보 7분)"}],"note":""},"svt_004":{"lines":[{"station":"압구정로데오역 3번 출구","metric":"852m (도보 14분)"},{"station":"강남구청역 4번 출구","metric":"796m (도보 12분)"}],"note":""},"svt_005":{"lines":[{"station":"논현역 6번 출구","metric":"27m (도보 1분)"}],"note":""},"svt_006":{"lines":[{"station":"회기역 (출구 미기재)","metric":"1.1km (도보 19분)"}],"note":""},"svt_007":{"lines":[{"station":"한남역 (출구 미기재)","metric":"702m (도보 12분)"}],"note":""},"svt_008":{"lines":[{"station":"압구정로데오역 5번 출구","metric":"496m (도보 7분)"}],"note":""},"svt_009":{"lines":[{"station":"압구정로데오역 4번 출구","metric":"444m (도보 7분)"}],"note":""},"svt_010":{"lines":[{"station":"광운대역 1번 출구","metric":"557m (도보 9분)"}],"note":""},"sk_jyp":{"lines":[{"station":"올림픽공원역 3번 출구","metric":"약 1.2km (도보 19분)"}],"note":""},"skz_002":{"lines":[{"station":"방이역 4번 출구","metric":"약 175m (도보 3분)"}],"note":""},"skz_003":{"lines":[{"station":"석촌역 7번 출구","metric":"약 457m (도보 7분)"}],"note":""},"skz_004":{"lines":[{"station":"자양역 2·3번 출구","metric":"약 451m (도보 1분~7분)"}],"note":""},"sk_yeouido":{"lines":[{"station":"여의나루역 3번 출구","metric":"약 216m (도보 4분)"}],"note":""},"skz_006":{"lines":[{"station":"청담역 14번 출구","metric":"약 650m (도보 10분)"}],"note":""},"skz_007":{"lines":[{"station":"청담역 9번 출구","metric":"약 608m (도보 8분)"}],"note":""},"skz_011":{"lines":[{"station":"삼성중앙역 4번 출구","metric":"386m"},{"station":"봉은사역 (출구 미기재)","metric":"444m (도보 8분)"}],"note":""},"sk_jungang":{"lines":[{"station":"안국역 3번 출구","metric":"716m (도보 12분)"}],"note":""},"sk_namsan":{"lines":[{"station":"충무로역 2번 출구","metric":""},{"station":"명동역 (출구 미기재)","metric":"2.1km (도보 1시간 9분)"}],"note":"충무로역 하차 후 버스 이용"},"skz_019":{"lines":[{"station":"을지로입구역 7번 출구","metric":"57m"},{"station":"을지로입구역 (출구 미기재)","metric":"178m (도보 3분)"}],"note":""},"skz_020":{"lines":[{"station":"을지로입구역 5번 출구","metric":"120m (도보 2분)"}],"note":"원본 문서 내 '을지롱비구역' 병기"},"skz_021":{"lines":[{"station":"홍대입구역 4번 출구","metric":"199m (도보 4분)"}],"note":""},"skz_022":{"lines":[{"station":"장한평역 1번 출구","metric":"9m (도보 1분)"}],"note":""}};
 function oshiGuideTranslate(text){
   if(ko())return text;
   return String(text).replace(/(\S+?)역/g,'$1駅').replace(/(\d+)번 출구/g,'$1番出口')
     .replace(/도보/g,'徒歩').replace(/버스/g,'バス').replace(/번 이용/g,'番を利用').replace(/또는/g,'または');
 }
 function oshiRenderSuppliedStation(p,element){
   const record=OSHI_SUPPLIED_STATION_GUIDE[p.id];
   if(!record||!element)return false;
   element.replaceChildren();
   const list=document.createElement('div');list.className='oshi-supplied-station-list';
   for(const item of record.lines){
     const line=document.createElement('div');line.className='oshi-supplied-station-line';
     const stationName=document.createElement('strong');stationName.textContent=oshiGuideTranslate(item.station);
     line.appendChild(stationName);
     if(item.metric){const metric=document.createElement('span');metric.textContent=oshiGuideTranslate(item.metric);line.appendChild(metric)}
     list.appendChild(line);
   }
   element.appendChild(list);
   if(record.note){
     const extra=document.createElement('div');extra.className='oshi-supplied-station-note';
     extra.textContent=oshiGuideTranslate(record.note);element.appendChild(extra);
   }
   const caption=document.createElement('small');caption.className='oshi-supplied-station-caption';
   caption.textContent=tr('※ 添付資料に記載された案内です。訪問前にご確認ください。','※ 첨부 자료 기준 안내입니다. 방문 전 확인해 주세요.');
   element.appendChild(caption);
   return true;
 }

 function station(p,element){
  if(oshiRenderSuppliedStation(p,element))return;
  const original=(p.transit||'').trim();
  if(!coords(p)){element.textContent=valid(original)?original:tr('近くの駅と距離は未確認','가까운 역과 거리 확인 중');return}
  const key=p.lat.toFixed(5)+','+p.lng.toFixed(5);
  if(stationCache.has(key)){element.textContent=stationCache.get(key);return}
  element.textContent=tr('近くの駅を調べています…','가까운 역을 확인 중…');
  const query=`[out:json][timeout:12];(node["railway"="station"]["station"="subway"](around:2500,${p.lat},${p.lng});node["railway"="station"]["subway"="yes"](around:2500,${p.lat},${p.lng}););out body;`;
  const controller=new AbortController();const timer=setTimeout(()=>controller.abort(),8500);
  fetch('https://overpass.kumi.systems/api/interpreter',{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded;charset=UTF-8'},body:'data='+encodeURIComponent(query),signal:controller.signal}).then(r=>{if(!r.ok)throw Error('unavailable');return r.json()}).then(data=>{
   const R=6371000,toRad=Math.PI/180;
   const results=(data.elements||[]).filter(e=>Number.isFinite(e.lat)&&Number.isFinite(e.lon)&&e.tags&&(e.tags.name||e.tags['name:ko'])).map(e=>{
    const a=Math.sin((e.lat-p.lat)*toRad/2)**2+Math.cos(p.lat*toRad)*Math.cos(e.lat*toRad)*Math.sin((e.lon-p.lng)*toRad/2)**2;
    return {name:(ko()?e.tags['name:ko']:e.tags['name:ja'])||e.tags.name,meters:Math.round(2*R*Math.asin(Math.sqrt(a)))};
   }).sort((a,b)=>a.meters-b.meters);
   if(!results.length)throw Error('none');
   const result=results[0].name+' · '+results[0].meters.toLocaleString()+' m '+tr('（直線距離）','(직선거리)');
   stationCache.set(key,result);if(element.isConnected)element.textContent=result;
  }).catch(()=>{if(element.isConnected)element.textContent=valid(original)?original+' · '+tr('距離未確認','거리 미확인'):tr('駅・距離のデータ未確認','가까운 역·거리 정보 확인 중')}).finally(()=>clearTimeout(timer));
 }
 openDetail=function(p){
  document.getElementById('detailRoot')?.remove();
  const displayName=ko()?p.ko:p.ja;
  const address=valid(p.address)?p.address:tr('住所未確認','주소 확인 중');
  // Show the source/program NAME only in the hero card; actual URLs stay inside the Description cards.
  const refs=(p.originalReferences||window.OSHI_ORIGINAL_REFERENCES?.[p.id]||sourceRefs(p)||[]);
  const mainRef=refs.find(x=>x.kind==='content'||x.kind==='evidence');
  const sourceName=String(mainRef?.label||p.sourceName||tr('出典情報','출처 정보'))
    .replace(/\s*[·・(（]?\s*(?:URL 미확보|URL 미확인|출처 URL 미확인|原本URL未確認|원본 URL 미확인)\s*[)）]?/gi,'').trim();
  const sourceHtml=txt(sourceName||tr('出典情報','출처 정보'));
  const wrap=document.createElement('div');wrap.id='detailRoot';wrap.className='oshi-unified-overlay';
  // Background uses supplied artist photos, not an unverified venue photo.
  const photos=p.group==='TWICE'?window.OSHI_TWICE_PHOTOS:p.group==='Stray Kids'?window.OSHI_SKZ_PHOTOS:p.group==='IVE'?window.OSHI_IVE_PHOTOS:p.group==='SEVENTEEN'?window.OSHI_SEVENTEEN_PHOTOS:null;
  const keys=Array.isArray(p.members)?p.members:[];
  const firstMember=keys.find(k=>k&&k!=='ALL'&&photos?.[k]) || ((p.member&&photos?.[p.member])?p.member:null);
  const venueRecord=p.group==='TWICE'?window.OSHI_TWICE_PLACE_PHOTOS?.[p.id]:(p.group==='Stray Kids'?window.OSHI_SKZ_PLACE_PHOTOS?.[p.id]:(p.group==='SEVENTEEN'?window.OSHI_SEVENTEEN_PLACE_PHOTOS?.[p.id]:(p.group==='IVE'?window.OSHI_IVE_PLACE_PHOTOS?.[p.id]:null)));
  const venuePhoto=venueRecord?.place||'';
  const artistPhoto=photos?.[firstMember]||photos?.ALL||'';
  const heroPhoto=venuePhoto||artistPhoto;
  const heroStyle=heroPhoto?' style="background-image:linear-gradient(180deg,rgba(36,25,32,.12),rgba(36,25,32,.04) 55%,rgba(36,25,32,.20)),url('+heroPhoto+')"':'';
  wrap.innerHTML='<section class="oshi-unified-dialog oshi-editorial-dialog" role="dialog" aria-modal="true" aria-labelledby="oshiUnifiedName">'
   +'<div class="oshi-editorial-hero'+(venuePhoto?' oshi-has-place-photo':'')+'"'+heroStyle+'>'
   +'<button class="oshi-editorial-back" type="button" aria-label="'+tr('戻る','돌아가기')+'">←</button>'
   +'<div class="oshi-unified-buttons"><button type="button" class="oshi-unified-iconbutton oshi-unified-heart" title="'+tr('お気に入り','즐겨찾기')+'" aria-label="'+tr('お気に入り','즐겨찾기')+'"></button><button type="button" class="oshi-unified-iconbutton oshi-unified-close" aria-label="'+tr('閉じる','닫기')+'">✕</button></div>'
   +'<div class="oshi-editorial-photo-caption">'+(venuePhoto?tr('スポット代表写真','장소 대표 사진'):(heroPhoto?tr('アーティスト写真','아티스트 사진'):tr('スポット写真を準備中','장소 사진 준비 중')))+'</div>'
   +'<div class="oshi-editorial-card">'
   +'<div class="oshi-unified-group">'+txt(p.group)+'</div>'
   +'<h2 id="oshiUnifiedName" class="oshi-unified-title">'+txt(displayName)+'</h2>'
   +'<div class="oshi-editorial-summary">'
   +'<div class="oshi-unified-summaryline">'+svg('person')+'<div>'+txt(memberLabel(p))+'</div></div>'
   +'<div class="oshi-unified-summaryline">'+svg('pin')+'<div>'+txt(address)+'</div></div>'
   +'<div class="oshi-unified-summaryline oshi-unified-source">'+svg('link')+'<div>'+sourceHtml+'</div></div>'
   +'</div></div></div>'
   +'<div class="oshi-unified-tabs" role="tablist">'+[[tr('詳細画像','상세 이미지'),'2'],[tr('説明','설명'),'0'],[tr('位置','위치'),'1']].map(([n,v],i)=>'<button type="button" class="oshi-unified-tab" data-tab="'+v+'" role="tab" aria-selected="'+(i===0)+'">'+n+'</button>').join('')+'</div>'
   +'<div class="oshi-unified-body"><section data-panel="2"><div class="oshi-unified-photos">'+(venueRecord?.proof?((venueRecord.proofs?.length?venueRecord.proofs:[venueRecord.proof]).map(img=>'<figure class="oshi-proof-figure"><img class="oshi-proof-direct" src="'+img+'" alt="'+txt(displayName)+' · '+tr('関連コンテンツ資料','관련 콘텐츠 증거 사진')+'"><figcaption>'+txt((ko()?venueRecord?.proofLabelKo:venueRecord?.proofLabelJa)||tr('関連コンテンツ・訪問資料（原典との照合が必要）','관련 콘텐츠·방문 근거 사진 (원본 출처 별도 확인 필요)'))+'</figcaption></figure>').join('')):'📷 '+tr('現地写真を準備中です。','장소 사진 준비 중입니다.'))+'</div></section>'
   +'<section data-panel="0" hidden><div class="oshi-unified-details">'
   +row(tr('関連コンテンツ・出演情報','관련 콘텐츠·방문 정보'),referenceDetail(p))
   +row(tr('出典の状態','출처 확인 상태'),referenceStatus(p))
   +(valid(p.hoursKo)||valid(p.hoursJa)?row(tr('営業時間','영업시간'),txt((ko()?p.hoursKo:p.hoursJa)||p.hoursKo)):'')
   +(valid(p.offKo)||valid(p.offJa)?row(tr('定休日','휴무일'),txt((ko()?p.offKo:p.offJa)||p.offKo)):'')
   +(valid(p.phone)?row(tr('電話番号','전화번호'),txt(p.phone)):'')
   +(valid(p.fee)?row(tr('料金','요금'),txt(p.fee)):'')
   +(valid(p.notice)?row(tr('訪問時の注意','방문 주의사항'),txt(p.notice)):'')
   +'</div></section>'
   +'<section data-panel="1" hidden><div class="oshi-unified-details">'
   +row(tr('スポット住所','장소 주소'),txt(address))
   +row(tr('最寄り駅・距離','가까운 역 · 거리'),'<span id="oshiUnifiedStation">'+tr('確認中','확인 중')+'</span>')
   +(valid(p.transit)?row(tr('アクセス案内','교통 안내'),txt(p.transit)):'')
   +'</div>'+(coords(p)?'<iframe class="oshi-unified-map" loading="lazy" title="'+txt(displayName)+'" src="https://www.openstreetmap.org/export/embed.html?bbox='+(p.lng-.006)+'%2C'+(p.lat-.004)+'%2C'+(p.lng+.006)+'%2C'+(p.lat+.004)+'&layer=mapnik&marker='+p.lat+'%2C'+p.lng+'"></iframe>':'<p>'+tr('正確な位置は確認中です。','정확한 위치를 확인 중입니다.')+'</p>')+'</section>'
   +'</div></section>';
  document.body.appendChild(wrap);
  const close=()=>wrap.remove();
  const heart=wrap.querySelector('.oshi-unified-heart');
  const refresh=()=>{let saved=favorites.includes(p.id);heart.textContent=saved?'♥':'♡';heart.classList.toggle('oshi-saved',saved);heart.setAttribute('aria-pressed',String(saved));heart.setAttribute('aria-label',saved?tr('お気に入りから削除','즐겨찾기 해제'):tr('お気に入りに追加','즐겨찾기 추가'));};
  refresh();
  heart.onclick=()=>{const saved=!favorites.includes(p.id);favorites=saved?[...favorites,p.id]:favorites.filter(id=>id!==p.id);save();refresh();bounce(heart);toast(saved);renderSpots();};
  wrap.querySelector('.oshi-unified-close').onclick=close;
  wrap.querySelector('.oshi-editorial-back').onclick=close;
  wrap.addEventListener('click',e=>{if(e.target===wrap)close()});
  let stationStarted=false;
  wrap.querySelectorAll('[data-tab]').forEach(button=>button.onclick=()=>{
   wrap.querySelectorAll('[data-tab]').forEach(x=>x.setAttribute('aria-selected',String(x===button)));
   wrap.querySelectorAll('[data-panel]').forEach(x=>x.hidden=x.dataset.panel!==button.dataset.tab);
   if(button.dataset.tab==='1'&&!stationStarted){stationStarted=true;station(p,wrap.querySelector('#oshiUnifiedStation'))}
  });
  const onKey=e=>{if(e.key==='Escape'&&wrap.isConnected){close();document.removeEventListener('keydown',onKey)}};
  document.addEventListener('keydown',onKey);
  wrap.querySelector('.oshi-unified-close').focus();
 };
})();
renderSpots=function(){origRenderSpots();const note=$('spots').querySelector('[data-x="demoNotice"]');if(note){note.textContent=selectedGroup==='TWICE'?(yes()?'調査表に基づくTWICE関連候補10件。出典・営業時間・正確な位置が未確認の場所は明示し、未確認地点にピンは表示していません。訪問前に必ず再確認してください。':'조사표 기반 TWICE 관련 후보 10곳입니다. 출처·영업정보·정확한 좌표가 확인되지 않은 장소는 따로 표시하고 임의로 지도에 마커를 찍지 않았습니다. 방문 전 꼭 재확인하세요.'):(['IVE','SEVENTEEN'].includes(selectedGroup)?(yes()?'このアーティストの聖地情報は準備中です。写真と訪問情報を確認後に登録します。':'이 그룹의 성지 정보는 준비 중입니다. 사진과 방문 근거를 확인한 후 등록할 예정입니다.'):d().demoNotice);}const list=$('spotList');list.querySelectorAll('.spot-card').forEach((card,i)=>{const p=filteredPlaces()[i];if(!p)return;const label=document.createElement('div');label.className='spot-kicker';label.innerHTML=`<span class="chip-status ${p.status==='check'?'uncertain':''}">${statusText(p)}</span><span class="chip-status ${!p.verified?'uncertain':''}">${p.verified?translatePair('出典確認済','출처 확인'):translatePair('出典未確認','출처 미확인')}</span>`;card.insertBefore(label,card.querySelector('.spot-meta'));const last=document.createElement('div');last.className='spot-meta';last.textContent=translatePair('最終確認：','마지막 확인: ')+(p.verifiedDate||translatePair('未確認','미확인'))+' · '+translatePair('訪問前に要確認','방문 전 확인 필요');card.appendChild(last);let detail=document.createElement('button');detail.className='soft-button';detail.textContent=translatePair('詳細を見る','상세 보기');detail.onclick=()=>openDetail(p);card.querySelector('.spot-actions').prepend(detail);const saveBtn=card.querySelector('.save-spot');saveBtn.onclick=()=>{favorites=favorites.includes(p.id)?favorites.filter(id=>id!==p.id):[...favorites,p.id];save();renderSpots()};const source=card.querySelector('.source-link');source.textContent=p.source?translatePair('↗ 出典を見る','↗ 출처 보기'):translatePair('出典確認が必要','출처 확인 필요');if(!p.source){source.removeAttribute('href');source.setAttribute('aria-disabled','true');source.classList.add('unverified-link');}if(!Number.isFinite(p.lat)||!Number.isFinite(p.lng)){const go=card.querySelector('.locate-spot');if(go){go.disabled=true;go.title=translatePair('位置確認後に地図表示','좌표 확인 후 지도 표시');}const flag=document.createElement('div');flag.className='coord-warning';flag.textContent=translatePair('📍 正確な位置は確認中です。地図ピンは表示しません。','📍 정확한 좌표를 확인 중입니다. 지도 마커는 표시하지 않습니다.');card.appendChild(flag)}card.querySelector('.spot-title').style.cursor='pointer';card.querySelector('.spot-title').onclick=()=>openDetail(p)});
};
const oldUpdateMap=updateMap;
updateMap=function(places){oldUpdateMap(places)};
$('categoryFilter').onchange=()=>renderSpots();$('verifiedOnly').onchange=()=>renderSpots();$('manualArea').onchange=e=>{const a=AREAS[e.target.value];if(!a)return;manualArea=e.target.value;userPosition={lat:a[0],lng:a[1]};updateGeoUi(translatePair('選択エリアの近くから表示しています（GPSではありません）。','선택 지역 근처 순으로 표시합니다(GPS 위치 아님).'));renderSpots()};
function navArea(){const val=$('originSelect').value;if(val==='current')return userPosition;const a=AREAS[val];return a?{lat:a[0],lng:a[1]}:null}
function timeStr(min){return String(Math.floor(min/60)%24).padStart(2,'0')+':'+String(Math.floor(min%60)).padStart(2,'0')}
function localDay(){const d=new Date();return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`}
$('travelDate').value=localDay();
renderFavorites=function(){origRenderFavorites();$('favoriteList').querySelectorAll('.fav-item').forEach((item,i)=>{const p=demoPlaces.find(x=>x.id===favorites[i]);if(!p)return;const detail=document.createElement('button');detail.className='soft-button';detail.textContent=translatePair('詳細','상세');detail.onclick=()=>openDetail(p);item.appendChild(detail);const st=document.createElement('span');st.className='chip-status';st.textContent=statusText(p);item.querySelector('.fav-main').appendChild(st)});if(!favorites.length){let b=document.createElement('button');b.className='pink-button';b.textContent=translatePair('聖地マップへ戻る','성지 지도로 돌아가기');b.onclick=()=>showPage('spots');$('favoriteList').appendChild(b)}};
renderCourseChoices=function(){origRenderCourseChoices();if(route.length){courseChosen=new Set(route.filter(id=>favorites.includes(id)));$('courseSelectList').querySelectorAll('.choose-box').forEach((b,i)=>{const p=demoPlaces.find(x=>x.id===favorites[i]);if(p)b.checked=courseChosen.has(p.id)})}};
function courseCompute(){const candidate=favorites.filter(id=>courseChosen.has(id)).map(id=>demoPlaces.find(p=>p.id===id)).filter(Boolean);const start=$('travelTime').value||'10:00',duration=Number($('durationSelect').value)||480,mode=$('travelMode').value;let pos=navArea()||{lat:37.5665,lng:126.978};const ordered=[];let remaining=[...candidate];if(route.length&&route.every(id=>candidate.some(p=>p.id===id))){remaining=route.map(id=>candidate.find(p=>p.id===id)).filter(Boolean);for(const p of candidate)if(!remaining.includes(p))remaining.push(p)}else{const result=[];while(remaining.length){remaining.sort((a,b)=>(Number.isFinite(a.lat)&&Number.isFinite(a.lng)?haversine(pos,a):Infinity)-(Number.isFinite(b.lat)&&Number.isFinite(b.lng)?haversine(pos,b):Infinity));const p=remaining.shift();result.push(p);if(Number.isFinite(p.lat)&&Number.isFinite(p.lng))pos=p}remaining=result}let minute=Number(start.split(':')[0])*60+Number(start.split(':')[1]);const limit=minute+duration;const entries=[],errors=[],day=new Date(($('travelDate').value||localDay())+'T12:00:00').getDay();pos=navArea()||{lat:37.5665,lng:126.978};for(const p of remaining){if(!Number.isFinite(p.lat)||!Number.isFinite(p.lng)){errors.push([p,translatePair('正確な位置が未確認のため経路計算から除外','정확한 좌표 미확인으로 경로 계산에서 제외')]);continue}if(p.status==='closed'||p.status==='regular_closed'||p.status==='temporary_closed'||(p.closedWeekdays||[]).includes(day)){errors.push([p,translatePair('閉業・休業','폐업·휴무')]);continue}const km=haversine(pos,p); // This is a rough planning buffer, NEVER a public transit ETA.
const buffer=entries.length===0?0:(mode==='walk'?Math.ceil(km/3.5*60):Math.ceil(km/9*60));const eta=minute+buffer,stay=p.visitMinutes||35;if(p.opening&&(eta/60<p.opening[0]||(eta+stay)/60>p.opening[1])){errors.push([p,translatePair('登録営業時間外の可能性','등록 영업시간 외 가능성')]);continue}if(eta+stay>limit){errors.push([p,translatePair('設定した旅行時間を超過','설정한 여행 시간 초과')]);continue}entries.push({p,arrival:timeStr(eta),stay,km:km.toFixed(1),buffer});minute=eta+stay;pos=p}return {entries,errors}}
function paintCourse(){const out=$('courseResult');out.replaceChildren();if(!courseChosen.size){out.textContent=translatePair('訪問する場所を1つ以上選んでください。','방문할 장소를 1곳 이상 선택해 주세요.');return}const data=courseCompute();routeEntries=data.entries;excluded=data.errors;route=data.entries.map(x=>x.p.id);const header=document.createElement('h3');header.textContent=translatePair('おすすめの訪問順','추천 방문 순서')+` · ${data.entries.length}`;out.appendChild(header);const info=document.createElement('div');info.className='course-warning';info.textContent=translatePair('到着時刻は直線距離から置いた仮の移動余裕時間に基づく目安です。実際の徒歩・公共交通ルートや所要時間ではありません。営業時間は最終確認日をご確認ください。','도착시각은 직선거리 기반의 임시 이동 여유시간을 이용한 계획 참고치입니다. 실제 도보·대중교통 경로나 이동시간이 아니며 영업정보를 다시 확인해야 합니다.');out.appendChild(info);const list=document.createElement('div');list.className='course-list';for(const [i,x] of data.entries.entries()){const p=x.p;const el=document.createElement('article');el.className='course-item';el.innerHTML=`<span class="course-number">${i+1}</span><div class="course-main"><b>${safeText(yes()?p.ja:p.ko)}</b><small>${x.arrival} · ${x.stay} min · ${statusText(p)} ${!p.verified?'⚠':''}</small><small>${safeText(p.address)}</small></div><div class="course-controls"><button title="up" ${i===0?'disabled':''}>↑</button><button title="down" ${i===data.entries.length-1?'disabled':''}>↓</button><button title="delete">✕</button></div>`;let [up,down,del]=el.querySelectorAll('.course-controls button');up.onclick=()=>reorder(i,-1);down.onclick=()=>reorder(i,1);del.onclick=()=>{courseChosen.delete(p.id);route=route.filter(id=>id!==p.id);renderCourseChoices();paintCourse()};list.appendChild(el)}out.appendChild(list);if(data.errors.length){const e=document.createElement('div');e.className='course-warning';e.innerHTML='<b>'+translatePair('除外された場所','제외된 장소')+'</b><br>'+data.errors.map(([p,reason])=>safeText(yes()?p.ja:p.ko)+' — '+safeText(reason)).join('<br>');out.appendChild(e)}if(data.entries.length){const links=document.createElement('div');links.className='place-actions';const last=data.entries.at(-1).p;links.innerHTML=`<a class="nav-link-out" href="https://map.naver.com/p/search/${encodeURIComponent(last.ko+' '+last.address)}" target="_blank" rel="noopener noreferrer">↗ NAVER MAP</a><a class="nav-link-out" href="https://map.kakao.com/link/search/${encodeURIComponent(last.ko)}" target="_blank" rel="noopener noreferrer">↗ KAKAO MAP</a>`;out.appendChild(links);const mapEl=document.createElement('div');mapEl.id='courseRouteMap';mapEl.className='course-route-map';out.appendChild(mapEl);if(routeMap){routeMap.remove();routeMap=null}if(window.L){setTimeout(()=>{if(!$('courseRouteMap'))return;try{routeMap=L.map(mapEl,{scrollWheelZoom:false});L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{attribution:'&copy; OpenStreetMap contributors'}).addTo(routeMap);const points=data.entries.map(x=>[x.p.lat,x.p.lng]);points.forEach((pt,i)=>L.marker(pt).addTo(routeMap).bindPopup((i+1)+'. '+(yes()?data.entries[i].p.ja:data.entries[i].p.ko)));if(points.length>1){L.polyline(points,{color:'#bb778e',dashArray:'5 8'}).addTo(routeMap);routeMap.fitBounds(points,{padding:[25,25]})}else routeMap.setView(points[0],13)}catch(e){mapEl.textContent=translatePair('地図を表示できません','지도를 표시할 수 없습니다')}},50)}else{mapEl.textContent=translatePair('地図を読み込めません。場所一覧をご確認ください。','지도를 불러올 수 없습니다. 장소 목록을 확인하세요.')}}}

 /* STEP 05 itinerary improvements: reuse the same category icons as STEP 03;
    provide verified external directions, never invent station/transfer routes. */
 const oshiCourseIcon=p=>{
   const name=String((p.ko||p.nameKo||'')+' '+(p.ja||'')).toLowerCase();
   if(/롯데월드|ロッテワールド/.test(name))return '🎡';
   if(/jyp|사옥|本社|事務所/.test(name))return '🏢';
   if(/떡볶이|トッポッキ/.test(name))return '🍢';
   if(/족발|豚足/.test(name))return '🍖';
   if(/칼국수|손칼국수|보쌈/.test(name))return '🍜';
   if(/육몽/.test(name))return '🥩';
   if(/벚꽃|桜/.test(name))return '🌸';
   if(/뮤지엄|ミュージアム|museum/.test(name))return '🎨';
   if(/용마랜드|龍馬ランド/.test(name))return '🎠';
   if(p.category==='cafe')return '☕';
   if(p.category==='restaurant')return '🍽️';
   if(p.category==='filming')return '🎬';
   return '📍';
 };
 const oshiRouteEsc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const oshiRouteCoords=p=>p&&Number.isFinite(p.lat)&&Number.isFinite(p.lng);
 const oshiRouteMapsUrl=(a,b,mode)=>{
   const query=new URLSearchParams({api:'1',origin:`${a.lat},${a.lng}`,destination:`${b.lat},${b.lng}`,travelmode:mode==='walk'?'walking':'transit'});
   return 'https://www.google.com/maps/dir/?'+query.toString();
 };
 const oshiRouteMode=()=> $('travelMode').value;
 function oshiLeg(from,to,index,buffer,km,isStart){
   const isWalk=oshiRouteMode()==='walk';
   const a=from||null,b=to;
   const section=document.createElement('section');section.className='oshi-route-leg';
   const direction= isStart?translatePair('出発地点 → 1番目のスポット','출발 위치 → 첫 번째 장소'):
     translatePair(`${index}番目 → ${index+1}番目のスポット`,`${index}번째 → ${index+1}번째 장소`);
   const heading=document.createElement('div');heading.className='oshi-leg-heading';
   const icon=document.createElement('span');icon.className='oshi-leg-mode';icon.textContent=isWalk?'🚶':'🚇';
   const text=document.createElement('div');const bTitle=document.createElement('b');bTitle.textContent=direction;
   const description=document.createElement('small');description.textContent=isWalk?translatePair('徒歩の経路を確認','도보 경로 확인'):translatePair('公共交通の経路・乗換を確認','대중교통 노선·환승 확인');text.append(bTitle,description);heading.append(icon,text);
   const details=document.createElement('p');details.className='oshi-leg-details';
   const distanceLabel=Number.isFinite(km)?`${km.toFixed(1)} km`:translatePair('距離未確認','거리 미확인');
   details.textContent=isStart?translatePair(`直線距離 ${distanceLabel} · 出発地点からの移動時間は到着予定に未反映`,`직선거리 ${distanceLabel} · 출발지에서 첫 장소까지 이동시간은 도착 예정 시각에 미반영`):translatePair(`直線距離 ${distanceLabel} · 計画用の移動余裕 ${buffer}分（実際の所要時間ではありません）`,`직선거리 ${distanceLabel} · 계획용 이동 여유 ${buffer}분 (실제 이동시간 아님)`);
   section.append(heading,details);
   if(a&&oshiRouteCoords(a)&&oshiRouteCoords(b)){
     const link=document.createElement('a');link.className='oshi-leg-link';link.target='_blank';link.rel='noopener noreferrer';link.href=oshiRouteMapsUrl(a,b,oshiRouteMode());
     link.textContent=isWalk?translatePair('↗ 徒歩ルートを見る','↗ 실제 도보 길찾기'):translatePair('↗ 路線・乗換を調べる','↗ 대중교통 노선·환승 확인');
     section.appendChild(link);
   }else{
     const warning=document.createElement('small');warning.textContent=translatePair('出発位置が未取得のため、出発地点からの案内は省略しました。','출발 좌표가 없어 첫 구간의 길찾기를 표시하지 않았어요.');section.appendChild(warning);
   }
   return section;
 }
 paintCourse=function(){
   const out=$('courseResult');out.replaceChildren();
   if(!courseChosen.size){out.textContent=translatePair('訪問する場所を1つ以上選んでください。','방문할 장소를 1곳 이상 선택해 주세요.');return}
   const data=courseCompute();routeEntries=data.entries;excluded=data.errors;route=data.entries.map(x=>x.p.id);
   const header=document.createElement('h3');header.textContent=translatePair('おすすめの訪問順','추천 방문 순서')+` · ${data.entries.length}`;out.appendChild(header);
   const info=document.createElement('div');info.className='course-warning';
   info.textContent=translatePair('📌 訪問順・到着時刻は直線距離と仮の移動余裕で計算したプランです。実際の徒歩ルート・地下鉄・乗換・交通所要時間は、各区間の「経路を見る」から地図でご確認ください。','📌 방문 순서·도착 시각은 직선거리와 임시 이동 여유로 계산한 계획입니다. 실제 도보 경로·지하철 노선·환승·소요시간은 구간별 길찾기에서 확인해 주세요.');
   out.appendChild(info);
   const list=document.createElement('div');list.className='course-list oshi-improved-course';
   const baseOrigin=navArea();
   for(const [i,x] of data.entries.entries()){
     const p=x.p;
     if(i===0&&baseOrigin)list.appendChild(oshiLeg(baseOrigin,p,0,0,haversine(baseOrigin,p),true));
     if(i>0){const before=data.entries[i-1].p;list.appendChild(oshiLeg(before,p,i,x.buffer,haversine(before,p),false));}
     const el=document.createElement('article');el.className='course-item oshi-course-spot';
     const pin=document.createElement('span');pin.className='oshi-course-pin';const pinEmoji=document.createElement('span');pinEmoji.className='oshi-course-pin-emoji';pinEmoji.textContent=oshiCourseIcon(p);pin.appendChild(pinEmoji);pin.setAttribute('role','img');pin.setAttribute('aria-label',translatePair('スポットアイコン','장소 아이콘'));
     const number=document.createElement('span');number.className='oshi-course-sequence';number.textContent=String(i+1).padStart(2,'0');
     const main=document.createElement('div');main.className='course-main';
     const title=document.createElement('b');title.className='oshi-course-spot-name';title.textContent=yes()?(p.ja||p.nameJa||p.ko):(p.ko||p.nameKo||p.ja);
     const time=document.createElement('small');time.textContent=`${x.arrival} · ${x.stay} ${translatePair('分滞在（予定）','분 체류(예정)')} · ${statusText(p)} ${!p.verified?'⚠':''}`;
     const address=document.createElement('small');address.className='oshi-course-address';address.textContent=p.address||translatePair('住所未確認','주소 미확인');main.append(title,time,address);
     const controls=document.createElement('div');controls.className='course-controls';
     const up=document.createElement('button');up.type='button';up.textContent='↑';up.title=translatePair('上に移動','위로 이동');up.disabled=i===0;up.onclick=()=>reorder(i,-1);
     const down=document.createElement('button');down.type='button';down.textContent='↓';down.title=translatePair('下に移動','아래로 이동');down.disabled=i===data.entries.length-1;down.onclick=()=>reorder(i,1);
     const del=document.createElement('button');del.type='button';del.textContent='✕';del.title=translatePair('コースから削除','코스에서 삭제');del.onclick=()=>{courseChosen.delete(p.id);route=route.filter(id=>id!==p.id);renderCourseChoices();paintCourse()};
     controls.append(up,down,del);el.append(pin,number,main,controls);list.appendChild(el);
     if(i===0&&!baseOrigin){const note=document.createElement('small');note.className='oshi-no-origin';note.textContent=translatePair('出発地点の位置が未取得のため、最初の区間は案内していません。','출발 위치 좌표가 없어 첫 구간 길찾기는 표시하지 않았어요.');list.appendChild(note)}
   }
   out.appendChild(list);
   if(data.errors.length){const e=document.createElement('div');e.className='course-warning';const b=document.createElement('b');b.textContent=translatePair('除外された場所','제외된 장소');e.appendChild(b);for(const [p,reason] of data.errors){const msg=document.createElement('div');msg.textContent=(yes()?p.ja:p.ko)+' — '+reason;e.appendChild(msg)}out.appendChild(e)}
   if(!data.entries.length)return;
   const links=document.createElement('div');links.className='place-actions';
   const last=data.entries.at(-1).p;
   const naver=document.createElement('a');naver.className='nav-link-out';naver.href='https://map.naver.com/p/search/'+encodeURIComponent((last.ko||last.nameKo||'')+' '+(last.address||''));naver.target='_blank';naver.rel='noopener noreferrer';naver.textContent='↗ NAVER MAP';
   const kakao=document.createElement('a');kakao.className='nav-link-out';kakao.href='https://map.kakao.com/link/search/'+encodeURIComponent(last.ko||last.nameKo||'');kakao.target='_blank';kakao.rel='noopener noreferrer';kakao.textContent='↗ KAKAO MAP';links.append(naver,kakao);out.appendChild(links);
   const caption=document.createElement('p');caption.className='oshi-course-map-caption';caption.textContent=translatePair('地図の点線は訪問順を示す直線です。道路・鉄道のルートではありません。','지도 점선은 방문 순서만 보여주는 직선으로, 실제 도로나 철도 경로가 아닙니다.');out.appendChild(caption);
   if(routeMap){try{routeMap.remove()}catch(e){}routeMap=null}
   const mapEl=document.createElement('div');mapEl.id='courseRouteMap';mapEl.className='course-route-map';out.appendChild(mapEl);
   if(window.L){setTimeout(()=>{if(!$('courseRouteMap')||mapEl!==$('courseRouteMap'))return;try{
     routeMap=L.map(mapEl,{scrollWheelZoom:false});L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{attribution:'&copy; OpenStreetMap contributors',maxZoom:19}).addTo(routeMap);
     const points=data.entries.map(x=>[x.p.lat,x.p.lng]);
     points.forEach((pt,i)=>{const p=data.entries[i].p;const emoji=oshiCourseIcon(p);const marker=L.divIcon({className:'oshi-map-marker',html:'<div class="oshi-map-pin"><span>'+emoji+'</span></div>',iconSize:[42,42],iconAnchor:[17,42],popupAnchor:[4,-36]});L.marker(pt,{icon:marker}).addTo(routeMap).bindPopup(`${i+1}. ${oshiRouteEsc(yes()?(p.ja||p.nameJa||p.ko):(p.ko||p.nameKo||p.ja))}`)});
     if(points.length>1){L.polyline(points,{color:'#bb778e',dashArray:'5 8',weight:4}).addTo(routeMap);routeMap.fitBounds(points,{padding:[35,35]})}else routeMap.setView(points[0],13);
     routeMap.invalidateSize();
   }catch(e){mapEl.textContent=translatePair('地図を表示できません。上の訪問順と経路リンクをご利用ください。','지도를 표시할 수 없어요. 위의 방문 순서와 길찾기 링크를 이용해 주세요.')}},50)}
   else{mapEl.className='course-route-map oshi-course-map-fallback';mapEl.replaceChildren();const note=document.createElement('p');note.textContent=translatePair('地図を読み込めません。訪問順と区間別の経路リンクは利用できます。','지도를 불러올 수 없지만 방문 순서와 구간별 길찾기는 사용할 수 있어요.');mapEl.appendChild(note);data.entries.forEach((x,i)=>{const b=document.createElement('div');b.textContent=`${i+1}. ${oshiCourseIcon(x.p)} ${yes()?x.p.ja:x.p.ko}`;mapEl.appendChild(b)})}
 };
function reorder(i,dir){const j=i+dir;if(j<0||j>=route.length)return;[route[i],route[j]]=[route[j],route[i]];paintCourse()}
makeCourse=function(){route=[];paintCourse()}; // First recommendation is nearest-neighbor; subsequent arrows preserve manual order.
$('createCourse').removeEventListener('click',origMakeCourse);$('createCourse').addEventListener('click',()=>{route=[];paintCourse()});$('spotSearch').addEventListener('input',()=>renderSpots());
for(const id of ['originSelect','travelDate','travelTime','durationSelect','travelMode'])$(id).addEventListener('change',()=>{if($('courseResult').children.length)paintCourse()});
const oldTranslateAndRender=translate;
translate=function(){oldTranslateAndRender();$('categoryLabel').textContent=translatePair('カテゴリー','카테고리');$('verifiedLabel').textContent=translatePair('出典確認済のみ','출처 확인된 장소만');$('manualLabel').textContent=translatePair('位置情報を使わない場合：','현재 위치를 이용하지 않을 경우:');$('configTitle').textContent=translatePair('旅の条件を選択','여행 조건 선택');$('originLabel').textContent=translatePair('出発地点','출발 위치');$('dateLabel').textContent=translatePair('旅行日','여행 날짜');$('startLabel').textContent=translatePair('開始時間','시작 시간');$('durationLabel').textContent=translatePair('旅行時間','여행 가능 시간');$('travelModeLabel').textContent=translatePair('移動方法','이동 방식');$('timeDisclaimer').textContent=translatePair('※ 移動時間は実際の地図ルートから計算した交通時間ではありません。','※ 실제 지도 경로에서 계산한 교통시간이 아닌 계획용 여유시간입니다.');updateGender();if(currentPage==='spots')renderSpots();if(currentPage==='favorites')renderFavorites();if(currentPage==='course')renderCourseChoices()};
// Existing translation event was bound before enhancements; add second update listener.
$('langSwitch').addEventListener('click',()=>setTimeout(()=>translate(),0));
// An extra keyboard exit for the detail dialog.
document.addEventListener('keydown',e=>{if(e.key==='Escape')$('detailRoot')?.remove()});
// Safeguard: using unconfirmed sources must never receive verified labels.
window.OSHI_STEP03_OPEN_DETAIL=(place)=>openDetail(place);
translate();
})();

