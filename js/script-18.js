
(function(){
 const photos={
  'TWICE':window.OSHI_TWICE_PHOTOS,
  'Stray Kids':window.OSHI_SKZ_PHOTOS,
  'IVE':window.OSHI_IVE_PHOTOS,
  'SEVENTEEN':window.OSHI_SEVENTEEN_PHOTOS
 };
 for(const button of document.querySelectorAll('.selection .group[data-name]')){
  const source=photos[button.dataset.name]?.ALL;
  const art=button.querySelector('.group-art');
  if(!source||!art)continue;
  const img=document.createElement('img');
  img.className='oshi-step01-cover-photo';
  img.alt=''; // decorative; group name already appears in the button label
  img.loading='eager';
  img.decoding='async';
  img.src=source;
  const shade=document.createElement('span');
  shade.className='oshi-step01-cover-shade';
  shade.setAttribute('aria-hidden','true');
  art.prepend(shade);
  art.prepend(img);
 }
})();
