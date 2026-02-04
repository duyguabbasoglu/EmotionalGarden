import React from 'react';

const Flower = ({ type, onClick }) => {
    // Render different flower previews based on type
    const renderFlowerPreview = () => {
        if (type.name === "Kardelen") {
            // Snowdrop preview
            return (
                <div style={{
                    position: 'absolute',
                    top: '50%', left: '50%',
                    transform: 'translate(-50%, -50%) scale(0.5)',
                    pointerEvents: 'none'
                }}>
                    {/* Stem */}
                    <div style={{
                        position: 'absolute',
                        bottom: '-25px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        width: '2px',
                        height: '30px',
                        background: 'linear-gradient(to top, #1B4332, #40916c)',
                        borderRadius: '1px',
                    }} />
                    {/* Curved stem */}
                    <div style={{
                        position: 'absolute',
                        bottom: '3px',
                        left: '50%',
                        width: '12px',
                        height: '12px',
                        border: '2px solid transparent',
                        borderTopColor: '#40916c',
                        borderRadius: '50%',
                        transform: 'translateX(-50%) rotate(135deg)',
                    }} />
                    {/* Flower head */}
                    <div style={{
                        position: 'absolute',
                        top: '8px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                    }}>
                        {/* Petals */}
                        {[0, 1, 2].map((i) => (
                            <div key={`petal-${i}`} style={{
                                position: 'absolute',
                                top: '-5px',
                                left: '50%',
                                width: '10px',
                                height: '24px',
                                background: 'linear-gradient(to bottom, #fff, #f0f0f0)',
                                borderRadius: '50% 50% 40% 40%',
                                transformOrigin: 'top center',
                                transform: `translateX(-50%) rotate(${(i - 1) * 20}deg)`,
                                boxShadow: '0 1px 4px rgba(0,0,0,0.1)',
                            }} />
                        ))}
                        {/* Green corona */}
                        <div style={{
                            position: 'absolute',
                            top: '-3px',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            width: '6px',
                            height: '10px',
                            background: 'linear-gradient(to bottom, #40916c, #1B4332)',
                            borderRadius: '0 0 50% 50%',
                            zIndex: 5,
                        }} />
                    </div>
                    {/* Leaves */}
                    <div style={{
                        position: 'absolute',
                        bottom: '-25px',
                        left: '-8px',
                        width: '4px',
                        height: '25px',
                        background: 'linear-gradient(to top, #1B4332, #40916c)',
                        borderRadius: '50% 50% 0 0',
                        transform: 'rotate(-12deg)',
                    }} />
                    <div style={{
                        position: 'absolute',
                        bottom: '-25px',
                        right: '-8px',
                        width: '4px',
                        height: '22px',
                        background: 'linear-gradient(to top, #1B4332, #2d6a4f)',
                        borderRadius: '50% 50% 0 0',
                        transform: 'rotate(10deg)',
                    }} />
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
                    color: type.name === "Kardelen" ? '#1B4332' : '#d90429'
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
