(() => {
 'use strict';
 const form=document.querySelector('#contact-request-form');
 if(!form)return;
 const fields=form.elements,tabs=[...document.querySelectorAll('[data-contact-tab]')],review=document.querySelector('#contact-review'),reviewText=document.querySelector('#contact-review-text'),status=document.querySelector('#contact-copy-status');
 let mode='table',draft='';
 const localDate=(date=new Date())=>`${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;
 fields.date.min=localDate();
 function edit(){review.hidden=true;form.hidden=false;}
 function setMode(next,focus=false){
  mode=next==='table'?'table':'message';edit();
  tabs.forEach(tab=>{const active=tab.dataset.contactTab===mode;tab.setAttribute('aria-selected',String(active));tab.tabIndex=active?0:-1;if(active){document.querySelector('#contact-form-panel').setAttribute('aria-labelledby',tab.id);if(focus)tab.focus();}});
  document.querySelectorAll('[data-contact-reservation]').forEach(label=>{label.hidden=mode!=='table';const input=label.querySelector('input,select');input.required=mode==='table';input.disabled=mode!=='table';});
  if(mode==='message'&&fields.topic.value==='A table enquiry')fields.topic.value='A general question';
  if(mode==='table')fields.topic.value='A table enquiry';
 }
 tabs.forEach((tab,i)=>{tab.addEventListener('click',()=>setMode(tab.dataset.contactTab));tab.addEventListener('keydown',e=>{if(['ArrowLeft','ArrowRight','Home','End'].includes(e.key)){e.preventDefault();const index=e.key==='Home'?0:e.key==='End'?tabs.length-1:(i+(e.key==='ArrowRight'?1:-1)+tabs.length)%tabs.length;setMode(tabs[index].dataset.contactTab,true);}});});
 function updateCount(){document.querySelector('#contact-char-count').textContent=`${fields.notes.value.length} / 1000`;}
 fields.notes.addEventListener('input',updateCount);
 document.querySelectorAll('[data-contact-mode]').forEach(link=>link.addEventListener('click',()=>{setMode(link.dataset.contactMode==='table'?'table':'message');if(link.dataset.contactMode==='group')fields.topic.value='A group occasion';if(link.dataset.contactTopic)fields.topic.value=link.dataset.contactTopic;}));
 document.querySelectorAll('[data-contact-occasion]').forEach(button=>button.addEventListener('click',()=>{setMode('message');fields.topic.value='A group occasion';fields.notes.value=`${button.dataset.contactOccasion}\nPreferred date: \nApproximate guests: \nWhat we have in mind: `;updateCount();document.querySelector('#request').scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'});fields.notes.focus({preventScroll:true});}));
 form.addEventListener('submit',event=>{
  event.preventDefault();fields.date.min=localDate();
  if(!form.reportValidity())return;
  draft=`FOODIEHUB — ${mode==='table'?'TABLE ENQUIRY':'MESSAGE'}\n\nName: ${fields.name.value.trim()}\nEmail: ${fields.email.value.trim()}\n${fields.phone.value.trim()?`Phone: ${fields.phone.value.trim()}\n`:''}Topic: ${fields.topic.value}\n${mode==='table'?`Preferred date: ${fields.date.value}\nPreferred time: ${fields.time.value}\nGuests: ${fields.guests.value}\n`:''}\n${fields.notes.value.trim()||'No additional notes.'}\n\nRequest only — not sent or confirmed.`;
  reviewText.textContent=draft;status.textContent='';form.hidden=true;review.hidden=false;review.setAttribute('tabindex','-1');review.focus({preventScroll:true});
 });
 document.querySelector('#contact-edit').addEventListener('click',()=>{edit();fields.name.focus({preventScroll:true});});
 document.querySelector('#contact-copy').addEventListener('click',async()=>{try{await navigator.clipboard.writeText(draft);status.textContent='Request copied. Share it through your confirmed restaurant contact channel.';}catch{const selection=window.getSelection(),range=document.createRange();range.selectNodeContents(reviewText);selection.removeAllRanges();selection.addRange(range);status.textContent='Select and copy the highlighted request with your device’s copy command.';}});
 document.querySelector('#contact-download').addEventListener('click',()=>{const url=URL.createObjectURL(new Blob([draft],{type:'text/plain;charset=utf-8'}));const link=document.createElement('a');link.href=url;link.download='foodiehub-enquiry.txt';link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);status.textContent='Your request has been prepared as a text file. It has not been sent.';});
 const incoming=new URLSearchParams(location.search);if(incoming.get('mode')==='message')setMode('message');if(incoming.get('inquiry')){fields.notes.value=incoming.get('inquiry').slice(0,1000);updateCount();}
 const targets=document.querySelectorAll('.contact-heading,.contact-path,.contact-request-intro,.contact-form-card,.contact-arrival-photo,.contact-arrival-copy,.contact-occasion-copy,.contact-faq-list,.contact-invitation-inner');
 if('IntersectionObserver' in window&&!matchMedia('(prefers-reduced-motion: reduce)').matches){const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.animate([{opacity:0,transform:'translateY(22px)'},{opacity:1,transform:'translateY(0)'}],{duration:650,easing:'cubic-bezier(.2,.6,.3,1)',fill:'both'});observer.unobserve(entry.target);}}),{threshold:.08});targets.forEach(target=>observer.observe(target));}
})();
