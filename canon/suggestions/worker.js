/* Canon — somewhere for topic suggestions to land.

   A Cloudflare Worker in front of a D1 database. POST a suggestion, GET them
   back with the admin token. See README.md for the four commands that deploy
   it; after that there is nothing to keep running. */

const ALLOWED_ORIGINS = [
  'https://jatinpandey.github.io',
  'http://localhost:8123',
];

const MAX_TOPIC = 600;
const MAX_EMAIL = 200;
const PER_HOUR = 5;      // suggestions accepted from one sender per hour

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
    if (request.method === 'GET') return read(request, env, headers);
    if (request.method !== 'POST') return json({ error: 'Method not allowed' }, 405, headers);

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

    /* Senders are counted, not identified: the address is salted and hashed, and
       only the hash is stored, so it can rate-limit but not point at anyone. */
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
  },
};

async function read(request, env, headers) {
  const token = (request.headers.get('Authorization') || '').replace(/^Bearer\s+/i, '');
  if (!env.ADMIN_TOKEN || token !== env.ADMIN_TOKEN) {
    return json({ error: 'Unauthorized' }, 401, headers);
  }
  const { results } = await env.DB
    .prepare('SELECT id, topic, email, page, created_at FROM suggestions ORDER BY id DESC LIMIT 500')
    .all();
  return json({ count: results.length, suggestions: results }, 200, headers);
}

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
