import React from 'react';
import { ASSET_MANIFEST } from '../../assets/assetManifest';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-white py-1.5 md:py-2.5 px-4 md:px-6 shrink-0 relative z-10 border-t border-slate-100">
      <div className="max-w-[1440px] mx-auto flex items-center justify-center gap-3 md:gap-4">
        {/* Left Yellow Line */}
        <div className="flex-1 h-[2px] md:h-[2.5px] bg-maunc-yellow rounded-full hidden sm:block" />

        {/* Centered Horizontal Logo */}
        <div className="shrink-0 flex items-center justify-center px-1">
          <img
            src={ASSET_MANIFEST.horizontalLogo}
            alt="MAUNC — Mechanical Autonomous Navigation Control"
            className="h-6 sm:h-7 md:h-8 object-contain"
          />
        </div>

        {/* Right Yellow Line */}
        <div className="flex-1 h-[2px] md:h-[2.5px] bg-maunc-yellow rounded-full hidden sm:block" />
      </div>
    </footer>
  );
};
