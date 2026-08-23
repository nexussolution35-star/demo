/* Mi-Hi Solid Wood Products — interactions (vanilla JS, no framework, no analytics) */
(function () {
  'use strict';
  var doc = document;
  doc.body.classList.add('js'); // enables reveal-on-scroll; without JS, content stays visible

  /* ---------- D1: hide-on-scroll / reveal-on-scroll nav ---------- */
  var header = doc.querySelector('.site-header');
  var onHero = header && header.classList.contains('on-hero');
  var lastY = window.pageYOffset;
  var ticking = false;
  function onScroll() {
    var y = window.pageYOffset;
    if (!header) return;
    // top state (transparent over hero)
    if (y < 40) { header.classList.add('at-top'); }
    else { header.classList.remove('at-top'); }
    // hide on down, show on up
    if (y > lastY && y > 220) { header.classList.add('nav-hidden'); }
    else { header.classList.remove('nav-hidden'); }
    lastY = y;
    ticking = false;
  }
  window.addEventListener('scroll', function () {
    if (!ticking) { window.requestAnimationFrame(onScroll); ticking = true; }
  }, { passive: true });
  onScroll();

  /* ---------- services dropdown ---------- */
  doc.querySelectorAll('.has-dropdown').forEach(function (dd) {
    var btn = dd.querySelector('.nav-link');
    if (!btn) return;
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      var open = dd.classList.contains('open');
      doc.querySelectorAll('.has-dropdown.open').forEach(function (o) { o.classList.remove('open'); });
      if (!open) dd.classList.add('open');
    });
  });
  doc.addEventListener('click', function (e) {
    if (!e.target.closest('.has-dropdown')) {
      doc.querySelectorAll('.has-dropdown.open').forEach(function (o) { o.classList.remove('open'); });
    }
  });

  /* ---------- mobile menu ---------- */
  var burger = doc.querySelector('.hamburger');
  var mobile = doc.querySelector('.mobile-menu');
  var overlay = doc.querySelector('.overlay');
  function closeMobile() { if (mobile) mobile.classList.remove('open'); if (overlay) overlay.classList.remove('open'); doc.body.style.overflow = ''; }
  if (burger) burger.addEventListener('click', function () {
    mobile.classList.add('open'); overlay.classList.add('open'); doc.body.style.overflow = 'hidden';
  });
  var mmClose = doc.querySelector('.mm-close');
  if (mmClose) mmClose.addEventListener('click', closeMobile);
  if (overlay) overlay.addEventListener('click', closeMobile);

  /* ---------- C1: synced auto-cycling hero (image + text change together) ---------- */
  var hero = doc.querySelector('.hero');
  if (hero) {
    var slides = hero.querySelectorAll('.hero-slide');
    var groups = hero.querySelectorAll('.hero-text-group');
    var dots = hero.querySelectorAll('.hero-dot');
    var idx = 0, timer = null, DELAY = 6000;
    function show(n) {
      idx = (n + slides.length) % slides.length;
      slides.forEach(function (s, i) { s.classList.toggle('active', i === idx); });
      groups.forEach(function (g, i) { g.classList.toggle('active', i === idx); });
      dots.forEach(function (d, i) { d.classList.toggle('active', i === idx); });
    }
    function next() { show(idx + 1); }
    function start() { stop(); timer = setInterval(next, DELAY); }
    function stop() { if (timer) clearInterval(timer); }
    dots.forEach(function (d, i) { d.addEventListener('click', function () { show(i); start(); }); });
    show(0); start();
    hero.addEventListener('mouseenter', stop);
    hero.addEventListener('mouseleave', start);
    doc.addEventListener('visibilitychange', function () { doc.hidden ? stop() : start(); });
  }

  /* ---------- gallery filter + lightbox ---------- */
  var filters = doc.querySelectorAll('.filter-btn');
  var items = doc.querySelectorAll('.gallery-item');
  filters.forEach(function (f) {
    f.addEventListener('click', function () {
      filters.forEach(function (b) { b.classList.remove('active'); });
      f.classList.add('active');
      var cat = f.getAttribute('data-filter');
      items.forEach(function (it) {
        var show = cat === 'all' || it.getAttribute('data-cat') === cat;
        it.style.display = show ? '' : 'none';
      });
    });
  });
  var lightbox = doc.querySelector('.lightbox');
  if (lightbox) {
    var lbImg = lightbox.querySelector('img');
    var visible = [];
    function refreshVisible() { visible = Array.prototype.filter.call(items, function (it) { return it.style.display !== 'none'; }); }
    var cur = 0;
    function openLb(el) { refreshVisible(); cur = visible.indexOf(el); var src = el.getAttribute('data-full') || el.querySelector('img').src; lbImg.src = src; lightbox.classList.add('open'); doc.body.style.overflow = 'hidden'; }
    function lbShow(d) { cur = (cur + d + visible.length) % visible.length; var el = visible[cur]; lbImg.src = el.getAttribute('data-full') || el.querySelector('img').src; }
    items.forEach(function (it) { it.addEventListener('click', function () { openLb(it); }); });
    lightbox.querySelector('.lb-close').addEventListener('click', function () { lightbox.classList.remove('open'); doc.body.style.overflow = ''; });
    lightbox.querySelector('.lb-prev').addEventListener('click', function () { lbShow(-1); });
    lightbox.querySelector('.lb-next').addEventListener('click', function () { lbShow(1); });
    lightbox.addEventListener('click', function (e) { if (e.target === lightbox) { lightbox.classList.remove('open'); doc.body.style.overflow = ''; } });
    doc.addEventListener('keydown', function (e) {
      if (!lightbox.classList.contains('open')) return;
      if (e.key === 'Escape') { lightbox.classList.remove('open'); doc.body.style.overflow = ''; }
      if (e.key === 'ArrowLeft') lbShow(-1);
      if (e.key === 'ArrowRight') lbShow(1);
    });
  }

  /* ---------- FAQ accordion ---------- */
  doc.querySelectorAll('.faq-q').forEach(function (q) {
    q.addEventListener('click', function () {
      var item = q.closest('.faq-item');
      var ans = item.querySelector('.faq-a');
      var open = item.classList.contains('open');
      if (open) { item.classList.remove('open'); ans.style.maxHeight = null; }
      else { item.classList.add('open'); ans.style.maxHeight = ans.scrollHeight + 'px'; }
    });
  });

  /* ---------- smooth-scroll for in-page CTA anchors ---------- */
  doc.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var id = a.getAttribute('href');
      if (id.length < 2) return;
      var t = doc.querySelector(id);
      if (t) { e.preventDefault(); closeMobile(); window.scrollTo({ top: t.getBoundingClientRect().top + window.pageYOffset - 70, behavior: 'smooth' }); }
    });
  });

  /* ---------- reveal on scroll ---------- */
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    doc.querySelectorAll('.reveal').forEach(function (el) { io.observe(el); });
  } else {
    doc.querySelectorAll('.reveal').forEach(function (el) { el.classList.add('in'); });
  }

  /* ---------- forms: placeholder UI only (Back-End lane wires later) ---------- */
  doc.querySelectorAll('form[data-placeholder]').forEach(function (f) {
    f.addEventListener('submit', function (e) {
      e.preventDefault();
      var note = f.querySelector('.form-success');
      if (note) { note.style.display = 'block'; }
      else { alert('Thank you — this is a demo form. Your enquiry handler will be connected before launch.'); }
      f.reset();
    });
  });
})();
