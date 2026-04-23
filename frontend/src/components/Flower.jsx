import React from 'react';

const rufflePath = (r, depth, points) => {
    const step = (Math.PI * 2) / points;
    let d = '';
    for (let i = 0; i <= points; i += 1) {
        const angle = i * step;
        const radius = r + (i % 2 === 0 ? depth : -depth);
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;
        if (i === 0) {
            d = `M ${x.toFixed(2)} ${y.toFixed(2)}`;
        } else {
            const mid = angle - step / 2;
            const cx = Math.cos(mid) * (r + depth * 1.2);
            const cy = Math.sin(mid) * (r + depth * 1.2);
            d += ` Q ${cx.toFixed(2)} ${cy.toFixed(2)} ${x.toFixed(2)} ${y.toFixed(2)}`;
        }
    }
    return `${d} Z`;
};

const Flower = ({ type, onClick }) => {
    const renderFlowerPreview = () => {
        if (type.name === "Çiğdem") {
            // Realistic single crocus, top-down view — fills the cell like Kokina
            const cx = 40, cy = 42;

            // Smooth broad petal path: wide in middle, rounded tip
            const petal = (angle, len, w, bx) => {
                const r = angle * Math.PI / 180;
                const c = Math.cos(r), s = Math.sin(r);
                const T = (x, y) => `${(cx + x * c - y * s).toFixed(1)} ${(cy + x * s + y * c).toFixed(1)}`;
                return `M ${cx} ${cy} ` +
                    `C ${T(w * 0.65 + bx, -len * 0.08)} ${T(w * 0.85 + bx, -len * 0.46)} ${T(w * 0.3 + bx, -len * 0.94)} ` +
                    `Q ${T(bx * 0.4, -len * 1.06)} ${T(-w * 0.3 + bx, -len * 0.94)} ` +
                    `C ${T(-w * 0.85 + bx, -len * 0.46)} ${T(-w * 0.65 + bx, -len * 0.08)} ${cx} ${cy} Z`;
            };

            // Outer 3 petals (bigger) + inner 3 petals (slightly smaller, offset 60°)
            const outerPetals = [0, 120, 240].map(a => ({ angle: a - 90, len: 21, w: 7.5, bx: (a % 240 === 0 ? 0.5 : -0.5) }));
            const innerPetals = [60, 180, 300].map(a => ({ angle: a - 90, len: 18, w: 6, bx: (a % 180 === 0 ? -0.4 : 0.4) }));

            return (
                <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
                    <svg viewBox="0 0 80 80" width="100%" height="100%" style={{ display: 'block', overflow: 'visible' }}>
                        <defs>
                            <radialGradient id="cigGO" cx="35%" cy="25%" r="75%">
                                <stop offset="0%" stopColor="#a86ae0" />
                                <stop offset="55%" stopColor="#6a0dad" />
                                <stop offset="100%" stopColor="#3a0060" />
                            </radialGradient>
                            <radialGradient id="cigGI" cx="35%" cy="25%" r="75%">
                                <stop offset="0%" stopColor="#c090f0" />
                                <stop offset="55%" stopColor="#8530cc" />
                                <stop offset="100%" stopColor="#4a0080" />
                            </radialGradient>
                            <radialGradient id="cigGC" cx="50%" cy="40%" r="70%">
                                <stop offset="0%" stopColor="#fff9c4" />
                                <stop offset="45%" stopColor="#ffcc00" />
                                <stop offset="100%" stopColor="#e65100" />
                            </radialGradient>
                        </defs>

                        {/* Outer petals */}
                        {outerPetals.map((p, i) => (
                            <g key={`o-${i}`} style={{ filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.35))' }}>
                                {/* vein */}
                                <line
                                    x1={cx} y1={cy}
                                    x2={(cx + Math.cos((p.angle) * Math.PI / 180) * 17).toFixed(1)}
                                    y2={(cy + Math.sin((p.angle) * Math.PI / 180) * 17).toFixed(1)}
                                    stroke="#2d005a" strokeWidth="0.5" opacity="0.4"
                                />
                                <path d={petal(p.angle, p.len, p.w, p.bx)}
                                    fill="url(#cigGO)" stroke="#2a0055" strokeWidth="0.35" opacity="0.96" />
                            </g>
                        ))}
                        {/* Inner petals */}
                        {innerPetals.map((p, i) => (
                            <g key={`i-${i}`} style={{ filter: 'drop-shadow(0 1px 1.5px rgba(0,0,0,0.3))' }}>
                                <line
                                    x1={cx} y1={cy}
                                    x2={(cx + Math.cos((p.angle) * Math.PI / 180) * 14).toFixed(1)}
                                    y2={(cy + Math.sin((p.angle) * Math.PI / 180) * 14).toFixed(1)}
                                    stroke="#350070" strokeWidth="0.4" opacity="0.35"
                                />
                                <path d={petal(p.angle, p.len, p.w, p.bx)}
                                    fill="url(#cigGI)" stroke="#2a0055" strokeWidth="0.3" opacity="0.97" />
                            </g>
                        ))}

                        {/* Stamens */}
                        {[0, 120, 240].map((a, i) => {
                            const r = a * Math.PI / 180;
                            const sx = cx + Math.cos(r) * 5;
                            const sy = cy + Math.sin(r) * 5;
                            return (
                                <g key={`st-${i}`}>
                                    <line x1={cx} y1={cy} x2={sx} y2={sy}
                                        stroke="#e8a020" strokeWidth="1.2" strokeLinecap="round" />
                                    <ellipse cx={sx} cy={sy} rx="1.5" ry="2"
                                        fill="#ff7000"
                                        transform={`rotate(${a} ${sx} ${sy})`} />
                                </g>
                            );
                        })}
                        {/* Pistil center */}
                        <circle cx={cx} cy={cy} r="3" fill="url(#cigGC)"
                            style={{ filter: 'drop-shadow(0 0 3px rgba(255,150,0,0.6))' }} />
                    </svg>
                </div>
            );
        }

        if (type.name === "Karanfil") {
            const outer = rufflePath(18, 3, 16);
            const mid = rufflePath(13, 2.5, 14);
            const inner = rufflePath(8, 2, 12);

            return (
                <div style={{
                    position: 'absolute',
                    top: '50%', left: '50%',
                    transform: 'translate(-50%, -50%) scale(0.7)',
                    pointerEvents: 'none'
                }}>
                    {/* stem */}
                    <div style={{
                        position: 'absolute',
                        bottom: '-26px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        width: '4px',
                        height: '40px',
                        background: 'linear-gradient(to top, #2f5f3b, #9ed5a1)',
                        borderRadius: '999px',
                        zIndex: 1
                    }} />

                    {/* leaves */}
                    <div style={{
                        position: 'absolute',
                        bottom: '-20px',
                        left: '-10px',
                        width: '7px',
                        height: '38px',
                        background: 'linear-gradient(to top, #2c5a38, #9cd7a3)',
                        borderRadius: '20px',
                        transform: 'rotate(-28deg)',
                        zIndex: 1
                    }} />
                    <div style={{
                        position: 'absolute',
                        bottom: '-18px',
                        right: '-8px',
                        width: '7px',
                        height: '34px',
                        background: 'linear-gradient(to top, #2c5a38, #a4ddaa)',
                        borderRadius: '20px',
                        transform: 'rotate(24deg)',
                        zIndex: 1
                    }} />
                    <div style={{
                        position: 'absolute',
                        bottom: '-16px',
                        left: '-2px',
                        width: '6px',
                        height: '30px',
                        background: 'linear-gradient(to top, #2c5a38, #9cd7a3)',
                        borderRadius: '20px',
                        transform: 'rotate(6deg)',
                        zIndex: 1
                    }} />

                    {/* bloom */}
                    <svg
                        width="56"
                        height="56"
                        viewBox="-30 -30 60 60"
                        style={{ position: 'absolute', top: '-20px', left: '50%', transform: 'translateX(-50%)', zIndex: 2 }}
                    >
                        <defs>
                            <radialGradient id="miniOuter" cx="40%" cy="20%" r="80%">
                                <stop offset="0%" stopColor="#ffe0e6" />
                                <stop offset="60%" stopColor="#f1a7b3" />
                                <stop offset="100%" stopColor="#d84b5f" />
                            </radialGradient>
                            <radialGradient id="miniMid" cx="45%" cy="25%" r="75%">
                                <stop offset="0%" stopColor="#ffd6df" />
                                <stop offset="60%" stopColor="#e98da0" />
                                <stop offset="100%" stopColor="#c53a52" />
                            </radialGradient>
                            <radialGradient id="miniInner" cx="50%" cy="30%" r="70%">
                                <stop offset="0%" stopColor="#fff1f4" />
                                <stop offset="70%" stopColor="#f4c3cb" />
                                <stop offset="100%" stopColor="#d58395" />
                            </radialGradient>
                        </defs>
                        <g transform="scale(1,0.92)">
                            <path d={outer} fill="url(#miniOuter)" />
                            <path d={mid} fill="url(#miniMid)" />
                            <path d={inner} fill="url(#miniInner)" />
                        </g>
                    </svg>
                </div>
            );
        }
        if (type.name === "Karanfil") {
            const ruffledCircle = (cx, cy, r, seed) => {
                let d = '';
                const numPoints = 24;
                for (let i = 0; i < numPoints; i++) {
                    const angle = (i / numPoints) * Math.PI * 2;
                    const noise = Math.sin(i * 3.5 + seed) * (r * 0.15) + Math.cos(i * 7.2 + seed) * (r * 0.1);
                    const rr = r + noise;
                    const x = cx + Math.cos(angle) * rr;
                    const y = cy + Math.sin(angle) * rr;
                    if (i === 0) d += `M ${x} ${y}`;
                    else d += ` L ${x} ${y}`;
                }
                return d + ' Z';
            };

            const carnations = [
                { cx: 35, cy: 30, r: 12, fill: '#d90429', seed: 1 }, // Red
                { cx: 50, cy: 35, r: 10, fill: '#ffb6c1', seed: 2 }, // Pink
                { cx: 28, cy: 45, r: 11, fill: '#ff69b4', seed: 3 }, // Fuchsia
                { cx: 45, cy: 52, r: 13, fill: '#fff59d', seed: 4 }, // Pale Yellow
                { cx: 38, cy: 40, r: 14, fill: '#ff8c69', seed: 5 }, // Salmon
            ];

            return (
                <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
                    <svg viewBox="0 0 80 80" width="100%" height="100%" style={{ display: 'block', overflow: 'visible' }}>
                        <g transform="scale(0.8) translate(10, 10)">
                            {/* Leaves */}
                            <ellipse cx="30" cy="30" rx="15" ry="5" fill="#2d6a4f" transform="rotate(-20 30 30)" opacity="0.9"/>
                            <ellipse cx="50" cy="50" rx="16" ry="6" fill="#1b4332" transform="rotate(35 50 50)" opacity="0.9"/>

                            {carnations.map((c, i) => (
                                <g key={`carn-${i}`} style={{ filter: 'drop-shadow(0 2px 2px rgba(0,0,0,0.3))' }}>
                                    <path d={ruffledCircle(c.cx, c.cy, c.r, c.seed)} fill={c.fill} />
                                    <path d={ruffledCircle(c.cx, c.cy, c.r * 0.7, c.seed + 1)} fill="#ffffff" opacity="0.25" />
                                    <path d={ruffledCircle(c.cx, c.cy, c.r * 0.4, c.seed + 2)} fill="#ffffff" opacity="0.4" />
                                </g>
                            ))}
                        </g>
                    </svg>
                </div>
            );
        }

        if (type.name === "Nergis") {
            const buds = [
                { cx: 28, cy: 30, r: 10 },
                { cx: 50, cy: 22, r: 8.5 },
                { cx: 42, cy: 44, r: 9 },
            ];
            const petalD = (cx, cy, r) => {
                const pl = r * 1.7;
                const pw = r * 0.62;
                return [0, 60, 120, 180, 240, 300].map(angle => {
                    const rad = (angle * Math.PI) / 180;
                    const cos = Math.cos(rad), sin = Math.sin(rad);
                    const rot = (x, y) => [cx + x * cos - y * sin, cy + x * sin + y * cos];
                    const [c1x, c1y] = rot(pw, -pl * 0.07);
                    const [c2x, c2y] = rot(pw * 0.88, -pl * 0.70);
                    const [ex, ey]   = rot(0, -pl);
                    const [c3x, c3y] = rot(-pw * 0.88, -pl * 0.70);
                    const [c4x, c4y] = rot(-pw, -pl * 0.07);
                    return `M ${cx} ${cy} C ${c1x} ${c1y}, ${c2x} ${c2y}, ${ex} ${ey} C ${c3x} ${c3y}, ${c4x} ${c4y}, ${cx} ${cy} Z`;
                });
            };
            return (
                <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
                    <svg viewBox="0 0 80 80" width="100%" height="100%" style={{ display: 'block', overflow: 'visible' }}>
                        <defs>
                            <radialGradient id="nYellow" cx="40%" cy="20%" r="90%">
                                <stop offset="0%" stopColor="#fff97a" />
                                <stop offset="40%" stopColor="#ffe033" />
                                <stop offset="100%" stopColor="#c49000" />
                            </radialGradient>
                            <radialGradient id="nYellow2" cx="55%" cy="25%" r="85%">
                                <stop offset="0%" stopColor="#fff59d" />
                                <stop offset="40%" stopColor="#ffd000" />
                                <stop offset="100%" stopColor="#b37a00" />
                            </radialGradient>
                            <radialGradient id="nTrumpet" cx="50%" cy="35%" r="70%">
                                <stop offset="0%" stopColor="#ffcc66" />
                                <stop offset="50%" stopColor="#ff8800" />
                                <stop offset="100%" stopColor="#c44000" />
                            </radialGradient>
                        </defs>
                        {buds.map((b, bi) =>
                            petalD(b.cx, b.cy, b.r).map((path, j) => (
                                <path key={`p-${bi}-${j}`} d={path}
                                    fill={j % 2 === 0 ? 'url(#nYellow)' : 'url(#nYellow2)'}
                                    stroke="rgba(140,90,0,0.18)" strokeWidth="0.3"
                                    style={{ filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.2))' }} />
                            ))
                        )}
                        {buds.map((b, i) => (
                            <g key={`t-${i}`}>
                                <ellipse cx={b.cx} cy={b.cy} rx={b.r * 0.40} ry={b.r * 0.48}
                                    fill="url(#nTrumpet)" style={{ filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.25))' }} />
                                <ellipse cx={b.cx} cy={b.cy} rx={b.r * 0.18} ry={b.r * 0.20}
                                    fill="#c03000" opacity="0.80" />
                            </g>
                        ))}
                    </svg>
                </div>
            );
        }

        if (type.name === "Papatya") {
            const buds = [
                { cx: 35, cy: 30, r: 8.5 },
                { cx: 50, cy: 35, r: 10 },
                { cx: 28, cy: 45, r: 9 },
                { cx: 45, cy: 52, r: 11 },
                { cx: 38, cy: 40, r: 12 }, // Center/top flower drawn last
            ];
            
            const pPetalD = (cx, cy, r) => {
                const pl = r * 1.5;
                const pw = r * 0.35;
                return Array.from({ length: 16 }, (_, i) => (360 / 16) * i).map(angle => {
                    const rad = (angle * Math.PI) / 180;
                    const cos = Math.cos(rad), sin = Math.sin(rad);
                    const rot = (x, y) => [cx + x * cos - y * sin, cy + x * sin + y * cos];
                    const [c1x, c1y] = rot(pw * 0.55, -pl * 0.06);
                    const [c2x, c2y] = rot(pw * 0.80, -pl * 0.60);
                    const [ex, ey]   = rot(pw * 0.42, -pl);
                    const [tx, ty]   = rot(-pw * 0.42, -pl);
                    const [c3x, c3y] = rot(-pw * 0.80, -pl * 0.60);
                    const [c4x, c4y] = rot(-pw * 0.55, -pl * 0.06);
                    return `M ${cx} ${cy} C ${c1x} ${c1y}, ${c2x} ${c2y}, ${ex} ${ey} Q ${rot(0, -pl*1.07)[0]} ${rot(0, -pl*1.07)[1]}, ${tx} ${ty} C ${c3x} ${c3y}, ${c4x} ${c4y}, ${cx} ${cy} Z`;
                });
            };
            
            return (
                <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
                    <svg viewBox="0 0 80 80" width="100%" height="100%" style={{ display: 'block', overflow: 'visible' }}>
                        <g transform="scale(0.8) translate(10, 10)">
                            {/* Optional: Add a couple of dark green leaves beneath the cluster */}
                            <ellipse cx="30" cy="30" rx="15" ry="6" fill="#558b2f" transform="rotate(-30 30 30)" opacity="0.8"/>
                            <ellipse cx="50" cy="50" rx="18" ry="7" fill="#33691e" transform="rotate(45 50 50)" opacity="0.8"/>

                            {buds.map((b, bi) =>
                                pPetalD(b.cx, b.cy, b.r).map((path, j) => (
                                    <path key={`dp-${bi}-${j}`} d={path}
                                        fill={j % 2 === 0 ? '#ffffff' : '#fcfcfc'}
                                        stroke="rgba(160,160,160,0.15)" strokeWidth="0.25"
                                        style={{ filter: 'drop-shadow(0 1px 1.5px rgba(0,0,0,0.15))' }} />
                                ))
                            )}
                            {buds.map((b, i) => (
                                <g key={`dt-${i}`}>
                                    <ellipse cx={b.cx} cy={b.cy} rx={b.r * 0.35} ry={b.r * 0.35}
                                        fill="#fbc02d" style={{ filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.25))' }} />
                                    <ellipse cx={b.cx - b.r * 0.08} cy={b.cy - b.r * 0.08} rx={b.r * 0.15} ry={b.r * 0.15}
                                        fill="#fff59d" opacity="0.8" />
                                </g>
                            ))}
                        </g>
                    </svg>
                </div>
            );
        }

        // Default: Kokina preview (berries)
        return (
            <div style={{
                position: 'absolute',
                top: '50%', left: '50%',
                transform: 'translate(-50%, -50%) scale(0.25) rotate(-15deg)',
                pointerEvents: 'none'
            }}>
                {/* leaves */}
                {[...Array(5)].map((_, i) => (
                    <div key={`leaf-${i}`} style={{
                        position: 'absolute',
                        width: '60px', height: '20px',
                        background: 'linear-gradient(to right, #1a472a, #2d6a4f)',
                        borderRadius: '80% 0 80% 0',
                        transformOrigin: 'center left',
                        transform: `rotate(${i * 72}deg) translateX(10px)`,
                        boxShadow: '1px 1px 3px rgba(0,0,0,0.2)'
                    }} />
                ))}
                {/* fruits */}
                <div style={{ position: 'relative', zIndex: 2 }}>
                    {[...Array(7)].map((_, i) => (
                        <div key={`berry-${i}`} style={{
                            position: 'absolute',
                            width: '18px', height: '18px',
                            borderRadius: '50%',
                            background: 'radial-gradient(circle at 30% 30%, #ff4d4d 0%, #d90429 60%)',
                            transform: `translate(${Math.cos(i) * 15}px, ${Math.sin(i) * 15}px)`,
                            boxShadow: '1px 1px 5px rgba(0,0,0,0.3)'
                        }} />
                    ))}
                </div>
            </div>
        );
    };

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
            {renderFlowerPreview()}

            {/* chatbox */}
            <div className="chatbox">
                <strong style={{
                    display: 'block', fontSize: '14px', marginBottom: '4px',
                    color: type.name === "Çiğdem" ? '#6a0dad' : type.name === "Karanfil" ? '#a63b50' : type.name === "Nergis" ? '#b37a00' : type.name === "Papatya" ? '#e89500' : '#d90429'
                }}>
                    {type.name}
                </strong>
                <span style={{ fontSize: '11px', color: '#555', lineHeight: '1.2', display: 'block' }}>
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
          width: 160px;
          background: #fff;
          color: #333;
          padding: 12px;
          border-radius: 12px;
          box-shadow: 0 4px 15px rgba(0,0,0,0.3);
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
          border-color: #fff transparent transparent transparent;
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
