
/* Artist/member association labels, based on the existing place data. */
(function(){
  if(typeof renderSpots!=='function')return;
  const earlierRenderSpots=renderSpots;
  const groupLabel=(p)=>p.group==='Stray Kids'?'Stray Kids':(p.group||'');
  const localizedName=(key,group,lang)=>{
    const arr=(typeof memberData!=='undefined'&&memberData[group])||[];
    const item=arr.find(x=>x[0]===key);
    return item?(lang==='ko'?item[2]:item[1]):key;
  };
  function relationText(p,lang){
    const multi=Array.isArray(p.members)?p.members.filter(Boolean):[];
    const specific=multi.filter(x=>x!=='ALL'&&x!=='NONE');
    if(!specific.length && p.member && !['ALL','NONE'].includes(p.member))specific.push(p.member);
    const unique=[...new Set(specific)];
    if(unique.length)return (lang==='ko'?'관련 멤버 · ':'関連メンバー · ')+unique.map(x=>localizedName(x,p.group,lang)).join(' · ');
    if(p.member==='NONE'||p.memberLabelKo==='공통')return lang==='ko'?'그룹 공통':'グループ共通';
    if(p.member==='ALL'||p.memberLabelKo==='전원')return lang==='ko'?'그룹 전체':'グループ全員';
    return lang==='ko'?'관련 멤버 확인 필요':'関連メンバー確認中';
  }
  renderSpots=function(){
    earlierRenderSpots();
    const lang=language==='ko'?'ko':'ja';
    const spots=typeof filteredPlaces==='function'?filteredPlaces():[];
    const cards=document.querySelectorAll('#spotList .spot-card');
    cards.forEach((card,i)=>{
      const p=spots[i];if(!p)return;
      card.querySelector('.oshi-relation-first')?.remove();
      const label=document.createElement('div');
      label.className='oshi-relation-first';
      label.setAttribute('aria-label',lang==='ko'?'관련 아티스트 및 멤버':'関連アーティスト・メンバー');
      const group=document.createElement('span');group.textContent=groupLabel(p);
      const relation=document.createElement('span');relation.className='oshi-relation-pill';
      relation.textContent=relationText(p,lang);
      label.append(group,relation);
      card.prepend(label);
    });
  };
})();
