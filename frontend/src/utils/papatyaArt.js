import { makeRng, f2, svgUrl, shadow } from './svgArt';

/*
 * April daisies (Leucanthemum / Bellis).
 * Reference structure: a single ring of many narrow white ray florets, each
 * with a blunt, slightly notched tip, around a domed yellow disk packed with
 * tiny tube florets. A few green bracts show behind the rays. Leaves are
 * small, dark and toothed, low down among meadow grass.
 */

const DEFS =
  `<linearGradient id="pRay" x1="0" y1="1" x2="0.2" y2="0">` +
  `<stop offset="0" stop-color="#eef0ea"/><stop offset="0.45" stop-color="#fdfdfb"/>` +
  `<stop offset="1" stop-color="#ffffff"/></linearGradient>` +
  `<radialGradient id="pDisk" cx="38%" cy="32%" r="78%">` +
  `<stop offset="0" stop-color="#ffe066"/><stop offset="0.55" stop-color="#f6c016"/>` +
  `<stop offset="1" stop-color="#b57d00"/></radialGradient>` +
  `<linearGradient id="pLeaf" x1="0" y1="1" x2="0.3" y2="0">` +
  `<stop offset="0" stop-color="#24400f"/><stop offset="0.55" stop-color="#43701f"/>` +
  `<stop offset="1" stop-color="#7ba83f"/></linearGradient>` +
  `<linearGradient id="pStem" x1="0" y1="1" x2="0" y2="0">` +
  `<stop offset="0" stop-color="#2c5112"/><stop offset="1" stop-color="#6d9c35"/></linearGradient>` +
  shadow('pSh', 1.04, 2.5, 0.22);

/* One ray floret: narrow, parallel-sided, blunt and faintly notched at the tip */
const ray = (r0, L, W) =>
  `M ${f2(-W * 0.6)} ${f2(-r0)} C ${f2(-W)} ${f2(-(r0 + L * 0.4))}, ${f2(-W * 0.95)} ${f2(-(r0 + L * 0.9))}, ${f2(-W * 0.6)} ${f2(-(r0 + L))} ` +
  `Q 0 ${f2(-(r0 + L * 0.93))} ${f2(W * 0.6)} ${f2(-(r0 + L))} ` +
  `C ${f2(W * 0.95)} ${f2(-(r0 + L * 0.9))}, ${f2(W)} ${f2(-(r0 + L * 0.4))}, ${f2(W * 0.6)} ${f2(-r0)} Z`;

/* One daisy head in a 100-radius space */
const head = (rnd) => {
  const n = Math.floor(rnd(19, 27));
  const L = rnd(58, 72), W = rnd(5.2, 7.2), r0 = rnd(20, 25);
  const turn = rnd(0, 360);
  let g = '';

  // green bracts peeking out between the rays
  for (let i = 0; i < 8; i++) {
    g += `<g transform="rotate(${f2(turn + (i * 360) / 8)})">` +
      `<ellipse cx="0" cy="${f2(-r0 - 6)}" rx="4.5" ry="10" fill="#4e7d2a"/></g>`;
  }
  // the ring of white rays, two slightly offset passes so it does not look stamped
  for (let pass = 0; pass < 2; pass++) {
    for (let i = 0; i < n; i++) {
      const deg = turn + (i * 360) / n + (pass * 180) / n + rnd(-3.5, 3.5);
      const l = L * rnd(0.84, 1.08) * (pass ? 0.93 : 1);
      g += `<g transform="rotate(${f2(deg)})">` +
        `<path d="${ray(r0 * 0.75, l, W * rnd(0.85, 1.15))}" fill="url(#pRay)" ` +
        `stroke="#cfd4ca" stroke-width="0.45" stroke-opacity="0.7"/>` +
        `<path d="M 0 ${f2(-r0 * 0.8)} L 0 ${f2(-(r0 * 0.75 + l * 0.85))}" stroke="#dfe3da" stroke-width="0.6" opacity="0.8"/></g>`;
    }
  }
  // the domed disk, with the tube florets as a phyllotaxis spiral
  const dr = r0 * rnd(0.95, 1.12);
  g += `<circle r="${f2(dr)}" fill="url(#pDisk)" filter="url(#pSh)"/>`;
  for (let i = 1; i < 95; i++) {
    const t = i / 95, rr = (dr - 1.5) * Math.sqrt(t), a = i * 2.39996;
    g += `<circle cx="${f2(Math.cos(a) * rr)}" cy="${f2(Math.sin(a) * rr)}" r="${f2(0.9 + 0.9 * t)}" ` +
      `fill="${t < 0.45 ? '#e9a800' : '#fff07a'}" opacity="0.85"/>`;
  }
  return g;
};

/* Spoon-shaped daisy leaf with a shallow scalloped margin */
const leaf = (x, y, deg, L, W, tone) => {
  const side = (sgn) => {
    let d = '';
    for (let i = 1; i <= 4; i++) {
      const t = i / 4;
      // widest about two thirds up, then rounding off to a blunt tip
      const w = W * Math.sin(t * 2.3) * (1 + 0.14 * (i % 2 ? 1 : -1));
      d += ` Q ${f2(sgn * w * 1.25)} ${f2(-L * (t - 0.1))} ${f2(sgn * w)} ${f2(-L * t)}`;
    }
    return d;
  };
  const d = `M 0 0${side(-1)} Q ${f2(-W * 0.3)} ${f2(-L * 1.12)} 0 ${f2(-L * 1.12)} ` +
    `Q ${f2(W * 0.3)} ${f2(-L * 1.12)} ${f2(W * Math.sin(2.3))} ${f2(-L)}` +
    side(1).split(' Q ').reverse().slice(1).map((seg) => ` Q ${seg}`).join('') + ' Z';
  return `<g transform="translate(${f2(x)} ${f2(y)}) rotate(${f2(deg)})">` +
    `<path d="${d}" fill="url(#pLeaf)" opacity="${f2(tone)}" stroke="#1b300b" stroke-width="0.6"/>` +
    `<path d="M 0 ${f2(-L * 0.05)} L 0 ${f2(-L * 1.0)}" stroke="#8fbf52" stroke-width="0.8" opacity="0.45"/></g>`;
};

/* A blade of meadow grass */
const blade = (x, base, L, W, lean) =>
  `<path d="M ${f2(x)} ${f2(base)} Q ${f2(x + lean * 0.4)} ${f2(base - L * 0.6)} ${f2(x + lean)} ${f2(base - L)} ` +
  `Q ${f2(x + lean * 0.35 + W)} ${f2(base - L * 0.55)} ${f2(x + W)} ${f2(base)} Z" ` +
  `fill="hsl(${f2(78 + (lean % 7) * 2)},42%,${f2(24 + (W % 3) * 4)}%)"/>`;

const buildHead = (seed) => {
  const rnd = makeRng(seed);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-100 -100 200 200" width="200" height="200">` +
    `<defs>${DEFS}</defs>${head(rnd)}</svg>`;
  return svgUrl(svg);
};

/* A tuft: grass and leaves with a few daisies nodding over the top */
const buildTuft = (seed, count) => {
  const rnd = makeRng(seed);
  const base = 112;
  let body = '';
  for (let i = 0; i < 16; i++) {
    body += blade(rnd(-80, 80), base + rnd(0, 10), rnd(70, 150), rnd(3, 7), rnd(-26, 26));
  }
  for (let i = 0; i < 6; i++) {
    body += leaf(rnd(-70, 70), base - rnd(0, 30), rnd(-40, 40), rnd(28, 46), rnd(7, 11), rnd(0.8, 1));
  }
  for (let i = 0; i < count; i++) {
    const x = -46 + (i + 0.5) * (92 / count) + rnd(-14, 14);
    const h = rnd(110, 165);
    const lean = rnd(-20, 20);
    body += `<path d="M ${f2(x)} ${f2(base)} C ${f2(x + lean * 0.3)} ${f2(base - h * 0.5)}, ` +
      `${f2(x + lean)} ${f2(base - h * 0.84)}, ${f2(x + lean)} ${f2(base - h)}" ` +
      `stroke="url(#pStem)" stroke-width="4" fill="none" stroke-linecap="round"/>`;
    body += `<g transform="translate(${f2(x + lean)} ${f2(base - h - 4)}) rotate(${f2(rnd(-20, 20))}) ` +
      `scale(${f2(rnd(0.42, 0.6))} ${f2(rnd(0.36, 0.55))})" filter="url(#pSh)">${head(rnd)}</g>`;
  }
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-125 -125 250 250" width="250" height="250">` +
    `<defs>${DEFS}</defs>${body}</svg>`;
  return svgUrl(svg);
};

const buildGrass = (seed) => {
  const rnd = makeRng(seed);
  let body = '';
  for (let i = 0; i < 22; i++) {
    body += blade(rnd(-80, 80), 100 + rnd(0, 14), rnd(60, 140), rnd(3, 8), rnd(-30, 30));
  }
  for (let i = 0; i < 7; i++) {
    body += leaf(rnd(-70, 70), rnd(50, 100), rnd(-50, 50), rnd(26, 48), rnd(7, 12), rnd(0.75, 1));
  }
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-110 -110 220 220" width="220" height="220">` +
    `<defs>${DEFS}</defs>${body}</svg>`;
  return svgUrl(svg);
};

/* ── Built once; shared by the modal scene and the garden preview ── */
export const DAISY_URLS = Array.from({ length: 8 }, (_, i) => buildHead(6100 + i * 41));
export const DAISY_TUFT_URLS = Array.from({ length: 6 }, (_, i) => buildTuft(6800 + i * 53, 2 + (i % 3)));
export const DAISY_GRASS_URLS = Array.from({ length: 4 }, (_, i) => buildGrass(7400 + i * 23));
