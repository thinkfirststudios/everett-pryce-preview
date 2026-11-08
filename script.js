(function () {
  'use strict';

  // Header turns solid once the page moves
  var head = document.querySelector('[data-head]');
  if (head) {
    var onScroll = function () { head.classList.toggle('is-condensed', window.scrollY > 32); };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // Mobile menu
  var toggle = document.querySelector('[data-nav-toggle]');
  var nav = document.getElementById('nav');
  if (toggle && nav) {
    var setOpen = function (open) {
      nav.classList.toggle('is-open', open);
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Close menu' : 'Menu');
      toggle.querySelector('path').setAttribute('d', open ? 'M6 6l12 12M18 6 6 18' : 'M4 8h16M4 16h16');
    };
    toggle.addEventListener('click', function () { setOpen(!nav.classList.contains('is-open')); });
    nav.addEventListener('click', function (e) { if (e.target.closest('a')) setOpen(false); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('is-open')) { setOpen(false); toggle.focus(); }
    });
  }

  // Stage: one house at a time, stepped by the previous and next buttons
  var stage = document.querySelector('[data-stage]');
  if (stage) {
    var slides = Array.prototype.slice.call(stage.querySelectorAll('[data-slide]'));
    var caption = stage.querySelector('.stage__caption');
    var at = 0;
    var showSlide = function (i) {
      at = (i + slides.length) % slides.length;
      slides.forEach(function (s, n) {
        s.classList.toggle('is-on', n === at);
        s.setAttribute('aria-hidden', String(n !== at));
      });
      var d = slides[at].dataset;
      stage.querySelector('[data-stage-title]').textContent = d.title;
      stage.querySelector('[data-stage-place]').textContent = d.place;
      stage.querySelector('[data-stage-spec]').innerHTML = d.spec.split('|').map(function (x) { return '<li>' + x + '</li>'; }).join('');
      stage.querySelector('[data-stage-prev-name]').textContent = slides[(at - 1 + slides.length) % slides.length].dataset.title;
      stage.querySelector('[data-stage-next-name]').textContent = slides[(at + 1) % slides.length].dataset.title;
      caption.classList.remove('is-swapping');
      void caption.offsetWidth;
      caption.classList.add('is-swapping');
    };
    slides.forEach(function (s, n) { if (n) s.setAttribute('aria-hidden', 'true'); });
    stage.querySelector('[data-stage-prev]').addEventListener('click', function () { showSlide(at - 1); });
    stage.querySelector('[data-stage-next]').addEventListener('click', function () { showSlide(at + 1); });
  }

  // About reel: the photograph in focus sits in the middle, its neighbours blurred
  var reel = document.querySelector('[data-reel]');
  if (reel) {
    var track = reel.querySelector('[data-reel-track]');
    var frames = Array.prototype.slice.call(track.children);
    var on = Math.max(0, frames.findIndex(function (f) { return f.classList.contains('is-on'); }));
    var place = function () {
      var f = frames[on];
      track.style.transform = 'translateX(' + ((reel.clientWidth - f.offsetWidth) / 2 - f.offsetLeft) + 'px)';
    };
    var go = function (i) {
      on = (i + frames.length) % frames.length;
      frames.forEach(function (f, n) { f.classList.toggle('is-on', n === on); });
      place();
    };
    reel.querySelector('[data-reel-prev]').addEventListener('click', function () { go(on - 1); });
    reel.querySelector('[data-reel-next]').addEventListener('click', function () { go(on + 1); });
    window.addEventListener('resize', place);
    place();
  }

  // Houses rail: one panel open at a time
  var rail = document.querySelector('[data-rail]');
  if (rail) {
    var items = Array.prototype.slice.call(rail.querySelectorAll('.rail__item'));
    var current = 0;
    var open = function (i) {
      current = (i + items.length) % items.length;
      items.forEach(function (item, n) {
        item.classList.toggle('is-open', n === current);
        item.querySelector('button').setAttribute('aria-expanded', String(n === current));
      });
    };
    items.forEach(function (item, n) { item.querySelector('button').addEventListener('click', function () { open(n); }); });
    rail.querySelector('[data-rail-prev]').addEventListener('click', function () { open(current - 1); });
    rail.querySelector('[data-rail-next]').addEventListener('click', function () { open(current + 1); });
  }

  // Form: a name and one way to reach you, nothing else required
  var form = document.querySelector('[data-form]');
  if (form) {
    var name = form.querySelector('#f-name');
    var email = form.querySelector('#f-email');
    var phone = form.querySelector('#f-phone');
    var show = function (input, id, message) {
      var el = document.getElementById(id);
      el.textContent = message;
      el.hidden = !message;
      input.setAttribute('aria-invalid', message ? 'true' : 'false');
    };
    form.addEventListener('submit', function (e) {
      var who = name.value.trim();
      var mail = email.value.trim();
      var tel = phone.value.trim();
      var mailBad = mail && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(mail);
      show(name, 'e-name', who ? '' : 'Please add your name.');
      show(email, 'e-email', mailBad ? 'That email address looks incomplete.' : '');
      show(phone, 'e-contact', mail || tel ? '' : 'Please add an email or a phone number so a reply can reach you.');
      if (!who || mailBad || (!mail && !tel)) {
        e.preventDefault();
        form.querySelector('[aria-invalid="true"]').focus();
        return;
      }
      e.preventDefault();
      window.location.href = form.getAttribute('action');
    });
  }
})();
