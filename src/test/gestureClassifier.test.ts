import { describe, expect, it } from 'vitest';
import { classifyGesture } from '../lib/vision/gestureClassifier';
import { OFFICIAL_GESTURES } from '../lib/vision/gestureConfig';

describe('MAUNC Gesture Classifier', () => {
  it('should accurately classify all 10 official gestures', () => {
    for (const gesture of OFFICIAL_GESTURES) {
      const result = classifyGesture(gesture.fingerStates);
      expect(result.number).toBe(gesture.number);
      expect(result.binaryVector).toBe(gesture.binaryVector);
      expect(result.isAmbiguous).toBe(false);
    }
  });

  it('should reject unsupported finger configurations as null/unknown', () => {
    // 00100 (only middle open - not in official mapping)
    const middleOnly = { thumb: false, index: false, middle: true, ring: false, pinky: false };
    const res1 = classifyGesture(middleOnly);
    expect(res1.number).toBeNull();
    expect(res1.binaryVector).toBe('00100');

    // 00001 (only pinky open - not in official mapping)
    const pinkyOnly = { thumb: false, index: false, middle: false, ring: false, pinky: true };
    const res2 = classifyGesture(pinkyOnly);
    expect(res2.number).toBeNull();
    expect(res2.binaryVector).toBe('00001');

    // 10001 (thumb + pinky "call me" - not in official mapping)
    const shaka = { thumb: true, index: false, middle: false, ring: false, pinky: true };
    const res3 = classifyGesture(shaka);
    expect(res3.number).toBeNull();
    expect(res3.binaryVector).toBe('10001');

    // 01001 ("rock on" - not in official mapping)
    const rock = { thumb: false, index: true, middle: false, ring: false, pinky: true };
    const res4 = classifyGesture(rock);
    expect(res4.number).toBeNull();
    expect(res4.binaryVector).toBe('01001');
  });

  it('should reject gestures when marked as ambiguous', () => {
    // Even if it matches number 7 (11000), if ambiguous flag is set, return null
    const gesture7States = { thumb: true, index: true, middle: false, ring: false, pinky: false };
    const res = classifyGesture(gesture7States, true);
    expect(res.number).toBeNull();
    expect(res.isAmbiguous).toBe(true);
  });
});
