(() => {
 'use strict';
 const form=document.querySelector('#account-form');if(!form)return;
 const t=value=>window.siteI18n?.t(value)||value,signup=form.dataset.accountMode==='signup',fields=form.elements,status=document.querySelector('#account-form-status'),toggles=[...form.querySelectorAll('[data-password-toggle]')];
 function updateToggle(button){const field=document.getElementById(button.dataset.passwordToggle),visible=field.type==='text';button.setAttribute('aria-pressed',String(visible));button.setAttribute('aria-label',t(visible?'Hide password':'Show password'));}
 toggles.forEach(button=>button.addEventListener('click',()=>{const field=document.getElementById(button.dataset.passwordToggle);field.type=field.type==='password'?'text':'password';updateToggle(button);field.focus({preventScroll:true});}));
 function validate(){
  if(!signup)return;
  fields.fullName.setCustomValidity(fields.fullName.value.trim()?'':t('Enter your full name.'));
  fields.password.setCustomValidity(fields.password.value.length>=8?'':t('Use at least 8 characters for your password.'));
  const mismatch=fields.confirmPassword.value!==fields.password.value;fields.confirmPassword.setCustomValidity(mismatch?t('Passwords do not match.'):'' );
  document.querySelector('#confirm-password-error').textContent=mismatch&&fields.confirmPassword.value?t('Passwords do not match.'):'';fields.confirmPassword.setAttribute('aria-invalid',String(Boolean(mismatch&&fields.confirmPassword.value)));
  const phone=fields.phone.value.trim(),digits=phone.replace(/\D/g,'');fields.phone.setCustomValidity(!phone||digits.length>=7&&digits.length<=15&&!/[A-Za-z]/.test(phone)?'':t('Enter a phone number with 7 to 15 digits.'));
 }
 form.addEventListener('input',()=>{status.textContent='';status.hidden=true;if(signup)validate();});
 form.addEventListener('submit',event=>{event.preventDefault();validate();if(!form.reportValidity())return;status.textContent=t(signup?'Your details passed validation. Account services are not connected, so no account was created.':'Your details passed validation. Account services are not connected, so you have not been signed in.');status.hidden=false;status.setAttribute('tabindex','-1');status.focus({preventScroll:true});fields.password.value='';fields.password.type='password';if(signup){fields.confirmPassword.value='';fields.confirmPassword.type='password';fields.confirmPassword.setCustomValidity('');fields.confirmPassword.setAttribute('aria-invalid','false');document.querySelector('#confirm-password-error').textContent='';}toggles.forEach(updateToggle);});
 window.addEventListener('foodiehub:languagechange',()=>{toggles.forEach(updateToggle);if(signup&&fields.confirmPassword.value)validate();});
 document.querySelector('#account-fields').disabled=false;
})();
