import React from 'react';
import FlowerLoader from './FlowerLoader';
import ArtScene from './ArtScene';
import { useFlowerGrowth } from '../hooks/useFlowerGrowth';
import { sr, pick, coverGrid } from '../utils/svgArt';
import { SUNFLOWER_URLS, SUN_LEAF_URLS } from '../utils/aycicegiArt';
import { DAISY_URLS, DAISY_TUFT_URLS, DAISY_GRASS_URLS } from '../utils/papatyaArt';

/*
 * August: a Thracian sunflower field with daisies coming up between the rows.
 *
 * This is the one month that carries two flowers, and the composition is
 * deliberately unequal. The sunflowers are the hero — drawn large, placed on
 * a coarse grid so each head has room, and layered above everything else. The
 * daisies are companions: small, low, dense, and kept to the gaps, so they
 * read as the sweet detail at the sunflowers' feet rather than as a second
 * flower competing for the eye.
 *
 * Scale is doing most of that work. The daisy heads top out at about a third
 * of a sunflower's, which is roughly their real ratio, and is why the pairing
 * looks like a field rather than a collage.
 */

/* ── ground: sunflower foliage, then meadow grass between the stems ── */
const LEAVES = coverGrid({ cols: 15, rows: 9, seed: 5200 }).map((c, i) => ({
  id: `l-${i}`,
  x: c.x, y: c.y,
  scale: 0.75 + sr(c.s + 3) * 0.54,
  rotation: sr(c.s + 4) * 360,
  delay: sr(c.s + 5) * 1.4,
  zIndex: 1 + Math.floor(sr(c.s + 6) * 10),
  src: pick(SUN_LEAF_URLS, c.s + 7),
}));

const GRASS = coverGrid({ cols: 18, rows: 11, seed: 57300 }).map((c, i) => ({
  id: `g-${i}`,
  x: c.x, y: c.y,
  scale: 0.51 + sr(c.s + 3) * 0.41,
  rotation: (sr(c.s + 4) - 0.5) * 40,
  delay: 0.1 + sr(c.s + 5) * 1.5,
  zIndex: 14 + Math.floor(sr(c.s + 6) * 10),
  src: pick(DAISY_GRASS_URLS, c.s + 7),
}));

/* ── the companions: daisy tufts low down, kept small ── */
const TUFTS = coverGrid({ cols: 12, rows: 8, seed: 57900 }).map((c, i) => ({
  id: `t-${i}`,
  x: c.x, y: c.y,
  scale: 0.31 + sr(c.s + 3) * 0.27,
  rotation: (sr(c.s + 4) - 0.5) * 20,
  delay: 0.25 + sr(c.s + 5) * 2.1,
  zIndex: 28 + Math.floor(sr(c.s + 6) * 24),
  src: pick(DAISY_TUFT_URLS, c.s + 7),
}));

/* ── the hero: golden heads, large and above everything ── */
const HEADS = [
  ...coverGrid({ cols: 12, rows: 8, seed: 600 }),
  ...coverGrid({ cols: 8, rows: 5, seed: 6600 }),
].map((c, i) => ({
  id: `h-${i}`,
  x: c.x, y: c.y,
  scale: 0.48 + sr(c.s + 3) * 0.37,
  rotation: sr(c.s + 4) * 360,
  delay: 0.3 + sr(c.s + 5) * 2.5,
  zIndex: 60 + Math.floor(sr(c.s + 6) * 100),
  src: pick(SUNFLOWER_URLS, c.s + 7),
}));

/* ── a last dusting of single daisies, caught in front of the stems ── */
const DAISIES = coverGrid({ cols: 14, rows: 9, seed: 58500 }).map((c, i) => ({
  id: `d-${i}`,
  x: c.x, y: c.y,
  scale: 0.15 + sr(c.s + 3) * 0.18,
  rotation: sr(c.s + 4) * 360,
  delay: 0.55 + sr(c.s + 5) * 2.4,
  zIndex: 170 + Math.floor(sr(c.s + 6) * 30),
  src: pick(DAISY_URLS, c.s + 7),
}));

const SCENE = [...LEAVES, ...GRASS, ...TUFTS, ...HEADS, ...DAISIES];

const AycicegiPapatya = () => {
  const { bloomed, loading, progress } = useFlowerGrowth(3800);

  return (
    <div style={{
      position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none',
      background: 'radial-gradient(ellipse at 50% 40%, #3e5a1c 0%, #2a4212 45%, #16240a 85%, #0b1405 100%)',
    }}>
      {/* Warm late-summer light */}
      <div style={{ position: 'absolute', top: '-10%', left: '10%', width: '600px', height: '500px', background: '#ffb300', borderRadius: '50%', filter: 'blur(150px)', opacity: 0.18 }} />
      <div style={{ position: 'absolute', bottom: '-5%', right: '5%', width: '500px', height: '450px', background: '#2f5a14', borderRadius: '50%', filter: 'blur(120px)', opacity: 0.45 }} />
      <div style={{ position: 'absolute', top: '40%', left: '45%', width: '400px', height: '400px', background: '#e08a00', borderRadius: '50%', filter: 'blur(140px)', opacity: 0.12 }} />
      <div style={{ position: 'absolute', bottom: '14%', left: '-8%', width: '420px', height: '420px', background: '#fff7d0', borderRadius: '50%', filter: 'blur(160px)', opacity: 0.1 }} />

      <FlowerLoader
        loading={loading}
        progress={progress}
        message="Ayçiçekleri güneşe dönüyor..."
        glowColor="rgba(255, 190, 40, 0.9)"
        barStyle={{ background: '#f5b301' }}
      />

      <ArtScene items={SCENE} bloomed={bloomed} />
    </div>
  );
};

export default AycicegiPapatya;
