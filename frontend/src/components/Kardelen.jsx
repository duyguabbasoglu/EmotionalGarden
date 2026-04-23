import React, { useMemo } from 'react';
import { useFlowerGrowth } from '../hooks/useFlowerGrowth';

const petalPath = (w, h) => (
  `M 0 0 C ${w * 0.45} ${h * 0.1}, ${w * 0.6} ${h * 0.55}, 0 ${h}` +
  ` C ${-w * 0.6} ${h * 0.55}, ${-w * 0.45} ${h * 0.1}, 0 0 Z`
);

const SnowdropIllustration = React.memo(() => {
  const { stems, leavesBack, leavesFront } = useMemo(() => {
    const stems = [
      { x: 210, y: 1030, h: 280, tilt: -10, droop: -22, headW: 42 },
      { x: 280, y: 1020, h: 300, tilt: -4, droop: -12, headW: 46 },
      { x: 350, y: 1040, h: 260, tilt: 6, droop: 6, headW: 40 },
      { x: 430, y: 1010, h: 320, tilt: 10, droop: 18, headW: 48 },
      { x: 520, y: 1040, h: 270, tilt: 14, droop: 24, headW: 38 },
      { x: 590, y: 1030, h: 290, tilt: -6, droop: -16, headW: 44 },
      { x: 650, y: 1045, h: 250, tilt: 8, droop: 10, headW: 36 }
    ];

    const leavesBack = [
      { x: 120, y: 1110, h: 420, w: 90, tilt: -22 },
      { x: 190, y: 1110, h: 460, w: 90, tilt: -8 },
      { x: 260, y: 1110, h: 420, w: 85, tilt: 6 },
      { x: 340, y: 1110, h: 480, w: 95, tilt: 14 },
      { x: 420, y: 1110, h: 520, w: 100, tilt: 10 },
      { x: 520, y: 1110, h: 470, w: 90, tilt: 18 },
      { x: 610, y: 1110, h: 440, w: 85, tilt: 8 }
    ];

    const leavesFront = [
      { x: 170, y: 1110, h: 360, w: 70, tilt: -18 },
      { x: 240, y: 1110, h: 380, w: 70, tilt: -4 },
      { x: 320, y: 1110, h: 340, w: 70, tilt: 10 },
      { x: 400, y: 1110, h: 380, w: 75, tilt: 16 },
      { x: 480, y: 1110, h: 350, w: 70, tilt: 8 },
      { x: 560, y: 1110, h: 370, w: 70, tilt: 20 },
      { x: 640, y: 1110, h: 330, w: 65, tilt: 12 }
    ];

    return { stems, leavesBack, leavesFront };
  }, []);

  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      <svg
        viewBox="0 0 800 1200"
        preserveAspectRatio="xMidYMax slice"
        style={{ width: '100%', height: '100%' }}
      >
        <defs>
          <linearGradient id="leafGrad" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0%" stopColor="#1f3f2a" />
            <stop offset="100%" stopColor="#7fbf84" />
          </linearGradient>
          <linearGradient id="stemGrad" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0%" stopColor="#2f5f3b" />
            <stop offset="100%" stopColor="#8ecf91" />
          </linearGradient>
          <radialGradient id="petalGrad" cx="40%" cy="20%" r="80%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="60%" stopColor="#f1f4f1" />
            <stop offset="100%" stopColor="#e5ece5" />
          </radialGradient>
          <linearGradient id="innerGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="70%" stopColor="#f2f6f3" />
            <stop offset="100%" stopColor="#e7eee7" />
          </linearGradient>
        </defs>

        <rect width="800" height="1200" fill="#f8fbf8" />

        {leavesBack.map((leaf, i) => (
          <path
            key={`leaf-back-${i}`}
            d={`M ${leaf.x} ${leaf.y} C ${leaf.x - leaf.w * 0.5} ${leaf.y - leaf.h * 0.3}, ${leaf.x - leaf.w * 0.3} ${leaf.y - leaf.h * 0.75}, ${leaf.x} ${leaf.y - leaf.h} C ${leaf.x + leaf.w * 0.3} ${leaf.y - leaf.h * 0.75}, ${leaf.x + leaf.w * 0.5} ${leaf.y - leaf.h * 0.3}, ${leaf.x} ${leaf.y} Z`}
            fill="url(#leafGrad)"
            transform={`rotate(${leaf.tilt} ${leaf.x} ${leaf.y})`}
            opacity="0.95"
          />
        ))}

        {stems.map((stem, i) => {
          const stemX = stem.x;
          const stemY = stem.y;
          const stemH = stem.h;
          const stemW = Math.max(3, stem.headW * 0.08);
          const headY = stemY - stemH + 20;
          const headW = stem.headW;
          const headH = headW * 1.5;
          const outerW = headW * 0.85;
          const outerH = headH * 1.15;
          const innerW = headW * 0.55;
          const innerH = headH * 0.75;

          return (
            <g key={`stem-${i}`}>
              <path
                d={`M ${stemX} ${stemY} C ${stemX + stem.tilt * 2} ${stemY - stemH * 0.35}, ${stemX + stem.tilt * 3} ${stemY - stemH * 0.7}, ${stemX} ${stemY - stemH}`}
                stroke="url(#stemGrad)"
                strokeWidth={stemW}
                fill="none"
                strokeLinecap="round"
              />

              <g transform={`translate(${stemX}, ${headY}) rotate(${stem.droop})`}>
                {[-18, 0, 18].map((angle, j) => (
                  <path
                    key={`outer-${i}-${j}`}
                    d={petalPath(outerW, outerH)}
                    fill="url(#petalGrad)"
                    transform={`rotate(${angle})`}
                    style={{ filter: 'drop-shadow(0 3px 6px rgba(0,0,0,0.2))' }}
                  />
                ))}

                {[-16, 0, 16].map((angle, j) => (
                  <g key={`inner-${i}-${j}`} transform={`rotate(${angle})`}>
                    <path
                      d={petalPath(innerW, innerH)}
                      fill="url(#innerGrad)"
                      style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.12))' }}
                    />
                    <path
                      d={`M ${-innerW * 0.2} ${innerH * 0.7} Q 0 ${innerH * 0.62} ${innerW * 0.2} ${innerH * 0.7}`}
                      stroke="#3f7c55"
                      strokeWidth="2"
                      fill="none"
                    />
                  </g>
                ))}

                <rect
                  x={-headW * 0.18}
                  y={-headH * 0.05}
                  width={headW * 0.36}
                  height={headH * 0.16}
                  rx="5"
                  fill="#3c7a50"
                />
              </g>
            </g>
          );
        })}

        {leavesFront.map((leaf, i) => (
          <path
            key={`leaf-front-${i}`}
            d={`M ${leaf.x} ${leaf.y} C ${leaf.x - leaf.w * 0.5} ${leaf.y - leaf.h * 0.3}, ${leaf.x - leaf.w * 0.3} ${leaf.y - leaf.h * 0.75}, ${leaf.x} ${leaf.y - leaf.h} C ${leaf.x + leaf.w * 0.3} ${leaf.y - leaf.h * 0.75}, ${leaf.x + leaf.w * 0.5} ${leaf.y - leaf.h * 0.3}, ${leaf.x} ${leaf.y} Z`}
            fill="url(#leafGrad)"
            transform={`rotate(${leaf.tilt} ${leaf.x} ${leaf.y})`}
            opacity="0.98"
          />
        ))}
      </svg>
    </div>
  );
});

const Kardelen = () => {
  const { bloomed, loading, progress } = useFlowerGrowth(3500);

  return (
    <div style={{
      position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none'
    }}>
      <div style={{
        position: 'absolute', inset: 0,
        zIndex: 9999,
        background: 'rgba(0, 0, 0, 0.3)',
        backdropFilter: 'blur(8px)',
        display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
        opacity: loading ? 1 : 0,
        transition: 'opacity 0.6s ease',
        pointerEvents: loading ? 'auto' : 'none'
      }}>
        <h2 style={{
          fontFamily: "'VT323', monospace",
          color: '#fff', fontSize: '38px', letterSpacing: '3px',
          margin: '0 0 20px 0',
          textShadow: '0 0 15px rgba(255, 255, 255, 0.8)'
        }}>
          Kardelenler uyanıyor...
        </h2>
        <div style={{
          width: '350px', height: '30px',
          border: '3px solid #fff',
          borderRadius: '50px',
          padding: '4px',
          background: 'rgba(0,0,0,0.5)',
          boxShadow: '0 5px 15px rgba(0,0,0,0.3)'
        }}>
          <div style={{
            width: `${progress}%`,
            height: '100%',
            borderRadius: '50px',
            background: '#fff',
            boxShadow: '0 0 15px rgba(255, 255, 255, 0.9)',
            transition: 'width 0.06s linear'
          }} />
        </div>
        <div style={{
          color: '#fff', marginTop: '15px',
          fontFamily: "'VT323', monospace", fontSize: '22px',
          textShadow: '0 0 5px #fff'
        }}>
          %{Math.floor(progress)}
        </div>
      </div>

      <SnowdropIllustration />
    </div>
  );
};

export default Kardelen;
