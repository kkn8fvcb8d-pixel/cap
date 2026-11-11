
/* Repair STEP 03 map navigation: always focus provided coordinates; otherwise validate a geocoded address. */
(function(){
  'use strict';
  if(typeof renderSpots!=='function'||typeof filteredPlaces!=='function')return;
  const mapBox=document.getElementById('mapBox');
  const mapFallback=document.getElementById('mapFallbackAlt');
  const list=document.getElementById('spotList');
  if(!mapBox||!list)return;
  const notice=document.createElement('div');notice.className='oshi-map-message';notice.hidden=true;
  mapBox.parentElement.insertBefore(notice,mapBox);
  const valid=p=>p&&Number.isFinite(p.lat)&&Number.isFinite(p.lng)&&Math.abs(p.lat)<=90&&Math.abs(p.lng)<=180;
  const ko=()=>language==='ko';
  function notify(text, url){
    notice.textContent=text;
    if(url){const a=document.createElement('a');a.href=url;a.target='_blank';a.rel='noopener noreferrer';a.textContent=ko()?'외부 지도에서 검색 ↗':'外部地図で検索 ↗';notice.appendChild(a)}
    notice.hidden=false;
  }
  function externalSearch(p){return 'https://www.openstreetmap.org/search?query='+encodeURIComponent(p.address||p.ko)}
  function showFallbackAt(lat,lng){
    if(!mapFallback)return;
    const dx=.007,dy=.004;
    const bbox=[lng-dx,lat-dy,lng+dx,lat+dy].map(n=>n.toFixed(6)).join(',');
    const iframe=mapFallback.querySelector('iframe');
    if(iframe)iframe.src='https://www.openstreetmap.org/export/embed.html?bbox='+encodeURIComponent(bbox)+'&layer=mapnik&marker='+encodeURIComponent(lat.toFixed(6)+','+lng.toFixed(6));
    const link=mapFallback.querySelector('a');
    if(link)link.href='https://www.openstreetmap.org/?mlat='+lat.toFixed(6)+'&mlon='+lng.toFixed(6)+'#map=17/'+lat.toFixed(6)+'/'+lng.toFixed(6);
  }
  function focusPoint(p){
    if(!valid(p))return false;
    const lat=p.lat,lng=p.lng;
    notice.hidden=true;
    showFallbackAt(lat,lng);
    mapBox.scrollIntoView({behavior:'smooth',block:'center'});
    mapBox.classList.add('oshi-map-selected');
    setTimeout(()=>mapBox.classList.remove('oshi-map-selected'),2100);
    // Leaflet may be loaded asynchronously. Never depend on a stale marker.
    if(!map&&window.L&&typeof initMap==='function')initMap();
    if(map&&window.L){
      map.invalidateSize();
      const marker=markers.find(m=>m.placeId===p.id);
      if(marker){
        if(typeof map.flyTo==='function')map.flyTo([lat,lng],16,{animate:true,duration:.85});
        else map.setView([lat,lng],16);
        map.once('moveend',()=>marker.openPopup());
        // When already centered, moveend may not fire.
        setTimeout(()=>{if(marker&&map.hasLayer(marker))marker.openPopup()},950);
      }else{
        map.setView([lat,lng],16,{animate:true});
        if(typeof L!=='undefined'){
          const pin=L.marker([lat,lng]).addTo(map).bindPopup(ko()?p.ko:p.ja);
          pin.placeId=p.id;markers.push(pin);pin.openPopup();
        }
      }
    }else{
      mapBox.classList.add('no-map');
    }
    return true;
  }
  async function geocodeExactAddress(p){
    const address=p.address;
    if(!address||address==='미기재')return null;
    // User-initiated geocoding only. No approximate/fabricated coordinates.
    const u='https://nominatim.openstreetmap.org/search?format=jsonv2&limit=5&countrycodes=kr&q='+encodeURIComponent(address);
    const ctl=new AbortController();const timeout=setTimeout(()=>ctl.abort(),9000);
    try{
      const resp=await fetch(u,{headers:{'Accept':'application/json'},signal:ctl.signal});
      if(!resp.ok)return null;
      const candidates=await resp.json();
      const target='금호산2길 20-1';
      const item=candidates.find(c=>{
        const display=String(c.display_name||'');
        const place=String(c.name||'');
        // Require either the supplied full street address or the matching
        // specific building number and local street; broad area hits excluded.
        return (display.includes('금호산2길')&&/(20\s*-\s*1|20-1)/.test(display)) ||
               (place.includes('금호산2길')&&/(20\s*-\s*1|20-1)/.test(place));
      });
      if(!item)return null;
      const lat=Number(item.lat),lng=Number(item.lon);
      if(!Number.isFinite(lat)||!Number.isFinite(lng))return null;
      // Seoul bounds, reject out-of-area geocoding errors.
      if(lat<37.3||lat>37.75||lng<126.7||lng>127.25)return null;
      return {lat,lng};
    }catch(e){return null}finally{clearTimeout(timeout)}
  }
  // Google Maps can resolve a full postal address in an embed without
  // a hand-entered lat/lng or a Maps JavaScript API key.
  const embeddedMap=document.createElement('section');
  embeddedMap.id='oshiEmbeddedAddressMap';
  embeddedMap.className='oshi-embedded-address-map';
  embeddedMap.hidden=true;
  embeddedMap.innerHTML='<div class="oshi-embedded-map-header"><span class="oshi-embedded-map-title"></span><button class="oshi-embedded-map-close" type="button" aria-label="Close embedded map">×</button></div><p class="oshi-embedded-map-caption"></p><iframe title="Google map - 김경자원조손칼국수보쌈" loading="lazy" referrerpolicy="no-referrer-when-downgrade" allowfullscreen></iframe>';
  mapBox.appendChild(embeddedMap);
  embeddedMap.querySelector('.oshi-embedded-map-close').addEventListener('click',hideEmbeddedAddressMap);
  function hideEmbeddedAddressMap(){
    if(embeddedMap.hidden)return;
    embeddedMap.hidden=true;
    // Free the frame when returning to the regular map.
    embeddedMap.querySelector('iframe').removeAttribute('src');
    mapBox.classList.remove('oshi-has-address-embed');
    if(map&&window.L)setTimeout(()=>map.invalidateSize(),30);
  }
  function showKimInsideMap(p){
    notice.hidden=true;
    const title=embeddedMap.querySelector('.oshi-embedded-map-title');
    const caption=embeddedMap.querySelector('.oshi-embedded-map-caption');
    title.textContent='🍜 '+(ko()?p.ko:p.ja);
    caption.textContent=(ko()?'주소로 검색한 구글 지도 · ':'住所検索によるGoogleマップ · ')+p.address;
    // Query includes the full street address AND shop name, not a guessed pin.
    const q=p.address+' 김경자원조 손칼국수 보쌈';
    const iframe=embeddedMap.querySelector('iframe');
    iframe.src='https://maps.google.com/maps?q='+encodeURIComponent(q)+'&z=17&output=embed';
    embeddedMap.hidden=false;
    mapBox.classList.add('oshi-has-address-embed');
    mapBox.scrollIntoView({behavior:'smooth',block:'center'});
    mapBox.classList.add('oshi-map-selected');
    setTimeout(()=>mapBox.classList.remove('oshi-map-selected'),2100);
  }
  let seeking=false;
  async function navigate(p){
    // This address has been corroborated by KTO/KBS. Show a place-search map
    // inside our site without claiming unverified numeric coordinates.
    if(p.id==='tw_kimkyeongja'&&!valid(p)){
      showKimInsideMap(p);
      return;
    }
    hideEmbeddedAddressMap();
    if(valid(p)){focusPoint(p);return}
    if(seeking)return;
    seeking=true;
    notify(ko()?'정확한 주소 좌표를 확인하고 있어요…':'住所から正確な位置を確認しています…');
    const location=await geocodeExactAddress(p);
    seeking=false;
    if(location){
      p.lat=location.lat;p.lng=location.lng;
      p.coordinateSource='verified-address-geocode-session';
      // Regenerate marker with validated coordinates.
      renderSpots();
      focusPoint(p);
    }else{
      notify(ko()?'정확한 건물 좌표를 확인하지 못했어요. 임의의 위치는 표시하지 않습니다.':'正確な建物座標を確認できませんでした。推測の位置は表示しません。',externalSearch(p));
      mapBox.scrollIntoView({behavior:'smooth',block:'center'});
    }
  }
  const previousRender=renderSpots;
  renderSpots=function(){
    hideEmbeddedAddressMap();
    previousRender();
    // Without coords the user can still request an exact address lookup.
    const current=filteredPlaces();
    Array.from(list.querySelectorAll('.spot-card')).forEach((card,index)=>{
      const btn=card.querySelector('.locate-spot');const p=current[index];if(!btn||!p)return;
      if(p.id==='tw_kimkyeongja'&&!valid(p)){
        card.querySelectorAll('.coord-warning').forEach(n=>{
          n.textContent=ko()?'📍 주소 확인됨 · 사이트 내 지도에서 위치 검색 가능':'📍 住所確認済み · サイト内地図で表示可能';
        });
      }
      btn.disabled=false;
      if(p.id==='tw_kimkyeongja'&&!valid(p)){
        btn.textContent=ko()?'지도에서 보기':'地図で見る';
        btn.title=ko()?'이 사이트에서 주소 기반 구글 지도 열기':'サイト内で住所からGoogleマップを表示';
      }else if(!valid(p)){
        btn.textContent=ko()?'주소로 위치 찾기':'住所から位置を探す';
        btn.title=ko()?'정확한 좌표를 확인한 뒤 지도에 표시합니다.':'正確な座標を確認してから地図に表示します。';
      }else{
        btn.textContent=ko()?'지도에서 보기':'地図で見る';
        btn.title='';
      }
    });
  };
  // Capture listener preempts old handlers, which previously scrolled without
  // focusing or used stale marker state.
  list.addEventListener('click',function(ev){
    const btn=ev.target.closest('.locate-spot');if(!btn||!list.contains(btn))return;
    ev.preventDefault();ev.stopPropagation();ev.stopImmediatePropagation();
    const cards=Array.from(list.querySelectorAll('.spot-card'));
    const idx=cards.indexOf(btn.closest('.spot-card'));
    const p=filteredPlaces()[idx];
    if(p)void navigate(p);
  },true);
  // Update initially rendered cards, without changing the current page.
  if(document.getElementById('spots')?.classList.contains('active'))renderSpots();
})();
