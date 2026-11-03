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
  isConfirmed,
  isComplete,
}) => {
  return (
    <div className="relative w-full h-full flex items-end justify-center select-none overflow-visible">
      {/* Dynamic Diagonal MAUNC Yellow Graphic Band behind Mascot */}
      <div
        className="absolute left-[-20%] bottom-[8%] w-[130%] h-[75px] md:h-[90px] bg-maunc-yellow -rotate-[32deg] origin-bottom-left -z-0 pointer-events-none rounded-sm shadow-sm"
        aria-hidden="true"
      />

      {/* Mascot Image (Transparent PNG, Prominent and Naturally Grounded) */}
      <div className="relative z-10 w-full max-w-[260px] md:max-w-[300px] lg:max-w-[320px] flex items-end justify-center">
        <img
          src={ASSET_MANIFEST.mascot}
          alt="MAUNC Robotic Tiger Mascot"
          className={`w-full h-auto max-h-[420px] md:max-h-[480px] lg:max-h-[500px] object-contain drop-shadow-md transition-transform duration-300 ${
            isComplete
              ? 'scale-105'
              : isConfirmed
              ? 'scale-[1.02]'
              : 'hover:scale-[1.01]'
          }`}
          loading="eager"
        />
      </div>
    </div>
  );
};
