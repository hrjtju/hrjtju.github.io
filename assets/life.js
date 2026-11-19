/* Life-on-walk backdrop: a random walk traces a path, Conway's B3/S23 takes over.
 * Rules are kept separate: the walker is NOT governed by B3/S23; it just seeds cells.
 * - 4-neighbour equal-probability walk on a torus: exiting one edge re-enters
 *   from the opposite edge (left↔right, top↔bottom).
 * - Walkers are born in cells that are NOT covered by cards, so the first trails
 *   stay visible instead of hiding under the feed.
 * - 5 walkers on desktop, 3 on phones.
 * - When a trail reaches a still life / dies out (24 generations with almost no
 *   births), a small glider is seeded next to the trail so the frame breathes again.
 * - Always-on (owner decision): the effect is cheap and sized to the viewport,
 *   so it does not consult prefers-reduced-motion. Pauses only when the tab hides.
 */
(function () {
  'use strict';

  var canvas = document.getElementById('life-canvas');
  if (!canvas) return;

  var ctx = canvas.getContext('2d', { alpha: true });
  var CELL = 14;
  var STEP_MS = 120;          // one Game of Life generation
  var QUIET_GENS = 24;        // generations with almost no births before a glider
  var QUIET_BIRTHS = 2;

  var cols = 0, rows = 0, alive, age, walkers = [], gen = 0, quiet = 0, glidersSeeded = 0;
  var blocked = null, freeCells = [];
  var dpr = 1;
  var running = false;
  var timer = 0, ticks = 0, hidden = false;
  var mobile = window.matchMedia && window.matchMedia('(max-width: 900px)').matches;

  function idx(x, y) { return y * cols + x; }

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    var w = window.innerWidth, h = window.innerHeight;
    canvas.width = Math.floor(w * dpr);
    canvas.height = Math.floor(h * dpr);
    canvas.style.width = w + 'px';
    canvas.style.height = h + 'px';
    cols = Math.ceil(w / CELL) + 1;
    rows = Math.ceil(h / CELL) + 1;
    alive = new Uint8Array(cols * rows);
    age = new Uint8Array(cols * rows);
    gen = 0; quiet = 0;
    markCoveredCells();
    walkers = [];
    var count = mobile ? 3 : 5;
    for (var i = 0; i < count; i++) {
      var spot = randomFreeCell();
      walkers.push({
        x: spot.x,
        y: spot.y,
        life: 80 + Math.floor(Math.random() * 90)
      });
    }
    warmStart();
  }

  // Cards (profile + note cards) hide part of the backdrop; start walkers only
  // on cells that are not behind them.
  function markCoveredCells() {
    blocked = new Uint8Array(cols * rows);
    var nodes = document.querySelectorAll('.note-card, .profile');
    for (var n = 0; n < nodes.length; n++) {
      var r = nodes[n].getBoundingClientRect();
      if (!r.width || !r.height) continue;
      var x0 = Math.max(0, Math.floor(r.left / CELL));
      var y0 = Math.max(0, Math.floor(r.top / CELL));
      var x1 = Math.min(cols - 1, Math.ceil(r.right / CELL));
      var y1 = Math.min(rows - 1, Math.ceil(r.bottom / CELL));
      for (var y = y0; y <= y1; y++) for (var x = x0; x <= x1; x++) blocked[idx(x, y)] = 1;
    }
    freeCells = [];
    for (var i = 0; i < blocked.length; i++) if (!blocked[i]) freeCells.push(i);
  }

  function randomFreeCell() {
    if (freeCells.length) {
      var i = freeCells[Math.floor(Math.random() * freeCells.length)];
      return { x: i % cols, y: Math.floor(i / cols) };
    }
    var tries = 40;
    while (tries--) {
      var x = Math.floor(Math.random() * cols), y = Math.floor(Math.random() * rows);
      if (!blocked || !blocked[idx(x, y)]) return { x: x, y: y };
    }
    return { x: Math.floor(Math.random() * cols), y: Math.floor(Math.random() * rows) };
  }

  // Seed a few short trails so the first painted frame already has texture.
  function warmStart() {
    for (var k = 0; k < walkers.length; k++) {
      var w = walkers[k];
      for (var s = 0; s < 40; s++) {
        stepWalker(w, s % 3 === 0);
      }
    }
    for (var g = 0; g < 3; g++) evolve();
    draw();
  }

  function stepWalker(w, paint) {
    var d = Math.floor(Math.random() * 4); // four neighbours, equal probability
    if (d === 0) w.x = (w.x + 1) % cols;
    else if (d === 1) w.x = (w.x - 1 + cols) % cols;
    else if (d === 2) w.y = (w.y + 1) % rows;
    else w.y = (w.y - 1 + rows) % rows;
    if (paint !== false) {
      var i = idx(w.x, w.y);
      alive[i] = 1;
      age[i] = 0;
    }
    w.life--;
    if (w.life <= 0) { // relocate the walker so the canvas keeps getting new seeds
      var spot = randomFreeCell();
      w.x = spot.x;
      w.y = spot.y;
      w.life = 90 + Math.floor(Math.random() * 110);
    }
  }

  function evolve() {
    var next = new Uint8Array(cols * rows);
    var births = 0;
    for (var y = 0; y < rows; y++) {
      for (var x = 0; x < cols; x++) {
        var n = 0;
        var xm = (x - 1 + cols) % cols, xp = (x + 1) % cols;
        var ym = (y - 1 + rows) % rows, yp = (y + 1) % rows;
        n += alive[idx(xm, ym)] + alive[idx(x, ym)] + alive[idx(xp, ym)];
        n += alive[idx(xm, y)] + alive[idx(xp, y)];
        n += alive[idx(xm, yp)] + alive[idx(x, yp)] + alive[idx(xp, yp)];
        var i = idx(x, y);
        var was = alive[i];
        var on = was ? (n === 2 || n === 3) : n === 3;
        next[i] = on ? 1 : 0;
        if (on && !was) births++;
      }
    }
    alive = next;
    gen++;
    for (var j = 0; j < age.length; j++) if (alive[j] && age[j] < 255) age[j]++;
    quiet = births <= QUIET_BIRTHS ? quiet + 1 : 0;
    if (quiet >= QUIET_GENS) seedGliderNearTrail();
  }

  function seedGliderNearTrail() {
    var anchor = walkers.length ? walkers[0] : { x: 0, y: 0 };
    var gx = (anchor.x + 6 + Math.floor(Math.random() * 10)) % cols;
    var gy = (anchor.y + 4 + Math.floor(Math.random() * 8)) % rows;
    var shape = [[1, 0], [2, 1], [0, 2], [1, 2], [2, 2]];
    for (var i = 0; i < shape.length; i++) {
      var x = (gx + shape[i][0]) % cols, y = (gy + shape[i][1]) % rows;
      alive[idx(x, y)] = 1;
      age[idx(x, y)] = 0;
    }
    quiet = 0;
    glidersSeeded++;
  }

  function draw() {
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, canvas.width / dpr, canvas.height / dpr);
    for (var y = 0; y < rows; y++) {
      for (var x = 0; x < cols; x++) {
        var i = idx(x, y);
        if (!alive[i]) continue;
        var a = age[i] < 6 ? 0.34 : (age[i] < 40 ? 0.2 : 0.11);
        ctx.fillStyle = age[i] < 6 ? 'rgba(47, 111, 94, ' + a + ')' : 'rgba(28, 31, 35, ' + a + ')';
        ctx.fillRect(x * CELL + 1, y * CELL + 1, CELL - 2, CELL - 2);
      }
    }
  }

  // Step on a timer rather than requestAnimationFrame: an embedded preview can
  // have rAF suspended while still painting its first frame, which is exactly
  // how the backdrop ended up frozen. Timers keep ticking while visible.
  function tick() {
    if (!running) return;
    for (var i = 0; i < walkers.length; i++) stepWalker(walkers[i]);
    evolve();
    draw();
    ticks++;
  }

  function start() {
    if (running || hidden) return;
    running = true;
    tick();
    timer = setInterval(tick, STEP_MS);
  }

  function stop() {
    running = false;
    if (timer) { clearInterval(timer); timer = 0; }
  }

  document.addEventListener('visibilitychange', function () {
    hidden = document.hidden;
    if (hidden) {
      stop();
    } else {
      start();
    }
  });

  window.addEventListener('resize', function () {
    var was = running;
    stop();
    resize();
    if (was) start();
  }, { passive: true });

  // Cover images finish loading after first paint and shift card heights;
  // refresh the mask so newly covered cells stop receiving new walkers.
  window.addEventListener('load', function () { markCoveredCells(); });

  // The backdrop is deliberately always-on: it is cheap, sized to the viewport,
  // and the owner asked for motion regardless of the OS animation setting.

  resize();
  // Tiny read-only debug hook so acceptance checks can observe the animation
  // (reduced motion, tab visibility) without inspecting internals.
  window.__life = {
    isRunning: function () { return running; },
    ticks: function () { return ticks; },
    generation: function () { return gen; },
    liveCells: function () { var n = 0; for (var i = 0; i < alive.length; i++) if (alive[i]) n++; return n; },
    glidersSeeded: function () { return glidersSeeded; },
    walkerCount: function () { return walkers.length; },
    // test-only handles used by the acceptance suite to exercise the quiet-trail rule
    debug: {
      clear: function () { alive.fill(0); age.fill(0); quiet = 0; },
      setCell: function (x, y, v) { alive[idx(x % cols, y % rows)] = v ? 1 : 0; },
      setWalker: function (i, x, y) { if (walkers[i]) { walkers[i].x = x; walkers[i].y = y; } },
      walkerPos: function (i) { return walkers[i] ? { x: walkers[i].x, y: walkers[i].y } : null; },
      cols: function () { return cols; },
      rows: function () { return rows; },
      step: function () { tick(); },
      freeCellCount: function () { return freeCells.length; },
      isBlocked: function (x, y) { return !!(blocked && blocked[idx(x, y)]); },
      evolve: function () { evolve(); },
      quietGens: function () { return quiet; }
    }
  };
  start();
})();
