# Canon

Three famous paintings a day, each from a different era, with a short written history and a two-minute narration in a solemn British voice.

- `index.html`, `style.css`, `app.js` — the page. Static; no build step.
- `data.js` — the catalogue (62 works). Every image is public domain and hot-linked from Wikimedia Commons at up to 3200px wide.
- `references.js` — generated. The reference labels that resolve to an article about an actual work. Labels absent from it render as plain text.
- `frame.png` — generated. The gilt moulding the plates are framed in.
- `audio/<id>.mp3` — narration, pre-rendered with Deepgram Aura. All 32 are committed, so every visitor hears the Aura voice and no key goes near the browser.
- `audio/manifest.json` — what each recording is and how long it runs.
- `config.js` — narration settings: an optional Deepgram key and the generation caps.
- `scripts/speak.mjs` — renders the audio. `DEEPGRAM_API_KEY=… node canon/scripts/speak.mjs`
- `scripts/durations.mjs` — times the mp3s into the manifest. `node canon/scripts/durations.mjs`
- `scripts/mp3.mjs` — counts MP3 frames; used by the two above.
- `scripts/frame.mjs` — draws the frame. `node canon/scripts/frame.mjs > canon/frame.png`
- `scripts/references.mjs` — resolves the references against Wikipedia. Takes a couple of minutes; it searches one label at a time so as not to hammer the API. `node canon/scripts/references.mjs > canon/references.js`

## References

Three a work, and only linked when the link is worth following. A label is
searched whole, because the name in front of a work is what disambiguates it,
and the result is then checked against Wikidata: a link is kept only if it lands
on a creative or written work, a work of art, or a structure. An article about a
person is not a reference to their work — Keith Haring's page does not show his
dancing figures, and Michelangelo's does not show the Last Judgement — so those
render as plain text instead, along with movements and institutions. 58 of the
96 currently link; the rest say their piece and leave the reader to it.
- `events.js` — records what readers did, and sends it to the Worker in batches.
- `suggestions/` — the Cloudflare Worker and D1 database behind the suggestion form and the events. See its README.
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

## What gets in

Four tests, all of which a work has to pass:

1. **Public domain, and on Wikimedia Commons.** Not a fair-use upload held
   locally by Wikipedia — those exist for works still in copyright and cannot be
   hot-linked. This is what keeps most of the twentieth century out: Picasso,
   Dalí, Magritte, Chagall, O'Keeffe and Kahlo are all unavailable, which is why
   the Modern shelf leans on artists who died before about 1945.
2. **A scan of at least 2.8 megapixels**, which is the floor the original
   thirty-two set. The plates are served up to 3200px wide, and anything smaller
   goes soft on a large screen. Where the article's own image was too small, a
   better scan was found on Commons — Klee's Twittering Machine went from 1.3MP
   to 28MP that way. Two candidates were dropped for having no good scan at all.
3. **Inside one of the three date ranges**, by the date of the work, so the
   categories cannot overlap and a painter can appear in two of them.
4. **Famous enough to be worth a day.** The working test is whether a reasonably
   curious person would recognise it or be glad to have met it —
   `scripts/fame.mjs` scores candidates by pageviews, language editions and
   inbound links if a second opinion is wanted. No artist holds more than two
   places, so that a cycle is not three Van Goghs.

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

## The plate

Each plate's box is computed from the catalogue's own `w` and `h` before the
image is fetched, so the frame is never drawn at the wrong size and then jumped
to the right one. An unloaded `<img>` with `width: auto; height: auto` has no
size at all — the attributes do not help — so the width is set from the ratio and
the height cap, and `aspect-ratio` supplies the rest. Until the picture arrives
the gilt is held back entirely and a plain silhouette stands in the same box,
breathing slowly; the frame and the painting then fade in together.

## The spotlight

The plate itself opens the work in a dark room, and so does the switch beneath
it — the file on Commons is the same picture again, so tapping a painting shows
the painting rather than leaving the site. Its page is still a click away, from
inside the room.

The room is a modal dialog: a modal dialog
filling the top layer, the page behind it covered and unscrollable, one warm
wash falling from above the way a picture light does. The gilt is brightened a
little and a faint rake of light crosses the canvas, both falling from the upper
left, which is where the frame's own lighting was drawn from — so the room and
the moulding agree about where the light is. A museum label sits underneath.
Anywhere in the room closes it, as does Escape.

The switch is a switch: it flicks across and warms when the light goes on, and
each throw is answered by a short synthesised click — a burst of noise through a
bandpass, decaying fast, pitched higher going on than coming off — and a brief
haptic where the device has one. Both follow a press, so nothing makes a noise
the reader did not ask for.

## What readers did

`events.js` records seven things — the day opened, each work reached, each
spotlight lit, each narration played and finished, and the suggestion form both
opened and sent, which gives the drop-off between the two —
and posts them in batches to the Worker in `suggestions/`, with `sendBeacon` on
the way out so the last few are not lost when the tab closes. Two random ids go
with them, one per browser and one per page load, which between them answer
return visits and funnels. Nothing identifies a person, and a browser sending Do
Not Track is not recorded. `npm run stats` in `suggestions/` reads it back.

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

The "Want more than just art?" button opens a form — centred on a desktop, a
sheet rising from the bottom edge on a phone, dismissed by clicking outside it.
It posts to the Cloudflare Worker in `suggestions/`, which keeps them in a D1
database; `suggestEndpoint` in `config.js` says where. That is already deployed
and wired up — see `suggestions/README.md` for how to read what comes in.
