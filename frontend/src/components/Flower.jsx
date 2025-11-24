import React from 'react';

const Flower = ({ type, onClick }) => {
  const pixelArtStyle = {
    width: '4px',
    height: '4px',
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%) scale(4)',
    backgroundColor: 'transparent',
    boxShadow: `
      0px 0px #2d6a4f, 
      -1px 1px #2d6a4f, 1px 1px #2d6a4f,
      0px 2px #2d6a4f, 0px 3px #1b4332,
      -2px -1px #d90429, 2px -1px #d90429, /* Meyveler */
      0px -2px #d90429
    `
  };

  return (
    <div 
      className="flower-container" 
      onClick={onClick}
      style={{ 
        width: '100%', height: '100%', 
        position: 'relative', cursor: 'pointer',
        transition: 'transform 0.1s'
      }}
      onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
      onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
    >
      <div style={pixelArtStyle} />
      {/* Hover Tooltip */}
      <div className="tooltip" style={{
        position: 'absolute', bottom: '110%', left: '50%', 
        transform: 'translateX(-50%)', 
        background: 'rgba(0,0,0,0.8)', color: '#fff', 
        padding: '4px 8px', fontSize: '14px', borderRadius: '4px',
        pointerEvents: 'none', whiteSpace: 'nowrap',
        opacity: 0, transition: 'opacity 0.2s'
      }}>
        {type.name}
      </div>
      
      <style>{`
        .flower-container:hover .tooltip { opacity: 1; }
      `}</style>
    </div>
  );
};

export default Flower;