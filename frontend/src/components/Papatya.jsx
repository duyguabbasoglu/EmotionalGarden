import React, { useState, useEffect, useMemo } from 'react';
import FlowerLoader from './FlowerLoader';

const random = (min, max) => Math.random() * (max - min) + min;

/* ─── Organic Daisy Head Component ─── */
const OrganicDaisy = React.memo(({ size, petalCount, colorType }) => {
    const centerR = size * 0.35;

    // Generate unique petals for this daisy for a realistic, imperfect look
    const petals = useMemo(() => {
        const arr = [];
        const baseAngleStep = 360 / petalCount;
        for (let i = 0; i < petalCount; i++) {
            const angle = i * baseAngleStep + random(-3, 3); // slight angle jitter
            
            // Randomize petal dimensions
            const pl = size * random(1.4, 1.7);
            const pw = size * random(0.28, 0.36);
            
            // Spatula shape
            const c1x = pw * 0.55;
            const c1y = -pl * 0.06;
            const c2x = pw * 0.85;
            const c2y = -pl * 0.6;
            const ex = pw * random(0.2, 0.4);
            const ey = -pl;
            const tx = -pw * random(0.2, 0.4);
            const ty = -pl * random(1.0, 1.05);
            const c3x = -pw * 0.85;
            const c3y = -pl * 0.6;
            const c4x = -pw * 0.55;
            const c4y = -pl * 0.06;

            const d = `M 0 0 C ${c1x} ${c1y}, ${c2x} ${c2y}, ${ex} ${ey} Q 0 ${ty}, ${tx} ${ey} C ${c3x} ${c3y}, ${c4x} ${c4y}, 0 0 Z`;
            
            // White variations (some slightly gray/cream)
            const shade = random(240, 255);
            const fill = `rgb(${shade}, ${shade}, ${shade})`;

            arr.push({ d, angle, fill });
        }
        return arr;
    }, [size, petalCount]);

    // Center gradient URL based on colorType
    const gradUrl = `url(#daisyCenter${colorType})`;

    // Generate random pollen dots
    const dots = useMemo(() => {
        return Array.from({ length: Math.floor(size * 0.8) }).map(() => {
            const angle = random(0, Math.PI * 2);
            const r = random(0, centerR * 0.85);
            const dotR = random(size * 0.015, size * 0.035);
            // Pollen dots are soft, bright yellows
            const dotColor = colorType === 3 ? '#e6ee9c' : (colorType === 2 ? '#ffe082' : '#fff59d');
            return {
                cx: Math.cos(angle) * r,
                cy: Math.sin(angle) * r,
                r: dotR,
                fill: dotColor,
                opacity: random(0.4, 0.9)
            };
        });
    }, [size, centerR, colorType]);

    return (
        <svg
            width={size * 4}
            height={size * 4}
            viewBox={`${-size * 2} ${-size * 2} ${size * 4} ${size * 4}`}
            style={{ display: 'block', overflow: 'visible' }}
        >
            {/* Shadows for petals */}
            <g filter="drop-shadow(0 2px 4px rgba(0,0,0,0.2))">
                {petals.map((p, j) => (
                    <path
                        key={`p-${j}`}
                        d={p.d}
                        fill={p.fill}
                        stroke="rgba(200,200,200,0.2)"
                        strokeWidth={size * 0.01}
                        transform={`rotate(${p.angle})`}
                    />
                ))}
            </g>

            {/* Center dome */}
            <ellipse
                cx="0" cy="0"
                rx={centerR} ry={centerR * 0.9}
                fill={gradUrl}
                style={{ filter: 'drop-shadow(0 1px 3px rgba(0,0,0,0.3))' }}
            />
            {/* Center highlight */}
            <ellipse
                cx={-centerR * 0.15} cy={-centerR * 0.15}
                rx={centerR * 0.6} ry={centerR * 0.5}
                fill="#ffffff"
                opacity="0.15"
            />
            
            {/* Pollen dots */}
            {dots.map((dot, i) => (
                <circle key={`dot-${i}`} cx={dot.cx} cy={dot.cy} r={dot.r} fill={dot.fill} opacity={dot.opacity} />
            ))}
        </svg>
    );
});

/* ─── Wall of Daisies ─── */
const DaisyWall = React.memo(({ bloomed }) => {
    const daisies = useMemo(() => {
        // Create 250 large daisy heads spanning the entire screen width and height
        return Array.from({ length: 250 }).map((_, i) => ({
            id: i,
            x: random(-10, 110), // % width
            y: random(-10, 110), // % height
            rotation: random(0, 360),
            scale: random(0.8, 1.8), // Some very large, some smaller
            delay: random(0, 2.5), // Bloom cascade
            size: random(35, 60), // Giant close-up sizes
            petalCount: Math.floor(random(14, 28)), // Random petal counts
            colorType: Math.floor(random(0, 4)), // 0: Orange, 1: Greenish, 2: Yellow, 3: Brownish
            zIndex: Math.floor(random(1, 100))
        })).sort((a, b) => a.zIndex - b.zIndex); // Draw higher z-index on top
    }, []);

    return (
        <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
            <svg width="0" height="0" style={{ position: 'absolute' }}>
                <defs>
                    {/* 0: Lemon Yellow */}
                    <radialGradient id="daisyCenter0" cx="45%" cy="35%" r="65%">
                        <stop offset="0%" stopColor="#fff59d" />
                        <stop offset="60%" stopColor="#ffee58" />
                        <stop offset="100%" stopColor="#fbc02d" />
                    </radialGradient>
                    {/* 1: Bright Yellow */}
                    <radialGradient id="daisyCenter1" cx="45%" cy="35%" r="65%">
                        <stop offset="0%" stopColor="#fff9c4" />
                        <stop offset="60%" stopColor="#ffeb3b" />
                        <stop offset="100%" stopColor="#fdd835" />
                    </radialGradient>
                    {/* 2: Soft Golden Yellow */}
                    <radialGradient id="daisyCenter2" cx="45%" cy="35%" r="65%">
                        <stop offset="0%" stopColor="#fff59d" />
                        <stop offset="50%" stopColor="#fdd835" />
                        <stop offset="100%" stopColor="#ffb300" />
                    </radialGradient>
                    {/* 3: Fresh Yellow-Greenish */}
                    <radialGradient id="daisyCenter3" cx="45%" cy="35%" r="65%">
                        <stop offset="0%" stopColor="#f0f4c3" />
                        <stop offset="60%" stopColor="#dce775" />
                        <stop offset="100%" stopColor="#c0ca33" />
                    </radialGradient>
                </defs>
            </svg>

            {daisies.map((f) => (
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
                        transition: `all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) ${f.delay}s`,
                        zIndex: f.zIndex,
                        pointerEvents: 'none',
                    }}
                >
                    <div style={{ marginLeft: `-${f.size * 2}px`, marginTop: `-${f.size * 2}px` }}>
                        <OrganicDaisy size={f.size} petalCount={f.petalCount} colorType={f.colorType} />
                    </div>
                </div>
            ))}
        </div>
    );
});

const Papatya = () => {
    const [bloomed, setBloomed] = useState(false);
    const [loading, setLoading] = useState(true);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        // Start bloom slightly after mount
        setTimeout(() => setBloomed(true), 50);

        const duration = 3500;
        const intervalTime = 50;
        const steps = duration / intervalTime;
        let currentStep = 0;

        const interval = setInterval(() => {
            currentStep++;
            setProgress(Math.min((currentStep / steps) * 100, 100));
            if (currentStep >= steps) {
                clearInterval(interval);
                setTimeout(() => setLoading(false), 200);
            }
        }, intervalTime);

        return () => clearInterval(interval);
    }, []);

    return (
        <div style={{ 
            position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none',
            background: 'radial-gradient(circle at 50% 30%, #c5e1a5 0%, #8bc34a 40%, #558b2f 80%, #33691e 100%)'
        }}>
            {/* Lush green bokeh background elements */}
            <div style={{ position: 'absolute', top: '10%', left: '20%', width: '400px', height: '400px', background: '#dce775', borderRadius: '50%', filter: 'blur(100px)', opacity: 0.6 }} />
            <div style={{ position: 'absolute', bottom: '15%', right: '10%', width: '500px', height: '500px', background: '#7cb342', borderRadius: '50%', filter: 'blur(120px)', opacity: 0.7 }} />
            <div style={{ position: 'absolute', top: '50%', right: '25%', width: '350px', height: '350px', background: '#cddc39', borderRadius: '50%', filter: 'blur(110px)', opacity: 0.5 }} />
            <div style={{ position: 'absolute', top: '-10%', right: '-10%', width: '300px', height: '300px', background: '#fff59d', borderRadius: '50%', filter: 'blur(90px)', opacity: 0.4 }} />
            
            <FlowerLoader
                loading={loading}
                progress={progress}
                message="Papatya tarlası geliyor..."
                glowColor="rgba(255, 255, 255, 0.95)"
                barStyle={{ background: 'linear-gradient(to right, #ffffff, #fff59d)' }}
            />
            
            <DaisyWall bloomed={bloomed} />
        </div>
    );
};

export default Papatya;
