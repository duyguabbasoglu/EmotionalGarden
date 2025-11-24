import React, { useState } from 'react';
import Plot from './Plot'; // Artık bu dosya var, hata vermeyecek!
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
        display: 'grid',
        gridTemplateColumns: `repeat(${cols}, 80px)`,
        gridTemplateRows: `repeat(${rows}, 80px)`,
        gap: '4px',
        padding: '16px',
        background: '#4a3b2a',
        borderRadius: '8px',
        boxShadow: '0 10px 20px rgba(0,0,0,0.5)'
      }}>
        {renderGrid()}
      </div>

      <Modal flower={selectedFlower} onClose={() => setSelectedFlower(null)} />
    </>
  );
};

export default GardenGrid;