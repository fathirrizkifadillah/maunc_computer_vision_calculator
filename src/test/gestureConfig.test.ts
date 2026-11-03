import { describe, expect, it } from 'vitest';
import {
  GESTURE_BY_NUMBER,
  OFFICIAL_GESTURES,
  binaryToFingerStates,
  fingerStatesToBinary,
} from '../lib/vision/gestureConfig';

describe('Official MAUNC Gesture Mapping (0–9)', () => {
  it('should define exactly 10 gesture configurations (0 through 9)', () => {
    expect(OFFICIAL_GESTURES).toHaveLength(10);
    const numbers = OFFICIAL_GESTURES.map((g) => g.number).sort((a, b) => a - b);
    expect(numbers).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
  });

  it('should guarantee all 10 binary vectors are strictly unique', () => {
    const vectors = OFFICIAL_GESTURES.map((g) => g.binaryVector);
    const uniqueVectors = new Set(vectors);
    expect(uniqueVectors.size).toBe(10);
  });

  it('should verify exact binary vector for each digit', () => {
    const expectedVectors: Record<number, string> = {
      0: '00000',
      1: '01000',
      2: '01100',
      3: '01110',
      4: '01111',
      5: '11111',
      6: '10000',
      7: '11000',
      8: '11100',
      9: '11110',
    };

    for (const [numStr, expectedVec] of Object.entries(expectedVectors)) {
      const num = Number(numStr) as any;
      const gesture = GESTURE_BY_NUMBER.get(num);
      expect(gesture, `Missing gesture definition for ${num}`).toBeDefined();
      expect(gesture?.binaryVector).toBe(expectedVec);
      expect(fingerStatesToBinary(gesture!.fingerStates)).toBe(expectedVec);
    }
  });

  it('CRITICAL VERIFICATION: Number 8 MUST equal 11100 with index OPEN', () => {
    const gesture8 = GESTURE_BY_NUMBER.get(8);
    expect(gesture8).toBeDefined();
    expect(gesture8?.binaryVector).toBe('11100');
    expect(gesture8?.fingerStates).toEqual({
      thumb: true,
      index: true,
      middle: true,
      ring: false,
      pinky: false,
    });
    // Explicit regression check: Index MUST be open
    expect(gesture8?.fingerStates.index).toBe(true);
  });

  it('CRITICAL VERIFICATION: Number 9 MUST equal 11110 with only pinky folded', () => {
    const gesture9 = GESTURE_BY_NUMBER.get(9);
    expect(gesture9).toBeDefined();
    expect(gesture9?.binaryVector).toBe('11110');
    expect(gesture9?.fingerStates).toEqual({
      thumb: true,
      index: true,
      middle: true,
      ring: true,
      pinky: false,
    });
    // Explicit regression check: Pinky is the only folded finger
    expect(gesture9?.fingerStates.pinky).toBe(false);
    expect(gesture9?.fingerStates.thumb).toBe(true);
    expect(gesture9?.fingerStates.index).toBe(true);
    expect(gesture9?.fingerStates.middle).toBe(true);
    expect(gesture9?.fingerStates.ring).toBe(true);
  });

  it('should bidirectional convert binary string to FingerStates correctly', () => {
    for (const gesture of OFFICIAL_GESTURES) {
      const states = binaryToFingerStates(gesture.binaryVector);
      expect(states).toEqual(gesture.fingerStates);
      expect(fingerStatesToBinary(states)).toBe(gesture.binaryVector);
    }
  });
});
