import { makeRng, f2, svgUrl, smoothClosed, litFrom, mixHex, shadow } from './svgArt';

/*
 * The bonus thirteenth month — dahlia, the yıldız çiçeği.
 *
 * Reference structure: a decorative dahlia is the most geometric flower in
 * this garden. Its ray florets sit in true concentric whorls, each ring
 * rotated to fall in the gaps of the one outside it, and every floret is
 * rolled — the two margins curl up and back until the petal is almost a
 * quill, so what you see is a lit central ridge flanked by two dark rolled
 * edges, finishing in a blunt notched tip. Floret size shrinks steeply inward
 * to a tight unopened button at the very centre.
 *
 * Where the peony is soft and crumpled, this is cut and faceted, which is why
 * the two never read as the same flower even at thumbnail size. The colour
 * runs from a deep plum heart out to a pale blush rim — the "Café au Lait"
 * gradient that makes the bloom look lit from within.
 */

const PALETTES = [
  // Plum heart to blush rim
  { heart: '#4a0f3a', deep: '#8a1f5e', body: '#c9447a', lit: '#e88aa8', rim: '#f8dbe4', roll: '#2e0624' },
  // Burgundy to apricot
  { heart: '#4d0d1c', deep: '#8f1e30', body: '#cf4a44', lit: '#ee9268', rim: '#fbe0c2', roll: '#2c0510' },
  // Amethyst to lilac-white
  { heart: '#2d0b4e', deep: '#5a2089', body: '#8a4ab8', lit: '#b687d9', rim: '#ece0f6', roll: '#1b0433' },
];

const LEAF = { dark: '#1a3a1c', mid: '#346236', light: '#4f8a46', rib: '#84b277', edge: '#102512' };

const DEFS = (p, id) =>
  `<linearGradient id="dl${id}" x1="0.1" y1="1" x2="0.6" y2="0">` +
  `<stop offset="0" stop-color="${LEAF.dark}"/><stop offset="0.55" stop-color="${LEAF.mid}"/>` +
  `<stop offset="1" stop-color="${LEAF.light}"/></linearGradient>` +
  `<linearGradient id="ds${id}" x1="0" y1="1" x2="0.4" y2="0">` +
  `<stop offset="0" stop-color="#355c33"/><stop offset="1" stop-color="#719a5e"/></linearGradient>` +
  shadow(`dsh${id}`, 0.96, 2.5, 0.28);

/*
 * One rolled ray floret, pointing up from the origin. The outline is narrow
 * and almost parallel-sided — a quill — with a shallow notch cut in the tip.
 */
const floret = (L, W) =>
  `M 0 0 ` +
  `C ${f2(-W * 0.9)} ${f2(-L * 0.2)}, ${f2(-W)} ${f2(-L * 0.6)}, ${f2(-W * 0.62)} ${f2(-L * 0.93)} ` +
  `Q ${f2(-W * 0.3)} ${f2(-L * 1.01)}, 0 ${f2(-L * 0.94)} ` +
  `Q ${f2(W * 0.3)} ${f2(-L * 1.01)}, ${f2(W * 0.62)} ${f2(-L * 0.93)} ` +
  `C ${f2(W)} ${f2(-L * 0.6)}, ${f2(W * 0.9)} ${f2(-L * 0.2)}, 0 0 Z`;

/* A whole bloom at the origin, face-on */
const bloom = (p, id, rnd) => {
  const turn = rnd(0, 360);
  let defs = '', g = '';
  let gid = 0;

  g += `<circle r="46" fill="${p.heart}"/>`;

  const rings = [
    { n: 13, R: 104, W: 0.17, depth: 0 },
    { n: 13, R: 88, W: 0.17, depth: 0.16 },
    { n: 12, R: 71, W: 0.18, depth: 0.34 },
    { n: 11, R: 55, W: 0.19, depth: 0.52 },
    { n: 10, R: 40, W: 0.2, depth: 0.7 },
    { n: 9, R: 27, W: 0.22, depth: 0.85 },
    { n: 7, R: 16, W: 0.24, depth: 1 },
  ];

  rings.forEach((ring, ri) => {
    // each ring is offset by half a step, so florets fall in the gaps below
    const off = (180 / ring.n) * (ri % 2) + ri * 5;
    for (let i = 0; i < ring.n; i++) {
      const deg = turn + off + (i * 360) / ring.n + rnd(-3.5, 3.5);
      const L = ring.R * rnd(0.95, 1.05);
      const W = L * ring.W * rnd(0.92, 1.08);
      const lit = litFrom(deg);
      const d = floret(L, W);

      const face = mixHex(p.body, p.lit, Math.max(0, 1 - ring.depth * 1.15) * (0.4 + lit * 0.6));
      const tipC = mixHex(face, p.rim, Math.max(0, 1 - ring.depth * 1.3) * 0.85);
      const baseC = mixHex(p.heart, p.deep, 0.3 + (1 - ring.depth) * 0.5);
      const gi = `df${id}_${gid++}`;
      defs += `<linearGradient id="${gi}" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="0" y2="${f2(-L)}">` +
        `<stop offset="0" stop-color="${baseC}"/>` +
        `<stop offset="0.35" stop-color="${mixHex(baseC, face, 0.75)}"/>` +
        `<stop offset="0.78" stop-color="${face}"/>` +
        `<stop offset="1" stop-color="${tipC}"/></linearGradient>`;

      g += `<g transform="rotate(${f2(deg)})">` +
        `<path d="${d}" fill="url(#${gi})" filter="url(#dsh${id})"/>` +
        // the two rolled margins: dark strokes hugging each edge
        `<path d="M ${f2(-W * 0.78)} ${f2(-L * 0.18)} C ${f2(-W * 0.88)} ${f2(-L * 0.55)}, ` +
        `${f2(-W * 0.66)} ${f2(-L * 0.78)}, ${f2(-W * 0.5)} ${f2(-L * 0.9)}" ` +
        `stroke="${p.roll}" stroke-width="${f2(W * 0.5)}" fill="none" opacity="0.42" stroke-linecap="round"/>` +
        `<path d="M ${f2(W * 0.78)} ${f2(-L * 0.18)} C ${f2(W * 0.88)} ${f2(-L * 0.55)}, ` +
        `${f2(W * 0.66)} ${f2(-L * 0.78)}, ${f2(W * 0.5)} ${f2(-L * 0.9)}" ` +
        `stroke="${p.roll}" stroke-width="${f2(W * 0.5)}" fill="none" opacity="0.42" stroke-linecap="round"/>` +
        // the lit ridge running up the middle of the roll
        `<path d="M 0 ${f2(-L * 0.14)} L 0 ${f2(-L * 0.88)}" ` +
        `stroke="${mixHex(tipC, '#ffffff', 0.45)}" stroke-width="${f2(W * 0.42)}" ` +
        `opacity="${f2(0.2 + lit * 0.4)}" stroke-linecap="round"/>` +
        // the notch at the blunt tip
        `<path d="M ${f2(-W * 0.2)} ${f2(-L * 0.95)} Q 0 ${f2(-L * 0.88)} ${f2(W * 0.2)} ${f2(-L * 0.95)}" ` +
        `stroke="${p.roll}" stroke-width="0.6" fill="none" opacity="0.45"/>` +
        `</g>`;
    }
  });

  // the tight unopened button at the very centre
  g += `<circle r="13" fill="${p.heart}"/>`;
  for (let i = 0; i < 11; i++) {
    const a = (i * 360) / 11 + turn;
    g += `<g transform="rotate(${f2(a)})"><path d="${floret(11, 2.6)}" fill="${mixHex(p.heart, p.deep, 0.65)}" ` +
      `stroke="${p.roll}" stroke-width="0.5"/></g>`;
  }
  g += `<circle r="4" fill="${mixHex(p.deep, p.body, 0.4)}"/>` +
    `<circle cx="-1.2" cy="-1.2" r="1.6" fill="${p.rim}" opacity="0.5"/>`;

  return { defs, g };
};

/* A toothed, pointed leaflet */
const leaflet = (L, W) => {
  const n = 24, right = [], left = [];
  for (let i = 0; i <= n; i++) {
    const u = i / n;
    const tooth = i % 2 ? 1 : 0.86;
    const hw = W * Math.pow(Math.sin(Math.PI * Math.pow(u, 0.68)), 0.8) * (1 - 0.3 * u) * tooth;
    right.push([hw, -u * L]);
    left.unshift([-hw, -u * L]);
  }
  return smoothClosed([[0, 2], ...right, ...left]);
};

/* A pinnate dahlia leaf: a terminal leaflet with two pairs below it */
const leafSpray = (id, rnd, S) => {
  let g = `<path d="M 0 ${f2(16 * S)} L 0 ${f2(-32 * S)}" stroke="${LEAF.mid}" stroke-width="${f2(1.9 * S)}"/>`;
  [{ y: 8, a: -56, s: 0.74 }, { y: 8, a: 56, s: 0.74 },
   { y: -12, a: -44, s: 0.88 }, { y: -12, a: 44, s: 0.88 },
   { y: -32, a: 0, s: 1 }].forEach((q) => {
    const L = 40 * S * q.s * rnd(0.88, 1.12);
    const W = L * rnd(0.32, 0.4);
    g += `<g transform="translate(0 ${f2(q.y * S)}) rotate(${f2(q.a + rnd(-9, 9))})">` +
      `<path d="${leaflet(L, W)}" fill="url(#dl${id})" stroke="${LEAF.edge}" stroke-width="${f2(0.8 * S)}" stroke-linejoin="round"/>` +
      `<path d="M 0 0 L 0 ${f2(-L * 0.9)}" stroke="${LEAF.rib}" stroke-width="${f2(0.8 * S)}" opacity="0.5"/>` +
      `<path d="M ${f2(-W * 0.45)} ${f2(-L * 0.3)} Q ${f2(-W * 0.4)} ${f2(-L * 0.6)} ${f2(-W * 0.1)} ${f2(-L * 0.8)}" ` +
      `stroke="#d8f0cc" stroke-width="${f2(1.5 * S)}" fill="none" opacity="0.13" stroke-linecap="round"/>` +
      `</g>`;
  });
  return g;
};

/* Just the bloom — the hero sprite */
const buildBloom = (seed, palIdx) => {
  const rnd = makeRng(seed);
  const p = PALETTES[palIdx];
  const id = `b${seed}`;
  const { defs, g } = bloom(p, id, rnd);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-118 -118 236 236" width="236" height="236">` +
    `<defs>${DEFS(p, id)}${defs}</defs>${g}</svg>`;
  return svgUrl(svg);
};

/* A bloom on its stem with leaves */
const buildStem = (seed, palIdx) => {
  const rnd = makeRng(seed);
  const p = PALETTES[palIdx];
  const id = `s${seed}`;
  const base = 120;
  const h = rnd(100, 134);
  const lean = rnd(-20, 20);
  const topY = base - h;
  const { defs, g } = bloom(p, id, rnd);

  let body = `<path d="M 0 ${f2(base)} C ${f2(lean * 0.3)} ${f2(base - h * 0.55)}, ` +
    `${f2(lean * 0.85)} ${f2(base - h * 0.86)}, ${f2(lean)} ${f2(topY)}" ` +
    `stroke="url(#ds${id})" stroke-width="4.6" fill="none" stroke-linecap="round"/>`;
  for (let i = 0; i < 2; i++) {
    const t = 0.22 + i * 0.3;
    body += `<g transform="translate(${f2(lean * t)} ${f2(base - h * t)}) rotate(${f2((i % 2 ? 1 : -1) * rnd(55, 95))}) ` +
      `scale(${f2(rnd(0.75, 1))})">${leafSpray(id, rnd, 1)}</g>`;
  }
  body += `<g transform="translate(${f2(lean)} ${f2(topY)}) scale(${f2(rnd(0.72, 0.9))})">${g}</g>`;

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-125 -125 250 250" width="250" height="250">` +
    `<defs>${DEFS(p, id)}${defs}</defs>${body}</svg>`;
  return svgUrl(svg);
};

/* Leaves only — the dark base layer */
const buildLeaves = (seed) => {
  const rnd = makeRng(seed);
  const id = `l${seed}`;
  let body = '';
  for (let i = 0; i < 7; i++) {
    body += `<g transform="translate(${f2(rnd(-76, 76))} ${f2(rnd(-40, 76))}) rotate(${f2(rnd(0, 360))}) ` +
      `scale(${f2(rnd(0.8, 1.25))})">${leafSpray(id, rnd, 1)}</g>`;
  }
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-115 -115 230 230" width="230" height="230">` +
    `<defs>${DEFS(PALETTES[0], id)}</defs>${body}</svg>`;
  return svgUrl(svg);
};

/* ── Built once; the modal scene and the garden preview share these ── */
export const DAHLIA_URLS = Array.from({ length: 6 }, (_, i) => buildBloom(18100 + i * 59, i % PALETTES.length));
export const DAHLIA_STEM_URLS = Array.from({ length: 5 }, (_, i) => buildStem(18800 + i * 43, i % PALETTES.length));
export const DAHLIA_LEAF_URLS = Array.from({ length: 4 }, (_, i) => buildLeaves(19400 + i * 29));
