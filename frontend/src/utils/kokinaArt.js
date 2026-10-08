import { makeRng, f2, svgUrl, shadow } from './svgArt';

/*
 * December kokina — the bunch Turkish florists tie for the new year.
 * It is actually two plants: the spiny evergreen sprigs are Ruscus aculeatus,
 * whose stiff "leaves" are flattened stems (cladodes) ending in a sharp point,
 * each with a tiny scale and sometimes a berry right in the middle of the
 * blade; the heavy red berry clusters are Smilax excelsa, carried in umbels on
 * short radiating stalks, with glossy heart-shaped leaves and curling tendrils.
 */

const DEFS =
  `<linearGradient id="kcBlade" x1="0.1" y1="1" x2="0.6" y2="0">` +
  `<stop offset="0" stop-color="#0f2e1a"/><stop offset="0.5" stop-color="#1d4f2c"/>` +
  `<stop offset="1" stop-color="#3b7c48"/></linearGradient>` +
  `<linearGradient id="kcBlade2" x1="0.1" y1="1" x2="0.6" y2="0">` +
  `<stop offset="0" stop-color="#143a1f"/><stop offset="0.5" stop-color="#235c33"/>` +
  `<stop offset="1" stop-color="#4b9154"/></linearGradient>` +
  `<linearGradient id="kcStem" x1="0" y1="1" x2="0.4" y2="0">` +
  `<stop offset="0" stop-color="#2a5230"/><stop offset="1" stop-color="#5c8a4a"/></linearGradient>` +
  `<radialGradient id="kcBerry" cx="32%" cy="28%" r="78%">` +
  `<stop offset="0" stop-color="#ff6a60"/><stop offset="0.45" stop-color="#e01025"/>` +
  `<stop offset="0.85" stop-color="#9d0617"/><stop offset="1" stop-color="#6b020f"/></radialGradient>` +
  `<radialGradient id="kcBerry2" cx="34%" cy="26%" r="78%">` +
  `<stop offset="0" stop-color="#ff8a74"/><stop offset="0.45" stop-color="#d4172c"/>` +
  `<stop offset="1" stop-color="#7d0312"/></radialGradient>` +
  shadow('kcSh', 1.6, 2.4, 0.5);

/* One Ruscus cladode: a stiff ovate blade drawn to a spine at the tip */
const cladode = (L, W, bend) =>
  `M 0 0 C ${f2(-W + bend * 0.2)} ${f2(-L * 0.24)}, ${f2(-W * 1.02 + bend * 0.6)} ${f2(-L * 0.64)}, ${f2(bend)} ${f2(-L * 0.97)} ` +
  `L ${f2(bend * 1.1)} ${f2(-L * 1.1)} ` +
  `L ${f2(bend + W * 0.1)} ${f2(-L * 0.96)} ` +
  `C ${f2(W * 1.02 + bend * 0.6)} ${f2(-L * 0.64)}, ${f2(W + bend * 0.2)} ${f2(-L * 0.24)}, 0 0 Z`;

const cladodeAt = (x, y, deg, L, W, bend, dark, berry) => {
  let g = `<g transform="translate(${f2(x)} ${f2(y)}) rotate(${f2(deg)})">` +
    `<path d="${cladode(L, W, bend)}" fill="${dark ? 'url(#kcBlade)' : 'url(#kcBlade2)'}" ` +
    `stroke="#0a2012" stroke-width="0.8" stroke-linejoin="round"/>` +
    `<path d="M 0 ${f2(-L * 0.06)} Q ${f2(bend * 0.4)} ${f2(-L * 0.5)} ${f2(bend * 0.92)} ${f2(-L * 0.92)}" ` +
    `stroke="#79b283" stroke-width="0.9" fill="none" opacity="0.4"/>` +
    // the highlight that makes the blade look leathery
    `<path d="M ${f2(-W * 0.3)} ${f2(-L * 0.3)} Q ${f2(-W * 0.55 + bend * 0.3)} ${f2(-L * 0.58)} ${f2(bend * 0.5)} ${f2(-L * 0.82)}" ` +
    `stroke="#9ed6a4" stroke-width="1.4" fill="none" opacity="0.14" stroke-linecap="round"/>`;
  if (berry) {
    // a Ruscus berry sits in the middle of the blade, not on a stalk
    g += `<circle cy="${f2(-L * 0.46)}" r="${f2(W * 0.5)}" fill="url(#kcBerry)" filter="url(#kcSh)"/>` +
      `<circle cx="${f2(-W * 0.17)}" cy="${f2(-L * 0.46 - W * 0.17)}" r="${f2(W * 0.12)}" fill="#fff" opacity="0.7"/>`;
  }
  return `${g}</g>`;
};

/* A Ruscus sprig: cladodes set alternately up a wiry green stem */
const buildSprig = (seed) => {
  const rnd = makeRng(seed);
  const base = 112, h = rnd(170, 215);
  const lean = rnd(-26, 26);
  let body = `<path d="M 0 ${f2(base)} C ${f2(lean * 0.3)} ${f2(base - h * 0.5)}, ${f2(lean)} ${f2(base - h * 0.8)}, ${f2(lean)} ${f2(base - h)}" ` +
    `stroke="url(#kcStem)" stroke-width="5" fill="none" stroke-linecap="round"/>`;
  const n = Math.floor(rnd(9, 13));
  for (let i = 0; i < n; i++) {
    const t = 0.06 + (i / n) * 0.92;
    const sx = lean * t * 0.9, sy = base - h * t;
    const side = i % 2 ? 1 : -1;
    const L = rnd(44, 70) * (1 - t * 0.3);
    body += cladodeAt(sx, sy, side * rnd(42, 86) + rnd(-10, 10), L, L * rnd(0.3, 0.42),
      side * rnd(2, 9), i % 3 !== 0, rnd() < 0.16);
  }
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-125 -125 250 250" width="250" height="250">` +
    `<defs>${DEFS}</defs>${body}</svg>`;
  return svgUrl(svg);
};

/* A loose spray of cladodes with no stem, for filling the background */
const buildFoliage = (seed) => {
  const rnd = makeRng(seed);
  let body = '';
  for (let i = 0; i < 14; i++) {
    const L = rnd(48, 86);
    body += cladodeAt(rnd(-70, 70), rnd(-40, 86), rnd(0, 360), L, L * rnd(0.3, 0.44),
      rnd(-8, 8), i % 2 === 0, false);
  }
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-115 -115 230 230" width="230" height="230">` +
    `<defs>${DEFS}</defs>${body}</svg>`;
  return svgUrl(svg);
};

/* One Smilax berry on its short pedicel */
const berry = (x, y, r, alt) =>
  `<circle cx="${f2(x)}" cy="${f2(y)}" r="${f2(r)}" fill="url(#kcBerry${alt ? '2' : ''})" ` +
  `stroke="#5c0210" stroke-width="0.5" stroke-opacity="0.5"/>` +
  `<circle cx="${f2(x - r * 0.3)}" cy="${f2(y - r * 0.33)}" r="${f2(r * 0.22)}" fill="#fff" opacity="0.72"/>` +
  `<circle cx="${f2(x + r * 0.28)}" cy="${f2(y + r * 0.3)}" r="${f2(r * 0.4)}" fill="#5c0210" opacity="0.18"/>`;

/* A glossy heart-shaped Smilax leaf */
const smilaxLeaf = (x, y, deg, S) =>
  `<g transform="translate(${f2(x)} ${f2(y)}) rotate(${f2(deg)})">` +
  `<path d="M 0 0 C ${f2(-S * 0.3)} ${f2(S * 0.26)}, ${f2(-S * 0.82)} ${f2(S * 0.18)}, ${f2(-S * 0.9)} ${f2(-S * 0.26)} ` +
  `C ${f2(-S * 0.96)} ${f2(-S * 0.74)}, ${f2(-S * 0.4)} ${f2(-S * 1.12)}, 0 ${f2(-S * 1.16)} ` +
  `C ${f2(S * 0.4)} ${f2(-S * 1.12)}, ${f2(S * 0.96)} ${f2(-S * 0.74)}, ${f2(S * 0.9)} ${f2(-S * 0.26)} ` +
  `C ${f2(S * 0.82)} ${f2(S * 0.18)}, ${f2(S * 0.3)} ${f2(S * 0.26)}, 0 0 Z" ` +
  `fill="url(#kcBlade)" stroke="#0a2012" stroke-width="0.9"/>` +
  [-0.42, 0, 0.42].map((k) =>
    `<path d="M 0 ${f2(-S * 0.02)} Q ${f2(k * S * 0.5)} ${f2(-S * 0.55)} ${f2(k * S * 0.62)} ${f2(-S * 1.02)}" ` +
    `stroke="#7fb888" stroke-width="1" fill="none" opacity="0.35"/>`).join('') +
  `<path d="M ${f2(-S * 0.42)} ${f2(-S * 0.34)} Q ${f2(-S * 0.2)} ${f2(-S * 0.8)} ${f2(S * 0.2)} ${f2(-S * 0.95)}" ` +
  `stroke="#bfe6c4" stroke-width="2" fill="none" opacity="0.16" stroke-linecap="round"/></g>`;

/* A Smilax umbel: berries on short stalks radiating from one point */
const buildCluster = (seed) => {
  const rnd = makeRng(seed);
  const n = Math.floor(rnd(11, 19));
  let stalks = '', fruit = '';
  const cx = 0, cy = -10;
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2 + rnd(-0.22, 0.22);
    const r = rnd(26, 54) * (i % 3 === 0 ? 0.6 : 1);
    const bx = cx + Math.cos(a) * r, by = cy + Math.sin(a) * r * 0.86;
    stalks += `<path d="M ${f2(cx)} ${f2(cy)} Q ${f2((cx + bx) / 2 + rnd(-6, 6))} ${f2((cy + by) / 2)} ${f2(bx)} ${f2(by)}" ` +
      `stroke="#6a4a2a" stroke-width="2" fill="none"/>`;
    fruit += berry(bx, by, rnd(11, 17), i % 3 === 0);
  }
  let body = `<path d="M ${f2(cx)} ${f2(cy)} C ${f2(cx + rnd(-14, 14))} 40, ${f2(cx + rnd(-20, 20))} 80, ${f2(cx + rnd(-24, 24))} 112" ` +
    `stroke="#6a4a2a" stroke-width="4" fill="none" stroke-linecap="round"/>`;
  body += smilaxLeaf(rnd(-78, -44), rnd(10, 54), rnd(-70, -20), rnd(30, 42));
  body += smilaxLeaf(rnd(44, 78), rnd(10, 54), rnd(20, 70), rnd(30, 42));
  // a curling tendril
  const tx = rnd(-70, 70);
  body += `<path d="M ${f2(tx)} ${f2(rnd(20, 50))} c 10 -12, 22 -4, 16 8 c -5 10, -18 6, -14 -6" ` +
    `stroke="#6f9a52" stroke-width="2" fill="none" stroke-linecap="round" opacity="0.8"/>`;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-115 -115 230 230" width="230" height="230">` +
    `<defs>${DEFS}</defs>${body}${stalks}<g filter="url(#kcSh)">${fruit}</g></svg>`;
  return svgUrl(svg);
};

/* A few loose berries, for tucking into gaps between the big clusters */
const buildBerries = (seed) => {
  const rnd = makeRng(seed);
  let body = '';
  const n = Math.floor(rnd(4, 8));
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2;
    body += berry(Math.cos(a) * rnd(6, 22), Math.sin(a) * rnd(6, 22), rnd(12, 18), i % 2 === 0);
  }
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-55 -55 110 110" width="110" height="110">` +
    `<defs>${DEFS}</defs><g filter="url(#kcSh)">${body}</g></svg>`;
  return svgUrl(svg);
};

/* ── Built once; shared by the modal scene and the garden preview ── */
export const SPRIG_URLS = Array.from({ length: 7 }, (_, i) => buildSprig(15200 + i * 43));
export const KOK_FOLIAGE_URLS = Array.from({ length: 5 }, (_, i) => buildFoliage(15900 + i * 31));
export const CLUSTER_URLS = Array.from({ length: 8 }, (_, i) => buildCluster(16500 + i * 37));
export const LOOSE_BERRY_URLS = Array.from({ length: 5 }, (_, i) => buildBerries(17200 + i * 23));
