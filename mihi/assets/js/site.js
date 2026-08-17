// Mi-Hi — minimal interactions (no analytics, no backend)
document.addEventListener('click',function(e){
  var links=document.getElementById('navLinks');
  if(links&&links.classList.contains('open')&&!e.target.closest('#navLinks')&&!e.target.closest('.nav-toggle')){links.classList.remove('open');}
});
// Auto-rotating reviews carousel
(function(){
  var c=document.getElementById('revCarousel');
  if(!c) return;
  var slides=c.querySelectorAll('.rev-slide'), dots=c.querySelectorAll('.rev-dot'), i=0, timer;
  if(slides.length<2) return;
  function show(n){
    slides[i].classList.remove('active'); if(dots[i]) dots[i].classList.remove('active');
    i=(n+slides.length)%slides.length;
    slides[i].classList.add('active'); if(dots[i]) dots[i].classList.add('active');
  }
  function start(){ timer=setInterval(function(){show(i+1);},5500); }
  function stop(){ clearInterval(timer); }
  dots.forEach(function(d){ d.addEventListener('click',function(){ stop(); show(parseInt(d.dataset.i,10)); start(); }); });
  c.addEventListener('mouseenter',stop); c.addEventListener('mouseleave',start);
  start();
})();