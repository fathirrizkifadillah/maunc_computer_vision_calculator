import React from 'react';
import { PencilSimple } from '@phosphor-icons/react';

export interface NumberDisplayProps {
  label: string;
  value: number | null;
  isActiveTarget: boolean;
  isEditMode: boolean;
  disabled?: boolean;
  onEditClick: () => void;
}

export const NumberDisplay: React.FC<NumberDisplayProps> = ({
  label,
  value,
  isActiveTarget,
  isEditMode,
  disabled = false,
  onEditClick,
}) => {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center justify-between">
        <label className="text-[11px] sm:text-xs font-bold text-slate-800">
          {label}
        </label>
        {isEditMode && (
          <span className="text-[9px] sm:text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full border border-amber-300">
            Koreksi Aktif
          </span>
        )}
      </div>

      <div className="flex items-center gap-1.5 sm:gap-2">
        {/* Main Light Gray Input Surface */}
        <div
          className={`flex-1 h-10 sm:h-11 px-3 sm:px-4 rounded-xl sm:rounded-2xl flex items-center justify-center font-mono text-lg sm:text-xl font-bold tabular-nums transition-all duration-150 ${
            isActiveTarget
              ? 'bg-slate-100 border-2 border-maunc-yellow text-slate-950 ring-2 ring-maunc-yellow/30'
              : 'bg-[#ECEEF2] border border-slate-200/80 text-slate-900'
          } ${disabled ? 'opacity-40 pointer-events-none' : ''}`}
        >
          <span>{value !== null ? value : '-'}</span>
        </div>

        {/* Edit Button [✎] */}
        <button
          onClick={onEditClick}
          disabled={disabled}
          type="button"
          title={`Koreksi ${label}`}
          className={`h-10 w-10 sm:h-11 sm:w-11 rounded-xl sm:rounded-2xl flex items-center justify-center transition-all duration-150 cursor-pointer ${
            isEditMode
              ? 'bg-maunc-yellow text-slate-950 font-bold shadow-sm ring-2 ring-maunc-yellow/50'
              : 'bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 hover:text-slate-900 shadow-sm active:scale-[0.96]'
          } disabled:opacity-30 disabled:cursor-not-allowed`}
        >
          <PencilSimple size={18} weight={isEditMode ? 'bold' : 'regular'} />
        </button>
      </div>
    </div>
  );
};
