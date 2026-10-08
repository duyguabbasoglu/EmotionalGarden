import { makeRng, f2, svgUrl, shadow } from './svgArt';

/*
 * March daffodils (Narcissus).
 * Reference structure: six pointed perianth tepals in a flat star, and in the
 * middle a trumpet-shaped corona with a crimped, frilled rim — usually a
 * deeper gold or orange than the tepals. Anthers sit down inside the trumpet.
 * The flower is carried sideways on a hollow scape with a papery spathe at
 * the neck, over long flat strap leaves that come straight out of the ground.
 */

const PALS = [
  { tep: '#ffe24a', tepMid: '#ffd000', tepEdge: '#c99400', cor: '#ff9f12', corDeep: '#d85f00' },
  { tep: '#fff6c2', tepMid: '#ffe88a', tepEdge: '#cfae3e', cor: '#ffc93a', corDeep: '#e08a00' },
  { tep: '#ffd93a', tepMid: '#f8bf00', tepEdge: '#b07d00', cor: '#ff7a1a', corDeep: '#bf3f00' },
];

const DEFS =
  `<linearGradient id="nStem" x1="0" y1="1" x2="0" y2="0">` +
  `<stop offset="0" stop-color="#2f5a2a"/><stop offset="1" stop-color="#76a84f"/></linearGradient>` +
  `<linearGradient id="nLeaf" x1="0" y1="1" x2="0.3" y2="0">` +
  `<stop offset="0" stop-color="#27471f"/><stop offset="0.55" stop-color="#4e7d36"/>` +
  `<stop offset="1" stop-color="#86b85c"/></linearGradient>` +
  shadow('nSh', 1.2, 3.0, 0.25);

const headDefs = (id, p) =>
  `<radialGradient id="${id}t" cx="45%" cy="40%" r="75%">` +
  `<stop offset="0" stop-color="${p.tep}"/><stop offset="0.55" stop-color="${p.tepMid}"/>` +
  `<stop offset="1" stop-color="${p.tepEdge}"/></radialGradient>` +
  `<radialGradient id="${id}c" cx="42%" cy="30%" r="80%">` +
  `<stop offset="0" stop-color="${p.cor}"/><stop offset="0.7" stop-color="${p.corDeep}"/>` +
  `<stop offset="1" stop-color="#8f3200"/></radialGradient>`;

/* One perianth tepal: a pointed oval standing out from the centre */
const tepal = (r0, L, W) =>
  `M 0 ${f2(-r0)} C ${f2(-W)} ${f2(-(r0 + L * 0.3))}, ${f2(-W * 0.92)} ${f2(-(r0 + L * 0.72))}, 0 ${f2(-(r0 + L))} ` +
  `C ${f2(W * 0.92)} ${f2(-(r0 + L * 0.72))}, ${f2(W)} ${f2(-(r0 + L * 0.3))}, 0 ${f2(-r0)} Z`;

/* A crimped rim for the trumpet, drawn as a wavy ring */
const frill = (r, bumps, depth) => {
  let d = '';
  const steps = bumps * 2;
  for (let i = 0; i <= steps; i++) {
    const a = (i / steps) * Math.PI * 2;
    const rr = r + (i % 2 === 0 ? depth : -depth * 0.55);
    const x = Math.cos(a) * rr, y = Math.sin(a) * rr;
    if (i === 0) d = `M ${f2(x)} ${f2(y)}`;
    else {
      const am = a - Math.PI / steps;
      d += ` Q ${f2(Math.cos(am) * (r + depth * 1.35))} ${f2(Math.sin(am) * (r + depth * 1.35))} ${f2(x)} ${f2(y)}`;
    }
  }
  return `${d} Z`;
};

/* One flower head, face-on, in a 100-radius space */
const head = (id, p, rnd) => {
  const turn = rnd(0, 60);
  const L = rnd(60, 72), W = rnd(21, 27), r0 = 16;
  let g = '';
  // back row of tepals, slightly offset so the star looks hand-drawn
  for (let i = 0; i < 6; i++) {
    const deg = turn + i * 60 + rnd(-5, 5);
    g += `<g transform="rotate(${f2(deg)})"><path d="${tepal(r0, L * rnd(0.9, 1.08), W * rnd(0.9, 1.1))}" ` +
      `fill="url(#${id}t)" stroke="${p.tepEdge}" stroke-width="0.7" stroke-opacity="0.5"/>` +
      `<path d="M 0 ${f2(-r0 - 3)} L 0 ${f2(-(r0 + L * 0.88))}" stroke="${p.tepEdge}" stroke-width="0.8" opacity="0.3"/></g>`;
  }
  // the trumpet: a frilled rim over a darker throat
  const cr = rnd(31, 37);
  g += `<path d="${frill(cr, Math.floor(rnd(10, 14)), cr * 0.17)}" fill="url(#${id}c)" filter="url(#nSh)"/>`;
  // the tube: a lit upper wall falling away into a dark throat
  g += `<circle r="${f2(cr * 0.82)}" fill="${p.cor}"/>`;
  g += `<circle r="${f2(cr * 0.82)}" cy="${f2(-cr * 0.1)}" fill="#fff0b0" opacity="0.22"/>`;
  g += `<circle r="${f2(cr * 0.64)}" cy="${f2(cr * 0.05)}" fill="${p.corDeep}"/>`;
  g += `<circle r="${f2(cr * 0.48)}" cy="${f2(cr * 0.08)}" fill="#7c3000"/>`;
  g += `<circle r="${f2(cr * 0.36)}" cy="${f2(cr * 0.1)}" fill="#4e1c00" opacity="0.7"/>`;
  // anthers down inside the throat
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * Math.PI * 2 + rnd(0, 1);
    g += `<ellipse cx="${f2(Math.cos(a) * cr * 0.3)}" cy="${f2(Math.sin(a) * cr * 0.3)}" rx="${f2(cr * 0.14)}" ry="${f2(cr * 0.1)}" ` +
      `transform="rotate(${f2((a * 180) / Math.PI)} ${f2(Math.cos(a) * cr * 0.3)} ${f2(Math.sin(a) * cr * 0.3)})" fill="#ffe27a"/>`;
  }
  g += `<circle r="${f2(cr * 0.14)}" fill="#fff0a8"/>`;
  return g;
};

/* Long flat strap leaf straight out of the ground */
const strap = (x, base, L, W, lean) =>
  `<path d="M ${f2(x)} ${f2(base)} ` +
  `C ${f2(x - W + lean * 0.2)} ${f2(base - L * 0.32)}, ${f2(x - W * 0.7 + lean)} ${f2(base - L * 0.72)}, ${f2(x + lean * 1.3)} ${f2(base - L)} ` +
  `C ${f2(x + W * 0.7 + lean)} ${f2(base - L * 0.72)}, ${f2(x + W + lean * 0.2)} ${f2(base - L * 0.32)}, ${f2(x)} ${f2(base)} Z" ` +
  `fill="url(#nLeaf)" stroke="#1d3717" stroke-width="0.7"/>`;

const buildHead = (palIdx, seed) => {
  const rnd = makeRng(seed);
  const p = PALS[palIdx];
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-100 -100 200 200" width="200" height="200">` +
    `<defs>${headDefs('h', p)}${DEFS}</defs>${head('h', p, rnd)}</svg>`;
  return svgUrl(svg);
};

/* A clump: strap leaves with two or three flowers nodding above them */
const buildClump = (palIdx, seed, count) => {
  const rnd = makeRng(seed);
  const p = PALS[palIdx];
  const base = 118;
  let leaves = '', stems = '', heads = '';
  let defs = DEFS;

  for (let i = 0; i < count + 4; i++) {
    leaves += strap(rnd(-62, 62), base + rnd(0, 8), rnd(120, 190), rnd(8, 13), rnd(-30, 30));
  }

  const xs = Array.from({ length: count }, (_, i) =>
    -42 + (i + 0.5) * (84 / count) + rnd(-12, 12));

  xs.forEach((x, i) => {
    const h = rnd(140, 190);
    const lean = rnd(-16, 16);
    const tipX = x + lean, tipY = base - h;
    stems += `<path d="M ${f2(x)} ${f2(base)} C ${f2(x + lean * 0.3)} ${f2(base - h * 0.5)}, ` +
      `${f2(tipX)} ${f2(base - h * 0.82)}, ${f2(tipX)} ${f2(tipY)}" stroke="url(#nStem)" stroke-width="5" ` +
      `fill="none" stroke-linecap="round"/>` +
      // papery spathe at the neck
      `<path d="M ${f2(tipX - 4)} ${f2(tipY + 8)} Q ${f2(tipX)} ${f2(tipY - 10)} ${f2(tipX + 5)} ${f2(tipY + 8)} Z" ` +
      `fill="#c8bc84" opacity="0.8"/>`;
    const id = `c${i}`;
    defs += headDefs(id, p);
    heads += `<g transform="translate(${f2(tipX + rnd(-4, 4))} ${f2(tipY - rnd(16, 26))}) ` +
      `rotate(${f2(rnd(-18, 18))}) scale(${f2(rnd(0.46, 0.62))} ${f2(rnd(0.42, 0.56))})" filter="url(#nSh)">` +
      `${head(id, p, rnd)}</g>`;
  });

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-130 -130 260 260" width="260" height="260">` +
    `<defs>${defs}</defs>${leaves}${stems}${heads}</svg>`;
  return svgUrl(svg);
};

const buildLeaves = (seed) => {
  const rnd = makeRng(seed);
  let body = '';
  for (let i = 0; i < 10; i++) {
    body += strap(rnd(-72, 72), 100 + rnd(0, 14), rnd(100, 185), rnd(8, 14), rnd(-34, 34));
  }
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-115 -115 230 230" width="230" height="230">` +
    `<defs>${DEFS}</defs>${body}</svg>`;
  return svgUrl(svg);
};

/* ── Built once; shared by the modal scene and the garden preview ── */
const MIX = [0, 1, 0, 2, 1, 0, 2, 1];
export const DAFFODIL_URLS = MIX.map((p, i) => buildHead(p, 4100 + i * 47));
export const DAFF_CLUMP_URLS = MIX.map((p, i) => buildClump(p, 4700 + i * 59, 2 + (i % 3)));
export const DAFF_LEAF_URLS = Array.from({ length: 4 }, (_, i) => buildLeaves(5300 + i * 31));
