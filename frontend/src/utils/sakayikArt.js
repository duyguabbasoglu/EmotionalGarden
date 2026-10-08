import { makeRng, f2, svgUrl, smoothClosed, smoothOpen, mixHex, litFrom, shadow } from './svgArt';

/*
 * May şakayık — the double garden peony (Paeonia lactiflora).
 *
 * Reference structure: a few broad, flat guard petals at the outside, then
 * ring after ring of shorter petals getting narrower, more crowded and more
 * crumpled towards a dense heart. The defining feature is the margin: peony
 * petals are frilled and notched, never smooth like a rose's, and the rings
 * do not spiral — they sit as rosettes, which is what gives the bloom its
 * round, heavy, overblown look. Colour runs the other way from a rose too:
 * deepest in the throat, washing out almost to white at the frilled edge.
 *
 * Leaves are biternate — long lance-shaped leaflets in threes on reddish
 * stalks — and deliberately sparse here, because a peony in flower is mostly
 * flower.
 */

const PALETTES = [
  // Sarah Bernhardt — the blush pink everyone pictures
  { heart: '#9e3756', deep: '#c75d7e', body: '#eb94ab', lit: '#f8bcc9', rim: '#fde8ec', stamen: '#f4d35e' },
  // Festiva Maxima — white with a crimson fleck in the heart
  { heart: '#c98a9c', deep: '#efd3da', body: '#fbeef0', lit: '#fffafa', rim: '#ffffff', stamen: '#f2d574' },
  // Deep rose, almost coral
  { heart: '#7c1f3c', deep: '#ad3356', body: '#d85c76', lit: '#ee8f9c', rim: '#fac4cb', stamen: '#f0c84e' },
  // Pale cream-lemon
  { heart: '#c9a24c', deep: '#efdca4', body: '#faf1d2', lit: '#fffbec', rim: '#ffffff', stamen: '#e6bb3c' },
];

const LEAF = { dark: '#1d3d1e', mid: '#386b32', light: '#538c45', rib: '#7fb06c', edge: '#13290f', stalk: '#7a3a2e' };

const DEFS = (p, id) =>
  `<linearGradient id="pl${id}" x1="0.1" y1="1" x2="0.6" y2="0">` +
  `<stop offset="0" stop-color="${LEAF.dark}"/><stop offset="0.55" stop-color="${LEAF.mid}"/>` +
  `<stop offset="1" stop-color="${LEAF.light}"/></linearGradient>` +
  `<linearGradient id="pst${id}" x1="0" y1="1" x2="0.4" y2="0">` +
  `<stop offset="0" stop-color="#3f6333"/><stop offset="1" stop-color="#7a9c5e"/></linearGradient>` +
  shadow(`psh${id}`, 1.04, 3.0, 0.24);

/*
 * The outline of one petal, as points around an arc. `frill` is what makes it
 * a peony: a ripple on the radius that deepens towards the rim, plus the
 * shallow notch real peony petals carry at the tip.
 */
const petalPts = (R, halfSpan, frill, waves, n = 22) => {
  const pts = [];
  for (let i = 0; i <= n; i++) {
    const t = -1 + (2 * i) / n;
    const a = t * halfSpan;
    // the body of the petal: broad and rounded, fullest in the middle
    let rr = R * (0.58 + 0.42 * Math.sqrt(Math.max(0, 1 - t * t)));
    rr *= 1 + frill * Math.sin(t * waves * Math.PI) * (0.4 + 0.6 * (1 - Math.abs(t)));
    // the notch at the very tip
    rr *= 1 - 0.07 * Math.exp(-((t * 7) ** 2));
    pts.push([Math.sin(a) * rr, -Math.cos(a) * rr]);
  }
  return pts;
};

/*
 * A whole double bloom at the origin, seen face-on. Rings are drawn outside
 * in, so each ring overlaps the one beyond it the way the real flower packs.
 */
const bloom = (p, id, rnd) => {
  const turn = rnd(0, 360);
  let defs = '', g = '';
  let gid = 0;

  // a disc of the darkest tone, so no background shows through the gaps
  g += `<circle r="52" fill="${p.heart}"/>`;

  /*
   * Petals are given a half-span wide enough that neighbours overlap well
   * past their edges. That overlap is the difference between a peony and a
   * dahlia: without it the ring reads as a cog of separate teeth, with it the
   * bloom closes up into the soft round mass a peony actually is.
   */
  const rings = [
    { n: 7, R: 106, hs: 1.12, frill: 0.075, waves: 3.5, depth: 0 },
    { n: 8, R: 93, hs: 1.0, frill: 0.09, waves: 4.5, depth: 0.14 },
    { n: 9, R: 78, hs: 0.9, frill: 0.1, waves: 5.5, depth: 0.3 },
    { n: 10, R: 62, hs: 0.82, frill: 0.11, waves: 6, depth: 0.46 },
    { n: 11, R: 46, hs: 0.76, frill: 0.12, waves: 6.5, depth: 0.62 },
    { n: 11, R: 31, hs: 0.72, frill: 0.13, waves: 7, depth: 0.78 },
    { n: 9, R: 18, hs: 0.72, frill: 0.14, waves: 7, depth: 0.92 },
  ];

  rings.forEach((ring, ri) => {
    const off = ri * 19 + rnd(-8, 8);
    for (let i = 0; i < ring.n; i++) {
      // uneven spacing, so no ring ever looks machined
      const deg = turn + off + (i * 360) / ring.n + rnd(-13, 13);
      const R = ring.R * rnd(0.86, 1.1);
      const hs = ring.hs * rnd(0.84, 1.14);
      const lit = litFrom(deg);
      const pts = petalPts(R, hs, ring.frill, ring.waves);
      const d = smoothClosed([[0, 0], ...pts]);

      // colour: dark in the throat, washing out to near-white at the frill
      const inner = mixHex(p.heart, p.deep, 0.25 + ring.depth * 0.45);
      const mid = mixHex(p.deep, p.body, 0.35 + lit * 0.4);
      const outer = mixHex(p.body, ring.depth > 0.5 ? p.lit : p.rim, 0.4 + lit * 0.6);
      const gi = `pp${id}_${gid++}`;
      defs += `<radialGradient id="${gi}" gradientUnits="userSpaceOnUse" cx="0" cy="0" r="${f2(R)}">` +
        `<stop offset="0" stop-color="${p.heart}"/>` +
        `<stop offset="0.28" stop-color="${inner}"/>` +
        `<stop offset="0.66" stop-color="${mid}"/>` +
        `<stop offset="0.93" stop-color="${outer}"/>` +
        `<stop offset="1" stop-color="${mixHex(outer, p.rim, 0.6)}"/></radialGradient>`;

      // a crease or two, so a petal reads as folded rather than cut from paper
      const creases = [-0.4, 0.35].map((k) =>
        `<path d="M 0 ${f2(-R * 0.12)} Q ${f2(k * R * hs * 0.5)} ${f2(-R * 0.5)} ${f2(k * R * hs * 0.72)} ${f2(-R * 0.86)}" ` +
        `stroke="${p.heart}" stroke-width="${f2(Math.max(0.5, R * 0.012))}" fill="none" opacity="0.2"/>`).join('');

      // the lip of the frill, lit only where it faces the light
      const rimPts = petalPts(R * 0.95, hs * 0.86, ring.frill, ring.waves, 14);
      const rim = smoothOpen(lit > 0.5 ? rimPts.slice(0, 11) : rimPts.slice(4));

      g += `<g transform="rotate(${f2(deg)}) translate(0 ${f2(R * rnd(0.02, 0.1))})">` +
        `<path d="${d}" fill="url(#${gi})" filter="url(#psh${id})"/>` +
        creases +
        `<path d="${rim}" fill="none" stroke="${p.rim}" stroke-width="${f2(Math.max(0.8, R * 0.022))}" ` +
        `stroke-linecap="round" opacity="${f2(0.2 + lit * 0.45)}"/>` +
        `</g>`;
    }
  });

  // a glimpse of the golden stamen boss some doubles leave showing
  const nS = Math.floor(rnd(0, 9));
  for (let i = 0; i < nS; i++) {
    const a = rnd(0, 360), r = rnd(5, 15);
    g += `<g transform="rotate(${f2(a)})"><path d="M 0 0 L 0 ${f2(-r)}" stroke="${p.stamen}" stroke-width="1" opacity="0.8"/>` +
      `<ellipse cy="${f2(-r)}" rx="1.6" ry="2.6" fill="${p.stamen}" opacity="0.95"/></g>`;
  }
  g += `<circle r="5" fill="${mixHex(p.heart, p.deep, 0.5)}" opacity="0.7"/>`;

  return { defs, g };
};

/* A fat round peony bud, still mostly green sepals with colour showing */
const budHead = (p, rnd) => {
  const R = rnd(20, 26);
  let g = `<circle r="${f2(R)}" fill="${p.body}" stroke="${p.deep}" stroke-width="0.8"/>` +
    `<circle cx="${f2(-R * 0.3)}" cy="${f2(-R * 0.32)}" r="${f2(R * 0.5)}" fill="${p.rim}" opacity="0.35"/>` +
    `<path d="M ${f2(-R * 0.1)} ${f2(-R)} Q ${f2(R * 0.3)} 0 ${f2(-R * 0.1)} ${f2(R)}" ` +
    `stroke="${p.deep}" stroke-width="1" fill="none" opacity="0.4"/>`;
  // the broad green sepals cupping the bottom of the bud
  [-130, -175, 140, 178].forEach((a, i) => {
    const L = R * (i < 2 ? 1.5 : 1.2);
    g += `<path transform="rotate(${a})" d="M 0 0 C ${f2(-R * 0.6)} ${f2(-L * 0.4)}, ${f2(-R * 0.45)} ${f2(-L * 0.85)}, 0 ${f2(-L)} ` +
      `C ${f2(R * 0.45)} ${f2(-L * 0.85)}, ${f2(R * 0.6)} ${f2(-L * 0.4)}, 0 0 Z" ` +
      `fill="#4a7a3c" stroke="#24401c" stroke-width="0.7"/>`;
  });
  return g;
};

/* One lance-shaped leaflet */
const leaflet = (L, W) => {
  const n = 22, right = [], left = [];
  for (let i = 0; i <= n; i++) {
    const u = i / n;
    const hw = W * Math.pow(Math.sin(Math.PI * Math.pow(u, 0.62)), 0.8) * (1 - 0.3 * u);
    right.push([hw, -u * L]);
    left.unshift([-hw, -u * L]);
  }
  return smoothClosed([[0, 2], ...right, ...left]);
};

/* A biternate leaf: three leaflets on a reddish stalk */
const leafSpray = (id, rnd, S) => {
  let g = `<path d="M 0 ${f2(18 * S)} L 0 ${f2(-14 * S)}" stroke="${LEAF.stalk}" stroke-width="${f2(2 * S)}"/>`;
  [{ a: -48, s: 0.84 }, { a: 48, s: 0.84 }, { a: 0, s: 1 }].forEach((q) => {
    const L = 52 * S * q.s * rnd(0.88, 1.12);
    const W = L * rnd(0.26, 0.34);
    g += `<g transform="translate(0 ${f2(-12 * S)}) rotate(${f2(q.a + rnd(-10, 10))})">` +
      `<path d="${leaflet(L, W)}" fill="url(#pl${id})" stroke="${LEAF.edge}" stroke-width="${f2(0.9 * S)}" stroke-linejoin="round"/>` +
      `<path d="M 0 0 L 0 ${f2(-L * 0.9)}" stroke="${LEAF.rib}" stroke-width="${f2(1 * S)}" opacity="0.55"/>` +
      `<path d="M ${f2(-W * 0.45)} ${f2(-L * 0.28)} Q ${f2(-W * 0.4)} ${f2(-L * 0.6)} ${f2(-W * 0.12)} ${f2(-L * 0.8)}" ` +
      `stroke="#d8f0cc" stroke-width="${f2(1.8 * S)}" fill="none" opacity="0.14" stroke-linecap="round"/>` +
      `</g>`;
  });
  return g;
};

/* A bloom on its stem, leaves below — the whole plant as it is usually cut */
const buildStem = (seed, palIdx) => {
  const rnd = makeRng(seed);
  const p = PALETTES[palIdx];
  const id = `s${seed}`;
  const base = 116;
  const h = rnd(96, 130);
  const lean = rnd(-22, 22);
  const topY = base - h;
  const { defs, g } = bloom(p, id, rnd);

  let body = `<path d="M 0 ${f2(base)} C ${f2(lean * 0.3)} ${f2(base - h * 0.55)}, ` +
    `${f2(lean * 0.85)} ${f2(base - h * 0.86)}, ${f2(lean)} ${f2(topY)}" ` +
    `stroke="url(#pst${id})" stroke-width="5" fill="none" stroke-linecap="round"/>`;
  for (let i = 0; i < 2; i++) {
    const t = 0.2 + i * 0.3;
    body += `<g transform="translate(${f2(lean * t)} ${f2(base - h * t)}) rotate(${f2((i % 2 ? 1 : -1) * rnd(55, 95))}) ` +
      `scale(${f2(rnd(0.75, 1))})">${leafSpray(id, rnd, 1)}</g>`;
  }
  body += `<g transform="translate(${f2(lean)} ${f2(topY)}) scale(${f2(rnd(0.78, 0.95))})">${g}</g>`;

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-125 -125 250 250" width="250" height="250">` +
    `<defs>${DEFS(p, id)}${defs}</defs>${body}</svg>`;
  return svgUrl(svg);
};

/* Just the bloom — the big, heavy heads a peony scene is built out of */
const buildBloom = (seed, palIdx) => {
  const rnd = makeRng(seed);
  const p = PALETTES[palIdx];
  const id = `b${seed}`;
  const { defs, g } = bloom(p, id, rnd);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-120 -120 240 240" width="240" height="240">` +
    `<defs>${DEFS(p, id)}${defs}</defs>${g}</svg>`;
  return svgUrl(svg);
};

/* A bud on a short stem, for the gaps between the big heads */
const buildBud = (seed, palIdx) => {
  const rnd = makeRng(seed);
  const p = PALETTES[palIdx];
  const id = `u${seed}`;
  const body = `<path d="M 0 70 Q ${f2(rnd(-8, 8))} 20 0 -6" stroke="url(#pst${id})" stroke-width="4" fill="none" stroke-linecap="round"/>` +
    `<g transform="translate(${f2(rnd(-30, 30))} ${f2(rnd(24, 48))}) rotate(${f2(rnd(-80, 80))}) scale(0.7)">${leafSpray(id, rnd, 1)}</g>` +
    `<g filter="url(#psh${id})">${budHead(p, rnd)}</g>`;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-75 -75 150 150" width="150" height="150">` +
    `<defs>${DEFS(p, id)}</defs>${body}</svg>`;
  return svgUrl(svg);
};

/* Leaves only — the dark foliage a peony bush sits in */
const buildLeaves = (seed) => {
  const rnd = makeRng(seed);
  const id = `l${seed}`;
  let body = '';
  for (let i = 0; i < 7; i++) {
    body += `<g transform="translate(${f2(rnd(-76, 76))} ${f2(rnd(-40, 76))}) rotate(${f2(rnd(0, 360))}) ` +
      `scale(${f2(rnd(0.75, 1.2))})">${leafSpray(id, rnd, 1)}</g>`;
  }
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-115 -115 230 230" width="230" height="230">` +
    `<defs>${DEFS(PALETTES[0], id)}</defs>${body}</svg>`;
  return svgUrl(svg);
};

/* ── Built once; the modal scene and the garden preview share these ── */
export const PEONY_URLS = Array.from({ length: 8 }, (_, i) => buildBloom(11200 + i * 59, i % PALETTES.length));
export const PEONY_STEM_URLS = Array.from({ length: 6 }, (_, i) => buildStem(12000 + i * 47, i % PALETTES.length));
export const PEONY_BUD_URLS = Array.from({ length: 4 }, (_, i) => buildBud(12700 + i * 31, i % PALETTES.length));
export const PEONY_LEAF_URLS = Array.from({ length: 4 }, (_, i) => buildLeaves(13200 + i * 29));
