import { CalculatorOperator } from '../../types/calculator';

export interface CalculationResult {
  value: number | null;
  error: string | null;
}

/**
 * Cleanly formats a calculation result to prevent floating-point artifacts
 * like 0.1 + 0.2 = 0.30000000000000004.
 */
export function formatResult(value: number): number {
  // Round to 4 decimal places to eliminate IEEE 754 precision noise
  return Math.round((value + Number.EPSILON) * 10000) / 10000;
}

/**
 * Executes a binary mathematical operation between two numbers.
 */
export function executeBinaryOperation(
  first: number,
  operator: CalculatorOperator,
  second: number,
): CalculationResult {
  switch (operator) {
    case '+':
      return { value: formatResult(first + second), error: null };
    case '−':
      return { value: formatResult(first - second), error: null };
    case '×':
      return { value: formatResult(first * second), error: null };
    case '÷':
      if (second === 0) {
        return { value: null, error: 'Tidak bisa membagi dengan 0' };
      }
      return { value: formatResult(first / second), error: null };
    case '^':
      return { value: formatResult(Math.pow(first, second)), error: null };
    default:
      return { value: null, error: `Operator tidak valid: ${operator}` };
  }
}

/**
 * Executes a unary mathematical operation (square root).
 */
export function executeUnaryOperation(
  first: number,
  operator: CalculatorOperator,
): CalculationResult {
  if (operator === '√') {
    if (first < 0) {
      return { value: null, error: 'Angka harus ≥ 0 untuk akar kuadrat' };
    }
    return { value: formatResult(Math.sqrt(first)), error: null };
  }
  return { value: null, error: `Bukan operasi unary: ${operator}` };
}
