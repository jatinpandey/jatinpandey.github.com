# Canon

Three famous paintings a day, one from each of three eras, each with a short written history and a two-minute narration in a solemn British voice.

- `index.html`, `style.css`, `app.js` — the page. Static; no build step.
- `data.js` — the catalogue (32 works). Every image is public domain and hot-linked from Wikimedia Commons at up to 3200px wide.
- `references.js` — generated. Each reference label resolved to its Wikipedia article and, where there is one, the Wikimedia image file, so a reference to a painting opens the painting.
- `frame.png` — generated. The gilt moulding the plates are framed in.
- `audio/<id>.mp3` — narration, pre-rendered with Deepgram Aura. All 32 are committed, so every visitor hears the Aura voice and no key goes near the browser.
- `audio/manifest.json` — what each recording is and how long it runs.
- `config.js` — narration settings: an optional Deepgram key and the generation caps.
- `scripts/speak.mjs` — renders the audio. `DEEPGRAM_API_KEY=… node canon/scripts/speak.mjs`
- `scripts/durations.mjs` — times the mp3s into the manifest. `node canon/scripts/durations.mjs`
- `scripts/mp3.mjs` — counts MP3 frames; used by the two above.
- `scripts/frame.mjs` — draws the frame. `node canon/scripts/frame.mjs > canon/frame.png`
- `scripts/references.mjs` — resolves the references against Wikipedia. `node canon/scripts/references.mjs > canon/references.js`
- `suggestions/` — a Cloudflare Worker and D1 database for the suggestion form. See its README.
- `scripts/fame.mjs` — scores works (or candidate Wikipedia titles) by pageviews, language editions, and inbound links. `node canon/scripts/fame.mjs "Guernica"`

## Narration

The player looks in three places, in order:

1. `audio/<id>.mp3`, pre-rendered by `scripts/speak.mjs` and committed — which is what every visitor gets today.
2. the browser's Cache Storage, holding anything Deepgram has already made on that device.
3. Deepgram Aura live, but only if `config.js` carries a key and both caps allow it.

Failing all three, the browser's own British voice reads the summary.

Deepgram's files carry no duration header, so a browser reports their length as
Infinity until the whole file arrives, and Chrome often keeps reporting it after
that. `scripts/durations.mjs` counts the MP3 frames and writes the real length
into the manifest, which the page reads so the scrubber is right from the start.
`speak.mjs` records it for anything it renders; run `durations.mjs` by hand only
to backfill. Without a figure there the player falls back to estimating from the
word count.

Live generation is capped twice — `perDay` (3) and `totalLimit` (30), counted per
browser in `localStorage` — and each recording is generated once and then cached, so
replaying it is free. Note that `config.js` is served to every visitor: a key put
there is public. The caps pace one reader; they do not protect the key. Pre-rendering
with `speak.mjs` keeps the key on your own machine and gives everyone the Aura voice,
which is the route to prefer.

## How the day is chosen

Day zero is 16 September 2026. Each category is shuffled with a seed of (category, cycle), and the day's index walks through the shuffle, so within one cycle no work repeats and the order changes on each pass. `?d=2026-09-20` shows a past day; future days are not shown.

## Categories

Categories are date ranges, so they cannot overlap:

| key | name | span |
| --- | --- | --- |
| `old` | Old Masters | 1400 – 1780 |
| `nineteenth` | Nineteenth Century | 1780 – 1886 |
| `modern` | Modern | 1886 – 1950 |

Subjects (myth, portrait, landscape) cut across periods, so they are better as tags than categories. Nothing after 1950 is included because those works are still in copyright and Commons cannot host them.

## The frame

`scripts/frame.mjs` draws one carved moulding section and lights it per pixel —
Lambert for the form, Blinn-Phong for the burnish, gold applied as a function of
height so bole shows in the hollows. `border-image` mitres it around each plate.

It writes a raster rather than an SVG deliberately. SVG lighting filters are
evaluated in device pixels, so `border-image` re-lights each of the nine slices
at its own scale and the stretched edges come out flat and pale. A raster has
the lighting baked in, and because the section never varies along an edge,
stretching one to any length is lossless. Re-run the script after editing the
profile; nothing else reads it.

## Suggestions

The "What other topics should we add?" button opens a small form. With
`suggestEndpoint` set in `config.js` it posts to the Worker in `suggestions/`,
which stores them in a D1 database — see `suggestions/README.md` for the four
commands that deploy it. With no endpoint set it falls back to opening a
prefilled GitHub issue on this repo, which stores nothing unless the visitor
presses Submit there.
