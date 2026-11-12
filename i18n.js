/* Complete local translations: no runtime translation service or framework. */
(() => {
 'use strict';
 const catalogs=window.FOODIEHUB_TRANSLATIONS||{},control=document.querySelector('#header-language-button');
 if(!control&&!document.querySelector('#account-form'))return;
 const normalize=value=>String(value).replace(/\s+/g,' ').trim();
 const textRecords=new WeakMap(),attributeRecords=new WeakMap();
 const sources=Object.keys(catalogs.ta||{}),folded=new Map(sources.map(key=>[key.toLocaleLowerCase('en'),key]));
 const reverse=new Map();for(const dictionary of Object.values(catalogs))for(const [source,target] of Object.entries(dictionary)){if(target!==source&&!reverse.has(normalize(target)))reverse.set(normalize(target),source);}
 let language='en',observer,scheduled=false;const cache=new Map();
 const escape=value=>value.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
 const patterns=sources.filter(key=>/\{\d+\}/.test(key)).map(key=>{const slots=[];const parts=key.split(/(\{\d+\})/).map(part=>{if(/^\{\d+\}$/.test(part)){slots.push(part);return '(.+?)';}return escape(part);});return {key,slots,regex:new RegExp('^'+parts.join('')+'$','i')};});
 const fragments=sources.filter(key=>key.length>=4&&key.length<=65&&!/[{}]/.test(key)).sort((a,b)=>b.length-a.length);
 function lookup(value,code=language){
  const source=normalize(value);if(!source)return value;
  if(code==='en')return reverse.get(source)||source;
  const dictionary=catalogs[code];if(!dictionary)return source;
  if(!/[A-Za-z]/.test(source)||/^\S+@\S+\.\S+$/.test(source))return source;
  if(dictionary[source])return dictionary[source];
  if(reverse.has(source))return dictionary[reverse.get(source)]||source;
  const caseKey=folded.get(source.toLocaleLowerCase('en'));if(caseKey)return dictionary[caseKey]||source;
  for(const pattern of patterns){const match=source.match(pattern.regex);if(match){let target=dictionary[pattern.key];if(!target)continue;pattern.slots.forEach((slot,index)=>{target=target.split(slot).join(translate(match[index+1],code));});return target;}}
  // Dynamic counters and sentences composed by the existing page scripts.
  let result=source;
  for(const fragment of fragments){if(!dictionary[fragment]||dictionary[fragment]===fragment)continue;const expression=new RegExp('(^|[^A-Za-z])('+escape(fragment)+')(?=$|[^A-Za-z])','gi');result=result.replace(expression,(_,prefix)=>prefix+dictionary[fragment]);}
  return result;
 }
 function translate(value,code=language){const key=code+'\u0000'+normalize(value);if(!cache.has(key))cache.set(key,lookup(value,code));return cache.get(key);}
 function blocked(element,attributes=false){return !element||Boolean(element.closest('script,style,svg,'+(attributes?'':'textarea,')+'[data-no-translate],[translate="no"],#contact-review-text,#cart-review-text'));}
 function updateText(node){if(blocked(node.parentElement)||!normalize(node.nodeValue))return;let record=textRecords.get(node);if(!record){record={source:node.nodeValue,last:node.nodeValue};textRecords.set(node,record);}else if(node.nodeValue!==record.last){record.source=reverse.get(normalize(node.nodeValue))||node.nodeValue;}
  const parts=record.source.match(/^(\s*)([\s\S]*?)(\s*)$/);const target=parts[1]+translate(parts[2])+parts[3];if(node.nodeValue!==target)node.nodeValue=target;record.last=target;
 }
 function updateAttributes(element){if(blocked(element,true))return;let records=attributeRecords.get(element);if(!records){records=new Map();attributeRecords.set(element,records);}for(const name of ['placeholder','title','aria-label','alt',...(element.matches('meta[name="description"]')?['content']:[])]){if(!element.hasAttribute(name))continue;const value=element.getAttribute(name);let record=records.get(name);if(!record){record={source:value,last:value};records.set(name,record);}else if(value!==record.last){record.source=reverse.get(normalize(value))||value;}const target=translate(record.source);if(target!==value)element.setAttribute(name,target);record.last=target;}}
 function observe(){observer?.observe(document.documentElement,{subtree:true,childList:true,characterData:true,attributes:true,attributeFilter:['placeholder','title','aria-label','alt','content']});}
 function apply(){
  scheduled=false;observer?.disconnect();
  // Explicit option values keep contact topics and other existing JS logic stable.
  document.querySelectorAll('option:not([value])').forEach(option=>option.setAttribute('value',option.textContent));
  const walker=document.createTreeWalker(document.documentElement,NodeFilter.SHOW_TEXT);let node;while((node=walker.nextNode()))updateText(node);
  document.querySelectorAll('[placeholder],[title],[aria-label],[alt],meta[name="description"]').forEach(updateAttributes);
  document.documentElement.lang=language;observe();
 }
 function setLanguage(code){language=Object.hasOwn(catalogs,code)?code:'en';let saved=true;try{localStorage.setItem('foodiehub-language',language);}catch{saved=false;}apply();window.dispatchEvent(new CustomEvent('foodiehub:languagechange',{detail:{language}}));return saved;}
 function translateDraft(draft){const labels=['Name','Email','Phone','Topic','Preferred date','Preferred time','Guests'],fixed=['FOODIEHUB — TABLE ENQUIRY','FOODIEHUB — MESSAGE','Request only — not sent or confirmed.','No additional notes.'];return draft.split('\n').map(line=>{const split=line.indexOf(':');if(split>=0){const label=normalize(line.slice(0,split)),source=labels.find(key=>key.toLowerCase()===label.toLowerCase())||reverse.get(label)||label;if(labels.includes(source))return translate(source)+':'+(source==='Topic'?' '+translate(line.slice(split+1)):line.slice(split+1));return line;}const source=fixed.includes(line)?line:reverse.get(normalize(line))||line;return fixed.includes(source)?translate(source):line;}).join('\n');}
 window.siteI18n={t:translate,setLanguage,getLanguage:()=>language,translateDraft,refresh:apply};
 observer=new MutationObserver(()=>{if(!scheduled){scheduled=true;queueMicrotask(apply);}});
 window.addEventListener('storage',event=>{if(event.key==='foodiehub-language')setLanguage(event.newValue||'en');});
 let saved='en';try{saved=localStorage.getItem('foodiehub-language')||'en';}catch{}setLanguage(saved);
})();
