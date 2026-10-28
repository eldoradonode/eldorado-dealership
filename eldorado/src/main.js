(function(){
var d=document,$=function(s,r){return (r||d).querySelector(s)},$$=function(s,r){return [].slice.call((r||d).querySelectorAll(s))};
var rm=matchMedia('(prefers-reduced-motion: reduce)').matches,seq=$('.seq'),frames=$$('.frame');
if(seq){if(rm)seq.removeAttribute('data-sc-act');else if(matchMedia('(max-width:700px)').matches)seq.setAttribute('data-sc-span','4.2')}
if(window.ScrollCraft)ScrollCraft.mount(d.body);
/* frame loading: hero is eager, the rest load in order, on idle or as the visitor scrolls */
function load(i){var f=frames[i];if(!f)return;var p=$('picture[data-defer]',f);if(!p||p.dataset.done)return;p.dataset.done=1;$$('source',p).forEach(function(s){s.srcset=s.dataset.srcset});var im=$('img',p);im.src=im.dataset.src}
function prog(){var r=seq.getBoundingClientRect(),h=r.height-innerHeight;return h>0?Math.min(.999,Math.max(0,-r.top/h)):0}
if(seq&&frames.length){
 var pinned=seq.hasAttribute('data-sc-act'),slow=navigator.connection&&(navigator.connection.saveData||/2g/.test(navigator.connection.effectiveType||''));
 if(!pinned&&'IntersectionObserver' in window){var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){load(frames.indexOf(e.target));io.unobserve(e.target)}})},{rootMargin:'700px 0px'});frames.forEach(function(f){io.observe(f)})}
 else if(pinned){var tick=0,cur=-1;var on=function(){if(tick)return;tick=requestAnimationFrame(function(){tick=0;var i=Math.floor(prog()*frames.length);load(i);load(i+1);load(i+2);if(i!==cur){cur=i;frames.forEach(function(f,k){if(k===i)f.removeAttribute('inert');else f.setAttribute('inert','')})}})};
  addEventListener('scroll',on,{passive:true});addEventListener('resize',on);on();
  var idle=function(i){if(i>=frames.length)return;load(i);setTimeout(function(){idle(i+1)},450)};
  var go=function(){if(!slow)setTimeout(function(){idle(1)},300)};d.readyState==='complete'?go():addEventListener('load',go)}
}
/* collection filter */
var tiles=$$('.tile'),pills=$$('.pill'),cnt=$('#count'),emp=$('#empty'),LBL={all:'',sedan:' \u00b7 Sedans',suv:' \u00b7 SUVs'};
function setFilter(f,go){pills.forEach(function(p){p.setAttribute('aria-pressed',p.dataset.f===f?'true':'false')});var n=0;tiles.forEach(function(t){var s=f==='all'||t.dataset.body===f;t.hidden=!s;if(s)n++});cnt.textContent=n+(n===1?' vehicle':' vehicles')+LBL[f];emp.hidden=n!==0;if(go)$('#collection').scrollIntoView()}
pills.forEach(function(p){p.addEventListener('click',function(){setFilter(p.dataset.f)})});
$$('[data-filter]').forEach(function(a){a.addEventListener('click',function(e){e.preventDefault();setFilter(a.dataset.filter,true)})});
/* mobile menu */
var menu=$('#menu'),mb=$('#menu-btn');
function om(o){menu.classList.toggle('open',o);mb.setAttribute('aria-expanded',o?'true':'false');d.body.style.overflow=o?'hidden':'';(o?$('.menu-x'):mb).focus()}
mb.addEventListener('click',function(){om(true)});$('.menu-x').addEventListener('click',function(){om(false)});
$$('a',menu).forEach(function(a){a.addEventListener('click',function(){om(false)})});
d.addEventListener('keydown',function(e){if(e.key==='Escape'&&menu.classList.contains('open'))om(false)});
/* whatsapp not configured yet */
var dlg=$('#wa-missing');$$('[data-wa-missing]').forEach(function(b){b.addEventListener('click',function(){if(window.console)console.warn('ELDORADO: set "whatsapp" in src/site.config.json');dlg.showModal()})});
/* settings from config.js: WhatsApp links and contact lines, no rebuild needed */
var C=window.ELDORADO||{},num=String(C.whatsapp||'').replace(/\D/g,'');
if(num)$$('[data-wa-missing]').forEach(function(b){var a=d.createElement('a');a.className=b.className;a.textContent=b.textContent;a.href='https://wa.me/'+num+'?text='+encodeURIComponent(b.dataset.msg||'');a.target='_blank';a.rel='noopener';b.replaceWith(a)});
var cl=$('#contact-lines');
if(cl&&!cl.children.length){var add=function(t,h){var e=d.createElement(h?'a':'span');e.textContent=t;if(h)e.href=h;cl.appendChild(e)};
 if(C.email)add(C.email,'mailto:'+C.email);if(C.phone)add(C.phone,'tel:'+String(C.phone).replace(/[^\d+]/g,''));if(C.address)add(C.address);if(C.hours)add(C.hours);if(cl.children.length)cl.hidden=false}
})();
