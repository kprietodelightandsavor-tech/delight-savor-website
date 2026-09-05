/* Delight & Savor — quiet reveal on scroll.

   Sections settle into place as you come to them: an 18px rise and a fade,
   once, then they stay put. The hero never fades — it is the first thing on
   the screen and should simply be there.

   Nothing is hidden unless this script is actually running, so a reader with
   JavaScript off sees the whole page as normal. Readers who ask their system
   for reduced motion get the page with no movement at all. */
(function () {
  'use strict';

  var root = document.documentElement;
  var reduced = window.matchMedia &&
                window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (reduced || !('IntersectionObserver' in window)) return;

  /* Injected from here rather than a stylesheet: if this file fails to load,
     nothing is ever hidden. Runs during head parsing, so sections are styled
     before their first paint and never flash in and back out. */
  var css =
    '.ds-reveal section:not(.hero):not(.ds-no-reveal){' +
      'opacity:0;transform:translateY(18px);' +
      'transition:opacity .7s cubic-bezier(.22,.61,.36,1),' +
                 'transform .7s cubic-bezier(.22,.61,.36,1);' +
      'will-change:opacity,transform;}' +
    /* The :not() chain has to be repeated here — without it the rule above
       is more specific and the reveal never takes effect. */
    '.ds-reveal section.is-revealed:not(.hero):not(.ds-no-reveal){' +
      'opacity:1;transform:none;will-change:auto;}' +
    '@media (prefers-reduced-motion:reduce){' +
      '.ds-reveal section{opacity:1!important;transform:none!important;}}';

  var style = document.createElement('style');
  style.appendChild(document.createTextNode(css));
  (document.head || root).appendChild(style);
  root.className += (root.className ? ' ' : '') + 'ds-reveal';

  function show(el) {
    el.classList.add('is-revealed');
  }

  function start() {
    var targets = [].filter.call(
      document.querySelectorAll('section'),
      function (s) {
        return !s.classList.contains('hero') &&
               !s.classList.contains('ds-no-reveal') &&
               !s.closest('.hero');
      }
    );

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        show(entry.target);
        io.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0 });

    targets.forEach(function (s) { io.observe(s); });

    /* Belt and braces. If the observer has reported nothing after a couple of
       seconds it is not working here, so drop to a plain scroll handler —
       better a page that reveals crudely than one that stays invisible. */
    setTimeout(function () {
      if (document.querySelector('section.is-revealed')) return;

      io.disconnect();

      var onScroll = function () {
        var h = window.innerHeight;
        targets = targets.filter(function (s) {
          if (s.getBoundingClientRect().top > h * 0.92) return true;
          show(s);
          return false;
        });
        if (!targets.length) {
          window.removeEventListener('scroll', onScroll);
          window.removeEventListener('resize', onScroll);
        }
      };

      window.addEventListener('scroll', onScroll, { passive: true });
      window.addEventListener('resize', onScroll);
      onScroll();
    }, 2500);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
})();
