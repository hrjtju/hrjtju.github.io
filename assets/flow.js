/* Three-column marquee with wheel input.
 * - JS is the only driver (no CSS animation) so wheel and auto-drift compose.
 * - Constant base drift + wheel impulse with exponential inertia, speed-capped.
 * - Each column loops over its own copy height, so wrapping is invisible.
 * - The panel never shows a scrollbar (overflow hidden); wheel over the panel
 *   is captured so the page behind it does not jump.
 */
(function () {
  'use strict';
  var flow = document.querySelector('.feed-flow');
  if (!flow) return;

  var BASE = -22;       // px/s auto drift (negative = columns travel upward)
  var MAX = 900;        // px/s cap for wheel + inertia
  var WHEEL_GAIN = 2.4; // wheel delta -> px/s impulse
  var DAMPING = 4.2;    // per-second velocity decay
  var GAP = 16;

  var tracks = [].slice.call(flow.querySelectorAll('.flow-track'));
  if (!tracks.length) return;

  var offset = 0;
  var velocity = 0;
  var last = 0;
  var raf = 0;

  function copyHeight(t) {
    var h = t.scrollHeight / 2;
    return h > 0 ? h + GAP : 0;
  }

  function apply() {
    for (var i = 0; i < tracks.length; i++) {
      var t = tracks[i];
      var h = copyHeight(t);
      if (!h) continue;
      var o = ((offset % h) + h) % h;
      t.style.transform = 'translateY(' + (-h + o).toFixed(2) + 'px)';
    }
  }

  function tick(now) {
    raf = requestAnimationFrame(tick);
    if (!last) last = now;
    var dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    var v = BASE + velocity;
    if (v > MAX) v = MAX;
    if (v < -MAX) v = -MAX;
    offset += v * dt;
    velocity *= Math.exp(-DAMPING * dt);
    if (Math.abs(velocity) < 0.5) velocity = 0;
    apply();
  }

  function start() {
    if (raf) return;
    last = 0;
    raf = requestAnimationFrame(tick);
  }

  function stop() {
    if (raf) cancelAnimationFrame(raf);
    raf = 0;
  }

  flow.addEventListener('wheel', function (e) {
    if (!tracks.length || !copyHeight(tracks[0])) return;
    e.preventDefault();
    var d = e.deltaY;
    if (e.deltaMode === 1) d *= 16;
    else if (e.deltaMode === 2) d *= window.innerHeight;
    // Wheel down pushes the columns upward, matching normal scroll direction.
    velocity -= d * WHEEL_GAIN;
    if (velocity > MAX) velocity = MAX;
    if (velocity < -MAX) velocity = -MAX;
    start();
  }, { passive: false });

  document.addEventListener('visibilitychange', function () {
    if (document.hidden) stop();
    else start();
  });

  window.addEventListener('resize', function () {
    apply();
  }, { passive: true });

  window.addEventListener('load', apply);
  apply();
  start();

  // Read-only hooks for the acceptance suite.
  window.__flow = {
    velocity: function () { return velocity; },
    offset: function () { return offset; },
    isRunning: function () { return !!raf; },
    maxSpeed: function () { return MAX; },
    base: function () { return BASE; },
    wheel: function (delta) {
      velocity -= delta * WHEEL_GAIN;
      if (velocity > MAX) velocity = MAX;
      if (velocity < -MAX) velocity = -MAX;
      start();
    },
    tracks: function () { return tracks.length; }
  };
})();
