import React from 'react';
import { Header } from './Header';
import { Footer } from './Footer';

export interface MainLayoutProps {
  mascotNode: React.ReactNode;
  cameraNode: React.ReactNode;
  calculatorNode: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({
  mascotNode,
  cameraNode,
  calculatorNode,
}) => {
  return (
    <div className="min-h-[100dvh] lg:h-[100dvh] lg:max-h-[100dvh] lg:overflow-hidden flex flex-col justify-between bg-white text-slate-900 overflow-x-hidden selection:bg-maunc-yellow/30 selection:text-slate-900">
      {/* 1. Header (shrink-0) */}
      <Header />

      {/* 2. Main Center Work Area */}
      {/* Desktop: flex-1 min-h-0 fits 100% in viewport without any scrolling */}
      {/* Mobile: flows naturally with smooth touch scrolling */}
      <main className="flex-1 min-h-0 w-full max-w-[1440px] mx-auto px-3 sm:px-4 md:px-6 py-2 md:py-2.5 flex flex-col justify-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-4 md:gap-5 lg:gap-6 items-center h-full">
          {/* Left Column: Prominent Robotic Tiger Mascot (~22% width on desktop) */}
          <div className="hidden lg:flex lg:col-span-3 h-full max-h-[440px] items-end justify-center relative overflow-hidden rounded-2xl">
            {mascotNode}
          </div>

          {/* Center Column: Dominant Live Camera Viewport (~52% width on desktop) */}
          <div className="col-span-1 lg:col-span-6 w-full h-[220px] sm:h-[300px] md:h-[380px] lg:h-full lg:max-h-[440px] flex flex-col">
            {cameraNode}
          </div>

          {/* Right Column: Calculator Card (~26% width on desktop) */}
          <div className="col-span-1 lg:col-span-3 w-full flex flex-col justify-center">
            {calculatorNode}

            {/* Mobile Mascot Fallback (shows neatly and compactly below calculator on mobile screens) */}
            <div className="flex lg:hidden mt-3 mb-1 justify-center">
              {mascotNode}
            </div>
          </div>
        </div>
      </main>

      {/* 3. Footer with Centered MAUNC Horizontal Logo (shrink-0) */}
      <Footer />
    </div>
  );
};
