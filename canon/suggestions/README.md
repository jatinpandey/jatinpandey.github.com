# Collecting suggestions

A Cloudflare Worker in front of a D1 database. Chosen because it is one service
rather than two: D1 is Cloudflare's own SQLite, so there is no connection string
to keep alive, no build step, nothing that sleeps, and the free tier is far
beyond what this will ever use. (Neon would work too, but then you are running a
Postgres *and* a Worker or a Vercel function to reach it.)

## It is already live

    https://canon-suggestions.jatinpandey5.workers.dev

Deployed to the account for jatinpandey5@gmail.com, database `canon-suggestions`
(`b8874331-4ff9-4fd6-a160-fde18de11ddc`, region APAC). `canon/config.js` already
points at it, so the form on the site posts here.

## Reading what comes in

```bash
npx wrangler d1 execute canon-suggestions --remote \
  --command "SELECT created_at, topic, email FROM suggestions ORDER BY id DESC LIMIT 50"
```

or over HTTP, with the admin token:

```bash
curl -H "Authorization: Bearer YOUR_ADMIN_TOKEN" https://canon-suggestions.jatinpandey5.workers.dev
```

## What it stores, and what you can do with it

| column | what it is |
| --- | --- |
| `topic` | what they wrote |
| `email` | **plain text**, exactly as typed — reply to these directly |
| `page` | the page they were on |
| `created_at` | when |
| `sender` | a salted hash of their **IP address** — not the email |

The email is stored as given, so you can write back to anyone who left one. The
hashed column is a different thing entirely: it is the network address, kept only
so the Worker can tell that fifty suggestions in a minute came from one place
(the cap is five an hour). It is salted with a secret held in the Worker, so it
cannot be turned back into an address or matched against one — and it is not
needed for replying, because the email sits in its own column in the clear.

## Changing it

```bash
npx wrangler deploy                     # after editing worker.js
npx wrangler secret put ADMIN_TOKEN     # rotate the read token
npx wrangler secret put SALT            # rotate the hash salt (past hashes stop matching)
```

`ALLOWED_ORIGINS` in `worker.js` lists who may post: the live site and
`localhost:8123` for development. Add to it if the site ever moves.

## Starting over elsewhere

```bash
npx wrangler d1 create canon-suggestions           # copy the id into wrangler.toml
npx wrangler d1 execute canon-suggestions --remote --file=schema.sql
npx wrangler secret put SALT                       # any long random string
npx wrangler secret put ADMIN_TOKEN                # another one
npx wrangler deploy
```
