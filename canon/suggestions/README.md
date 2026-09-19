# Suggestions and events

A Cloudflare Worker in front of a D1 database, holding two things: the topic
suggestions people send, and a record of what readers did on the page. Chosen because it is one service
rather than two: D1 is Cloudflare's own SQLite, so there is no connection string
to keep alive, no build step, nothing that sleeps, and the free tier is far
beyond what this will ever use. (Neon would work too, but then you are running a
Postgres *and* a Worker or a Vercel function to reach it.)

## It is already live

    https://canon-suggestions.jatinpandey5.workers.dev

Deployed to the account for jatinpandey5@gmail.com, database `canon-suggestions`
(`b8874331-4ff9-4fd6-a160-fde18de11ddc`, region APAC). `canon/config.js` already
points at it, so the form on the site posts here.

## Events

| route | |
| --- | --- |
| `POST /events` | a batch from the page; no token, CORS-limited to the site |
| `GET /events` | the raw log (admin token) |
| `GET /stats` | counts and funnels (admin token), `?days=30` |

Six events are recorded, and only six — an unrecognised name is refused rather
than stored, so a typo in the page cannot quietly invent a column of nonsense.

| event | carries |
| --- | --- |
| `day_view` | the catalogue day, and whether a past day was asked for by name |
| `work_view` | which work, once it has been a third on screen |
| `spotlight_open` | which work, and `plate` or `switch` |
| `audio_play` | which work, and `file`, `deepgram` or `speech` |
| `audio_complete` | which work, and how long the recording ran |
| `suggestion_sent` | nothing but the fact of it |

### What identifies anybody

Nothing does. Two random ids are kept. `visitor` lives in the reader's own
localStorage, which is what makes a second visit countable as a return; clearing
site data makes them a new person, and a private window is always new. `session`
is fresh on every page load, and is what lets a funnel be reconstructed — day
opened, work reached, spotlight lit, narration played, narration finished.

No address is stored. The Worker keeps a salted hash of it, as it does for
suggestions, purely to throttle a flood, and a country code from Cloudflare.
A browser sending Do Not Track is not recorded at all — one line in
`canon/events.js` if you would rather it were.

### Reading them

```bash
npm run stats     # totals, the funnel, per-work counts, by day
npm run funnel    # the per-work funnel, straight from the database
npm run events    # the raw log, most recent first
```

`stats` answers the usual questions in one call: how many visitors and sessions,
how many of them had been before, which day each session was reading, and for
every work how many sessions reached it, lit it, played it and finished it —
along with whether the spotlight was opened by tapping the painting or the
switch, and narrow versus wide screens.

## Reading the suggestions

```bash
npm install     # once
npm run list    # straight from the database
npm run read    # over HTTP, using the token in your Keychain
```

Your global npm points at a work CodeArtifact registry whose token has expired,
which makes `npx wrangler` fail before it starts. The `.npmrc` here pins this
directory to the public registry, so these work regardless of that.

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

## The admin token

It is the one credential here. It guards nothing but reading the suggestions —
the form works without it — but a leaked one lets anyone read every address
people have left, so treat it accordingly.

It lives in two places and nowhere else: Cloudflare holds it as a Worker secret,
which is write-only (you can set it, never read it back), and your login Keychain
holds your copy. It is not in this repo, not in `config.js`, and not in your
shell history.

### Rotating it

```bash
npm run token:new     # generates one, puts it straight in the Keychain, prints nothing
npm run token:push    # sends that same value to Cloudflare
```

The old token stops working the moment the second command finishes. Nothing is
ever displayed, so nothing lands in your scrollback; the command line holds
`$(openssl rand …)` rather than the value, so nothing lands in your history
either. To store a token you already have instead of generating one:

```bash
npm run token:set     # prompts twice, echoes nothing
npm run token:push
```

### Using it

```bash
npm run read          # reads the Keychain and curls the Worker; the token never appears
npm run token:show    # prints it, for when you need to paste it somewhere
```

Prefer `npm run read`. `token:show` puts the token in your terminal scrollback,
which is the most likely way to leak it by accident.

### If it does leak

Run the two rotation commands. There is nothing else to clean up — the old value
is not stored anywhere that outlives it, and a token that no longer matches the
Worker's secret is inert.

## Changing the Worker

```bash
npm run deploy        # after editing worker.js
npm run logs          # watch requests live
npx wrangler secret put SALT   # rotate the hash salt (past hashes stop matching)
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
