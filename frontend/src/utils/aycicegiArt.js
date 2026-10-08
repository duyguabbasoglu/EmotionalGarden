import { makeRng, f2, svgUrl, smoothClosed } from './svgArt';

/*
 * Sunflowers face-on: green bracts peeking out, two rings of golden ray
 * florets with fine veins, and a dark disk whose seeds follow the real
 * Fibonacci spiral (golden angle 137.5°) — green buds in the very centre,
 * pollen-dusted florets around the rim.
 */
const RAYS = [
  { base: '#d98a00', mid: '#f6b40a', tip: '#ffd23f', vein: '#b06a00' },
  { base: '#c96a00', mid: '#ee9c0c', tip: '#ffc233', vein: '#9a5000' },
  { base: '#e0a000', mid: '#ffc81c', tip: '#ffe25a', vein: '#b88000' },
];

const ray = (r0, L, W, bx) =>
  `M ${f2(-W * 0.35)} ${f2(-r0)} C ${f2(-W * 1.1)} ${f2(-(r0 + L * 0.3))}, ${f2(-W * 0.85 + bx)} ${f2(-(r0 + L * 0.78))}, ${f2(bx)} ${f2(-(r0 + L))} ` +
  `C ${f2(W * 0.85 + bx)} ${f2(-(r0 + L * 0.78))}, ${f2(W * 1.1)} ${f2(-(r0 + L * 0.3))}, ${f2(W * 0.35)} ${f2(-r0)} Z`;

const buildSunflower = (variant, seed) => {
  const c = RAYS[variant];
  const rnd = makeRng(seed);
  const turn = rnd(0, 360);
  const defs =
    `<linearGradient id="rg" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="${c.base}"/><stop offset="0.35" stop-color="${c.mid}"/><stop offset="1" stop-color="${c.tip}"/></linearGradient>` +
    `<linearGradient id="bg" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#2e4a14"/><stop offset="1" stop-color="#6f8f2e"/></linearGradient>` +
    `<radialGradient id="dk"><stop offset="0" stop-color="#5a6420"/><stop offset="0.16" stop-color="#3d3a12"/><stop offset="0.36" stop-color="#241406"/><stop offset="0.8" stop-color="#2c1a08"/><stop offset="0.92" stop-color="#4a2e10"/><stop offset="1" stop-color="#6a4414"/></radialGradient>` +
    `<filter id="sh" x="-40%" y="-40%" width="180%" height="180%"><feDropShadow dx="0" dy="1.5" stdDeviation="2.5" flood-color="#2a1500" flood-opacity="0.45"/></filter>`;

  let body = '';
  // Bracts
  for (let i = 0; i < 24; i++) {
    const len = rnd(34, 48);
    body += `<path transform="rotate(${f2(turn + i * 15 + rnd(-4, 4))})" d="M -7 -34 Q -10 ${f2(-(34 + len * 0.5))} 0 ${f2(-(34 + len))} Q 10 ${f2(-(34 + len * 0.5))} 7 -34 Z" fill="url(#bg)" stroke="#1d3009" stroke-width="0.6"/>`;
  }
  // Two rings of ray florets
  [
    { n: 21, off: 0, L: [54, 66], W: [10, 12.5], back: true },
    { n: 21, off: 360 / 42, L: [46, 58], W: [9.5, 12], back: false },
  ].forEach(ring => {
    for (let i = 0; i < ring.n; i++) {
      const deg = turn + ring.off + (i * 360) / ring.n + rnd(-4, 4);
      const L = rnd(...ring.L), W = rnd(...ring.W), bx = rnd(-5, 5), r0 = 34;
      let v = '';
      for (let j = -1; j <= 1; j++) {
        v += `<path d="M ${f2(j * W * 0.3)} ${-r0 - 2} Q ${f2(j * W * 0.45 + bx * 0.4)} ${f2(-(r0 + L * 0.5))} ${f2(j * W * 0.15 + bx * 0.9)} ${f2(-(r0 + L * 0.9))}" fill="none" stroke="${c.vein}" stroke-width="0.7" opacity="0.35"/>`;
      }
      body += `<g transform="rotate(${f2(deg)})">` +
        `<path d="${ray(r0, L, W, bx)}" fill="url(#rg)" stroke="${c.vein}" stroke-width="0.5" stroke-opacity="0.4"${ring.back ? '' : ' filter="url(#sh)"'}/>` +
        (ring.back ? `<path d="${ray(r0, L, W, bx)}" fill="#6a3a00" opacity="0.18"/>` : '') +
        v +
        `<path d="M 0 ${-r0 - 4} Q ${f2(bx * 0.4)} ${f2(-(r0 + L * 0.5))} ${f2(bx * 0.85)} ${f2(-(r0 + L * 0.85))}" fill="none" stroke="#fff4b0" stroke-width="1.2" opacity="0.28"/>` +
        `</g>`;
    }
  });
  // Disk with Fibonacci seeds
  body += `<circle r="40" fill="url(#dk)" filter="url(#sh)"/>`;
  const N = 460;
  const t0 = (turn * Math.PI) / 180;
  for (let i = 1; i < N; i++) {
    const t = i / N;
    const r = 39 * Math.sqrt(t);
    const a = i * 2.39996 + t0;
    const x = Math.cos(a) * r, y = Math.sin(a) * r;
    let fill;
    if (t < 0.1) fill = '#7a8a2a';
    else if (t < 0.72) fill = i % 3 === 0 ? '#4a2c0e' : '#1c0f04';
    else fill = rnd() < 0.3 ? '#e8a820' : '#7a4c10';
    body += `<circle cx="${f2(x)}" cy="${f2(y)}" r="${f2(0.55 + 1.05 * Math.sqrt(t))}" fill="${fill}"/>`;
  }
  body += `<circle r="39.5" fill="none" stroke="#b07a18" stroke-width="2.5" opacity="0.45"/>`;

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-110 -110 220 220" width="220" height="220"><defs>${defs}</defs>${body}</svg>`;
  return svgUrl(svg);
};

/* Big rough heart-shaped leaf with serrated edge and strong veins */
const buildSunLeaf = (seed) => {
  const rnd = makeRng(seed);
  const L = rnd(120, 140), W = rnd(56, 66);
  const n = 30, right = [], left = [];
  for (let i = 0; i <= n; i++) {
    const u = i / n;
    const hw = W * Math.pow(Math.sin(Math.PI * Math.pow(u, 0.72)), 0.9) * (i % 2 ? 1 : 0.95);
    const y = -u * L + 22 * Math.pow(1 - u, 5);
    right.push([hw, y]);
    left.unshift([-hw, y]);
  }
  const defs = `<linearGradient id="sl" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#2a5216"/><stop offset="0.5" stop-color="#4f8a2c"/><stop offset="1" stop-color="#2f5a18"/></linearGradient>`;
  let body = `<path d="${smoothClosed([[0, 4], ...right, ...left])}" fill="url(#sl)" stroke="#1d3a0e" stroke-width="1.2"/>`;
  body += `<path d="M 0 40 L 0 ${f2(-L * 0.95)}" stroke="#9cc466" stroke-width="2.4" opacity="0.8"/>`;
  for (let v = 0; v < 6; v++) {
    const y = -L * (0.08 + v * 0.14);
    const reach = W * (0.85 - v * 0.1);
    body += `<path d="M 0 ${f2(y)} Q ${f2(reach * 0.5)} ${f2(y - 10)} ${f2(reach)} ${f2(y - 26)} M 0 ${f2(y)} Q ${f2(-reach * 0.5)} ${f2(y - 10)} ${f2(-reach)} ${f2(y - 26)}" stroke="#86b252" stroke-width="1.1" fill="none" opacity="0.5"/>`;
  }
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-90 -150 180 195" width="180" height="195"><defs>${defs}</defs>${body}</svg>`;
  return svgUrl(svg);
};

/* ── Pre-computed once; shared by the modal scene and the garden preview ── */
export const SUNFLOWER_URLS = Array.from({ length: 5 }, (_, i) => buildSunflower(i % RAYS.length, 1300 + i * 71));
export const SUN_LEAF_URLS = Array.from({ length: 3 }, (_, i) => buildSunLeaf(410 + i * 37));
