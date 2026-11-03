import React from 'react';
import { CalculatorOperator } from '../../types/calculator';

export interface OperatorSelectorProps {
  currentOperator: CalculatorOperator | null;
  disabled?: boolean;
  onSelectOperator: (op: CalculatorOperator) => void;
}

const OPERATORS: { op: CalculatorOperator; label: string; title: string }[] = [
  { op: '+', label: '+', title: 'Penjumlahan' },
  { op: '−', label: '−', title: 'Pengurangan' },
  { op: '×', label: '×', title: 'Perkalian' },
  { op: '÷', label: '÷', title: 'Pembagian' },
  { op: '^', label: '^', title: 'Pangkat' },
  { op: '√', label: '√', title: 'Akar Kuadrat' },
];

export const OperatorSelector: React.FC<OperatorSelectorProps> = ({
  currentOperator,
  disabled = false,
  onSelectOperator,
}) => {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-[11px] sm:text-xs font-bold text-slate-800">
        Operasi
      </label>

      <div className="grid grid-cols-6 gap-1 sm:gap-1.5 md:gap-2">
        {OPERATORS.map(({ op, label, title }) => {
          const isSelected = currentOperator === op;
          return (
            <button
              key={op}
              type="button"
              title={title}
              disabled={disabled}
              onClick={() => onSelectOperator(op)}
              className={`h-9 sm:h-10 rounded-xl font-mono text-sm sm:text-base font-bold flex items-center justify-center transition-all duration-150 cursor-pointer ${
                isSelected
                  ? 'bg-maunc-yellow text-slate-950 shadow-sm ring-2 ring-maunc-yellow/60 scale-[1.04]'
                  : 'bg-[#ECEEF2] hover:bg-slate-200/80 border border-slate-200/80 text-slate-800 active:scale-[0.96]'
              } disabled:opacity-40 disabled:cursor-not-allowed`}
            >
              {label}
            </button>
          );
        })}
      </div>
    </div>
  );
};
