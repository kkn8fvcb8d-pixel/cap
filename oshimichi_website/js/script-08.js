
/* STEP 01: predictable JA/KR switching, including small navigation text. */
(function(){
  'use strict';
  function translateStepOne(){
    const ko=document.documentElement.lang.toLowerCase().startsWith('ko');
    const t=ko?{
      back:'돌아가기',backHelp:'홈으로 돌아가기',
      title:'추후 추가 예정 아티스트',
      info:'현재 TWICE·Stray Kids·IVE·SEVENTEEN 멤버 선택을 지원합니다. IVE·SEVENTEEN 성지 정보는 준비 중입니다.',
      girls:'여자 그룹',boys:'남자 그룹'
    }:{
      back:'戻る',backHelp:'ホームに戻る',
      title:'今後追加予定のアーティスト',
      info:'現在はTWICE・Stray Kids・IVE・SEVENTEENのメンバー選択に対応しています。IVE・SEVENTEENの聖地情報は準備中です。',
      girls:'女性グループ',boys:'男性グループ'
    };
    const back=document.getElementById('back');
    if(back){const label=back.querySelector('span');if(label)label.textContent=t.back;back.setAttribute('aria-label',t.backHelp);back.title=t.backHelp;}
    const title=document.getElementById('futureTitle');if(title)title.textContent=t.title;
    const info=document.getElementById('futureSub');if(info)info.textContent=t.info;
    for(const [gender,value] of [['girls',t.girls],['boys',t.boys]]){
      const label=document.querySelector('[data-future="'+gender+'"]');
      if(label)label.textContent=value;
    }
  }
  translateStepOne();
  // After the existing language switch updates <html lang>, sync these labels.
  document.getElementById('langSwitch')?.addEventListener('click',function(){
    queueMicrotask(translateStepOne);
    requestAnimationFrame(translateStepOne);
  });
  document.getElementById('start')?.addEventListener('click',translateStepOne);
  document.querySelectorAll('[data-gender]').forEach(b=>b.addEventListener('click',translateStepOne));
})();
