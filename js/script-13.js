
/* STEP 03 visual enhancements — no changes to stored place data or other steps. */
(function(){
  if(typeof renderSpots!=='function'||typeof filteredPlaces!=='function')return;
  const previousRenderSpots=renderSpots;
  const previousUpdateMap=typeof updateMap==='function'?updateMap:null;
  const previousOpenDetail=typeof openDetail==='function'?openDetail:null;

  function isKo(){return language==='ko'}
  function areaName(p){
    const address=String(p.address||'');
    const district=address.match(/(?:서울(?:특별시)?\s*)([가-힣]+구)/);
    const koArea=String(p.areaKo||'').trim();
    const jaArea=String(p.areaJa||'').trim();
    const districtText=district?district[1]:'';
    // Show neighborhood and district together when applicable.
    const hongdae=/홍대|弘大/i.test((p.ko||'')+' '+koArea+' '+jaArea);
    const kor=hongdae?(districtText?`홍대 · ${districtText}`:'홍대')
      :(districtText||koArea||'지역 확인 필요');
    if(isKo())return kor;
    const dict={'강동구':'江東区','송파구':'松坡区','마포구':'麻浦区',
      '중랑구':'中浪区','종로구':'鐘路区','성동구':'城東区',
      '용산구':'龍山区','강남구':'江南区','서초구':'瑞草区'};
    const jpDistrict=dict[districtText]||jaArea||'エリア確認中';
    return hongdae?`弘大 · ${jpDistrict}`:jpDistrict;
  }

  function iconForPlace(p){
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
  }

  function sourceDate(p){
    // verifiedDate is sometimes a location/business check date, not proof of
    // source verification. Only explicitly source-related dates are shown.
    const date=p.sourceVerifiedAt||p.sourceCheckedAt||p.sourceVerificationDate||null;
    if(typeof date==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(date))return date;
    return null;
  }

  renderSpots=function(){
    previousRenderSpots();
    const items=filteredPlaces();
    document.querySelectorAll('#spotList .spot-card').forEach((card,i)=>{
      const p=items[i];if(!p)return;
      const title=card.querySelector('.spot-title');
      if(!title)return;
      const location=document.createElement('div');
      location.className='oshi-area-above-title';
      location.textContent='⌖ '+areaName(p);
      card.insertBefore(location,title);
      const source=card.querySelector('.oshi-source-status');
      if(source){
        const date=sourceDate(p);
        const dateNote=document.createElement('div');
        dateNote.className='oshi-source-date';
        dateNote.textContent=date
          ?(isKo()?'출처 확인일: ':'出典確認日：')+date
          :(isKo()?'출처 확인일: 기록 없음':'出典確認日：記録なし');
        source.after(dateNote);
      }
    });
  };

  if(previousUpdateMap){
    updateMap=function(places){
      previousUpdateMap(places);
      if(!window.L||!map||!Array.isArray(markers))return;
      const lookup=new Map((places||filteredPlaces()).map(p=>[p.id,p]));
      markers.forEach(marker=>{
        const p=lookup.get(marker.placeId);
        if(!p||typeof marker.setIcon!=='function')return;
        const emoji=iconForPlace(p);
        const icon=L.divIcon({
          className:'oshi-map-marker',
          html:'<div class="oshi-map-pin"><span>'+emoji+'</span></div>',
          iconSize:[42,42],
          iconAnchor:[17,42],
          popupAnchor:[4,-36]
        });
        marker.setIcon(icon);
        const element=marker.getElement();
        if(element)element.setAttribute('aria-label',(isKo()?'장소: ':'スポット：')+(isKo()?p.ko:p.ja));
      });
    };
  }

  function animatedHeart(btn){
    if(!btn)return;
    btn.classList.remove('oshi-detail-pop');
    void btn.offsetWidth;
    btn.classList.add('oshi-detail-pop');
    setTimeout(()=>btn.classList.remove('oshi-detail-pop'),600);
    if(window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches)return;
    const r=btn.getBoundingClientRect();
    for(const [dx,dy] of [[-42,-60],[12,-70],[39,-40],[-23,-82]]){
      const h=document.createElement('span');
      h.className='oshi-detail-floating-heart';
      h.textContent='♥';
      h.style.setProperty('--x',(r.left+r.width/2)+'px');
      h.style.setProperty('--y',(r.top+r.height/2)+'px');
      h.style.setProperty('--dx',dx+'px');
      h.style.setProperty('--dy',dy+'px');
      document.body.appendChild(h);
      setTimeout(()=>h.remove(),900);
    }
  }

  let toastTimer;
  function favoriteFeedback(saved){
    let toast=document.getElementById('oshiFavoriteToast');
    if(!toast){
      toast=document.createElement('div');
      toast.id='oshiFavoriteToast';
      toast.className='oshi-favorite-toast';
      toast.setAttribute('role','status');
      toast.setAttribute('aria-live','polite');
      document.body.appendChild(toast);
    }
    toast.textContent=saved
      ?(isKo()?'♥ 즐겨찾기에 추가했어요!':'♥ お気に入りに追加しました！')
      :(isKo()?'즐겨찾기에서 삭제했어요':'お気に入りから削除しました');
    toast.classList.add('visible');
    clearTimeout(toastTimer);
    toastTimer=setTimeout(()=>toast.classList.remove('visible'),1800);
  }

  if(previousOpenDetail){
    openDetail=function(p){
      previousOpenDetail(p);
      const dialog=document.getElementById('detailRoot');
      if(!dialog)return;
      const selectors=['.oshi-detail-heart','.oshi-detail-action','.detail-save'];
      selectors.forEach(selector=>{
        const btn=dialog.querySelector(selector);
        if(!btn)return;
        // Capture phase ensures feedback even if the original click
        // handler re-renders the map/card after toggling the state.
        btn.addEventListener('click',()=>{
          const willBeSaved=!favorites.includes(p.id);
          animatedHeart(btn);
          favoriteFeedback(willBeSaved);
        },{capture:true});
      });
    };
  }
})();
