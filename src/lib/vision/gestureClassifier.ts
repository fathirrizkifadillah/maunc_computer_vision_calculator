import {
  FingerStates,
  GestureClassificationResult,
  GestureNumber,
} from '../../types/gesture';
import { GESTURE_BY_BINARY, fingerStatesToBinary } from './gestureConfig';

/**
 * Classifies finger states into a MAUNC gesture number (0–9) or null if unrecognized.
 */
export function classifyGesture(
  fingerStates: FingerStates,
  isAmbiguous: boolean = false,
): GestureClassificationResult {
  const binaryVector = fingerStatesToBinary(fingerStates);

  // If the finger state extraction was severely ambiguous, do not force a match
  if (isAmbiguous) {
    return {
      number: null,
      binaryVector,
      fingerStates,
      isAmbiguous: true,
    };
  }

  // Lookup exact match in official dictionary
  const match = GESTURE_BY_BINARY.get(binaryVector);

  if (match) {
    return {
      number: match.number,
      binaryVector,
      fingerStates,
      isAmbiguous: false,
    };
  }

  // Unrecognized combination -> return null (unknown)
  return {
    number: null,
    binaryVector,
    fingerStates,
    isAmbiguous: false,
  };
}

/**
 * Convenience helper to get human-readable description for classified result.
 */
export function getGestureDescription(number: GestureNumber | null): string {
  if (number === null) return 'Gesture tidak dikenali';
  const match = GESTURE_BY_BINARY.get(GESTURE_BY_BINARY.get(String(number))?.binaryVector || '');
  return match ? match.description : `Angka ${number}`;
}
