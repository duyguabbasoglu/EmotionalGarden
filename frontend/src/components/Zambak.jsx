import React from 'react';
import FlowerLoader from './FlowerLoader';
import ArtScene from './ArtScene';
import { useFlowerGrowth } from '../hooks/useFlowerGrowth';
import { sr, pick, coverGrid } from '../utils/svgArt';
import { LILY_URLS, LILY_STEM_URLS, LILY_BUD_URLS, LILY_LEAF_URLS } from '../utils/zambakArt';

/*
 * July lilies — tall stems standing clear of each other with the big freckled
 * faces turned outward.
 *
 * Lilies are architectural rather than massed: the stems layer is what gives
 * the scene its height, and the open blooms are spaced rather than crowded so
 * each one keeps its six-pointed silhouette. Rotation stays modest, since a
 * lily's grace comes from the stem being upright under a heavy head.
 */
const LEAVES = coverGrid({ cols: 14, rows: 9, seed: 54000 }).map((c, i) => ({
  id: `l-${i}`,
  x: c.x, y: c.y,
  scale: 0.75 + sr(c.s + 3) * 0.65,
  rotation: (sr(c.s + 4) - 0.5) * 80,
  delay: sr(c.s + 5) * 1.4,
  zIndex: 1 + Math.floor(sr(c.s + 6) * 12),
  src: pick(LILY_LEAF_URLS, c.s + 7),
}));

const STEMS = [
  ...coverGrid({ cols: 11, rows: 8, seed: 54600 }),
  ...coverGrid({ cols: 8, rows: 5, seed: 55100 }),
].map((c, i) => ({
  id: `s-${i}`,
  x: c.x, y: c.y,
  scale: 0.58 + sr(c.s + 3) * 0.51,
  rotation: (sr(c.s + 4) - 0.5) * 20,
  delay: 0.2 + sr(c.s + 5) * 2.4,
  zIndex: 25 + Math.floor(sr(c.s + 6) * 70),
  src: pick(LILY_STEM_URLS, c.s + 7),
}));

const BUDS = coverGrid({ cols: 9, rows: 7, seed: 55700 }).map((c, i) => ({
  id: `u-${i}`,
  x: c.x, y: c.y,
  scale: 0.34 + sr(c.s + 3) * 0.34,
  rotation: (sr(c.s + 4) - 0.5) * 40,
  delay: 0.35 + sr(c.s + 5) * 2.3,
  zIndex: 100 + Math.floor(sr(c.s + 6) * 30),
  src: pick(LILY_BUD_URLS, c.s + 7),
}));

const BLOOMS = coverGrid({ cols: 11, rows: 8, seed: 56300 }).map((c, i) => ({
  id: `b-${i}`,
  x: c.x, y: c.y,
  scale: 0.34 + sr(c.s + 3) * 0.41,
  rotation: sr(c.s + 4) * 360,
  delay: 0.45 + sr(c.s + 5) * 2.5,
  zIndex: 140 + Math.floor(sr(c.s + 6) * 70),
  src: pick(LILY_URLS, c.s + 7),
}));

const SCENE = [...LEAVES, ...STEMS, ...BUDS, ...BLOOMS];

const Zambak = () => {
  const { bloomed, loading, progress } = useFlowerGrowth(3800);

  return (
    <div style={{
      position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none',
      background: 'radial-gradient(ellipse at 50% 40%, #2a3e34 0%, #1c2b25 42%, #101a16 78%, #070d0b 100%)',
    }}>
      {/* high summer: strong warm light, deep green shade underneath */}
      <div style={{ position: 'absolute', top: '-8%', left: '16%', width: '580px', height: '500px', background: '#c9a06a', borderRadius: '50%', filter: 'blur(160px)', opacity: 0.2 }} />
      <div style={{ position: 'absolute', bottom: '-8%', right: '10%', width: '560px', height: '470px', background: '#1d5234', borderRadius: '50%', filter: 'blur(130px)', opacity: 0.45 }} />
      <div style={{ position: 'absolute', top: '36%', right: '-8%', width: '440px', height: '440px', background: '#e8a2b8', borderRadius: '50%', filter: 'blur(165px)', opacity: 0.16 }} />
      <div style={{ position: 'absolute', bottom: '20%', left: '-8%', width: '430px', height: '430px', background: '#2f6e36', borderRadius: '50%', filter: 'blur(125px)', opacity: 0.38 }} />
      <div style={{ position: 'absolute', top: '56%', left: '40%', width: '380px', height: '380px', background: '#fdf6e8', borderRadius: '50%', filter: 'blur(170px)', opacity: 0.12 }} />

      <FlowerLoader
        loading={loading}
        progress={progress}
        message="Zambaklar açıyor..."
        glowColor="rgba(255, 240, 220, 0.95)"
        barStyle={{ background: '#f1e1d4' }}
      />

      <ArtScene items={SCENE} bloomed={bloomed} />
    </div>
  );
};

export default Zambak;
