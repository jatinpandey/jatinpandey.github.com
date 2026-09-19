/* Canon — pick three works for the day, lay them out, narrate them.
   Narration is looked for in three places, in this order:
     1. /canon/audio/<id>.mp3   pre-rendered with Deepgram (scripts/speak.mjs)
     2. the browser's cache     anything Deepgram has already made on this device
     3. Deepgram Aura, live     only if config.js carries a key and the caps allow
   Failing all three, the browser's own British voice reads the summary. */
(function () {
  'use strict';

  /* ---------- configuration ---------- */
  var LAUNCH = Date.UTC(2026, 8, 16); // day zero of the rotation (16 Sep 2026)
  var ORDER = ['old', 'nineteenth', 'modern'];
  var COMMONS = 'https://commons.wikimedia.org/wiki/Special:FilePath/';
  var AUDIO_DIR = '/canon/audio/';
  var WORDS_PER_SECOND = 2.35; // Draco's pace, used only for the spoken fallback estimate
  var NARRATION_NOTE = 'Details of the piece narrated in a sophisticated British voice.';
  var REFERENCE_LIMIT = 3;

  /* What readers did. A no-op when events.js is absent or the browser has
     asked not to be followed, so nothing below needs to check. */
  function note(name, props) {
    if (window.CanonEvents) window.CanonEvents.record(name, props);
  }
  function of(a, extra) {
    var e = { work: a.id, artist: a.artist, era: a.category };
    if (extra) for (var k in extra) if (Object.prototype.hasOwnProperty.call(extra, k)) e[k] = extra[k];
    return e;
  }
  var NUMERALS = ['I', 'II', 'III', 'IV', 'V'];   // three identical blocks need somewhere to stand

  /* How long each recording runs, measured by scripts/durations.mjs. The files
     carry no duration header, so without this the player can only guess. */
  var timings = (typeof fetch === 'function'
    ? fetch(AUDIO_DIR + 'manifest.json').then(function (r) { return r.ok ? r.json() : {}; }).catch(function () { return {}; })
    : Promise.resolve({}));

  var works = window.ARTWORKS || (typeof ARTWORKS !== 'undefined' ? ARTWORKS : []);
  var cats = window.CATEGORIES || (typeof CATEGORIES !== 'undefined' ? CATEGORIES : {});

  /* ---------- the day ---------- */
  function parseDay() {
    var q = new URLSearchParams(location.search).get('d');
    var now = new Date();
    var today = { y: now.getFullYear(), m: now.getMonth() + 1, d: now.getDate() };
    if (q && /^\d{4}-\d{2}-\d{2}$/.test(q)) {
      var p = q.split('-').map(Number);
      var asked = { y: p[0], m: p[1], d: p[2] };
      if (utc(asked) <= utc(today) && utc(asked) >= LAUNCH) return { day: asked, today: today, archive: true };
    }
    return { day: today, today: today, archive: false };
  }
  function utc(o) { return Date.UTC(o.y, o.m - 1, o.d); }
  function iso(o) { return o.y + '-' + pad(o.m) + '-' + pad(o.d); }
  function pad(n) { return (n < 10 ? '0' : '') + n; }
  function shift(o, days) {
    var d = new Date(utc(o) + days * 86400000);
    return { y: d.getUTCFullYear(), m: d.getUTCMonth() + 1, d: d.getUTCDate() };
  }
  function dayNumber(o) { return Math.round((utc(o) - LAUNCH) / 86400000); }
  function longDate(o) {
    return new Date(o.y, o.m - 1, o.d).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  }

  /* ---------- deterministic rotation ----------
     Each category is shuffled with a seed of (category, cycle), so within a
     cycle of n days every work appears once, and the order changes each cycle. */
  function hash(str) {
    var h = 2166136261;
    for (var i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); }
    return h >>> 0;
  }
  function rng(seed) {
    return function () {
      seed |= 0; seed = seed + 0x6D2B79F5 | 0;
      var t = Math.imul(seed ^ seed >>> 15, 1 | seed);
      t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
  }
  function pickFor(category, n) {
    var list = works.filter(function (w) { return w.category === category; });
    if (!list.length) return null;
    var len = list.length;
    var cycle = Math.floor(n / len);
    var idx = ((n % len) + len) % len;
    var r = rng(hash(category + ':' + cycle));
    var order = list.slice();
    for (var i = order.length - 1; i > 0; i--) { var j = Math.floor(r() * (i + 1)); var t = order[i]; order[i] = order[j]; order[j] = t; }
    return order[idx];
  }

  /* ---------- images ---------- */
  function img(file, width) { return COMMONS + encodeURIComponent(file) + '?width=' + width; }
  function srcset(a) {
    var widths = [1200, 1800, 2600].filter(function (w) { return w < a.w; });
    widths.push(Math.min(a.w, 3200));
    return widths.map(function (w) { return img(a.file, w) + ' ' + w + 'w'; }).join(', ');
  }

  /* ---------- render ---------- */
  /* References are not linked. Too many of them landed on an artist's page
     rather than the work being referred to — an article about Keith Haring is
     not his dancing figures — and a link that does not repay the click is worse
     than none. scripts/references.mjs and references.js are still here for when
     the resolution is good enough to trust. */

  function el(tag, cls, text) { var e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; }
  function paras(container, list) { (list || []).forEach(function (p) { container.appendChild(el('p', null, p)); }); }

  function render(a, tpl) {
    var node = tpl.content.firstElementChild.cloneNode(true);
    var cat = cats[a.category] || { name: a.category, span: '' };
    node.id = a.id;
    node.querySelector('.category').textContent = cat.name;
    node.querySelector('.span').textContent = cat.span;

    /* The plate's box is reserved from the catalogue's own dimensions before a
       byte of the image arrives, so the frame never draws at the wrong size and
       then jumps. Until the picture is here the gilt is held back and a plain
       silhouette stands in its place, which the painting then resolves into. */
    var plate = node.querySelector('.plate');
    plate.style.setProperty('--w', a.w);
    plate.style.setProperty('--h', a.h);

    var image = node.querySelector('.plate-img');
    image.sizes = '(min-width: 1130px) 1032px, calc(100vw - 48px)';
    image.width = a.w; image.height = a.h;
    image.alt = a.title + ' by ' + a.artist + ', ' + a.year;
    image.addEventListener('load', function () { plate.dataset.state = 'ready'; });
    image.addEventListener('error', function () { plate.dataset.state = 'missing'; });
    image.srcset = srcset(a);
    image.src = img(a.file, 1800);
    if (image.complete && image.naturalWidth) plate.dataset.state = 'ready';
    node.querySelector('.caption-venue').textContent = a.museum + ', ' + a.city;
    node.querySelector('.caption-spec').textContent = [a.medium, a.dims].join('  ·  ');

    node.querySelector('.title-name').textContent = a.title;
    node.querySelector('.title-year').textContent = a.year;
    var by = node.querySelector('.byline');
    by.appendChild(el('b', null, a.artist));
    by.appendChild(document.createTextNode(' (' + a.artistDates + ')'));

    paras(node.querySelector('.history'), a.history);
    paras(node.querySelector('.depicts'), a.depicts);
    paras(node.querySelector('.about'), a.about);
    var ul = node.querySelector('.echoes');
    (a.echoes || []).slice(0, REFERENCE_LIMIT).forEach(function (e) {
      var li = el('li');
      li.appendChild(el('b', 'echo-name', e.label));
      li.appendChild(el('span', null, e.note));
      ul.appendChild(li);
    });

    /* The plate opens the light too — tapping a painting to be shown the
       painting is what anyone expects, and the file on Commons is the same
       picture again. Its page is still one click away, from inside the room. */
    var toggle = node.querySelector('.spotlight-btn');
    toggle.addEventListener('click', function () { note('spotlight_open', of(a, { source: 'switch' })); spotlight(a, toggle); });
    var plate_link = node.querySelector('.plate-link');
    plate_link.setAttribute('aria-label', 'Light ' + a.title + ' in the spotlight');
    plate_link.addEventListener('click', function () { note('spotlight_open', of(a, { source: 'plate' })); spotlight(a, toggle); });

    new Player(node.querySelector('.player'), a);
    return node;
  }

  /* The switch wants to sound and feel like a switch. The click is synthesised
     rather than fetched — a short burst of noise through a bandpass, decaying
     fast, pitched a little higher going on than coming off, which is roughly
     what a real toggle does. Both are quiet, and both follow a press, so
     nothing makes a noise the reader did not ask for. */
  var audio = null;
  function clack(on) {
    /* Haptics where there are any. Chrome refuses this until the page has been
       tapped and throws as it does, which must not take the sound down with it. */
    try { if (navigator.vibrate) navigator.vibrate(on ? 12 : 8); } catch (e) {}
    var Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx) return;
    try {
      audio = audio || new Ctx();
      if (audio.state === 'suspended') audio.resume();
      var length = Math.floor(audio.sampleRate * 0.028);
      var buffer = audio.createBuffer(1, length, audio.sampleRate);
      var data = buffer.getChannelData(0);
      for (var i = 0; i < length; i++) data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, 7);
      var source = audio.createBufferSource();
      source.buffer = buffer;
      var band = audio.createBiquadFilter();
      band.type = 'bandpass';
      band.frequency.value = on ? 2500 : 1550;
      band.Q.value = 1.2;
      var level = audio.createGain();
      level.gain.value = 0.075;
      source.connect(band); band.connect(level); level.connect(audio.destination);
      source.start();
    } catch (e) { /* no sound is not a failure */ }
  }

  /* ---------- the spotlight ----------
     One room, reused. The page behind is left in place and simply covered: a
     modal dialog sits in the top layer, so nothing else can be reached or read
     while the work is lit. */
  var room = null;
  function spotlight(a, toggle) {
    if (!room) room = wireSpotlight();
    if (!room) return;
    if (room.toggle) room.toggle.setAttribute('aria-pressed', 'false');
    room.toggle = toggle || null;
    if (toggle) toggle.setAttribute('aria-pressed', 'true');
    clack(true);
    room.source.href = 'https://commons.wikimedia.org/wiki/File:' + encodeURIComponent(a.file);
    room.plate.style.setProperty('--w', a.w);
    room.plate.style.setProperty('--h', a.h);
    room.plate.dataset.state = 'loading';
    room.img.src = img(a.file, 2600);
    room.img.srcset = srcset(a);
    room.img.sizes = '92vw';
    room.img.alt = a.title + ' by ' + a.artist + ', ' + a.year;
    room.title.textContent = a.title;
    room.meta.textContent = a.artist + '  ·  ' + a.year + '  ·  ' + a.museum + ', ' + a.city;
    room.dialog.showModal();
    /* the page behind must not scroll under the room */
    document.documentElement.style.overflow = 'hidden';
  }
  function wireSpotlight() {
    var dialog = document.getElementById('spotlight');
    if (!dialog || !dialog.showModal) return null;
    var kit = {
      dialog: dialog,
      plate: dialog.querySelector('.spot-plate'),
      img: dialog.querySelector('.spot-img'),
      title: dialog.querySelector('.spot-title'),
      meta: dialog.querySelector('.spot-meta'),
      source: dialog.querySelector('.spot-source'),
      toggle: null,
    };
    /* the canvas lights up once it is actually there, rather than showing its
       own alt text against the dark */
    kit.img.addEventListener('load', function () { kit.plate.dataset.state = 'ready'; });
    dialog.addEventListener('close', function () {
      document.documentElement.style.overflow = '';
      kit.img.removeAttribute('src');
      kit.img.removeAttribute('srcset');
      if (kit.toggle) { kit.toggle.setAttribute('aria-pressed', 'false'); kit.toggle.focus(); }
      kit.toggle = null;
      clack(false);
    });
    /* anywhere in the room leaves it; the one thing in here worth pressing says so */
    kit.source.addEventListener('click', function (ev) { ev.stopPropagation(); });
    dialog.addEventListener('click', function (ev) { if (ev.detail) dialog.close(); });
    return kit;
  }

  /* ---------- Deepgram, on a leash ----------
     A recording is generated at most once: after that it lives in the browser's
     Cache Storage and costs nothing to play again. Generation is capped twice —
     `perDay` a day and `totalLimit` ever, counted per browser in localStorage —
     and once either cap is reached the browser's own voice takes over. */
  var TTS = (function () {
    var QUOTA = 'canon.narration.quota.v1';
    var CACHE = 'canon-narration-v1';
    var ENDPOINT = 'https://api.deepgram.com/v1/speak';

    function cfg() { return window.CANON_CONFIG || {}; }
    function cap(name, fallback) { var v = cfg()[name]; return typeof v === 'number' && v >= 0 ? v : fallback; }
    function stamp() { var n = new Date(); return n.getFullYear() + '-' + pad(n.getMonth() + 1) + '-' + pad(n.getDate()); }

    function quota() {
      var q;
      try { q = JSON.parse(localStorage.getItem(QUOTA) || '{}'); } catch (e) { q = {}; }
      if (q.day !== stamp()) { q.day = stamp(); q.today = 0; }
      q.today = q.today || 0;
      q.total = q.total || 0;
      return q;
    }
    function spend() {
      var q = quota();
      q.today++; q.total++;
      try { localStorage.setItem(QUOTA, JSON.stringify(q)); } catch (e) {}
    }
    function allowed() {
      var q = quota();
      return q.today < cap('perDay', 3) && q.total < cap('totalLimit', 30);
    }

    function slot(id) { return location.origin + AUDIO_DIR + 'generated/' + id + '.mp3'; }
    function fromCache(id) {
      if (!('caches' in window)) return Promise.resolve(null);
      return caches.open(CACHE)
        .then(function (c) { return c.match(slot(id)); })
        .then(function (r) { return r ? r.blob() : null; })
        .catch(function () { return null; });
    }
    function toCache(id, blob) {
      if (!('caches' in window)) return Promise.resolve();
      return caches.open(CACHE)
        .then(function (c) { return c.put(slot(id), new Response(blob, { headers: { 'Content-Type': 'audio/mpeg' } })); })
        .catch(function () {});
    }

    /* Resolves to a Blob, or to null when there is nothing to be had — no key,
       a cap reached, or Deepgram refusing. Never rejects: the caller's only
       other option is the browser voice either way. */
    function obtain(work) {
      return fromCache(work.id).then(function (blob) {
        if (blob) return blob;
        var key = cfg().deepgramKey;
        if (!key || !allowed()) return null;
        var voice = cfg().voice || 'aura-2-draco-en';
        var url = ENDPOINT + '?model=' + encodeURIComponent(voice) + '&encoding=mp3&bit_rate=48000';
        return fetch(url, {
          method: 'POST',
          headers: { Authorization: 'Token ' + key, 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: work.summary }),
        }).then(function (r) {
          if (!r.ok) throw new Error('Deepgram ' + r.status);
          return r.blob();
        }).then(function (made) {
          spend();
          return toCache(work.id, made).then(function () { return made; });
        }).catch(function () { return null; });
      }).catch(function () { return null; });
    }

    return { obtain: obtain };
  })();

  /* ---------- player ---------- */
  var current = null; // the player that owns the speakers
  function fmt(s) { if (!isFinite(s) || s < 0) s = 0; var m = Math.floor(s / 60); var r = Math.floor(s % 60); return m + ':' + (r < 10 ? '0' : '') + r; }

  function Player(root, work) {
    this.root = root; this.work = work;
    this.btn = root.querySelector('.play');
    this.track = root.querySelector('.track');
    this.cur = root.querySelector('.time-cur');
    this.dur = root.querySelector('.time-dur');
    this.note = root.querySelector('.player-note');
    this.mode = 'audio'; // or 'speech'
    this.duration = 0;
    this.position = 0;
    this.missing = false;  // the pre-rendered file is not there
    this.usingBlob = false;   // the audio was fetched from Deepgram this visit
    this.asked = false;    // we have already been round to Deepgram for this one

    this.note.textContent = NARRATION_NOTE;
    this.note.hidden = false;

    var self = this;
    this.audio = new Audio();
    this.audio.preload = 'metadata';
    this.audio.src = AUDIO_DIR + work.id + '.mp3';
    /* Deepgram's mp3 carries no duration header, so the browser reports Infinity
       until the whole file has arrived. Start from the length the text implies
       and take the real figure the moment it settles. */
    this.duration = this.estimate();
    this.dur.textContent = fmt(this.duration);
    function adopt() {
      if (!isFinite(self.audio.duration) || self.audio.duration <= 0) return;
      self.duration = self.audio.duration;
      self.dur.textContent = fmt(self.duration);
      self.paint();
    }
    this.audio.addEventListener('loadedmetadata', adopt);
    this.audio.addEventListener('durationchange', adopt);
    timings.then(function (all) {
      var known = all[work.id] && all[work.id].seconds;
      if (!known || self.mode !== 'audio' || isFinite(self.audio.duration)) return;
      self.duration = known;
      self.dur.textContent = fmt(self.duration);
      self.paint();
    });
    this.audio.addEventListener('timeupdate', function () { self.position = self.audio.currentTime; self.paint(); });
    this.audio.addEventListener('ended', function () {
      note('audio_complete', of(work, { source: self.usingBlob ? 'deepgram' : 'file', value: Math.round(self.duration) }));
      self.setState('idle'); self.position = 0; self.paint();
    });
    /* A missing file is only worth acting on once someone presses play —
       resolving it on page load would spend the day's generations unheard. */
    this.audio.addEventListener('error', function () {
      if (self.mode === 'speech') return;
      if (self.asked) { self.useSpeech(); if (self.state === 'loading') self.speakFrom(0); return; }
      self.missing = true;
      if (self.state === 'loading') self.resolve();
    });
    this.audio.addEventListener('waiting', function () { if (self.state === 'playing') self.setState('loading'); });
    this.audio.addEventListener('playing', function () { self.setState('playing'); });

    this.btn.addEventListener('click', function () { self.toggle(); });
    this.track.addEventListener('click', function (ev) {
      var r = self.track.getBoundingClientRect();
      self.seek((ev.clientX - r.left) / r.width);
    });
    this.track.addEventListener('keydown', function (ev) {
      var step = ev.shiftKey ? 0.1 : 0.03;
      if (ev.key === 'ArrowRight') { self.seek(self.fraction() + step); ev.preventDefault(); }
      else if (ev.key === 'ArrowLeft') { self.seek(self.fraction() - step); ev.preventDefault(); }
      else if (ev.key === ' ' || ev.key === 'Enter') { self.toggle(); ev.preventDefault(); }
    });
    this.setState('idle');
  }
  Player.prototype.estimate = function () {
    return (this.work.summary || '').split(/\s+/).length / WORDS_PER_SECOND;
  };
  Player.prototype.fraction = function () { return this.duration ? Math.min(1, this.position / this.duration) : 0; };
  Player.prototype.setState = function (s) {
    this.state = s;
    this.root.dataset.state = s;
    this.btn.setAttribute('aria-label', s === 'playing' ? 'Pause narration' : 'Play narration');
  };
  Player.prototype.paint = function () {
    var f = this.fraction();
    this.root.style.setProperty('--knob', (f * 100).toFixed(2) + '%');
    this.track.setAttribute('aria-valuenow', Math.round(f * 100));
    this.cur.textContent = fmt(this.position);
  };
  Player.prototype.toggle = function () {
    if (this.state === 'playing' || this.state === 'loading') this.pause();
    else this.play();
  };
  Player.prototype.claim = function () {
    if (current && current !== this) current.pause();
    current = this;
  };
  Player.prototype.play = function () {
    this.claim();
    if (this.state !== 'paused') {
      note('audio_play', of(this.work, { source: this.mode === 'speech' ? 'speech' : (this.missing ? 'deepgram' : 'file') }));
    }
    if (this.mode !== 'audio') { this.speakFrom(this.sentenceIndex || 0); return; }
    this.setState('loading');
    if (this.missing && !this.asked) { this.resolve(); return; }
    var p = this.audio.play();
    if (p && p.catch) p.catch(function () { /* the error handler picks it up */ });
  };

  /* No pre-rendered file: look in the cache, then ask Deepgram, then give up
     and let the browser read it. */
  Player.prototype.resolve = function () {
    var self = this;
    this.asked = true;
    TTS.obtain(this.work).then(function (blob) {
      if (!blob) { self.useSpeech(); if (self.state === 'loading') self.speakFrom(0); return; }
      self.missing = false;
      self.usingBlob = true;   // it came from Deepgram just now, not from the repo
      self.audio.src = URL.createObjectURL(blob);
      self.audio.load();
      var p = self.audio.play();
      if (p && p.catch) p.catch(function () { self.useSpeech(); });
    });
  };
  Player.prototype.pause = function () {
    if (this.mode === 'audio') this.audio.pause();
    else { this.stopSpeech(); }
    this.setState('paused');
  };
  Player.prototype.seek = function (f) {
    f = Math.max(0, Math.min(1, f));
    if (this.mode === 'audio') {
      if (!this.duration) return;
      var to = f * this.duration;
      var reach = this.audio.seekable.length ? this.audio.seekable.end(this.audio.seekable.length - 1) : 0;
      if (!isFinite(this.audio.duration) && reach) to = Math.min(to, reach);
      try { this.audio.currentTime = to; } catch (e) { return; }
      this.position = this.audio.currentTime; this.paint();
    } else {
      var idx = Math.floor(f * this.sentences.length);
      var wasPlaying = this.state === 'playing';
      this.stopSpeech();
      this.sentenceIndex = idx;
      this.position = this.offsets[idx] / this.chars * this.duration; this.paint();
      if (wasPlaying) this.speakFrom(idx); else this.setState('paused');
    }
  };

  /* --- spoken fallback: the browser's own British voice --- */
  Player.prototype.useSpeech = function () {
    if (this.mode === 'speech') return;
    this.mode = 'speech';
    var text = this.work.summary;
    this.sentences = text.match(/[^.!?]+[.!?]+["”’]?\s*|[^.!?]+$/g) || [text];
    this.offsets = []; var c = 0;
    for (var i = 0; i < this.sentences.length; i++) { this.offsets.push(c); c += this.sentences[i].length; }
    this.chars = c;
    this.duration = this.estimate();
    this.sentenceIndex = 0; this.position = 0;
    this.dur.textContent = fmt(this.duration);
    if (!('speechSynthesis' in window)) {
      this.note.textContent = 'This browser cannot read the piece aloud.';
      this.btn.disabled = true; return;
    }
    this.paint();
    if (this.state === 'loading') this.speakFrom(0);
  };
  function britishVoice() {
    var voices = window.speechSynthesis.getVoices();
    var prefs = ['Daniel', 'Google UK English Male', 'Microsoft Ryan', 'Microsoft George', 'Arthur', 'Oliver'];
    for (var i = 0; i < prefs.length; i++) {
      for (var j = 0; j < voices.length; j++) if (voices[j].name.indexOf(prefs[i]) === 0 && /en[-_]GB/i.test(voices[j].lang)) return voices[j];
    }
    for (var k = 0; k < voices.length; k++) if (/en[-_]GB/i.test(voices[k].lang)) return voices[k];
    return null;
  }
  Player.prototype.speakFrom = function (idx) {
    var self = this, synth = window.speechSynthesis;
    synth.cancel();
    this.claim();
    this.setState('playing');
    this.sentenceIndex = idx;
    var voice = britishVoice();
    var token = this.token = {};
    function next(i) {
      if (self.token !== token) return;
      if (i >= self.sentences.length) {
        note('audio_complete', of(self.work, { source: 'speech', value: Math.round(self.duration) }));
        self.setState('idle'); self.sentenceIndex = 0; self.position = 0; self.paint(); return;
      }
      self.sentenceIndex = i;
      var u = new SpeechSynthesisUtterance(self.sentences[i].trim());
      if (voice) u.voice = voice;
      u.lang = 'en-GB'; u.rate = 0.9; u.pitch = 0.85;
      var base = self.offsets[i];
      u.onboundary = function (ev) {
        if (self.token !== token) return;
        self.position = (base + (ev.charIndex || 0)) / self.chars * self.duration; self.paint();
      };
      u.onend = function () { if (self.token === token) next(i + 1); };
      u.onerror = function () { if (self.token === token) next(i + 1); };
      synth.speak(u);
    }
    next(idx);
  };
  Player.prototype.stopSpeech = function () {
    this.token = null;
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
  };
  if ('speechSynthesis' in window) window.speechSynthesis.onvoiceschanged = function () { /* warms the voice list */ };

  /* ---------- suggestions ---------- */
  function wireSuggest() {
    var dialog = document.getElementById('suggest-dialog');
    var form = document.getElementById('suggest-form');
    var text = document.getElementById('suggest-text');
    var email = document.getElementById('suggest-email');
    var note = document.getElementById('suggest-note');
    var trap = document.getElementById('suggest-website');
    var send = document.getElementById('suggest-send');
    if (!dialog || !dialog.showModal) return;
    /* `note` is the dialog's own message line in this scope, so the recorder is
       reached through the global rather than the shorthand used elsewhere. */
    document.getElementById('suggest-open').addEventListener('click', function () {
      window.CanonEvents && window.CanonEvents.record('suggestion_open', {});
      note.textContent = ''; dialog.showModal(); text.focus();
    });
    document.getElementById('suggest-cancel').addEventListener('click', function () { dialog.close(); });
    form.addEventListener('submit', function (ev) {
      ev.preventDefault();
      var topic = text.value.trim();
      if (!topic) return;
      var endpoint = (window.CANON_CONFIG || {}).suggestEndpoint || '';
      if (!endpoint) { note.textContent = 'The suggestion box is not connected yet.'; return; }
      send.disabled = true; note.textContent = 'Sending…';
      fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          topic: topic, email: email.value.trim(), page: location.href,
          date: new Date().toISOString(), website: trap.value,
        }),
      })
        .then(function (r) {
          return r.json().catch(function () { return {}; }).then(function (data) {
            if (!r.ok) throw new Error(data.error || r.status);
            window.CanonEvents && window.CanonEvents.record('suggestion_sent', {});
            note.textContent = 'Thank you. Noted.'; text.value = ''; email.value = '';
            setTimeout(function () { dialog.close(); }, 900);
          });
        })
        .catch(function (err) { note.textContent = String(err.message || '').slice(0, 120) || 'That didn’t go through. Try again in a moment.'; })
        .then(function () { send.disabled = false; });
    });

    /* Anywhere outside the sheet closes it. The backdrop is the dialog's own
       pseudo-element, so a click on it still reports the dialog as the target —
       the box has to be measured. A keyboard-triggered click reports no
       coordinates at all, and must not count as being outside. */
    dialog.addEventListener('click', function (ev) {
      if (!ev.detail) return;
      var box = dialog.getBoundingClientRect();
      var inside = ev.clientX >= box.left && ev.clientX <= box.right
        && ev.clientY >= box.top && ev.clientY <= box.bottom;
      if (!inside) dialog.close();
    });
  }

  /* ---------- boot ---------- */
  function boot() {
    var ctx = parseDay();
    var n = dayNumber(ctx.day);
    var tpl = document.getElementById('work-template');
    var mount = document.getElementById('works');
    var picks = ORDER.map(function (c) { return pickFor(c, n); }).filter(Boolean);
    picks.forEach(function (a, i) {
      var node = render(a, tpl);
      node.querySelector('.ordinal').textContent = NUMERALS[i] || String(i + 1);
      mount.appendChild(node);
    });

    note('day_view', {
      day: iso(ctx.day),
      archive: ctx.archive,
      value: picks.length,
    });
    watchReach(picks);

    document.getElementById('dateline').textContent = longDate(ctx.day);
    document.title = picks.map(function (a) { return a.title; }).join(' · ') + ' · Canon';

    /* The first day has nothing before it; today has nothing after it. */
    var prev = document.getElementById('prev-day');
    if (n > 0) prev.href = '?d=' + iso(shift(ctx.day, -1));
    else prev.hidden = true;

    var next = document.getElementById('next-day');
    if (ctx.archive) {
      var after = shift(ctx.day, 1);
      next.href = utc(after) === utc(ctx.today) ? '/canon/' : '?d=' + iso(after);
      next.hidden = false;
    }

    wireSuggest();
    wireRail(picks);
  }

  var MASTHEAD = 78;   // the sticky masthead, which nothing should hide behind

  /* Scroll the work to the top of the reading area. The position is worked out
     here rather than left to the fragment, which fires before the plates have
     their height and lands short. Some environments ignore a smooth scroll
     altogether, so if nothing has moved a moment later, go straight there —
     better an abrupt arrival than a control that appears to do nothing. */
  function jumpTo(id) {
    var target = document.getElementById(id);
    if (!target) return;
    var to = Math.max(0, target.getBoundingClientRect().top + window.pageYOffset - MASTHEAD);
    var from = window.pageYOffset;
    try { window.scrollTo({ top: to, behavior: 'smooth' }); } catch (e) { window.scrollTo(0, to); }
    if (history.replaceState) history.replaceState(null, '', '#' + id);
    setTimeout(function () {
      if (Math.abs(window.pageYOffset - from) < 2 && Math.abs(from - to) > 4) {
        try { window.scrollTo({ top: to, behavior: 'instant' }); } catch (e) { window.scrollTo(0, to); }
      }
    }, 240);
  }

  /* A work counts as reached when a good part of it has been on screen. Fired
     once each: the question is which of the three a reader gets to, not how
     often a section crossed the fold while they scrolled. */
  function watchReach(picks) {
    if (!window.IntersectionObserver) return;
    var seen = {};
    var watch = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting || seen[entry.target.id]) return;
        seen[entry.target.id] = true;
        watch.unobserve(entry.target);
        var a = picks.filter(function (w) { return w.id === entry.target.id; })[0];
        if (a) note('work_view', of(a));
      });
    }, { threshold: 0.35 });
    picks.forEach(function (a) {
      var node = document.getElementById(a.id);
      if (node) watch.observe(node);
    });
  }

  /* ---------- the rail ----------
     Three works look alike at a glance and the page is long, so the rail says
     which one you are in and lets you jump between them. It is a list of links
     to the sections, which is what it behaves like. */
  function wireRail(picks) {
    var rail = document.getElementById('rail');
    if (!rail || picks.length < 2) return;
    var list = rail.querySelector('ol');
    var marks = picks.map(function (a, i) {
      var item = el('li');
      var link = el('a', 'rail-link');
      link.href = '#' + a.id;
      link.appendChild(el('span', 'rail-num', NUMERALS[i] || String(i + 1)));
      link.appendChild(el('span', 'rail-title', a.title));
      link.addEventListener('click', function (ev) {
        if (ev.detail === 0) return;   // let the keyboard use the plain anchor
        ev.preventDefault();
        jumpTo(a.id);
      });
      item.appendChild(link);
      list.appendChild(item);
      return { link: link, id: a.id };
    });
    rail.hidden = false;

    function show(at) {
      for (var k = 0; k < marks.length; k++) {
        marks[k].link.classList.toggle('is-here', k === at);
        if (k === at) marks[k].link.setAttribute('aria-current', 'true');
        else marks[k].link.removeAttribute('aria-current');
      }
    }
    function nearest() {
      var line = window.innerHeight * 0.34;
      var at = 0;
      for (var i = 0; i < marks.length; i++) {
        var node = document.getElementById(marks[i].id);
        if (node && node.getBoundingClientRect().top <= line) at = i;
      }
      return at;
    }
    function update() { show(nearest()); }

    /* Which work is being read. This watches the sections themselves rather
       than waiting for scroll events, because those are not dependable — after
       a programmatic smooth scroll some engines stop sending them altogether,
       which leaves the rail pointing at wherever it happened to be. An observer
       is told about the page directly and cannot fall out of step that way.
       The scroll listener stays as well; between them something always fires. */
    if (window.IntersectionObserver) {
      var watch = new IntersectionObserver(update, {
        threshold: [0, 0.25, 0.5, 0.75, 1],
        rootMargin: '-18% 0px -18% 0px',
      });
      marks.forEach(function (m) {
        var node = document.getElementById(m.id);
        if (node) watch.observe(node);
      });
    }
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    rail.addEventListener('click', function () { setTimeout(update, 420); });
    update();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})();
