/* Local offer planning only: no payment or booking is submitted. */
(() => {
  const source=document.querySelector('#bundle-data');
  const form=document.querySelector('#bundle-planner');
  if(!source||!form)return;
  const bundles=JSON.parse(source.textContent);
  const choice=document.querySelector('#plan-bundle');
  const quantity=document.querySelector('#plan-quantity');
  const code=document.querySelector('#plan-code');
  const status=document.querySelector('#plan-code-status');
  const money=new Intl.NumberFormat('en-IN',{style:'currency',currency:'INR',maximumFractionDigits:2});
  let appliedCode='';
  function selected(){return bundles.find(b=>b.id===choice.value)||bundles[0]}
  function amounts(){const bundle=selected();const count=Math.max(1,Math.min(6,Number.parseInt(quantity.value,10)||1));const subtotal=bundle.price*count;const saving=appliedCode==='TOGETHER10'?Math.round(subtotal*10)/100:0;return{bundle,count,subtotal,saving,total:subtotal-saving}}
  function render(){
    const p=amounts();
    document.querySelector('#plan-name').textContent=p.bundle.name;
    document.querySelector('#plan-serving').textContent=`${p.count} ${p.count===1?'bundle':'bundles'} · suggested for ${p.bundle.serves*p.count} ${p.bundle.serves*p.count===1?'person':'people'}`;
    document.querySelector('#plan-subtotal').textContent=money.format(p.subtotal);
    document.querySelector('#plan-saving').textContent=money.format(p.saving);
    document.querySelector('#plan-total').textContent=money.format(p.total);
    const inquiry=`Please confirm this bundle plan: ${p.count} x ${p.bundle.name}, suggested for ${p.bundle.serves*p.count} people. Planner estimate: ${money.format(p.total)}${appliedCode?' with planner code '+appliedCode:''}. Please confirm availability and final pricing.`;
    document.querySelector('#enquire-offer-plan').href='contact.html?mode=message&inquiry='+encodeURIComponent(inquiry);
  }
  choice.addEventListener('change',render);
  quantity.addEventListener('change',render);
  code.addEventListener('input',()=>{appliedCode='';status.textContent=code.value.trim()?'Apply the code to update your estimate.':'';render()});
  form.addEventListener('submit',event=>{
    event.preventDefault();const entered=code.value.trim().toUpperCase();
    appliedCode=entered==='TOGETHER10'?entered:'';
    status.textContent=!entered?'Estimate updated.':appliedCode?'TOGETHER10 applied to this planning estimate.':'That code is not recognised. The estimate has no planner reduction.';
    render();if(typeof animateElement==='function')animateElement(document.querySelector('.offer-plan-summary'),'panel-in');
  });
  document.querySelectorAll('[data-plan-offer]').forEach(button=>button.addEventListener('click',()=>{
    if(!bundles.some(b=>b.id===button.dataset.planOffer))return;
    choice.value=button.dataset.planOffer;quantity.value='1';render();
    document.querySelector('#offer-planner').scrollIntoView({behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth',block:'start'});
    choice.focus({preventScroll:true});
  }));
  document.querySelector('#save-offer-plan').addEventListener('click',()=>{
    const p=amounts();
    try{localStorage.setItem('foodiehub-offer-plan',JSON.stringify({id:p.bundle.id,quantity:p.count,code:appliedCode}));if(typeof notify==='function')notify('Your offer plan is saved on this device.');}
    catch{if(typeof notify==='function')notify('This browser could not save your plan. You can still use the enquiry link.');}
  });
  try{const saved=JSON.parse(localStorage.getItem('foodiehub-offer-plan')||'null');if(saved&&bundles.some(b=>b.id===saved.id)){choice.value=saved.id;quantity.value=String(Math.max(1,Math.min(6,Number.parseInt(saved.quantity,10)||1)));if(saved.code==='TOGETHER10'){code.value=saved.code;appliedCode=saved.code;status.textContent='Saved plan restored with its planner code.'}else status.textContent='Your saved table plan is restored.'}}
  catch{/* A blocked or outdated local save must not prevent planning. */}
  render();
})();
