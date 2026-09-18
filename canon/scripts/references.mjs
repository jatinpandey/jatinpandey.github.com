#!/usr/bin/env node
/* Resolve every reference label to the Wikipedia article that explains it:

     node canon/scripts/references.mjs > canon/references.js

   Labels are prose, not titles — "Tracy Chevalier, Girl with a Pearl Earring
   (1999); film (2003)". The whole label is the query, because the name in front
   of the work is what tells Wikipedia which "Girl with a Pearl Earring" is
   meant: search for the work alone and you get Vermeer's painting, which is the
   piece being written about rather than a reference to it. Searching the whole
   label finds the novel, Picasso's Las Meninas rather than Velázquez's, and the
   Nat King Cole song rather than the Mona Lisa.

   A link is only kept when it lands on a *thing* — a painting, a film, a song,
   a book, a building. An article about a person is not a reference to a work:
   "Keith Haring's dancing figures" resolving to Keith Haring tells a reader
   nothing about the figures, and his page does not even show them. Wikidata
   decides this, by asking whether the target is a creative or written work, a
   work of art or a structure, rather than a human, an institution or a movement.
   Anything that is not gets no link at all, and the reference stands as plain
   text — an art movement is a subject, not a thing you can go and look at. */
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const here = path.dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);
const { ARTWORKS } = require(path.join(here, '..', 'data.js'));
const API = 'https://en.wikipedia.org/w/api.php';
const AGENT = 'canon/1.0 (https://jatinpandey.github.io/canon/; topic references)';
const PAUSE = 450;   // Wikipedia asks for a serial, unhurried client

const wait = (ms) => new Promise((r) => setTimeout(r, ms));

async function api(params) {
  const url = `${API}?${new URLSearchParams({ format: 'json', formatversion: '2', ...params })}`;
  for (let attempt = 0; attempt < 4; attempt++) {
    const r = await fetch(url, { headers: { 'User-Agent': AGENT } });
    if (r.status === 429 || r.status >= 500) { await wait(1500 * (attempt + 1)); continue; }
    if (!r.ok) return null;
    return r.json();
  }
  return null;
}

/* Strip the dates and the punctuation that separates one clause from the next,
   but keep every name: they are what disambiguates the work. */
const query = (label) => String(label)
  .replace(/\([^)]*\)/g, ' ')
  .replace(/[“”"’']/g, ' ')
  .replace(/[;,]/g, ' ')
  .replace(/\s+/g, ' ')
  .trim();

/* Wikipedia's search always answers something, and for a descriptive phrase with
   no article behind it the answer is often unrelated. So score the candidates
   rather than trusting the first.

   A label is usually "who, what": the reference is the work, and the name in
   front of it is there to disambiguate. So candidates are judged against the
   work half — that is what sends "Victor Hugo, Les Misérables" to the novel
   rather than to Hugo, and "Michelangelo, Pietà" to the sculpture rather than
   to an article about it being vandalised. A word the title shares counts for
   it, a word the title adds counts half against, and words matching the rest of
   the label break ties, which is how the Nat King Cole song beats the painting.
   When nothing scores against the work half, the whole label is tried instead. */
const STOP = new Set(['the', 'and', 'for', 'from', 'with', 'that', 'this', 'his', 'her', 'their',
  'series', 'poster', 'cover', 'album', 'film', 'song', 'novel', 'countless', 'about', 'after']);

/* Accents have to be folded, or "Misérables" matches nothing and the label
   loses to the artist's name. */
const fold = (t) => String(t).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
const words = (t) => [...new Set(fold(t).match(/[a-z0-9]{4,}/g) || [])].filter((w) => !STOP.has(w));

function workHalf(label) {
  const first = String(label).split(';')[0];
  const parts = first.split(',').map((t) => t.trim()).filter(Boolean);
  return parts.length === 2 ? parts[1] : first;
}

function score(title, label, target) {
  const bare = title.replace(/\s*\([^)]*\)\s*$/, '');   // "Scream (1996 film)" is judged as "Scream"
  const asked = new Set(words(target));
  let shared = 0, extra = 0;
  for (const w of words(bare)) (asked.has(w) ? shared++ : extra++);
  if (shared === 0) return -Infinity;
  const whole = new Set(words(label));
  let tie = 0;
  for (const w of words(title)) if (whole.has(w)) tie += 0.1;
  return shared - 0.5 * extra + tie;
}

function pick(hits, label, target) {
  let best = null, bestScore = -Infinity;
  hits.forEach(function (title, rank) {
    const s = score(title, label, target) - rank * 0.01;   // search rank breaks the remaining ties
    if (s > bestScore) { bestScore = s; best = title; }
  });
  return { title: best, score: bestScore };
}

async function search(label) {
  const data = await api({ action: 'query', list: 'search', srlimit: '5', srsearch: query(label) });
  const hits = (data?.query?.search || []).map((h) => h.title)
    .filter((t) => !/\(disambiguation\)$/i.test(t));   // a disambiguation page answers nothing
  const half = workHalf(label);
  let best = words(half).length ? pick(hits, label, half) : { title: null, score: -Infinity };
  if (best.score < 0.5) {
    const whole = pick(hits, label, label);
    if (whole.score > best.score) best = whole;
  }
  return best.score > -Infinity ? best.title : null;
}

/* Failing search, try the work's own name as an exact title. */
function narrow(label) {
  const text = String(label).split(';')[0].replace(/\([^)]*\)/g, ' ').replace(/[“”"]/g, ' ').replace(/\s+/g, ' ').trim();
  const parts = text.split(',').map((t) => t.trim()).filter(Boolean);
  if (parts.length === 2) return parts[1];
  if (parts.length > 2) return parts[0];
  return text;
}
async function exact(term) {
  if (!/^[A-Z0-9]/.test(term) && !term.includes(' ')) return null;   // a stray lowercase word, not a title
  const data = await api({ action: 'query', titles: term, redirects: '1', prop: 'info' });
  const page = data?.query?.pages?.[0];
  return page && !page.missing ? page.title : null;
}

/* ---------- is the target a thing, or just a person? ---------- */

/* Wikidata's own hierarchy answers this: everything worth linking to here is a
   creative work or an architectural structure, however many levels down. A
   human, a museum, a company or a city is none of those. */
const ROOTS = ['Q17537576' /* creative work */, 'Q47461344' /* written work */,
  'Q811979' /* architectural structure */, 'Q838948' /* work of art */,
  'Q2424752' /* product */];

async function entitiesFor(titles) {
  const found = new Map();
  for (let i = 0; i < titles.length; i += 45) {
    const data = await api({
      action: 'query', prop: 'pageprops', ppprop: 'wikibase_item',
      redirects: '1', titles: titles.slice(i, i + 45).join('|'),
    });
    const alias = new Map();
    for (const n of data?.query?.normalized || []) alias.set(n.from, n.to);
    for (const n of data?.query?.redirects || []) alias.set(n.from, n.to);
    const trail = (t) => { let cur = t; for (let k = 0; k < 4 && alias.has(cur); k++) cur = alias.get(cur); return cur; };
    const pages = new Map((data?.query?.pages || []).map((p) => [p.title, p]));
    for (const asked of titles.slice(i, i + 45)) {
      const id = pages.get(trail(asked))?.pageprops?.wikibase_item;
      if (id) found.set(asked, id);
    }
    await wait(PAUSE);
  }
  return found;
}

async function creativeWorks(ids) {
  const keep = new Set();
  for (let i = 0; i < ids.length; i += 120) {
    const batch = ids.slice(i, i + 120);
    const sparql = `SELECT DISTINCT ?item WHERE {
      VALUES ?item { ${batch.map((q) => 'wd:' + q).join(' ')} }
      VALUES ?root { ${ROOTS.map((q) => 'wd:' + q).join(' ')} }
      ?item wdt:P31/wdt:P279* ?root .
    }`;
    const url = 'https://query.wikidata.org/sparql?format=json&query=' + encodeURIComponent(sparql);
    try {
      const r = await fetch(url, { headers: { 'User-Agent': AGENT, Accept: 'application/sparql-results+json' } });
      if (!r.ok) throw new Error('WDQS ' + r.status);
      const data = await r.json();
      for (const row of data.results.bindings) keep.add(row.item.value.split('/').pop());
    } catch (e) {
      process.stderr.write(`\n  Wikidata query failed (${e.message}); keeping nothing from this batch.\n`);
    }
    await wait(800);
  }
  return keep;
}

/* ---------- resolve ---------- */

/* Three references a work. Four was more than the column wanted to carry, and
   the fourth was usually the weakest. */
const LIMIT = 3;
const labels = [...new Set(ARTWORKS.flatMap((a) => (a.echoes || []).slice(0, LIMIT).map((e) => e.label)))];

const candidate = new Map();
for (const [i, label] of labels.entries()) {
  process.stderr.write(`${String(i + 1).padStart(3)}/${labels.length}  ${label.slice(0, 42).padEnd(44)}`);
  let title = await search(label);
  await wait(PAUSE);
  if (!title) { title = await exact(narrow(label)); await wait(PAUSE); }
  if (title) candidate.set(label, title);
  process.stderr.write(`${title || '—'}\n`);
}

process.stderr.write(`\nchecking what ${candidate.size} of them actually point at…\n`);
const titles = [...new Set(candidate.values())];
const entity = await entitiesFor(titles);
const works = await creativeWorks([...new Set(entity.values())]);

const out = {};
const dropped = [];
for (const [label, title] of candidate) {
  const id = entity.get(title);
  if (id && works.has(id)) out[label] = { page: title };
  else dropped.push([label, title, id ? 'not a work' : 'no wikidata entry']);
}

process.stderr.write(`\n${Object.keys(out).length} of ${labels.length} references link to a work.\n`);
process.stderr.write(`${dropped.length} left as plain text:\n`);
for (const [label, title, why] of dropped) {
  process.stderr.write(`  ${label.slice(0, 44).padEnd(46)} ${String(title).slice(0, 30).padEnd(32)} ${why}\n`);
}

process.stdout.write('/* Generated by scripts/references.mjs — do not edit by hand.\n'
  + '   Reference labels that resolve to a Wikipedia article about an actual work.\n'
  + '   Labels absent here point at no article worth offering, and render unlinked. */\n'
  + 'const REFERENCES = ' + JSON.stringify(out, null, 1) + ';\n'
  + "if (typeof window !== 'undefined') window.REFERENCES = REFERENCES;\n"
  + "if (typeof module !== 'undefined') module.exports = { REFERENCES };\n");
