/* Nine collections, live filtering, and an accessible native-dialog photo viewer. */
(() => {
  const cards=[...document.querySelectorAll('[data-journal-id]')];
  if(!cards.length)return;
  const filters=[...document.querySelectorAll('[data-journal-filter]')];
  const search=document.querySelector('#journal-search');
  const mosaic=document.querySelector('.journal-mosaic');
  const lightbox=document.querySelector('#journal-lightbox');
  const large=document.querySelector('#journal-large-image');
  let active='all',current=0,visible=cards,returnFocus=null;
  function filter(){
    const query=search.value.trim().toLowerCase();
    visible=cards.filter(card=>{
      const show=(active==='all'||card.dataset.journalCategory===active)&&card.textContent.toLowerCase().includes(query);
      card.hidden=!show;return show;
    });
    filters.forEach(button=>{const selected=button.dataset.journalFilter===active;button.classList.toggle('is-active',selected);button.setAttribute('aria-pressed',String(selected))});
    mosaic.classList.toggle('is-filtered',active!=='all'||Boolean(query));
    document.querySelector('#journal-empty').hidden=visible.length>0;
    const label=filters.find(button=>button.dataset.journalFilter===active)?.textContent.replace(/^\d+\s*/,'').trim()||'Collection';
    document.querySelector('#journal-count').textContent=`${visible.length} ${visible.length===1?'FRAME':'FRAMES'} / ${active==='all'?'ALL COLLECTIONS':label.toUpperCase()}`;
    visible.forEach((card,index)=>{if(typeof animateElement==='function')animateElement(card,'filter-in',Math.min(index,5)*30)});
  }
  filters.forEach(button=>button.addEventListener('click',()=>{active=button.dataset.journalFilter;filter()}));
  search.addEventListener('input',filter);search.addEventListener('search',filter);
  search.addEventListener('keydown',event=>{if(event.key==='Escape'&&search.value){search.value='';filter()}});
  document.querySelector('#reset-journal').addEventListener('click',()=>{active='all';search.value='';filter();search.focus({preventScroll:true});document.querySelector('#journal-browse').scrollIntoView({behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth',block:'start'})});
  function display(index){
    if(!visible.length)return;
    current=(index+visible.length)%visible.length;
    const card=visible[current],image=card.querySelector('img');
    large.src=image.getAttribute('src');large.alt=image.alt;
    document.querySelector('#journal-lightbox-count').textContent=`${current+1} / ${visible.length}`;
    document.querySelector('#journal-large-category').textContent=card.querySelector('figcaption>span').textContent;
    document.querySelector('#journal-large-title').textContent=card.querySelector('h2').textContent;
    document.querySelector('#journal-large-description').textContent=card.querySelector('figcaption>p').textContent;
    document.querySelector('#journal-previous').disabled=visible.length<2;
    document.querySelector('#journal-next').disabled=visible.length<2;
    if(typeof animateElement==='function')animateElement(large,'panel-in');
  }
  cards.forEach(card=>{
    const button=card.querySelector('[data-journal-open]');
    button.addEventListener('click',()=>{visible=cards.filter(item=>!item.hidden);returnFocus=button;display(visible.indexOf(card));lightbox.showModal();document.body.classList.add('journal-modal-open');if(typeof animateElement==='function')animateElement(lightbox,'dialog-in')});
  });
  document.querySelector('#journal-close').addEventListener('click',()=>lightbox.close());
  document.querySelector('#journal-previous').addEventListener('click',()=>display(current-1));
  document.querySelector('#journal-next').addEventListener('click',()=>display(current+1));
  lightbox.addEventListener('click',event=>{if(event.target===lightbox)lightbox.close()});
  lightbox.addEventListener('keydown',event=>{if(event.key==='ArrowRight'){event.preventDefault();display(current+1)}else if(event.key==='ArrowLeft'){event.preventDefault();display(current-1)}});
  lightbox.addEventListener('close',()=>{document.body.classList.remove('journal-modal-open');returnFocus?.focus({preventScroll:true})});
})();
