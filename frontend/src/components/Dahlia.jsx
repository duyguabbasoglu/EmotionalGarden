import React from 'react';
import FlowerLoader from './FlowerLoader';
import ArtScene from './ArtScene';
import { useFlowerGrowth } from '../hooks/useFlowerGrowth';
import { sr, pick, coverGrid } from '../utils/svgArt';
import { DAHLIA_URLS, DAHLIA_STEM_URLS, DAHLIA_LEAF_URLS } from '../utils/dahliaArt';

/*
 * The hidden thirteenth month. It is reached only from the sparkle on the
 * garden's title, so it is allowed to be the most ornamental scene here:
 * dahlias packed close, all facing front, with the plum-to-blush gradient
 * doing the work that a dark background and a few gold motes finish off.
 */
const LEAVES = coverGrid({ cols: 14, rows: 9, seed: 60000 }).map((c, i) => ({
  id: `l-${i}`,
  x: c.x, y: c.y,
  scale: 0.75 + sr(c.s + 3) * 0.61,
  rotation: sr(c.s + 4) * 360,
  delay: sr(c.s + 5) * 1.3,
  zIndex: 1 + Math.floor(sr(c.s + 6) * 12),
  src: pick(DAHLIA_LEAF_URLS, c.s + 7),
}));

const STEMS = coverGrid({ cols: 11, rows: 8, seed: 60600 }).map((c, i) => ({
  id: `s-${i}`,
  x: c.x, y: c.y,
  scale: 0.58 + sr(c.s + 3) * 0.48,
  rotation: (sr(c.s + 4) - 0.5) * 30,
  delay: 0.2 + sr(c.s + 5) * 2.2,
  zIndex: 20 + Math.floor(sr(c.s + 6) * 50),
  src: pick(DAHLIA_STEM_URLS, c.s + 7),
}));

const BLOOMS = [
  ...coverGrid({ cols: 11, rows: 8, seed: 61200 }),
  ...coverGrid({ cols: 7, rows: 5, seed: 61800 }),
].map((c, i) => ({
  id: `b-${i}`,
  x: c.x, y: c.y,
  scale: 0.34 + sr(c.s + 3) * 0.48,
  rotation: sr(c.s + 4) * 360,
  delay: 0.4 + sr(c.s + 5) * 2.6,
  zIndex: 120 + Math.floor(sr(c.s + 6) * 80),
  src: pick(DAHLIA_URLS, c.s + 7),
}));

const SCENE = [...LEAVES, ...STEMS, ...BLOOMS];

const Dahlia = () => {
  const { bloomed, loading, progress } = useFlowerGrowth(3800);

  return (
    <div style={{
      position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none',
      background: 'radial-gradient(ellipse at 50% 44%, #3a1030 0%, #260a22 42%, #150514 78%, #09020a 100%)',
    }}>
      <div style={{ position: 'absolute', top: '-10%', left: '14%', width: '600px', height: '520px', background: '#b5417e', borderRadius: '50%', filter: 'blur(160px)', opacity: 0.26 }} />
      <div style={{ position: 'absolute', bottom: '-8%', right: '10%', width: '560px', height: '460px', background: '#346236', borderRadius: '50%', filter: 'blur(140px)', opacity: 0.34 }} />
      <div style={{ position: 'absolute', top: '36%', right: '-8%', width: '460px', height: '460px', background: '#f0b4c8', borderRadius: '50%', filter: 'blur(170px)', opacity: 0.18 }} />
      <div style={{ position: 'absolute', bottom: '18%', left: '-10%', width: '440px', height: '440px', background: '#5a2089', borderRadius: '50%', filter: 'blur(150px)', opacity: 0.22 }} />
      <div style={{ position: 'absolute', top: '58%', left: '38%', width: '400px', height: '400px', background: '#f0c14e', borderRadius: '50%', filter: 'blur(175px)', opacity: 0.1 }} />

      <FlowerLoader
        loading={loading}
        progress={progress}
        message="Yıldız çiçeği açıyor... ✨"
        glowColor="rgba(240, 160, 200, 0.95)"
        barStyle={{ background: '#c9447a' }}
      />

      <ArtScene items={SCENE} bloomed={bloomed} />
    </div>
  );
};

export default Dahlia;
