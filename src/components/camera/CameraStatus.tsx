import React from 'react';
import { GestureStabilizationState } from '../../types/gesture';

export interface CameraStatusProps {
  isStreaming: boolean;
  stabilizationState: GestureStabilizationState;
  detectedDigit: number | null;
  binaryVector: string;
}

export const CameraStatus: React.FC<CameraStatusProps> = ({
  isStreaming,
  stabilizationState,
  detectedDigit,
  binaryVector,
}) => {
  if (!isStreaming) {
    return null;
  }

  const { isLocked, isStabilizing, progress, statusMessage } = stabilizationState;

  return (
    <div className="absolute bottom-5 left-6 right-6 z-20 pointer-events-none flex flex-col gap-2">
      {/* Stabilization progress bar (visible when actively stabilizing) */}
      {isStabilizing && (
        <div className="w-full bg-black/60 backdrop-blur-md h-1.5 rounded-full overflow-hidden border border-white/20">
          <div
            className="h-full bg-maunc-yellow transition-all duration-75 ease-out shadow-[0_0_8px_rgba(245,158,11,0.8)]"
            style={{ width: `${Math.round(progress * 100)}%` }}
          />
        </div>
      )}

      {/* Internal Contextual Bar */}
      <div className="h-10 px-4 py-1.5 rounded-xl bg-black/75 backdrop-blur-md border border-white/15 text-xs flex items-center justify-between text-white shadow-lg pointer-events-auto">
        <div className="flex items-center gap-2.5 min-w-0">
          <span
            className={`w-2 h-2 rounded-full shrink-0 ${
              isLocked
                ? 'bg-amber-400 animate-pulse'
                : isStabilizing
                ? 'bg-maunc-yellow animate-ping'
                : detectedDigit !== null
                ? 'bg-emerald-400'
                : 'bg-slate-400'
            }`}
          />
          <span className="font-medium text-slate-200 truncate text-[12px]">
            {statusMessage}
          </span>
        </div>

        {detectedDigit !== null && (
          <div className="shrink-0 flex items-center gap-2 ml-2 pl-2.5 border-l border-white/20">
            <span className="text-[10px] uppercase font-mono tracking-wider text-slate-300">
              {binaryVector}
            </span>
            <span className="px-2 py-0.5 rounded-md font-mono font-bold text-xs bg-maunc-yellow text-slate-950 shadow-sm">
              {detectedDigit}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
