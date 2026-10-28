(function(){
var d=document,$=function(s,r){return(r||d).querySelector(s)},$$=function(s,r){return[].slice.call((r||d).querySelectorAll(s))};
var rm=matchMedia('(prefers-reduced-motion: reduce)').matches,seq=$('.seq'),frames=$$('.frame');
if(seq){if(rm)seq.removeAttribute('data-sc-act');else if(matchMedia('(max-width:700px)').matches)seq.setAttribute('data-sc-span','4.2')}
if(window.ScrollCraft)ScrollCraft.mount(d.body);
/* frame loading: the hero is eager, the rest load in order, on idle or as the visitor scrolls */
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
function setFilter(f){pills.forEach(function(p){p.setAttribute('aria-pressed',p.dataset.f===f?'true':'false')});var n=0;tiles.forEach(function(t){var s=f==='all'||t.dataset.body===f;t.hidden=!s;if(s)n++});cnt.textContent=n+(n===1?' vehicle':' vehicles')+LBL[f];emp.hidden=n!==0}
pills.forEach(function(p){p.addEventListener('click',function(){setFilter(p.dataset.f)})});
})();
