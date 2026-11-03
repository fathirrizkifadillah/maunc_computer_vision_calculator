import { describe, expect, it } from 'vitest';
import { CalculatorEngine, INITIAL_CALCULATOR_STATE } from '../lib/calculator/calculatorEngine';

describe('Calculator Engine Operations', () => {
  it('should calculate addition correctly: 7 + 3 = 10', () => {
    let state = CalculatorEngine.applyNumberInput(INITIAL_CALCULATOR_STATE, 7);
    expect(state.firstNumber).toBe(7);
    expect(state.result).toBeNull();

    state = CalculatorEngine.applyOperator(state, '+');
    expect(state.operator).toBe('+');
    expect(state.inputTarget).toBe('secondNumber');

    state = CalculatorEngine.applyNumberInput(state, 3);
    expect(state.secondNumber).toBe(3);
    expect(state.result).toBe(10);
    expect(state.isComplete).toBe(true);
    expect(state.errorMessage).toBeNull();
  });

  it('should calculate subtraction correctly: 9 − 4 = 5', () => {
    let state = CalculatorEngine.applyNumberInput(INITIAL_CALCULATOR_STATE, 9);
    state = CalculatorEngine.applyOperator(state, '−');
    state = CalculatorEngine.applyNumberInput(state, 4);
    expect(state.result).toBe(5);
    expect(state.isComplete).toBe(true);
  });

  it('should calculate multiplication correctly: 7 × 3 = 21 and multi-digit result 9 × 9 = 81', () => {
    let state = CalculatorEngine.applyNumberInput(INITIAL_CALCULATOR_STATE, 7);
    state = CalculatorEngine.applyOperator(state, '×');
    state = CalculatorEngine.applyNumberInput(state, 3);
    expect(state.result).toBe(21);

    // 9 * 9 = 81
    let state2 = CalculatorEngine.applyNumberInput(INITIAL_CALCULATOR_STATE, 9);
    state2 = CalculatorEngine.applyOperator(state2, '×');
    state2 = CalculatorEngine.applyNumberInput(state2, 9);
    expect(state2.result).toBe(81);
  });

  it('should calculate division correctly: 8 ÷ 2 = 4', () => {
    let state = CalculatorEngine.applyNumberInput(INITIAL_CALCULATOR_STATE, 8);
    state = CalculatorEngine.applyOperator(state, '÷');
    state = CalculatorEngine.applyNumberInput(state, 2);
    expect(state.result).toBe(4);
    expect(state.errorMessage).toBeNull();
  });

  it('should handle division by zero safely with clear error', () => {
    let state = CalculatorEngine.applyNumberInput(INITIAL_CALCULATOR_STATE, 8);
    state = CalculatorEngine.applyOperator(state, '÷');
    state = CalculatorEngine.applyNumberInput(state, 0);
    expect(state.result).toBeNull();
    expect(state.errorMessage).toBe('Tidak bisa membagi dengan 0');
  });

  it('should calculate exponentiation correctly: 6 ^ 2 = 36', () => {
    let state = CalculatorEngine.applyNumberInput(INITIAL_CALCULATOR_STATE, 6);
    state = CalculatorEngine.applyOperator(state, '^');
    state = CalculatorEngine.applyNumberInput(state, 2);
    expect(state.result).toBe(36);
  });

  it('should calculate unary square root immediately without second operand: √9 = 3', () => {
    let state = CalculatorEngine.applyNumberInput(INITIAL_CALCULATOR_STATE, 9);
    state = CalculatorEngine.applyOperator(state, '√');
    expect(state.result).toBe(3);
    expect(state.secondNumber).toBeNull();
    expect(state.isComplete).toBe(true);
  });

  it('should support independent correction of first operand without clearing equation', () => {
    // Start with 7 × 3 = 21
    let state = CalculatorEngine.applyNumberInput(INITIAL_CALCULATOR_STATE, 7);
    state = CalculatorEngine.applyOperator(state, '×');
    state = CalculatorEngine.applyNumberInput(state, 3);
    expect(state.result).toBe(21);

    // User edits Angka 1 -> changes to 8
    state = CalculatorEngine.setEditTarget(state, 'firstNumber');
    expect(state.isEditMode).toBe(true);
    expect(state.inputTarget).toBe('firstNumber');

    state = CalculatorEngine.applyNumberInput(state, 8);
    expect(state.firstNumber).toBe(8);
    expect(state.operator).toBe('×');
    expect(state.secondNumber).toBe(3);
    expect(state.result).toBe(24); // 8 * 3 = 24
  });

  it('should support independent correction of second operand without clearing equation', () => {
    // Start with 8 + 1 = 9
    let state = CalculatorEngine.applyNumberInput(INITIAL_CALCULATOR_STATE, 8);
    state = CalculatorEngine.applyOperator(state, '+');
    state = CalculatorEngine.applyNumberInput(state, 1);
    expect(state.result).toBe(9);

    // User edits Angka 2 -> changes to 5
    state = CalculatorEngine.setEditTarget(state, 'secondNumber');
    expect(state.isEditMode).toBe(true);
    expect(state.inputTarget).toBe('secondNumber');

    state = CalculatorEngine.applyNumberInput(state, 5);
    expect(state.firstNumber).toBe(8);
    expect(state.operator).toBe('+');
    expect(state.secondNumber).toBe(5);
    expect(state.result).toBe(13); // 8 + 5 = 13
  });

  it('should recalculate when operator is switched without clearing operands', () => {
    let state = CalculatorEngine.applyNumberInput(INITIAL_CALCULATOR_STATE, 8);
    state = CalculatorEngine.applyOperator(state, '+');
    state = CalculatorEngine.applyNumberInput(state, 2);
    expect(state.result).toBe(10);

    // Switch to multiplication
    state = CalculatorEngine.applyOperator(state, '×');
    expect(state.operator).toBe('×');
    expect(state.result).toBe(16); // 8 * 2 = 16
  });

  it('should reset all calculator state back to clean initial state', () => {
    let state = CalculatorEngine.applyNumberInput(INITIAL_CALCULATOR_STATE, 8);
    state = CalculatorEngine.applyOperator(state, '÷');
    state = CalculatorEngine.applyNumberInput(state, 0); // division by zero
    expect(state.errorMessage).not.toBeNull();

    const resetState = CalculatorEngine.reset();
    expect(resetState).toEqual(INITIAL_CALCULATOR_STATE);
    expect(resetState.firstNumber).toBeNull();
    expect(resetState.operator).toBeNull();
    expect(resetState.secondNumber).toBeNull();
    expect(resetState.result).toBeNull();
    expect(resetState.errorMessage).toBeNull();
  });
});
