import React from 'react';
import { ASSET_MANIFEST } from '../../assets/assetManifest';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-white py-3 px-6 shrink-0 relative z-10">
      <div className="max-w-[1440px] mx-auto flex items-center justify-center gap-4">
        {/* Left Yellow Line */}
        <div className="flex-1 h-[2.5px] bg-maunc-yellow rounded-full hidden sm:block" />

        {/* Centered Horizontal Logo */}
        <div className="shrink-0 flex items-center justify-center px-2">
          <img
            src={ASSET_MANIFEST.horizontalLogo}
            alt="MAUNC — Mechanical Autonomous Navigation Control"
            className="h-9 md:h-10 object-contain"
          />
        </div>

        {/* Right Yellow Line */}
        <div className="flex-1 h-[2.5px] bg-maunc-yellow rounded-full hidden sm:block" />
      </div>
    </footer>
  );
};
