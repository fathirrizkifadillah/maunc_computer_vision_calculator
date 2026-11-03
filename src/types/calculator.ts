export type CalculatorOperator = '+' | '−' | '×' | '÷' | '^' | '√';

export type InputTarget = 'firstNumber' | 'secondNumber';

export interface CalculatorState {
  firstNumber: number | null;
  operator: CalculatorOperator | null;
  secondNumber: number | null;
  result: number | null;
  errorMessage: string | null;
  inputTarget: InputTarget;
  isEditMode: boolean;
  isComplete: boolean;
}
