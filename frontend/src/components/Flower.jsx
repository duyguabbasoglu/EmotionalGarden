import React from 'react';
import { CLUMP_URLS, SNOW_LEAF_URLS } from '../utils/kardelenArt';
import { VIOLET_CLUMP_URLS, VIOLET_BLOOM_URLS, VIOLET_LEAF_URLS } from '../utils/menekseArt';
import { JAS_SPRAY_URLS, JAS_STAR_URLS, JAS_VINE_URLS } from '../utils/yaseminArt';
import { TULIP_URLS, TULIP_LEAF_URLS } from '../utils/laleArt';
import { PEONY_URLS, PEONY_LEAF_URLS, PEONY_BUD_URLS } from '../utils/sakayikArt';
import { ROSE_URLS, ROSE_LEAF_URLS, BUD_URLS } from '../utils/gulArt';
import { LILY_URLS, LILY_LEAF_URLS, LILY_BUD_URLS } from '../utils/zambakArt';
import { SUNFLOWER_URLS, SUN_LEAF_URLS } from '../utils/aycicegiArt';
import { DAISY_URLS } from '../utils/papatyaArt';
import { BRANCH_URLS, LEAF_SPRAY_URLS } from '../utils/leylakArt';
import { CARNATION_URLS, CARN_LEAF_URLS } from '../utils/karanfilArt';
import { MUM_URLS, MUM_LEAF_URLS } from '../utils/kasimpatiArt';
import { CLUSTER_URLS } from '../utils/kokinaArt';
import { DAHLIA_URLS, DAHLIA_LEAF_URLS } from '../utils/dahliaArt';

/*
 * Every plot preview is built from the same pre-generated art the flower's
 * full-screen scene uses, so clicking a plot never shows you something else.
 * Layers are positioned in % of the plot; `w` is a % of its width.
 *
 * These are small — about eighty pixels square — so each one is composed, not
 * just dropped in. Three rules do most of the work:
 *
 *  - give every preview a dark foliage layer behind the bloom, so the flower
 *    has something to sit against instead of floating on the bed colour;
 *  - keep the whole plant inside its own tile, at roughly two thirds of the
 *    plot. An earlier pass let the hero bloom overflow (w above 100) to read
 *    as confident; at twelve tiles side by side it just read as crowded, and
 *    the garden lost the small-and-cute scale it is supposed to have. A
 *    flower with bed showing around it looks like a flower growing in a bed;
 *  - keep one silhouette per tile. Where a month has companions (the August
 *    daisies, the April tulip group) they stay small and low, so the eye
 *    still lands on one shape first.
 */
const PREVIEWS = {
    "Kardelen": [
        { src: SNOW_LEAF_URLS[0], w: 57, x: 50, y: 60 },
        { src: CLUMP_URLS[1], w: 72, x: 50, y: 48 },
    ],
    "Menekşe": [
        // the paler palette (index 4) rather than the darkest clump: a deep
        // violet on a green bed turns into a silhouette at this size
        { src: VIOLET_LEAF_URLS[1], w: 53, x: 50, y: 62 },
        { src: VIOLET_CLUMP_URLS[4], w: 73, x: 50, y: 50 },
        { src: VIOLET_BLOOM_URLS[1], w: 24, x: 34, y: 40, rot: -16 },
        { src: VIOLET_BLOOM_URLS[4], w: 21, x: 66, y: 44, rot: 14 },
    ],
    "Yasemin": [
        { src: JAS_VINE_URLS[2], w: 57, x: 50, y: 55 },
        { src: JAS_SPRAY_URLS[3], w: 69, x: 50, y: 49 },
        { src: JAS_STAR_URLS[1], w: 22, x: 37, y: 38, rot: 12 },
        { src: JAS_STAR_URLS[4], w: 18, x: 63, y: 60, rot: -20 },
    ],
    "Lale": [
        { src: TULIP_LEAF_URLS[2], w: 53, x: 50, y: 62 },
        { src: TULIP_URLS[2], w: 47, x: 34, y: 51, rot: -9 },
        { src: TULIP_URLS[8], w: 46, x: 66, y: 52, rot: 10 },
        { src: TULIP_URLS[0], w: 55, x: 50, y: 48 },
    ],
    "Şakayık": [
        { src: PEONY_LEAF_URLS[1], w: 57, x: 50, y: 60 },
        { src: PEONY_BUD_URLS[0], w: 26, x: 67, y: 58, rot: 18 },
        { src: PEONY_URLS[0], w: 59, x: 46, y: 46 },
    ],
    "Gül": [
        { src: ROSE_LEAF_URLS[0], w: 45, x: 36, y: 60, rot: -50 },
        { src: ROSE_LEAF_URLS[2], w: 43, x: 64, y: 61, rot: 45 },
        { src: BUD_URLS[1], w: 24, x: 67, y: 46, rot: 22 },
        { src: ROSE_URLS[0], w: 54, x: 46, y: 46 },
    ],
    "Zambak": [
        { src: LILY_LEAF_URLS[0], w: 56, x: 50, y: 61 },
        { src: LILY_BUD_URLS[2], w: 25, x: 69, y: 57, rot: 22 },
        { src: LILY_URLS[0], w: 67, x: 49, y: 46 },
    ],
    "Ayçiçeği": [
        { src: SUN_LEAF_URLS[0], w: 40, x: 34, y: 62, rot: -40 },
        { src: SUN_LEAF_URLS[1], w: 37, x: 67, y: 62, rot: 40 },
        { src: SUNFLOWER_URLS[0], w: 55, x: 50, y: 45 },
        // the companions: small, low, tucked at the sunflower's feet
        { src: DAISY_URLS[0], w: 14, x: 32, y: 70, rot: -12 },
        { src: DAISY_URLS[2], w: 12, x: 45, y: 74, rot: 16 },
        { src: DAISY_URLS[1], w: 13, x: 64, y: 72, rot: 8 },
    ],
    "Leylak": [
        { src: LEAF_SPRAY_URLS[2], w: 53, x: 50, y: 61 },
        { src: BRANCH_URLS[0], w: 69, x: 50, y: 49 },
    ],
    "Karanfil": [
        { src: CARN_LEAF_URLS[0], w: 55, x: 50, y: 60 },
        { src: CARNATION_URLS[0], w: 51, x: 50, y: 45 },
    ],
    "Kasımpatı": [
        { src: MUM_LEAF_URLS[0], w: 56, x: 50, y: 58 },
        { src: MUM_URLS[0], w: 53, x: 50, y: 45 },
    ],
    "Kokina": [
        { src: CLUSTER_URLS[2], w: 70, x: 50, y: 49 },
    ],
    "Yıldız Çiçeği": [
        { src: DAHLIA_LEAF_URLS[1], w: 55, x: 50, y: 58 },
        { src: DAHLIA_URLS[0], w: 59, x: 50, y: 48 },
    ],
};

/* Relative luminance of #rrggbb, so a pale flower still gets readable text */
const luminance = (hex) => {
    const n = parseInt(hex.slice(1), 16);
    return (0.2126 * ((n >> 16) & 255) + 0.7152 * ((n >> 8) & 255) + 0.0722 * (n & 255)) / 255;
};

/* The darker of the flower's two colours, or plain grey if both are pale */
const labelColor = ({ primary, secondary }) => {
    const best = luminance(primary) <= luminance(secondary) ? primary : secondary;
    return luminance(best) > 0.62 ? '#6b6b6b' : best;
};

/* Stacked layers of pre-built flower art, positioned in % of the plot */
const artPreview = (layers) => (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        {layers.map((l, i) => (
            <img key={i} src={l.src} alt="" draggable={false} style={{
                position: 'absolute',
                left: `${l.x}%`, top: `${l.y}%`,
                width: `${l.w}%`,
                transform: `translate(-50%, -50%) rotate(${l.rot || 0}deg)`,
                filter: 'drop-shadow(0 1px 1.5px rgba(0,0,0,0.26))',
            }} />
        ))}
    </div>
);

/*
 * Neutral placeholder for a flower with no preview yet — deliberately not any
 * real flower, so an unfinished entry can never be mistaken for a finished one.
 */
const placeholder = () => (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        <svg viewBox="0 0 80 80" width="100%" height="100%" style={{ display: 'block' }}>
            <path d="M 40 64 L 40 40" stroke="#3f6b35" strokeWidth="3" strokeLinecap="round" />
            <path d="M 40 48 C 30 46, 24 38, 26 30 C 35 31, 40 39, 40 48 Z" fill="#5f9150" opacity="0.9" />
            <path d="M 40 44 C 50 42, 56 34, 54 26 C 45 27, 40 35, 40 44 Z" fill="#6ea35c" opacity="0.9" />
        </svg>
    </div>
);

const Flower = ({ type, onClick }) => {
    const layers = PREVIEWS[type.name];

    return (
        <div
            className="flower-container"
            onClick={onClick}
            style={{
                width: '100%', height: '100%',
                position: 'relative', cursor: 'pointer',
                animation: 'float 3s ease-in-out infinite'
            }}
        >
            {layers ? artPreview(layers) : placeholder()}

            {/* chatbox */}
            <div className="chatbox">
                <strong style={{
                    display: 'block', fontSize: '15px', marginBottom: '2px',
                    color: labelColor(type.colors)
                }}>
                    {type.name}
                </strong>
                <span style={{
                    display: 'block', fontSize: '10px', letterSpacing: '0.08em',
                    textTransform: 'uppercase', color: '#9a9a9a', marginBottom: '6px'
                }}>
                    {type.month}
                </span>
                <span style={{ fontSize: '11px', color: '#555', lineHeight: '1.3', display: 'block' }}>
                    {type.description}
                </span>
            </div>

            {/* special css */}
            <style>{`
        .chatbox {
          position: absolute;
          bottom: 80%;
          left: 50%;
          transform: translateX(-50%) scale(0.5);
          width: 170px;
          background: #fffdf9;
          color: #333;
          padding: 12px;
          border-radius: 12px;
          box-shadow: 0 6px 20px rgba(0,0,0,0.35);
          text-align: center;
          font-family: 'Segoe UI', sans-serif;
          pointer-events: none;
          z-index: 20;
          opacity: 0;
          transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }

        .chatbox::after {
          content: '';
          position: absolute;
          top: 100%; left: 50%;
          margin-left: -6px;
          border-width: 6px;
          border-style: solid;
          border-color: #fffdf9 transparent transparent transparent;
        }

        .flower-container:hover .chatbox {
          opacity: 1;
          bottom: 100%;
          transform: translateX(-50%) scale(1);
        }
      `}</style>
        </div>
    );
};

export default Flower;
