(function(){
var d=document,$=function(s,r){return(r||d).querySelector(s)},$$=function(s,r){return[].slice.call((r||d).querySelectorAll(s))};
var grid=$('#grid'),tiles=$$('.tile',grid),cnt=$('#count'),emp=$('#empty'),chips=$('#chips'),sort=$('#sort');
var F={q:$('#q'),make:$('#f-make'),body:$('#f-body'),year:$('#f-year'),cond:$('#f-cond'),max:$('#f-max')},LBL={q:'Search',make:'Make',body:'Type',year:'Year',cond:'Condition',max:'Budget'};
function val(k){return k==='q'?F.q.value.trim():F[k].value}
function readURL(){var p=new URLSearchParams(location.search);Object.keys(F).forEach(function(k){var v=p.get(k);if(v!==null)F[k].value=v});sort.value=p.get('sort')||'new';if(!sort.value)sort.value='new'}
function writeURL(){var p=new URLSearchParams();Object.keys(F).forEach(function(k){if(val(k))p.set(k,val(k))});if(sort.value!=='new')p.set('sort',sort.value);history.replaceState(null,'',location.pathname+(p.toString()?'?'+p:''))}
var CMP={new:function(a,b){return b.dataset.added.localeCompare(a.dataset.added)},plow:function(a,b){return a.dataset.price-b.dataset.price},phigh:function(a,b){return b.dataset.price-a.dataset.price},year:function(a,b){return b.dataset.year-a.dataset.year||b.dataset.added.localeCompare(a.dataset.added)},name:function(a,b){return a.dataset.name.localeCompare(b.dataset.name)}};
function apply(){
 var q=val('q').toLowerCase(),n=0;
 tiles.forEach(function(t){var s=(!q||t.dataset.text.indexOf(q)>-1)&&(!val('make')||t.dataset.make===val('make'))&&(!val('body')||t.dataset.body===val('body'))&&(!val('year')||t.dataset.year===val('year'))&&(!val('cond')||t.dataset.cond===val('cond'))&&(!val('max')||+t.dataset.price<=+val('max'));t.hidden=!s;if(s)n++});
 tiles.slice().sort(CMP[sort.value]||CMP.new).forEach(function(t){grid.appendChild(t)});
 cnt.textContent=n+(n===1?' vehicle':' vehicles')+(n===tiles.length?'':' found');emp.hidden=n!==0;grid.hidden=n===0;
 chips.textContent='';Object.keys(F).forEach(function(k){if(!val(k))return;var b=d.createElement('button');b.type='button';b.className='chip';var t=k==='q'?'\u201c'+val(k)+'\u201d':k==='body'?F.body.options[F.body.selectedIndex].text:k==='max'?F.max.options[F.max.selectedIndex].text:val(k);b.textContent=LBL[k]+': '+t;b.setAttribute('aria-label','Remove filter '+LBL[k]+': '+t);b.addEventListener('click',function(){F[k].value='';apply()});chips.appendChild(b)});
 writeURL();
}
function reset(){Object.keys(F).forEach(function(k){F[k].value=''});sort.value='new';apply()}
Object.keys(F).forEach(function(k){F[k].addEventListener(k==='q'?'input':'change',apply)});sort.addEventListener('change',apply);
$('#reset').addEventListener('click',reset);$('#reset2').addEventListener('click',reset);
var fb=$('#fbtn'),fp=$('#filters');fb.addEventListener('click',function(){var o=!fp.classList.contains('open');fp.classList.toggle('open',o);fb.setAttribute('aria-expanded',o?'true':'false')});
readURL();apply();
/* compare: up to three vehicles */
var DATA={};JSON.parse($('#cmpdata').textContent).forEach(function(v){DATA[v.slug]=v});
var sel=[],cbar=$('#cbar'),ctext=$('#ctext'),copen=$('#copen'),dlg=$('#cdlg');
function cupdate(){cbar.hidden=!sel.length;ctext.textContent=sel.length+' of 3 selected'+(sel.length<2?'. Choose at least 2.':'');copen.disabled=sel.length<2}
$$('[data-cmp]').forEach(function(c){c.addEventListener('change',function(){var s=c.dataset.cmp;if(c.checked){if(sel.length>=3){c.checked=false;ctext.textContent='You can compare up to 3 vehicles.';return}sel.push(s)}else sel=sel.filter(function(x){return x!==s});cupdate()})});
$('#cclear').addEventListener('click',function(){sel=[];$$('[data-cmp]').forEach(function(c){c.checked=false});cupdate()});
copen.addEventListener('click',function(){
 var rows=[['Price','price'],['Model year','year'],['Condition','cond'],['Body type','body'],['Mileage','mileage'],['Transmission','trans'],['Engine','engine'],['Drivetrain','drive'],['Fuel','fuel'],['Colour','color']],t=d.createElement('table');
 var thead=d.createElement('thead'),tr=d.createElement('tr');tr.appendChild(d.createElement('th'));
 sel.forEach(function(s){var th=d.createElement('th');th.scope='col';var a=d.createElement('a');a.href='/vehicles/'+s+'/';a.textContent=DATA[s].name;a.style.color='inherit';th.appendChild(a);tr.appendChild(th)});thead.appendChild(tr);t.appendChild(thead);
 var tb=d.createElement('tbody');rows.forEach(function(r){var tr=d.createElement('tr'),th=d.createElement('th');th.scope='row';th.textContent=r[0];tr.appendChild(th);sel.forEach(function(s){var td=d.createElement('td');td.textContent=DATA[s][r[1]]||'\u2014';tr.appendChild(td)});tb.appendChild(tr)});t.appendChild(tb);
 var w=$('#ctable');w.textContent='';w.appendChild(t);dlg.showModal()});
dlg.addEventListener('click',function(e){if(e.target===dlg||e.target.closest('[data-close]'))dlg.close()});
cupdate();
})();
