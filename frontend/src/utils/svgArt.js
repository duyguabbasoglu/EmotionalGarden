/**
 * Shared helpers for flowers drawn as pre-built SVG images.
 * Each flower's art is generated once (seeded, deterministic) so the modal
 * scene and the garden preview show exactly the same drawing.
 */

/** Deterministic pseudo-random in [0, 1) for a numeric seed */
export const sr = (n) => { const x = Math.sin(n * 9301 + 49297) * 233280; return x - Math.floor(x); };

/** Seeded random generator: rnd(min, max) */
export const makeRng = (seed) => {
  let i = 0;
  return (min = 0, max = 1) => min + sr(seed + (i++) * 7.13) * (max - min);
};

export const f2 = (n) => n.toFixed(2);

export const svgUrl = (svg) => `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;

/** Smooth closed path through the midpoints of a point list */
export const smoothClosed = (pts) => {
  const n = pts.length;
  const mid = (a, b) => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
  const m0 = mid(pts[n - 1], pts[0]);
  let d = `M ${f2(m0[0])} ${f2(m0[1])}`;
  for (let i = 0; i < n; i++) {
    const p = pts[i];
    const m = mid(p, pts[(i + 1) % n]);
    d += ` Q ${f2(p[0])} ${f2(p[1])} ${f2(m[0])} ${f2(m[1])}`;
  }
  return `${d} Z`;
};

/** Smooth open path through the midpoints of a point list (for rims, veins) */
export const smoothOpen = (pts) => {
  let d = `M ${f2(pts[0][0])} ${f2(pts[0][1])}`;
  for (let i = 1; i < pts.length - 1; i++) {
    const p = pts[i], q = pts[i + 1];
    d += ` Q ${f2(p[0])} ${f2(p[1])} ${f2((p[0] + q[0]) / 2)} ${f2((p[1] + q[1]) / 2)}`;
  }
  const last = pts[pts.length - 1];
  return `${d} L ${f2(last[0])} ${f2(last[1])}`;
};

/** Mix two #rrggbb colors, t in [0, 1] */
export const mixHex = (a, b, t) => {
  const pa = parseInt(a.slice(1), 16), pb = parseInt(b.slice(1), 16);
  const ch = (p, s) => (p >> s) & 255;
  const c = (s) => Math.round(ch(pa, s) + (ch(pb, s) - ch(pa, s)) * t);
  return `#${((1 << 24) | (c(16) << 16) | (c(8) << 8) | c(0)).toString(16).slice(1)}`;
};

/** How much a petal pointing at `deg` (0 = up, clockwise) faces a top-left light, 0..1 */
export const litFrom = (deg) => {
  const a = (deg * Math.PI) / 180;
  return 0.5 + 0.5 * (-0.707 * Math.sin(a) + 0.707 * Math.cos(a));
};

/**
 * Jittered grid over the viewport (in %), so the whole screen gets covered
 * evenly — no empty edges like a pure random or bell-curve spread.
 */
export const coverGrid = ({ cols, rows, seed, from = -6, to = 106 }) => {
  const span = to - from;
  const cells = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const s = seed + r * 131 + c * 17;
      cells.push({
        x: from + ((c + 0.5 + (sr(s) - 0.5) * 0.95) / cols) * span,
        y: from + ((r + 0.5 + (sr(s + 1) - 0.5) * 0.95) / rows) * span,
        s,
      });
    }
  }
  return cells;
};

/** Pick a deterministic item from a list for a numeric seed */
export const pick = (list, s) => list[Math.floor(sr(s) * list.length)];

/** Reusable soft drop shadow filter; reference it as filter="url(#<id>)" */
export const shadow = (id = 'sh', dy = 1.4, blur = 2.2, opacity = 0.42) =>
  `<filter id="${id}" x="-60%" y="-60%" width="220%" height="220%">` +
  `<feDropShadow dx="0" dy="${dy}" stdDeviation="${blur}" flood-color="#000" flood-opacity="${opacity}"/></filter>`;
