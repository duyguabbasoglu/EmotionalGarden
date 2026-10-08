import React from 'react';
import FlowerLoader from './FlowerLoader';
import ArtScene from './ArtScene';
import { useFlowerGrowth } from '../hooks/useFlowerGrowth';
import { sr, pick, coverGrid } from '../utils/svgArt';
import { CLUMP_URLS, SINGLE_URLS, SNOW_LEAF_URLS } from '../utils/kardelenArt';

/*
 * A January snowdrop colony on a cold, blue-grey morning: strap leaves
 * carpeting the floor, clumps of nodding bells pushing up through them and
 * single stems filling whatever gaps are left.
 */
const LEAVES = coverGrid({ cols: 15, rows: 10, seed: 18100 }).map((c, i) => ({
  id: `l-${i}`,
  x: c.x, y: c.y,
  scale: 0.75 + sr(c.s + 3) * 0.61,
  rotation: (sr(c.s + 4) - 0.5) * 50,
  delay: sr(c.s + 5) * 1.4,
  zIndex: 1 + Math.floor(sr(c.s + 6) * 10),
  src: pick(SNOW_LEAF_URLS, c.s + 7),
}));

const CLUMPS = [
  ...coverGrid({ cols: 14, rows: 9, seed: 18600 }),
  ...coverGrid({ cols: 9, rows: 7, seed: 19100 }),
].map((c, i) => ({
  id: `c-${i}`,
  x: c.x, y: c.y,
  scale: 0.58 + sr(c.s + 3) * 0.65,
  rotation: (sr(c.s + 4) - 0.5) * 22,
  delay: 0.2 + sr(c.s + 5) * 2.4,
  zIndex: 20 + Math.floor(sr(c.s + 6) * 80),
  src: pick(CLUMP_URLS, c.s + 7),
}));

const SINGLES = coverGrid({ cols: 14, rows: 9, seed: 19700 }).map((c, i) => ({
  id: `s-${i}`,
  x: c.x, y: c.y,
  scale: 0.34 + sr(c.s + 3) * 0.34,
  rotation: (sr(c.s + 4) - 0.5) * 26,
  delay: 0.4 + sr(c.s + 5) * 2.4,
  zIndex: 100 + Math.floor(sr(c.s + 6) * 60),
  src: pick(SINGLE_URLS, c.s + 7),
}));

const SCENE = [...LEAVES, ...CLUMPS, ...SINGLES];

const Kardelen = () => {
  const { bloomed, loading, progress } = useFlowerGrowth(3500);

  return (
    <div style={{
      position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none',
      // A bright, overcast winter morning rather than a night scene. January
      // is the one month here whose flower is white, and against the old
      // near-black ground the snowdrops lost all their delicacy — they read
      // as hard white marks instead of translucent bells.
      background: 'radial-gradient(ellipse at 48% 50%, #8ca7b2 0%, #71909d 42%, #5a7886 78%, #47626f 100%)',
    }}>
      {/* Pale winter light, a little sage, a little blue-grey */}
      <div style={{ position: 'absolute', top: '-10%', left: '10%', width: '560px', height: '520px', background: '#eaf4f6', borderRadius: '50%', filter: 'blur(150px)', opacity: 0.4 }} />
      <div style={{ position: 'absolute', bottom: '-8%', left: '28%', width: '620px', height: '420px', background: '#8fb8a2', borderRadius: '50%', filter: 'blur(130px)', opacity: 0.3 }} />
      <div style={{ position: 'absolute', top: '30%', right: '-6%', width: '460px', height: '460px', background: '#cfe3e8', borderRadius: '50%', filter: 'blur(150px)', opacity: 0.3 }} />
      <div style={{ position: 'absolute', top: '58%', left: '-8%', width: '420px', height: '420px', background: '#9ebcc8', borderRadius: '50%', filter: 'blur(120px)', opacity: 0.32 }} />

      <FlowerLoader
        loading={loading}
        progress={progress}
        message="Kardelenler uyanıyor..."
        glowColor="rgba(120, 160, 145, 0.85)"
        barStyle={{ background: '#a8cbb4' }}
      />

      <ArtScene items={SCENE} bloomed={bloomed} />
    </div>
  );
};

export default Kardelen;
