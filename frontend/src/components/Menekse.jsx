import React from 'react';
import FlowerLoader from './FlowerLoader';
import ArtScene from './ArtScene';
import { useFlowerGrowth } from '../hooks/useFlowerGrowth';
import { sr, pick, coverGrid } from '../utils/svgArt';
import { VIOLET_CLUMP_URLS, VIOLET_BLOOM_URLS, VIOLET_LEAF_URLS } from '../utils/menekseArt';

/*
 * February violets — a bank of them under bare trees, which is where you
 * actually find menekşe. Violets are a ground-cover plant, so the scene is
 * built in horizontal bands rather than as scattered specimens: a deep carpet
 * of heart leaves, clumps standing in it, and single blooms picked out on top.
 */
const LEAVES = coverGrid({ cols: 15, rows: 11, seed: 41000 }).map((c, i) => ({
  id: `l-${i}`,
  x: c.x, y: c.y,
  scale: 0.75 + sr(c.s + 3) * 0.61,
  rotation: (sr(c.s + 4) - 0.5) * 70,
  delay: sr(c.s + 5) * 1.4,
  zIndex: 1 + Math.floor(sr(c.s + 6) * 12),
  src: pick(VIOLET_LEAF_URLS, c.s + 7),
}));

const CLUMPS = [
  ...coverGrid({ cols: 12, rows: 8, seed: 41600 }),
  ...coverGrid({ cols: 8, rows: 5, seed: 42100 }),
].map((c, i) => ({
  id: `c-${i}`,
  x: c.x, y: c.y,
  scale: 0.58 + sr(c.s + 3) * 0.54,
  // violets sit low and upright; a wide spin would read as litter
  rotation: (sr(c.s + 4) - 0.5) * 22,
  delay: 0.2 + sr(c.s + 5) * 2.4,
  zIndex: 20 + Math.floor(sr(c.s + 6) * 80),
  src: pick(VIOLET_CLUMP_URLS, c.s + 7),
}));

const BLOOMS = coverGrid({ cols: 14, rows: 9, seed: 42700 }).map((c, i) => ({
  id: `b-${i}`,
  x: c.x, y: c.y,
  scale: 0.27 + sr(c.s + 3) * 0.37,
  rotation: (sr(c.s + 4) - 0.5) * 60,
  delay: 0.45 + sr(c.s + 5) * 2.4,
  zIndex: 110 + Math.floor(sr(c.s + 6) * 60),
  src: pick(VIOLET_BLOOM_URLS, c.s + 7),
}));

const SCENE = [...LEAVES, ...CLUMPS, ...BLOOMS];

const Menekse = () => {
  const { bloomed, loading, progress } = useFlowerGrowth(3500);

  return (
    <div style={{
      position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none',
      background: 'radial-gradient(ellipse at 44% 42%, #3b2a52 0%, #241a38 40%, #141026 75%, #0a0716 100%)',
    }}>
      {/* late-winter light coming through, cool and low */}
      <div style={{ position: 'absolute', top: '-8%', left: '12%', width: '560px', height: '500px', background: '#6a3d9a', borderRadius: '50%', filter: 'blur(150px)', opacity: 0.3 }} />
      <div style={{ position: 'absolute', bottom: '-10%', right: '10%', width: '580px', height: '460px', background: '#2c5a38', borderRadius: '50%', filter: 'blur(130px)', opacity: 0.45 }} />
      <div style={{ position: 'absolute', top: '36%', right: '-8%', width: '420px', height: '420px', background: '#9566cc', borderRadius: '50%', filter: 'blur(160px)', opacity: 0.16 }} />
      <div style={{ position: 'absolute', bottom: '18%', left: '-8%', width: '440px', height: '440px', background: '#1f4428', borderRadius: '50%', filter: 'blur(120px)', opacity: 0.4 }} />
      <div style={{ position: 'absolute', top: '58%', left: '38%', width: '360px', height: '360px', background: '#c8a8e8', borderRadius: '50%', filter: 'blur(150px)', opacity: 0.1 }} />

      <FlowerLoader
        loading={loading}
        progress={progress}
        message="Menekşeler açıyor..."
        glowColor="rgba(180, 130, 230, 0.9)"
        barStyle={{ background: '#7c43bb' }}
      />

      <ArtScene items={SCENE} bloomed={bloomed} />
    </div>
  );
};

export default Menekse;
