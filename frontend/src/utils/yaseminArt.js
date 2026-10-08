import { makeRng, f2, svgUrl, smoothClosed, shadow } from './svgArt';

/*
 * March yasemin — Jasminum officinale, the common white jasmine.
 *
 * Reference structure: a salverform flower — a long slender corolla tube that
 * opens abruptly into five narrow, pointed lobes lying almost flat, like a
 * small white star. Buds are long pink-flushed tubes that only blush on the
 * outside, so an open flower shows a faint rose wash where the lobes were
 * folded. Flowers come in loose few-flowered cymes at the end of thin twining
 * shoots; leaves are pinnate — two or three pairs of small pointed leaflets
 * plus a longer terminal one — and dark enough to throw the white into relief.
 *
 * The whole plant is airy. Nothing here should read as a solid mass: the
 * drawing stays open, with visible stem between the stars.
 */

const WHITE = {
  edge: '#ffffff', face: '#fdfbf4', shade: '#ead9dd', deep: '#c9b4bc',
  blush: '#f0c3cb', throat: '#f7f3cf', eye: '#d8c86a',
};
const GREEN = { dark: '#153a26', mid: '#2f6b45', light: '#4d9162', rib: '#86bb98', edge: '#0c2317' };

const DEFS = (id) =>
  // the lobes: lit along the midrib, cooling to a grey-rose at the margin
  `<linearGradient id="jl${id}" x1="0.5" y1="1" x2="0.5" y2="0">` +
  `<stop offset="0" stop-color="${WHITE.shade}"/><stop offset="0.3" stop-color="${WHITE.face}"/>` +
  `<stop offset="0.8" stop-color="${WHITE.edge}"/><stop offset="1" stop-color="${WHITE.face}"/></linearGradient>` +
  `<linearGradient id="jt${id}" x1="0" y1="0" x2="1" y2="0">` +
  `<stop offset="0" stop-color="${WHITE.deep}"/><stop offset="0.45" stop-color="${WHITE.face}"/>` +
  `<stop offset="1" stop-color="${WHITE.shade}"/></linearGradient>` +
  // bud: green at the base running up into the rose flush at the tip
  `<linearGradient id="jb${id}" x1="0" y1="1" x2="0.3" y2="0">` +
  `<stop offset="0" stop-color="#4d8a5c"/><stop offset="0.4" stop-color="#d8dcc8"/>` +
  `<stop offset="0.75" stop-color="${WHITE.blush}"/><stop offset="1" stop-color="#e8a3b2"/></linearGradient>` +
  `<linearGradient id="jg${id}" x1="0.1" y1="1" x2="0.65" y2="0">` +
  `<stop offset="0" stop-color="${GREEN.dark}"/><stop offset="0.55" stop-color="${GREEN.mid}"/>` +
  `<stop offset="1" stop-color="${GREEN.light}"/></linearGradient>` +
  `<linearGradient id="js${id}" x1="0" y1="1" x2="0.5" y2="0">` +
  `<stop offset="0" stop-color="#2e5e3c"/><stop offset="1" stop-color="#6e9d62"/></linearGradient>` +
  shadow(`jsh${id}`, 0.88, 2.5, 0.21);

/* One lobe of the star: narrow, widest past the middle, drawn to a point */
const lobe = (L, W) =>
  `M 0 0 ` +
  `C ${f2(-W * 0.55)} ${f2(-L * 0.12)}, ${f2(-W)} ${f2(-L * 0.52)}, ${f2(-W * 0.3)} ${f2(-L * 0.9)} ` +
  `Q 0 ${f2(-L * 1.04)}, ${f2(W * 0.3)} ${f2(-L * 0.9)} ` +
  `C ${f2(W)} ${f2(-L * 0.52)}, ${f2(W * 0.55)} ${f2(-L * 0.12)}, 0 0 Z`;

/*
 * An open flower at the origin, face-on. `tilt` squashes one axis so a star
 * can be seen at an angle, which is what stops a spray looking like stickers.
 */
const star = (id, rnd, R, blush) => {
  const n = 5;
  const turn = rnd(0, 72);
  let g = '';
  for (let i = 0; i < n; i++) {
    const a = turn + (i * 360) / n + rnd(-7, 7);
    const L = R * rnd(0.9, 1.08);
    const W = L * rnd(0.3, 0.38);
    g += `<g transform="rotate(${f2(a)})">` +
      `<path d="${lobe(L, W)}" fill="url(#jl${id})" stroke="${WHITE.deep}" stroke-width="0.4" stroke-opacity="0.55" stroke-linejoin="round"/>` +
      // the rose wash left over from where the lobe was rolled in the bud
      (blush ? `<path d="${lobe(L, W)}" fill="${WHITE.blush}" opacity="${f2(rnd(0.12, 0.26))}"/>` : '') +
      `<path d="M 0 ${f2(-L * 0.1)} L 0 ${f2(-L * 0.86)}" stroke="${WHITE.deep}" stroke-width="0.6" opacity="0.4"/>` +
      `</g>`;
  }
  // the small greenish-yellow mouth of the tube
  g += `<circle r="${f2(R * 0.17)}" fill="${WHITE.throat}"/>` +
    `<circle r="${f2(R * 0.075)}" fill="${WHITE.eye}" opacity="0.85"/>`;
  return g;
};

/* A bud or a flower seen from the side: the long tube with its calyx teeth */
const tube = (id, rnd, L, open) => {
  const W = L * rnd(0.12, 0.16);
  let g = `<path d="M ${f2(-W)} 0 C ${f2(-W * 0.9)} ${f2(-L * 0.5)}, ${f2(-W * 1.5)} ${f2(-L * 0.82)}, ${f2(-W * 1.7)} ${f2(-L)} ` +
    `L ${f2(W * 1.7)} ${f2(-L)} C ${f2(W * 1.5)} ${f2(-L * 0.82)}, ${f2(W * 0.9)} ${f2(-L * 0.5)}, ${f2(W)} 0 Z" ` +
    `fill="url(#j${open ? 't' : 'b'}${id})" stroke="${open ? WHITE.deep : '#c98f9e'}" stroke-width="0.4" stroke-opacity="0.5"/>`;
  // the five slender calyx teeth that clasp the base of the tube
  for (let k = -2; k <= 2; k++) {
    g += `<path d="M 0 2 Q ${f2(k * W * 1.3)} ${f2(-L * 0.16)} ${f2(k * W * 2.1)} ${f2(-L * 0.3)}" ` +
      `stroke="#4d8a5c" stroke-width="1" fill="none" stroke-linecap="round" opacity="0.9"/>`;
  }
  if (!open) {
    // the twist of the furled lobes, visible as a spiral crease near the tip
    g += `<path d="M ${f2(-W * 1.3)} ${f2(-L * 0.9)} Q 0 ${f2(-L * 0.78)} ${f2(W * 1.4)} ${f2(-L * 0.96)}" ` +
      `stroke="#d89aa8" stroke-width="0.7" fill="none" opacity="0.7"/>` +
      `<path d="M ${f2(-W * 1.6)} ${f2(-L)} Q 0 ${f2(-L * 1.1)} ${f2(W * 1.6)} ${f2(-L)}" ` +
      `fill="#f3cdd4" stroke="none"/>`;
  }
  return g;
};

/* One pinnate leaf: two pairs of leaflets plus a longer terminal one */
const leaflet = (L, W) => {
  const n = 20, right = [], left = [];
  for (let i = 0; i <= n; i++) {
    const u = i / n;
    const hw = W * Math.pow(Math.sin(Math.PI * Math.pow(u, 0.72)), 0.85) * (1 - 0.22 * u);
    right.push([hw, -u * L]);
    left.unshift([-hw, -u * L]);
  }
  return smoothClosed([[0, 1], ...right, ...left]);
};

const pinnateLeaf = (id, rnd, S) => {
  const rachis = 34 * S;
  let g = `<path d="M 0 ${f2(rachis * 0.45)} Q ${f2(rnd(-3, 3) * S)} 0 0 ${f2(-rachis * 0.75)}" ` +
    `stroke="${GREEN.mid}" stroke-width="${f2(1.6 * S)}" fill="none"/>`;
  const set = [
    { y: rachis * 0.3, a: -58, s: 0.72 }, { y: rachis * 0.3, a: 58, s: 0.72 },
    { y: -rachis * 0.14, a: -46, s: 0.86 }, { y: -rachis * 0.14, a: 46, s: 0.86 },
    { y: -rachis * 0.72, a: 0, s: 1 },
  ];
  set.forEach((q) => {
    const L = 30 * S * q.s * rnd(0.9, 1.1);
    const W = L * rnd(0.3, 0.38);
    g += `<g transform="translate(0 ${f2(q.y)}) rotate(${f2(q.a + rnd(-9, 9))})">` +
      `<path d="${leaflet(L, W)}" fill="url(#jg${id})" stroke="${GREEN.edge}" stroke-width="${f2(0.7 * S)}" stroke-linejoin="round"/>` +
      `<path d="M 0 0 L 0 ${f2(-L * 0.9)}" stroke="${GREEN.rib}" stroke-width="${f2(0.7 * S)}" opacity="0.5"/>` +
      `<path d="M ${f2(-W * 0.45)} ${f2(-L * 0.3)} Q ${f2(-W * 0.4)} ${f2(-L * 0.6)} ${f2(-W * 0.1)} ${f2(-L * 0.78)}" ` +
      `stroke="#d8f0e0" stroke-width="${f2(1.3 * S)}" fill="none" opacity="0.14" stroke-linecap="round"/>` +
      `</g>`;
  });
  return g;
};

/*
 * A spray: a thin shoot carrying a loose cyme — a few open stars, a couple of
 * side-on flowers and some pink buds — with pinnate leaves at the nodes.
 */
const buildSpray = (seed) => {
  const rnd = makeRng(seed);
  const id = `s${seed}`;
  const base = 108;
  const lean = rnd(-30, 30);
  const topY = base - rnd(120, 160);

  let stems = `<path d="M ${f2(-lean * 0.3)} ${f2(base)} C ${f2(lean * 0.2)} ${f2(base - 60)}, ` +
    `${f2(lean * 0.8)} ${f2(topY + 50)}, ${f2(lean)} ${f2(topY)}" ` +
    `stroke="url(#js${id})" stroke-width="3.2" fill="none" stroke-linecap="round"/>`;
  let leaves = '', flowers = '';

  // leaves at two or three nodes up the shoot
  for (let i = 0; i < 3; i++) {
    const t = 0.18 + i * 0.26;
    const nx = -lean * 0.3 + lean * t * 1.2, ny = base - (base - topY) * t;
    const side = i % 2 ? 1 : -1;
    leaves += `<g transform="translate(${f2(nx)} ${f2(ny)}) rotate(${f2(side * rnd(50, 86))}) scale(${f2(rnd(0.85, 1.15))})">` +
      `${pinnateLeaf(id, rnd, 1)}</g>`;
  }

  // the cyme: short pedicels radiating from the tip of the shoot
  const n = Math.floor(rnd(5, 8));
  for (let i = 0; i < n; i++) {
    const a = -120 + (i / Math.max(1, n - 1)) * 240 + rnd(-14, 14);
    const r = rnd(20, 46);
    const fx = lean + Math.sin((a * Math.PI) / 180) * r;
    const fy = topY - Math.cos((a * Math.PI) / 180) * r * 0.75;
    stems += `<path d="M ${f2(lean)} ${f2(topY)} Q ${f2((lean + fx) / 2)} ${f2((topY + fy) / 2 - 4)} ${f2(fx)} ${f2(fy)}" ` +
      `stroke="url(#js${id})" stroke-width="1.7" fill="none" stroke-linecap="round"/>`;

    const roll = rnd();
    if (roll < 0.58) {
      flowers += `<g transform="translate(${f2(fx)} ${f2(fy)}) scale(${f2(rnd(0.85, 1.15))} ${f2(rnd(0.62, 1))})" ` +
        `filter="url(#jsh${id})">${star(id, rnd, rnd(20, 27), rnd() < 0.5)}</g>`;
    } else if (roll < 0.8) {
      flowers += `<g transform="translate(${f2(fx)} ${f2(fy)}) rotate(${f2(a * 0.7)})" filter="url(#jsh${id})">` +
        `${tube(id, rnd, rnd(24, 32), true)}` +
        `<g transform="translate(0 ${f2(-rnd(24, 28))}) scale(1 0.4)">${star(id, rnd, rnd(16, 21), true)}</g></g>`;
    } else {
      flowers += `<g transform="translate(${f2(fx)} ${f2(fy)}) rotate(${f2(a * 0.8)})" filter="url(#jsh${id})">` +
        `${tube(id, rnd, rnd(22, 32), false)}</g>`;
    }
  }

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-120 -120 240 240" width="240" height="240">` +
    `<defs>${DEFS(id)}</defs>${leaves}${stems}${flowers}</svg>`;
  return svgUrl(svg);
};

/* A single star, for dusting the gaps between sprays */
const buildStar = (seed) => {
  const rnd = makeRng(seed);
  const id = `f${seed}`;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-40 -40 80 80" width="80" height="80">` +
    `<defs>${DEFS(id)}</defs><g filter="url(#jsh${id})" transform="scale(1 ${f2(rnd(0.72, 1))})">` +
    `${star(id, rnd, rnd(26, 33), rnd() < 0.5)}</g></svg>`;
  return svgUrl(svg);
};

/*
 * A length of twining shoot with leaves and no flowers — the dark green
 * tracery that a jasmine wall is actually made of.
 */
const buildVine = (seed) => {
  const rnd = makeRng(seed);
  const id = `v${seed}`;
  const a = rnd(-70, -20), b = rnd(20, 70);
  let body = `<path d="M -105 ${f2(a)} C ${f2(rnd(-50, -10))} ${f2(a + rnd(-40, 40))}, ` +
    `${f2(rnd(10, 50))} ${f2(b + rnd(-40, 40))}, 105 ${f2(b)}" ` +
    `stroke="url(#js${id})" stroke-width="3" fill="none" stroke-linecap="round"/>`;
  for (let i = 0; i < 6; i++) {
    const t = 0.08 + i * 0.17;
    const x = -105 + t * 210;
    const y = a + (b - a) * t + Math.sin(t * Math.PI) * rnd(-26, 26);
    body += `<g transform="translate(${f2(x)} ${f2(y)}) rotate(${f2((i % 2 ? 1 : -1) * rnd(40, 110))}) scale(${f2(rnd(0.8, 1.2))})">` +
      `${pinnateLeaf(id, rnd, 1)}</g>`;
  }
  // a tendril-ish curling shoot tip
  body += `<path d="M ${f2(rnd(-60, 60))} ${f2(rnd(-30, 30))} c 12 -14, 26 -6, 19 9 c -6 12, -21 7, -16 -7" ` +
    `stroke="#5e9268" stroke-width="2" fill="none" stroke-linecap="round" opacity="0.8"/>`;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-115 -115 230 230" width="230" height="230">` +
    `<defs>${DEFS(id)}</defs>${body}</svg>`;
  return svgUrl(svg);
};

/* ── Built once; the modal scene and the garden preview share these ── */
export const JAS_SPRAY_URLS = Array.from({ length: 7 }, (_, i) => buildSpray(7100 + i * 43));
export const JAS_STAR_URLS = Array.from({ length: 6 }, (_, i) => buildStar(7800 + i * 29));
export const JAS_VINE_URLS = Array.from({ length: 5 }, (_, i) => buildVine(8300 + i * 37));
