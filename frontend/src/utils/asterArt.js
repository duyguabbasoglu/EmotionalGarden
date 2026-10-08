import { makeRng, f2, svgUrl } from './svgArt';

/*
 * September asters (Michaelmas daisies): mounds of small star-like heads with
 * many thin ray florets around a golden disk that turns rusty with age,
 * on sprays of narrow lance-shaped leaves.
 * Periwinkle blue dominates so they read differently from lilac and crocus.
 */
const PALS = [
  { base: '#4f5cc0', mid: '#7d8fe6', tip: '#b3bff5', vein: '#3a44a0' }, // periwinkle
  { base: '#5a58c2', mid: '#8f8ce8', tip: '#c9c8f8', vein: '#403e9e' }, // lavender-blue
  { base: '#b0508c', mid: '#d77fb6', tip: '#f3bedd', vein: '#8a3870' }, // pink
  { base: '#a9a9cc', mid: '#e4e4f2', tip: '#ffffff', vein: '#9090b8' }, // white
];

const rayPath = (r0, L, W, bx) =>
  `M ${f2(-W * 0.45)} ${f2(-r0)} C ${f2(-W * 1.05)} ${f2(-(r0 + L * 0.35))}, ${f2(-W * 1.0 + bx)} ${f2(-(r0 + L * 0.85))}, ${f2(-W * 0.3 + bx)} ${f2(-(r0 + L * 0.98))} ` +
  `Q ${f2(bx)} ${f2(-(r0 + L * 1.03))} ${f2(W * 0.3 + bx)} ${f2(-(r0 + L * 0.98))} ` +
  `C ${f2(W * 1.0 + bx)} ${f2(-(r0 + L * 0.85))}, ${f2(W * 1.05)} ${f2(-(r0 + L * 0.35))}, ${f2(W * 0.45)} ${f2(-r0)} Z`;

const headDefs = (id, pal) =>
  `<linearGradient id="${id}r" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="${pal.base}"/><stop offset="0.4" stop-color="${pal.mid}"/><stop offset="1" stop-color="${pal.tip}"/></linearGradient>` +
  `<radialGradient id="${id}d"><stop offset="0" stop-color="#e6a42a"/><stop offset="0.6" stop-color="#f4cc38"/><stop offset="1" stop-color="#b8801a"/></radialGradient>` +
  `<radialGradient id="${id}a"><stop offset="0" stop-color="#8a3a16"/><stop offset="0.6" stop-color="#c0661e"/><stop offset="1" stop-color="#e0a030"/></radialGradient>`;

/* One head in a 100-radius space */
const head = (id, pal, rnd) => {
  const aged = rnd() < 0.3;
  const turn = rnd(0, 360);
  const n = Math.floor(rnd(34, 44));
  let g = '';
  [{ k: 1, L: rnd(58, 70), shade: 0.2 }, { k: 0.8, L: rnd(50, 60), shade: 0 }].forEach((ring, ri) => {
    const count = Math.floor(n * ring.k);
    for (let i = 0; i < count; i++) {
      const deg = turn + (ri * 180) / count + (i * 360) / count + rnd(-3, 3);
      const d = rayPath(20, ring.L * rnd(0.85, 1.1), rnd(3.4, 4.6), rnd(-3, 3));
      g += `<g transform="rotate(${f2(deg)})"><path d="${d}" fill="url(#${id}r)" stroke="${pal.vein}" stroke-width="0.4" stroke-opacity="0.35"/>` +
        (ring.shade ? `<path d="${d}" fill="#1a1440" opacity="${ring.shade}"/>` : '') + `</g>`;
    }
  });
  g += `<circle r="21" fill="url(#${id}${aged ? 'a' : 'd'})" filter="url(#ash)"/>`;
  for (let i = 1; i < 70; i++) {
    const t = i / 70;
    const r = 19 * Math.sqrt(t), a = i * 2.39996;
    g += `<circle cx="${f2(Math.cos(a) * r)}" cy="${f2(Math.sin(a) * r)}" r="${f2(0.8 + 0.8 * t)}" fill="${aged && t < 0.6 ? '#a8481a' : '#ffe36a'}" opacity="0.85"/>`;
  }
  return g;
};

const SHADOW = `<filter id="ash" x="-50%" y="-50%" width="200%" height="200%"><feDropShadow dx="0" dy="1.2" stdDeviation="2" flood-color="#000" flood-opacity="0.4"/></filter>`;

const leafPath = (L, W) =>
  `M 0 0 C ${f2(W)} ${f2(-L * 0.25)}, ${f2(W * 0.8)} ${f2(-L * 0.7)}, 0 ${f2(-L)} C ${f2(-W * 0.8)} ${f2(-L * 0.7)}, ${f2(-W)} ${f2(-L * 0.25)}, 0 0 Z`;

const leaf = (x, y, deg, L, W, color) =>
  `<g transform="translate(${f2(x)} ${f2(y)}) rotate(${f2(deg)})"><path d="${leafPath(L, W)}" fill="${color}" stroke="#12260c" stroke-width="0.8"/>` +
  `<path d="M 0 -2 L 0 ${f2(-L * 0.9)}" stroke="#6f9a4c" stroke-width="0.9" opacity="0.6"/></g>`;

const buildHead = (palIdx, seed) => {
  const rnd = makeRng(seed);
  const pal = PALS[palIdx];
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-100 -100 200 200" width="200" height="200"><defs>${headDefs('h', pal)}${SHADOW}</defs>${head('h', pal, rnd)}</svg>`;
  return svgUrl(svg);
};

/* A spray: several heads, buds and narrow leaves in one mound */
const buildSpray = (palIdx, seed) => {
  const rnd = makeRng(seed);
  const pal = PALS[palIdx];
  let body = '';
  for (let i = 0; i < 9; i++) {
    body += leaf(rnd(-60, 60), rnd(-40, 70), rnd(0, 360), rnd(50, 80), rnd(8, 12),
      `hsl(${f2(rnd(98, 118))},${f2(rnd(34, 46))}%,${f2(rnd(20, 30))}%)`);
  }
  for (let i = 0; i < 4; i++) {
    const x = rnd(-80, 80), y = rnd(-80, 80);
    body += `<circle cx="${f2(x)}" cy="${f2(y)}" r="${f2(rnd(5, 7))}" fill="#3d6a2a" stroke="#1d3a12" stroke-width="0.8"/>` +
      `<circle cx="${f2(x)}" cy="${f2(y)}" r="3" fill="${pal.base}" opacity="0.7"/>`;
  }
  const spots = [[-48, -40], [42, -46], [0, 18], [-50, 50], [52, 44]];
  const count = Math.floor(rnd(3, 6));
  let defs = SHADOW;
  spots.slice(0, count).forEach(([x, y], i) => {
    const id = `s${i}`;
    defs += headDefs(id, pal);
    body += `<g transform="translate(${f2(x + rnd(-8, 8))} ${f2(y + rnd(-8, 8))}) scale(${f2(rnd(0.38, 0.55))})" filter="url(#ash)">${head(id, pal, rnd)}</g>`;
  });
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-130 -130 260 260" width="260" height="260"><defs>${defs}</defs>${body}</svg>`;
  return svgUrl(svg);
};

const buildLeafCluster = (seed) => {
  const rnd = makeRng(seed);
  let body = '';
  for (let i = 0; i < 12; i++) {
    body += leaf(rnd(-30, 30), rnd(-30, 30), rnd(0, 360), rnd(55, 85), rnd(8, 12),
      `hsl(${f2(rnd(98, 120))},${f2(rnd(32, 46))}%,${f2(rnd(16, 26))}%)`);
  }
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-120 -120 240 240" width="240" height="240">${body}</svg>`;
  return svgUrl(svg);
};

/* ── Pre-computed once; shared by the modal scene and the garden preview ── */
const MIX = [0, 0, 0, 1, 1, 2, 3, 0];
export const SPRAY_URLS = MIX.map((p, i) => buildSpray(p, 1500 + i * 61));
export const HEAD_URLS = MIX.map((p, i) => buildHead(p, 2500 + i * 43));
export const ASTER_LEAF_URLS = Array.from({ length: 3 }, (_, i) => buildLeafCluster(3500 + i * 19));
