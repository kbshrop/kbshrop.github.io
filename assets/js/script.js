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

  // Shelf clock and hero clock: show the visitor's local time, moved once a minute.
  var clocks = [
    { hour: document.getElementById('clock-hour'), min: document.getElementById('clock-min'), cx: 50, cy: 40 },
    { hour: document.getElementById('hero-clock-hour'), min: document.getElementById('hero-clock-min'), cx: 424, cy: 158 }
  ].filter(function (c) { return c.hour && c.min; });
  if (clocks.length) {
    var setClock = function () {
      var now = new Date();
      var m = now.getMinutes();
      clocks.forEach(function (c) {
        c.hour.setAttribute('transform', 'rotate(' + ((now.getHours() % 12) * 30 + m * 0.5) + ' ' + c.cx + ' ' + c.cy + ')');
        c.min.setAttribute('transform', 'rotate(' + (m * 6) + ' ' + c.cx + ' ' + c.cy + ')');
      });
    };
    var tickClock = function () {
      setClock();
      setTimeout(tickClock, 60000 - (Date.now() % 60000) + 50);
    };
    tickClock();
    document.addEventListener('visibilitychange', function () { if (!document.hidden) setClock(); });
  }

  // Hero house: click the lamp to switch it on or off, click the mailbox to post a letter.
  function onPress(el, fn) {
    el.addEventListener('click', fn);
    el.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); fn(); }
    });
  }

  var lamp = document.getElementById('hero-lamp');
  var lampShade = document.getElementById('hero-lamp-shade');
  var lampGlow = document.getElementById('hero-lamp-glow');
  if (lamp && lampShade && lampGlow) {
    var lampOn = true;
    onPress(lamp, function () {
      lampOn = !lampOn;
      lampShade.setAttribute('fill', lampOn ? '#E4611C' : '#8C6A55');
      lampGlow.style.display = lampOn ? '' : 'none';
      lamp.setAttribute('aria-pressed', String(lampOn));
      lamp.setAttribute('aria-label', 'Table lamp (' + (lampOn ? 'on' : 'off') + '). Press to switch it ' + (lampOn ? 'off' : 'on') + '.');
    });
  }

  var door = document.getElementById('hero-door');
  var doorLeaf = document.getElementById('hero-door-leaf');
  if (door && doorLeaf) {
    var doorOpen = false;

    // Robot arm behind the door: sways gently and updates the pendant readout, only while the door is open.
    var armA = document.getElementById('hero-arm-a');
    var armB = document.getElementById('hero-arm-b');
    var armC = document.getElementById('hero-arm-c');
    var readout = document.getElementById('hero-arm-readout');
    var trace = document.getElementById('hero-arm-trace');
    var led = document.getElementById('hero-arm-led');
    var armRunning = false;
    var samples = [0, 0, 0, 0, 0, 0, 0];
    var lastReadout = 0;
    var armFrame = function (ts) {
      if (!doorOpen) { armRunning = false; return; }
      var t = ts / 1000;
      var a = 6 * Math.sin(t * 0.9);
      var b = 10 * Math.sin(t * 0.9 + 1.2);
      var c = 14 * Math.sin(t * 1.8 + 0.5);
      armA.setAttribute('transform', 'rotate(' + a + ' 23 98)');
      armB.setAttribute('transform', 'rotate(' + b + ' 30 72)');
      armC.setAttribute('transform', 'rotate(' + c + ' 46 56)');
      if (ts - lastReadout > 250) {
        lastReadout = ts;
        var deg = Math.round(b);
        readout.textContent = 'J2 ' + (deg < 0 ? '-' : '+') + ('0' + Math.abs(deg)).slice(-2);
        samples.shift(); samples.push(c);
        trace.setAttribute('points', samples.map(function (s, i) { return (42 + i * 2) + ',' + (100.8 - s / 14 * 0.9).toFixed(2); }).join(' '));
        led.setAttribute('fill', Math.floor(t * 2) % 2 ? '#7CFFB0' : '#13261C');
      }
      requestAnimationFrame(armFrame);
    };
    var startArm = function () {
      if (prefersReducedMotion || armRunning || !armA || !armB || !armC) return;
      armRunning = true;
      requestAnimationFrame(armFrame);
    };

    onPress(door, function () {
      doorOpen = !doorOpen;
      if (doorOpen) startArm();
      doorLeaf.style.transform = doorOpen ? 'scaleX(0.22)' : '';
      door.setAttribute('aria-pressed', String(doorOpen));
      door.setAttribute('aria-label', 'Front door (' + (doorOpen ? 'open' : 'closed') + '). Press to ' + (doorOpen ? 'close' : 'open') + ' it.');
    });
  }

  var mailbox = document.getElementById('hero-mailbox');
  var letter = document.getElementById('hero-letter');
  if (mailbox && letter) {
    onPress(mailbox, function () {
      if (!letter.animate) return;
      var frames = prefersReducedMotion
        ? [{ opacity: 0 }, { opacity: 1, offset: 0.3 }, { opacity: 0 }]
        : [
            { opacity: 0, transform: 'translate(34px, -30px) rotate(-18deg)' },
            { opacity: 1, transform: 'translate(34px, -30px) rotate(-18deg)', offset: 0.12 },
            { opacity: 1, transform: 'translate(0, 0) rotate(0deg)', offset: 0.65 },
            { opacity: 1, transform: 'translate(0, 2px) scale(1, 0.05)', offset: 0.95 },
            { opacity: 0, transform: 'translate(0, 2px) scale(1, 0.05)' }
          ];
      letter.animate(frames, { duration: prefersReducedMotion ? 600 : 1000, easing: 'ease-in-out' });
    });
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
