import { useState, useEffect, useRef } from 'react';

const COLORS = ['#FF69B4', '#FF1493', '#FFB6C1', '#FF6B9D', '#FF4D6D', '#FFE5EC'];

const createParticle = (id) => ({
  id,
  x: Math.random() * 100,
  size: Math.random() * 4 + 2,
  color: COLORS[Math.floor(Math.random() * COLORS.length)],
  duration: Math.random() * 10 + 15,
  delay: Math.random() * 3,
  opacity: Number((Math.random() * 0.2 + 0.2).toFixed(2)),
  isHeart: Math.random() < 0.15,
});

const FloatingParticles = () => {
  const containerRef = useRef(null);
  const [particles, setParticles] = useState([]);
  const idRef = useRef(0);

  useEffect(() => {
    const timers = new Set();

    const spawn = () => {
      const p = createParticle(idRef.current++);
      setParticles((prev) => [...prev, p]);

      const removeTimer = setTimeout(() => {
        setParticles((prev) => prev.filter((p2) => p2.id !== p.id));
        timers.delete(removeTimer);
      }, (p.duration + p.delay) * 1000 + 100);
      timers.add(removeTimer);
    };

    // Initial staggered batch to populate the screen quickly
    for (let i = 0; i < 25; i++) {
      const t = setTimeout(spawn, i * 250);
      timers.add(t);
    }

    // Continuous spawning to replace expired particles
    const interval = setInterval(spawn, 800);

    return () => {
      clearInterval(interval);
      timers.forEach((t) => clearTimeout(t));
      timers.clear();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 pointer-events-none"
      style={{ zIndex: 0, overflow: 'hidden' }}
    >
      <style>{`
        @keyframes particle-float {
          0% {
            transform: translateY(0) translateX(0);
            opacity: 0;
          }
          10% {
            opacity: var(--p-opacity, 0.3);
          }
          80% {
            opacity: var(--p-opacity, 0.3);
          }
          100% {
            transform: translateY(-100vh) translateX(20px);
            opacity: 0;
          }
        }
      `}</style>

      {particles.map((p) =>
        p.isHeart ? (
          <span
            key={p.id}
            style={{
              position: 'absolute',
              left: `${p.x}vw`,
              bottom: '-10px',
              fontSize: `${Math.max(p.size * 3, 10)}px`,
              color: p.color,
              lineHeight: 1,
              pointerEvents: 'none',
              '--p-opacity': p.opacity,
              animation: `particle-float ${p.duration}s linear ${p.delay}s forwards`,
            }}
          >
            ♥
          </span>
        ) : (
          <div
            key={p.id}
            style={{
              position: 'absolute',
              left: `${p.x}vw`,
              bottom: '-10px',
              width: `${p.size}px`,
              height: `${p.size}px`,
              backgroundColor: p.color,
              borderRadius: '50%',
              filter: 'blur(1px)',
              pointerEvents: 'none',
              '--p-opacity': p.opacity,
              animation: `particle-float ${p.duration}s linear ${p.delay}s forwards`,
            }}
          />
        ),
      )}
    </div>
  );
};

export default FloatingParticles;
