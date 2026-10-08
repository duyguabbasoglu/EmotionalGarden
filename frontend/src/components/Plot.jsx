import React from 'react';

/*
 * One bed in the garden.
 *
 * Three details here are copied exactly from the original garden, because
 * together they are what makes this read as a checkerboard of soil rather
 * than a grid of separate tiles:
 *
 *  - the two greens are flat, not gradients;
 *  - the box is content-box, so a plot renders 4px larger than its grid
 *    track and the tiles close the 4px gap between them. Setting
 *    `border-box` here "correctly" is what opened a brown line around every
 *    plot and broke the checkerboard;
 *  - the border is a barely-there 10% black, just enough to seat each tile.
 */
const Plot = ({ children, onClick, isEven, size = 'var(--plot, 80px)' }) => {
  return (
    <div
      onClick={onClick}
      className="garden-plot"
      style={{
        width: size,
        height: size,
        backgroundColor: isEven ? '#6ab04c' : '#badc58',
        border: '2px solid rgba(0,0,0,0.1)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        cursor: 'pointer'
      }}
    >
      {children}
    </div>
  );
};

export default Plot;
