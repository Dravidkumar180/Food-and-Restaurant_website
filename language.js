(() => {
 'use strict';
 const button=document.querySelector('#header-language-button'),dialog=document.querySelector('#language-dialog');if(!button||!dialog)return;
 const form=document.querySelector('#language-form'),options=[...form.querySelectorAll('input[name="website-language"]')],names={en:'English',ta:'தமிழ்',hi:'हिन्दी'};
 const t=text=>window.siteI18n?.t(text)||text;
 function render(){const code=window.siteI18n?.getLanguage()||'en';button.dataset.language=code;const label=t('Website language')+': '+names[code];button.title=label;button.setAttribute('aria-label',label);if(dialog.open)options.forEach(option=>option.checked=option.value===code);}
 button.addEventListener('click',()=>{const current=window.siteI18n?.getLanguage()||'en';options.forEach(option=>option.checked=option.value===current);dialog.showModal();options.find(option=>option.checked)?.focus();});
 dialog.querySelector('.language-close').addEventListener('click',()=>dialog.close());document.querySelector('#language-cancel').addEventListener('click',()=>dialog.close());dialog.addEventListener('click',event=>{if(event.target===dialog)dialog.close();});dialog.addEventListener('close',()=>button.focus());
 form.addEventListener('submit',event=>{event.preventDefault();if(!form.reportValidity())return;const selected=options.find(option=>option.checked)?.value;if(!Object.hasOwn(names,selected))return;const saved=window.siteI18n?.setLanguage(selected);render();dialog.close();if(typeof notify==='function')notify(t(saved?'Your language preference is saved.':'Language changed for this page. Your browser could not save it.'));});
 window.addEventListener('foodiehub:languagechange',render);render();
})();
