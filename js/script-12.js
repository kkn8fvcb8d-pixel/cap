
/* Non-invasive final STEP 03 presentation layer. Does not modify artist, place, or detail data. */
(function(){
  if(typeof renderSpots!=='function'||typeof filteredPlaces!=='function')return;
  const prevRenderSpots=renderSpots;
  let toastTimer;
  function ko(){return language==='ko'}
  function toast(msg){
    let bar=document.getElementById('oshiFavoriteToast');
    if(!bar){bar=document.createElement('div');bar.id='oshiFavoriteToast';bar.className='oshi-favorite-toast';bar.setAttribute('role','status');bar.setAttribute('aria-live','polite');document.body.appendChild(bar)}
    bar.textContent=msg;bar.classList.add('visible');
    clearTimeout(toastTimer);toastTimer=setTimeout(()=>bar.classList.remove('visible'),1800);
  }
  function burst(button){
    if(window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches)return;
    button.classList.remove('oshi-burst');void button.offsetWidth;button.classList.add('oshi-burst');
    [[-46,-48,-18],[40,-57,24],[-16,-77,7],[58,-18,36]].forEach(([x,y,rot],i)=>{
      const heart=document.createElement('span');heart.className='oshi-floating-heart';heart.textContent=i===2?'♡':'♥';
      heart.style.setProperty('--dx',x+'px');heart.style.setProperty('--dy',y+'px');heart.style.setProperty('--rot',rot+'deg');
      button.appendChild(heart);setTimeout(()=>heart.remove(),950);
    });
    setTimeout(()=>button.classList.remove('oshi-burst'),800);
  }
  const svgCheck='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="m8 12 2.5 2.5L16 9"/></svg>';
  const svgQuestion='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M9.5 9a2.7 2.7 0 0 1 5 1.3c0 1.8-2.5 2.1-2.5 3.7"/><path d="M12 17h.01"/></svg>';
  function setHeartButton(button,id){
    const chosen=favorites.includes(id);
    button.classList.toggle('oshi-saved',chosen);
    button.setAttribute('aria-pressed',String(chosen));
    button.innerHTML='<span class="oshi-heart-icon" aria-hidden="true">'+(chosen?'♥':'♡')+'</span><span>'+(chosen?(ko()?'즐겨찾기 해제':'お気に入りを解除'):(ko()?'즐겨찾기에 추가':'お気に入りに追加'))+'</span>';
  }
  renderSpots=function(){
    prevRenderSpots();
    const items=filteredPlaces();
    document.querySelectorAll('#spotList .spot-card').forEach((card,i)=>{
      const p=items[i];if(!p)return;
      card.classList.add('oshi-compact-card');
      // Normalize the language used for group-wide locations.
      const relation=card.querySelector('.oshi-relation-pill');
      if(relation && (relation.textContent==='그룹 공통'||relation.textContent==='グループ共通'))relation.textContent=ko()?'그룹 전체':'グループ全員';
      // Keep the relationship at the top and the big place name; move everything else to detail.
      card.querySelectorAll('.spot-kicker,.spot-meta,.spot-address,.source-link,.coord-warning').forEach(el=>el.remove());
      const status=document.createElement('div');status.className='oshi-source-status';
      const confirmed=Boolean(p.source && p.verified);
      status.classList.toggle('needs-check',!confirmed);
      status.innerHTML=(confirmed?svgCheck:svgQuestion)+'<span></span>';
      status.querySelector('span').textContent=confirmed?(ko()?'출처 확인':'出典確認済'):(ko()?'출처 확인 필요':'出典確認が必要');
      const actions=card.querySelector('.spot-actions');
      if(actions)card.insertBefore(status,actions);
      // The existing detail and map buttons continue to use their original handlers.
      const saveButton=card.querySelector('.save-spot');
      if(saveButton){
        setHeartButton(saveButton,p.id);
        saveButton.onclick=()=>{
          const wasSaved=favorites.includes(p.id);
          favorites=wasSaved?favorites.filter(x=>x!==p.id):[...favorites,p.id];
          save();setHeartButton(saveButton,p.id);burst(saveButton);
          toast(wasSaved?(ko()?'즐겨찾기에서 삭제했어요':'お気に入りから削除しました'):(ko()?'♡ 즐겨찾기에 추가했어요!':'♡ お気に入りに追加しました！'));
        };
      }
    });
  };
})();
