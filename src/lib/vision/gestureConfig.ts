import { FingerStates, GestureDefinition, GestureNumber } from '../../types/gesture';

/**
 * Converts a FingerStates object into a 5-character binary string.
 * EXACT ORDER: thumb, index, middle, ring, pinky
 */
export function fingerStatesToBinary(states: FingerStates): string {
  return [
    states.thumb ? '1' : '0',
    states.index ? '1' : '0',
    states.middle ? '1' : '0',
    states.ring ? '1' : '0',
    states.pinky ? '1' : '0',
  ].join('');
}

/**
 * Converts a 5-character binary string into a FingerStates object.
 */
export function binaryToFingerStates(binary: string): FingerStates {
  if (binary.length !== 5) {
    throw new Error(`Binary vector must be exactly 5 characters, got "${binary}"`);
  }
  return {
    thumb: binary[0] === '1',
    index: binary[1] === '1',
    middle: binary[2] === '1',
    ring: binary[3] === '1',
    pinky: binary[4] === '1',
  };
}

/**
 * Official MAUNC Gesture Definitions (0–9)
 * Note on critical mappings:
 * - 8: 11100 (Thumb, Index, Middle OPEN; Ring, Pinky FOLDED) -> Index is OPEN!
 * - 9: 11110 (Thumb, Index, Middle, Ring OPEN; Pinky FOLDED)
 */
export const OFFICIAL_GESTURES: readonly GestureDefinition[] = [
  {
    number: 0,
    binaryVector: '00000',
    fingerStates: { thumb: false, index: false, middle: false, ring: false, pinky: false },
    description: 'Closed fist',
  },
  {
    number: 1,
    binaryVector: '01000',
    fingerStates: { thumb: false, index: true, middle: false, ring: false, pinky: false },
    description: 'Only index finger open',
  },
  {
    number: 2,
    binaryVector: '01100',
    fingerStates: { thumb: false, index: true, middle: true, ring: false, pinky: false },
    description: 'Index + middle open',
  },
  {
    number: 3,
    binaryVector: '01110',
    fingerStates: { thumb: false, index: true, middle: true, ring: true, pinky: false },
    description: 'Index + middle + ring open',
  },
  {
    number: 4,
    binaryVector: '01111',
    fingerStates: { thumb: false, index: true, middle: true, ring: true, pinky: true },
    description: 'Four fingers open, thumb folded',
  },
  {
    number: 5,
    binaryVector: '11111',
    fingerStates: { thumb: true, index: true, middle: true, ring: true, pinky: true },
    description: 'All fingers open',
  },
  {
    number: 6,
    binaryVector: '10000',
    fingerStates: { thumb: true, index: false, middle: false, ring: false, pinky: false },
    description: 'Only thumb open',
  },
  {
    number: 7,
    binaryVector: '11000',
    fingerStates: { thumb: true, index: true, middle: false, ring: false, pinky: false },
    description: 'Thumb + index open',
  },
  {
    number: 8,
    binaryVector: '11100',
    fingerStates: { thumb: true, index: true, middle: true, ring: false, pinky: false },
    description: 'Thumb + index + middle open',
  },
  {
    number: 9,
    binaryVector: '11110',
    fingerStates: { thumb: true, index: true, middle: true, ring: true, pinky: false },
    description: 'Thumb + index + middle + ring open',
  },
] as const;

/**
 * Fast lookup map from binary vector to GestureDefinition.
 */
export const GESTURE_BY_BINARY: ReadonlyMap<string, GestureDefinition> = new Map(
  OFFICIAL_GESTURES.map((g) => [g.binaryVector, g]),
);

/**
 * Lookup by number.
 */
export const GESTURE_BY_NUMBER: ReadonlyMap<GestureNumber, GestureDefinition> = new Map(
  OFFICIAL_GESTURES.map((g) => [g.number, g]),
);
