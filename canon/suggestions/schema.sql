CREATE TABLE IF NOT EXISTS suggestions (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  topic      TEXT NOT NULL,
  email      TEXT,
  page       TEXT,
  sender     TEXT,                                    -- salted hash, for rate limiting only
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS suggestions_recent ON suggestions (created_at DESC);
CREATE INDEX IF NOT EXISTS suggestions_sender ON suggestions (sender, created_at);

/* ---------------------------------------------------------------------------
   Events. One row per thing a reader did, carrying enough identity to join
   them into funnels and no more than that.

   `visitor` is a random id kept in the reader's own browser, so a second visit
   from the same browser can be recognised as a return. `session` is a fresh
   random id per page load, which is what makes a funnel reconstructable — day
   opened, work reached, spotlight lit, narration played, narration finished.
   Neither is derived from the person: no address is stored, and `sender` is a
   salted hash used only to throttle a flood.
--------------------------------------------------------------------------- */
CREATE TABLE IF NOT EXISTS events (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  name       TEXT NOT NULL,     -- day_view, work_view, spotlight_open, audio_play, audio_complete, suggestion_sent
  visitor    TEXT NOT NULL,     -- stable per browser
  session    TEXT NOT NULL,     -- one page load
  day        TEXT,              -- the catalogue day being read, ISO
  archive    INTEGER,           -- 1 if a past day was asked for by name
  work       TEXT,              -- artwork id
  artist     TEXT,
  era        TEXT,              -- old | nineteenth | modern
  source     TEXT,              -- plate | switch | file | deepgram | speech
  value      REAL,              -- seconds, where an event has a duration
  screen     TEXT,              -- narrow | wide
  country    TEXT,              -- from Cloudflare, country only
  sender     TEXT,              -- salted hash, for rate limiting only
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS events_recent  ON events (created_at DESC);
CREATE INDEX IF NOT EXISTS events_name    ON events (name, created_at);
CREATE INDEX IF NOT EXISTS events_work    ON events (work, name);
CREATE INDEX IF NOT EXISTS events_session ON events (session);
CREATE INDEX IF NOT EXISTS events_visitor ON events (visitor);
CREATE INDEX IF NOT EXISTS events_day     ON events (day, name);
