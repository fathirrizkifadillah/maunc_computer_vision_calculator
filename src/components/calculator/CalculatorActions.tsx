import React from 'react';
import { ArrowCounterClockwise } from '@phosphor-icons/react';

export interface CalculatorActionsProps {
  onReset: () => void;
  disabled?: boolean;
}

export const CalculatorActions: React.FC<CalculatorActionsProps> = ({
  onReset,
  disabled = false,
}) => {
  return (
    <div className="pt-0.5">
      <button
        type="button"
        onClick={onReset}
        disabled={disabled}
        className="w-full h-10 sm:h-11 rounded-xl sm:rounded-2xl bg-[#23272E] hover:bg-slate-800 text-white font-bold text-xs sm:text-sm tracking-wide flex items-center justify-center gap-2 active:scale-[0.98] transition-all duration-150 shadow-md cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
      >
        <ArrowCounterClockwise size={18} weight="bold" />
        <span>Reset</span>
      </button>
    </div>
  );
};
