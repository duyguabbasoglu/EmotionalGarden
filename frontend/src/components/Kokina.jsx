import React, { useEffect, useState, useMemo } from 'react';
const random = (min, max) => Math.random() * (max - min) + min;


const FlowersLayer = React.memo(({ bloomed }) => {
  const branches = useMemo(() => {
    return [...Array(300)].map((_, i) => ({
      id: i,
      x: random(-20, 120),
      y: random(-20, 120),
      rotation: random(0, 360),
      scale: random(1.8, 3.5),
      delay: i * 0.01
    }));
  }, []);

  return (
    <>
      {branches.map((branch) => (
        <div key={branch.id} style={{
          position: 'absolute',
          left: `${branch.x}%`, top: `${branch.y}%`,
          
          transform: bloomed 
            ? `translate(-50%, -50%) rotate(${branch.rotation}deg) scale(${branch.scale})` 
            : `translate(-50%, -50%) rotate(${branch.rotation}deg) scale(0)`,
          
          opacity: bloomed ? 1 : 0,
          transition: `all 0.7s cubic-bezier(0.34, 1.56, 0.64, 1) ${branch.delay}s`,
          zIndex: Math.floor(random(1, 50)) 
        }}>
          
          {/* leaves */}
          {[...Array(15)].map((_, i) => (
              <div key={`leaf-${i}`} style={{
                position: 'absolute',
                width: '60px', height: '18px',
                background: 'linear-gradient(to right, #143620, #2d6a4f)',
                borderRadius: '100% 0 100% 0',
                transformOrigin: 'center center',
                transform: `rotate(${random(0,360)}deg) translate(${random(0,40)}px)`,
                boxShadow: '1px 1px 4px rgba(0,0,0,0.3)'
              }} />
          ))}

          {/* fruits */}
          <div style={{ position: 'relative', zIndex: 10 }}>
            {[...Array(10)].map((_, berryIndex) => (
                <div key={`berry-${berryIndex}`} style={{
                  position: 'absolute',
                  width: `${random(18,28)}px`, height: `${random(18,28)}px`,
                  borderRadius: '50%',
                  background: 'radial-gradient(circle at 30% 30%, #ff4d4d 0%, #d90429 60%, #800e13 100%)',
                  transform: `translate(${random(-15,15)}px, ${random(-15,15)}px)`,
                  boxShadow: '2px 2px 6px rgba(0,0,0,0.5)'
                }}>
                  <div style={{
                    position: 'absolute', top: '25%', left: '25%',
                    width: '20%', height: '20%',
                    background: 'rgba(255,255,255,0.8)',
                    borderRadius: '50%', filter: 'blur(0.5px)'
                  }} />
                </div>
            ))}
          </div>
        </div>
      ))}
    </>
  );
});

const Kokina = () => {
  const [bloomed, setBloomed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    setTimeout(() => setBloomed(true), 10);

    const duration = 3500; 
    const intervalTime = 50;
    const steps = duration / intervalTime;
    let currentStep = 0;

    const interval = setInterval(() => {
      currentStep++;
      const newProgress = Math.min((currentStep / steps) * 100, 100);
      setProgress(newProgress);

      if (currentStep >= steps) {
        clearInterval(interval);
        setTimeout(() => setLoading(false), 200); 
      }
    }, intervalTime);

    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ 
      position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' 
    }}>
      
      {/* loading screen */}
      <div style={{
        position: 'absolute', inset: 0,
        zIndex: 9999,
        background: 'rgba(0, 0, 0, 0.3)', 
        backdropFilter: 'blur(8px)', 
        display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
        opacity: loading ? 1 : 0,
        transition: 'opacity 0.6s ease',
        pointerEvents: loading ? 'auto' : 'none'
      }}>
        
        {/* title */}
        <h2 style={{
          fontFamily: "'VT323', monospace",
          color: '#fff', fontSize: '38px', letterSpacing: '3px',
          margin: '0 0 20px 0', 
          textShadow: '0 0 15px rgba(255, 255, 255, 0.8)'
        }}>
          Çiçeğiniz hazırlanıyor...
        </h2>

        {/* progress bar */}
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
            boxShadow: '0 0 15px rgba(255, 255, 255, 0.9)',
            transition: 'width 0.06s linear'
          }} />
        </div>
        
        <div style={{ 
          color: '#fff', marginTop: '15px', 
          fontFamily: "'VT323', monospace", fontSize: '22px',
          textShadow: '0 0 5px #fff'
        }}>
          %{Math.floor(progress)}
        </div>
      </div>

      <FlowersLayer bloomed={bloomed} />

    </div>
  );
};

export default Kokina;