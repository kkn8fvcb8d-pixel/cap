
/* STEP 03: translate every category/region option without resetting the selected values. */
(function(){
 'use strict';
 const options={
  ja:{category:{all:'すべて',filming:'撮影地',cafe:'カフェ',restaurant:'飲食店',other:'その他'},area:{'':'地域を選択',hongdae:'弘大',myeongdong:'明洞',gangnam:'江南',seongsu:'聖水',jamsil:'蚕室'},categoryLabel:'カテゴリー',manualLabel:'位置情報を使わない場合：'},
  ko:{category:{all:'전체',filming:'촬영지',cafe:'카페',restaurant:'음식점',other:'기타'},area:{'':'지역 선택',hongdae:'홍대',myeongdong:'명동',gangnam:'강남',seongsu:'성수',jamsil:'잠실'},categoryLabel:'카테고리',manualLabel:'현재 위치를 이용하지 않을 경우:'}
 };
 function syncStep03(){
  const lang=document.documentElement.lang.toLowerCase().startsWith('ko')?'ko':'ja';
  const d=options[lang];
  for(const [id,values] of [['categoryFilter',d.category],['manualArea',d.area]]){
   const select=document.getElementById(id);
   if(!select)continue;
   for(const option of select.options){
    if(Object.prototype.hasOwnProperty.call(values,option.value))option.textContent=values[option.value];
   }
  }
  const categoryLabel=document.getElementById('categoryLabel');
  const manualLabel=document.getElementById('manualLabel');
  if(categoryLabel)categoryLabel.textContent=d.categoryLabel;
  if(manualLabel)manualLabel.textContent=d.manualLabel;
 }
 syncStep03();
 document.getElementById('langSwitch')?.addEventListener('click',function(){queueMicrotask(syncStep03);requestAnimationFrame(syncStep03)});
})();
