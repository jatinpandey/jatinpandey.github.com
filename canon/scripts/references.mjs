#!/usr/bin/env node
/* Resolve every reference label to a Wikipedia article and, where the article
   has one, the Wikimedia image file for it:

     node canon/scripts/references.mjs > canon/references.js

   Labels are prose, not titles, so lookup() below narrows each one the same way
   app.js used to at runtime. Anything that fails to resolve is simply absent
   from the map, and app.js falls back to a Wikipedia search for it. */
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const here = path.dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);
const { ARTWORKS } = require(path.join(here, '..', 'data.js'));
const API = 'https://en.wikipedia.org/w/api.php';
const THUMB = 3000;   // px on the long edge; big enough to fill a screen

function lookup(label) {
  const text = String(label)
    .split(';')[0]
    .replace(/\([^)]*\)/g, ' ')
    .replace(/[“”"]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  const parts = text.split(',').map((t) => t.trim()).filter(Boolean);
  if (parts.length === 2) return parts[1];   // artist, work
  if (parts.length > 2) return parts[0];     // a list of names
  return text;
}

const labels = [...new Set(ARTWORKS.flatMap((a) => (a.echoes || []).map((e) => e.label)))];
const terms = new Map();                     // search term -> [labels]
for (const label of labels) {
  const t = lookup(label);
  if (!terms.has(t)) terms.set(t, []);
  terms.get(t).push(label);
}

async function resolve(batch) {
  const url = `${API}?action=query&format=json&formatversion=2&redirects=1`
    + `&prop=pageimages&piprop=thumbnail|original&pithumbsize=${THUMB}`
    + `&titles=${batch.map(encodeURIComponent).join('|')}`;
  const r = await fetch(url, { headers: { 'User-Agent': 'canon/1.0 (https://jatinpandey.github.io/canon/)' } });
  if (!r.ok) throw new Error(`Wikipedia ${r.status}`);
  const data = await r.json();
  const found = new Map();
  // normalisation and redirects mean the title we asked for may not come back
  const alias = new Map();
  for (const n of data.query?.normalized || []) alias.set(n.from, n.to);
  for (const n of data.query?.redirects || []) alias.set(n.from, n.to);
  const trail = (t) => { let cur = t; for (let i = 0; i < 4 && alias.has(cur); i++) cur = alias.get(cur); return cur; };
  const pages = new Map((data.query?.pages || []).map((p) => [p.title, p]));
  for (const asked of batch) {
    const page = pages.get(trail(asked));
    if (!page || page.missing) continue;
    found.set(asked, {
      title: page.title,
      image: page.thumbnail?.source || page.original?.source || null,
    });
  }
  return found;
}

/* Pass one: take each narrowed term as an exact article title. */
const all = new Map();
const list = [...terms.keys()];
for (let i = 0; i < list.length; i += 40) {
  const batch = list.slice(i, i + 40);
  process.stderr.write(`titles ${i + 1}–${i + batch.length} of ${list.length}…\n`);
  const found = await resolve(batch);
  for (const [term, hit] of found) all.set(term, hit);
  await new Promise((r) => setTimeout(r, 300));
}

/* Pass two: only what pass one missed outright. A precise article without a
   picture beats a loosely related one with a picture, so a title that resolved
   is left alone — searching for a picture is how you end up pointing a note
   about a Rijksmuseum flash mob at a cartoon. */
async function search(query) {
  const url = `${API}?action=query&format=json&formatversion=2&list=search&srlimit=1`
    + `&srsearch=${encodeURIComponent(query)}`;
  const r = await fetch(url, { headers: { 'User-Agent': 'canon/1.0 (https://jatinpandey.github.io/canon/)' } });
  if (!r.ok) return null;
  const hit = (await r.json()).query?.search?.[0];
  return hit ? hit.title : null;
}
const plain = (label) => String(label).split(';')[0].replace(/\([^)]*\)/g, ' ')
  .replace(/[“”"]/g, ' ').replace(/\s+/g, ' ').trim();

/* Wikipedia's search always answers something. For a descriptive phrase with no
   article behind it the answer is often unrelated, so require the result to
   share a real word with what was asked before believing it. */
const STOP = new Set(['the', 'and', 'for', 'from', 'with', 'that', 'this', 'his', 'her',
  'their', 'series', 'poster', 'cover', 'album', 'film', 'countless']);
const words = (t) => new Set(String(t).toLowerCase().match(/[a-z]{4,}/g)?.filter((w) => !STOP.has(w)) || []);
function related(title, label) {
  const a = words(title), b = words(label);
  for (const w of a) if (b.has(w)) return true;
  return false;
}

/* A one-word lowercase term — "letters", "swirl" — is a word the label happened
   to end on, not a title, and matching it exactly lands somewhere useless. */
const vague = (t) => !/^[A-Z0-9]/.test(t) && !t.includes(' ');

const retry = [...terms.entries()].filter(([term]) => !all.has(term) || vague(term));
process.stderr.write(`\nsearching for ${retry.length} that no title matched…\n`);
for (const [term, labelsFor] of retry) {
  const title = await search(plain(labelsFor[0])) || await search(term);
  await new Promise((r) => setTimeout(r, 200));
  if (!title || !related(title, labelsFor[0])) continue;
  const found = await resolve([title]);
  await new Promise((r) => setTimeout(r, 200));
  if (found.has(title)) all.set(term, found.get(title));
}

const out = {};
for (const [term, labelsFor] of terms) {
  const hit = all.get(term);
  for (const label of labelsFor) {
    out[label] = hit ? { page: hit.title, image: hit.image || undefined } : { search: term };
  }
}
const withImage = Object.values(out).filter((v) => v.image).length;
const withPage = Object.values(out).filter((v) => v.page).length;
process.stderr.write(`\n${labels.length} references: ${withPage} resolved to an article, ${withImage} of those carry an image.\n`);

process.stdout.write('/* Generated by scripts/references.mjs — do not edit by hand.\n'
  + '   Maps each reference label to the Wikipedia article it names and, where\n'
  + '   there is one, the Wikimedia image file for it. */\n'
  + 'const REFERENCES = ' + JSON.stringify(out, null, 1) + ';\n'
  + "if (typeof window !== 'undefined') window.REFERENCES = REFERENCES;\n"
  + "if (typeof module !== 'undefined') module.exports = { REFERENCES };\n");
