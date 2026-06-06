/**
 * Silver Group — Stats Counter Animation
 * Count-up when stats section scrolls into view
 */

(function () {
  'use strict';

  const counters = document.querySelectorAll('[data-counter]');

  if (!counters.length || !('IntersectionObserver' in window)) return;

  function animateCounter(el) {
    const target = parseInt(el.getAttribute('data-counter'), 10);
    const suffix = el.getAttribute('data-suffix') || '';
    const prefix = el.getAttribute('data-prefix') || '';
    const duration = 1800;
    const start = performance.now();

    function update(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(eased * target);
      el.textContent = prefix + current + suffix;

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        el.textContent = prefix + target + suffix;
      }
    }

    requestAnimationFrame(update);
  }

  const counterObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          const el = entry.target;
          if (!el.dataset.counted) {
            el.dataset.counted = 'true';
            animateCounter(el);
          }
          counterObserver.unobserve(el);
        }
      });
    },
    { threshold: 0.4 }
  );

  counters.forEach(function (counter) {
    counterObserver.observe(counter);
  });
})();
