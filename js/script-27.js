
/* Event delegation survives language switching and rerendering of STEP 05. */
(function(){
 const list=document.getElementById('courseSelectList');
 if(!list)return;
 list.addEventListener('change',function(event){
  const box=event.target;
  if(!(box instanceof HTMLInputElement)||!box.classList.contains('choose-box'))return;
  const card=box.closest('.fav-item');
  if(!card)return;
  card.classList.remove('oshi-visit-pop','oshi-visit-off');
  void card.offsetWidth; // restart animation when a selection is toggled repeatedly
  const cls=box.checked?'oshi-visit-pop':'oshi-visit-off';
  card.classList.add(cls);
  card.addEventListener('animationend',function cleanup(e){
    if(e.target!==card)return;
    card.classList.remove(cls);
    card.removeEventListener('animationend',cleanup);
  });
 });
})();
