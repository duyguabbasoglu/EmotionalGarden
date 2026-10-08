import { sr } from './svgArt';

/*
 * Where the flowers actually sit in the 4x6 garden.
 *
 * They used to be hardcoded onto every other plot — (row + col) even — which
 * made the calendar easy to read but turned the garden into a checkerboard of
 * flower, gap, flower, gap. Nothing in a real garden is spaced like that.
 *
 * So the plots are chosen rather than listed. The choice is seeded, so it is
 * identical on every render, every refresh and every machine — this is not a
 * garden that rearranges itself behind your back — but it is picked by
 * searching for a layout that *looks* unplanned instead of by following a
 * rule, which is the only way to get scatter that is also balanced.
 */

export const ROWS = 4;
export const COLS = 6;
const PLOTS = ROWS * COLS;

const rc = (i) => ({ row: Math.floor(i / COLS), col: i % COLS });

/* Seeded Fisher-Yates over the plot indices */
const shuffle = (seed) => {
  const a = Array.from({ length: PLOTS }, (_, i) => i);
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(sr(seed + i * 3.7) * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

/*
 * How bad a candidate layout looks, lower being better. Everything here is a
 * penalty for one specific way a scatter of thirteen things across twenty-four
 * plots can go wrong, and the weights are what hold "random" and "balanced"
 * apart — drop the spread terms and you get clumps, drop the clump terms and
 * you get the checkerboard back.
 */
const score = (idx) => {
  const taken = new Set(idx);
  const cells = idx.map(rc);
  const at = (r, c) =>
    r >= 0 && r < ROWS && c >= 0 && c < COLS && taken.has(r * COLS + c);

  const rowN = Array(ROWS).fill(0);
  const colN = Array(COLS).fill(0);
  let parity = 0;
  cells.forEach(({ row, col }) => {
    rowN[row] += 1;
    colN[col] += 1;
    parity += (row + col) % 2 ? 1 : -1;
  });

  let s = 0;

  // every row and column has to carry some of the garden, or the board tips
  rowN.forEach((n) => { if (n < 2) s += 24; if (n > 5) s += 18; });
  colN.forEach((n) => { if (n < 1) s += 30; if (n > 3) s += 14; });

  // A perfect checkerboard is not random by any measure someone looking at it
  // would accept — it is the pattern we are getting away from, and it scores
  // beautifully on spread. Holding the two parities near even is what stops
  // the search walking straight back into it.
  s += Math.abs(parity) * 4;

  cells.forEach(({ row, col }) => {
    // touching pairs are fine in ones and twos; blocks and runs are not
    if (at(row, col + 1)) s += 3;
    if (at(row + 1, col)) s += 3;
    if (at(row, col + 1) && at(row + 1, col) && at(row + 1, col + 1)) s += 10;
    if (at(row, col + 1) && at(row, col + 2)) s += 6;
    if (at(row + 1, col) && at(row + 2, col)) s += 6;
  });

  // ...and the opposite failure: a dead quarter of the board
  for (let r = 0; r <= ROWS - 2; r += 1) {
    for (let c = 0; c <= COLS - 3; c += 1) {
      let n = 0;
      for (let dr = 0; dr < 2; dr += 1) {
        for (let dc = 0; dc < 3; dc += 1) if (at(r + dr, c + dc)) n += 1;
      }
      if (n === 0) s += 20;
    }
  }

  return s;
};

/* The best-looking scatter of `count` plots, searched once at module load */
export const scatterPlots = (count, seeds = 800) => {
  let best = null;
  let bestScore = Infinity;
  for (let i = 0; i < seeds; i += 1) {
    const idx = shuffle(1000 + i * 17).slice(0, count);
    const sc = score(idx);
    if (sc < bestScore) { bestScore = sc; best = idx; }
  }
  return { cells: best.map(rc), score: bestScore };
};

/** Reading order: left to right, top to bottom */
export const inReadingOrder = (cells) =>
  [...cells].sort((a, b) => a.row - b.row || a.col - b.col);

/** Chebyshev distance — one plot step in any direction, diagonals included */
const dist = (a, b) => Math.max(Math.abs(a.row - b.row), Math.abs(a.col - b.col));

/*
 * Which of the chosen plots should hold the hidden thirteenth.
 *
 * It takes the plot standing furthest off on its own — most elbow room, then
 * deepest out of the crowd. Those two almost always tie across the board's
 * corners, and the tie is broken towards the end of the reading order on
 * purpose: a bonus month sitting in the very first plot would read as the
 * start of the calendar rather than as something extra, and it would push
 * January off the top-left corner where it belongs.
 */
export const mostSecludedCell = (cells) => {
  // The calendar starts at the first plot, so that one is never on offer
  // however secluded it happens to be: a bonus month in the opening bed would
  // read as January and push January somewhere it does not belong.
  const first = inReadingOrder(cells)[0];
  const candidates = cells.filter((c) => c !== first);

  let best = candidates[0];
  let bestKey = [-1, -1, -1];
  candidates.forEach((cell) => {
    const others = cells.filter((o) => o !== cell);
    const key = [
      Math.min(...others.map((o) => dist(cell, o))),
      others.reduce((t, o) => t + dist(cell, o), 0),
      cell.row * COLS + cell.col,
    ];
    const better = key.some((v, i) =>
      v !== bestKey[i] && key.slice(0, i).every((x, j) => x === bestKey[j]) && v > bestKey[i]);
    if (better) { bestKey = key; best = cell; }
  });
  return best;
};

