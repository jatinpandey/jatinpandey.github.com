/* Canon — somewhere for suggestions and events to land.

   A Cloudflare Worker in front of a D1 database.

     POST /            a topic suggestion
     POST /events      a batch of events, sent by the page
     GET  /            the suggestions           (admin token)
     GET  /events      the raw event log         (admin token)
     GET  /stats       counts and funnels        (admin token)

   See README.md. Nothing here needs maintaining once deployed. */

const ALLOWED_ORIGINS = [
  'https://jatinpandey.github.io',
  'http://localhost:8123',
];

const MAX_TOPIC = 600;
const MAX_EMAIL = 200;
const PER_HOUR = 5;          // suggestions accepted from one sender per hour
const MAX_BATCH = 40;        // events accepted in one request
const EVENTS_PER_MINUTE = 120;

/* Only these are recorded. An unknown name is dropped rather than stored, so a
   typo in the page cannot quietly create a new column of meaningless data. */
const EVENT_NAMES = new Set([
  'day_view', 'work_view', 'spotlight_open', 'audio_play', 'audio_complete', 'suggestion_sent',
]);

export default {
  async fetch(request, env) {
    const origin = request.headers.get('Origin') || '';
    const headers = {
      'Access-Control-Allow-Origin': ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0],
      'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Max-Age': '86400',
      Vary: 'Origin',
    };
    if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers });

    const path = new URL(request.url).pathname.replace(/\/+$/, '') || '/';

    if (request.method === 'GET') {
      if (!authorised(request, env)) return json({ error: 'Unauthorized' }, 401, headers);
      if (path === '/events') return readEvents(request, env, headers);
      if (path === '/stats') return readStats(request, env, headers);
      return readSuggestions(env, headers);
    }
    if (request.method !== 'POST') return json({ error: 'Method not allowed' }, 405, headers);
    if (path === '/events') return writeEvents(request, env, headers);
    return writeSuggestion(request, env, headers);
  },
};

/* ---------- suggestions ---------- */

async function writeSuggestion(request, env, headers) {
  let body;
  try { body = await request.json(); } catch { return json({ error: 'Expected JSON' }, 400, headers); }

  // The form carries a field no person ever sees; anything that fills it is a bot.
  if (body.website) return json({ ok: true }, 202, headers);

  const topic = String(body.topic || '').trim();
  const email = String(body.email || '').trim();
  const page = String(body.page || '').trim().slice(0, 300);
  if (!topic) return json({ error: 'Say something first.' }, 400, headers);
  if (topic.length > MAX_TOPIC) return json({ error: 'That is longer than we can take.' }, 400, headers);
  if (email && (email.length > MAX_EMAIL || !email.includes('@'))) {
    return json({ error: 'That email does not look right.' }, 400, headers);
  }

  const sender = await fingerprint(request, env.SALT || 'canon');
  try {
    const seen = await env.DB
      .prepare("SELECT COUNT(*) AS n FROM suggestions WHERE sender = ? AND created_at > datetime('now', '-1 hour')")
      .bind(sender).first();
    if (seen && seen.n >= PER_HOUR) {
      return json({ error: 'That is plenty for now. Come back in an hour.' }, 429, headers);
    }
    await env.DB
      .prepare('INSERT INTO suggestions (topic, email, page, sender) VALUES (?, ?, ?, ?)')
      .bind(topic, email || null, page || null, sender).run();
  } catch (e) {
    return json({ error: 'Could not save that.' }, 500, headers);
  }
  return json({ ok: true }, 201, headers);
}

async function readSuggestions(env, headers) {
  const { results } = await env.DB
    .prepare('SELECT id, topic, email, page, created_at FROM suggestions ORDER BY id DESC LIMIT 500')
    .all();
  return json({ count: results.length, suggestions: results }, 200, headers);
}

/* ---------- events ---------- */

/* The page sends these with sendBeacon, which cannot set a JSON content type
   without provoking a preflight it is unable to answer — so the body arrives as
   text and is parsed here. */
async function writeEvents(request, env, headers) {
  let batch;
  try { batch = JSON.parse(await request.text()); } catch { return json({ error: 'Expected JSON' }, 400, headers); }
  const rows = Array.isArray(batch && batch.events) ? batch.events.slice(0, MAX_BATCH) : null;
  if (!rows || !rows.length) return json({ error: 'No events' }, 400, headers);

  const visitor = str(batch.visitor, 40);
  const session = str(batch.session, 40);
  if (!visitor || !session) return json({ error: 'No identity' }, 400, headers);

  const sender = await fingerprint(request, env.SALT || 'canon');
  const country = request.headers.get('CF-IPCountry') || null;

  try {
    const busy = await env.DB
      .prepare("SELECT COUNT(*) AS n FROM events WHERE sender = ? AND created_at > datetime('now', '-1 minute')")
      .bind(sender).first();
    if (busy && busy.n >= EVENTS_PER_MINUTE) return json({ ok: true, dropped: rows.length }, 202, headers);

    const insert = env.DB.prepare(
      `INSERT INTO events (name, visitor, session, day, archive, work, artist, era, source, value, screen, country, sender)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    );
    const statements = [];
    for (const e of rows) {
      const name = str(e.name, 30);
      if (!EVENT_NAMES.has(name)) continue;
      statements.push(insert.bind(
        name, visitor, session,
        str(e.day, 10), e.archive ? 1 : 0,
        str(e.work, 60), str(e.artist, 80), str(e.era, 20), str(e.source, 20),
        typeof e.value === 'number' && isFinite(e.value) ? e.value : null,
        str(e.screen, 10), country, sender
      ));
    }
    if (!statements.length) return json({ error: 'Nothing recognised' }, 400, headers);
    await env.DB.batch(statements);
    return json({ ok: true, stored: statements.length }, 201, headers);
  } catch (e) {
    return json({ error: 'Could not record that.' }, 500, headers);
  }
}

async function readEvents(request, env, headers) {
  const q = new URL(request.url).searchParams;
  const limit = Math.min(Number(q.get('limit')) || 200, 1000);
  const name = q.get('name');
  const sql = name
    ? 'SELECT * FROM events WHERE name = ? ORDER BY id DESC LIMIT ?'
    : 'SELECT * FROM events ORDER BY id DESC LIMIT ?';
  const stmt = name ? env.DB.prepare(sql).bind(name, limit) : env.DB.prepare(sql).bind(limit);
  const { results } = await stmt.all();
  return json({ count: results.length, events: results }, 200, headers);
}

/* Counts worth having without writing SQL: who came, what they reached, and
   how far down the funnel each work carried them. `days` narrows the window. */
async function readStats(request, env, headers) {
  try { return await stats(request, env, headers); }
  catch (e) { return json({ error: String(e && e.message || e) }, 500, headers); }
}

async function stats(request, env, headers) {
  const q = new URL(request.url).searchParams;
  const days = Math.min(Math.max(Number(q.get('days')) || 30, 1), 365);
  const since = `-${days} days`;

  const one = async (sql, ...bind) => (await env.DB.prepare(sql).bind(...bind).first()) || {};
  const many = async (sql, ...bind) => (await env.DB.prepare(sql).bind(...bind).all()).results || [];

  const totals = await one(
    `SELECT COUNT(*) AS events, COUNT(DISTINCT visitor) AS visitors, COUNT(DISTINCT session) AS sessions
     FROM events WHERE created_at > datetime('now', ?)`, since);

  /* A returning visitor is one whose first event predates this window. */
  const returning = await one(
    `SELECT COUNT(*) AS n FROM (
       SELECT visitor, MIN(created_at) AS first FROM events GROUP BY visitor
     ) WHERE first <= datetime('now', ?) AND visitor IN (
       SELECT DISTINCT visitor FROM events WHERE created_at > datetime('now', ?))`, since, since);

  const byDay = await many(
    `SELECT day, COUNT(DISTINCT visitor) AS visitors, COUNT(DISTINCT session) AS sessions,
            SUM(archive) AS archive_opens
     FROM events WHERE name = 'day_view' AND created_at > datetime('now', ?)
     GROUP BY day ORDER BY day DESC`, since);

  /* The funnel, per work: reached → lit → played → finished. */
  const byWork = await many(
    `SELECT work, artist, era,
            COUNT(DISTINCT CASE WHEN name = 'work_view'      THEN session END) AS reached,
            COUNT(DISTINCT CASE WHEN name = 'spotlight_open' THEN session END) AS spotlit,
            COUNT(DISTINCT CASE WHEN name = 'audio_play'     THEN session END) AS played,
            COUNT(DISTINCT CASE WHEN name = 'audio_complete' THEN session END) AS finished
     FROM events WHERE work IS NOT NULL AND created_at > datetime('now', ?)
     GROUP BY work ORDER BY reached DESC, spotlit DESC`, since);

  const spotlightSource = await many(
    `SELECT source, COUNT(*) AS n FROM events
     WHERE name = 'spotlight_open' AND created_at > datetime('now', ?) GROUP BY source`, since);

  const audioSource = await many(
    `SELECT source, COUNT(*) AS n FROM events
     WHERE name = 'audio_play' AND created_at > datetime('now', ?) GROUP BY source`, since);

  const screens = await many(
    `SELECT screen, COUNT(DISTINCT session) AS sessions FROM events
     WHERE created_at > datetime('now', ?) GROUP BY screen`, since);

  const countries = await many(
    `SELECT country, COUNT(DISTINCT visitor) AS visitors FROM events
     WHERE created_at > datetime('now', ?) GROUP BY country ORDER BY visitors DESC LIMIT 25`, since);

  const funnel = await one(
    `SELECT
       COUNT(DISTINCT CASE WHEN name = 'day_view'       THEN session END) AS opened_a_day,
       COUNT(DISTINCT CASE WHEN name = 'work_view'      THEN session END) AS reached_a_work,
       COUNT(DISTINCT CASE WHEN name = 'spotlight_open' THEN session END) AS lit_one,
       COUNT(DISTINCT CASE WHEN name = 'audio_play'     THEN session END) AS played_one,
       COUNT(DISTINCT CASE WHEN name = 'audio_complete' THEN session END) AS finished_one
     FROM events WHERE created_at > datetime('now', ?)`, since);

  return json({
    window_days: days,
    totals: { ...totals, returning_visitors: returning.n || 0 },
    funnel_by_session: funnel,
    by_day: byDay,
    by_work: byWork,
    spotlight_source: spotlightSource,
    audio_source: audioSource,
    screens,
    countries,
  }, 200, headers);
}

/* ---------- plumbing ---------- */

function authorised(request, env) {
  const token = (request.headers.get('Authorization') || '').replace(/^Bearer\s+/i, '');
  return !!env.ADMIN_TOKEN && token === env.ADMIN_TOKEN;
}

const str = (v, max) => {
  if (v === undefined || v === null) return null;
  const s = String(v).trim().slice(0, max);
  return s || null;
};

/* Senders are counted, not identified: the address is salted and hashed, and
   only the hash is stored, so it can throttle a flood but not point at anyone. */
async function fingerprint(request, salt) {
  const ip = request.headers.get('CF-Connecting-IP') || '';
  const bytes = new TextEncoder().encode(salt + ':' + ip);
  const digest = await crypto.subtle.digest('SHA-256', bytes);
  return [...new Uint8Array(digest)].slice(0, 12).map((b) => b.toString(16).padStart(2, '0')).join('');
}

function json(body, status, headers) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...headers, 'Content-Type': 'application/json' },
  });
}
