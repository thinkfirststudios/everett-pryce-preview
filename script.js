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
      toggle.textContent = open ? 'Close' : 'Menu';
    };
    toggle.addEventListener('click', function () { setOpen(!nav.classList.contains('is-open')); });
    nav.addEventListener('click', function (e) { if (e.target.closest('a')) setOpen(false); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('is-open')) { setOpen(false); toggle.focus(); }
    });
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
