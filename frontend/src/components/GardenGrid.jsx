import React, { useState } from 'react';
import Plot from './Plot';
import Flower from './Flower';
import Modal from './Modal';
import { flowers } from '../data/flowers';

const GardenGrid = () => {
  const [selectedFlower, setSelectedFlower] = useState(null);

  const rows = 4;
  const cols = 6;

  const renderGrid = () => {
    let grid = [];
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const flowerHere = flowers.find(f => f.position.row === r && f.position.col === c);
        const isEven = (r + c) % 2 === 0;

        grid.push(
          <Plot 
            key={`${r}-${c}`} 
            isEven={isEven}
            onClick={() => flowerHere && setSelectedFlower(flowerHere)}
          >
            {flowerHere ? (
              <Flower type={flowerHere} />
            ) : (
              <span style={{ opacity: 0.3, fontSize: '10px', color: '#2d3436' }}>.</span>
            )}
          </Plot>
        );
      }
    }
    return grid;
  };

  return (
    <>
      <h1 style={{ textAlign: 'center', textShadow: '2px 2px #000' }}>Duygu'nun Bahçesi</h1>
      <div style={{
        width: '100vw', 
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: 'linear-gradient(to bottom, #2a2335 0%, #1a1325 100%)' 
      }}>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${cols}, 80px)`,
          gridTemplateRows: `repeat(${rows}, 80px)`,
          gap: '4px',
          padding: '20px',
          background: '#5d4037',
          border: '8px solid #3e2723',
          borderRadius: '12px',
          boxShadow: '0 20px 50px rgba(0,0,0,0.8)'
        }}>
          {renderGrid()}
        </div>
      </div>

      <Modal flower={selectedFlower} onClose={() => setSelectedFlower(null)} />
    </>
  );
};

export default GardenGrid;