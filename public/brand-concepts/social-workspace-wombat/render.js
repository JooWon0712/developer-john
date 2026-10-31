(()=>{
 "use strict";
 const variants=window.workspaceConcepts;
 const id=new URLSearchParams(location.search).get('v')||'01';
 const variant=variants.find(item=>item.id===id)||variants[0];
 const cover=document.querySelector('.cover');
 cover.dataset.variant=variant.id;
 cover.dataset.side=variant.side;
 document.title=variant.id+' · '+variant.name;
 document.querySelector('.copy').textContent=variant.copy;
 for(const item of variants){const a=document.createElement('a');a.href='render.html?v='+item.id;a.textContent=item.id;if(item.id===variant.id)a.setAttribute('aria-current','page');document.querySelector('.render-controls').append(a);}
})();
