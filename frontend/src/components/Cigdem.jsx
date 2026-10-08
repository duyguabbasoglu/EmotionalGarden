import React from 'react';
import FlowerLoader from './FlowerLoader';
import ArtScene from './ArtScene';
import { useFlowerGrowth } from '../hooks/useFlowerGrowth';
import { sr, coverGrid } from '../utils/svgArt';
import { OPEN_URLS, GOBLET_URLS, GRASS_URLS } from '../utils/cigdemArt';

/*
 * An early-spring crocus meadow: grass-like clumps everywhere, open flowers
 * facing the sun and closed goblets still waiting in between.
 */
const pick = (list, s) => list[Math.floor(sr(s) * list.length)];

const GRASS = coverGrid({ cols: 20, rows: 12, seed: 2100 }).map((c, i) => ({
  id: `g-${i}`,
  x: c.x, y: c.y,
  scale: 0.61 + sr(c.s + 3) * 0.54,
  rotation: sr(c.s + 4) * 360,
  delay: sr(c.s + 5) * 1.4,
  zIndex: 1 + Math.floor(sr(c.s + 6) * 15),
  src: pick(GRASS_URLS, c.s + 7),
}));

const GOBLETS = coverGrid({ cols: 15, rows: 8, seed: 3300 }).map((c, i) => ({
  id: `c-${i}`,
  x: c.x, y: c.y,
  scale: 0.41 + sr(c.s + 3) * 0.31,
  rotation: (sr(c.s + 4) - 0.5) * 40,
  delay: 0.2 + sr(c.s + 5) * 2.4,
  zIndex: 20 + Math.floor(sr(c.s + 6) * 100),
  src: pick(GOBLET_URLS, c.s + 7),
}));

const OPEN = [
  ...coverGrid({ cols: 18, rows: 11, seed: 400 }),
  ...coverGrid({ cols: 11, rows: 7, seed: 8800 }),
].map((c, i) => ({
  id: `o-${i}`,
  x: c.x, y: c.y,
  scale: 0.31 + sr(c.s + 3) * 0.31,
  rotation: sr(c.s + 4) * 360,
  delay: 0.3 + sr(c.s + 5) * 2.5,
  zIndex: 20 + Math.floor(sr(c.s + 6) * 110),
  src: pick(OPEN_URLS, c.s + 7),
}));

const SCENE = [...GRASS, ...GOBLETS, ...OPEN];

const Cigdem = () => {
  const { bloomed, loading, progress } = useFlowerGrowth(3500);

  return (
    <div style={{
      position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none',
      background: 'radial-gradient(circle at 45% 55%, #3a4a1e 0%, #26361a 45%, #172310 85%, #0b1208 100%)'
    }}>
      {/* Early spring meadow light */}
      <div style={{ position: 'absolute', top: '15%', left: '20%', width: '500px', height: '500px', background: '#5a7d34', borderRadius: '50%', filter: 'blur(130px)', opacity: 0.35 }} />
      <div style={{ position: 'absolute', bottom: '5%', right: '10%', width: '450px', height: '450px', background: '#4a3a24', borderRadius: '50%', filter: 'blur(110px)', opacity: 0.4 }} />
      <div style={{ position: 'absolute', top: '5%', right: '25%', width: '400px', height: '400px', background: '#4a2a90', borderRadius: '50%', filter: 'blur(120px)', opacity: 0.15 }} />

      <FlowerLoader
        loading={loading}
        progress={progress}
        message="Çiğdemler açıyor..."
        glowColor="rgba(140, 100, 220, 0.9)"
        barStyle={{ background: '#6e48b8' }}
      />

      <ArtScene items={SCENE} bloomed={bloomed} />
    </div>
  );
};

export default Cigdem;
