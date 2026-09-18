#!/usr/bin/env node
/* Draw the gilt frame: node canon/scripts/frame.mjs   → canon/frame.png

   A museum frame is a run moulding: one carved section, repeated along every
   length and mitred at the corners. So the whole thing is described by a single
   height profile taken across the band, which this script lights per pixel —
   Lambert for the form, Blinn-Phong for the burnish — with gold applied as a
   function of height, red bole low down where the leaf has worn through and
   burnished leaf on the crests.

   It writes a raster rather than an SVG on purpose. SVG lighting filters are
   evaluated in device pixels, so border-image re-lights each of the nine slices
   at its own scale and the stretched edges come out flat and pale. A raster
   carries the lighting already baked, and because the profile never varies
   along an edge, stretching one is lossless. */
import zlib from 'node:zlib';

const BAND = 80;            // moulding width in image pixels (2× its 40px CSS width)
const SIZE = BAND * 3;      // corner, edge, corner
const SS = 2;               // supersampling, to keep the mitres clean
const RELIEF = 0.42;        // the moulding's depth, as a fraction of its width

/* the carved section, outer edge (0) to sight edge (1) */
const PROFILE = [
  [0.00, 0.30], [0.03, 0.35], [0.06, 0.92], [0.10, 0.96], [0.14, 0.62],
  [0.18, 0.58], [0.22, 0.99], [0.30, 0.93], [0.42, 0.62], [0.55, 0.34],
  [0.64, 0.22], [0.70, 0.24], [0.76, 0.70], [0.80, 0.74], [0.84, 0.48],
  [0.88, 0.86], [0.93, 0.88], [0.97, 0.40], [1.00, 0.26],
];

/* water gilding: bole in the hollows, burnished leaf on the crests */
const RAMP = [
  [0.00, [0x74, 0x36, 0x1e]], [0.18, [0x99, 0x5e, 0x24]], [0.38, [0xc4, 0x91, 0x33]],
  [0.58, [0xe0, 0xb3, 0x45]], [0.74, [0xf2, 0xd0, 0x68]], [0.88, [0xfa, 0xe6, 0xa4]],
  [1.00, [0xff, 0xf8, 0xe0]],
];

const LIGHT = norm([-0.46, -0.66, 0.60]);   // upper left, slightly in front
const HALF = norm([LIGHT[0], LIGHT[1], LIGHT[2] + 1]);
const AMBIENT = 0.46;
const SPECULAR = 0.4;
const SHININESS = 26;

function norm(v) { const l = Math.hypot(...v); return v.map((c) => c / l); }
function at(points, t) {
  if (t <= points[0][0]) return points[0][1];
  for (let i = 1; i < points.length; i++) {
    if (t <= points[i][0]) {
      const [t0, v0] = points[i - 1], [t1, v1] = points[i];
      const f = (t - t0) / (t1 - t0 || 1);
      const e = f * f * (3 - 2 * f);   // smoothstep, so the ogee actually curves
      return Array.isArray(v0) ? v0.map((c, k) => c + (v1[k] - c) * e) : v0 + (v1 - v0) * e;
    }
  }
  return points[points.length - 1][1];
}

/* height across the band, with fine tooling marks in the gesso. They run across
   the band and never along it, which is what keeps a stretched edge clean. */
function height(t) {
  const tooth = 0.0006 * Math.sin(t * 147) + 0.0005 * Math.sin(t * 61 + 1.7);
  return Math.max(0, Math.min(1, at(PROFILE, t) + tooth));
}

function shade(t, axis, sign) {
  const eps = 0.0015;
  const slope = RELIEF * (height(t + eps) - height(t - eps)) / (2 * eps);
  // the surface tips away from the sight edge; `sign` points across the band
  const n = axis === 'x'
    ? norm([-slope * sign, 0, 1])
    : norm([0, -slope * sign, 1]);
  const h = height(t);
  const diffuse = Math.max(0, n[0] * LIGHT[0] + n[1] * LIGHT[1] + n[2] * LIGHT[2]);
  const gleam = Math.pow(Math.max(0, n[0] * HALF[0] + n[1] * HALF[1] + n[2] * HALF[2]), SHININESS);
  const base = at(RAMP, h);
  const lit = AMBIENT + (1 - AMBIENT) * diffuse;
  return base.map((c) => c * lit + SPECULAR * gleam * 255);
}

/* ---------- raster ---------- */
const W = SIZE * SS;
const acc = new Float64Array(SIZE * SIZE * 4);
for (let y = 0; y < W; y++) {
  for (let x = 0; x < W; x++) {
    const dx = Math.min(x, W - 1 - x), dy = Math.min(y, W - 1 - y);
    const d = Math.min(dx, dy);
    const band = BAND * SS;
    if (d >= band) continue;                       // inside the sight: no frame
    const t = d / band;
    const axis = dx <= dy ? 'x' : 'y';             // the nearest edge wins the mitre
    const sign = (axis === 'x' ? x < W / 2 : y < W / 2) ? 1 : -1;
    const [r, g, b] = shade(t, axis, sign);
    const i = ((y / SS | 0) * SIZE + (x / SS | 0)) * 4;
    acc[i] += r; acc[i + 1] += g; acc[i + 2] += b; acc[i + 3] += 255;
  }
}

const px = Buffer.alloc(SIZE * SIZE * 4);
const n = SS * SS;
for (let i = 0; i < SIZE * SIZE; i++) {
  for (let c = 0; c < 4; c++) {
    px[i * 4 + c] = Math.max(0, Math.min(255, Math.round(acc[i * 4 + c] / n)));
  }
}

/* ---------- PNG ---------- */
const TABLE = (() => {
  const t = new Uint32Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[i] = c >>> 0;
  }
  return t;
})();
function crc(buf) {
  let c = 0xffffffff;
  for (const b of buf) c = TABLE[(c ^ b) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}
function chunk(type, data) {
  const len = Buffer.alloc(4); len.writeUInt32BE(data.length);
  const body = Buffer.concat([Buffer.from(type, 'ascii'), data]);
  const sum = Buffer.alloc(4); sum.writeUInt32BE(crc(body));
  return Buffer.concat([len, body, sum]);
}
const ihdr = Buffer.alloc(13);
ihdr.writeUInt32BE(SIZE, 0); ihdr.writeUInt32BE(SIZE, 4);
ihdr[8] = 8; ihdr[9] = 6; ihdr[10] = 0; ihdr[11] = 0; ihdr[12] = 0;  // 8-bit RGBA

const raw = Buffer.alloc(SIZE * (SIZE * 4 + 1));
for (let y = 0; y < SIZE; y++) {
  raw[y * (SIZE * 4 + 1)] = 0;                                        // filter: none
  px.copy(raw, y * (SIZE * 4 + 1) + 1, y * SIZE * 4, (y + 1) * SIZE * 4);
}
process.stdout.write(Buffer.concat([
  Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
  chunk('IHDR', ihdr),
  chunk('IDAT', zlib.deflateSync(raw, { level: 9 })),
  chunk('IEND', Buffer.alloc(0)),
]));
