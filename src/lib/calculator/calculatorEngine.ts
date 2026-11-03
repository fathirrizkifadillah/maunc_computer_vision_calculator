import { CalculatorOperator, CalculatorState, InputTarget } from '../../types/calculator';
import { executeBinaryOperation, executeUnaryOperation } from './operations';

export const INITIAL_CALCULATOR_STATE: CalculatorState = {
  firstNumber: null,
  operator: null,
  secondNumber: null,
  result: null,
  errorMessage: null,
  inputTarget: 'firstNumber',
  isEditMode: false,
  isComplete: false,
};

/**
 * Pure calculator state transition handler.
 */
export class CalculatorEngine {
  /**
   * Applies a numerical input (0–9) to the current active input target.
   */
  static applyNumberInput(state: CalculatorState, digit: number): CalculatorState {
    // If calculation was already complete and we are NOT in explicit edit mode,
    // start a new transaction with this digit as firstNumber.
    if (state.isComplete && !state.isEditMode) {
      return {
        ...INITIAL_CALCULATOR_STATE,
        firstNumber: digit,
        inputTarget: 'firstNumber',
      };
    }

    if (state.inputTarget === 'firstNumber') {
      const updatedState: CalculatorState = {
        ...state,
        firstNumber: digit,
        errorMessage: null,
        isEditMode: false,
      };

      // If unary square root was active, calculate immediately
      if (updatedState.operator === '√') {
        const { value, error } = executeUnaryOperation(digit, '√');
        return {
          ...updatedState,
          result: value,
          errorMessage: error,
          isComplete: value !== null,
        };
      }

      // If binary operator and secondNumber already exist, recalculate
      if (updatedState.operator && updatedState.secondNumber !== null) {
        const { value, error } = executeBinaryOperation(
          digit,
          updatedState.operator,
          updatedState.secondNumber,
        );
        return {
          ...updatedState,
          result: value,
          errorMessage: error,
          isComplete: value !== null,
        };
      }

      return updatedState;
    }

    if (state.inputTarget === 'secondNumber') {
      const updatedState: CalculatorState = {
        ...state,
        secondNumber: digit,
        errorMessage: null,
        isEditMode: false,
      };

      // Recalculate if firstNumber and binary operator are present
      if (updatedState.firstNumber !== null && updatedState.operator && updatedState.operator !== '√') {
        const { value, error } = executeBinaryOperation(
          updatedState.firstNumber,
          updatedState.operator,
          digit,
        );
        return {
          ...updatedState,
          result: value,
          errorMessage: error,
          isComplete: value !== null,
        };
      }

      return updatedState;
    }

    return state;
  }

  /**
   * Applies an operator selection.
   */
  static applyOperator(state: CalculatorState, op: CalculatorOperator): CalculatorState {
    // If no first number is set yet, default first number to 0
    const firstNumber = state.firstNumber ?? 0;

    if (op === '√') {
      // Unary square root: clears second number and calculates immediately
      const { value, error } = executeUnaryOperation(firstNumber, '√');
      return {
        ...state,
        firstNumber,
        operator: '√',
        secondNumber: null,
        result: value,
        errorMessage: error,
        inputTarget: 'firstNumber',
        isEditMode: false,
        isComplete: value !== null,
      };
    }

    // Binary operator selected
    const updatedState: CalculatorState = {
      ...state,
      firstNumber,
      operator: op,
      inputTarget: 'secondNumber',
      isEditMode: false,
    };

    // If both operands are present, calculate immediately
    if (updatedState.firstNumber !== null && updatedState.secondNumber !== null) {
      const { value, error } = executeBinaryOperation(
        updatedState.firstNumber,
        op,
        updatedState.secondNumber,
      );
      return {
        ...updatedState,
        result: value,
        errorMessage: error,
        isComplete: value !== null,
      };
    }

    // Otherwise, clear previous result and await second number
    return {
      ...updatedState,
      result: null,
      isComplete: false,
    };
  }

  /**
   * Sets the input target to edit a specific operand.
   */
  static setEditTarget(state: CalculatorState, target: InputTarget): CalculatorState {
    return {
      ...state,
      inputTarget: target,
      isEditMode: true,
      errorMessage: null,
    };
  }

  /**
   * Full reset of the calculator state.
   */
  static reset(): CalculatorState {
    return { ...INITIAL_CALCULATOR_STATE };
  }
}
