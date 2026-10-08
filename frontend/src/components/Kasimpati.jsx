import React from 'react';
import FlowerLoader from './FlowerLoader';
import ArtScene from './ArtScene';
import { useFlowerGrowth } from '../hooks/useFlowerGrowth';
import { sr, pick, coverGrid } from '../utils/svgArt';
import { MUM_URLS, MUM_SPRAY_URLS, MUM_LEAF_URLS } from '../utils/kasimpatiArt';

/*
 * An October chrysanthemum bed: lobed foliage underneath, leafy sprays of
 * two or three heads through the middle, and the big double heads themselves
 * crowding the frame in plum, magenta and autumn gold.
 */
const LEAVES = coverGrid({ cols: 16, rows: 11, seed: 27100 }).map((c, i) => ({
  id: `l-${i}`,
  x: c.x, y: c.y,
  scale: 0.75 + sr(c.s + 3) * 0.61,
  rotation: sr(c.s + 4) * 360,
  delay: sr(c.s + 5) * 1.4,
  zIndex: 1 + Math.floor(sr(c.s + 6) * 10),
  src: pick(MUM_LEAF_URLS, c.s + 7),
}));

const SPRAYS = [
  ...coverGrid({ cols: 14, rows: 9, seed: 27600 }),
  ...coverGrid({ cols: 9, rows: 7, seed: 28100 }),
].map((c, i) => ({
  id: `s-${i}`,
  x: c.x, y: c.y,
  scale: 0.51 + sr(c.s + 3) * 0.48,
  rotation: (sr(c.s + 4) - 0.5) * 40,
  delay: 0.2 + sr(c.s + 5) * 2.4,
  zIndex: 20 + Math.floor(sr(c.s + 6) * 70),
  src: pick(MUM_SPRAY_URLS, c.s + 7),
}));

const HEADS = [
  ...coverGrid({ cols: 15, rows: 9, seed: 28600 }),
  ...coverGrid({ cols: 9, rows: 5, seed: 29100 }),
].map((c, i) => ({
  id: `h-${i}`,
  x: c.x, y: c.y,
  scale: 0.27 + sr(c.s + 3) * 0.33,
  rotation: sr(c.s + 4) * 360,
  delay: 0.4 + sr(c.s + 5) * 2.5,
  zIndex: 95 + Math.floor(sr(c.s + 6) * 80),
  src: pick(MUM_URLS, c.s + 7),
}));

const SCENE = [...LEAVES, ...SPRAYS, ...HEADS];

const Kasimpati = () => {
  const { bloomed, loading, progress } = useFlowerGrowth(3800);

  return (
    <div style={{
      position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none',
      background: 'radial-gradient(ellipse at 50% 50%, #3b2440 0%, #2a1a2e 45%, #190f1e 85%, #0c0711 100%)',
    }}>
      {/* Autumn: plum shade, low gold light, rust in the foliage */}
      <div style={{ position: 'absolute', top: '-8%', right: '12%', width: '560px', height: '510px', background: '#8e2a9c', borderRadius: '50%', filter: 'blur(150px)', opacity: 0.24 }} />
      <div style={{ position: 'absolute', bottom: '-6%', left: '18%', width: '600px', height: '430px', background: '#4a3a16', borderRadius: '50%', filter: 'blur(130px)', opacity: 0.45 }} />
      <div style={{ position: 'absolute', top: '42%', left: '-6%', width: '430px', height: '430px', background: '#e09018', borderRadius: '50%', filter: 'blur(150px)', opacity: 0.16 }} />
      <div style={{ position: 'absolute', top: '14%', left: '26%', width: '420px', height: '420px', background: '#6a46c0', borderRadius: '50%', filter: 'blur(140px)', opacity: 0.16 }} />

      <FlowerLoader
        loading={loading}
        progress={progress}
        message="Kasımpatılar renkleniyor..."
        glowColor="rgba(220, 130, 240, 0.9)"
        barStyle={{ background: '#e08a2e' }}
      />

      <ArtScene items={SCENE} bloomed={bloomed} />
    </div>
  );
};

export default Kasimpati;
