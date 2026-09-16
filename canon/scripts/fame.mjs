#!/usr/bin/env node
/* Score how famous a painting is, using public Wikimedia signals.
   Usage:
     node canon/scripts/fame.mjs                       # scores the catalogue
     node canon/scripts/fame.mjs "Guernica" "Olympia (Manet)"   # scores candidate en.wikipedia titles
     node canon/scripts/fame.mjs --json > fame.json

   Signals (all free, no key):
     views      median daily English-Wikipedia pageviews over the last 365 days, summed over the
                article and its redirects so a renamed page is not undercounted (interest)
     langs      Wikidata sitelinks = number of Wikipedia language editions with an article (global reach)
     links      English-Wikipedia articles linking to the page, capped at 500 (how often it is referenced)
   Score = 0.5·z(log views) + 0.3·z(langs) + 0.2·z(log links), rescaled 0–100 within the set.
   Tiers (absolute, not relative): Canonical ≥ 800 views/day and ≥ 60 languages;
   Famous ≥ 250 views/day and ≥ 35 languages; otherwise Notable. */
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const UA = 'canon-fame-score/0.1 (https://jatinpandey.github.io/canon/)';
const here = path.dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);
const { ARTWORKS } = require(path.join(here, '..', 'data.js'));

const args = process.argv.slice(2);
const json = args.includes('--json');
const titles = args.filter((a) => !a.startsWith('--'));
const items = titles.length
  ? titles.map((t) => ({ id: t, title: t.replace(/ /g, '_') }))
  : ARTWORKS.map((a) => ({ id: a.id, title: decodeURIComponent(a.wiki), category: a.category }));

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
async function get(url) {
  const r = await fetch(url, { headers: { 'User-Agent': UA, Accept: 'application/json' } });
  if (!r.ok) throw new Error(`${r.status} ${url}`);
  return r.json();
}
function ymd(d) { return d.toISOString().slice(0, 10).replace(/-/g, ''); }

async function views(titles) {
  const end = new Date(); end.setUTCDate(end.getUTCDate() - 2);
  const start = new Date(end); start.setUTCDate(start.getUTCDate() - 365);
  const byDay = {};
  for (const title of titles) {
    const url = `https://wikimedia.org/api/rest_v1/metrics/pageviews/per-article/en.wikipedia/all-access/user/${encodeURIComponent(title)}/daily/${ymd(start)}/${ymd(end)}`;
    try {
      const j = await get(url);
      for (const i of j.items) byDay[i.timestamp] = (byDay[i.timestamp] || 0) + i.views;
    } catch { /* a redirect with no views returns 404; ignore */ }
    await sleep(120);
  }
  const days = Object.values(byDay).sort((a, b) => a - b);
  const median = days.length ? days[Math.floor(days.length / 2)] : 0;
  const total = days.reduce((a, b) => a + b, 0);
  return { median, total };
}
async function meta(title) {
  const api = 'https://en.wikipedia.org/w/api.php?action=query&format=json&formatversion=2&redirects=1' +
    '&prop=pageprops|linkshere|redirects&ppprop=wikibase_item&lhnamespace=0&lhlimit=500&rdnamespace=0&rdlimit=12&titles=' + encodeURIComponent(title);
  const j = await get(api);
  const p = j.query.pages[0];
  const links = (p.linkshere || []).length;
  const redirects = (p.redirects || []).map((r) => r.title.replace(/ /g, '_'));
  return { qid: p.pageprops?.wikibase_item, links, linksCapped: !!j.continue, resolved: p.title, redirects };
}
async function langs(qids) {
  const out = {};
  for (let i = 0; i < qids.length; i += 50) {
    const batch = qids.slice(i, i + 50).filter(Boolean);
    if (!batch.length) continue;
    const j = await get('https://www.wikidata.org/w/api.php?action=wbgetentities&format=json&props=sitelinks&ids=' + batch.join('|'));
    for (const [q, e] of Object.entries(j.entities)) {
      out[q] = Object.keys(e.sitelinks || {}).filter((k) => /wiki$/.test(k) && !/^(commons|species|meta|wikidata|wikimania|sources|outreach|incubator|mediawiki)wiki$/.test(k)).length;
    }
    await sleep(200);
  }
  return out;
}

const rows = [];
for (const it of items) {
  try {
    const m = await meta(it.title);
    const v = await views([m.resolved.replace(/ /g, '_'), ...m.redirects]);
    rows.push({ ...it, ...m, ...v });
  } catch (e) {
    rows.push({ ...it, error: e.message });
  }
  await sleep(150);
}
const sitelinks = await langs(rows.map((r) => r.qid));
for (const r of rows) r.langs = sitelinks[r.qid] ?? 0;

const ok = rows.filter((r) => !r.error);
const z = (arr) => { const m = arr.reduce((a, b) => a + b, 0) / arr.length; const sd = Math.sqrt(arr.reduce((a, b) => a + (b - m) ** 2, 0) / arr.length) || 1; return (x) => (x - m) / sd; };
const zv = z(ok.map((r) => Math.log10(r.median + 1)));
const zl = z(ok.map((r) => r.langs));
const zk = z(ok.map((r) => Math.log10(r.links + 1)));
for (const r of ok) r.raw = 0.5 * zv(Math.log10(r.median + 1)) + 0.3 * zl(r.langs) + 0.2 * zk(Math.log10(r.links + 1));
const lo = Math.min(...ok.map((r) => r.raw)), hi = Math.max(...ok.map((r) => r.raw));
for (const r of ok) {
  r.score = Math.round(((r.raw - lo) / (hi - lo || 1)) * 100);
  r.tier = r.median >= 800 && r.langs >= 60 ? 'Canonical' : r.median >= 250 && r.langs >= 35 ? 'Famous' : 'Notable';
}
ok.sort((a, b) => b.raw - a.raw);

if (json) { console.log(JSON.stringify(rows, null, 2)); process.exit(0); }
const pad = (s, n, right) => (right ? String(s).padStart(n) : String(s).padEnd(n));
console.log(pad('work', 34) + pad('views/day', 10, 1) + pad('langs', 7, 1) + pad('links', 7, 1) + pad('score', 7, 1) + '  tier');
for (const r of ok) console.log(pad(r.id, 34) + pad(r.median, 10, 1) + pad(r.langs, 7, 1) + pad((r.linksCapped ? '500+' : r.links), 7, 1) + pad(r.score, 7, 1) + '  ' + r.tier + (r.resolved.replace(/ /g, '_') !== r.title ? '   → ' + r.resolved : ''));
for (const r of rows.filter((r) => r.error)) console.log(pad(r.id, 34) + '  error: ' + r.error);
