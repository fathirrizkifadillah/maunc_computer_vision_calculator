import React from 'react';
import { ASSET_MANIFEST } from '../../assets/assetManifest';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-white py-2 md:py-3 px-4 md:px-8 shrink-0 relative z-10 border-t border-slate-100">
      <div className="max-w-[1440px] mx-auto flex items-center justify-center gap-3 sm:gap-6">
        {/* Left Yellow Line */}
        <div className="flex-1 h-[2px] md:h-[3px] bg-maunc-yellow rounded-full hidden sm:block" />

        {/* Centered Large Horizontal Logo & Text */}
        <div className="shrink-0 flex items-center justify-center px-2">
          <img
            src={ASSET_MANIFEST.horizontalLogo}
            alt="MAUNC — Mechanical Autonomous Navigation Control"
            className="h-9 sm:h-12 md:h-14 lg:h-16 max-w-[280px] sm:max-w-[340px] md:max-w-[420px] object-contain transition-all"
          />
        </div>

        {/* Right Yellow Line */}
        <div className="flex-1 h-[2px] md:h-[3px] bg-maunc-yellow rounded-full hidden sm:block" />
      </div>
    </footer>
  );
};
