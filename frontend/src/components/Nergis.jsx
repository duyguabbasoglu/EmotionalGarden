import React, { useEffect, useState, useMemo } from 'react';
import FlowerLoader from './FlowerLoader';

const random = (min, max) => Math.random() * (max - min) + min;

/* ─── Single narcissus SVG head ─── */
const DaffodilHead = ({ size }) => {
  const pl = size;           // petal length
  const pw = size * 0.42;   // petal width
  const tr = size * 0.27;   // trumpet radius

  // petal path — pointed ellipse pointing up
  const d = `M 0 0 C ${pw} ${-pl * 0.07}, ${pw * 0.88} ${-pl * 0.70}, 0 ${-pl} C ${-pw * 0.88} ${-pl * 0.70}, ${-pw} ${-pl * 0.07}, 0 0 Z`;

  return (
    <svg
      width={size * 2.8}
      height={size * 2.8}
      viewBox={`${-size * 1.4} ${-size * 1.4} ${size * 2.8} ${size * 2.8}`}
      style={{ display: 'block', overflow: 'visible' }}
    >
      {/* 6 yellow petals at 60° steps */}
      {[0, 60, 120, 180, 240, 300].map((angle, j) => (
        <path
          key={j}
          d={d}
          fill={j % 2 === 0 ? '#ffe033' : '#ffd000'}
          stroke="rgba(160,110,0,0.22)"
          strokeWidth="0.5"
          transform={`rotate(${angle})`}
          style={{ filter: 'drop-shadow(0 1px 3px rgba(0,0,0,0.20))' }}
        />
      ))}

      {/* Trumpet body */}
      <ellipse
        cx="0" cy="0"
        rx={tr} ry={tr * 1.22}
        fill="#ff8800"
        style={{ filter: 'drop-shadow(0 1px 3px rgba(0,0,0,0.30))' }}
      />

      {/* Trumpet rim — ruffled ring */}
      {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((a, i) => (
        <ellipse
          key={i}
          cx={Math.cos((a * Math.PI) / 180) * tr * 0.88}
          cy={Math.sin((a * Math.PI) / 180) * tr * 0.88}
          rx={tr * 0.30}
          ry={tr * 0.22}
          fill="#e05000"
          opacity="0.85"
        />
      ))}

      {/* Throat / deep center */}
      <ellipse cx="0" cy="0" rx={tr * 0.44} ry={tr * 0.50} fill="#c03000" opacity="0.80" />
      {/* Center highlight */}
      <ellipse cx={-tr * 0.12} cy={-tr * 0.14} rx={tr * 0.14} ry={tr * 0.10} fill="rgba(255,220,120,0.55)" />
    </svg>
  );
};

/* ─── Dense flower layer (Kokina-style scatter) ─── */
const FlowersLayer = React.memo(({ bloomed }) => {
  const flowers = useMemo(() => {
    return [...Array(280)].map((_, i) => ({
      id: i,
      x: random(-12, 112),
      y: random(-12, 112),
      rotation: random(0, 360),
      scale: random(1.5, 3.6),
      delay: i * 0.011,
      size: random(17, 32),
      leafCount: Math.floor(random(3, 7)),
    }));
  }, []);

  return (
    <>
      {flowers.map((f) => (
        <div
          key={f.id}
          style={{
            position: 'absolute',
            left: `${f.x}%`,
            top: `${f.y}%`,
            transform: bloomed
              ? `translate(-50%, -50%) rotate(${f.rotation}deg) scale(${f.scale})`
              : `translate(-50%, -50%) rotate(${f.rotation}deg) scale(0)`,
            opacity: bloomed ? 1 : 0,
            transition: `all 0.75s cubic-bezier(0.34, 1.56, 0.64, 1) ${f.delay}s`,
            zIndex: Math.floor(f.scale * 10),
          }}
        >
          {/* Narrow strap leaves */}
          {[...Array(f.leafCount)].map((_, i) => (
            <div
              key={`l-${i}`}
              style={{
                position: 'absolute',
                width: `${f.size * 4.0}px`,
                height: `${f.size * 0.52}px`,
                background: i % 2 === 0
                  ? 'linear-gradient(to right, #143620, #3a7a44)'
                  : 'linear-gradient(to right, #1a4228, #4e9454)',
                borderRadius: '100% 0 100% 0',
                transformOrigin: 'center center',
                transform: `rotate(${(360 / f.leafCount) * i + 12}deg) translateX(${f.size * 0.2}px)`,
                boxShadow: '1px 2px 4px rgba(0,0,0,0.35)',
                left: '50%',
                top: '50%',
                marginLeft: `-${f.size * 2.0}px`,
                marginTop: `-${f.size * 0.26}px`,
              }}
            />
          ))}

          {/* Flower head */}
          <div
            style={{
              position: 'relative',
              zIndex: 10,
              marginLeft: `-${f.size * 1.4}px`,
              marginTop: `-${f.size * 1.4}px`,
            }}
          >
            <DaffodilHead size={f.size} />
          </div>
        </div>
      ))}
    </>
  );
});

/* ─── Main component ─── */
const Nergis = () => {
  const [bloomed, setBloomed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    setTimeout(() => setBloomed(true), 10);

    const duration = 3500;
    const intervalTime = 50;
    const steps = duration / intervalTime;
    let currentStep = 0;

    const interval = setInterval(() => {
      currentStep++;
      const newProgress = Math.min((currentStep / steps) * 100, 100);
      setProgress(newProgress);
      if (currentStep >= steps) {
        clearInterval(interval);
        setTimeout(() => setLoading(false), 200);
      }
    }, intervalTime);

    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
      <FlowerLoader
        loading={loading}
        progress={progress}
        message="Nergisler açıyor..."
        glowColor="rgba(255, 220, 0, 0.9)"
        barStyle={{ background: 'linear-gradient(to right, #ffe033, #ff8c00)' }}
      />
      <FlowersLayer bloomed={bloomed} />
    </div>
  );
};

export default Nergis;
