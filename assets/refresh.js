/* "换一批": re-pick a few posts from every series and rebuild the flowing columns.
 * Cards come from the server-rendered pool, so no HTML template is duplicated here. */
(function () {
  'use strict';
  var btn = document.getElementById('refresh-feed');
  var flow = document.querySelector('.feed-flow');
  var pool = document.getElementById('feed-pool');
  if (!btn || !flow || !pool) return;

  var PER_SERIES = 3;

  function shuffle(a) {
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }

  function pick() {
    var cards = [].slice.call(pool.querySelectorAll('a.note-card'));
    var groups = {};
    cards.forEach(function (c) {
      var s = c.getAttribute('data-series') || '其他';
      (groups[s] = groups[s] || []).push(c);
    });
    var chosen = [];
    Object.keys(groups).forEach(function (s) {
      chosen = chosen.concat(shuffle(groups[s].slice()).slice(0, PER_SERIES));
    });
    chosen.sort(function (a, b) {
      return String(b.getAttribute('data-date') || '').localeCompare(String(a.getAttribute('data-date') || ''));
    });
    return chosen;
  }

  function render() {
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
    flow.innerHTML = cols.map(function (col) {
      var main = col.map(function (c) { return c.outerHTML; }).join('');
      var dup = col.map(function (c) {
        var cl = c.cloneNode(true);
        cl.classList.add('is-dup');
        cl.setAttribute('aria-hidden', 'true');
        cl.setAttribute('tabindex', '-1');
        return cl.outerHTML;
      }).join('');
      return '<div class="flow-col"><div class="flow-track">' + main + dup + '</div></div>';
    }).join('');
    if (window.__flow && window.__flow.reinit) window.__flow.reinit();
  }

  btn.addEventListener('click', render);
  window.__refreshFeed = render;
})();
