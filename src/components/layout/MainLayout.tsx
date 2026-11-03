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
    <div className="min-h-[100dvh] flex flex-col justify-between bg-white text-slate-900 overflow-x-hidden selection:bg-maunc-yellow/30 selection:text-slate-900">
      {/* 1. Header */}
      <Header />

      {/* 2. Main Center Work Area (Optimized for 1366x768 Laptop Viewport) */}
      <main className="flex-1 w-full max-w-[1440px] mx-auto px-4 md:px-6 py-2 md:py-3 flex flex-col justify-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 md:gap-6 items-center">
          {/* Left Column: Prominent Robotic Tiger Mascot (~22% width) */}
          <div className="hidden lg:flex lg:col-span-3 h-[420px] md:h-[480px] items-end justify-center relative">
            {mascotNode}
          </div>

          {/* Center Column: Dominant Live Camera Viewport (~52% width) */}
          <div className="col-span-1 lg:col-span-6 w-full h-[380px] md:h-[460px] lg:h-[490px] flex flex-col">
            {cameraNode}
          </div>

          {/* Right Column: Calculator Card (~26% width) */}
          <div className="col-span-1 lg:col-span-3 w-full flex flex-col justify-center">
            {calculatorNode}

            {/* Mobile Mascot Fallback */}
            <div className="flex lg:hidden mt-6 justify-center">
              {mascotNode}
            </div>
          </div>
        </div>
      </main>

      {/* 3. Footer with Centered MAUNC Horizontal Logo */}
      <Footer />
    </div>
  );
};
