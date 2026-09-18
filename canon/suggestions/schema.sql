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
