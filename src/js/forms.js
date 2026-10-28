import { validate } from '../../lib/validate.mjs';
(function(){
var d=document,$=function(s,r){return(r||d).querySelector(s)},$$=function(s,r){return[].slice.call((r||d).querySelectorAll(s))};
var C=window.ELDORADO||{},EP=C.endpoint||'/api/enquiry',WA=String(C.whatsapp||'').replace(/\D/g,'');
$$('form[data-form]').forEach(init);
function init(f){
 var type=f.dataset.form,q=new URLSearchParams(location.search),v=q.get('vehicle');
 if(v){if(f.elements.vehicle&&!f.elements.vehicle.value)f.elements.vehicle.value=v;if(f.elements.wantVehicle&&!f.elements.wantVehicle.value)f.elements.wantVehicle.value=v}
 if(q.get('date')&&f.elements.date&&!f.elements.date.value)f.elements.date.value=q.get('date');
 f.addEventListener('submit',function(e){e.preventDefault();submit(f,type)});
 f.addEventListener('input',function(e){clearErr(e.target)});f.addEventListener('change',function(e){clearErr(e.target)});
}
function data(f){var o={};new FormData(f).forEach(function(v,k){o[k]=typeof v==='string'?v:''});if(f.elements.licence)o.licence=f.elements.licence.checked?'on':'';return o}
function errEl(k){return d.getElementById(k+'-err')}
function clearErr(el){if(!el||!el.name)return;var e=errEl(el.name);if(e)e.textContent='';var fl=el.closest('.field');if(fl)fl.classList.remove('bad');el.removeAttribute('aria-invalid')}
function showErrors(f,errors){var first=null;Object.keys(errors).forEach(function(k){var el=f.elements[k],e=errEl(k);if(e)e.textContent=errors[k];if(el){var fl=el.closest&&el.closest('.field');if(fl)fl.classList.add('bad');el.setAttribute('aria-invalid','true');el.setAttribute('aria-describedby',k+'-err');if(!first)first=el}});if(first)first.focus()}
function status(f,cls,node){var s=$('.form-status',f);s.hidden=false;s.className='form-status'+(cls?' '+cls:'');s.textContent='';(Array.isArray(node)?node:[node]).forEach(function(n){s.appendChild(typeof n==='string'?d.createTextNode(n):n)});return s}
function el(tag,txt,cls){var e=d.createElement(tag);if(txt)e.textContent=txt;if(cls)e.className=cls;return e}
function vname(f,slug){if(!slug)return '';var o=$('option[value="'+slug+'"]',f);return o?o.textContent.replace(/\s\u00b7\s\u20a6.*$/,''):slug}
function summary(f,type,c){
 if(type==='swap')return [['Your vehicle',[c.curYear,c.curMake,c.curModel].filter(Boolean).join(' ')+(c.curMileage?', '+Number(c.curMileage).toLocaleString('en-NG')+' km':'')+', '+c.curCondition],['Interested in',vname(f,c.wantVehicle)||c.wantOther||'Not decided yet'],['Contact',c.name+', '+c.phone+' ('+c.contactMethod+')']];
 if(type==='test-drive')return [['Vehicle',vname(f,c.vehicle)],['Day',c.date],['Time window',c.slot],['Contact',c.name+', '+c.phone]];
 return [['Subject',c.subject],['Contact',c.name+', '+c.phone]];
}
function waText(f,type,c){
 var s=summary(f,type,c).map(function(r){return r[0]+': '+r[1]}).join('. ');
 var h=type==='swap'?"Hello ELDORADO, I'd like to ask about a vehicle swap. ":type==='test-drive'?"Hello ELDORADO, I'd like to book a test drive. ":"Hello ELDORADO, ";
 return (h+s+(c.message?'. '+c.message.slice(0,400):'')).slice(0,900);
}
function lock(b,on){b.disabled=on;b.setAttribute('aria-busy',on?'true':'false')}
function success(f,type,c){
 var first=(c.name||'').split(' ')[0],box=el('div','','form-status'),h=el('h3',type==='contact'?'Message sent.':'Thank you, '+first+'.'),p=el('p');
 if(type==='swap')p.textContent='We have received your swap enquiry and will contact you by '+c.contactMethod.toLowerCase()+'. This is not an approval of a swap: any valuation, inspection, eligibility and final arrangement are subject to dealership assessment.';
 else if(type==='test-drive')p.textContent='We have received your test drive request. Your drive is not confirmed until we reply by WhatsApp or phone.';
 else p.textContent='We have received your message and will reply as soon as we can.';
 var ul=el('ul','','pts pts--l');summary(f,type,c).forEach(function(r){ul.appendChild(el('li',r[0]+': '+r[1]))});
 box.appendChild(h);box.appendChild(p);box.appendChild(ul);box.setAttribute('tabindex','-1');
 f.replaceWith(box);box.focus();box.scrollIntoView({block:'center',behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'});
}
function fail(f,type,c,msg){
 var nodes=[el('h3','We could not send that just now.'),el('p',msg||'Please try again in a moment, or send your details on WhatsApp instead.')];
 if(WA){var a=el('a','Send on WhatsApp','btn');a.href='https://wa.me/'+WA+'?text='+encodeURIComponent(waText(f,type,c));a.target='_blank';a.rel='noopener';var r=el('div','','row');r.appendChild(a);nodes.push(r)}
 status(f,'bad',nodes);
}
function submit(f,type){
 var b=$('button[type=submit]',f),raw=data(f);$$('.field.bad',f).forEach(function(x){x.classList.remove('bad')});$$('.err',f).forEach(function(x){x.textContent=''});
 if(raw.company){success(f,type,validate(type,raw).clean);return}
 var r=validate(type,raw);
 if(Object.keys(r.errors).length){showErrors(f,r.errors);status(f,'bad',[el('p','Please check the highlighted fields and try again.')]);return}
 lock(b,true);status(f,'',[el('p','Sending your enquiry\u2026')]);
 fetch(EP,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({type:type,data:raw})})
 .then(function(res){return res.json().catch(function(){return{}}).then(function(j){return{res:res,j:j}})})
 .then(function(o){if(o.res.ok&&o.j&&o.j.ok)success(f,type,r.clean);else if(o.res.status===422&&o.j&&o.j.errors){showErrors(f,o.j.errors);status(f,'bad',[el('p','Please check the highlighted fields and try again.')]);lock(b,false)}else{fail(f,type,r.clean);lock(b,false)}})
 .catch(function(){fail(f,type,r.clean);lock(b,false)});
}
})();
