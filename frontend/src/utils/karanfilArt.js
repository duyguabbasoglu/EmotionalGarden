import { makeRng, f2, svgUrl, shadow } from './svgArt';

/*
 * October carnations (Dianthus caryophyllus).
 * Reference structure: a tight double head of broad fan-shaped petals whose
 * top edge is finely fringed, packed in several rings so the middle stays
 * crumpled and the outer petals fall back. The calyx is a long smooth tube
 * with five short pointed sepals, and the leaves are narrow, blue-green and
 * set in opposite pairs at swollen nodes.
 */

/*
 * Warm first. Karanfil carries October — "sonbahar rüzgârlarına meydan okuyan
 * sıcak renkler" — so the pale pinks that used to lead give way to flame,
 * scarlet and ember, with one soft rose left in for variety.
 */
const PALS = [
  { deep: '#8a2410', mid: '#d6552a', light: '#f9a476', name: 'flame' },
  { deep: '#7d0f1e', mid: '#c8283c', light: '#f28a92', name: 'scarlet' },
  { deep: '#5e0f22', mid: '#9e2238', light: '#d4687e', name: 'burgundy' },
  { deep: '#9a3a12', mid: '#e8763a', light: '#ffc49a', name: 'ember' },
  { deep: '#8d1f3c', mid: '#d4506f', light: '#f6a9ba', name: 'rose' },
];

const DEFS =
  `<linearGradient id="cStem" x1="0" y1="1" x2="0" y2="0">` +
  `<stop offset="0" stop-color="#3c6b4e"/><stop offset="1" stop-color="#7fae8a"/></linearGradient>` +
  `<linearGradient id="cLeaf" x1="0" y1="1" x2="0.4" y2="0">` +
  `<stop offset="0" stop-color="#2f5742"/><stop offset="0.5" stop-color="#5e8d72"/>` +
  `<stop offset="1" stop-color="#9dc0a5"/></linearGradient>` +
  shadow('cSh', 1.28, 3.25, 0.26);

const petalDefs = (id, p) =>
  `<linearGradient id="${id}a" x1="0" y1="1" x2="0.2" y2="0">` +
  `<stop offset="0" stop-color="${p.deep}"/><stop offset="0.55" stop-color="${p.mid}"/>` +
  `<stop offset="1" stop-color="${p.light}"/></linearGradient>` +
  `<linearGradient id="${id}b" x1="0" y1="1" x2="0.2" y2="0">` +
  `<stop offset="0" stop-color="${p.deep}"/><stop offset="0.7" stop-color="${p.mid}"/>` +
  `<stop offset="1" stop-color="${p.mid}"/></linearGradient>`;

/*
 * A fan petal standing up from the origin: narrow at the base, flaring wide,
 * with the fringed top edge that gives carnations their name in Turkish.
 */
const fanPetal = (L, W, teeth, depth, phase) => {
  let d = `M ${f2(-W * 0.16)} 0 C ${f2(-W * 0.55)} ${f2(-L * 0.3)}, ${f2(-W * 0.98)} ${f2(-L * 0.6)}, ${f2(-W)} ${f2(-L * 0.82)}`;
  for (let i = 0; i <= teeth; i++) {
    const t = i / teeth;
    const x = -W + t * W * 2;
    // the top edge arches, and every tooth cuts a notch into it
    const arch = -L * (0.9 + Math.sin(t * Math.PI) * 0.14);
    const cut = i % 2 === 0 ? 0 : depth * (0.6 + 0.4 * Math.sin((t * 9 + phase) * 2.1));
    d += ` L ${f2(x)} ${f2(arch + cut)}`;
  }
  d += ` C ${f2(W * 0.98)} ${f2(-L * 0.6)}, ${f2(W * 0.55)} ${f2(-L * 0.3)}, ${f2(W * 0.16)} 0 Z`;
  return d;
};

/* One carnation head in a 100-radius space */
const head = (id, p, rnd) => {
  const turn = rnd(0, 360);
  let g = '';
  const rings = [
    { n: 14, L: rnd(82, 96), W: rnd(19, 24), tilt: 0, fill: `url(#${id}a)`, shade: 0 },
    { n: 12, L: rnd(62, 74), W: rnd(16, 20), tilt: 15, fill: `url(#${id}a)`, shade: 0.1 },
    { n: 9, L: rnd(43, 53), W: rnd(13, 17), tilt: 32, fill: `url(#${id}b)`, shade: 0.2 },
    { n: 7, L: rnd(26, 34), W: rnd(10, 13), tilt: 50, fill: `url(#${id}b)`, shade: 0.34 },
  ];
  rings.forEach((ring, ri) => {
    for (let i = 0; i < ring.n; i++) {
      const deg = turn + ring.tilt + (i * 360) / ring.n + rnd(-6, 6);
      const d = fanPetal(ring.L * rnd(0.88, 1.1), ring.W * rnd(0.88, 1.12),
        Math.floor(rnd(7, 11)) * 2, ring.L * 0.2, rnd(0, 6));
      g += `<g transform="rotate(${f2(deg)}) translate(0 ${f2(ri * 2)})">` +
        `<path d="${d}" fill="${ring.fill}" stroke="${p.deep}" stroke-width="0.6" stroke-opacity="0.45"/>` +
        (ring.shade ? `<path d="${d}" fill="#2a0410" opacity="${f2(ring.shade)}"/>` : '') +
        `</g>`;
    }
  });
  // the crumpled middle
  g += `<circle r="7" fill="${p.deep}" opacity="0.55"/>`;
  return g;
};

/* Narrow blue-green leaf in an opposite pair at a node */
const leafPair = (x, y, deg, L, W) =>
  `<g transform="translate(${f2(x)} ${f2(y)}) rotate(${f2(deg)})">` +
  [1, -1].map((s) =>
    // narrow, keeled, arching away from the node and tapering to a fine point
    `<path d="M 0 0 C ${f2(s * W * 1.6)} ${f2(-L * 0.3)}, ${f2(s * W * 3.2)} ${f2(-L * 0.62)}, ${f2(s * W * 3.0)} ${f2(-L)} ` +
    `C ${f2(s * W * 1.6)} ${f2(-L * 0.6)}, ${f2(s * W * 0.5)} ${f2(-L * 0.26)}, 0 0 Z" ` +
    `fill="url(#cLeaf)" stroke="#274634" stroke-width="0.55"/>` +
    `<path d="M ${f2(s * W * 0.3)} ${f2(-L * 0.1)} Q ${f2(s * W * 1.8)} ${f2(-L * 0.6)} ${f2(s * W * 2.8)} ${f2(-L * 0.94)}" ` +
    `stroke="#b4d2bc" stroke-width="0.6" fill="none" opacity="0.4"/>`).join('') +
  `<ellipse rx="${f2(W * 0.55)}" ry="${f2(W * 0.4)}" fill="#5d8f6d"/></g>`;

/* The calyx tube that every carnation bloom sits in */
const calyx = (L, W, p) =>
  // a slim tube, slightly swollen at the shoulder, with five short sepal points
  `<path d="M ${f2(-W * 0.7)} 0 C ${f2(-W)} ${f2(-L * 0.4)}, ${f2(-W * 0.95)} ${f2(-L * 0.8)}, ${f2(-W * 0.8)} ${f2(-L)} ` +
  `Q 0 ${f2(-L * 1.1)} ${f2(W * 0.8)} ${f2(-L)} ` +
  `C ${f2(W * 0.95)} ${f2(-L * 0.8)}, ${f2(W)} ${f2(-L * 0.4)}, ${f2(W * 0.7)} 0 Z" ` +
  `fill="#5d8f6d" stroke="#2f5742" stroke-width="0.8"/>` +
  [-1.1, -0.4, 0.4, 1.1].map((k) =>
    `<path d="M ${f2(k * W * 0.5)} ${f2(-L * 0.95)} L ${f2(k * W * 0.5 + W * 0.2)} ${f2(-L * 1.26)} ` +
    `L ${f2(k * W * 0.5 - W * 0.2)} ${f2(-L * 1.26)} Z" fill="#4e8060"/>`).join('') +
  `<path d="M ${f2(-W * 0.3)} ${f2(-L * 0.15)} C ${f2(-W * 0.42)} ${f2(-L * 0.5)}, ${f2(-W * 0.4)} ${f2(-L * 0.7)}, ${f2(-W * 0.34)} ${f2(-L * 0.92)}" ` +
  `stroke="#2f5742" stroke-width="0.9" fill="none" opacity="0.35"/>` +
  `<path d="M ${f2(W * 0.24)} ${f2(-L * 0.15)} C ${f2(W * 0.36)} ${f2(-L * 0.5)}, ${f2(W * 0.34)} ${f2(-L * 0.7)}, ${f2(W * 0.28)} ${f2(-L * 0.92)}" ` +
  `stroke="#9dc0a5" stroke-width="0.9" fill="none" opacity="0.4"/>` +
  `<path d="M ${f2(-W * 0.6)} ${f2(-L * 0.3)} Q 0 ${f2(-L * 0.22)} ${f2(W * 0.6)} ${f2(-L * 0.3)}" ` +
  `stroke="${p.deep}" stroke-width="0.7" fill="none" opacity="0.12"/>`;

const buildHead = (palIdx, seed) => {
  const rnd = makeRng(seed);
  const p = PALS[palIdx];
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-105 -105 210 210" width="210" height="210">` +
    `<defs>${petalDefs('h', p)}${DEFS}</defs>${head('h', p, rnd)}</svg>`;
  return svgUrl(svg);
};

/* A stem: nodes, leaf pairs, a calyx and the bloom on top */
const buildStem = (palIdx, seed) => {
  const rnd = makeRng(seed);
  const p = PALS[palIdx];
  const base = 120, h = rnd(150, 200);
  const lean = rnd(-20, 20);
  const topX = lean, topY = base - h;
  let body = `<path d="M 0 ${f2(base)} C ${f2(lean * 0.3)} ${f2(base - h * 0.5)}, ${f2(topX)} ${f2(base - h * 0.82)}, ${f2(topX)} ${f2(topY)}" ` +
    `stroke="url(#cStem)" stroke-width="5.5" fill="none" stroke-linecap="round"/>`;
  for (let i = 0; i < 4; i++) {
    const t = 0.15 + i * 0.22;
    const nx = lean * t * 0.9, ny = base - h * t;
    body += leafPair(nx, ny, rnd(-18, 18), rnd(52, 82), rnd(2.6, 4));
  }
  body += `<g transform="translate(${f2(topX)} ${f2(topY + 6)})">${calyx(rnd(34, 44), rnd(11, 14), p)}</g>`;
  body += `<g transform="translate(${f2(topX)} ${f2(topY - rnd(26, 36))}) rotate(${f2(rnd(-14, 14))}) ` +
    `scale(${f2(rnd(0.5, 0.68))})" filter="url(#cSh)">${head('s', p, rnd)}</g>`;

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-130 -130 260 260" width="260" height="260">` +
    `<defs>${petalDefs('s', p)}${DEFS}</defs>${body}</svg>`;
  return svgUrl(svg);
};

/* A closed bud still inside its calyx */
const buildBud = (palIdx, seed) => {
  const rnd = makeRng(seed);
  const p = PALS[palIdx];
  const L = rnd(52, 66), W = rnd(9, 12);
  let body = `<path d="M 0 74 L 0 0" stroke="url(#cStem)" stroke-width="4.6" stroke-linecap="round"/>`;
  body += leafPair(0, 62, rnd(-16, 16), rnd(50, 72), rnd(2.2, 3.2));
  body += leafPair(0, 26, rnd(-16, 16), rnd(38, 56), rnd(2, 2.8));
  body += calyx(L, W, p);
  // the first crumpled petals pushing out of the mouth
  for (let i = -2; i <= 2; i++) {
    const h = rnd(0.22, 0.4);
    body += `<path d="M ${f2(i * W * 0.3)} ${f2(-L * 1.02)} ` +
      `C ${f2(i * W * 0.55 - W * 0.3)} ${f2(-L * (1.02 + h))}, ${f2(i * W * 0.55 + W * 0.3)} ${f2(-L * (1.04 + h))}, ` +
      `${f2(i * W * 0.3 + W * 0.3)} ${f2(-L * 1.0)} Z" fill="${i % 2 ? p.mid : p.light}"/>`;
  }
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-70 -110 140 190" width="140" height="190">` +
    `<defs>${DEFS}</defs>${body}</svg>`;
  return svgUrl(svg);
};

/* Leaves only, for the ground layer */
const buildFoliage = (seed) => {
  const rnd = makeRng(seed);
  let body = `<g opacity="0.95">`;
  for (let i = 0; i < 30; i++) {
    body += leafPair(rnd(-78, 78), rnd(-70, 95), rnd(-120, 120), rnd(55, 110), rnd(3.4, 6.2));
  }
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-115 -115 230 230" width="230" height="230">` +
    `<defs>${DEFS}<linearGradient id="cLeaf" x1="0" y1="1" x2="0.4" y2="0">` +
    `<stop offset="0" stop-color="#1f3c2d"/><stop offset="0.5" stop-color="#42684f"/>` +
    `<stop offset="1" stop-color="#76987f"/></linearGradient></defs>${body}</g></svg>`;
  return svgUrl(svg);
};

/* ── Built once; shared by the modal scene and the garden preview ── */
const MIX = [0, 1, 2, 3, 0, 1, 4, 2, 0, 3];
export const CARNATION_URLS = MIX.map((p, i) => buildHead(p, 8100 + i * 43));
export const CARN_STEM_URLS = MIX.map((p, i) => buildStem(p, 8700 + i * 37));
export const CARN_BUD_URLS = [0, 1, 3, 2].map((p, i) => buildBud(p, 9200 + i * 29));
export const CARN_LEAF_URLS = Array.from({ length: 4 }, (_, i) => buildFoliage(9600 + i * 19));
