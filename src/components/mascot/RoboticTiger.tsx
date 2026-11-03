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
        className="absolute left-[-25%] bottom-[10%] w-[140%] h-[60px] md:h-[80px] bg-maunc-yellow -rotate-[32deg] origin-bottom-left -z-0 pointer-events-none rounded-sm shadow-sm"
        aria-hidden="true"
      />

      {/* Mascot Image */}
      <div className="relative z-10 w-full max-w-[200px] sm:max-w-[240px] md:max-w-[280px] lg:max-w-[300px] flex items-end justify-center">
        <img
          src={ASSET_MANIFEST.mascot}
          alt="MAUNC Robotic Tiger Mascot"
          className={`w-full h-auto max-h-[220px] sm:max-h-[320px] md:max-h-[400px] lg:max-h-[430px] object-contain drop-shadow-md transition-transform duration-300 ${
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
