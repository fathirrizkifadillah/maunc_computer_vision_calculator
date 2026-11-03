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
    <div className="min-h-[100dvh] flex flex-col bg-maunc-dark-950 text-slate-100">
      {/* Header */}
      <Header />

      {/* Main Interactive Work Area */}
      <main className="flex-1 max-w-[1500px] w-full mx-auto p-4 md:p-6 flex flex-col justify-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          {/* Left Column: Mascot (~15% width on desktop) */}
          <div className="hidden lg:flex lg:col-span-2 flex-col items-center justify-start pt-2">
            {mascotNode}
          </div>

          {/* Center Column: Dominant Live Camera Viewport (~62% width on desktop) */}
          <div className="col-span-1 lg:col-span-7 flex flex-col w-full h-[420px] md:h-[520px] lg:h-[560px]">
            {cameraNode}
          </div>

          {/* Right Column: Interactive Calculator Panel (~23% width on desktop) */}
          <div className="col-span-1 lg:col-span-3 flex flex-col w-full">
            {calculatorNode}

            {/* Mobile Mascot Fallback: Shows below calculator on small screens */}
            <div className="flex lg:hidden mt-4 justify-center">
              {mascotNode}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};
