import { makeRng, sr, f2, svgUrl, smoothClosed, mixHex, shadow } from './svgArt';

/*
 * September leylak — Syringa vulgaris, the common lilac.
 *
 * Reference structure: the flower everyone pictures is not one bloom but a
 * panicle — a dense cone, broadest at the base and tapering to a blunt point,
 * packed with hundreds of tiny florets. Each floret is a narrow tube opening
 * into four blunt lobes, barely 8 mm across, with a pale eye at the mouth.
 * They are tightly crowded, so the panicle reads as texture rather than as
 * separate flowers, and the unopened buds at the tip stay a deeper colour
 * than the open florets below — which is exactly what gives a lilac its
 * two-tone, slightly faded look.
 *
 * Leaves are large, smooth and heart-shaped, in opposite pairs, and much
 * darker than the flowers.
 *
 * The old version drew eighteen flat four-petal stars on a transparent ground
 * and read as confetti. This one builds the cone properly, shades every
 * floret, and keeps the buds crowded at the tip.
 */

const PALETTES = [
  // The classic lilac
  { bud: '#5e2b86', deep: '#7b45a3', body: '#a876c8', lit: '#c9a3de', eye: '#f3e9fa', tube: '#6b3a92' },
  // Pale, almost grey-lilac — the faded nostalgic one
  { bud: '#8a6aa8', deep: '#a98cc2', body: '#cdb6de', lit: '#e6daf0', eye: '#fdfaff', tube: '#9a7fb5' },
  // Deep violet 'Charles Joly'
  { bud: '#3f1266', deep: '#5a2088', body: '#7f44ad', lit: '#a876c8', eye: '#efe4f8', tube: '#4d1a76' },
  // White lilac
  { bud: '#c8c0d2', deep: '#e2dbe8', body: '#f4f0f8', lit: '#ffffff', eye: '#fffdf2', tube: '#cfc6d8' },
  // Pink-mauve
  { bud: '#8a3a72', deep: '#a8588c', body: '#c98ab0', lit: '#e4bcd2', eye: '#fdf0f6', tube: '#97477c' },
];

const LEAF = { dark: '#14351c', mid: '#2b5e30', light: '#45843f', rib: '#78ab72', edge: '#0b2010' };

const DEFS = (p, id) =>
  `<radialGradient id="yf${id}" cx="48%" cy="38%" r="72%">` +
  `<stop offset="0" stop-color="${p.lit}"/><stop offset="0.55" stop-color="${p.body}"/>` +
  `<stop offset="1" stop-color="${p.deep}"/></radialGradient>` +
  `<radialGradient id="yb${id}" cx="40%" cy="32%" r="78%">` +
  `<stop offset="0" stop-color="${mixHex(p.bud, p.body, 0.45)}"/><stop offset="1" stop-color="${p.bud}"/></radialGradient>` +
  `<linearGradient id="yl${id}" x1="0.1" y1="1" x2="0.6" y2="0">` +
  `<stop offset="0" stop-color="${LEAF.dark}"/><stop offset="0.55" stop-color="${LEAF.mid}"/>` +
  `<stop offset="1" stop-color="${LEAF.light}"/></linearGradient>` +
  `<linearGradient id="ys${id}" x1="0" y1="1" x2="0.4" y2="0">` +
  `<stop offset="0" stop-color="#3b5c35"/><stop offset="1" stop-color="#75996a"/></linearGradient>` +
  shadow(`ysh${id}`, 0.96, 2.75, 0.25);

/* One lobe of a floret: short, blunt, slightly cupped */
const lobe = (R) =>
  `M 0 0 C ${f2(-R * 0.62)} ${f2(-R * 0.12)}, ${f2(-R * 0.72)} ${f2(-R * 0.66)}, 0 ${f2(-R)} ` +
  `C ${f2(R * 0.72)} ${f2(-R * 0.66)}, ${f2(R * 0.62)} ${f2(-R * 0.12)}, 0 0 Z`;

/* A single open floret: four blunt lobes around a pale eye */
const floret = (p, id, R, turn) => {
  let g = '';
  for (let i = 0; i < 4; i++) {
    g += `<g transform="rotate(${f2(turn + i * 90 + (i % 2 ? 4 : -4))})">` +
      `<path d="${lobe(R)}" fill="url(#yf${id})" stroke="${p.deep}" stroke-width="${f2(R * 0.045)}" ` +
      `stroke-opacity="0.5" stroke-linejoin="round"/></g>`;
  }
  return g +
    `<circle r="${f2(R * 0.26)}" fill="${p.tube}"/>` +
    `<circle r="${f2(R * 0.15)}" fill="${p.eye}" opacity="0.9"/>`;
};

/* An unopened bud: a small shaded ball, deeper in colour than the florets */
const budDot = (p, id, R) =>
  `<circle r="${f2(R)}" fill="url(#yb${id})"/>` +
  `<circle cx="${f2(-R * 0.3)}" cy="${f2(-R * 0.32)}" r="${f2(R * 0.3)}" fill="#ffffff" opacity="0.2"/>`;

/*
 * The panicle: a cone of florets, widest at the bottom and tapering upward.
 * Florets are laid out back to front so the near ones overlap the far ones,
 * and the top quarter is left as crowded buds.
 */
const buildPanicle = (seed, palIdx) => {
  const rnd = makeRng(seed);
  const p = PALETTES[palIdx];
  const id = `p${seed}`;
  const H = rnd(136, 170);
  const halfW = rnd(52, 68);
  const baseY = 90;

  // the rachis and its side branches, mostly hidden but visible at the edges
  let stems = `<path d="M 0 ${f2(baseY + 26)} L 0 ${f2(baseY - H)}" stroke="url(#ys${id})" stroke-width="4" stroke-linecap="round"/>`;

  const items = [];
  const N = 240;
  for (let i = 0; i < N; i++) {
    const s = seed + i * 11.7;
    // u runs 0 at the base of the cone to 1 at the tip
    const u = Math.pow(sr(s), 0.78);
    // the cone narrows towards the tip, with a soft shoulder at the bottom
    const w = halfW * Math.pow(1 - u, 0.82) * (0.62 + 0.38 * Math.sin(Math.min(1, u * 4.2) * Math.PI / 2));
    const x = (sr(s + 1) * 2 - 1) * w;
    const y = baseY - u * H + (sr(s + 2) - 0.5) * 7;
    // depth: florets near the middle of the cone sit in front
    const depth = 1 - Math.abs(x) / Math.max(1, w);
    items.push({ x, y, u, depth, s });
  }
  // back to front, so the overlap reads as a solid dome of flower
  items.sort((a, b) => a.depth - b.depth);

  let body = '';
  items.forEach(({ x, y, u, depth, s }) => {
    const near = 0.72 + depth * 0.4;
    // the top of the panicle stays in bud, which is what makes it two-tone
    const isBud = sr(s + 3) < 0.18 + u * 0.75;
    if (isBud) {
      body += `<g transform="translate(${f2(x)} ${f2(y)})">${budDot(p, id, (2.6 + sr(s + 4) * 1.8) * near)}</g>`;
    } else {
      const R = (7.5 + sr(s + 4) * 4) * near;
      body += `<g transform="translate(${f2(x)} ${f2(y)}) scale(${f2(near)})" opacity="${f2(0.9 + depth * 0.1)}">` +
        `${floret(p, id, R, sr(s + 5) * 90)}</g>`;
    }
  });

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-110 -110 220 220" width="220" height="220">` +
    `<defs>${DEFS(p, id)}</defs><g filter="url(#ysh${id})">${stems}${body}</g></svg>`;
  return svgUrl(svg);
};

/* A large smooth heart-shaped lilac leaf */
const heartLeaf = (id, L, W, lean) => {
  const n = 26, right = [], left = [];
  for (let i = 0; i <= n; i++) {
    const u = i / n;
    const hw = W * Math.pow(Math.sin(Math.PI * Math.pow(u, 0.52)), 0.78) * (1 - 0.12 * u);
    const y = -u * L + L * 0.18 * Math.pow(1 - u, 4);
    const x = lean * u * u;
    right.push([x + hw, y]);
    left.unshift([x - hw, y]);
  }
  let veins = '';
  for (let v = 1; v <= 4; v++) {
    const u = 0.14 + v * 0.17;
    const y = -u * L + L * 0.18 * Math.pow(1 - u, 4);
    const reach = W * 0.66 * (1 - v * 0.13);
    veins += `<path d="M ${f2(lean * u * u)} ${f2(y)} q ${f2(reach * 0.55)} ${f2(-reach * 0.25)} ${f2(reach)} ${f2(-reach * 0.7)} ` +
      `M ${f2(lean * u * u)} ${f2(y)} q ${f2(-reach * 0.55)} ${f2(-reach * 0.25)} ${f2(-reach)} ${f2(-reach * 0.7)}" ` +
      `stroke="${LEAF.rib}" stroke-width="0.7" fill="none" opacity="0.3"/>`;
  }
  return `<path d="${smoothClosed([...right, ...left])}" fill="url(#yl${id})" ` +
    `stroke="${LEAF.edge}" stroke-width="1" stroke-linejoin="round"/>` +
    `<path d="M 0 ${f2(L * 0.1)} Q ${f2(lean * 0.3)} ${f2(-L * 0.5)} ${f2(lean)} ${f2(-L * 0.92)}" ` +
    `stroke="${LEAF.rib}" stroke-width="1.3" fill="none" opacity="0.5"/>${veins}` +
    `<path d="M ${f2(-W * 0.42)} ${f2(-L * 0.3)} Q ${f2(-W * 0.3 + lean * 0.4)} ${f2(-L * 0.62)} ${f2(W * 0.1 + lean)} ${f2(-L * 0.86)}" ` +
    `stroke="#d4eed8" stroke-width="2.6" fill="none" opacity="0.12" stroke-linecap="round"/>`;
};

/* A pair of opposite leaves on a woody shoot */
const buildLeaves = (seed) => {
  const rnd = makeRng(seed);
  const id = `l${seed}`;
  let body = '';
  for (let i = 0; i < 5; i++) {
    const x = rnd(-72, 72), y = rnd(-30, 76);
    const a = rnd(0, 360);
    const L = rnd(52, 80);
    body += `<g transform="translate(${f2(x)} ${f2(y)}) rotate(${f2(a)})">` +
      `${heartLeaf(id, L, L * rnd(0.52, 0.68), rnd(-12, 12))}</g>`;
  }
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-110 -110 220 220" width="220" height="220">` +
    `<defs>${DEFS(PALETTES[0], id)}</defs>${body}</svg>`;
  return svgUrl(svg);
};

/* A single large leaf, for the layer right behind the panicles */
const buildLeaf = (seed) => {
  const rnd = makeRng(seed);
  const id = `s${seed}`;
  const L = rnd(84, 112);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-70 -125 140 150" width="140" height="150">` +
    `<defs>${DEFS(PALETTES[0], id)}</defs>` +
    `<path d="M 0 22 L 0 0" stroke="url(#ys${id})" stroke-width="3.5" stroke-linecap="round"/>` +
    heartLeaf(id, L, L * rnd(0.54, 0.68), rnd(-14, 14)) + `</svg>`;
  return svgUrl(svg);
};

/* A whole flowering shoot: a panicle with its pair of leaves beneath */
const buildBranch = (seed, palIdx) => {
  const rnd = makeRng(seed);
  const id = `br${seed}`;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-125 -125 250 250" width="250" height="250">` +
    `<defs>${DEFS(PALETTES[palIdx], id)}</defs>` +
    `<path d="M 0 120 L 0 50" stroke="url(#ys${id})" stroke-width="5" stroke-linecap="round"/>` +
    `<g transform="translate(${f2(rnd(-34, -16))} ${f2(rnd(54, 74))}) rotate(${f2(rnd(-72, -38))})">` +
    `${heartLeaf(id, rnd(58, 78), rnd(34, 46), rnd(-10, 10))}</g>` +
    `<g transform="translate(${f2(rnd(16, 34))} ${f2(rnd(54, 74))}) rotate(${f2(rnd(38, 72))})">` +
    `${heartLeaf(id, rnd(58, 78), rnd(34, 46), rnd(-10, 10))}</g>` +
    `<image href="${buildPanicle(seed + 7, palIdx)}" x="-110" y="-160" width="220" height="220"/>` +
    `</svg>`;
  return svgUrl(svg);
};

/* ── Pre-computed once; shared by the modal scene and the garden preview ── */
export const PANICLE_URLS = Array.from({ length: 10 }, (_, i) => buildPanicle(21000 + i * 53, i % PALETTES.length));
export const BRANCH_URLS = Array.from({ length: 6 }, (_, i) => buildBranch(21900 + i * 47, i % PALETTES.length));
export const LEAF_URLS = Array.from({ length: 4 }, (_, i) => buildLeaf(22600 + i * 31));
export const LEAF_SPRAY_URLS = Array.from({ length: 4 }, (_, i) => buildLeaves(23100 + i * 29));
