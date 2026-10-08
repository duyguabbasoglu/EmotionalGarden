import { makeRng, f2, svgUrl, smoothClosed, shadow } from './svgArt';

/*
 * April lale — the tulip.
 *
 * Reference structure: six tepals in two whorls of three, the outer three
 * slightly narrower and set between the inner ones, closing into a goblet
 * that is widest just below the middle. The Istanbul tulip of the Ottoman
 * garden is the almond-shaped one — tepals drawn out to fine points — so the
 * silhouette here narrows to tips rather than rounding off like a Dutch
 * bedding tulip. The stem is thick, smooth and distinctly upright, with two
 * or three broad glaucous strap leaves that sheathe it near the base and arch
 * out and down.
 *
 * Upright is the whole identity: everything else in this garden leans, nods
 * or sprawls, so the tulip is drawn standing to attention.
 */

const PALETTES = [
  // Ottoman red
  { deep: '#6b0516', mid: '#a80d23', body: '#cf2f3f', lit: '#e8594f', edge: '#f2a07c', base: '#1d1c08' },
  // Soft apricot-rose
  { deep: '#a33c42', mid: '#d9635c', body: '#ee8a78', lit: '#f7b193', edge: '#fde0c4', base: '#4a3410' },
  // Deep violet-purple
  { deep: '#2c0a4a', mid: '#4f1b7d', body: '#6f31a3', lit: '#9358c6', edge: '#c9a4e0', base: '#1c1030' },
  // Butter yellow with a flamed throat
  { deep: '#9a6a05', mid: '#d6a211', body: '#f3c62c', lit: '#ffe066', edge: '#fff3b8', base: '#4d3a05' },
  // White with a rose flame — the broken tulip of the old paintings
  { deep: '#b9a2a8', mid: '#eadde0', body: '#fbf6f5', lit: '#ffffff', edge: '#ffffff', base: '#5c4a2a', flame: '#d2436a' },
];

const LEAF = { dark: '#2d4a2c', mid: '#537a4a', light: '#86a878', rib: '#b2cba2', edge: '#1d3220' };

const DEFS = (p, id) =>
  // across a tepal: dark at both margins, lit along the middle, so it reads cupped
  `<linearGradient id="tp${id}" x1="0" y1="0" x2="1" y2="0">` +
  `<stop offset="0" stop-color="${p.deep}"/><stop offset="0.22" stop-color="${p.mid}"/>` +
  `<stop offset="0.5" stop-color="${p.lit}"/><stop offset="0.78" stop-color="${p.body}"/>` +
  `<stop offset="1" stop-color="${p.deep}"/></linearGradient>` +
  // the outer whorl sits behind, so it is kept a shade cooler
  `<linearGradient id="to${id}" x1="0" y1="0" x2="1" y2="0">` +
  `<stop offset="0" stop-color="${p.deep}"/><stop offset="0.5" stop-color="${p.body}"/>` +
  `<stop offset="1" stop-color="${p.deep}"/></linearGradient>` +
  // up a tepal: the dark basal blotch tulips carry inside the cup
  `<linearGradient id="tv${id}" x1="0" y1="1" x2="0" y2="0">` +
  `<stop offset="0" stop-color="${p.base}" stop-opacity="0.95"/>` +
  `<stop offset="0.2" stop-color="${p.base}" stop-opacity="0.35"/>` +
  `<stop offset="0.42" stop-color="${p.base}" stop-opacity="0"/>` +
  `<stop offset="0.86" stop-color="${p.edge}" stop-opacity="0"/>` +
  `<stop offset="1" stop-color="${p.edge}" stop-opacity="0.75"/></linearGradient>` +
  `<linearGradient id="tl${id}" x1="0" y1="1" x2="0.7" y2="0">` +
  `<stop offset="0" stop-color="${LEAF.dark}"/><stop offset="0.5" stop-color="${LEAF.mid}"/>` +
  `<stop offset="1" stop-color="${LEAF.light}"/></linearGradient>` +
  `<linearGradient id="ts${id}" x1="0" y1="0" x2="1" y2="0">` +
  `<stop offset="0" stop-color="#3a5c35"/><stop offset="0.45" stop-color="#6e9560"/>` +
  `<stop offset="1" stop-color="#36522f"/></linearGradient>` +
  shadow(`tsh${id}`, 1.28, 3.25, 0.26);

/*
 * One tepal, rising from the origin: swells out, then draws in to a fine
 * point. `bow` pushes the belly sideways so the two halves of the goblet are
 * not mirror images of one another.
 */
const tepal = (L, W, bow, tip) =>
  `M 0 0 ` +
  `C ${f2(-W * 0.78 + bow * 0.2)} ${f2(-L * 0.2)}, ${f2(-W + bow * 0.5)} ${f2(-L * 0.58)}, ${f2(-W * 0.3 + bow)} ${f2(-L * 0.9)} ` +
  `Q ${f2(bow * 1.1)} ${f2(-L * (1 + tip))}, ${f2(W * 0.3 + bow)} ${f2(-L * 0.9)} ` +
  `C ${f2(W + bow * 0.5)} ${f2(-L * 0.58)}, ${f2(W * 0.78 + bow * 0.2)} ${f2(-L * 0.2)}, 0 0 Z`;

/* The goblet itself, sitting on the origin and opening upwards */
const goblet = (p, id, rnd) => {
  const H = rnd(86, 100);
  const W = H * rnd(0.3, 0.35);
  const tip = rnd(0.07, 0.14);

  // outer whorl behind — three tepals, splayed a little wider
  const outer = [-30, 0, 30];
  let g = '';
  outer.forEach((a, i) => {
    if (i === 1) return; // the middle outer one is wholly hidden by the front
    const L = H * rnd(0.96, 1.04);
    g += `<g transform="rotate(${f2(a + rnd(-4, 4))})">` +
      `<path d="${tepal(L, W * rnd(0.86, 0.96), rnd(-5, 5), tip)}" fill="url(#to${id})" ` +
      `stroke="${p.deep}" stroke-width="0.8" stroke-linejoin="round"/></g>`;
  });

  // inner whorl in front — the three that make the shape you actually read
  [-16, 0, 16].forEach((a, i) => {
    const L = H * (i === 1 ? rnd(1, 1.06) : rnd(0.92, 1));
    const w = W * (i === 1 ? rnd(1, 1.1) : rnd(0.9, 1));
    const bow = i === 1 ? rnd(-3, 3) : (i === 0 ? -1 : 1) * rnd(2, 7);
    const d = tepal(L, w, bow, tip);
    g += `<g transform="rotate(${f2(a + rnd(-3, 3))})">` +
      `<path d="${d}" fill="url(#tp${id})" stroke="${p.deep}" stroke-width="0.7" stroke-linejoin="round"/>` +
      `<path d="${d}" fill="url(#tv${id})"/>` +
      (p.flame
        ? `<path d="M ${f2(bow * 0.2)} ${f2(-L * 0.12)} Q ${f2(bow - w * 0.3)} ${f2(-L * 0.5)} ${f2(bow * 0.9)} ${f2(-L * 0.88)}" ` +
          `stroke="${p.flame}" stroke-width="${f2(w * 0.3)}" fill="none" opacity="0.55" stroke-linecap="round"/>` +
          `<path d="M ${f2(bow * 0.2 + w * 0.38)} ${f2(-L * 0.2)} Q ${f2(bow + w * 0.2)} ${f2(-L * 0.55)} ${f2(bow * 0.9 + w * 0.1)} ${f2(-L * 0.8)}" ` +
          `stroke="${p.flame}" stroke-width="${f2(w * 0.14)}" fill="none" opacity="0.4" stroke-linecap="round"/>`
        : '') +
      // the crease down the middle of the tepal
      `<path d="M 0 ${f2(-L * 0.06)} Q ${f2(bow * 0.6)} ${f2(-L * 0.5)} ${f2(bow)} ${f2(-L * 0.9)}" ` +
      `stroke="${p.deep}" stroke-width="0.8" fill="none" opacity="0.28"/>` +
      // the light running down the lip of the near edge
      `<path d="M ${f2(-w * 0.62)} ${f2(-L * 0.3)} Q ${f2(-w * 0.52 + bow * 0.5)} ${f2(-L * 0.62)} ${f2(-w * 0.2 + bow)} ${f2(-L * 0.86)}" ` +
      `stroke="${p.edge}" stroke-width="1.6" fill="none" opacity="0.4" stroke-linecap="round"/>` +
      `</g>`;
  });
  return g;
};

/* A broad glaucous strap leaf, folded down its length and arching away */
const strapLeaf = (id, rnd, L, W, dir) => {
  const n = 26, outerPts = [], innerPts = [];
  const curl = rnd(0.5, 1.1) * dir;
  for (let i = 0; i <= n; i++) {
    const u = i / n;
    const hw = W * Math.pow(Math.sin(Math.PI * Math.pow(u, 0.5)), 0.7) * (1 - 0.55 * u);
    // the arch: the leaf leaves the stem upright and bends out, then down
    const x = curl * L * 0.55 * u * u;
    const y = -L * Math.sin(u * 1.32) / Math.sin(1.32);
    outerPts.push([x + hw, y]);
    innerPts.unshift([x - hw, y]);
  }
  const spine = outerPts.map((pt, i) => [(pt[0] + innerPts[n - i][0]) / 2, pt[1]]);
  return `<path d="${smoothClosed([...outerPts, ...innerPts])}" fill="url(#tl${id})" ` +
    `stroke="${LEAF.edge}" stroke-width="1" stroke-linejoin="round"/>` +
    // the fold: tulip leaves are channelled, which is what catches the light
    `<path d="${spine.map((pt, i) => `${i ? 'L' : 'M'} ${f2(pt[0])} ${f2(pt[1])}`).join(' ')}" ` +
    `stroke="${LEAF.rib}" stroke-width="1.6" fill="none" opacity="0.45"/>` +
    `<path d="${spine.map((pt, i) => `${i ? 'L' : 'M'} ${f2(pt[0] - W * 0.22 * (1 - i / n))} ${f2(pt[1])}`).join(' ')}" ` +
    `stroke="#e2f0d8" stroke-width="2.2" fill="none" opacity="0.14" stroke-linecap="round"/>`;
};

/* A whole tulip: bulb-less, just stem, leaves and the goblet on top */
const buildTulip = (seed, palIdx) => {
  const rnd = makeRng(seed);
  const p = PALETTES[palIdx];
  const id = `t${seed}`;
  const base = 112;
  const h = rnd(118, 150);
  // a very slight lean only — the tulip's whole character is that it stands
  const lean = rnd(-9, 9);
  const topY = base - h;

  let body = `<path d="M 0 ${f2(base)} C ${f2(lean * 0.2)} ${f2(base - h * 0.5)}, ` +
    `${f2(lean * 0.8)} ${f2(base - h * 0.85)}, ${f2(lean)} ${f2(topY)}" ` +
    `stroke="url(#ts${id})" stroke-width="${f2(rnd(5.5, 7))}" fill="none" stroke-linecap="round"/>`;

  // two or three leaves sheathing the lower stem
  const nLeaf = Math.floor(rnd(2, 4));
  for (let i = 0; i < nLeaf; i++) {
    const dir = i % 2 ? 1 : -1;
    const y = base - rnd(2, 26);
    body += `<g transform="translate(${f2(rnd(-4, 4))} ${f2(y)}) rotate(${f2(dir * rnd(4, 16))})">` +
      `${strapLeaf(id, rnd, rnd(78, 116), rnd(15, 23), dir)}</g>`;
  }

  body += `<g transform="translate(${f2(lean)} ${f2(topY)}) rotate(${f2(rnd(-7, 7))})" filter="url(#tsh${id})">` +
    `${goblet(p, id, rnd)}</g>`;

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-120 -120 240 240" width="240" height="240">` +
    `<defs>${DEFS(p, id)}</defs>${body}</svg>`;
  return svgUrl(svg);
};

/* Just the goblet, for filling the upper half of a scene */
const buildHead = (seed, palIdx) => {
  const rnd = makeRng(seed);
  const p = PALETTES[palIdx];
  const id = `h${seed}`;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-70 -125 140 150" width="140" height="150">` +
    `<defs>${DEFS(p, id)}</defs>` +
    `<path d="M 0 22 L 0 -6" stroke="url(#ts${id})" stroke-width="6" stroke-linecap="round"/>` +
    `<g filter="url(#tsh${id})">${goblet(p, id, rnd)}</g></svg>`;
  return svgUrl(svg);
};

/* Leaves only — the glaucous ground layer a tulip bed stands in */
const buildLeaves = (seed) => {
  const rnd = makeRng(seed);
  const id = `l${seed}`;
  let body = '';
  for (let i = 0; i < 7; i++) {
    const dir = rnd() < 0.5 ? 1 : -1;
    body += `<g transform="translate(${f2(rnd(-80, 80))} ${f2(rnd(40, 100))}) rotate(${f2(rnd(-30, 30))})">` +
      `${strapLeaf(id, rnd, rnd(80, 140), rnd(14, 24), dir)}</g>`;
  }
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-115 -115 230 230" width="230" height="230">` +
    `<defs>${DEFS(PALETTES[0], id)}</defs>${body}</svg>`;
  return svgUrl(svg);
};

/* ── Built once; the modal scene and the garden preview share these ── */
export const TULIP_URLS = Array.from({ length: 10 }, (_, i) => buildTulip(9100 + i * 53, i % PALETTES.length));
export const TULIP_HEAD_URLS = Array.from({ length: 10 }, (_, i) => buildHead(9900 + i * 41, i % PALETTES.length));
export const TULIP_LEAF_URLS = Array.from({ length: 4 }, (_, i) => buildLeaves(10600 + i * 31));
