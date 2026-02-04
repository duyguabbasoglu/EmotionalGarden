import React from 'react';
import Kokina from './Kokina';
import Kasimpati from './Kasimpati';
import Kardelen from './Kardelen';

// flower mapping
const FLOWER_COMPONENTS = {
  "Kokina": Kokina,
  "Kasımpatı": Kasimpati,
  "Kardelen": Kardelen,
};

const Modal = ({ flower, onClose }) => {
  if (!flower) return null;

  const ActiveFlowerComponent = FLOWER_COMPONENTS[flower.name];

  return (
    <div style={{
      position: 'fixed', inset: 0,
      background: 'rgba(0, 0, 0, 0.4)',
      backdropFilter: 'blur(5px)',
      display: 'flex', justifyContent: 'center', alignItems: 'center',
      zIndex: 100,
      animation: 'fadeIn 0.5s ease',
      overflow: 'hidden'
    }}>
      {ActiveFlowerComponent ? (
        <ActiveFlowerComponent />
      ) : (
        <div style={{ color: 'white' }}>Henüz tasarlanmadı...</div>
      )}

      {/* close */}
      <button
        onClick={onClose}
        style={{
          position: 'absolute', top: '30px', right: '30px',
          background: 'rgba(255,255,255,0.1)', color: 'white',
          border: '2px solid rgba(255,255,255,0.3)',
          borderRadius: '50%',
          width: '50px', height: '50px',
          fontSize: '24px', cursor: 'pointer', zIndex: 200,
          transition: 'all 0.2s',
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}
        onMouseEnter={(e) => {
          if (flower.name === 'Kardelen') {
            e.target.style.background = '#fff';
            e.target.style.color = '#1B4332';
            e.target.style.borderColor = '#fff';
          } else {
            e.target.style.background = '#d90429';
            e.target.style.borderColor = '#d90429';
          }
        }}
        onMouseLeave={(e) => {
          e.target.style.background = 'rgba(255,255,255,0.1)';
          e.target.style.color = 'white';
          e.target.style.borderColor = 'rgba(255,255,255,0.3)';
        }}
      >
        ✕
      </button>
    </div>
  );
};

export default Modal;