import { motion } from 'framer-motion';
import { useMemo, useState, useEffect } from 'react';

const COLORS = [
  '#FF69B4',
  '#FF1493',
  '#FFB6C1',
  '#FFD700',
  '#FF6B9D',
  '#FF4D6D',
  '#FFFFFF',
  '#FFE5EC',
];

const EMOJIS = ['💖', '💕', '✨', '🎉', '💝', '🌹'];

const generateParticles = (count, duration) =>
  Array.from({ length: count }, (_, i) => {
    const useEmoji = Math.random() > 0.6;
    return {
      id: i,
      startX: (Math.random() - 0.5) * 60,
      x: (Math.random() - 0.5) * 500,
      peakY: -(Math.random() * 350 + 150),
      fallY: Math.random() * 250 + 150,
      size: Math.random() * 12 + 6,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      emoji: EMOJIS[Math.floor(Math.random() * EMOJIS.length)],
      useEmoji,
      isCircle: !useEmoji && Math.random() > 0.7,
      rotate: Math.random() * 720 - 360,
      delay: Math.random() * 0.4,
      particleDuration: duration * (0.5 + Math.random() * 0.5),
      xDrift: (Math.random() - 0.5) * 120,
    };
  });

const Confetti = ({ duration = 4 }) => {
  const [visible, setVisible] = useState(true);

  const particles = useMemo(() => generateParticles(50, duration), [duration]);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), duration * 1000 + 1500);
    return () => clearTimeout(timer);
  }, [duration]);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[1000] overflow-hidden">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          initial={{
            opacity: 0,
            y: 0,
            x: 0,
            rotate: 0,
            scale: 0.3,
          }}
          animate={{
            y: [0, p.peakY * 0.6, p.peakY, p.fallY],
            x: [0, p.x * 0.3, p.x, p.x + p.xDrift],
            rotate: [0, p.rotate * 0.2, p.rotate, p.rotate * 1.8],
            opacity: [0, 1, 1, 0],
            scale: [0.3, 1, 1, 0.3],
          }}
          transition={{
            duration: p.particleDuration,
            delay: p.delay,
            times: [0, 0.15, 0.4, 1],
            ease: ['easeOut', 'easeOut', 'easeIn'],
          }}
          style={{
            position: 'absolute',
            left: `calc(50% + ${p.startX}px)`,
            bottom: 0,
            width: p.useEmoji ? 'auto' : p.size,
            height: p.useEmoji ? 'auto' : p.size,
            fontSize: p.useEmoji ? `${p.size * 2.5}px` : undefined,
            lineHeight: p.useEmoji ? 1 : undefined,
            backgroundColor: p.useEmoji ? 'transparent' : p.color,
            borderRadius: p.isCircle ? '50%' : '2px',
            boxShadow: !p.useEmoji
              ? '0 1px 2px rgba(0,0,0,0.15)'
              : undefined,
            transformOrigin: 'center center',
          }}
        >
          {p.useEmoji && p.emoji}
        </motion.div>
      ))}
    </div>
  );
};

export default Confetti;
