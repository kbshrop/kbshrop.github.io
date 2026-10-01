// Kyle Shropshire — personal site
// Minimal enhancement layer: active nav state + a gentle reveal on scroll.
// No frameworks, no build step — this is meant to run as-is on GitHub Pages.

(function () {
  var navLinks = Array.prototype.slice.call(document.querySelectorAll('.tb-nav a'));
  var sections = navLinks
    .map(function (link) {
      var id = link.getAttribute('href').slice(1);
      return document.getElementById(id);
    })
    .filter(Boolean);

  if ('IntersectionObserver' in window && sections.length) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          var id = entry.target.id;
          navLinks.forEach(function (link) {
            var isMatch = link.getAttribute('href') === '#' + id;
            link.style.background = isMatch ? 'var(--olive-deep)' : '';
            link.style.color = isMatch ? 'var(--plaster)' : '';
          });
        });
      },
      { rootMargin: '-45% 0px -50% 0px', threshold: 0 }
    );
    sections.forEach(function (section) { observer.observe(section); });
  }

  // Gentle reveal for panels and project sheets, respecting reduced-motion.
  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!prefersReducedMotion && 'IntersectionObserver' in window) {
    var revealTargets = document.querySelectorAll('section.panel, .milestone');
    revealTargets.forEach(function (el) {
      el.style.opacity = '0';
      el.style.transform = 'translateY(14px)';
      el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    });
    var revealObserver = new IntersectionObserver(
      function (entries, obs) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    revealTargets.forEach(function (el) { revealObserver.observe(el); });
  }

  // Bookcase on touch screens: first tap opens the preview card, second tap follows the link.
  if (window.matchMedia('(hover: none)').matches) {
    var slots = Array.prototype.slice.call(document.querySelectorAll('.slot'));
    slots.forEach(function (slot) {
      slot.addEventListener('click', function (e) {
        if (!slot.classList.contains('open')) {
          e.preventDefault();
          slots.forEach(function (s) { s.classList.remove('open'); });
          slot.classList.add('open');
        }
      });
    });
    document.addEventListener('click', function (e) {
      if (!e.target.closest('.slot')) slots.forEach(function (s) { s.classList.remove('open'); });
    });
  }
})();
