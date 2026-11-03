import React from 'react';
import { CalculatorOperator, CalculatorState, InputTarget } from '../../types/calculator';
import { NumberDisplay } from './NumberDisplay';
import { OperatorSelector } from './OperatorSelector';
import { ResultDisplay } from './ResultDisplay';
import { CalculatorActions } from './CalculatorActions';
import { Calculator } from '@phosphor-icons/react';

export interface CalculatorPanelProps {
  state: CalculatorState;
  onSelectOperator: (op: CalculatorOperator) => void;
  onSetEditTarget: (target: InputTarget) => void;
  onReset: () => void;
}

export const CalculatorPanel: React.FC<CalculatorPanelProps> = ({
  state,
  onSelectOperator,
  onSetEditTarget,
  onReset,
}) => {
  const isUnarySquareRoot = state.operator === '√';

  return (
    <div className="w-full bg-white border-2 border-slate-200/90 rounded-2xl sm:rounded-3xl p-3.5 sm:p-4 md:p-5 shadow-xl flex flex-col gap-2.5 sm:gap-3">
      {/* Panel Header */}
      <div className="flex items-center gap-2 pb-0.5">
        <div className="w-7 h-7 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-800">
          <Calculator size={18} weight="fill" />
        </div>
        <h2 className="text-lg font-bold tracking-tight text-slate-900">
          Kalkulator
        </h2>
      </div>

      {/* 1. Angka 1 Display & Edit */}
      <NumberDisplay
        label="Angka 1"
        value={state.firstNumber}
        isActiveTarget={state.inputTarget === 'firstNumber'}
        isEditMode={state.isEditMode && state.inputTarget === 'firstNumber'}
        onEditClick={() => onSetEditTarget('firstNumber')}
      />

      {/* 2. Operator Selector */}
      <OperatorSelector
        currentOperator={state.operator}
        onSelectOperator={onSelectOperator}
      />

      {/* 3. Angka 2 Display & Edit (hidden/disabled if unary square root) */}
      <NumberDisplay
        label="Angka 2"
        value={isUnarySquareRoot ? null : state.secondNumber}
        isActiveTarget={!isUnarySquareRoot && state.inputTarget === 'secondNumber'}
        isEditMode={!isUnarySquareRoot && state.isEditMode && state.inputTarget === 'secondNumber'}
        disabled={isUnarySquareRoot}
        onEditClick={() => onSetEditTarget('secondNumber')}
      />

      {/* 4. Hasil Display */}
      <ResultDisplay
        result={state.result}
        errorMessage={state.errorMessage}
        isComplete={state.isComplete}
      />

      {/* 5. Reset Action */}
      <CalculatorActions onReset={onReset} />
    </div>
  );
};
