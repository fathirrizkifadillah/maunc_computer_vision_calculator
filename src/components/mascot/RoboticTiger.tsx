import React from 'react';
import { ASSET_MANIFEST } from '../../assets/assetManifest';

export interface RoboticTigerProps {
  isStreaming: boolean;
  isHandPresent: boolean;
  isStabilizing: boolean;
  isConfirmed: boolean;
  isComplete: boolean;
}

export const RoboticTiger: React.FC<RoboticTigerProps> = ({
  isStabilizing,
  isConfirmed,
  isComplete,
}) => {
  const isExcited = isStabilizing || isConfirmed || isComplete;

  return (
    <div className="relative w-full h-full flex items-end justify-center select-none overflow-hidden">
      {/* Dynamic Diagonal MAUNC Yellow Graphic Band behind Mascot - Desktop Only */}
      <div
        className="hidden lg:block absolute left-[-25%] bottom-[12%] w-[140%] h-[75px] bg-maunc-yellow -rotate-[32deg] origin-bottom-left -z-0 pointer-events-none rounded-sm shadow-sm"
        aria-hidden="true"
      />

      {/* Layered Animated Mascot Structure */}
      <div className="relative z-10 w-full max-w-[150px] sm:max-w-[200px] md:max-w-[250px] lg:max-w-[320px] flex items-end justify-center">
        {/* Breathing & Swaying Wrapper */}
        <div
          className={`relative w-full h-auto aspect-[765/1024] animate-mascot-breathe transition-transform duration-300 ${
            isComplete
              ? 'scale-105'
              : isConfirmed
              ? 'scale-[1.02]'
              : 'hover:scale-[1.01]'
          }`}
        >
          {/* 1. Tail Layer (Behind Body, wags with anatomical hip pivot) */}
          <img
            src={ASSET_MANIFEST.mascotTail}
            alt="Ekor Maskot MAUNC"
            className={`absolute inset-0 w-full h-full object-contain pointer-events-none select-none ${
              isExcited ? 'animate-mascot-tail-fast' : 'animate-mascot-tail'
            }`}
            loading="eager"
          />

          {/* 2. Body Layer (Front, occludes the tail root naturally) */}
          <img
            src={ASSET_MANIFEST.mascotBody}
            alt="MAUNC Robotic Tiger Mascot"
            className="relative z-10 w-full h-full object-contain pointer-events-none select-none drop-shadow-md"
            loading="eager"
          />
        </div>
      </div>
    </div>
  );
};
