(() => {
 'use strict';
 const header=document.querySelector('.site-chrome'),nav=document.querySelector('#primary-navigation'),toggle=document.querySelector('.chrome-menu-toggle'),discover=document.querySelector('.header-discover');
 if(!header||!nav||!toggle)return;
 const mobile=matchMedia('(max-width: 1320px)'),motion=matchMedia('(prefers-reduced-motion: reduce)');
 function setMenu(open,returnFocus=false){header.classList.toggle('menu-open',open);toggle.setAttribute('aria-expanded',String(open));toggle.querySelector('.chrome-menu-label').textContent=open?'CLOSE':'MENU';if(open&&discover)discover.open=false;if(returnFocus)toggle.focus();}
 // The expanded navigation remains available if JavaScript is disabled.
 toggle.hidden=false;header.classList.add('chrome-ready');
 toggle.addEventListener('click',()=>setMenu(toggle.getAttribute('aria-expanded')!=='true'));
 nav.querySelectorAll('a').forEach(link=>link.addEventListener('click',()=>setMenu(false)));
 document.addEventListener('click',event=>{if(!header.contains(event.target)){setMenu(false);if(discover)discover.open=false;}});
 document.addEventListener('keydown',event=>{if(event.key==='Escape'){if(toggle.getAttribute('aria-expanded')==='true'){setMenu(false,true);}else if(discover?.open){discover.open=false;discover.querySelector('summary').focus();}}});
 header.addEventListener('focusout',()=>{setTimeout(()=>{if(!header.contains(document.activeElement)){setMenu(false);if(discover)discover.open=false;}},0);});
 mobile.addEventListener('change',()=>setMenu(false));
 discover?.addEventListener('toggle',()=>{if(discover.open)setMenu(false);});
 document.querySelector('.footer-top')?.addEventListener('click',event=>{event.preventDefault();window.scrollTo({top:0,behavior:motion.matches?'instant':'smooth'});header.querySelector('.chrome-brand').focus({preventScroll:true});});
 const current=location.pathname.replace(/\/$/,'').split('/').pop().replace(/\.html$/,'')||'index';
 document.querySelectorAll('.footer-explore a').forEach(link=>{if(link.getAttribute('href').replace('.html','')===current)link.setAttribute('aria-current','page');});
 const targets=document.querySelectorAll('.footer-welcome,.chrome-footer-grid>*,.chrome-footer-bottom');
 const running=new Set();
 if('IntersectionObserver' in window){const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){if(!motion.matches){const animation=entry.target.animate([{opacity:0,transform:'translateY(18px)'},{opacity:1,transform:'translateY(0)'}],{duration:650,easing:'cubic-bezier(.2,.65,.3,1)'});running.add(animation);animation.onfinish=()=>running.delete(animation);}observer.unobserve(entry.target);}}),{threshold:.12});targets.forEach(target=>observer.observe(target));motion.addEventListener('change',()=>{if(motion.matches){running.forEach(animation=>animation.finish());running.clear();}});}
})();
