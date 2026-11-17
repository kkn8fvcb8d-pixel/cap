
(function(){
const references={"twice_002":[{"kind":"content","label":"TDOONG Tour EP.01","url":"https://youtu.be/Smr_1LfNu0E"}],"twice_003":[{"kind":"content","label":"CHEER UP MV","url":"https://youtu.be/c7rCyll5AeY"}],"twice_004":[{"kind":"evidence","label":"모모 친필 사인 · 블로그","url":"https://blog.naver.com/happy_himawari/224262036563"}],"twice_005":[{"kind":"content","label":"나 혼자 산다 508회 · MBC 공식 클립","url":"https://www.youtube.com/watch?v=sSVNPmIeTE8&t=68s"}],"twice_006":[{"kind":"content","label":"Like OOH-AHH 공식 MV","url":"https://www.youtube.com/watch?v=0rtV5esQT6I&t=195s"},{"kind":"place","label":"용마랜드 공식 카페","url":"http://cafe.naver.com/yongmaland/"}],"twice_007":[{"kind":"evidence","label":"TWICE 단체 사인 · 블로그","url":"https://blog.naver.com/kimkb1457/223728152478"},{"kind":"place","label":"육몽 용산직영점 안내","url":"https://litt.ly/yookmong_yongsan"}],"twice_008":[{"kind":"evidence","label":"TWICE 단체 사인 · 블로그","url":"https://blog.naver.com/hhhyeonii/223892364657"},{"kind":"place","label":"육몽 홍대본점 안내","url":"https://litt.ly/yookmong_hongdae"}],"skz_002":[{"kind":"content","label":"RACHA LOG Ep.02","url":"https://www.youtube.com/watch?v=NUV601ztfY4"}],"skz_003":[{"kind":"content","label":"RACHA LOG Ep.10","url":"https://youtu.be/vmTu4X8a7hY"}],"skz_004":[{"kind":"content","label":"RACHA LOG Ep.04","url":"https://youtu.be/LIjxH_pY2Ew"}],"skz_006":[{"kind":"content","label":"덕후투어","url":"https://www.youtube.com/watch?v=wEyYHhUwIzM"}],"skz_011":[{"kind":"content","label":"SKZ CODE Ep.73 · 달려라 한이 #1","url":"https://www.youtube.com/watch?v=sraANJVnapc&t=248s"},{"kind":"place","label":"하이디라오 COEX점 캐치테이블 예약","url":"https://app.catchtable.co.kr/ct/shop/hidirao_coex"}],"skz_014":[{"kind":"content","label":"Mixtape : On Track MV","url":"https://www.youtube.com/watch?v=XkxWIAe3NDU&t=144s"},{"kind":"place","label":"중앙고등학교 홈페이지","url":"http://choongang.sen.hs.kr"}],"skz_018":[{"kind":"content","label":"딩고 뮤직 · 미래일기 EP.06","url":"https://www.youtube.com/watch?v=e_Jgoqa08Dw&t=250s"},{"kind":"place","label":"N서울타워 홈페이지","url":"https://www.nseoultower.co.kr/"}],"skz_019":[{"kind":"evidence","label":"SKZ 핸드프린팅 · 블로그","url":"https://blog.naver.com/sunshine_bless_/223429826066"},{"kind":"place","label":"롯데쇼핑 홈페이지","url":"https://www.lotteshopping.com/"}],"skz_020":[{"kind":"content","label":"RACHA LOG Ep.15","url":"https://www.youtube.com/watch?v=IiqoozFOs1s&t=190s"}],"skz_021":[{"kind":"content","label":"SKZ CODE Ep.37 · 사우나 #1","url":"https://www.youtube.com/watch?v=bC3rOHEHcb4&t=10s"},{"kind":"content","label":"SKZ CODE Ep.38 · 사우나 #2","url":"https://www.youtube.com/watch?v=PA7-ul1wp0g"},{"kind":"place","label":"홍대24시불가마사우나 인스타그램","url":"https://www.instagram.com/hongdae_sauna24"}],"skz_022":[{"kind":"content","label":"SKZ CODE Ep.73 · 볼링 장면","url":"https://www.youtube.com/watch?v=sraANJVnapc&t=1168s"}],"svt_001":[{"kind":"content","label":"GOING SEVENTEEN EP.75 · Finding KSY #2","url":"https://youtu.be/h2tvKytryQU?si=ZNJclQy9L4ODvjql"}],"svt_002":[{"kind":"content","label":"GOING SEVENTEEN EP.75 · Finding KSY #2","url":"https://youtu.be/h2tvKytryQU?si=ZNJclQy9L4ODvjql"}],"svt_004":[{"kind":"evidence","label":"민규 관련 인스타그램 게시물","url":"https://www.instagram.com/p/DBLFXyBTty8/?img_index=4&psln=NDV2ZDdvdDQ0cG92"}],"svt_005":[{"kind":"evidence","label":"민규 관련 인스타그램 게시물","url":"https://www.instagram.com/p/DBYrrucT3G7/?vrfl=Nzc1Mm13NGVheno0"}],"svt_006":[{"kind":"content","label":"LOVE, MONEY, FAME 공식 MV","url":"https://youtu.be/5NPe8_gDSr4?si=8FQlGnLaE9QkMwRE"}],"svt_007":[{"kind":"content","label":"노포기 EP.1 · 세계관 대통합","url":"https://youtu.be/4AGmCK8xRK0?si=7KAHkvqDZu6iKwHu"}],"svt_008":[{"kind":"evidence","label":"민규 관련 인스타그램 게시물","url":"https://www.instagram.com/p/C8jpFhFyd0P/?srtk=MTFjdm5peTkyM3hzNw=="}],"svt_009":[{"kind":"evidence","label":"버논 관련 X 게시물","url":"https://x.com/bloomof_youth17/status/1374591414344937472"},{"kind":"evidence","label":"도겸 관련 X 게시물","url":"https://x.com/bloomof_youth17/status/1798786683644825836"}],"svt_010":[{"kind":"content","label":"MAESTRO 공식 MV","url":"https://youtu.be/ThI0pBAbFnk?si=p9J4f3UIcGZ3S0AF"}]};
// Reference lists transcribed from hyperlinks embedded in the three supplied DOCX tables.
// A document link does not itself certify the claimed visit or exact filming point.
function allPlaceArrays(){return [typeof demoPlaces!=='undefined'?demoPlaces:null,window.OSHI_PLACES].filter(Array.isArray);}
for(const entries of allPlaceArrays())for(const place of entries){if(references[place.id])place.originalReferences=references[place.id];}
function escapeHtml(v){return String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
function isKo(){return typeof language==='undefined'||language==='ko';}
function renderLinks(links){
 const labels=isKo()?{content:'콘텐츠 원본',evidence:'SNS·블로그·방문 자료',place:'장소 안내·예약'}:{content:'コンテンツ原典',evidence:'SNS・ブログ・関連資料',place:'施設案内・予約'};
 return ['content','evidence','place'].map(kind=>{
  const group=links.filter(x=>x.kind===kind);if(!group.length)return '';
  return '<div class="oshi-original-source-block"><span class="oshi-original-source-label">'+labels[kind]+'</span><div class="oshi-original-links">'+group.map(link=>'<a class="'+(kind==='place'?'oshi-link-place':'')+'" href="'+escapeHtml(link.url)+'" target="_blank" rel="noopener noreferrer" title="'+escapeHtml(link.url)+'">↗ '+escapeHtml(link.label)+'</a>').join('')+'</div></div>';
 }).join('')+'<span class="oshi-original-unverified">'+(isKo()?'자료에 수록된 원본 링크 · 실제 방문 여부와 영업정보는 별도 확인 필요':'資料に記載された原典リンク · 来訪の事実や営業時間は別途確認が必要')+'</span>';
}
function improveDetail(place){
 const root=document.getElementById('detailRoot');if(!root)return;
 const links=place.originalReferences||references[place.id]||[];
 const provenance=links.filter(x=>x.kind==='content'||x.kind==='evidence');
 const more=links.filter(x=>x.kind==='place');
 const hasSources=provenance.length>0;
 const complete=isKo()?'출처 확인 완료':'出典確認済み';
 const pending=isKo()?'콘텐츠 원본 링크 미확인':'コンテンツ原典リンク未確認';
 // A hyperlink confirms the availability of the cited material, not personal presence or an exact shooting point.
 const rootDetails=root.querySelector('[data-panel="0"] .oshi-unified-details');
 if(rootDetails){
  const rows=[...rootDetails.querySelectorAll(':scope > .oshi-unified-detailrow')];
  const relation=rows.find(r=>/관련 콘텐츠|関連コンテンツ/.test(r.querySelector('b')?.textContent||''));
  const statusRow=rows.find(r=>/출처 확인 상태|出典の状態/.test(r.querySelector('b')?.textContent||''));
  if(relation){
   const cell=relation.querySelector(':scope > div');
   if(cell){
    // Replace long and duplicated prose with structured program title(s) and clickable source URLs.
    const labels=isKo()?{content:'원본 영상·콘텐츠 링크',evidence:'SNS·방문 관련 자료',place:'장소 홈페이지·안내'}:{content:'原本映像・コンテンツ',evidence:'SNS・関連資料',place:'施設公式サイト・案内'};
    let parts=[];
    if(provenance.length){
     parts.push(provenance.map((link,i)=>{
      const kindLabel=labels[link.kind];
      const actionLabel=link.kind==='content'?(isKo()?'영상·콘텐츠 바로 보기':'動画・コンテンツを見る'):(isKo()?'원본 게시물 바로 보기':'原本投稿を見る');
      return '<div class="oshi-original-program"><div class="oshi-original-program-name">'+escapeHtml(link.label)+'</div>'+
       '<a class="oshi-original-program-url" href="'+escapeHtml(link.url)+'" target="_blank" rel="noopener noreferrer" title="'+escapeHtml(link.url)+'"><span class="oshi-original-program-action">↗ '+escapeHtml(actionLabel)+'</span><span class="oshi-original-url-text">'+escapeHtml(link.url)+'</span></a></div>';
     }).join(''));
    }else{
     const relationText=String(place.sourceName||(isKo()?place.relationKo:place.relationJa)||'').replace(/\s*[·・(（]?\s*(URL 미확보|URL 미확인|출처 URL 미확인)\s*[)）]?/gi,'').trim();
     parts.push('<span class="oshi-original-missing">'+escapeHtml(relationText||(isKo()?'기재된 관련 콘텐츠 없음':'関連コンテンツの記録なし'))+'</span>');
    }
    if(more.length){
     parts.push('<div class="oshi-original-extra"><span class="oshi-original-source-label">'+labels.place+'</span>'+more.map(link=>'<div><a href="'+escapeHtml(link.url)+'" target="_blank" rel="noopener noreferrer">↗ '+escapeHtml(link.label)+'</a></div>').join('')+'</div>');
    }
    cell.innerHTML=parts.join('');
   }
  }
  if(statusRow){const cell=statusRow.querySelector(':scope > div');if(cell){
   cell.innerHTML=hasSources?'<strong class="oshi-original-confirmed">✓ '+complete+'</strong><small class="oshi-original-caveat">'+(isKo()?'※ 콘텐츠 원본/관련 게시물 링크 확인 기준이며 실제 방문·촬영 지점의 독립 검증과는 별개입니다.':'※ コンテンツ原典・投稿リンクの確認を意味し、実際の訪問や撮影地点の独立検証とは異なります。')+'</small>':'<span class="oshi-original-missing">'+pending+'</span>';
  }}
 }
 // Hero summary deliberately displays only the source title, with no status or URL.
 // Source status and real clickable links belong exclusively inside the Description tab.
}
if(typeof openDetail==='function'){
 const previous=openDetail;
 openDetail=function(place){const result=previous.apply(this,arguments);improveDetail(place);return result;};
}
})();
