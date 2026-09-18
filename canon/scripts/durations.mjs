#!/usr/bin/env node
/* Record how long each narration runs, into audio/manifest.json:
     node canon/scripts/durations.mjs
   speak.mjs does this for what it renders; run it by hand to backfill files
   that were rendered before. */
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { durationOf } from './mp3.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const dir = path.join(here, '..', 'audio');
const manifestPath = path.join(dir, 'manifest.json');

let manifest = {};
try { manifest = JSON.parse(await fs.readFile(manifestPath, 'utf8')); } catch {}

const files = (await fs.readdir(dir)).filter((f) => f.endsWith('.mp3')).sort();
for (const file of files) {
  const id = file.replace(/\.mp3$/, '');
  const seconds = durationOf(await fs.readFile(path.join(dir, file)));
  manifest[id] = { ...(manifest[id] || {}), seconds: Math.round(seconds * 100) / 100 };
  console.log(`${id.padEnd(34)} ${Math.floor(seconds / 60)}:${String(Math.floor(seconds % 60)).padStart(2, '0')}`);
}
await fs.writeFile(manifestPath, JSON.stringify(manifest, null, 2) + '\n');
console.log(`\n${files.length} files timed.`);
