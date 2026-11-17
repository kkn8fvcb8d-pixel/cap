
(function(){
'use strict';
const $ = id => document.getElementById(id);
const ja = () => (typeof language !== 'undefined' ? language === 'ja' : document.documentElement.lang === 'ja');
const tr = (j,k) => ja()?j:k;
const inFavorites = () => typeof currentPage!=='undefined' && currentPage==='favorites';
function syncCourseFields(){
 const origin=$('originSelect'), duration=$('durationSelect'), mode=$('travelMode');
 if(!origin || !duration || !mode) return;
 const set=(element,labels)=>{
  const previous=element.value;
  for(const option of element.options){if(Object.prototype.hasOwnProperty.call(labels,option.value)){
   const label=labels[option.value];if(option.textContent!==label)option.textContent=label;
  }}
  if(element.value!==previous)element.value=previous;
 };
 set(origin,{
  current:tr('現在地・選択地域','현재 위치·선택 지역'),
  hongdae:tr('弘大','홍대'),myeongdong:tr('明洞','명동'),
  gangnam:tr('江南','강남'),seongsu:tr('聖水','성수'),jamsil:tr('蚕室','잠실')
 });
 set(duration,{'120':tr('2時間','2시간'),'180':tr('3時間','3시간'),
  '240':tr('半日（4時間）','반나절(4시간)'), '480':tr('1日（8時間）','하루(8시간)')});
 set(mode,{walk:tr('徒歩','도보'),transit:tr('公共交通','대중교통')});
 for(const [id,j,k] of [
  ['configTitle','旅の条件を選択','여행 조건 선택'],
  ['originLabel','出発地点','출발 위치'],
  ['dateLabel','旅行日','여행 날짜'],
  ['startLabel','開始時間','시작 시간'],
  ['durationLabel','旅行時間','여행 가능 시간'],
  ['travelModeLabel','移動方法','이동 방식'],
  ['timeDisclaimer','※ 移動時間は実際の地図経路から計算した所要時間ではなく、計画用の目安です。','※ 실제 지도 경로로 계산한 이동시간이 아닌 계획용 예상 시간입니다.']
 ]){let el=$(id);if(el)el.textContent=tr(j,k)}
 for(const id of ['travelDate','travelTime']){const el=$(id);if(el){el.setAttribute('lang',ja()?'ja':'ko');el.setAttribute('aria-label',$(id==='travelDate'?'dateLabel':'startLabel')?.textContent||'');}}
}
const existingFavoriteRenderer=typeof renderFavorites==='function'?renderFavorites:null;
function renderFavPolished(){
 if(!existingFavoriteRenderer)return;
 // Keep original scoped click handlers (especially openDetail) and storage behavior.
 existingFavoriteRenderer();
 const list=$('favoriteList');if(!list)return;
 for(const item of list.querySelectorAll('.fav-item')){
  const buttons=[...item.children].filter(el=>el.tagName==='BUTTON'&&el.classList.contains('soft-button'));
  if(buttons.length<2)continue;
  const actions=document.createElement('div');actions.className='oshi-fav-actions';
  const remove=buttons[0],detail=buttons[1];
  remove.classList.add('oshi-fav-remove');detail.classList.add('oshi-fav-detail');
  remove.textContent=tr('削除','삭제');detail.textContent=tr('詳細を見る','상세보기');
  actions.append(remove,detail);item.appendChild(actions);
 }
 if(typeof window.OSHI_LOCALIZE_ALL==='function')window.OSHI_LOCALIZE_ALL();
}
// Replace the old renderer that appended its Detail button outside the aligned controls.
if(typeof renderFavorites==='function')renderFavorites=renderFavPolished;
if(typeof translate==='function'){
 const orig=translate;
 translate=function(){const r=orig.apply(this,arguments);syncCourseFields();if(inFavorites())renderFavorites();return r;};
}
if(typeof showPage==='function'){
 const origPage=showPage;
 showPage=function(){const r=origPage.apply(this,arguments);syncCourseFields();if(inFavorites())renderFavorites();return r;};
}
const langSwitch=$('langSwitch');if(langSwitch)langSwitch.addEventListener('click',()=>{
 // Runs after existing click handlers have updated the current language.
 queueMicrotask(()=>{syncCourseFields();if(inFavorites())renderFavorites()});
});
syncCourseFields();if(inFavorites())renderFavorites();
})();
