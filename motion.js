/* Depth cues: pointer-driven card tilt, a quiet tone when a 3D effect fires,
   and a short haptic tick on touch. All of it degrades to nothing. */
(function () {
  'use strict';

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  /* ---------- sound ---------- */
  var Ctx = window.AudioContext || window.webkitAudioContext;
  var ctx = null, master = null, armed = false;

  function ensure() {
    if (!Ctx || ctx) return ctx;
    try {
      ctx = new Ctx();
      master = ctx.createGain();
      master.gain.value = 0.9;
      master.connect(ctx.destination);
    } catch (e) { ctx = null; }
    return ctx;
  }

  // browsers keep audio suspended until a real gesture
  function unlock() {
    var c = ensure();
    if (c && c.state === 'suspended') c.resume();
    armed = true;
  }
  ['pointerdown', 'keydown', 'touchstart'].forEach(function (evt) {
    window.addEventListener(evt, unlock, { once: true, passive: true });
  });

  function tone(opts) {
    if (!armed) return;
    var c = ensure();
    if (!c || c.state !== 'running') return;

    var t = c.currentTime;
    var osc = c.createOscillator();
    var gain = c.createGain();
    var filter = c.createBiquadFilter();

    osc.type = opts.type || 'triangle';
    osc.frequency.setValueAtTime(opts.from, t);
    osc.frequency.exponentialRampToValueAtTime(opts.to, t + opts.dur);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(opts.cutoff || 2200, t);
    filter.Q.value = 0.7;

    gain.gain.setValueAtTime(0.0001, t);
    gain.gain.exponentialRampToValueAtTime(opts.peak, t + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + opts.dur);

    osc.connect(filter); filter.connect(gain); gain.connect(master);
    osc.start(t); osc.stop(t + opts.dur + 0.02);
  }

  var sfx = {
    // card rises and tilts toward the cursor
    lift:  function () { tone({ from: 300, to: 470, dur: 0.17, peak: 0.075, cutoff: 2400 }); },
    // card settles back
    drop:  function () { tone({ from: 420, to: 280, dur: 0.14, peak: 0.05, cutoff: 1700 }); },
    // press
    press: function () { tone({ from: 560, to: 300, dur: 0.1, peak: 0.1, type: 'sine', cutoff: 3000 }); }
  };

  /* ---------- haptics ---------- */
  function buzz(ms) {
    if (navigator.vibrate) { try { navigator.vibrate(ms); } catch (e) {} }
  }

  /* ---------- project cards ---------- */
  var rows = document.querySelectorAll('.project-row');
  Array.prototype.forEach.call(rows, function (row) {
    if (finePointer && !reduced) {
      var pending = false, ev = null;
      function apply() {
        pending = false;
        var r = row.getBoundingClientRect();
        var px = (ev.clientX - r.left) / r.width - 0.5;
        var py = (ev.clientY - r.top) / r.height - 0.5;
        row.style.setProperty('--ry', (px * 10).toFixed(2) + 'deg');
        row.style.setProperty('--rx', (-py * 6.5).toFixed(2) + 'deg');
        row.style.setProperty('--mx', (px * 90 + 50).toFixed(1) + '%');
        row.style.setProperty('--my', (py * 90 + 50).toFixed(1) + '%');
      }
      row.addEventListener('pointermove', function (e) {
        ev = e;
        if (!pending) { pending = true; requestAnimationFrame(apply); }
      });
      row.addEventListener('pointerenter', function (e) {
        if (e.pointerType === 'touch') return;
        sfx.lift();
      });
      row.addEventListener('pointerleave', function () {
        row.style.setProperty('--rx', '0deg');
        row.style.setProperty('--ry', '0deg');
        sfx.drop();
      });
    }
    row.addEventListener('pointerdown', function (e) {
      if (e.pointerType === 'touch') buzz(10);
      sfx.press();
    }, { passive: true });
  });

  /* ---------- pi button ---------- */
  // haptics only here — the pi button is deliberately silent
  var tap = document.getElementById('tap-btn');
  if (tap) {
    tap.addEventListener('pointerdown', function (e) {
      if (e.pointerType === 'touch') buzz(12);
    }, { passive: true });
  }
})();
