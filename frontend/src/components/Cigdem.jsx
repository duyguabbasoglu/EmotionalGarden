import React, { useState, useEffect, useMemo } from 'react';
import FlowerLoader from './FlowerLoader';

const random = (min, max) => Math.random() * (max - min) + min;
const randInt = (min, max) => Math.floor(random(min, max));

/* ─── Smooth crocus petal path ─── */
const smoothPetal = (w, h, bend) => {
    // A smooth, broad petal: wide in the middle, rounded tip
    // bend adds slight left/right asymmetry for organic feel
    const bx = bend * w * 0.15;
    return `M 0 0 ` +
        `C ${w * 0.65 + bx} ${-h * 0.08}, ${w * 0.85 + bx} ${-h * 0.45}, ${w * 0.35 + bx} ${-h * 0.92} ` +
        `Q ${bx * 0.5} ${-h * 1.06}, ${-w * 0.35 + bx} ${-h * 0.92} ` +
        `C ${-w * 0.85 + bx} ${-h * 0.45}, ${-w * 0.65 + bx} ${-h * 0.08}, 0 0 Z`;
};

/* ─── Single Crocus Flower ─── */
const CrocusFlower = React.memo(({ size, colorTheme }) => {
    const data = useMemo(() => {
        // Color palettes
        const palettes = [
            // 0: Deep Purple
            {
                outer: ['#5c2d91', '#6a35a8', '#4e2680', '#5a2a8e'],
                inner: ['#7b48b8', '#8856c8', '#6a3da5', '#9060cc'],
                vein: '#2e0f50',
                stamen: '#ff8c00',
            },
            // 1: Royal Violet
            {
                outer: ['#7b2fbe', '#6828a5', '#8a3dd0', '#7535c0'],
                inner: ['#9b5fd8', '#a568e0', '#8e50cc', '#b070e8'],
                vein: '#3e147a',
                stamen: '#ffa000',
            },
            // 2: White / Cream
            {
                outer: ['#f0eff5', '#e8e6f0', '#f5f4fa', '#ececf2'],
                inner: ['#ffffff', '#faf9ff', '#f8f7fc', '#fcfbff'],
                vein: '#d0c8e8',
                stamen: '#ffc107',
            },
            // 3: Golden Yellow
            {
                outer: ['#e8b800', '#d4a700', '#f0c400', '#ddb200'],
                inner: ['#ffd740', '#ffca28', '#ffe050', '#ffd030'],
                vein: '#907000',
                stamen: '#e65100',
            },
        ];
        const pal = palettes[colorTheme] || palettes[0];

        // Slightly random petal count for organic feel (5 or 6)
        const numPetals = Math.random() < 0.3 ? 5 : 6;
        const petals = [];

        for (let i = 0; i < numPetals; i++) {
            const isOuter = i % 2 === 0;
            // More angle jitter for less perfect placement
            const baseAngle = (i / numPetals) * 360;
            const angle = baseAngle + random(-8, 8);
            // More size variation between petals
            const petalW = size * (isOuter ? 0.44 : 0.34) * random(0.85, 1.15);
            const petalH = size * (isOuter ? 1.0 : 0.84) * random(0.88, 1.12);
            // More pronounced bend for natural curl
            const bend = random(-1.5, 1.5);
            const colors = isOuter ? pal.outer : pal.inner;
            const color = colors[randInt(0, colors.length)];
            // Slight opacity variation — petals in shadow look slightly darker
            const opacity = random(0.88, 1.0);

            petals.push({
                d: smoothPetal(petalW, petalH, bend),
                angle,
                color,
                isOuter,
                opacity,
            });
        }

        // Stamens - slight count variation
        const stamenCount = randInt(3, 5);
        const stamens = [];
        for (let i = 0; i < stamenCount; i++) {
            const angle = (i / stamenCount) * 360 + random(-20, 20);
            stamens.push({
                angle,
                len: size * random(0.20, 0.30),
                thickness: size * random(0.028, 0.042),
            });
        }

        return { petals, stamens, pal };
    }, [size, colorTheme]);

    const svgSize = size * 2.4;

    return (
        <svg
            width={svgSize} height={svgSize}
            viewBox={`${-svgSize / 2} ${-svgSize / 2} ${svgSize} ${svgSize}`}
            style={{ display: 'block', overflow: 'visible' }}
        >
            <g style={{ filter: 'drop-shadow(0 2px 5px rgba(0,0,0,0.35))' }}>
                {/* Outer petals first (behind) */}
                {data.petals.filter(p => p.isOuter).map((p, i) => (
                    <g key={`o-${i}`} transform={`rotate(${p.angle})`}>
                        <path
                            d={p.d}
                            fill={p.color}
                            stroke={data.pal.vein}
                            strokeWidth={size * 0.008}
                            opacity={0.95}
                        />
                        {/* Subtle vein line */}
                        <line x1="0" y1="0" x2="0" y2={-size * 0.75}
                            stroke={data.pal.vein} strokeWidth={size * 0.012} opacity="0.3" />
                    </g>
                ))}
                {/* Inner petals on top */}
                {data.petals.filter(p => !p.isOuter).map((p, i) => (
                    <g key={`i-${i}`} transform={`rotate(${p.angle})`}>
                        <path
                            d={p.d}
                            fill={p.color}
                            stroke={data.pal.vein}
                            strokeWidth={size * 0.006}
                            opacity={0.97}
                        />
                        <line x1="0" y1="0" x2="0" y2={-size * 0.6}
                            stroke={data.pal.vein} strokeWidth={size * 0.01} opacity="0.2" />
                    </g>
                ))}
                {/* Stamens */}
                {data.stamens.map((s, i) => {
                    const rad = s.angle * Math.PI / 180;
                    const ex = Math.cos(rad) * s.len;
                    const ey = Math.sin(rad) * s.len;
                    return (
                        <g key={`st-${i}`}>
                            <line x1="0" y1="0" x2={ex} y2={ey}
                                stroke="#dda020" strokeWidth={s.thickness}
                                strokeLinecap="round" />
                            {/* Anther (pollen tip) */}
                            <ellipse cx={ex} cy={ey}
                                rx={size * 0.04} ry={size * 0.06}
                                fill={data.pal.stamen}
                                transform={`rotate(${s.angle} ${ex} ${ey})`}
                            />
                        </g>
                    );
                })}
                {/* Tiny pistil center */}
                <circle cx="0" cy="0" r={size * 0.05} fill="#ffcc00" opacity="0.8" />
            </g>
        </svg>
    );
});

/* ─── Wall of Crocuses ─── */
const CrocusWall = React.memo(({ bloomed }) => {
    const crocuses = useMemo(() => {
        // Color distribution: mostly purple, some white, some yellow
        const themes = [0, 0, 0, 1, 1, 2, 3]; // weighted to purple

        return Array.from({ length: 400 }).map((_, i) => ({
            id: i,
            x: random(-18, 118),
            y: random(-18, 118),
            rotation: random(-20, 20),
            scale: random(0.9, 2.2),
            delay: random(0, 2.5),
            size: random(45, 85),
            colorTheme: themes[randInt(0, themes.length)],
            zIndex: randInt(1, 100),
        })).sort((a, b) => a.zIndex - b.zIndex);
    }, []);

    return (
        <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
            {crocuses.map((f) => (
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
                        transition: `all 1s cubic-bezier(0.34, 1.4, 0.64, 1) ${f.delay}s`,
                        zIndex: f.zIndex,
                        pointerEvents: 'none',
                    }}
                >
                    <div style={{
                        marginLeft: `-${f.size * 1.2}px`,
                        marginTop: `-${f.size * 1.2}px`,
                    }}>
                        <CrocusFlower size={f.size} colorTheme={f.colorTheme} />
                    </div>
                </div>
            ))}
        </div>
    );
});

const Cigdem = () => {
    const [bloomed, setBloomed] = useState(false);
    const [loading, setLoading] = useState(true);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
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
            background: 'radial-gradient(circle at 45% 55%, #2d5a1b 0%, #1a3d0e 45%, #0d2208 85%, #060f04 100%)'
        }}>
            {/* Warm green bokeh */}
            <div style={{ position: 'absolute', top: '15%', left: '20%', width: '500px', height: '500px', background: '#3a7d24', borderRadius: '50%', filter: 'blur(130px)', opacity: 0.4 }} />
            <div style={{ position: 'absolute', bottom: '5%', right: '10%', width: '450px', height: '450px', background: '#1e5c0f', borderRadius: '50%', filter: 'blur(110px)', opacity: 0.5 }} />
            <div style={{ position: 'absolute', top: '60%', left: '5%', width: '350px', height: '350px', background: '#2a6818', borderRadius: '50%', filter: 'blur(100px)', opacity: 0.35 }} />
            {/* Subtle purple tint from flowers */}
            <div style={{ position: 'absolute', top: '5%', right: '25%', width: '400px', height: '400px', background: '#3a1070', borderRadius: '50%', filter: 'blur(120px)', opacity: 0.15 }} />

            <FlowerLoader
                loading={loading}
                progress={progress}
                message="Çiğdemler açıyor..."
                glowColor="rgba(180, 100, 255, 0.9)"
                barStyle={{ background: 'linear-gradient(to right, #9d4edd, #5b2d8e)' }}
            />

            <CrocusWall bloomed={bloomed} />
        </div>
    );
};

export default Cigdem;
