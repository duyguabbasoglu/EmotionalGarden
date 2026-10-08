import React, { useState } from 'react';
import Plot from './Plot';
import Flower from './Flower';
import Modal from './Modal';
import { gardenFlowers, bonusFlower } from '../data/flowers';

/*
 * Plot size, as a CSS length rather than a number: the original garden's 80px
 * on a roomy screen, shrinking just enough that all six columns still fit on
 * a narrow phone. The 4x6 structure is untouched — only the scale responds.
 */
const PLOT = 'clamp(46px, calc((100vw - 86px) / 6), 80px)';

const GardenGrid = () => {
  const [selectedFlower, setSelectedFlower] = useState(null);

  const rows = 4;
  const cols = 6;

  const renderGrid = () => {
    let grid = [];
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const flowerHere = gardenFlowers.find(f => f.position.row === r && f.position.col === c);
        const isEven = (r + c) % 2 === 0;

        grid.push(
          <Plot
            key={`${r}-${c}`}
            size={PLOT}
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
      <h1 style={{
        textAlign: 'center',
        flex: '0 0 auto',
        margin: '16px 0 10px',
        color: '#ffffff',
        textShadow: '2px 2px #000',
        fontSize: 'clamp(24px, 5.5vw, 34px)',
      }}>
        <span style={{ position: 'relative' }}>
          Duygu'nun Bahçesi
          {/*
            The hidden thirteenth month. The star that used to sit here is
            gone, but the door is not: this is still a real button, reachable
            by keyboard and announced to a screen reader, now sitting
            invisibly just past the final letter. It is absolutely positioned
            so it takes up no width at all — that is what keeps the title
            perfectly centred. The twelve beds below are untouched.
          */}
          <button
            onClick={() => bonusFlower && setSelectedFlower(bonusFlower)}
            aria-label="Gizli 13. ay"
            style={{
              position: 'absolute',
              left: '100%',
              top: '50%',
              transform: 'translateY(-50%)',
              width: '1em',
              height: '1em',
              background: 'none',
              border: 'none',
              padding: 0,
              font: 'inherit',
              color: 'transparent',
              cursor: 'default',
              outlineOffset: '2px',
            }}
          />
        </span>
      </h1>

      <div style={{
        width: '100%',
        flex: '1 1 auto',
        minHeight: 0,
        display: 'flex',
        // `margin: auto` on the garden centres it exactly as before, but unlike
        // justify/align-center it collapses instead of overflowing off the left
        // edge. The plots now shrink to fit a phone, so this is a safety net
        // rather than the normal case — but if a window ever is too small for
        // even the minimum size, the garden scrolls and every plot stays
        // reachable instead of the outer columns being lost.
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        overflow: 'auto',
        background: 'linear-gradient(to bottom, #2a2335 0%, #1a1325 100%)'
      }}>

        <div style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${cols}, var(--plot))`,
          gridTemplateRows: `repeat(${rows}, var(--plot))`,
          ['--plot']: PLOT,
          gap: '4px',
          padding: '20px',
          margin: 'auto',
          flex: '0 0 auto',
          // the original garden's plain earth-brown bed and dark frame
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
