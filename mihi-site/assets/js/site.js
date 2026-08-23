// Mi-Hi — minimal interactions (no analytics, no backend)
document.addEventListener('click',function(e){
  var links=document.getElementById('navLinks');
  if(links&&links.classList.contains('open')&&!e.target.closest('#navLinks')&&!e.target.closest('.nav-toggle')){links.classList.remove('open');}
});

// FAQ accordion
document.querySelectorAll('.faq-q').forEach(function(q){
  q.addEventListener('click',function(){
    var item=q.closest('.faq-item');
    var a=item.querySelector('.faq-a');
    var open=item.classList.toggle('open');
    a.style.maxHeight=open?(a.scrollHeight+'px'):null;
  });
});

// Gallery lightbox
(function(){
  var lb=document.getElementById('lightbox');
  if(!lb)return;
  var img=lb.querySelector('img');
  var items=[].slice.call(document.querySelectorAll('.gallery-grid a[data-full]'));
  var cur=0;
  function open(i){cur=i;img.src=items[i].getAttribute('data-full');lb.classList.add('open');document.body.style.overflow='hidden';}
  function show(d){cur=(cur+d+items.length)%items.length;img.src=items[cur].getAttribute('data-full');}
  items.forEach(function(a,i){a.addEventListener('click',function(e){e.preventDefault();open(i);});});
  lb.querySelector('.lb-close').addEventListener('click',function(){lb.classList.remove('open');document.body.style.overflow='';});
  lb.querySelector('.lb-prev').addEventListener('click',function(){show(-1);});
  lb.querySelector('.lb-next').addEventListener('click',function(){show(1);});
  lb.addEventListener('click',function(e){if(e.target===lb){lb.classList.remove('open');document.body.style.overflow='';}});
  document.addEventListener('keydown',function(e){if(!lb.classList.contains('open'))return;if(e.key==='Escape'){lb.classList.remove('open');document.body.style.overflow='';}if(e.key==='ArrowLeft')show(-1);if(e.key==='ArrowRight')show(1);});
})();

// Placeholder forms — no backend, no analytics
document.querySelectorAll('form[data-placeholder]').forEach(function(f){
  f.addEventListener('submit',function(e){
    e.preventDefault();
    var ok=f.querySelector('.form-success');
    if(ok)ok.style.display='block';
    f.reset();
  });
});
