#!/usr/bin/env node
/* Render each work's summary to audio/<id>.mp3 with Deepgram Aura.
   Usage:
     DEEPGRAM_API_KEY=dg_… node canon/scripts/speak.mjs            # missing files only
     DEEPGRAM_API_KEY=dg_… node canon/scripts/speak.mjs --force    # re-render everything
     DEEPGRAM_API_KEY=dg_… node canon/scripts/speak.mjs mona-lisa the-scream
   Options:
     --voice aura-2-draco-en   (default; British baritone — the closest to a solemn Attenborough)
     Other British options: aura-2-pandora-en (female).  Aura-1: aura-helios-en (male, GB).
   Aura accepts 2,000 characters per request; longer summaries are split on
   sentence boundaries and the MP3 frames are concatenated. */
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const here = path.dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);
const { ARTWORKS } = require(path.join(here, '..', 'data.js'));
const OUT = path.join(here, '..', 'audio');
const LIMIT = 1800;

const args = process.argv.slice(2);
const force = args.includes('--force');
const vi = args.indexOf('--voice');
const voice = vi >= 0 ? args[vi + 1] : 'aura-2-draco-en';
const ids = args.filter((a, i) => !a.startsWith('--') && args[i - 1] !== '--voice');
const key = process.env.DEEPGRAM_API_KEY;
if (!key) { console.error('Set DEEPGRAM_API_KEY (https://console.deepgram.com).'); process.exit(1); }

function chunks(text) {
  const sentences = text.match(/[^.!?]+[.!?]+["”’]?\s*|[^.!?]+$/g) || [text];
  const out = []; let cur = '';
  for (const s of sentences) {
    if ((cur + s).length > LIMIT && cur) { out.push(cur.trim()); cur = ''; }
    cur += s;
  }
  if (cur.trim()) out.push(cur.trim());
  return out;
}

async function speak(text) {
  const url = `https://api.deepgram.com/v1/speak?model=${encodeURIComponent(voice)}&encoding=mp3&bit_rate=48000`;
  const r = await fetch(url, {
    method: 'POST',
    headers: { Authorization: `Token ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ text }),
  });
  if (!r.ok) throw new Error(`Deepgram ${r.status}: ${await r.text()}`);
  return Buffer.from(await r.arrayBuffer());
}

await fs.mkdir(OUT, { recursive: true });
const manifestPath = path.join(OUT, 'manifest.json');
let manifest = {};
try { manifest = JSON.parse(await fs.readFile(manifestPath, 'utf8')); } catch {}

const todo = ARTWORKS.filter((a) => !ids.length || ids.includes(a.id));
let made = 0, skipped = 0;
for (const a of todo) {
  const file = path.join(OUT, `${a.id}.mp3`);
  const exists = await fs.stat(file).then(() => true, () => false);
  if (exists && !force) { skipped++; continue; }
  const parts = chunks(a.summary);
  process.stdout.write(`${a.id} (${a.summary.length} chars, ${parts.length} part${parts.length > 1 ? 's' : ''}) … `);
  try {
    const buffers = [];
    for (const p of parts) buffers.push(await speak(p));
    const mp3 = Buffer.concat(buffers);
    await fs.writeFile(file, mp3);
    manifest[a.id] = { bytes: mp3.length, chars: a.summary.length, voice, generatedAt: new Date().toISOString() };
    await fs.writeFile(manifestPath, JSON.stringify(manifest, null, 2) + '\n');
    made++;
    console.log(`${(mp3.length / 1024).toFixed(0)} KB`);
  } catch (e) {
    console.log('FAILED'); console.error('  ' + e.message);
  }
  await new Promise((r) => setTimeout(r, 250));
}
console.log(`\n${made} rendered, ${skipped} already present. Voice: ${voice}.`);
