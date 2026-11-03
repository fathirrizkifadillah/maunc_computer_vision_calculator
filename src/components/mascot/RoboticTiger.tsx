import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ASSET_MANIFEST } from '../../assets/assetManifest';

export interface RoboticTigerProps {
  isStreaming: boolean;
  isHandPresent: boolean;
  isStabilizing: boolean;
  isConfirmed: boolean;
  isComplete: boolean;
}

export const RoboticTiger: React.FC<RoboticTigerProps> = ({
  isStreaming,
  isStabilizing,
  isConfirmed,
  isComplete,
}) => {
  const isExcited = isStabilizing || isConfirmed || isComplete;

  // Accessibility: Respect user's reduced-motion preference
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      setPrefersReducedMotion(mediaQuery.matches);

      const handleChange = (e: MediaQueryListEvent) => {
        setPrefersReducedMotion(e.matches);
      };

      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, []);

  return (
    <div className="relative w-full h-full flex items-end justify-center select-none overflow-hidden">
      {/* Dynamic Diagonal MAUNC Yellow Graphic Band behind Mascot - Desktop Only */}
      <div
        className="hidden lg:block absolute left-[-25%] bottom-[12%] w-[140%] h-[75px] bg-maunc-yellow -rotate-[32deg] origin-bottom-left -z-0 pointer-events-none rounded-sm shadow-sm"
        aria-hidden="true"
      />

      {/* Layered Animated Mascot Structure with Expanded Sizing */}
      <div className="relative z-10 w-full max-w-[200px] sm:max-w-[260px] md:max-w-[300px] lg:max-w-[360px] xl:max-w-[400px] flex items-end justify-center">
        {/* Aspect-Ratio Container */}
        <div className="relative w-full h-auto aspect-[765/1024]">
          {/* 1. Stylized Angry Exclamation Mark (Pops up above head when camera is inactive) */}
          <AnimatePresence>
            {!isStreaming && !prefersReducedMotion && (
              <motion.div
                key="mascot-exclamation"
                className="absolute z-30 pointer-events-none"
                style={{ top: '2%', right: '22%' }}
                initial={{ opacity: 0, scale: 0, rotate: -15, y: 12 }}
                animate={{
                  opacity: [0, 1, 1, 1, 0],
                  scale: [0, 1.25, 0.95, 1, 0.85],
                  rotate: [-15, -8, -10, -8, -12],
                  y: [12, -4, 0, -2, 6],
                }}
                exit={{ opacity: 0, scale: 0 }}
                transition={{
                  duration: 3.8,
                  repeat: Infinity,
                  repeatDelay: 1.4,
                  ease: 'easeOut',
                }}
                aria-hidden="true"
              >
                <div className="flex flex-col items-center select-none filter drop-shadow-[0_2px_5px_rgba(0,0,0,0.4)]">
                  <div className="w-2.5 sm:w-3.5 h-6 sm:h-8 bg-maunc-yellow border-[2.5px] border-slate-950 rounded-[3px] -rotate-3" />
                  <div className="w-2.5 sm:w-3.5 h-2.5 sm:h-3.5 bg-maunc-yellow border-[2.5px] border-slate-950 rounded-full mt-1 -rotate-3" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* 2. TAIL LAYER (Back layer, wags smoothly from exact anatomical waist connection) */}
          <motion.img
            src={ASSET_MANIFEST.mascotTail}
            alt="Ekor Maskot MAUNC"
            className="absolute inset-0 w-full h-full object-contain pointer-events-none select-none"
            style={{
              transformOrigin: '64.1% 60.1%',
              willChange: 'transform',
            }}
            animate={
              prefersReducedMotion
                ? { rotate: 0 }
                : isExcited
                ? {
                    rotate: [0, 7, -3, 9, -2, 6, 0],
                    transition: {
                      duration: 1.2,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    },
                  }
                : {
                    rotate: [0, 4, -2, 5.5, -1, 3, 0],
                    transition: {
                      duration: 2.8,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    },
                  }
            }
            loading="eager"
          />

          {/* 3. BODY LAYER (Middle layer: Torso, robotic & organic arms, jacket, pants, legs) */}
          <motion.img
            src={ASSET_MANIFEST.mascotBody}
            alt="Badan Maskot MAUNC"
            className="relative z-10 w-full h-full object-contain pointer-events-none select-none drop-shadow-md"
            style={{
              transformOrigin: '50% 90%',
              willChange: 'transform',
            }}
            animate={
              prefersReducedMotion
                ? { scaleY: 1, translateY: 0, rotate: 0 }
                : {
                    scaleY: [1, 1.014, 1],
                    translateY: [0, -3.5, 0],
                    rotate: [0, 0.35, -0.35, 0],
                  }
            }
            transition={{
              duration: 3.6,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            loading="eager"
          />

          {/* 4. HEAD LAYER (Front layer: Face, cybernetic eye, ears, jaw & chin fur over collar) */}
          <motion.img
            src={ASSET_MANIFEST.mascotHead}
            alt="Kepala Maskot MAUNC"
            className="absolute inset-0 z-20 w-full h-full object-contain pointer-events-none select-none"
            style={{
              transformOrigin: '49.4% 25.9%',
              willChange: 'transform',
            }}
            animate={
              prefersReducedMotion
                ? { rotate: 0 }
                : isExcited
                ? {
                    rotate: [0, 1.5, -1.5, 0],
                    transition: {
                      duration: 1.4,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    },
                  }
                : isStreaming
                ? {
                    rotate: [0, -0.8, 0.8, 0],
                    transition: {
                      duration: 3.2,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    },
                  }
                : {
                    // Impatient head shake when camera is inactive:
                    // Stays attentive, then performs subtle robotic left/right shake and settles
                    rotate: [0, 0, -3, 3, -2, 1.5, 0, 0],
                    transition: {
                      duration: 4.4,
                      repeat: Infinity,
                      times: [0, 0.45, 0.53, 0.61, 0.69, 0.76, 0.83, 1],
                      ease: 'easeInOut',
                    },
                  }
            }
            loading="eager"
          />
        </div>
      </div>
    </div>
  );
};
