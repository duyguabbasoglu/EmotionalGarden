import React from 'react';
import FlowerLoader from './FlowerLoader';
import ArtScene from './ArtScene';
import { useFlowerGrowth } from '../hooks/useFlowerGrowth';
import { sr, pick, coverGrid } from '../utils/svgArt';
import { JAS_SPRAY_URLS, JAS_STAR_URLS, JAS_VINE_URLS } from '../utils/yaseminArt';

/*
 * March jasmine on a wall at dusk — white stars floating out of dark foliage.
 *
 * The layering matters more here than in the other scenes: jasmine is an
 * open, twining plant, so the vine layer is drawn dense and dark to build a
 * thicket, and the white flowers are kept comparatively sparse on top. If the
 * stars were as dense as the leaves they would merge into one white sheet and
 * lose the airiness that is the whole point of the flower.
 */
const VINES = [
  ...coverGrid({ cols: 14, rows: 9, seed: 44000 }),
  ...coverGrid({ cols: 9, rows: 7, seed: 44500 }),
].map((c, i) => ({
  id: `v-${i}`,
  x: c.x, y: c.y,
  scale: 0.75 + sr(c.s + 3) * 0.68,
  rotation: sr(c.s + 4) * 360,
  delay: sr(c.s + 5) * 1.5,
  zIndex: 1 + Math.floor(sr(c.s + 6) * 14),
  src: pick(JAS_VINE_URLS, c.s + 7),
}));

const SPRAYS = coverGrid({ cols: 12, rows: 8, seed: 45200 }).map((c, i) => ({
  id: `s-${i}`,
  x: c.x, y: c.y,
  scale: 0.61 + sr(c.s + 3) * 0.58,
  rotation: (sr(c.s + 4) - 0.5) * 110,
  delay: 0.25 + sr(c.s + 5) * 2.4,
  zIndex: 30 + Math.floor(sr(c.s + 6) * 80),
  src: pick(JAS_SPRAY_URLS, c.s + 7),
}));

const STARS = coverGrid({ cols: 12, rows: 8, seed: 45900 }).map((c, i) => ({
  id: `f-${i}`,
  x: c.x, y: c.y,
  scale: 0.31 + sr(c.s + 3) * 0.41,
  rotation: sr(c.s + 4) * 360,
  delay: 0.5 + sr(c.s + 5) * 2.5,
  zIndex: 120 + Math.floor(sr(c.s + 6) * 60),
  src: pick(JAS_STAR_URLS, c.s + 7),
}));

const SCENE = [...VINES, ...SPRAYS, ...STARS];

const Yasemin = () => {
  const { bloomed, loading, progress } = useFlowerGrowth(3600);

  return (
    <div style={{
      position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none',
      background: 'radial-gradient(ellipse at 50% 44%, #1d3b2c 0%, #142a20 42%, #0b1a14 78%, #050d0a 100%)',
    }}>
      {/* a warm spring evening behind the dark leaves */}
      <div style={{ position: 'absolute', top: '-6%', left: '18%', width: '560px', height: '480px', background: '#3f7a56', borderRadius: '50%', filter: 'blur(140px)', opacity: 0.4 }} />
      <div style={{ position: 'absolute', bottom: '-8%', right: '12%', width: '540px', height: '460px', background: '#14422c', borderRadius: '50%', filter: 'blur(130px)', opacity: 0.5 }} />
      <div style={{ position: 'absolute', top: '30%', right: '-6%', width: '420px', height: '420px', background: '#f6e6d8', borderRadius: '50%', filter: 'blur(170px)', opacity: 0.12 }} />
      <div style={{ position: 'absolute', bottom: '22%', left: '-8%', width: '420px', height: '420px', background: '#e8c3cb', borderRadius: '50%', filter: 'blur(160px)', opacity: 0.1 }} />
      <div style={{ position: 'absolute', top: '56%', left: '40%', width: '380px', height: '380px', background: '#1a5038', borderRadius: '50%', filter: 'blur(120px)', opacity: 0.38 }} />

      <FlowerLoader
        loading={loading}
        progress={progress}
        message="Yaseminler kokuyor..."
        glowColor="rgba(255, 250, 240, 0.95)"
        barStyle={{ background: '#f4f0e2' }}
      />

      <ArtScene items={SCENE} bloomed={bloomed} />
    </div>
  );
};

export default Yasemin;
