/* Unagi — ten minutes a day of memory-palace practice.
   Progress lives in localStorage under one key and never leaves the browser.
   ?d=YYYY-MM-DD pretends it is that day, for testing the daily flow. */
(() => {
  'use strict';

  const { PALACES, ORDER, OBJECTS, DIGIT_SOUNDS, PEGS, LEVELS } = window.PALACE;
  const KEY = 'unagi:v1';
  const OLD_KEYS = ['palace:v1', 'memory-palace:v1']; // earlier homes: /palace/, /memory-palace/
  const PASS = 0.9;            // share right that counts as a passing day
  const PASSES_NEEDED = 3;     // passing days in a row to unlock the next level
  const STALE_DAYS = 7;        // older lists skip the next-day check
  const BREAK_SECONDS = 30;
  const WARMUP_SECONDS = 60;
  const WARMUP_SIZE = 10;
  const MAX_SESSIONS = 400;
  const TIPS = [
    'Make it move.',
    'Make it enormous, or tiny.',
    'Give it a sound.',
    'Give it a smell.',
    'Put yourself in the scene.',
    'Break something.',
    'Make it ridiculous.',
    'Use the spot itself: open it, sit on it, knock it over.'
  ];
  const STEP_NAMES = {
    warmup: 'Warm-up', warmupRecall: 'Warm-up', warmupResult: 'Warm-up',
    check: 'Last list', checkResult: 'Last list',
    tour: 'Tour', place: 'Place', break: 'Break', recall: 'Recall', result: 'Results'
  };
  const SVG_NS = 'http://www.w3.org/2000/svg';

  const view = document.getElementById('view');
  const streakEl = document.getElementById('streak');
  const storageNote = document.getElementById('storage-note');

  let storageOk = true;
  let state = load();
  let practice = null;   // a walk-through opened from the home page; not saved
  let homeRequested = false;
  let ticker = null;
  let lastScreen = '';
  let notice = '';

  /* ---------- days ---------- */
  const pad = (n) => String(n).padStart(2, '0');
  const isoOf = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  const dateOf = (iso) => { const [y, m, d] = iso.split('-').map(Number); return new Date(y, m - 1, d); };
  const dayIndex = (iso) => { const [y, m, d] = iso.split('-').map(Number); return Math.round(Date.UTC(y, m - 1, d) / 864e5); };
  const daysBetween = (a, b) => dayIndex(b) - dayIndex(a);

  function today() {
    const q = new URLSearchParams(location.search).get('d');
    return q && /^\d{4}-\d{2}-\d{2}$/.test(q) ? q : isoOf(new Date());
  }
  function whenLabel(iso, ref) {
    const gap = daysBetween(iso, ref);
    if (gap <= 0) return 'today';
    if (gap === 1) return 'yesterday';
    const opts = gap < 7 ? { weekday: 'long' } : { day: 'numeric', month: 'long' };
    return `on ${dateOf(iso).toLocaleDateString('en-GB', opts)}`;
  }
  const shortDate = (iso) => dateOf(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
  const longDate = (iso) => dateOf(iso).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' });
  const clock = (s) => `${Math.floor(s / 60)}:${pad(s % 60)}`;
  const capital = (s) => s.charAt(0).toUpperCase() + s.slice(1);

  /* ---------- storage ---------- */
  function blank() {
    return { v: 1, level: 1, unlocked: 1, passes: 0, toured: {}, warmup: null, sessions: [], used: [], active: null };
  }
  function load() {
    try {
      for (const oldKey of OLD_KEYS) {
        const old = localStorage.getItem(oldKey);
        if (old == null) continue;
        if (localStorage.getItem(KEY) == null) localStorage.setItem(KEY, old);
        localStorage.removeItem(oldKey);
      }
      const saved = JSON.parse(localStorage.getItem(KEY));
      if (saved && saved.v === 1) return Object.assign(blank(), saved);
    } catch (e) {
      storageOk = false;
    }
    return blank();
  }
  function save() {
    try {
      localStorage.setItem(KEY, JSON.stringify(state));
      storageOk = true;
    } catch (e) {
      storageOk = false;
    }
  }
  const track = (step, params) => window.gtag?.('event', `unagi_${step}`, params);

  /* ---------- picking lists ---------- */
  function shuffle(list) {
    const a = list.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }
  const range = (n) => [...Array(n).keys()];

  // objects don't repeat until the whole list has been used
  function pickObjects(n, avoid = []) {
    const skip = new Set(state.used.concat(avoid));
    let pool = OBJECTS.filter((w) => !skip.has(w));
    if (pool.length < n) {
      state.used = [];
      pool = OBJECTS.filter((w) => !avoid.includes(w));
    }
    const picked = shuffle(pool).slice(0, n);
    state.used = state.used.concat(picked);
    return picked;
  }
  const pickNumbers = (n) => shuffle(range(100)).slice(0, n).map(pad);

  function makeItems(level, palaceId, avoid) {
    const n = PALACES[palaceId].spots.length * level.perSpot;
    const values = level.kind === 'numbers' ? pickNumbers(n) : pickObjects(n, avoid);
    return values.map((value, k) => ({ spot: Math.floor(k / level.perSpot), value }));
  }
  const levelOf = (n) => LEVELS[Math.min(Math.max(n, 1), LEVELS.length) - 1];
  const itemsAt = (items, spot) => items.map((it, k) => (it.spot === spot ? k : -1)).filter((k) => k >= 0);
  const count = (list) => list.filter(Boolean).length;
  const soundsFor = (num) => num.split('').map((d) => `${d} is ${DIGIT_SOUNDS[d].replace(/, ([^,]*)$/, ' or $1')}`).join(', ');

  /* ---------- grading ---------- */
  const clean = (s) => String(s || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, ' ').trim();
  const forms = (w) => new Set([w, w.replace(/s$/, ''), w.replace(/es$/, '')]);

  function distance(a, b) {
    const row = range(b.length + 1);
    for (let i = 1; i <= a.length; i++) {
      let prev = row[0];
      row[0] = i;
      for (let j = 1; j <= b.length; j++) {
        const keep = row[j];
        row[j] = Math.min(row[j] + 1, row[j - 1] + 1, prev + (a[i - 1] === b[j - 1] ? 0 : 1));
        prev = keep;
      }
    }
    return row[b.length];
  }

  // forgiving: articles, plurals and small typos all count
  function matchesWord(answer, target) {
    const words = clean(answer).split(' ').filter((w) => w && !['a', 'an', 'the'].includes(w));
    if (!words.length) return false;
    const goal = clean(target).replace(/ /g, '');
    const goals = forms(goal);
    const slack = goal.length >= 9 ? 2 : goal.length >= 5 ? 1 : 0;
    return [words.join(''), ...words].some((cand) =>
      [...forms(cand)].some((f) => goals.has(f) || (slack && [...goals].some((g) => distance(f, g) <= slack))));
  }
  function matchesNumber(answer, target) {
    const digits = String(answer || '').replace(/\D/g, '');
    return digits.length > 0 && digits.length <= 2 && pad(Number(digits)) === target;
  }
  const grade = (kind, answer, value) => (kind === 'numbers' ? matchesNumber(answer, value) : matchesWord(answer, value));

  function warmupHits(w) {
    const left = w.answers.slice();
    return w.items.map((item) => {
      const k = left.findIndex((ans) => matchesWord(ans, item));
      if (k < 0) return false;
      left.splice(k, 1);
      return true;
    });
  }

  /* ---------- progress ---------- */
  function nextPalace() {
    const last = state.sessions[state.sessions.length - 1];
    return last ? ORDER[(ORDER.indexOf(last.palace) + 1) % ORDER.length] : ORDER[0];
  }

  // the most recent earlier list, if it hasn't had its next-day check
  function pendingCheck(date) {
    for (let i = state.sessions.length - 1; i >= 0; i--) {
      const s = state.sessions[i];
      if (s.date >= date) continue;
      if (s.nextDay) return null;
      return daysBetween(s.date, date) <= STALE_DAYS ? i : null;
    }
    return null;
  }

  function streakWith(extra) {
    const days = [...new Set(state.sessions.map((s) => s.date).concat(extra || []))].sort();
    if (!days.length || daysBetween(days[days.length - 1], today()) > 1) return 0;
    let n = 1;
    for (let i = days.length - 1; i > 0 && daysBetween(days[i - 1], days[i]) === 1; i--) n++;
    return n;
  }

  // what finishing a list at this level would do to the unlock count
  function levelOutcome(levelN, score, total) {
    if (levelN !== state.unlocked || levelN >= LEVELS.length) return { counts: false, passes: state.passes, unlocked: state.unlocked };
    const passed = score / total >= PASS;
    const passes = passed ? state.passes + 1 : 0;
    if (passes >= PASSES_NEEDED) return { counts: true, passed, up: true, passes: 0, unlocked: levelN + 1 };
    return { counts: true, passed, passes, unlocked: state.unlocked };
  }

  /* ---------- session flow ---------- */
  function startSession() {
    const date = today();
    const level = levelOf(state.level);
    const palace = nextPalace();
    const phases = [];
    let warmup = null;
    if (!state.warmup && !state.sessions.length) {
      phases.push('warmup', 'warmupRecall', 'warmupResult');
      warmup = { items: pickObjects(WARMUP_SIZE), answers: [] };
    }
    const check = pendingCheck(date);
    if (check != null) phases.push('check', 'checkResult');
    if (!state.toured[palace]) phases.push('tour');
    phases.push('place', 'break', 'recall', 'result');
    state.active = {
      date, palace, level: level.n, phases, p: 0, i: 0,
      warmup,
      check: check == null ? null : { index: check, answers: [], correct: [] },
      tour: null, brk: null, hints: [],
      items: makeItems(level, palace, warmup ? warmup.items : []),
      scenes: [], answers: [], correct: []
    };
    notice = '';
    homeRequested = false;
    save();
    track('start', { level: level.n, palace, day_one: Boolean(warmup) });
    render();
  }

  const active = () => state.active;
  const phase = () => state.active.phases[state.active.p];
  function advance() {
    const a = active();
    a.p += 1;
    a.i = 0;
    save();
    render();
  }

  function skipWarmup() {
    const a = active();
    a.phases = a.phases.filter((p) => !p.startsWith('warmup'));
    a.warmup = null;
    a.p = 0;
    a.i = 0;
    state.warmup = { skipped: true };
    save();
    render();
  }

  function finish(quiet) {
    const a = active();
    const score = count(a.correct);
    const total = a.items.length;
    const out = levelOutcome(a.level, score, total);
    state.sessions.push({
      date: a.date, palace: a.palace, level: a.level,
      items: a.items, scenes: a.scenes, answers: a.answers, correct: a.correct,
      score, total, nextDay: null
    });
    if (state.sessions.length > MAX_SESSIONS) state.sessions = state.sessions.slice(-MAX_SESSIONS);
    state.toured[a.palace] = true;
    state.passes = out.passes;
    if (out.up) {
      state.unlocked = out.unlocked;
      state.level = out.unlocked;
      track('level_up', { level: out.unlocked });
    }
    state.active = null;
    save();
    track('done', { level: a.level, score, total });
    if (!quiet) render();
  }

  // the session stays saved; home offers Resume
  function exitSession() {
    save();
    showHome();
  }
  function showHome() {
    practice = null;
    homeRequested = true;
    render();
  }

  function discardSession() {
    state.active = null;
    homeRequested = false;
    save();
    render();
  }

  // a session left over from an earlier day: keep it if only "Done" was missing
  function tidy() {
    const a = active();
    if (!a || a.date === today()) return;
    if (phase() === 'result') {
      finish(true);
    } else {
      state.active = null;
      notice = 'Your last session wasn’t finished, so it was cleared.';
      save();
    }
  }

  /* ---------- building blocks ---------- */
  function h(tag, props, ...kids) {
    const el = document.createElement(tag);
    setProps(el, props);
    for (const kid of kids.flat(Infinity)) {
      if (kid == null || kid === false) continue;
      el.append(kid.nodeType ? kid : String(kid));
    }
    return el;
  }
  function s(tag, props, text) {
    const el = document.createElementNS(SVG_NS, tag);
    setProps(el, props);
    if (text != null) el.textContent = text;
    return el;
  }
  function setProps(el, props) {
    for (const [k, v] of Object.entries(props || {})) {
      if (v == null || v === false) continue;
      if (k === 'class') el.setAttribute('class', v);
      else if (k.startsWith('on')) el.addEventListener(k.slice(2), v);
      else el.setAttribute(k, v === true ? '' : v);
    }
  }
  const btn = (label, onclick, cls = 'btn', extra = {}) => h('button', Object.assign({ type: 'button', class: cls, onclick }, extra), label);

  function planSvg(palaceId, opts = {}) {
    const p = PALACES[palaceId];
    const done = opts.done || new Set();
    const svg = s('svg', {
      class: 'plan', viewBox: '0 0 400 300', role: 'img',
      'aria-label': opts.label || `Floor plan of ${p.name}`
    });
    for (const sh of p.shapes) {
      const c = sh.c || '';
      if (sh.t === 'path') svg.append(s('path', { class: c, d: sh.d }));
      else if (sh.t === 'circle') svg.append(s('circle', { class: c, cx: sh.cx, cy: sh.cy, r: sh.r }));
      else if (sh.t === 'ellipse') svg.append(s('ellipse', { class: c, cx: sh.cx, cy: sh.cy, rx: sh.rx, ry: sh.ry }));
      else if (sh.t === 'text') svg.append(s('text', { class: 'label', x: sh.x, y: sh.y, 'text-anchor': sh.a || 'middle' }, sh.s));
      else if (sh.t === 'rect') {
        svg.append(s('rect', {
          class: c, x: sh.x, y: sh.y, width: sh.w, height: sh.h, rx: sh.rx || 1,
          transform: sh.rot ? `rotate(${sh.rot} ${sh.x + sh.w / 2} ${sh.y + sh.h / 2})` : null
        }));
      }
    }
    const points = [];
    p.spots.forEach((sp) => {
      (sp.via || []).forEach((v) => points.push(v));
      points.push([sp.x, sp.y]);
    });
    svg.append(s('polyline', { class: 'route', points: points.map((q) => q.join(',')).join(' ') }));
    p.spots.forEach((sp, i) => {
      const cls = ['marker'];
      if (done.has(i)) cls.push('is-done');
      if (i === opts.current) cls.push('is-current');
      if (i === opts.hint) cls.push('is-hint');
      const g = s('g', { class: cls.join(' '), transform: `translate(${sp.x} ${sp.y})` });
      g.append(s('circle', { class: 'halo', r: 16 }), s('circle', { r: 10.5 }), s('text', { 'text-anchor': 'middle', dy: '0.36em' }, String(i + 1)));
      svg.append(g);
    });
    return svg;
  }

  function stage(palaceId, planOpts, panelKids) {
    return h('div', { class: 'stage' },
      h('figure', { class: 'plan-card' },
        planSvg(palaceId, planOpts),
        h('figcaption', {}, PALACES[palaceId].name)),
      h('section', { class: 'panel' }, panelKids));
  }

  function sessionFrame(content) {
    const a = active();
    const labels = [];
    a.phases.forEach((ph) => {
      const name = stepName(ph, a);
      if (!labels.includes(name)) labels.push(name);
    });
    const cur = labels.indexOf(stepName(phase(), a));
    return [
      h('div', { class: 'session-bar' },
        h('ol', { class: 'steps', 'aria-label': 'Today’s session' },
          labels.map((name, k) => h('li', {
            class: k === cur ? 'is-current' : k < cur ? 'is-done' : null,
            'aria-current': k === cur ? 'step' : null
          }, name))),
        btn('Save and exit', exitSession, 'btn-link')),
      content
    ];
  }
  function stepName(ph, a) {
    if ((ph === 'check' || ph === 'checkResult') && a.check) {
      const rec = state.sessions[a.check.index];
      if (rec && daysBetween(rec.date, a.date) === 1) return 'Yesterday';
    }
    return STEP_NAMES[ph];
  }

  function reviewList(palaceId, levelN, items, scenes, answers, correct, onToggle) {
    const p = PALACES[palaceId];
    const isNum = levelOf(levelN).kind === 'numbers';
    return h('ol', { class: 'review' }, items.map((it, k) => {
      const right = correct[k];
      const sp = p.spots[it.spot];
      return h('li', { class: right ? 'is-right' : 'is-wrong' },
        h('span', { class: 'review-spot' }, `${it.spot + 1} · ${sp.name}`),
        h('span', { class: 'review-item' }, isNum ? `${it.value} (${PEGS[Number(it.value)]})` : it.value),
        h('span', { class: 'review-answer' }, `You: ${answers[k] ? answers[k] : '—'}`),
        h('span', { class: 'review-mark' }, right ? '✓ Got it' : '✗ Missed'),
        right && !onToggle.overridden?.(k) ? null : h('div', { class: 'review-extra' },
          scenes[k] ? h('span', {}, 'Your scene: ', h('q', {}, scenes[k])) : h('span'),
          btn(right ? 'Undo' : 'Count it', () => onToggle(k), 'btn btn-small', {
            'aria-label': right ? `Stop counting ${it.value}` : `Count ${it.value} as right`
          })));
    }));
  }

  /* ---------- session screens ---------- */
  function viewWarmup() {
    const a = active();
    const timer = h('span', { class: 'timer' }, clock(WARMUP_SECONDS));
    const end = Date.now() + WARMUP_SECONDS * 1000;
    ticker = setInterval(() => {
      const left = Math.max(0, Math.ceil((end - Date.now()) / 1000));
      timer.textContent = clock(left);
      if (left === 0) advance();
    }, 250);
    return sessionFrame(h('section', { class: 'panel panel-wide' },
      h('p', { class: 'eyebrow' }, h('span', {}, 'Warm-up · no palace yet'), timer),
      h('h2', {}, 'Remember these ten things'),
      h('p', { class: 'lede' }, 'You have a minute. Use it however you like. Then type back as many as you can, in any order.'),
      h('ul', { class: 'word-grid' }, a.warmup.items.map((w) => h('li', {}, w))),
      h('div', { class: 'actions' },
        btn('Skip the warm-up', skipWarmup, 'btn-link'),
        btn('I’m ready', advance, 'btn btn-primary', { 'data-autofocus': true }))));
  }

  function viewWarmupRecall() {
    const a = active();
    const list = h('ul', { class: 'chips' });
    const tally = h('p', { class: 'hint', 'aria-live': 'polite' });
    const input = h('input', {
      type: 'text', id: 'warmup-input', maxlength: 40, autocomplete: 'off',
      autocapitalize: 'off', spellcheck: 'false', 'data-autofocus': true
    });
    const draw = () => {
      list.replaceChildren(...a.warmup.answers.map((w, k) => h('li', { class: 'chip' }, w,
        h('button', {
          type: 'button', class: 'chip-x', 'aria-label': `Remove ${w}`,
          onclick: () => { a.warmup.answers.splice(k, 1); save(); draw(); input.focus(); }
        }, '×'))));
      const n = a.warmup.answers.length;
      tally.textContent = n ? `${n} so far` : '';
    };
    draw();
    const add = () => {
      const v = input.value.trim();
      if (v) a.warmup.answers.push(v);
      input.value = '';
      save();
    };
    const form = h('form', { class: 'entry', onsubmit: (e) => { e.preventDefault(); add(); draw(); input.focus(); } },
      h('label', { for: 'warmup-input', class: 'field-label' }, 'Type one, then press Enter'),
      h('div', { class: 'entry-row' }, input, h('button', { type: 'submit', class: 'btn' }, 'Add')));
    return sessionFrame(h('section', { class: 'panel panel-wide' },
      h('p', { class: 'eyebrow' }, 'Warm-up'),
      h('h2', {}, 'What were they?'),
      h('p', { class: 'lede' }, 'Any order. Spelling doesn’t need to be perfect.'),
      form, list, tally,
      h('div', { class: 'actions' },
        btn('That’s all I remember', () => { add(); advance(); }, 'btn btn-primary'))));
  }

  function viewWarmupResult() {
    const a = active();
    const hits = warmupHits(a.warmup);
    const n = count(hits);
    return sessionFrame(h('section', { class: 'panel panel-wide' },
      h('p', { class: 'eyebrow' }, 'Warm-up'),
      h('p', { class: 'score' }, h('span', { class: 'score-num' }, n), ` of ${hits.length}`),
      h('p', { class: 'lede' }, 'That’s your starting point, with no method at all. Keep it in mind for later.'),
      h('ul', { class: 'word-grid is-marked' }, a.warmup.items.map((w, k) => h('li', { class: hits[k] ? 'is-right' : 'is-wrong' },
        h('span', { class: 'visually-hidden' }, hits[k] ? 'Remembered: ' : 'Missed: '), w))),
      h('div', { class: 'actions' },
        btn('Continue', () => {
          state.warmup = { date: a.date, score: n, total: hits.length };
          advance();
        }, 'btn btn-primary', { 'data-autofocus': true }))));
  }

  function newTour() {
    return { step: 'walk', i: 0, picked: [], chips: [], misses: 0, msg: '' };
  }
  function orderStep(t, step, n) {
    Object.assign(t, { step, picked: [], chips: shuffle(range(n)), misses: 0, msg: '' });
  }

  function viewTour(palaceId, t, onChange, onDone, doneLabel) {
    const p = PALACES[palaceId];
    const spots = p.spots;
    const n = spots.length;

    if (t.step === 'walk') {
      const sp = spots[t.i];
      return stage(palaceId, { current: t.i, done: new Set(range(t.i)) }, [
        h('p', { class: 'eyebrow' }, `Tour · spot ${t.i + 1} of ${n}`),
        h('h2', {}, sp.name),
        h('p', { class: 'lede' }, sp.note),
        h('p', { class: 'hint' }, 'Picture yourself standing here and looking around. The numbers on the plan are the order you walk in.'),
        h('div', { class: 'actions' },
          btn('Back', () => { t.i -= 1; onChange(); }, 'btn', { disabled: t.i === 0 }),
          btn(t.i === n - 1 ? 'I’ve walked it' : 'Next spot', () => {
            if (t.i < n - 1) t.i += 1;
            else orderStep(t, 'forward', n);
            onChange();
          }, 'btn btn-primary', { 'data-autofocus': true }))
      ]);
    }

    if (t.step === 'forward' || t.step === 'backward') {
      const forward = t.step === 'forward';
      const order = forward ? range(n) : range(n).reverse();
      const target = order[t.picked.length];
      const pick = (idx) => {
        if (idx === target) {
          t.picked.push(idx);
          t.misses = 0;
          t.msg = `Yes, ${spots[idx].name.replace(/^The /, 'the ')}.`;
          if (t.picked.length === n) {
            if (forward) {
              orderStep(t, 'backward', n);
              t.msg = 'Forwards, done. Now the other way.';
            } else {
              t.step = 'done';
            }
          }
        } else {
          t.misses += 1;
          const last = t.picked.length ? spots[t.picked[t.picked.length - 1]].name.replace(/^The /, 'the ') : '';
          if (last) t.msg = `Not that one. What comes ${forward ? 'after' : 'before'} ${last}?`;
          else t.msg = forward ? 'Not that one. Where does the walk start?' : 'Not that one. Where does the walk end?';
          if (t.misses >= 2) t.msg += ' It’s highlighted on the plan.';
        }
        onChange();
      };
      let focused = false;
      return stage(palaceId, { done: new Set(t.picked), hint: t.misses >= 2 ? target : -1 }, [
        h('p', { class: 'eyebrow' }, `Tour · ${forward ? 'forwards' : 'backwards'} · ${t.picked.length} of ${n}`),
        h('h2', {}, forward ? 'Walk it from the door' : 'Now walk it backwards'),
        h('p', { class: 'lede' }, forward
          ? 'Tap the spots in the order you’d pass them.'
          : 'Start at the last spot and work your way back to the door.'),
        h('div', { class: 'pick-grid' }, t.chips.map((idx) => {
          const used = t.picked.includes(idx);
          const auto = !used && !focused;
          if (auto) focused = true;
          return btn(spots[idx].name, () => pick(idx), 'pick', { disabled: used, 'data-autofocus': auto });
        })),
        h('p', { class: 'feedback', role: 'status' }, t.msg)
      ]);
    }

    return stage(palaceId, { done: new Set(range(n)) }, [
      h('p', { class: 'eyebrow' }, 'Tour · done'),
      h('h2', {}, 'You know the route'),
      h('p', { class: 'lede' }, `Ten spots, both ways. ${p.name} is ready to hold things.`),
      h('div', { class: 'actions' }, btn(doneLabel, onDone, 'btn btn-primary', { 'data-autofocus': true }))
    ]);
  }

  function viewTourPhase() {
    const a = active();
    if (!a.tour) a.tour = newTour();
    return sessionFrame(viewTour(a.palace, a.tour,
      () => { save(); render(); },
      () => {
        state.toured[a.palace] = true;
        a.tour = null;
        track('tour_done', { palace: a.palace });
        advance();
      },
      'Start placing'));
  }

  function viewPlace() {
    const a = active();
    const level = levelOf(a.level);
    const p = PALACES[a.palace];
    const k = a.i;
    const n = a.items.length;
    const item = a.items[k];
    const sp = p.spots[item.spot];
    const isNum = level.kind === 'numbers';
    const peg = isNum ? PEGS[Number(item.value)] : null;
    const showPeg = isNum && (level.hints || a.hints.includes(k));
    const slot = level.perSpot > 1 ? (k % level.perSpot === 0 ? 'first of two here' : 'second of two here') : null;

    const area = h('textarea', {
      id: 'scene', rows: 3, maxlength: 280, 'data-autofocus': true,
      placeholder: isNum ? (showPeg ? `The ${peg} is…` : 'Picture this number’s image at the spot…') : `The ${item.value} is…`,
      oninput: (e) => { a.scenes[k] = e.target.value; save(); }
    });
    area.value = a.scenes[k] || '';
    const err = h('p', { class: 'error', role: 'alert' });
    const form = h('form', {
      class: 'place-form',
      onsubmit: (e) => {
        e.preventDefault();
        const text = area.value.trim();
        if (text.split(/\s+/).filter(Boolean).length < 3) {
          err.textContent = 'Give it a few more words: what’s happening, and how does it look, sound or smell?';
          area.focus();
          return;
        }
        a.scenes[k] = text;
        if (k < n - 1) { a.i += 1; save(); render(); } else advance();
      }
    },
      h('label', { for: 'scene', class: 'field-label' }, 'What’s happening here?'),
      area,
      h('p', { class: 'tip' }, `Tip: ${TIPS[k % TIPS.length]}`),
      err,
      h('div', { class: 'actions' },
        k > 0 ? btn('Back', () => { a.i -= 1; save(); render(); }) : null,
        h('button', { type: 'submit', class: 'btn btn-primary' }, k < n - 1 ? 'Place it' : 'Place the last one')));

    let pegLine = null;
    if (showPeg) {
      pegLine = h('p', { class: 'peg' }, `${item.value} → `, h('strong', {}, peg), h('span', { class: 'hint' }, ` (${soundsFor(item.value)})`));
    } else if (isNum) {
      pegLine = btn('Show the picture for this number', () => { a.hints.push(k); save(); render(); }, 'btn-link');
    }

    const done = new Set(range(item.spot));
    return sessionFrame(stage(a.palace, { current: item.spot, done }, [
      h('p', { class: 'eyebrow' }, `Place · ${k + 1} of ${n}`),
      h('p', { class: 'spot-line' }, h('strong', {}, `${item.spot + 1}. ${sp.name}`), slot ? `, ${slot}` : ''),
      h('p', { class: 'hint' }, sp.note),
      h('p', { class: isNum ? 'item item-number' : 'item' }, item.value),
      pegLine,
      form
    ]));
  }

  function viewBreak() {
    const a = active();
    const p = PALACES[a.palace];
    if (!a.brk) {
      a.brk = { n: 150 + Math.floor(Math.random() * 100), right: 0 };
      save();
    }
    const b = a.brk;
    const end = Date.now() + BREAK_SECONDS * 1000;
    const timer = h('span', { class: 'timer' }, clock(BREAK_SECONDS));
    const heading = h('h2', {}, 'Quick break');
    const lede = h('p', { class: 'lede' }, 'Clear your head so the recall is honest. Count down by sevens.');
    const sum = h('span', { class: 'sum', id: 'sum-label' }, `${b.n} − 7 =`);
    const input = h('input', {
      type: 'text', inputmode: 'numeric', class: 'sum-input', autocomplete: 'off',
      'aria-labelledby': 'sum-label', 'data-autofocus': true
    });
    const fb = h('p', { class: 'feedback', role: 'status' });
    const form = h('form', {
      class: 'sum-form',
      onsubmit: (e) => {
        e.preventDefault();
        if (!input.value.trim()) return;
        if (Number(input.value.replace(/[^\d-]/g, '')) === b.n - 7) {
          b.n -= 7;
          b.right += 1;
          sum.textContent = `${b.n} − 7 =`;
          fb.textContent = `Right. ${b.right} so far.`;
        } else {
          fb.textContent = 'Not quite. Try again.';
        }
        input.value = '';
        save();
      }
    }, sum, input, h('button', { type: 'submit', class: 'btn' }, 'Check'));
    const next = btn('Start recall', advance, 'btn btn-primary');
    const after = h('div', { class: 'actions', hidden: true }, next);
    const skip = h('div', { class: 'actions' }, btn('Skip the break', advance, 'btn-link'));

    ticker = setInterval(() => {
      const left = Math.max(0, Math.ceil((end - Date.now()) / 1000));
      timer.textContent = clock(left);
      if (left > 0) return;
      clearTicker();
      form.hidden = true;
      fb.hidden = true;
      skip.hidden = true;
      heading.textContent = 'Time’s up';
      lede.textContent = `You got ${b.right} right. Now walk back through ${p.name} and pick everything up.`;
      after.hidden = false;
      next.focus();
    }, 250);

    return sessionFrame(h('section', { class: 'panel panel-wide' },
      h('p', { class: 'eyebrow' }, h('span', {}, 'Break'), timer),
      heading, lede, form, fb, after, skip));
  }

  // one spot at a time: today's recall and the next-day check share this.
  // Submitting a spot checks it straight away; a checked spot's answers are locked.
  function walkPanel({ palaceId, levelN, items, scenes, answers, checked, i, eyebrow, onBack, onDone, onSave }) {
    const p = PALACES[palaceId];
    const level = levelOf(levelN);
    const isNum = level.kind === 'numbers';
    const sp = p.spots[i];
    const ks = itemsAt(items, i);
    const done = checked.includes(i);
    const inputs = ks.map((k, j) => {
      const el = h('input', {
        type: 'text', id: `answer-${j}`, maxlength: 40, autocomplete: 'off', autocapitalize: 'off', spellcheck: 'false',
        inputmode: isNum ? 'numeric' : null, 'data-autofocus': !done && j === 0, readonly: done,
        oninput: (e) => { answers[k] = e.target.value; onSave(); }
      });
      el.value = answers[k] || '';
      el.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !done && j < ks.length - 1) {
          e.preventDefault();
          inputs[j + 1].focus();
        }
      });
      return el;
    });
    const verdict = (k) => {
      const it = items[k];
      if (grade(level.kind, answers[k], it.value)) return h('p', { class: 'verdict is-right' }, '✓ Right');
      const shown = isNum ? `${it.value} (${PEGS[Number(it.value)]})` : it.value;
      return h('div', { class: 'verdict is-wrong' },
        h('p', {}, '✗ It was ', h('strong', {}, shown)),
        scenes[k] ? h('p', { class: 'hint' }, 'Your scene: ', h('q', {}, scenes[k])) : null);
    };
    const noun = isNum ? 'number' : 'thing';
    const labelFor = (j) => (ks.length > 1 ? `${j === 0 ? 'First' : 'Second'} ${noun}` : (isNum ? 'The number' : 'What did you leave here?'));
    const last = i === p.spots.length - 1;
    const form = h('form', {
      class: 'walk-form',
      onsubmit: (e) => {
        e.preventDefault();
        if (done) { onDone(last); return; }
        ks.forEach((k, j) => { answers[k] = inputs[j].value.trim(); });
        checked.push(i);
        onSave();
        render();
      }
    },
      inputs.map((el, j) => [
        h('label', { for: el.id, class: 'field-label' }, labelFor(j)),
        el,
        done ? h('div', { role: j === 0 ? 'status' : null }, verdict(ks[j])) : null
      ]),
      done ? null : h('p', { class: 'tip' }, 'Leave it blank if nothing comes.'),
      h('div', { class: 'actions' },
        i > 0 ? btn('Back', onBack) : null,
        h('button', { type: 'submit', class: 'btn btn-primary', 'data-autofocus': done },
          !done ? 'Check' : last ? 'See results' : 'Next spot')));

    return stage(palaceId, { current: i, done: new Set(range(i)) }, [
      h('p', { class: 'eyebrow' }, eyebrow),
      h('h2', {}, level.names ? sp.name : `Spot ${i + 1}`),
      h('p', { class: 'lede' }, level.names
        ? (ks.length > 1 ? `Stand here and look around. You left two ${noun}s.` : 'Stand here for a moment and look around.')
        : `Picture spot ${i + 1} on the plan. What ${ks.length > 1 ? `two ${noun}s` : noun} did you leave there?`),
      form
    ]);
  }

  function viewRecall() {
    const a = active();
    const n = PALACES[a.palace].spots.length;
    if (!a.checked) a.checked = [];
    return sessionFrame(walkPanel({
      palaceId: a.palace, levelN: a.level, items: a.items, scenes: a.scenes, answers: a.answers, checked: a.checked, i: a.i,
      eyebrow: `Recall · spot ${a.i + 1} of ${n}`,
      onSave: save,
      onBack: () => { a.i -= 1; save(); render(); },
      onDone: (last) => {
        if (!last) { a.i += 1; save(); render(); return; }
        const kind = levelOf(a.level).kind;
        a.correct = a.items.map((it, k) => grade(kind, a.answers[k], it.value));
        advance();
      }
    }));
  }

  function viewCheck() {
    const a = active();
    const c = a.check;
    const rec = state.sessions[c.index];
    const n = PALACES[rec.palace].spots.length;
    if (!c.checked) c.checked = [];
    return sessionFrame(walkPanel({
      palaceId: rec.palace, levelN: rec.level, items: rec.items, scenes: rec.scenes, answers: c.answers, checked: c.checked, i: a.i,
      eyebrow: `${capital(whenLabel(rec.date, a.date))} · spot ${a.i + 1} of ${n}`,
      onSave: save,
      onBack: () => { a.i -= 1; save(); render(); },
      onDone: (last) => {
        if (!last) { a.i += 1; save(); render(); return; }
        const kind = levelOf(rec.level).kind;
        c.correct = rec.items.map((it, k) => grade(kind, c.answers[k], it.value));
        c.auto = c.correct.slice();
        advance();
      }
    }));
  }

  function viewCheckResult() {
    const a = active();
    const c = a.check;
    const rec = state.sessions[c.index];
    const n = count(c.correct);
    const total = rec.items.length;
    const toggle = (k) => { c.correct[k] = !c.correct[k]; save(); render(); };
    toggle.overridden = (k) => c.auto && c.auto[k] !== c.correct[k];
    const gap = daysBetween(rec.date, a.date);
    return sessionFrame(h('section', { class: 'panel panel-wide' },
      h('p', { class: 'eyebrow' }, `${PALACES[rec.palace].name}, ${whenLabel(rec.date, a.date)}`),
      h('p', { class: 'score' }, h('span', { class: 'score-num' }, n), ` of ${total}`),
      h('p', { class: 'lede' }, n === total
        ? `All of it stayed with you${gap === 1 ? ' overnight' : ''}.`
        : `That’s what stayed with you${gap === 1 ? ' overnight' : ''}. Missed ones usually had a quiet scene, or sat at a spot that looks like another.`),
      reviewList(rec.palace, rec.level, rec.items, rec.scenes, c.answers, c.correct, toggle),
      h('div', { class: 'actions' },
        btn('On to today’s list', () => {
          rec.nextDay = { date: a.date, answers: c.answers, correct: c.correct, score: n, total };
          track('check_done', { score: n, total, gap });
          advance();
        }, 'btn btn-primary', { 'data-autofocus': true }))));
  }

  function viewResult() {
    const a = active();
    if (!a.auto) a.auto = a.correct.slice();
    const p = PALACES[a.palace];
    const n = count(a.correct);
    const total = a.items.length;
    const out = levelOutcome(a.level, n, total);
    const toggle = (k) => { a.correct[k] = !a.correct[k]; save(); render(); };
    toggle.overridden = (k) => a.auto[k] !== a.correct[k];

    const lines = [];
    const prev = [...state.sessions].reverse().find((r) => r.level === a.level);
    if (state.warmup && state.warmup.date === a.date) {
      lines.push(`Warm-up with no method: ${state.warmup.score} of ${state.warmup.total}. With the palace: ${n} of ${total}.`);
    } else if (prev) {
      lines.push(`Last time at this level: ${prev.score} of ${prev.total}.`);
    }
    if (out.up) {
      const next = levelOf(out.unlocked);
      lines.push(`Level ${next.n} unlocked: ${next.name}. ${next.blurb}`);
    } else if (out.counts) {
      lines.push(out.passed
        ? `${out.passes} of ${PASSES_NEEDED} days in a row at 90% or better. Level ${a.level + 1} unlocks at ${PASSES_NEEDED}.`
        : `Get 90% or better on ${PASSES_NEEDED} days in a row to unlock level ${a.level + 1}.`);
    }
    const streak = streakWith([a.date]);
    const other = PALACES[ORDER[(ORDER.indexOf(a.palace) + 1) % ORDER.length]];

    return sessionFrame(h('section', { class: 'panel panel-wide' },
      h('p', { class: 'eyebrow' }, `${p.name} · level ${a.level}`),
      h('p', { class: 'score' }, h('span', { class: 'score-num' }, n), ` of ${total}`),
      h('div', { class: 'summary' }, lines.map((l) => h('p', {}, l))),
      reviewList(a.palace, a.level, a.items, a.scenes, a.answers, a.correct, toggle),
      h('p', { class: 'tomorrow' },
        streak > 1 ? `${streak} days in a row. ` : '',
        `Tomorrow: see what stuck from ${p.name}, then fill ${other.name}.`),
      h('div', { class: 'actions' }, btn('Done for today', () => finish(), 'btn btn-primary', { 'data-autofocus': true }))));
  }

  const SCREENS = {
    warmup: viewWarmup, warmupRecall: viewWarmupRecall, warmupResult: viewWarmupResult,
    check: viewCheck, checkResult: viewCheckResult,
    tour: viewTourPhase, place: viewPlace, break: viewBreak, recall: viewRecall, result: viewResult
  };

  /* ---------- practice walk-through ---------- */
  function openPractice(palaceId) {
    practice = { palace: palaceId, tour: newTour() };
    render();
  }
  function viewPractice() {
    const p = PALACES[practice.palace];
    return [
      h('div', { class: 'session-bar' },
        h('p', { class: 'bar-title' }, `Walk-through: ${p.name}`),
        btn('Back to home', showHome, 'btn-link')),
      viewTour(practice.palace, practice.tour, render, () => {
        state.toured[practice.palace] = true;
        save();
        showHome();
      }, 'Back to home')
    ];
  }

  /* ---------- home ---------- */
  function viewHome() {
    const t = today();
    const a = active();
    const doneToday = [...state.sessions].reverse().find((r) => r.date === t);
    const fresh = !state.sessions.length && !a;
    const level = levelOf(state.level);
    const nextId = nextPalace();
    const next = PALACES[nextId];
    const check = pendingCheck(t);
    const out = [];

    out.push(h('header', { class: 'masthead' },
      h('p', { class: 'dateline' }, longDate(t)),
      h('h1', {}, 'Unagi'),
      h('p', { class: 'standfirst' }, 'Ten minutes a day to get better at remembering. Leave things around an apartment you know by heart, then walk back through and pick them up.')));

    if (notice) out.push(h('p', { class: 'notice', role: 'status' }, notice));

    let card;
    if (a) {
      card = h('section', { class: 'card today' },
        h('h2', {}, 'You’re partway through'),
        h('p', { class: 'lede' }, `Today’s session is saved at “${stepName(phase(), a)}”.`),
        h('div', { class: 'actions' },
          btn('Throw it away', discardSession, 'btn-link'),
          btn('Resume', () => { homeRequested = false; render(); }, 'btn btn-primary')));
    } else if (doneToday) {
      const other = PALACES[nextId];
      card = h('section', { class: 'card today' },
        h('h2', {}, 'Done for today'),
        h('p', { class: 'lede' }, `You got ${doneToday.score} of ${doneToday.total} in ${PALACES[doneToday.palace].name}.`),
        h('p', {}, `Come back tomorrow to see what stuck, then fill ${other.name}. Until then, you can walk through either apartment below.`));
    } else if (fresh) {
      card = h('section', { class: 'card today' },
        h('h2', {}, 'Day one'),
        h('ol', { class: 'today-steps' },
          state.warmup ? null : h('li', {}, h('strong', {}, 'Warm-up. '), 'A one-minute memory test with no method, so you have something to compare against.'),
          h('li', {}, h('strong', {}, 'Tour. '), `Walk through ${next.name} from Friends: ten spots, in order.`),
          h('li', {}, h('strong', {}, 'Place and recall. '), 'Leave ten things along that route, take a short break, then walk back and pick them up.')),
        h('p', { class: 'hint' }, 'About 12 minutes. Tomorrow you’ll check what stuck overnight, then fill the apartment across the hall.'),
        h('div', { class: 'actions' }, btn('Start day one', startSession, 'btn btn-primary')));
    } else {
      const steps = [];
      if (check != null) {
        const rec = state.sessions[check];
        steps.push(h('li', {}, h('strong', {}, 'Check. '), `See what stuck from ${PALACES[rec.palace].name}, ${whenLabel(rec.date, t)}.`));
      }
      if (!state.toured[nextId]) steps.push(h('li', {}, h('strong', {}, 'Tour. '), `Learn the route through ${next.name}.`));
      const size = next.spots.length * level.perSpot;
      steps.push(h('li', {}, h('strong', {}, 'Place and recall. '), `${size} ${level.kind === 'numbers' ? 'numbers' : 'things'} in ${next.name}.`));
      card = h('section', { class: 'card today' },
        h('h2', {}, 'Today'),
        h('ol', { class: 'today-steps' }, steps),
        h('div', { class: 'actions' }, btn('Start today’s session', startSession, 'btn btn-primary')));
    }
    card.append(levelRow(level));
    out.push(card);

    if (state.sessions.length) out.push(stats(), history());
    out.push(palaces(nextId, Boolean(doneToday)), how());
    return out;
  }

  function levelRow(level) {
    const row = h('div', { class: 'level-row' });
    if (state.unlocked > 1) {
      row.append(
        h('label', { for: 'level', class: 'level-label' }, 'Level'),
        h('select', {
          id: 'level',
          onchange: (e) => { state.level = Number(e.target.value); save(); render(); }
        }, LEVELS.slice(0, state.unlocked).map((l) => h('option', { value: l.n, selected: l.n === state.level }, `${l.n}. ${l.name}`))));
    } else {
      row.append(h('p', { class: 'level-label' }, `Level ${level.n}: ${level.name}`));
    }
    const note = [level.blurb];
    if (state.level === state.unlocked && state.unlocked < LEVELS.length) {
      note.push(state.passes
        ? `${state.passes} of ${PASSES_NEEDED} passing days toward level ${state.unlocked + 1}.`
        : `Score 90% or better ${PASSES_NEEDED} days in a row to unlock level ${state.unlocked + 1}.`);
    }
    row.append(h('p', { class: 'hint level-note' }, note.join(' ')));
    return row;
  }

  function stats() {
    const last = state.sessions[state.sessions.length - 1];
    const checked = state.sessions.filter((r) => r.nextDay).slice(-7);
    const kept = checked.reduce((acc, r) => acc + r.nextDay.score, 0);
    const of = checked.reduce((acc, r) => acc + r.nextDay.total, 0);
    const tiles = [
      ['Days in a row', String(streakWith())],
      ['Level', `${state.level} of ${LEVELS.length}`],
      ['Last list', `${last.score}/${last.total}`],
      ['Kept overnight', of ? `${Math.round((100 * kept) / of)}%` : '—']
    ];
    return h('section', { class: 'stats', 'aria-label': 'Your progress' },
      tiles.map(([label, value]) => h('div', { class: 'stat' },
        h('p', { class: 'stat-value' }, value),
        h('p', { class: 'stat-label' }, label))));
  }

  function history() {
    const recent = state.sessions.slice(-10).reverse();
    return h('section', { class: 'history' },
      h('h2', { class: 'section-title' }, 'Recent lists'),
      h('div', { class: 'table-wrap' },
        h('table', { class: 'log' },
          h('thead', {}, h('tr', {}, ['Date', 'Apartment', 'Level', 'Same day', 'Next day'].map((c) => h('th', { scope: 'col' }, c)))),
          h('tbody', {}, recent.map((r) => h('tr', {},
            h('td', {}, shortDate(r.date)),
            h('td', {}, PALACES[r.palace].short),
            h('td', { class: 'num' }, r.level),
            h('td', { class: 'num' }, `${r.score}/${r.total}`),
            h('td', { class: 'num' }, r.nextDay ? `${r.nextDay.score}/${r.nextDay.total}` : '—')))))));
  }

  function palaces(nextId, doneToday) {
    return h('section', { class: 'palaces' },
      h('h2', { class: 'section-title' }, 'The apartments'),
      h('div', { class: 'palace-grid' }, ORDER.map((id) => {
        const p = PALACES[id];
        const tags = [p.show, state.toured[id] ? 'toured' : 'not toured yet'];
        if (id === nextId && !doneToday && state.sessions.length) tags.push('next up');
        return h('article', { class: 'card palace-card' },
          h('div', { class: 'plan-well' }, planSvg(id, { label: `Floor plan of ${p.name}, with its ten spots numbered in walking order` })),
          h('h3', {}, p.name),
          h('p', { class: 'hint' }, tags.join(', ')),
          h('details', { class: 'spots' },
            h('summary', {}, 'The ten spots'),
            h('ol', {}, p.spots.map((sp) => h('li', {}, sp.name)))),
          h('div', { class: 'actions' }, btn('Walk through', () => openPractice(id), 'btn btn-small')));
      })));
  }

  function how() {
    return h('details', { class: 'how', open: true },
      h('summary', {}, 'How it works'),
      h('div', { class: 'how-body' },
        h('p', {}, 'A memory palace is a route through a place you know well. You leave a vivid picture at each stop, then walk the route in your head to collect them. Memory competitors use versions of it to learn whole decks of cards and thousands of digits.'),
        h('p', {}, 'Each day you check yesterday’s list, place a new one, take a 30-second break, and walk back through. The two apartments take turns, so a new list never lands on top of yesterday’s.'),
        h('p', {}, 'Make the scenes strange. A violin kicking the purple door open will stick. A violin leaning against the door won’t.'),
        h('p', {}, 'Numbers use the Major system. Each digit is a consonant sound, and you add vowels to make a word you can picture. 47 is r then k, so it becomes a rock.'),
        h('div', { class: 'table-wrap' },
          h('table', { class: 'log digits' },
            h('tbody', {},
              h('tr', {}, h('th', { scope: 'row' }, 'Digit'), DIGIT_SOUNDS.map((_, d) => h('td', { class: 'num' }, d))),
              h('tr', {}, h('th', { scope: 'row' }, 'Sound'), DIGIT_SOUNDS.map((snd) => h('td', {}, snd))))))));
  }

  /* ---------- render ---------- */
  function clearTicker() {
    clearInterval(ticker);
    ticker = null;
  }

  function render() {
    clearTicker();
    const a = active();
    let screen;
    let content;
    if (practice) {
      screen = `practice:${practice.palace}:${practice.tour.step}`;
      content = viewPractice();
    } else if (a && !homeRequested) {
      screen = `session:${phase()}`;
      content = SCREENS[phase()]();
    } else {
      screen = 'home';
      content = viewHome();
    }
    view.replaceChildren(...[content].flat(Infinity).filter(Boolean));
    document.body.dataset.screen = screen.split(':')[0];

    const s = streakWith();
    streakEl.textContent = s > 1 ? `${s} days in a row` : '';
    storageNote.hidden = storageOk;

    const changed = screen !== lastScreen;
    lastScreen = screen;
    if (changed) window.scrollTo(0, 0);
    if (screen !== 'home') {
      const target = view.querySelector('[data-autofocus]');
      if (target) target.focus({ preventScroll: changed });
    }
  }

  // Enter submits from any text box or submit button; Shift+Enter still breaks a line in the scene box
  view.addEventListener('keydown', (e) => {
    const el = e.target;
    if (e.key !== 'Enter' || e.shiftKey || e.isComposing || e.defaultPrevented || !el.form) return;
    if (!el.matches('input[type="text"], textarea, button[type="submit"]')) return;
    e.preventDefault();
    el.form.requestSubmit();
  });

  // the wordmark opens the home view in place, so an unfinished session stays saved
  document.getElementById('home-link').addEventListener('click', (e) => {
    if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    showHome();
  });

  tidy();
  render();
})();
