import React from 'react';
import { WarningCircle } from '@phosphor-icons/react';

export interface ResultDisplayProps {
  result: number | null;
  errorMessage: string | null;
  isComplete: boolean;
}

export const ResultDisplay: React.FC<ResultDisplayProps> = ({
  result,
  errorMessage,
}) => {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-bold text-slate-800">
        Hasil
      </label>

      <div
        className={`w-full min-h-[56px] px-4 py-2 rounded-2xl flex items-center justify-center font-mono text-2xl font-bold tabular-nums transition-all duration-200 ${
          errorMessage
            ? 'bg-red-50 border border-red-300 text-red-600'
            : 'bg-[#FEF9C3] border border-amber-200 text-slate-950 shadow-sm'
        }`}
      >
        {errorMessage ? (
          <div className="flex items-center gap-2 text-xs font-sans font-medium text-red-600 text-center">
            <WarningCircle size={18} className="shrink-0 text-red-500" weight="fill" />
            <span>{errorMessage}</span>
          </div>
        ) : (
          <span>{result !== null ? result : '-'}</span>
        )}
      </div>
    </div>
  );
};
