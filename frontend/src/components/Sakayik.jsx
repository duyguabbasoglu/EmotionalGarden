import React from 'react';
import FlowerLoader from './FlowerLoader';
import ArtScene from './ArtScene';
import { useFlowerGrowth } from '../hooks/useFlowerGrowth';
import { sr, pick, coverGrid } from '../utils/svgArt';
import { PEONY_URLS, PEONY_STEM_URLS, PEONY_BUD_URLS, PEONY_LEAF_URLS } from '../utils/sakayikArt';

/*
 * May peonies — an armful of them, which is the only honest way to show this
 * flower. The heads are drawn large and allowed to overlap heavily: a peony
 * bush in flower is a mass of blooms with the foliage barely visible, so the
 * leaf layer here is thin and the bloom layer is deliberately crowded.
 */
const LEAVES = coverGrid({ cols: 14, rows: 9, seed: 50000 }).map((c, i) => ({
  id: `l-${i}`,
  x: c.x, y: c.y,
  scale: 0.75 + sr(c.s + 3) * 0.61,
  rotation: sr(c.s + 4) * 360,
  delay: sr(c.s + 5) * 1.3,
  zIndex: 1 + Math.floor(sr(c.s + 6) * 12),
  src: pick(PEONY_LEAF_URLS, c.s + 7),
}));

const STEMS = coverGrid({ cols: 11, rows: 8, seed: 50600 }).map((c, i) => ({
  id: `s-${i}`,
  x: c.x, y: c.y,
  scale: 0.58 + sr(c.s + 3) * 0.48,
  rotation: (sr(c.s + 4) - 0.5) * 36,
  delay: 0.2 + sr(c.s + 5) * 2.2,
  zIndex: 20 + Math.floor(sr(c.s + 6) * 50),
  src: pick(PEONY_STEM_URLS, c.s + 7),
}));

const BUDS = coverGrid({ cols: 9, rows: 7, seed: 51200 }).map((c, i) => ({
  id: `u-${i}`,
  x: c.x, y: c.y,
  scale: 0.34 + sr(c.s + 3) * 0.34,
  rotation: (sr(c.s + 4) - 0.5) * 50,
  delay: 0.35 + sr(c.s + 5) * 2.3,
  zIndex: 80 + Math.floor(sr(c.s + 6) * 30),
  src: pick(PEONY_BUD_URLS, c.s + 7),
}));

const BLOOMS = [
  ...coverGrid({ cols: 11, rows: 8, seed: 51800 }),
  ...coverGrid({ cols: 7, rows: 5, seed: 52400 }),
].map((c, i) => ({
  id: `b-${i}`,
  x: c.x, y: c.y,
  scale: 0.37 + sr(c.s + 3) * 0.51,
  rotation: sr(c.s + 4) * 360,
  delay: 0.45 + sr(c.s + 5) * 2.6,
  zIndex: 120 + Math.floor(sr(c.s + 6) * 80),
  src: pick(PEONY_URLS, c.s + 7),
}));

const SCENE = [...LEAVES, ...STEMS, ...BUDS, ...BLOOMS];

const Sakayik = () => {
  const { bloomed, loading, progress } = useFlowerGrowth(3800);

  return (
    <div style={{
      position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none',
      background: 'radial-gradient(ellipse at 48% 42%, #4a2b36 0%, #331d28 42%, #1d1018 78%, #0f070c 100%)',
    }}>
      {/* soft, warm, slightly overexposed — the light peonies are always shot in */}
      <div style={{ position: 'absolute', top: '-10%', left: '14%', width: '600px', height: '520px', background: '#eb94ab', borderRadius: '50%', filter: 'blur(160px)', opacity: 0.26 }} />
      <div style={{ position: 'absolute', bottom: '-8%', right: '10%', width: '560px', height: '460px', background: '#386b32', borderRadius: '50%', filter: 'blur(130px)', opacity: 0.38 }} />
      <div style={{ position: 'absolute', top: '38%', right: '-8%', width: '460px', height: '460px', background: '#f8bcc9', borderRadius: '50%', filter: 'blur(170px)', opacity: 0.2 }} />
      <div style={{ position: 'absolute', bottom: '18%', left: '-10%', width: '440px', height: '440px', background: '#9e3756', borderRadius: '50%', filter: 'blur(150px)', opacity: 0.24 }} />
      <div style={{ position: 'absolute', top: '58%', left: '36%', width: '400px', height: '400px', background: '#fde8ec', borderRadius: '50%', filter: 'blur(170px)', opacity: 0.12 }} />

      <FlowerLoader
        loading={loading}
        progress={progress}
        message="Şakayıklar açıyor..."
        glowColor="rgba(250, 170, 190, 0.95)"
        barStyle={{ background: '#ea93ab' }}
      />

      <ArtScene items={SCENE} bloomed={bloomed} />
    </div>
  );
};

export default Sakayik;
