import React from 'react';

const Modal = ({ flower, onClose }) => {
  if (!flower) return null;

  return (
    <div style={{
      position: 'fixed', inset: 0, 
      background: 'rgba(0,0,0,0.6)', 
      display: 'flex', justifyContent: 'center', alignItems: 'center',
      zIndex: 100
    }} onClick={onClose}>
      
      <div className="pixel-panel" onClick={(e) => e.stopPropagation()} style={{ width: '300px', textAlign: 'center' }}>
        <h2 style={{ margin: '0 0 10px 0', borderBottom: '2px dashed #8b4513' }}>{flower.name}</h2>
        <div style={{ fontSize: '50px', margin: '20px' }}>🎄</div>
        <p style={{ fontSize: '18px', lineHeight: '1.4' }}>{flower.description}</p>
        <button onClick={onClose} style={{
          marginTop: '15px', padding: '8px 16px',
          fontFamily: 'inherit', fontSize: '16px',
          background: '#d90429', color: 'white', border: '2px solid #5c0002',
          cursor: 'pointer', boxShadow: '0 4px 0 #5c0002'
        }}>
          Kapat
        </button>
      </div>
    </div>
  );
};

export default Modal;