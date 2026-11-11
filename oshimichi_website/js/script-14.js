
/* Stable TWICE map sync: all supplied point coordinates are kept in OSHI_PLACES.
   Resolve Kim's address on demand, and offer an in-map fallback without a false pin. */
(function(){
 const MAP_ID='tw_kimkyeongja';
 const isKo=()=>language==='ko';
 const getKim=()=>demoPlaces.find(p=>p.id===MAP_ID);
 const box=document.getElementById('mapBox');
 if(!box)return;
 const control=document.createElement('button');
 control.type='button';control.className='oshi-kim-location-control';control.hidden=true;
 control.setAttribute('aria-label','김경자원조손칼국수보쌈 지도 표시');
 box.appendChild(control);
 function syncButton(){
  const p=getKim();
  const visible=selectedGroup==='TWICE'&&selectedMembers?.has('ALL')&&
    filteredPlaces().some(x=>x.id===MAP_ID)&&p&&!Number.isFinite(p.lat);
  control.hidden=!visible;
  if(visible)control.innerHTML='<span>🍜</span><span>'+(isKo()?'김경자원조손칼국수보쌈':'キムギョンジャ元祖手打ちカルグクス')+
    '<small>'+(isKo()?'주소 확인 · 정확한 지도 좌표 확인 중 · 눌러서 이 지도에서 주소 검색':'住所確認済み · 座標確認中 · ここを押して地図検索')+'</small></span>';
 }
 // This is explicitly an in-map address link; it is NOT a guessed geographic pin.
 control.addEventListener('click',()=>{
  const cards=[...document.querySelectorAll('#spotList .spot-card')];
  const index=filteredPlaces().findIndex(p=>p.id===MAP_ID);
  const button=cards[index]?.querySelector('.locate-spot');
  if(button)button.click();
 });
 const originalRender=renderSpots;
 renderSpots=function(){originalRender();syncButton()};
 let requested=false;
 async function tryGeocode(){
  if(requested)return;
  requested=true;
  const p=getKim();if(!p||Number.isFinite(p.lat))return;
  const terms=[
    '서울 성동구 금호산2길 20-1',
    '서울특별시 성동구 금호동3가 394'
  ];
  for(const q of terms){
   try{
    const u='https://nominatim.openstreetmap.org/search?format=jsonv2&limit=5&countrycodes=kr&addressdetails=1&q='+encodeURIComponent(q);
    const response=await fetch(u,{headers:{Accept:'application/json'}});
    if(!response.ok)continue;
    const data=await response.json();
    const match=data.find(x=>{
     const str=(String(x.display_name||'')+' '+String(x.name||'')).replace(/\s+/g,'');
     // Exact address match only, so the position does not drift to an unrelated street.
     const house=str.includes('20-1')&&str.includes('금호');
     const parcel=str.includes('394')&&str.includes('금호동');
     return house||parcel;
    });
    if(!match)continue;
    const lat=Number(match.lat),lng=Number(match.lon);
    if(!(lat>37.4&&lat<37.65&&lng>126.85&&lng<127.2))continue;
    p.lat=lat;p.lng=lng;p.coordinateSource='nominatim-exact-address-session';
    p.coordinateStatus='address-match-geocoded';
    // These are from the address geocoder, not inferred from other stores.
    if(typeof updateMap==='function')updateMap(filteredPlaces());
    syncButton();
    return;
   }catch(e){}
  }
  syncButton();
 }
 const oldShowPage=showPage;
 showPage=function(page){
  const result=oldShowPage.apply(this,arguments);
  if(page==='spots'&&selectedGroup==='TWICE'){
   syncButton();void tryGeocode();
  }
  return result;
 };
 // The map may already be opened before this bottom script runs.
 if(document.getElementById('spots')?.classList.contains('active')){
  syncButton();void tryGeocode();
 }
})();
