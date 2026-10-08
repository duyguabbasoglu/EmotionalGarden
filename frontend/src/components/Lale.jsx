import React from 'react';
import FlowerLoader from './FlowerLoader';
import ArtScene from './ArtScene';
import { useFlowerGrowth } from '../hooks/useFlowerGrowth';
import { sr, pick, coverGrid } from '../utils/svgArt';
import { TULIP_URLS, TULIP_HEAD_URLS, TULIP_LEAF_URLS } from '../utils/laleArt';

/*
 * April tulips — a bed of them in an Istanbul park, planted close and all
 * standing to attention.
 *
 * Rotation is held to a few degrees everywhere in this scene. Every other
 * flower here is allowed to tumble, but a tulip that tips over stops being a
 * tulip, and a bed of them is only beautiful because they all point the same
 * way. The colours are mixed rather than blocked, the way a park bed is.
 */
const LEAVES = coverGrid({ cols: 15, rows: 9, seed: 47000 }).map((c, i) => ({
  id: `l-${i}`,
  x: c.x, y: c.y,
  scale: 0.75 + sr(c.s + 3) * 0.61,
  rotation: (sr(c.s + 4) - 0.5) * 30,
  delay: sr(c.s + 5) * 1.4,
  zIndex: 1 + Math.floor(sr(c.s + 6) * 12),
  src: pick(TULIP_LEAF_URLS, c.s + 7),
}));

const PLANTS = [
  ...coverGrid({ cols: 14, rows: 9, seed: 47600 }),
  ...coverGrid({ cols: 9, rows: 7, seed: 48100 }),
].map((c, i) => ({
  id: `p-${i}`,
  x: c.x, y: c.y,
  scale: 0.54 + sr(c.s + 3) * 0.54,
  rotation: (sr(c.s + 4) - 0.5) * 14,
  delay: 0.2 + sr(c.s + 5) * 2.5,
  zIndex: 20 + Math.floor(sr(c.s + 6) * 90),
  src: pick(TULIP_URLS, c.s + 7),
}));

const HEADS = coverGrid({ cols: 12, rows: 8, seed: 48800 }).map((c, i) => ({
  id: `h-${i}`,
  x: c.x, y: c.y,
  scale: 0.37 + sr(c.s + 3) * 0.41,
  rotation: (sr(c.s + 4) - 0.5) * 12,
  delay: 0.45 + sr(c.s + 5) * 2.4,
  zIndex: 120 + Math.floor(sr(c.s + 6) * 60),
  src: pick(TULIP_HEAD_URLS, c.s + 7),
}));

const SCENE = [...LEAVES, ...PLANTS, ...HEADS];

const Lale = () => {
  const { bloomed, loading, progress } = useFlowerGrowth(3600);

  return (
    <div style={{
      position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none',
      background: 'radial-gradient(ellipse at 50% 38%, #3c4a2c 0%, #2a3620 42%, #16200f 78%, #0a1006 100%)',
    }}>
      {/* clear April light, with the bed throwing colour back up */}
      <div style={{ position: 'absolute', top: '-10%', left: '14%', width: '580px', height: '500px', background: '#8fae5a', borderRadius: '50%', filter: 'blur(150px)', opacity: 0.3 }} />
      <div style={{ position: 'absolute', bottom: '-8%', right: '8%', width: '560px', height: '460px', background: '#a81d2a', borderRadius: '50%', filter: 'blur(150px)', opacity: 0.2 }} />
      <div style={{ position: 'absolute', top: '42%', right: '-6%', width: '420px', height: '420px', background: '#d9635c', borderRadius: '50%', filter: 'blur(160px)', opacity: 0.16 }} />
      <div style={{ position: 'absolute', bottom: '16%', left: '-8%', width: '440px', height: '440px', background: '#4f1b7d', borderRadius: '50%', filter: 'blur(140px)', opacity: 0.16 }} />
      <div style={{ position: 'absolute', top: '-6%', right: '-8%', width: '400px', height: '400px', background: '#f3c62c', borderRadius: '50%', filter: 'blur(160px)', opacity: 0.12 }} />

      <FlowerLoader
        loading={loading}
        progress={progress}
        message="Laleler açıyor..."
        glowColor="rgba(255, 120, 110, 0.9)"
        barStyle={{ background: '#d13a3f' }}
      />

      <ArtScene items={SCENE} bloomed={bloomed} />
    </div>
  );
};

export default Lale;
