(function(){
var d=document,$=function(s,r){return(r||d).querySelector(s)},$$=function(s,r){return[].slice.call((r||d).querySelectorAll(s))};
var g=$('[data-gallery]');if(!g)return;
var figs=$$('.gfig',g),th=$$('[data-t]',g),cur=0;
function load(i){var f=figs[i];if(!f)return;var p=$('picture[data-defer]',f);if(!p||p.dataset.done)return;p.dataset.done=1;$$('source',p).forEach(function(s){s.srcset=s.dataset.srcset});var im=$('img',p);im.src=im.dataset.src}
function show(i,focus){i=(i+figs.length)%figs.length;cur=i;figs.forEach(function(f,k){f.hidden=k!==i});th.forEach(function(b,k){b.setAttribute('aria-pressed',k===i?'true':'false')});load(i);load(i+1);if(focus&&th[i])th[i].focus()}
th.forEach(function(b,i){b.addEventListener('click',function(){show(i)});b.addEventListener('keydown',function(e){if(e.key==='ArrowRight'){e.preventDefault();show(cur+1,true)}if(e.key==='ArrowLeft'){e.preventDefault();show(cur-1,true)}})});
var st=$('.stage',g),x0=null;st.addEventListener('touchstart',function(e){x0=e.touches[0].clientX},{passive:true});st.addEventListener('touchend',function(e){if(x0===null)return;var dx=e.changedTouches[0].clientX-x0;if(Math.abs(dx)>40)show(cur+(dx<0?1:-1));x0=null});
load(1);addEventListener('load',function(){setTimeout(function(){figs.forEach(function(f,i){load(i)})},600)});
})();
