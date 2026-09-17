# Unagi

The one where you remember. A memory-palace trainer set in the Friends apartments, named for Ross’s “state of total awareness”. Lives at `/unagi/`.

Ten minutes a day of memory-palace practice. You leave a list of things along a fixed route through a sitcom apartment (Monica's or Joey and Chandler's from Friends), take a short break, then walk back through and pick them up. The next day starts by checking what stuck.

- `index.html`, `style.css`, `app.js`: the page. Static, no build step.
- `data.js`: the apartments (floor-plan shapes, ten spots each, route bends), the word list, the Major-system pictures for 00–99, and the six levels.

Jerry's apartment from Seinfeld is drawn in `data.js` but left out of `ORDER`, so it doesn't appear yet. Add `'jerry'` to `ORDER` to bring it back.

Progress is kept in `localStorage` under `unagi:v1` (progress saved under the older `palace:v1` or `memory-palace:v1` keys is moved over on first load) and never leaves the browser.

## A session

1. **Warm-up** (day one only): ten words for a minute, then free recall with no method. Its score is shown next to the first palace score.
2. **Last list**: walk the previous list's apartment and type what was at each spot. Skipped if that list is more than 7 days old.
3. **Tour** (first visit to an apartment): walk the ten spots one by one, then tap them in order forwards and backwards. After two wrong taps the next spot lights up on the plan.
4. **Place**: one item per screen. You must write a scene of at least three words.
5. **Break**: 30 seconds of counting down by sevens.
6. **Recall**: one spot at a time. Each answer is checked as soon as you submit it: a tick, or the right answer plus the scene you wrote. A checked answer is locked. Grading is forgiving about articles, plurals and small typos, and misses can be counted by hand on the results screen. The next-day check works the same way.
7. **Results**: the score, the scene you wrote for each miss, level progress, and what's next tomorrow.

The apartments in `ORDER` take turns (Monica's, then Joey and Chandler's), so a new list never goes where yesterday's still is. An unfinished session is cleared the next day, except one that only needed "Done" pressed; that one is saved.

## Levels

Scoring 90% or better on three days in a row, at the highest level you've unlocked, unlocks the next one. You can pick any unlocked level from the home page.

| level | what |
| --- | --- |
| 1 | 10 objects |
| 2 | 10 objects, spot names hidden during recall |
| 3 | 20 objects, two per spot |
| 4 | 10 two-digit numbers, with their Major-system picture shown |
| 5 | 10 numbers, picture only on request |
| 6 | 20 numbers, two per spot |

## Testing

`?d=2026-09-20` makes the page treat that date as today, so you can step through several days in a row. To start fresh, run `localStorage.removeItem('unagi:v1')` in the console and reload.
