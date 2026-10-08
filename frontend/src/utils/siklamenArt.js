import { makeRng, f2, svgUrl, shadow } from './svgArt';

/*
 * November cyclamen (Siklamen, Cyclamen persicum — native to Anatolia).
 * Reference structure, and the three things that make a cyclamen readable:
 *  1. The flower nods with its nose pointing straight down, and all five
 *     petals are swept back and UP around the stalk, often twisted — the
 *     silhouette is a shuttlecock, not a cup.
 *  2. A darker magenta band rings the mouth at the nose.
 *  3. The leaves are heart-shaped with a deep basal sinus and marbled with
 *     silver-grey over dark green, held low in a flat rosette.
 * Stems are slender, upright and faintly pink; the plant is low and woodland.
 */

const PALS = [
  { deep: '#7d0f3e', mid: '#c0225f', light: '#f06a9b', mouth: '#5a0a2c' }, // raspberry
  { deep: '#8e1b63', mid: '#c93f93', light: '#ef8fc6', mouth: '#5e0f41' }, // magenta
  { deep: '#9c5570', mid: '#d896ab', light: '#f6d3dd', mouth: '#6d3049' }, // dusty rose
  { deep: '#a8697f', mid: '#efc3d0', light: '#fff4f7', mouth: '#7a4055' }, // pale
];

const DEFS =
  `<linearGradient id="sStem" x1="0" y1="1" x2="0.3" y2="0">` +
  `<stop offset="0" stop-color="#3c5e40"/><stop offset="0.6" stop-color="#7a6a62"/>` +
  `<stop offset="1" stop-color="#a8697f"/></linearGradient>` +
  `<linearGradient id="sLeafG" x1="0.1" y1="1" x2="0.5" y2="0">` +
  `<stop offset="0" stop-color="#11301c"/><stop offset="0.55" stop-color="#1f4a2c"/>` +
  `<stop offset="1" stop-color="#346a42"/></linearGradient>` +
  shadow('sSh', 1.28, 3.5, 0.28);

const petalDefs = (id, p) =>
  `<linearGradient id="${id}f" x1="0" y1="1" x2="0.2" y2="0">` +
  `<stop offset="0" stop-color="${p.deep}"/><stop offset="0.35" stop-color="${p.mid}"/>` +
  `<stop offset="1" stop-color="${p.light}"/></linearGradient>` +
  `<linearGradient id="${id}t" x1="0" y1="1" x2="0.2" y2="0">` +
  `<stop offset="0" stop-color="${p.mid}"/><stop offset="0.5" stop-color="${p.light}"/>` +
  `<stop offset="1" stop-color="#fff0f5"/></linearGradient>`;

/*
 * One reflexed petal, sweeping up and back from the mouth at the origin.
 * `twist` pinches it part-way so the paler back face shows, which is what
 * gives real cyclamen their propeller look.
 */
const reflexPetal = (L, W, lean, twist) => {
  const tipX = lean * L * 0.5, tipY = -L;
  return `M 0 0 C ${f2(-W * 0.9 + lean * L * 0.08)} ${f2(-L * 0.2)}, ` +
    `${f2(tipX - W * 1.25 + twist * W)} ${f2(-L * 0.62)}, ${f2(tipX - W * 0.25)} ${f2(tipY)} ` +
    `Q ${f2(tipX)} ${f2(tipY - W * 0.6)} ${f2(tipX + W * 0.4)} ${f2(tipY + W * 0.25)} ` +
    `C ${f2(tipX + W * 1.15 + twist * W)} ${f2(-L * 0.6)}, ` +
    `${f2(W * 0.9 + lean * L * 0.08)} ${f2(-L * 0.2)}, 0 0 Z`;
};

/* One nodding flower: mouth at the origin, five petals swept up around it */
const flower = (id, p, rnd) => {
  const L = rnd(62, 80), W = rnd(14, 19);
  let g = '';
  // the five petals; the middle one sits behind the stalk, two pairs flank it
  const leans = [-0.62, -0.3, 0.02, 0.32, 0.64];
  leans.forEach((lean, i) => {
    const twist = rnd(-0.5, 0.5);
    const l = L * rnd(0.85, 1.1) * (i === 2 ? 0.94 : 1);
    const d = reflexPetal(l, W * rnd(0.88, 1.12), lean + rnd(-0.07, 0.07), twist);
    g += `<g transform="rotate(${f2(lean * 26)})">` +
      `<path d="${d}" fill="url(#${id}${twist > 0.22 ? 't' : 'f'})" ` +
      `stroke="${p.deep}" stroke-width="0.6" stroke-opacity="0.45"/>` +
      // the crease running up the middle of each petal
      `<path d="M 0 ${f2(-l * 0.1)} Q ${f2(lean * l * 0.18)} ${f2(-l * 0.55)} ${f2(lean * l * 0.45)} ${f2(-l * 0.93)}" ` +
      `stroke="${p.deep}" stroke-width="0.8" fill="none" opacity="0.2"/></g>`;
  });
  // the mouth: a short corolla tube with the dark band around it
  g += `<path d="M ${f2(-W * 0.62)} ${f2(-W * 0.3)} Q 0 ${f2(W * 0.72)} ${f2(W * 0.62)} ${f2(-W * 0.3)} ` +
    `Q 0 ${f2(-W * 0.62)} ${f2(-W * 0.62)} ${f2(-W * 0.3)} Z" fill="${p.mouth}"/>`;
  g += `<ellipse cy="${f2(W * 0.1)}" rx="${f2(W * 0.3)}" ry="${f2(W * 0.22)}" fill="#2d0618" opacity="0.8"/>`;
  return g;
};

/*
 * Heart-shaped leaf, seen almost flat. The petiole joins at the origin, the
 * two basal lobes curl round it and the blade tapers to a blunt point. The
 * marbling is the Persian-cyclamen pattern: a dark margin, a broad pale band
 * inside it, and a dark heart again in the middle.
 */
const marbledLeaf = (x, y, deg, S, rnd) => {
  const w = S, h = S * 1.12;
  // the basal lobes curl back toward the petiole, which is what cuts the sinus
  const cordate = (k, dy = 0) => {
    const W = w * k, H = h * k;
    return `M 0 ${f2(dy)} ` +
      `C ${f2(-W * 0.30)} ${f2(dy + H * 0.26)}, ${f2(-W * 0.80)} ${f2(dy + H * 0.20)}, ${f2(-W * 0.98)} ${f2(dy - H * 0.22)} ` +
      `C ${f2(-W * 1.05)} ${f2(dy - H * 0.62)}, ${f2(-W * 0.40)} ${f2(dy - H * 0.97)}, 0 ${f2(dy - H)} ` +
      `C ${f2(W * 0.40)} ${f2(dy - H * 0.97)}, ${f2(W * 1.05)} ${f2(dy - H * 0.62)}, ${f2(W * 0.98)} ${f2(dy - H * 0.22)} ` +
      `C ${f2(W * 0.80)} ${f2(dy + H * 0.20)}, ${f2(W * 0.30)} ${f2(dy + H * 0.26)}, 0 ${f2(dy)} Z`;
  };

  const silver = rnd(0.3, 0.52);
  let g = `<g transform="translate(${f2(x)} ${f2(y)}) rotate(${f2(deg)})">` +
    `<path d="${cordate(1)}" fill="url(#sLeafG)" stroke="#0a1e11" stroke-width="1"/>` +
    // the pale band inside the dark margin
    `<path d="${cordate(0.82, -h * 0.08)}" fill="#aec4a8" opacity="${f2(silver)}"/>` +
    // and the dark heart in the middle again
    `<path d="${cordate(0.56, -h * 0.22)}" fill="#15351d" opacity="0.94"/>`;

  // irregular notches of dark green cutting into the pale band
  for (let i = 0; i < 6; i++) {
    const a = rnd(-2.9, -0.25);
    const r = rnd(0.5, 0.78);
    const bx = Math.cos(a) * w * r, by = Math.sin(a) * h * r - h * 0.42;
    g += `<ellipse cx="${f2(bx)}" cy="${f2(by)}" rx="${f2(S * rnd(0.1, 0.22))}" ry="${f2(S * rnd(0.06, 0.14))}" ` +
      `transform="rotate(${f2(rnd(0, 180))} ${f2(bx)} ${f2(by)})" fill="#17391f" opacity="${f2(rnd(0.55, 0.9))}"/>`;
  }
  // veins radiating from where the petiole joins
  for (let i = -3; i <= 3; i++) {
    g += `<path d="M 0 ${f2(-h * 0.02)} Q ${f2(i * w * 0.22)} ${f2(-h * 0.46)} ${f2(i * w * 0.26)} ${f2(-h * 0.84)}" ` +
      `stroke="#88a584" stroke-width="0.65" fill="none" opacity="0.26"/>`;
  }
  return `${g}</g>`;
};

const buildFlower = (palIdx, seed) => {
  const rnd = makeRng(seed);
  const p = PALS[palIdx];
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-85 -105 170 150" width="170" height="150">` +
    `<defs>${petalDefs('h', p)}${DEFS}</defs>` +
    `<g filter="url(#sSh)">${flower('h', p, rnd)}</g></svg>`;
  return svgUrl(svg);
};

/*
 * A plant: a flat rosette of marbled leaves with slender stalks rising out of
 * it, each bending over at the top so its flower nods face-down.
 */
const buildPlant = (palIdx, seed, count) => {
  const rnd = makeRng(seed);
  const p = PALS[palIdx];
  const crown = 96;
  let leaves = '', stems = '', blooms = '';

  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * Math.PI * 2 + rnd(-0.3, 0.3);
    const r = rnd(38, 74);
    const lx = Math.cos(a) * r, ly = crown - Math.abs(Math.sin(a)) * 16 - rnd(0, 22);
    leaves += `<path d="M 0 ${f2(crown)} Q ${f2(lx * 0.5)} ${f2((crown + ly) / 2)} ${f2(lx)} ${f2(ly)}" ` +
      `stroke="#8a5f6a" stroke-width="2.6" fill="none" stroke-linecap="round"/>`;
    leaves += marbledLeaf(lx, ly, rnd(-28, 28), rnd(38, 58), rnd);
  }

  for (let i = 0; i < count; i++) {
    const x0 = rnd(-26, 26);
    const h = rnd(104, 158);
    const lean = rnd(-30, 30);
    const tipX = x0 + lean, tipY = crown - h;
    stems += `<path d="M ${f2(x0)} ${f2(crown)} C ${f2(x0 + lean * 0.25)} ${f2(crown - h * 0.55)}, ` +
      `${f2(tipX)} ${f2(crown - h * 0.9)}, ${f2(tipX)} ${f2(tipY)}" ` +
      `stroke="url(#sStem)" stroke-width="${f2(rnd(3.2, 4.4))}" fill="none" stroke-linecap="round"/>`;
    const sc = rnd(0.5, 0.74);
    // the stalk hooks over, so the flower hangs nose-down below the hook
    stems += `<path d="M ${f2(tipX)} ${f2(tipY)} q ${f2(rnd(-9, 9))} ${f2(-7)} ${f2(rnd(-5, 5))} ${f2(6)}" ` +
      `stroke="url(#sStem)" stroke-width="3" fill="none" stroke-linecap="round"/>`;
    blooms += `<g transform="translate(${f2(tipX)} ${f2(tipY + 8)}) rotate(${f2(rnd(-16, 16))}) scale(${f2(sc)})" ` +
      `filter="url(#sSh)">${flower('p', p, rnd)}</g>`;
  }

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-125 -125 250 250" width="250" height="250">` +
    `<defs>${petalDefs('p', p)}${DEFS}</defs>${leaves}${stems}${blooms}</svg>`;
  return svgUrl(svg);
};

/* A patch of leaves on their own — the woodland floor under the flowers */
const buildRosette = (seed) => {
  const rnd = makeRng(seed);
  let body = '';
  for (let i = 0; i < 6; i++) {
    body += marbledLeaf(rnd(-66, 66), rnd(-50, 68), rnd(-38, 38), rnd(46, 76), rnd);
  }
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-115 -115 230 230" width="230" height="230">` +
    `<defs>${DEFS}</defs>${body}</svg>`;
  return svgUrl(svg);
};

/* ── Built once; shared by the modal scene and the garden preview ── */
const MIX = [0, 1, 0, 2, 1, 3, 0, 1];
export const CYCLAMEN_URLS = MIX.map((p, i) => buildFlower(p, 13100 + i * 41));
export const CYC_PLANT_URLS = MIX.map((p, i) => buildPlant(p, 13800 + i * 53, 3 + (i % 4)));
export const CYC_LEAF_URLS = Array.from({ length: 5 }, (_, i) => buildRosette(14600 + i * 29));
