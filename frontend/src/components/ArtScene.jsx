import React from 'react';

/**
 * Renders a full-screen scene of pre-built SVG images (data URLs).
 * Much lighter than hundreds of live React SVGs, so the screen can be
 * covered densely.
 * Item: { id, x, y (in %), scale, rotation, delay, zIndex, src }
 *
 * Two deliberate omissions keep a scene of several hundred sprites working:
 * no `will-change` and no `translate3d`. Either one promotes every sprite to
 * its own compositor layer, and at four hundred of them the browser runs out
 * of layer memory and the whole scene silently fails to paint. Letting the
 * browser promote only what it is actually animating costs nothing visible.
 *
 * Scales are snapped to a tenth so each source SVG is rasterised at a handful
 * of sizes rather than once per sprite.
 */
const ArtScene = React.memo(({ items, bloomed }) => (
  <>
    {items.map(item => {
      const scale = Math.round(item.scale * 10) / 10;
      const rotation = Math.round(item.rotation);
      return (
        <img
          key={item.id}
          src={item.src}
          alt=""
          decoding="async"
          draggable={false}
          style={{
            position: 'absolute',
            left: `${item.x}%`,
            top: `${item.y}%`,
            transform: `translate(-50%,-50%) rotate(${rotation}deg) scale(${bloomed ? scale : 0})`,
            opacity: bloomed ? 1 : 0,
            transition: `transform 1s cubic-bezier(0.34,1.45,0.64,1) ${item.delay}s, opacity 0.8s ease ${item.delay}s`,
            zIndex: item.zIndex,
            pointerEvents: 'none',
          }}
        />
      );
    })}
  </>
));

export default ArtScene;
