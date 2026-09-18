# Collecting suggestions

A Cloudflare Worker in front of a D1 database. Chosen because it is one service
rather than two: D1 is Cloudflare's own SQLite, so there is no connection string
to keep alive, no build step, nothing that sleeps, and the free tier is far
beyond what this will ever use. (Neon would work too, but then you are running a
Postgres and a Worker or a Vercel function to reach it.)

## Deploy

From this directory:

```bash
npx wrangler d1 create canon-suggestions
```

Copy the `database_id` it prints into `wrangler.toml`, then:

```bash
npx wrangler d1 execute canon-suggestions --remote --file=schema.sql
npx wrangler secret put SALT          # any long random string
npx wrangler secret put ADMIN_TOKEN   # another one; this is how you read them back
npx wrangler deploy
```

`deploy` prints a URL like `https://canon-suggestions.<you>.workers.dev`. Put it
in `canon/config.js` as `suggestEndpoint` and the form starts posting to it.
Until then the form falls back to opening a prefilled GitHub issue.

## Reading them

```bash
curl -H "Authorization: Bearer YOUR_ADMIN_TOKEN" https://canon-suggestions.<you>.workers.dev
```

or straight from the database:

```bash
npx wrangler d1 execute canon-suggestions --remote \
  --command "SELECT created_at, topic, email FROM suggestions ORDER BY id DESC LIMIT 50"
```

## What it stores

`topic`, the optional `email`, the `page` it was sent from, and `created_at`.
It does not store the sender's address — only a salted hash of it, which is
enough to stop one person filing fifty suggestions an hour (the cap is five) and
not enough to identify anyone. Change `ALLOWED_ORIGINS` in `worker.js` if the
site ever moves.
