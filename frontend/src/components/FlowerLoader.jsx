import React from 'react';

/**
 * Shared loading overlay used by all flower modal components.
 * Props:
 *   loading    {boolean} — show/hide the overlay
 *   progress   {number}  — 0-100
 *   message    {string}  — e.g. "Papatyalar açıyor..."
 *   glowColor  {string}  — CSS color for the text/bar glow  (default: '#fff')
 *   barStyle   {object}  — extra inline styles for the progress bar fill
 */
const FlowerLoader = ({
  loading,
  progress,
  message,
  glowColor = 'rgba(255,255,255,0.85)',
  barStyle = {},
}) => (
  <div style={{
    position: 'absolute', inset: 0,
    zIndex: 9999,
    background: 'rgba(0,0,0,0.3)',
    backdropFilter: 'blur(8px)',
    display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
    opacity: loading ? 1 : 0,
    transition: 'opacity 0.6s ease',
    pointerEvents: loading ? 'auto' : 'none',
  }}>
    <h2 style={{
      fontFamily: "'VT323', monospace",
      color: '#fff', fontSize: '38px', letterSpacing: '3px',
      margin: '0 0 20px 0',
      textShadow: `0 0 15px ${glowColor}`,
    }}>
      {message}
    </h2>

    <div style={{
      width: '350px', height: '30px',
      border: '3px solid #fff',
      borderRadius: '50px',
      padding: '4px',
      background: 'rgba(0,0,0,0.5)',
      boxShadow: '0 5px 15px rgba(0,0,0,0.3)',
    }}>
      <div style={{
        width: `${progress}%`,
        height: '100%',
        borderRadius: '50px',
        background: '#fff',
        boxShadow: `0 0 15px ${glowColor}`,
        transition: 'width 0.06s linear',
        ...barStyle,
      }} />
    </div>

    <div style={{
      color: '#fff', marginTop: '15px',
      fontFamily: "'VT323', monospace", fontSize: '22px',
      textShadow: `0 0 5px ${glowColor}`,
    }}>
      %{Math.floor(progress)}
    </div>
  </div>
);

export default FlowerLoader;
