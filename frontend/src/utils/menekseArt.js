import { makeRng, f2, svgUrl, smoothClosed, shadow } from './svgArt';

/*
 * February menekşe — Viola odorata, the sweet violet.
 *
 * Reference structure: five petals in the viola arrangement — two upright at
 * the top, two laterals spreading sideways, and one broad lower lip that acts
 * as the landing platform, carrying dark nectar guides that radiate out of a
 * white throat. The whole flower nods on a slender pedicel that hooks over,
 * so blooms look down and slightly away rather than straight at you. The
 * leaves are cordate — heart-shaped with a deep notch and a scalloped
 * (crenate) margin — on long petioles, and the plant makes a low rosette
 * rather than a stem, which is why violets read as a carpet, not a spike.
 *
 * The colour is the point: a dark, saturated violet with a velvet sheen, so
 * every petal is shaded from an almost-black edge to a lit face.
 */

const PALETTES = [
  // Classic sweet violet
  { deep: '#30124f', mid: '#4d1c86', body: '#6a2ea6', lit: '#9460c9', throat: '#f4ecfb', guide: '#2a0a46', eye: '#f2c94c' },
  // Paler lilac-violet
  { deep: '#2d1047', mid: '#512383', body: '#6f3aa8', lit: '#9566cc', throat: '#faf4ff', guide: '#2a0a46', eye: '#f7d268' },
  // Deep indigo-violet
  { deep: '#2a1049', mid: '#45197c', body: '#5e2a9a', lit: '#8355bb', throat: '#efe6f8', guide: '#23094a', eye: '#e8bf44' },
  // Rare white violet, for the odd one in a drift
  { deep: '#b7aec6', mid: '#ded6ea', body: '#f1ecf7', lit: '#ffffff', throat: '#ffffff', guide: '#6d5a8a', eye: '#f0c450' },
];

const LEAF = { dark: '#24502e', mid: '#3d7546', light: '#5f9e68', rib: '#8cc094', edge: '#1d3f25' };

const DEFS = (p, id) =>
  `<radialGradient id="vp${id}" cx="50%" cy="100%" r="118%">` +
  `<stop offset="0" stop-color="${p.throat}"/><stop offset="0.16" stop-color="${p.body}"/>` +
  `<stop offset="0.55" stop-color="${p.mid}"/><stop offset="0.86" stop-color="${p.deep}"/>` +
  `<stop offset="1" stop-color="${p.deep}"/></radialGradient>` +
  // the velvet sheen: a soft light band across the face of each petal
  `<linearGradient id="vs${id}" x1="0.1" y1="1" x2="0.75" y2="0">` +
  `<stop offset="0" stop-color="${p.lit}" stop-opacity="0"/>` +
  `<stop offset="0.55" stop-color="${p.lit}" stop-opacity="0.42"/>` +
  `<stop offset="1" stop-color="${p.lit}" stop-opacity="0"/></linearGradient>` +
  `<linearGradient id="vlf${id}" x1="0.05" y1="1" x2="0.6" y2="0">` +
  `<stop offset="0" stop-color="${LEAF.dark}"/><stop offset="0.55" stop-color="${LEAF.mid}"/>` +
  `<stop offset="1" stop-color="${LEAF.light}"/></linearGradient>` +
  `<linearGradient id="vst${id}" x1="0" y1="1" x2="0.4" y2="0">` +
  `<stop offset="0" stop-color="#2c5a33"/><stop offset="1" stop-color="#6b9a5e"/></linearGradient>` +
  shadow(`vsh${id}`, 0.88, 2.38, 0.25);

/* One viola petal: a claw at the base opening into a broad rounded blade */
const petal = (L, W, skew) =>
  `M 0 0 ` +
  `C ${f2(-W * 0.22)} ${f2(-L * 0.18)}, ${f2(-W * 1.02 + skew)} ${f2(-L * 0.44)}, ${f2(-W * 0.74 + skew)} ${f2(-L * 0.85)} ` +
  `Q ${f2(skew * 1.2)} ${f2(-L * 1.07)}, ${f2(W * 0.74 + skew)} ${f2(-L * 0.85)} ` +
  `C ${f2(W * 1.02 + skew)} ${f2(-L * 0.44)}, ${f2(W * 0.22)} ${f2(-L * 0.18)}, 0 0 Z`;

/*
 * A full face-on flower drawn at the origin. `squash` flattens it vertically
 * so a bloom can be seen at an angle rather than dead-on.
 */
const bloom = (p, id, rnd, squash = 1) => {
  const S = rnd(0.94, 1.06);
  const parts = [
    // lower lip first, so the uppers overlap it the way they really do
    { a: 180, L: 40, W: 23, guides: 5 },
    { a: 108, L: 36, W: 20, guides: 3 },
    { a: -108, L: 36, W: 20, guides: 3 },
    { a: 38, L: 34, W: 19, guides: 0 },
    { a: -38, L: 34, W: 19, guides: 0 },
  ];

  let g = `<g transform="scale(1 ${f2(squash)})">`;
  parts.forEach((q, i) => {
    const a = q.a + rnd(-6, 6);
    const L = q.L * S * rnd(0.93, 1.07);
    const W = q.W * S * rnd(0.92, 1.08);
    const skew = rnd(-2.5, 2.5);
    const d = petal(L, W, skew);

    let guides = '';
    for (let k = 0; k < q.guides; k++) {
      const spread = (k - (q.guides - 1) / 2) / Math.max(1, q.guides - 1);
      const len = L * (0.46 - Math.abs(spread) * 0.16);
      guides += `<path d="M 0 ${f2(-L * 0.08)} Q ${f2(spread * W * 0.5)} ${f2(-len * 0.6)} ${f2(spread * W * 0.82)} ${f2(-len)}" ` +
        `stroke="${p.guide}" stroke-width="${f2(1.5 - Math.abs(spread) * 0.5)}" fill="none" ` +
        `opacity="0.4" stroke-linecap="round"/>`;
    }

    g += `<g transform="rotate(${f2(a)})">` +
      `<path d="${d}" fill="url(#vp${id})" stroke="${p.mid}" stroke-width="0.45" stroke-opacity="0.38" stroke-linejoin="round"/>` +
      `<path d="${d}" fill="url(#vs${id})"/>` +
      guides +
      // the notch some violets carry at the petal tip
      (i === 0 ? `<path d="M ${f2(-W * 0.12)} ${f2(-L * 1.0)} Q 0 ${f2(-L * 0.9)} ${f2(W * 0.12)} ${f2(-L * 1.0)}" ` +
        `stroke="${p.mid}" stroke-width="0.7" fill="none" opacity="0.26"/>` : '') +
      `</g>`;
  });

  // white throat and the small yellow eye at the mouth
  g += `<ellipse rx="${f2(7.5 * S)}" ry="${f2(6 * S)}" fill="${p.throat}" opacity="0.92"/>` +
    `<ellipse cy="${f2(1.5 * S)}" rx="${f2(3.4 * S)}" ry="${f2(2.8 * S)}" fill="${p.eye}"/>` +
    `<ellipse cy="${f2(0.6 * S)}" rx="${f2(1.5 * S)}" ry="${f2(1.2 * S)}" fill="#fff6d8" opacity="0.8"/>`;
  return `${g}</g>`;
};

/* A bud: the spur-backed teardrop violets carry before they open */
const bud = (p, rnd) => {
  const L = rnd(13, 18), W = rnd(6, 8.5);
  return `<path d="M 0 0 C ${f2(-W)} ${f2(-L * 0.3)}, ${f2(-W * 0.85)} ${f2(-L * 0.85)}, 0 ${f2(-L)} ` +
    `C ${f2(W * 0.85)} ${f2(-L * 0.85)}, ${f2(W)} ${f2(-L * 0.3)}, 0 0 Z" ` +
    `fill="${p.mid}" stroke="${p.deep}" stroke-width="0.6"/>` +
    `<path d="M ${f2(-W * 0.35)} ${f2(-L * 0.35)} Q ${f2(-W * 0.5)} ${f2(-L * 0.7)} 0 ${f2(-L * 0.92)}" ` +
    `stroke="${p.lit}" stroke-width="1.1" fill="none" opacity="0.4"/>` +
    `<path d="M 0 2 Q ${f2(W * 0.9)} 5 ${f2(W * 1.5)} 1" stroke="#4a7d4e" stroke-width="2" fill="none" stroke-linecap="round"/>`;
};

/* Heart-shaped leaf with a scalloped margin, pointing up from the origin */
const leaf = (id, L, W, lean, flip) => {
  const n = 26, right = [], left = [];
  for (let i = 0; i <= n; i++) {
    const u = i / n;
    // scallops along the margin, fading out at the tip
    const crenate = 1 + 0.055 * Math.sin(u * Math.PI * 7) * (1 - u) ** 0.5;
    const hw = W * Math.pow(Math.sin(Math.PI * Math.pow(u, 0.58)), 0.82) * crenate;
    // the deep basal notch that makes it a heart
    const y = -u * L + L * 0.22 * Math.pow(1 - u, 4.5);
    const x = lean * u * u;
    right.push([x + hw, y]);
    left.unshift([x - hw, y]);
  }
  let veins = `<path d="M 0 ${f2(L * 0.14)} Q ${f2(lean * 0.3)} ${f2(-L * 0.5)} ${f2(lean)} ${f2(-L * 0.9)}" ` +
    `stroke="${LEAF.rib}" stroke-width="1.3" fill="none" opacity="0.55"/>`;
  for (let v = 1; v <= 3; v++) {
    const u = 0.18 + v * 0.2;
    const y = -u * L + L * 0.22 * Math.pow(1 - u, 4.5);
    const reach = W * 0.62 * (1 - v * 0.17);
    veins += `<path d="M ${f2(lean * u * u)} ${f2(y)} q ${f2(reach * 0.6)} ${f2(-reach * 0.3)} ${f2(reach)} ${f2(-reach * 0.75)} ` +
      `M ${f2(lean * u * u)} ${f2(y)} q ${f2(-reach * 0.6)} ${f2(-reach * 0.3)} ${f2(-reach)} ${f2(-reach * 0.75)}" ` +
      `stroke="${LEAF.rib}" stroke-width="0.7" fill="none" opacity="0.32"/>`;
  }
  return `<g transform="scale(${flip ? -1 : 1} 1)">` +
    `<path d="${smoothClosed([...right, ...left])}" fill="url(#vlf${id})" ` +
    `stroke="${LEAF.edge}" stroke-width="0.9" stroke-linejoin="round"/>` +
    veins +
    // waxy highlight so the leaf reads as a surface, not a silhouette
    `<path d="M ${f2(-W * 0.4)} ${f2(-L * 0.3)} Q ${f2(-W * 0.3 + lean * 0.4)} ${f2(-L * 0.62)} ${f2(W * 0.1 + lean)} ${f2(-L * 0.84)}" ` +
    `stroke="#cfeed6" stroke-width="2.4" fill="none" opacity="0.13" stroke-linecap="round"/></g>`;
};

/*
 * A rosette: heart leaves on long petioles with a handful of flowers nodding
 * out of the middle on their hooked pedicels.
 */
const buildClump = (seed, palIdx) => {
  const rnd = makeRng(seed);
  const p = PALETTES[palIdx];
  const id = `c${seed}`;
  const base = 104;
  let back = '', front = '', blooms = '';

  /*
   * Leaves fan out of one crown. They are deliberately kept lower and smaller
   * than the flower stalks: violet foliage really does sit below the blooms,
   * and letting it climb as high swallows the flowers entirely.
   */
  const addLeaf = (standRange, sizeRange) => {
    const x = rnd(-50, 50);
    const stand = rnd(...standRange);
    const L = rnd(...sizeRange), W = L * rnd(0.46, 0.58);
    const lean = rnd(-14, 14);
    const tilt = rnd(-38, 38);
    return `<path d="M ${f2(x * 0.3)} ${f2(base)} Q ${f2(x * 0.7)} ${f2(base - stand * 0.6)} ${f2(x)} ${f2(base - stand)}" ` +
      `stroke="url(#vst${id})" stroke-width="${f2(rnd(2, 2.8))}" fill="none" stroke-linecap="round"/>` +
      `<g transform="translate(${f2(x)} ${f2(base - stand)}) rotate(${f2(tilt)})">${leaf(id, L, W, lean, rnd() < 0.5)}</g>`;
  };
  for (let i = 0; i < Math.floor(rnd(4, 6)); i++) back += addLeaf([34, 58], [34, 48]);
  for (let i = 0; i < Math.floor(rnd(3, 5)); i++) front += addLeaf([8, 30], [26, 40]);

  // flowers on pedicels that rise then hook over, so the bloom faces down-out
  const nFlower = Math.floor(rnd(4, 7));
  for (let i = 0; i < nFlower; i++) {
    const x = -42 + (i + 0.5) * (84 / nFlower) + rnd(-9, 9);
    const h = rnd(72, 116);
    const hook = rnd(10, 24) * (rnd() < 0.5 ? -1 : 1);
    const fx = x + hook, fy = base - h;
    blooms += `<path d="M ${f2(x)} ${f2(base)} C ${f2(x + hook * 0.2)} ${f2(base - h * 0.55)}, ` +
      `${f2(x + hook * 0.3)} ${f2(fy - 12)}, ${f2(fx)} ${f2(fy - 3)}" ` +
      `stroke="url(#vst${id})" stroke-width="2.3" fill="none" stroke-linecap="round"/>` +
      `<g transform="translate(${f2(fx)} ${f2(fy)}) rotate(${f2(hook * 0.7 + rnd(-10, 10))}) scale(${f2(rnd(0.78, 1.04))})" ` +
      `filter="url(#vsh${id})">${bloom(p, id, rnd, rnd(0.86, 1))}</g>`;
  }

  // a bud or two still waiting
  if (rnd() < 0.7) {
    const bx = rnd(-54, 54), bh = rnd(62, 92);
    blooms += `<path d="M ${f2(bx)} ${f2(base)} Q ${f2(bx + rnd(-8, 8))} ${f2(base - bh * 0.6)} ${f2(bx + rnd(-10, 10))} ${f2(base - bh)}" ` +
      `stroke="url(#vst${id})" stroke-width="2" fill="none" stroke-linecap="round"/>` +
      `<g transform="translate(${f2(bx)} ${f2(base - bh)}) rotate(${f2(rnd(-30, 30))})">${bud(p, rnd)}</g>`;
  }

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-120 -120 240 240" width="240" height="240">` +
    `<defs>${DEFS(p, id)}</defs>${back}${blooms}${front}</svg>`;
  return svgUrl(svg);
};

/* A single bloom with its pedicel, for tucking into gaps */
const buildBloom = (seed, palIdx) => {
  const rnd = makeRng(seed);
  const p = PALETTES[palIdx];
  const id = `b${seed}`;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-60 -60 120 120" width="120" height="120">` +
    `<defs>${DEFS(p, id)}</defs>` +
    `<g filter="url(#vsh${id})">${bloom(p, id, rnd, rnd(0.88, 1))}</g></svg>`;
  return svgUrl(svg);
};

/* Leaves only — the ground carpet a violet drift actually sits on */
const buildLeaves = (seed) => {
  const rnd = makeRng(seed);
  const id = `l${seed}`;
  let body = '';
  for (let i = 0; i < 9; i++) {
    const x = rnd(-72, 72), y = rnd(-40, 70);
    const L = rnd(42, 70);
    body += `<g transform="translate(${f2(x)} ${f2(y)}) rotate(${f2(rnd(-55, 55))})">` +
      `${leaf(id, L, L * rnd(0.45, 0.58), rnd(-14, 14), rnd() < 0.5)}</g>`;
  }
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-110 -110 220 220" width="220" height="220">` +
    `<defs>${DEFS(PALETTES[0], id)}</defs>${body}</svg>`;
  return svgUrl(svg);
};

/* ── Built once; the modal scene and the garden preview share these ── */
export const VIOLET_CLUMP_URLS = Array.from({ length: 7 }, (_, i) => buildClump(5100 + i * 47, i === 6 ? 3 : i % 3));
export const VIOLET_BLOOM_URLS = Array.from({ length: 6 }, (_, i) => buildBloom(5800 + i * 31, i === 5 ? 3 : i % 3));
export const VIOLET_LEAF_URLS = Array.from({ length: 4 }, (_, i) => buildLeaves(6400 + i * 29));
