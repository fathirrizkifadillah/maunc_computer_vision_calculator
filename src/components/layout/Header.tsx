import React from 'react';
import { ASSET_MANIFEST } from '../../assets/assetManifest';

export const Header: React.FC = () => {
  return (
    <header className="w-full bg-white relative z-10 shrink-0">
      <div className="max-w-[1440px] mx-auto px-6 py-3.5 flex items-center justify-between">
        {/* Left: Official Emblem and Identity */}
        <div className="flex items-center gap-3.5">
          <img
            src={ASSET_MANIFEST.logo}
            alt="MAUNC Emblem"
            className="w-12 h-12 object-contain shrink-0"
          />
          <div className="flex flex-col justify-center">
            <h1 className="text-2xl font-black tracking-tight text-slate-950 uppercase leading-none font-sans">
              MAUNC
            </h1>
            <p className="text-[11px] font-medium text-slate-600 tracking-tight mt-0.5">
              Mechanical Autonomous Navigation Control
            </p>
          </div>
        </div>

        {/* Right: Official MAUNC Yellow Stripes (///) */}
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-6 bg-maunc-yellow -skew-x-[28deg] rounded-[1px]" />
          <div className="w-2.5 h-6 bg-maunc-yellow -skew-x-[28deg] rounded-[1px]" />
          <div className="w-2.5 h-6 bg-maunc-yellow -skew-x-[28deg] rounded-[1px]" />
        </div>
      </div>

      {/* Bottom Border: MAUNC Yellow Accent Line + Subtle Gray Extension */}
      <div className="w-full flex items-center h-[3px]">
        <div className="w-72 md:w-96 bg-maunc-yellow h-full" />
        <div className="flex-1 bg-slate-200 h-[1.5px]" />
      </div>
    </header>
  );
};
