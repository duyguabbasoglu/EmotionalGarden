import React, { useState, useEffect, useMemo } from 'react';
import FlowerLoader from './FlowerLoader';

const random = (min, max) => Math.random() * (max - min) + min;
const randInt = (min, max) => Math.floor(random(min, max));

/* ─── Single carnation petal: broad fan/scallop shape with frilly top ─── */
const carnationPetal = (petalW, petalH, frillyness, seed) => {
    // Wide base, expanding into a broad fan with a ruffled top edge
    const hw = petalW / 2;
    
    // Bottom: narrow base
    let d = `M ${-hw * 0.2} 0`;
    
    // Left side curves outward
    d += ` C ${-hw * 0.5} ${-petalH * 0.15}, ${-hw * 1.1} ${-petalH * 0.4}, ${-hw * 1.0} ${-petalH * 0.65}`;
    
    // Frilly top edge - multiple small bumps across the top
    const topPoints = 8;
    for (let i = 0; i <= topPoints; i++) {
        const t = i / topPoints;
        const x = -hw * 1.0 + t * hw * 2.0;
        const baseY = -petalH * (0.85 + Math.sin(t * Math.PI) * 0.15); // arch shape
        const frill = Math.sin((t * topPoints + seed) * Math.PI * 2) * frillyness;
        const frill2 = Math.cos((t * topPoints * 1.7 + seed) * Math.PI) * frillyness * 0.5;
        const y = baseY + frill + frill2;
        
        if (i === 0) {
            d += ` Q ${-hw * 0.95} ${-petalH * 0.75}, ${x.toFixed(2)} ${y.toFixed(2)}`;
        } else {
            d += ` L ${x.toFixed(2)} ${y.toFixed(2)}`;
        }
    }
    
    // Right side curves back down
    d += ` C ${hw * 1.1} ${-petalH * 0.4}, ${hw * 0.5} ${-petalH * 0.15}, ${hw * 0.2} 0`;
    d += ' Z';
    
    return d;
};

/* ─── Single Carnation Head ─── */
const CarnationHead = React.memo(({ size, colorTheme, hasBicolor }) => {
    const petals = useMemo(() => {
        const arr = [];
        
        // Color palettes matching reference photo
        const palettes = [
            // 0: Deep Crimson Red
            { base: '#c41030', shades: ['#b30a28', '#d41838', '#a80820', '#cc1835'] },
            // 1: Soft Pink
            { base: '#f8a4b8', shades: ['#ffc0cb', '#f48da0', '#ffb6c1', '#f0909e'] },
            // 2: Bright Yellow
            { base: '#f5d800', shades: ['#ffe033', '#e8cc00', '#ffd700', '#f0d400'] },
            // 3: Hot Pink / Fuchsia  
            { base: '#e91e7a', shades: ['#d81b60', '#f02888', '#c2185b', '#ff2d8a'] },
            // 4: White / Cream
            { base: '#fff8f0', shades: ['#ffffff', '#fff5e8', '#fffaf5', '#f8f0e4'] },
            // 5: Coral Pink
            { base: '#ff7094', shades: ['#ff8ca8', '#f06080', '#ff6088', '#ff90a8'] },
        ];
        
        const pal = palettes[colorTheme] || palettes[0];
        
        // 3 rings of petals
        const rings = [
            { count: 12, radiusRatio: 0.85, petalScale: 1.0 },   // Outer ring
            { count: 10, radiusRatio: 0.55, petalScale: 0.75 },   // Middle ring
            { count: 7, radiusRatio: 0.25, petalScale: 0.5 },     // Inner ring
        ];
        
        rings.forEach((ring, ringIdx) => {
            for (let i = 0; i < ring.count; i++) {
                const angle = (i / ring.count) * 360 + random(-8, 8) + ringIdx * 15;
                const petalW = size * 0.5 * ring.petalScale * random(0.85, 1.15);
                const petalH = size * 0.55 * ring.petalScale * random(0.9, 1.1);
                const frillyness = size * 0.04 * random(0.8, 1.5);
                const shade = pal.shades[randInt(0, pal.shades.length)];
                const seed = random(0, 10);
                
                arr.push({
                    angle,
                    petalW,
                    petalH,
                    frillyness,
                    seed,
                    color: shade,
                    ringIdx,
                    // White edge for bicolor carnations
                    whiteEdge: hasBicolor && ringIdx < 2,
                });
            }
        });
        
        return arr;
    }, [size, colorTheme, hasBicolor]);

    const svgSize = size * 2.4;
    
    return (
        <svg
            width={svgSize}
            height={svgSize}
            viewBox={`${-svgSize/2} ${-svgSize/2} ${svgSize} ${svgSize}`}
            style={{ display: 'block', overflow: 'visible' }}
        >
            <g style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' }}>
                {petals.map((p, idx) => {
                    const d = carnationPetal(p.petalW, p.petalH, p.frillyness, p.seed);
                    return (
                        <g key={idx} transform={`rotate(${p.angle})`}>
                            <path
                                d={d}
                                fill={p.color}
                                stroke={`rgba(0,0,0,0.06)`}
                                strokeWidth={0.3}
                            />
                        </g>
                    );
                })}
                {/* Tiny center */}
                <circle cx="0" cy="0" r={size * 0.04} fill="rgba(0,0,0,0.15)" />
            </g>
        </svg>
    );
});

/* ─── Green Stems Background ─── */
const StemsBackground = React.memo(() => {
    const elements = useMemo(() => {
        const stems = [];
        for (let i = 0; i < 60; i++) {
            stems.push({
                x: random(-5, 105),
                y1: random(100, 120),
                y2: random(-20, 30),
                curve: random(-15, 15),
                width: random(2, 4),
                color: `hsl(${randInt(130, 155)}, ${randInt(40, 65)}%, ${randInt(20, 38)}%)`,
            });
        }
        const leaves = [];
        for (let i = 0; i < 40; i++) {
            leaves.push({
                x: random(0, 100),
                y: random(20, 90),
                w: random(15, 30),
                h: random(5, 10),
                rot: random(-60, 60),
                color: `hsl(${randInt(130, 155)}, ${randInt(35, 55)}%, ${randInt(22, 40)}%)`,
            });
        }
        return { stems, leaves };
    }, []);

    return (
        <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} preserveAspectRatio="none">
            {elements.stems.map((s, i) => (
                <line
                    key={`s-${i}`}
                    x1={`${s.x}%`} y1={`${s.y1}%`}
                    x2={`${s.x + s.curve}%`} y2={`${s.y2}%`}
                    stroke={s.color}
                    strokeWidth={s.width}
                    strokeLinecap="round"
                />
            ))}
            {elements.leaves.map((l, i) => (
                <ellipse
                    key={`l-${i}`}
                    cx={`${l.x}%`} cy={`${l.y}%`}
                    rx={l.w} ry={l.h}
                    fill={l.color}
                    transform={`rotate(${l.rot} ${l.x * 15.12} ${l.y * 7.3})`}
                    opacity="0.85"
                />
            ))}
        </svg>
    );
});

/* ─── Wall of Carnations ─── */
const CarnationWall = React.memo(({ bloomed }) => {
    const carnations = useMemo(() => {
        return Array.from({ length: 400 }).map((_, i) => ({
            id: i,
            x: random(-18, 118),
            y: random(-18, 118),
            rotation: random(0, 360),
            scale: random(1.0, 2.5),
            delay: random(0, 2.5),
            size: random(65, 110),
            colorTheme: randInt(0, 6),
            hasBicolor: false,
            zIndex: randInt(1, 100)
        })).sort((a, b) => a.zIndex - b.zIndex);
    }, []);

    return (
        <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
            {carnations.map((f) => (
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
                        transition: `all 0.9s cubic-bezier(0.34, 1.56, 0.64, 1) ${f.delay}s`,
                        zIndex: f.zIndex,
                        pointerEvents: 'none',
                    }}
                >
                    <div style={{ 
                        marginLeft: `-${f.size * 1.2}px`, 
                        marginTop: `-${f.size * 1.2}px` 
                    }}>
                        <CarnationHead size={f.size} colorTheme={f.colorTheme} hasBicolor={f.hasBicolor} />
                    </div>
                </div>
            ))}
        </div>
    );
});

const Karanfil = () => {
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
            background: 'radial-gradient(circle at 50% 50%, #2e7d32 0%, #1b5e20 40%, #0d3d12 80%, #06250a 100%)'
        }}>
            {/* Green bokeh background like the reference */}
            <div style={{ position: 'absolute', top: '10%', left: '15%', width: '450px', height: '450px', background: '#4caf50', borderRadius: '50%', filter: 'blur(120px)', opacity: 0.4 }} />
            <div style={{ position: 'absolute', bottom: '10%', right: '10%', width: '400px', height: '400px', background: '#388e3c', borderRadius: '50%', filter: 'blur(100px)', opacity: 0.5 }} />
            <div style={{ position: 'absolute', top: '40%', right: '20%', width: '350px', height: '350px', background: '#1b5e20', borderRadius: '50%', filter: 'blur(90px)', opacity: 0.4 }} />
            
            {/* Green stems and leaves behind the flowers */}
            <StemsBackground />
            
            <FlowerLoader
                loading={loading}
                progress={progress}
                message="Karanfiller açıyor..."
                glowColor="rgba(255, 105, 180, 0.8)"
                barStyle={{ background: 'linear-gradient(to right, #ffb6c1, #c71585)' }}
            />
            
            <CarnationWall bloomed={bloomed} />
        </div>
    );
};

export default Karanfil;
