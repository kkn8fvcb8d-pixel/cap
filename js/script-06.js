
/* 推し道: one-file UI localization, licensed-photo lookup, resilient OSM map. */
(()=>{
 'use strict';
 const $=id=>document.getElementById(id);
 const esc=value=>String(value??'').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
 const ja=()=>language==='ja';
 const loc=(jp,kr)=>ja()?jp:kr;
 // Add groups here as they become supported; disabled cards are not part of selectable data.
 window.OSHI_ARTISTS=Object.freeze({
  TWICE:{gender:'girls',label:'TWICE',members:memberData.TWICE.map(x=>({key:x[0],ja:x[1],ko:x[2]})),enabled:true},
  'Stray Kids':{gender:'boys',label:'Stray Kids',members:memberData['Stray Kids'].map(x=>({key:x[0],ja:x[1],ko:x[2]})),enabled:true},
  IVE:{gender:'girls',label:'IVE',members:memberData.IVE.map(x=>({key:x[0],ja:x[1],ko:x[2]})),enabled:true},
  SEVENTEEN:{gender:'boys',label:'SEVENTEEN',members:memberData.SEVENTEEN.map(x=>({key:x[0],ja:x[1],ko:x[2]})),enabled:true}
 });
 const ui={
  ja:{home:'ホームに戻る',back:'戻る',close:'閉じる',future:'今後追加予定のアーティスト',futureInfo:'現在はTWICE・Stray Kids・IVE・SEVENTEENのメンバー選択に対応しています。IVE・SEVENTEENの聖地情報は準備中です。',futureGirls:'女性グループ',futureBoys:'男性グループ',photoNote:'TWICE・Stray Kids：提供画像を使用。IVE・SEVENTEEN：写真は後日追加予定。',allAreas:'地域を選択',allCats:'すべて',filming:'撮影地',cafe:'カフェ',restaurant:'飲食店',other:'その他',choose:'選択したグループ',current:'現在地・指定地域',two:'2時間',three:'3時間',half:'半日（4時間）',day:'1日（8時間）',walk:'徒歩',transit:'公共交通',up:'順番を上へ',down:'順番を下へ',delete:'コースから削除',title:'ホームに戻る',language:'言語を切り替える',search:'場所を検索',map:'ソウル聖地マップ',mapLoading:'地図を読み込んでいます…',mapFail:'地図を表示できない場合はスポット一覧をご利用ください。',openMap:'OpenStreetMapで地図を開く',spot:'聖地の位置を示す参考地図',startCourse:'選んだ場所でコースを作る',girls:'女性アイドル',boys:'男性アイドル',notAvailable:'Coming Soon · まだ選択できません'},
  ko:{home:'홈으로 돌아가기',back:'돌아가기',close:'닫기',future:'추후 추가 예정 아티스트',futureInfo:'현재 TWICE·Stray Kids·IVE·SEVENTEEN 멤버 선택을 지원합니다. IVE·SEVENTEEN 성지 정보는 준비 중입니다.',futureGirls:'여자 그룹',futureBoys:'남자 그룹',photoNote:'TWICE·Stray Kids: 제공된 이미지 사용. IVE·SEVENTEEN: 사진 추후 추가 예정.',allAreas:'지역 선택',allCats:'전체',filming:'촬영지',cafe:'카페',restaurant:'음식점',other:'기타',choose:'선택한 그룹',current:'현재 위치·선택 지역',two:'2시간',three:'3시간',half:'반나절(4시간)',day:'하루(8시간)',walk:'도보',transit:'대중교통',up:'방문 순서 위로',down:'방문 순서 아래로',delete:'코스에서 삭제',title:'홈으로 돌아가기',language:'언어 변경',search:'장소 검색',map:'서울 성지 지도',mapLoading:'지도를 불러오는 중이에요…',mapFail:'지도가 표시되지 않으면 장소 목록을 이용해 주세요.',openMap:'OpenStreetMap에서 지도 열기',spot:'성지 위치 참고 지도',startCourse:'선택한 장소로 코스 만들기',girls:'여자 아이돌',boys:'남자 아이돌',notAvailable:'Coming Soon · 아직 선택할 수 없습니다'}
 };
 const d=()=>ui[language];
 const setOptions=(sel,labels)=>{const el=$(sel);if(!el)return;Object.entries(labels).forEach(([value,label])=>{const o=Array.from(el.options).find(o=>o.value===value);if(o)o.textContent=label})};
 function localizeTiny(){
  const subtitle=document.querySelector('.selection .sub');
  if(subtitle)subtitle.innerHTML=ja()?'まずは好きなグループを選んでね。<br>あなたの推しの足跡を探しに行こう。':'먼저 좋아하는 그룹을 선택해 주세요.<br>최애의 발자취를 찾아 서울로 떠나요.';
  const mainTitle=document.querySelector('.selection-intro h2');
  if(mainTitle)mainTitle.innerHTML=ja()?'誰と、ソウルを<span class="title-heart">♡</span><br><em>旅したい？</em>':'누구와 서울을<span class="title-heart">♡</span><br><em>여행하고 싶어?</em>';
  document.querySelectorAll('[data-group-kind]').forEach(el=>{el.textContent=el.dataset.groupKind==='girls'?(ja()?'ガールズグループ':'여자 아이돌 그룹'):(ja()?'ボーイズグループ':'남자 아이돌 그룹')});
  const prompt=document.getElementById('pickPrompt');if(prompt)prompt.textContent=ja()?'CHOOSE YOUR FAVORITE':'좋아하는 아티스트 선택';
  const selectionBack=document.querySelector('#back span');if(selectionBack)selectionBack.textContent=d().back;
  const selectionBackButton=document.getElementById('back');if(selectionBackButton){selectionBackButton.setAttribute('aria-label',d().home);selectionBackButton.setAttribute('title',d().home);}
  const selectionBottom=document.querySelector('.selection-bottom p');if(selectionBottom)selectionBottom.textContent=ja()?'推しを選ぶと、関連する聖地を探せるよ。':'좋아하는 아티스트를 선택하면 관련 성지를 찾아볼 수 있어요.';
  const filterTitle=document.getElementById('categoryLabel');if(filterTitle)filterTitle.textContent=ja()?'カテゴリー':'카테고리';
  const verifiedTitle=document.getElementById('verifiedLabel');if(verifiedTitle)verifiedTitle.textContent=ja()?'出典確認済のみ':'출처가 확인된 장소만';
  const groupInfo=document.querySelector('.twice .group-info small');if(groupInfo)groupInfo.textContent=ja()?'ガールズグループ':'여자 아이돌 그룹';
  const boyInfo=document.querySelector('.skz .group-info small');if(boyInfo)boyInfo.textContent=ja()?'ボーイズグループ':'남자 아이돌 그룹';
  if($('futureTitle'))$('futureTitle').textContent=d().future;
  if($('futureSub'))$('futureSub').textContent=d().futureInfo;
  document.querySelector('[data-future="girls"]').textContent=d().futureGirls;
  document.querySelector('[data-future="boys"]').textContent=d().futureBoys;
  $('photoNote').textContent=d().photoNote;
  $('logoHome').setAttribute('aria-label',d().home);$('logoHome').title=d().title;
  $('langSwitch').setAttribute('aria-label',d().language);
  for(const button of document.querySelectorAll('.back,.flow-back')){button.setAttribute('aria-label',d().back);const sp=button.querySelector('span');if(sp)sp.textContent=d().back;}
  setOptions('manualArea',{'':d().allAreas,hongdae:loc('弘大','홍대'),myeongdong:loc('明洞','명동'),gangnam:loc('江南','강남'),seongsu:loc('聖水','성수'),jamsil:loc('蚕室','잠실')});setOptions('categoryFilter',{all:d().allCats,filming:d().filming,cafe:d().cafe,restaurant:d().restaurant,other:d().other});
  setOptions('originSelect',{current:d().current,hongdae:loc('弘大','홍대'),myeongdong:loc('明洞','명동'),gangnam:loc('江南','강남'),seongsu:loc('聖水','성수'),jamsil:loc('蚕室','잠실')});
  setOptions('durationSelect',{120:d().two,180:d().three,240:d().half,480:d().day});setOptions('travelMode',{walk:d().walk,transit:d().transit});
  $('spotSearch').setAttribute('aria-label',d().search);
  for(const button of document.querySelectorAll('.course-controls')){
   const btns=button.querySelectorAll('button');if(btns[0])btns[0].title=btns[0].getAttribute('aria-label')=d().up;
   if(btns[1])btns[1].title=btns[1].getAttribute('aria-label')=d().down;
   if(btns[2])btns[2].title=btns[2].getAttribute('aria-label')=d().delete;
  }
  const close=document.querySelector('.detail-close');if(close)close.title=close.getAttribute('aria-label')=d().close;
  if($('mapFallbackAlt')){const status=$('mapFallbackAlt').querySelector('.alt-caption span');if(status)status.textContent=d().mapFail;const link=$('mapFallbackAlt').querySelector('.alt-caption a');if(link)link.textContent=d().openMap;}
 }
 // In existing code, translate() may be called multiple times per language switch.
 const oldTranslate=translate;
 translate=function(){oldTranslate();localizeTiny();syncMemberPhotos()};
 // Avoid copyright risk: Wikimedia Commons API results must declare a reuse-friendly license.
 const photoCache=new Map();
 // Direct links to individually identified files on Wikimedia Commons.
 // The image source page (including attribution and reuse license) is linked on each card.
 const photoFiles={
  TWICE:{
   NAYEON:'NAYEON 2023.jpg',JEONGYEON:'TWICE Jeongyeon VETERAN 2 September 2024.jpg',
   MOMO:'260618 Hirai Momo.png',SANA:'260618 Minatozaki Sana.png',
   JIHYO:'TWICE Jihyo Fred May 2024.jpg',MINA:'260618 Myoi Mina.png',
   DAHYUN:'260618 Kim Dahyun.png',CHAEYOUNG:'260618 Son Chaeyoung.png',
   TZUYU:'260618 Chou Tzuyu.png'
  },
  'Stray Kids':{
   'BANG CHAN':'Bang Chan of Stray Kids at Incheon Airport, May 3, 2024.png',
   'LEE KNOW':'20240503 Lee Know of Stray Kids.png',
   CHANGBIN:'Changbin of Stray Kids on Incheon Airport, May 3, 2024.png',
   HYUNJIN:'20240503 Hyunjin of Stray Kids.png',
   HAN:'20240503 Han of Stray Kids.png',
   FELIX:'Felix Lee of Stray Kids, July 8, 2024.png',
   SEUNGMIN:'Seungmin of Stray Kids at Incheon Airport, May 3, 2024.png',
   'I.N':'20240503 I.N of Stray Kids.png'
  }
 };

 // Uploaded TWICE images embedded in this HTML: no external image host required.
 // The nine solo images follow the order in the user's request (identity not verified from faces).
 const uploadedTwiceImages=window.OSHI_TWICE_PHOTOS;
 async function requestPhoto(group,key){
  if(group==='TWICE' && uploadedTwiceImages[key]) return {url:uploadedTwiceImages[key],source:null,license:'uploaded',author:''};
  const filename=photoFiles[group]?.[key];if(!filename)return null;
  const file=encodeURIComponent(filename).replace(/%2F/g,'/');
  return {url:'https://commons.wikimedia.org/wiki/Special:FilePath/'+file+'?width=400',
   source:'https://commons.wikimedia.org/wiki/File:'+file,license:'Commons',author:''};
 }
 function syncMemberPhotos(){const grid=$('memberGrid');if(!selectedGroup||!grid||selectedGroup==='TWICE'||selectedGroup==='IVE'||selectedGroup==='SEVENTEEN'||(selectedGroup==='Stray Kids'&&window.OSHI_SKZ_PHOTOS))return;
  grid.querySelectorAll('.member-card').forEach((card,index)=>{
   const key=index===0?'ALL':memberData[selectedGroup]?.[index-1]?.[0];if(!key)return;
   let box=card.querySelector('.member-photo');if(!box){box=document.createElement('div');box.className='member-photo';const main=Array.from(card.children).find(e=>e.querySelector('strong'));if(main)card.insertBefore(box,main);}
   if(key==='ALL' && selectedGroup!=='TWICE') {box.innerHTML='<span class="person-icon" aria-hidden="true">♡ ♡</span>';return;}
   box.innerHTML='<span class="person-icon" aria-hidden="true">✳</span>';
   const group=selectedGroup;
   requestPhoto(group,key).then(photo=>{
    if(!photo||!card.isConnected||selectedGroup!==group)return;
    const img=document.createElement('img');img.loading='lazy';img.referrerPolicy='no-referrer';img.alt=card.querySelector('strong')?.textContent||key;img.src=photo.url;
    img.onerror=()=>{img.remove();if(!box.querySelector('.person-icon')){const fallback=document.createElement('span');fallback.className='person-icon';fallback.textContent='✳';box.prepend(fallback);}};
    if(photo.source){
      const credit=document.createElement('a');credit.className='photo-license';credit.href=photo.source;credit.target='_blank';credit.rel='noopener noreferrer';credit.textContent='© Commons ↗';credit.title=(photo.author?photo.author+' · ':'')+photo.license;
      credit.addEventListener('click',e=>e.stopPropagation());box.replaceChildren(img,credit);
    }else{box.replaceChildren(img)}
   });
  });
 }
 const priorRenderMembers=renderMembers;
 renderMembers=function(){priorRenderMembers()};
 // Map fallback: always show a genuine OpenStreetMap embedded view instead of a blank box.
 const fallback=$('mapFallbackAlt');
 function initFallback(){if(!fallback||fallback.dataset.built)return;
  fallback.dataset.built='1';fallback.innerHTML=`<div class="map-alternative"><div class="alt-static" aria-hidden="true"><svg viewBox="0 0 340 240" width="100%" style="max-width:340px"><rect width="340" height="240" fill="#f5e7d8"/><path d="M0 102 Q95 50 169 115T340 115" fill="none" stroke="#c7deea" stroke-width="30"/><path d="M20 20L320 210M-20 190L300 10M150 0L90 240M290 0L180 240" stroke="white" stroke-width="14"/><g fill="#d2829b" stroke="white" stroke-width="4"><circle cx="80" cy="70" r="13"/><circle cx="205" cy="135" r="13"/><circle cx="274" cy="72" r="13"/></g><text x="135" y="74" fill="#8a5968" font-size="19" font-weight="bold">SEOUL</text></svg><span>${esc(d().spot)}</span></div><iframe title="${esc(d().map)}" loading="lazy" referrerpolicy="no-referrer" src="https://www.openstreetmap.org/export/embed.html?bbox=126.77%2C37.39%2C127.27%2C37.72&amp;layer=mapnik"></iframe><div class="alt-caption"><span>${esc(d().mapFail)}</span> <a href="https://www.openstreetmap.org/#map=11/37.55/127.01" target="_blank" rel="noopener noreferrer">${esc(d().openMap)}</a></div></div>`;
 }
 initFallback();
 let mapMonitored=false,tileLoads=0,tileFailures=0;
 const origUpdateMap=updateMap;
 function monitorTiles(){if(!map||mapMonitored)return;mapMonitored=true;
  map.eachLayer(layer=>{if(!(layer instanceof L.TileLayer))return;
   layer.on('tileload',()=>{tileLoads++;$('mapBox').classList.remove('no-map')});
   layer.on('tileerror',()=>{tileFailures++;if(tileLoads===0&&tileFailures>2)$('mapBox').classList.add('no-map')});
  });
  setTimeout(()=>{if(map&&tileLoads===0)$('mapBox').classList.add('no-map')},6500);
 }
 updateMap=function(places){origUpdateMap(places);if(map)monitorTiles();else $('mapBox').classList.add('no-map')};
 // The original detail popup may be opened in any language; update newly inserted close labels.
 document.addEventListener('click',()=>setTimeout(localizeTiny,0));
 $('langSwitch').addEventListener('click',()=>setTimeout(localizeTiny,0));
 localizeTiny();
})();
