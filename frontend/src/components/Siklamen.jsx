import React from 'react';
import FlowerLoader from './FlowerLoader';
import ArtScene from './ArtScene';
import { useFlowerGrowth } from '../hooks/useFlowerGrowth';
import { sr, pick, coverGrid } from '../utils/svgArt';
import { CYCLAMEN_URLS, CYC_PLANT_URLS, CYC_LEAF_URLS } from '../utils/siklamenArt';

/*
 * A November cyclamen colony on a cool woodland floor: a carpet of marbled
 * heart-shaped leaves, whole plants with their stalks hooked over, and single
 * raspberry flowers nodding above everything.
 */
const LEAVES = [
  ...coverGrid({ cols: 15, rows: 9, seed: 30100 }),
  ...coverGrid({ cols: 11, rows: 7, seed: 30600 }),
].map((c, i) => ({
  id: `l-${i}`,
  x: c.x, y: c.y,
  scale: 0.68 + sr(c.s + 3) * 0.61,
  rotation: (sr(c.s + 4) - 0.5) * 70,
  delay: sr(c.s + 5) * 1.4,
  zIndex: 1 + Math.floor(sr(c.s + 6) * 12),
  src: pick(CYC_LEAF_URLS, c.s + 7),
}));

const PLANTS = [
  ...coverGrid({ cols: 14, rows: 9, seed: 31100 }),
  ...coverGrid({ cols: 9, rows: 7, seed: 31600 }),
].map((c, i) => ({
  id: `p-${i}`,
  x: c.x, y: c.y,
  scale: 0.54 + sr(c.s + 3) * 0.54,
  rotation: (sr(c.s + 4) - 0.5) * 16,
  delay: 0.2 + sr(c.s + 5) * 2.4,
  zIndex: 25 + Math.floor(sr(c.s + 6) * 70),
  src: pick(CYC_PLANT_URLS, c.s + 7),
}));

const BLOOMS = coverGrid({ cols: 18, rows: 11, seed: 32100 }).map((c, i) => ({
  id: `b-${i}`,
  x: c.x, y: c.y,
  scale: 0.29 + sr(c.s + 3) * 0.3,
  rotation: (sr(c.s + 4) - 0.5) * 34,
  delay: 0.4 + sr(c.s + 5) * 2.5,
  zIndex: 100 + Math.floor(sr(c.s + 6) * 70),
  src: pick(CYCLAMEN_URLS, c.s + 7),
}));

const SCENE = [...LEAVES, ...PLANTS, ...BLOOMS];

const Siklamen = () => {
  const { bloomed, loading, progress } = useFlowerGrowth(3600);

  return (
    <div style={{
      position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none',
      background: 'radial-gradient(ellipse at 48% 54%, #19331f 0%, #11261a 45%, #0a1810 85%, #040b07 100%)',
    }}>
      {/* Cool woodland: raspberry light, silver mist, deep forest shade */}
      <div style={{ position: 'absolute', top: '-8%', left: '14%', width: '560px', height: '500px', background: '#a8215c', borderRadius: '50%', filter: 'blur(150px)', opacity: 0.24 }} />
      <div style={{ position: 'absolute', bottom: '-8%', right: '14%', width: '600px', height: '440px', background: '#1f4a2c', borderRadius: '50%', filter: 'blur(130px)', opacity: 0.5 }} />
      <div style={{ position: 'absolute', top: '34%', right: '-6%', width: '440px', height: '440px', background: '#b9c9b4', borderRadius: '50%', filter: 'blur(160px)', opacity: 0.12 }} />
      <div style={{ position: 'absolute', top: '58%', left: '-8%', width: '420px', height: '420px', background: '#6d1442', borderRadius: '50%', filter: 'blur(140px)', opacity: 0.22 }} />

      <FlowerLoader
        loading={loading}
        progress={progress}
        message="Siklamenler uyanıyor..."
        glowColor="rgba(240, 120, 170, 0.9)"
        barStyle={{ background: '#c0225f' }}
      />

      <ArtScene items={SCENE} bloomed={bloomed} />
    </div>
  );
};

export default Siklamen;
