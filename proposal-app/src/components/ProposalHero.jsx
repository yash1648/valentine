import { motion, AnimatePresence } from 'framer-motion';
import { useState, useRef, useEffect, useCallback } from 'react';
import { Heart, Sparkles } from 'lucide-react';
import FloatingParticles from './FloatingParticles';
import Confetti from './Confetti';

const NO_BUTTON_TEXTS = [
  'No... wait 😳',
  'Are you sure? 🥺',
  'Think again 💔',
  'Please? 💖',
  'That button doesn\'t work 😌',
  'You meant yes, right? 😭',
  'Nope! 🙈',
  'Don\'t break my heart 💘',
];

const CONFETTI_DURATION = 5;

const ProposalHero = () => {
  const [isSuccess, setIsSuccess] = useState(false);
  const [noPos, setNoPos] = useState({ x: 0, y: 0 });
  const [noText, setNoText] = useState(NO_BUTTON_TEXTS[0]);
  const [noBtnReady, setNoBtnReady] = useState(false);

  const btnAreaRef = useRef(null);
  const noBtnRef = useRef(null);
  const noBtnWidth = useRef(160);
  const noBtnHeight = useRef(56);

  const getNoBounds = useCallback(() => {
    const area = btnAreaRef.current;
    if (!area) return null;
    const rect = area.getBoundingClientRect();
    const w = noBtnWidth.current;
    const h = noBtnHeight.current;
    const margin = 24;
    return {
      minX: margin,
      maxX: Math.max(margin, rect.width - w - margin),
      minY: margin,
      maxY: Math.max(margin, rect.height - h - margin),
    };
  }, []);

  const measureNoBtn = useCallback(() => {
    const el = noBtnRef.current;
    if (el) {
      noBtnWidth.current = el.offsetWidth || 160;
      noBtnHeight.current = el.offsetHeight || 56;
    }
  }, []);

  const pickNoPosition = useCallback(
    (currentPos) => {
      const bounds = getNoBounds();
      if (!bounds) return { x: 0, y: 0 };
      const { minX, maxX, minY, maxY } = bounds;
      if (maxX < minX || maxY < minY) return { x: minX, y: minY };

      let newX, newY;
      let attempts = 0;
      do {
        newX = Math.random() * (maxX - minX) + minX;
        newY = Math.random() * (maxY - minY) + minY;
        attempts++;
        if (attempts > 100) break;
      } while (
        Math.sqrt(
          Math.pow(newX - currentPos.x, 2) + Math.pow(newY - currentPos.y, 2)
        ) < 120
      );

      return { x: Math.round(newX), y: Math.round(newY) };
    },
    [getNoBounds]
  );

  const escapeNo = useCallback(() => {
    measureNoBtn();
    const pos = pickNoPosition(noPos);
    setNoPos(pos);
    setNoText(
      NO_BUTTON_TEXTS[Math.floor(Math.random() * NO_BUTTON_TEXTS.length)]
    );
  }, [pickNoPosition, measureNoBtn, noPos]);

  const handleNoHover = useCallback(() => {
    if (noBtnReady) escapeNo();
  }, [escapeNo, noBtnReady]);

  const handleNoTouch = useCallback((e) => {
    e.preventDefault();
    if (noBtnReady) escapeNo();
  }, [escapeNo, noBtnReady]);

  // Initialize NO button position once card is mounted and measured
  useEffect(() => {
    const t = setTimeout(() => {
      measureNoBtn();
      const pos = pickNoPosition({ x: -999, y: -999 });
      setNoPos(pos);
      setNoBtnReady(true);
    }, 1200);
    return () => clearTimeout(t);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Re-position on resize
  useEffect(() => {
    if (!noBtnReady) return;
    const onResize = () => {
      measureNoBtn();
      const pos = pickNoPosition(noPos);
      setNoPos(pos);
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [noBtnReady, pickNoPosition, measureNoBtn, noPos]);

  const handleYes = useCallback(() => {
    setIsSuccess(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsSuccess(false);
  }, []);

  // Staggered entrance variants
  const fadeUp = (delay) => ({
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { delay, duration: 0.6, ease: [0.4, 0, 0.2, 1] },
  });

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-background">
      {/* Background layer */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-surface/80" />
        <div className="absolute inset-0 spotlight-glow" />
        <FloatingParticles />
      </div>

      {/* Confetti overlay on success */}
      <AnimatePresence>
        {isSuccess && <Confetti key="confetti" duration={CONFETTI_DURATION} />}
      </AnimatePresence>

      {/* Main content */}
      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 sm:px-gutter">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
          className="backdrop-blur-xl bg-white/3 border border-white/10 rounded-2xl p-8 sm:p-12 md:p-16 relative overflow-hidden shadow-[0_0_60px_rgba(74,4,4,0.25)] w-full max-w-2xl"
        >
          {/* Decorative hearts */}
          <div className="absolute -top-16 -left-16 opacity-[0.07] rotate-12">
            <Heart size={160} className="text-primary" fill="currentColor" />
          </div>
          <div className="absolute -bottom-10 -right-10 opacity-[0.05] -rotate-12">
            <Heart size={120} className="text-primary" fill="currentColor" />
          </div>

          <div className="relative z-10 flex flex-col items-center text-center space-y-6 sm:space-y-8">
            {/* Top label */}
            <motion.span {...fadeUp(0.3)} className="font-label-sm text-label-sm text-tertiary uppercase tracking-[0.15em] block">
              For Someone Special <span aria-hidden="true">✨</span>
            </motion.span>

            {/* Main heading */}
            <motion.h1
              {...fadeUp(0.5)}
              className="font-headline-xl text-headline-xl text-primary leading-tight"
            >
              I Have Something to Ask You <span aria-hidden="true">❤️</span>
            </motion.h1>

            {/* Heartfelt paragraph */}
            <motion.p
              {...fadeUp(0.7)}
              className="font-body-lg text-body-lg text-on-surface-variant max-w-lg leading-relaxed"
            >
              Some feelings are too special to keep hidden, and some moments deserve
              more than ordinary words. You&rsquo;ve brought happiness, warmth, and
              meaning into my life in ways I never expected. So I made this little
              page for one reason only &mdash; to ask you something from the heart.
            </motion.p>

            {/* Final proposal line */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.9, duration: 0.5 }}
              className="font-headline-md sm:text-headline-md text-[1.5rem] text-tertiary"
            >
              Will you be mine? <span aria-hidden="true">💖</span>
            </motion.div>

            {/* ===== Button Area ===== */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1, duration: 0.6 }}
              className="w-full pt-2"
            >
              <div
                ref={btnAreaRef}
                className="relative w-full min-h-[200px] sm:min-h-[220px] flex items-center justify-center"
              >
                {/* YES button — centered in normal flow */}
                <motion.button
                  whileHover={{ scale: 1.06 }}
                  whileTap={{ scale: 0.94 }}
                  onClick={handleYes}
                  aria-label="Say yes to the proposal"
                  className="group relative px-10 sm:px-14 py-4 sm:py-5 text-white rounded-full font-headline-md text-lg sm:text-headline-md shadow-2xl overflow-hidden cursor-pointer border-0"
                  style={{
                    background: 'linear-gradient(135deg, #FF69B4 0%, #FF1493 100%)',
                    boxShadow: '0 0 40px rgba(255, 20, 147, 0.4), 0 8px 32px rgba(255, 20, 147, 0.25)',
                  }}
                >
                  {/* Shine sweep */}
                  <span className="absolute inset-0 bg-[linear-gradient(110deg,transparent_25%,rgba(255,255,255,0.2)_50%,transparent_75%)] bg-[length:250%_100%] animate-[shimmer_3s_ease-in-out_infinite]" />
                  <span className="relative z-10 flex items-center gap-2">
                    Yes, absolutely <Sparkles className="inline-block w-5 h-5" aria-hidden="true" />
                  </span>
                </motion.button>

                {/* NO button — absolutely positioned, escapes on hover/touch */}
                {noBtnReady && (
                  <motion.button
                    ref={noBtnRef}
                    initial={{ opacity: 0 }}
                    animate={{
                      opacity: 1,
                      left: `${noPos.x}px`,
                      top: `${noPos.y}px`,
                    }}
                    transition={{
                      opacity: { duration: 0.35, ease: 'easeOut' },
                      left: {
                        duration: 0.35,
                        ease: [0.34, 1.56, 0.64, 1],
                      },
                      top: {
                        duration: 0.35,
                        ease: [0.34, 1.56, 0.64, 1],
                      },
                    }}
                    onMouseEnter={handleNoHover}
                    onTouchStart={handleNoTouch}
                    onClick={(e) => {
                      e.preventDefault();
                      escapeNo();
                    }}
                    aria-label="No button — try to catch it"
                    className="absolute px-8 py-3 rounded-full font-headline-md text-base whitespace-nowrap cursor-pointer select-none border"
                    style={{
                      borderColor: 'rgba(255, 255, 255, 0.15)',
                      color: 'rgba(229, 226, 225, 0.7)',
                      background: 'rgba(255, 255, 255, 0.03)',
                      backdropFilter: 'blur(8px)',
                      willChange: 'left, top',
                      zIndex: 20,
                      touchAction: 'none',
                    }}
                  >
                    {noText}
                  </motion.button>
                )}
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* ===== Success Modal ===== */}
      <AnimatePresence>
        {isSuccess && (
          <motion.div
            key="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6 bg-black/70 backdrop-blur-md"
            onClick={handleCloseModal}
          >
            <motion.div
              key="modal-content"
              initial={{ scale: 0.8, opacity: 0, y: 40 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 40 }}
              transition={{ type: 'spring', damping: 22, stiffness: 120 }}
              className="backdrop-blur-xl bg-white/[0.04] border border-white/10 rounded-2xl p-8 sm:p-12 text-center space-y-6 sm:space-y-8 shadow-[0_0_60px_rgba(255,20,147,0.15)] max-w-xl w-full"
              onClick={(e) => e.stopPropagation()}
              role="dialog"
              aria-modal="true"
              aria-label="Celebration message"
            >
              {/* Animated heart icon */}
              <motion.div
                animate={{ scale: [1, 1.15, 1] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                className="w-20 h-20 sm:w-24 sm:h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto"
              >
                <Heart size={40} className="sm:w-12 sm:h-12 text-primary" fill="currentColor" />
              </motion.div>

              <h2 className="font-headline-lg text-headline-lg text-primary">
                You just made this moment unforgettable <span aria-hidden="true">❤️</span>
              </h2>

              <p className="font-body-lg text-body-lg text-on-surface-variant leading-loose max-w-md mx-auto">
                If this were a real proposal, this would be the part where my heart
                skips a beat, time slows down, and the whole world suddenly feels
                brighter. Thank you for saying yes. <span aria-hidden="true">💖</span>
              </p>

              {/* Decorative heart row */}
              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                className="text-2xl sm:text-3xl tracking-[0.3em]"
                aria-hidden="true"
              >
                💕 💖 💝 💖 💕
              </motion.div>

              <button
                onClick={handleCloseModal}
                className="font-label-sm text-label-sm text-tertiary/70 hover:text-tertiary transition-colors duration-200 cursor-pointer bg-transparent border-0"
              >
                Close and hold this moment
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProposalHero;
