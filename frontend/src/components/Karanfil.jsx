import React from 'react';
import FlowerLoader from './FlowerLoader';
import ArtScene from './ArtScene';
import { useFlowerGrowth } from '../hooks/useFlowerGrowth';
import { sr, pick, coverGrid } from '../utils/svgArt';
import { CARNATION_URLS, CARN_STEM_URLS, CARN_BUD_URLS, CARN_LEAF_URLS } from '../utils/karanfilArt';

/*
 * A May carnation bed at dusk: a tangle of narrow blue-green foliage, buds
 * still in their calyx tubes, stems carrying their blooms up, and the fringed
 * heads themselves crowding the whole frame.
 */
const LEAVES = coverGrid({ cols: 16, rows: 11, seed: 24100 }).map((c, i) => ({
  id: `l-${i}`,
  x: c.x, y: c.y,
  scale: 0.82 + sr(c.s + 3) * 0.68,
  rotation: sr(c.s + 4) * 360,
  delay: sr(c.s + 5) * 1.4,
  zIndex: 1 + Math.floor(sr(c.s + 6) * 10),
  src: pick(CARN_LEAF_URLS, c.s + 7),
}));

const BUDS = coverGrid({ cols: 11, rows: 7, seed: 24600 }).map((c, i) => ({
  id: `b-${i}`,
  x: c.x, y: c.y,
  scale: 0.41 + sr(c.s + 3) * 0.34,
  rotation: (sr(c.s + 4) - 0.5) * 50,
  delay: sr(c.s + 5) * 2,
  zIndex: 14 + Math.floor(sr(c.s + 6) * 14),
  src: pick(CARN_BUD_URLS, c.s + 7),
}));

const STEMS = coverGrid({ cols: 14, rows: 9, seed: 25100 }).map((c, i) => ({
  id: `s-${i}`,
  x: c.x, y: c.y,
  scale: 0.54 + sr(c.s + 3) * 0.48,
  rotation: (sr(c.s + 4) - 0.5) * 24,
  delay: 0.2 + sr(c.s + 5) * 2.3,
  zIndex: 30 + Math.floor(sr(c.s + 6) * 50),
  src: pick(CARN_STEM_URLS, c.s + 7),
}));

const HEADS = [
  ...coverGrid({ cols: 15, rows: 9, seed: 25600 }),
  ...coverGrid({ cols: 9, rows: 7, seed: 26100 }),
].map((c, i) => ({
  id: `h-${i}`,
  x: c.x, y: c.y,
  scale: 0.29 + sr(c.s + 3) * 0.34,
  rotation: sr(c.s + 4) * 360,
  delay: 0.4 + sr(c.s + 5) * 2.5,
  zIndex: 90 + Math.floor(sr(c.s + 6) * 80),
  src: pick(CARNATION_URLS, c.s + 7),
}));

const SCENE = [...LEAVES, ...BUDS, ...STEMS, ...HEADS];

const Karanfil = () => {
  const { bloomed, loading, progress } = useFlowerGrowth(3500);

  return (
    <div style={{
      position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none',
      background: 'radial-gradient(ellipse at 46% 54%, #4a2430 0%, #351a24 45%, #200f17 85%, #10070b 100%)',
    }}>
      {/* Warm rose dusk with sage green underneath */}
      <div style={{ position: 'absolute', top: '-8%', left: '12%', width: '560px', height: '500px', background: '#c2566f', borderRadius: '50%', filter: 'blur(150px)', opacity: 0.26 }} />
      <div style={{ position: 'absolute', bottom: '-8%', left: '26%', width: '620px', height: '430px', background: '#3f6b50', borderRadius: '50%', filter: 'blur(130px)', opacity: 0.4 }} />
      <div style={{ position: 'absolute', top: '36%', right: '-6%', width: '450px', height: '450px', background: '#8d1f3c', borderRadius: '50%', filter: 'blur(140px)', opacity: 0.3 }} />
      <div style={{ position: 'absolute', top: '62%', left: '-8%', width: '400px', height: '400px', background: '#b47a62', borderRadius: '50%', filter: 'blur(150px)', opacity: 0.16 }} />

      <FlowerLoader
        loading={loading}
        progress={progress}
        message="Karanfiller açıyor..."
        glowColor="rgba(255, 150, 175, 0.9)"
        barStyle={{ background: '#e0564f' }}
      />

      <ArtScene items={SCENE} bloomed={bloomed} />
    </div>
  );
};

export default Karanfil;
