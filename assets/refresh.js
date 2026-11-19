/* "换一批": keep the owner's featured picks, fill the rest randomly, rebuild columns. */
(function () {
  'use strict';
  var btn = document.getElementById('refresh-feed');
  var flow = document.querySelector('.feed-flow');
  var pool = document.getElementById('feed-pool');
  if (!btn || !flow || !pool) return;

  var TARGET = 24;
  var busy = false;

  function shuffle(a) {
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }

  function pick() {
    var cards = [].slice.call(pool.querySelectorAll('a.note-card'));
    var featured = [];
    var others = [];
    cards.forEach(function (c) {
      if (c.getAttribute('data-featured') === '1') featured.push(c);
      else others.push(c);
    });
    var chosen = featured.slice();
    shuffle(others);
    for (var i = 0; i < others.length && chosen.length < TARGET; i++) chosen.push(others[i]);
    return chosen;
  }

  function cloneCard(node, dup) {
    var cl = node.cloneNode(true);
    if (dup) {
      cl.classList.add('is-dup');
      cl.setAttribute('aria-hidden', 'true');
      cl.setAttribute('tabindex', '-1');
    }
    return cl;
  }

  function buildColumn(nodes) {
    var col = document.createElement('div');
    col.className = 'flow-col';
    var track = document.createElement('div');
    track.className = 'flow-track';
    nodes.forEach(function (n) { track.appendChild(cloneCard(n, false)); });
    nodes.forEach(function (n) { track.appendChild(cloneCard(n, true)); });
    col.appendChild(track);
    return col;
  }

  function render() {
    if (busy) return;
    busy = true;
    try {
      if (window.__flow && window.__flow.reinit) window.__flow.reinit();
      var chosen = pick();
      if (!chosen.length) return;
      var cols = [[], [], []];
      var heights = [0, 0, 0];
      chosen.forEach(function (c) {
        var k = 0;
        for (var i = 1; i < 3; i++) if (heights[i] < heights[k]) k = i;
        cols[k].push(c);
        heights[k] += (c.querySelector('img.cover') ? 220 : 0) + 150;
      });
      flow.textContent = '';
      cols.forEach(function (nodes) { flow.appendChild(buildColumn(nodes)); });
      void flow.offsetHeight;
      if (window.__flow && window.__flow.reinit) window.__flow.reinit();
    } finally {
      busy = false;
    }
  }

  btn.addEventListener('click', render);
  window.__refreshFeed = render;
})();
