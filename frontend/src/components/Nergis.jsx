import React from 'react';
import FlowerLoader from './FlowerLoader';
import ArtScene from './ArtScene';
import { useFlowerGrowth } from '../hooks/useFlowerGrowth';
import { sr, pick, coverGrid } from '../utils/svgArt';
import { DAFFODIL_URLS, DAFF_CLUMP_URLS, DAFF_LEAF_URLS } from '../utils/nergisArt';

/*
 * A March daffodil bank: strap leaves everywhere, clumps of two or three
 * flowers on their scapes, and single heads turned to the first warm light.
 */
const LEAVES = coverGrid({ cols: 15, rows: 9, seed: 20100 }).map((c, i) => ({
  id: `l-${i}`,
  x: c.x, y: c.y,
  scale: 0.82 + sr(c.s + 3) * 0.68,
  rotation: (sr(c.s + 4) - 0.5) * 60,
  delay: sr(c.s + 5) * 1.4,
  zIndex: 1 + Math.floor(sr(c.s + 6) * 10),
  src: pick(DAFF_LEAF_URLS, c.s + 7),
}));

const CLUMPS = [
  ...coverGrid({ cols: 12, rows: 8, seed: 20600 }),
  ...coverGrid({ cols: 8, rows: 5, seed: 21100 }),
].map((c, i) => ({
  id: `c-${i}`,
  x: c.x, y: c.y,
  scale: 0.61 + sr(c.s + 3) * 0.58,
  rotation: (sr(c.s + 4) - 0.5) * 20,
  delay: 0.2 + sr(c.s + 5) * 2.4,
  zIndex: 20 + Math.floor(sr(c.s + 6) * 80),
  src: pick(DAFF_CLUMP_URLS, c.s + 7),
}));

const HEADS = coverGrid({ cols: 16, rows: 11, seed: 21600 }).map((c, i) => ({
  id: `h-${i}`,
  x: c.x, y: c.y,
  scale: 0.23 + sr(c.s + 3) * 0.24,
  rotation: sr(c.s + 4) * 360,
  delay: 0.4 + sr(c.s + 5) * 2.4,
  zIndex: 100 + Math.floor(sr(c.s + 6) * 60),
  src: pick(DAFFODIL_URLS, c.s + 7),
}));

const SCENE = [...LEAVES, ...CLUMPS, ...HEADS];

const Nergis = () => {
  const { bloomed, loading, progress } = useFlowerGrowth(3500);

  return (
    <div style={{
      position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none',
      background: 'radial-gradient(ellipse at 45% 42%, #3f6b2c 0%, #2c4e1d 45%, #1a3011 85%, #0d1c08 100%)',
    }}>
      {/* Fresh spring green under a pale, newly warm sky */}
      <div style={{ position: 'absolute', top: '-8%', left: '14%', width: '560px', height: '500px', background: '#9fd04a', borderRadius: '50%', filter: 'blur(150px)', opacity: 0.22 }} />
      <div style={{ position: 'absolute', top: '6%', right: '-4%', width: '470px', height: '470px', background: '#7fb0d8', borderRadius: '50%', filter: 'blur(150px)', opacity: 0.14 }} />
      <div style={{ position: 'absolute', bottom: '-6%', left: '30%', width: '600px', height: '420px', background: '#2d5a18', borderRadius: '50%', filter: 'blur(120px)', opacity: 0.45 }} />
      <div style={{ position: 'absolute', top: '44%', left: '48%', width: '400px', height: '400px', background: '#fff0a0', borderRadius: '50%', filter: 'blur(140px)', opacity: 0.12 }} />

      <FlowerLoader
        loading={loading}
        progress={progress}
        message="Nergisler güneşe dönüyor..."
        glowColor="rgba(255, 220, 60, 0.9)"
        barStyle={{ background: '#f0c42a' }}
      />

      <ArtScene items={SCENE} bloomed={bloomed} />
    </div>
  );
};

export default Nergis;
