/* Tall inline formulas need midline alignment; short ones look best on the text baseline. */
(function () {
  'use strict';

  function fix() {
    var nodes = document.querySelectorAll('#article-container mjx-container');
    for (var i = 0; i < nodes.length; i++) {
      var el = nodes[i];
      if (el.getAttribute('display') === 'true') continue;
      var parent = el.parentElement;
      if (!parent) continue;
      var lh = parseFloat(getComputedStyle(parent).lineHeight);
      if (!lh || Number.isNaN(lh)) lh = parseFloat(getComputedStyle(document.body).lineHeight) || 26;
      var h = el.getBoundingClientRect().height;
      el.style.verticalAlign = h > lh * 1.15 ? 'middle' : '';
    }
  }

  function boot() {
    fix();
    // Images/fonts can change line height after first paint.
    setTimeout(fix, 300);
    window.addEventListener('load', fix);
    window.addEventListener('resize', fix);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
