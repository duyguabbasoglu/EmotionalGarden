import React from 'react';
import FlowerLoader from './FlowerLoader';
import ArtScene from './ArtScene';
import { useFlowerGrowth } from '../hooks/useFlowerGrowth';
import { sr, coverGrid } from '../utils/svgArt';
import { SPRAY_URLS, HEAD_URLS, ASTER_LEAF_URLS } from '../utils/asterArt';

/*
 * An early-autumn aster border: a leafy mound covered in hundreds of
 * little blue stars.
 */
const pick = (list, s) => list[Math.floor(sr(s) * list.length)];

const LEAVES = coverGrid({ cols: 16, rows: 9, seed: 7300 }).map((c, i) => ({
  id: `l-${i}`,
  x: c.x, y: c.y,
  scale: 0.68 + sr(c.s + 3) * 0.54,
  rotation: sr(c.s + 4) * 360,
  delay: sr(c.s + 5) * 1.4,
  zIndex: 1 + Math.floor(sr(c.s + 6) * 10),
  src: pick(ASTER_LEAF_URLS, c.s + 7),
}));

const SPRAYS = coverGrid({ cols: 15, rows: 9, seed: 800 }).map((c, i) => ({
  id: `s-${i}`,
  x: c.x, y: c.y,
  scale: 0.51 + sr(c.s + 3) * 0.34,
  rotation: sr(c.s + 4) * 360,
  delay: 0.2 + sr(c.s + 5) * 2.4,
  zIndex: 20 + Math.floor(sr(c.s + 6) * 60),
  src: pick(SPRAY_URLS, c.s + 7),
}));

const HEADS = coverGrid({ cols: 19, rows: 12, seed: 9900 }).map((c, i) => ({
  id: `h-${i}`,
  x: c.x, y: c.y,
  scale: 0.2 + sr(c.s + 3) * 0.2,
  rotation: sr(c.s + 4) * 360,
  delay: 0.5 + sr(c.s + 5) * 2.4,
  zIndex: 60 + Math.floor(sr(c.s + 6) * 60),
  src: pick(HEAD_URLS, c.s + 7),
}));

const SCENE = [...LEAVES, ...SPRAYS, ...HEADS];

const Aster = () => {
  const { bloomed, loading, progress } = useFlowerGrowth(3800);

  return (
    <div style={{
      position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none',
      background: 'radial-gradient(ellipse at 50% 50%, #24361c 0%, #1a2814 45%, #0f170b 85%, #070b05 100%)',
    }}>
      {/* Cool autumn dusk */}
      <div style={{ position: 'absolute', top: '-8%', right: '10%', width: '550px', height: '500px', background: '#5a6ad0', borderRadius: '50%', filter: 'blur(150px)', opacity: 0.2 }} />
      <div style={{ position: 'absolute', bottom: '-5%', left: '15%', width: '600px', height: '420px', background: '#24461a', borderRadius: '50%', filter: 'blur(120px)', opacity: 0.45 }} />
      <div style={{ position: 'absolute', top: '45%', left: '-5%', width: '380px', height: '380px', background: '#c07030', borderRadius: '50%', filter: 'blur(140px)', opacity: 0.1 }} />

      <FlowerLoader
        loading={loading}
        progress={progress}
        message="Asterler yıldız gibi açıyor..."
        glowColor="rgba(140, 160, 255, 0.9)"
        barStyle={{ background: '#7d8fe6' }}
      />

      <ArtScene items={SCENE} bloomed={bloomed} />
    </div>
  );
};

export default Aster;
