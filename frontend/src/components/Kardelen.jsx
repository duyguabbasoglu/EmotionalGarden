import React, { useMemo } from 'react';
import { random } from '../utils/math';
import { useFlowerGrowth } from '../hooks/useFlowerGrowth';

// Reusing Kokina's exact structure for density and animation
const FlowersLayer = React.memo(({ bloomed }) => {
    const branches = useMemo(() => {
        // Exact count as Kokina (300) to match density
        return [...Array(300)].map((_, i) => ({
            id: i,
            x: random(-20, 120),
            y: random(-20, 120),
            rotation: random(0, 360), // Random rotation on the 'branch'
            scale: random(1.8, 3.5),
            delay: i * 0.01
        }));
    }, []);

    return (
        <>
            {branches.map((branch) => (
                <div key={branch.id} style={{
                    position: 'absolute',
                    left: `${branch.x}%`, top: `${branch.y}%`,

                    transform: bloomed
                        ? `translate(-50%, -50%) rotate(${branch.rotation}deg) scale(${branch.scale})`
                        : `translate(-50%, -50%) rotate(${branch.rotation}deg) scale(0)`,

                    opacity: bloomed ? 1 : 0,
                    transition: `all 0.7s cubic-bezier(0.34, 1.56, 0.64, 1) ${branch.delay}s`,
                    zIndex: Math.floor(random(1, 50))
                }}>

                    {/* leaves - Exact copy of Kokina leaves (15 count) for green density */}
                    {[...Array(15)].map((_, i) => (
                        <div key={`leaf-${i}`} style={{
                            position: 'absolute',
                            width: '60px', height: '18px',
                            background: 'linear-gradient(to right, #143620, #2d6a4f)',
                            borderRadius: '100% 0 100% 0',
                            transformOrigin: 'center center',
                            transform: `rotate(${random(0, 360)}deg) translate(${random(0, 40)}px)`,
                            boxShadow: '1px 1px 4px rgba(0,0,0,0.3)'
                        }} />
                    ))}

                    {/* flowers - 10 snowdrops per branch */}
                    <div style={{ position: 'relative', zIndex: 10 }}>
                        {[...Array(10)].map((_, flowerIndex) => (
                            <div key={`flower-${flowerIndex}`} style={{
                                position: 'absolute',
                                // Random placement
                                transform: `translate(${random(-25, 25)}px, ${random(-25, 25)}px) rotate(${random(140, 220)}deg)`, // Rotated to hang DOWN
                            }}>
                                {/* Stem Segment */}
                                <div style={{
                                    position: 'absolute',
                                    top: '0', left: '50%',
                                    width: '1px', height: '10px',
                                    background: '#6c9a76',
                                    transform: 'translate(-50%, -100%)' // Place above flower
                                }} />

                                {/* Snowdrop Head (The "Nodding Bell") */}
                                <div style={{
                                    width: `${random(10, 16)}px`, height: `${random(14, 20)}px`,
                                    background: '#fff',
                                    borderRadius: '50% 50% 20% 20%', // Bell shape
                                    boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
                                    position: 'relative'
                                }}>
                                    {/* Green Cap (Ovary) */}
                                    <div style={{
                                        position: 'absolute', top: '-3px', left: '50%',
                                        transform: 'translateX(-50%)',
                                        width: '6px', height: '4px',
                                        background: '#2d6a4f',
                                        borderRadius: '4px 4px 0 0'
                                    }} />

                                    {/* Green Spot on Tips */}
                                    <div style={{
                                        position: 'absolute', bottom: '2px', left: '50%',
                                        transform: 'translateX(-50%)',
                                        width: '6px', height: '4px',
                                        borderRadius: '50% 50% 50% 50%',
                                        borderTop: '2px solid #2d6a4f', // Inverted V shape
                                        opacity: 0.6
                                    }} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </>
    );
});

const Kardelen = () => {
    const { bloomed, loading, progress } = useFlowerGrowth(3500);

    return (
        <div style={{
            position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none'
        }}>

            {/* Loading Screen - Exact Kokina UI */}
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

                {/* title */}
                <h2 style={{
                    fontFamily: "'VT323', monospace",
                    color: '#fff', fontSize: '38px', letterSpacing: '3px',
                    margin: '0 0 20px 0',
                    textShadow: '0 0 15px rgba(255, 255, 255, 0.8)'
                }}>
                    Kardelenler uyanıyor...
                </h2>

                {/* progress bar */}
                <div style={{
                    width: '350px', height: '30px',
                    border: '3px solid #fff',
                    borderRadius: '50px',
                    padding: '4px',
                    background: 'rgba(0,0,0,0.5)',
                    boxShadow: '0 5px 15px rgba(0,0,0,0.3)',
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

            <FlowersLayer bloomed={bloomed} />

        </div>
    );
};

export default Kardelen;
