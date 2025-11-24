import React from 'react';

const Plot = ({ children, onClick, isEven }) => {
  return (
    <div 
      onClick={onClick}
      className="garden-plot"
      style={{
        width: '80px', 
        height: '80px',
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