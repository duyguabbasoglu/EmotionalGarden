import React from 'react';

const Flower = ({ type, onClick }) => {
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
      {/* 12. kokina */}
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
              transform: `translate(${Math.cos(i)*15}px, ${Math.sin(i)*15}px)`,
              boxShadow: '1px 1px 5px rgba(0,0,0,0.3)'
            }} />
          ))}
        </div>
      </div>

      {/* chatbox */}
      <div className="chatbox">
        <strong style={{ display: 'block', fontSize: '14px', marginBottom: '4px', color: '#d90429' }}>
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