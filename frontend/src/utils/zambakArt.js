import { makeRng, f2, svgUrl, smoothClosed, litFrom, mixHex, shadow } from './svgArt';

/*
 * July zambak — the oriental lily.
 *
 * Reference structure: six tepals (three petals and three sepals, but they
 * look alike) arranged as a six-pointed star, each one long, pointed and
 * strongly recurved — the tips bend back towards the stem, which is the thing
 * that tells a lily apart from everything else at a glance. The margin is
 * wavy, there is a raised nectary furrow down the middle of each tepal, and
 * the inner half is freckled with raised crimson papillae. Six long stamens
 * arch out of the throat carrying heavy rust-orange anthers, with a single
 * longer style and a three-lobed stigma among them.
 *
 * Narrow lance-shaped leaves sit in whorls up a tall unbranched stem, and the
 * flowers are carried several to a stem, facing outward and slightly up.
 */

const PALETTES = [
  // Stargazer — deep pink with a white margin and heavy spotting
  { throat: '#f7f0d8', core: '#d6336c', body: '#e85a8a', edge: '#fbe3ec', vein: '#a51e4d', spot: '#8c0f38', anther: '#b85a1e' },
  // White oriental — Casa Blanca
  { throat: '#f6f3d4', core: '#eae4d2', body: '#fcfaf3', edge: '#ffffff', vein: '#cfc7ae', spot: '#c9b48a', anther: '#c08224' },
  // Soft blush, lightly freckled
  { throat: '#fbf2d6', core: '#eaa6b4', body: '#f8d3da', edge: '#fff6f8', vein: '#c4788c', spot: '#a8405c', anther: '#c28a2c' },
  // Golden-rayed, the yellow-banded one
  { throat: '#fbf0c6', core: '#f0c04a', body: '#fdf6e2', edge: '#ffffff', vein: '#d49a26', spot: '#9c5a1a', anther: '#a86a18' },
];

const LEAF = { dark: '#16401f', mid: '#2f6e36', light: '#4f9248', rib: '#8cc08a', edge: '#0d2a13' };

const DEFS = (p, id) =>
  // along a tepal: hot throat, pale body, luminous margin
  `<linearGradient id="zt${id}" x1="0" y1="1" x2="0" y2="0">` +
  `<stop offset="0" stop-color="${p.throat}"/><stop offset="0.16" stop-color="${p.core}"/>` +
  `<stop offset="0.52" stop-color="${p.body}"/><stop offset="0.88" stop-color="${p.edge}"/>` +
  `<stop offset="1" stop-color="${p.edge}"/></linearGradient>` +
  // across a tepal: the slight shadow where it curls away from you
  `<linearGradient id="zc${id}" x1="0" y1="0" x2="1" y2="0">` +
  `<stop offset="0" stop-color="${p.vein}" stop-opacity="0.4"/>` +
  `<stop offset="0.35" stop-color="${p.vein}" stop-opacity="0"/>` +
  `<stop offset="0.72" stop-color="#ffffff" stop-opacity="0.18"/>` +
  `<stop offset="1" stop-color="${p.vein}" stop-opacity="0.34"/></linearGradient>` +
  `<linearGradient id="zl${id}" x1="0.1" y1="1" x2="0.65" y2="0">` +
  `<stop offset="0" stop-color="${LEAF.dark}"/><stop offset="0.55" stop-color="${LEAF.mid}"/>` +
  `<stop offset="1" stop-color="${LEAF.light}"/></linearGradient>` +
  `<linearGradient id="zs${id}" x1="0" y1="1" x2="0.4" y2="0">` +
  `<stop offset="0" stop-color="#2f5e34"/><stop offset="1" stop-color="#6d9a5c"/></linearGradient>` +
  shadow(`zsh${id}`, 1.2, 3.25, 0.25);

/*
 * One tepal pointing up from the origin. `recurve` pulls the outer third of
 * the outline back in on itself, which is what reads as the tip rolling over
 * backwards; `wave` ripples the margin.
 */
const tepalPts = (L, W, recurve, wave, n = 26) => {
  const right = [], left = [];
  for (let i = 0; i <= n; i++) {
    const u = i / n;
    // widest at about 45% of the length, drawn to a fine point
    let hw = W * Math.pow(Math.sin(Math.PI * Math.pow(u, 0.62)), 0.78);
    hw *= 1 + wave * Math.sin(u * 7.5);
    // the recurve: the last third swings back, so the tip hooks away
    const y = -L * u + recurve * L * Math.pow(Math.max(0, u - 0.52) / 0.48, 2.1);
    const x = recurve * W * 0.5 * Math.pow(Math.max(0, u - 0.6) / 0.4, 2);
    right.push([x + hw, y]);
    left.unshift([x - hw, y]);
  }
  return [...right, ...left];
};

/* The freckles: raised crimson papillae over the inner half of a tepal */
const spots = (p, rnd, L, W, dense) => {
  let g = '';
  const n = dense ? Math.floor(rnd(16, 26)) : Math.floor(rnd(5, 10));
  for (let i = 0; i < n; i++) {
    const u = rnd(0.12, 0.62);
    const hw = W * Math.pow(Math.sin(Math.PI * Math.pow(u, 0.62)), 0.78);
    const x = rnd(-hw * 0.72, hw * 0.72);
    const y = -L * u;
    const r = (1.9 - u * 1.1) * rnd(0.7, 1.3);
    g += `<ellipse cx="${f2(x)}" cy="${f2(y)}" rx="${f2(r)}" ry="${f2(r * 1.35)}" fill="${p.spot}" opacity="${f2(rnd(0.6, 0.92))}"/>` +
      `<ellipse cx="${f2(x - r * 0.25)}" cy="${f2(y - r * 0.4)}" rx="${f2(r * 0.3)}" ry="${f2(r * 0.4)}" fill="#ffffff" opacity="0.28"/>`;
  }
  return g;
};

/* The stamens and style arching out of the throat */
const stamens = (p, rnd, R) => {
  let g = '';
  for (let i = 0; i < 6; i++) {
    const a = (i * 360) / 6 + rnd(-12, 12);
    const len = R * rnd(0.52, 0.68);
    const bow = rnd(-7, 7);
    g += `<g transform="rotate(${f2(a)})">` +
      `<path d="M 0 0 Q ${f2(bow)} ${f2(-len * 0.55)} ${f2(bow * 1.6)} ${f2(-len)}" ` +
      `stroke="#f3eccc" stroke-width="1.5" fill="none" stroke-linecap="round"/>` +
      `<path d="M 0 0 Q ${f2(bow)} ${f2(-len * 0.55)} ${f2(bow * 1.6)} ${f2(-len)}" ` +
      `stroke="#b9ad7e" stroke-width="0.5" fill="none" opacity="0.5"/>` +
      // the heavy oblong anther, hung at an angle
      `<g transform="translate(${f2(bow * 1.6)} ${f2(-len)}) rotate(${f2(rnd(-55, 55))})">` +
      `<rect x="-2.3" y="-6" width="4.6" height="12" rx="2.2" fill="${p.anther}"/>` +
      `<rect x="-2.3" y="-6" width="2" height="12" rx="1" fill="#e8a24c" opacity="0.55"/>` +
      `<rect x="-2.3" y="-6" width="4.6" height="12" rx="2.2" fill="none" stroke="#7a3a0e" stroke-width="0.4"/>` +
      `</g></g>`;
  }
  // the style: longer, paler, with its three-lobed stigma
  const sl = R * rnd(0.7, 0.82), sb = rnd(-5, 5);
  g += `<path d="M 0 0 Q ${f2(sb)} ${f2(-sl * 0.55)} ${f2(sb * 1.5)} ${f2(-sl)}" ` +
    `stroke="#eef0d2" stroke-width="1.9" fill="none" stroke-linecap="round"/>` +
    `<circle cx="${f2(sb * 1.5)}" cy="${f2(-sl)}" r="2.8" fill="#c7d08a"/>` +
    `<circle cx="${f2(sb * 1.5)}" cy="${f2(-sl)}" r="1.4" fill="#8fa055" opacity="0.8"/>`;
  return g;
};

/* A whole lily flower at the origin, face-on */
const bloom = (p, id, rnd) => {
  const R = rnd(92, 108);
  const turn = rnd(0, 60);
  const dense = p.spot !== '#c9b48a';
  let g = '';

  for (let i = 0; i < 6; i++) {
    const deg = turn + (i * 360) / 6 + rnd(-6, 6);
    // the three sepals of the outer whorl are a touch narrower
    const outer = i % 2 === 0;
    const L = R * rnd(0.94, 1.06);
    const W = L * (outer ? rnd(0.2, 0.24) : rnd(0.24, 0.29));
    const recurve = rnd(0.16, 0.3);
    const wave = rnd(0.03, 0.07);
    const lit = litFrom(deg);
    const pts = tepalPts(L, W, recurve, wave);

    g += `<g transform="rotate(${f2(deg)})">` +
      `<path d="${smoothClosed(pts)}" fill="url(#zt${id})" stroke="${p.vein}" stroke-width="0.6" ` +
      `stroke-opacity="0.45" stroke-linejoin="round" filter="url(#zsh${id})"/>` +
      `<path d="${smoothClosed(pts)}" fill="url(#zc${id})"/>` +
      // the nectary furrow running up the middle
      `<path d="M 0 ${f2(-L * 0.05)} Q ${f2(W * 0.08)} ${f2(-L * 0.45)} 0 ${f2(-L * 0.84)}" ` +
      `stroke="${p.vein}" stroke-width="${f2(W * 0.12)}" fill="none" opacity="0.3"/>` +
      `<path d="M ${f2(-W * 0.14)} ${f2(-L * 0.1)} Q ${f2(-W * 0.06)} ${f2(-L * 0.45)} ${f2(-W * 0.06)} ${f2(-L * 0.8)}" ` +
      `stroke="#ffffff" stroke-width="${f2(W * 0.14)}" fill="none" opacity="0.28"/>` +
      spots(p, rnd, L, W, dense) +
      // a faint green flush where the tepal leaves the throat
      `<ellipse cy="${f2(-L * 0.06)}" rx="${f2(W * 0.5)}" ry="${f2(L * 0.08)}" fill="#b9c466" opacity="0.3"/>` +
      `<g opacity="${f2(0.1 + lit * 0.14)}"><path d="${smoothClosed(pts)}" fill="#ffffff"/></g>` +
      `</g>`;
  }

  g += `<circle r="${f2(R * 0.1)}" fill="${mixHex(p.core, p.throat, 0.5)}"/>`;
  g += stamens(p, rnd, R);
  return g;
};

/* A slim pointed bud, green with the colour just breaking at the tip */
const budHead = (p, rnd) => {
  const L = rnd(44, 60), W = L * rnd(0.17, 0.22);
  return `<path d="M 0 0 C ${f2(-W)} ${f2(-L * 0.25)}, ${f2(-W * 1.1)} ${f2(-L * 0.68)}, 0 ${f2(-L)} ` +
    `C ${f2(W * 1.1)} ${f2(-L * 0.68)}, ${f2(W)} ${f2(-L * 0.25)}, 0 0 Z" ` +
    `fill="#6f9a52" stroke="#2f5420" stroke-width="0.8"/>` +
    `<path d="M 0 ${f2(-L * 0.42)} C ${f2(-W * 0.75)} ${f2(-L * 0.62)}, ${f2(-W * 0.8)} ${f2(-L * 0.8)}, 0 ${f2(-L)} ` +
    `C ${f2(W * 0.8)} ${f2(-L * 0.8)}, ${f2(W * 0.75)} ${f2(-L * 0.62)}, 0 ${f2(-L * 0.42)} Z" ` +
    `fill="${p.body}" opacity="0.75"/>` +
    [-0.45, 0, 0.45].map((k) =>
      `<path d="M ${f2(k * W * 0.7)} ${f2(-L * 0.08)} Q ${f2(k * W)} ${f2(-L * 0.5)} ${f2(k * W * 0.2)} ${f2(-L * 0.94)}" ` +
      `stroke="#2f5420" stroke-width="0.7" fill="none" opacity="0.5"/>`).join('') +
    `<path d="M ${f2(-W * 0.5)} ${f2(-L * 0.3)} Q ${f2(-W * 0.6)} ${f2(-L * 0.6)} ${f2(-W * 0.2)} ${f2(-L * 0.85)}" ` +
    `stroke="#d4eec0" stroke-width="1.6" fill="none" opacity="0.3" stroke-linecap="round"/>`;
};

/* A narrow lance-shaped leaf with the lily's parallel veining */
const leaf = (id, L, W, curl) => {
  const n = 22, right = [], left = [];
  for (let i = 0; i <= n; i++) {
    const u = i / n;
    const hw = W * Math.pow(Math.sin(Math.PI * Math.pow(u, 0.5)), 0.72) * (1 - 0.35 * u);
    const x = curl * L * 0.3 * u * u;
    right.push([x + hw, -u * L]);
    left.unshift([x - hw, -u * L]);
  }
  let veins = '';
  for (let v = -1; v <= 1; v++) {
    veins += `<path d="M ${f2(v * W * 0.25)} ${f2(-L * 0.06)} Q ${f2(v * W * 0.4 + curl * L * 0.1)} ${f2(-L * 0.5)} ` +
      `${f2(v * W * 0.1 + curl * L * 0.26)} ${f2(-L * 0.9)}" stroke="${LEAF.rib}" stroke-width="0.7" fill="none" opacity="0.4"/>`;
  }
  return `<path d="${smoothClosed([[0, 2], ...right, ...left])}" fill="url(#zl${id})" ` +
    `stroke="${LEAF.edge}" stroke-width="0.8" stroke-linejoin="round"/>${veins}` +
    `<path d="M ${f2(-W * 0.4)} ${f2(-L * 0.25)} Q ${f2(-W * 0.3)} ${f2(-L * 0.58)} ${f2(curl * L * 0.2)} ${f2(-L * 0.8)}" ` +
    `stroke="#dcf2d0" stroke-width="1.8" fill="none" opacity="0.14" stroke-linecap="round"/>`;
};

/* A whorl of leaves around a length of stem */
const whorl = (id, rnd, y, n, S) => {
  let g = '';
  for (let i = 0; i < n; i++) {
    const a = -150 + (i / Math.max(1, n - 1)) * 300 + rnd(-14, 14);
    const dir = a < 0 ? -1 : 1;
    g += `<g transform="translate(0 ${f2(y)}) rotate(${f2(a)})">` +
      `${leaf(id, rnd(42, 68) * S, rnd(7, 11) * S, dir * rnd(0.2, 0.7))}</g>`;
  }
  return g;
};

/* A tall stem with two or three flowers and a bud at the top */
const buildStem = (seed, palIdx) => {
  const rnd = makeRng(seed);
  const p = PALETTES[palIdx];
  const id = `s${seed}`;
  const base = 128;
  const h = rnd(150, 196);
  const lean = rnd(-18, 18);
  const topY = base - h;

  let stem = `<path d="M 0 ${f2(base)} C ${f2(lean * 0.25)} ${f2(base - h * 0.55)}, ` +
    `${f2(lean * 0.8)} ${f2(base - h * 0.85)}, ${f2(lean)} ${f2(topY)}" ` +
    `stroke="url(#zs${id})" stroke-width="5" fill="none" stroke-linecap="round"/>`;
  let leaves = whorl(id, rnd, base - h * 0.2, 5, 1) + whorl(id, rnd, base - h * 0.45, 4, 0.88) +
    whorl(id, rnd, base - h * 0.66, 4, 0.72);
  let heads = '';

  // two or three open flowers on short pedicels near the top
  const n = Math.floor(rnd(2, 4));
  for (let i = 0; i < n; i++) {
    const a = -70 + (i / Math.max(1, n - 1)) * 140 + rnd(-16, 16);
    const r = rnd(34, 58);
    const fx = lean + Math.sin((a * Math.PI) / 180) * r;
    const fy = topY + 14 - Math.cos((a * Math.PI) / 180) * r * 0.5;
    stem += `<path d="M ${f2(lean)} ${f2(topY + 18)} Q ${f2((lean + fx) / 2)} ${f2((topY + fy) / 2)} ${f2(fx)} ${f2(fy)}" ` +
      `stroke="url(#zs${id})" stroke-width="3" fill="none" stroke-linecap="round"/>`;
    heads += `<g transform="translate(${f2(fx)} ${f2(fy)}) scale(${f2(rnd(0.52, 0.68))} ${f2(rnd(0.42, 0.62))}) ` +
      `rotate(${f2(rnd(-20, 20))})">${bloom(p, id, rnd)}</g>`;
  }
  // a bud still to come, which is what makes a lily stem read as "tall"
  heads += `<g transform="translate(${f2(lean + rnd(-10, 10))} ${f2(topY + 8)}) rotate(${f2(rnd(-25, 25))}) scale(0.8)">` +
    `${budHead(p, rnd)}</g>`;

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-140 -140 280 280" width="280" height="280">` +
    `<defs>${DEFS(p, id)}</defs>${leaves}${stem}${heads}</svg>`;
  return svgUrl(svg);
};

/* One flower on its own, big — the hero sprite of a lily scene */
const buildBloom = (seed, palIdx) => {
  const rnd = makeRng(seed);
  const p = PALETTES[palIdx];
  const id = `b${seed}`;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-125 -125 250 250" width="250" height="250">` +
    `<defs>${DEFS(p, id)}</defs>${bloom(p, id, rnd)}</svg>`;
  return svgUrl(svg);
};

/* A bud on a short stem with a whorl of leaves */
const buildBud = (seed, palIdx) => {
  const rnd = makeRng(seed);
  const p = PALETTES[palIdx];
  const id = `u${seed}`;
  const body = `<path d="M 0 90 Q ${f2(rnd(-10, 10))} 30 0 -4" stroke="url(#zs${id})" stroke-width="4" fill="none" stroke-linecap="round"/>` +
    whorl(id, rnd, 46, 4, 0.9) +
    `<g filter="url(#zsh${id})" transform="rotate(${f2(rnd(-18, 18))})">${budHead(p, rnd)}</g>`;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-80 -80 160 160" width="160" height="160">` +
    `<defs>${DEFS(p, id)}</defs>${body}</svg>`;
  return svgUrl(svg);
};

/* Leaves only — the green a lily bed stands in */
const buildLeaves = (seed) => {
  const rnd = makeRng(seed);
  const id = `l${seed}`;
  let body = '';
  for (let i = 0; i < 4; i++) {
    body += `<g transform="translate(${f2(rnd(-70, 70))} ${f2(rnd(-10, 80))}) rotate(${f2(rnd(-40, 40))})">` +
      `${whorl(id, rnd, 0, 5, rnd(0.9, 1.3))}</g>`;
  }
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-115 -115 230 230" width="230" height="230">` +
    `<defs>${DEFS(PALETTES[0], id)}</defs>${body}</svg>`;
  return svgUrl(svg);
};

/* ── Built once; the modal scene and the garden preview share these ── */
export const LILY_URLS = Array.from({ length: 8 }, (_, i) => buildBloom(14100 + i * 61, i % PALETTES.length));
export const LILY_STEM_URLS = Array.from({ length: 6 }, (_, i) => buildStem(14900 + i * 47, i % PALETTES.length));
export const LILY_BUD_URLS = Array.from({ length: 4 }, (_, i) => buildBud(15500 + i * 31, i % PALETTES.length));
export const LILY_LEAF_URLS = Array.from({ length: 4 }, (_, i) => buildLeaves(16000 + i * 29));
