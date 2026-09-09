/* =========================================================
   E&S Pressure Washing — script.js
   Vanilla JS. No external APIs, no dependencies.
   ========================================================= */
(function () {
  'use strict';

  var BUSINESS_EMAIL = 'espressurewashing00@gmail.com';

  /* ---------- Current year in footer ---------- */
  var yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }

  /* ---------- Mobile navigation ---------- */
  var navToggle = document.getElementById('navToggle');
  var nav = document.getElementById('primaryNav');
  var backdrop = null;

  function createBackdrop() {
    if (backdrop) return backdrop;
    backdrop = document.createElement('div');
    backdrop.className = 'nav-backdrop';
    backdrop.addEventListener('click', closeNav);
    document.body.appendChild(backdrop);
    return backdrop;
  }

  function openNav() {
    if (!nav || !navToggle) return;
    nav.classList.add('is-open');
    createBackdrop().classList.add('is-open');
    navToggle.setAttribute('aria-expanded', 'true');
    navToggle.setAttribute('aria-label', 'Close menu');
    document.body.classList.add('nav-open');
  }

  function closeNav() {
    if (!nav || !navToggle) return;
    nav.classList.remove('is-open');
    if (backdrop) backdrop.classList.remove('is-open');
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.setAttribute('aria-label', 'Open menu');
    document.body.classList.remove('nav-open');
  }

  if (navToggle && nav) {
    navToggle.addEventListener('click', function () {
      if (nav.classList.contains('is-open')) {
        closeNav();
      } else {
        openNav();
      }
    });

    // Close when a nav link is tapped
    nav.addEventListener('click', function (e) {
      var link = e.target.closest('a');
      if (link) closeNav();
    });

    // Close on Escape
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('is-open')) {
        closeNav();
        navToggle.focus();
      }
    });

    // Reset when resizing back to desktop
    window.addEventListener('resize', function () {
      if (window.innerWidth > 900 && nav.classList.contains('is-open')) closeNav();
    });
  }

  /* ---------- Sticky header shadow ---------- */
  var header = document.getElementById('siteHeader');
  if (header) {
    var onScroll = function () {
      if (window.scrollY > 12) {
        header.classList.add('is-stuck');
      } else {
        header.classList.remove('is-stuck');
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ---------- FAQ: accordion (one open at a time) ---------- */
  var faqItems = Array.prototype.slice.call(
    document.querySelectorAll('#faqList .faq__item')
  );
  faqItems.forEach(function (item) {
    item.addEventListener('toggle', function () {
      if (!item.open) return;
      faqItems.forEach(function (other) {
        if (other !== item) other.open = false;
      });
    });
  });

  /* ---------- Scroll reveal ---------- */
  var revealTargets = document.querySelectorAll(
    '.section__head, .card, .step, .quote, .commercial, .why__media, .why__copy, .areas li, .faq__item, .info-card, .hours, .contact__form-wrap, .trust__item'
  );

  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -50px 0px' }
    );

    Array.prototype.forEach.call(revealTargets, function (el, i) {
      el.classList.add('reveal');
      el.style.transitionDelay = (i % 4) * 70 + 'ms';
      observer.observe(el);
    });
  }

  /* ---------- Quote form ---------- */
  var form = document.getElementById('quoteForm');
  var success = document.getElementById('formSuccess');

  function fieldOf(input) {
    return input.closest('.field');
  }

  function setError(input, message) {
    var wrap = fieldOf(input);
    if (!wrap) return;
    var msg = wrap.querySelector('.error');
    if (message) {
      wrap.classList.add('has-error');
      input.setAttribute('aria-invalid', 'true');
      if (msg) msg.textContent = message;
    } else {
      wrap.classList.remove('has-error');
      input.removeAttribute('aria-invalid');
      if (msg) msg.textContent = '';
    }
  }

  function isValidEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(value.trim());
  }

  function isValidPhone(value) {
    var digits = value.replace(/\D/g, '');
    return digits.length >= 10 && digits.length <= 15;
  }

  function validateField(input) {
    var value = (input.value || '').trim();

    if (input.id === 'name') {
      if (value.length < 2) {
        setError(input, 'Please enter your full name.');
        return false;
      }
    } else if (input.id === 'phone') {
      if (!value) {
        setError(input, 'We need a phone number to give you a quote.');
        return false;
      }
      if (!isValidPhone(value)) {
        setError(input, 'Please enter a valid phone number (at least 10 digits).');
        return false;
      }
    } else if (input.id === 'email') {
      if (!value) {
        setError(input, 'Please enter your email address.');
        return false;
      }
      if (!isValidEmail(value)) {
        setError(input, 'That email address doesn’t look right.');
        return false;
      }
    } else if (input.id === 'service') {
      if (!value) {
        setError(input, 'Please choose the service you need.');
        return false;
      }
    }

    setError(input, '');
    return true;
  }

  if (form) {
    var required = ['name', 'phone', 'email', 'service'].map(function (id) {
      return document.getElementById(id);
    }).filter(Boolean);

    // Live-clear errors as the user fixes them
    required.forEach(function (input) {
      var evt = input.tagName === 'SELECT' ? 'change' : 'input';
      input.addEventListener(evt, function () {
        if (fieldOf(input) && fieldOf(input).classList.contains('has-error')) {
          validateField(input);
        }
      });
      input.addEventListener('blur', function () {
        if ((input.value || '').trim()) validateField(input);
      });
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var firstInvalid = null;
      var allValid = true;

      required.forEach(function (input) {
        var ok = validateField(input);
        if (!ok) {
          allValid = false;
          if (!firstInvalid) firstInvalid = input;
        }
      });

      if (!allValid) {
        if (success) success.hidden = true;
        if (firstInvalid) {
          firstInvalid.focus();
          firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        return;
      }

      // Build a pre-filled email so the request actually reaches the business
      // without relying on any external service or API key.
      var get = function (id) {
        var el = document.getElementById(id);
        return el ? (el.value || '').trim() : '';
      };

      var name = get('name');
      var subject = 'Free Quote Request — ' + get('service') + ' — ' + name;

      var bodyLines = [
        'Name: ' + name,
        'Phone: ' + get('phone'),
        'Email: ' + get('email'),
        'City / Area: ' + (get('city') || 'Not provided'),
        'Service Needed: ' + get('service'),
        '',
        'Details:',
        get('message') || 'No additional details provided.',
        '',
        '--',
        'Sent from the E&S Pressure Washing website quote form.'
      ];

      var mailto =
        'mailto:' + BUSINESS_EMAIL +
        '?subject=' + encodeURIComponent(subject) +
        '&body=' + encodeURIComponent(bodyLines.join('\n'));

      if (success) {
        var copy = document.getElementById('successCopy');
        if (copy) {
          copy.innerHTML =
            'Thanks, ' + escapeHtml(name.split(' ')[0]) + ' — we’ve opened a pre-filled email to Edward with your details. ' +
            'If your email app didn’t open, call <a href="tel:+19048228665">(904) 822-8665</a> or email ' +
            '<a href="mailto:' + BUSINESS_EMAIL + '">' + BUSINESS_EMAIL + '</a> directly.';
        }
        success.hidden = false;
        success.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }

      window.location.href = mailto;
      form.reset();
    });
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  /* ---------- Smooth anchor offset for older browsers ---------- */
  document.addEventListener('click', function (e) {
    var link = e.target.closest('a[href^="#"]');
    if (!link) return;
    var id = link.getAttribute('href');
    if (!id || id === '#') return;
    var target = document.querySelector(id);
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    if (history.replaceState) history.replaceState(null, '', id);
  });
})();
