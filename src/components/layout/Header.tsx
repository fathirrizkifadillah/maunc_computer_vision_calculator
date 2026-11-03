import React from 'react';
import { ASSET_MANIFEST } from '../../assets/assetManifest';

export const Header: React.FC = () => {
  return (
    <header className="w-full bg-white relative z-10 shrink-0">
      <div className="max-w-[1440px] mx-auto px-4 md:px-6 py-2 md:py-2.5 flex items-center justify-between">
        {/* Left: Official Emblem and Identity */}
        <div className="flex items-center gap-2.5 md:gap-3.5">
          <img
            src={ASSET_MANIFEST.logo}
            alt="MAUNC Emblem"
            className="w-9 h-9 md:w-11 md:h-11 object-contain shrink-0"
          />
          <div className="flex flex-col justify-center">
            <h1 className="text-lg md:text-2xl font-black tracking-tight text-slate-950 uppercase leading-none font-sans">
              MAUNC
            </h1>
            <p className="text-[10px] md:text-[11px] font-medium text-slate-600 tracking-tight mt-0.5 line-clamp-1">
              Mechanical Autonomous Navigation Control
            </p>
          </div>
        </div>

        {/* Right: Official MAUNC Yellow Stripes (///) */}
        <div className="flex items-center gap-1 md:gap-1.5 shrink-0">
          <div className="w-2 md:w-2.5 h-5 md:h-6 bg-maunc-yellow -skew-x-[28deg] rounded-[1px]" />
          <div className="w-2 md:w-2.5 h-5 md:h-6 bg-maunc-yellow -skew-x-[28deg] rounded-[1px]" />
          <div className="w-2 md:w-2.5 h-5 md:h-6 bg-maunc-yellow -skew-x-[28deg] rounded-[1px]" />
        </div>
      </div>

      {/* Bottom Border: MAUNC Yellow Accent Line + Subtle Gray Extension */}
      <div className="w-full flex items-center h-[2.5px] md:h-[3px]">
        <div className="w-48 md:w-80 bg-maunc-yellow h-full" />
        <div className="flex-1 bg-slate-200 h-[1.5px]" />
      </div>
    </header>
  );
};
