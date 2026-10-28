(function(){
var d=document,$=function(s,r){return(r||d).querySelector(s)},$$=function(s,r){return[].slice.call((r||d).querySelectorAll(s))};
/* mobile menu */
var menu=$('#menu'),mb=$('#menu-btn');
function om(o){menu.classList.toggle('open',o);mb.setAttribute('aria-expanded',o?'true':'false');d.body.style.overflow=o?'hidden':'';(o?$('.menu-x'):mb).focus()}
if(menu&&mb){mb.addEventListener('click',function(){om(true)});$('.menu-x').addEventListener('click',function(){om(false)});
$$('a',menu).forEach(function(a){a.addEventListener('click',function(){om(false)})});
d.addEventListener('keydown',function(e){if(e.key==='Escape'&&menu.classList.contains('open'))om(false)})}
/* settings from config.js: WhatsApp links and contact lines, no rebuild needed */
var C=window.ELDORADO||{},num=String(C.whatsapp||'').replace(/\D/g,''),dlg=$('#wa-missing');
if(num)$$('[data-wa-missing]').forEach(function(b){var a=d.createElement('a');a.className=b.className;a.textContent=b.textContent;a.href='https://wa.me/'+num+'?text='+encodeURIComponent(b.dataset.msg||'');a.target='_blank';a.rel='noopener';b.replaceWith(a)});
$$('[data-wa-missing]').forEach(function(b){b.addEventListener('click',function(){if(dlg)dlg.showModal()})});
/* date inputs: tomorrow to 60 days ahead, Lagos time */
function ymd(p){return new Date(Date.now()+3600e3+p*864e5).toISOString().slice(0,10)}
$$('[data-mindate]').forEach(function(i){i.min=ymd(1);i.max=ymd(60)});
/* gentle reveal on plain pages (the home page uses the ScrollCraft engine instead) */
if(!$('[data-sc-act]')&&'IntersectionObserver' in window&&!matchMedia('(prefers-reduced-motion: reduce)').matches){
 var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{rootMargin:'0px 0px -8% 0px'});
 $$('.sec .head,.card,.journey li,.specs>div,.faq details,.vdetail>div,.fwrap>div:first-child').forEach(function(el){if(el.getBoundingClientRect().top>innerHeight*.92){el.setAttribute('data-reveal','');io.observe(el)}})}
})();
