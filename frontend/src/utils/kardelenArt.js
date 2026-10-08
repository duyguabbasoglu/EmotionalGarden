import { makeRng, f2, svgUrl, shadow } from './svgArt';

/*
 * January snowdrops (Galanthus nivalis).
 * Reference structure: a leafless scape carries a small green spathe, from
 * which a slender pedicel arches over so one bell hangs nodding below —
 * three long convex outer tepals over three short inner ones, each inner one
 * marked with a green V across the notch at its tip. A green ovary sits where
 * the pedicel meets the flower. Every bulb puts up two narrow grey-green
 * strap leaves. Height is tiny (7-15 cm), so they grow in tight clumps.
 */

const DEFS =
  `<linearGradient id="kOut" x1="0" y1="0" x2="0.4" y2="1">` +
  `<stop offset="0" stop-color="#ffffff"/><stop offset="0.5" stop-color="#f6faf7"/>` +
  `<stop offset="1" stop-color="#e6efe9"/></linearGradient>` +
  `<linearGradient id="kIn" x1="0" y1="0" x2="0" y2="1">` +
  `<stop offset="0" stop-color="#fcfefc"/><stop offset="0.65" stop-color="#f1f7f2"/>` +
  `<stop offset="1" stop-color="#dfece3"/></linearGradient>` +
  `<linearGradient id="kLeaf" x1="0" y1="1" x2="0.35" y2="0">` +
  `<stop offset="0" stop-color="#43735a"/><stop offset="0.55" stop-color="#74a487"/>` +
  `<stop offset="1" stop-color="#a9cbb7"/></linearGradient>` +
  `<linearGradient id="kStem" x1="0" y1="1" x2="0" y2="0">` +
  `<stop offset="0" stop-color="#55866a"/><stop offset="1" stop-color="#93bb9f"/></linearGradient>` +
  shadow('kSh', 1.28, 3.25, 0.24);

/* One tepal hanging from the origin, widest around mid-length */
const tepal = (L, W) =>
  `M 0 0 C ${f2(-W)} ${f2(L * 0.2)}, ${f2(-W * 1.08)} ${f2(L * 0.64)}, 0 ${f2(L)} ` +
  `C ${f2(W * 1.08)} ${f2(L * 0.64)}, ${f2(W)} ${f2(L * 0.2)}, 0 0 Z`;

/* The nodding bell: ovary at the origin, tepals hanging in +y */
const bell = (rnd) => {
  const oL = rnd(42, 50), oW = rnd(11.5, 13.5);
  const iL = oL * 0.70, iW = oW * 0.74;
  let g = '';

  // one outer tepal straight behind, so the inner cup reads in front of it
  g += `<path d="${tepal(oL * 0.96, oW)}" fill="url(#kOut)" opacity="0.92"/>`;

  // the inner cup: three short tepals, each with the green V at the notch
  [-17, 0, 17].forEach((a) => {
    g += `<g transform="rotate(${a})">` +
      `<path d="${tepal(iL, iW)}" fill="url(#kIn)"/>` +
      // green V bridging the notch at the tip
      `<path d="M ${f2(-iW * 0.46)} ${f2(iL * 0.74)} Q 0 ${f2(iL * 0.56)} ${f2(iW * 0.46)} ${f2(iL * 0.74)} ` +
      `Q 0 ${f2(iL * 0.99)} ${f2(-iW * 0.46)} ${f2(iL * 0.74)} Z" fill="#86c198" opacity="0.9"/>` +
      `<path d="M 0 ${f2(iL * 0.12)} L 0 ${f2(iL * 0.56)}" stroke="#dbeae0" stroke-width="0.6" opacity="0.55"/>` +
      `</g>`;
  });

  // the two flanking outer tepals, in front
  [-41, 41].forEach((a) => {
    g += `<g transform="rotate(${a})">` +
      `<path d="${tepal(oL, oW)}" fill="url(#kOut)" stroke="#dce8e1" stroke-width="0.4"/>` +
      `<path d="M 0 ${f2(oL * 0.12)} Q ${f2(a > 0 ? 1.6 : -1.6)} ${f2(oL * 0.55)} 0 ${f2(oL * 0.9)}" ` +
      `stroke="#e8f1ea" stroke-width="0.7" fill="none" opacity="0.6"/><path d="${tepal(oL, oW)}" fill="${a > 0 ? '#7d9c8b' : '#ffffff'}" opacity="0.07"/></g>`;
  });

  // green ovary where the pedicel attaches
  g += `<rect x="${f2(-oW * 0.36)}" y="-5.5" width="${f2(oW * 0.72)}" height="10" rx="4" fill="#6b9a80"/>`;
  g += `<rect x="${f2(-oW * 0.36)}" y="-5.5" width="${f2(oW * 0.3)}" height="10" rx="4" fill="#95bfa4" opacity="0.6"/>`;
  return g;
};

/* Narrow grey-green strap leaf rising from (x, base) */
const strap = (x, base, L, W, lean, tone) =>
  `<path d="M ${f2(x)} ${f2(base)} ` +
  `C ${f2(x - W + lean * 0.25)} ${f2(base - L * 0.34)}, ${f2(x - W * 0.7 + lean)} ${f2(base - L * 0.74)}, ${f2(x + lean * 1.25)} ${f2(base - L)} ` +
  `C ${f2(x + W * 0.7 + lean)} ${f2(base - L * 0.74)}, ${f2(x + W + lean * 0.25)} ${f2(base - L * 0.34)}, ${f2(x)} ${f2(base)} Z" ` +
  `fill="url(#kLeaf)" stroke="#6f9a81" stroke-width="0.45" opacity="${f2(tone)}"/>`;

/* One flowering stalk: scape, spathe, arching pedicel and the hanging bell */
const stalk = (rnd, x, base, h, scale) => {
  const lean = rnd(-13, 13);
  const bend = rnd(9, 20) * (rnd() < 0.5 ? -1 : 1);
  const tipX = x + lean, tipY = base - h;
  const hx = tipX + bend, hy = tipY + rnd(7, 13);
  const droop = Math.max(-30, Math.min(30, bend * 1.2 + rnd(-7, 7)));

  return `<path d="M ${f2(x)} ${f2(base)} C ${f2(x + lean * 0.35)} ${f2(base - h * 0.45)}, ` +
    `${f2(tipX)} ${f2(base - h * 0.78)}, ${f2(tipX)} ${f2(tipY)}" ` +
    `stroke="url(#kStem)" stroke-width="${f2(3.1 * scale)}" fill="none" stroke-linecap="round"/>` +
    // spathe bract, then the pedicel arching over to the flower
    `<path d="M ${f2(tipX)} ${f2(tipY + 2)} Q ${f2(tipX + bend * 0.5)} ${f2(tipY - 7)} ${f2(hx)} ${f2(hy - 3)}" ` +
    `stroke="#79a689" stroke-width="${f2(2.3 * scale)}" fill="none" stroke-linecap="round"/>` +
    `<path d="M ${f2(tipX - 2)} ${f2(tipY + 1)} Q ${f2(tipX + bend * 0.75)} ${f2(tipY - 11)} ${f2(hx - bend * 0.1)} ${f2(hy - 7)} ` +
    `Q ${f2(tipX + bend * 0.5)} ${f2(tipY - 2)} ${f2(tipX - 2)} ${f2(tipY + 1)} Z" fill="#7fab8e" opacity="0.8"/>` +
    `<g transform="translate(${f2(hx)} ${f2(hy)}) rotate(${f2(droop)}) scale(${f2(scale)})" filter="url(#kSh)">${bell(rnd)}</g>`;
};

/* A clump of several bulbs, the way snowdrops actually come up */
const buildClump = (seed, count) => {
  const rnd = makeRng(seed);
  const base = 104;
  let back = '', front = '', flowers = '';

  const xs = Array.from({ length: count }, (_, i) =>
    -56 + (i + 0.5) * (112 / count) + rnd(-11, 11));

  xs.forEach((x) => {
    back += strap(x + rnd(-9, 9), base + rnd(0, 6), rnd(96, 134), rnd(9, 13), rnd(-22, 22), 0.95);
    back += strap(x + rnd(-9, 9), base + rnd(0, 6), rnd(84, 120), rnd(8, 12), rnd(-22, 22), 0.9);
  });
  xs.forEach((x) => {
    flowers += stalk(rnd, x, base, rnd(96, 140), rnd(0.88, 1.12));
  });
  xs.forEach((x) => {
    if (rnd() < 0.7) front += strap(x + rnd(-12, 12), base + rnd(2, 8), rnd(66, 98), rnd(7, 11), rnd(-18, 18), 0.98);
  });

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-120 -120 240 240" width="240" height="240">` +
    `<defs>${DEFS}</defs>${back}${flowers}${front}</svg>`;
  return svgUrl(svg);
};

/* A single bell on a short stalk, for tucking into gaps */
const buildSingle = (seed) => {
  const rnd = makeRng(seed);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-80 -80 160 160" width="160" height="160">` +
    `<defs>${DEFS}</defs>` +
    strap(rnd(-16, -6), 70, rnd(70, 96), rnd(8, 11), rnd(-16, 4), 0.95) +
    strap(rnd(6, 16), 70, rnd(64, 90), rnd(8, 11), rnd(-4, 16), 0.95) +
    stalk(rnd, 0, 70, rnd(78, 104), rnd(0.9, 1.1)) +
    `</svg>`;
  return svgUrl(svg);
};

/* Leaves only — the ground layer that keeps the floor of the scene covered */
const buildLeaves = (seed) => {
  const rnd = makeRng(seed);
  let body = '';
  for (let i = 0; i < 9; i++) {
    body += strap(rnd(-70, 70), 95 + rnd(0, 12), rnd(80, 150), rnd(8, 14), rnd(-28, 28),
      rnd(0.8, 1));
  }
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-110 -110 220 220" width="220" height="220">` +
    `<defs>${DEFS}</defs>${body}</svg>`;
  return svgUrl(svg);
};

/* ── Built once; the modal scene and the garden preview share these ── */
export const CLUMP_URLS = [3, 4, 5, 3, 4, 6].map((n, i) => buildClump(1700 + i * 53, n));
export const SINGLE_URLS = Array.from({ length: 5 }, (_, i) => buildSingle(2600 + i * 37));
export const SNOW_LEAF_URLS = Array.from({ length: 4 }, (_, i) => buildLeaves(3400 + i * 29));
