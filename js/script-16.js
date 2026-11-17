
(function(){
 'use strict';
 const select=document.getElementById('manualArea');
 if(!select||typeof filteredPlaces!=='function')return;
 const districtNames=['강남구','강동구','강북구','강서구','관악구','광진구','구로구','금천구','노원구','도봉구','동대문구','동작구','마포구','서대문구','서초구','성동구','성북구','송파구','양천구','영등포구','용산구','은평구','종로구','중구','중랑구'];
 const jpNames={'강남구':'江南区','강동구':'江東区','강북구':'江北区','강서구':'江西区','관악구':'冠岳区','광진구':'広津区','구로구':'九老区','금천구':'衿川区','노원구':'蘆原区','도봉구':'道峰区','동대문구':'東大門区','동작구':'銅雀区','마포구':'麻浦区','서대문구':'西大門区','서초구':'瑞草区','성동구':'城東区','성북구':'城北区','송파구':'松坡区','양천구':'陽川区','영등포구':'永登浦区','용산구':'龍山区','은평구':'恩平区','종로구':'鍾路区','중구':'中区','중랑구':'中浪区'};
 const neighborhoods=[
  {value:'hood:hongdae',ko:'홍대',ja:'弘大',district:'마포구',test:p=>/홍대|弘大/i.test([p.ko,p.ja,p.address].join(' '))||p.id==='tw_yukmong_hongdae'},
  {value:'hood:apgujeong',ko:'압구정',ja:'狎鴎亭',district:'강남구',test:p=>/압구정|狎鴎亭/i.test([p.ko,p.ja,p.address].join(' '))},
  {value:'hood:myeongdong',ko:'명동',ja:'明洞',district:'중구',test:p=>/명동|明洞/i.test([p.ko,p.ja,p.address].join(' '))},
  {value:'hood:seongsu',ko:'성수',ja:'聖水',district:'성동구',test:p=>/성수|聖水/i.test([p.ko,p.ja,p.address].join(' '))},
  {value:'hood:jamsil',ko:'잠실',ja:'蚕室',district:'송파구',test:p=>/잠실|蚕室|롯데월드|ロッテワールド/i.test([p.ko,p.ja,p.address].join(' '))},
  {value:'hood:yeouido',ko:'여의도',ja:'汝矣島',district:'영등포구',test:p=>/여의도|汝矣島/i.test([p.ko,p.ja,p.address].join(' '))},
  {value:'hood:yangjae',ko:'양재천',ja:'良才川',district:'강남구',test:p=>/양재천|良才川/i.test([p.ko,p.ja,p.address].join(' '))}
 ];
 const overrideDistrict={'tw_jyp':'강동구','tw_lotteworld':'송파구','tw_seogang':'강남구','tw_yangjae':'강남구','tw_colorpool':'종로구','tw_changsin':'종로구','tw_kimkyeongja':'성동구','tw_yongma':'중랑구','tw_yukmong_yongsan':'용산구','tw_yukmong_hongdae':'마포구'};
 let chosen='';
 function korean(){return document.documentElement.lang.toLowerCase().startsWith('ko')}
 function regionOf(p){
  if(overrideDistrict[p.id])return overrideDistrict[p.id];
  const addr=String(p.address||'');
  const addrDistrict=addr.match(/(?:서울(?:특별시)?\s*)?([가-힣]{1,5}구)(?=\s|$)/);
  if(addrDistrict&&districtNames.includes(addrDistrict[1]))return addrDistrict[1];
  const area=String(p.areaKo||'').trim();
  if(districtNames.includes(area))return area;
  if(districtNames.includes(area+'구'))return area+'구';
  const areaJP=String(p.areaJa||'');
  return districtNames.find(d=>jpNames[d]===areaJP)||'';
 }
 // Apply to the actual data so every card displays consistent district names.
 if(Array.isArray(demoPlaces))demoPlaces.forEach(p=>{const district=regionOf(p);if(district){p.areaKo=district;p.areaJa=jpNames[district]||p.areaJa}});
 function renderOptions(){
  const was=chosen;
  select.replaceChildren();
  const option=(parent,value,label)=>{let o=document.createElement('option');o.value=value;o.textContent=label;parent.appendChild(o)};
  option(select,'',korean()?'서울 전체':'ソウル全域');
  const hoods=document.createElement('optgroup');hoods.label=korean()?'주요 지역':'主なエリア';
  neighborhoods.forEach(h=>option(hoods,h.value,korean()?h.ko:h.ja));
  select.appendChild(hoods);
  const districts=document.createElement('optgroup');districts.label=korean()?'서울 25개 구':'ソウル25区';
  districtNames.forEach(d=>option(districts,'gu:'+d,korean()?d:jpNames[d]));
  select.appendChild(districts);
  select.value=was;
  if(select.value!==was){chosen='';select.value=''}
 }
 const previousFiltered=filteredPlaces;
 filteredPlaces=function(){
  const places=previousFiltered();
  if(!chosen)return places;
  if(chosen.startsWith('gu:')){
   const selectedDistrict=chosen.slice(3);
   return places.filter(p=>regionOf(p)===selectedDistrict);
  }
  const h=neighborhoods.find(x=>x.value===chosen);
  return h?places.filter(p=>regionOf(p)===h.district&&h.test(p)):places;
 };
 // Remove the original manual-area change callback: it assigned a faux GPS position.
 // Explicit selection of a region must not modify actual geolocation.
 select.onchange=null;
 select.addEventListener('change',()=>{
  chosen=select.value;
  if(typeof userPosition!=='undefined')userPosition=null;
  if(typeof nearbyRequested!=='undefined')nearbyRequested=false;
  if(typeof updateGeoUi==='function')updateGeoUi(korean()?'선택한 지역에 속한 장소만 표시합니다.':'選択したエリアのスポットのみ表示します。');
  if(typeof renderSpots==='function')renderSpots();
 });
 const oldTranslate=translate;
 translate=function(){const ret=oldTranslate.apply(this,arguments);renderOptions();if(typeof renderSpots==='function'&&typeof currentPage!=='undefined'&&currentPage==='spots')renderSpots();return ret};
 // Translation calls may rebuild the select. Reinstall options after they finish.
 renderOptions();
 // The existing late-stage card rendering uses filteredPlaces; map shares same array.
 // Show the empty-state note when nothing matches the selected area.
 const priorRenderSpots=renderSpots;
 renderSpots=function(){
  priorRenderSpots();
  const list=document.getElementById('spotList');
  if(!list||list.querySelector('.spot-card')||!chosen)return;
  const empty=document.createElement('div');empty.className='flow-empty';
  empty.style.cssText='padding:26px 20px;border:1px solid #eed5d9;border-radius:18px;background:white;color:#795d68;line-height:1.7';
  empty.textContent=korean()?'선택한 지역에는 현재 등록된 성지가 없어요. 다른 지역이나 서울 전체를 선택해 주세요.':'このエリアには登録済みのスポットがありません。他のエリアかソウル全域を選んでください。';
  list.appendChild(empty);
 };
 // UI group switches start with all locations to prevent a stale area from hiding a new group's cards.
 document.querySelectorAll('.group[data-name]').forEach(b=>b.addEventListener('click',()=>{
  chosen='';select.value='';
 }));
})();
