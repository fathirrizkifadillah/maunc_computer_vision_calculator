import { useCallback, useRef, useState } from 'react';
import {
  GestureClassificationResult,
  GestureNumber,
  GestureStabilizationState,
} from '../types/gesture';
import { GestureStabilizer } from '../lib/vision/gestureStabilizer';

export interface UseGestureStabilizationProps {
  stabilityDurationMs?: number;
  rearmDurationMs?: number;
  onGestureConfirmed: (digit: GestureNumber) => void;
}

export interface UseGestureStabilizationReturn {
  state: GestureStabilizationState;
  processGesturePrediction: (
    result: GestureClassificationResult | null,
    isHandPresent: boolean,
  ) => void;
  resetStabilization: () => void;
}

export function useGestureStabilization({
  stabilityDurationMs = 600,
  rearmDurationMs = 300,
  onGestureConfirmed,
}: UseGestureStabilizationProps): UseGestureStabilizationReturn {
  const callbackRef = useRef(onGestureConfirmed);
  callbackRef.current = onGestureConfirmed;

  const stabilizerRef = useRef<GestureStabilizer | null>(null);
  if (!stabilizerRef.current) {
    stabilizerRef.current = new GestureStabilizer({
      stabilityDurationMs,
      rearmDurationMs,
      onGestureConfirmed: (digit) => callbackRef.current(digit),
    });
  }

  const [state, setState] = useState<GestureStabilizationState>(() =>
    stabilizerRef.current!.getState(),
  );

  const processGesturePrediction = useCallback(
    (result: GestureClassificationResult | null, isHandPresent: boolean) => {
      if (!stabilizerRef.current) return;
      const nextState = stabilizerRef.current.process(result, isHandPresent);
      setState(nextState);
    },
    [],
  );

  const resetStabilization = useCallback(() => {
    if (!stabilizerRef.current) return;
    stabilizerRef.current.reset();
    setState(stabilizerRef.current.getState());
  }, []);

  return {
    state,
    processGesturePrediction,
    resetStabilization,
  };
}
