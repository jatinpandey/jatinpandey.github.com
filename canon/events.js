/* Canon — what readers did, sent to the Worker in suggestions/.

   Nothing here identifies anybody. Two random ids are kept: one in
   localStorage, so a second visit from the same browser can be counted as a
   return, and one per page load, which is what lets a funnel be reconstructed —
   day opened, work reached, spotlight lit, narration played, narration
   finished. No address is stored; the Worker keeps only a salted hash of it to
   throttle a flood.

   Events are queued and sent in batches, with sendBeacon on the way out so the
   last few are not lost when the tab closes. sendBeacon cannot set a JSON
   content type without provoking a preflight it has no way to answer, so the
   body goes as text and the Worker parses it. */
(function () {
  'use strict';

  var VISITOR_KEY = 'canon.visitor.v1';
  var FLUSH_AFTER = 4000;   // ms of quiet before a batch goes
  var MAX_QUEUE = 30;

  function config() { return window.CANON_CONFIG || {}; }
  function endpoint() {
    var url = config().eventsEndpoint;
    if (url) return url;
    var base = config().suggestEndpoint;
    return base ? base.replace(/\/+$/, '') + '/events' : '';
  }

  function id() {
    if (window.crypto && crypto.randomUUID) return crypto.randomUUID().replace(/-/g, '').slice(0, 24);
    return (Date.now().toString(36) + Math.random().toString(36).slice(2)).slice(0, 24);
  }
  function visitor() {
    try {
      var found = localStorage.getItem(VISITOR_KEY);
      if (found) return found;
      var made = id();
      localStorage.setItem(VISITOR_KEY, made);
      return made;
    } catch (e) {
      return id();   // private window, or storage refused: this visit counts as new
    }
  }

  /* A browser asking not to be followed is not followed. One line to drop. */
  var refused = navigator.doNotTrack === '1' || window.doNotTrack === '1' || navigator.msDoNotTrack === '1';

  var queue = [];
  var timer = null;
  var who = null;
  var session = id();

  function flush(final) {
    if (!queue.length) return;
    var url = endpoint();
    if (!url) { queue.length = 0; return; }
    var body = JSON.stringify({ visitor: who || (who = visitor()), session: session, events: queue.splice(0, queue.length) });
    clearTimeout(timer); timer = null;
    try {
      if (final && navigator.sendBeacon) {
        navigator.sendBeacon(url, new Blob([body], { type: 'text/plain;charset=UTF-8' }));
        return;
      }
      fetch(url, { method: 'POST', body: body, headers: { 'Content-Type': 'text/plain;charset=UTF-8' }, keepalive: true })
        .catch(function () {});
    } catch (e) { /* losing an event is not worth an error */ }
  }

  function record(name, props) {
    if (refused || !endpoint()) return;
    var e = props ? JSON.parse(JSON.stringify(props)) : {};
    e.name = name;
    e.screen = window.innerWidth < 720 ? 'narrow' : 'wide';
    queue.push(e);
    if (queue.length >= MAX_QUEUE) { flush(false); return; }
    clearTimeout(timer);
    timer = setTimeout(function () { flush(false); }, FLUSH_AFTER);
  }

  /* Anything still queued goes when the page is put away. pagehide is the one
     that fires reliably on mobile, where tabs are frozen rather than closed. */
  window.addEventListener('pagehide', function () { flush(true); });
  document.addEventListener('visibilitychange', function () {
    if (document.visibilityState === 'hidden') flush(true);
  });

  window.CanonEvents = { record: record, flush: flush, enabled: !refused };
})();
