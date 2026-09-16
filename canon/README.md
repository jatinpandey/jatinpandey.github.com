# Canon

Three famous paintings a day, one from each of three eras, each with a short written history and a two-minute narration in a solemn British voice.

- `index.html`, `style.css`, `app.js` — the page. Static; no build step.
- `data.js` — the catalogue (32 works). Every image is public domain and hot-linked from Wikimedia Commons at up to 3200px wide.
- `audio/<id>.mp3` — narration, pre-rendered with Deepgram Aura. If a file is missing the player falls back to the browser's own British voice and says so.
- `scripts/speak.mjs` — renders the audio. `DEEPGRAM_API_KEY=… node canon/scripts/speak.mjs`
- `scripts/fame.mjs` — scores works (or candidate Wikipedia titles) by pageviews, language editions, and inbound links. `node canon/scripts/fame.mjs "Guernica"`

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
