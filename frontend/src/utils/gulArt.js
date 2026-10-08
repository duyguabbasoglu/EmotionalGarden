import { makeRng, f2, svgUrl, smoothClosed, smoothOpen, mixHex, litFrom } from './svgArt';

/*
 * Deep red garden roses seen from above.
 * Built like a real rose: broad guard petals outside, then cupped petals
 * spiralling inwards (golden angle), each with a dark throat and a rolled,
 * light-catching lip, around a tight spiral heart.
 */

const PALETTES = [
  // Velvet crimson
  { deep: '#0f0002', base: '#360008', body: '#5e0310', lip: '#8a0c1e', sheen: '#b3243a' },
  // Black Baccara — almost black-red
  { deep: '#0a0001', base: '#260005', body: '#46030c', lip: '#6e0a18', sheen: '#962034' },
  // Mr Lincoln — rich blood red
  { deep: '#140003', base: '#42000b', body: '#700816', lip: '#9e1426', sheen: '#c43448' },
];

const LEAF_GREENS = [
  { dark: '#12260b', mid: '#2b5019', light: '#3f6d26', rib: '#5b8a3c', edge: '#0b1a06' },
  { dark: '#1a2a0c', mid: '#34561b', light: '#4b7a2a', rib: '#6f9a45', edge: '#4a1c10' }, // young, red-edged
];

const arcPoints = (r, halfSpan, n, radiusAt) => {
  const pts = [];
  for (let i = 0; i <= n; i++) {
    const t = -1 + (2 * i) / n;
    const a = t * halfSpan;
    const rr = radiusAt(t, r);
    pts.push([Math.sin(a) * rr, -Math.cos(a) * rr]);
  }
  return pts;
};

const buildRose = (palIdx, seed) => {
  const pal = PALETTES[palIdx];
  const rnd = makeRng(seed);
  let defs = `<filter id="sh" x="-40%" y="-40%" width="180%" height="180%"><feDropShadow dx="0" dy="1.2" stdDeviation="2.4" flood-color="${pal.deep}" flood-opacity="0.9"/></filter>`;
  let body = `<circle r="80" fill="${pal.deep}"/>`;
  const turn = rnd(0, 360);

  /* Guard petals — two rings of broad, shell-like petals */
  const rings = [
    { count: 5, R: 100, hs: 0.78, off: 0 },
    { count: 5, R: 88, hs: 0.72, off: 36 },
  ];
  let gid = 0;
  rings.forEach(ring => {
    for (let i = 0; i < ring.count; i++) {
      const deg = turn + ring.off + (i * 360) / ring.count + rnd(-9, 9);
      const R = ring.R * rnd(0.94, 1.02);
      const hs = ring.hs * rnd(0.92, 1.08);
      const lit = litFrom(deg);
      const radiusAt = (t, r) => r * (0.6 + 0.4 * Math.sqrt(1 - t * t)) * (1 + 0.04 * Math.exp(-((t * 4) ** 2)));
      const edge = arcPoints(R, hs, 14, radiusAt);
      const d = smoothClosed([[0, -R * 0.05], ...edge]);
      const rim = smoothOpen(arcPoints(R * 0.965, hs * 0.85, 10, radiusAt).slice(lit > 0.5 ? 0 : 5, lit > 0.5 ? 8 : 11));
      const id = `g${gid++}`;
      defs += `<radialGradient id="${id}" gradientUnits="userSpaceOnUse" cx="0" cy="0" r="${f2(R)}">` +
        `<stop offset="0" stop-color="${pal.deep}"/><stop offset="0.35" stop-color="${pal.base}"/>` +
        `<stop offset="0.74" stop-color="${mixHex(pal.base, pal.body, 0.6 + lit * 0.4)}"/>` +
        `<stop offset="0.93" stop-color="${mixHex(pal.body, pal.lip, lit)}"/>` +
        `<stop offset="1" stop-color="${mixHex(pal.lip, pal.sheen, lit * 0.5)}"/></radialGradient>`;
      body += `<g transform="rotate(${f2(deg)})">` +
        `<path d="${d}" fill="url(#${id})" filter="url(#sh)"/>` +
        `<path d="${rim}" fill="none" stroke="${mixHex(pal.lip, pal.sheen, lit)}" stroke-width="2.6" stroke-linecap="round" opacity="${f2(0.35 + lit * 0.45)}"/>` +
        `<path d="M 0 ${f2(-R * 0.2)} Q ${f2(rnd(-4, 4))} ${f2(-R * 0.55)} ${f2(rnd(-3, 3))} ${f2(-R * 0.85)}" fill="none" stroke="${pal.deep}" stroke-width="1" opacity="0.25"/>` +
        `</g>`;
    }
  });

  /* Cupped inner petals spiralling towards the heart */
  const N = 13;
  for (let k = 0; k < N; k++) {
    const frac = k / (N - 1);
    const R = 9 + 68 * Math.pow(1 - frac, 1.05) * rnd(0.93, 1.05);
    const thick = R * (0.3 + 0.2 * frac) * rnd(0.8, 1.25);
    const hs = (1.0 + 0.95 * frac) * rnd(0.85, 1.12);
    const deg = turn + 18 + k * 137.5 + rnd(-18, 18);
    const lit = litFrom(deg);
    const radiusAt = (t, r) => r * (1 - 0.06 * t * t);
    const outer = arcPoints(R, hs, 16, radiusAt);
    const inner = arcPoints(R, hs, 16, (t, r) => radiusAt(t, r) - thick * Math.pow(1 - t * t, 0.7)).reverse();
    const d = smoothClosed([...outer, ...inner]);
    // Rolled lip catches light only on the side facing it
    const rimPts = arcPoints(R * 0.975, hs * 0.8, 12, radiusAt);
    const cut = Math.floor(rnd(3, 7));
    const rim = smoothOpen(lit > 0.5 ? rimPts.slice(0, 13 - cut) : rimPts.slice(cut));
    const innerStop = Math.max(0, (R - thick) / R);
    const id = `c${k}`;
    defs += `<radialGradient id="${id}" gradientUnits="userSpaceOnUse" cx="0" cy="0" r="${f2(R)}">` +
      `<stop offset="0" stop-color="${pal.deep}"/><stop offset="${f2(innerStop)}" stop-color="${pal.deep}"/>` +
      `<stop offset="${f2(innerStop + (1 - innerStop) * 0.4)}" stop-color="${pal.base}"/>` +
      `<stop offset="0.88" stop-color="${mixHex(pal.body, pal.lip, lit * 0.6)}"/>` +
      `<stop offset="1" stop-color="${mixHex(pal.lip, pal.sheen, lit * 0.7)}"/></radialGradient>`;
    body += `<g transform="rotate(${f2(deg)}) translate(${f2(R * rnd(-0.08, 0.08))} ${f2(R * rnd(0.06, 0.2))})">` +
      `<path d="${d}" fill="url(#${id})" filter="url(#sh)"/>` +
      `<path d="${rim}" fill="none" stroke="${mixHex(pal.lip, pal.sheen, lit)}" stroke-width="${f2(Math.max(1, R * 0.03))}" stroke-linecap="round" opacity="${f2(0.4 + lit * 0.5)}"/>` +
      `</g>`;
  }

  /* Tight spiral heart */
  const spiral = [];
  for (let i = 0; i <= 40; i++) {
    const th = (i / 40) * Math.PI * 4;
    const r = 1.2 + th * 0.55;
    spiral.push([Math.cos(th + turn) * r, Math.sin(th + turn) * r]);
  }
  body += `<circle r="8.5" fill="${pal.deep}"/>` +
    `<path d="${smoothOpen(spiral)}" fill="none" stroke="${pal.lip}" stroke-width="1.3" opacity="0.55"/>`;

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-112 -112 224 224" width="224" height="224"><defs>${defs}</defs>${body}</svg>`;
  return svgUrl(svg);
};

/* ── Pinnate rose leaf: 5 serrated leaflets on a rachis ── */
const leaflet = (L, W) => {
  const n = 24, right = [], left = [];
  for (let i = 0; i <= n; i++) {
    const u = i / n;
    const hw = W * Math.pow(Math.sin(Math.PI * u), 0.8) * (1 - 0.3 * u) * (i % 2 ? 1 : 0.86);
    right.push([hw, -u * L]);
    left.unshift([-hw, -u * L]);
  }
  return `M ${[...right, ...left].map(p => `${f2(p[0])} ${f2(p[1])}`).join(' L ')} Z`;
};

const buildRoseLeaf = (greenIdx, seed) => {
  const g = LEAF_GREENS[greenIdx];
  const rnd = makeRng(seed);
  const parts = [
    { y: 18, a: -62, L: 40, W: 14 }, { y: 18, a: 62, L: 40, W: 14 },
    { y: -16, a: -52, L: 48, W: 17 }, { y: -16, a: 52, L: 48, W: 17 },
    { y: -48, a: 0, L: 58, W: 20 },
  ];
  const defs = `<linearGradient id="lf" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${g.dark}"/><stop offset="0.48" stop-color="${g.light}"/><stop offset="0.52" stop-color="${g.mid}"/><stop offset="1" stop-color="${g.dark}"/></linearGradient>`;
  let body = `<path d="M 0 52 Q ${f2(rnd(-4, 4))} 0 0 -48" stroke="${g.mid}" stroke-width="3" fill="none"/>`;
  parts.forEach(p => {
    const a = p.a + rnd(-8, 8);
    const L = p.L * rnd(0.9, 1.1);
    const W = p.W * rnd(0.9, 1.1);
    let veins = '';
    for (let v = 1; v <= 3; v++) {
      const y = -L * v / 4.5;
      veins += `<path d="M 0 ${f2(y)} Q ${f2(W * 0.3)} ${f2(y - 4)} ${f2(W * 0.55)} ${f2(y - 8)} M 0 ${f2(y)} Q ${f2(-W * 0.3)} ${f2(y - 4)} ${f2(-W * 0.55)} ${f2(y - 8)}" stroke="${g.rib}" stroke-width="0.7" fill="none" opacity="0.4"/>`;
    }
    body += `<g transform="translate(0 ${p.y}) rotate(${f2(a)})">` +
      `<path d="${leaflet(L, W)}" fill="url(#lf)" stroke="${g.edge}" stroke-width="1" stroke-linejoin="round"/>` +
      `<path d="M 0 0 L 0 ${f2(-L * 0.92)}" stroke="${g.rib}" stroke-width="1.2" opacity="0.7"/>${veins}` +
      `<path d="M ${f2(-W * 0.55)} ${f2(-L * 0.3)} Q ${f2(-W * 0.6)} ${f2(-L * 0.55)} ${f2(-W * 0.3)} ${f2(-L * 0.8)}" stroke="#ffffff" stroke-width="1.2" fill="none" opacity="0.12"/>` +
      `</g>`;
  });
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-90 -120 180 180" width="180" height="180"><defs>${defs}</defs>${body}</svg>`;
  return svgUrl(svg);
};

/* ── Closed rosebud with green sepals ── */
const buildBud = (palIdx, seed) => {
  const pal = PALETTES[palIdx];
  const rnd = makeRng(seed);
  const tilt = rnd(-12, 12);
  const defs = `<linearGradient id="bd" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${pal.base}"/><stop offset="0.4" stop-color="${pal.lip}"/><stop offset="0.7" stop-color="${pal.body}"/><stop offset="1" stop-color="${pal.deep}"/></linearGradient>` +
    `<linearGradient id="sp" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#1d3a12"/><stop offset="1" stop-color="#4a7a2c"/></linearGradient>`;
  let sepals = '';
  [-58, -28, 30, 60].forEach((a, i) => {
    const len = rnd(34, 46);
    sepals += `<path transform="translate(0 18) rotate(${a + rnd(-6, 6)})" d="M -4 0 C -6 ${f2(-len * 0.4)}, -2 ${f2(-len * 0.8)}, ${i % 2 ? 3 : -3} ${f2(-len)} C 3 ${f2(-len * 0.7)}, 5 ${f2(-len * 0.35)}, 4 0 Z" fill="url(#sp)" stroke="#10220a" stroke-width="0.6"/>`;
  });
  const body = `<g transform="rotate(${f2(tilt)})">` +
    `<path d="M 0 18 L 0 80" stroke="#24461a" stroke-width="4.5" stroke-linecap="round"/>` +
    `<path d="M 0 22 C -22 12, -20 -24, -2 -50 Q 0 -54, 3 -50 C 20 -24, 22 12, 0 22 Z" fill="url(#bd)" stroke="${pal.deep}" stroke-width="0.8"/>` +
    `<path d="M -14 4 C -10 -20, 2 -38, 3 -50" fill="none" stroke="${pal.sheen}" stroke-width="1.6" opacity="0.5"/>` +
    `<path d="M 12 -2 C 8 -22, 0 -36, -1 -46" fill="none" stroke="${pal.deep}" stroke-width="1.4" opacity="0.7"/>` +
    `${sepals}<ellipse cx="0" cy="20" rx="7" ry="5" fill="#2b5019"/></g>`;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-60 -70 120 160" width="120" height="160"><defs>${defs}</defs>${body}</svg>`;
  return svgUrl(svg);
};

/* ── Pre-computed once; shared by the modal scene and the garden preview ── */
export const ROSE_URLS = Array.from({ length: 6 }, (_, i) => buildRose(i % PALETTES.length, 700 + i * 97));
export const ROSE_LEAF_URLS = Array.from({ length: 3 }, (_, i) => buildRoseLeaf(i === 2 ? 1 : 0, 300 + i * 51));
export const BUD_URLS = Array.from({ length: 3 }, (_, i) => buildBud(i, 900 + i * 31));
