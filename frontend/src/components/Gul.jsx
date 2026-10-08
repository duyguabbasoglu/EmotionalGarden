import React from 'react';
import FlowerLoader from './FlowerLoader';
import ArtScene from './ArtScene';
import { useFlowerGrowth } from '../hooks/useFlowerGrowth';
import { sr, coverGrid } from '../utils/svgArt';
import { ROSE_URLS, ROSE_LEAF_URLS, BUD_URLS } from '../utils/gulArt';

/*
 * A rose bed seen from above: a dense carpet of dark rose leaves, full
 * velvet-red blooms reaching every edge, and a few buds tucked in between.
 */
const LEAVES = coverGrid({ cols: 18, rows: 11, seed: 1200 }).map((c, i) => ({
  id: `l-${i}`,
  x: c.x, y: c.y,
  scale: 0.95 + sr(c.s + 3) * 0.82,
  rotation: sr(c.s + 4) * 360,
  delay: sr(c.s + 5) * 1.4,
  zIndex: 1 + Math.floor(sr(c.s + 6) * 10),
  src: ROSE_LEAF_URLS[Math.floor(sr(c.s + 7) * ROSE_LEAF_URLS.length)],
}));

const ROSES = [
  ...coverGrid({ cols: 16, rows: 11, seed: 300 }),
  ...coverGrid({ cols: 11, rows: 7, seed: 7700 }),
].map((c, i) => ({
  id: `r-${i}`,
  x: c.x, y: c.y,
  scale: 0.37 + sr(c.s + 3) * 0.51,
  rotation: sr(c.s + 4) * 360,
  delay: 0.3 + sr(c.s + 5) * 2.6,
  zIndex: 30 + Math.floor(sr(c.s + 6) * 100),
  src: ROSE_URLS[Math.floor(sr(c.s + 7) * ROSE_URLS.length)],
}));

const BUDS = coverGrid({ cols: 9, rows: 5, seed: 5100 }).map((c, i) => ({
  id: `b-${i}`,
  x: c.x, y: c.y,
  scale: 0.48 + sr(c.s + 3) * 0.34,
  rotation: (sr(c.s + 4) - 0.5) * 70,
  delay: sr(c.s + 5) * 2,
  zIndex: 12 + Math.floor(sr(c.s + 6) * 15),
  src: BUD_URLS[Math.floor(sr(c.s + 7) * BUD_URLS.length)],
}));

const SCENE = [...LEAVES, ...BUDS, ...ROSES];

const Gul = () => {
  const { bloomed, loading, progress } = useFlowerGrowth(4000);

  return (
    <div style={{
      position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none',
      background: 'radial-gradient(ellipse at 45% 55%, #1e2a12 0%, #121a0a 45%, #0a0f06 80%, #050803 100%)',
    }}>
      {/* Atmospheric glow orbs */}
      <div style={{ position: 'absolute', top: '-5%', left: '15%', width: '500px', height: '500px', background: '#5a0015', borderRadius: '50%', filter: 'blur(140px)', opacity: 0.35 }} />
      <div style={{ position: 'absolute', bottom: '-8%', left: '25%', width: '600px', height: '400px', background: '#1c3a0e', borderRadius: '50%', filter: 'blur(120px)', opacity: 0.40 }} />
      <div style={{ position: 'absolute', top: '40%', right: '5%', width: '400px', height: '400px', background: '#800025', borderRadius: '50%', filter: 'blur(130px)', opacity: 0.18 }} />

      <FlowerLoader
        loading={loading}
        progress={progress}
        message="Güller açıyor..."
        glowColor="rgba(255, 80, 100, 0.9)"
        barStyle={{ background: '#a8162c' }}
      />

      <ArtScene items={SCENE} bloomed={bloomed} />
    </div>
  );
};

export default Gul;
