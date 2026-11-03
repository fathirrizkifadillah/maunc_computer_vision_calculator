import { useCallback, useState } from 'react';
import {
  CalculatorOperator,
  CalculatorState,
  InputTarget,
} from '../types/calculator';
import {
  CalculatorEngine,
  INITIAL_CALCULATOR_STATE,
} from '../lib/calculator/calculatorEngine';

export interface UseCalculatorReturn {
  state: CalculatorState;
  inputDigit: (digit: number) => void;
  selectOperator: (op: CalculatorOperator) => void;
  setEditTarget: (target: InputTarget) => void;
  resetCalculator: () => void;
}

export function useCalculator(): UseCalculatorReturn {
  const [state, setState] = useState<CalculatorState>(INITIAL_CALCULATOR_STATE);

  const inputDigit = useCallback((digit: number) => {
    setState((prev) => CalculatorEngine.applyNumberInput(prev, digit));
  }, []);

  const selectOperator = useCallback((op: CalculatorOperator) => {
    setState((prev) => CalculatorEngine.applyOperator(prev, op));
  }, []);

  const setEditTarget = useCallback((target: InputTarget) => {
    setState((prev) => CalculatorEngine.setEditTarget(prev, target));
  }, []);

  const resetCalculator = useCallback(() => {
    setState(CalculatorEngine.reset());
  }, []);

  return {
    state,
    inputDigit,
    selectOperator,
    setEditTarget,
    resetCalculator,
  };
}
