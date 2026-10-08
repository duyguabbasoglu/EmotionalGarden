import React, { useState, useEffect } from 'react';
import Kardelen from './Kardelen';
import Menekse from './Menekse';
import Yasemin from './Yasemin';
import Lale from './Lale';
import Sakayik from './Sakayik';
import Gul from './Gul';
import Zambak from './Zambak';
import AycicegiPapatya from './AycicegiPapatya';
import Leylak from './Leylak';
import Karanfil from './Karanfil';
import Kasimpati from './Kasimpati';
import Kokina from './Kokina';
import Dahlia from './Dahlia';

/*
 * One scene per month — every entry in flowers.js has to resolve here, the
 * bonus thirteenth included. The keys are the flower names exactly as the
 * data file spells them, Turkish characters and all.
 */
const FLOWER_COMPONENTS = {
  "Kardelen": Kardelen,
  "Menekşe": Menekse,
  "Yasemin": Yasemin,
  "Lale": Lale,
  "Şakayık": Sakayik,
  "Gül": Gul,
  "Zambak": Zambak,
  "Ayçiçeği": AycicegiPapatya,
  "Leylak": Leylak,
  "Karanfil": Karanfil,
  "Kasımpatı": Kasimpati,
  "Kokina": Kokina,
  "Yıldız Çiçeği": Dahlia,
};

/* Readable text on top of the flower's own accent colour */
const contrastInk = (hex) => {
  const n = parseInt(hex.slice(1), 16);
  const l = (0.2126 * ((n >> 16) & 255) + 0.7152 * ((n >> 8) & 255) + 0.0722 * (n & 255)) / 255;
  return l > 0.55 ? '#2b2b2b' : '#ffffff';
};

const Modal = ({ flower, onClose }) => {
  const [hover, setHover] = useState(false);

  // Escape closes too, so the scene never traps you if the button is missed
  useEffect(() => {
    if (!flower) return undefined;
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [flower, onClose]);

  if (!flower) return null;

  const ActiveFlowerComponent = FLOWER_COMPONENTS[flower.name];
  const accent = flower.colors?.primary || '#d90429';

  return (
    <div style={{
      position: 'fixed', inset: 0,
      background: 'rgba(0, 0, 0, 0.4)',
      backdropFilter: 'blur(5px)',
      display: 'flex', justifyContent: 'center', alignItems: 'center',
      zIndex: 100,
      animation: 'fadeIn 0.5s ease',
      overflow: 'hidden'
    }}>
      {ActiveFlowerComponent ? (
        <ActiveFlowerComponent />
      ) : (
        <div style={{ color: 'white' }}>Henüz tasarlanmadı...</div>
      )}

      {/*
        No caption here on purpose. The flower's name, month and description
        live in the garden — on the plot's hover card — and the full-screen
        scene is left as nothing but the flower: art, a loader while it opens,
        and a way out. A title block over the bottom of the scene was reading
        as a museum label stuck on the picture.
      */}

      {/* close — stays above the loading overlay and every flower layer */}
      <button
        onClick={onClose}
        aria-label={`${flower.name} ekranını kapat`}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        style={{
          position: 'absolute',
          top: 'max(20px, env(safe-area-inset-top, 0px))',
          right: 'max(20px, env(safe-area-inset-right, 0px))',
          // dark disc with a bright ring, so it stays visible on the pale
          // scenes (kardelen, yasemin) as well as the dark ones
          background: hover ? accent : 'rgba(18,18,24,0.55)',
          color: hover ? contrastInk(accent) : '#ffffff',
          border: `2px solid ${hover ? accent : 'rgba(255,255,255,0.8)'}`,
          backdropFilter: 'blur(4px)',
          borderRadius: '50%',
          width: '50px', height: '50px',
          fontSize: '24px', lineHeight: 1, cursor: 'pointer',
          zIndex: 10000,
          transition: 'all 0.2s',
          boxShadow: hover ? `0 0 18px ${accent}` : '0 2px 12px rgba(0,0,0,0.55)',
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}
      >
        ✕
      </button>
    </div>
  );
};

export default Modal;
