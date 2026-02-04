import React, { useEffect, useState, useMemo } from 'react';

// Yardımcı Fonksiyon
const random = (min, max) => Math.random() * (max - min) + min;

// --- 1. KASIMPATI ÇİÇEĞİ KATMANI (MEMOIZED) ---
// Bu katman, React tarafından hafızaya alınır ve bar dolarken titremez.
const FlowersLayer = React.memo(({ bloomed }) => {
  
  // 150 adet Kasımpatı (Karmaşık oldukları için sayı ideal, boyut büyük)
  const flowers = useMemo(() => {
    return [...Array(150)].map((_, i) => ({
      id: i,
      x: random(-20, 120),
      y: random(-20, 120),
      scale: random(0.6, 1.2), // Kasımpatı büyük bir çiçektir
      rotation: random(0, 360),
      delay: i * 0.015, // Sırayla açılma hızı
      // Her çiçeğin kendi "rüzgar" hızı olsun
      swayDuration: random(3, 6), 
      swayDelay: random(0, 2)
    }));
  }, []);

  return (
    <>
      {flowers.map((flower) => (
        <div key={flower.id} style={{
          position: 'absolute',
          left: `${flower.x}%`, top: `${flower.y}%`,
          zIndex: Math.floor(random(1, 50)),
          
          // Açılma (Bloom) Animasyonu
          transform: bloomed 
            ? `translate(-50%, -50%) scale(${flower.scale})` 
            : `translate(-50%, -50%) scale(0)`,
          opacity: bloomed ? 1 : 0,
          transition: `transform 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) ${flower.delay}s, opacity 0.8s ease ${flower.delay}s`,
        }}>
          
          {/* --- SALLANMA (RÜZGAR) EFEKTİ --- */}
          <div style={{
            animation: `sway ${flower.swayDuration}s ease-in-out infinite alternate ${flower.swayDelay}s`,
            transformOrigin: 'bottom center'
          }}>

            {/* --- YAPRAKLAR (GÖVDE) --- */}
            {/* Kasımpatı yaprakları dişlidir, burada sivri yeşil yapraklar kullanıyoruz */}
            {[...Array(5)].map((_, i) => (
              <div key={`leaf-${i}`} style={{
                position: 'absolute',
                top: '20px', left: '50%',
                width: '60px', height: '25px',
                background: 'linear-gradient(45deg, #1b5e20, #4caf50)',
                borderRadius: '0 80% 0 80%',
                transformOrigin: 'center left',
                transform: `translateX(-50%) rotate(${i * 72 + random(0, 30)}deg) translateY(10px)`,
                boxShadow: '1px 1px 5px rgba(0,0,0,0.3)',
                zIndex: 0
              }} />
            ))}

            {/* --- ÇİÇEK BAŞI (KATMERLİ YAPI) --- */}
            {/* 3 Katmanlı Yaprak Dizilimi: Dış, Orta, İç */}
            <div style={{ position: 'relative', zIndex: 10 }}>
              
              {/* KATMAN 1: DIŞ YAPRAKLAR (Koyu Mor - Geniş) */}
              {[...Array(12)].map((_, i) => (
                <div key={`petal-outer-${i}`} style={{
                  position: 'absolute',
                  top: '50%', left: '50%',
                  width: '80px', height: '18px', // Uzun yapraklar
                  background: 'linear-gradient(to right, #4a148c, #7b1fa2)', // Koyu Mor
                  borderRadius: '50% 50% 50% 0', // Damla şekli
                  transformOrigin: 'left center',
                  transform: `translate(-10%, -50%) rotate(${i * 30}deg)`,
                  boxShadow: '0 2px 4px rgba(0,0,0,0.4)'
                }} />
              ))}

              {/* KATMAN 2: ORTA YAPRAKLAR (Magenta - Daha Kısa ve Sık) */}
              {[...Array(10)].map((_, i) => (
                <div key={`petal-mid-${i}`} style={{
                  position: 'absolute',
                  top: '50%', left: '50%',
                  width: '60px', height: '14px',
                  background: 'linear-gradient(to right, #7b1fa2, #d500f9)', // Canlı Magenta
                  borderRadius: '50% 50% 50% 0',
                  transformOrigin: 'left center',
                  // Dış katmanla arasına girsin diye +15 derece offset
                  transform: `translate(-10%, -50%) rotate(${i * 36 + 15}deg)`,
                  boxShadow: '0 2px 4px rgba(0,0,0,0.3)'
                }} />
              ))}

              {/* KATMAN 3: İÇ TOHUMLAR (Sarı Göbek) */}
              <div style={{
                position: 'absolute',
                top: '50%', left: '50%',
                width: '24px', height: '24px',
                transform: 'translate(-50%, -50%)',
                background: 'radial-gradient(circle, #ffeb3b 20%, #fbc02d 100%)', // Altın Sarısı
                borderRadius: '50%',
                boxShadow: '0 0 10px rgba(255, 235, 59, 0.6)', // Hafif parıltı
                zIndex: 20
              }}>
                 {/* Göbek dokusu (noktalar) */}
                 <div style={{
                   width: '100%', height: '100%',
                   backgroundImage: 'radial-gradient(#f57f17 15%, transparent 16%)',
                   backgroundSize: '6px 6px'
                 }}/>
              </div>

            </div>
          </div>
        </div>
      ))}
      
      {/* RÜZGAR ANİMASYONU CSS */}
      <style>{`
        @keyframes sway {
          0% { transform: rotate(-5deg); }
          100% { transform: rotate(5deg); }
        }
      `}</style>
    </>
  );
});

// --- 2. ANA KOMPONENT (YÜKLEME EKRANI) ---
const Kasimpati = () => {
  const [bloomed, setBloomed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // 1. Tıklar tıklamaz arkada başlasın
    setTimeout(() => setBloomed(true), 10);

    // 2. Yükleme Barı (4 Saniye - Kasımpatı Detaylı Olduğu İçin Bir Tık Uzun Hissi)
    const duration = 4000; 
    const intervalTime = 40; 
    const steps = duration / intervalTime;
    let currentStep = 0;

    const interval = setInterval(() => {
      currentStep++;
      const newProgress = Math.min((currentStep / steps) * 100, 100);
      setProgress(newProgress);

      if (currentStep >= steps) {
        clearInterval(interval);
        setTimeout(() => setLoading(false), 300); 
      }
    }, intervalTime);

    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ 
      position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' 
    }}>
      
      {/* === YÜKLEME EKRANI (Senin Sevdiğin Beyaz Rounded Bar) === */}
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
        
        {/* Başlık: Morumsu/Beyaz Neon */}
        <h2 style={{
          fontFamily: "'VT323', monospace",
          color: '#fff', fontSize: '38px', letterSpacing: '3px',
          margin: '0 0 20px 0', 
          textShadow: '0 0 15px rgba(213, 0, 249, 0.8)' // Magenta Neon
        }}>
          Kasımpatı bahçesi hazırlanıyor...
        </h2>

        {/* PROGRESS BAR: BEYAZ & ROUNDED */}
        <div style={{
          width: '350px', height: '30px',
          border: '3px solid #fff', 
          borderRadius: '50px', 
          padding: '4px', 
          background: 'rgba(0,0,0,0.5)', 
          boxShadow: '0 5px 15px rgba(0,0,0,0.3)',
        }}>
          
          {/* DOLAN KISIM: DÜZ BEYAZ */}
          <div style={{
            width: `${progress}%`,
            height: '100%',
            borderRadius: '50px', 
            background: '#fff', 
            boxShadow: '0 0 15px rgba(255, 255, 255, 0.9)', 
            transition: 'width 0.04s linear' 
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

      {/* === ÇİÇEKLER KATMANI === */}
      <FlowersLayer bloomed={bloomed} />

    </div>
  );
};

export default Kasimpati;