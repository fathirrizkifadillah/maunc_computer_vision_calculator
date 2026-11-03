import { describe, expect, it, vi } from 'vitest';
import { GestureClassificationResult } from '../types/gesture';
import { GestureStabilizer } from '../lib/vision/gestureStabilizer';

function createMockResult(num: number): GestureClassificationResult {
  return {
    number: num as any,
    binaryVector: '11000',
    fingerStates: { thumb: true, index: true, middle: false, ring: false, pinky: false },
    isAmbiguous: false,
  };
}

describe('GestureStabilizer Logic & Invariants', () => {
  it('should stabilize candidate over duration and commit exactly once', () => {
    const onConfirmed = vi.fn();
    const stabilizer = new GestureStabilizer({
      stabilityDurationMs: 600,
      rearmDurationMs: 300,
      onGestureConfirmed: onConfirmed,
    });

    // Frame 1 at t = 1000ms
    let state = stabilizer.process(createMockResult(7), true, 1000);
    expect(state.candidate).toBe(7);
    expect(state.isStabilizing).toBe(true);
    expect(state.isLocked).toBe(false);
    expect(onConfirmed).not.toHaveBeenCalled();

    // Frame 2 at t = 1300ms (300ms elapsed, 50% progress)
    state = stabilizer.process(createMockResult(7), true, 1300);
    expect(state.candidate).toBe(7);
    expect(state.progress).toBeCloseTo(0.5, 1);
    expect(onConfirmed).not.toHaveBeenCalled();

    // Frame 3 at t = 1650ms (650ms elapsed, > 600ms -> COMMIT)
    state = stabilizer.process(createMockResult(7), true, 1650);
    expect(onConfirmed).toHaveBeenCalledTimes(1);
    expect(onConfirmed).toHaveBeenCalledWith(7);
    expect(state.isLocked).toBe(true);
    expect(state.confirmedNumber).toBe(7);

    // Frame 4 at t = 2000ms (hand still held -> MUST NOT COMMIT AGAIN)
    state = stabilizer.process(createMockResult(7), true, 2000);
    expect(onConfirmed).toHaveBeenCalledTimes(1);
    expect(state.isLocked).toBe(true);
    expect(state.statusMessage).toBe('Turunkan tangan untuk input berikutnya');

    // Hand leaves frame at t = 2200ms (hand absent start)
    state = stabilizer.process(null, false, 2200);
    expect(state.isLocked).toBe(true); // Still waiting for 300ms absence

    // Hand absent reaches 350ms at t = 2550ms -> UNLOCKED (RE-ARMED)
    state = stabilizer.process(null, false, 2550);
    expect(state.isLocked).toBe(false);
    expect(state.candidate).toBeNull();

    // New gesture 3 shown at t = 2600ms
    state = stabilizer.process(createMockResult(3), true, 2600);
    expect(state.candidate).toBe(3);

    // After 650ms at t = 3250ms -> COMMIT gesture 3
    state = stabilizer.process(createMockResult(3), true, 3250);
    expect(onConfirmed).toHaveBeenCalledTimes(2);
    expect(onConfirmed).toHaveBeenLastCalledWith(3);
  });

  it('should reset candidate if gesture flickers or changes before stabilization completes', () => {
    const onConfirmed = vi.fn();
    const stabilizer = new GestureStabilizer({
      stabilityDurationMs: 600,
      rearmDurationMs: 300,
      onGestureConfirmed: onConfirmed,
    });

    // Detect 7 for 200ms
    stabilizer.process(createMockResult(7), true, 1000);
    stabilizer.process(createMockResult(7), true, 1200);

    // Suddenly flickers to 2 at 1250ms
    const state = stabilizer.process(createMockResult(2), true, 1250);
    expect(state.candidate).toBe(2);
    expect(state.progress).toBe(0); // Timer restarted
    expect(onConfirmed).not.toHaveBeenCalled();
  });
});
