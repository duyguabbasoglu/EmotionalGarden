import { makeRng, f2, svgUrl, smoothClosed } from './svgArt';

/*
 * Crocuses as they really grow: low clumps of grass-like leaves with a silver
 * midstripe, some flowers wide open in the sun (6 tepals, pale throat,
 * yellow anthers, frilled saffron stigma), others still closed goblets.
 * Colours follow real cultivars/species: C. vernus violet, deep 'Flower Record',
 * striped 'Pickwick' and the golden Anatolian C. ancyrensis.
 */
const PALETTES = {
  violet:   { throat: '#f3e7b8', base: '#9a86cf', body: '#5c34a4', tip: '#6e48b8', vein: '#2c0f66', edge: '#3e1c80', stripes: false },
  deep:     { throat: '#efe0a8', base: '#8266bd', body: '#43208a', tip: '#55329e', vein: '#1c0648', edge: '#2c0e62', stripes: false },
  pickwick: { throat: '#f2e6b0', base: '#ece6f3', body: '#f1edf7', tip: '#fbf9fd', vein: '#5a2d91', edge: '#b8a8d0', stripes: true },
  golden:   { throat: '#ffd24a', base: '#f0a000', body: '#f7ad0a', tip: '#ffc42e', vein: '#a85a00', edge: '#b87000', stripes: false },
};

/* Obovate tepal: narrow claw, widest past the middle, blunt rounded tip */
const tepalPath = (L, W, bend) => {
  const n = 12, right = [], left = [];
  for (let i = 1; i <= n; i++) {
    const u = i / n;
    const hw = W * Math.pow(Math.sin(Math.PI * Math.min(u, 0.985)), 0.55) * (0.3 + 0.7 * Math.pow(u, 0.6));
    const cx = bend * L * 0.08 * u * u;
    right.push([cx + hw, -u * L]);
    left.unshift([cx - hw, -u * L]);
  }
  return smoothClosed([[W * 0.12, 0], ...right, ...left, [-W * 0.12, 0]]);
};

const veins = (p, L, W, bend, rnd) => {
  let out = '';
  const count = p.stripes ? 2 : 3;
  for (let j = -count; j <= count; j++) {
    const reach = p.stripes ? rnd(0.7, 0.85) : rnd(0.45, 0.7);
    out += `<path d="M ${f2(j * W * 0.05)} ${f2(-L * 0.1)} Q ${f2(j * W * 0.2 + bend * 2)} ${f2(-L * 0.4)} ${f2(j * W * 0.3 + bend * L * 0.05)} ${f2(-L * reach)}" ` +
      `fill="none" stroke="${p.vein}" stroke-width="${p.stripes ? (j === 0 ? 3 : 2) : 0.8}" stroke-linecap="round" opacity="${p.stripes ? 0.7 : 0.32}"/>`;
  }
  return out;
};

const tepalDefs = (p) =>
  `<linearGradient id="to" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="${p.throat}"/><stop offset="0.14" stop-color="${p.base}"/><stop offset="0.42" stop-color="${p.body}"/><stop offset="1" stop-color="${p.tip}"/></linearGradient>` +
  `<linearGradient id="ti" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="${p.throat}"/><stop offset="0.18" stop-color="${p.base}"/><stop offset="0.5" stop-color="${p.tip}"/><stop offset="1" stop-color="${p.body}"/></linearGradient>` +
  `<linearGradient id="stg" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#c42c06"/><stop offset="1" stop-color="#ff7a14"/></linearGradient>` +
  `<filter id="sh" x="-40%" y="-40%" width="180%" height="180%"><feDropShadow dx="0" dy="1.5" stdDeviation="2.4" flood-color="#000" flood-opacity="0.35"/></filter>`;

const tepal = (p, gradId, deg, L, W, bend, rnd, shadow) =>
  `<g transform="rotate(${f2(deg)})">` +
  `<path d="${tepalPath(L, W, bend)}" fill="url(#${gradId})" stroke="${p.edge}" stroke-width="0.8" stroke-opacity="0.45"${shadow ? ' filter="url(#sh)"' : ''}/>` +
  veins(p, L, W, bend, rnd) +
  `<path d="M ${f2(-W * 0.35)} ${f2(-L * 0.35)} Q ${f2(-W * 0.45)} ${f2(-L * 0.6)} ${f2(-W * 0.2)} ${f2(-L * 0.85)}" fill="none" stroke="#fff" stroke-width="2" opacity="0.12"/>` +
  `</g>`;

/* Stigma branch: slender, widening to a frilled saffron tip */
const STIGMA = 'M -1 -2 L -3 -28 Q -5.5 -32 -4.8 -36 L -3 -33.5 L -1.6 -37 L 0 -34 L 1.6 -37 L 3 -33.5 L 4.8 -36 Q 5.5 -32 3 -28 L 1 -2 Z';
const ANTHER = 'M -2.2 -9 C -4.6 -17, -4.2 -27, 0 -32 C 4.2 -27, 4.6 -17, 2.2 -9 Z';

const buildOpen = (palKey, seed) => {
  const p = PALETTES[palKey];
  const rnd = makeRng(seed);
  const turn = rnd(0, 360);
  let body = '';
  for (let i = 0; i < 3; i++) {
    body += tepal(p, 'to', turn + i * 120 + rnd(-8, 8), rnd(84, 94), rnd(30, 35), rnd(-1, 1), rnd, false);
  }
  for (let i = 0; i < 3; i++) {
    body += tepal(p, 'ti', turn + 60 + i * 120 + rnd(-8, 8), rnd(72, 82), rnd(26, 30), rnd(-1, 1), rnd, true);
  }
  body += `<circle r="20" fill="url(#thr)"/>`;
  for (let i = 0; i < 3; i++) {
    body += `<g transform="rotate(${f2(turn + i * 120 + rnd(-10, 10))})">` +
      `<path d="M 0 0 L 0 -10" stroke="#f3edc8" stroke-width="1.6"/>` +
      `<path d="${ANTHER}" fill="#f5dc5a" stroke="#b89a20" stroke-width="0.6"/>` +
      `<path d="M 0 -11 L 0 -30" stroke="#c9a526" stroke-width="0.8"/></g>`;
  }
  for (let i = 0; i < 3; i++) {
    body += `<g transform="rotate(${f2(turn + 60 + i * 120 + rnd(-12, 12))}) scale(${f2(rnd(0.9, 1.1))})">` +
      `<path d="${STIGMA}" fill="url(#stg)" stroke="#9a2200" stroke-width="0.5"/></g>`;
  }
  body += `<circle r="3" fill="#f7e3a0"/>`;
  const defs = tepalDefs(p) +
    `<radialGradient id="thr"><stop offset="0" stop-color="${p.throat}" stop-opacity="0.95"/><stop offset="1" stop-color="${p.throat}" stop-opacity="0"/></radialGradient>`;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-100 -100 200 200" width="200" height="200"><defs>${defs}</defs>${body}</svg>`;
  return svgUrl(svg);
};

const grassBlade = (x, deg, L, w, curve, color) => {
  const tip = curve * L * 0.35;
  return `<g transform="translate(${f2(x)} 0) rotate(${f2(deg)})">` +
    `<path d="M ${f2(-w / 2)} 0 Q ${f2(-w / 2 + tip * 0.8)} ${f2(-L * 0.5)} ${f2(tip)} ${f2(-L)} Q ${f2(w / 2 + tip * 0.8)} ${f2(-L * 0.5)} ${f2(w / 2)} 0 Z" fill="${color}" stroke="#10240a" stroke-width="0.6" stroke-opacity="0.6"/>` +
    `<path d="M 0 ${f2(-L * 0.04)} Q ${f2(tip * 0.8)} ${f2(-L * 0.5)} ${f2(tip * 0.97)} ${f2(-L * 0.92)}" fill="none" stroke="#e2ebd2" stroke-width="${f2(w * 0.2)}" stroke-linecap="round" opacity="0.6"/>` +
    `</g>`;
};

/* Closed / half-open goblet seen from the side, on its pale tube with leaves */
const buildGoblet = (palKey, seed) => {
  const p = PALETTES[palKey];
  const rnd = makeRng(seed);
  let body = '';
  body += grassBlade(-4, rnd(-24, -12), rnd(100, 130), 8, rnd(-0.3, 0.1), `hsl(${f2(rnd(105, 120))},45%,24%)`);
  body += grassBlade(4, rnd(10, 24), rnd(95, 125), 7.5, rnd(-0.1, 0.3), `hsl(${f2(rnd(105, 120))},42%,28%)`);
  body += `<path d="M -3.5 80 L -3 6 Q 0 2 3 6 L 3.5 80 Z" fill="url(#tube)"/>` +
    `<path d="M -5 80 Q -6 50 -2 30 L 2 30 Q 6 50 5 80 Z" fill="#f4f1dc" opacity="0.35"/>`;
  const open = rnd(0, 1);
  const L = rnd(70, 84);
  body += `<g transform="translate(0 10)">`;
  body += tepal(p, 'ti', rnd(-4, 4), L * 1.04, 22, 0, rnd, false);
  body += tepal(p, 'to', -12 - open * 14, L, 21, -0.6, rnd, true);
  body += tepal(p, 'to', 12 + open * 14, L, 21, 0.6, rnd, true);
  if (open > 0.45) {
    body += `<g transform="translate(0 ${f2(-L * 0.55)})"><path d="${STIGMA}" transform="scale(0.8)" fill="url(#stg)"/></g>`;
  }
  body += tepal(p, 'to', rnd(-5, 5), L * 0.96, 19, rnd(-0.4, 0.4), rnd, true);
  body += `</g>`;
  const defs = tepalDefs(p) +
    `<linearGradient id="tube" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#cfd9b0"/><stop offset="0.5" stop-color="#f3f5e6"/><stop offset="1" stop-color="#bfcc9c"/></linearGradient>`;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-60 -110 120 195" width="120" height="195"><defs>${defs}</defs>${body}</svg>`;
  return svgUrl(svg);
};

const buildGrassClump = (seed) => {
  const rnd = makeRng(seed);
  let body = '';
  const count = Math.floor(rnd(6, 10));
  for (let i = 0; i < count; i++) {
    body += grassBlade(rnd(-8, 8), rnd(-40, 40), rnd(90, 150), rnd(7, 10), rnd(-0.4, 0.4),
      `hsl(${f2(rnd(100, 122))},${f2(rnd(38, 52))}%,${f2(rnd(19, 30))}%)`);
  }
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-110 -160 220 175" width="220" height="175">${body}</svg>`;
  return svgUrl(svg);
};

/* ── Pre-computed once; shared by the modal scene and the garden preview ── */
const MIX = ['violet', 'violet', 'violet', 'deep', 'deep', 'pickwick', 'pickwick', 'golden', 'golden'];
export const OPEN_URLS = MIX.map((k, i) => buildOpen(k, 200 + i * 53));
export const GOBLET_URLS = MIX.map((k, i) => buildGoblet(k, 600 + i * 41));
export const GRASS_URLS = Array.from({ length: 4 }, (_, i) => buildGrassClump(80 + i * 29));
