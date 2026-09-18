# Canon

Three famous paintings a day, one from each of three eras, each with a short written history and a two-minute narration in a solemn British voice.

- `index.html`, `style.css`, `app.js` — the page. Static; no build step.
- `data.js` — the catalogue (32 works). Every image is public domain and hot-linked from Wikimedia Commons at up to 3200px wide.
- `audio/<id>.mp3` — narration, pre-rendered with Deepgram Aura.
- `config.js` — narration settings: an optional Deepgram key and the generation caps.
- `scripts/speak.mjs` — renders the audio. `DEEPGRAM_API_KEY=… node canon/scripts/speak.mjs`
- `scripts/fame.mjs` — scores works (or candidate Wikipedia titles) by pageviews, language editions, and inbound links. `node canon/scripts/fame.mjs "Guernica"`

## Narration

The player looks in three places, in order:

1. `audio/<id>.mp3`, pre-rendered by `scripts/speak.mjs` and committed.
2. the browser's Cache Storage, holding anything Deepgram has already made on that device.
3. Deepgram Aura live, but only if `config.js` carries a key and both caps allow it.

Failing all three, the browser's own British voice reads the summary.

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

## Suggestions

The "What other topics should we add?" button opens a small form. Set `SUGGEST_ENDPOINT` in `app.js` to a Formspree (or any JSON-accepting) URL to collect anonymously. Until then it opens a prefilled GitHub issue on this repo.
