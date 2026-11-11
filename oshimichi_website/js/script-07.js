
// First paint is fully self-contained. Load the interactive map asynchronously only if available.
(function(){
 const css=document.createElement('link');css.rel='stylesheet';css.href='https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';document.head.appendChild(css);
 const js=document.createElement('script');js.async=true;js.src='https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
 js.onload=function(){try{if(typeof updateMap==='function'&&document.getElementById('spots')?.classList.contains('active'))updateMap()}catch(e){}};
 document.head.appendChild(js);
})();
// External live maps are optional and must never hide the UI.
window.addEventListener('load',function(){
 var box=document.getElementById('mapBox');
 if(box && !window.L) box.classList.add('no-map');
});
