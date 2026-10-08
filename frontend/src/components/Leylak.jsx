import React from 'react';
import FlowerLoader from './FlowerLoader';
import ArtScene from './ArtScene';
import { useFlowerGrowth } from '../hooks/useFlowerGrowth';
import { sr, pick, coverGrid } from '../utils/svgArt';
import { PANICLE_URLS, BRANCH_URLS, LEAF_URLS, LEAF_SPRAY_URLS } from '../utils/leylakArt';

/*
 * September lilac — a bush seen from close up, which is how leylak is
 * remembered: more flower than leaf, every panicle pointing roughly upward.
 *
 * Rotation is kept to about ±16°. A lilac panicle is a cone with a definite
 * top and bottom, so letting it spin would immediately read as fake; the
 * variation has to come from scale, palette and overlap instead.
 */
const LEAF_SPRAYS = coverGrid({ cols: 15, rows: 11, seed: 4000 }).map((c, i) => ({
  id: `l-${i}`,
  x: c.x, y: c.y,
  scale: 0.82 + sr(c.s + 3) * 0.75,
  rotation: (sr(c.s + 4) - 0.5) * 90,
  delay: sr(c.s + 5) * 1.5,
  zIndex: 1 + Math.floor(sr(c.s + 6) * 10),
  src: pick(LEAF_SPRAY_URLS, c.s + 7),
}));

const BIG_LEAVES = coverGrid({ cols: 12, rows: 8, seed: 4600 }).map((c, i) => ({
  id: `bl-${i}`,
  x: c.x, y: c.y,
  scale: 0.58 + sr(c.s + 3) * 0.54,
  rotation: (sr(c.s + 4) - 0.5) * 110,
  delay: 0.1 + sr(c.s + 5) * 1.6,
  zIndex: 14 + Math.floor(sr(c.s + 6) * 10),
  src: pick(LEAF_URLS, c.s + 7),
}));

const BRANCHES = coverGrid({ cols: 11, rows: 8, seed: 9000 }).map((c, i) => ({
  id: `br-${i}`,
  x: c.x, y: c.y,
  scale: 0.58 + sr(c.s + 3) * 0.51,
  rotation: (sr(c.s + 4) - 0.5) * 26,
  delay: 0.2 + sr(c.s + 5) * 2.3,
  zIndex: 30 + Math.floor(sr(c.s + 6) * 60),
  src: pick(BRANCH_URLS, c.s + 7),
}));

const PANICLES = [
  ...coverGrid({ cols: 14, rows: 9, seed: 100 }),
  ...coverGrid({ cols: 9, rows: 7, seed: 9600 }),
].map((c, i) => ({
  id: `p-${i}`,
  x: c.x, y: c.y,
  scale: 0.51 + sr(c.s + 3) * 0.65,
  rotation: (sr(c.s + 4) - 0.5) * 32,
  delay: 0.35 + sr(c.s + 5) * 2.6,
  zIndex: 110 + Math.floor(sr(c.s + 6) * 90),
  src: pick(PANICLE_URLS, c.s + 7),
}));

const SCENE = [...LEAF_SPRAYS, ...BIG_LEAVES, ...BRANCHES, ...PANICLES];

const Leylak = () => {
  const { bloomed, loading, progress } = useFlowerGrowth(3800);

  return (
    <div style={{
      position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none',
      background: 'radial-gradient(ellipse at 42% 46%, #332248 0%, #221634 42%, #141024 78%, #080612 100%)',
    }}>
      <div style={{ position: 'absolute', top: '-8%', left: '12%', width: '580px', height: '500px', background: '#7b45a3', borderRadius: '50%', filter: 'blur(150px)', opacity: 0.3 }} />
      <div style={{ position: 'absolute', bottom: '-8%', right: '10%', width: '560px', height: '460px', background: '#2b5e30', borderRadius: '50%', filter: 'blur(130px)', opacity: 0.42 }} />
      <div style={{ position: 'absolute', top: '34%', right: '-8%', width: '440px', height: '440px', background: '#c9a3de', borderRadius: '50%', filter: 'blur(165px)', opacity: 0.18 }} />
      <div style={{ position: 'absolute', bottom: '18%', left: '-8%', width: '440px', height: '440px', background: '#1f4a22', borderRadius: '50%', filter: 'blur(125px)', opacity: 0.4 }} />
      <div style={{ position: 'absolute', top: '58%', left: '38%', width: '390px', height: '390px', background: '#8a3a72', borderRadius: '50%', filter: 'blur(150px)', opacity: 0.14 }} />

      <FlowerLoader
        loading={loading}
        progress={progress}
        message="Leylaklar açıyor..."
        glowColor="rgba(200,140,255,0.95)"
        barStyle={{ background: '#b084cc' }}
      />

      <ArtScene items={SCENE} bloomed={bloomed} />
    </div>
  );
};

export default Leylak;
