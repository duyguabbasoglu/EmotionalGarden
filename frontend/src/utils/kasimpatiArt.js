import { makeRng, f2, svgUrl, shadow } from './svgArt';

/*
 * November chrysanthemums (Kasımpatı, Chrysanthemum morifolium).
 * Reference structure: a dense double head of many narrow strap-shaped ray
 * florets in several overlapping rings — the outer ones reflex and droop,
 * the inner ones curve inward and hide the disk completely. The colour
 * usually deepens toward the centre. Leaves are the giveaway: broad, deeply
 * lobed and toothed, with a pale midrib.
 */

/*
 * Autumn first. Kasımpatı carries November, and the cold plum and violet that
 * used to lead this list both read as the same flower as the September lilac
 * at thumbnail size. Leading with amber, bronze and russet separates the two
 * months and matches what the month is actually about; one magenta is kept at
 * the end so a bed of them is not monochrome.
 */
const PALS = [
  { deep: '#7a3400', mid: '#e08a2e', light: '#ffc86a', back: '#ffe7b0' }, // amber
  { deep: '#6e1f08', mid: '#c45420', light: '#f29a5c', back: '#fac79e' }, // bronze
  { deep: '#5e1020', mid: '#a8263c', light: '#e06a74', back: '#f3a8a8' }, // russet
  { deep: '#8a5a00', mid: '#d6a81a', light: '#ffe272', back: '#fff2b8' }, // old gold
  { deep: '#6b0f3e', mid: '#c01f6e', light: '#f072aa', back: '#f8bcd6' }, // magenta
];

const DEFS =
  `<linearGradient id="mStem" x1="0" y1="1" x2="0" y2="0">` +
  `<stop offset="0" stop-color="#33501f"/><stop offset="1" stop-color="#6d9240"/></linearGradient>` +
  shadow('mSh', 1.28, 3.25, 0.28);

const petalDefs = (id, p) =>
  `<linearGradient id="${id}f" x1="0" y1="1" x2="0.15" y2="0">` +
  `<stop offset="0" stop-color="${p.deep}"/><stop offset="0.45" stop-color="${p.mid}"/>` +
  `<stop offset="1" stop-color="${p.light}"/></linearGradient>` +
  `<linearGradient id="${id}b" x1="0" y1="1" x2="0.15" y2="0">` +
  `<stop offset="0" stop-color="${p.mid}"/><stop offset="0.6" stop-color="${p.light}"/>` +
  `<stop offset="1" stop-color="${p.back}"/></linearGradient>` +
  `<linearGradient id="${id}l" x1="0" y1="1" x2="0.35" y2="0">` +
  `<stop offset="0" stop-color="#20380f"/><stop offset="0.55" stop-color="#3f6522"/>` +
  `<stop offset="1" stop-color="#78a243"/></linearGradient>`;

/*
 * One ray floret: a narrow strap that curves sideways as it rises and ends in
 * a blunt, slightly notched tip. `curl` bends it; positive curls it inward.
 */
const strapFloret = (r0, L, W, curl) => {
  const tipX = curl * L * 0.42, tipY = -(r0 + L);
  const c1 = [-W + curl * L * 0.08, -(r0 + L * 0.3)];
  const c2 = [tipX - W * 0.75, -(r0 + L * 0.8)];
  const c3 = [tipX + W * 0.75, -(r0 + L * 0.8)];
  const c4 = [W + curl * L * 0.08, -(r0 + L * 0.3)];
  return `M 0 ${f2(-r0)} C ${f2(c1[0])} ${f2(c1[1])}, ${f2(c2[0])} ${f2(c2[1])}, ${f2(tipX - W * 0.34)} ${f2(tipY)} ` +
    `Q ${f2(tipX)} ${f2(tipY - W * 0.5)} ${f2(tipX + W * 0.34)} ${f2(tipY)} ` +
    `C ${f2(c3[0])} ${f2(c3[1])}, ${f2(c4[0])} ${f2(c4[1])}, 0 ${f2(-r0)} Z`;
};

/* One chrysanthemum head in a 100-radius space */
const head = (id, p, rnd) => {
  const turn = rnd(0, 360);
  const reflexed = rnd() < 0.45;
  let g = '';
  /*
   * Floret counts are high on purpose. A chrysanthemum is a shaggy, densely
   * packed head; at lower counts the straps separate and the bloom reads as a
   * spiky star, which is the dahlia's silhouette, not this one's.
   */
  const rings = [
    { n: 30, r0: 16, L: rnd(72, 86), W: rnd(6, 8), curl: reflexed ? -0.3 : 0.08, shade: 0.22 },
    { n: 26, r0: 13, L: rnd(60, 72), W: rnd(5.6, 7.4), curl: reflexed ? -0.14 : 0.2, shade: 0.12 },
    { n: 22, r0: 10, L: rnd(48, 58), W: rnd(5, 6.8), curl: 0.3, shade: 0.04 },
    { n: 18, r0: 8, L: rnd(34, 44), W: rnd(4.6, 6), curl: 0.45, shade: 0 },
    { n: 14, r0: 5, L: rnd(22, 30), W: rnd(4, 5.4), curl: 0.6, shade: 0 },
    { n: 10, r0: 3, L: rnd(12, 18), W: rnd(3.4, 4.6), curl: 0.75, shade: 0 },
  ];
  rings.forEach((ring, ri) => {
    for (let i = 0; i < ring.n; i++) {
      const deg = turn + ri * 11 + (i * 360) / ring.n + rnd(-5, 5);
      const d = strapFloret(ring.r0, ring.L * rnd(0.86, 1.12), ring.W * rnd(0.86, 1.14),
        ring.curl + rnd(-0.08, 0.08));
      // every few florets show their paler back where they twist over
      const back = rnd() < 0.22;
      g += `<g transform="rotate(${f2(deg)})"><path d="${d}" fill="url(#${id}${back ? 'b' : 'f'})" ` +
        `stroke="${p.deep}" stroke-width="0.45" stroke-opacity="0.4"/>` +
        (ring.shade ? `<path d="${d}" fill="#2a1004" opacity="${f2(ring.shade)}"/>` : '') + `</g>`;
    }
  });
  g += `<circle r="4" fill="${p.light}" opacity="0.8"/>`;
  return g;
};

/* Broad, deeply lobed chrysanthemum leaf */
const leaf = (x, y, deg, L, W, id) => {
  const lobes = [0.22, 0.48, 0.74];
  const side = (sgn) => lobes.map((t, i) => {
    const w = W * (1 - i * 0.2);
    return ` C ${f2(sgn * w * 1.5)} ${f2(-L * (t - 0.08))}, ${f2(sgn * w * 1.45)} ${f2(-L * (t + 0.08))}, ` +
      `${f2(sgn * w * 0.45)} ${f2(-L * (t + 0.14))}`;
  }).join('');
  const d = `M 0 0${side(-1)} L 0 ${f2(-L * 1.04)} ` +
    lobes.slice().reverse().map((t, i) => {
      const w = W * (1 - (2 - i) * 0.2);
      return ` C ${f2(w * 1.45)} ${f2(-L * (t + 0.08))}, ${f2(w * 1.5)} ${f2(-L * (t - 0.08))}, ` +
        `${f2(w * 0.45)} ${f2(-L * (t - 0.14))}`;
    }).join('') + ' Z';
  return `<g transform="translate(${f2(x)} ${f2(y)}) rotate(${f2(deg)})">` +
    `<path d="${d}" fill="url(#${id}l)" stroke="#16280a" stroke-width="0.7"/>` +
    `<path d="M 0 ${f2(-L * 0.06)} L 0 ${f2(-L * 0.95)}" stroke="#9cc46a" stroke-width="0.9" opacity="0.45"/></g>`;
};

const buildHead = (palIdx, seed) => {
  const rnd = makeRng(seed);
  const p = PALS[palIdx];
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-105 -105 210 210" width="210" height="210">` +
    `<defs>${petalDefs('h', p)}${DEFS}</defs>${head('h', p, rnd)}</svg>`;
  return svgUrl(svg);
};

/* A leafy spray with two or three heads, the way mums are sold in pots */
const buildSpray = (palIdx, seed, count) => {
  const rnd = makeRng(seed);
  const p = PALS[palIdx];
  let body = '';
  for (let i = 0; i < 8; i++) {
    body += leaf(rnd(-78, 78), rnd(-30, 100), rnd(-70, 70), rnd(44, 72), rnd(13, 20), 's');
  }
  const spots = [[-46, -30], [44, -38], [2, 26], [-40, 52], [52, 40]];
  spots.slice(0, count).forEach(([sx, sy]) => {
    const x = sx + rnd(-10, 10), y = sy + rnd(-10, 10);
    body += `<path d="M ${f2(x)} ${f2(y)} C ${f2(x + rnd(-10, 10))} ${f2(y + 40)}, ${f2(x + rnd(-14, 14))} ${f2(y + 70)}, ${f2(x + rnd(-18, 18))} 110" ` +
      `stroke="url(#mStem)" stroke-width="4.5" fill="none" stroke-linecap="round"/>`;
    body += `<g transform="translate(${f2(x)} ${f2(y)}) scale(${f2(rnd(0.42, 0.6))})" filter="url(#mSh)">${head('s', p, rnd)}</g>`;
  });
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-125 -125 250 250" width="250" height="250">` +
    `<defs>${petalDefs('s', p)}${DEFS}</defs>${body}</svg>`;
  return svgUrl(svg);
};

const buildFoliage = (seed) => {
  const rnd = makeRng(seed);
  let body = '';
  for (let i = 0; i < 13; i++) {
    body += leaf(rnd(-72, 72), rnd(-50, 95), rnd(-110, 110), rnd(48, 86), rnd(14, 23), 'f');
  }
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-115 -115 230 230" width="230" height="230">` +
    `<defs>${petalDefs('f', PALS[0])}${DEFS}</defs>${body}</svg>`;
  return svgUrl(svg);
};

/* ── Built once; shared by the modal scene and the garden preview ── */
const MIX = [0, 1, 2, 3, 0, 1, 4, 2, 0, 3];
export const MUM_URLS = MIX.map((p, i) => buildHead(p, 11000 + i * 43));
export const MUM_SPRAY_URLS = MIX.map((p, i) => buildSpray(p, 11700 + i * 37, 2 + (i % 4)));
export const MUM_LEAF_URLS = Array.from({ length: 4 }, (_, i) => buildFoliage(12400 + i * 23));
